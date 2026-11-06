"""Tests for FR-21 / FR-22 / BR-05: Attendance calculation, sick leave, and alert under 80%."""

from datetime import date, timedelta
from decimal import Decimal

from django.test import override_settings
from django.utils import timezone
from rest_framework.test import APITestCase

from accounts.models import Department, Specialization, User
from applications.models import Application, Placement
from applications.status import Status
from notifications.models import Notification
from providers.models import Opportunity, Provider
from training.attendance import calculate_attendance, get_working_days
from training.models import DailyLog


def make_provider(name, user=None):
    return Provider.objects.create(
        name=name, sector="تقنية", city="غزة", contact_name="مسؤول", contact_phone="0599000000", user=user
    )


def make_opportunity(provider, specialization, start, end):
    return Opportunity.objects.create(
        provider=provider,
        specialization=specialization,
        title="تطوير برمجيات",
        tasks="مهام",
        seats=5,
        start_date=start,
        end_date=end,
        location="غزة",
    )


class AttendanceCalculationTests(APITestCase):
    def test_working_days_excludes_friday_and_saturday(self):
        # 2026-11-01 was Sunday (day 6), 2026-11-07 was Saturday (day 5)
        # Sun, Mon, Tue, Wed, Thu = 5 working days. Fri, Sat = weekend.
        start = date(2026, 11, 1)
        end = date(2026, 11, 7)
        working_days = get_working_days(start, end)
        self.assertEqual(len(working_days), 5)
        self.assertNotIn(date(2026, 11, 6), working_days)  # Friday
        self.assertNotIn(date(2026, 11, 7), working_days)  # Saturday


class AttendanceApiTests(APITestCase):
    def setUp(self):
        self.student = User.objects.create_user(username="20251111", password="x", role=User.Role.STUDENT, first_name="سارة")
        self.other_student = User.objects.create_user(username="20252222", password="x", role=User.Role.STUDENT, first_name="عمر")
        self.supervisor = User.objects.create_user(username="sup_dr", password="x", role=User.Role.SUPERVISOR, first_name="د. أحمد")
        self.other_supervisor = User.objects.create_user(username="sup_other", password="x", role=User.Role.SUPERVISOR)
        self.provider_user = User.objects.create_user(username="company", password="x", role=User.Role.PROVIDER)
        self.other_provider_user = User.objects.create_user(username="other_company", password="x", role=User.Role.PROVIDER)

        self.department = Department.objects.create(name="تقنية المعلومات")
        self.specialization = Specialization.objects.create(department=self.department, name="برمجة")

        self.provider = make_provider("شركة التقنية", self.provider_user)
        self.other_provider = make_provider("شركة أخرى", self.other_provider_user)

        self.start_date = date(2026, 10, 4)  # Sunday
        self.end_date = date(2026, 10, 15)   # Thursday

        self.opp = make_opportunity(self.provider, self.specialization, self.start_date, self.end_date)

        self.application = Application.objects.create(
            student=self.student,
            supervisor=self.supervisor,
            status=Status.IN_TRAINING,
        )

        self.placement = Placement.objects.create(
            application=self.application,
            opportunity=self.opp,
            start_date=self.start_date,
            end_date=self.end_date,
            is_active=True,
        )

    def test_full_attendance_gives_100_percent(self):
        # 5 working days: Oct 4 (Sun) to Oct 8 (Thu)
        # All 5 days have confirmed logs
        for d in [date(2026, 10, 4 + i) for i in range(5)]:
            DailyLog.objects.create(
                application=self.application,
                date=d,
                hours=Decimal("6"),
                tasks="مهام تدريبية",
                confirmed_at=timezone.now(),
                confirmed_by=self.provider_user,
            )

        stats = calculate_attendance(self.application, up_to_date=date(2026, 10, 9))
        self.assertEqual(stats["working_days"], 5)
        self.assertEqual(stats["confirmed_days"], 5)
        self.assertEqual(stats["absent_days"], 0)
        self.assertEqual(stats["excused_days"], 0)
        self.assertEqual(stats["attendance_rate"], 100.0)
        self.assertFalse(stats["alert"])

    def test_missing_day_counts_as_absence(self):
        # 5 working days: Oct 4 to Oct 8
        # Student attended 4 days (missed Oct 7)
        for d in [date(2026, 10, 4), date(2026, 10, 5), date(2026, 10, 6), date(2026, 10, 8)]:
            DailyLog.objects.create(
                application=self.application,
                date=d,
                hours=Decimal("6"),
                tasks="مهام تدريبية",
                confirmed_at=timezone.now(),
                confirmed_by=self.provider_user,
            )

        stats = calculate_attendance(self.application, up_to_date=date(2026, 10, 9))
        self.assertEqual(stats["working_days"], 5)
        self.assertEqual(stats["confirmed_days"], 4)
        self.assertEqual(stats["absent_days"], 1)
        self.assertEqual(stats["attendance_rate"], 80.0)
        self.assertFalse(stats["alert"])

    def test_sick_leave_excused_day_excluded_from_calculation(self):
        # 5 working days: Oct 4 to Oct 8
        # Student attended 4 days, and 1 day (Oct 6) is sick leave (مرض)
        for d in [date(2026, 10, 4), date(2026, 10, 5), date(2026, 10, 7), date(2026, 10, 8)]:
            DailyLog.objects.create(
                application=self.application,
                date=d,
                hours=Decimal("6"),
                tasks="مهام تدريبية",
                confirmed_at=timezone.now(),
                confirmed_by=self.provider_user,
            )
        # Sick day
        DailyLog.objects.create(
            application=self.application,
            date=date(2026, 10, 6),
            hours=Decimal("0"),
            tasks="مرض",
            is_excused=True,
            absence_reason="إجازة مرضية بتقرير طبي",
            confirmed_at=timezone.now(),
            confirmed_by=self.provider_user,
        )

        stats = calculate_attendance(self.application, up_to_date=date(2026, 10, 9))
        # Total calendar working days = 5, excused = 1, effective working days = 4
        self.assertEqual(stats["total_calendar_working_days"], 5)
        self.assertEqual(stats["excused_days"], 1)
        self.assertEqual(stats["working_days"], 4)
        self.assertEqual(stats["confirmed_days"], 4)
        self.assertEqual(stats["absent_days"], 0)
        self.assertEqual(stats["attendance_rate"], 100.0)
        self.assertFalse(stats["alert"])

    @override_settings(TADREEB_ATTENDANCE_ALERT=80)
    def test_alert_triggered_when_attendance_drops_below_80_percent(self):
        # 5 working days: Oct 4 to Oct 8
        # Attended 3 days out of 5 -> 3/5 = 60.0% < 80%
        log1 = DailyLog.objects.create(
            application=self.application, date=date(2026, 10, 4), hours=6, tasks="عمل"
        )
        log2 = DailyLog.objects.create(
            application=self.application, date=date(2026, 10, 5), hours=6, tasks="عمل"
        )
        log3 = DailyLog.objects.create(
            application=self.application, date=date(2026, 10, 8), hours=6, tasks="عمل"
        )

        self.client.force_authenticate(self.provider_user)
        self.client.post(f"/api/provider-daily-logs/{log1.id}/confirm/")
        self.client.post(f"/api/provider-daily-logs/{log2.id}/confirm/")
        self.client.post(f"/api/provider-daily-logs/{log3.id}/confirm/")

        # Verify rate and alert logic
        stats = calculate_attendance(self.application, up_to_date=date(2026, 10, 9))
        self.assertEqual(stats["attendance_rate"], 60.0)
        self.assertTrue(stats["alert"])

    def test_provider_excuses_an_existing_log(self):
        log = DailyLog.objects.create(
            application=self.application, date=date(2026, 10, 5), hours=6, tasks="يوم عمل"
        )
        self.client.force_authenticate(self.provider_user)
        response = self.client.post(
            f"/api/provider-daily-logs/{log.id}/excuse/",
            {"reason": "مرض وعذر طبي"},
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)
        log.refresh_from_db()
        self.assertTrue(log.is_excused)
        self.assertEqual(log.absence_reason, "مرض وعذر طبي")
        self.assertEqual(log.hours, Decimal("0"))
        self.assertIsNotNone(log.confirmed_at)

    def test_provider_records_absence_for_day_without_log(self):
        self.client.force_authenticate(self.provider_user)
        response = self.client.post(
            "/api/provider-daily-logs/record-absence/",
            {
                "application": self.application.id,
                "date": "2026-10-06",
                "reason": "إجازة مرضية",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201, response.data)
        log = DailyLog.objects.get(application=self.application, date=date(2026, 10, 6))
        self.assertTrue(log.is_excused)
        self.assertEqual(log.absence_reason, "إجازة مرضية")
        self.assertEqual(log.hours, Decimal("0"))

    def test_student_gets_attendance_calendar_endpoint(self):
        DailyLog.objects.create(
            application=self.application,
            date=date(2026, 10, 4),
            hours=6,
            tasks="برمجة",
            confirmed_at=timezone.now(),
            confirmed_by=self.provider_user,
        )
        self.client.force_authenticate(self.student)
        response = self.client.get(f"/api/daily-logs/attendance/?application={self.application.id}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("attendance_rate", response.data)
        self.assertIn("daily_breakdown", response.data)
        self.assertIn("confirmed_days", response.data)
        self.assertIn("absent_days", response.data)
        self.assertIn("excused_days", response.data)
        self.assertIn("alert", response.data)

    def test_student_cannot_view_another_students_attendance(self):
        self.client.force_authenticate(self.other_student)
        response = self.client.get(f"/api/daily-logs/attendance/?application={self.application.id}")
        self.assertEqual(response.status_code, 403)

    def test_supervisor_views_own_student_attendance(self):
        self.client.force_authenticate(self.supervisor)
        response = self.client.get(f"/api/daily-logs/attendance/?application={self.application.id}")
        self.assertEqual(response.status_code, 200)

    def test_other_supervisor_cannot_view_attendance(self):
        self.client.force_authenticate(self.other_supervisor)
        response = self.client.get(f"/api/daily-logs/attendance/?application={self.application.id}")
        self.assertEqual(response.status_code, 403)
