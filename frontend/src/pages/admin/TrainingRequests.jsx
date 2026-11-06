import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Bell,
  Menu,
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  Eye,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RefreshCw,
  Inbox,
  X,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";
import { getRequests } from "./trainingRequestsStore";

// =====================================================
// DATA & STORAGE
// =====================================================

const PAGE_SIZE = 4;

// =====================================================
// FILTER & SORT CONFIG
// =====================================================

const FILTERS = [
  { id: "all", label: "الكل" },
  { id: "pending", label: "معلّق" },
  { id: "approved", label: "مقبول" },
  { id: "rejected", label: "مرفوض" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "الأحدث أولًا" },
  { id: "oldest", label: "الأقدم أولًا" },
  { id: "student", label: "حسب اسم الطالب" },
];

// =====================================================
// MAIN PAGE
// =====================================================

export default function TrainingRequests() {
  const navigate = useNavigate();
  const location = useLocation();

  const [requests, setRequests] = useState(getRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // =====================================================
  // DATA REFRESH
  // =====================================================

  const refreshRequests = () => {
    setRequests(getRequests());
  };

  useEffect(() => {
    refreshRequests();
  }, [location.key]);

  useEffect(() => {
    const refresh = () => setRequests(getRequests());

    window.addEventListener("storage", refresh);
    window.addEventListener("admin-training-requests-updated", refresh);
    window.addEventListener("cis-provider-applications-updated", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("admin-training-requests-updated", refresh);
      window.removeEventListener("cis-provider-applications-updated", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  // =====================================================
  // FILTERING AND SORTING
  // =====================================================

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = requests.filter((request) => {
      const searchable = [
        request.id,
        request.studentName,
        request.fullName,
        request.studentId,
        request.organization,
      ];

      const matchesSearch =
        !query ||
        searchable.some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );

      const matchesStatus =
        statusFilter === "all" ||
        request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...result].sort((a, b) => {
      if (sortOrder === "oldest") {
        return String(a.requestDate || "").localeCompare(
          String(b.requestDate || "")
        );
      }

      if (sortOrder === "student") {
        return String(a.studentName || "").localeCompare(
          String(b.studentName || ""),
          "ar"
        );
      }

      return String(b.requestDate || "").localeCompare(
        String(a.requestDate || "")
      );
    });
  }, [requests, search, statusFilter, sortOrder]);

  // =====================================================
  // COUNTS
  // =====================================================

  const counts = useMemo(
    () => ({
      all: requests.length,
      pending: requests.filter(
        (request) => request.status === "pending"
      ).length,
      approved: requests.filter(
        (request) => request.status === "approved"
      ).length,
      rejected: requests.filter(
        (request) => request.status === "rejected"
      ).length,
    }),
    [requests]
  );

  // =====================================================
  // EMPTY STATE LOGIC
  // =====================================================

  // No requests at all:
  // Show Figma's empty state.
  const isCompletelyEmpty = requests.length === 0;

  // Requests exist, but search or filtering
  // returned no matching results.
  const isFilterEmpty =
    !isCompletelyEmpty &&
    filteredRequests.length === 0;

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleRequests = filteredRequests.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  // =====================================================
  // ACTIONS
  // =====================================================

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-admin-sidebar")
    );
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSortOrder("newest");
    setCurrentPage(1);
    setShowFilters(false);
    setShowSort(false);
  };

  const handleRefresh = () => {
    refreshRequests();
    setCurrentPage(1);
  };

  const handleViewRequest = (request) => {
    navigate(
      `/admin/training-requests/${encodeURIComponent(
        request.id
      )}`,
      {
        state: { request },
      }
    );
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]"
    >
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">

        {/* HEADER */}
        <AdminHeader />

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1450px]">

            {/* BREADCRUMB */}
            <nav className="mb-4 flex items-center gap-2 text-[12px] text-[#64748B]">
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/dashboard")
                }
                className="hover:text-[#09379A]"
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <span className="font-semibold text-[#111C2D]">
                طلبات التدريب
              </span>
            </nav>

            {/* PAGE TITLE */}
            <section className="mb-7">
              <h1 className="m-0 text-[26px] font-bold leading-10">
                طلبات التدريب
              </h1>

              <p className="m-0 mt-1 text-[13px] text-[#64748B]">
                مراجعة طلبات الطلاب واتخاذ القرار
              </p>
            </section>

            {/* SUCCESS NOTIFICATION */}
            {location.state?.successMessage && (
              <div
                role="status"
                className="mb-5 flex items-center justify-between gap-3 rounded-[9px] border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[12px] text-[#15803D]"
              >
                <span>
                  {location.state.successMessage}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    navigate(location.pathname, {
                      replace: true,
                      state: null,
                    });

                    refreshRequests();
                  }}
                  aria-label="إغلاق الإشعار"
                >
                  <X size={17} />
                </button>
              </div>
            )}

            {/* SEARCH AND TOOLS */}
            <section className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-center">

              {/* SEARCH */}
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
                  placeholder="ابحث برقم الطلب أو اسم الطالب..."
                  aria-label="البحث في طلبات التدريب"
                  className="h-[44px] w-full rounded-[8px] border border-[#E0E7F2] bg-white pl-4 pr-11 text-[13px] outline-none focus:border-[#09379A] focus:ring-2 focus:ring-[#09379A]/10"
                />
              </div>

              {/* FILTER / SORT */}
              <div className="flex flex-wrap items-center gap-3">

                {/* FILTER */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFilters((value) => !value);
                      setShowSort(false);
                    }}
                    className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[12px] hover:border-[#B9C9E8]"
                  >
                    <SlidersHorizontal size={17} />
                    تصفية
                  </button>

                  {showFilters && (
                    <div className="absolute right-0 top-[50px] z-20 w-[240px] rounded-[10px] border border-[#E0E7F2] bg-white p-3 shadow-lg">
                      <p className="mb-2 mt-0 text-[12px] font-bold">
                        حالة الطلب
                      </p>

                      {FILTERS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setStatusFilter(item.id);
                            setCurrentPage(1);
                            setShowFilters(false);
                          }}
                          className={`block w-full rounded-[7px] px-3 py-2 text-right text-[12px] ${
                            statusFilter === item.id
                              ? "bg-[#EEF4FF] font-bold text-[#09379A]"
                              : "hover:bg-[#F8FAFC]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-[7px] border border-[#E0E7F2] py-2 text-[11px]"
                      >
                        <RotateCcw size={14} />
                        إعادة ضبط
                      </button>
                    </div>
                  )}
                </div>

                {/* SORT */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSort((value) => !value);
                      setShowFilters(false);
                    }}
                    className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[12px] hover:border-[#B9C9E8]"
                  >
                    <ArrowDownUp size={17} />
                    ترتيب
                  </button>

                  {showSort && (
                    <div className="absolute left-0 top-[50px] z-20 w-[180px] rounded-[10px] border border-[#E0E7F2] bg-white p-2 shadow-lg">
                      {SORT_OPTIONS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSortOrder(item.id);
                            setShowSort(false);
                          }}
                          className={`w-full rounded-[7px] px-3 py-2 text-right text-[12px] ${
                            sortOrder === item.id
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
              </div>
            </section>

            {/* ========================================
                EMPTY STATE: NO REQUESTS AT ALL
                MATCHES FIGMA
            ======================================== */}
            {isCompletelyEmpty ? (
              <EmptyRequestsState onRefresh={handleRefresh} />
            ) : (
              <>
                {/* FILTER CHIPS */}
                <section className="mb-5 flex flex-wrap items-center gap-2">
                  {FILTERS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setStatusFilter(item.id);
                        setCurrentPage(1);
                      }}
                      className={`h-[35px] rounded-full border px-4 text-[11px] transition ${
                        statusFilter === item.id
                          ? "border-[#09379A] bg-[#09379A] font-semibold text-white"
                          : "border-[#E0E7F2] bg-white text-[#475569] hover:border-[#09379A]"
                      }`}
                    >
                      {item.label} {counts[item.id]}
                    </button>
                  ))}
                </section>

                {/* TABLE / FILTER EMPTY STATE */}
                {isFilterEmpty ? (
                  <NoMatchingRequests
                    onReset={resetFilters}
                  />
                ) : (
                  <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-3 sm:p-5">

                    <div className="overflow-x-auto rounded-[9px] border border-[#E0E7F2]">
                      <table className="w-full min-w-[760px] border-collapse text-right">
                        <thead>
                          <tr className="bg-[#F1F5F9] text-[11px] font-semibold text-[#64748B]">
                            <th className="px-4 py-4">
                              رقم الطلب
                            </th>
                            <th className="px-4 py-4">
                              الطالب
                            </th>
                            <th className="px-4 py-4">
                              جهة التدريب
                            </th>
                            <th className="px-4 py-4">
                              تاريخ الطلب
                            </th>
                            <th className="px-4 py-4">
                              الحالة
                            </th>
                            <th className="px-4 py-4">
                              الإجراءات
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {visibleRequests.map((request) => (
                            <tr
                              key={request.id}
                              className="border-t border-[#E6EBF5] text-[11px] transition hover:bg-[#FAFBFE]"
                            >
                              <td
                                dir="ltr"
                                className="whitespace-nowrap px-4 py-5 text-right font-semibold"
                              >
                                #{request.id}
                              </td>

                              <td className="px-4 py-5 font-semibold">
                                {request.studentName}
                              </td>

                              <td className="px-4 py-5">
                                {request.organization}
                              </td>

                              <td
                                dir="ltr"
                                className="whitespace-nowrap px-4 py-5 text-right"
                              >
                                {request.requestDate}
                              </td>

                              <td className="px-4 py-5">
                                <RequestStatus
                                  status={request.status}
                                />
                              </td>

                              <td className="px-4 py-5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleViewRequest(request)
                                  }
                                  className="inline-flex h-[34px] items-center gap-2 rounded-[7px] border border-[#E0E7F2] bg-white px-3 text-[11px] font-semibold transition hover:border-[#09379A] hover:text-[#09379A]"
                                >
                                  <Eye size={15} />
                                  عرض
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                      <p className="m-0 text-[11px] text-[#64748B]">
                        عرض{" "}
                        {(safePage - 1) * PAGE_SIZE + 1}
                        {" - "}
                        {Math.min(
                          safePage * PAGE_SIZE,
                          filteredRequests.length
                        )}
                        {" من "}
                        {filteredRequests.length} طلبًا
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={safePage === 1}
                          onClick={() =>
                            setCurrentPage((page) =>
                              Math.max(1, page - 1)
                            )
                          }
                          className="flex h-[34px] items-center gap-1 rounded-full border border-[#E0E7F2] px-3 text-[11px] disabled:cursor-not-allowed disabled:opacity-40"
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
                                : "border-[#E0E7F2] bg-white"
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
                          className="flex h-[34px] items-center gap-1 rounded-full border border-[#E0E7F2] px-3 text-[11px] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          التالي
                          <ChevronLeft size={14} />
                        </button>
                      </div>
                    </div>
                  </section>
                )}
              </>
            )}

            {/* FOOTER */}
            <AcademicFooter audience="admin" />

          </div>
        </main>
      </div>
    </div>
  );
}

// =====================================================
// EMPTY REQUESTS STATE - FIGMA DESIGN
// =====================================================

function EmptyRequestsState({ onRefresh }) {
  return (
    <section className="flex min-h-[365px] w-full flex-col items-center justify-center rounded-[12px] border border-[#E0E7F2] bg-white px-5 py-12 text-center">

      {/* ICON */}
      <div className="mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#E6EBF5] text-[#09379A]">
        <Inbox
          size={31}
          strokeWidth={1.9}
        />
      </div>

      {/* TITLE */}
      <h2 className="m-0 text-[18px] font-bold text-[#111C2D]">
        لا توجد طلبات تدريب بعد
      </h2>

      {/* DESCRIPTION */}
      <p className="m-0 mt-3 max-w-[480px] text-[13px] leading-7 text-[#64748B]">
        لم يقدم أي طالب طلب تدريب حتى الآن،
        ستظهر الطلبات هنا فور وصولها.
      </p>

      {/* REFRESH */}
      <button
        type="button"
        onClick={onRefresh}
        className="mt-3 inline-flex h-[44px] items-center justify-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px] font-semibold transition hover:border-[#09379A] hover:text-[#09379A]"
      >
        <RefreshCw size={17} />
        تحديث
      </button>
    </section>
  );
}

// =====================================================
// NO MATCHING FILTER RESULTS
// =====================================================

function NoMatchingRequests({ onReset }) {
  return (
    <section className="flex min-h-[280px] flex-col items-center justify-center rounded-[12px] border border-[#E0E7F2] bg-white px-5 py-10 text-center">
      <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#F1F5F9] text-[#64748B]">
        <Search size={26} />
      </div>

      <h2 className="m-0 text-[16px] font-bold">
        لا توجد طلبات مطابقة
      </h2>

      <p className="m-0 mt-2 text-[12px] text-[#64748B]">
        جرّب تغيير كلمات البحث أو التصفية.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-4 inline-flex h-[40px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[12px] text-[#09379A] hover:bg-[#F8FAFC]"
      >
        <RotateCcw size={16} />
        إعادة ضبط التصفية
      </button>
    </section>
  );
}

// =====================================================
// REQUEST STATUS
// =====================================================

function RequestStatus({ status }) {
  const config = {
    pending: {
      label: "معلّق",
      className: "bg-[#FFE5D9] text-[#B54708]",
    },
    approved: {
      label: "مقبول",
      className: "bg-[#DCFCE7] text-[#15803D]",
    },
    rejected: {
      label: "مرفوض",
      className: "bg-[#FEE2E2] text-[#DC2626]",
    },
  };

  const item = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold ${item.className}`}
    >
      <span className="h-[6px] w-[6px] rounded-full bg-current" />
      {item.label}
    </span>
  );
}

// =====================================================
// HEADER
// =====================================================


