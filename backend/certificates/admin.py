from django.contrib import admin
from django.shortcuts import get_object_or_404
from django.urls import path, reverse
from django.utils.html import format_html

from .models import Certificate
from .pdf import certificate_pdf
from .views import pdf_response, verify_url


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ["serial_number", "student_name", "provider_name", "issued_at", "pdf_link", "verify_link"]
    search_fields = ["serial_number", "student_name", "university_id"]
    readonly_fields = ["verification_code", "pdf_link", "verify_link"]

    def pdf_link(self, obj):
        url = reverse("admin:certificate-download-pdf", args=[obj.pk])
        return format_html(
            '<a class="button" style="background:#1F4E79;color:white;padding:4px 10px;border-radius:4px;text-decoration:none;" href="{}" target="_blank">📄 تحميل PDF</a>',
            url,
        )

    pdf_link.short_description = "الشهادة (PDF)"

    def verify_link(self, obj):
        url = reverse("certificate-verify-page", args=[obj.verification_code])
        return format_html(
            '<a style="color:#007bff;text-decoration:underline;" href="{}" target="_blank">🔍 فحص الـ QR</a>',
            url,
        )

    verify_link.short_description = "رابط التحقق العام"

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path("<int:pk>/pdf/", self.admin_site.admin_view(self.download_pdf), name="certificate-download-pdf"),
        ]
        return custom + urls

    def download_pdf(self, request, pk):
        certificate = get_object_or_404(Certificate, pk=pk)
        content = certificate_pdf(certificate, verify_url(request, certificate))
        return pdf_response(content, f"{certificate.serial_number}.pdf")
