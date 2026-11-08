
"""Excel export of final evaluations for the logged-in academic supervisor."""

from io import BytesIO

from django.http import HttpResponse
from django.utils import timezone
from openpyxl import Workbook
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication

from accounts.models import User
from accounts.permissions import HasRole
from applications.models import Application
from evaluations.grades import combine
from evaluations.models import Evaluation
from training.models import average_report_grade


class IsAcademicSupervisor(HasRole):
    roles = (User.Role.SUPERVISOR,)


class FinalEvaluationsExportView(APIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated, IsAcademicSupervisor]

    def get(self, request):
        applications = (
            Application.objects.filter(supervisor=request.user)
            .select_related("student")
            .prefetch_related("evaluations", "reports")
            .order_by("pk")
        )

        workbook = Workbook()
        sheet = workbook.active
        sheet.title = "التقييمات النهائية"
        sheet.sheet_view.rightToLeft = True

        sheet.append([
            "الرقم الجامعي",
            "اسم الطالب",
            "تقييم جهة التدريب",
            "تقييم المشرف",
            "متوسط التقارير",
            "الدرجة النهائية",
            "حالة التقييم",
        ])

        for application in applications:
            evaluations = {
                evaluation.kind: evaluation.total
                for evaluation in application.evaluations.all()
            }

            provider_grade = evaluations.get(Evaluation.Kind.PROVIDER)
            supervisor_grade = evaluations.get(Evaluation.Kind.SUPERVISOR)
            reports_grade = average_report_grade(application)

            result = combine(
                provider_grade,
                supervisor_grade,
                reports_grade,
            )

            sheet.append([
                application.student.username,
                application.student.get_full_name()
                or application.student.username,
                float(provider_grade) if provider_grade is not None else None,
                float(supervisor_grade) if supervisor_grade is not None else None,
                float(reports_grade) if reports_grade is not None else None,
                float(result["total"]) if result["total"] is not None else None,
                "مكتمل" if result["total"] is not None else "غير مكتمل",
            ])

        for column in sheet.columns:
            sheet.column_dimensions[column[0].column_letter].width = 24

        buffer = BytesIO()
        workbook.save(buffer)

        response = HttpResponse(
            buffer.getvalue(),
            content_type=(
                "application/vnd.openxmlformats-officedocument."
                "spreadsheetml.sheet"
            ),
        )
        response["Content-Disposition"] = (
            f'attachment; filename="final-evaluations-'
            f'{timezone.localdate():%Y-%m-%d}.xlsx"'
        )
        return response
