import AcademicFooter from "../../components/shared/AcademicFooter";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Flag,
  Info,
  Printer,
  ShieldCheck,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

export default function TrainingPlan() {
  const navigate = useNavigate();

  /* =========================================================
     TRAINING GOALS
  ========================================================= */

  const goals = [
    "التعرف على بيئة العمل الواقعية في قطاع الاتصالات والشبكات.",

    "اكتساب مهارات عملية ومعايير قياسية في تركيب وصيانة الشبكات.",

    "تطوير مهارات العمل الجماعي، حل المشكلات التقنية والتواصل المهني.",
  ];

  /* =========================================================
     TRAINING TASKS
  ========================================================= */

  const tasks = [
    {
      week: "1",

      title:
        "التدريب على الأنظمة وصيانة الشبكات",

      description:
        "التعرف على بروتوكولات الأمان الداخلي وإجراءات الفحص الأساسية لأجهزة التوجيه والتحكم.",

      output:
        "تقرير أسبوعي (1)",

      status:
        "مكتمل",

      statusType:
        "completed",
    },

    {
      week:
        "2 - 3",

      title:
        "المشاركة في تركيب وصيانة الشبكات",

      description:
        "المشاركة الميدانية في تمديد الكابلات وتهيئة أجهزة التبديل وإعداد نقاط التوزيع المحلية.",

      output:
        "تقرير أسبوعي (2)",

      status:
        "قيد التنفيذ",

      statusType:
        "progress",
    },

    {
      week:
        "4 - 5",

      title:
        "العمل على مشاريع عملية واختبارات الأداء",

      description:
        "تطبيق حلول عملية لمعالجة الاختناقات الشبكية وإعداد سيناريوهات استعادة الاتصال.",

      output:
        "تقرير أسبوعي (3)",

      status:
        "قادم",

      statusType:
        "upcoming",
    },

    {
      week:
        "6 - 7",

      title:
        "تجهيز التقرير النهائي وعرض الإنجاز",

      description:
        "حصر ساعات التدريب العملي وتوثيق المهارات المكتسبة واعتماد النموذج من المشرف الميداني.",

      output:
        "تقرير نهائي شامل",

      status:
        "قادم",

      statusType:
        "upcoming",
    },
  ];

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
          MAIN
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
        {/* HEADER */}

        <div className="relative shrink-0">
          <Header />
        </div>

        {/* =====================================================
            SCROLL CONTENT
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

              <span
                className="
                  text-[#94A3B8]
                "
              >
                ›
              </span>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/student/training-profile"
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
                ملفي التدريبي
              </button>

              <span
                className="
                  text-[#94A3B8]
                "
              >
                ›
              </span>

              <span
                className="
                  font-bold
                  text-[#09379A]
                "
              >
                خطة التدريب
              </span>
            </nav>

            {/* =================================================
                PAGE HEADER
            ================================================== */}

            <section
              className="
                mt-[7px]
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-4

                  md:flex-row
                  md:items-start
                  md:justify-between
                "
              >
                {/* TITLE */}

                <div>
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
                    خطة التدريب
                  </h1>

                  <p
                    className="
                      m-0
                      mt-[4px]
                      max-w-[700px]
                      text-[11px]
                      leading-[21px]
                      text-[#64748B]

                      sm:text-[12px]

                      xl:text-[13px]
                      xl:leading-[22px]
                    "
                  >
                    الخطة المعتمدة وتفاصيل المهام
                    والأنشطة الأسبوعية الموزعة على
                    فترة التدريب الميداني
                  </p>
                </div>

                {/* ACTIONS */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-[10px]
                  "
                >
                  <span
                    className="
                      flex
                      min-h-[32px]
                      items-center
                      gap-[7px]
                      rounded-full
                      border
                      border-[#D7E3FA]
                      bg-[#EEF3FF]
                      px-[12px]
                      text-[10px]
                      font-medium
                      text-[#09379A]

                      sm:text-[11px]
                    "
                  >
                    <span
                      className="
                        h-[7px]
                        w-[7px]
                        shrink-0
                        rounded-full
                        bg-[#FF6B35]
                      "
                    />

                    مسار شبكات واتصالات
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      window.print()
                    }
                    className="
                      flex
                      min-h-[34px]
                      items-center
                      gap-[7px]
                      rounded-[8px]
                      border
                      border-[#E2E8F0]
                      bg-white
                      px-[12px]
                      text-[10px]
                      font-bold
                      text-[#334155]
                      transition

                      hover:bg-[#F8FAFC]

                      sm:text-[11px]
                    "
                  >
                    <Printer
                      size={14}
                      className="text-[#09379A]"
                    />

                    طباعة الخطة
                  </button>
                </div>
              </div>

              {/* APPROVAL */}

              <div
                className="
                  mt-[10px]
                  flex
                  items-center
                  gap-[7px]
                  text-[10px]
                  font-medium
                  text-[#09379A]

                  sm:text-[11px]
                "
              >
                <ShieldCheck
                  size={15}
                  className="shrink-0"
                />

                الاعتماد الأكاديمي للعام الدراسي
                2025/2026
              </div>
            </section>

            {/* =================================================
                SUMMARY CARDS
            ================================================== */}

            <section
              className="
                mt-5
                grid
                grid-cols-1
                gap-3

                sm:grid-cols-2

                lg:grid-cols-3

                xl:mt-[24px]
                xl:gap-[18px]
              "
            >
              <SummaryCard
                icon={CalendarDays}
                label="تاريخ الانتهاء"
                value="2025/12/01"
                description="تسليم التقييم النهائي"
              />

              <SummaryCard
                icon={CalendarDays}
                label="تاريخ البدء"
                value="2025/10/01"
                description="الأسبوع الأكاديمي الأول"
              />

              <SummaryCard
                icon={Clock3}
                label="مدة التدريب"
                value="8 أسابيع"
                description="بواقع 120 ساعة ميدانية"
                className="sm:col-span-2 lg:col-span-1"
              />
            </section>

            {/* =================================================
                TRAINING GOALS
            ================================================== */}

            <section
              className="
                mt-5
                rounded-[14px]
                border
                border-[#E2E8F0]
                bg-white
                p-4

                sm:p-5

                xl:mt-[22px]
                xl:px-[24px]
                xl:py-[24px]
              "
            >
              {/* HEADER */}

              <div
                className="
                  flex
                  items-center
                  gap-[11px]
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
                    rounded-[9px]
                    bg-[#EEF3FF]
                    text-[#09379A]
                  "
                >
                  <Info
                    size={18}
                    strokeWidth={2}
                  />
                </div>

                <div>
                  <h2
                    className="
                      m-0
                      text-[17px]
                      font-bold
                      leading-[27px]
                      text-[#1E293B]

                      sm:text-[18px]

                      xl:text-[19px]
                      xl:leading-[28px]
                    "
                  >
                    أهداف التدريب
                  </h2>

                  <p
                    className="
                      m-0
                      mt-[2px]
                      text-[10px]
                      leading-[18px]
                      text-[#94A3B8]

                      sm:text-[11px]
                    "
                  >
                    المخرجات التعليمية والمهارات
                    التطبيقية المستهدفة
                  </p>
                </div>
              </div>

              {/* GOALS */}

              <div
                className="
                  mt-4
                  grid
                  grid-cols-1
                  gap-3

                  md:grid-cols-3

                  xl:mt-[18px]
                  xl:gap-[14px]
                "
              >
                {goals.map((goal) => (
                  <div
                    key={goal}
                    className="
                      flex
                      min-h-[72px]
                      items-start
                      gap-[9px]
                      rounded-[10px]
                      border
                      border-[#EEF2F7]
                      bg-[#F8FAFC]
                      px-[14px]
                      py-[13px]
                    "
                  >
                    <div
                      className="
                        flex
                        h-[23px]
                        w-[23px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#E2E9FF]
                        text-[#2563EB]
                      "
                    >
                      <Check
                        size={13}
                        strokeWidth={2}
                      />
                    </div>

                    <p
                      className="
                        m-0
                        text-[11px]
                        font-medium
                        leading-[20px]
                        text-[#334155]

                        sm:text-[12px]
                      "
                    >
                      {goal}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* =================================================
                TASKS
            ================================================== */}

            <section
              className="
                mt-5
                overflow-hidden
                rounded-[14px]
                border
                border-[#E2E8F0]
                bg-white

                xl:mt-[22px]
              "
            >
              {/* ===============================================
                  TASKS HEADER
              ================================================ */}

              <div
                className="
                  flex
                  flex-col
                  gap-5
                  p-4

                  sm:p-5

                  lg:flex-row
                  lg:items-center
                  lg:justify-between

                  xl:px-[24px]
                  xl:py-[20px]
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
                      h-[35px]
                      w-[35px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-[8px]
                      bg-[#EEF3FF]
                      text-[#09379A]
                    "
                  >
                    <FileText
                      size={18}
                    />
                  </div>

                  <div>
                    <h2
                      className="
                        m-0
                        text-[17px]
                        font-bold
                        text-[#1E293B]

                        xl:text-[18px]
                      "
                    >
                      المهام والأنشطة
                    </h2>

                    <p
                      className="
                        m-0
                        mt-[3px]
                        text-[10px]
                        leading-[17px]
                        text-[#94A3B8]

                        sm:text-[11px]
                      "
                    >
                      4 مراحل رئيسية معتمدة وفق
                      الجدول الزمني
                    </p>
                  </div>
                </div>

                {/* PROGRESS */}

                <div
                  className="
                    w-full

                    lg:max-w-[390px]
                  "
                >
                  <div
                    className="
                      mb-[6px]
                      flex
                      items-center
                      justify-between
                      gap-3
                      text-[10px]
                      font-medium
                      text-[#64748B]

                      sm:text-[11px]
                    "
                  >
                    <span>
                      مكتمل 1 أسبوع / 8 أسابيع
                    </span>

                    <Flag
                      size={14}
                      className="
                        shrink-0
                        text-[#09379A]
                      "
                    />
                  </div>

                  <div
                    className="
                      h-[10px]
                      w-full
                      overflow-hidden
                      rounded-full
                      bg-[#E7ECFF]
                    "
                  >
                    <div
                      className="
                        h-full
                        w-[12.5%]
                        rounded-full
                        bg-[#09379A]
                      "
                    />
                  </div>
                </div>
              </div>

              {/* ===============================================
                  DESKTOP TABLE
              ================================================ */}

              <div
                className="
                  hidden

                  md:block
                "
              >
                {/* COLUMN HEAD */}

                <div
                  className="
                    grid
                    grid-cols-[90px_minmax(0,1fr)_160px_115px]
                    gap-[10px]
                    bg-[#F3F6FB]
                    px-[20px]
                    py-[12px]
                    text-[10px]
                    font-semibold
                    text-[#64748B]

                    lg:grid-cols-[100px_minmax(0,1fr)_170px_110px]
                  "
                >
                  <div>
                    الأسبوع
                  </div>

                  <div>
                    المهام والأنشطة العملية
                  </div>

                  <div>
                    المخرجات المتوقعة
                  </div>

                  <div>
                    الحالة
                  </div>
                </div>

                {/* ROWS */}

                <div>
                  {tasks.map(
                    (task, index) => (
                      <div
                        key={task.week}
                        className={`
                          grid
                          grid-cols-[90px_minmax(0,1fr)_160px_115px]
                          items-center
                          gap-[10px]
                          px-[20px]
                          py-[18px]

                          lg:grid-cols-[100px_minmax(0,1fr)_170px_110px]

                          ${
                            index !==
                            tasks.length -
                              1
                              ? `
                                border-b
                                border-[#EEF2F7]
                              `
                              : ""
                          }
                        `}
                      >
                        {/* WEEK */}

                        <div>
                          <WeekBadge
                            week={
                              task.week
                            }
                          />
                        </div>

                        {/* TASK */}

                        <div className="min-w-0">
                          <h3
                            className="
                              m-0
                              text-[12px]
                              font-bold
                              leading-[20px]
                              text-[#1E293B]

                              lg:text-[13px]
                            "
                          >
                            {task.title}
                          </h3>

                          <p
                            className="
                              m-0
                              mt-[4px]
                              text-[10px]
                              leading-[17px]
                              text-[#64748B]

                              lg:text-[11px]
                              lg:leading-[19px]
                            "
                          >
                            {
                              task.description
                            }
                          </p>
                        </div>

                        {/* OUTPUT */}

                        <div>
                          <OutputBadge
                            text={
                              task.output
                            }
                            final={
                              index ===
                              tasks.length -
                                1
                            }
                          />
                        </div>

                        {/* STATUS */}

                        <div>
                          <StatusBadge
                            status={
                              task.status
                            }
                            type={
                              task.statusType
                            }
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ===============================================
                  MOBILE CARDS
              ================================================ */}

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  border-t
                  border-[#EEF2F7]
                  bg-[#FAFBFD]
                  p-3

                  md:hidden
                "
              >
                {tasks.map(
                  (task, index) => (
                    <article
                      key={task.week}
                      className="
                        rounded-[12px]
                        border
                        border-[#E2E8F0]
                        bg-white
                        p-4
                      "
                    >
                      {/* TOP */}

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >
                        <WeekBadge
                          week={
                            task.week
                          }
                        />

                        <StatusBadge
                          status={
                            task.status
                          }
                          type={
                            task.statusType
                          }
                        />
                      </div>

                      {/* CONTENT */}

                      <h3
                        className="
                          m-0
                          mt-4
                          text-[14px]
                          font-bold
                          leading-[23px]
                          text-[#1E293B]
                        "
                      >
                        {task.title}
                      </h3>

                      <p
                        className="
                          m-0
                          mt-[5px]
                          text-[11px]
                          leading-[20px]
                          text-[#64748B]
                        "
                      >
                        {task.description}
                      </p>

                      {/* OUTPUT */}

                      <div
                        className="
                          mt-4
                          flex
                          items-center
                          justify-between
                          gap-3
                          border-t
                          border-[#EEF2F7]
                          pt-3
                        "
                      >
                        <span
                          className="
                            text-[10px]
                            font-medium
                            text-[#94A3B8]
                          "
                        >
                          المخرج المتوقع
                        </span>

                        <OutputBadge
                          text={
                            task.output
                          }
                          final={
                            index ===
                            tasks.length -
                              1
                          }
                        />
                      </div>
                    </article>
                  )
                )}
              </div>
            </section>

            {/* =================================================
                SUPERVISOR NOTES
            ================================================== */}

            <section
              className="
                mt-5
                flex
                flex-col
                gap-4
                rounded-[12px]
                border
                border-[#CFE0FB]
                bg-[#EEF5FF]
                p-4

                sm:flex-row
                sm:items-center
                sm:justify-between

                xl:mt-[22px]
                xl:min-h-[78px]
                xl:px-[20px]
                xl:py-[16px]
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-[11px]
                "
              >
                <div
                  className="
                    flex
                    h-[34px]
                    w-[34px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[8px]
                    bg-white
                    text-[#09379A]
                  "
                >
                  <Info
                    size={17}
                  />
                </div>

                <div>
                  <h3
                    className="
                      m-0
                      text-[13px]
                      font-bold
                      text-[#1E293B]
                    "
                  >
                    ملاحظات اعتماد المشرف الأكاديمي
                  </h3>

                  <p
                    className="
                      m-0
                      mt-[4px]
                      text-[11px]
                      leading-[20px]
                      text-[#64748B]

                      sm:text-[12px]
                    "
                  >
                    يجب رفع التقارير الدورية كل يوم
                    خميس من نهاية الأسبوع لضمان
                    توثيق الساعات.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/student/reports"
                  )
                }
                className="
                  flex
                  w-fit
                  shrink-0
                  items-center
                  gap-[7px]
                  border-0
                  bg-transparent
                  p-0
                  text-[10px]
                  font-bold
                  text-[#09379A]

                  sm:text-[11px]
                "
              >
                دليل إعداد التقارير

                <ArrowLeft
                  size={14}
                />
              </button>
            </section>
          </div>
        
            <AcademicFooter audience="student" />
          </main>
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
  className = "",
}) {
  return (
    <article
      className={`
        flex
        min-h-[105px]
        items-center
        justify-between
        gap-[15px]
        rounded-[14px]
        border
        border-[#E2E8F0]
        bg-white
        px-[18px]
        py-[17px]
        shadow-[0_1px_2px_rgba(15,23,42,0.02)]

        ${className}
      `}
    >
      <div className="min-w-0">
        <p
          className="
            m-0
            text-[10px]
            font-medium
            text-[#94A3B8]

            sm:text-[11px]
          "
        >
          {label}
        </p>

        <h3
          className="
            m-0
            mt-[5px]
            text-[18px]
            font-bold
            leading-[28px]
            text-[#1E293B]

            sm:text-[19px]
          "
        >
          {value}
        </h3>

        <p
          className="
            m-0
            mt-[3px]
            text-[10px]
            leading-[17px]
            text-[#94A3B8]

            sm:text-[11px]
          "
        >
          {description}
        </p>
      </div>

      <div
        className="
          flex
          h-[42px]
          w-[42px]
          shrink-0
          items-center
          justify-center
          rounded-[10px]
          bg-[#EAF0FF]
          text-[#09379A]

          sm:h-[44px]
          sm:w-[44px]
        "
      >
        <Icon
          size={21}
          strokeWidth={1.8}
        />
      </div>
    </article>
  );
}

/* =========================================================
   WEEK BADGE
========================================================= */

function WeekBadge({
  week,
}) {
  return (
    <span
      className="
        inline-flex
        min-h-[34px]
        min-w-[46px]
        items-center
        justify-center
        rounded-[9px]
        bg-[#E9EEFF]
        px-[9px]
        text-[12px]
        font-bold
        text-[#09379A]

        sm:text-[13px]
      "
    >
      {week}
    </span>
  );
}

/* =========================================================
   OUTPUT BADGE
========================================================= */

function OutputBadge({
  text,
  final = false,
}) {
  return (
    <span
      className={`
        inline-flex
        min-h-[28px]
        max-w-full
        items-center
        gap-[6px]
        rounded-[7px]
        px-[10px]
        py-[5px]
        text-[10px]
        font-medium
        leading-[17px]

        ${
          final
            ? `
              bg-[#09379A]
              text-white
            `
            : `
              bg-[#EEF3FF]
              text-[#475569]
            `
        }
      `}
    >
      {final ? (
        <Check
          size={12}
          className="shrink-0"
        />
      ) : (
        <FileText
          size={12}
          className="shrink-0"
        />
      )}

      {text}
    </span>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
  type,
}) {
  const styles = {
    completed: {
      wrapper:
        "bg-[#ECFDF3] text-[#15803D]",

      dot:
        "bg-[#22C55E]",
    },

    progress: {
      wrapper:
        "bg-[#FFF0E8] text-[#EA580C]",

      dot:
        "bg-[#FF6B35]",
    },

    upcoming: {
      wrapper:
        "bg-[#F1F5F9] text-[#64748B]",

      dot:
        "bg-[#CBD5E1]",
    },
  };

  const current =
    styles[type] ||
    styles.upcoming;

  return (
    <span
      className={`
        inline-flex
        min-h-[25px]
        items-center
        gap-[6px]
        rounded-full
        px-[9px]
        text-[10px]
        font-bold

        ${current.wrapper}
      `}
    >
      <span
        className={`
          h-[6px]
          w-[6px]
          shrink-0
          rounded-full

          ${current.dot}
        `}
      />

      {status}
    </span>
  );
}