import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  Download,
  Eye,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

/* =========================================================
   DATA
========================================================= */

const INITIAL_STUDENTS = [
  {
    id: 1,
    name: "أمل أحمد",
    major: "البرمجيات وقواعد البيانات",
    organization: "شركة القدس للاتصالات",
    progress: 60,
    attendance: 92,
    status: "active",
  },
  {
    id: 2,
    name: "محمود رضوان",
    major: "تكنولوجيا علم البيانات",
    organization: "شركة المشرق الرقمية",
    progress: 55,
    attendance: 88,
    status: "active",
  },
  {
    id: 3,
    name: "سارة عبد الرحمن",
    major: "الاتصالات وإنترنت الأشياء",
    organization: "شركة جوال",
    progress: 35,
    attendance: 81,
    status: "active",
  },
  {
    id: 4,
    name: "أنس البيطار",
    major: "إلكترونيات صناعية وتحكم",
    organization: "شركة الأمل للأنظمة الصناعية",
    progress: 100,
    attendance: 95,
    status: "completed",
  },
  {
    id: 5,
    name: "نور خليل",
    major: "التصميم الجرافيكي والفنون الرقمية",
    organization: "استوديو بيكسل",
    progress: 78,
    attendance: 96,
    status: "active",
  },
  {
    id: 6,
    name: "بلال الشيخ",
    major: "البرمجيات وقواعد البيانات",
    organization: "شركة التقنية الحديثة",
    progress: 43,
    attendance: 85,
    status: "active",
  },
  {
    id: 7,
    name: "محمد العطار",
    major: "تكنولوجيا علم البيانات",
    organization: "شركة القدس للاتصالات",
    progress: 68,
    attendance: 90,
    status: "active",
  },
  {
    id: 8,
    name: "هدى شهير",
    major: "التصميم والمنتاج",
    organization: "استوديو رؤية",
    progress: 100,
    attendance: 98,
    status: "completed",
  },
];

export default function ActiveTrainingStudents() {
  const navigate = useNavigate();

  const [students] = useState(INITIAL_STUDENTS);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("name");

  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 4;

  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = students.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.major.toLowerCase().includes(query) ||
        student.organization.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        student.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name, "ar");
      }

      if (sortOrder === "progress") {
        return b.progress - a.progress;
      }

      if (sortOrder === "attendance") {
        return b.attendance - a.attendance;
      }

      return 0;
    });

    return result;
  }, [students, search, statusFilter, sortOrder]);

  /* =======================================================
     COUNTS
  ======================================================= */

  const totalCount = 248;

  const lateCount = students.filter(
    (student) =>
      student.status === "active" &&
      student.progress < 50
  ).length;

  const regularCount = students.filter(
    (student) =>
      student.status === "active" &&
      student.progress >= 50
  ).length;

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleStudents = filteredStudents.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  /* =======================================================
     ACTIONS
  ======================================================= */

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-student-sidebar")
    );
  };

  const exportCSV = () => {
    const rows = [
      [
        "الطالب",
        "التخصص",
        "جهة التدريب",
        "التقدم",
        "الحضور",
        "الحالة",
      ],

      ...filteredStudents.map((student) => [
        student.name,
        student.major,
        student.organization,
        `${student.progress}%`,
        `${student.attendance}%`,
        student.status === "completed"
          ? "منتهٍ"
          : "قيد التدريب",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "active-training-students.csv";

    link.click();

    URL.revokeObjectURL(url);
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
                mb-6

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
                  navigate("/admin/dashboard")
                }
                className="hover:text-[#09379A]"
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
                الطلاب قيد التدريب
              </span>
            </div>

            {/* =============================================
                TITLE
            ============================================== */}

            <section
              className="
                mb-6

                flex
                flex-col
                gap-4

                sm:flex-row
                sm:items-start
                sm:justify-between
              "
            >
              <div>
                <h1
                  className="
                    m-0

                    text-[24px]
                    font-bold
                    leading-9

                    text-[#111C2D]

                    sm:text-[27px]
                  "
                >
                  الطلاب قيد التدريب
                </h1>

                <p
                  className="
                    m-0
                    mt-1

                    text-[12px]
                    text-[#64748B]
                  "
                >
                  الطلاب النشطون خلال الفترة الحالية
                </p>
              </div>

              <button
                type="button"
                onClick={exportCSV}
                className="
                  flex
                  h-[44px]
                  w-fit

                  items-center
                  justify-center
                  gap-2

                  rounded-[8px]

                  border
                  border-[#E0E7F2]

                  bg-white

                  px-4

                  text-[12px]
                  font-semibold

                  transition

                  hover:border-[#09379A]
                  hover:text-[#09379A]
                "
              >
                <Download size={16} />

                تصدير
              </button>
            </section>

            {/* =============================================
                SEARCH + TOOLS
            ============================================== */}

            <section
              className="
                mb-6

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
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="ابحث عن طالب..."
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
                        (value) => !value
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
                    <SlidersHorizontal size={17} />

                    تصفية
                  </button>

                  {showFilters && (
                    <div
                      className="
                        absolute
                        right-0
                        top-[50px]
                        z-30

                        w-[210px]

                        rounded-[10px]

                        border
                        border-[#E0E7F2]

                        bg-white

                        p-2

                        shadow-lg
                      "
                    >
                      <FilterButton
                        label="الكل"
                        active={
                          statusFilter === "all"
                        }
                        onClick={() => {
                          setStatusFilter("all");
                          setCurrentPage(1);
                          setShowFilters(false);
                        }}
                      />

                      <FilterButton
                        label="قيد التدريب"
                        active={
                          statusFilter === "active"
                        }
                        onClick={() => {
                          setStatusFilter("active");
                          setCurrentPage(1);
                          setShowFilters(false);
                        }}
                      />

                      <FilterButton
                        label="منتهٍ"
                        active={
                          statusFilter === "completed"
                        }
                        onClick={() => {
                          setStatusFilter("completed");
                          setCurrentPage(1);
                          setShowFilters(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* SORT */}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSort(
                        (value) => !value
                      );

                      setShowFilters(false);
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
                    <ArrowDownUp size={17} />

                    ترتيب
                  </button>

                  {showSort && (
                    <div
                      className="
                        absolute
                        left-0
                        top-[50px]
                        z-30

                        w-[190px]

                        rounded-[10px]

                        border
                        border-[#E0E7F2]

                        bg-white

                        p-2

                        shadow-lg
                      "
                    >
                      <FilterButton
                        label="حسب اسم الطالب"
                        active={
                          sortOrder === "name"
                        }
                        onClick={() => {
                          setSortOrder("name");
                          setShowSort(false);
                        }}
                      />

                      <FilterButton
                        label="حسب نسبة التقدم"
                        active={
                          sortOrder === "progress"
                        }
                        onClick={() => {
                          setSortOrder("progress");
                          setShowSort(false);
                        }}
                      />

                      <FilterButton
                        label="حسب الحضور"
                        active={
                          sortOrder === "attendance"
                        }
                        onClick={() => {
                          setSortOrder("attendance");
                          setShowSort(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* =============================================
                CHIPS
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
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className={`
                  h-[36px]

                  rounded-full

                  border

                  px-4

                  text-[11px]

                  ${
                    statusFilter === "all"
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
                الكل {totalCount}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatusFilter("active");
                  setSortOrder("progress");
                  setCurrentPage(1);
                }}
                className="
                  h-[36px]

                  rounded-full

                  border
                  border-[#E0E7F2]

                  bg-white

                  px-4

                  text-[11px]
                  text-[#475569]
                "
              >
                متأخر
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatusFilter("active");
                  setSortOrder("name");
                  setCurrentPage(1);
                }}
                className="
                  h-[36px]

                  rounded-full

                  border
                  border-[#E0E7F2]

                  bg-white

                  px-4

                  text-[11px]
                  text-[#475569]
                "
              >
                منتظم
              </button>
            </section>

            {/* =============================================
                TABLE CARD
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

                p-4

                sm:p-6
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

                        text-[10px]
                        font-semibold
                        text-[#64748B]
                      "
                    >
                      <th className="px-4 py-4">
                        الطالب
                      </th>

                      <th className="px-4 py-4">
                        التخصص
                      </th>

                      <th className="px-4 py-4">
                        جهة التدريب
                      </th>

                      <th className="px-4 py-4">
                        التقدم
                      </th>

                      <th className="px-4 py-4">
                        الحضور
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
                    {visibleStudents.map(
                      (student) => (
                        <tr
                          key={student.id}
                          className="
                            border-t
                            border-[#E6EBF5]

                            text-[11px]

                            hover:bg-[#FAFBFE]
                          "
                        >
                          <td
                            className="
                              whitespace-nowrap

                              px-4
                              py-[18px]

                              font-bold
                              text-[#111C2D]
                            "
                          >
                            {student.name}
                          </td>

                          <td
                            className="
                              whitespace-nowrap

                              px-4
                              py-[18px]
                            "
                          >
                            {student.major}
                          </td>

                          <td
                            className="
                              whitespace-nowrap

                              px-4
                              py-[18px]
                            "
                          >
                            {student.organization}
                          </td>

                          <td className="px-4 py-[18px]">
                            <ProgressCell
                              value={student.progress}
                            />
                          </td>

                          <td
                            className="
                              whitespace-nowrap

                              px-4
                              py-[18px]
                            "
                          >
                            {student.attendance}%
                          </td>

                          <td className="px-4 py-[18px]">
                            <TrainingStatus
                              status={student.status}
                            />
                          </td>

                          <td className="px-4 py-[18px]">
                            <button
                              type="button"
                              className="
                                flex
                                h-[32px]

                                items-center
                                justify-center
                                gap-[6px]

                                rounded-[7px]

                                border
                                border-[#E0E7F2]

                                bg-white

                                px-3

                                text-[10px]
                                font-semibold

                                transition

                                hover:border-[#09379A]
                                hover:text-[#09379A]
                              "
                            >
                              <Eye size={14} />

                              التفاصيل
                            </button>
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
                  عرض 1 - 4 من {totalCount} طالبًا
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
                    disabled={safePage === 1}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(1, page - 1)
                      )
                    }
                    className="
                      flex
                      h-[36px]

                      items-center
                      gap-1

                      rounded-full

                      border
                      border-[#E0E7F2]

                      bg-white

                      px-4

                      text-[10px]

                      disabled:opacity-40
                    "
                  >
                    <ChevronRight size={13} />

                    السابق
                  </button>

                  {Array.from(
                    { length: Math.max(3, totalPages) },
                    (_, index) => index + 1
                  )
                    .slice(0, 3)
                    .map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          setCurrentPage(page)
                        }
                        className={`
                          h-[36px]
                          min-w-[36px]

                          rounded-full

                          border

                          text-[10px]

                          ${
                            page === safePage
                              ? `
                                  border-[#09379A]
                                  bg-[#09379A]
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
                        {page}
                      </button>
                    ))}

                  <button
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                      )
                    }
                    className="
                      flex
                      h-[36px]

                      items-center
                      gap-1

                      rounded-full

                      border
                      border-[#E0E7F2]

                      bg-white

                      px-4

                      text-[10px]

                      disabled:opacity-40
                    "
                  >
                    التالي

                    <ChevronLeft size={13} />
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
   PROGRESS
========================================================= */

function ProgressCell({ value }) {
  return (
    <div
      className="
        flex
        min-w-[135px]
        items-center
        gap-3
      "
    >
      <div
        className="
          h-[7px]
          min-w-[90px]
          flex-1

          overflow-hidden

          rounded-full

          bg-[#E4EAF3]
        "
      >
        <div
          className="
            h-full

            rounded-full

            bg-[#09379A]
          "
          style={{
            width: `${value}%`,
          }}
        />
      </div>

      <span
        className="
          min-w-[30px]

          text-[9px]
          font-semibold
          text-[#334155]
        "
      >
        {value}%
      </span>
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function TrainingStatus({ status }) {
  if (status === "completed") {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-[5px]

          whitespace-nowrap

          rounded-full

          bg-[#DCFCE7]

          px-[11px]
          py-[5px]

          text-[9px]
          font-semibold
          text-[#15803D]
        "
      >
        <span
          className="
            h-[5px]
            w-[5px]

            rounded-full

            bg-current
          "
        />

        منتهٍ
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex
        items-center
        gap-[5px]

        whitespace-nowrap

        rounded-full

        bg-[#DDF6FF]

        px-[11px]
        py-[5px]

        text-[9px]
        font-semibold
        text-[#08759B]
      "
    >
      <span
        className="
          h-[5px]
          w-[5px]

          rounded-full

          bg-current
        "
      />

      قيد التدريب
    </span>
  );
}

/* =========================================================
   FILTER BUTTON
========================================================= */

function FilterButton({
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
}0