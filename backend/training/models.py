from decimal import Decimal

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from accounts.validators import validate_upload
from applications.status import Status
from notifications.models import Notification, notify


class DailyLog(models.Model):
    """FR-20 / BR-05: one training day written by the student, then confirmed by the provider."""
    application = models.ForeignKey(
        "applications.Application", on_delete=models.CASCADE, related_name="daily_logs"
    )
    date = models.DateField()
    hours = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0")), MaxValueValidator(Decimal("12"))],
        default=Decimal("0"),
    )
    tasks = models.TextField(blank=True, default="")
    # FR-22 / BR-05: excused absence / sick leave (مرض / عذر مرضي).
    is_excused = models.BooleanField(default=False)
    absence_reason = models.CharField(max_length=255, blank=True, default="")
    notes = models.TextField(blank=True)

    # BR-05: the provider confirms each day; empty means not confirmed yet.
    confirmed_at = models.DateTimeField(null=True, blank=True)
    confirmed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="confirmed_daily_logs",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]
        constraints = [
            models.UniqueConstraint(fields=["application", "date"], name="one_log_per_day"),
        ]

    def __str__(self):
        return f"{self.application} - {self.date}"


class TrainingPlan(models.Model):
    """FR-19: the student's plan for the training, approved by the academic supervisor."""

    class Status(models.TextChoices):
        DRAFT = "draft", "مسودة"
        SUBMITTED = "submitted", "بانتظار الاعتماد"
        APPROVED = "approved", "معتمدة"

    application = models.OneToOneField(
        "applications.Application", on_delete=models.CASCADE, related_name="training_plan"
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_training_plans",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"خطة {self.application}"


class WeeklyGoal(models.Model):
    """One week of a training plan."""

    plan = models.ForeignKey(TrainingPlan, on_delete=models.CASCADE, related_name="goals")
    week_number = models.PositiveSmallIntegerField()
    goal = models.TextField()

    class Meta:
        ordering = ["week_number"]
        constraints = [
            models.UniqueConstraint(fields=["plan", "week_number"], name="one_goal_per_week"),
        ]

    def __str__(self):
        return f"أسبوع {self.week_number}"


class Visit(models.Model):
    """FR-24: a field visit recorded by the academic supervisor."""

    application = models.ForeignKey(
        "applications.Application", on_delete=models.CASCADE, related_name="visits"
    )
    supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="field_visits",
    )
    date = models.DateField()
    notes = models.TextField()
    follow_up = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-id"]

    def __str__(self):
        return f"زيارة {self.application} - {self.date}"

class Report(models.Model):
    """FR-23: a training report uploaded by the student, commented on and graded by the supervisor.

    The grades feed the reports' share of the final grade (BR-04).
    """

    application = models.ForeignKey(
        "applications.Application", on_delete=models.CASCADE, related_name="reports"
    )
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to="reports/", validators=[validate_upload])
    notes = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    # Filled in by the academic supervisor; empty grade means not graded yet.
    grade = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0")), MaxValueValidator(Decimal("100"))],
    )
    supervisor_comment = models.TextField(blank=True)
    graded_at = models.DateTimeField(null=True, blank=True)
    graded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="graded_reports",
    )

    class Meta:
        ordering = ["-submitted_at", "-id"]

    def __str__(self):
        return f"{self.title} - {self.application}"


def average_report_grade(application):
    """The mean of the graded reports out of 100, or None if none is graded yet (BR-04)."""
    return application.reports.filter(grade__isnull=False).aggregate(avg=models.Avg("grade"))["avg"]


def confirmed_hours(application):
    """Hours of the days the provider confirmed (BR-05)."""
    return application.daily_logs.filter(confirmed_at__isnull=False).aggregate(
        total=models.Sum("hours")
    )["total"] or Decimal("0")


def required_hours(application):
    """BR-06 / D-08: the training hours the student's department requires."""
    profile = getattr(application.student, "student_profile", None)
    department = profile.department if profile else None
    if department and department.required_training_hours:
        return department.required_training_hours
    return settings.TADREEB_REQUIRED_TRAINING_HOURS


def complete_if_done(application):
    """BR-06: once the confirmed hours reach the requirement, the system marks the training completed.

    Returns True if the application moved to completed.
    """
    if application.status != Status.IN_TRAINING:
        return False
    required = required_hours(application)
    if confirmed_hours(application) < required:
        return False
    application.move_to(Status.COMPLETED)
    message = f"اكتملت {required} ساعة تدريب مؤكدة."
    notify(application.student, Notification.Kind.TRAINING, "اكتمل تدريبك", message)
    if application.supervisor:
        student = application.student
        notify(
            application.supervisor,
            Notification.Kind.TRAINING,
            "اكتمل تدريب طالب",
            f"{student.get_full_name() or student.username}: {message}",
        )
    return True
