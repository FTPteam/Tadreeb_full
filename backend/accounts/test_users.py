from rest_framework.test import APITestCase

from applications.models import Application
from applications.status import Status
from audit.models import AuditLog
from providers.models import Provider

from .models import StudentProfile, User

URL = "/api/users/"
PASSWORD = "Strong-Pass-2026"


class UserApiTests(APITestCase):
    """FR-03, FR-18, Section 2.2."""

    def setUp(self):
        self.admin = self.user("admin1", User.Role.ADMIN)
        self.coordinator = self.user("coord1", User.Role.COORDINATOR)
        self.supervisor = self.user("sup1", User.Role.SUPERVISOR, first_name="هدى")
        self.student = self.user("120260001", User.Role.STUDENT)
        self.provider = Provider.objects.create(
            name="شركة التقنية", sector="تقنية", city="غزة", contact_name="أحمد", contact_phone="0599"
        )

    def user(self, username, role, **extra):
        return User.objects.create_user(username=username, password="x", role=role, **extra)

    def create(self, **data):
        return self.client.post(URL, {"username": "new1", "password": PASSWORD, **data}, format="json")

    # --- listing ---

    def test_coordinator_lists_supervisors_with_their_students(self):
        Application.objects.create(student=self.student, supervisor=self.supervisor)
        other = self.user("120260002", User.Role.STUDENT)
        Application.objects.create(student=other, supervisor=self.supervisor, status=Status.REJECTED)

        self.client.force_authenticate(self.coordinator)
        results = self.client.get(URL, {"role": "supervisor"}).data["results"]
        self.assertEqual([u["username"] for u in results], ["sup1"])
        self.assertEqual(results[0]["students_count"], 1)  # the rejected one isn't followed
        self.assertEqual(results[0]["role_display"], "مشرف أكاديمي")

    def test_coordinator_does_not_see_admins_or_coordinators(self):
        self.client.force_authenticate(self.coordinator)
        usernames = [u["username"] for u in self.client.get(URL).data["results"]]
        self.assertNotIn("admin1", usernames)
        self.assertNotIn("coord1", usernames)
        self.assertEqual(self.client.get(f"{URL}{self.admin.id}/").status_code, 404)

    def test_admin_sees_everyone_and_can_search(self):
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.get(URL).data["count"], 4)
        self.assertEqual(self.client.get(URL, {"search": "هدى"}).data["count"], 1)
        self.client.patch(f"{URL}{self.student.id}/", {"is_active": False}, format="json")
        self.assertEqual(self.client.get(URL, {"is_active": "false"}).data["count"], 1)

    def test_other_roles_are_forbidden(self):
        for user in (self.supervisor, self.student):
            self.client.force_authenticate(user)
            self.assertEqual(self.client.get(URL).status_code, 403, user.username)
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get(URL).status_code, 401)

    # --- creating ---

    def test_coordinator_creates_a_supervisor_who_can_log_in(self):
        self.client.force_authenticate(self.coordinator)
        response = self.create(role="supervisor", first_name="سعاد", email="suad@test.local")
        self.assertEqual(response.status_code, 201, response.data)
        self.assertNotIn("password", response.data)
        self.assertTrue(AuditLog.objects.filter(action=AuditLog.Action.CREATE, target_id=str(response.data["id"])).exists())

        self.client.force_authenticate(None)
        login = self.client.post("/api/auth/login/", {"username": "new1", "password": PASSWORD}, format="json")
        self.assertEqual(login.status_code, 200, login.data)

    def test_coordinator_cannot_create_privileged_accounts(self):
        self.client.force_authenticate(self.coordinator)
        for role in ("admin", "coordinator"):
            self.assertEqual(self.create(role=role).status_code, 400, role)
        self.assertFalse(User.objects.filter(username="new1").exists())

    def test_admin_can_create_a_coordinator(self):
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.create(role="coordinator").status_code, 201)

    def test_new_student_gets_a_profile(self):
        self.client.force_authenticate(self.coordinator)
        response = self.create(role="student")
        self.assertTrue(StudentProfile.objects.filter(user_id=response.data["id"]).exists())

    def test_no_password_needs_an_email_and_leaves_it_unusable(self):
        self.client.force_authenticate(self.coordinator)
        data = {"username": "new2", "role": "supervisor"}
        self.assertEqual(self.client.post(URL, data, format="json").status_code, 400)
        response = self.client.post(URL, {**data, "email": "new2@test.local"}, format="json")
        self.assertEqual(response.status_code, 201, response.data)
        self.assertFalse(User.objects.get(username="new2").has_usable_password())

    def test_weak_password_and_duplicate_email_are_rejected(self):
        self.client.force_authenticate(self.coordinator)
        self.assertEqual(self.create(role="student", password="123").status_code, 400)
        self.user("taken", User.Role.STUDENT, email="taken@test.local")
        self.assertEqual(self.create(role="student", email="TAKEN@test.local").status_code, 400)

    # --- linking a provider account ---

    def test_provider_account_links_to_its_provider(self):
        self.client.force_authenticate(self.coordinator)
        response = self.create(role="provider", provider=self.provider.id)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["provider"], self.provider.id)
        self.provider.refresh_from_db()
        self.assertEqual(self.provider.user.username, "new1")

        second = self.client.post(
            URL, {"username": "new2", "password": PASSWORD, "role": "provider", "provider": self.provider.id}, format="json"
        )
        self.assertEqual(second.status_code, 400)  # one account per provider

    def test_only_provider_accounts_link_to_a_provider(self):
        self.client.force_authenticate(self.coordinator)
        self.assertEqual(self.create(role="student", provider=self.provider.id).status_code, 400)

    def test_changing_a_role_away_from_provider_removes_the_link(self):
        account = self.user("company", User.Role.PROVIDER)
        self.provider.user = account
        self.provider.save()
        self.client.force_authenticate(self.admin)
        response = self.client.patch(f"{URL}{account.id}/", {"role": "supervisor"}, format="json")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertIsNone(response.data["provider"])
        self.provider.refresh_from_db()
        self.assertIsNone(self.provider.user)

    # --- editing ---

    def test_only_the_admin_changes_roles(self):
        url = f"{URL}{self.student.id}/"
        self.client.force_authenticate(self.coordinator)
        self.assertEqual(self.client.patch(url, {"role": "supervisor"}, format="json").status_code, 400)
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.patch(url, {"role": "supervisor"}, format="json").status_code, 200)

    def test_admin_cannot_demote_or_disable_themselves(self):
        self.client.force_authenticate(self.admin)
        url = f"{URL}{self.admin.id}/"
        self.assertEqual(self.client.patch(url, {"role": "student"}, format="json").status_code, 400)
        self.assertEqual(self.client.patch(url, {"is_active": False}, format="json").status_code, 400)

    def test_disabled_account_cannot_log_in(self):
        self.student.set_password(PASSWORD)
        self.student.save()
        self.client.force_authenticate(self.coordinator)
        self.client.patch(f"{URL}{self.student.id}/", {"is_active": False}, format="json")
        self.client.force_authenticate(None)
        login = self.client.post("/api/auth/login/", {"username": "120260001", "password": PASSWORD}, format="json")
        self.assertEqual(login.status_code, 401)

    def test_patch_cannot_change_a_password(self):
        self.client.force_authenticate(self.admin)
        response = self.client.patch(f"{URL}{self.student.id}/", {"password": PASSWORD}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_non_students_cannot_be_deleted(self):
        self.client.force_authenticate(self.admin)
        res = self.client.delete(f"{URL}{self.supervisor.id}/")
        self.assertEqual(res.status_code, 400)
        self.assertIn("الحذف مسموح لحسابات الطلاب فقط", str(res.data))

    def test_student_with_applications_cannot_be_deleted(self):
        Application.objects.get_or_create(student=self.student)
        self.client.force_authenticate(self.coordinator)
        res = self.client.delete(f"{URL}{self.student.id}/")
        self.assertEqual(res.status_code, 400)
        self.assertIn("لا يمكن حذف هذا الطالب لأنه يمتلك طلبات تدريب محفوظة", str(res.data))

    def test_student_without_applications_can_be_deleted(self):
        fresh_student = self.user("student_to_delete_01", User.Role.STUDENT)
        self.client.force_authenticate(self.coordinator)
        res = self.client.delete(f"{URL}{fresh_student.id}/")
        self.assertEqual(res.status_code, 204)
        self.assertFalse(User.objects.filter(id=fresh_student.id).exists())

    def test_student_profile_delete_endpoint(self):
        fresh_student = self.user("student_to_delete_02", User.Role.STUDENT)
        profile, _ = StudentProfile.objects.get_or_create(user=fresh_student)
        self.client.force_authenticate(self.coordinator)
        res = self.client.delete(f"/api/students/{profile.id}/")
        self.assertEqual(res.status_code, 204)
        self.assertFalse(User.objects.filter(id=fresh_student.id).exists())

    # --- resetting a password ---

    def test_admin_resets_a_password(self):
        self.client.force_authenticate(self.admin)
        url = f"{URL}{self.student.id}/set-password/"
        self.assertEqual(self.client.post(url, {"password": "123"}, format="json").status_code, 400)
        self.assertEqual(self.client.post(url, {"password": PASSWORD}, format="json").status_code, 200)
        self.student.refresh_from_db()
        self.assertTrue(self.student.check_password(PASSWORD))
        log = AuditLog.objects.filter(target_id=str(self.student.id), target_type="accounts.user").latest("id")
        self.assertNotIn(PASSWORD, str(log.changes))

    def test_coordinator_cannot_reset_passwords(self):
        self.client.force_authenticate(self.coordinator)
        url = f"{URL}{self.student.id}/set-password/"
        self.assertEqual(self.client.post(url, {"password": PASSWORD}, format="json").status_code, 403)
