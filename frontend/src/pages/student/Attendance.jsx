import AcademicFooter from "../../components/shared/AcademicFooter";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AlertTriangle,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Plus,
  RefreshCw,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";
import { useApi } from "../../api/useApi";
import { fetchAttendance } from "../../api/student";

// FR-22: the backend works the rate out (confirmed days ÷ working days, excused days left out).
async function loadAttendance() {
  const data = await fetchAttendance().catch(() => null);
  const records = (data?.daily_breakdown || [])
    .filter(day => day.is_working_day)
    .map(day => ({
      id: day.date,
      date: day.date,
      // An excused day shows as an absence with an accepted excuse.
      status: day.status_code === "present" ? "present" : "absent",
      excused: day.status_code === "excused",
      note: day.notes || day.status,
      hours: day.hours,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
  return { records, rate: data?.attendance_rate ?? 0, alert: Boolean(data?.alert) };
}

const initialAttendanceRows = [
  { id: 1, date: "2025/10/01", day: "الأربعاء", status: "present", note: "—" },
  { id: 2, date: "2025/10/02", day: "الخميس", status: "present", note: "—" },
  { id: 3, date: "2025/10/03", day: "الجمعة", status: "absent", note: "غياب غير مبرر - يرجى تقديم عذر معتمد" },
  { id: 4, date: "2025/10/06", day: "الإثنين", status: "present", note: "—" },
  { id: 5, date: "2025/10/07", day: "الثلاثاء", status: "present", note: "—" },
  { id: 6, date: "2025/10/08", day: "الأربعاء", status: "present", note: "—" },
  { id: 7, date: "2025/10/09", day: "الخميس", status: "present", note: "—" },
  { id: 8, date: "2025/10/12", day: "الأحد", status: "present", note: "—" },
  { id: 9, date: "2025/10/13", day: "الإثنين", status: "present", note: "—" },
  { id: 10, date: "2025/10/14", day: "الثلاثاء", status: "present", note: "—" },
  { id: 11, date: "2025/10/15", day: "الأربعاء", status: "present", note: "—" },
  { id: 12, date: "2025/10/16", day: "الخميس", status: "present", note: "—" },
  { id: 13, date: "2025/10/19", day: "الأحد", status: "present", note: "—" },
  { id: 14, date: "2025/10/20", day: "الإثنين", status: "present", note: "—" },
  { id: 15, date: "2025/10/21", day: "الثلاثاء", status: "absent", note: "غياب غير مبرر - يرجى تقديم عذر معتمد" },
  { id: 16, date: "2025/10/22", day: "الأربعاء", status: "present", note: "—" },
  { id: 17, date: "2025/10/23", day: "الخميس", status: "present", note: "—" },
  { id: 18, date: "2025/10/26", day: "الأحد", status: "present", note: "—" },
  { id: 19, date: "2025/10/27", day: "الإثنين", status: "present", note: "—" },
  { id: 20, date: "2025/10/28", day: "الثلاثاء", status: "present", note: "—" },
  { id: 21, date: "2025/10/29", day: "الأربعاء", status: "present", note: "—" },
  { id: 22, date: "2025/10/30", day: "الخميس", status: "present", note: "—" },
];

const monthFormatter = new Intl.DateTimeFormat("ar", {
  month: "long",
  year: "numeric",
});

// توحيد صيغة التاريخ
function toISO(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.includes("/")
    ? dateString.split("/").map(Number)
    : dateString.split("-").map(Number);

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// إعداد تخزين الأعذار
const EXCUSES_STORAGE_KEY = "studentAbsenceExcuses";

function readSavedExcuses() {
  try {
    const saved = localStorage.getItem(EXCUSES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// البحث عن عذر مرتبط بتاريخ معين
function getExcuseForDate(excuses, dateString) {
  const normalizedDate = toISO(dateString);

  return excuses.find(
    (excuse) => toISO(excuse.date) === normalizedDate
  );
}

export default function Attendance() {
  const navigate = useNavigate();
  const sharedAttendance = useApi(loadAttendance, [], { records: [], rate: 0, alert: false }).data
    || { records: [], rate: 0, alert: false };


  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [savedExcuses, setSavedExcuses] = useState(
    () => readSavedExcuses()
  );

  const [calendarDate, setCalendarDate] = useState(
    () => new Date()
  );

  // ربط سجل الحضور بطلبات الأعذار المحفوظة
  const attendanceRows = useMemo(() => {
    const source = sharedAttendance.records.map((record, index) => {
      const date = String(record.date).replaceAll("-", "/");
      const excuse = getExcuseForDate(savedExcuses, date);
      const dayDate = new Date(`${String(record.date).slice(0,10)}T12:00:00`);
      return {
        id: record.id || `${record.date}-${index}`,
        date,
        day: Number.isNaN(dayDate.getTime()) ? "" : new Intl.DateTimeFormat("ar", { weekday: "long" }).format(dayDate),
        status: record.status,
        note: record.note || record.reason || "—",
        inTime: record.inTime || "—",
        outTime: record.outTime || "—",
        hours: Number(record.hours ?? record.durationHours ?? 0),
        justified: record.excused || excuse?.status === "approved",
        excuseSubmitted: record.excused || Boolean(excuse),
        excuseStatus: record.excused ? "approved" : excuse?.status || "",
        excuseReason: excuse?.reason || "",
      };
    });
    return source;
  }, [sharedAttendance, savedExcuses]);

  const pageSize = 5;

  // تصفية السجلات
  const filteredRows = useMemo(() => {
    if (filter === "all") return attendanceRows;

    return attendanceRows.filter(
      (row) => row.status === filter
    );
  }, [attendanceRows, filter]);

  // ترقيم الصفحات
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleRows = filteredRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  // الإحصائيات محسوبة من بيانات السجل
  const stats = useMemo(() => {
    const presentDays = attendanceRows.filter(
      (row) => row.status === "present"
    ).length;

    const absenceDays = attendanceRows.filter(
      (row) => row.status === "absent"
    ).length;

    const totalDays = attendanceRows.length;

    // يحتسب العذر المعتمد فقط
    const justifiedAbsenceDays = attendanceRows.filter(
      (row) => row.status === "absent" && row.justified
    ).length;

    return {
      presentDays,
      absenceDays,
      totalDays,
      justifiedAbsenceDays,
      attendanceRate: sharedAttendance.rate,
    };
  }, [attendanceRows, sharedAttendance.rate]);

  // التنقل بين الأشهر
  const changeMonth = (amount) => {
    setCalendarDate(
      (date) =>
        new Date(
          date.getFullYear(),
          date.getMonth() + amount,
          1
        )
    );
  };

  // الانتقال إلى صفحة تقديم عذر الغياب
  const openExcuse = (date) => {
    const latestExcuses = readSavedExcuses();

    setSavedExcuses(latestExcuses);

    // منع تقديم عذر مكرر للتاريخ نفسه
    if (date && getExcuseForDate(latestExcuses, date)) {
      return;
    }

    navigate("/student/attendance/absence-excuse", {
      state: date
        ? { absenceDate: toISO(date) }
        : {},
    });
  };

  // فتح نافذة الطباعة
  const exportPDF = () => {
    window.print();
  };

  return (
    <div
      dir="rtl"
      className="flex h-dvh w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#1E293B]"
    >
      <div className="print:hidden">
        <Sidebar />
      </div>

      <div className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden bg-[#F8FAFC]">
        <div className="relative shrink-0 print:hidden">
          <Header />
        </div>

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] px-4 pb-8 pt-5 sm:px-5 sm:pt-6 md:px-6 md:pt-7 xl:px-[40px] xl:pb-[40px] xl:pt-[14px] print:overflow-visible print:p-0">
          <div className="mx-auto w-full max-w-[1080px]">

            {/* مسار التنقل */}
            <nav
              aria-label="مسار التنقل"
              className="flex flex-wrap items-center gap-[7px] text-[11px] font-medium leading-[20px] sm:text-[12px] xl:text-[13px] print:hidden"
            >
              <button
                type="button"
                onClick={() => navigate("/student/dashboard")}
                className="border-0 bg-transparent p-0 text-[#64748B] transition hover:text-[#09379A]"
              >
                الرئيسية
              </button>

              <span className="text-[#94A3B8]">›</span>

              <span className="font-bold text-[#09379A]">
                الحضور والغياب
              </span>
            </nav>

            {/* عنوان الصفحة والأزرار */}
            <section className="mt-[7px] flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="m-0 text-[24px] font-bold leading-[36px] text-[#14213D] sm:text-[26px] xl:text-[28px] xl:leading-[40px]">
                  الحضور والغياب
                </h1>

                <p className="m-0 mt-[4px] max-w-[680px] text-[11px] leading-[21px] text-[#64748B] sm:text-[12px] xl:text-[13px] xl:leading-[22px]">
                  سجل التواجد الميداني والتنفيذ لساعات التدريب الأكاديمي المعتمدة
                </p>
              </div>

              <div className="flex w-full flex-col gap-[9px] sm:w-auto sm:flex-row sm:flex-wrap sm:items-center print:hidden">
                <button
                  type="button"
                  onClick={exportPDF}
                  className="flex min-h-[40px] w-full items-center justify-center gap-[7px] rounded-[8px] border border-[#D9E2EC] bg-white px-[15px] text-[10px] font-bold text-[#334155] transition hover:bg-[#F8FAFC] sm:w-auto sm:text-[11px]"
                >
                  <Download
                    size={15}
                    strokeWidth={1.8}
                    className="text-[#09379A]"
                  />
                  تصدير كشف الحضور (PDF)
                </button>

                <button
                  type="button"
                  onClick={() => openExcuse()}
                  className="flex min-h-[40px] w-full items-center justify-center gap-[7px] rounded-[8px] border-0 bg-[#09379A] px-[16px] text-[10px] font-bold text-white transition hover:bg-[#072E81] sm:w-auto sm:text-[11px]"
                >
                  <Plus size={16} strokeWidth={2} />
                  تقديم عذر غياب
                </button>
              </div>
            </section>

            {/* معلومات التدريب */}
            <section className="mt-5 flex flex-col gap-4 rounded-[14px] border border-[#DDE5EF] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-5 lg:flex-row lg:items-center lg:justify-between xl:mt-[22px] xl:px-[20px] xl:py-[15px]">
              <div className="flex min-h-[29px] w-fit shrink-0 items-center gap-[7px] rounded-full bg-[#EEF4FF] px-[12px] text-[10px] font-bold text-[#2563EB] sm:text-[11px]">
                <span className="h-[6px] w-[6px] rounded-full bg-[#2563EB]" />
                الفصل الدراسي الأول 2025/2026
              </div>

              <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr] lg:items-center lg:gap-[28px]">
                <InfoItem
                  label="فترة التدريب"
                  value="2025/10/01 — 2025/12/01"
                />

                <InfoItem
                  label="المشرف الميداني"
                  value="م. سارة خليل"
                />

                <div className="flex items-center gap-[10px]">
                  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[9px] bg-[#EEF3FF] text-[#09379A]">
                    <Building2 size={19} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0">
                    <p className="m-0 text-[10px] font-medium text-[#94A3B8]">
                      جهة التدريب
                    </p>

                    <strong className="mt-[4px] block text-[12px] font-bold leading-[19px] text-[#1E293B] sm:text-[13px]">
                      شركة القدس للاتصالات
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            {/* بطاقات الإحصائيات */}
            <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:mt-[22px] xl:gap-[20px]">
              <StatCard
                type="danger"
                icon={AlertTriangle}
                label="عدد أيام الغياب"
                value={stats.absenceDays}
                suffix="أيام غياب مسجلة"
                footer={
                  <>
                    غياب بعذر مقبول وموثق:
                    <strong className="mr-[4px] text-[#1E293B]">
                      {stats.justifiedAbsenceDays} يوم
                    </strong>
                  </>
                }
              />

              <article className="min-h-[165px] rounded-[14px] border border-[#DDE5EF] bg-white px-5 py-[18px] shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <div className="flex items-start justify-between gap-3">
                  <p className="m-0 text-[11px] font-medium text-[#64748B]">
                    نسبة الحضور التراكمية
                  </p>

                  <div className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full bg-[#EFF5FF] text-[#2563EB]">
                    <RefreshCw size={15} strokeWidth={1.8} />
                  </div>
                </div>

                <div className="mt-[20px] flex items-end gap-[8px]">
                  <strong className="text-[31px] font-bold leading-[32px] text-[#10A36A]">
                    {stats.attendanceRate}%
                  </strong>

                  <span className="inline-flex min-h-[23px] items-center rounded-full bg-[#E9FDF3] px-[8px] text-[10px] font-bold text-[#16A34A]">
                    نسبة مسجلة
                  </span>
                </div>

                <div className="mt-[18px] h-[8px] overflow-hidden rounded-full bg-[#EAF0F5]">
                  <div
                    className="h-full rounded-full bg-[#10B981]"
                    style={{ width: `${stats.attendanceRate}%` }}
                  />
                </div>

                <p className="m-0 mt-[11px] text-[10px] leading-[18px] text-[#64748B]">
                  نسبة الحضور محسوبة من سجلات الحضور والغياب المعروضة.
                </p>
              </article>

              <StatCard
                type="success"
                icon={Check}
                label="عدد أيام الحضور"
                value={stats.presentDays}
                suffix="يوما مكتملًا"
                footer={
                  <>
                    من أصل
                    <strong className="mx-[4px] text-[#1E293B]">
                      {stats.totalDays}
                    </strong>
                    يومًا مسجلًا
                  </>
                }
                className="sm:col-span-2 lg:col-span-1"
              />
            </section>

            {/* التقويم وجدول السجلات */}
            <section
              dir="ltr"
              className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[310px_minmax(0,1fr)] xl:mt-[24px] xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-[22px]"
            >
              {/* التقويم */}
              <aside
                dir="rtl"
                className="rounded-[14px] border border-[#DDE5EF] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:px-[18px] sm:py-[18px]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-[7px]">
                    <CalendarDays
                      size={17}
                      className="text-[#09379A]"
                    />

                    <h2 className="m-0 text-[14px] font-bold text-[#1E293B] sm:text-[15px]">
                      {monthFormatter.format(calendarDate)}
                    </h2>
                  </div>

                  <div className="flex items-center gap-[8px]">
                    <button
                      type="button"
                      onClick={() => changeMonth(-1)}
                      aria-label="الشهر السابق"
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                    >
                      <ChevronRight size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => changeMonth(1)}
                      aria-label="الشهر التالي"
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </div>
                </div>

                <AttendanceCalendar
                  calendarDate={calendarDate}
                  attendanceRows={attendanceRows}
                  onSelectDate={openExcuse}
                />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF2F7] pt-[14px] text-[9px] text-[#64748B] sm:text-[10px]">
                  <CalendarLegend
                    color="#10B981"
                    label="حاضر"
                    count={stats.presentDays}
                  />

                  <CalendarLegend
                    color="#EF4444"
                    label="غائب"
                    count={stats.absenceDays}
                  />

                  <CalendarLegend
                    color="#CBD5E1"
                    label="غير مسجل"
                    count="—"
                  />
                </div>
              </aside>

              {/* جدول تفاصيل الحضور والغياب */}
              <section
                dir="rtl"
                className="overflow-hidden rounded-[14px] border border-[#DDE5EF] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
              >
                <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5 sm:py-[18px]">
                  <div>
                    <h2 className="m-0 text-[17px] font-bold text-[#1E293B] sm:text-[18px]">
                      تفاصيل الحضور والغياب
                    </h2>

                    <p className="m-0 mt-[4px] text-[10px] leading-[18px] text-[#64748B] sm:text-[11px]">
                      سجل الحركات اليومية المعتمدة من المشرف الميداني
                    </p>
                  </div>

                  <div className="flex w-full items-center gap-[8px] rounded-[8px] bg-[#F5F7FB] px-[9px] py-[7px] sm:w-auto">
                    <span className="text-[10px] text-[#94A3B8]">
                      تصفية:
                    </span>

                    <select
                      value={filter}
                      onChange={(event) => {
                        setFilter(event.target.value);
                        setCurrentPage(1);
                      }}
                      aria-label="تصفية الحضور والغياب"
                      className="min-w-0 flex-1 border-0 bg-transparent font-['Cairo'] text-[10px] font-bold text-[#09379A] outline-none sm:flex-none sm:text-[11px]"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="present">حاضر</option>
                      <option value="absent">غائب</option>
                    </select>
                  </div>
                </div>

                {/* جدول الشاشات الكبيرة */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-[120px_110px_120px_minmax(0,1fr)] gap-[10px] bg-[#EFF3FB] px-[18px] py-[12px] text-[10px] font-semibold text-[#64748B] lg:grid-cols-[130px_130px_140px_minmax(0,1fr)]">
                    <div>التاريخ</div>
                    <div>اليوم</div>
                    <div>الحالة</div>
                    <div>الملاحظات والتوثيق</div>
                  </div>

                  {visibleRows.map((row, index) => (
                    <div
                      key={row.id}
                      className={`grid min-h-[58px] grid-cols-[120px_110px_120px_minmax(0,1fr)] items-center gap-[10px] px-[18px] py-[14px] lg:grid-cols-[130px_130px_140px_minmax(0,1fr)] ${
                        row.status === "absent"
                          ? "bg-[#FFF7F7]"
                          : "bg-white"
                      } ${
                        index !== visibleRows.length - 1
                          ? "border-b border-[#EEF2F7]"
                          : ""
                      }`}
                    >
                      <div
                        dir="ltr"
                        className={`text-[10px] font-medium ${
                          row.status === "absent"
                            ? "font-bold text-[#DC2626]"
                            : "text-[#475569]"
                        }`}
                      >
                        {row.date}
                      </div>

                      <div
                        className={`text-[11px] font-medium ${
                          row.status === "absent"
                            ? "text-[#DC2626]"
                            : "text-[#475569]"
                        }`}
                      >
                        {row.day}
                      </div>

                      <div>
                        <AttendanceStatus status={row.status} />
                      </div>

                      <div>
                        {row.status === "absent" ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex min-h-[28px] items-center gap-[5px] rounded-[6px] border px-[8px] py-[5px] text-[9px] font-medium leading-[16px] lg:text-[10px] ${
                                row.excuseSubmitted
                                  ? row.justified
                                    ? "border-[#86EFAC] bg-[#F0FDF4] text-[#15803D]"
                                    : "border-[#FCD34D] bg-[#FFFBEB] text-[#92400E]"
                                  : "border-[#FCA5A5] bg-white text-[#DC2626]"
                              }`}
                            >
                              <FileText
                                size={11}
                                className="shrink-0"
                              />

                              {row.excuseSubmitted
                                ? row.justified
                                  ? "تم اعتماد العذر"
                                  : "تم تقديم العذر - قيد المراجعة"
                                : row.note}
                            </span>

                            {row.excuseSubmitted ? (
                              <span className="text-[9px] font-bold text-[#64748B]">
                                لا يمكن التقديم مرة أخرى
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openExcuse(row.date)}
                                className="rounded-[6px] bg-[#09379A] px-2 py-1.5 text-[10px] font-bold text-white hover:bg-[#072E81] print:hidden"
                              >
                                تقديم عذر
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#94A3B8]">
                            —
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* بطاقات الشاشات الصغيرة */}
                <div className="flex flex-col gap-3 border-t border-[#EEF2F7] bg-[#FAFBFD] p-3 md:hidden">
                  {visibleRows.map((row) => (
                    <article
                      key={row.id}
                      className={`rounded-[12px] border p-4 ${
                        row.status === "absent"
                          ? "border-[#FECACA] bg-[#FFF7F7]"
                          : "border-[#E2E8F0] bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3
                            className={`m-0 text-[14px] font-bold ${
                              row.status === "absent"
                                ? "text-[#DC2626]"
                                : "text-[#1E293B]"
                            }`}
                          >
                            {row.day}
                          </h3>

                          <span
                            dir="ltr"
                            className="mt-[3px] block text-[10px] text-[#94A3B8]"
                          >
                            {row.date}
                          </span>
                        </div>

                        <AttendanceStatus status={row.status} />
                      </div>

                      <div className="mt-4 border-t border-[#EEF2F7] pt-3">
                        <span className="block text-[10px] font-medium text-[#94A3B8]">
                          الملاحظات والتوثيق
                        </span>

                        <p
                          className={`m-0 mt-[5px] text-[11px] leading-[20px] ${
                            row.status === "absent"
                              ? row.excuseSubmitted
                                ? row.justified
                                  ? "text-[#15803D]"
                                  : "text-[#92400E]"
                                : "text-[#DC2626]"
                              : "text-[#64748B]"
                          }`}
                        >
                          {row.status === "absent"
                            ? row.excuseSubmitted
                              ? row.justified
                                ? "تم اعتماد عذر الغياب لهذا اليوم."
                                : "تم تقديم العذر لهذا اليوم وهو قيد المراجعة."
                              : row.note
                            : "لا توجد ملاحظات مسجلة."}
                        </p>
                      </div>

                      {row.status === "absent" && (
                        <button
                          type="button"
                          disabled={row.excuseSubmitted}
                          onClick={() => openExcuse(row.date)}
                          className={`mt-3 min-h-10 w-full rounded-lg px-3 text-sm font-bold print:hidden ${
                            row.excuseSubmitted
                              ? "cursor-not-allowed border border-[#DDE5EF] bg-[#F1F5F9] text-[#64748B]"
                              : "bg-[#09379A] text-white hover:bg-[#072E81]"
                          }`}
                        >
                          {row.excuseSubmitted
                            ? "تم تقديم العذر مسبقًا"
                            : "تقديم عذر لهذا اليوم"}
                        </button>
                      )}
                    </article>
                  ))}
                </div>

                {visibleRows.length === 0 && (
                  <div className="px-4 py-10 text-center text-sm text-[#64748B]">
                    لا توجد سجلات لهذه الحالة.
                  </div>
                )}

                {/* ترقيم الصفحات */}
                <div className="flex min-h-[58px] flex-col gap-3 border-t border-[#EEF2F7] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-[18px]">
                  <span className="text-[10px] text-[#64748B]">
                    عرض{" "}
                    {filteredRows.length
                      ? (safePage - 1) * pageSize + 1
                      : 0}
                    –{Math.min(safePage * pageSize, filteredRows.length)} من أصل{" "}
                    <strong className="mx-[3px] text-[#1E293B]">
                      {filteredRows.length}
                    </strong>{" "}
                    سجل
                  </span>

                  <div
                    dir="ltr"
                    className="flex flex-wrap items-center gap-[5px] print:hidden"
                  >
                    <PaginationButton
                      disabled={safePage >= totalPages}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1)
                        )
                      }
                    >
                      التالي <ChevronLeft size={12} />
                    </PaginationButton>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        aria-current={
                          safePage === page ? "page" : undefined
                        }
                        onClick={() => setCurrentPage(page)}
                        className={`flex h-[32px] w-[32px] items-center justify-center rounded-[6px] border text-[10px] font-bold transition ${
                          safePage === page
                            ? "border-[#09379A] bg-[#09379A] text-white"
                            : "border-[#DDE5EF] bg-white text-[#475569] hover:bg-[#F8FAFC]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <PaginationButton
                      disabled={safePage <= 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                    >
                      <ChevronRight size={12} /> السابق
                    </PaginationButton>
                  </div>
                </div>
              </section>
            </section>

            <p className="mt-5 text-[10px] leading-5 text-[#94A3B8] print:hidden">
              تنبيه: البيانات المعروضة تجريبية، وتحتاج الصفحة إلى الربط ببيانات الحضور الفعلية في النظام.
            </p>
          </div>
        
            <AcademicFooter audience="student" />
          </main>
      </div>

      {/* تنسيق الطباعة */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 12mm;
          }

          body {
            background: white !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          body * {
            visibility: visible;
          }

          button,
          select {
            display: none !important;
          }

          main {
            overflow: visible !important;
            height: auto !important;
          }

          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// عنصر معلومات التدريب
function InfoItem({ label, value }) {
  return (
    <div className="rounded-[9px] bg-[#F8FAFC] px-3 py-3 lg:bg-transparent lg:px-0 lg:py-0">
      <p className="m-0 text-[10px] font-medium text-[#94A3B8]">
        {label}
      </p>

      <strong className="mt-[4px] block text-[11px] font-bold leading-[19px] text-[#334155] sm:text-[12px]">
        {value}
      </strong>
    </div>
  );
}

// بطاقة الإحصائيات
function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  footer,
  type,
  className = "",
}) {
  const isDanger = type === "danger";

  return (
    <article
      className={`min-h-[165px] rounded-[14px] border border-[#DDE5EF] bg-white px-5 py-[18px] shadow-[0_1px_2px_rgba(15,23,42,0.03)] ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="m-0 text-[11px] font-medium text-[#64748B]">
          {label}
        </p>

        <div
          className={`flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full ${
            isDanger
              ? "bg-[#FFF1F1] text-[#EF4444]"
              : "bg-[#EAFBF4] text-[#10B981]"
          }`}
        >
          <Icon size={16} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-[21px] flex items-baseline gap-[7px]">
        <strong
          className={`text-[30px] font-bold leading-[31px] ${
            isDanger ? "text-[#EF4444]" : "text-[#09379A]"
          }`}
        >
          {value}
        </strong>

        <span className="text-[10px] text-[#94A3B8]">
          {suffix}
        </span>
      </div>

      <div className="mt-[17px] border-t border-[#EEF2F7] pt-[12px] text-[10px] leading-[18px] text-[#64748B]">
        {footer}
      </div>
    </article>
  );
}

// حالة الحضور
function AttendanceStatus({ status }) {
  const isPresent = status === "present";

  return (
    <span
      className={`inline-flex min-h-[26px] items-center gap-[5px] rounded-full px-[9px] text-[10px] font-bold ${
        isPresent
          ? "bg-[#E9FFF4] text-[#16A34A]"
          : "bg-[#FFE8E8] text-[#DC2626]"
      }`}
    >
      {isPresent ? (
        <>
          <Check size={11} strokeWidth={2} />
          حاضر
        </>
      ) : (
        <>
          <span className="text-[13px] leading-none">×</span>
          غائب
        </>
      )}
    </span>
  );
}

// التقويم
function AttendanceCalendar({
  calendarDate,
  attendanceRows,
  onSelectDate,
}) {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const previousMonthDays = new Date(year, month, 0).getDate();

  const rowsByDate = new Map(
    attendanceRows.map((row) => [toISO(row.date), row])
  );

  const cells = [];

  // بداية الأسبوع يوم السبت
  const saturdayOffset = (firstDay + 1) % 7;

  for (let i = 0; i < saturdayOffset; i += 1) {
    cells.push({
      key: `prev-${i}`,
      day: previousMonthDays - saturdayOffset + i + 1,
      outside: true,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    cells.push({
      key: date,
      day,
      date,
      outside: false,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      key: `next-${cells.length}`,
      day: (cells.length % 7) + 1,
      outside: true,
    });
  }

  const weeks = [];

  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="mt-[18px]">
      <div className="grid grid-cols-7 text-center text-[9px] font-medium text-[#94A3B8] sm:text-[10px]">
        {[
          "سبت",
          "أحد",
          "إثنين",
          "ثلاثاء",
          "أربعاء",
          "خميس",
          "جمعة",
        ].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-[10px] flex flex-col gap-[7px]">
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className="grid grid-cols-7 text-center"
          >
            {week.map((cell) => {
              const row = cell.date
                ? rowsByDate.get(cell.date)
                : null;

              const isPresent = row?.status === "present";
              const isAbsent = row?.status === "absent";

              return (
                <button
                  key={cell.key}
                  type="button"
                  disabled={cell.outside}
                  onClick={() => {
                    if (isAbsent && !row?.excuseSubmitted) {
                      onSelectDate(cell.date);
                    }
                  }}
                  title={
                    isAbsent && row?.excuseSubmitted
                      ? "تم تقديم عذر لهذا اليوم"
                      : isAbsent
                      ? "غياب مسجل — اضغط لتقديم عذر"
                      : isPresent
                      ? "حضور مسجل"
                      : "لا يوجد سجل مسجل لهذا اليوم"
                  }
                  className="flex min-h-[39px] flex-col items-center justify-center gap-[4px] rounded-[7px] transition hover:bg-[#F8FAFC] disabled:cursor-default"
                >
                  <span
                    className={`text-[10px] font-medium ${
                      cell.outside
                        ? "text-[#CBD5E1]"
                        : isAbsent
                        ? row?.excuseSubmitted
                          ? "font-bold text-[#D97706]"
                          : "font-bold text-[#EF4444]"
                        : "text-[#475569]"
                    }`}
                  >
                    {cell.day}
                  </span>

                  <span
                    className={`h-[5px] w-[5px] rounded-full ${
                      isPresent
                        ? "bg-[#10B981]"
                        : isAbsent
                        ? row?.excuseSubmitted
                          ? row?.justified
                            ? "bg-[#10B981]"
                            : "bg-[#F59E0B]"
                          : "bg-[#EF4444]"
                        : cell.outside
                        ? "bg-transparent"
                        : "bg-[#CBD5E1]"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// مفتاح ألوان التقويم
function CalendarLegend({ color, label, count }) {
  return (
    <div className="flex items-center gap-[5px]">
      <span
        className="h-[6px] w-[6px] rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>
        {label} ({count})
      </span>
    </div>
  );
}

// أزرار الصفحات
function PaginationButton({ children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-[32px] items-center gap-[4px] rounded-[6px] border border-[#DDE5EF] bg-white px-[9px] text-[9px] font-medium text-[#64748B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40 sm:text-[10px]"
    >
      {children}
    </button>
  );
}
