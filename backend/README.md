# الخادم (Back-End) — وفاء

To run Django + Django REST Framework, copy these commands into your terminal (Linux/macOS):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

On Windows PowerShell, activate with `.venv\Scripts\Activate.ps1` instead.

### Login API

| Method | URL | Body | Returns |
|---|---|---|---|
| POST | `/api/auth/login/` | `{"username", "password"}` | `{"access", "refresh"}` |
| POST | `/api/auth/refresh/` | `{"refresh"}` | `{"access"}` |
| GET | `/api/auth/me/` | header `Authorization: Bearer <access>` | `{"id", "username", "full_name", "role"}` |
| GET | `/api/health/` | public | `{"status": "ok"}` |
| GET / PATCH | `/api/students/me/` | student only; PATCH `phone`, `email`, `cv` | profile + `eligibility` |
| GET | `/api/students/?search=&department=&specialization=&academic_status=` | supervisor, coordinator, admin | 20 per page |
| GET / PATCH | `/api/students/<id>/` | supervisor, coordinator, admin | profile + `eligibility` |
| GET | `/api/departments/` | any logged-in user | departments with `specializations` |

The access token lasts 1 day. Every endpoint except health needs the header. Login accepts the university ID or the email in `username`.

Student profile shape:

```json
{
  "id": 1, "university_id": "20251234", "full_name": "سارة أحمد", "email": "sara@example.com",
  "phone": "0599123456", "department": 1, "department_name": "تقنية المعلومات",
  "specialization": 1, "specialization_name": "هندسة برمجيات",
  "completed_credit_hours": 95, "gpa": null, "academic_status": "active", "cv": null,
  "eligibility": {"is_eligible": true, "reasons": [], "min_credit_hours": 90}
}
```

Eligibility (BR-01) uses `TADREEB_MIN_CREDIT_HOURS` (90 for now, D-01 still open) and `TADREEB_MIN_GPA` (off) in `config/settings.py`. `academic_status` is `active`, `suspended` or `graduated`.

### Application review and placement

Everything happens on `/api/applications/<id>/`, and each role sees only its own applications:

| Method | URL | Who | Notes |
|---|---|---|---|
| POST | `/api/applications/<id>/transition/` | supervisor, coordinator | `{"status": "under_review" \| "accepted" \| "rejected" \| "needs_changes" \| "withdrawn", "reason": "..."}` (FR-13, FR-31) |
| POST | `/api/applications/<id>/assign-supervisor/` | coordinator | `{"supervisor": 4}` (FR-18) |
| POST | `/api/applications/<id>/allocate/` | supervisor, coordinator | `{"opportunity": 7}`, creates the `Placement` (FR-14) |
| POST | `/api/applications/<id>/confirm/` | provider | accepts the student (FR-16) and starts the training: `assigned → in_training` |
| POST | `/api/applications/<id>/approve/` | coordinator | `completed → approved`, then the certificate is issued and the application becomes `certified` (FR-34) |

Opportunity responses include `free_seats`.

### Training follow-up, certificates and reports

| Method | URL | Who | Notes |
|---|---|---|---|
| GET | `/api/provider-daily-logs/?confirmed=false` | provider | days written by its trainees, inside its placement dates |
| POST | `/api/provider-daily-logs/<id>/confirm/` | provider | confirms attendance for the day (BR-05); completes the training once the department's hours are reached (BR-06) |
| GET | `/api/daily-logs/progress/?application=<id>` | student | confirmed hours, the department's required hours, remaining and percent |
| GET / POST / DELETE | `/api/reports/` | student uploads (multipart `application`, `title`, `file`), supervisor and coordinator read | delete only before grading (FR-23) |
| POST | `/api/reports/<id>/grade/` | supervisor | `{"grade": 0-100, "supervisor_comment"}` |
| GET | `/api/placements/<id>/letter/` | student, supervisor, provider, coordinator | guidance letter PDF (FR-17) |
| GET | `/api/certificates/` and `/api/certificates/<id>/pdf/` | student (own), supervisor (own students), coordinator | certificate with QR code (FR-34) |
| POST | `/api/certificates/` and `/api/certificates/<id>/revoke/` | coordinator, admin | issue for an approved application / revoke with `reason` |
| GET | `/api/certificates/verify/<code>/` and `/verify/<code>/` | public | JSON and HTML check (FR-35) |
| GET / POST / PATCH | `/api/evaluations/` | provider and supervisor write their own; student, coordinator, admin read | `{"application", "scores": {criterion: 1-5}, "notes"}`, one of each kind per application, editable until approval (FR-25, FR-26) |
| GET | `/api/evaluations/criteria/` | anyone logged in | the criteria of each kind |
| GET | `/api/evaluations/final-grade/?application=<id>` | whoever can see the application | provider 40% + supervisor 40% + reports 20%, pass at 60 (FR-27, BR-04) |
| GET / POST | `/api/provider-ratings/` | the student rates 1-5 once after the training; provider, supervisor, coordinator read | FR-29 |
| GET | `/api/stats/` | coordinator, admin | dashboard numbers (FR-36) |
| GET | `/api/exports/applications/` | coordinator, admin | Excel file (FR-37) |
| GET | `/api/exports/applications/pdf/` | coordinator, admin | PDF table in Arabic (FR-37, NFR-07) |
| GET | `/api/archive/` | coordinator, admin | certified, rejected and withdrawn files (FR-39) |

Stats, export and archive take the same filters: `year`, `department`, `provider`, `status`, `search`. The coordinator can approve only when the final grade is complete and passing; the certificate is then issued automatically and the application becomes `certified`. The weights and pass mark are `TADREEB_GRADE_WEIGHTS` and `TADREEB_PASS_GRADE` in `config/settings.py` (D-05). Set `TADREEB_INSTITUTION_NAME` and `TADREEB_CERTIFICATE_VERIFY_URL` (e.g. `https://front.example/verify/{code}`) in `.env` when needed.

الـ APIs لازم تمشي على الاتفاق بـ [docs/TEAM_AGREEMENT.md](../docs/TEAM_AGREEMENT.md) (أسماء الحقول snake_case، التواريخ YYYY-MM-DD، رموز الحالات...).
الواجهة حاليًا بتستخدم بيانات وهمية بنفس الشكل: شوفي `frontend/src/api/mock.js` لتعرفي شو الشكل المتوقع.
