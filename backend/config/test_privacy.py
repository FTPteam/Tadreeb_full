"""NFR-18 / NFR-19: nobody sees another student's records, across every endpoint.

Runs against the whole demo story (imports/demo_lifecycle.py), so each endpoint has real data
to leak. It looks for other students' ids and names anywhere in the response, so a new field
that exposes them fails here even if nobody thought to test it.
"""

import shutil
import tempfile
from io import StringIO

from django.core.management import call_command
from django.test import override_settings
from rest_framework.test import APITestCase

from accounts.models import User
from applications.models import Application, ExceptionRequest, Placement
from certificates.models import Certificate
from evaluations.models import Evaluation
from providers.models import Provider
from training.models import DailyLog, Report, TrainingPlan, Visit

MEDIA = tempfile.mkdtemp()

# Everything a logged-in user can ask for that might mention a student.
ENDPOINTS = [
    "/api/applications/",
    "/api/daily-logs/",
    "/api/provider-daily-logs/",
    "/api/training-plans/",
    "/api/reports/",
    "/api/visits/",
    "/api/evaluations/",
    "/api/provider-ratings/",
    "/api/certificates/",
    "/api/exception-requests/",
    "/api/notifications/",
    "/api/students/",
    "/api/users/",
    "/api/stats/",
    "/api/archive/",
    "/api/audit-logs/",
    "/api/exports/applications/",
    "/api/exports/applications/pdf/",
]

IN_TRAINING = "120260010"
CERTIFIED = "120260013"
AT_DEMO_PROVIDER = {"120260009", "120260010", "120260011", "120260012", CERTIFIED}


@override_settings(DEBUG=True, MEDIA_ROOT=MEDIA)
class PrivacyTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_demo", stdout=StringIO())
        cls.provider_user = User.objects.get(username="demo_provider")
        cls.other_provider_user = User.objects.create_user(
            username="other_company", password="x", role=User.Role.PROVIDER
        )
        Provider.objects.filter(name="مركز النور للشبكات").update(user=cls.other_provider_user)
        cls.other_supervisor = User.objects.create_user(
            username="other_supervisor", password="x", role=User.Role.SUPERVISOR
        )
        cls.students = {u.username: u for u in User.objects.filter(role=User.Role.STUDENT)}

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(MEDIA, ignore_errors=True)

    def leaks(self, user, allowed):
        """The (endpoint, student) pairs where `user` could see a student outside `allowed`."""
        self.client.force_authenticate(user)
        found = []
        for url in ENDPOINTS:
            response = self.client.get(url)
            if response.status_code != 200:
                continue
            body = response.content.decode("utf-8", errors="ignore")
            for username, student in self.students.items():
                if username in allowed:
                    continue
                if username in body or student.get_full_name() in body:
                    found.append((url, username))
        return found

    def details_of(self, username):
        """Direct links to each of this student's records."""
        application = Application.objects.get(student__username=username)
        urls = [f"/api/applications/{application.id}/"]
        for model, path in (
            (DailyLog, "daily-logs"),
            (Report, "reports"),
            (Evaluation, "evaluations"),
            (Visit, "visits"),
            (ExceptionRequest, "exception-requests"),
            (Certificate, "certificates"),
        ):
            urls += [f"/api/{path}/{pk}/" for pk in model.objects.filter(application=application).values_list("pk", flat=True)[:1]]
        plan = TrainingPlan.objects.filter(application=application).first()
        if plan:
            urls.append(f"/api/training-plans/{plan.id}/")
        for pk in Placement.objects.filter(application=application).values_list("pk", flat=True):
            urls.append(f"/api/placements/{pk}/letter/")
        for pk in Certificate.objects.filter(application=application).values_list("pk", flat=True):
            urls.append(f"/api/certificates/{pk}/pdf/")
        urls.append(f"/api/evaluations/final-grade/?application={application.id}")
        urls.append(f"/api/daily-logs/progress/?application={application.id}")
        return urls

    def assertCannotOpen(self, user, username):
        self.client.force_authenticate(user)
        opened = [url for url in self.details_of(username) if self.client.get(url).status_code == 200]
        self.assertEqual(opened, [], f"{user.username} opened {username}'s records")

    def test_this_check_can_find_a_leak(self):
        """If this fails, the checks below would pass whatever the endpoints returned."""
        coordinator = User.objects.get(username="demo_coordinator")
        self.assertIn(("/api/applications/", IN_TRAINING), self.leaks(coordinator, set()))
        seen = self.leaks(self.provider_user, set())
        self.assertIn(("/api/applications/", IN_TRAINING), seen)
        self.client.force_authenticate(coordinator)
        opened = [url for url in self.details_of(CERTIFIED) if self.client.get(url).status_code == 200]
        self.assertGreater(len(opened), 3)

    # --- students (NFR-18) ---

    def test_a_student_sees_only_their_own_records(self):
        for username in (IN_TRAINING, CERTIFIED):
            self.assertEqual(self.leaks(self.students[username], {username}), [])

    def test_a_student_cannot_open_another_students_records(self):
        self.assertCannotOpen(self.students[IN_TRAINING], CERTIFIED)
        self.assertCannotOpen(self.students[CERTIFIED], IN_TRAINING)

    # --- providers (NFR-18) ---

    def test_a_provider_sees_only_the_students_assigned_to_it(self):
        self.assertEqual(self.leaks(self.provider_user, AT_DEMO_PROVIDER), [])

    def test_a_provider_with_no_students_sees_nobody(self):
        self.assertEqual(self.leaks(self.other_provider_user, set()), [])

    def test_a_provider_cannot_open_another_providers_student(self):
        self.assertCannotOpen(self.other_provider_user, IN_TRAINING)
        self.assertCannotOpen(self.provider_user, "120260014")  # was never theirs

    def test_a_provider_sees_only_its_own_evaluation(self):
        self.client.force_authenticate(self.provider_user)
        kinds = {e["kind"] for e in self.client.get("/api/evaluations/").data["results"]}
        self.assertEqual(kinds, {"provider"})

    # --- supervisors (Section 2.2) ---

    def test_a_supervisor_with_no_students_cannot_open_records(self):
        self.assertCannotOpen(self.other_supervisor, IN_TRAINING)

    # --- the public certificate page (NFR-19) ---

    def test_public_verification_shows_only_the_minimum(self):
        certificate = Certificate.objects.get()
        self.client.force_authenticate(None)
        response = self.client.get(f"/api/certificates/verify/{certificate.verification_code}/")
        self.assertEqual(response.status_code, 200)
        allowed = {"student_name", "provider_name", "start_date", "end_date", "is_valid", "revoked_at", "serial_number", "issued_at"}
        self.assertEqual(set(response.data) - allowed, set())

        page = self.client.get(f"/verify/{certificate.verification_code}/")
        self.assertEqual(page.status_code, 200)
        self.assertNotContains(page, certificate.university_id)
