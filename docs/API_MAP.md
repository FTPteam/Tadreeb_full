# خريطة الـ API للواجهة

لحسين ومحمد: كل صفحة بالواجهة، شو الـ endpoint اللي بتحتاجه، وشو أسماء الحقول بالـ API مقابل اللي بالبيانات الوهمية (mock) هلأ.

التفاصيل الكاملة لكل endpoint (كل الحقول، الأمثلة، وتجربة مباشرة) على **Swagger**: `/api/docs/`.

## 1. الأساسيات

### العنوان
| | |
|---|---|
| السيرفر (للعرض) | `https://ftplatform.pythonanywhere.com/api/` |
| على جهازك | `http://127.0.0.1:8000/api/` (شغّل الخادم: `python manage.py runserver` من `backend/`) |

خلّي العنوان بمتغير واحد (مثلًا `VITE_API_URL` بملف `.env` تبع Vite) عشان تبدّلوا بين الاتنين بسهولة.

**CORS:** الخادم بيقبل `http://localhost:5173` و `http://127.0.0.1:5173` (بورت Vite). لما تنشروا الواجهة على رابط، احكولي الرابط عشان أضيفه بـ `DJANGO_CORS_ORIGINS` على السيرفر.

### تسجيل الدخول (JWT)
1. `POST /api/auth/login/` مع `{"username": "120260010", "password": "..."}`، والجواب `{"access": "...", "refresh": "..."}`.
2. كل طلب بعدها بيبعت الهيدر: `Authorization: Bearer <access>`.
3. `GET /api/auth/me/` بيرجع `{id, username, full_name, role}`. حسب `role` بتحوّلوا للصفحات:
   - `student` → `/student/dashboard`
   - `coordinator` و `admin` → `/admin/dashboard`
   - `supervisor` و `provider` → **ما في صفحات إلهم لسا** (شوف القسم 5)
4. الـ `access` بيضل شغال يوم كامل. لما يرجع `401`، ابعتوا `POST /api/auth/refresh/` مع `{"refresh": "..."}` وخدوا `access` جديد، وإذا فشل رجّعوا المستخدم لصفحة الدخول.

### قواعد عامة
- **أسماء الحقول بالـ API بـ `snake_case`** (`start_date` مش `startDate`). الجداول تحت بتبيّن التحويل.
- **القوائم مقسّمة لصفحات (20 بكل صفحة):** الجواب `{"count": 45, "next": "...?page=2", "previous": null, "results": [...]}`. البيانات بـ `results`.
- **التواريخ** `YYYY-MM-DD`، والأوقات ISO (`2026-10-30T09:15:00Z`).
- **الأخطاء** بترجع `400` مع رسائل عربية جاهزة للعرض، بأحد الشكلين:
  - على حقل: `{"hours": ["يجب أن تكون القيمة 12 أو أقل."]}`
  - عامة: `["لا يمكن تعديل الطلب بعد إرساله."]` أو `{"detail": "..."}`
  - `401` = مش مسجّل دخول، `403` = الدور ما إله صلاحية، `404` = مش موجود أو مش من حقه يشوفه.
- **رفع الملفات** (`multipart/form-data`): المستندات، السيرة الذاتية، التقارير. PDF أو JPG أو PNG لحد 5MB.
- **الحالات:** كل حقل حالة إله نسخة للعرض جاهزة بالعربي جنبه (`status` و `status_display`). اعرضوا `_display`، واستخدموا `status` للمنطق والألوان.

### حسابات العرض (بيانات وهمية)
بعد `python manage.py seed_demo` (على جهازك أو السيرفر)، كلمة السر لكل الحسابات `Demo12345!`:

| الحساب | الدور / المرحلة |
|---|---|
| `demo_coordinator` | منسق التدريب |
| `demo_admin` | مدير النظام |
| `demo_supervisor` | مشرف أكاديمي |
| `demo_provider` | حساب «شركة التقنية المتقدمة» |
| `120260001` | طالب: مسودة طلب |
| `120260002` | طالب: طلب مرسل |
| `120260004` | طالب: مقبول، جاهز للتوزيع |
| `120260005` | طالب: مرفوض |
| `120260009` | طالب: موزّع، بانتظار تأكيد الجهة |
| `120260010` | طالب: **في التدريب** (أحسن حساب لتجربة صفحات التدريب) |
| `120260012` | طالب: أنهى الساعات، بانتظار التقييم والاعتماد |
| `120260013` | طالب: **معه شهادة** |
| `120260006` | طالب غير مؤهل (ساعاته ناقصة) |

## 2. أهم كائن: الطلب (`/api/applications/`)

الطلب هو ملف الطالب من المسودة للشهادة، وأغلب صفحات الطالب بتقرأ منه. الطالب عنده طلب مفتوح واحد بس، فـ `GET /api/applications/` بيرجعله قائمة فيها طلبه (أو فاضية).

```json
{
  "id": 7,
  "status": "in_training",
  "status_display": "في التدريب",
  "status_reason": "",
  "student_name": "عمر ناصر",
  "student_university_id": "120260010",
  "supervisor_name": "مشرف أكاديمي",
  "placement": {
    "id": 3, "opportunity_title": "مطور ويب متدرب", "provider_name": "شركة التقنية المتقدمة",
    "start_date": "2026-10-09", "end_date": "2026-12-04", "provider_confirmed_at": "..."
  },
  "preferences": [{"rank": 1, "opportunity": 1, "opportunity_title": "...", "provider_name": "..."}],
  "documents": [{"id": 1, "title": "السيرة الذاتية", "file": "https://..."}],
  "history": [{"from_status": "draft", "to_status": "submitted", "to_status_display": "مرسل", "reason": "", "created_at": "..."}],
  "allowed_actions": ["withdrawn"]
}
```

- **`history`** هو المسار الزمني (timeline) لصفحة حالة الطلب.
- **`placement`** هو مكان التدريب الحالي، و `null` قبل التوزيع.
- **`allowed_actions`**: الحالات اللي المستخدم الحالي بيقدر ينقل الطلب إلها. استخدموها لتظهروا أو تخفوا الأزرار بدل ما تكتبوا القواعد بالواجهة.

**الحالات بالترتيب:** `draft` مسودة ← `submitted` مرسل ← `under_review` قيد المراجعة ← `accepted` مقبول (أو `rejected` مرفوض، أو `needs_changes` بحاجة لتعديل) ← `assigned` موزّع ← `in_training` في التدريب ← `completed` مكتمل ← `approved` معتمد ← `certified` حاصل على الشهادة. وفي `withdrawn` منسحب.

## 3. صفحات الطالب

| الصفحة | الـ API | ملاحظات وتحويل الحقول |
|---|---|---|
| `Login` | `POST /auth/login/` ثم `GET /auth/me/` | شوف القسم 1 |
| `Dashboard` | `GET /applications/`، `GET /daily-logs/progress/?application=<id>`، `GET /notifications/?unread=true` | الحالة من الطلب، والتقدّم بالساعات من `progress` |
| `Profile`، `TrainingProfile` | `GET /students/me/`، `PATCH /students/me/` | الطالب بيعدّل بس `phone` و `email` و `cv`. `full_name`، `university_id`، `department_name`، `specialization_name`، `completed_credit_hours`، `gpa` للقراءة. `eligibility` = `{is_eligible, reasons}` (اعرضوا `reasons` إذا مش مؤهل) |
| `TrainingOpportunities` | `GET /opportunities/` | فلاتر: `?specialization=<id>&location=غزة&start_after=2026-11-01`. الطالب بيشوف بس الفرص المفتوحة لتخصصه، وإذا مش مؤهل بيرجع `403` مع السبب. `field` ← `specialization_name`، `location` ← `location`، `date` ← `start_date`، `hours`: مش موجود (المدة من `start_date` لـ `end_date`) |
| `TrainingDetails`، `TrainingOrganizationDetails` | `GET /opportunities/<id>/`، `GET /providers/<id>/` | `organization` ← `provider_name`، `seats` و `free_seats` (المقاعد الفاضية) |
| `TrainingApplication` | `POST /applications/` مع `{"opportunity_ids": [1, 3]}`، تعديل: `PATCH /applications/<id>/`، إرسال: `POST /applications/<id>/submit/` | لحد 3 فرص بالترتيب (الأولى = الرغبة الأولى). بيانات الطالب (`fullName`، `studentId`، `specialization`…) من `/students/me/` مش من الطلب. التعديل مسموح بس بحالة `draft` أو `needs_changes` |
| `TrainingDocuments` | `POST /application-documents/` (multipart: `application`، `title`، `file`)، `DELETE /application-documents/<id>/` | المستندات الموجودة بـ `application.documents`. المستندات المطلوبة لسا مش محددة بالخادم، فهلأ كلها اختيارية |
| `ApplicationStatus` | `GET /applications/` | المسار من `history`: `date` ← `created_at`، `status` ← `to_status_display`، `action`/`notes` ← `reason`. `responsible` مش موجود |
| `TrainingAccepted` | `GET /applications/` | من `placement`، و `GET /placements/<placement.id>/letter/` بينزّل **كتاب التوجيه PDF** |
| `TrainingPlan` | `GET /training-plans/`، `POST /training-plans/` مع `{"application": 7, "goals": [{"week_number": 1, "goal": "..."}]}`، `PATCH /training-plans/<id>/`، `POST /training-plans/<id>/submit/` | `week` ← `week_number`، `tasks`/`output` ← `goal` (حقل نص واحد لكل أسبوع). المشرف بيعتمد. الحالات: `draft`، `submitted`، `approved` |
| `DailyTrainingLog`، `DailyTrainingLogDetails` | `GET /daily-logs/`، `POST /daily-logs/` مع `{"application": 7, "date": "2026-10-29", "hours": 6, "tasks": "...", "notes": "..."}`، `PATCH`/`DELETE /daily-logs/<id>/` | بس وقت `in_training`، ويوم واحد لكل تاريخ. `task` ← `tasks`، `duration` ← `hours` (رقم ساعات)، `day` بتحسبوه من `date`. `confirmed_at` مش فاضي = الجهة أكدت اليوم، وبعدها ما بيتعدّل |
| `Attendance` | `GET /daily-logs/` | ⚠️ **ما في endpoint للحضور لسا** (القسم 6). مؤقتًا: يوم إله سجل مؤكد = حاضر |
| `Reports` | `GET /reports/`، `POST /reports/` (multipart: `application`، `title`، `file`، `notes`)، `DELETE /reports/<id>/` | `grade` و `supervisor_comment` بيعبّيهم المشرف |
| `Evaluation` | `GET /evaluations/`، `GET /evaluations/final-grade/?application=<id>`، `POST /provider-ratings/` مع `{"application": 7, "rating": 5, "comment": "..."}` | الطالب بيشوف تقييم الجهة والمشرف: `scores` = `{"attendance": 5, ...}`، و `total` من 100. أسماء المعايير بالعربي من `GET /evaluations/criteria/`. الدرجة النهائية: `{provider, supervisor, reports, total, passed, missing}`. تقييم الطالب للجهة مرة وحدة بعد ما يخلص |
| `FinishTraining` | `GET /daily-logs/progress/?application=<id>` | `{confirmed_hours, required_hours, remaining_hours, percent}`. النظام بينقل الطلب لـ `completed` لحاله لما تكتمل الساعات المؤكدة |
| `Certificate` | `GET /certificates/`، `GET /certificates/<id>/pdf/` | الـ PDF فيه QR. صفحة التحقق العامة (بدون دخول): `GET /certificates/verify/<verification_code>/` |
| `Notifications` | `GET /notifications/`، `POST /notifications/<id>/read/`، `POST /notifications/read-all/`، `GET /notifications/unread-count/` | `description` ← `message`، `unread` ← `!is_read`، `time` ← `created_at`. `kind` (`application`، `training`، `report`، `announcement`) لاختيار الأيقونة |
| طلب استثناء (ما إله صفحة طالب لسا) | `POST /exception-requests/` مع `{"application": 7, "kind": "withdrawal", "reason": "..."}` | الطالب بيقدّم `change_provider` (وممكن `new_opportunity`)، `withdrawal`، `issue` |

## 4. صفحات الإدارة (المنسق والمدير)

المدير (`admin`) بيقرأ أغلب الشي بس ما بيعمل إجراءات التدريب، والمنسق (`coordinator`) هو اللي بيشتغل.

| الصفحة | الـ API | ملاحظات وتحويل الحقول |
|---|---|---|
| `Dashboard` | `GET /stats/` | أرقام جاهزة: `students`، `applications` (حسب الحالة)، `providers`، `opportunities`، `placements`، `training`، `reports`، `certificates`، `by_department`، `by_provider`. نفس الفلاتر تبع الأرشيف |
| `TrainingRequests` | `GET /applications/?status=submitted` | المنسق بيشوف كل الطلبات المرسلة (مش المسودات). `student` ← `student_name`، `studentId` ← `student_university_id`، `date` ← `submitted_at`، `organization` ← `preferences[0].provider_name` |
| `TrainingRequestDetails` | `GET /applications/<id>/`، `POST /applications/<id>/assign-supervisor/` مع `{"supervisor": 4}`، `POST /applications/<id>/transition/` مع `{"status": "accepted", "reason": ""}` | `transition` بيقبل: `under_review`، `accepted`، `rejected` (لازم `reason`)، `needs_changes`، `withdrawn` (لازم `reason`). ⚠️ لاختيار المشرف بدكم قائمة مشرفين، وما في endpoint إلها لسا (القسم 6) |
| `StudentDistribution`، `StudentDistributionProcess` | `GET /applications/?status=accepted`، `GET /opportunities/` (فيها `free_seats`)، `POST /applications/<id>/allocate/` مع `{"opportunity": 3}` | الفرصة لازم تكون مفتوحة، لتخصص الطالب، وفيها مقعد فاضي، والطالب إله مشرف. `preference` ← `preferences` (مرتبة بـ `rank`) |
| `Students` | `GET /students/`، `GET`/`PATCH /students/<id>/` | فلاتر: `?search=&department=&specialization=&academic_status=`. `name` ← `full_name`، `studentId` ← `university_id`، `level`: مش موجود. استيراد Excel: `POST /imports/students/` (multipart `file`، ومع `?dry_run=1` للتجربة بدون حفظ)، والقالب `GET /imports/students/template/` |
| `TrainingOrganizations`، `AddTrainingOrganization`، `TrainingOrganizationDetails` | `GET`/`POST /providers/`، `GET`/`PATCH /providers/<id>/` | `field` ← `sector`، `region` ← `city`، `contactPerson` ← `contact_name`، `phone` ← `contact_phone`، `email` ← `contact_email`، `specializations` ← `accepted_specializations` (أرقام) و `accepted_specialization_names`. `website` و `rating` مش موجودين (التقييمات من `/provider-ratings/`) |
| `TrainingOpportunities`، `AddTrainingOpportunity`، `TrainingOpportunityDetails` | `GET`/`POST /opportunities/`، `GET`/`PATCH`/`DELETE /opportunities/<id>/` | `organization` ← `provider` (رقم) و `provider_name`، `startDate` ← `start_date`، `endDate` ← `end_date`، `studentsCount` ← `seats`، `students` ← `seats - free_seats`. `status`: `open`/`closed`. التخصصات من `GET /departments/` |
| `Supervisors`، `AddSupervisor`، `SupervisorDetails` | ⚠️ ما في endpoint (القسم 6) | طلاب مشرف معيّن: `GET /applications/` كمشرف، أو فلترة `supervisor` بالواجهة |
| `Visits`، `AddVisit` | `GET /visits/`، `POST /visits/` مع `{"application": 7, "date": "...", "notes": "...", "follow_up": "..."}` | **المشرف بس بيسجّل زيارة** لطلابه (FR-24). `visitDate` ← `date`، `actionTaken` ← `follow_up`. `visitTime`، `hasProblem`، `followType` مش موجودين (المشكلة بتنعمل كطلب استثناء `issue`) |
| `Evaluations`، `StudentEvaluation` | `GET /evaluations/`، `GET /evaluations/criteria/`، `POST /evaluations/` مع `{"application": 7, "scores": {...}, "notes": ""}`، `PATCH /evaluations/<id>/`، `GET /evaluations/final-grade/?application=<id>` | **مفاتيح المعايير نفسها اللي بـ `StudentEvaluation.jsx`** (`attendance`، `punctuality`، `tasks`، `technical`، `communication`، `teamwork`، `responsibility` للجهة، و `commitment`، `benefit`، `development`، `reports`، `goals` للمشرف). كل معيار من 1 لـ 5. نوع التقييم من دور المستخدم: **الجهة والمشرف بس بيقيّموا**، المنسق بيشوف |
| `Approvals`، `ApprovalDetails`، `FinalReportApproval` | `GET /applications/?status=completed`، `GET /evaluations/final-grade/?application=<id>`، `POST /applications/<id>/approve/` | الاعتماد بيرفض إذا الدرجات ناقصة (بيقول شو الناقص) أو الطالب راسب. بعد الاعتماد الشهادة بتطلع لحالها والطلب بيصير `certified` |
| `Certificates`، `IssueCertificate` | `GET /certificates/`، `GET /certificates/<id>/pdf/`، `POST /certificates/<id>/revoke/` مع `{"reason": "..."}` | الشهادة بتنعمل لحالها مع الاعتماد. `certificateNumber` ← `serial_number`، `studentName` ← `student_name`، `organization` ← `provider_name`، `issueDate` ← `issued_at`، `status` ← `is_valid`. الدرجة النهائية من `final-grade` |
| `Exceptions` | `GET /exception-requests/?status=&kind=`، `POST /exception-requests/<id>/approve/` مع `{"note": "", "opportunity": 5}`، `POST .../reject/` مع `{"note": "..."}` | الأنواع: `change_provider` تغيير جهة، `withdrawal` انسحاب، `extension` تمديد (مع `new_end_date`)، `issue` مشكلة. تغيير الجهة: المشرف بيوافق أول (`supervisor_approved`) وبعدين **المنسق بيأكد ويختار الفرصة**. باقي الأنواع قرارها للمشرف. أنواع الصفحة الإضافية («انقطاع التدريب»، «رفض الجهة للطالب») بتنعمل `issue` أو `withdrawal` |
| `FileArchive`، `AdvancedSearch` | `GET /archive/` | فلاتر: `?search=&status=&department=&provider=&year=`. كل صف: الطالب، الحالة، الجهة، الساعات المؤكدة، رقم الشهادة |
| `Reports`، `CustomReport` | `GET /stats/`، `GET /exports/applications/` | `exports` بينزّل ملف **Excel** بنفس الفلاتر (فيه الدرجة النهائية) |
| `Users`، `Permissions` | `GET /audit-logs/` لسجل العمليات (المدير بس) | فلاتر: `?action=&actor=&target_type=&from=&to=`. ⚠️ قائمة المستخدمين وإنشاءهم: ما في endpoint (القسم 6) |
| `Announcements` | ⚠️ ما في endpoint (القسم 6) | |
| صفحات الدورات (`Course*`) | ما في API | المرحلة التانية (D-13): بالعرض «قريبًا» بس |

## 5. صفحات ناقصة بالواجهة: المشرف والجهة

الخادم جاهز لدورين ما إلهم صفحات بالواجهة:

**المشرف الأكاديمي (`supervisor`)** بيشوف بس الطلاب المعيّن عليهم:
- مراجعة الطلبات وقبولها: `POST /applications/<id>/transition/`، والتوزيع: `POST /applications/<id>/allocate/`
- اعتماد خطة التدريب: `POST /training-plans/<id>/approve/`
- الزيارات: `POST /visits/`
- تقييم التقارير: `POST /reports/<id>/grade/` مع `{"grade": 85, "supervisor_comment": "..."}`
- تقييم الطالب: `POST /evaluations/`
- قرارات الاستثناءات: `approve`، `reject`، `close` بـ `/exception-requests/<id>/...`، وطلب تمديد: `POST /exception-requests/` مع `kind: "extension"` و `new_end_date`

**جهة التدريب (`provider`)** بتشوف بس الطلاب الموزّعين عليها حاليًا:
- تأكيد قبول الطالب: `POST /applications/<id>/confirm/` (بيبلّش التدريب)
- أيام السجل اليومي وتأكيدها: `GET /provider-daily-logs/`، `POST /provider-daily-logs/<id>/confirm/`
- فرصها: `GET`/`POST /opportunities/`
- تقييم الطالب: `POST /evaluations/`
- الإبلاغ عن مشكلة: `POST /exception-requests/` مع `kind: "issue"`

**اقتراح:** بدل صفحات جديدة كاملة، نستخدم تصميم صفحات الإدارة ونعرض الأزرار حسب `role` من `/auth/me/` و `allowed_actions`. بنقرر مع بعض.

## 6. لسا ناقص بالخادم

| الشي | الصفحات | مين |
|---|---|---|
| قائمة المستخدمين والمشرفين، وإضافتهم | `Supervisors`، `AddSupervisor`، `Users`، اختيار المشرف بـ `TrainingRequestDetails` | وفاء |
| نسبة الحضور والتنبيه تحت 80% (FR-22، BR-05) | `Attendance` | مريم |
| الإعلانات | `Announcements` | بنقرر إذا لازمة للعرض |

إذا لقيتوا حقل بدكم إياه ومش موجود، احكولنا وما تخترعوه بالواجهة.
