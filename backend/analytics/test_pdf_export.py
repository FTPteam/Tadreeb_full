import time
from unittest.mock import patch

from django.test import SimpleTestCase

from applications.status import Status

from .pdf_export import PDF_WIDTHS, table_pdf
from .tests import AnalyticsTestData


class PdfExportTests(AnalyticsTestData):
    def test_export_applications_to_pdf(self):
        response = self.client.get("/api/exports/applications/pdf/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/pdf")
        self.assertIn("attachment", response["Content-Disposition"])
        self.assertIn(".pdf", response["Content-Disposition"])
        self.assertTrue(response.content.startswith(b"%PDF"))

    def test_pdf_has_the_same_people_as_the_excel_and_uses_the_filters(self):
        with patch("analytics.pdf_export.table_pdf", return_value=b"%PDF-") as table:
            self.client.get("/api/exports/applications/pdf/")
            rows = table.call_args.args[2]
            self.assertEqual(sorted(row[0] for row in rows), ["20250001", "20250002", "20250003"])

            self.client.get(f"/api/exports/applications/pdf/?status={Status.REJECTED}")
            rows = table.call_args.args[2]
            self.assertEqual([row[0] for row in rows], ["20250003"])

    def test_supervisor_cannot_export(self):
        self.client.force_authenticate(self.sup)
        self.assertEqual(self.client.get("/api/exports/applications/pdf/").status_code, 403)


class TablePdfTests(SimpleTestCase):
    HEADERS = ["أ", "ب", "ج", "د", "هـ", "و", "ز"]

    def row(self, number):
        return [str(number), "اسم الطالب رقم " + str(number), "تقنية المعلومات", "قيد التدريب",
                "شركة التقنية المتقدمة للحلول البرمجية والتدريب", 12.5, None]

    def test_empty_list_still_gives_a_pdf(self):
        self.assertTrue(table_pdf("قائمة", self.HEADERS, [], PDF_WIDTHS).startswith(b"%PDF"))

    def test_a_thousand_rows_take_under_ten_seconds(self):
        # NFR-07: a report of up to 1,000 records in less than 10 seconds.
        rows = [self.row(n) for n in range(1000)]
        started = time.monotonic()
        content = table_pdf("قائمة", self.HEADERS, rows, PDF_WIDTHS)
        self.assertLess(time.monotonic() - started, 10)
        self.assertTrue(content.startswith(b"%PDF"))
        self.assertGreater(content.count(b"/Type /Page\n"), 1)  # more than one page