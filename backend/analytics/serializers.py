from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from applications.models import Application


def last_placement(application):
    """The placement shown for an application: the active one, otherwise the latest."""
    placements = list(application.placements.all())
    active = [p for p in placements if p.is_active]
    return (active or placements or [None])[0]


def confirmed_hours(application):
    """Hours of the days the provider confirmed (BR-05)."""
    return sum((log.hours for log in application.daily_logs.all() if log.confirmed_at), 0)


class StatsSerializer(serializers.Serializer):
    """The shape of GET /api/stats/ (FR-36)."""

    students = serializers.IntegerField()
    applications = serializers.DictField()
    providers = serializers.DictField()
    opportunities = serializers.DictField()
    placements = serializers.DictField()
    training = serializers.DictField()
    reports = serializers.DictField()
    certificates = serializers.DictField()
    by_department = serializers.ListField(child=serializers.DictField())
    by_provider = serializers.ListField(child=serializers.DictField())


class ArchiveSerializer(serializers.ModelSerializer):
    """One finished application in the archive (FR-39)."""

    university_id = serializers.CharField(source="student.username")
    student_name = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    status_display = serializers.CharField(source="get_status_display")
    provider_name = serializers.SerializerMethodField()
    opportunity_title = serializers.SerializerMethodField()
    confirmed_hours = serializers.SerializerMethodField()
    certificate_serial = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            "id",
            "university_id",
            "student_name",
            "department",
            "status",
            "status_display",
            "status_reason",
            "provider_name",
            "opportunity_title",
            "confirmed_hours",
            "certificate_serial",
            "submitted_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_student_name(self, application) -> str:
        return application.student.get_full_name() or application.student.username

    def get_department(self, application) -> str:
        profile = getattr(application.student, "student_profile", None)
        return profile.department.name if profile and profile.department else ""

    def get_provider_name(self, application) -> str:
        placement = last_placement(application)
        return placement.opportunity.provider.name if placement else ""

    def get_opportunity_title(self, application) -> str:
        placement = last_placement(application)
        return placement.opportunity.title if placement else ""

    @extend_schema_field(serializers.DecimalField(max_digits=8, decimal_places=2))
    def get_confirmed_hours(self, application):
        return confirmed_hours(application)

    def get_certificate_serial(self, application) -> str:
        certificate = getattr(application, "certificate", None)
        return certificate.serial_number if certificate else ""


class SupervisorStatsSerializer(serializers.Serializer):
    """The shape of GET /api/stats/ for supervisors (FR-36)."""

    role = serializers.CharField(default="supervisor")
    total_students = serializers.IntegerField()
    by_status = serializers.DictField()
    pending_tasks = serializers.DictField()
    pending_plans = serializers.ListField(child=serializers.DictField())
    pending_reports = serializers.ListField(child=serializers.DictField())
    pending_exceptions = serializers.ListField(child=serializers.DictField())
    alert_students = serializers.ListField(child=serializers.DictField())
    students = serializers.ListField(child=serializers.DictField())


class ProviderStatsSerializer(serializers.Serializer):
    """The shape of GET /api/stats/ for providers (FR-36)."""

    role = serializers.CharField(default="provider")
    provider_name = serializers.CharField()
    active_trainees = serializers.IntegerField()
    total_trainees = serializers.IntegerField()
    pending_tasks = serializers.DictField()
    pending_logs = serializers.ListField(child=serializers.DictField())
    pending_acceptances = serializers.ListField(child=serializers.DictField())
    pending_evaluations = serializers.ListField(child=serializers.DictField())
    trainees = serializers.ListField(child=serializers.DictField())
