import re

from django.utils import timezone
from rest_framework.test import APITestCase

from .models import User

ARABIC = re.compile(r"[؀-ۿ]")


class ArabicMessagesTests(APITestCase):
    """NFR-11: what the framework itself says is in Arabic, not only our own messages."""

    def assertArabic(self, response):
        self.assertRegex(str(response.data), ARABIC)

    def test_not_logged_in(self):
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, 401)
        self.assertArabic(response)

    def test_wrong_password(self):
        User.objects.create_user(username="sara", password="x")
        response = self.client.post("/api/auth/login/", {"username": "sara", "password": "wrong"}, format="json")
        self.assertEqual(response.status_code, 401)
        self.assertArabic(response)

    def test_missing_field(self):
        response = self.client.post("/api/auth/login/", {"username": "sara"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertArabic(response)

    def test_forbidden(self):
        self.client.force_authenticate(User.objects.create_user(username="sara", password="x"))
        response = self.client.get("/api/students/")  # the framework's own message
        self.assertEqual(response.status_code, 403)
        self.assertArabic(response)

    def test_the_local_day_is_gaza(self):
        self.assertEqual(timezone.get_current_timezone_name(), "Asia/Gaza")
