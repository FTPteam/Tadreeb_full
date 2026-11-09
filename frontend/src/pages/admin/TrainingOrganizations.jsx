import AcademicFooter from "../../components/shared/AcademicFooter";
import { getOrganizations, refreshOrganizations, ORGANIZATIONS_EVENT } from "./trainingOrganizationsStore";
import AdminHeader from "../../components/admin/Header";

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell, Menu, Search, SlidersHorizontal, ArrowDownUp,
  Eye, Plus, BadgeCheck, ChevronLeft, ChevronRight,
  X, RotateCcw, CheckCircle2, Clock3, Users,
  Building2, Code2, Cog, Wrench, Palette,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

const APPROVALS_PATH = "/admin/approvals/training-providers";
const PAGE_SIZE = 4;
const readOrganizations = getOrganizations;

const STATUS_CONFIG = {
  approved: { label: "معتمدة", style: "bg-[#DCFCE7] text-[#15803D]" },
  pending: { label: "بانتظار الاعتماد", style: "bg-[#FFE5D9] text-[#B54708]" },
  review: { label: "قيد المراجعة", style: "bg-[#DDF6FF] text-[#08759B]" },
  renewal: { label: "قيد التجديد", style: "bg-[#FFF0D9] text-[#B54708]" },
  rejected: { label: "مرفوضة", style: "bg-[#FEE2E2] text-[#DC2626]" },
};

function getOrganizationIcon(type = "") {
  const text = String(type).toLowerCase();

  if (text.includes("صناعي") || text.includes("تحكم"))
    return { Icon: Cog, style: "bg-[#FFE5D9] text-[#B54708]" };

  if (text.includes("صيانة"))
    return { Icon: Wrench, style: "bg-[#DCFCE7] text-[#15803D]" };

  if (text.includes("تصميم"))
    return { Icon: Palette, style: "bg-[#DDF6FF] text-[#08759B]" };

  if (text.includes("تقنية") || text.includes("معلومات"))
    return { Icon: Code2, style: "bg-[#E8EEF9] text-[#09379A]" };

  return { Icon: Building2, style: "bg-[#E8EEF9] text-[#09379A]" };
}

export default function TrainingOrganizations() {
  const navigate = useNavigate();
  const location = useLocation();

  const [organizations, setOrganizations] = useState(readOrganizations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const successMessage = location.state?.successMessage;

  useEffect(() => {
    if (typeof refreshOrganizations === 'function') refreshOrganizations();
    setOrganizations(readOrganizations());
  }, [location.key]);

  useEffect(() => {
    const refresh = () => setOrganizations(readOrganizations());
    window.addEventListener("storage", refresh);
    window.addEventListener(ORGANIZATIONS_EVENT, refresh);
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(ORGANIZATIONS_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const types = useMemo(
    () => [...new Set(organizations.map((item) => item.type).filter(Boolean))],
    [organizations]
  );

  const stats = useMemo(() => ({
    total: organizations.length,
    approved: organizations.filter((item) => item.status === "approved").length,
    pending: organizations.filter((item) =>
      ["pending", "review", "renewal"].includes(item.status)
    ).length,
    students: organizations.reduce(
      (sum, item) => sum + Number(item.students ?? item.activeStudents ?? 0),
      0
    ),
  }), [organizations]);

  const filteredOrganizations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return organizations
      .filter((item) => {
        const matchesSearch = !query ||
          [item.name, item.type, item.location, item.phone]
            .some((value) => String(value || "").toLowerCase().includes(query));

        return (
          matchesSearch &&
          (statusFilter === "all" || item.status === statusFilter) &&
          (typeFilter === "all" || item.type === typeFilter)
        );
      })
      .sort((a, b) => {
        if (sortOrder === "students")
          return Number(b.students ?? b.activeStudents ?? 0) -
                 Number(a.students ?? a.activeStudents ?? 0);

        if (sortOrder === "location")
          return String(a.location || "").localeCompare(String(b.location || ""), "ar");

        return String(a.name || "").localeCompare(String(b.name || ""), "ar");
      });
  }, [organizations, search, statusFilter, typeFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredOrganizations.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleOrganizations = filteredOrganizations.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortOrder("name");
    setCurrentPage(1);
    setShowFilters(false);
    setShowSort(false);
  };

  const viewOrganization = (organization) => {
    navigate(
      `/admin/training-organizations/${encodeURIComponent(organization.id)}`,
      { state: { organization } }
    );
  };

  const selectClass =
    "h-[40px] w-full rounded-[8px] border border-[#E0E7F2] bg-white px-3 text-[12px] outline-none focus:border-[#09379A]";

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
            <div className="mb-3 flex items-center gap-2 text-[12px] text-[#64748B]">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="hover:text-[#09379A]"
              >
                الرئيسية
              </button>
              <ChevronLeft size={15} />
              <span className="font-semibold text-[#111C2D]">جهات التدريب</span>
            </div>

            {/* TITLE AND ACTIONS */}
            <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="m-0 text-[26px] font-bold">جهات التدريب</h1>
                <p className="m-0 mt-1 text-[13px] text-[#64748B]">
                  المؤسسات والشركات والمراكز التي تستقبل الطلاب
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(APPROVALS_PATH)}
                  className="inline-flex h-[44px] items-center gap-2 rounded-[9px] border border-[#09379A] bg-white px-5 text-[12px] font-bold text-[#09379A] hover:bg-[#EEF4FF]"
                >
                  <BadgeCheck size={18} />
                  طلبات الاعتماد
                  {stats.pending > 0 && (
                    <span className="rounded-full bg-[#E8EEF9] px-2 py-0.5 text-[10px]">
                      {stats.pending}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/training-organizations/add")}
                  className="inline-flex h-[44px] items-center gap-2 rounded-[9px] bg-[#FF6534] px-5 text-[12px] font-bold text-white hover:bg-[#E95526]"
                >
                  <Plus size={17} />
                  إضافة جهة
                </button>
              </div>
            </section>

            {/* SUCCESS MESSAGE */}
            {successMessage && (
              <div
                role="status"
                className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[12px] text-[#15803D]"
              >
                <span>{successMessage}</span>
                <button
                  type="button"
                  aria-label="إغلاق التنبيه"
                  onClick={() => navigate(location.pathname, {
                    replace: true,
                    state: null,
                  })}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* STATISTICS */}
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                label="إجمالي الجهات"
                value={stats.total}
                unit="جهة"
                icon={Building2}
                color="blue"
              />
              <StatCard
                label="الجهات المعتمدة"
                value={stats.approved}
                unit="جهة"
                icon={CheckCircle2}
                color="green"
              />
              <StatCard
                label="طلبات تحتاج مراجعة"
                value={stats.pending}
                unit="جهة"
                icon={Clock3}
                color="orange"
              />
              <StatCard
                label="إجمالي المتدربين"
                value={stats.students}
                unit="طالب"
                icon={Users}
                color="cyan"
              />
            </div>

            {/* SEARCH AND FILTERS */}
            <section className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="ابحث باسم الجهة..."
                  className="h-[44px] w-full rounded-[8px] border border-[#E0E7F2] bg-white pl-4 pr-11 text-[13px] outline-none focus:border-[#09379A]"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFilters((value) => !value);
                      setShowSort(false);
                    }}
                    className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[12px]"
                  >
                    <SlidersHorizontal size={17} />
                    تصفية
                  </button>

                  {showFilters && (
                    <div className="absolute right-0 top-[50px] z-20 w-[270px] rounded-[12px] border border-[#E0E7F2] bg-white p-4 shadow-lg">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="m-0 text-[13px] font-bold">تصفية الجهات</h3>
                        <button type="button" onClick={() => setShowFilters(false)}>
                          <X size={16} />
                        </button>
                      </div>

                      <label className="mb-2 block text-[11px] font-semibold">
                        حالة الاعتماد
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(event) => {
                          setStatusFilter(event.target.value);
                          setCurrentPage(1);
                        }}
                        className={`${selectClass} mb-4`}
                      >
                        <option value="all">كل الحالات</option>
                        <option value="approved">معتمدة</option>
                        <option value="pending">بانتظار الاعتماد</option>
                        <option value="review">قيد المراجعة</option>
                        <option value="renewal">قيد التجديد</option>
                        <option value="rejected">مرفوضة</option>
                      </select>

                      <label className="mb-2 block text-[11px] font-semibold">
                        نوع الجهة
                      </label>
                      <select
                        value={typeFilter}
                        onChange={(event) => {
                          setTypeFilter(event.target.value);
                          setCurrentPage(1);
                        }}
                        className={`${selectClass} mb-4`}
                      >
                        <option value="all">كل الأنواع</option>
                        {types.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={resetFilters}
                        className="flex w-full items-center justify-center gap-2 rounded-[7px] border border-[#E0E7F2] py-2 text-[11px]"
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
                      setShowSort((value) => !value);
                      setShowFilters(false);
                    }}
                    className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[12px]"
                  >
                    <ArrowDownUp size={17} />
                    ترتيب
                  </button>

                  {showSort && (
                    <div className="absolute left-0 top-[50px] z-20 w-[200px] rounded-[10px] border border-[#E0E7F2] bg-white p-2 shadow-lg">
                      {[
                        ["name", "حسب اسم الجهة"],
                        ["students", "حسب عدد المتدربين"],
                        ["location", "حسب الموقع"],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setSortOrder(value);
                            setShowSort(false);
                          }}
                          className={`w-full rounded-[7px] px-3 py-2 text-right text-[12px] ${
                            sortOrder === value
                              ? "bg-[#EEF4FF] font-bold text-[#09379A]"
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

            {/* ORGANIZATIONS TABLE */}
            <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-3 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="m-0 text-[16px] font-bold text-[#062569]">
                  قائمة جهات التدريب
                </h2>
                <span className="text-[11px] text-[#64748B]">
                  {filteredOrganizations.length} جهة
                </span>
              </div>

              <div className="overflow-x-auto rounded-[9px] border border-[#E0E7F2]">
                <table className="w-full min-w-[820px] border-collapse text-right text-[11px]">
                  <thead className="bg-[#F1F5F9] text-[#64748B]">
                    <tr>
                      <th className="px-4 py-4">الجهة</th>
                      <th className="px-4 py-4">النوع</th>
                      <th className="px-4 py-4">الموقع</th>
                      <th className="px-4 py-4">عدد المتدربين</th>
                      <th className="px-4 py-4">حالة الاعتماد</th>
                      <th className="px-4 py-4">الإجراءات</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleOrganizations.map((item) => {
                      const { Icon, style } = getOrganizationIcon(item.type);

                      return (
                        <tr
                          key={item.id}
                          className="border-t border-[#E6EBF5] hover:bg-[#FAFBFE]"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[9px] ${style}`}
                              >
                                <Icon size={19} />
                              </div>
                              <div>
                                <p className="m-0 font-bold">{item.name}</p>
                                <p dir="ltr" className="m-0 mt-1 text-right text-[10px] text-[#64748B]">
                                  {item.phone || "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">{item.type}</td>
                          <td className="px-4 py-4">{item.location}</td>
                          <td className="px-4 py-4">
                            {item.students ?? item.activeStudents ?? 0}
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => viewOrganization(item)}
                              className="inline-flex h-[34px] items-center gap-2 rounded-[7px] border border-[#E0E7F2] bg-white px-3 text-[11px] hover:border-[#09379A] hover:text-[#09379A]"
                            >
                              <Eye size={15} />
                              عرض
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {visibleOrganizations.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-[12px] text-[#64748B]">
                          لا توجد جهات مطابقة للبحث.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <span className="text-[11px] text-[#64748B]">
                  عرض{" "}
                  {filteredOrganizations.length
                    ? (safePage - 1) * PAGE_SIZE + 1
                    : 0}
                  {" - "}
                  {Math.min(safePage * PAGE_SIZE, filteredOrganizations.length)}
                  {" من "}
                  {filteredOrganizations.length} جهة
                </span>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    className="flex h-[34px] items-center gap-1 rounded-full border border-[#E0E7F2] px-3 text-[11px] disabled:opacity-40"
                  >
                    <ChevronRight size={14} />
                    السابق
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`h-[34px] min-w-[34px] rounded-full border text-[11px] ${
                        page === safePage
                          ? "border-[#09379A] bg-[#09379A] text-white"
                          : "border-[#E0E7F2] bg-white"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    className="flex h-[34px] items-center gap-1 rounded-full border border-[#E0E7F2] px-3 text-[11px] disabled:opacity-40"
                  >
                    التالي
                    <ChevronLeft size={14} />
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

function StatusBadge({ status }) {
  const item = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-semibold ${item.style}`}>
      <span className="h-[6px] w-[6px] rounded-full bg-current" />
      {item.label}
    </span>
  );
}

// =====================================================
// UPDATED STAT CARD - FIGMA LAYOUT
// =====================================================

function StatCard({ label, value, unit, icon: Icon, color = "blue" }) {
  const styles = {
    blue: "bg-[#E8EEF9] text-[#09379A]",
    green: "bg-[#DCFCE7] text-[#15803D]",
    orange: "bg-[#FFE5D9] text-[#B54708]",
    cyan: "bg-[#DDF6FF] text-[#08759B]",
  };

  return (
    <div
      dir="rtl"
      className="min-w-0 rounded-[12px] border border-[#E0E7F2] bg-white p-4 sm:p-5"
    >
      {/* ICON ON RIGHT / LABEL ON LEFT */}
      <div className="flex w-full items-center justify-between gap-3">
        <div
          className={`flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-[8px] ${styles[color]}`}
        >
          <Icon size={20} />
        </div>

        <span className="min-w-0 text-left text-[11px] font-semibold leading-5 text-[#111C2D]">
          {label}
        </span>
      </div>

      {/* NUMBER ON RIGHT */}
      <div className="mt-5 flex items-baseline justify-start gap-2">
        <strong className="text-[27px] font-bold leading-none text-[#09379A]">
          {value}
        </strong>

        <span className="text-[11px] text-[#64748B]">
          {unit}
        </span>
      </div>
    </div>
  );
}




