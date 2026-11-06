import AcademicFooter from "../../components/shared/AcademicFooter";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BookOpenCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  MapPin,
  NotebookPen,
  Star,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

export default function TrainingProfile() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("basic");

  /* =========================================================
     TABS
  ========================================================= */

  const tabs = [
    {
      id: "basic",
      label: "أساسية",
    },
    {
      id: "attachments",
      label: "المرفقات",
    },
    {
      id: "evaluations",
      label: "التقييمات",
    },
    {
      id: "certificate",
      label: "الشهادة",
    },
  ];

  /* =========================================================
     TRAINING DATA
  ========================================================= */

  const trainingData = {
    organization: "شركة القدس للاتصالات",

    description:
      "تدريب في مجال هندسة الاتصالات",

    status: "نشط / معتمد",

    duration: "8 أسابيع",

    dateRange:
      "2025/10/01 - 2025/12/01",

    location:
      "غزة - الرمال",

    academicYear:
      "السنة الأكاديمية 2024/2025",

    studentName:
      "أمل أحمد",

    academicSupervisor:
      "د. أحمد محمد",

    fieldSupervisor:
      "م. سارة خليل",

    major:
      "هندسة الاتصالات",

    trainingLocation:
      "غزة - الرمال",

    trainingDescription:
      "التدريب على الأنظمة والشبكات والمعدات الحديثة في مجال الاتصالات.",
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
                PAGE HEADER
            ================================================== */}

            <section>
              {/* ===============================================
                  BREADCRUMB
              ================================================ */}

              <nav
                aria-label="مسار التنقل"
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-[7px]
                  text-[11px]
                  font-medium
                  leading-[20px]

                  sm:text-[12px]

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

                <span
                  className="
                    font-bold
                    text-[#09379A]
                  "
                >
                  ملفي التدريبي
                </span>
              </nav>

              {/* ===============================================
                  TITLE + ACADEMIC YEAR
              ================================================ */}

              <div
                className="
                  mt-[7px]
                  flex
                  flex-col
                  gap-3

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:gap-5
                "
              >
                <h1
                  className="
                    m-0
                    text-[24px]
                    font-bold
                    leading-[36px]
                    text-[#14213D]

                    sm:text-[26px]

                    xl:text-[28px]
                    xl:leading-[40px]
                  "
                >
                  ملفي التدريبي
                </h1>

                <div
                  className="
                    flex
                    min-h-[30px]
                    w-fit
                    items-center
                    gap-[7px]
                    rounded-full
                    border
                    border-[#D8E0EA]
                    bg-white
                    px-[12px]
                    text-[10px]
                    font-medium
                    text-[#64748B]

                    sm:text-[11px]
                  "
                >
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.8}
                    className="
                      shrink-0
                      text-[#10B981]
                    "
                  />

                  {trainingData.academicYear}
                </div>
              </div>

              {/* SEPARATOR */}

              <div
                className="
                  mt-[15px]
                  border-b
                  border-dashed
                  border-[#D9E2EC]
                "
              />
            </section>

            {/* =================================================
                TRAINING SUMMARY
            ================================================== */}

            <section
              className="
                mt-5
                flex
                w-full
                flex-col
                gap-5
                rounded-[14px]
                border
                border-[#DDE5EF]
                bg-white
                p-4
                shadow-[0_1px_2px_rgba(15,23,42,0.03)]

                sm:p-5

                lg:flex-row
                lg:items-center
                lg:justify-between

                xl:mt-[24px]
                xl:min-h-[150px]
                xl:px-[30px]
                xl:py-[26px]
              "
            >
              {/* ===============================================
                  TRAINING INFORMATION
              ================================================ */}

              <div
                className="
                  flex
                  min-w-0
                  items-start
                  gap-[14px]

                  sm:items-center
                  sm:gap-[18px]
                "
              >
                {/* ORGANIZATION LOGO */}

                <div
                  className="
                    flex
                    h-[58px]
                    w-[58px]
                    shrink-0
                    flex-col
                    items-center
                    justify-center
                    rounded-[12px]
                    border
                    border-[#E2E8F0]
                    bg-[#F1F5F9]
                    text-[#09379A]

                    sm:h-[64px]
                    sm:w-[64px]
                  "
                >
                  <Building2
                    size={26}
                    strokeWidth={1.8}
                  />

                  <span
                    className="
                      mt-[2px]
                      text-[7px]
                      font-bold
                      leading-[9px]
                    "
                  >
                    PALTEL
                  </span>

                  <span
                    className="
                      text-[6px]
                      font-bold
                      leading-[8px]
                    "
                  >
                    GROUP
                  </span>
                </div>

                {/* CONTENT */}

                <div className="min-w-0">
                  <h2
                    className="
                      m-0
                      text-[17px]
                      font-bold
                      leading-[27px]
                      text-[#1E293B]

                      sm:text-[19px]

                      xl:text-[20px]
                      xl:leading-[30px]
                    "
                  >
                    {trainingData.organization}
                  </h2>

                  <p
                    className="
                      m-0
                      mt-[3px]
                      text-[11px]
                      leading-[20px]
                      text-[#64748B]

                      sm:text-[12px]

                      xl:text-[13px]
                    "
                  >
                    {trainingData.description}
                  </p>

                  {/* METADATA */}

                  <div
                    className="
                      mt-[12px]
                      flex
                      flex-col
                      gap-[7px]
                      text-[10px]
                      leading-[18px]
                      text-[#64748B]

                      sm:flex-row
                      sm:flex-wrap
                      sm:items-center
                      sm:gap-x-[22px]
                      sm:gap-y-[8px]

                      xl:mt-[14px]
                      xl:text-[11px]
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-[6px]
                      "
                    >
                      <Clock3
                        size={15}
                        strokeWidth={1.7}
                        className="shrink-0"
                      />

                      <span>
                        {trainingData.duration}
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-[6px]
                      "
                    >
                      <CalendarDays
                        size={15}
                        strokeWidth={1.7}
                        className="shrink-0"
                      />

                      <span dir="ltr">
                        {trainingData.dateRange}
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-[6px]
                      "
                    >
                      <MapPin
                        size={15}
                        strokeWidth={1.7}
                        className="shrink-0"
                      />

                      <span>
                        {trainingData.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===============================================
                  STATUS + ACTIONS
              ================================================ */}

              <div
                className="
                  flex
                  w-full
                  shrink-0
                  flex-col
                  gap-[11px]

                  lg:w-auto
                  lg:items-end
                "
              >
                {/* STATUS */}

                <div
                  className="
                    flex
                    min-h-[31px]
                    w-fit
                    items-center
                    gap-[7px]
                    rounded-full
                    border
                    border-[#C8DAFF]
                    bg-[#EFF5FF]
                    px-[14px]
                    text-[10px]
                    font-bold
                    leading-[18px]
                    text-[#09379A]

                    sm:text-[11px]
                  "
                >
                  <span
                    className="
                      h-[7px]
                      w-[7px]
                      rounded-full
                      bg-[#2563EB]
                    "
                  />

                  {trainingData.status}
                </div>

                {/* ACTION BUTTONS */}

                <div
                  className="
                    grid
                    w-full
                    grid-cols-1
                    gap-[9px]

                    sm:grid-cols-2

                    lg:flex
                    lg:w-auto
                    lg:items-center
                  "
                >
                  {/* TRAINING PLAN */}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/student/training-plan"
                      )
                    }
                    className="
                      group
                      flex
                      min-h-[43px]
                      w-full
                      items-center
                      justify-center
                      gap-[8px]
                      rounded-[9px]
                      border-0
                      bg-[#09379A]
                      px-[16px]
                      text-[11px]
                      font-bold
                      text-white
                      shadow-[0_4px_12px_rgba(9,55,154,0.18)]
                      transition-all
                      duration-200

                      hover:bg-[#072E81]
                      hover:shadow-[0_6px_16px_rgba(9,55,154,0.22)]

                      active:translate-y-[1px]

                      lg:w-auto
                      lg:min-w-[155px]
                    "
                  >
                    <BookOpenCheck
                      size={16}
                      strokeWidth={1.9}
                    />

                    عرض خطة التدريب

                    <ArrowLeft
                      size={14}
                      className="
                        transition-transform
                        duration-200

                        group-hover:-translate-x-[2px]
                      "
                    />
                  </button>

                  {/* DAILY TRAINING LOG */}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/student/daily-training-log"
                      )
                    }
                    className="
                      group
                      flex
                      min-h-[43px]
                      w-full
                      items-center
                      justify-center
                      gap-[8px]
                      rounded-[9px]
                      border
                      border-[#BFD0EF]
                      bg-white
                      px-[16px]
                      text-[11px]
                      font-bold
                      text-[#09379A]
                      shadow-[0_2px_6px_rgba(15,23,42,0.04)]
                      transition-all
                      duration-200

                      hover:border-[#9EB8E8]
                      hover:bg-[#F5F8FF]
                      hover:shadow-[0_4px_10px_rgba(9,55,154,0.08)]

                      active:translate-y-[1px]

                      lg:w-auto
                      lg:min-w-[180px]
                    "
                  >
                    <NotebookPen
                      size={16}
                      strokeWidth={1.9}
                    />

                    السجل التدريبي اليومي

                    <ArrowLeft
                      size={14}
                      className="
                        transition-transform
                        duration-200

                        group-hover:-translate-x-[2px]
                      "
                    />
                  </button>
                </div>

                {/* SMALL SUPPORT TEXT */}

                <p
                  className="
                    m-0
                    hidden
                    text-[9px]
                    leading-[16px]
                    text-[#94A3B8]

                    lg:block
                  "
                >
                  تابع خطتك وسجّل أنشطتك الميدانية من هنا
                </p>
              </div>
            </section>

            {/* =================================================
                TABS
            ================================================== */}

            <section
              className="
                mt-4
                w-full
                overflow-x-auto
                border-b
                border-[#E2E8F0]

                xl:mt-[16px]
              "
            >
              <div
                className="
                  flex
                  min-w-max
                  items-center
                  gap-7
                  px-[3px]

                  sm:gap-9

                  lg:min-w-0
                  lg:justify-start

                  xl:gap-[42px]
                  xl:px-[6px]
                "
              >
                {tabs.map((tab) => {
                  const isActive =
                    activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() =>
                        setActiveTab(tab.id)
                      }
                      className={`
                        relative
                        h-[48px]
                        border-0
                        bg-transparent
                        px-[6px]
                        text-[12px]
                        leading-[20px]
                        transition-colors

                        sm:text-[13px]

                        ${
                          isActive
                            ? `
                              font-bold
                              text-[#09379A]
                            `
                            : `
                              font-medium
                              text-[#64748B]

                              hover:text-[#09379A]
                            `
                        }
                      `}
                    >
                      {tab.label}

                      {isActive && (
                        <span
                          className="
                            absolute
                            bottom-0
                            left-0
                            right-0
                            h-[3px]
                            rounded-t-full
                            bg-[#09379A]
                          "
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* =================================================
                BASIC TAB
            ================================================== */}

            {activeTab === "basic" && (
              <section
                className="
                  mt-5
                  w-full
                  rounded-[14px]
                  border
                  border-[#DDE5EF]
                  bg-white
                  p-4
                  shadow-[0_1px_2px_rgba(15,23,42,0.03)]

                  sm:p-5

                  md:p-6

                  xl:mt-[24px]
                  xl:px-[32px]
                  xl:py-[32px]
                "
              >
                {/* SECTION TITLE */}

                <h2
                  className="
                    m-0
                    text-[18px]
                    font-semibold
                    leading-[28px]
                    text-[#334155]

                    xl:text-[20px]
                    xl:leading-[30px]
                  "
                >
                  البيانات الأساسية
                </h2>

                {/* MAIN FIELDS */}

                <div
                  className="
                    mt-5
                    grid
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2

                    xl:mt-[24px]
                    xl:gap-x-[24px]
                    xl:gap-y-[24px]
                  "
                >
                  <InfoField
                    label="اسم الطالب"
                    value={
                      trainingData.studentName
                    }
                  />

                  <InfoField
                    label="الجهة التدريبية"
                    value={
                      trainingData.organization
                    }
                  />

                  <InfoField
                    label="المشرف الأكاديمي"
                    value={
                      trainingData.academicSupervisor
                    }
                  />

                  <InfoField
                    label="المشرف في جهة التدريب"
                    value={
                      trainingData.fieldSupervisor
                    }
                  />

                  <InfoField
                    label="التخصص"
                    value={
                      trainingData.major
                    }
                  />

                  <InfoField
                    label="مكان التدريب"
                    value={
                      trainingData.trainingLocation
                    }
                  />
                </div>

                {/* TRAINING DESCRIPTION */}

                <div
                  className="
                    mt-4
                    min-h-[87px]
                    rounded-[12px]
                    border
                    border-[#EEF2F6]
                    bg-[#F8FAFC]
                    px-4
                    py-[15px]

                    sm:px-5

                    xl:mt-[24px]
                    xl:px-[20px]
                  "
                >
                  <p
                    className="
                      m-0
                      text-[10px]
                      font-medium
                      leading-[18px]
                      text-[#94A3B8]

                      sm:text-[11px]
                    "
                  >
                    وصف التدريب
                  </p>

                  <p
                    className="
                      m-0
                      mt-[7px]
                      text-[12px]
                      font-medium
                      leading-[22px]
                      text-[#334155]

                      sm:text-[13px]
                    "
                  >
                    {trainingData.trainingDescription}
                  </p>
                </div>
              </section>
            )}

            {/* =================================================
                ATTACHMENTS TAB
            ================================================== */}

            {activeTab === "attachments" && (
              <EmptyTabMessage
                icon={FileText}
                title="المرفقات"
                text="سيتم عرض المرفقات المعتمدة الخاصة بملف التدريب هنا."
              />
            )}

            {/* =================================================
                EVALUATIONS TAB
            ================================================== */}

            {activeTab === "evaluations" && (
              <EmptyTabMessage
                icon={Star}
                title="التقييمات"
                text="سيتم عرض تقييمات التدريب المعتمدة هنا."
              />
            )}

            {/* =================================================
                CERTIFICATE TAB
            ================================================== */}

            {activeTab === "certificate" && (
              <EmptyTabMessage
                icon={FileCheck2}
                title="الشهادة"
                text="ستظهر شهادة التدريب بعد استكمال واعتماد جميع متطلبات التدريب."
              />
            )}
          </div>
        
            <AcademicFooter audience="student" />
          </main>
      </div>
    </div>
  );
}

/* =========================================================
   INFO FIELD
========================================================= */

function InfoField({
  label,
  value,
}) {
  return (
    <div
      className="
        flex
        min-h-[78px]
        flex-col
        justify-center
        rounded-[12px]
        border
        border-[#EEF2F6]
        bg-[#F8FAFC]
        px-4
        py-[14px]

        sm:min-h-[84px]
        sm:px-5
        sm:py-[16px]
      "
    >
      <p
        className="
          m-0
          text-[10px]
          font-medium
          leading-[18px]
          text-[#94A3B8]

          sm:text-[11px]
        "
      >
        {label}
      </p>

      <p
        className="
          m-0
          mt-[5px]
          text-[13px]
          font-bold
          leading-[22px]
          text-[#334155]

          sm:text-[14px]
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY TAB
========================================================= */

function EmptyTabMessage({
  icon: Icon,
  title,
  text,
}) {
  return (
    <section
      className="
        mt-5
        flex
        min-h-[220px]
        w-full
        flex-col
        items-center
        justify-center
        rounded-[14px]
        border
        border-[#DDE5EF]
        bg-white
        px-5
        py-[30px]
        text-center

        sm:px-8

        xl:mt-[24px]
      "
    >
      <div
        className="
          flex
          h-[48px]
          w-[48px]
          items-center
          justify-center
          rounded-[12px]
          bg-[#EEF3FF]
          text-[#09379A]
        "
      >
        <Icon
          size={22}
          strokeWidth={1.8}
        />
      </div>

      <h2
        className="
          m-0
          mt-3
          text-[17px]
          font-bold
          text-[#1E293B]

          sm:text-[18px]
        "
      >
        {title}
      </h2>

      <p
        className="
          m-0
          mt-[7px]
          max-w-[460px]
          text-[11px]
          leading-[21px]
          text-[#64748B]

          sm:text-[12px]
        "
      >
        {text}
      </p>
    </section>
  );
}