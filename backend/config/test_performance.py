"""NFR-06 / NFR-07: Performance benchmarks for key API endpoints and exports.

NFR-06: API endpoints respond under 2 seconds.
NFR-07: Reports (Excel and PDF exports) generate in under 10 seconds.
"""

import time
from io import StringIO

from django.core.management import call_command
from django.test import override_settings
from rest_framework.test import APITestCase

from accounts.models import User


@override_settings(DEBUG=True)
class PerformanceBenchmarksTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_demo", stdout=StringIO())
        cls.coordinator = User.objects.get(username="demo_coordinator")
        cls.student = User.objects.get(username="120260010")
        cls.provider = User.objects.get(username="demo_provider")

    def measure_get(self, user, url):
        self.client.force_authenticate(user)
        start = time.perf_counter()
        response = self.client.get(url)
        duration = time.perf_counter() - start
        return response, duration

    def test_applications_list_performance(self):
        """NFR-06: applications list responds quickly (< 2.0s)."""
        response, duration = self.measure_get(self.coordinator, "/api/applications/")
        self.assertEqual(response.status_code, 200)
        self.assertLess(duration, 2.0, f"Took {duration:.3f}s")

    def test_stats_dashboard_performance(self):
        """NFR-06: dashboard stats responds quickly (< 2.0s)."""
        response, duration = self.measure_get(self.coordinator, "/api/stats/")
        self.assertEqual(response.status_code, 200)
        self.assertLess(duration, 2.0, f"Took {duration:.3f}s")

    def test_provider_stats_performance(self):
        """NFR-06: provider dashboard responds quickly (< 2.0s)."""
        response, duration = self.measure_get(self.provider, "/api/stats/")
        self.assertEqual(response.status_code, 200)
        self.assertLess(duration, 2.0, f"Took {duration:.3f}s")

    def test_attendance_endpoint_performance(self):
        """NFR-06: attendance calendar and rate responds quickly (< 2.0s)."""
        response, duration = self.measure_get(self.student, "/api/daily-logs/attendance/")
        self.assertEqual(response.status_code, 200)
        self.assertLess(duration, 2.0, f"Took {duration:.3f}s")

    def test_excel_export_performance(self):
        """NFR-07: Excel export generation completes in under 10 seconds."""
        response, duration = self.measure_get(self.coordinator, "/api/exports/applications/")
        self.assertEqual(response.status_code, 200)
        self.assertLess(duration, 10.0, f"Took {duration:.3f}s")

    def test_pdf_export_performance(self):
        """NFR-07: PDF export generation completes in under 10 seconds."""
        response, duration = self.measure_get(self.coordinator, "/api/exports/applications/pdf/")
        self.assertEqual(response.status_code, 200)
        self.assertLess(duration, 10.0, f"Took {duration:.3f}s")
