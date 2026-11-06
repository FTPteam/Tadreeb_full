import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Menu, Search, SlidersHorizontal, ArrowDownUp,
  Eye, ChevronLeft, ChevronRight, Star,
  CheckCircle2, Clock3, Percent, RotateCcw,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

import {
  getEvaluations,
  calculateFinalScore,
  formatScore,
  STATUS_CONFIG,
} from "./evaluationStore";

const PAGE_SIZE = 4;

export default function Evaluations() {
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState(getEvaluations);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name");
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const refresh = () => setEvaluations(getEvaluations());

    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("evaluations-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("evaluations-updated", refresh);
    };
  }, []);

  const stats = useMemo(() => {
    const scores = evaluations
      .map(calculateFinalScore)
      .filter((score) => score != null);

    return {
      total: evaluations.length,
      completed: evaluations.filter(
        (item) => ["completed", "approved"].includes(item.status)
      ).length,
      review: evaluations.filter(
        (item) => item.status === "review"
      ).length,
      average: scores.length
        ? (
            scores.reduce((sum, score) => sum + score, 0) /
            scores.length
          ).toFixed(1)
        : "—",
    };
  }, [evaluations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return evaluations
      .filter((item) => {
        const matches =
          !q ||
          [item.fullName, item.student, item.studentId, item.organization]
            .some((value) =>
              String(value || "").toLowerCase().includes(q)
            );

        return (
          matches &&
          (filter === "all" || item.status === filter)
        );
      })
      .sort((a, b) => {
        if (sort === "final") {
          return (
            (calculateFinalScore(b) ?? -1) -
            (calculateFinalScore(a) ?? -1)
          );
        }

        if (sort === "field") {
          return (b.fieldScore ?? -1) - (a.fieldScore ?? -1);
        }

        return a.student.localeCompare(b.student, "ar");
      });
  }, [evaluations, search, filter, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const activePage = Math.min(page, totalPages);

  const rows = filtered.slice(
    (activePage - 1) * PAGE_SIZE,
    activePage * PAGE_SIZE
  );

  const reset = () => {
    setSearch("");
    setFilter("all");
    setSort("name");
    setPage(1);
    setShowFilter(false);
    setShowSort(false);
  };

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

            <Breadcrumb
              navigate={navigate}
              current="التقييمات"
            />

            <div className="mb-6">
              <h1 className="m-0 text-[26px] font-bold">
                التقييمات
              </h1>
              <p className="m-0 mt-1 text-[12px] text-[#64748B]">
                إدارة ومراجعة تقييمات الطلاب
              </p>
            </div>

            {/* STATISTICS */}
            <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
              <StatCard
                label="إجمالي التقييمات"
                value={stats.total}
                unit="تقييم"
                icon={Star}
                color="blue"
              />
              <StatCard
                label="مكتملة ومعتمدة"
                value={stats.completed}
                unit="تقييم"
                icon={CheckCircle2}
                color="green"
              />
              <StatCard
                label="قيد المراجعة"
                value={stats.review}
                unit="تقييم"
                icon={Clock3}
                color="orange"
              />
              <StatCard
                label="متوسط الدرجة النهائية"
                value={stats.average}
                unit="من 5"
                icon={Percent}
                color="cyan"
              />
            </section>

            {/* SEARCH / FILTER / SORT */}
            <section className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]"
                />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="ابحث عن طالب أو الرقم الجامعي..."
                  className="h-[44px] w-full rounded-[8px] border border-[#E0E7F2] bg-white pl-4 pr-11 text-[12px] outline-none focus:border-[#09379A]"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFilter(!showFilter);
                      setShowSort(false);
                    }}
                    className="flex h-[44px] items-center gap-2 rounded-lg border border-[#E0E7F2] bg-white px-4 text-[12px]"
                  >
                    <SlidersHorizontal size={17} />
                    تصفية
                  </button>

                  {showFilter && (
                    <div className="absolute right-0 top-[50px] z-20 w-[190px] rounded-lg border border-[#E0E7F2] bg-white p-2 shadow-lg">
                      {[
                        ["all", "كل التقييمات"],
                        ["review", "قيد المراجعة"],
                        ["completed", "مكتمل"],
                        ["approved", "معتمد"],
                        ["not_started", "لم يبدأ"],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setFilter(value);
                            setPage(1);
                            setShowFilter(false);
                          }}
                          className={`w-full rounded-md px-3 py-2 text-right text-[11px] ${
                            filter === value
                              ? "bg-[#EEF4FF] text-[#09379A]"
                              : "hover:bg-[#F8FAFC]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={reset}
                        className="mt-2 flex w-full items-center justify-center gap-1 border-t py-2 text-[11px]"
                      >
                        <RotateCcw size={14} />
                        إعادة ضبط
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSort(!showSort);
                      setShowFilter(false);
                    }}
                    className="flex h-[44px] items-center gap-2 rounded-lg border border-[#E0E7F2] bg-white px-4 text-[12px]"
                  >
                    <ArrowDownUp size={17} />
                    ترتيب
                  </button>

                  {showSort && (
                    <div className="absolute left-0 top-[50px] z-20 w-[190px] rounded-lg border border-[#E0E7F2] bg-white p-2 shadow-lg">
                      {[
                        ["name", "حسب الاسم"],
                        ["field", "التقييم الميداني"],
                        ["final", "الدرجة النهائية"],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setSort(value);
                            setShowSort(false);
                          }}
                          className={`w-full rounded-md px-3 py-2 text-right text-[11px] ${
                            sort === value
                              ? "bg-[#EEF4FF] text-[#09379A]"
                              : "hover:bg-[#F8FAFC]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* TABLE */}
            <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-3 sm:p-5">
              <div className="w-full max-w-full overflow-x-auto rounded-lg border border-[#E0E7F2]">
                <table className="w-full min-w-[760px] border-collapse text-right text-[11px]">
                  <thead className="bg-[#F1F5F9] text-[#64748B]">
                    <tr>
                      <th className="px-4 py-4">الطالب</th>
                      <th className="px-4 py-4">تقييم الميداني</th>
                      <th className="px-4 py-4">تقييم الأكاديمي</th>
                      <th className="px-4 py-4">الدرجة النهائية</th>
                      <th className="px-4 py-4">الحالة</th>
                      <th className="px-4 py-4">الإجراءات</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-[#E6EBF5] hover:bg-[#FAFBFE]"
                      >
                        <td className="px-4 py-5 font-bold">
                          {item.fullName || item.student}
                        </td>
                        <td className="px-4 py-5">
                          {formatScore(item.fieldScore, 1)}
                        </td>
                        <td className="px-4 py-5">
                          {formatScore(item.academicScore, 1)}
                        </td>
                        <td className="px-4 py-5 font-bold text-[#09379A]">
                          {formatScore(calculateFinalScore(item))}
                        </td>
                        <td className="px-4 py-5">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-4 py-5">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/evaluations/${encodeURIComponent(item.id)}`
                              )
                            }
                            className="inline-flex h-[34px] items-center gap-2 rounded-lg border border-[#E0E7F2] bg-white px-3 hover:border-[#09379A] hover:text-[#09379A]"
                          >
                            <Eye size={15} />
                            عرض
                          </button>
                        </td>
                      </tr>
                    ))}

                    {rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-14 text-center text-[#64748B]"
                        >
                          لا توجد تقييمات مطابقة للبحث.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="m-0 text-[11px] text-[#64748B]">
                  عرض{" "}
                  {filtered.length ? (activePage - 1) * PAGE_SIZE + 1 : 0}
                  {" - "}
                  {Math.min(activePage * PAGE_SIZE, filtered.length)}
                  {" من "}
                  {filtered.length} تقييم
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={activePage === 1}
                    onClick={() => setPage(activePage - 1)}
                    className="rounded-full border border-[#E0E7F2] px-3 py-2 text-[11px] disabled:opacity-40"
                  >
                    <ChevronRight size={14} className="inline" />
                    السابق
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => setPage(number)}
                      className={`h-[34px] w-[34px] rounded-full border text-[11px] ${
                        number === activePage
                          ? "border-[#09379A] bg-[#09379A] text-white"
                          : "border-[#E0E7F2] bg-white"
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={activePage === totalPages}
                    onClick={() => setPage(activePage + 1)}
                    className="rounded-full border border-[#E0E7F2] px-3 py-2 text-[11px] disabled:opacity-40"
                  >
                    التالي
                    <ChevronLeft size={14} className="inline" />
                  </button>
                </div>
              </div>
            </section>

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, icon: Icon, color }) {
  const styles = {
    blue: "bg-[#E8EEF9] text-[#09379A]",
    green: "bg-[#DCFCE7] text-[#15803D]",
    orange: "bg-[#FFE5D9] text-[#B54708]",
    cyan: "bg-[#DDF6FF] text-[#08759B]",
  };

  return (
    <div className="min-w-0 rounded-xl border border-[#E0E7F2] bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div
          className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg ${styles[color]}`}
        >
          <Icon size={20} />
        </div>

        <span className="text-left text-[11px] font-semibold">
          {label}
        </span>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <strong className="text-[29px] font-bold text-[#062569]">
          {value}
        </strong>
        <span className="text-[10px] text-[#64748B]">
          {unit}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const item = STATUS_CONFIG[status] || STATUS_CONFIG.not_started;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ${item.className}`}
    >
      <span className="h-[5px] w-[5px] rounded-full bg-current" />
      {item.label}
    </span>
  );
}

function Breadcrumb({ navigate, current }) {
  return (
    <div className="mb-8 flex items-center gap-2 text-[12px] text-[#64748B]">
      <button onClick={() => navigate("/admin/dashboard")}>
        الرئيسية
      </button>
      <ChevronLeft size={15} />
      <span className="font-semibold text-[#111C2D]">
        {current}
      </span>
    </div>
  );
}




