import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BadgeCheck,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

/* =========================================================
   DATA
========================================================= */

const INITIAL_APPROVALS = [
  {
    id: 1,
    student: "أمل أحمد",
    organization: "شركة القدس للاتصالات",
    status: "pending",
    requestDate: "2025/10/01",
    officer: "د. سامر يوسف",
  },
  {
    id: 2,
    student: "محمود رضوان",
    organization: "شركة المشرق الرقمية",
    status: "approved",
    requestDate: "2025/09/29",
    officer: "د. سامر يوسف",
  },
  {
    id: 3,
    student: "سارة عبد الرحمن",
    organization: "شركة جوال",
    status: "review",
    requestDate: "2025/09/28",
    officer: "أ. مريم عاشور",
  },
  {
    id: 4,
    student: "بلال الشيخ",
    organization: "شركة جوال",
    status: "rejected",
    requestDate: "2025/09/27",
    officer: "د. خالد النجار",
  },
  {
    id: 5,
    student: "هدى شهير",
    organization: "استوديو بيكسل الإبداعية",
    status: "pending",
    requestDate: "2025/09/25",
    officer: "د. سامر يوسف",
  },
  {
    id: 6,
    student: "محمد العطار",
    organization: "شركة التقنية الحديثة",
    status: "approved",
    requestDate: "2025/09/23",
    officer: "د. سامر يوسف",
  },
  {
    id: 7,
    student: "نور خليل",
    organization: "شركة الأمل للأنظمة",
    status: "review",
    requestDate: "2025/09/20",
    officer: "أ. مريم عاشور",
  },
  {
    id: 8,
    student: "أحمد ناصر",
    organization: "شركة الشرق الصناعية",
    status: "rejected",
    requestDate: "2025/09/18",
    officer: "د. خالد النجار",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function Approvals() {
  const navigate = useNavigate();

  const [approvals] = useState(INITIAL_APPROVALS);

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 4;

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(approvals.length / pageSize)
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const visibleApprovals = useMemo(() => {
    return approvals.slice(
      (safePage - 1) * pageSize,
      safePage * pageSize
    );
  }, [approvals, safePage]);

  /* =======================================================
     ACTIONS
  ======================================================= */

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-student-sidebar")
    );
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
                  navigate("/admin/dashboard")
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
                اعتماد التدريب
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
                اعتماد التدريب
              </h1>

              <p
                className="
                  m-0
                  mt-1
                  text-[13px]
                  text-[#64748B]
                "
              >
                متابعة واعتماد تدريب الطلاب
              </p>
            </section>

            {/* =============================================
                PROCESS STEPS
            ============================================== */}

            <section
              className="
                mb-6
                rounded-[12px]
                border
                border-[#E0E7F2]
                bg-white
                px-4
                py-5
                sm:px-6
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  gap-5
                  md:grid-cols-4
                  md:gap-0
                "
              >
                <ApprovalStep
                  number="1"
                  label="تقديم الطلب"
                  state="done"
                />

                <ApprovalStep
                  number="2"
                  label="مراجعة المشرف"
                  state="done"
                />

                <ApprovalStep
                  number="3"
                  label="اعتماد التدريب"
                  state="active"
                />

                <ApprovalStep
                  number="4"
                  label="بدء التدريب"
                  state="upcoming"
                  last
                />
              </div>
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
                    min-w-[850px]
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
                        الطالب
                      </th>

                      <th className="px-4 py-4">
                        جهة التدريب
                      </th>

                      <th className="px-4 py-4">
                        حالة الاعتماد
                      </th>

                      <th className="px-4 py-4">
                        تاريخ الطلب
                      </th>

                      <th className="px-4 py-4">
                        المسؤول عن الاعتماد
                      </th>

                      <th className="px-4 py-4">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleApprovals.map(
                      (item) => (
                        <tr
                          key={item.id}
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
                            "
                          >
                            {item.student}
                          </td>

                          <td className="px-4 py-4">
                            {item.organization}
                          </td>

                          <td className="px-4 py-4">
                            <ApprovalStatus
                              status={item.status}
                            />
                          </td>

                          <td
                            className="
                              whitespace-nowrap
                              px-4
                              py-4
                            "
                            dir="ltr"
                          >
                            {item.requestDate}
                          </td>

                          <td className="px-4 py-4">
                            {item.officer}
                          </td>

                          {/* ACTION */}

                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/admin/approvals/${item.id}`
                                )
                              }
                              className="
                                flex
                                h-[32px]
                                items-center
                                gap-[6px]

                                rounded-[7px]

                                border
                                border-[#E0E7F2]

                                bg-white

                                px-3

                                text-[10px]
                                font-semibold
                                text-[#09379A]

                                transition

                                hover:border-[#09379A]
                                hover:bg-[#F8FBFF]
                              "
                            >
                              <BadgeCheck size={14} />

                              {item.status === "approved"
                                ? "التفاصيل"
                                : "اعتماد / تفاصيل"}
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
                  عرض{" "}
                  {approvals.length
                    ? (safePage - 1) *
                        pageSize +
                      1
                    : 0}
                  {" - "}
                  {Math.min(
                    safePage * pageSize,
                    approvals.length
                  )}{" "}
                  من {approvals.length} طلبًا
                </p>

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  {/* PREVIOUS */}

                  <button
                    type="button"
                    disabled={safePage === 1}
                    onClick={() =>
                      setCurrentPage((page) =>
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
                      bg-white
                      px-3
                      text-[10px]
                      disabled:opacity-40
                    "
                  >
                    <ChevronRight size={13} />

                    السابق
                  </button>

                  {/* PAGES */}

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        setCurrentPage(page)
                      }
                      className={`
                        h-[34px]
                        min-w-[34px]

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
                              `
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}

                  {/* NEXT */}

                  <button
                    type="button"
                    disabled={
                      safePage === totalPages
                    }
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
                      h-[34px]
                      items-center
                      gap-1
                      rounded-full
                      border
                      border-[#E0E7F2]
                      bg-white
                      px-3
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
   APPROVAL STEP
========================================================= */

function ApprovalStep({
  number,
  label,
  state,
  last = false,
}) {
  const done = state === "done";
  const active = state === "active";

  return (
    <div
      className="
        relative
        flex
        items-center
        md:flex-1
      "
    >
      <div
        className="
          relative
          z-[2]
          flex
          items-center
          gap-3
          bg-white
        "
      >
        <div
          className={`
            flex
            h-[34px]
            w-[34px]
            shrink-0

            items-center
            justify-center

            rounded-full

            border

            text-[11px]
            font-bold

            ${
              done
                ? `
                    border-[#15803D]
                    bg-[#15803D]
                    text-white
                  `
                : active
                ? `
                    border-[#09379A]
                    bg-[#09379A]
                    text-white
                  `
                : `
                    border-[#D7E0EB]
                    bg-white
                    text-[#94A3B8]
                  `
            }
          `}
        >
          {done ? (
            <Check size={16} />
          ) : (
            number
          )}
        </div>

        <span
          className={`
            whitespace-nowrap

            text-[11px]
            font-semibold

            ${
              done
                ? "text-[#15803D]"
                : active
                ? "text-[#09379A]"
                : "text-[#64748B]"
            }
          `}
        >
          {label}
        </span>
      </div>

      {!last && (
        <div
          className={`
            absolute
            left-[15px]
            right-[45px]
            top-[17px]

            hidden
            h-[2px]

            md:block

            ${
              done
                ? "bg-[#15803D]"
                : "bg-[#DCE5F3]"
            }
          `}
        />
      )}
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function ApprovalStatus({ status }) {
  const config = {
    pending: {
      label: "بانتظار الاعتماد",
      className:
        "bg-[#FFE5D9] text-[#B54708]",
    },

    approved: {
      label: "معتمد",
      className:
        "bg-[#DCFCE7] text-[#15803D]",
    },

    review: {
      label: "قيد المراجعة",
      className:
        "bg-[#DDF6FF] text-[#08759B]",
    },

    rejected: {
      label: "مرفوض",
      className:
        "bg-[#FEE2E2] text-[#DC2626]",
    },
  };

  const current = config[status];

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