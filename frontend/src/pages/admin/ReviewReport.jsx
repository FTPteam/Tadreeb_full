import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { updateReport } from "./reportsStore";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Bell,
  Menu,
  ChevronLeft,
  ArrowRight,
  Check,
  Pencil,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

export default function ReviewReport() {
  const navigate = useNavigate();
  const { id } = useParams();

  const reportId = id || "1";

  const [checks, setChecks] = useState({
    achievements: true,
    documentation: true,
    deadline: true,
  });

  const [note, setNote] = useState("");

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-admin-sidebar")
    );
  };

  const toggleCheck = (name) => {
    setChecks((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  const goToDetails = () => {
    navigate(
      `/admin/reports/${encodeURIComponent(reportId)}`
    );
  };

  const approve = () => {
    if (!Object.values(checks).every(Boolean)) return;
    try {
      updateReport(reportId, { status: "approved", note: note.trim() });
      navigate("/admin/reports");
    } catch (error) {
      console.error("تعذر اعتماد التقرير", error);
    }
  };

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]"
    >
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader />

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-7 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1450px]">

            {/* BREADCRUMB */}
            <div className="mb-7 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B]">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="hover:text-[#09379A]"
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <button
                type="button"
                onClick={() => navigate("/admin/reports")}
                className="hover:text-[#09379A]"
              >
                التقارير
              </button>

              <ChevronLeft size={15} />

              <button
                type="button"
                onClick={goToDetails}
                className="hover:text-[#09379A]"
              >
                تفاصيل التقرير
              </button>

              <ChevronLeft size={15} />

              <span className="font-semibold text-[#111C2D]">
                مراجعة التقرير
              </span>
            </div>

            {/* TITLE */}
            <section className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="m-0 text-[26px] font-bold">
                  مراجعة التقرير
                </h1>

                <p className="m-0 mt-1 text-[12px] text-[#64748B]">
                  تقرير الأسبوع 3 - أمل أحمد
                </p>
              </div>

              <button
                type="button"
                onClick={goToDetails}
                className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[11px] transition hover:border-[#09379A]"
              >
                <ArrowRight size={16} />
                رجوع
              </button>
            </section>

            {/* PROGRESS STEPS */}
            <section className="mb-6 rounded-[12px] border border-[#E0E7F2] bg-white px-4 py-5 sm:px-6">
              <div className="flex w-full items-center gap-2 sm:gap-4">
                <Step
                  number="✓"
                  label="استلام التقرير"
                  completed
                />

                <div className="h-[2px] min-w-2 flex-1 bg-[#16A34A]" />

                <Step
                  number="2"
                  label="مراجعة المشرف"
                  active
                />

                <div className="h-[2px] min-w-2 flex-1 bg-[#DCE4F0]" />

                <Step
                  number="3"
                  label="القرار"
                />
              </div>
            </section>

            {/* CONTENT GRID */}
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_400px]">

              {/* REPORT SUMMARY */}
              <section className="min-h-[430px] rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
                <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                  التقرير
                </h2>

                <div className="mt-2 rounded-[10px] border border-[#E0E7F2] p-5 sm:p-6">
                  <h3 className="m-0 text-[14px] font-bold">
                    ملخص التقرير
                  </h3>

                  <p className="m-0 mt-4 text-[12px] leading-7 text-[#64748B]">
                    بناء واجهات الويب لنظام العملاء،
                    مراجعة الكود، توثيق المكونات.
                  </p>
                </div>
              </section>

              {/* REVIEW CHECKLIST */}
              <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
                <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                  قائمة المراجعة
                </h2>

                <div className="mt-4 space-y-4">
                  <CheckItem
                    checked={checks.achievements}
                    onChange={() =>
                      toggleCheck("achievements")
                    }
                    label="المخرجات واضحة ومكتملة"
                  />

                  <CheckItem
                    checked={checks.documentation}
                    onChange={() =>
                      toggleCheck("documentation")
                    }
                    label="التوثيق مناسب"
                  />

                  <CheckItem
                    checked={checks.deadline}
                    onChange={() =>
                      toggleCheck("deadline")
                    }
                    label="الالتزام بالموعد"
                  />
                </div>

                <label
                  htmlFor="supervisorNote"
                  className="mt-5 block text-[11px] font-medium"
                >
                  ملاحظات المشرف
                </label>

                <textarea
                  id="supervisorNote"
                  rows={5}
                  value={note}
                  onChange={(event) =>
                    setNote(event.target.value)
                  }
                  placeholder="اكتب ملاحظاتك..."
                  className="mt-2 w-full resize-none rounded-[8px] border border-[#E0E7F2] p-3 text-[12px] leading-6 outline-none focus:border-[#09379A]"
                />

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goToDetails}
                    className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[11px] transition hover:border-[#09379A]"
                  >
                    <Pencil size={15} />
                    طلب تعديل
                  </button>

                  <button
                    type="button"
                    onClick={approve}
                    className="flex h-[44px] items-center gap-2 rounded-[8px] bg-[#FF6534] px-5 text-[11px] font-bold text-white transition hover:bg-[#E95526]"
                  >
                    <Check size={15} />
                    اعتماد
                  </button>
                </div>
              </section>
            </div>

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}

// =====================================================
// PROGRESS STEP
// =====================================================

function Step({
  number,
  label,
  active = false,
  completed = false,
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <span
        className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
          completed
            ? "border-[#15803D] bg-[#15803D] text-white"
            : active
            ? "border-[#09379A] bg-[#09379A] text-white"
            : "border-[#DCE4F0] bg-white text-[#64748B]"
        }`}
      >
        {completed ? <Check size={16} /> : number}
      </span>

      <span
        className={`text-[10px] font-semibold leading-5 sm:text-[11px] ${
          completed
            ? "text-[#15803D]"
            : active
            ? "text-[#09379A]"
            : "text-[#64748B]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// =====================================================
// CHECK ITEM
// =====================================================

function CheckItem({
  checked,
  onChange,
  label,
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className="flex w-full items-center gap-3 text-right text-[11px] text-[#334155]"
    >
      <span
        className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[4px] ${
          checked
            ? "bg-[#09379A] text-white"
            : "border border-[#CBD5E1] bg-white"
        }`}
      >
        {checked && <Check size={13} />}
      </span>

      {label}
    </button>
  );
}

// =====================================================
// HEADER
// =====================================================



// =====================================================
// FOOTER
// =====================================================


