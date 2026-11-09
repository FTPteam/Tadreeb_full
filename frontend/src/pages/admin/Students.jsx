import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  Search,
  Plus,
  SlidersHorizontal,
  ArrowDownUp,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  RotateCcw,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";
import { fetchStudents, deleteStudent } from "../../api/studentsApi";

// =====================================================
// DATA
// =====================================================

const PAGE_SIZE = 6;

const STATUS_OPTIONS = [
  "الكل",
  "قيد التدريب",
  "لم يبدأ",
  "بانتظار الاعتماد",
  "منتهٍ",
  "مرفوض",
];

const STATUS_STYLES = {
  "قيد التدريب": "bg-[#DDF6FF] text-[#08759B]",
  "بانتظار الاعتماد": "bg-[#FFE5D9] text-[#B54708]",
  "منتهٍ": "bg-[#DCFCE7] text-[#15803D]",
  "لم يبدأ": "bg-[#F1F5F9] text-[#475569]",
  "مرفوض": "bg-[#FEE2E2] text-[#DC2626]",
};

// =====================================================
// MAIN PAGE
// =====================================================

export default function Students() {
  const navigate = useNavigate();
  const location = useLocation();

 const [students, setStudents] = useState([]);
   const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentsError, setStudentsError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [majorFilter, setMajorFilter] = useState("الكل");
  const [sortOrder, setSortOrder] = useState("name");

  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  useEffect(() => {
  let cancelled = false;

  async function loadStudents() {
    setLoadingStudents(true);
    setStudentsError("");

    try {
      const data = await fetchStudents();

      if (cancelled) return;

      setStudents(data);
    } catch (error) {
      if (!cancelled) {
        setStudentsError(error.message || "تعذر تحميل الطلاب.");
      }
    } finally {
      if (!cancelled) setLoadingStudents(false);
    }
  }

        loadStudents();

  return () => {
    cancelled = true;
  };
}, [location.key]);

useEffect(() => {
  if (!studentToDelete) return;

    const onEscape = (event) => {
      if (event.key === "Escape") {
        setStudentToDelete(null);
        setDeleteError("");
      }
    };

    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("keydown", onEscape);
    };
  }, [studentToDelete]);

  // =====================================================
  // FILTERING & SORTING
  // =====================================================

  const majors = useMemo(
    () => [
      ...new Set(
        students.map((student) => student.major)
      ),
    ],
    [students]
  );

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = students.filter((student) => {
      const matchesSearch =
        !query ||
        [
          student.name,
          student.id,
          student.major,
          student.organization,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "الكل" ||
        student.status === statusFilter;

      const matchesMajor =
        majorFilter === "الكل" ||
        student.major === majorFilter;

      return matchesSearch && matchesStatus && matchesMajor;
    });

    return [...result].sort((a, b) => {
      if (sortOrder === "id") {
        return a.id.localeCompare(b.id);
      }

      if (sortOrder === "date") {
        return String(b.startDate).localeCompare(
          String(a.startDate)
        );
      }

      return a.name.localeCompare(b.name, "ar");
    });
  }, [
    students,
    search,
    statusFilter,
    majorFilter,
    sortOrder,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleStudents = filteredStudents.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  // =====================================================
  // ACTIONS
  // =====================================================

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("الكل");
    setMajorFilter("الكل");
    setSortOrder("name");
    setCurrentPage(1);
    setShowFilters(false);
    setShowSort(false);
  };

  const handleView = (student) => {
    navigate(
      `/admin/students/${encodeURIComponent(student.id)}`,
      {
        state: { student },
      }
    );
  };

  const handleDelete = (student) => {
    setStudentToDelete(student);
    setDeleteError("");
    setShowFilters(false);
    setShowSort(false);
  };

const confirmDelete = async () => {
  if (!studentToDelete) return;

  setDeleteError("");

  try {
    // الحذف الآمن للطالب عبر Django
    await deleteStudent(studentToDelete.userId, studentToDelete.profileId);

    // تحديث الجدول فوراً بعد نجاح الحذف
    setStudents((previous) =>
      previous.filter((student) => student.id !== studentToDelete.id)
    );

    setSuccessMessage(`تم حذف الطالب ${studentToDelete.name} بنجاح.`);
    setStudentToDelete(null);
    setDeleteError("");
  } catch (error) {
    const message =
      error?.data?.detail ||
      error?.message ||
      "تعذر حذف الطالب. حاولي مرة أخرى.";

    setDeleteError(message);
  }
};


  const exportCSV = () => {
    const rows = [
      [
        "اسم الطالب",
        "الرقم الجامعي",
        "التخصص",
        "جهة التدريب",
        "حالة التدريب",
        "المشرف الأكاديمي",
        "تاريخ البدء",
      ],
      ...filteredStudents.map((student) => [
        student.name,
        student.id,
        student.major,
        student.organization,
        student.status,
        student.supervisor,
        student.startDate,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) =>
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
    link.download = "students.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const toolButton =
    "inline-flex h-[44px] items-center justify-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[12px] transition hover:border-[#09379A]";

  const inputStyle =
    "h-[40px] w-full rounded-[8px] border border-[#E0E7F2] bg-white px-3 text-[12px] outline-none focus:border-[#09379A]";

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]"
    >
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        {/* HEADER */}
        <AdminHeader />

        {/* MAIN */}
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 pb-6 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full min-w-0 max-w-[1450px]">

            {/* BREADCRUMB */}
            <div className="mb-3 flex items-center gap-2 text-[12px] text-[#64748B]">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <span className="font-semibold text-[#111C2D]">
                الطلاب
              </span>
            </div>

            {/* TITLE */}
            <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="m-0 text-[25px] font-bold">
                  إدارة الطلاب
                </h1>

                <p className="m-0 mt-1 text-[12px] text-[#64748B]">
                  قائمة الطلاب المتدربين ومتابعة حالتهم
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/add-student")}
                className="inline-flex h-[44px] items-center justify-center gap-2 self-start rounded-[8px] bg-[#FF6534] px-5 text-[12px] font-bold text-white hover:bg-[#E95526]"
              >
                <Plus size={18} />
                إضافة طالب
              </button>
            </section>

            {/* SUCCESS */}
            {successMessage && (
              <div
                role="status"
                className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[12px] text-[#15803D]"
              >
                {successMessage}

                <button
                  type="button"
                  onClick={() => setSuccessMessage("")}
                >
                  <X size={17} />
                </button>
              </div>
            )}

            {/* SEARCH + TOOLS */}
            <section className="mb-5 flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
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
                  placeholder="ابحث بالاسم أو الرقم الجامعي..."
                  className="h-[44px] w-full rounded-[8px] border border-[#E0E7F2] bg-white pl-4 pr-11 text-[12px] outline-none focus:border-[#09379A]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {/* FILTER */}
                <div className="relative">
                  <button
                    type="button"
                    className={toolButton}
                    onClick={() => {
                      setShowFilters((value) => !value);
                      setShowSort(false);
                    }}
                  >
                    <SlidersHorizontal size={17} />
                    تصفية
                  </button>

                  {showFilters && (
                    <div className="absolute right-0 top-[50px] z-20 w-[260px] max-w-[calc(100vw-32px)] rounded-[10px] border border-[#E0E7F2] bg-white p-4 shadow-lg">
                      <h3 className="mb-4 text-[13px] font-bold">
                        تصفية الطلاب
                      </h3>

                      <label className="mb-2 block text-[11px]">
                        حالة التدريب
                      </label>

                      <select
                        className={`${inputStyle} mb-4`}
                        value={statusFilter}
                        onChange={(event) => {
                          setStatusFilter(event.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <label className="mb-2 block text-[11px]">
                        التخصص
                      </label>

                      <select
                        className={`${inputStyle} mb-4`}
                        value={majorFilter}
                        onChange={(event) => {
                          setMajorFilter(event.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        <option value="الكل">كل التخصصات</option>
                        {majors.map((major) => (
                          <option key={major} value={major}>
                            {major}
                          </option>
                        ))}
                      </select>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="flex h-[36px] flex-1 items-center justify-center gap-1 rounded-lg border border-[#E0E7F2] text-[11px]"
                        >
                          <RotateCcw size={13} />
                          إعادة ضبط
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowFilters(false)}
                          className="h-[36px] flex-1 rounded-lg bg-[#09379A] text-[11px] text-white"
                        >
                          تطبيق
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* SORT */}
                <div className="relative">
                  <button
                    type="button"
                    className={toolButton}
                    onClick={() => {
                      setShowSort((value) => !value);
                      setShowFilters(false);
                    }}
                  >
                    <ArrowDownUp size={17} />
                    ترتيب
                  </button>

                  {showSort && (
                    <div className="absolute left-0 top-[50px] z-20 w-[190px] rounded-[10px] border border-[#E0E7F2] bg-white p-2 shadow-lg">
                      {[
                        ["name", "حسب اسم الطالب"],
                        ["id", "حسب الرقم الجامعي"],
                        ["date", "حسب تاريخ البدء"],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setSortOrder(value);
                            setShowSort(false);
                          }}
                          className={`w-full rounded-lg px-3 py-2 text-right text-[12px] ${
                            sortOrder === value
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

                {/* EXPORT */}
                <button
                  type="button"
                  className={toolButton}
                  onClick={exportCSV}
                >
                  <Download size={16} />
                  تصدير
                </button>
              </div>
            </section>

            {/* STATUS FILTERS */}
            <section className="mb-5 flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full border px-4 py-2 text-[11px] transition ${
                    statusFilter === status
                      ? "border-[#09379A] bg-[#09379A] font-semibold text-white"
                      : "border-[#E0E7F2] bg-white text-[#475569]"
                  }`}
                >
                  {status}
                  {status === "الكل" && ` ${students.length}`}
                </button>
              ))}
            </section>

            {/* =============================================
                STUDENTS TABLE
                MOBILE: HORIZONTAL SCROLL
                DESKTOP: FIT TO PAGE
            ============================================= */}
            <section className="w-full min-w-0 rounded-[12px] border border-[#E0E7F2] bg-white p-3 sm:p-4 xl:p-5">

              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="m-0 text-[15px] font-bold text-[#062569]">
                    قائمة الطلاب
                  </h2>
                  <p className="m-0 mt-1 text-[11px] text-[#64748B]">
                    بيانات الطلاب وحالة التدريب الحالية
                  </p>
                </div>

                <span className="text-[11px] text-[#64748B]">
                  {filteredStudents.length} طالبًا
                </span>
              </div>

              {/* MOBILE HINT */}
              <div className="mb-3 flex items-center gap-2 text-[11px] text-[#64748B] lg:hidden">
                <ArrowDownUp
                  size={14}
                  className="rotate-90 text-[#09379A]"
                />
                اسحب الجدول أفقيًا لعرض جميع البيانات والإجراءات
              </div>

              {/* 
                Scroll stays INSIDE this container on mobile.
                The entire page won't scroll horizontally.
              */}
              <div
                dir="rtl"
                role="region"
                aria-label="جدول الطلاب - يمكن تمريره أفقيًا"
                tabIndex={0}
                className="w-full min-w-0 max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-[9px] border border-[#E0E7F2] focus:outline-none focus:ring-2 focus:ring-[#09379A]/20 lg:overflow-x-hidden"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <table className="w-full min-w-[880px] table-auto border-collapse text-right lg:min-w-0 lg:table-fixed">

                  <thead>
                    <tr className="bg-[#F1F5F9] text-[11px] font-semibold text-[#475569]">
                      <th className="min-w-[145px] px-3 py-4 lg:min-w-0 lg:w-[15%]">
                        اسم الطالب
                      </th>

                      <th className="min-w-[105px] px-3 py-4 lg:min-w-0 lg:w-[11%]">
                        الرقم الجامعي
                      </th>

                      <th className="min-w-[170px] px-3 py-4 lg:min-w-0 lg:w-[17%]">
                        التخصص
                      </th>

                      <th className="min-w-[165px] px-3 py-4 lg:min-w-0 lg:w-[16%]">
                        جهة التدريب
                      </th>

                      <th className="min-w-[125px] px-3 py-4 lg:min-w-0 lg:w-[13%]">
                        حالة التدريب
                      </th>

                      <th className="min-w-[120px] px-3 py-4 lg:min-w-0 lg:w-[12%]">
                        المشرف الأكاديمي
                      </th>

                      <th className="min-w-[150px] px-2 py-4 text-center lg:min-w-0 lg:w-[16%]">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-t border-[#E6EBF5] text-[11px] hover:bg-[#FAFBFE]"
                      >
                        {/* NAME */}
                        <td className="px-3 py-4 font-semibold leading-6">
                          <span className="block min-w-0 break-words">
                            {student.name}
                          </span>
                        </td>

                        {/* ID */}
                        <td className="px-3 py-4">
                          <span
                            dir="ltr"
                            className="inline-block whitespace-nowrap font-medium tabular-nums"
                          >
                            {student.id}
                          </span>
                        </td>

                        {/* MAJOR */}
                        <td className="px-3 py-4 leading-6">
                          <span className="block break-words">
                            {student.major}
                          </span>
                        </td>

                        {/* ORGANIZATION */}
                        <td className="px-3 py-4 leading-6">
                          <span className="block break-words">
                            {student.organization}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-2 py-4">
                          <StatusBadge status={student.status} />
                        </td>

                        {/* SUPERVISOR */}
                        <td className="px-3 py-4 leading-6">
                          <span className="block break-words">
                            {student.supervisor}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-2 py-4">
                          <div className="flex items-center justify-center gap-1.5">

                            <button
                              type="button"
                              onClick={() => handleView(student)}
                              aria-label={`عرض تفاصيل ${student.name}`}
                              className="inline-flex h-[34px] shrink-0 items-center justify-center gap-1 rounded-[7px] border border-[#E0E7F2] bg-white px-2 text-[10px] transition hover:border-[#09379A] hover:text-[#09379A]"
                            >
                              <Eye size={14} />
                              عرض
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(student)}
                              aria-label={`حذف ${student.name}`}
                              className="inline-flex h-[34px] shrink-0 items-center justify-center gap-1 rounded-[7px] border border-[#FECACA] bg-white px-2 text-[10px] text-[#DC2626] transition hover:bg-[#FEF2F2]"
                            >
                              <Trash2 size={14} />
                              حذف
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* EMPTY */}
                    {visibleStudents.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-12 text-center"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <Search
                              size={28}
                              className="text-[#94A3B8]"
                            />

                            <p className="m-0 text-[13px] font-bold">
                              لا توجد نتائج مطابقة
                            </p>

                            <button
                              type="button"
                              onClick={resetFilters}
                              className="text-[12px] text-[#09379A] hover:underline"
                            >
                              مسح عوامل التصفية
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">

                <p className="m-0 text-[11px] text-[#64748B]">
                  عرض{" "}
                  {filteredStudents.length === 0
                    ? 0
                    : (safePage - 1) * PAGE_SIZE + 1}
                  {" - "}
                  {Math.min(
                    safePage * PAGE_SIZE,
                    filteredStudents.length
                  )}
                  {" من "}
                  {filteredStudents.length} طالبًا
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
                    className="flex h-[35px] items-center gap-1 rounded-full border border-[#E0E7F2] px-3 text-[11px] disabled:opacity-40"
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
                      className={`h-[35px] min-w-[35px] rounded-full border text-[11px] ${
                        safePage === page
                          ? "border-[#09379A] bg-[#09379A] font-bold text-white"
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
                    className="flex h-[35px] items-center gap-1 rounded-full border border-[#E0E7F2] px-3 text-[11px] disabled:opacity-40"
                  >
                    التالي
                    <ChevronLeft size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <AcademicFooter audience="admin" />

          </div>
        </main>
      </div>

      {/* DELETE MODAL */}
      {studentToDelete && (
        <DeleteStudentModal
          error={deleteError}
          onCancel={() => {
            setStudentToDelete(null);
            setDeleteError("");
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ${
        STATUS_STYLES[status] ||
        "bg-[#F1F5F9] text-[#475569]"
      }`}
    >
      <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-current" />
      {status}
    </span>
  );
}

// =====================================================
// DELETE MODAL - FIGMA DESIGN
// =====================================================

function DeleteStudentModal({
  error,
  onCancel,
  onConfirm,
}) {
  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0F172A]/55 p-4 font-['Cairo']"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-student-title"
        aria-describedby="delete-student-description"
        className="w-full max-w-[520px] rounded-[12px] bg-white px-6 py-7 shadow-xl sm:px-7"
      >
        {/* ICON */}
        <div className="mb-5 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626]">
          <Trash2 size={25} strokeWidth={2} />
        </div>

        {/* TITLE */}
        <h2
          id="delete-student-title"
          className="m-0 text-[20px] font-bold text-[#111C2D]"
        >
          حذف الطالب
        </h2>

        {/* DESCRIPTION */}
        <p
          id="delete-student-description"
          className="m-0 mt-3 text-[13px] leading-7 text-[#64748B]"
        >
          سيتم حذف الطالب بشكل نهائي من سجل تدريبه،
          لا يمكن التراجع عن هذا الإجراء.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-3 text-[12px] text-[#DC2626]"
          >
            {error}
          </p>
        )}

        {/* BUTTONS */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-[44px] items-center justify-center gap-2 rounded-[8px] bg-[#09379A] px-5 text-[12px] font-bold text-white transition hover:bg-[#072E81]"
          >
            <Trash2 size={16} />
            تأكيد الحذف
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-[44px] items-center justify-center rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px] font-semibold hover:bg-[#F8FAFC]"
          >
            إلغاء
          </button>
        </div>
      </section>
    </div>
  );
}
