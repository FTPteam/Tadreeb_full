# Tadreeb backend: context for an AI assistant

> **How to use this file:** copy everything below the line into a new chat with any AI assistant (ChatGPT, Gemini, Claude…), then ask for one task at a time. When you ask about an existing file, paste that file's current content too, because the AI can't see the repository.
>
> Last updated: 2026-11-01 (after PR #36 and pdf-export).

---

## Who I am and how I want you to help

I'm Maryam, one of two back-end developers on **Tadreeb**, a graduation project at the College of Intermediate Studies, Al-Azhar University – Gaza. I'm **learning Django while building**. I write code by copying what you give me into my project, so please:

1. **Explain in Arabic (Levantine is fine), step by step**: what each file does, what each new concept means, and why we do it this way. Keep code, comments and identifiers in English.
2. Give **complete files or clearly marked changes** ("add this after line X in `providers/views.py`"), never "…rest of the code…".
3. **Follow the existing conventions below exactly**, so my code matches the rest of the project.
4. **Always include tests**, and tell me which commands to run to check everything works.
5. If a task touches an app that belongs to my teammate Wafaa (list below), **stop and tell me to coordinate with her** instead of changing it.
6. If the SRS or this file doesn't decide something, **ask me** instead of guessing.

## The project in one paragraph

Tadreeb moves the college's field-training process online: a student checks eligibility, applies for training opportunities, gets allocated to a provider, logs training days, submits reports, gets evaluated, and receives a certificate with a QR code that anyone can verify. The requirements are in the SRS (v2.0): **FR-xx** are functional requirements, **BR-xx** business rules, **NFR-xx** non-functional requirements, **D-xx** open team decisions.

## Stack and how to run it

- **Python 3.13**, **Django 6.1**, **Django REST Framework 3.18**, **Simple JWT** (login tokens), **drf-spectacular** (Swagger docs), **django-cors-headers**, **python-dotenv**, **openpyxl** (Excel).
- Database: **SQLite** (locally and on the server for now).
- Front-end: React + Vite (separate team), calling the API with `Authorization: Bearer <token>`.
- Deployed on **PythonAnywhere**: `https://ftplatform.pythonanywhere.com`. API docs: `/api/docs/`.
- Code on GitHub: `wafaa-alhayek/Tadreeb_full`, back-end in `backend/`.

Run locally (Windows PowerShell, from `backend/`):
```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo        # demo data, plus one student at each lifecycle stage (imports/demo_lifecycle.py)
python manage.py runserver        # then open http://127.0.0.1:8000/api/docs/
python manage.py test             # run all tests
```

## Repository layout (`backend/`)

| App | Covers | Owner |
|---|---|---|
| `config/` | settings, main `urls.py` (router) | shared |
| `accounts` | `User` with 5 roles, `Department`, `Specialization`, `StudentProfile`, eligibility (BR-01), permission classes | Wafaa |
| `providers` | `Provider`, `Opportunity` (FR-07–10) | **Maryam** |
| `applications` | `Application`, `Preference`, `ApplicationDocument`, `StatusChange`, the status engine (`status.py`), `Placement`, review and allocation (`workflow.py`), `ExceptionRequest` (`exceptions.py`) | Wafaa |
| `notifications` | `Notification` + `notify()` (FR-38) | Wafaa |
| `imports` | Excel student import (FR-03), `seed_demo` command | **Maryam** |
| `audit` | `AuditLog`, `AuditMixin`, `log_action()` (FR-40) | **Maryam** |
| `training` | `DailyLog` (FR-20), training plan (FR-19), attendance (FR-21, 22), reports (FR-23), visits (FR-24) | **Maryam** |
| `evaluations` | evaluations, final grade, provider ratings (FR-25–29) | Wafaa (built by Maryam) |
| `certificates` | certificate PDF, QR, verification, guidance letter (FR-17, 34, 35) | **Maryam** |
| `analytics` | statistics dashboard (FR-36), Excel & PDF export (FR-37), archive (FR-39) | **Maryam** |

## Conventions (follow these exactly)

**Language**
- Code, identifiers and comments in **English**. **Messages shown to users** (validation errors, `verbose_name`, choice labels) in **Arabic**.
- Docstrings mention the requirement: `"""FR-20 / BR-05: one training day written by the student…"""`.

**API shape** (from `docs/TEAM_AGREEMENT.md`)
- URLs: plural English nouns under `/api/`, e.g. `/api/daily-logs/`. Field names in **snake_case**. Dates `YYYY-MM-DD`.
- Errors: DRF's default shape, `{"detail": "..."}` or `{"field": ["..."]}`. Raise `serializers.ValidationError("رسالة بالعربي")`.
- Lists are paginated, 20 per page: `{"count", "next", "previous", "results"}` (set globally).
- Every endpoint requires login by default (`IsAuthenticated` is the global default).

**Permissions** (`accounts/permissions.py`). Use these, don't invent new checks:
```python
from accounts.permissions import HasRole, IsStudent, IsSupervisor, IsProvider, IsCoordinator, IsStaffRole
# IsCoordinator = coordinator + admin; IsStaffRole = supervisor + coordinator + admin
class CanPublishOpportunities(HasRole):          # custom combination
    roles = (User.Role.PROVIDER, User.Role.COORDINATOR, User.Role.ADMIN)
```
Roles: `User.Role.STUDENT`, `SUPERVISOR`, `PROVIDER`, `COORDINATOR`, `ADMIN`.
A provider user reaches its provider through `request.user.provider_profile`.

**Privacy (NFR-18)**: filter `get_queryset()` by the logged-in user, so others' records give 404:
```python
def get_queryset(self):
    if getattr(self, "swagger_fake_view", False):   # Swagger builds docs with no user
        return DailyLog.objects.none()
    return DailyLog.objects.filter(application__student=self.request.user)
```

**Swagger (NFR-16)**: every endpoint must appear with its fields. Function views and custom `@action`s need `@extend_schema(request=..., responses=...)`. After changes run `python manage.py spectacular --validate --file schema.yml`; it should report 0 errors and 0 warnings.

**Audit log (FR-40)**: important create/update/delete operations must be logged.
- For a `ModelViewSet`: `class MyViewSet(AuditMixin, viewsets.ModelViewSet)`, and if you override saving, call `self.save_with_log(serializer, **extra)` instead of `serializer.save(**extra)`.
- Anything else: `log_action(request, AuditLog.Action.UPDATE, instance, changes)` from `audit.models`.

**Notifications (FR-38)**: to tell someone about something, call:
```python
from notifications.models import Notification, notify
notify(user, Notification.Kind.TRAINING, "عنوان الإشعار", "نص الإشعار")
# kinds: APPLICATION, TRAINING, REPORT, ANNOUNCEMENT
```

**Application status (SRS 2.5)**: never set `application.status = ...` directly. Use:
```python
from applications.status import Status, TransitionError
application.move_to(Status.COMPLETED)              # user=None means "the system did it"
application.move_to(Status.WITHDRAWN, request.user, reason="...")
```
`move_to` checks the rules in `applications/status.py`, saves, and records a `StatusChange`. It raises `TransitionError` (turn it into `serializers.ValidationError(str(error))`).
Statuses: `draft → submitted → under_review → accepted → assigned → in_training → completed → approved → certified`, plus `needs_changes`, `rejected`, `withdrawn`.

**Uploaded files (BR-08)**: PDF/JPG/PNG up to 5 MB. Use the existing validator:
```python
from accounts.validators import validate_upload
file = models.FileField(upload_to="reports/", validators=[validate_upload])
```

**Business-rule numbers** live in `config/settings.py` as `TADREEB_*` (e.g. `TADREEB_MIN_CREDIT_HOURS = 90`, `TADREEB_MAX_PREFERENCES = 3`). Add new ones there (e.g. attendance threshold 80%) with a comment naming the BR / D number.

**Tests**: `rest_framework.test.APITestCase`, log in with `self.client.force_authenticate(user)`, one test per rule, including **forbidden** cases (wrong role → 403, someone else's record → 404, invalid data → 400). File uploads: `SimpleUploadedFile` and `@override_settings(MEDIA_ROOT=tempfile.mkdtemp())`.

**New packages**: install inside the venv, then update `requirements.txt` with `pip freeze > requirements.txt` (venv active). Never freeze from a Python outside the venv.

**Git workflow** (`docs/GIT_GUIDE.md`):
```bash
git checkout main && git pull            # always start from the latest main
git checkout -b short-task-name
# ...work, test...
git status                               # check exactly what will be committed
git add <files> && git commit -m "..."
git push -u origin short-task-name       # then open a Pull Request into main
```
Never commit directly to `main`. Never commit `.env`, `db.sqlite3`, `venv/` or `media/`.

## What exists today (main, after PR #23)

**Models**
- `accounts.User(role)`, `Department(name)`, `Specialization(department, name)`, `StudentProfile(user, department, specialization, completed_credit_hours, gpa, academic_status, phone, cv)`.
- `providers.Provider(name, sector, city, address, contact_name, contact_phone, contact_email, capacity, accepted_specializations M2M, status approved/suspended, user → provider_profile)`.
- `providers.Opportunity(provider, specialization, title, description, tasks, requirements, seats, start_date, end_date, location, status open/closed)`.
- `applications.Application(student, status, status_reason, supervisor, submitted_at)`, `Preference(application, opportunity, rank)`, `ApplicationDocument(application, title, file)`, `StatusChange(application, from_status, to_status, changed_by, reason)`.
- `notifications.Notification(recipient, kind, title, message, is_read)`.
- `audit.AuditLog(actor, action, target_type, target_id, target_repr, changes, ip_address)`.
- `training.DailyLog(application, date, hours, tasks, notes, confirmed_at, confirmed_by)`, one per application per day.

**Endpoints**: `/api/auth/login/`, `/api/auth/refresh/`, `/api/auth/me/`, `/api/students/`, `/api/students/me/`, `/api/departments/`, `/api/providers/`, `/api/opportunities/`, `/api/applications/` (+ `/submit/`), `/api/application-documents/`, `/api/notifications/`, `/api/imports/students/` (+ `/template/`), `/api/audit-logs/`, `/api/daily-logs/`.

## Permission matrix (SRS 2.2)

✓ = can do, ◐ = only their own / assigned records, – = no access

| Action | Student | Supervisor | Provider | Coordinator | Admin |
|---|---|---|---|---|---|
| View / edit student profile | ◐ | ◐ | ◐ | ✓ | ✓ |
| Manage providers | – | – | ◐ | ✓ | ✓ |
| Create opportunities | – | – | ◐ | ✓ | ✓ |
| Apply for an opportunity | ◐ | – | – | – | – |
| Review and allocate applications | – | ◐ | – | ✓ | – |
| Fill daily log / upload reports | ◐ | – | – | – | – |
| Confirm attendance | – | – | ◐ | – | – |
| Record field visits | – | ◐ | – | – | – |
| Evaluate a student | – | ◐ | ◐ | – | – |
| Final approval and certificate | – | – | – | ✓ | – |
| Dashboards and exports | – | ◐ | ◐ | ✓ | ✓ |
| Manage users and roles; view audit log | – | – | – | – | ✓ |

## My remaining tasks (in suggested order)

**1. Attendance (FR-21, FR-22, BR-05)**: `training` app.
- BR-05: "Attendance is recorded by the provider confirming each daily log entry [manual, QR later]. Alert when attendance drops below [80%]."
- Provider endpoint to confirm a day: set `confirmed_at` and `confirmed_by`. Only the provider of that student's placement may do it (◐). Confirmed days can't be edited by the student (already enforced).
- Attendance percentage per application, plus a per-day list for the student's calendar page (`frontend/src/pages/student/Attendance.jsx` shows a monthly calendar, a percentage, and rows with status حاضر / غائب / مرض). Proposed mapping: present = confirmed log; absent = working day with no confirmed log; sick/excused needs an `absence_reason` field. Agree the definition of "working day" with the team first.
- FR-22: when attendance drops below `TADREEB_ATTENDANCE_ALERT` (80%), `notify()` the student and the supervisor (`application.supervisor`).
- **The provider of a student:** `application.active_placement.provider` (its login is `provider.user`). So a provider may confirm a day only if `request.user == application.active_placement.provider.user`. `active_placement` is `None` before allocation and after withdrawal.

**2. Reports (FR-23)**: `training` app.
- "Let students upload periodic reports and let supervisors comment on them." `Report(application, title, file, submitted_at, supervisor_comment, grade)`. The **grade** is needed for the final grade: BR-04 = provider 40% + supervisor 40% + **reports 20%**.
- Students upload only while `in_training`. Only the application's supervisor comments and grades. `notify()` the supervisor on upload and the student on comment.

**3. Training plan (FR-19, Should)**: "Let the student (with the provider) enter a training plan of weekly goals, which the supervisor approves."

**4. Field visits (FR-24, Should)**: "Let supervisors record field visits: date, notes, follow-up actions." Supervisor of that application only.

**5. Assignment letter PDF (FR-17, Must)**: "Generate an assignment letter as a PDF once allocation is final." Arabic, RTL (NFR-11). Library: ReportLab or WeasyPrint (SRS 1.7). Hook it into `allocate()` in `applications/workflow.py`, through `notify_new_placement(placement)`, which runs for a first allocation and for a change of provider. `placement` has the opportunity, provider and dates.

**6. Certificates (FR-34, FR-35, BR-07, NFR-19)**: new `certificates` app.
- "Issue a certificate PDF with a unique serial number and a QR code once training is approved." Library `qrcode`.
- Public verification page **without login** (`AllowAny`), reached by the QR code, showing **only** name, provider, dates and validity (NFR-19).
- BR-07: "A certificate is issued only after final approval, and can be revoked by the coordinator (the verification page then shows it as revoked)."
- After issuing, move the application with `application.move_to(Status.CERTIFIED)` (system move).

**7. Dashboards, exports, archive (FR-36, FR-37, FR-39, Should)**
- FR-36: dashboard per role (e.g. coordinator: students placed, in training, completed, providers active, average grade).
- FR-37: export lists and reports to Excel (`openpyxl`, already installed) and PDF. NFR-07: up to 1,000 records in under 10 seconds.
- FR-39: archive uploaded files and search across students, applications and providers.

## Wafaa's part (don't build these)

Done: review and allocation (FR-13, FR-14, FR-18), `Placement` (one active per student, BR-02) and `Opportunity.free_seats()`, provider confirmation of an allocated student (FR-16), exceptions (FR-30–33: change of provider, withdrawal, extension, issues at `/api/exception-requests/`). Next: evaluations and the final grade (FR-25–29). Ask her before changing `accounts`, `applications`, `notifications` or `config/urls.py` beyond registering your own routes.

## Open points to coordinate

- **`DailyLog` links to `Application`.** The plan suggested linking it to `Placement`, so hours from an old provider stay separate after a provider change (FR-30, D-12). `Placement` exists now. Suggestion: add a nullable `placement` field to `DailyLog`, filled from `application.active_placement` when the student writes the day. A change of provider closes the old placement and opens a new one (`workflow.change_provider`), so hours per provider stay separate.
- **Who moves `in_training → completed`?** It's a system move when BR-06 is met ("Training is complete after [N] hours over at least [N] weeks", D-08). Decided: the hours are per department, `Department.required_training_hours`, falling back to `TADREEB_REQUIRED_TRAINING_HOURS`. The hours come from your daily logs; the move uses `application.move_to(Status.COMPLETED)`.
- **Open decisions:** D-01 (credit hours, currently 90), D-05 (grade weights), D-07 (alert threshold 80%), D-08 (each department's hours, and whether there's a weeks condition), whether to keep `needs_changes`, and PostgreSQL vs SQLite for the final demo.
