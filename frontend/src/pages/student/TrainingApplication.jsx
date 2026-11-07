import { ACADEMIC_PROGRAMS } from "../../constants/academicPrograms";
import { getApplicationDraft, saveApplicationDraft } from "./studentApplicationDraft";
import AcademicFooter from "../../components/shared/AcademicFooter";
import { useState } from "react";
import { getCurrentUser } from "../../api/auth";
import { fetchApplyEligibility, fetchProfile } from "../../api/student";
import { useApi } from "../../api/useApi";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardList,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

export default function TrainingApplication() {
  const navigate = useNavigate();

  /* =========================================================
     FORM DATA
  ========================================================= */

  const currentStudentId = String(getCurrentUser()?.username || "");
  const studentEligibility = useApi(fetchApplyEligibility, [], { canApply: true, reason: "" }).data
    || { canApply: false, reason: "" };
  const profile = useApi(fetchProfile, []).data;
  const draft = getApplicationDraft();
  const hasDraft = Boolean(draft && String(draft.studentId) === currentStudentId);
  const [formData, setFormData] = useState(() => (hasDraft ? draft : {
    fullName: getCurrentUser()?.full_name || "",
    studentId: currentStudentId,
    major: "",
    academicYear: "السنة الثالثة (مستوفية للشروط)",
    phone: "",
    email: "",
    motivation: "",
  }));

  // Fill the read-only details from the student's record once it loads.
  const [prefilled, setPrefilled] = useState(false);
  if (profile && !hasDraft && !prefilled) {
    setPrefilled(true);
    setFormData(previous => ({
      ...previous,
      fullName: profile.full_name || previous.fullName,
      major: profile.specialization_name || profile.department_name || previous.major,
      phone: previous.phone || profile.phone || "",
      email: previous.email || profile.email || "",
    }));
  }

  const [errors, setErrors] = useState({});

  const maxMotivationLength = 500;

  /* =========================================================
     STEPS
  ========================================================= */

  const steps = [
    {
      number: 1,
      title: "البيانات الأساسية",
      subtitle: "الخطوة الحالية",
      active: true,
    },
    {
      number: 2,
      title: "المستندات",
      subtitle: "المرفقات والشهادات",
      active: false,
    },
    {
      number: 3,
      title: "تأكيد الطلب",
      subtitle: "المراجعة والإرسال",
      active: false,
    },
  ];

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (
      name === "motivation" &&
      value.length > maxMotivationLength
    ) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.major.trim()) {
      newErrors.major =
        "يرجى اختيار التخصص الدراسي";
    }

    if (!formData.academicYear.trim()) {
      newErrors.academicYear =
        "يرجى اختيار السنة الدراسية";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "رقم الهاتف مطلوب";
    } else if (!/^05\d{8}$/.test(formData.phone)) {
      newErrors.phone =
        "يرجى إدخال رقم هاتف صحيح";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "البريد الإلكتروني مطلوب";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "يرجى إدخال بريد إلكتروني صحيح";
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation =
        "يرجى كتابة سبب التقديم";
    } else if (
      formData.motivation.trim().length < 20
    ) {
      newErrors.motivation =
        "يرجى كتابة سبب أوضح للتقديم";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================================================
     NEXT
  ========================================================= */

  const handleNext = () => {
    if (!studentEligibility.canApply) {
      setErrors({ form: studentEligibility.reason });
      return;
    }
    if (String(formData.studentId) !== currentStudentId) {
      setErrors({ form: 'الرقم الجامعي لا يطابق حساب الطالب الحالي. سجّل الدخول مجددًا.' });
      return;
    }
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    saveApplicationDraft(formData);
    navigate(
      "/student/apply-training/documents"
    );
  };

  /* =========================================================
     CANCEL
  ========================================================= */

  const handleCancel = () => {
    navigate(
      "/student/opportunities/details"
    );
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
      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <Sidebar />

      {/* =====================================================
          MAIN AREA
      ====================================================== */}
      <div
        className="
          flex
          h-dvh
          min-w-0
          flex-1
          flex-col
          overflow-hidden
          bg-[#F8FAFC]
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="relative shrink-0">
          <Header />
        </div>

        {/* =====================================================
            SCROLLABLE CONTENT
        ====================================================== */}
        <main
          className="
            min-h-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            bg-[#F8FAFC]

            px-4
            pb-8
            pt-5

            sm:px-5
            sm:pt-6

            md:px-6
            md:pt-7

            xl:px-[40px]
            xl:pb-[40px]
            xl:pt-[14px]
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1080px]
            "
          >
            {/* =================================================
                BREADCRUMB
            ================================================== */}
            <nav
              aria-label="مسار التنقل"
              className="
                mb-2
                flex
                flex-wrap
                items-center
                gap-[7px]
                text-[11px]
                font-medium

                sm:text-[12px]

                xl:mb-[5px]
                xl:text-[13px]
              "
            >
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/student/dashboard"
                  )
                }
                className="
                  cursor-pointer
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

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/student/opportunities"
                  )
                }
                className="
                  cursor-pointer
                  border-0
                  bg-transparent
                  p-0
                  text-[#64748B]
                  transition

                  hover:text-[#09379A]
                "
              >
                فرص التدريب
              </button>

              <span className="text-[#94A3B8]">
                ›
              </span>

              <span
                className="
                  font-bold
                  text-[#09379A]
                "
              >
                استمارة التقديم على التدريب
              </span>
            </nav>

            {/* =================================================
                PAGE TITLE
            ================================================== */}
            <section
              className="
                flex
                flex-col
                items-start
                justify-between
                gap-3

                sm:flex-row
                sm:gap-5
              "
            >
              <div
                className="
                  min-w-0
                  text-right
                "
              >
                <h1
                  className="
                    m-0
                    text-[23px]
                    font-bold
                    leading-[34px]
                    text-[#14213D]

                    sm:text-[25px]

                    xl:text-[28px]
                    xl:leading-[40px]
                  "
                >
                  استمارة التقديم على التدريب
                </h1>

                <p
                  className="
                    m-0
                    mt-[3px]
                    text-[12px]
                    font-normal
                    leading-[21px]
                    text-[#64748B]

                    sm:text-[13px]

                    xl:mt-[4px]
                    xl:text-[14px]
                    xl:leading-[22px]
                  "
                >
                  يرجى تعبئة البيانات التالية
                  للتقديم على فرصة التدريب
                  الميداني
                </p>
              </div>

              {/* ACADEMIC TERM */}
              <div
                className="
                  flex
                  min-h-[28px]
                  max-w-full
                  items-center
                  gap-[6px]
                  rounded-[14px]
                  border
                  border-[#B8D0FF]
                  bg-[#EFF5FF]
                  px-[10px]
                  text-[9px]
                  font-bold
                  leading-[16px]
                  text-[#09379A]

                  sm:shrink-0
                  sm:px-[12px]
                  sm:text-[10px]

                  xl:text-[11px]
                "
              >
                <span
                  className="
                    h-[7px]
                    w-[7px]
                    shrink-0
                    rounded-full
                    bg-[#2563EB]
                  "
                />

                <span>
                  التقديم الأكاديمي المباشر -
                  الفصل الدراسي الثاني
                  2024/2025
                </span>
              </div>
            </section>

            {!studentEligibility.canApply && (
              <p role="alert" className="my-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-[13px] leading-7 text-amber-900">{studentEligibility.reason}</p>
            )}
            {errors.form && <p role="alert" className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">{errors.form}</p>}
            {/* =================================================
                STEPPER
            ================================================== */}
            <section
              className="
                mt-7

                sm:mt-8

                xl:mt-[38px]
              "
            >
              <div className="relative">
                {/* CONNECTING LINE */}
                <div
                  className="
                    absolute
                    left-[16%]
                    right-[16%]
                    top-[16px]
                    h-[3px]
                    rounded-full
                    bg-[#E2E8F0]

                    sm:left-[17%]
                    sm:right-[17%]
                    sm:top-[18px]

                    xl:top-[19px]
                    xl:h-[4px]
                  "
                />

                <div
                  className="
                    relative
                    grid
                    grid-cols-3
                    items-start
                  "
                >
                  {steps.map((step) => (
                    <div
                      key={step.number}
                      className="
                        flex
                        min-w-0
                        flex-col
                        items-center
                        text-center
                      "
                    >
                      {/* STEP CIRCLE */}
                      <div
                        className={`
                          relative
                          z-10
                          flex
                          h-[34px]
                          w-[34px]
                          items-center
                          justify-center
                          rounded-full
                          border-[2px]
                          text-[12px]
                          font-bold
                          transition-all

                          sm:h-[38px]
                          sm:w-[38px]
                          sm:text-[13px]

                          xl:h-[40px]
                          xl:w-[40px]
                          xl:text-[14px]

                          ${
                            step.active
                              ? `
                                border-[#C8D9FF]
                                bg-[#09379A]
                                text-white
                                shadow-[0_0_0_4px_#EAF1FF]
                              `
                              : `
                                border-[#CBD5E1]
                                bg-white
                                text-[#94A3B8]
                              `
                          }
                        `}
                      >
                        {step.number}
                      </div>

                      {/* STEP TITLE */}
                      <h3
                        className={`
                          m-0
                          mt-[8px]
                          text-[10px]
                          font-bold
                          leading-[16px]

                          sm:text-[11px]
                          sm:leading-[18px]

                          xl:text-[13px]
                          xl:leading-[20px]

                          ${
                            step.active
                              ? "text-[#09379A]"
                              : "text-[#64748B]"
                          }
                        `}
                      >
                        {step.title}
                      </h3>

                      {/* ACTIVE BADGE */}
                      {step.active ? (
                        <span
                          className="
                            mt-[3px]
                            inline-flex
                            min-h-[18px]
                            items-center
                            justify-center
                            rounded-[4px]
                            bg-[#EAF1FF]
                            px-[7px]
                            text-[8px]
                            font-bold
                            leading-[14px]
                            text-[#09379A]

                            sm:text-[9px]

                            xl:text-[10px]
                            xl:leading-[15px]
                          "
                        >
                          {step.subtitle}
                        </span>
                      ) : (
                        <span
                          className="
                            mt-[2px]
                            hidden
                            text-[8px]
                            font-normal
                            leading-[13px]
                            text-[#AAB4C3]

                            sm:block
                            sm:text-[9px]

                            xl:text-[10px]
                            xl:leading-[15px]
                          "
                        >
                          {step.subtitle}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* =================================================
                MAIN FORM CARD
            ================================================== */}
            <section
              className="
                mt-4
                w-full
                rounded-[14px]
                border
                border-[#DDE5EF]
                bg-white
                p-4
                shadow-[0_1px_2px_rgba(15,23,42,0.03)]

                sm:p-5

                xl:mt-[14px]
                xl:px-[28px]
                xl:py-[26px]
              "
            >
              {/* =================================================
                  CARD HEADER
              ================================================== */}
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  border-b
                  border-[#E2E8F0]
                  pb-4

                  sm:flex-row
                  sm:items-start
                  sm:justify-between
                  sm:gap-5

                  xl:pb-[20px]
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-[10px]
                  "
                >
                  <div
                    className="
                      flex
                      h-[36px]
                      w-[36px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-[8px]
                      bg-[#EEF3FF]
                      text-[#09379A]

                      xl:h-[38px]
                      xl:w-[38px]
                    "
                  >
                    <ClipboardList
                      size={20}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div>
                    <h2
                      className="
                        m-0
                        text-[16px]
                        font-bold
                        leading-[24px]
                        text-[#1E293B]

                        xl:text-[18px]
                        xl:leading-[26px]
                      "
                    >
                      البيانات الأساسية
                    </h2>

                    <p
                      className="
                        m-0
                        mt-[2px]
                        text-[10px]
                        leading-[17px]
                        text-[#64748B]

                        xl:text-[11px]
                        xl:leading-[18px]
                      "
                    >
                      البيانات المسترجعة من
                      عمادة القبول والتسجيل مع
                      التحقق الميداني
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    min-h-[28px]
                    w-fit
                    items-center
                    gap-[6px]
                    rounded-[14px]
                    border
                    border-[#E2E8F0]
                    bg-[#F8FAFC]
                    px-[10px]
                    text-[9px]
                    text-[#64748B]

                    xl:text-[10px]
                  "
                >
                  <LockKeyhole
                    size={13}
                    strokeWidth={1.7}
                  />

                  الحقول الموثقة مسترجعة
                  تلقائيا
                </div>
              </div>

              {/* =================================================
                  FORM GRID
              ================================================== */}
              <div
                className="
                  mt-5
                  grid
                  grid-cols-1
                  gap-x-6
                  gap-y-5

                  md:grid-cols-2

                  xl:mt-[24px]
                  xl:gap-y-[22px]
                "
              >
                {/* FULL NAME */}
                <div>
                  <div
                    className="
                      mb-[6px]
                      flex
                      items-center
                      justify-between
                      gap-2
                    "
                  >
                    <label
                      className="
                        text-[11px]
                        font-bold
                        text-[#334155]

                        xl:text-[12px]
                      "
                    >
                      الاسم الرباعي
                    </label>

                    <span
                      className="
                        flex
                        h-[22px]
                        items-center
                        gap-[4px]
                        rounded-[6px]
                        bg-[#E7F8EE]
                        px-[8px]
                        text-[9px]
                        font-medium
                        text-[#16844C]

                        xl:text-[10px]
                      "
                    >
                      <Check size={12} />
                      موثق
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      h-[42px]
                      items-center
                      rounded-[7px]
                      border
                      border-[#D9E2EC]
                      bg-[#F8FAFC]
                      px-[12px]
                    "
                  >
                    <UserRound
                      size={16}
                      className="
                        ml-[9px]
                        shrink-0
                        text-[#94A3B8]
                      "
                    />

                    <input
                      type="text"
                      value={formData.fullName}
                      readOnly
                      className="
                        h-full
                        min-w-0
                        w-full
                        border-0
                        bg-transparent
                        font-['Cairo']
                        text-[11px]
                        font-medium
                        text-[#475569]
                        outline-none

                        xl:text-[12px]
                      "
                    />
                  </div>

                  <p
                    className="
                      m-0
                      mt-[5px]
                      text-[8px]
                      leading-[14px]
                      text-[#94A3B8]

                      xl:text-[9px]
                      xl:leading-[15px]
                    "
                  >
                    تم التحقق من تطابق الاسم مع
                    السجل المدني الأكاديمي
                  </p>
                </div>

                {/* STUDENT ID */}
                <div>
                  <div
                    className="
                      mb-[6px]
                      flex
                      items-center
                      justify-between
                      gap-2
                    "
                  >
                    <label
                      className="
                        text-[11px]
                        font-bold
                        text-[#334155]

                        xl:text-[12px]
                      "
                    >
                      رقم الطالب
                    </label>

                    <span
                      className="
                        flex
                        h-[22px]
                        items-center
                        gap-[4px]
                        rounded-[6px]
                        bg-[#F1F5F9]
                        px-[8px]
                        text-[9px]
                        text-[#64748B]

                        xl:text-[10px]
                      "
                    >
                      <LockKeyhole size={11} />
                      بيان رسمي
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      h-[42px]
                      items-center
                      rounded-[7px]
                      border
                      border-[#D9E2EC]
                      bg-[#F8FAFC]
                      px-[12px]
                    "
                  >
                    <span
                      className="
                        ml-[8px]
                        font-bold
                        text-[#94A3B8]
                      "
                    >
                      #
                    </span>

                    <input
                      type="text"
                      value={formData.studentId}
                      readOnly
                      dir="ltr"
                      className="
                        h-full
                        min-w-0
                        w-full
                        border-0
                        bg-transparent
                        text-right
                        font-['Cairo']
                        text-[11px]
                        font-bold
                        text-[#475569]
                        outline-none

                        xl:text-[12px]
                      "
                    />
                  </div>

                  <p
                    className="
                      m-0
                      mt-[5px]
                      text-[8px]
                      leading-[14px]
                      text-[#94A3B8]

                      xl:text-[9px]
                      xl:leading-[15px]
                    "
                  >
                    الرقم الجامعي المعتمد لدى
                    كلية الدراسات المتوسطة.
                  </p>
                </div>

                {/* MAJOR */}
                <div>
                  <label
                    className="
                      mb-[6px]
                      block
                      text-[11px]
                      font-bold
                      text-[#334155]

                      xl:text-[12px]
                    "
                  >
                    التخصص الدراسي
                    <span className="text-[#DC2626]">
                      {" "}
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <select
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      aria-invalid={
                        Boolean(errors.major)
                      }
                      className={`
                        h-[42px]
                        w-full
                        appearance-none
                        rounded-[7px]
                        border
                        bg-white
                        px-[12px]
                        pl-[36px]
                        font-['Cairo']
                        text-[11px]
                        text-[#334155]
                        outline-none
                        transition

                        xl:text-[12px]

                        ${
                          errors.major
                            ? `
                              border-[#DC2626]
                              ring-2
                              ring-[#DC2626]/10
                            `
                            : `
                              border-[#D9E2EC]
                              focus:border-[#09379A]
                              focus:ring-2
                              focus:ring-[#09379A]/10
                            `
                        }
                      `}
                    >
                      {ACADEMIC_PROGRAMS.map((program) => (
                        <option key={program} value={program}>
                          {program}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={16}
                      className="
                        pointer-events-none
                        absolute
                        left-[12px]
                        top-1/2
                        -translate-y-1/2
                        text-[#64748B]
                      "
                    />
                  </div>

                  {errors.major ? (
                    <FieldError>
                      {errors.major}
                    </FieldError>
                  ) : (
                    <FieldHint>
                      التخصص المسجل في الخطة
                      التدريبية المعتمدة
                    </FieldHint>
                  )}
                </div>

                {/* PHONE */}
                <div>
                  <label
                    className="
                      mb-[6px]
                      block
                      text-[11px]
                      font-bold
                      text-[#334155]

                      xl:text-[12px]
                    "
                  >
                    رقم الهاتف للتواصل
                    <span className="text-[#DC2626]">
                      {" "}
                      *
                    </span>
                  </label>

                  <div
                    className={`
                      flex
                      h-[42px]
                      items-center
                      rounded-[7px]
                      border
                      bg-white
                      px-[12px]
                      transition

                      ${
                        errors.phone
                          ? `
                            border-[#DC2626]
                            ring-2
                            ring-[#DC2626]/10
                          `
                          : `
                            border-[#D9E2EC]
                            focus-within:border-[#09379A]
                            focus-within:ring-2
                            focus-within:ring-[#09379A]/10
                          `
                      }
                    `}
                  >
                    <Phone
                      size={16}
                      className="
                        ml-[9px]
                        shrink-0
                        text-[#94A3B8]
                      "
                    />

                    <input
                      type="tel"
                      name="phone"
                      inputMode="numeric"
                      value={formData.phone}
                      onChange={handleChange}
                      dir="ltr"
                      aria-invalid={
                        Boolean(errors.phone)
                      }
                      className="
                        h-full
                        min-w-0
                        w-full
                        border-0
                        bg-transparent
                        text-right
                        font-['Cairo']
                        text-[11px]
                        text-[#334155]
                        outline-none

                        xl:text-[12px]
                      "
                    />
                  </div>

                  {errors.phone ? (
                    <FieldError>
                      {errors.phone}
                    </FieldError>
                  ) : (
                    <FieldHint>
                      سيتم إرسال إشعار الترشيح
                      والتعليمات عبر رسائل SMS.
                    </FieldHint>
                  )}
                </div>

                {/* ACADEMIC YEAR */}
                <div>
                  <label
                    className="
                      mb-[6px]
                      block
                      text-[11px]
                      font-bold
                      text-[#334155]

                      xl:text-[12px]
                    "
                  >
                    السنة الدراسية
                    <span className="text-[#DC2626]">
                      {" "}
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <select
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleChange}
                      aria-invalid={
                        Boolean(
                          errors.academicYear
                        )
                      }
                      className={`
                        h-[42px]
                        w-full
                        appearance-none
                        rounded-[7px]
                        border
                        bg-white
                        px-[12px]
                        pl-[36px]
                        font-['Cairo']
                        text-[11px]
                        text-[#334155]
                        outline-none
                        transition

                        xl:text-[12px]

                        ${
                          errors.academicYear
                            ? `
                              border-[#DC2626]
                              ring-2
                              ring-[#DC2626]/10
                            `
                            : `
                              border-[#D9E2EC]
                              focus:border-[#09379A]
                              focus:ring-2
                              focus:ring-[#09379A]/10
                            `
                        }
                      `}
                    >
                      <option value="السنة الثالثة (مستوفية للشروط)">
                        السنة الثالثة
                        (مستوفية للشروط)
                      </option>

                      <option value="السنة الثانية">
                        السنة الثانية
                      </option>

                      <option value="السنة الرابعة">
                        السنة الرابعة
                      </option>
                    </select>

                    <ChevronDown
                      size={16}
                      className="
                        pointer-events-none
                        absolute
                        left-[12px]
                        top-1/2
                        -translate-y-1/2
                        text-[#64748B]
                      "
                    />
                  </div>

                  {errors.academicYear ? (
                    <FieldError>
                      {errors.academicYear}
                    </FieldError>
                  ) : (
                    <FieldHint>
                      يشترط إنهاء ما لا يقل عن
                      60 ساعة معتمدة للتدريب.
                    </FieldHint>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    className="
                      mb-[6px]
                      block
                      text-[11px]
                      font-bold
                      text-[#334155]

                      xl:text-[12px]
                    "
                  >
                    البريد الإلكتروني
                    <span className="text-[#DC2626]">
                      {" "}
                      *
                    </span>
                  </label>

                  <div
                    className={`
                      flex
                      h-[42px]
                      items-center
                      rounded-[7px]
                      border
                      bg-white
                      px-[12px]
                      transition

                      ${
                        errors.email
                          ? `
                            border-[#DC2626]
                            ring-2
                            ring-[#DC2626]/10
                          `
                          : `
                            border-[#D9E2EC]
                            focus-within:border-[#09379A]
                            focus-within:ring-2
                            focus-within:ring-[#09379A]/10
                          `
                      }
                    `}
                  >
                    <Mail
                      size={16}
                      className="
                        ml-[9px]
                        shrink-0
                        text-[#94A3B8]
                      "
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      dir="ltr"
                      aria-invalid={
                        Boolean(errors.email)
                      }
                      className="
                        h-full
                        min-w-0
                        w-full
                        border-0
                        bg-transparent
                        text-right
                        font-['Cairo']
                        text-[11px]
                        text-[#334155]
                        outline-none

                        xl:text-[12px]
                      "
                    />
                  </div>

                  {errors.email ? (
                    <FieldError>
                      {errors.email}
                    </FieldError>
                  ) : (
                    <FieldHint>
                      لتلقي خطابات التنسيب
                      الأكاديمي والتحديثات
                      الرسمية.
                    </FieldHint>
                  )}
                </div>
              </div>

              {/* =================================================
                  MOTIVATION
              ================================================== */}
              <div
                className="
                  mt-5

                  xl:mt-[24px]
                "
              >
                <label
                  className="
                    mb-[6px]
                    block
                    text-[11px]
                    font-bold
                    text-[#334155]

                    xl:text-[12px]
                  "
                >
                  سبب التقديم والهدف من التدريب
                  <span className="text-[#DC2626]">
                    {" "}
                    *
                  </span>
                </label>

                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  rows={4}
                  aria-invalid={
                    Boolean(
                      errors.motivation
                    )
                  }
                  className={`
                    min-h-[96px]
                    w-full
                    resize-none
                    rounded-[7px]
                    border
                    bg-white
                    px-[14px]
                    py-[11px]
                    font-['Cairo']
                    text-[11px]
                    leading-[21px]
                    text-[#334155]
                    outline-none
                    transition

                    xl:min-h-[82px]
                    xl:text-[12px]
                    xl:leading-[22px]

                    ${
                      errors.motivation
                        ? `
                          border-[#DC2626]
                          ring-2
                          ring-[#DC2626]/10
                        `
                        : `
                          border-[#D9E2EC]
                          focus:border-[#09379A]
                          focus:ring-2
                          focus:ring-[#09379A]/10
                        `
                    }
                  `}
                />

                <div
                  className="
                    mt-[5px]
                    flex
                    items-center
                    justify-between
                    gap-2
                  "
                >
                  {errors.motivation ? (
                    <FieldError noMargin>
                      {errors.motivation}
                    </FieldError>
                  ) : (
                    <span />
                  )}

                  <span
                    dir="ltr"
                    className="
                      shrink-0
                      text-[8px]
                      text-[#94A3B8]

                      xl:text-[9px]
                    "
                  >
                    {
                      formData.motivation
                        .length
                    }{" "}
                    / {maxMotivationLength} حرف
                  </span>
                </div>
              </div>

              {/* =================================================
                  ACTIONS
              ================================================== */}
              <div
                className="
                  mt-5
                  flex
                  flex-col
                  gap-3
                  border-t
                  border-[#E2E8F0]
                  pt-4

                  sm:flex-row
                  sm:items-center
                  sm:justify-between

                  xl:mt-[22px]
                  xl:gap-[16px]
                  xl:pt-[20px]
                "
              >
                {/* NEXT */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="
                    order-1
                    flex
                    h-[44px]
                    w-full
                    cursor-pointer
                    items-center
                    justify-center
                    gap-[8px]
                    rounded-[8px]
                    border-0
                    bg-[#09379A]
                    px-[18px]
                    text-[12px]
                    font-bold
                    text-white
                    shadow-[0_3px_7px_rgba(9,55,154,0.18)]
                    transition

                    hover:bg-[#072E81]

                    active:scale-[0.995]

                    focus-visible:outline-none
                    focus-visible:ring-4
                    focus-visible:ring-[#09379A]/15

                    sm:w-auto
                    sm:min-w-[180px]

                    xl:text-[13px]
                  "
                >
                  <span>
                    التالي: رفع المستندات
                  </span>

                  <ArrowLeft
                    size={17}
                    strokeWidth={1.8}
                  />
                </button>

                {/* CANCEL */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="
                    order-2
                    flex
                    h-[40px]
                    w-full
                    cursor-pointer
                    items-center
                    justify-center
                    gap-[7px]
                    rounded-[7px]
                    border
                    border-[#B9D0FF]
                    bg-white
                    px-[15px]
                    text-[11px]
                    font-bold
                    text-[#2563EB]
                    transition

                    hover:bg-[#F5F8FF]

                    focus-visible:outline-none
                    focus-visible:ring-4
                    focus-visible:ring-[#2563EB]/10

                    sm:w-auto

                    xl:h-[38px]
                    xl:text-[12px]
                  "
                >
                  <span>
                    إلغاء والعودة للفرصة
                  </span>

                  <ArrowRight
                    size={15}
                    strokeWidth={1.8}
                  />
                </button>
              </div>
            </section>
          </div>
        
            <AcademicFooter audience="student" />
          </main>
      </div>
    </div>
  );
}

/* =========================================================
   FIELD ERROR
========================================================= */

function FieldError({
  children,
  noMargin = false,
}) {
  return (
    <p
      role="alert"
      className={`
        m-0
        text-[8px]
        leading-[14px]
        text-[#DC2626]

        xl:text-[9px]
        xl:leading-[15px]

        ${noMargin ? "" : "mt-[5px]"}
      `}
    >
      {children}
    </p>
  );
}

/* =========================================================
   FIELD HINT
========================================================= */

function FieldHint({
  children,
}) {
  return (
    <p
      className="
        m-0
        mt-[5px]
        text-[8px]
        leading-[14px]
        text-[#94A3B8]

        xl:text-[9px]
        xl:leading-[15px]
      "
    >
      {children}
    </p>
  );
}