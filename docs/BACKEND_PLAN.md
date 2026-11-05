# خطة الخادم: الجداول ومين بيبني شو

مبنية على الـ SRS v2.0. الهدف: وفاء ومريم يشتغلوا بنفس الوقت بدون ما حدا يستنى التاني، لأن كل واحدة بتعرف شو الجداول اللي رح تربط فيها.

## الفكرة الأساسية

**الطلب (`Application`) هو ملف الطالب من أول مسودة لحد الشهادة.** دورة حياته بالـ SRS (Section 2.5) بتمشي:
`draft → submitted → under_review → accepted → assigned → in_training → completed → approved → certified`
(وفي `rejected` و `withdrawn`). القواعد مكتوبة بـ `backend/applications/status.py`.

لما الطالب يتوزّع بنعمل **`Placement`** (مكان تدريب فعلي). ليش جدول لحاله؟ لأن FR-30 بيقول لما يغيّر الطالب جهة التدريب، المكان القديم بيتسكّر **وساعاته بتضل محسوبة** (D-12). فالطلب الواحد ممكن يكون إله أكتر من `Placement`، بس واحد بس فعّال (BR-02).

```
accounts.User (student) ── Application ──┬── Preference ×3 ──> providers.Opportunity ──> providers.Provider
                              │          ├── ApplicationDocument
                              │          ├── StatusChange (السجل)
                              │          ├── Placement ──> Opportunity      ← training.DailyLog / Attendance
                              │          ├── ExceptionRequest
                              │          ├── Evaluation ×2 (جهة + مشرف) ──> الدرجة النهائية
                              │          ├── training.Report / Visit / TrainingPlan
                              │          └── certificates.Certificate
                              └── supervisor ──> accounts.User (المشرف الأكاديمي، FR-18)
```

## الجداول

### `providers`: مريم

| الجدول | الحقول | FR |
|---|---|---|
| `Provider` ✅ | موجود، مع `accepted_specializations` (ManyToMany لـ `accounts.Specialization`) | FR-07, 08 |
| `Opportunity` ✅ | `provider`، `specialization` (FK لـ `accounts.Specialization`)، `title`، `description`، `tasks`، `requirements`، `seats`، `start_date`، `end_date`، `location`، `status` (`open` / `closed`) | FR-09, 10 |

**`free_seats()`** ✅ (المقاعد الفاضية = `seats` ناقص عدد الـ `Placement` الفعّالة على الفرصة)، وبتطلع بالـ API كحقل `free_seats`.

### `applications`: وفاء

| الجدول | الحقول | FR / BR |
|---|---|---|
| `Application` ✅ | `student`، `status`، `status_reason` (سبب الرفض / الانسحاب)، `supervisor` (FK لمستخدم دوره supervisor)، `submitted_at`، `created_at`، `updated_at` | FR-11–13, 18 |
| `Preference` ✅ | `application`، `opportunity`، `rank` (1–3) | FR-11، BR-03 (3 رغبات، D-04) |
| `ApplicationDocument` ✅ | `application`، `title`، `file` (PDF/JPG/PNG حتى 5MB) | FR-11، BR-08 |
| `StatusChange` ✅ | `application`، `from_status`، `to_status`، `changed_by`، `reason`، `created_at` | FR-12 (الطالب بيشوف المسار)، FR-40 |
| `Placement` ✅ | `application`، `opportunity`، `start_date`، `end_date`، `provider_confirmed_at`، `closed_at`، `close_reason`، `is_active` | FR-14, 16, 30–32، BR-02 |
| `ExceptionRequest` ✅ | `application`، `kind` (change_provider / withdrawal / extension / issue)، `requested_by`، `reason`، `status` (pending / supervisor_approved / approved / rejected / closed)، `new_opportunity`، `new_end_date`، `decided_by`، `decision_note`، `decided_at` | FR-30–33 |

### `training`: مريم

| الجدول | بيرتبط بـ | FR |
|---|---|---|
| `TrainingPlan` / أهداف أسبوعية ✅ | `Application` | FR-19 |
| `DailyLog` ✅: التاريخ، الساعات، المهام، ملاحظات، `confirmed_at` / `confirmed_by` (هاد هو الحضور، BR-05) | `Application`؛ الجهة بتشوف الأيام اللي ضمن فترة الـ `Placement` تبعها | FR-20–22 |
| `Report` ✅ + تعليق المشرف + **درجة** من 100 (لازمة لـ BR-04، `average_report_grade()`) | `Application` | FR-23 |
| `Visit` ✅ | `Application` | FR-24 |

### `evaluations`: وفاء

| الجدول | الحقول | FR / BR |
|---|---|---|
| `Evaluation` ✅ | `application`، `evaluator`، `kind` (provider / supervisor)، `scores` (كل معيار من 1 لـ 5، نفس معايير صفحة الواجهة)، `notes`، `total` من 100 | FR-25, 26 |
| الدرجة النهائية ✅ | محسوبة بـ `evaluations/grades.py`: جهة 40% + مشرف 40% + تقارير 20%، النجاح 60% (`TADREEB_GRADE_WEIGHTS` و`TADREEB_PASS_GRADE`) | FR-27، BR-04 (D-05) |
| `ProviderRating` ✅ | `application`، `provider`، `rating` (1–5)، `comment` | FR-29 (Could) |

### `certificates` وباقي الإدارة: مريم

| | بيرتبط بـ | FR |
|---|---|---|
| كتاب التوجيه PDF ✅ | `Placement` (لما يصير الطلب `assigned`) | FR-17 |
| `Certificate` ✅: رقم تسلسلي، QR، `issued_at`، `revoked_at` + صفحة تحقق عامة | `Application` (لما يصير `approved`) | FR-34, 35، BR-07 |
| `AuditLog` ✅ | أي عملية | FR-40 |
| لوحات الإحصائيات، التصدير، الأرشيف والبحث ✅ (`analytics`) | كل الجداول | FR-36, 37, 39 |
| استيراد الطلاب من Excel ✅ | `accounts` | FR-03 |

### جاهز ✅

- `accounts`: المستخدمين والأدوار، الأقسام والتخصصات، ملف الطالب، الأهلية (FR-01, 04–06)، استعادة كلمة المرور بالبريد (FR-02)، وقفل المحاولات الفاشلة وجلسات الخمول (NFR-05)
- `notifications`: الإشعارات و `notify()` (FR-38)، أي جزء بيستدعيها لما يصير إشي
- Swagger على `/api/docs/` (NFR-16)

## الترتيب

| | وفاء | مريم |
|---|---|---|
| 1 | ✅ `Application` + `Preference` + `ApplicationDocument` + `StatusChange` | ✅ `Opportunity` + `accepted_specializations` |
| 2 | ✅ المراجعة والتوزيع: `Placement` + `free_seats()`، تعيين المشرف، تأكيد الجهة، الانسحاب + الإشعارات وسجل العمليات | ✅ استيراد Excel (FR-03)، ✅ سجل العمليات (FR-40)، ✅ السجل اليومي (FR-20) |
| 3 | ✅ `ExceptionRequest`: تغيير الجهة، الانسحاب، التمديد، المشاكل | ✅ كتاب التوجيه (FR-17)، تأكيد الحضور من الجهة، `training` (FR-19–24) |
| 4 | ✅ `evaluations` + الدرجة النهائية (بنتها مريم) | ✅ الشهادات، Audit Log، لوحات الإحصائيات والتصدير والأرشيف |

## الحالة الفعلية

- شغل مريم بالخطة كله صار إله models وAPI واختبارات: `training` (FR-19–24، مع تأكيد الحضور من الجهة)، كتاب التوجيه، الشهادات والتحقق العام، الإحصائيات، التصدير بصيغتي Excel وPDF عربي (FR-37)، والأرشيف (FR-39).
- المراجعة والتوزيع (شغل وفاء) على `/api/applications/<id>/…`: `transition`، `allocate`، `assign-supervisor`، `confirm`.
- لما الجهة تأكد قبول الطالب (`confirm`، FR-16) الطلب بينتقل لحاله من `assigned` لـ `in_training`، وهيك الطالب بيقدر يبلش يسجل أيامه (FR-20). بعد تغيير الجهة (FR-30) الطلب أصلًا `in_training` فما بيتغير.
- المنسق بيعتمد التدريب عبر `POST /api/applications/<id>/approve/` (`completed → approved`)، والشهادة بتطلع لحالها والطلب بيصير `certified`. لو ما انعملت الشهادة (مثلًا ما في `Placement`) الاعتماد كله بيرجع وما بيتغير شي. وما بيصير الاعتماد إلا لما تكتمل الدرجة النهائية وتكون ناجحة (BR-04)، وإلا بيرجع خطأ بيقول شو الناقص.
- `DailyLog` لسا مرتبط بـ `Application`. الجهة بتشوف وبتأكد الأيام اللي ضمن فترة توزيعها، فلما تتغير الجهة (FR-30) الأيام القديمة بتضل مع الجهة القديمة بدون ما نغيّر الجدول.
- ملفات الـ PDF بتنعمل بـ ReportLab مع `arabic-reshaper` و`python-bidi`، وخط Amiri (رخصة OFL) موجود بـ `backend/certificates/fonts/`. اسم الجامعة برابط QR بينضبطوا من `.env`: `TADREEB_INSTITUTION_NAME` و`TADREEB_CERTIFICATE_VERIFY_URL`.
- التقييمات (FR-25–29) صارت بـ app اسمه `evaluations`: الجهة والمشرف كل واحد بيقيّم مرة وبيقدر يعدّل لحد الاعتماد، والطالب بيقيّم الجهة بعد ما يخلص. لما تكتمل الدرجات لتدريب `completed` المنسق بيوصله إشعار «تدريب جاهز للاعتماد». الدرجة النهائية كمان بتطلع بملف Excel.
- المستخدمين (FR-03، شغل وفاء) على `/api/users/`: المنسق بيدير الطلاب والمشرفين والجهات، والمدير الكل (الأدوار وكلمات السر). وحساب الجهة بينربط بجهته من نفس الـ endpoint.
- الاستثناءات (FR-30–33، شغل وفاء) على `/api/exception-requests/`: تغيير الجهة، الانسحاب، التمديد، المشاكل (PR #28).
- إكمال التدريب التلقائي (BR-06): **كل قسم إله عدد ساعات خاص فيه** (`Department.required_training_hours`، بينضبط من لوحة الإدارة). لما الجهة تأكد يوم ويوصل مجموع الساعات المؤكدة لساعات قسم الطالب، النظام بينقل الطلب لـ `completed` وببعت إشعار للطالب والمشرف. القسم اللي ما إله رقم بياخد `TADREEB_REQUIRED_TRAINING_HOURS` (240). الطالب بيشوف تقدّمه على `GET /api/daily-logs/progress/?application=<id>`.
- تحقق بتاريخ 01-11-2026: `manage.py check`، `makemigrations --check --dry-run`، `spectacular --validate`، و286 اختبار ناجح.

## قرارات انحسمت

- **FR-22 / BR-05، نسبة الحضور:** الأيام اللي أكدتها الجهة ÷ أيام العمل (الأحد للخميس) من بداية التدريب لحد مبارح. يوم بدون سجل بيتحسب غياب، فما حدا بيقدر يخفي غيابه بإنه ما يسجل.
- **الإجازة المرضية:** الجهة بتعلّم اليوم كيوم بعذر مع السبب، وهاد اليوم **ما بيدخل بالحساب أبدًا** (لا لصالحه ولا ضده). بدها حقل سبب الغياب لليوم.
- **FR-36، لوحة المشرف والجهة:** أرقام **وقائمة مهام**. المشرف: طلابه حسب الحالة، وشو بانتظاره (خطط للاعتماد، تقارير للتقييم، استثناءات للقرار، تنبيهات حضور). الجهة: متدربيها الحاليين، وشو بانتظارها (أيام للتأكيد، طلاب للقبول، تقييمات مطلوبة).

## قرارات لسا مفتوحة (Appendix A)

- **D-01:** عدد الساعات المعتمدة للأهلية (حاليًا 90 بالكود)
- **D-05:** أوزان الدرجة النهائية ودرجة النجاح (حاليًا 40/40/20 والنجاح 60)
- **D-08 / BR-06:** ✅ انحسم إن الساعات حسب القسم. لسا ناقص الأرقام الفعلية لكل قسم، وهل في شرط عدد أسابيع
- **قاعدة البيانات:** الـ SRS بيقول PostgreSQL، بس حساب PythonAnywhere المجاني ما فيه PostgreSQL. حاليًا SQLite وشغالة. للعرض النهائي يا بنضل على SQLite، يا بندفع، يا بننقل لاستضافة تانية.
- **`needs_changes`:** مش بالـ SRS، بس موجودة باتفاق الفريق (TEAM_AGREEMENT). بنضلها؟

## الاستضافة (تقرر)

- **للعرض:** الخادم بيضل على PythonAnywhere المجاني مع SQLite، و **بيانات تجريبية بس** (`seed_demo`)، ممنوع بيانات طلاب حقيقية. بعد العرض الكلية بتقرر الاستضافة الحقيقية، لأنها المسؤولة عن بيانات الطلاب.
- **ما في مهام مجدولة (scheduled tasks)** على الحساب المجاني، فـ **الانتقالات التلقائية لازم تصير لما يصير حدث، مش بوقت محدد:**
  - **اكتمال التدريب (BR-06):** نفحص لما الجهة تأكد يوم بالسجل اليومي. إذا وصلت الساعات للمطلوب: `application.move_to(Status.COMPLETED)`.
  - **بداية التدريب:** الجهة بتعلّم إنه بلّش، أو نفحص التاريخ لما ينفتح الطلب.
  - **تنبيه الحضور تحت 80% (FR-22):** نفحص لما يتأكد يوم.

## قاعدة لما نشتغل بنفس الوقت

قبل ما تبلشي أي جدول بيرتبط بجدول التانية: اتفقوا على **اسم الجدول وأسماء الحقول** من هالملف، ولو تغيّر إشي عدّلوه هون بنفس الـ PR.
