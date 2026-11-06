import AcademicFooter from "../../components/shared/AcademicFooter";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  GraduationCap,
  Pencil,
  ShieldCheck,
  Star,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

const trainingSummary = {
  organization: "شركة القدس للاتصالات والتكنولوجيا",
  period: "2025/10/01 - 2025/12/01",
  hours: 120,
  finalEvaluation: 4.5,
  academicSupervisor: "د. محمد السالم",
  fieldSupervisor: "م. رامي أحمد",
  semester: "دبلوم خريف 2025",
};

const steps = [
  {
    id: "review",
    title: "مراجعة الملفات",
    subtitle: "مكتمل",
  },
  {
    id: "confirmation",
    title: "التأكيد النهائي",
    subtitle: "الخطوة الحالية",
  },
  {
    id: "certificate",
    title: "إصدار الشهادة",
    subtitle: "قيد الانتظار",
  },
];

export default function FinishTraining() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] =
    useState("confirmation");

  const [showConfirmModal, setShowConfirmModal] =
    useState(false);

  const handleFinalConfirmation = () => {
    setShowConfirmModal(false);
    setCurrentStep("certificate");
  };

  const handleViewApplication = () => {
    navigate("/student/applications");
  };

  return (
    <div
      dir="rtl"
      className="
        flex
        h-dvh
        w-full
        overflow-hidden
        bg-[#F8FAFC]
        font-['Cairo']
        text-[#1E293B]
      "
    >
      {/* SIDEBAR */}

      <div className="shrink-0">
        <Sidebar />
      </div>

      {/* MAIN AREA */}

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
          overflow-hidden
          bg-[#F8FAFC]
        "
      >
        {/* HEADER */}

        <div className="shrink-0">
          <Header />
        </div>

        {/* SCROLLABLE CONTENT */}

        <main
          className="
            min-h-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            px-4
            pb-8
            pt-5
            sm:px-5
            md:px-6
            xl:px-10
            xl:pt-[18px]
          "
        >
          <div className="mx-auto w-full max-w-[1080px]">

            {/* BREADCRUMB */}

            <nav
              aria-label="مسار التنقل"
              className="
                flex
                items-center
                gap-[7px]
                text-[12px]
                leading-5
                sm:text-[13px]
              "
            >
              <button
                type="button"
                onClick={() =>
                  navigate("/student/dashboard")
                }
                className="
                  border-0
                  bg-transparent
                  p-0
                  text-[#64748B]
                  transition
                  hover:text-[#09379A]
                "
              >
                الرئيسية
              </button>

              <span className="text-[#94A3B8]">
                ›
              </span>

              <span className="font-bold text-[#09379A]">
                إنهاء التدريب
              </span>
            </nav>

            {/* PAGE HEADER */}

            <section
              className="
                mt-2
                flex
                flex-col
                gap-4
                lg:flex-row
                lg:items-start
                lg:justify-between
              "
            >
              <div className="min-w-0">
                <h1
                  className="
                    m-0
                    text-[25px]
                    font-bold
                    leading-[1.5]
                    text-[#14213D]
                    sm:text-[28px]
                    xl:text-[30px]
                  "
                >
                  إنهاء التدريب
                </h1>

                <p
                  className="
                    m-0
                    mt-1
                    max-w-[650px]
                    text-[12px]
                    leading-6
                    text-[#64748B]
                    sm:text-[13px]
                  "
                >
                  الخطوة الإجرائية الختامية لإغلاق
                  السجل التدريبي وطلب الشهادة الرسمية.
                </p>
              </div>

              {/* HEADER ACTIONS */}

              <div
                className="
                  flex
                  w-full
                  flex-col
                  gap-2
                  sm:w-auto
                  sm:flex-row
                  sm:flex-wrap
                  sm:items-center
                "
              >
                <button
                  type="button"
                  onClick={handleViewApplication}
                  className="
                    inline-flex
                    min-h-[40px]
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-[#D9E2EC]
                    bg-white
                    px-4
                    text-[11px]
                    font-bold
                    text-[#475569]
                    transition
                    hover:bg-[#F8FAFC]
                    sm:text-[12px]
                  "
                >
                  معاينة حالة التقديم
                </button>

                <button
                  type="button"
                  onClick={handleViewApplication}
                  className="
                    inline-flex
                    min-h-[40px]
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-[#BFDBFE]
                    bg-[#F8FBFF]
                    px-4
                    text-[11px]
                    font-bold
                    text-[#09379A]
                    transition
                    hover:bg-[#EEF4FF]
                    sm:text-[12px]
                  "
                >
                  <Pencil size={14} />
                  تعديل أو إلغاء الطلب
                </button>
              </div>
            </section>

            {/* PROGRESS STEPPER */}

            <section
              className="
                mt-6
                rounded-[14px]
                border
                border-[#DDE5EF]
                bg-white
                px-4
                py-5
                shadow-[0_1px_2px_rgba(15,23,42,0.03)]
                sm:px-6
                sm:py-6
                md:px-8
              "
            >
              <div
                className="
                  grid
                  grid-cols-[minmax(0,1fr)_minmax(16px,0.7fr)_minmax(0,1fr)_minmax(16px,0.7fr)_minmax(0,1fr)]
                  items-start
                  gap-1
                  sm:gap-3
                "
              >
                <StepItem
                  status={
                    currentStep === "review"
                      ? "current"
                      : "done"
                  }
                  number={1}
                  title={steps[0].title}
                  subtitle={steps[0].subtitle}
                />

                <StepLine active />

                <StepItem
                  status={
                    currentStep === "confirmation"
                      ? "current"
                      : currentStep === "certificate"
                        ? "done"
                        : "upcoming"
                  }
                  number={2}
                  title={steps[1].title}
                  subtitle={
                    currentStep === "confirmation"
                      ? "الخطوة الحالية"
                      : "مكتمل"
                  }
                />

                <StepLine
                  active={
                    currentStep === "certificate"
                  }
                />

                <StepItem
                  status={
                    currentStep === "certificate"
                      ? "current"
                      : "upcoming"
                  }
                  number={3}
                  title={steps[2].title}
                  subtitle={
                    currentStep === "certificate"
                      ? "قيد المعالجة"
                      : "قيد الانتظار"
                  }
                />
              </div>
            </section>

            {/* COMPLETION STATUS */}

            <section
              className="
                mt-6
                rounded-[14px]
                border
                border-[#DDE5EF]
                bg-white
                px-4
                py-7
                text-center
                shadow-[0_1px_2px_rgba(15,23,42,0.03)]
                sm:px-6
                sm:py-8
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-[58px]
                  w-[58px]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#10B981]
                  text-white
                  ring-8
                  ring-[#F1FFF8]
                "
              >
                <Check
                  size={29}
                  strokeWidth={2.5}
                />
              </div>

              <h2
                className="
                  m-0
                  mt-6
                  text-[18px]
                  font-bold
                  leading-8
                  text-[#14213D]
                  sm:text-[21px]
                "
              >
                تم استكمال جميع متطلبات التدريب بنجاح
              </h2>

              <p
                className="
                  mx-auto
                  mb-0
                  mt-2
                  max-w-[720px]
                  text-[12px]
                  leading-6
                  text-[#64748B]
                  sm:text-[13px]
                "
              >
                يمكنك الآن إنهاء التدريب وإصدار الشهادة
                بعد اعتماد المشرف الأكاديمي والميداني.
              </p>

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-2
                  sm:gap-[10px]
                "
              >
                <CompletionBadge>
                  ساعات التدريب: 120/120 ساعة
                </CompletionBadge>

                <CompletionBadge>
                  التقييم الأكاديمي: معتمد
                </CompletionBadge>

                <CompletionBadge>
                  الفترة التدريبية: مكتملة بالكامل (10/10)
                </CompletionBadge>
              </div>
            </section>

            {/* TRAINING SUMMARY */}

            <section
              className="
                mt-6
                rounded-[14px]
                border
                border-[#DDE5EF]
                bg-white
                px-4
                py-5
                shadow-[0_1px_2px_rgba(15,23,42,0.03)]
                sm:px-5
                sm:py-6
              "
            >
              {/* SUMMARY HEADER */}

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  border-b
                  border-[#EEF2F7]
                  pb-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div className="flex items-center gap-2">
                  <div
                    className="
                      flex
                      h-[30px]
                      w-[30px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#EEF4FF]
                      text-[#09379A]
                    "
                  >
                    <FileText
                      size={16}
                      strokeWidth={1.8}
                    />
                  </div>

                  <h2
                    className="
                      m-0
                      text-[15px]
                      font-bold
                      text-[#1E293B]
                      sm:text-[16px]
                    "
                  >
                    ملخص التدريب المكتمل
                  </h2>
                </div>

                <span
                  className="
                    inline-flex
                    min-h-[25px]
                    w-fit
                    items-center
                    rounded-full
                    bg-[#EEF4FF]
                    px-3
                    text-[10px]
                    font-bold
                    text-[#09379A]
                    sm:text-[11px]
                  "
                >
                  {trainingSummary.semester}
                </span>
              </div>

              {/* SUMMARY GRID */}

              <div
                className="
                  mt-5
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                  sm:gap-[14px]
                "
              >
                <SummaryItem
                  icon={Building2}
                  label="جهة التدريب"
                  value={trainingSummary.organization}
                />

                <SummaryItem
                  icon={CalendarDays}
                  label="الفترة الزمنية"
                  value={trainingSummary.period}
                />

                <SummaryItem
                  icon={Clock3}
                  label="عدد الساعات المنجزة"
                  value={`${trainingSummary.hours} ساعة معتمدة`}
                />

                <SummaryItem
                  icon={Star}
                  label="التقييم النهائي التراكمي"
                  value={`${trainingSummary.finalEvaluation} / 5.0`}
                  badge="ممتاز"
                  accent="yellow"
                />
              </div>

              {/* SUPERVISORS */}

              <div
                className="
                  mt-4
                  grid
                  grid-cols-1
                  gap-3
                  border-t
                  border-[#EEF2F7]
                  pt-4
                  text-[11px]
                  leading-5
                  text-[#64748B]
                  sm:grid-cols-2
                  sm:gap-4
                  sm:text-[12px]
                "
              >
                <div className="flex items-start gap-2">
                  <ShieldCheck
                    size={15}
                    className="mt-0.5 shrink-0 text-[#09379A]"
                  />

                  <span>
                    المشرف الأكاديمي:
                    <strong className="mr-1 text-[#334155]">
                      {trainingSummary.academicSupervisor}
                    </strong>
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <Building2
                    size={15}
                    className="mt-0.5 shrink-0 text-[#64748B]"
                  />

                  <span>
                    مشرف جهة التدريب:
                    <strong className="mr-1 text-[#334155]">
                      {trainingSummary.fieldSupervisor}
                    </strong>
                  </span>
                </div>
              </div>
            </section>

            {/* FINAL ACTION */}

            {currentStep === "confirmation" && (
              <section
                className="
                  mt-6
                  flex
                  justify-stretch
                  sm:justify-end
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmModal(true)
                  }
                  className="
                    inline-flex
                    min-h-[46px]
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border-0
                    bg-[#09379A]
                    px-6
                    text-[12px]
                    font-bold
                    text-white
                    shadow-[0_3px_8px_rgba(9,55,154,0.16)]
                    transition
                    hover:bg-[#072E81]
                    sm:w-auto
                    sm:min-w-[210px]
                  "
                >
                  <CheckCircle2
                    size={17}
                    strokeWidth={2}
                  />

                  تأكيد إنهاء التدريب
                </button>
              </section>
            )}

            {/* CERTIFICATE PROCESSING */}

            {currentStep === "certificate" && (
              <section
                className="
                  mt-6
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-[#BFDBFE]
                  bg-[#F8FBFF]
                  px-4
                  py-4
                  sm:px-5
                "
              >
                <div
                  className="
                    flex
                    h-[38px]
                    w-[38px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#EEF4FF]
                    text-[#09379A]
                  "
                >
                  <GraduationCap size={20} />
                </div>

                <div className="min-w-0">
                  <h3
                    className="
                      m-0
                      text-[13px]
                      font-bold
                      text-[#09379A]
                      sm:text-[14px]
                    "
                  >
                    تم إنهاء التدريب بنجاح
                  </h3>

                  <p
                    className="
                      m-0
                      mt-1
                      text-[11px]
                      leading-5
                      text-[#64748B]
                      sm:text-[12px]
                    "
                  >
                    تم تحديث حالة الواجهة إلى مرحلة إصدار
                    الشهادة. في النظام الفعلي يجب ربط هذا
                    الإجراء بالخادم لإغلاق السجل وإرسال
                    طلب الإصدار.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/student/certificate")
                    }
                    className="
                      mt-3
                      inline-flex
                      min-h-[38px]
                      items-center
                      justify-center
                      rounded-lg
                      border-0
                      bg-[#09379A]
                      px-4
                      text-[11px]
                      font-bold
                      text-white
                      transition
                      hover:bg-[#072E81]
                      sm:text-[12px]
                    "
                  >
                    متابعة حالة الشهادة
                  </button>
                </div>
              </section>
            )}
          </div>
        
            <AcademicFooter audience="student" />
          </main>
      </div>

      {/* CONFIRMATION MODAL */}

      {showConfirmModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-[#0F172A]/40
            px-4
            py-6
            backdrop-blur-[2px]
          "
          onClick={() =>
            setShowConfirmModal(false)
          }
        >
          <div
            dir="rtl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="finish-training-dialog-title"
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              max-h-[90dvh]
              w-full
              max-w-[440px]
              overflow-y-auto
              rounded-2xl
              border
              border-[#E2E8F0]
              bg-white
              p-5
              shadow-[0_20px_60px_rgba(15,23,42,0.18)]
              sm:p-6
            "
          >
            <div
              className="
                flex
                h-[44px]
                w-[44px]
                items-center
                justify-center
                rounded-xl
                bg-[#EEF4FF]
                text-[#09379A]
              "
            >
              <FileCheck2 size={22} />
            </div>

            <h3
              id="finish-training-dialog-title"
              className="
                m-0
                mt-4
                text-[17px]
                font-bold
                text-[#1E293B]
              "
            >
              تأكيد إنهاء التدريب
            </h3>

            <p
              className="
                m-0
                mt-2
                text-[12px]
                leading-6
                text-[#64748B]
              "
            >
              بعد تأكيد إنهاء التدريب سيتم الانتقال
              إلى مرحلة إصدار الشهادة.
            </p>

            <div
              className="
                mt-4
                rounded-lg
                border
                border-[#F6D58A]
                bg-[#FFFBEB]
                px-3
                py-3
                text-[11px]
                leading-5
                text-[#92400E]
                sm:text-[12px]
              "
            >
              تأكد من صحة جميع البيانات والتقييمات قبل
              المتابعة، لأن بعض البيانات قد تصبح غير
              قابلة للتعديل بعد الإنهاء النهائي.
            </div>

            <div
              className="
                mt-5
                flex
                flex-col-reverse
                gap-2
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowConfirmModal(false)
                }
                className="
                  min-h-[42px]
                  rounded-lg
                  border
                  border-[#D9E2EC]
                  bg-white
                  px-5
                  text-[12px]
                  font-bold
                  text-[#475569]
                  transition
                  hover:bg-[#F8FAFC]
                  sm:min-w-[95px]
                "
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleFinalConfirmation}
                className="
                  inline-flex
                  min-h-[42px]
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border-0
                  bg-[#09379A]
                  px-5
                  text-[12px]
                  font-bold
                  text-white
                  transition
                  hover:bg-[#072E81]
                  sm:min-w-[145px]
                "
              >
                <Check
                  size={15}
                  strokeWidth={2}
                />

                تأكيد الإنهاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   STEP ITEM
===================================================== */

function StepItem({
  status,
  number,
  title,
  subtitle,
}) {
  const isDone = status === "done";
  const isCurrent = status === "current";

  return (
    <div
      className="
        flex
        min-w-0
        flex-col
        items-center
        text-center
      "
    >
      <div
        className={[
          "flex h-10 w-10 items-center justify-center rounded-full border-[4px] sm:h-11 sm:w-11",
          isDone
            ? "border-[#DDF9EE] bg-[#10B981] text-white"
            : isCurrent
              ? "border-[#E5ECFA] bg-[#09379A] text-white"
              : "border-[#EEF2F7] bg-[#F8FAFC] text-[#94A3B8]",
        ].join(" ")}
      >
        {isDone ? (
          <Check
            size={19}
            strokeWidth={2.3}
          />
        ) : (
          <span className="text-[11px] font-bold sm:text-[12px]">
            {number}
          </span>
        )}
      </div>

      <strong
        className={[
          "mt-2 max-w-full text-[10px] leading-5 sm:text-[11px] md:text-[12px]",
          isCurrent
            ? "text-[#09379A]"
            : isDone
              ? "text-[#1E293B]"
              : "text-[#94A3B8]",
        ].join(" ")}
      >
        {title}
      </strong>

      <span
        className={[
          "mt-0.5 text-[9px] leading-4 sm:text-[10px]",
          isDone
            ? "text-[#10B981]"
            : isCurrent
              ? "text-[#2563EB]"
              : "text-[#94A3B8]",
        ].join(" ")}
      >
        {subtitle}
      </span>
    </div>
  );
}

/* =====================================================
   STEP LINE
===================================================== */

function StepLine({ active = false }) {
  return (
    <div className="w-full pt-5 sm:pt-[21px]">
      <div
        className={[
          "h-[2px] w-full rounded-full",
          active
            ? "bg-[#10B981]"
            : "bg-[#E2E8F0]",
        ].join(" ")}
      />
    </div>
  );
}

/* =====================================================
   COMPLETION BADGE
===================================================== */

function CompletionBadge({ children }) {
  return (
    <div
      className="
        inline-flex
        min-h-[29px]
        max-w-full
        items-center
        gap-2
        rounded-full
        border
        border-[#B8EED5]
        bg-[#ECFDF5]
        px-3
        py-1
        text-[10px]
        font-bold
        leading-5
        text-[#047857]
        sm:text-[11px]
      "
    >
      <span
        className="
          h-1.5
          w-1.5
          shrink-0
          rounded-full
          bg-[#10B981]
        "
      />

      <span>{children}</span>
    </div>
  );
}

/* =====================================================
   SUMMARY ITEM
===================================================== */

function SummaryItem({
  icon: Icon,
  label,
  value,
  badge,
  accent,
}) {
  const isYellow = accent === "yellow";

  return (
    <div
      className="
        flex
        min-h-[72px]
        items-center
        justify-between
        gap-3
        rounded-[9px]
        border
        border-[#E7ECF2]
        bg-[#F8FAFC]
        px-3
        py-3
        sm:px-[14px]
      "
    >
      <div className="min-w-0 flex-1">
        <p
          className="
            m-0
            text-[10px]
            leading-5
            text-[#94A3B8]
            sm:text-[11px]
          "
        >
          {label}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <strong
            className="
              break-words
              text-[11px]
              leading-5
              text-[#334155]
              sm:text-[12px]
            "
          >
            {value}
          </strong>

          {badge && (
            <span
              className="
                inline-flex
                min-h-5
                items-center
                rounded-md
                bg-[#E9FFF4]
                px-2
                text-[10px]
                font-bold
                text-[#16A34A]
              "
            >
              {badge}
            </span>
          )}
        </div>
      </div>

      <div
        className={[
          "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg",
          isYellow
            ? "bg-[#FFF8E6] text-[#F59E0B]"
            : "bg-[#EEF4FF] text-[#09379A]",
        ].join(" ")}
      >
        <Icon
          size={16}
          strokeWidth={1.8}
          fill={isYellow ? "#F59E0B" : "none"}
        />
      </div>
    </div>
  );
}