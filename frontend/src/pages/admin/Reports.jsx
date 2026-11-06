import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { useEffect, useMemo, useState } from "react";
import { getReports, updateReport } from "./reportsStore";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Menu,
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

/* =========================================================
   DATA
========================================================= */

const STATUS_FILTERS = [
  {
    id: "all",
    label: "الكل",
  },
  {
    id: "pending",
    label: "بانتظار المراجعة",
  },
  {
    id: "approved",
    label: "معتمد",
  },
  {
    id: "revision",
    label: "مطلوب تعديل",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function Reports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState(getReports);

  useEffect(() => {
    const refresh = () => setReports(getReports());
    window.addEventListener("admin-reports-updated", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("admin-reports-updated", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 4;

  /* =======================================================
     COUNTS
  ======================================================= */

  const counts = useMemo(() => {
    return {
      all: reports.length,

      pending: reports.filter(
        (report) => report.status === "pending"
      ).length,

      approved: reports.filter(
        (report) => report.status === "approved"
      ).length,

      revision: reports.filter(
        (report) => report.status === "revision"
      ).length,
    };
  }, [reports]);

  /* =======================================================
     FILTERING
  ======================================================= */

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = reports.filter((report) => {
      const matchesSearch =
        !query ||
        report.student
          .toLowerCase()
          .includes(query) ||
        report.type
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      if (sortOrder === "newest") {
        return b.date.localeCompare(a.date);
      }

      if (sortOrder === "oldest") {
        return a.date.localeCompare(b.date);
      }

      if (sortOrder === "student") {
        return a.student.localeCompare(
          b.student,
          "ar"
        );
      }

      return 0;
    });

    return result;
  }, [
    reports,
    search,
    statusFilter,
    sortOrder,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredReports.length / pageSize
    )
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const visibleReports = filteredReports.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  /* =======================================================
     ACTIONS
  ======================================================= */

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

  const approveReport = (id) => {
    try {
      updateReport(id, { status: "approved" });
      setReports(getReports());
    } catch (error) {
      console.error("تعذر اعتماد التقرير", error);
    }
  };

  return (
    <div
      dir="rtl"
      className="
        flex
        h-screen
        w-full
        overflow-hidden

        bg-[#F8FAFC]

        font-['Cairo']
        text-[#111C2D]
      "
    >
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar />

      {/* =====================================================
          PAGE
      ====================================================== */}

      <div
        className="
          flex
          h-screen
          min-w-0
          flex-1
          flex-col
          overflow-hidden
        "
      >
        {/* =================================================
            HEADER
        ================================================== */}

        <AdminHeader />

        {/* =================================================
            CONTENT
        ================================================== */}

        <main
          className="
            w-full
            min-w-0
            flex-1

            overflow-x-hidden
            overflow-y-auto

            px-4
            pb-7
            pt-5

            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1450px]
            "
          >
            {/* =============================================
                BREADCRUMB
            ============================================== */}

            <div
              className="
                mb-8

                flex
                items-center
                gap-2

                text-[12px]
                text-[#64748B]
              "
            >
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/dashboard"
                  )
                }
                className="
                  hover:text-[#09379A]
                "
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <span
                className="
                  font-semibold
                  text-[#111C2D]
                "
              >
                التقارير
              </span>
            </div>

            {/* =============================================
                PAGE TITLE
            ============================================== */}

            <section className="mb-6">
              <h1
                className="
                  m-0

                  text-[23px]
                  font-bold
                  leading-9

                  text-[#111C2D]

                  sm:text-[26px]
                "
              >
                التقارير
              </h1>

              <p
                className="
                  m-0
                  mt-1

                  text-[13px]
                  text-[#64748B]
                "
              >
                مراجعة تقارير الطلاب
              </p>
            </section>

            {/* =============================================
                SEARCH + TOOLS
            ============================================== */}

            <section
              className="
                mb-5

                flex
                min-w-0
                flex-col
                gap-3

                xl:flex-row
                xl:items-center
              "
            >
              <div
                className="
                  relative
                  min-w-0
                  flex-1
                "
              >
                <Search
                  size={18}
                  className="
                    pointer-events-none

                    absolute
                    right-4
                    top-1/2

                    -translate-y-1/2

                    text-[#64748B]
                  "
                />

                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(
                      event.target.value
                    );

                    setCurrentPage(1);
                  }}
                  placeholder="ابحث باسم الطالب أو نوع التقرير..."
                  className="
                    h-[44px]
                    w-full
                    min-w-0

                    rounded-[8px]

                    border
                    border-[#E0E7F2]

                    bg-white

                    pr-11
                    pl-4

                    text-[13px]

                    outline-none

                    focus:border-[#09379A]

                    focus:ring-2
                    focus:ring-[#09379A]/10
                  "
                />
              </div>

              <div
                className="
                  flex
                  shrink-0
                  flex-wrap
                  gap-3
                "
              >
                {/* FILTER */}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFilters(
                        (value) =>
                          !value
                      );

                      setShowSort(false);
                    }}
                    className="
                      flex
                      h-[44px]
                      items-center
                      gap-2

                      rounded-[8px]

                      border
                      border-[#E0E7F2]

                      bg-white

                      px-4

                      text-[12px]

                      hover:border-[#B9C9E8]
                    "
                  >
                    <SlidersHorizontal
                      size={17}
                    />

                    تصفية
                  </button>

                  {showFilters && (
                    <div
                      className="
                        absolute
                        right-0
                        top-[50px]
                        z-20

                        w-[240px]

                        rounded-[10px]

                        border
                        border-[#E0E7F2]

                        bg-white

                        p-3

                        shadow-lg
                      "
                    >
                      {STATUS_FILTERS.map(
                        (item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setStatusFilter(
                                item.id
                              );

                              setCurrentPage(
                                1
                              );

                              setShowFilters(
                                false
                              );
                            }}
                            className={`
                              w-full

                              rounded-[7px]

                              px-3
                              py-2

                              text-right
                              text-[11px]

                              ${
                                statusFilter ===
                                item.id
                                  ? `
                                      bg-[#EEF4FF]
                                      font-bold
                                      text-[#09379A]
                                    `
                                  : `
                                      hover:bg-[#F8FAFC]
                                    `
                              }
                            `}
                          >
                            {item.label}
                          </button>
                        )
                      )}

                      <button
                        type="button"
                        onClick={
                          resetFilters
                        }
                        className="
                          mt-2

                          flex
                          h-[34px]
                          w-full

                          items-center
                          justify-center
                          gap-1

                          rounded-[7px]

                          border
                          border-[#E0E7F2]

                          text-[10px]
                        "
                      >
                        <RotateCcw
                          size={13}
                        />

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
                      setShowSort(
                        (value) =>
                          !value
                      );

                      setShowFilters(
                        false
                      );
                    }}
                    className="
                      flex
                      h-[44px]

                      items-center
                      gap-2

                      rounded-[8px]

                      border
                      border-[#E0E7F2]

                      bg-white

                      px-4

                      text-[12px]

                      hover:border-[#B9C9E8]
                    "
                  >
                    <ArrowDownUp
                      size={17}
                    />

                    ترتيب
                  </button>

                  {showSort && (
                    <div
                      className="
                        absolute
                        left-0
                        top-[50px]
                        z-20

                        w-[180px]

                        rounded-[10px]

                        border
                        border-[#E0E7F2]

                        bg-white

                        p-2

                        shadow-lg
                      "
                    >
                      <SortButton
                        label="الأحدث أولًا"
                        active={
                          sortOrder ===
                          "newest"
                        }
                        onClick={() => {
                          setSortOrder(
                            "newest"
                          );

                          setShowSort(
                            false
                          );
                        }}
                      />

                      <SortButton
                        label="الأقدم أولًا"
                        active={
                          sortOrder ===
                          "oldest"
                        }
                        onClick={() => {
                          setSortOrder(
                            "oldest"
                          );

                          setShowSort(
                            false
                          );
                        }}
                      />

                      <SortButton
                        label="حسب اسم الطالب"
                        active={
                          sortOrder ===
                          "student"
                        }
                        onClick={() => {
                          setSortOrder(
                            "student"
                          );

                          setShowSort(
                            false
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* =============================================
                STATUS FILTERS
            ============================================== */}

            <section
              className="
                mb-6

                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              {STATUS_FILTERS.map(
                (item) => {
                  const count =
                    counts[item.id];

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setStatusFilter(
                          item.id
                        );

                        setCurrentPage(
                          1
                        );
                      }}
                      className={`
                        h-[34px]

                        rounded-full

                        border

                        px-4

                        text-[11px]

                        ${
                          statusFilter ===
                          item.id
                            ? `
                                border-[#09379A]
                                bg-[#09379A]
                                font-semibold
                                text-white
                              `
                            : `
                                border-[#E0E7F2]
                                bg-white
                                text-[#475569]
                              `
                        }
                      `}
                    >
                      {item.id ===
                      "all"
                        ? "الكل"
                        : item.label}

                      {item.id ===
                        "pending" &&
                        ` ${count}`}
                    </button>
                  );
                }
              )}
            </section>

            {/* =============================================
                TABLE
            ============================================== */}

            <section
              className="
                w-full
                min-w-0
                overflow-hidden

                rounded-[12px]

                border
                border-[#E0E7F2]

                bg-white

                p-3

                sm:p-5
              "
            >
              <div
                className="
                  w-full
                  max-w-full
                  min-w-0

                  overflow-x-auto
                  overflow-y-hidden

                  rounded-[9px]

                  border
                  border-[#E0E7F2]
                "
              >
                <table
                  className="
                    w-full
                    min-w-[900px]

                    border-collapse

                    text-right
                  "
                >
                  <thead>
                    <tr
                      className="
                        bg-[#F1F5F9]

                        text-[11px]
                        font-semibold
                        text-[#64748B]
                      "
                    >
                      <th className="px-4 py-4">
                        اسم الطالب
                      </th>

                      <th className="px-4 py-4">
                        نوع التقرير
                      </th>

                      <th className="px-4 py-4">
                        تاريخ الإرسال
                      </th>

                      <th className="px-4 py-4">
                        الحالة
                      </th>

                      <th className="px-4 py-4">
                        الملاحظات
                      </th>

                      <th className="px-4 py-4">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleReports.map(
                      (report) => (
                        <tr
                          key={
                            report.id
                          }
                          className="
                            border-t
                            border-[#E6EBF5]

                            text-[11px]

                            hover:bg-[#FAFBFE]
                          "
                        >
                          <td
                            className="
                              px-4
                              py-4

                              font-semibold
                              text-[#111C2D]
                            "
                          >
                            {
                              report.student
                            }
                          </td>

                          <td className="px-4 py-4">
                            {report.type}
                          </td>

                          <td
                            className="
                              whitespace-nowrap

                              px-4
                              py-4
                            "
                            dir="ltr"
                          >
                            {report.date}
                          </td>

                          <td className="px-4 py-4">
                            <ReportStatus
                              status={
                                report.status
                              }
                            />
                          </td>

                          <td className="px-4 py-4">
                            {report.note ||
                              "—"}
                          </td>

                          <td className="px-4 py-4">
                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >
                              {/* =========================
                                  VIEW REPORT
                              ========================== */}

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/admin/reports/${report.id}`
                                  )
                                }
                                className="
                                  flex
                                  h-[32px]
                                  items-center
                                  gap-[5px]
                                  rounded-[7px]
                                  border
                                  border-[#E0E7F2]
                                  bg-white
                                  px-3
                                  text-[10px]
                                  hover:border-[#09379A]
                                  hover:text-[#09379A]
                                "
                              >
                                <Eye
                                  size={
                                    14
                                  }
                                />

                                عرض
                              </button>

                              {/* =========================
                                  APPROVE
                              ========================== */}

                              {report.status !==
                                "approved" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    approveReport(
                                      report.id
                                    )
                                  }
                                  className="
                                    flex
                                    h-[32px]

                                    items-center
                                    gap-[5px]

                                    rounded-[7px]

                                    border-0

                                    bg-[#09379A]

                                    px-3

                                    text-[10px]
                                    font-semibold
                                    text-white

                                    hover:bg-[#072E81]
                                  "
                                >
                                  <Check
                                    size={
                                      14
                                    }
                                  />

                                  اعتماد
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* ===========================================
                  PAGINATION
              ============================================ */}

              <div
                className="
                  mt-4

                  flex
                  flex-col
                  gap-3

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <p
                  className="
                    m-0

                    text-[10px]
                    text-[#64748B]
                  "
                >
                  عرض{" "}
                  {filteredReports.length
                    ? (safePage -
                        1) *
                        pageSize +
                      1
                    : 0}
                  {" - "}
                  {Math.min(
                    safePage *
                      pageSize,
                    filteredReports.length
                  )}{" "}
                  من{" "}
                  {
                    filteredReports.length
                  }{" "}
                  تقريرًا
                </p>

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <button
                    type="button"
                    disabled={
                      safePage === 1
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.max(
                            1,
                            page - 1
                          )
                      )
                    }
                    className="
                      flex
                      h-[34px]

                      items-center
                      gap-1

                      rounded-full

                      border
                      border-[#E0E7F2]

                      px-3

                      text-[10px]

                      disabled:opacity-40
                    "
                  >
                    <ChevronRight
                      size={13}
                    />

                    السابق
                  </button>

                  {Array.from(
                    {
                      length:
                        totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                      className={`
                        h-[34px]
                        min-w-[34px]

                        rounded-full

                        border

                        text-[10px]

                        ${
                          page ===
                          safePage
                            ? `
                                border-[#09379A]
                                bg-[#09379A]
                                text-white
                              `
                            : `
                                border-[#E0E7F2]
                                bg-white
                              `
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={
                      safePage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.min(
                            totalPages,
                            page + 1
                          )
                      )
                    }
                    className="
                      flex
                      h-[34px]

                      items-center
                      gap-1

                      rounded-full

                      border
                      border-[#E0E7F2]

                      px-3

                      text-[10px]

                      disabled:opacity-40
                    "
                  >
                    التالي

                    <ChevronLeft
                      size={13}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* =============================================
                FOOTER
            ============================================== */}

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function ReportStatus({
  status,
}) {
  const config = {
    pending: {
      label: "بانتظار المراجعة",

      className:
        "bg-[#FFE5D9] text-[#B54708]",
    },

    approved: {
      label: "معتمد",

      className:
        "bg-[#DCFCE7] text-[#15803D]",
    },

    revision: {
      label: "مطلوب تعديل",

      className:
        "bg-[#FEE2E2] text-[#DC2626]",
    },
  };

  const current =
    config[status];

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-[5px]

        whitespace-nowrap

        rounded-full

        px-[10px]
        py-[5px]

        text-[9px]
        font-semibold

        ${current.className}
      `}
    >
      <span
        className="
          h-[5px]
          w-[5px]

          rounded-full

          bg-current
        "
      />

      {current.label}
    </span>
  );
}

/* =========================================================
   SORT BUTTON
========================================================= */

function SortButton({
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full

        rounded-[7px]

        px-3
        py-2

        text-right
        text-[11px]

        ${
          active
            ? `
                bg-[#EEF4FF]
                font-semibold
                text-[#09379A]
              `
            : `
                hover:bg-[#F8FAFC]
              `
        }
      `}
    >
      {label}
    </button>
  );
}