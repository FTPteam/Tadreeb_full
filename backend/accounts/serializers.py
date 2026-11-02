from django.conf import settings
from drf_spectacular.utils import extend_schema_field, inline_serializer
from rest_framework import exceptions, serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .eligibility import check_eligibility
from .lockout import clear_login_lockout, is_locked_out, normalize_login_identifier, record_failed_login
from .models import Department, Specialization, StudentProfile, User


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
