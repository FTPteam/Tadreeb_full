from django.conf import settings
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.utils import timezone
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, serializers, viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import action, api_view, authentication_classes, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from accounts.models import User
from accounts.permissions import IsCoordinator
from applications.models import Placement
from applications.status import TransitionError
from audit.models import AuditLog, diff, log_action, snapshot
from notifications.models import Notification, notify

from .models import Certificate
from .pdf import certificate_pdf, guidance_letter
from .serializers import (
    CertificateSerializer,
    CertificateVerificationSerializer,
    IssueCertificateSerializer,
    RevokeCertificateSerializer,
)
from .services import issue_certificate

MANAGERS = (User.Role.COORDINATOR, User.Role.ADMIN)
PDF_RESPONSE = {(200, "application/pdf"): OpenApiTypes.BINARY}


def pdf_response(content, filename):
    response = HttpResponse(content, content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response


def verify_url(request, certificate):
    """Where the QR code points: the front-end page if configured, otherwise the back-end's page."""
    if settings.TADREEB_CERTIFICATE_VERIFY_URL:
        return settings.TADREEB_CERTIFICATE_VERIFY_URL.format(code=certificate.verification_code)
    return request.build_absolute_uri(
        reverse("certificate-verify-page", args=[certificate.verification_code])
    )


class CertificateViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """/api/certificates/: training certificates (FR-34, BR-07).

    A certificate is issued by itself when the coordinator approves the training; POST is
    for an approved application that has none yet. The student sees their own, the
    supervisor their students', the coordinator and admin all of them.
    """

    serializer_class = CertificateSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_permissions(self):
        if self.action in ("create", "revoke"):
            return [IsCoordinator()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Certificate.objects.none()
        certificates = Certificate.objects.all()
        user = self.request.user
        if user.role == User.Role.STUDENT:
            return certificates.filter(application__student=user)
        if user.role == User.Role.SUPERVISOR:
            return certificates.filter(application__supervisor=user)
        if user.role in MANAGERS:
            search = self.request.query_params.get("search")
            if search:
                certificates = certificates.filter(
                    Q(serial_number__icontains=search)
                    | Q(student_name__icontains=search)
                    | Q(university_id__icontains=search)
                )
            return certificates
        return certificates.none()

    @extend_schema(request=IssueCertificateSerializer, responses={201: CertificateSerializer})
    def create(self, request):
        """POST /api/certificates/: issue the certificate of an approved application."""
        data = IssueCertificateSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        try:
            certificate = issue_certificate(data.validated_data["application"], request.user)
        except TransitionError as error:
            raise serializers.ValidationError(str(error))
        log_action(request, AuditLog.Action.CREATE, certificate, diff(None, snapshot(certificate)))
        return Response(self.get_serializer(certificate).data, status=201)

    @extend_schema(request=RevokeCertificateSerializer, responses=CertificateSerializer)
    @action(detail=True, methods=["post"])
    def revoke(self, request, pk=None):
        """POST /api/certificates/<id>/revoke/: cancel a certificate; the public check then shows it as invalid."""
        certificate = self.get_object()
        if certificate.revoked_at:
            raise serializers.ValidationError("هذه الشهادة ملغاة من قبل.")
        data = RevokeCertificateSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        before = snapshot(certificate)
        certificate.revoked_at = timezone.now()
        certificate.revoke_reason = data.validated_data["reason"]
        certificate.revoked_by = request.user
        certificate.save()
        log_action(request, AuditLog.Action.UPDATE, certificate, diff(before, snapshot(certificate)))
        notify(
            certificate.application.student,
            Notification.Kind.APPLICATION,
            "تم إلغاء شهادة التدريب",
            certificate.revoke_reason,
        )
        return Response(self.get_serializer(certificate).data)

    @extend_schema(responses=PDF_RESPONSE)
    @action(detail=True, methods=["get"])
    def pdf(self, request, pk=None):
        """GET /api/certificates/<id>/pdf/: download the certificate with its QR code."""
        certificate = self.get_object()
        if not certificate.is_valid and request.user.role not in MANAGERS:
            raise NotFound("هذه الشهادة ملغاة.")
        content = certificate_pdf(certificate, verify_url(request, certificate))
        return pdf_response(content, f"{certificate.serial_number}.pdf")


@extend_schema(responses=CertificateVerificationSerializer)
@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def verify_certificate(request, code):
    """GET /api/certificates/verify/<code>/: public check of a certificate (FR-35), no login."""
    certificate = get_object_or_404(Certificate, verification_code=code)
    return Response(CertificateVerificationSerializer(certificate).data)


def verify_certificate_page(request, code):
    """/verify/<code>/: the page the QR code opens when no front-end page is configured (FR-35)."""
    certificate = Certificate.objects.filter(verification_code=code).first()
    return render(
        request,
        "certificates/verify.html",
        {"certificate": certificate, "institution": settings.TADREEB_INSTITUTION_NAME},
        status=200 if certificate else 404,
    )


def can_see_placement(user, placement):
    application = placement.application
    if user.role in MANAGERS:
        return True
    if user.role == User.Role.STUDENT:
        return application.student_id == user.id
    if user.role == User.Role.SUPERVISOR:
        return application.supervisor_id == user.id
    if user.role == User.Role.PROVIDER:
        return placement.opportunity.provider.user_id == user.id
    return False


@extend_schema(responses=PDF_RESPONSE)
@api_view(["GET"])
def placement_letter(request, pk):
    """GET /api/placements/<id>/letter/: the guidance letter PDF for a placement (FR-17).

    For the student, their supervisor, the provider that hosts them, and the coordinator.
    """
    placement = Placement.objects.select_related(
        "application__student__student_profile__department",
        "application__student__student_profile__specialization",
        "application__supervisor",
        "opportunity__provider",
    ).filter(pk=pk).first()
    if placement is None or not can_see_placement(request.user, placement):
        raise NotFound()
    return pdf_response(guidance_letter(placement), f"guidance-letter-{placement.pk}.pdf")
