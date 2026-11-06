import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Check,
  CheckCircle2,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

const APPROVALS = {
  1: {
    id: 1,
    student: "أمل أحمد صيام",
    organization: "شركة القدس للاتصالات",
    requestDate: "2025/10/01",
    officer: "د. سامر يوسف",
    status: "pending",
  },
  2: {
    id: 2,
    student: "محمود رضوان",
    organization: "شركة المشرق الرقمية",
    requestDate: "2025/09/29",
    officer: "د. سامر يوسف",
    status: "approved",
  },
  3: {
    id: 3,
    student: "سارة عبد الرحمن",
    organization: "شركة جوال",
    requestDate: "2025/09/28",
    officer: "أ. مريم عاشور",
    status: "review",
  },
};

export default function ApprovalDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const initialData =
    APPROVALS[id] || APPROVALS[1];

  const [approval, setApproval] =
    useState(initialData);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-student-sidebar")
    );
  };

  const confirmApproval = () => {
    setApproval((previous) => ({
      ...previous,
      status: "approved",
    }));

    setShowConfirm(false);
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
            pb-6
            pt-5
            sm:px-6
            lg:px-8
          "
        >
          <div className="mx-auto w-full max-w-[1450px]">
            {/* BREADCRUMB */}

            <div
              className="
                mb-7
                flex
                items-center
                gap-2
                text-[12px]
                text-[#64748B]
              "
            >
              <button
                onClick={() =>
                  navigate("/admin/dashboard")
                }
                className="hover:text-[#09379A]"
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <span className="font-semibold text-[#111C2D]">
                تفاصيل الاعتماد
              </span>
            </div>

            {/* HEADER */}

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
                    text-[25px]
                    font-bold
                    text-[#111C2D]
                  "
                >
                  تفاصيل اعتماد التدريب
                </h1>

                <p className="m-0 mt-1 text-[12px] text-[#64748B]">
                  {approval.student} - {approval.organization}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/approvals")
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
                    px-5
                    text-[12px]
                    font-semibold
                  "
                >
                  <ArrowRight size={16} />
                  رجوع
                </button>

                {approval.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirm(true)
                    }
                    className="
                      flex
                      h-[44px]
                      items-center
                      gap-2
                      rounded-[8px]
                      bg-[#FF6534]
                      px-5
                      text-[12px]
                      font-bold
                      text-white
                      hover:bg-[#E95526]
                    "
                  >
                    <BadgeCheck size={17} />
                    اعتماد التدريب
                  </button>
                )}
              </div>
            </section>

            {/* STEPS */}

            <section
              className="
                mb-6
                rounded-[12px]
                border
                border-[#E0E7F2]
                bg-white
                px-5
                py-5
              "
            >
              <div className="grid gap-5 md:grid-cols-4 md:gap-0">
                <Step
                  label="تقديم الطلب"
                  state="done"
                />

                <Step
                  label="مراجعة المشرف"
                  state="done"
                />

                <Step
                  number="3"
                  label="اعتماد التدريب"
                  state={
                    approval.status === "approved"
                      ? "done"
                      : "active"
                  }
                />

                <Step
                  number="4"
                  label="بدء التدريب"
                  state={
                    approval.status === "approved"
                      ? "active"
                      : "upcoming"
                  }
                  last
                />
              </div>
            </section>

            {/* GRID */}

            <div
              className="
                grid
                grid-cols-1
                gap-5
                xl:grid-cols-[minmax(0,1.7fr)_400px]
              "
            >
              <div className="flex flex-col gap-5">
                {/* APPROVAL DATA */}

                <Card title="بيانات الاعتماد">
                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-5
                      sm:grid-cols-2
                      xl:grid-cols-4
                    "
                  >
                    <DataItem
                      label="الطالب"
                      value={approval.student}
                    />

                    <DataItem
                      label="الجهة"
                      value={approval.organization}
                    />

                    <DataItem
                      label="تاريخ الطلب"
                      value={approval.requestDate}
                    />

                    <DataItem
                      label="المسؤول عن الاعتماد"
                      value={approval.officer}
                    />
                  </div>
                </Card>

                {/* CHECKLIST */}

                <Card title="قائمة التحقق">
                  <div className="space-y-3">
                    <CheckItem text="استيفاء متطلبات التخصص" />
                    <CheckItem text="موافقة جهة التدريب" />
                    <CheckItem text="كتاب التدريب الرسمي مرفق" />
                    <CheckItem text="لا يوجد تعارض في الجدول الدراسي" />
                  </div>
                </Card>
              </div>

              {/* STATUS */}

              <Card title="الحالة">
                <div
                  className={`
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    px-3
                    py-2
                    text-[11px]
                    font-semibold

                    ${
                      approval.status === "approved"
                        ? "bg-[#DCFCE7] text-[#15803D]"
                        : "bg-[#FFE4D6] text-[#C55A1D]"
                    }
                  `}
                >
                  <span className="h-[6px] w-[6px] rounded-full bg-current" />

                  {approval.status === "approved"
                    ? "تم الاعتماد"
                    : "بانتظار الاعتماد"}
                </div>
              </Card>
            </div>

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>

      {/* =====================================================
          CONFIRM MODAL
      ====================================================== */}

      {showConfirm && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-[#0F1B2E]/95
            p-4
          "
        >
          <section
            className="
              w-full
              max-w-[520px]
              rounded-[14px]
              bg-white
              p-7
              shadow-2xl
            "
          >
            <div
              className="
                mb-5
                flex
                h-[56px]
                w-[56px]
                items-center
                justify-center
                rounded-full
                bg-[#DCFCE7]
                text-[#15803D]
              "
            >
              <BadgeCheck size={27} />
            </div>

            <h2
              className="
                m-0
                text-[20px]
                font-bold
                text-[#111C2D]
              "
            >
              اعتماد التدريب
            </h2>

            <p
              className="
                m-0
                mt-3
                text-[12px]
                leading-7
                text-[#64748B]
              "
            >
              سيتم اعتماد تدريب الطالبة{" "}
              <strong className="text-[#111C2D]">
                {approval.student}
              </strong>{" "}
              لدى {approval.organization} وإصدار كتاب التوجيه.
            </p>

            <div
              className="
                mt-6
                flex
                justify-end
                gap-3
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowConfirm(false)
                }
                className="
                  h-[44px]
                  rounded-[8px]
                  border
                  border-[#E0E7F2]
                  bg-white
                  px-5
                  text-[12px]
                "
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={confirmApproval}
                className="
                  flex
                  h-[44px]
                  items-center
                  gap-2
                  rounded-[8px]
                  bg-[#FF6534]
                  px-5
                  text-[12px]
                  font-bold
                  text-white
                "
              >
                <BadgeCheck size={16} />
                اعتماد
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function Card({ title, children }) {
  return (
    <section
      className="
        rounded-[12px]
        border
        border-[#E0E7F2]
        bg-white
        p-5
      "
    >
      <h2
        className="
          m-0
          border-b
          border-[#E6EBF5]
          pb-4
          text-[16px]
          font-bold
          text-[#062569]
        "
      >
        {title}
      </h2>

      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}

function DataItem({ label, value }) {
  return (
    <div>
      <p className="m-0 text-[10px] text-[#64748B]">
        {label}
      </p>

      <p
        className="
          m-0
          mt-1
          text-[12px]
          font-semibold
          text-[#111C2D]
        "
      >
        {value}
      </p>
    </div>
  );
}

function CheckItem({ text }) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        text-[11px]
        text-[#111C2D]
      "
    >
      <CheckCircle2
        size={17}
        className="text-[#15803D]"
      />

      {text}
    </div>
  );
}

function Step({
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
          z-10
          flex
          items-center
          gap-3
          bg-white
          px-2
        "
      >
        <div
          className={`
            flex
            h-[34px]
            w-[34px]
            items-center
            justify-center
            rounded-full
            border
            text-[11px]
            font-bold

            ${
              done
                ? "border-[#15803D] bg-[#15803D] text-white"
                : active
                ? "border-[#09379A] bg-[#09379A] text-white"
                : "border-[#D7E0EB] bg-white text-[#94A3B8]"
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
            left-0
            right-[45px]
            top-[17px]
            hidden
            h-[2px]
            md:block

            ${
              done
                ? "bg-[#15803D]"
                : "bg-[#DCE5F0]"
            }
          `}
        />
      )}
    </div>
  );
}

