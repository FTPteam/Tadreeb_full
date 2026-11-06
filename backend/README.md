# خادم منصة تدريب (Back-End) — دليل التشغيل والتوثيق البرمجي

منصة «تدريب» لإدارة التدريب الميداني — كلية الدراسات المتوسطة، جامعة الأزهر – غزة (Codemap × Taqat).
تطوير الواجهة الخلفية: **وفاء الحايك ومريم سقا الله**.

مبني باستخدام **Python 3.12+** و **Django 6** و **Django REST Framework (DRF)**، مع توثيق تفاعلي عبر **Swagger / OpenAPI**، وحماية أمنية متقدمة، ودعم كامل للغة العربية ومنطقة غزة الزمنية (`Asia/Gaza`).

---

## 1. التشغيل السريع محلياً (NFR-17: في أقل من 5 دقائق)

### على نظام Windows (PowerShell):
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo       # تعبئة بيانات تجريبية جاهزة للمشروع
python manage.py runserver
```

### على أنظمة Linux / macOS:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo       # تعبئة بيانات تجريبية جاهزة للمشروع
python manage.py runserver
```

الخادم سيعمل على: `http://127.0.0.1:8000/`  
التوثيق التفاعلي للـ APIs (Swagger): `http://127.0.0.1:8000/api/docs/`  
لوحة إدارة جانغو: `http://127.0.0.1:8000/admin/`

---

## 2. الحسابات التجريبية الجاهزة (`seed_demo`)

| الدور | اسم المستخدم | كلمة المرور | الوصف |
|---|---|---|---|
| **مدير النظام (Admin)** | `admin` | `Admin123!` | إدارة المستخدمين، إعدادات النظام، وسجل العمليات |
| **منسق التدريب (Coordinator)** | `demo_coordinator` | `Coord123!` | مراجعة الطلبات، تعيين المشرفين، والاعتماد النهائي |
| **مشرف أكاديمي (Supervisor)** | `demo_supervisor` | `Super123!` | متابعة الطلاب، تقييم التقارير، والزيارات الميدانية |
| **جهة تدريب (Provider)** | `demo_provider` | `Provider123!` | تأكيد الحضور، تقييم المتدربين، ومتابعة السجلات |
| **طالب قيد التدريب (Student)** | `120260010` | `Student123!` | تسجيل اليوميات، رفع التقارير، ومتابعة الحضور |
| **طالب متخرج مستلم شهادة** | `120260013` | `Student123!` | عرض الشهادة برمز QR والتحقق منها |

---

## 3. خريطة الواجهات البرمجية (API Reference)

### أ. المصادقة والأمان وإدارة الحسابات (Accounts & Auth)
* `POST /api/auth/login/`: تسجيل الدخول بالرقم الجامعي أو البريد وكلمة المرور (FR-01). يدعم الإغلاق المؤقت 15 دقيقة بعد 5 محاولات فاشلة (NFR-05).
* `POST /api/auth/refresh/`: تجديد رمز الوصول Access Token (صالح لمدة 30 دقيقة مع تدوير الـ Refresh Token، NFR-05).
* `GET /api/auth/me/`: استرجاع بيانات المستخدم الحالي وصلاحياته ودوره في النظام.
* `POST /api/auth/password-reset/`: طلب رابط استعادة كلمة المرور عبر البريد الإلكتروني (FR-02).
* `POST /api/auth/password-reset/confirm/`: تأكيد وتعيين كلمة المرور الجديدة عبر الرابط المشفر (FR-02).
* `GET /api/users/`: إدارة الحسابات، عرض قائمة المشرفين وإحصائيات طلابهم (FR-03, FR-18).
* `GET / PATCH /api/students/me/`: ملف الطالب الأكاديمي، فحص الأهلية التلقائي (FR-05, FR-06).

### ب. جهات وفرص التدريب والتقديم (Opportunities & Applications)
* `GET /api/opportunities/`: تصفح الفرص التدريبية المتاحة والمقاعد الشاغرة `free_seats` (FR-09, FR-10).
* `GET / POST /api/applications/`: إنشاء الطلب، تحديد 3 رغبات، وإرساله للمراجعة (FR-11, FR-12, BR-03).
* `POST /api/applications/<id>/transition/`: نقل حالة الطلب (قبول، رفض مع ذكر السبب، قيد المراجعة) (FR-13).
* `POST /api/applications/<id>/allocate/`: توزيع الطالب المقبول على فرصة وتحديد مكان التدريب (FR-14).
* `POST /api/applications/<id>/confirm/`: تأكيد جهة التدريب لقبول الطالب وبدء التدريب الفعلي (FR-16).
* `GET /api/placements/<id>/letter/`: إصدار كتاب التوجيه الرسمي بصيغة PDF باللغة العربية (FR-17, NFR-11).

### ج. متابعة التدريب، الحضور، وتنبيه الغياب (Training & Attendance)
* `GET / POST / PATCH / DELETE /api/daily-logs/`: تسجيل الطالب ليوميات التدريب وساعاته المنجزة (FR-20).
* `GET /api/daily-logs/attendance/?application=<id>`: حساب نسبة الحضور وتقويم الدوام التفصيلي يوماً بيوم (FR-21, FR-22).
  * **معادلة الحضور:** $\text{الأيام المؤكدة} \div (\text{أيام العمل من الأحد للخميس حتى أمس} - \text{الإجازات المرضية})$.
  * **الإجازة المرضية:** تُعلم كـ «مرض» وتُستثنى تماماً من المقام والبسط.
  * **التنبيه التلقائي:** إرسال إشعار فوري للطالب ولمشرفه إذا هبط الحضور عن 80%.
* `GET /api/provider-daily-logs/`: استعراض الجهة لسجلات متدربيها للتأكيد (BR-05).
* `POST /api/provider-daily-logs/<id>/confirm/`: تأكيد الجهة لحضور اليوم وإضافة ساعاته لساعات الطالب المعتمدة.
* `POST /api/provider-daily-logs/<id>/excuse/`: تحديد اليوم كإجازة مرضية / غياب بعذر مع تسجيل السبب (FR-22).
* `POST /api/provider-daily-logs/record-absence/`: تسجيل غياب مرضي مباشرة ليوم لم يسجل فيه الطالب (FR-22).
* `GET /api/daily-logs/progress/?application=<id>`: متابعة تقدم الساعات المنجزة والمتبقية ونسبة الإنجاز (BR-06).
* `GET / POST /api/training-plans/`: خطة التدريب الأسبوعية واعتماد المشرف لها (FR-19).
* `GET / POST /api/reports/`: رفع التقارير الدورية (FR-23)، ورصد الدرجات والتعليقات من المشرف الأكاديمي.
* `GET / POST /api/visits/`: تسجيل الزيارات الميدانية للمشرف الأكاديمي مع الملاحظات والتوصيات (FR-24).

### د. التقييمات، الدرجة النهائية، والشهادات (Evaluations & Certificates)
* `GET / POST /api/evaluations/`: تقييم جهة التدريب (40%) وتقييم المشرف الأكاديمي (40%) (FR-25, FR-26).
* `GET /api/evaluations/final-grade/?application=<id>`: احتساب الدرجة النهائية التلقائية: جهة 40% + مشرف 40% + تقارير 20%، ودرجة النجاح 60% (FR-27, BR-04).
* `POST /api/applications/<id>/approve/`: الاعتماد النهائي للمنسق بعد نجاح الطالب، والانتقال لحالة `approved` ثم إصدار الشهادة `certified` (FR-28).
* `GET /api/certificates/`: استعراض الشهادات المعتمدة وتنزيلها بصيغة PDF موثقة برمز QR ورقم تسلسلي فريد (FR-34).
* `GET /api/certificates/verify/<uuid>/`: التحقق العام من الشهادة دون تسجيل دخول، مع حماية الخصوصية وعرض الحد الأدنى من البيانات (FR-35, NFR-19).

### هـ. لوحات التحكم والإحصائيات والتصدير (Dashboards & Analytics)
* `GET /api/stats/`: لوحة معلومات تفاعلية ذكية حسب دور المستخدم المسجل (FR-36):
  * **المشرف الأكاديمي (`supervisor`):** أرقام طلابه حسب الحالة + قائمة مهام بانتظاره (خطط للاعتماد، تقارير للتقييم، استثناءات للقرار، تنبيهات غياب).
  * **جهة التدريب (`provider`):** المتدربون النشطون + قائمة مهام بانتظارها (سجلات يومية للتأكيد، متدربون بانتظار القبول، تقييمات أداء مطلوبة).
  * **المنسق والمدير (`coordinator` / `admin`):** إحصائيات الكلية كاملة، توزيع الأقسام، والمقاعد الشاغرة.
* `GET /api/stats/supervisor/` و `GET /api/stats/provider/`: مسارات مخصصة ومباشرة للوحات المشرف والجهة.
* `GET /api/exports/applications/`: تصدير كشوف المتدربين والدرجات إلى ملف **Excel** (FR-37).
* `GET /api/exports/applications/pdf/`: تصدير تقرير رسمي منسق بجدول A4 بالعربية بصيغة **PDF** (FR-37, NFR-11).
* `GET /api/archive/`: أرشيف الطلبات المنتهية (المعتمدة، المرفوضة، المنسحبة) مع إمكانية البحث والفلترة (FR-39).
* `GET /api/audit-logs/`: سجل العمليات الشامل والرقابي، يوثق كل عملية (من، ماذا، ومتى) لحماية أمن النظام (FR-40).

---

## 4. النسخ الاحتياطي والاسترجاع (NFR-08, NFR-09)

* **أخذ نسخة احتياطية فورية:**
  ```bash
  python manage.py backup_db
  ```
  تُحفظ النسخ تلقائياً في مجلد `backend/backups/` مع الاحتفاظ بآخر 14 نسخة وحذف القديم تلقائياً.

* **استرجاع قاعدة البيانات:**
  ```bash
  python manage.py restore_db ./backups/db-YYYY-MM-DD-HHMMSS.sqlite3 --yes
  ```
  يتم أخذ نسخة أمان قبل الاستبدال للتراجع عند الحاجة.

---

## 5. الاختبارات وضمان الجودة (Tests & Quality Assurance)

تمت تغطية المنصة باختبارات آلية شاملة تزيد عن **340 اختباراً** تفحص جميع المتطلبات الوظيفية وغير الوظيفية:

```bash
# تشغيل كامل الاختبارات
python manage.py test

# فحص صحة مواصفات Swagger / OpenAPI
python manage.py spectacular --validate --fail-on-warn

# فحص الخصوصية الشامل (NFR-18, NFR-19)
python manage.py test config.test_privacy

# فحص الأداء وسرعة الاستجابة (NFR-06, NFR-07)
python manage.py test config.test_performance

# فحص الحضور والتنبيهات (FR-21, FR-22)
python manage.py test training.test_attendance
```
