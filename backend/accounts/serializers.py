from django.conf import settings
from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from drf_spectacular.utils import extend_schema_field, inline_serializer
from rest_framework import exceptions, serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from providers.models import Provider

from .eligibility import check_eligibility
from .lockout import clear_login_lockout, is_locked_out, normalize_login_identifier, record_failed_login
from .models import Department, Specialization, StudentProfile, User

# What a coordinator may create and edit (FR-03). Coordinators and admins are the admin's
# alone (Section 2.2), so nobody can raise their own access.
COORDINATOR_MANAGES = (User.Role.STUDENT, User.Role.SUPERVISOR, User.Role.PROVIDER)


def check_password(password, user):
    try:
        password_validation.validate_password(password, user)
    except DjangoValidationError as error:
        raise serializers.ValidationError({"password": list(error.messages)})


class UserSerializer(serializers.ModelSerializer):
    """FR-03: one account. Without a password, the user sets one through "forgot password"
    (FR-02), which needs an email. `provider` links a provider account to its Provider."""

    full_name = serializers.CharField(source="get_full_name", read_only=True)
    role = serializers.ChoiceField(choices=User.Role.choices)
    role_display = serializers.CharField(source="get_role_display", read_only=True)
    password = serializers.CharField(write_only=True, required=False, style={"input_type": "password"})
    provider = serializers.PrimaryKeyRelatedField(
        source="provider_profile", queryset=Provider.objects.all(), required=False, allow_null=True
    )
    # Supervisors: how many students they follow now (Supervisors page).
    students_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "role",
            "role_display",
            "is_active",
            "provider",
            "students_count",
            "password",
            "last_login",
            "date_joined",
        ]
        read_only_fields = ["last_login", "date_joined"]

    def validate_email(self, email):
        others = User.objects.filter(email__iexact=email)
        if self.instance:
            others = others.exclude(pk=self.instance.pk)
        if email and others.exists():
            raise serializers.ValidationError("هذا البريد مستخدم لحساب آخر.")
        return email

    def validate(self, attrs):
        actor = self.context["request"].user
        role = attrs.get("role", self.instance.role if self.instance else None)

        if actor.role != User.Role.ADMIN:
            if role not in COORDINATOR_MANAGES:
                raise serializers.ValidationError({"role": "إدارة هذا الدور لمدير النظام فقط."})
            if self.instance and role != self.instance.role:
                raise serializers.ValidationError({"role": "تغيير الدور لمدير النظام فقط."})
        if self.instance == actor and (role != actor.role or attrs.get("is_active") is False):
            raise serializers.ValidationError("لا يمكنك تغيير دور حسابك أو تعطيله.")

        if self.instance:
            if "password" in attrs:
                raise serializers.ValidationError({"password": "تُغيَّر كلمة المرور من set-password."})
        elif attrs.get("password"):
            names = ("username", "email", "first_name", "last_name")
            check_password(attrs["password"], User(**{k: v for k, v in attrs.items() if k in names}))
        elif not attrs.get("email"):
            raise serializers.ValidationError(
                {"email": "البريد مطلوب إذا لم تحدد كلمة مرور، ليعيّنها المستخدم بنفسه."}
            )

        provider = attrs.get("provider_profile")
        if provider:
            if role != User.Role.PROVIDER:
                raise serializers.ValidationError({"provider": "الربط بجهة تدريب لحساب جهة فقط."})
            if provider.user_id and provider.user != self.instance:
                raise serializers.ValidationError({"provider": "هذه الجهة مرتبطة بحساب آخر."})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        provider = validated_data.pop("provider_profile", None)
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        if user.role == User.Role.STUDENT:
            StudentProfile.objects.get_or_create(user=user)
        if provider:
            self.link_provider(user, provider)
        return user

    @transaction.atomic
    def update(self, user, validated_data):
        relink = "provider_profile" in validated_data
        provider = validated_data.pop("provider_profile", None)
        user = super().update(user, validated_data)
        if user.role == User.Role.STUDENT:
            StudentProfile.objects.get_or_create(user=user)
        if relink or user.role != User.Role.PROVIDER:
            self.link_provider(user, provider)
        return user

    def link_provider(self, user, provider):
        """The account's provider is now `provider`; None removes the link."""
        Provider.objects.filter(user=user).update(user=None)
        user._state.fields_cache.pop("provider_profile", None)
        if provider:
            provider.user = user
            provider.save(update_fields=["user"])


class SetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(style={"input_type": "password"})


class MeSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "full_name", "role"]


class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ["id", "name"]


class DepartmentSerializer(serializers.ModelSerializer):
    specializations = SpecializationSerializer(many=True, read_only=True)

    class Meta:
        model = Department
        fields = ["id", "name", "required_training_hours", "specializations"]


class StudentProfileSerializer(serializers.ModelSerializer):
    """Read shape shared by the student (/api/students/me/) and staff (/api/students/)."""

    university_id = serializers.CharField(source="user.username", read_only=True)
    full_name = serializers.CharField(source="user.get_full_name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), allow_null=True, required=False
    )
    department_name = serializers.CharField(source="department.name", read_only=True, default=None)
    specialization = serializers.PrimaryKeyRelatedField(
        queryset=Specialization.objects.all(), allow_null=True, required=False
    )
    specialization_name = serializers.CharField(
        source="specialization.name", read_only=True, default=None
    )
    eligibility = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = [
            "id",
            "university_id",
            "full_name",
            "email",
            "phone",
            "department",
            "department_name",
            "specialization",
            "specialization_name",
            "completed_credit_hours",
            "gpa",
            "academic_status",
            "cv",
            "eligibility",
        ]

    @extend_schema_field(
        inline_serializer(
            "Eligibility",
            {
                "is_eligible": serializers.BooleanField(),
                "reasons": serializers.ListField(child=serializers.CharField()),
                "min_credit_hours": serializers.IntegerField(),
            },
        )
    )
    def get_eligibility(self, profile):
        is_eligible, reasons = check_eligibility(profile)
        return {
            "is_eligible": is_eligible,
            "reasons": reasons,
            "min_credit_hours": settings.TADREEB_MIN_CREDIT_HOURS,
        }

    def validate(self, attrs):
        department = attrs.get("department", getattr(self.instance, "department", None))
        specialization = attrs.get(
            "specialization", getattr(self.instance, "specialization", None)
        )
        if specialization and specialization.department_id != getattr(department, "id", None):
            raise serializers.ValidationError(
                {"specialization": ["التخصص لا يتبع القسم المختار."]}
            )
        return attrs


class StudentSelfUpdateSerializer(StudentProfileSerializer):
    """What a student may change about themselves: contact details and CV (FR-05)."""

    email = serializers.EmailField(source="user.email", required=False)

    class Meta(StudentProfileSerializer.Meta):
        read_only_fields = [
            "department",
            "specialization",
            "completed_credit_hours",
            "gpa",
            "academic_status",
        ]

    def update(self, profile, validated_data):
        user_data = validated_data.pop("user", {})
        if "email" in user_data:
            profile.user.email = user_data["email"]
            profile.user.save(update_fields=["email"])
        return super().update(profile, validated_data)


class LoginSerializer(TokenObtainPairSerializer):
    """FR-01 / NFR-05: login with username or email, locking out for 15 min after 5 failed attempts."""

    def validate(self, attrs):
        username = attrs.get(self.username_field)
        identifier = normalize_login_identifier(username)

        if is_locked_out(identifier):
            raise exceptions.AuthenticationFailed(
                "تم إيقاف تسجيل الدخول مؤقتًا لمدة 15 دقيقة بعد 5 محاولات فاشلة."
            )

        try:
            data = super().validate(attrs)
        except Exception:
            if record_failed_login(identifier):
                raise exceptions.AuthenticationFailed(
                    "تم إيقاف تسجيل الدخول مؤقتًا لمدة 15 دقيقة بعد 5 محاولات فاشلة."
                )
            raise

        clear_login_lockout(identifier)
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    """FR-02: request a password reset email."""

    email = serializers.EmailField(label="البريد الإلكتروني")


class PasswordResetConfirmSerializer(serializers.Serializer):
    """FR-02: set a new password using the email token."""

    uid = serializers.CharField(label="معرّف المستخدم")
    token = serializers.CharField(label="رمز التحقق")
    new_password = serializers.CharField(label="كلمة المرور الجديدة", min_length=8, write_only=True)


class MessageResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()
