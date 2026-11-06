import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";

import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Bell, Menu, ChevronLeft, ArrowRight, PlusSquare,
  Activity, CalendarCheck, FileText, Star,
  Check, Clock3, Eye, GraduationCap,
  AlertCircle, Download,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

import {
  getTrainingStudent,
  getProgress,
  getMonitoringStatus,
  STATUS_UI,
  getCompletionRequirements,
} from "./trainingMonitoringStore";

const TABS = [
  { id: "overview", label: "نظرة عامة" },
  { id: "attendance", label: "الحضور" },
  { id: "progress", label: "التقدم والتقارير" },
  { id: "evaluation", label: "التقييمات" },
];

export default function StudentTrainingDetails() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [student, setStudent] = useState(() =>
    getTrainingStudent(studentId)
  );

  const requestedTab = searchParams.get("tab") || "overview";
  const activeTab = TABS.some((tab) => tab.id === requestedTab)
    ? requestedTab
    : "overview";

  const [notice, setNotice] = useState("");

  useEffect(() => {
    const refresh = () =>
      setStudent(getTrainingStudent(studentId));

    refresh();

    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("training-monitoring-updated", refresh);
    window.addEventListener("admin-students-updated", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("training-monitoring-updated", refresh);
      window.removeEventListener("admin-students-updated", refresh);
    };
  }, [studentId]);

  const setTab = (tab) =>
    setSearchParams(tab === "overview" ? {} : { tab });

  const back = () => navigate("/admin/training-monitoring");

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]"
    >
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader />

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1450px]">
            {/* BREADCRUMB */}
            <nav className="mb-7 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B]">
              <button
                onClick={() => navigate("/admin/dashboard")}
              >
                الرئيسية
              </button>
              <ChevronLeft size={15} />
              <button onClick={back}>متابعة التدريب</button>
              <ChevronLeft size={15} />
              <span className="font-bold text-[#111C2D]">
                تفاصيل تدريب الطالب
              </span>
            </nav>

            {!student ? (
              <Panel title="الطالب غير موجود">
                <div className="py-8 text-center">
                  <AlertCircle
                    size={36}
                    className="mx-auto text-[#DC2626]"
                  />
                  <p className="mt-3 text-[12px]">
                    لم يتم العثور على سجل تدريب لهذا الطالب.
                  </p>
                  <button
                    onClick={back}
                    className="mt-4 rounded-lg bg-[#09379A] px-5 py-3 text-[12px] text-white"
                  >
                    العودة إلى المتابعة
                  </button>
                </div>
              </Panel>
            ) : (
              <>
                {/* TITLE */}
                <section className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="m-0 text-[26px] font-bold">
                      تفاصيل تدريب الطالب
                    </h1>
                    <p className="m-0 mt-1 text-[12px] text-[#64748B]">
                      {student.name} - {student.organization}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={back}
                      className="inline-flex h-[44px] items-center gap-2 rounded-lg border border-[#E0E7F2] bg-white px-4 text-[12px]"
                    >
                      <ArrowRight size={16} />
                      رجوع
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setNotice(
                          "إضافة الملاحظات ستُربط بسجل المشرف في مرحلة الـ Backend."
                        )
                      }
                      className="inline-flex h-[44px] items-center gap-2 rounded-lg border border-[#E0E7F2] bg-white px-4 text-[12px]"
                    >
                      <PlusSquare size={16} />
                      إضافة ملاحظة
                    </button>
                  </div>
                </section>

                {notice && (
                  <div className="mb-5 rounded-lg border border-[#E0E7F2] bg-white px-4 py-3 text-[12px] text-[#64748B]">
                    {notice}
                    <button
                      onClick={() => setNotice("")}
                      className="mr-4 font-bold text-[#09379A]"
                    >
                      إغلاق
                    </button>
                  </div>
                )}

                {/* STATS */}
                <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
                  <Stat
                    label="التقدم"
                    value={getProgress(student)}
                    unit="%"
                    icon={Activity}
                    color="blue"
                  />
                  <Stat
                    label="الحضور"
                    value={student.attendance}
                    unit="%"
                    icon={CalendarCheck}
                    color="green"
                  />
                  <Stat
                    label="التقارير"
                    value={`${student.reportsSubmitted} من ${student.reportsRequired}`}
                    icon={FileText}
                    color="orange"
                  />
                  <Stat
                    label="التقييم الميداني"
                    value={student.fieldScore ?? "—"}
                    unit="من 5"
                    icon={Star}
                    color="cyan"
                  />
                </section>

                {/* TABS */}
                <div className="mb-6 flex max-w-full gap-2 overflow-x-auto border-b border-[#E0E7F2] pb-3">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setTab(tab.id)}
                      className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-semibold transition ${
                        activeTab === tab.id
                          ? "bg-[#09379A] text-white"
                          : "border border-[#E0E7F2] bg-white text-[#64748B] hover:text-[#09379A]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB CONTENT */}
                {activeTab === "overview" && (
                  <Overview
                    student={student}
                    navigate={navigate}
                    setTab={setTab}
                  />
                )}

                {activeTab === "attendance" && (
                  <AttendanceTab student={student} />
                )}

                {activeTab === "progress" && (
                  <ProgressTab
                    student={student}
                    navigate={navigate}
                  />
                )}

                {activeTab === "evaluation" && (
                  <EvaluationTab
                    student={student}
                    navigate={navigate}
                  />
                )}
              </>
            )}

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}

// =====================================================
// OVERVIEW
// =====================================================

function Overview({ student, navigate, setTab }) {
  const status = getMonitoringStatus(student);
  const requirements = getCompletionRequirements(student);

  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_390px]">
      <div className="min-w-0 space-y-6">
        <Panel title="معلومات التدريب">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            <Info label="جهة التدريب" value={student.organization} />
            <Info label="المشرف الميداني" value={student.supervisor} />
            <Info label="البداية" value={student.startDate} />
            <Info label="النهاية" value={student.endDate} />
          </div>
        </Panel>

        <Panel title="التقدم">
          <div className="h-[12px] overflow-hidden rounded-full bg-[#E5EAF2]">
            <div
              className="h-full rounded-full bg-[#09379A]"
              style={{ width: `${getProgress(student)}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap justify-between gap-2 text-[12px] text-[#64748B]">
            <span>
              {student.completedHours} من {student.requiredHours} ساعة
            </span>
            <strong className="text-[#09379A]">
              {getProgress(student)}%
            </strong>
          </div>

          <button
            type="button"
            onClick={() => setTab("progress")}
            className="mt-4 text-[12px] font-semibold text-[#09379A]"
          >
            عرض التقدم والتقارير
            <ChevronLeft size={14} className="mr-1 inline" />
          </button>
        </Panel>

        <Panel title="حالة التدريب">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <StatusBadge status={status} />
            <button
              type="button"
              onClick={() => setTab("attendance")}
              className="text-[12px] font-semibold text-[#09379A]"
            >
              عرض سجل الحضور
              <ChevronLeft size={14} className="mr-1 inline" />
            </button>
          </div>
        </Panel>
      </div>

      <div className="min-w-0 space-y-6">
        <Panel title="مسار التدريب">
          {student.timeline?.length ? (
            <div className="space-y-5">
              {student.timeline.map((step, index) => (
                <div key={`${index}-${step.title}`} className="flex gap-3">
                  <span
                    className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full ${
                      step.completed
                        ? "bg-[#15803D] text-white"
                        : "bg-[#E8EEF9] text-[#09379A]"
                    }`}
                  >
                    {step.completed ? (
                      <Check size={16} />
                    ) : (
                      <Clock3 size={16} />
                    )}
                  </span>
                  <div>
                    <p className="m-0 text-[12px] font-bold">
                      {step.title}
                    </p>
                    <p className="m-0 mt-1 text-[11px] text-[#64748B]">
                      {step.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="m-0 text-[12px] text-[#64748B]">
              لا توجد أحداث مسجلة في مسار التدريب.
            </p>
          )}
        </Panel>

        <Panel title="استكمال التدريب">
          <div className="space-y-3">
            {requirements.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-2 text-[11px]"
              >
                {item.done ? (
                  <Check size={16} className="text-[#15803D]" />
                ) : (
                  <Clock3 size={16} className="text-[#64748B]" />
                )}
                {item.label}
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={
              student.status === "completed" ||
              !requirements.every((item) => item.done)
            }
            onClick={() =>
              navigate(
                `/admin/training-monitoring/${student.id}/complete`
              )
            }
            className="mt-5 inline-flex h-[43px] w-full items-center justify-center gap-2 rounded-lg bg-[#FF6534] px-4 text-[12px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#E5EAF2] disabled:text-[#64748B]"
          >
            <GraduationCap size={17} />
            {student.status === "completed"
              ? "تم إنهاء التدريب"
              : "إنهاء التدريب"}
          </button>
          {student.status === "completed" && (
            <button
              type="button"
              onClick={() => navigate(`/admin/training-monitoring/${student.id}/certificate`)}
              className="mt-3 inline-flex h-[43px] w-full items-center justify-center gap-2 rounded-lg border border-[#09379A] bg-white px-4 text-[12px] font-bold text-[#09379A]"
            >
              <GraduationCap size={17} />
              معاينة شهادة التدريب
            </button>
          )}
        </Panel>
      </div>
    </div>
  );
}

// =====================================================
// ATTENDANCE
// =====================================================

function AttendanceTab({ student }) {
  const records = student.attendanceRecords || [];

  const exportAttendance = () => {
    const rows = [
      ["التاريخ", "الدخول", "الخروج", "المدة", "الحالة"],
      ...records.map((record) => [
        record.date,
        record.checkIn,
        record.checkOut,
        record.duration,
        record.status === "present" ? "حاضر" : record.status === "late" ? "متأخر" : "غائب",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-${student.id}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MiniStat label="أيام الحضور" value={student.attendanceDays} unit="يوم" />
        <MiniStat label="أيام الغياب" value={student.absenceDays} unit="يوم" />
        <MiniStat label="نسبة الحضور" value={student.attendance} unit="%" />
        <MiniStat label="الساعات المنجزة" value={student.completedHours} unit="ساعة" />
      </div>

      <Panel title="سجل الحضور">
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={exportAttendance}
            disabled={!records.length}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E0E7F2] px-4 py-2 text-[12px] disabled:opacity-40"
          >
            <Download size={16} />
            تصدير السجل
          </button>
        </div>

        <div className="max-w-full overflow-x-auto rounded-lg border border-[#E0E7F2]">
          <table className="w-full min-w-[570px] text-right text-[11px]">
            <thead className="bg-[#F1F5F9] text-[#64748B]">
              <tr>
                <th className="px-4 py-4">التاريخ</th>
                <th className="px-4 py-4">الدخول</th>
                <th className="px-4 py-4">الخروج</th>
                <th className="px-4 py-4">المدة</th>
                <th className="px-4 py-4">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id || record.date}
                  className="border-t border-[#E6EBF5]"
                >
                  <td className="px-4 py-5">{record.date}</td>
                  <td className="px-4 py-5">{record.checkIn}</td>
                  <td className="px-4 py-5">{record.checkOut}</td>
                  <td className="px-4 py-5">{record.duration}</td>
                  <td className="px-4 py-5">
                    <span
                      className={`rounded-full px-3 py-1.5 ${
                        record.status === "present"
                          ? "bg-[#DCFCE7] text-[#15803D]"
                          : record.status === "late" ? "bg-amber-50 text-amber-700" : "bg-[#FEE2E2] text-[#DC2626]"
                      }`}
                    >
                      {record.status === "present"
                        ? "حاضر"
                        : record.status === "late" ? "متأخر" : "غائب"}
                    </span>
                  </td>
                </tr>
              ))}

              {!records.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-[#64748B]"
                  >
                    لا توجد سجلات حضور تفصيلية متاحة لهذا الطالب.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

// =====================================================
// PROGRESS AND REPORTS
// =====================================================

function ProgressTab({ student, navigate }) {
  const reports = student.reports || [];
  const series = student.weeklyProgress || [];

  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_390px]">
      <div className="min-w-0 space-y-6">
        <Panel title="تقدم الساعات التدريبية">
          <div className="mb-3 flex justify-between text-[12px]">
            <strong>{getProgress(student)}%</strong>
            <span className="text-[#64748B]">
              {student.completedHours} من {student.requiredHours} ساعة
            </span>
          </div>

          <div className="h-[12px] overflow-hidden rounded-full bg-[#E5EAF2]">
            <div
              className="h-full bg-[#09379A]"
              style={{ width: `${getProgress(student)}%` }}
            />
          </div>
        </Panel>

        <Panel title="التقارير الأسبوعية">
          {reports.length ? (
            <div className="space-y-0">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6EBF5] py-4 last:border-0"
                >
                  <div>
                    <p className="m-0 text-[12px] font-bold">
                      {report.title}
                    </p>
                    <p className="m-0 mt-1 text-[11px] text-[#64748B]">
                      {report.date} —{" "}
                      {report.status === "approved"
                        ? "معتمد"
                        : "بانتظار المراجعة"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/admin/reports/${report.id}`)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E0E7F2] px-3 py-2 text-[11px]"
                  >
                    <Eye size={15} />
                    عرض
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="m-0 text-[12px] leading-6 text-[#64748B]">
              لا توجد روابط لتقارير مفصلة في البيانات التجريبية لهذا الطالب.
            </p>
          )}
        </Panel>
      </div>

      <Panel title="التقدم عبر الأسابيع">
        {series.length ? (
          <div className="flex h-[190px] items-end justify-around gap-2 pt-4">
            {series.map((value, index) => (
              <div
                key={index}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <div className="flex h-[145px] w-full items-end justify-center">
                  <div
                    title={`${value}%`}
                    className="w-full max-w-[35px] rounded-t-md bg-[#09379A]"
                    style={{ height: `${Math.max(value, 3)}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#64748B]">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="m-0 text-[12px] text-[#64748B]">
            لا تتوفر بيانات تقدم أسبوعية بعد.
          </p>
        )}
      </Panel>
    </div>
  );
}

// =====================================================
// EVALUATION
// =====================================================

function EvaluationTab({ student, navigate }) {
  const requirements = getCompletionRequirements(student);
  const evaluationComplete = requirements.find(
    (item) => item.key === "academicEvaluation"
  )?.done;

  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
      <Panel title="التقييم الميداني">
        <div className="text-[38px] font-bold text-[#062569]">
          {student.fieldScore == null
            ? "—"
            : Number(student.fieldScore).toFixed(1)}
        </div>
        <p className="m-0 text-[11px] text-[#64748B]">
          {student.fieldScore == null
            ? "لم يصل التقييم الميداني"
            : "من 5"}
        </p>
      </Panel>

      <Panel title="التقييم النهائي">
        <div className="mb-5 flex items-center gap-2 text-[12px]">
          {evaluationComplete ? (
            <Check size={17} className="text-[#15803D]" />
          ) : (
            <Clock3 size={17} className="text-[#B54708]" />
          )}

          {evaluationComplete
            ? "تم اعتماد التقييم النهائي"
            : "التقييم النهائي غير معتمد بعد"}
        </div>

        {student.evaluationId ? (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/admin/evaluations/${student.evaluationId}`
              )
            }
            className="inline-flex h-[42px] items-center gap-2 rounded-lg bg-[#09379A] px-5 text-[12px] text-white"
          >
            <Star size={16} />
            تفاصيل التقييم
          </button>
        ) : (
          <p className="m-0 text-[12px] text-[#64748B]">
            لا يوجد تقييم مرتبط بهذا الطالب.
          </p>
        )}
      </Panel>
    </div>
  );
}

// =====================================================
// SMALL SHARED COMPONENTS
// =====================================================

function Panel({ title, children }) {
  return (
    <section className="min-w-0 rounded-xl border border-[#E0E7F2] bg-white p-5 sm:p-6">
      <h2 className="m-0 mb-4 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Stat({ label, value, unit, icon: Icon, color }) {
  const colors = {
    blue: "bg-[#E8EEF9] text-[#09379A]",
    green: "bg-[#DCFCE7] text-[#15803D]",
    orange: "bg-[#FFE5D9] text-[#B54708]",
    cyan: "bg-[#DDF6FF] text-[#08759B]",
  };

  return (
    <div className="min-w-0 rounded-xl border border-[#E0E7F2] bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span
          className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg ${colors[color]}`}
        >
          <Icon size={20} />
        </span>

        <span className="text-left text-[11px] font-semibold">
          {label}
        </span>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <strong className="text-[29px] font-bold text-[#062569]">
          {value}
        </strong>
        {unit && (
          <span className="text-[11px] text-[#64748B]">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value, unit }) {
  return (
    <div className="rounded-xl border border-[#E0E7F2] bg-white p-5">
      <p className="m-0 text-[12px] text-[#64748B]">{label}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <strong className="text-[28px] text-[#062569]">
          {value}
        </strong>
        <span className="text-[11px] text-[#64748B]">
          {unit}
        </span>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="m-0 text-[11px] text-[#64748B]">{label}</p>
      <p className="m-0 mt-1 break-words text-[12px] font-semibold">
        {value || "—"}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = STATUS_UI[status] || STATUS_UI.unknown;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ${config.className}`}
    >
      <span className="h-[6px] w-[6px] rounded-full bg-current" />
      {config.label}
    </span>
  );
}




