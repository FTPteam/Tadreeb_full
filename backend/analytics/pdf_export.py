"""FR-37: the filtered applications list as an Arabic PDF table.

It is the same list as the Excel export (same filters, same people), cut down to the
columns that fit on a landscape A4 page. The Arabic helpers come from certificates/pdf.py.
"""

from io import BytesIO

from django.http import HttpResponse
from django.utils import timezone
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas

from applications.models import Application
from certificates.pdf import BOLD, BRAND, REGULAR, ar, register_fonts

from .views import EXPORT_COLUMNS, FILTERS, Base, export_row, filter_applications, with_details

# Positions in EXPORT_COLUMNS / export_row, right to left on the page.
PDF_COLUMNS = [1, 2, 3, 5, 6, 11, 13]
PDF_WIDTHS = [2.2, 3.4, 3.0, 2.4, 3.6, 2.0, 2.0]
SIZE = 10
ROW = 0.75 * cm
MARGIN = 1.5 * cm


def fit(text, width, font=REGULAR, size=SIZE):
    """Shorten `text` with "..." until it fits in `width` points."""
    text = str(text)
    if pdfmetrics.stringWidth(ar(text), font, size) <= width:
        return text
    while text and pdfmetrics.stringWidth(ar(text + "..."), font, size) > width:
        text = text[:-1]
    return text + "..."


def cell(value):
    if value is None or value == "":
        return "-"
    if isinstance(value, float):
        return f"{value:g}"
    return str(value)


def table_pdf(title, headers, rows, widths):
    """A landscape A4 table. Columns run right to left, so the first header is at the right edge."""
    register_fonts()
    buffer = BytesIO()
    page_size = landscape(A4)
    width, height = page_size
    pdf = canvas.Canvas(buffer, pagesize=page_size)
    usable = width - 2 * MARGIN
    columns = [usable * w / sum(widths) for w in widths]

    def edge(index):  # right edge of a column
        return width - MARGIN - sum(columns[:index])

    def start_page(number):
        pdf.setFillColor(BRAND)
        pdf.setFont(BOLD, 18)
        pdf.drawRightString(width - MARGIN, height - MARGIN, ar(title))
        pdf.setFillColor(colors.grey)
        pdf.setFont(REGULAR, SIZE)
        pdf.drawRightString(width - MARGIN, height - MARGIN - 0.7 * cm, ar(f"عدد السجلات: {len(rows)}"))
        # The date is drawn on its own so the bidi reordering can't reverse its digits.
        pdf.drawString(MARGIN, height - MARGIN - 0.7 * cm, f"{timezone.localdate():%Y-%m-%d}")
        pdf.drawCentredString(width / 2, 0.8 * cm, ar(f"صفحة {number}"))
        top = height - MARGIN - 1.7 * cm
        pdf.setFillColor(BRAND)
        pdf.rect(MARGIN, top - ROW + 0.2 * cm, usable, ROW, stroke=0, fill=1)
        pdf.setFillColor(colors.white)
        pdf.setFont(BOLD, SIZE)
        for index, header in enumerate(headers):
            pdf.drawRightString(edge(index) - 4, top - 0.2 * cm, ar(header))
        return top - ROW

    number = 1
    y = start_page(number)
    if not rows:
        pdf.setFillColor(colors.black)
        pdf.setFont(REGULAR, 12)
        pdf.drawRightString(width - MARGIN - 4, y - 0.2 * cm, ar("لا توجد سجلات مطابقة."))
    for position, row in enumerate(rows):
        if y < MARGIN + ROW:
            pdf.showPage()
            number += 1
            y = start_page(number)
        if position % 2:
            pdf.setFillColor(colors.HexColor("#EEF3F8"))
            pdf.rect(MARGIN, y - ROW + 0.2 * cm, usable, ROW, stroke=0, fill=1)
        pdf.setFillColor(colors.black)
        pdf.setFont(REGULAR, SIZE)
        for index, value in enumerate(row):
            pdf.drawRightString(edge(index) - 4, y - 0.2 * cm, ar(fit(cell(value), columns[index] - 8)))
        y -= ROW
    pdf.showPage()
    pdf.save()
    return buffer.getvalue()


class ApplicationsPdfExportView(Base):
    """GET /api/exports/applications/pdf/: the filtered applications as a PDF table (FR-37)."""

    @extend_schema(parameters=FILTERS, responses={(200, "application/pdf"): OpenApiTypes.BINARY})
    def get(self, request):
        applications = filter_applications(with_details(Application.objects.all()), request.query_params)
        full_rows = [export_row(application) for application in applications.order_by("pk")]
        rows = [[row[i] for i in PDF_COLUMNS] for row in full_rows]
        headers = [EXPORT_COLUMNS[i] for i in PDF_COLUMNS]
        content = table_pdf("قائمة الطلبات", headers, rows, PDF_WIDTHS)
        response = HttpResponse(content, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="applications-{timezone.localdate():%Y-%m-%d}.pdf"'
        return response