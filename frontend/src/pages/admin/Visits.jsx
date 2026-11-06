import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Menu,
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

const STUDENTS = [
  {
    id: 1,
    name: "أمل أحمد",
    specialization: "البرمجيات وقواعد البيانات",
    organization: "شركة القدس للاتصالات",
    progress: 60,
    attendance: 92,
    status: "active",
  },
  {
    id: 2,
    name: "محمود رضوان",
    specialization: "تكنولوجيا علم البيانات",
    organization: "شركة المشرق الرقمية",
    progress: 55,
    attendance: 88,
    status: "active",
  },
  {
    id: 3,
    name: "سارة عبد الرحمن",
    specialization: "الاتصالات وإنترنت الأشياء",
    organization: "شركة جوال",
    progress: 35,
    attendance: 81,
    status: "active",
  },
  {
    id: 4,
    name: "أنس البيطار",
    specialization: "إلكترونيات صناعية وتحكم",
    organization: "شركة الأمل للأنظمة الصناعية",
    progress: 100,
    attendance: 95,
    status: "completed",
  },
];

export default function Visits() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let data = STUDENTS.filter((student) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.specialization.toLowerCase().includes(query) ||
        student.organization.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "late" && student.attendance < 85) ||
        (filter === "regular" && student.attendance >= 85);

      return matchesSearch && matchesFilter;
    });

    data = [...data].sort((a, b) => {
      if (sort === "name") {
        return a.name.localeCompare(b.name, "ar");
      }

      if (sort === "progress") {
        return b.progress - a.progress;
      }

      return b.attendance - a.attendance;
    });

    return data;
  }, [search, filter, sort]);

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
      ...filtered.map((student) => [
        student.name,
        student.specialization,
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
          .map((value) => `"${value}"`)
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
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        {/* HEADER */}

        <AdminHeader />

        {/* CONTENT */}

        <main
          className="
            min-w-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            px-4
            py-5
            sm:px-6
            lg:px-8
          "
        >
          <div className="mx-auto w-full max-w-[1450px]">
            {/* BREADCRUMB */}

            <div className="mb-5 flex items-center gap-2 text-[12px] text-[#64748B]">
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/dashboard")
                }
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <span className="font-bold text-[#111C2D]">
                الطلاب قيد التدريب
              </span>
            </div>

            {/* TITLE */}

            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="m-0 text-[26px] font-bold">
                  الطلاب قيد التدريب
                </h1>

                <p className="m-0 mt-1 text-[13px] text-[#64748B]">
                  الطلاب النشطون خلال الفترة الحالية
                </p>
              </div>

              <button
                type="button"
                onClick={exportCSV}
                className="
                  flex
                  h-[44px]
                  items-center
                  gap-2
                  rounded-[8px]
                  border
                  border-[#E0E7F2]
                  bg-white
                  px-5
                  text-[12px]
                "
              >
                <Download size={16} />
                تصدير
              </button>
            </div>

            {/* SEARCH */}

            <div className="mb-6 flex flex-col gap-3 xl:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#64748B]
                  "
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="ابحث عن طالب..."
                  className="
                    h-[44px]
                    w-full
                    rounded-[8px]
                    border
                    border-[#E0E7F2]
                    bg-white
                    pr-11
                    pl-4
                    text-[13px]
                    outline-none
                    focus:border-[#09379A]
                  "
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setFilter((value) =>
                    value === "all"
                      ? "late"
                      : value === "late"
                      ? "regular"
                      : "all"
                  )
                }
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
                "
              >
                <SlidersHorizontal size={17} />
                تصفية
              </button>

              <button
                type="button"
                onClick={() =>
                  setSort((value) =>
                    value === "name"
                      ? "progress"
                      : value === "progress"
                      ? "attendance"
                      : "name"
                  )
                }
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
                "
              >
                <ArrowDownUp size={17} />
                ترتيب
              </button>
            </div>

            {/* FILTER CHIPS */}

            <div className="mb-6 flex flex-wrap gap-2">
              <FilterChip
                active={filter === "all"}
                onClick={() => setFilter("all")}
              >
                الكل 248
              </FilterChip>

              <FilterChip
                active={filter === "late"}
                onClick={() => setFilter("late")}
              >
                متأخر
              </FilterChip>

              <FilterChip
                active={filter === "regular"}
                onClick={() =>
                  setFilter("regular")
                }
              >
                منتظم
              </FilterChip>
            </div>

            {/* TABLE */}

            <section
              className="
                rounded-[12px]
                border
                border-[#E0E7F2]
                bg-white
                p-4
                sm:p-6
              "
            >
              <div className="overflow-x-auto rounded-[9px] border border-[#E0E7F2]">
                <table className="w-full min-w-[900px] border-collapse text-right">
                  <thead>
                    <tr className="bg-[#F1F5F9] text-[11px] text-[#64748B]">
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
                    {filtered.map((student) => (
                      <tr
                        key={student.id}
                        className="
                          border-t
                          border-[#E6EBF5]
                          text-[11px]
                          hover:bg-[#FAFBFE]
                        "
                      >
                        <td className="px-4 py-5 font-bold">
                          {student.name}
                        </td>

                        <td className="px-4 py-5">
                          {student.specialization}
                        </td>

                        <td className="px-4 py-5">
                          {student.organization}
                        </td>

                        <td className="px-4 py-5">
                          <Progress
                            value={student.progress}
                          />
                        </td>

                        <td className="px-4 py-5">
                          {student.attendance}%
                        </td>

                        <td className="px-4 py-5">
                          <Status
                            completed={
                              student.status ===
                              "completed"
                            }
                          />
                        </td>

                        <td className="px-4 py-5">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/training-monitoring/${student.id}`
                              )
                            }
                            className="
                              flex
                              h-[32px]
                              items-center
                              gap-2
                              rounded-[7px]
                              border
                              border-[#E0E7F2]
                              bg-white
                              px-3
                              text-[10px]
                            "
                          >
                            <Eye size={14} />
                            التفاصيل
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
                <p className="m-0 text-[10px] text-[#64748B]">
                  عرض 1 - 4 من 248 طالبًا
                </p>

                <div className="flex gap-2">
                  <PageButton>
                    السابق
                  </PageButton>

                  {[1, 2, 3].map((item) => (
                    <button
                      key={item}
                      onClick={() => setPage(item)}
                      className={`
                        h-[36px]
                        min-w-[36px]
                        rounded-full
                        border
                        text-[11px]

                        ${
                          page === item
                            ? "border-[#09379A] bg-[#09379A] text-white"
                            : "border-[#E0E7F2] bg-white"
                        }
                      `}
                    >
                      {item}
                    </button>
                  ))}

                  <PageButton>
                    التالي
                  </PageButton>
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

function Progress({ value }) {
  return (
    <div className="flex min-w-[150px] items-center gap-3">
      <span className="text-[9px]">
        {value}%
      </span>

      <div className="h-[7px] flex-1 overflow-hidden rounded-full bg-[#E5EAF2]">
        <div
          className="h-full rounded-full bg-[#09379A]"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

function Status({ completed }) {
  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1
        rounded-full
        px-3
        py-1
        text-[9px]
        font-semibold

        ${
          completed
            ? "bg-[#DCFCE7] text-[#15803D]"
            : "bg-[#DDF6FF] text-[#08759B]"
        }
      `}
    >
      <span className="h-[5px] w-[5px] rounded-full bg-current" />

      {completed
        ? "منتهٍ"
        : "قيد التدريب"}
    </span>
  );
}

function FilterChip({
  active,
  children,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        h-[36px]
        rounded-full
        border
        px-5
        text-[11px]

        ${
          active
            ? "border-[#09379A] bg-[#09379A] text-white"
            : "border-[#E0E7F2] bg-white text-[#64748B]"
        }
      `}
    >
      {children}
    </button>
  );
}

function PageButton({ children }) {
  return (
    <button
      type="button"
      className="
        h-[36px]
        rounded-full
        border
        border-[#E0E7F2]
        bg-white
        px-4
        text-[10px]
      "
    >
      {children}
    </button>
  );
}

