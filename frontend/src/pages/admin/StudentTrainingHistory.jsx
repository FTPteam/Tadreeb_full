import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";

import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  Bell,
  Menu,
  ChevronLeft,
  ArrowRight,
  Check,
  Clock3,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";
import { getStudent } from "./studentsStore";

// =====================================================
// STUDENT TRAINING HISTORY
// =====================================================

export default function StudentTrainingHistory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // بيانات الطالب القادمة من صفحة تفاصيل الطالب
  const student = getStudent(id || location.state?.student?.id);

  const studentId = id || student?.id || "";

  const studentName =
    student?.name || "الطالب";

  // =====================================================
  // ACTIONS
  // =====================================================

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-admin-sidebar")
    );
  };

  // العودة إلى تفاصيل نفس الطالب
  const handleBackToStudentDetails = () => {
    if (!studentId) {
      navigate("/admin/students");
      return;
    }

    navigate(
      `/admin/students/${encodeURIComponent(studentId)}`,
      {
        state: {
          student: student || undefined,
        },
      }
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]"
    >
      {/* SIDEBAR */}
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader />

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1450px]">
            {/* BREADCRUMB */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B]">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="hover:text-[#09379A]"
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <button
                type="button"
                onClick={() => navigate("/admin/students")}
                className="hover:text-[#09379A]"
              >
                الطلاب
              </button>

              <ChevronLeft size={15} />

              <button
                type="button"
                onClick={handleBackToStudentDetails}
                className="hover:text-[#09379A]"
              >
                تفاصيل الطالب
              </button>

              <ChevronLeft size={15} />

              <span className="font-semibold text-[#111C2D]">
                سجل التدريب
              </span>
            </div>

            {/* PAGE TITLE */}
            <section className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row">
              <div>
                <h1 className="m-0 text-[27px] font-bold">
                  سجل تدريب الطالب
                </h1>

                <p className="m-0 mt-1 text-[13px] text-[#64748B]">
                  {studentName} - {studentId}
                </p>
              </div>

              {/* BACK TO STUDENT DETAILS */}
              <button
                type="button"
                onClick={handleBackToStudentDetails}
                className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px] transition hover:border-[#09379A] hover:text-[#09379A]"
              >
                <ArrowRight size={17} />
                تفاصيل الطالب
              </button>
            </section>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_390px]">
              {/* TRAINING PERIODS */}
              <section className="min-h-[385px] min-w-0 rounded-[12px] border border-[#E0E7F2] bg-white p-4 sm:p-6">
                <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                  فترات التدريب
                </h2>

                <div className="mt-4 overflow-x-auto rounded-[8px] border border-[#E0E7F2]">
                  <table className="w-full min-w-[650px] border-collapse text-right text-[11px]">
                    <thead className="bg-[#F1F5F9] text-[#64748B]">
                      <tr>
                        <th className="px-4 py-4">
                          الفصل
                        </th>

                        <th className="px-4 py-4">
                          جهة التدريب
                        </th>

                        <th className="px-4 py-4">
                          الفترة
                        </th>

                        <th className="px-4 py-4">
                          الحالة
                        </th>

                        <th className="px-4 py-4">
                          التقييم
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="border-t border-[#E6EBF5]">
                        <td className="px-4 py-5">
                          الثاني
                          <div>2024/2025</div>
                        </td>

                        <td className="px-4 py-5">
                          {student?.organization || "—"}
                        </td>

                        <td className="px-4 py-5">
                          {student?.startDate || "—"}
                          <div>
                            {student?.endDate || "—"}
                          </div>
                        </td>

                        <td className="px-4 py-5">
                          <TrainingStatus
                            status={student?.status || "غير محدد"}
                          />
                        </td>

                        <td className="px-4 py-5">
                          {student?.rating
                            ? `${Number(student.rating).toFixed(1)} / 5`
                            : "—"}
                        </td>
                      </tr>

                      <tr className="border-t border-[#E6EBF5]">
                        <td className="px-4 py-5">
                          الأول
                          <div>2024/2025</div>
                        </td>

                        <td className="px-4 py-5">—</td>
                        <td className="px-4 py-5">—</td>

                        <td className="px-4 py-5">
                          <TrainingStatus status="لم يلتحق" />
                        </td>

                        <td className="px-4 py-5">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* REQUEST TIMELINE */}
              <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-4 sm:p-6">
                <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                  مسار الطلب
                </h2>

                <div className="mt-4 space-y-5">
                  <Timeline
                    done
                    title="تقديم طلب التدريب"
                    text="2025/10/01 - شركة القدس للاتصالات"
                  />

                  <Timeline
                    done
                    title="قبول الطلب من المشرف"
                    text="2025/10/05 - د. سامر يوسف"
                  />

                  <Timeline
                    done
                    title="اعتماد التدريب"
                    text="2025/10/12"
                  />

                  <Timeline
                    done
                    title="بدء التدريب"
                    text="2025/12/01"
                  />

                  <Timeline
                    title="تقرير الأسبوع 3"
                    text="2025/12/22 - بانتظار المراجعة"
                  />
                </div>
              </section>
            </div>

            {/* FOOTER */}
            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}

// =====================================================
// TRAINING STATUS
// =====================================================

function TrainingStatus({ status }) {
  const styles = {
    "قيد التدريب": "bg-[#DDF6FF] text-[#08759B]",
    "منتهٍ": "bg-[#DCFCE7] text-[#15803D]",
    "لم يبدأ": "bg-[#F1F5F9] text-[#475569]",
    "بانتظار الاعتماد": "bg-[#FFF0E7] text-[#D95E24]",
    "مرفوض": "bg-[#FEE2E2] text-[#DC2626]",
    "لم يلتحق": "bg-[#F1F5F9] text-[#475569]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] ${
        styles[status] || styles["لم يلتحق"]
      }`}
    >
      <span className="h-[5px] w-[5px] rounded-full bg-current" />
      {status}
    </span>
  );
}

// =====================================================
// TIMELINE
// =====================================================

function Timeline({ done = false, title, text }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full ${
          done
            ? "bg-[#15803D] text-white"
            : "bg-[#E8EEF9] text-[#09379A]"
        }`}
      >
        {done ? (
          <Check size={16} />
        ) : (
          <Clock3 size={16} />
        )}
      </div>

      <div>
        <h3 className="m-0 text-[11px] font-bold">
          {title}
        </h3>

        <p className="m-0 mt-1 text-[11px] leading-5 text-[#64748B]">
          {text}
        </p>
      </div>
    </div>
  );
}

// =====================================================
// HEADER
// =====================================================


