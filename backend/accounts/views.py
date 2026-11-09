import logging

from django.conf import settings
from django.contrib.auth import password_validation
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import send_mail
from django.db.models import Count, Q
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import mixins, serializers, status, viewsets
from rest_framework.decorators import action, api_view, parser_classes, permission_classes
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from applications.status import Status
from audit.mixins import AuditMixin
from audit.models import AuditLog, log_action

from .lockout import clear_login_lockout
from .models import Department, StudentProfile, User
from .permissions import IsCoordinator, IsStaffRole, IsStudent, IsSystemAdmin
from .serializers import (
    COORDINATOR_MANAGES,
    DepartmentSerializer,
    LoginSerializer,
    MeSerializer,
    MessageResponseSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    SetPasswordSerializer,
    StudentProfileSerializer,
    StudentSelfUpdateSerializer,
    UserSerializer,
    check_password,
)

logger = logging.getLogger(__name__)


class LoginView(TokenObtainPairView):
    """POST /api/auth/login/: JWT login with 15-minute lockout after 5 failures (FR-01, NFR-05)."""

    serializer_class = LoginSerializer


class PasswordResetRequestView(APIView):
    """POST /api/auth/password-reset/: request a password reset email (FR-02)."""

    permission_classes = [AllowAny]

    @extend_schema(
        request=PasswordResetRequestSerializer,
        responses={200: MessageResponseSerializer},
        description="FR-02: Send a password reset link to the user's email if registered.",
    )
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if user:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            base_url = getattr(settings, "TADREEB_PASSWORD_RESET_URL", "")
            if base_url:
                reset_url = (
                    base_url.format(uid=uid, token=token)
                    if "{uid}" in base_url
                    else f"{base_url}?uid={uid}&token={token}"
                )
            else:
                reset_url = request.build_absolute_uri(
                    f"/api/auth/password-reset/confirm/?uid={uid}&token={token}"
                )

            name = user.get_full_name() or user.username
            subject = "استعادة كلمة المرور - منصة تدريب"
            body = (
                f"مرحبًا {name}،\n\n"
                f"تلقينا طلبًا لاستعادة كلمة المرور لحسابك في منصة تدريب.\n"
                f"يمكنك تعيين كلمة مرور جديدة من خلال الرابط التالي:\n"
                f"{reset_url}\n\n"
                f"إذا لم تطلب استعادة كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.\n"
            )
            try:
                send_mail(
                    subject=subject,
                    message=body,
                    from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
                    recipient_list=[user.email],
                    fail_silently=False,
                )
            except Exception:
                logger.exception("فشل إرسال بريد استعادة كلمة المرور للمستخدم %s", user.username)

        return Response(
            {"detail": "إذا كان البريد الإلكتروني مسجلًا لدينا، فستتلقى رابطًا لاستعادة كلمة المرور."}
        )


class PasswordResetConfirmView(APIView):
    """POST /api/auth/password-reset/confirm/: set a new password with the token (FR-02)."""

    permission_classes = [AllowAny]

    @extend_schema(
        request=PasswordResetConfirmSerializer,
        responses={200: MessageResponseSerializer},
        description="FR-02: Verify the token and set the new password.",
    )
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id, is_active=True)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is None or not default_token_generator.check_token(user, token):
            raise serializers.ValidationError(
                {"detail": "رابط استعادة كلمة المرور غير صالح أو منتهي الصلاحية."}
            )

        try:
            password_validation.validate_password(new_password, user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"new_password": list(exc.messages)})

        user.set_password(new_password)
        user.save(update_fields=["password"])
        clear_login_lockout(user.username)

        return Response(
            {"detail": "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول."}
        )


@extend_schema(responses=MeSerializer)
@api_view(["GET"])
def me(request):
    return Response(MeSerializer(request.user).data)


@extend_schema(methods=["GET"], responses=StudentProfileSerializer)
@extend_schema(
    methods=["PATCH"], request=StudentSelfUpdateSerializer, responses=StudentProfileSerializer
)
@api_view(["GET", "PATCH"])
@permission_classes([IsStudent])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def my_student_profile(request):
    """GET /api/students/me/: the logged-in student's profile and eligibility (FR-05, FR-06)."""
    profile, _ = StudentProfile.objects.get_or_create(user=request.user)
    if request.method == "PATCH":
        serializer = StudentSelfUpdateSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
    return Response(StudentProfileSerializer(profile, context={"request": request}).data)


class StudentViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """/api/students/: list, search, edit and delete students (supervisor, coordinator, admin)."""

    serializer_class = StudentProfileSerializer
    permission_classes = [IsStaffRole]
    http_method_names = ["get", "patch", "delete", "head", "options"]

    def get_permissions(self):
        if self.action == "destroy":
            return [IsCoordinator()]
        return [IsStaffRole()]

    def perform_destroy(self, profile):
        user = profile.user
        if user.applications.exists():
            raise ValidationError({
                "detail": "لا يمكن حذف هذا الطالب لأنه يمتلك طلبات تدريب محفوظة."
            })
        user.delete()

    def get_queryset(self):
        queryset = StudentProfile.objects.select_related(
            "user", "department", "specialization"
        ).order_by("user__username")
        params = self.request.query_params
        search = params.get("search")
        if search:
            queryset = queryset.filter(
                Q(user__username__icontains=search)
                | Q(user__first_name__icontains=search)
                | Q(user__last_name__icontains=search)
                | Q(user__email__icontains=search)
            )
        for field in ("department", "specialization", "academic_status"):
            if params.get(field):
                queryset = queryset.filter(**{field: params[field]})
        return queryset


class UserViewSet(
    AuditMixin,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """/api/users/: accounts (FR-03), and the supervisors to choose from (FR-18).

    - coordinator: students, supervisors and providers
    - admin: everyone; also changes roles and resets passwords
    Accounts aren't deleted, because their history stays: set is_active to false.
    Filters: ?role=supervisor  ?is_active=true  ?search=name, id or email
    """

    serializer_class = UserSerializer
    permission_classes = [IsCoordinator]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def perform_destroy(self, instance):
        if instance.role != User.Role.STUDENT:
            raise ValidationError({
                "detail": "الحذف مسموح لحسابات الطلاب فقط."
            })

        if instance.applications.exists():
            raise ValidationError({
                "detail": "لا يمكن حذف هذا الطالب لأنه يمتلك طلبات تدريب محفوظة."
            })

        instance.delete()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return User.objects.none()

        finished = [Status.REJECTED, Status.WITHDRAWN, Status.CERTIFIED]
        users = (
            User.objects.select_related("provider_profile")
            .annotate(
                students_count=Count(
                    "supervised_applications",
                    filter=~Q(supervised_applications__status__in=finished),
                )
            )
            .order_by("username")
        )
        if self.request.user.role != User.Role.ADMIN:
            users = users.filter(role__in=COORDINATOR_MANAGES)

        params = self.request.query_params
        if params.get("role"):
            users = users.filter(role=params["role"])
        if params.get("is_active"):
            users = users.filter(is_active=params["is_active"].lower() in ("1", "true"))
        if params.get("search"):
            search = params["search"]
            users = users.filter(
                Q(username__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
                | Q(email__icontains=search)
            )
        return users

    @extend_schema(
        parameters=[
            OpenApiParameter("role", str, description="e.g. supervisor"),
            OpenApiParameter("is_active", bool),
            OpenApiParameter("search", str),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(request=SetPasswordSerializer, responses={200: MessageResponseSerializer})
    @action(detail=True, methods=["post"], url_path="set-password", permission_classes=[IsSystemAdmin])
    def set_password(self, request, pk=None):
        """POST /api/users/<id>/set-password/: {"password": "..."}. The admin resets a password (FR-02)."""
        user = self.get_object()
        serializer = SetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = serializer.validated_data["password"]
        check_password(password, user)
        user.set_password(password)
        user.save(update_fields=["password"])
        clear_login_lockout(user.username)
        log_action(request, AuditLog.Action.UPDATE, user, {"reset_by_admin": {"from": None, "to": True}})
        return Response({"detail": "تم تعيين كلمة المرور."})


class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    """/api/departments/: departments with their specializations, for forms and filters."""

    queryset = Department.objects.prefetch_related("specializations").order_by("name")
    serializer_class = DepartmentSerializer
    pagination_class = None
