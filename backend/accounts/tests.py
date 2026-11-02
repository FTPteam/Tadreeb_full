from datetime import timedelta
from decimal import Decimal
from unittest.mock import patch

from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.test import APITestCase

from .eligibility import check_eligibility
from .models import Department, Specialization, StudentProfile, User


class AuthTests(APITestCase):
    def setUp(self):
        cache.clear()
        User.objects.create_user(
            username="20251234",
            password="Test12345!",
            first_name="سارة",
            last_name="أحمد",
            role=User.Role.STUDENT,
        )

    def tearDown(self):
        cache.clear()
        super().tearDown()

    def login(self):
        response = self.client.post(
            "/api/auth/login/", {"username": "20251234", "password": "Test12345!"}
        )
        self.assertEqual(response.status_code, 200)
        return response.data

    def test_login_returns_access_and_refresh(self):
        tokens = self.login()
        self.assertIn("access", tokens)
        self.assertIn("refresh", tokens)

    def test_wrong_password_is_rejected(self):
        response = self.client.post(
            "/api/auth/login/", {"username": "20251234", "password": "wrong"}
        )
        self.assertEqual(response.status_code, 401)

    def test_login_lockout_after_5_failed_attempts(self):
        # NFR-05: 5 failed attempts lock out for 15 minutes
        for _ in range(4):
            res = self.client.post("/api/auth/login/", {"username": "20251234", "password": "wrong"})
            self.assertEqual(res.status_code, 401)
            self.assertNotIn("15 دقيقة", str(res.data))

        # 5th attempt triggers lockout
        res5 = self.client.post("/api/auth/login/", {"username": "20251234", "password": "wrong"})
        self.assertEqual(res5.status_code, 401)
        self.assertIn("15 دقيقة", str(res5.data))

        # 6th attempt even with correct password is locked out
        res6 = self.client.post("/api/auth/login/", {"username": "20251234", "password": "Test12345!"})
        self.assertEqual(res6.status_code, 401)
        self.assertIn("15 دقيقة", str(res6.data))

    def test_successful_login_resets_failed_attempts(self):
        for _ in range(3):
            self.client.post("/api/auth/login/", {"username": "20251234", "password": "wrong"})
        success = self.client.post("/api/auth/login/", {"username": "20251234", "password": "Test12345!"})
        self.assertEqual(success.status_code, 200)

        # 4 more failures shouldn't lock out because it was reset
        for _ in range(4):
            res = self.client.post("/api/auth/login/", {"username": "20251234", "password": "wrong"})
            self.assertEqual(res.status_code, 401)
            self.assertNotIn("15 دقيقة", str(res.data))

    def test_me_returns_the_logged_in_user(self):
        access = self.login()["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "20251234")
        self.assertEqual(response.data["full_name"], "سارة أحمد")
        self.assertEqual(response.data["role"], "student")
        self.assertNotIn("password", response.data)

    def test_me_without_token_is_401(self):
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 401)

    def test_refresh_returns_new_access(self):
        refresh = self.login()["refresh"]
        response = self.client.post("/api/auth/refresh/", {"refresh": refresh})
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)

    def test_health_is_public(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"status": "ok"})

    def test_cors_allows_the_front_end(self):
        response = self.client.get(
            "/api/health/", HTTP_ORIGIN="http://localhost:5173"
        )
        self.assertEqual(
            response["Access-Control-Allow-Origin"], "http://localhost:5173"
        )

    def test_jwt_session_expiry_settings(self):
        from django.conf import settings

        jwt_settings = settings.SIMPLE_JWT
        self.assertEqual(jwt_settings.get("REFRESH_TOKEN_LIFETIME"), timedelta(minutes=30))
        self.assertIs(jwt_settings.get("ROTATE_REFRESH_TOKENS"), True)


class PasswordResetTests(APITestCase):
    """FR-02: forgot password reset by email link."""

    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            username="20259999",
            email="reset_test@example.com",
            password="OldPassword123!",
            first_name="أحمد",
            role=User.Role.STUDENT,
        )

    def tearDown(self):
        cache.clear()
        super().tearDown()

    def test_password_reset_request_sends_email(self):
        response = self.client.post(
            "/api/auth/password-reset/",
            {"email": "reset_test@example.com"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]
        self.assertIn("استعادة كلمة المرور", email.subject)
        self.assertIn("reset_test@example.com", email.to)
        self.assertIn("uid=", email.body)
        self.assertIn("token=", email.body)

    def test_password_reset_unknown_email_still_returns_200(self):
        response = self.client.post(
            "/api/auth/password-reset/",
            {"email": "unknown@example.com"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 0)

    @patch("accounts.views.send_mail", side_effect=Exception("SMTP connection failed"))
    def test_password_reset_request_handles_mail_failure_gracefully(self, mock_send_mail):
        response = self.client.post(
            "/api/auth/password-reset/",
            {"email": "reset_test@example.com"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["detail"],
            "إذا كان البريد الإلكتروني مسجلًا لدينا، فستتلقى رابطًا لاستعادة كلمة المرور.",
        )

    def test_password_reset_confirm_changes_password(self):
        token = default_token_generator.make_token(self.user)
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))

        response = self.client.post(
            "/api/auth/password-reset/confirm/",
            {
                "uid": uid,
                "token": token,
                "new_password": "NewSecretPassword123!",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)

        # Login with old password fails
        fail = self.client.post(
            "/api/auth/login/", {"username": "20259999", "password": "OldPassword123!"}
        )
        self.assertEqual(fail.status_code, 401)

        # Login with new password succeeds
        success = self.client.post(
            "/api/auth/login/", {"username": "20259999", "password": "NewSecretPassword123!"}
        )
        self.assertEqual(success.status_code, 200)
        self.assertIn("access", success.data)

    def test_password_reset_confirm_invalid_token_fails(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        response = self.client.post(
            "/api/auth/password-reset/confirm/",
            {
                "uid": uid,
                "token": "invalid-token",
                "new_password": "NewSecretPassword123!",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("detail", response.data)


class StudentProfileTests(APITestCase):
    def setUp(self):
        self.it = Department.objects.create(name="تقنية المعلومات")
        self.software = Specialization.objects.create(department=self.it, name="هندسة برمجيات")
        self.student = User.objects.create_user(
            username="20251234",
            email="sara@example.com",
            password="Test12345!",
            first_name="سارة",
            last_name="أحمد",
        )
        self.profile = StudentProfile.objects.create(
            user=self.student,
            department=self.it,
            specialization=self.software,
            completed_credit_hours=95,
        )
        self.coordinator = User.objects.create_user(
            username="coord", password="Test12345!", role=User.Role.COORDINATOR
        )

    def test_student_sees_own_profile_and_is_eligible(self):
        self.client.force_authenticate(self.student)
        response = self.client.get("/api/students/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["university_id"], "20251234")
        self.assertEqual(response.data["department_name"], "تقنية المعلومات")
        self.assertTrue(response.data["eligibility"]["is_eligible"])
        self.assertEqual(response.data["eligibility"]["reasons"], [])

    def test_not_enough_hours_gives_the_reason(self):
        self.profile.completed_credit_hours = 60
        self.profile.save()
        self.client.force_authenticate(self.student)
        eligibility = self.client.get("/api/students/me/").data["eligibility"]
        self.assertFalse(eligibility["is_eligible"])
        self.assertIn("60", eligibility["reasons"][0])

    def test_suspended_student_is_not_eligible(self):
        self.profile.academic_status = StudentProfile.AcademicStatus.SUSPENDED
        self.profile.save()
        self.assertFalse(check_eligibility(self.profile)[0])

    @override_settings(TADREEB_MIN_GPA=Decimal("2.50"))
    def test_gpa_rule_when_the_college_sets_one(self):
        self.profile.gpa = Decimal("2.10")
        self.assertFalse(check_eligibility(self.profile)[0])
        self.profile.gpa = Decimal("3.00")
        self.assertTrue(check_eligibility(self.profile)[0])

    def test_student_can_edit_phone_but_not_credit_hours(self):
        self.client.force_authenticate(self.student)
        response = self.client.patch(
            "/api/students/me/",
            {"phone": "0599123456", "completed_credit_hours": 200},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["phone"], "0599123456")
        self.assertEqual(response.data["completed_credit_hours"], 95)

    def test_cv_must_be_pdf_jpg_or_png(self):
        self.client.force_authenticate(self.student)
        bad = SimpleUploadedFile("cv.exe", b"x")
        response = self.client.patch("/api/students/me/", {"cv": bad}, format="multipart")
        self.assertEqual(response.status_code, 400)

    def test_non_student_cannot_use_students_me(self):
        self.client.force_authenticate(self.coordinator)
        self.assertEqual(self.client.get("/api/students/me/").status_code, 403)

    def test_student_cannot_list_students(self):
        self.client.force_authenticate(self.student)
        self.assertEqual(self.client.get("/api/students/").status_code, 403)

    def test_coordinator_lists_and_searches_students(self):
        self.client.force_authenticate(self.coordinator)
        response = self.client.get("/api/students/", {"search": "سارة"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["university_id"], "20251234")
        empty = self.client.get("/api/students/", {"search": "nobody"})
        self.assertEqual(empty.data["count"], 0)

    def test_coordinator_updates_credit_hours(self):
        self.client.force_authenticate(self.coordinator)
        response = self.client.patch(
            f"/api/students/{self.profile.id}/",
            {"completed_credit_hours": 120},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["completed_credit_hours"], 120)

    def test_specialization_must_match_department(self):
        other = Department.objects.create(name="إدارة أعمال")
        self.client.force_authenticate(self.coordinator)
        response = self.client.patch(
            f"/api/students/{self.profile.id}/", {"department": other.id}, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_departments_list_with_specializations(self):
        self.client.force_authenticate(self.student)
        response = self.client.get("/api/departments/")
        self.assertEqual(response.data[0]["specializations"][0]["name"], "هندسة برمجيات")

    def test_login_with_email(self):
        response = self.client.post(
            "/api/auth/login/", {"username": "sara@example.com", "password": "Test12345!"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
