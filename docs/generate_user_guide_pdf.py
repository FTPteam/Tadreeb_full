"""Generate a professional Arabic PDF user guide for Tadreeb from USER_GUIDE.md."""

import sys
from pathlib import Path

# Add backend to sys.path so we can import certificates.pdf
BACKEND = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND))

import django
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics

from certificates.pdf import register_fonts, ar, wrap, REGULAR, BOLD, BRAND

PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN_X = 2.0 * cm
TOP_MARGIN = 2.5 * cm
BOTTOM_MARGIN = 2.5 * cm
USABLE_WIDTH = PAGE_WIDTH - 2 * MARGIN_X


class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        # Header line (pages > 1)
        if self._pageNumber > 1:
            self.setStrokeColor(colors.HexColor("#D0D7DE"))
            self.setLineWidth(0.75)
            self.line(MARGIN_X, PAGE_HEIGHT - 1.8 * cm, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 1.8 * cm)

            self.setFont(REGULAR, 8)
            self.setFillColor(colors.HexColor("#57606A"))
            self.drawRightString(PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 1.6 * cm, ar("منصة تدريب — دليل المستخدم"))
            self.drawString(MARGIN_X, PAGE_HEIGHT - 1.6 * cm, ar("كلية الدراسات المتوسطة · جامعة الأزهر"))

        # Footer
        self.setStrokeColor(colors.HexColor("#D0D7DE"))
        self.setLineWidth(0.75)
        self.line(MARGIN_X, 1.8 * cm, PAGE_WIDTH - MARGIN_X, 1.8 * cm)

        self.setFont(REGULAR, 8)
        self.setFillColor(colors.HexColor("#57606A"))
        self.drawRightString(PAGE_WIDTH - MARGIN_X, 1.3 * cm, ar("Codemap × Taqat"))
        page_str = f"{self._pageNumber} / {total_pages}"
        self.drawCentredString(PAGE_WIDTH / 2, 1.3 * cm, page_str)


def build_user_guide_pdf():
    register_fonts()
    md_path = Path(__file__).resolve().parent / "USER_GUIDE.md"
    pdf_path = Path(__file__).resolve().parent / "USER_GUIDE.pdf"

    with open(md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    c = NumberedCanvas(str(pdf_path), pagesize=A4)
    y = PAGE_HEIGHT - TOP_MARGIN

    def check_page_break(needed_space=1.2 * cm):
        nonlocal y
        if y - needed_space < BOTTOM_MARGIN:
            c.showPage()
            y = PAGE_HEIGHT - TOP_MARGIN

    # Cover Header on page 1
    c.setFillColor(BRAND)
    c.rect(MARGIN_X, y - 2.8 * cm, USABLE_WIDTH, 2.8 * cm, stroke=0, fill=1)
    
    c.setFillColor(colors.white)
    c.setFont(BOLD, 20)
    c.drawRightString(PAGE_WIDTH - MARGIN_X - 0.6 * cm, y - 1.1 * cm, ar("دليل المستخدم لمنصة تدريب"))
    
    c.setFont(REGULAR, 11)
    c.drawRightString(PAGE_WIDTH - MARGIN_X - 0.6 * cm, y - 1.9 * cm, ar("منصة إدارة التدريب الميداني — كلية الدراسات المتوسطة، جامعة الأزهر – غزة"))
    c.drawRightString(PAGE_WIDTH - MARGIN_X - 0.6 * cm, y - 2.4 * cm, ar("برنامج Codemap × طاقات · الإصدار 2.0 (أكتوبر 2026)"))

    y -= 3.5 * cm

    lines = md_text.splitlines()
    for line in lines:
        line_str = line.strip()
        if not line_str:
            y -= 0.25 * cm
            continue

        if line_str.startswith("# "):
            # Title already drawn in banner
            continue

        elif line_str.startswith("## "):
            check_page_break(1.8 * cm)
            heading = line_str[3:].strip()
            y -= 0.3 * cm
            c.setFillColor(BRAND)
            c.setFont(BOLD, 14)
            c.drawRightString(PAGE_WIDTH - MARGIN_X, y, ar(heading))
            y -= 0.2 * cm
            c.setStrokeColor(BRAND)
            c.setLineWidth(1.2)
            c.line(MARGIN_X, y, PAGE_WIDTH - MARGIN_X, y)
            y -= 0.5 * cm

        elif line_str.startswith("### "):
            check_page_break(1.3 * cm)
            subheading = line_str[4:].strip()
            y -= 0.2 * cm
            c.setFillColor(colors.HexColor("#0969DA"))
            c.setFont(BOLD, 11)
            c.drawRightString(PAGE_WIDTH - MARGIN_X, y, ar(subheading))
            y -= 0.45 * cm

        elif line_str.startswith("---"):
            check_page_break(0.5 * cm)
            c.setStrokeColor(colors.HexColor("#E1E4E8"))
            c.setLineWidth(0.5)
            c.line(MARGIN_X, y, PAGE_WIDTH - MARGIN_X, y)
            y -= 0.4 * cm

        elif line_str.startswith("- ") or line_str.startswith("* "):
            check_page_break(0.7 * cm)
            bullet_text = line_str[2:].strip()
            wrapped_lines = wrap(bullet_text, REGULAR, 9.5, USABLE_WIDTH - 0.6 * cm)
            for i, wl in enumerate(wrapped_lines):
                check_page_break(0.5 * cm)
                c.setFont(REGULAR, 9.5)
                c.setFillColor(colors.HexColor("#24292F"))
                c.drawRightString(PAGE_WIDTH - MARGIN_X - 0.5 * cm, y, ar(wl))
                if i == 0:
                    c.setFillColor(BRAND)
                    c.circle(PAGE_WIDTH - MARGIN_X - 0.2 * cm, y + 0.1 * cm, 1.5, stroke=0, fill=1)
                y -= 0.45 * cm

        else:
            wrapped_lines = wrap(line_str, REGULAR, 9.5, USABLE_WIDTH)
            for wl in wrapped_lines:
                check_page_break(0.5 * cm)
                c.setFont(REGULAR, 9.5)
                c.setFillColor(colors.HexColor("#24292F"))
                c.drawRightString(PAGE_WIDTH - MARGIN_X, y, ar(wl))
                y -= 0.45 * cm

    c.save()
    print(f"Generated user guide at {pdf_path}")


if __name__ == "__main__":
    build_user_guide_pdf()
