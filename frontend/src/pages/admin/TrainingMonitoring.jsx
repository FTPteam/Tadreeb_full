import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Menu, ChevronLeft, Search, Download,
  SlidersHorizontal, ArrowDownUp, Eye, Activity,
  CalendarCheck, FileText, Star, ChevronRight,
  AlertTriangle,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";
import {
  getTrainingStudents,
  getProgress,
  getMonitoringStatus,
  STATUS_UI,
  exportMonitoringCsv,
} from "./trainingMonitoringStore";

const PAGE_SIZE = 5;

export default function TrainingMonitoring() {
  const navigate = useNavigate();
  const [students, setStudents] = useState(getTrainingStudents);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const refresh = () => setStudents(getTrainingStudents());

    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("training-monitoring-updated", refresh);
    window.addEventListener("admin-students-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("training-monitoring-updated", refresh);
      window.removeEventListener("admin-students-updated", refresh);
    };
  }, []);

  const stats = useMemo(() => {
    const active = students.filter(
      (item) => item.status === "training"
    );

    const average = (items, getValue) =>
      items.length
        ? Math.round(
            items.reduce((sum, item) => sum + getValue(item), 0) /
              items.length
          )
        : 0;

    const scored = active.filter(
      (item) => item.fieldScore != null
    );

    return {
      progress: average(active, getProgress),
      attendance: average(
        active,
        (item) => Number(item.attendance) || 0
      ),
      lateReports: active.reduce(
        (sum, item) => sum + Number(item.lateReports || 0),
        0
      ),
      evaluation: scored.length
        ? (
            scored.reduce(
              (sum, item) => sum + Number(item.fieldScore),
              0
            ) / scored.length
          ).toFixed(1)
        : "—",
    };
  }, [students]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();

    const matches = students.filter((student) => {
      const searchMatch =
        !text ||
        [
          student.name,
          student.shortName,
          student.id,
          student.major,
          student.organization,
        ].some((value) =>
          String(value || "").toLowerCase().includes(text)
        );

      const status = getMonitoringStatus(student);

      return (
        searchMatch &&
        (filter === "all" || filter === status)
      );
    });

    return [...matches].sort((a, b) => {
      if (sort === "progress") {
        return getProgress(b) - getProgress(a);
      }

      if (sort === "attendance") {
        return Number(b.attendance) - Number(a.attendance);
      }

      return a.name.localeCompare(b.name, "ar");
    });
  }, [students, query, filter, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const weeklyData = useMemo(() => {
    const active = students.filter(
      (student) =>
        student.status === "training" &&
        student.weeklyProgress?.length
    );

    return Array.from({ length: 6 }, (_, index) => {
      const values = active
        .map((student) => student.weeklyProgress?.[index])
        .filter((value) => Number.isFinite(value));

      return {
        week: index + 1,
        value: values.length
          ? Math.round(
              values.reduce((a, b) => a + b, 0) / values.length
            )
          : 0,
      };
    });
  }, [students]);

  const statusDistribution = useMemo(() => {
    const active = students.filter(
      (student) => student.status === "training"
    );

    const total = active.length || 1;

    return ["regular", "late", "at_risk"].map((status) => {
      const count = active.filter(
        (student) => getMonitoringStatus(student) === status
      ).length;

      return {
        status,
        count,
        percent: Math.round((count / total) * 100),
      };
    });
  }, [students]);

  const fieldClass =
    "h-[44px] rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[12px] outline-none focus:border-[#09379A]";

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
            <Breadcrumb navigate={navigate} />

            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="m-0 text-[26px] font-bold">
                  متابعة التدريب
                </h1>
                <p className="m-0 mt-1 text-[12px] text-[#64748B]">
                  متابعة تقدم الطلاب وحضورهم وتقاريرهم أثناء التدريب
                </p>
              </div>

              <button
                type="button"
                onClick={() => exportMonitoringCsv(filtered)}
                className="inline-flex h-[44px] items-center gap-2 rounded-lg border border-[#E0E7F2] bg-white px-5 text-[12px]"
              >
                <Download size={16} />
                تصدير
              </button>
            </div>

            {/* STATS */}
            <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
              <Stat
                label="متوسط التقدم"
                value={stats.progress}
                unit="%"
                icon={Activity}
                color="blue"
              />
              <Stat
                label="متوسط الحضور"
                value={stats.attendance}
                unit="%"
                icon={CalendarCheck}
                color="green"
              />
              <Stat
                label="تقارير متأخرة"
                value={stats.lateReports}
                unit="تقرير"
                icon={FileText}
                color="orange"
              />
              <Stat
                label="متوسط التقييم الميداني"
                value={stats.evaluation}
                unit="من 5"
                icon={Star}
                color="cyan"
              />
            </div>

            {/* SEARCH */}
            <div className="mb-5 flex flex-col gap-3 lg:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]"
                />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="ابحث باسم الطالب أو الرقم الجامعي..."
                  className={`${fieldClass} w-full pr-11`}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <SlidersHorizontal
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  />
                  <select
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      setPage(1);
                    }}
                    aria-label="تصفية الحالة"
                    className={`${fieldClass} pr-9`}
                  >
                    <option value="all">كل الحالات</option>
                    <option value="regular">منتظم</option>
                    <option value="late">متأخر</option>
                    <option value="at_risk">متعثر</option>
                    <option value="completed">منتهٍ</option>
                    <option value="not_started">لم يبدأ</option>
                  </select>
                </div>

                <div className="relative">
                  <ArrowDownUp
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="ترتيب الطلاب"
                    className={`${fieldClass} pr-9`}
                  >
                    <option value="name">حسب الاسم</option>
                    <option value="progress">حسب التقدم</option>
                    <option value="attendance">حسب الحضور</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CHARTS */}
            <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_390px]">
              <Panel title="متوسط التقدم الأسبوعي (%)">
                <div className="flex h-[185px] items-end justify-around gap-3 pt-3">
                  {weeklyData.map((item) => (
                    <div
                      key={item.week}
                      className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                    >
                      <div className="flex h-[145px] w-full items-end justify-center">
                        <div
                          title={`${item.value}%`}
                          className="w-full max-w-[45px] rounded-t-md bg-[#09379A]"
                          style={{
                            height: `${Math.max(3, item.value)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-[#64748B]">
                        {item.week}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="m-0 mt-2 text-center text-[10px] text-[#64748B]">
                  الأسابيع التدريبية
                </p>
              </Panel>

              <Panel title="توزيع الحالات">
                <div className="space-y-5 pt-2">
                  {statusDistribution.map((item) => (
                    <div
                      key={item.status}
                      className="grid grid-cols-[85px_minmax(0,1fr)_40px] items-center gap-3 text-[11px]"
                    >
                      <span>
                        {STATUS_UI[item.status].label}
                      </span>

                      <div className="h-[8px] overflow-hidden rounded-full bg-[#E5EAF2]">
                        <div
                          className="h-full rounded-full bg-[#09379A]"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>

                      <span className="text-left font-bold">
                        {item.percent}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-start gap-2 rounded-lg bg-[#F8FAFC] p-3 text-[11px] leading-6 text-[#64748B]">
                  <AlertTriangle
                    size={16}
                    className="mt-1 shrink-0 text-[#B54708]"
                  />
                  الحالات المتأخرة والمتعثرة تحتاج متابعة من المشرف.
                </div>
              </Panel>
            </div>

            {/* STUDENTS TABLE */}
            <section className="min-w-0 rounded-xl border border-[#E0E7F2] bg-white p-3 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="m-0 text-[17px] font-bold text-[#062569]">
                  الطلاب وحالة التدريب
                </h2>
                <span className="text-[11px] text-[#64748B]">
                  {filtered.length} طالبًا
                </span>
              </div>

              <p className="mb-3 text-[11px] text-[#64748B] lg:hidden">
                اسحب الجدول أفقيًا لمشاهدة جميع الأعمدة
              </p>

              <div
                tabIndex={0}
                role="region"
                aria-label="جدول متابعة التدريب"
                className="max-w-full overflow-x-auto rounded-lg border border-[#E0E7F2]"
              >
                <table className="w-full min-w-[850px] border-collapse text-right text-[11px]">
                  <thead className="bg-[#F1F5F9] text-[#64748B]">
                    <tr>
                      <th className="px-4 py-4">الطالب</th>
                      <th className="px-4 py-4">التخصص</th>
                      <th className="px-4 py-4">جهة التدريب</th>
                      <th className="px-4 py-4">التقدم</th>
                      <th className="px-4 py-4">الحضور</th>
                      <th className="px-4 py-4">التقارير</th>
                      <th className="px-4 py-4">الحالة</th>
                      <th className="px-4 py-4">الإجراءات</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visible.map((student) => {
                      const progress = getProgress(student);
                      const status = getMonitoringStatus(student);

                      return (
                        <tr
                          key={student.id}
                          className="border-t border-[#E6EBF5] hover:bg-[#FAFBFE]"
                        >
                          <td className="px-4 py-5 font-bold">
                            {student.shortName}
                          </td>
                          <td className="px-4 py-5 leading-5">
                            {student.major}
                          </td>
                          <td className="px-4 py-5 leading-5">
                            {student.organization}
                          </td>
                          <td className="px-4 py-5">
                            <Progress value={progress} />
                          </td>
                          <td className="px-4 py-5">
                            {student.attendance}%
                          </td>
                          <td className="px-4 py-5 whitespace-nowrap">
                            {student.reportsSubmitted} من{" "}
                            {student.reportsRequired}
                          </td>
                          <td className="px-4 py-5">
                            <StatusBadge status={status} />
                          </td>
                          <td className="px-4 py-5">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/admin/training-monitoring/${student.id}`
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-[#E0E7F2] px-3 py-2 hover:border-[#09379A] hover:text-[#09379A]"
                            >
                              <Eye size={15} />
                              التفاصيل
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {!visible.length && (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-4 py-12 text-center text-[#64748B]"
                        >
                          لا توجد نتائج مطابقة.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={currentPage}
                totalPages={totalPages}
                total={filtered.length}
                onChange={setPage}
              />
            </section>

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}

// =====================================================
// COMPONENTS
// =====================================================

function Stat({ label, value, unit, icon: Icon, color }) {
  const colors = {
    blue: "bg-[#E8EEF9] text-[#09379A]",
    green: "bg-[#DCFCE7] text-[#15803D]",
    orange: "bg-[#FFE5D9] text-[#B54708]",
    cyan: "bg-[#DDF6FF] text-[#08759B]",
  };

  return (
    <div className="min-w-0 rounded-xl border border-[#E0E7F2] bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg ${colors[color]}`}
        >
          <Icon size={20} />
        </span>

        <span className="text-left text-[11px] font-medium">
          {label}
        </span>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <strong className="text-[30px] font-bold text-[#062569]">
          {value}
        </strong>
        <span className="text-[11px] text-[#64748B]">
          {unit}
        </span>
      </div>
    </div>
  );
}

function Progress({ value }) {
  return (
    <div className="flex min-w-[115px] items-center gap-2">
      <span className="w-[35px] text-[10px]">
        {value}%
      </span>
      <div className="h-[7px] min-w-[65px] flex-1 overflow-hidden rounded-full bg-[#E5EAF2]">
        <div
          className="h-full rounded-full bg-[#09379A]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = STATUS_UI[status] || STATUS_UI.unknown;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ${config.className}`}
    >
      <span className="h-[6px] w-[6px] rounded-full bg-current" />
      {config.label}
    </span>
  );
}

function Panel({ title, children }) {
  return (
    <section className="min-w-0 rounded-xl border border-[#E0E7F2] bg-white p-5 sm:p-6">
      <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  onChange,
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <span className="text-[11px] text-[#64748B]">
        عرض{" "}
        {total ? (page - 1) * PAGE_SIZE + 1 : 0}
        {" - "}
        {Math.min(page * PAGE_SIZE, total)}
        {" من "}
        {total}
      </span>

      <div className="flex flex-wrap items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="rounded-full border border-[#E0E7F2] px-3 py-2 text-[11px] disabled:opacity-40"
        >
          <ChevronRight size={13} className="inline" />
          السابق
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((number) => (
          <button
            key={number}
            onClick={() => onChange(number)}
            className={`h-[34px] w-[34px] rounded-full border text-[11px] ${
              page === number
                ? "border-[#09379A] bg-[#09379A] text-white"
                : "border-[#E0E7F2] bg-white"
            }`}
          >
            {number}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className="rounded-full border border-[#E0E7F2] px-3 py-2 text-[11px] disabled:opacity-40"
        >
          التالي
          <ChevronLeft size={13} className="inline" />
        </button>
      </div>
    </div>
  );
}

function Breadcrumb({ navigate }) {
  return (
    <div className="mb-8 flex items-center gap-2 text-[12px] text-[#64748B]">
      <button onClick={() => navigate("/admin/dashboard")}>
        الرئيسية
      </button>
      <ChevronLeft size={15} />
      <span className="font-bold text-[#111C2D]">
        متابعة التدريب
      </span>
    </div>
  );
}




