"""Statistics (FR-36), Excel export (FR-37) and the archive search (FR-39).

All three are for the coordinator and the admin, and accept the same filters
(see filter_applications) so the numbers, the export and the archive agree.
"""

from io import BytesIO

from django.db.models import Avg, Count, F, Q, Sum
from django.http import HttpResponse
from django.utils import timezone
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from openpyxl import Workbook
from rest_framework import mixins, viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from accounts.models import User
from accounts.permissions import HasRole, IsCoordinator, IsProvider, IsSupervisor
from applications.models import Application, ExceptionRequest, Placement
from applications.status import Status
from certificates.models import Certificate
from evaluations.grades import combine
from evaluations.models import Evaluation
from imports.students import XLSX_CONTENT_TYPE
from providers.models import Opportunity, Provider
from training.attendance import calculate_attendance
from training.models import DailyLog, Report, TrainingPlan

from .serializers import (
    ArchiveSerializer,
    ProviderStatsSerializer,
    StatsSerializer,
    SupervisorStatsSerializer,
    confirmed_hours,
    last_placement,
)

# FR-39: the files that are finished and only kept for looking up.
ARCHIVED_STATUSES = [Status.CERTIFIED, Status.REJECTED, Status.WITHDRAWN]

FILTERS = [
    OpenApiParameter("year", OpenApiTypes.INT, description="سنة إنشاء الطلب"),
    OpenApiParameter("department", OpenApiTypes.INT, description="رقم القسم"),
    OpenApiParameter("provider", OpenApiTypes.INT, description="رقم جهة التدريب"),
    OpenApiParameter("status", OpenApiTypes.STR, enum=Status.values),
    OpenApiParameter("search", OpenApiTypes.STR, description="اسم الطالب أو رقمه الجامعي"),
]


class CanSeeReports(IsCoordinator):
    message = "الإحصائيات والتقارير متاحة لمنسق التدريب ومدير النظام فقط."


class CanSeeStats(HasRole):
    roles = (User.Role.COORDINATOR, User.Role.ADMIN, User.Role.SUPERVISOR, User.Role.PROVIDER)
    message = "لوحة المعلومات متاحة للمشرفين والجهات ومنسقي التدريب والمدراء."


def filter_applications(applications, params):
    if params.get("year", "").isdigit():
        applications = applications.filter(created_at__year=params["year"])
    if params.get("department", "").isdigit():
        applications = applications.filter(student__student_profile__department_id=params["department"])
    if params.get("provider", "").isdigit():
        applications = applications.filter(
            placements__opportunity__provider_id=params["provider"]
        ).distinct()
    if params.get("status"):
        applications = applications.filter(status=params["status"])
    search = params.get("search")
    if search:
        applications = applications.filter(
            Q(student__username__icontains=search)
            | Q(student__first_name__icontains=search)
            | Q(student__last_name__icontains=search)
        )
    return applications


def with_details(applications):
    return applications.select_related(
        "student__student_profile__department",
        "student__student_profile__specialization",
        "supervisor",
        "certificate",
    ).prefetch_related("placements__opportunity__provider", "daily_logs", "reports", "evaluations")


class Base(APIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [CanSeeReports]


class StatsView(Base):
    """GET /api/stats/: role-based dashboard for coordinator, supervisor, or provider (FR-36)."""

    permission_classes = [CanSeeStats]

    @extend_schema(parameters=FILTERS, responses=StatsSerializer)
    def get(self, request):
        user = request.user
        if user.role == User.Role.SUPERVISOR:
            return self.get_supervisor_stats(request)
        elif user.role == User.Role.PROVIDER:
            return self.get_provider_stats(request)
        return self.get_coordinator_stats(request)

    def get_supervisor_stats(self, request):
        """FR-36: statistics and task checklist for academic supervisors."""
        supervisor = request.user
        applications = Application.objects.filter(supervisor=supervisor).select_related(
            "student", "student__student_profile__department"
        ).prefetch_related("placements__opportunity__provider")

        by_status = dict(
            applications.order_by().values_list("status").annotate(n=Count("id")).values_list("status", "n")
        )

        pending_plans_qs = TrainingPlan.objects.filter(
            application__supervisor=supervisor, status=TrainingPlan.Status.SUBMITTED
        ).select_related("application__student")
        pending_plans = [
            {
                "id": p.id,
                "application_id": p.application_id,
                "student_name": p.application.student.get_full_name() or p.application.student.username,
                "university_id": p.application.student.username,
                "created_at": str(p.created_at),
            }
            for p in pending_plans_qs
        ]

        pending_reports_qs = Report.objects.filter(
            application__supervisor=supervisor, grade__isnull=True
        ).select_related("application__student")
        pending_reports = [
            {
                "id": r.id,
                "application_id": r.application_id,
                "student_name": r.application.student.get_full_name() or r.application.student.username,
                "university_id": r.application.student.username,
                "title": r.title,
                "submitted_at": str(r.submitted_at),
            }
            for r in pending_reports_qs
        ]

        pending_exceptions_qs = ExceptionRequest.objects.filter(
            application__supervisor=supervisor, status=ExceptionRequest.State.PENDING
        ).select_related("application__student")
        pending_exceptions = [
            {
                "id": e.id,
                "application_id": e.application_id,
                "student_name": e.application.student.get_full_name() or e.application.student.username,
                "university_id": e.application.student.username,
                "kind": e.kind,
                "kind_display": e.get_kind_display(),
                "created_at": str(e.created_at),
            }
            for e in pending_exceptions_qs
        ]

        alert_students = []
        students_list = []
        for app in applications:
            active_p = app.active_placement
            prov_name = active_p.opportunity.provider.name if active_p else ""
            student_dict = {
                "application_id": app.id,
                "student_name": app.student.get_full_name() or app.student.username,
                "university_id": app.student.username,
                "status": app.status,
                "status_display": app.get_status_display(),
                "provider_name": prov_name,
            }
            if app.status == Status.IN_TRAINING:
                att = calculate_attendance(app)
                student_dict["attendance_rate"] = att["attendance_rate"]
                student_dict["alert"] = att["alert"]
                if att["alert"]:
                    alert_students.append({
                        "application_id": app.id,
                        "student_name": student_dict["student_name"],
                        "university_id": student_dict["university_id"],
                        "attendance_rate": att["attendance_rate"],
                    })
            students_list.append(student_dict)

        data = {
            "role": "supervisor",
            "total_students": applications.count(),
            "by_status": {code: by_status.get(code, 0) for code in Status.values},
            "pending_tasks": {
                "plans_to_approve": len(pending_plans),
                "reports_to_grade": len(pending_reports),
                "exceptions_to_decide": len(pending_exceptions),
                "attendance_alerts": len(alert_students),
            },
            "pending_plans": pending_plans,
            "pending_reports": pending_reports,
            "pending_exceptions": pending_exceptions,
            "alert_students": alert_students,
            "students": students_list,
        }
        return Response(SupervisorStatsSerializer(data).data)

    def get_provider_stats(self, request):
        """FR-36: statistics and task checklist for training providers."""
        provider_user = request.user
        provider = getattr(provider_user, "provider_profile", None)
        if not provider:
            provider = Provider.objects.filter(user=provider_user).first()
        provider_name = provider.name if provider else provider_user.username

        placements = Placement.objects.filter(
            opportunity__provider__user=provider_user
        ).select_related("application__student", "opportunity")

        active_placements = placements.filter(is_active=True)

        pending_logs_qs = DailyLog.objects.filter(
            application__placements__in=active_placements,
            date__gte=F("application__placements__start_date"),
            date__lte=F("application__placements__end_date"),
            confirmed_at__isnull=True,
        ).select_related("application__student").distinct()

        pending_logs = [
            {
                "id": log.id,
                "application_id": log.application_id,
                "student_name": log.application.student.get_full_name() or log.application.student.username,
                "university_id": log.application.student.username,
                "date": str(log.date),
                "hours": float(log.hours),
                "tasks": log.tasks,
                "is_excused": log.is_excused,
                "absence_reason": log.absence_reason,
            }
            for log in pending_logs_qs
        ]

        pending_acceptances_qs = active_placements.filter(provider_confirmed_at__isnull=True)
        pending_acceptances = [
            {
                "placement_id": p.id,
                "application_id": p.application_id,
                "student_name": p.application.student.get_full_name() or p.application.student.username,
                "university_id": p.application.student.username,
                "opportunity_title": p.opportunity.title,
                "start_date": str(p.start_date),
                "end_date": str(p.end_date),
            }
            for p in pending_acceptances_qs
        ]

        evaluated_app_ids = Evaluation.objects.filter(
            evaluator=provider_user, kind=Evaluation.Kind.PROVIDER
        ).values_list("application_id", flat=True)

        pending_evaluations_qs = active_placements.exclude(
            application_id__in=evaluated_app_ids
        )
        pending_evaluations = [
            {
                "application_id": p.application_id,
                "student_name": p.application.student.get_full_name() or p.application.student.username,
                "university_id": p.application.student.username,
                "opportunity_title": p.opportunity.title,
                "status": p.application.status,
            }
            for p in pending_evaluations_qs
        ]

        trainees_list = [
            {
                "application_id": p.application_id,
                "student_name": p.application.student.get_full_name() or p.application.student.username,
                "university_id": p.application.student.username,
                "opportunity_title": p.opportunity.title,
                "start_date": str(p.start_date),
                "end_date": str(p.end_date),
                "confirmed_hours": float(confirmed_hours(p.application)),
            }
            for p in active_placements
        ]

        data = {
            "role": "provider",
            "provider_name": provider_name,
            "active_trainees": active_placements.count(),
            "total_trainees": placements.values("application_id").distinct().count(),
            "pending_tasks": {
                "days_to_confirm": len(pending_logs),
                "students_to_accept": len(pending_acceptances),
                "evaluations_required": len(pending_evaluations),
            },
            "pending_logs": pending_logs,
            "pending_acceptances": pending_acceptances,
            "pending_evaluations": pending_evaluations,
            "trainees": trainees_list,
        }
        return Response(ProviderStatsSerializer(data).data)

    def get_coordinator_stats(self, request):
        applications = filter_applications(Application.objects.all(), request.query_params)
        by_status = dict(
            applications.order_by().values_list("status").annotate(n=Count("id")).values_list("status", "n")
        )
        logs = DailyLog.objects.filter(application__in=applications)
        reports = Report.objects.filter(application__in=applications)
        certificates = Certificate.objects.filter(application__in=applications)
        open_opportunities = Opportunity.objects.filter(status=Opportunity.Status.OPEN)
        active_placements = Placement.objects.filter(is_active=True, application__in=applications)

        by_department = (
            applications.values("student__student_profile__department__name")
            .annotate(
                applications=Count("id"),
                certified=Count("id", filter=Q(status=Status.CERTIFIED)),
            )
            .order_by("-applications")
        )
        by_provider = (
            Provider.objects.annotate(
                active_placements=Count(
                    "opportunities__placements",
                    filter=Q(
                        opportunities__placements__is_active=True,
                        opportunities__placements__application__in=applications,
                    ),
                )
            )
            .filter(active_placements__gt=0)
            .order_by("-active_placements")
            .values("id", "name", "active_placements")
        )
        seats = open_opportunities.aggregate(total=Sum("seats"))["total"] or 0
        taken = Placement.objects.filter(is_active=True, opportunity__in=open_opportunities).count()
        data = {
            "students": User.objects.filter(role=User.Role.STUDENT, is_active=True).count(),
            "applications": {
                "total": applications.count(),
                "by_status": {code: by_status.get(code, 0) for code in Status.values},
            },
            "providers": {
                "total": Provider.objects.count(),
                "approved": Provider.objects.filter(status=Provider.Status.APPROVED).count(),
            },
            "opportunities": {
                "open": open_opportunities.count(),
                "seats": seats,
                "free_seats": max(seats - taken, 0),
            },
            "placements": {"active": active_placements.count()},
            "training": {
                "confirmed_hours": logs.filter(confirmed_at__isnull=False).aggregate(t=Sum("hours"))["t"] or 0,
                "pending_days": logs.filter(confirmed_at__isnull=True).count(),
            },
            "reports": {
                "submitted": reports.count(),
                "graded": reports.filter(grade__isnull=False).count(),
                "average_grade": reports.aggregate(avg=Avg("grade"))["avg"],
            },
            "certificates": {
                "issued": certificates.count(),
                "revoked": certificates.filter(revoked_at__isnull=False).count(),
            },
            "by_department": [
                {
                    "department": row["student__student_profile__department__name"] or "",
                    "applications": row["applications"],
                    "certified": row["certified"],
                }
                for row in by_department
            ],
            "by_provider": list(by_provider),
        }
        return Response(StatsSerializer(data).data)


EXPORT_COLUMNS = [
    "رقم الطلب",
    "الرقم الجامعي",
    "اسم الطالب",
    "القسم",
    "التخصص",
    "الحالة",
    "جهة التدريب",
    "فرصة التدريب",
    "بداية التدريب",
    "نهاية التدريب",
    "المشرف الأكاديمي",
    "الساعات المؤكدة",
    "معدل التقارير",
    "الدرجة النهائية",
    "رقم الشهادة",
    "تاريخ التقديم",
]


def full_name(user):
    return (user.get_full_name() or user.username) if user else ""


def export_final_grade(application, report_grades):
    """BR-04's total from the prefetched evaluations and reports, without more queries."""
    totals = {evaluation.kind: evaluation.total for evaluation in application.evaluations.all()}
    reports = sum(report_grades) / len(report_grades) if report_grades else None
    return combine(totals.get(Evaluation.Kind.PROVIDER), totals.get(Evaluation.Kind.SUPERVISOR), reports)["total"]


def export_row(application):
    profile = getattr(application.student, "student_profile", None)
    placement = last_placement(application)
    grades = [r.grade for r in application.reports.all() if r.grade is not None]
    final = export_final_grade(application, grades)
    certificate = getattr(application, "certificate", None)
    return [
        application.pk,
        application.student.username,
        full_name(application.student),
        profile.department.name if profile and profile.department else "",
        profile.specialization.name if profile and profile.specialization else "",
        application.get_status_display(),
        placement.opportunity.provider.name if placement else "",
        placement.opportunity.title if placement else "",
        placement.start_date if placement else None,
        placement.end_date if placement else None,
        full_name(application.supervisor),
        float(confirmed_hours(application)),
        round(float(sum(grades) / len(grades)), 2) if grades else None,
        float(final) if final is not None else None,
        certificate.serial_number if certificate else "",
        timezone.localtime(application.submitted_at).date() if application.submitted_at else None,
    ]


class ApplicationsExportView(Base):
    """GET /api/exports/applications/: the filtered applications as an Excel sheet (FR-37)."""

    @extend_schema(parameters=FILTERS, responses={(200, XLSX_CONTENT_TYPE): OpenApiTypes.BINARY})
    def get(self, request):
        applications = filter_applications(with_details(Application.objects.all()), request.query_params)
        workbook = Workbook()
        sheet = workbook.active
        sheet.title = "الطلبات"
        sheet.sheet_view.rightToLeft = True
        sheet.append(EXPORT_COLUMNS)
        for application in applications.order_by("pk"):
            sheet.append(export_row(application))
        for column in sheet.columns:
            sheet.column_dimensions[column[0].column_letter].width = 18
        buffer = BytesIO()
        workbook.save(buffer)
        response = HttpResponse(buffer.getvalue(), content_type=XLSX_CONTENT_TYPE)
        response["Content-Disposition"] = (
            f'attachment; filename="applications-{timezone.localdate():%Y-%m-%d}.xlsx"'
        )
        return response


class ArchiveViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """/api/archive/: finished files (certified, rejected, withdrawn) to search later (FR-39)."""

    serializer_class = ArchiveSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [CanSeeReports]

    def get_queryset(self):
        archived = with_details(Application.objects.filter(status__in=ARCHIVED_STATUSES))
        return filter_applications(archived, self.request.query_params).order_by("-updated_at", "-id")

    @extend_schema(parameters=FILTERS)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class SupervisorStatsView(Base):
    permission_classes = [IsSupervisor]

    @extend_schema(responses=SupervisorStatsSerializer)
    def get(self, request):
        view = StatsView()
        return view.get_supervisor_stats(request)


class ProviderStatsView(Base):
    permission_classes = [IsProvider]

    @extend_schema(responses=ProviderStatsSerializer)
    def get(self, request):
        view = StatsView()
        return view.get_provider_stats(request)
