import AcademicFooter from "../../components/shared/AcademicFooter";
import { getOrganizations, ORGANIZATIONS_EVENT } from "./trainingOrganizationsStore";
import AdminHeader from "../../components/admin/Header";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell, Menu, ChevronLeft, ChevronRight, Eye,
  ArrowRight, Search, SlidersHorizontal, BadgeCheck,
  Clock3, CheckCircle2, XCircle, Building2,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

const PAGE_SIZE = 5;
const readOrganizations = getOrganizations;

const STATUS_CONFIG = {
  pending: {
    label: "بانتظار الاعتماد",
    className: "bg-[#FFE5D9] text-[#B54708]",
  },
  review: {
    label: "قيد المراجعة",
    className: "bg-[#DDF6FF] text-[#08759B]",
  },
  renewal: {
    label: "قيد التجديد",
    className: "bg-[#FFF0D9] text-[#B54708]",
  },
  approved: {
    label: "معتمدة",
    className: "bg-[#DCFCE7] text-[#15803D]",
  },
  rejected: {
    label: "مرفوضة",
    className: "bg-[#FEE2E2] text-[#DC2626]",
  },
};

const FILTERS = [
  { id: "all", label: "جميع الجهات" },
  { id: "action", label: "تحتاج مراجعة" },
  { id: "pending", label: "بانتظار الاعتماد" },
  { id: "review", label: "قيد المراجعة" },
  { id: "renewal", label: "قيد التجديد" },
  { id: "approved", label: "معتمدة" },
  { id: "rejected", label: "مرفوضة" },
];

export default function ApprovalsTrainingProviders() {
  const navigate = useNavigate();
  const location = useLocation();

  const [organizations, setOrganizations] =
    useState(readOrganizations);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("action");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
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

  const stats = useMemo(() => ({
    total: organizations.length,
    action: organizations.filter(
      (item) => ["pending", "review", "renewal"].includes(item.status)
    ).length,
    approved: organizations.filter(
      (item) => item.status === "approved"
    ).length,
    rejected: organizations.filter(
      (item) => item.status === "rejected"
    ).length,
  }), [organizations]);

  const filteredOrganizations = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = organizations.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.name,
          item.type,
          item.location,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesFilter =
        filter === "all" ||
        (filter === "action"
          ? ["pending", "review", "renewal"].includes(item.status)
          : item.status === filter);

      return matchesSearch && matchesFilter;
    });

    return [...result].sort((a, b) => {
      if (sortOrder === "name") {
        return String(a.name).localeCompare(String(b.name), "ar");
      }

      if (sortOrder === "oldest") {
        return String(a.requestDate || "").localeCompare(
          String(b.requestDate || "")
        );
      }

      return String(b.requestDate || "").localeCompare(
        String(a.requestDate || "")
      );
    });
  }, [organizations, search, filter, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrganizations.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleOrganizations = filteredOrganizations.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleReview = (organization) => {
    navigate(
      `/admin/training-organizations/${encodeURIComponent(
        organization.id
      )}`,
      {
        state: {
          organization,
          from: "approvals",
        },
      }
    );
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

            {/* BREADCRUMB */}
            <div className="mb-4 flex items-center gap-2 text-[12px] text-[#64748B]">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <button
                type="button"
                onClick={() => navigate("/admin/training-organizations")}
              >
                جهات التدريب
              </button>

              <ChevronLeft size={15} />

              <span className="font-semibold text-[#111C2D]">
                طلبات اعتماد الجهات
              </span>
            </div>

            {/* PAGE TITLE */}
            <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="m-0 text-[26px] font-bold">
                  طلبات اعتماد جهات التدريب
                </h1>

                <p className="m-0 mt-1 text-[13px] text-[#64748B]">
                  متابعة طلبات الاعتماد ومراجعة الجهات قبل اتخاذ القرار
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/training-organizations")}
                className="inline-flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px] font-semibold hover:border-[#09379A]"
              >
                <ArrowRight size={17} />
                جهات التدريب
              </button>
            </section>

            {/* STATS */}
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                title="إجمالي الجهات"
                value={stats.total}
                icon={Building2}
                style="bg-[#E8EEF9] text-[#09379A]"
              />
              <StatCard
                title="تحتاج مراجعة"
                value={stats.action}
                icon={Clock3}
                style="bg-[#FFE5D9] text-[#B54708]"
              />
              <StatCard
                title="الجهات المعتمدة"
                value={stats.approved}
                icon={CheckCircle2}
                style="bg-[#DCFCE7] text-[#15803D]"
              />
              <StatCard
                title="الجهات المرفوضة"
                value={stats.rejected}
                icon={XCircle}
                style="bg-[#FEE2E2] text-[#DC2626]"
              />
            </div>

            {/* WORKFLOW NOTE */}
            <section className="mb-6 flex items-start gap-3 rounded-[12px] border border-[#D7E4FA] bg-[#EEF4FF] p-4">
              <BadgeCheck
                size={22}
                className="mt-0.5 shrink-0 text-[#09379A]"
              />
              <div>
                <h2 className="m-0 text-[13px] font-bold text-[#09379A]">
                  كيف تتم مراجعة الاعتماد؟
                </h2>
                <p className="m-0 mt-1 text-[11px] leading-6 text-[#475569]">
                  اختر الجهة واضغط على «مراجعة التفاصيل»، ثم راجع بياناتها
                  وتخصصاتها والوثائق المتاحة. اعتماد الجهة أو رفضها يتم
                  من داخل صفحة التفاصيل فقط، وبعد تسجيل القرار ستتحدث
                  حالتها هنا وفي قائمة جهات التدريب.
                </p>
              </div>
            </section>

            {/* SEARCH */}
            <section className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
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
                  placeholder="ابحث باسم الجهة أو نوعها أو موقعها..."
                  className="h-[44px] w-full rounded-[8px] border border-[#E0E7F2] bg-white pl-4 pr-11 text-[12px] outline-none focus:border-[#09379A]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[12px]"
                  >
                    <SlidersHorizontal size={17} />
                    تصفية
                  </button>

                  {showFilters && (
                    <div className="absolute right-0 top-[50px] z-20 w-[230px] rounded-[10px] border border-[#E0E7F2] bg-white p-2 shadow-lg">
                      {FILTERS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setFilter(item.id);
                            setCurrentPage(1);
                            setShowFilters(false);
                          }}
                          className={`block w-full rounded-[7px] px-3 py-2 text-right text-[11px] ${
                            filter === item.id
                              ? "bg-[#EEF4FF] font-bold text-[#09379A]"
                              : "hover:bg-[#F8FAFC]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  aria-label="ترتيب طلبات الاعتماد"
                  className="h-[44px] rounded-[8px] border border-[#E0E7F2] bg-white px-3 text-[12px] outline-none focus:border-[#09379A]"
                >
                  <option value="newest">الأحدث أولًا</option>
                  <option value="oldest">الأقدم أولًا</option>
                  <option value="name">اسم الجهة</option>
                </select>
              </div>
            </section>

            {/* FILTER CHIPS */}
            <div className="mb-5 flex flex-wrap gap-2">
              {[
                { id: "action", label: "تحتاج مراجعة" },
                { id: "all", label: "الكل" },
                { id: "approved", label: "معتمدة" },
                { id: "rejected", label: "مرفوضة" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFilter(item.id);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full border px-4 py-2 text-[11px] ${
                    filter === item.id
                      ? "border-[#09379A] bg-[#09379A] font-bold text-white"
                      : "border-[#E0E7F2] bg-white text-[#475569]"
                  }`}
                >
                  {item.label}
                  {" "}
                  {item.id === "all"
                    ? stats.total
                    : item.id === "action"
                    ? stats.action
                    : stats[item.id]}
                </button>
              ))}
            </div>

            {/* TABLE */}
            <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-3 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="m-0 text-[16px] font-bold text-[#062569]">
                  قائمة طلبات الاعتماد
                </h2>

                <span className="text-[11px] text-[#64748B]">
                  {filteredOrganizations.length} جهة
                </span>
              </div>

              <div className="overflow-x-auto rounded-[9px] border border-[#E0E7F2]">
                <table className="w-full min-w-[790px] border-collapse text-right text-[11px]">
                  <thead className="bg-[#F1F5F9] text-[#64748B]">
                    <tr>
                      <th className="px-4 py-4">الجهة</th>
                      <th className="px-4 py-4">النوع</th>
                      <th className="px-4 py-4">تاريخ الطلب</th>
                      <th className="px-4 py-4">الحالة</th>
                      <th className="px-4 py-4">الإجراءات</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleOrganizations.map((organization) => (
                      <tr
                        key={organization.id}
                        className="border-t border-[#E6EBF5] transition hover:bg-[#FAFBFE]"
                      >
                        <td className="px-4 py-5 font-bold">
                          {organization.name}
                        </td>

                        <td className="px-4 py-5">
                          {organization.type || "—"}
                        </td>

                        <td
                          dir="ltr"
                          className="px-4 py-5 text-right"
                        >
                          {organization.requestDate || "—"}
                        </td>

                        <td className="px-4 py-5">
                          <StatusBadge status={organization.status} />
                        </td>

                        <td className="px-4 py-5">
                          <button
                            type="button"
                            onClick={() => handleReview(organization)}
                            className="inline-flex h-[35px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-3 text-[11px] font-semibold text-[#09379A] transition hover:border-[#09379A] hover:bg-[#EEF4FF]"
                          >
                            <Eye size={16} />
                            مراجعة التفاصيل
                          </button>
                        </td>
                      </tr>
                    ))}

                    {visibleOrganizations.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-14 text-center"
                        >
                          <Search
                            size={24}
                            className="mx-auto mb-3 text-[#94A3B8]"
                          />
                          <p className="m-0 text-[12px] text-[#64748B]">
                            لا توجد طلبات مطابقة لهذه التصفية.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setSearch("");
                              setFilter("action");
                              setCurrentPage(1);
                            }}
                            className="mt-3 text-[11px] font-semibold text-[#09379A]"
                          >
                            إعادة ضبط
                          </button>
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
                  {Math.min(
                    safePage * PAGE_SIZE,
                    filteredOrganizations.length
                  )}
                  {" من "}
                  {filteredOrganizations.length} جهة
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={safePage === 1}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(1, page - 1)
                      )
                    }
                    className="flex h-[34px] items-center gap-1 rounded-full border border-[#E0E7F2] px-3 text-[11px] disabled:opacity-40"
                  >
                    <ChevronRight size={14} />
                    السابق
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`h-[34px] min-w-[34px] rounded-full border text-[11px] ${
                        page === safePage
                          ? "border-[#09379A] bg-[#09379A] text-white"
                          : "border-[#E0E7F2]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
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
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-semibold ${item.className}`}
    >
      <span className="h-[6px] w-[6px] rounded-full bg-current" />
      {item.label}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, style }) {
  return (
    <div className="rounded-[12px] border border-[#E0E7F2] bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#64748B]">
          {title}
        </span>

        <div
          className={`flex h-[39px] w-[39px] items-center justify-center rounded-[8px] ${style}`}
        >
          <Icon size={20} />
        </div>
      </div>

      <p className="m-0 mt-4 text-[27px] font-bold text-[#09379A]">
        {value}
      </p>
    </div>
  );
}


