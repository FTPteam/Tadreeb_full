from rest_framework import serializers

from applications.models import Application

from .models import Certificate

# NFR-19: the minimum anyone holding the QR code may see. No university id or other details.
PUBLIC_FIELDS = [
    "serial_number",
    "student_name",
    "provider_name",
    "start_date",
    "end_date",
    "issued_at",
    "is_valid",
    "revoked_at",
]


class CertificateSerializer(serializers.ModelSerializer):
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = Certificate
        fields = [
            "id",
            "application",
            "verification_code",
            *PUBLIC_FIELDS,
            "university_id",
            "specialization",
            "opportunity_title",
            "total_hours",
            "revoke_reason",
        ]
        read_only_fields = fields


class CertificateVerificationSerializer(serializers.ModelSerializer):
    """FR-35: what anyone holding the QR code may see; the revoke reason stays internal."""

    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = Certificate
        fields = PUBLIC_FIELDS
        read_only_fields = fields


class IssueCertificateSerializer(serializers.Serializer):
    application = serializers.PrimaryKeyRelatedField(queryset=Application.objects.all())


class RevokeCertificateSerializer(serializers.Serializer):
    reason = serializers.CharField()
