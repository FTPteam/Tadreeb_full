from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from applications.status import ACTIVE_PLACEMENT, Status

from .models import DailyLog, Report, TrainingPlan, Visit, WeeklyGoal


class DailyLogSerializer(serializers.ModelSerializer):
    """FR-20: the student writes a training day on their own application."""

    class Meta:
        model = DailyLog
        fields = [
            "id",
            "application",
            "date",
            "hours",
            "tasks",
            "notes",
            "is_excused",
            "absence_reason",
            "confirmed_at",
            "created_at",
        ]
        # The provider confirms a day (BR-05); the student can't set this.
        read_only_fields = ["confirmed_at", "created_at"]

    def validate_application(self, application):
        user = self.context["request"].user
        if application.student_id != user.id:
            raise serializers.ValidationError("هذا الطلب ليس طلبك.")
        if application.status != Status.IN_TRAINING:
            raise serializers.ValidationError(
                "السجل اليومي يُفتح فقط عندما يكون الطلب «قيد التدريب»."
            )
        return application

    def validate_date(self, value):
        if value > timezone.localdate():
            raise serializers.ValidationError("لا يمكن تسجيل يوم في المستقبل.")
        return value

    def validate(self, attrs):
        is_excused = attrs.get("is_excused", getattr(self.instance, "is_excused", False))
        reason = attrs.get("absence_reason", getattr(self.instance, "absence_reason", ""))
        tasks = attrs.get("tasks", getattr(self.instance, "tasks", ""))
        hours = attrs.get("hours", getattr(self.instance, "hours", Decimal("0")))

        if is_excused or reason:
            attrs["is_excused"] = True
            if not reason:
                attrs["absence_reason"] = "مرض"
            if not tasks:
                attrs["tasks"] = attrs["absence_reason"]
        else:
            if not tasks or not tasks.strip():
                raise serializers.ValidationError({"tasks": "اكتب المهام المنجزة في هذا اليوم."})
            if hours <= Decimal("0"):
                raise serializers.ValidationError({"hours": "عدد الساعات يجب أن يكون أكبر من صفر."})
        return attrs


class WeeklyGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyGoal
        fields = ["week_number", "goal"]
        extra_kwargs = {"week_number": {"min_value": 1}}


class TrainingPlanSerializer(serializers.ModelSerializer):
    """FR-19: weekly goals written by the student, approved by the supervisor."""

    goals = WeeklyGoalSerializer(many=True)

    class Meta:
        model = TrainingPlan
        fields = ["id", "application", "status", "goals", "approved_at", "created_at"]
        # The status only changes through the submit / approve actions.
        read_only_fields = ["status", "approved_at", "created_at"]

    def validate_application(self, application):
        if self.instance is not None:
            if application != self.instance.application:
                raise serializers.ValidationError("لا يمكن تغيير طلب الخطة.")
            return application
        user = self.context["request"].user
        if application.student_id != user.id:
            raise serializers.ValidationError("هذا الطلب ليس طلبك.")
        if application.status not in ACTIVE_PLACEMENT:
            raise serializers.ValidationError("تُكتب الخطة بعد توزيعك على جهة تدريب.")
        return application

    def validate_goals(self, goals):
        if not goals:
            raise serializers.ValidationError("أضف هدفاً أسبوعياً واحداً على الأقل.")
        weeks = [goal["week_number"] for goal in goals]
        if len(weeks) != len(set(weeks)):
            raise serializers.ValidationError("رقم الأسبوع مكرر.")
        return goals

    def create(self, validated_data):
        goals = validated_data.pop("goals")
        with transaction.atomic():
            plan = TrainingPlan.objects.create(**validated_data)
            WeeklyGoal.objects.bulk_create([WeeklyGoal(plan=plan, **goal) for goal in goals])
        return plan

    def update(self, plan, validated_data):
        # Only the goals can change; they are replaced as a whole.
        goals = validated_data.pop("goals", None)
        with transaction.atomic():
            if goals is not None:
                plan.goals.all().delete()
                WeeklyGoal.objects.bulk_create([WeeklyGoal(plan=plan, **goal) for goal in goals])
            plan.save()
        return plan


class VisitSerializer(serializers.ModelSerializer):
    """FR-24: a field visit recorded by the student's academic supervisor."""

    class Meta:
        model = Visit
        fields = ["id", "application", "supervisor", "date", "notes", "follow_up", "created_at"]
        # The supervisor is the person who records the visit.
        read_only_fields = ["supervisor", "created_at"]

    def validate_application(self, application):
        if self.instance is not None:
            if application != self.instance.application:
                raise serializers.ValidationError("لا يمكن تغيير طلب الزيارة.")
            return application
        user = self.context["request"].user
        if application.supervisor_id != user.id:
            raise serializers.ValidationError("هذا الطالب ليس من طلابك.")
        if application.status not in ACTIVE_PLACEMENT:
            raise serializers.ValidationError("تُسجَّل الزيارة بعد توزيع الطالب على جهة تدريب.")
        return application

    def validate_date(self, value):
        if value > timezone.localdate():
            raise serializers.ValidationError("لا يمكن تسجيل زيارة في المستقبل.")
        return value


class ProviderDailyLogSerializer(serializers.ModelSerializer):
    """BR-05: what the provider sees of a student's day before confirming it."""

    student_name = serializers.SerializerMethodField()
    university_id = serializers.CharField(source="application.student.username", read_only=True)

    class Meta:
        model = DailyLog
        fields = [
            "id",
            "application",
            "student_name",
            "university_id",
            "date",
            "hours",
            "tasks",
            "notes",
            "is_excused",
            "absence_reason",
            "confirmed_at",
        ]
        read_only_fields = fields

    def get_student_name(self, log) -> str:
        student = log.application.student
        return student.get_full_name() or student.username


# A student uploads reports while training and right after it ends (the final report).
REPORT_STATUSES = {Status.IN_TRAINING, Status.COMPLETED}
# Once the coordinator approved the training, the grades are final.
GRADES_LOCKED = {Status.APPROVED, Status.CERTIFIED}


class ReportSerializer(serializers.ModelSerializer):
    """FR-23: the student uploads; the grade and comment come from the supervisor."""

    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            "id",
            "application",
            "student_name",
            "title",
            "file",
            "notes",
            "submitted_at",
            "grade",
            "supervisor_comment",
            "graded_at",
        ]
        read_only_fields = ["submitted_at", "grade", "supervisor_comment", "graded_at"]

    def get_student_name(self, report) -> str:
        student = report.application.student
        return student.get_full_name() or student.username

    def validate_application(self, application):
        user = self.context["request"].user
        if application.student_id != user.id:
            raise serializers.ValidationError("هذا الطلب ليس طلبك.")
        if application.status not in REPORT_STATUSES:
            raise serializers.ValidationError("تُرفع التقارير أثناء التدريب أو بعد انتهائه مباشرة.")
        return application


class ReportGradeSerializer(serializers.Serializer):
    grade = serializers.DecimalField(
        max_digits=5, decimal_places=2, min_value=Decimal("0"), max_value=Decimal("100")
    )
    supervisor_comment = serializers.CharField(required=False, allow_blank=True, default="")


class DailyAttendanceItemSerializer(serializers.Serializer):
    date = serializers.CharField()
    day = serializers.CharField()
    status = serializers.CharField()
    status_code = serializers.CharField()
    notes = serializers.CharField()
    hours = serializers.FloatField()
    is_working_day = serializers.BooleanField()
    confirmed = serializers.BooleanField()


class AttendanceSerializer(serializers.Serializer):
    """FR-21 / FR-22: attendance rate and daily breakdown for the attendance page."""
    attendance_rate = serializers.FloatField()
    confirmed_days = serializers.IntegerField()
    absent_days = serializers.IntegerField()
    excused_days = serializers.IntegerField()
    working_days = serializers.IntegerField()
    total_calendar_working_days = serializers.IntegerField()
    alert = serializers.BooleanField()
    start_date = serializers.DateField(allow_null=True)
    end_date = serializers.DateField(allow_null=True)
    daily_breakdown = DailyAttendanceItemSerializer(many=True)
