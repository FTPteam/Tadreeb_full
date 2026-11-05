from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.utils import extend_schema, inline_serializer
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework import serializers

from analytics.views import ApplicationsExportView, ArchiveViewSet, StatsView
from analytics.pdf_export import ApplicationsPdfExportView
from accounts.views import (
    DepartmentViewSet,
    LoginView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    StudentViewSet,
    UserViewSet,
    me,
    my_student_profile,
)
from applications.views import ApplicationDocumentViewSet, ApplicationViewSet, ExceptionRequestViewSet
from audit.views import AuditLogViewSet
from evaluations.views import EvaluationViewSet, ProviderRatingViewSet
from certificates.views import (
    CertificateViewSet,
    placement_letter,
    verify_certificate,
    verify_certificate_page,
)
from notifications.views import NotificationViewSet
from providers.views import OpportunityViewSet, ProviderViewSet
from training.views import (
    DailyLogViewSet,
    ProviderDailyLogViewSet,
    ReportViewSet,
    TrainingPlanViewSet,
    VisitViewSet,
)

@extend_schema(
    responses=inline_serializer("Health", {"status": serializers.CharField()}),
)
@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "ok"})


router = DefaultRouter()
router.register("students", StudentViewSet, basename="student")
router.register("users", UserViewSet, basename="user")
router.register("departments", DepartmentViewSet, basename="department")
router.register("providers", ProviderViewSet, basename="provider")
router.register("opportunities", OpportunityViewSet, basename="opportunity")
router.register("notifications", NotificationViewSet, basename="notification")
router.register("applications", ApplicationViewSet, basename="application")
router.register("application-documents", ApplicationDocumentViewSet, basename="application-document")
router.register("exception-requests", ExceptionRequestViewSet, basename="exception-request")
router.register("audit-logs", AuditLogViewSet, basename="audit-log")
router.register("daily-logs", DailyLogViewSet, basename="daily-log")
router.register("training-plans", TrainingPlanViewSet, basename="training-plan")
router.register("provider-daily-logs", ProviderDailyLogViewSet, basename="provider-daily-log")
router.register("visits", VisitViewSet, basename="visit")
router.register("reports", ReportViewSet, basename="report")
router.register("certificates", CertificateViewSet, basename="certificate")
router.register("archive", ArchiveViewSet, basename="archive")
router.register("evaluations", EvaluationViewSet, basename="evaluation")
router.register("provider-ratings", ProviderRatingViewSet, basename="provider-rating")

urlpatterns = [
    # The bare address has no page of its own; send visitors to the API docs.
    path("", RedirectView.as_view(pattern_name="swagger-ui")),
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path("api/schema/", SpectacularAPIView.as_view(permission_classes=[AllowAny]), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema", permission_classes=[AllowAny]),
        name="swagger-ui",
    ),
    path("api/auth/login/", LoginView.as_view(), name="login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", me, name="auth_me"),
    path("api/auth/password-reset/", PasswordResetRequestView.as_view(), name="password_reset_request"),
    path("api/auth/password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    # Before the router, so "me" isn't read as a student id.
    path("api/students/me/", my_student_profile),
    path("api/imports/", include("imports.urls")),
    path("api/certificates/verify/<uuid:code>/", verify_certificate),
    path("verify/<uuid:code>/", verify_certificate_page, name="certificate-verify-page"),
    path("api/placements/<int:pk>/letter/", placement_letter),
    path("api/stats/", StatsView.as_view()),
    path("api/exports/applications/", ApplicationsExportView.as_view()),
    path("api/exports/applications/pdf/", ApplicationsPdfExportView.as_view()),
    path("api/", include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# NFR-10: friendly Arabic pages for "not found" and unexpected errors.
handler404 = "config.errors.not_found"
handler500 = "config.errors.server_error"
