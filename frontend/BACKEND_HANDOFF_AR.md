# Tadreeb — اتفاق ربط Frontend مع Backend

**القاعدة:** Backend هو مصدر الحقيقة الوحيد، والواجهة لا تقرر الاعتماد أو تحسب الساعات النهائية أو تصدر الشهادات. نستبدل استدعاءات خدمات `src/services/*` وملفات `*Store.js` بمستودعات API دون إعادة تصميم الصفحات.

## الكيانات الأساسية

| الكيان | أهم الحقول |
|---|---|
| User | id, role, email, passwordHash (خادم فقط), status |
| Student | id, userId, universityNumber, fullName, programId |
| Organization | id, name, email, status (`pending/approved/rejected/suspended`) |
| Opportunity | id, organizationId, title, programId, requiredHours, capacity, startDate, endDate, deadline, status |
| Application | id, studentId, opportunityId, providerDecision, academicDecision, status, createdAt |
| Placement | id, applicationId, studentId, organizationId, opportunityId, fieldSupervisorId, academicSupervisorId, status, requiredHours, startDate, endDate |
| Attendance | id, placementId, date, status (`present/late/absent`), checkIn, checkOut, approvedHours, recordedBy |
| DailyLog | id, placementId, date, tasks[], learning?, challenges?, status (`draft/pending/revision/approved`), reviewNote?, reviewedBy? |
| Evaluation | id, placementId, evaluatorId, type, scores, status |
| TrainingReport | id, placementId, type, status, fileId, reviewerId |
| Certificate | id, placementId, serialNumber, issuedAt, fileId |

## واجهات API المقترحة (تحتاج اتفاقًا مع مطور الخادم)

- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `POST /api/organizations/register`, `GET /api/admin/organizations?status=pending`, `PATCH /api/admin/organizations/:id/decision`
- `GET /api/opportunities`, `POST /api/provider/opportunities`, `PATCH /api/provider/opportunities/:id`
- `POST /api/student/applications`, `GET /api/student/applications`, `GET /api/provider/applications`, `GET /api/admin/applications`
- `PATCH /api/provider/applications/:id/decision`, `PATCH /api/admin/applications/:id/decision`
- `GET /api/student/placement`, `GET /api/provider/placements`, `GET /api/admin/placements`
- `GET /api/placements/:id/attendance`, `PUT /api/provider/placements/:id/attendance/:date`
- `GET /api/placements/:id/daily-logs`, `PUT /api/student/placements/:id/daily-logs/:date`, `PATCH /api/provider/daily-logs/:id/review`
- `GET/POST /api/placements/:id/evaluations`, `GET/POST /api/placements/:id/reports`
- `POST /api/admin/placements/:id/complete`, `POST /api/admin/placements/:id/certificate`

## قواعد العمل الواجب أن يفرضها الخادم

1. **الجهة:** الحالة `approved` شرط نشر الفرصة واستقبال الطلبات؛ جهة التدريب لا تعتمد نفسها.
2. **التقديم:** الطالب وحده ينشئ طلبه؛ يمكنه عدة طلبات معلقة، لكن لا يجوز طلب جديد عند وجود تدريب فعّال وفق سياسة القسم.
3. **الموافقتان:** قرار الجهة وقرار الإدارة مستقلان. `accepted` النهائي يتطلب كليهما؛ أي رفض يجعل الطلب مرفوضًا.
4. **الانتقال:** إنشاء `Placement` بعد الموافقتين فقط، مرة واحدة (Unique على `applicationId`)، مع فحص ذرّي لعدم وجود تدريب فعّال آخر للطالب.
5. **البدء:** `accepted` لا يساوي `active`. حالة `not_started` تتحول إلى `active` بإجراء محدد عند البدء، و`completed` يحتاج موافقة الإنهاء.
6. **الحضور:** يوم واحد/تدريب واحد `UNIQUE(placementId,date)`؛ الغياب صفر ساعة، لا ساعات سالبة، ولا إضافة زمن عند إعادة التعديل؛ الساعات الإجمالية `SUM(approvedHours)` من سجلات الحضور فقط.
7. **السجل اليومي:** يوم واحد/تدريب واحد، عدة مهام، لا يمكن تعديل `pending/approved` من الطالب؛ الإعادة مع سبب، والاعتماد لا يزيد الساعات.
8. **التقييم والشهادة:** صلاحيات واضحة وإصدار الشهادة بعد استكمال الشروط وقرار الإدارة.
9. **الصلاحيات:** الاستعلامات مُفلترة بالخادم بناءً على `userId`, `organizationId` و`studentId` الفعلي من جلسة آمنة؛ لا تُقبل هوية منقولة من Body على أنها مصدّقة.
10. **التدقيق:** سجل تغييرات موافقات، مراجعات، حضور، تقييمات وشهادات (الفاعل، الوقت، الحقول قبل/بعد). منع التكرارات بالتعامل الآمن مع طلبات الشبكة المتزامنة.

## مثال استجابة لسجل تدريب (مقترح)

```json
{
  "id": "plc_001",
  "studentId": "student_001",
  "organizationId": "org_001",
  "opportunityId": "opp_001",
  "status": "active",
  "requiredHours": 120,
  "completedHours": 36,
  "startDate": "2026-11-01",
  "endDate": "2027-01-15"
}
```

> الحقول والأسماء أعلاه **عقد تصميم مقترح** وليست API موجودة في المشروع. يجب الاتفاق على الاستجابات، معالجة الأخطاء، Pagination، تنسيقات التواريخ، وتوكنات الجلسة قبل التنفيذ.

## التسلسل الأمثل لربط الخادم

1. مصادقة وصلاحيات وتسجيل الجهات.
2. الجهات والفرص والطلبات مع الموافقتين ومنع تعدد التدريب.
3. ملف التدريب الموحد والحضور والساعات.
4. السجلات اليومية وملاحظات المراجعة.
5. التقييمات والتقارير والإنهاء والشهادات.
6. إحصائيات وإشعارات مبنية على البيانات الحقيقية فقط.

**قبل الدمج:** يتم إيقاف البيانات النموذجية `seeded` في بيئة الإنتاج، وتنقل بيانات الـDemo إلى fixtures منفصلة لا تصل إليها بيئة الإنتاج.
