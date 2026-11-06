import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { getReport, updateReport } from "./reportsStore";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bell,
  Menu,
  ChevronLeft,
  ArrowRight,
  Check,
  Pencil,
  Send,
  X,
  ClipboardCheck,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

// =====================================================
// SAMPLE REPORT
// =====================================================

const REPORT = {
  id: 1,
  student: "أمل أحمد",
  type: "أسبوعي - 3",
  date: "2025/12/22",
  status: "بانتظار المراجعة",

  title: "تقرير الأسبوع 3 - تطوير واجهات الويب",

  description:
    "خلال هذا الأسبوع عملت على بناء واجهات المستخدم لنظام إدارة العملاء باستخدام HTML وCSS وJavaScript، وشاركت في اجتماع مراجعة الكود مع فريق التطوير.",

  achievements: [
    "تنفيذ 4 صفحات متجاوبة.",
    "معالجة 6 ملاحظات على واجهة تسجيل الدخول.",
    "توثيق المكونات المستخدمة.",
  ],

  challenges:
    "التعامل مع اتجاه RTL في الجداول، وتم حلها بالتنسيق مع المشرف الميداني.",
};

export default function ReportDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentReport = getReport(id || REPORT.id);
  const reportStatus = currentReport?.status === "approved" ? "معتمد" : currentReport?.status === "revision" ? "مطلوب تعديل" : "بانتظار المراجعة";

  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-admin-sidebar")
    );
  };

  const goToReview = () => {
    navigate(
      `/admin/reports/${encodeURIComponent(id || REPORT.id)}/review`
    );
  };

  const goToReports = () => {
    navigate("/admin/reports");
  };

  const submitRevision = (event) => {
    event.preventDefault();

    if (!revisionNote.trim()) return;

    try {
      updateReport(id || REPORT.id, { status: "revision", note: revisionNote.trim() });
    } catch (error) {
      console.error("تعذر طلب تعديل التقرير", error);
      return;
    }

    setShowRevisionModal(false);
    setRevisionNote("");
  };

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]"
    >
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        {/* HEADER */}
        <AdminHeader />

        {/* CONTENT */}
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
                onClick={goToReports}
                className="hover:text-[#09379A]"
              >
                التقارير
              </button>

              <ChevronLeft size={15} />

              <span className="font-semibold text-[#111C2D]">
                تفاصيل التقرير
              </span>
            </div>

            {/* PAGE HEADER */}
            <section className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="m-0 text-[27px] font-bold leading-10 text-[#111C2D]">
                  تفاصيل التقرير
                </h1>

                <p className="m-0 mt-1 text-[12px] text-[#64748B]">
                  تقرير الأسبوع 3 - أمل أحمد
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* RETURN */}
                <button
                  type="button"
                  onClick={goToReports}
                  className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[11px] font-semibold transition hover:border-[#09379A]"
                >
                  <ArrowRight size={16} />
                  التقارير
                </button>

                {/* REQUEST REVISION */}
                <button
                  type="button"
                  onClick={() => setShowRevisionModal(true)}
                  className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[11px] font-semibold transition hover:border-[#09379A]"
                >
                  <Pencil size={16} />
                  طلب تعديل
                </button>

                {/* APPROVAL ACTION GOES TO REVIEW PAGE */}
                <button
                  type="button"
                  onClick={goToReview}
                  className="flex h-[44px] items-center gap-2 rounded-[8px] bg-[#09379A] px-5 text-[11px] font-semibold text-white transition hover:bg-[#072E81]"
                >
                  <Check size={16} />
                  اعتماد التقرير
                </button>
              </div>
            </section>

            {/* GRID */}
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_400px]">
              {/* REPORT CONTENT */}
              <section className="min-w-0 rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
                <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                  محتوى التقرير
                </h2>

                <div className="mt-2 rounded-[10px] border border-[#E0E7F2] p-5 sm:p-6">
                  <h3 className="m-0 text-[15px] font-bold text-[#111C2D]">
                    {String(currentReport?.id) === "1" ? REPORT.title : (currentReport?.type || REPORT.type)}
                  </h3>

                  <p className="m-0 mt-4 text-[12px] leading-7 text-[#64748B]">
                    {String(currentReport?.id) === "1" ? REPORT.description : "لا تتوفر تفاصيل نصية إضافية لهذا التقرير في البيانات التجريبية."}
                  </p>

                  <h4 className="m-0 mt-5 text-[13px] font-bold">
                    المنجزات
                  </h4>

                  <ul className="mt-3 list-disc space-y-2 pr-5 text-[12px] leading-6 text-[#475569]">
                    {(String(currentReport?.id) === "1" ? REPORT.achievements : []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h4 className="m-0 mt-5 text-[13px] font-bold">
                    التحديات
                  </h4>

                  <p className="m-0 mt-3 text-[12px] leading-7 text-[#475569]">
                    {String(currentReport?.id) === "1" ? REPORT.challenges : "—"}
                  </p>
                </div>
              </section>

              {/* LEFT COLUMN */}
              <div className="flex min-w-0 flex-col gap-6">
                {/* REPORT INFO */}
                <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
                  <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                    معلومات التقرير
                  </h2>

                  <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5">
                    <InfoItem
                      label="الطالب"
                      value={currentReport?.student || REPORT.student}
                    />

                    <InfoItem
                      label="نوع التقرير"
                      value={currentReport?.type || REPORT.type}
                    />

                    <InfoItem
                      label="تاريخ الإرسال"
                      value={currentReport?.date || REPORT.date}
                    />

                    <InfoItem
                      label="الحالة"
                      value={reportStatus}
                    />
                  </div>
                </section>

                {/* REVIEW - UPDATED */}
                <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
                  <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                    المراجعة
                  </h2>

                  <p className="m-0 mt-4 text-[12px] leading-7 text-[#64748B]">
                    يمكنك مراجعة التقرير والتحقق من المخرجات
                    وإضافة ملاحظات المشرف واتخاذ القرار
                    من صفحة مراجعة التقرير.
                  </p>

                  <button
                    type="button"
                    onClick={goToReview}
                    className="mt-5 inline-flex h-[44px] items-center justify-center gap-2 rounded-[8px] bg-[#09379A] px-5 text-[12px] font-semibold text-white transition hover:bg-[#072E81]"
                  >
                    <ClipboardCheck size={17} />
                    مراجعة التقرير
                    <ChevronLeft size={15} />
                  </button>
                </section>
              </div>
            </div>

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>

      {/* REQUEST REVISION MODAL */}
      {showRevisionModal && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0F172A]/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowRevisionModal(false);
            }
          }}
        >
          <form
            onSubmit={submitRevision}
            className="my-auto w-full max-w-[520px] rounded-[14px] bg-white p-7 shadow-2xl"
          >
            <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#FFE5D9] text-[#B54708]">
              <Pencil size={25} />
            </div>

            <h2 className="m-0 mt-5 text-[21px] font-bold">
              طلب تعديل على التقرير
            </h2>

            <p className="m-0 mt-2 text-[12px] leading-6 text-[#64748B]">
              سيعاد التقرير إلى الطالبة أمل أحمد
              مع ملاحظاتك لإجراء التعديلات المطلوبة.
            </p>

            <label
              htmlFor="revisionNote"
              className="mt-5 block text-[11px] font-semibold text-[#334155]"
            >
              ما المطلوب تعديله؟
            </label>

            <textarea
              id="revisionNote"
              required
              rows={5}
              value={revisionNote}
              onChange={(event) =>
                setRevisionNote(event.target.value)
              }
              placeholder="أضف المخرجات بشكل أوضح..."
              className="mt-2 w-full resize-none rounded-[8px] border border-[#E0E7F2] p-3 text-[12px] leading-6 outline-none focus:border-[#09379A]"
            />

            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRevisionModal(false)}
                className="h-[44px] rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[11px] font-semibold"
              >
                إلغاء
              </button>

              <button
                type="submit"
                className="flex h-[44px] items-center gap-2 rounded-[8px] bg-[#FF6534] px-5 text-[11px] font-bold text-white hover:bg-[#E95526]"
              >
                <Send size={16} />
                إرسال طلب التعديل
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// =====================================================
// INFO ITEM
// =====================================================

function InfoItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="m-0 text-[10px] text-[#64748B]">
        {label}
      </p>

      <p className="m-0 mt-1 break-words text-[12px] font-semibold text-[#111C2D]">
        {value}
      </p>
    </div>
  );
}

// =====================================================
// HEADER
// =====================================================



// =====================================================
// FOOTER
// =====================================================


