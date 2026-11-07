import { getSelectedOpportunity } from "./studentApplicationDraft";
import { useApi } from "../../api/useApi";
import { fetchApplyEligibility, fetchOpportunity } from "../../api/student";
import AcademicFooter from "../../components/shared/AcademicFooter";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
  Send,
  UserRound,
  Users,
  Award,
  XCircle,
  SlidersHorizontal,
  Info,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

export default function TrainingDetails() {
  const navigate = useNavigate();
  const selectedId = getSelectedOpportunity();
  const selectedOpportunity = useApi(() => (selectedId ? fetchOpportunity(selectedId) : null), [selectedId]).data;
  const trainingEligibility = useApi(fetchApplyEligibility, [], { canApply: false, reason: "", application: null }).data
    || { canApply: false, reason: "", application: null };
  const alreadyApplied = Boolean(
    trainingEligibility.application?.preferences?.some(p => String(p.opportunity) === String(selectedOpportunity?.id)),
  );


  /*
    حالات التقديم:

    available = التقديم متاح
    applied   = تم التقديم مسبقاً
    closed    = انتهى موعد التقديم
  */

  const [applicationStatus, setApplicationStatus] =
    useState("available");

  const requirements = selectedOpportunity?.requirements?.length
    ? selectedOpportunity.requirements
    : ["يرجى مراجعة متطلبات القبول لدى جهة التدريب."];
  const skills = selectedOpportunity?.skills?.length
    ? selectedOpportunity.skills
    : ["تحدد المهارات المطلوبة وفق تفاصيل الفرصة."];
  const formatDate = (value) => {
    if (!value) return "غير محدد";
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat("ar", { day: "numeric", month: "long", year: "numeric" }).format(date);
  };
  const organizationName = selectedOpportunity?.organizationName || "جهة التدريب";
  const organizationLocation = selectedOpportunity?.organizationLocation || selectedOpportunity?.location || "غير محدد";
  const organizationDescription = selectedOpportunity?.organizationDescription ||
    "لا تتوفر نبذة تعريفية عن جهة التدريب حاليًا.";


  const applicationState = {
    available: {
      text: "التقديم على التدريب",
      disabled: false,
      icon: Send,
      className: `
        bg-[#09379A]
        text-white
        border-[#09379A]
        shadow-[0_3px_7px_rgba(9,55,154,0.20)]
        hover:bg-[#072E81]
      `,
    },

    applied: {
      text: "تم التقديم على التدريب",
      disabled: true,
      icon: CheckCircle2,
      className: `
        bg-[#ECFDF3]
        text-[#16A34A]
        border-[#BBE8C9]
        cursor-default
      `,
    },

    trainingBlocked: {
      text: "التقديم غير متاح أثناء التدريب",
      disabled: true,
      icon: XCircle,
      className: `bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0] cursor-not-allowed`,
    },
    closed: {
      text: "انتهى موعد التقديم",
      disabled: true,
      icon: XCircle,
      className: `
        bg-[#F8FAFC]
        text-[#94A3B8]
        border-[#E2E8F0]
        cursor-not-allowed
      `,
    },
  };

  const currentApplicationState =
    (!trainingEligibility.canApply ? applicationState.trainingBlocked :
      alreadyApplied ? applicationState.applied : applicationState[applicationStatus]) ||
    applicationState.available;

  const ApplicationIcon =
    currentApplicationState.icon;

  const handleApply = () => {
    if (!trainingEligibility.canApply || applicationStatus !== "available" || alreadyApplied || !selectedOpportunity || selectedOpportunity.status !== 'published') {
      return;
    }

    navigate("/student/apply-training");
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
          <div className="mx-auto w-full max-w-[1080px]">
            {/* =================================================
                BREADCRUMB
            ================================================== */}
            <nav
              aria-label="مسار التنقل"
              className="
                mb-2
                flex
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
                  navigate("/student/dashboard")
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
                  navigate("/student/opportunities")
                }
                className="
                  cursor-pointer
                  border-0
                  bg-transparent
                  p-0
                  font-bold
                  text-[#09379A]
                "
              >
                فرص التدريب
              </button>
            </nav>

            {/* =================================================
                PAGE HEADING
            ================================================== */}
            <section
              className="
                flex
                flex-col
                items-start
                justify-between
                gap-4

                md:flex-row
                md:gap-6
              "
            >
              {/* TITLE */}
              <div className="min-w-0 text-right">
                <h1
                  className="
                    m-0
                    text-[23px]
                    font-bold
                    leading-[34px]
                    text-[#09379A]

                    sm:text-[25px]

                    xl:text-[28px]
                    xl:leading-[40px]
                  "
                >
                  تفاصيل فرصة التدريب
                </h1>

                <p
                  className="
                    m-0
                    mt-[3px]
                    max-w-[680px]
                    text-[12px]
                    font-normal
                    leading-[21px]
                    text-[#64748B]

                    sm:text-[13px]
                    sm:leading-[22px]

                    xl:text-[14px]
                    xl:leading-[23px]
                  "
                >
                  استعراض كافة متطلبات البرنامج التدريبي
                  وتفاصيل الاعتماد الأكاديمي للجهة الشريكة
                </p>
              </div>

              {/* TOP BACK BUTTON */}
              <button
                type="button"
                onClick={() =>
                  navigate("/student/opportunities")
                }
                className="
                  flex
                  h-[40px]
                  shrink-0
                  cursor-pointer
                  items-center
                  justify-center
                  gap-[7px]
                  rounded-[9px]
                  border
                  border-[#E8EDF4]
                  bg-white
                  px-3
                  text-[12px]
                  font-bold
                  text-[#09379A]
                  shadow-[0_1px_2px_rgba(15,23,42,0.03)]
                  transition

                  hover:border-[#C9D5E8]
                  hover:bg-[#F8FAFC]

                  sm:h-[42px]
                  sm:px-[14px]
                  sm:text-[13px]

                  xl:text-[14px]
                "
              >
                <ArrowRight
                  size={18}
                  strokeWidth={1.8}
                />

                <span>
                  العودة إلى فرص التدريب
                </span>
              </button>
            </section>

            {/* =================================================
                TWO COLUMN LAYOUT
            ================================================== */}
            <section
              dir="ltr"
              className="
                mt-5
                grid
                w-full
                grid-cols-1
                items-start
                gap-5

                lg:grid-cols-[280px_minmax(0,1fr)]

                xl:mt-[24px]
                xl:grid-cols-[330px_minmax(0,1fr)]
                xl:gap-[24px]
              "
            >
              {/* =================================================
                  LEFT COLUMN
              ================================================== */}
              <div
                dir="rtl"
                className="
                  order-2
                  flex
                  min-w-0
                  flex-col
                  gap-5

                  lg:order-1

                  xl:gap-[22px]
                "
              >
                {/* =============================================
                    COLLEGE SUPERVISION
                ============================================== */}
                <aside
                  className="
                    w-full
                    rounded-[14px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    p-4

                    sm:p-5

                    xl:px-[24px]
                    xl:py-[24px]
                  "
                >
                  {/* HEADING */}
                  <div
                    className="
                      flex
                      items-center
                      justify-start
                      gap-[9px]
                      border-b
                      border-[#E2E8F0]
                      pb-3

                      xl:gap-[10px]
                      xl:pb-[15px]
                    "
                  >
                    <Building2
                      size={21}
                      strokeWidth={1.8}
                      className="
                        shrink-0
                        text-[#09379A]
                      "
                    />

                    <h2
                      className="
                        m-0
                        text-[16px]
                        font-bold
                        leading-[25px]
                        text-[#1E293B]

                        xl:text-[18px]
                        xl:leading-[26px]
                      "
                    >
                      الإشراف الكلية
                    </h2>
                  </div>

                  {/* SUPERVISOR */}
                  <div
                    className="
                      mt-4
                      flex
                      min-h-[110px]
                      items-center
                      rounded-[12px]
                      border
                      border-[#C9D7FF]
                      bg-[#EEF3FF]
                      px-3
                      py-4

                      xl:min-h-[118px]
                      xl:px-[16px]
                      xl:py-[18px]
                    "
                  >
                    <div
                      className="
                        flex
                        h-[42px]
                        w-[42px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#09379A]
                        text-white
                      "
                    >
                      <UserRound
                        size={20}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="mr-3 min-w-0 text-right">
                      <p
                        className="
                          m-0
                          text-[10px]
                          leading-[17px]
                          text-[#64748B]

                          xl:text-[11px]
                        "
                      >
                        المشرف الأكاديمي للقسم:
                      </p>

                      <h3
                        className="
                          m-0
                          mt-[3px]
                          text-[13px]
                          font-bold
                          leading-[20px]
                          text-[#09379A]

                          xl:text-[14px]
                          xl:leading-[21px]
                        "
                      >
                        د. سمير مصطفى خليل
                      </h3>

                      <p
                        className="
                          m-0
                          mt-[2px]
                          text-[10px]
                          leading-[17px]
                          text-[#64748B]

                          xl:text-[11px]
                        "
                      >
                        قسم تكنولوجيا المعلومات
                      </p>

                      <p
                        className="
                          m-0
                          text-[10px]
                          leading-[17px]
                          text-[#64748B]

                          xl:text-[11px]
                        "
                      >
                        والوسائط المتعددة
                      </p>
                    </div>
                  </div>

                  {/* REQUIREMENTS */}
                  <div className="mt-5">
                    <h3
                      className="
                        m-0
                        text-[12px]
                        font-bold
                        leading-[20px]
                        text-[#1E293B]

                        xl:text-[13px]
                      "
                    >
                      متطلبات القبول بالبرنامج:
                    </h3>

                    <div
                      className="
                        mt-[10px]
                        flex
                        flex-col
                        gap-[9px]

                        xl:mt-[11px]
                        xl:gap-[10px]
                      "
                    >
                      {requirements.map((item) => (
                        <div
                          key={item}
                          className="
                            flex
                            items-start
                            gap-[7px]

                            xl:gap-[8px]
                          "
                        >
                          <CheckCircle2
                            size={16}
                            strokeWidth={1.8}
                            className="
                              mt-[1px]
                              shrink-0
                              text-[#10B981]

                              xl:size-[17px]
                            "
                          />

                          <p
                            className="
                              m-0
                              text-[10px]
                              leading-[18px]
                              text-[#64748B]

                              xl:text-[11px]
                              xl:leading-[19px]
                            "
                          >
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MAP */}
                  <div className="mt-5">
                    <p
                      className="
                        m-0
                        mb-[7px]
                        text-[10px]
                        text-[#94A3B8]

                        xl:text-[11px]
                      "
                    >
                      مقر التدريب:
                    </p>

                    <div
                      className="
                        relative
                        h-[110px]
                        w-full
                        overflow-hidden
                        rounded-[10px]
                        bg-[#E8EDF3]

                        xl:h-[108px]
                      "
                    >
                      <img
                        src="/training-map.png"
                        alt="موقع مقر التدريب"
                        className="
                          absolute
                          inset-0
                          h-full
                          w-full
                          object-cover
                        "
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/60
                          via-transparent
                          to-transparent
                        "
                      />

                      <div
                        className="
                          absolute
                          bottom-[10px]
                          left-[12px]
                          right-[12px]
                          flex
                          items-center
                          gap-[6px]
                          text-white
                        "
                      >
                        <MapPin
                          size={16}
                          strokeWidth={1.8}
                          className="shrink-0 text-[#FBBF24]"
                        />

                        <span
                          className="
                            text-[10px]
                            font-medium
                            leading-[17px]

                            xl:text-[11px]
                          "
                        >
                          {organizationLocation}
                        </span>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* =============================================
                    APPLICATION STATES TEST
                ============================================== */}
                <section
                  className="
                    w-full
                    rounded-[14px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    p-4

                    sm:p-5

                    xl:px-[20px]
                    xl:py-[20px]
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-[7px]
                      "
                    >
                      <SlidersHorizontal
                        size={18}
                        strokeWidth={1.8}
                        className="shrink-0 text-[#64748B]"
                      />

                      <h3
                        className="
                          m-0
                          text-[12px]
                          font-bold
                          leading-[20px]
                          text-[#1E293B]

                          xl:text-[13px]
                        "
                      >
                        اختبار حالات التقديم:
                      </h3>
                    </div>

                    <span
                      className="
                        shrink-0
                        rounded-[4px]
                        bg-[#EEF2FF]
                        px-2
                        py-1
                        text-[8px]
                        text-[#94A3B8]

                        xl:text-[9px]
                      "
                    >
                      معاينة تفاعلية
                    </span>
                  </div>

                  <p
                    className="
                      m-0
                      mt-3
                      text-[10px]
                      leading-[18px]
                      text-[#64748B]

                      xl:text-[11px]
                      xl:leading-[20px]
                    "
                  >
                    اضغط لمعاينة الحالات التفاعلية للزر
                    الأساسي وحالة انتهاء التقديم:
                  </p>

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-1
                      gap-2

                      sm:grid-cols-2

                      lg:grid-cols-1

                      xl:grid-cols-2
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setApplicationStatus("available")
                      }
                      className={`
                        h-[36px]
                        rounded-[7px]
                        border
                        px-3
                        text-[11px]
                        font-bold
                        transition

                        ${
                          applicationStatus === "available"
                            ? `
                              border-[#09379A]
                              bg-[#09379A]
                              text-white
                            `
                            : `
                              border-[#DCE5F2]
                              bg-white
                              text-[#64748B]

                              hover:border-[#09379A]/40
                              hover:text-[#09379A]
                            `
                        }
                      `}
                    >
                      حالة متاح للتقديم
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setApplicationStatus("closed")
                      }
                      className={`
                        h-[36px]
                        rounded-[7px]
                        border
                        px-3
                        text-[11px]
                        font-medium
                        transition

                        ${
                          applicationStatus === "closed"
                            ? `
                              border-[#94A3B8]
                              bg-[#F1F5F9]
                              text-[#475569]
                            `
                            : `
                              border-[#DCE5F2]
                              bg-white
                              text-[#64748B]

                              hover:bg-[#F8FAFC]
                            `
                        }
                      `}
                    >
                      حالة انتهاء الموعد
                    </button>
                  </div>
                </section>
              </div>

              {/* =================================================
                  RIGHT COLUMN
              ================================================== */}
              <div
                dir="rtl"
                className="
                  order-1
                  flex
                  min-w-0
                  flex-col
                  gap-5

                  lg:order-2

                  xl:gap-[22px]
                "
              >
                {/* =============================================
                    MAIN OPPORTUNITY CARD
                ============================================== */}
                <section
                  className="
                    w-full
                    rounded-[14px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    p-4

                    sm:p-5

                    xl:min-h-[194px]
                    xl:px-[24px]
                    xl:py-[24px]
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-4

                      md:flex-row
                      md:items-start

                      xl:gap-[22px]
                    "
                  >
                    {/* IMAGE */}
                    <div
                      className="
                        relative
                        h-[190px]
                        w-full
                        shrink-0
                        overflow-hidden
                        rounded-[10px]
                        bg-[#F1F5F9]

                        sm:h-[220px]

                        md:h-[136px]
                        md:w-[190px]

                        xl:w-[214px]
                      "
                    >
                      <img
                        src="/training-company.png"
                        alt={`مقر ${organizationName}`}
                        className="
                          absolute
                          inset-0
                          h-full
                          w-full
                          object-cover
                        "
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                      <div
                        className="
                          absolute
                          bottom-[8px]
                          right-[8px]
                          flex
                          h-[22px]
                          items-center
                          rounded-[5px]
                          bg-black/60
                          px-[9px]
                          text-[10px]
                          text-white
                        "
                      >
                        مقر الشركة
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="min-w-0 flex-1">
                      {/* BADGES */}
                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          justify-start
                          gap-[6px]

                          xl:gap-[7px]
                        "
                      >
                        <span
                          className="
                            flex
                            h-[25px]
                            items-center
                            gap-[5px]
                            rounded-[10px]
                            border
                            border-[#AFE8C7]
                            bg-[#DCFCE7]
                            px-[10px]
                            text-[10px]
                            text-[#16844C]

                            xl:text-[11px]
                          "
                        >
                          <CheckCircle2 size={13} />
                          معتمدة
                        </span>

                        <span
                          className="
                            flex
                            h-[25px]
                            items-center
                            gap-[4px]
                            rounded-[10px]
                            border
                            border-[#A5E3F4]
                            bg-[#E4F7FC]
                            px-[10px]
                            text-[10px]
                            text-[#287E8C]

                            xl:text-[11px]
                          "
                        >
                          <Building2 size={13} />
                          حضوري
                        </span>

                        <span
                          className="
                            flex
                            h-[25px]
                            items-center
                            rounded-[8px]
                            bg-[#E6ECFA]
                            px-[9px]
                            text-[9px]
                            text-[#64748B]

                            xl:text-[10px]
                          "
                        >
                          رمز الشراكة: ACT-2025-04
                        </span>
                      </div>

                      <h2
                        className="
                          m-0
                          mt-[10px]
                          text-[18px]
                          font-bold
                          leading-[28px]
                          text-[#172033]

                          sm:text-[19px]

                          xl:mt-[12px]
                          xl:text-[21px]
                          xl:leading-[30px]
                        "
                      >
                        {selectedOpportunity?.title || "فرصة تدريب غير متاحة"}
                      </h2>
                      <p className="m-0 mt-1 text-[11px] font-semibold text-[#64748B]">
                        <Building2 size={13} className="ml-1 inline text-[#09379A]" />
                        {organizationName}
                      </p>

                      {/* METADATA */}
                      <div
                        className="
                          mt-[11px]
                          flex
                          flex-wrap
                          items-center
                          gap-x-4
                          gap-y-2
                          border-t
                          border-[#E2E8F0]
                          pt-[10px]
                          text-[10px]
                          text-[#475569]

                          sm:text-[11px]

                          xl:mt-[13px]
                          xl:gap-x-[28px]
                          xl:pt-[11px]
                        "
                      >
                        <div className="flex items-center gap-[5px]">
                          <Clock3
                            size={15}
                            strokeWidth={1.8}
                            className="text-[#09379A]"
                          />

                          <span>
                            <strong>{selectedOpportunity?.hours ?? "—"}</strong>{" "}
                            ساعة تدريبية
                          </span>
                        </div>

                        <div className="flex items-center gap-[5px]">
                          <CalendarDays
                            size={15}
                            strokeWidth={1.8}
                            className="text-[#09379A]"
                          />

                          <span>
                            تاريخ البدء:{" "}
                            <strong>
                              {formatDate(selectedOpportunity?.startDate)}
                            </strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-[5px]">
                          <MapPin
                            size={15}
                            strokeWidth={1.8}
                            className="text-[#09379A]"
                          />

                          <span>
                            {organizationLocation}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* =============================================
                    ABOUT
                ============================================== */}
                <section
                  className="
                    w-full
                    rounded-[14px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    p-4

                    sm:p-5

                    xl:px-[24px]
                    xl:py-[25px]
                  "
                >
                  <div className="flex items-center gap-[9px]">
                    <span
                      className="
                        h-[22px]
                        w-[4px]
                        shrink-0
                        rounded-full
                        bg-[#09379A]

                        xl:h-[24px]
                      "
                    />

                    <h2
                      className="
                        m-0
                        text-[16px]
                        font-bold
                        text-[#1E293B]

                        xl:text-[18px]
                      "
                    >
                      نبذة عن الجهة
                    </h2>
                  </div>

                  <p
                    className="
                      m-0
                      mt-3
                      text-[12px]
                      leading-[24px]
                      text-[#64748B]

                      sm:text-[13px]

                      xl:mt-[17px]
                      xl:leading-[26px]
                    "
                  >
                    {organizationDescription}
                  </p>

                  {/* STATS */}
                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-1
                      gap-3

                      sm:grid-cols-3

                      xl:mt-[21px]
                      xl:gap-[15px]
                    "
                  >
                    <InfoStat
                      icon={Users}
                      label="عدد المقاعد"
                      value={`${selectedOpportunity?.capacity ?? "—"} مقاعد`}
                    />

                    <InfoStat
                      icon={Award}
                      label="المؤهل المطلوب"
                      value="طالب في الكلية"
                    />

                    <InfoStat
                      icon={GraduationCap}
                      label="التخصصات المطلوبة"
                      value={selectedOpportunity?.specialty || "غير محدد"}
                    />
                  </div>
                </section>

                {/* =============================================
                    REQUIRED SKILLS
                ============================================== */}
                <section
                  className="
                    w-full
                    rounded-[14px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    p-4

                    sm:p-5

                    xl:px-[24px]
                    xl:py-[25px]
                  "
                >
                  <div className="flex items-center gap-[9px]">
                    <span
                      className="
                        h-[22px]
                        w-[4px]
                        shrink-0
                        rounded-full
                        bg-[#09379A]

                        xl:h-[24px]
                      "
                    />

                    <h2
                      className="
                        m-0
                        text-[16px]
                        font-bold
                        text-[#1E293B]

                        xl:text-[18px]
                      "
                    >
                      المهارات المطلوبة
                    </h2>
                  </div>

                  <p
                    className="
                      m-0
                      mt-3
                      text-[11px]
                      leading-[20px]
                      text-[#64748B]

                      sm:text-[12px]

                      xl:mt-[14px]
                      xl:leading-[21px]
                    "
                  >
                    المهارات الأساسية اللازمة لاجتياز
                    المقابلة التأهيلية وبدء البرنامج
                    الميداني المعتمد:
                  </p>

                  <div
                    className="
                      mt-4
                      flex
                      flex-wrap
                      gap-[8px]

                      xl:mt-[17px]
                      xl:gap-[12px]
                    "
                  >
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="
                          flex
                          min-h-[42px]
                          w-full
                          items-center
                          gap-[7px]
                          rounded-[9px]
                          border
                          border-[#AFC7FF]
                          bg-[#EDF3FF]
                          px-3
                          text-[12px]
                          font-medium
                          text-[#09379A]

                          min-[480px]:w-auto

                          xl:h-[45px]
                          xl:px-[17px]
                          xl:text-[13px]
                        "
                      >
                        <CheckCircle2
                          size={16}
                          strokeWidth={1.8}
                        />

                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* =============================================
                    APPLICATION ACTION
                ============================================== */}
                <section
                  className="
                    w-full
                    rounded-[14px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    p-4
                    shadow-[0_2px_10px_rgba(15,23,42,0.03)]
                    sm:p-5
                    xl:px-[24px]
                    xl:py-[20px]
                  "
                >
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* BACK */}
                    <button
                      type="button"
                      onClick={() => navigate("/student/opportunities")}
                      className="
                        inline-flex h-[46px] w-full items-center justify-center gap-2
                        rounded-[9px] border border-[#D7E0EC] bg-white px-5
                        text-[13px] font-bold text-[#475569] transition
                        hover:border-[#B8C8DF] hover:bg-[#F8FAFC]
                        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#09379A]/10
                        sm:w-auto sm:min-w-[170px]
                        xl:h-[48px] xl:text-[14px]
                      "
                    >
                      <ArrowLeft size={17} strokeWidth={1.8} />
                      <span>العودة إلى قائمة الفرص</span>
                    </button>

                    {/* APPLICATION BUTTON */}
                    <button
                      type="button"
                      disabled={currentApplicationState.disabled}
                      onClick={handleApply}
                      className={`
                        inline-flex h-[48px] w-full items-center justify-center gap-2.5
                        rounded-[9px] border px-6 text-[14px] font-bold
                        shadow-[0_3px_8px_rgba(9,55,154,0.12)]
                        transition-all duration-200
                        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#09379A]/15
                        disabled:cursor-not-allowed disabled:shadow-none
                        sm:w-auto sm:min-w-[230px]
                        xl:h-[52px] xl:min-w-[245px] xl:text-[15px]
                        ${currentApplicationState.className}
                      `}
                    >
                      <ApplicationIcon size={18} strokeWidth={1.9} />
                      <span>{currentApplicationState.text}</span>
                    </button>
                  </div>

                  {!trainingEligibility.canApply && (
                    <div
                      role="status"
                      className="
                        mt-4 flex w-full items-start gap-3 rounded-[10px]
                        border border-amber-200 bg-[#FFFBEB] px-4 py-3.5
                        text-right
                      "
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        <Info size={17} strokeWidth={2} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="m-0 text-[12px] font-bold leading-6 text-[#92400E] sm:text-[13px]">
                          التقديم غير متاح حاليًا
                        </p>
                        <p className="m-0 mt-0.5 text-[11px] leading-6 text-[#92400E] sm:text-[12px]">
                          {trainingEligibility.reason} يمكنك الاستمرار في تصفح الفرص والاطلاع على تفاصيلها.
                        </p>
                      </div>
                    </div>
                  )}
                </section>
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
   INFO STAT
========================================================= */

function InfoStat({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        flex
        min-h-[108px]
        flex-col
        items-center
        justify-center
        rounded-[12px]
        border
        border-[#DCE5F5]
        bg-[#EEF3FF]
        px-3
        text-center

        sm:min-h-[116px]

        xl:min-h-[122px]
        xl:px-[12px]
      "
    >
      <div
        className="
          flex
          h-[38px]
          w-[38px]
          items-center
          justify-center
          rounded-full
          bg-[#DDE7FB]
          text-[#09379A]

          xl:h-[40px]
          xl:w-[40px]
        "
      >
        <Icon
          size={20}
          strokeWidth={1.8}
        />
      </div>

      <p
        className="
          m-0
          mt-[7px]
          text-[10px]
          text-[#64748B]

          xl:mt-[8px]
          xl:text-[11px]
        "
      >
        {label}
      </p>

      <h3
        className="
          m-0
          mt-[3px]
          text-[15px]
          font-bold
          leading-[22px]
          text-[#1E293B]

          xl:mt-[4px]
          xl:text-[17px]
        "
      >
        {value}
      </h3>
    </div>
  );
}