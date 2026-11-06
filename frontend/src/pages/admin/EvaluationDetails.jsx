import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Bell,
  Menu,
  ChevronLeft,
  ArrowRight,
  Printer,
  Star,
  AlertCircle,
  Plus,
  Pencil,
  ClipboardCheck,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

import {
  getEvaluation,
  calculateFinalScore,
  formatScore,
  STATUS_CONFIG,
  CRITERIA,
} from "./evaluationStore";

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function EvaluationDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [evaluation, setEvaluation] = useState(() =>
    getEvaluation(id)
  );

  useEffect(() => {
    const refresh = () => {
      setEvaluation(getEvaluation(id));
    };

    refresh();

    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("evaluations-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("evaluations-updated", refresh);
    };
  }, [id]);

  const goBack = () => {
    navigate("/admin/evaluations");
  };

  const basePath = `/admin/evaluations/${encodeURIComponent(id)}`;

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!evaluation) {
    return (
      <PageShell navigate={navigate}>
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[12px] border border-[#E0E7F2] bg-white p-8 text-center">
          <AlertCircle size={40} className="text-[#DC2626]" />

          <h1 className="mt-4 text-[20px] font-bold">
            التقييم غير موجود
          </h1>

          <p className="mt-2 text-[12px] text-[#64748B]">
            لم يتم العثور على تقييم بهذا الرقم.
          </p>

          <button
            type="button"
            onClick={goBack}
            className="mt-4 rounded-[8px] bg-[#09379A] px-5 py-3 text-[12px] font-semibold text-white"
          >
            العودة إلى التقييمات
          </button>
        </div>
      </PageShell>
    );
  }

  // =====================================================
  // EVALUATION STATE
  // =====================================================

  const isApproved = evaluation.status === "approved";

  const hasFieldScore = evaluation.fieldScore != null;
  const hasAcademicScore = evaluation.academicScore != null;

  const finalScore = calculateFinalScore(evaluation);

  const status =
    STATUS_CONFIG[evaluation.status] ||
    STATUS_CONFIG.not_started;

  const hasFieldCriteria =
    evaluation.fieldCriteria &&
    Object.keys(evaluation.fieldCriteria).length > 0;

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <PageShell navigate={navigate}>
      {/* BREADCRUMB */}
      <nav className="mb-7 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B] print:hidden">
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="hover:text-[#09379A]"
        >
          الرئيسية
        </button>

        <ChevronLeft size={15} />

        <span className="font-bold text-[#111C2D]">
          تفاصيل التقييم
        </span>
      </nav>

      {/* PAGE HEADER */}
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="m-0 text-[26px] font-bold leading-10">
            تفاصيل التقييم
          </h1>

          <p className="m-0 mt-1 text-[12px] text-[#64748B]">
            {evaluation.fullName || evaluation.student}
            {" - "}
            {evaluation.organization}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px] transition hover:border-[#09379A]"
          >
            <ArrowRight size={16} />
            التقييمات
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px] transition hover:border-[#09379A]"
          >
            <Printer size={16} />
            طباعة
          </button>
        </div>
      </section>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_400px]">

        {/* RIGHT COLUMN */}
        <div className="min-w-0 space-y-6">

          {/* FIELD SUPERVISOR CRITERIA */}
          <Section title="معايير تقييم المشرف الميداني">
            {hasFieldCriteria ? (
              <div>
                {CRITERIA.map((criterion) => (
                  <div
                    key={criterion.key}
                    className="flex min-h-[56px] flex-wrap items-center justify-between gap-3 border-b border-[#E6EBF5] py-3 last:border-0"
                  >
                    <span className="text-[12px] font-bold leading-6">
                      {criterion.label}
                    </span>

                    <RatingStars
                      score={
                        evaluation.fieldCriteria?.[criterion.key]
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="m-0 py-4 text-[12px] leading-7 text-[#64748B]">
                {hasFieldScore
                  ? "الدرجة الإجمالية للمشرف الميداني متوفرة، لكن تفاصيل المعايير لم تُسجّل بعد."
                  : "لم يتم تسجيل تقييم المشرف الميداني بعد."}
              </p>
            )}
          </Section>

          {/* FIELD SUPERVISOR NOTES */}
          <Section title="ملاحظات المشرف الميداني">
            <p className="m-0 text-[12px] leading-7 text-[#64748B]">
              {evaluation.fieldNote ||
                "لا توجد ملاحظات مسجلة من المشرف الميداني."}
            </p>
          </Section>
        </div>

        {/* LEFT COLUMN */}
        <div className="min-w-0 space-y-6">

          {/* FINAL SCORE */}
          <Section title="الدرجة النهائية">
            <div className="text-center">
              <div className="text-[45px] font-bold leading-none text-[#062569]">
                {formatScore(finalScore)}
              </div>

              <p className="m-0 mt-2 text-[11px] text-[#64748B]">
                {finalScore == null
                  ? "لم تكتمل مكونات الدرجة بعد"
                  : "من 5 - الدرجة النهائية"}
              </p>

              {/* STATUS BADGE */}
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                    isApproved
                      ? "bg-[#E8EEF9] text-[#09379A]"
                      : status.className
                  }`}
                >
                  <span className="h-[6px] w-[6px] rounded-full bg-current" />
                  {status.label}
                </span>
              </div>

              {/* WORKFLOW ACTION */}
              {!isApproved && hasFieldScore && (
                <div className="mt-5 flex flex-wrap justify-center gap-2 print:hidden">
                  <button
                    type="button"
                    onClick={() => {
                      if (!hasAcademicScore) {
                        navigate(`${basePath}/add`);
                      } else {
                        navigate(`${basePath}/final-review`);
                      }
                    }}
                    className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[8px] bg-[#09379A] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#072E81]"
                  >
                    {hasAcademicScore ? (
                      <ClipboardCheck size={16} />
                    ) : (
                      <Plus size={16} />
                    )}

                    {hasAcademicScore
                      ? "مراجعة التقييم النهائي"
                      : "إضافة تقييم أكاديمي"}
                  </button>

                  {hasAcademicScore && (
                    <button
                      type="button"
                      onClick={() => navigate(`${basePath}/add`)}
                      className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 py-2 text-[11px] font-semibold text-[#09379A] transition hover:border-[#09379A]"
                    >
                      <Pencil size={15} />
                      تعديل التقييم الأكاديمي
                    </button>
                  )}
                </div>
              )}
            </div>
          </Section>

          {/* SCORES */}
          <Section title="الدرجات">
            <div className="grid grid-cols-2 gap-6">
              <ScoreItem
                label="المشرف الميداني"
                value={evaluation.fieldScore}
              />

              <ScoreItem
                label="المشرف الأكاديمي"
                value={evaluation.academicScore}
              />
            </div>
          </Section>
        </div>
      </div>

      <AcademicFooter audience="admin" />
    </PageShell>
  );
}

// =====================================================
// SECTION
// =====================================================

function Section({ title, children }) {
  return (
    <section className="min-w-0 rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
      <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
        {title}
      </h2>

      {children}
    </section>
  );
}

// =====================================================
// RATING STARS
// =====================================================

function RatingStars({ score }) {
  const value = score == null ? null : Number(score);

  return (
    <div
      dir="ltr"
      className="flex shrink-0 items-center gap-[2px]"
      aria-label={
        value == null
          ? "لم يتم التقييم"
          : `التقييم ${value} من 5`
      }
    >
      {[1, 2, 3, 4, 5].map((number) => (
        <Star
          key={number}
          size={17}
          strokeWidth={1.8}
          className={
            value == null
              ? "text-[#CBD5E1]"
              : "text-[#F59E0B]"
          }
          fill={
            value != null && number <= value
              ? "#F59E0B"
              : "transparent"
          }
        />
      ))}
    </div>
  );
}

// =====================================================
// SCORE ITEM
// =====================================================

function ScoreItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="m-0 text-[11px] text-[#64748B]">
        {label}
      </p>

      <p className="m-0 mt-2 text-[12px] font-semibold text-[#111C2D]">
        {value != null
          ? `${formatScore(value, 1)} من 5`
          : "لم يتم التقييم"}
      </p>
    </div>
  );
}

// =====================================================
// PAGE LAYOUT
// =====================================================

function PageShell({ navigate, children }) {
  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-admin-sidebar")
    );
  };

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D] print:h-auto print:overflow-visible"
    >
      <div className="print:hidden">
        <Sidebar />
      </div>

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden print:h-auto print:overflow-visible">
        {/* HEADER */}
        <AdminHeader />

        {/* MAIN */}
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-8 print:overflow-visible">
          <div className="mx-auto w-full max-w-[1450px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// =====================================================
// FOOTER
// =====================================================


