import AcademicFooter from "../../components/shared/AcademicFooter";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Download,
  FileText,
  GraduationCap,
  HelpCircle,
  Info,
  MessageCircle,
  Printer,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

export default function ApplicationStatus() {
  const navigate = useNavigate();
  const { id } = useParams();

  /* =========================================================
     APPLICATIONS DATA
  ========================================================= */

  const applications = {
    "TR-2025-045": {
      id: "TR-2025-045",

      opportunity:
        "تدريب في شركة القدس للاتصالات",

      organization:
        "شركة القدس للاتصالات (Paltel)",

      organizationShort:
        "شركة القدس للاتصالات",

      location:
        "غزة - الرمال الجنوبي",

      hours:
        "120 ساعة تدريبية",

      workType:
        "وجاهي (أيام الدوام الرسمي)",

      supervisor:
        "م. إياد النجار",

      major:
        "هندسة الاتصالات وشبكات الحاسوب",

      submittedAt:
        "2025/09/10",

      requestStatus:
        "waiting",

      currentStatus:
        "قيد المراجعة والتدقيق",

      supervisorNote:
        "الطالب مكتمل المتطلبات المبدئية، بانتظار ترشيحه كتاب التنسيب النهائي المشترك بين قسم تكنولوجيا المعلومات وإدارة التدريب في شركة القدس للاتصالات.",

      attachments: [
        "كشف العلامات الأكاديمي.pdf",
        "السيرة الذاتية (CV).pdf",
      ],

      timeline: [
        {
          number: 1,
          title: "تقديم الطلب",
          date: "2025/09/10",
          state: "completed",
        },
        {
          number: 2,
          title: "قيد المراجعة",
          date: "2025/09/12",
          state: "completed",
        },
        {
          number: 3,
          title: "قيد الانتظار",
          date: "2025/09/14",
          state: "current",
        },
        {
          number: 4,
          title: "تم القبول",
          date: "",
          state: "pending",
        },
      ],

      auditRows: [
        {
          date: "2025/09/10",

          action:
            "تقديم الطلب الأولي وتعبئة البيانات والمستندات",

          details:
            "تم رفع الطلب عبر البوابة الطلابية الإلكترونية واستيفاء الساعات الأكاديمية المطلوبة.",

          owner:
            "الطالب (أمل أحمد)",

          icon:
            GraduationCap,

          status:
            "مكتمل",

          type:
            "complete",
        },

        {
          date:
            "2025/09/12",

          action:
            "مراجعة وتدقيق المستندات وكشف العلامات",

          details:
            "تم التحقق من المعدل التراكمي وتطابق خطة المساقات المنجزة مع شروط التدريب الميداني.",

          owner:
            "مسؤول التدريب الميداني (أ. رامي محمود)",

          icon:
            Users,

          status:
            "مكتمل",

          type:
            "complete",
        },

        {
          date:
            "2025/09/14",

          action:
            "قيد الانتظار لموافقة رئيس القسم الأكاديمي والجهة",

          details:
            "المعاملة حاليا لدى المصادقة وتوقيع كتاب التنسيب الميداني المشترك.",

          owner:
            "رئيس القسم الأكاديمي (د. سمير خليل)",

          icon:
            Building2,

          status:
            "قيد الانتظار",

          type:
            "waiting",
        },
      ],
    },

    "TR-2025-031": {
      id:
        "TR-2025-031",

      opportunity:
        "تدريب في شركة التقنية الحديثة",

      organization:
        "شركة التقنية الحديثة",

      organizationShort:
        "شركة التقنية الحديثة",

      location:
        "غزة - الرمال",

      hours:
        "100 ساعة تدريبية",

      workType:
        "وجاهي",

      supervisor:
        "م. أحمد سالم",

      major:
        "تقنية المعلومات",

      submittedAt:
        "2025/08/18",

      requestStatus:
        "accepted",

      currentStatus:
        "تم القبول النهائي",

      supervisorNote:
        "تم استكمال جميع إجراءات التدقيق والموافقة على ترشيح الطالب لبدء التدريب الميداني لدى الجهة المستضيفة.",

      attachments: [
        "كشف العلامات الأكاديمي.pdf",
        "السيرة الذاتية (CV).pdf",
      ],

      timeline: [
        {
          number: 1,
          title: "تقديم الطلب",
          date: "2025/08/18",
          state: "completed",
        },
        {
          number: 2,
          title: "قيد المراجعة",
          date: "2025/08/20",
          state: "completed",
        },
        {
          number: 3,
          title: "قيد الانتظار",
          date: "2025/08/22",
          state: "completed",
        },
        {
          number: 4,
          title: "تم القبول",
          date: "2025/08/25",
          state: "current",
        },
      ],

      auditRows: [
        {
          date:
            "2025/08/18",

          action:
            "تقديم الطلب",

          details:
            "تم تقديم طلب التدريب وإرفاق المستندات المطلوبة.",

          owner:
            "الطالب",

          icon:
            GraduationCap,

          status:
            "مكتمل",

          type:
            "complete",
        },

        {
          date:
            "2025/08/20",

          action:
            "مراجعة المستندات",

          details:
            "تمت مراجعة البيانات الأكاديمية والمرفقات.",

          owner:
            "مسؤول التدريب الميداني",

          icon:
            Users,

          status:
            "مكتمل",

          type:
            "complete",
        },

        {
          date:
            "2025/08/25",

          action:
            "اعتماد الطلب النهائي",

          details:
            "تم اعتماد طلب التدريب وقبول الطالب لدى الجهة المستضيفة.",

          owner:
            "رئيس القسم الأكاديمي",

          icon:
            Building2,

          status:
            "مكتمل",

          type:
            "complete",
        },
      ],
    },

    "TR-2025-018": {
      id:
        "TR-2025-018",

      opportunity:
        "تدريب في مركز فلسطين للتطوير",

      organization:
        "مركز فلسطين للتطوير",

      organizationShort:
        "مركز فلسطين للتطوير",

      location:
        "غزة",

      hours:
        "90 ساعة تدريبية",

      workType:
        "وجاهي",

      supervisor:
        "أ. محمد خليل",

      major:
        "تقنية المعلومات",

      submittedAt:
        "2025/07/12",

      requestStatus:
        "revision",

      currentStatus:
        "مطلوب تعديل المستندات",

      supervisorNote:
        "يرجى إعادة رفع نسخة واضحة من كشف العلامات الأكاديمي حتى يتم استكمال إجراءات المراجعة.",

      attachments: [
        "كشف العلامات الأكاديمي.pdf",
      ],

      timeline: [
        {
          number: 1,
          title: "تقديم الطلب",
          date: "2025/07/12",
          state: "completed",
        },
        {
          number: 2,
          title: "قيد المراجعة",
          date: "2025/07/15",
          state: "current",
        },
        {
          number: 3,
          title: "قيد الانتظار",
          date: "",
          state: "pending",
        },
        {
          number: 4,
          title: "تم القبول",
          date: "",
          state: "pending",
        },
      ],

      auditRows: [
        {
          date:
            "2025/07/12",

          action:
            "تقديم الطلب",

          details:
            "تم تقديم الطلب وإرفاق المستندات المطلوبة.",

          owner:
            "الطالب",

          icon:
            GraduationCap,

          status:
            "مكتمل",

          type:
            "complete",
        },

        {
          date:
            "2025/07/15",

          action:
            "مراجعة كشف العلامات",

          details:
            "تعذر اعتماد كشف العلامات لعدم وضوح النسخة المرفوعة.",

          owner:
            "مسؤول التدريب الميداني",

          icon:
            Users,

          status:
            "مطلوب تعديل",

          type:
            "revision",
        },
      ],
    },
  };

  /* =========================================================
     CURRENT APPLICATION
  ========================================================= */

  const application =
    applications[id] ||
    applications["TR-2025-045"];

  const requestStatus =
    application.requestStatus;

  const timeline =
    application.timeline;

  const auditRows =
    application.auditRows;

  /* =========================================================
     FINAL STATES
  ========================================================= */

  const finalStates = {
    waiting: {
      label:
        "بانتظار القرار النهائي",

      title:
        "طلبك لا يزال قيد الاعتماد النهائي",

      description:
        "تم الانتهاء من المراجعة والتدقيق، والطلب حاليا بانتظار المصادقة النهائية من القسم الأكاديمي والجهة المستضيفة.",

      icon:
        Clock3,

      accent:
        "#D97706",

      background:
        "#FFF8ED",

      border:
        "#F8DDB6",
    },

    accepted: {
      label:
        "تم القبول النهائي",

      title: `تهانينا! تم قبول طلب تدريبك رسميا لدى ${application.organizationShort}`,

      description:
        "تم استكمال جميع مراحل الاعتماد. يمكنك الآن الانتقال إلى صفحة تفاصيل القبول للاطلاع على موعد التدريب والمشرف والخطوات القادمة.",

      icon:
        CheckCircle2,

      accent:
        "#16A34A",

      background:
        "#F0FDF4",

      border:
        "#BBF7D0",
    },

    revision: {
      label:
        "مطلوب مراجعة",

      title:
        "طلبك بحاجة لتعديل المرفقات الرسمية قبل المتابعة",

      description:
        "يرجى إعادة رفع المستند المطلوب بصورة واضحة ومختومة حتى تتمكن لجنة التدريب الميداني من استكمال إجراءات الاعتماد.",

      icon:
        XCircle,

      accent:
        "#DC2626",

      background:
        "#FFF1F2",

      border:
        "#FECDD3",
    },
  };

  const currentDecision =
    finalStates[requestStatus] ||
    finalStates.waiting;

  const DecisionIcon =
    currentDecision.icon;

  /* =========================================================
     TOP STATUS
  ========================================================= */

  const topStatus = {
    waiting: {
      text:
        "الطلب قيد الانتظار الآن",

      className:
        "bg-[#FFF2E8] text-[#F97316]",

      dot:
        "bg-[#F97316]",
    },

    accepted: {
      text:
        "تم قبول الطلب",

      className:
        "bg-[#ECFDF3] text-[#16844C]",

      dot:
        "bg-[#10B981]",
    },

    revision: {
      text:
        "الطلب يحتاج تعديل",

      className:
        "bg-[#FFF1F2] text-[#DC2626]",

      dot:
        "bg-[#EF4444]",
    },
  };

  const currentTopStatus =
    topStatus[requestStatus];

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
      <Sidebar />

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
        <div className="relative shrink-0">
          <Header />
        </div>

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
              className="
                mb-3
                flex
                flex-wrap
                items-center
                gap-[7px]
                text-[12px]
                font-medium

                sm:text-[13px]
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

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/student/applications"
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
                طلباتي
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
                متابعة حالة الطلب
              </span>
            </nav>

            {/* =================================================
                TRACKING TIMELINE
            ================================================== */}

            <section
              className="
                rounded-[14px]
                border
                border-[#E2E8F0]
                bg-white
                p-4

                sm:p-5

                xl:px-[28px]
                xl:py-[25px]
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  <h1
                    className="
                      m-0
                      text-[21px]
                      font-bold
                      leading-[32px]
                      text-[#14213D]

                      sm:text-[23px]

                      xl:text-[25px]
                    "
                  >
                    مسار مراحل الاعتماد والتدقيق
                  </h1>

                  <p
                    dir="ltr"
                    className="
                      m-0
                      mt-[3px]
                      text-right
                      text-[11px]
                      font-semibold
                      text-[#94A3B8]

                      sm:text-[12px]
                    "
                  >
                    #{application.id}
                  </p>
                </div>

                <span
                  className={`
                    flex
                    min-h-[30px]
                    w-fit
                    items-center
                    gap-[7px]
                    rounded-full
                    px-[12px]
                    text-[11px]
                    font-semibold

                    sm:text-[12px]

                    ${currentTopStatus.className}
                  `}
                >
                  <span
                    className={`
                      h-[7px]
                      w-[7px]
                      shrink-0
                      rounded-full

                      ${currentTopStatus.dot}
                    `}
                  />

                  {currentTopStatus.text}
                </span>
              </div>

              {/* TIMELINE */}

              <div
                className="
                  mt-7
                  overflow-x-auto
                  pb-2

                  sm:mt-8
                "
              >
                <div
                  className="
                    relative
                    min-w-[660px]

                    sm:min-w-0
                  "
                >
                  {/* BASE LINE */}

                  <div
                    className="
                      absolute
                      left-[12%]
                      right-[12%]
                      top-[24px]
                      z-0
                      h-[4px]
                      rounded-full
                      bg-[#DCE5F2]
                    "
                  />

                  {/* SEGMENT 1 */}

                  {timeline[1]?.state !==
                    "pending" && (
                    <div
                      className="
                        absolute
                        right-[12%]
                        top-[24px]
                        z-[1]
                        h-[4px]
                        w-[25.5%]
                        bg-[#09379A]
                      "
                    />
                  )}

                  {/* SEGMENT 2 */}

                  {timeline[2]?.state !==
                    "pending" && (
                    <div
                      className="
                        absolute
                        right-[37.5%]
                        top-[24px]
                        z-[1]
                        h-[4px]
                        w-[25.5%]
                        bg-[#09379A]
                      "
                    />
                  )}

                  {/* SEGMENT 3 */}

                  {timeline[3]?.state !==
                    "pending" && (
                    <div
                      className="
                        absolute
                        right-[63%]
                        top-[24px]
                        z-[1]
                        h-[4px]
                        w-[25%]
                        bg-[#09379A]
                      "
                    />
                  )}

                  <div
                    className="
                      relative
                      z-10
                      grid
                      grid-cols-4
                    "
                  >
                    {timeline.map(
                      (step) => {
                        const isCompleted =
                          step.state ===
                          "completed";

                        const isCurrent =
                          step.state ===
                          "current";

                        const isPending =
                          step.state ===
                          "pending";

                        return (
                          <div
                            key={step.number}
                            className="
                              flex
                              min-w-0
                              flex-col
                              items-center
                              px-1
                              text-center
                            "
                          >
                            {/* CIRCLE */}

                            <div
                              className={`
                                relative
                                z-20
                                flex
                                h-[48px]
                                w-[48px]
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                text-[14px]
                                font-bold

                                ${
                                  isCompleted
                                    ? `
                                      border-[4px]
                                      border-[#DCE7FF]
                                      bg-[#09379A]
                                      text-white
                                      shadow-[0_3px_10px_rgba(9,55,154,0.18)]
                                    `
                                    : isCurrent
                                    ? `
                                      border-[3px]
                                      border-[#09379A]
                                      bg-white
                                      text-[#09379A]
                                      shadow-[0_0_0_6px_#E7EEFF]
                                    `
                                    : `
                                      border-[2px]
                                      border-[#CBD5E1]
                                      bg-white
                                      text-[#94A3B8]
                                    `
                                }
                              `}
                            >
                              {isCompleted ? (
                                <Check
                                  size={20}
                                  strokeWidth={2.5}
                                />
                              ) : isCurrent ? (
                                <>
                                  <span
                                    className="
                                      text-[15px]
                                      font-bold
                                      leading-none
                                    "
                                  >
                                    {step.number}
                                  </span>

                                  <span
                                    className="
                                      absolute
                                      bottom-[5px]
                                      h-[6px]
                                      w-[6px]
                                      rounded-full
                                      bg-[#F97316]
                                    "
                                  />
                                </>
                              ) : (
                                step.number
                              )}
                            </div>

                            {/* STEP TITLE */}

                            <h3
                              className={`
                                m-0
                                mt-[11px]
                                text-[13px]
                                font-bold
                                leading-[20px]

                                sm:text-[14px]
                                sm:leading-[22px]

                                ${
                                  isCurrent
                                    ? "text-[#09379A]"
                                    : isPending
                                    ? "text-[#64748B]"
                                    : "text-[#1E293B]"
                                }
                              `}
                            >
                              {step.title}
                            </h3>

                            {/* DATE */}

                            {step.date ? (
                              <span
                                dir="ltr"
                                className="
                                  mt-[4px]
                                  text-[11px]
                                  font-medium
                                  leading-[18px]
                                  text-[#94A3B8]

                                  sm:text-[12px]
                                "
                              >
                                {step.date}
                              </span>
                            ) : (
                              <span
                                className="
                                  mt-[4px]
                                  h-[18px]
                                "
                              />
                            )}

                            {/* COMPLETED LABEL */}

                            {isCompleted && (
                              <span
                                className="
                                  mt-[6px]
                                  inline-flex
                                  min-h-[26px]
                                  items-center
                                  gap-[6px]
                                  rounded-full
                                  bg-[#ECFDF3]
                                  px-[10px]
                                  text-[11px]
                                  font-bold
                                  text-[#15803D]

                                  sm:text-[12px]
                                "
                              >
                                <span
                                  className="
                                    h-[6px]
                                    w-[6px]
                                    rounded-full
                                    bg-[#22C55E]
                                  "
                                />

                                مكتمل
                              </span>
                            )}

                            {/* CURRENT LABEL */}

                            {isCurrent && (
                              <span
                                className="
                                  mt-[6px]
                                  inline-flex
                                  min-h-[26px]
                                  items-center
                                  gap-[6px]
                                  rounded-full
                                  bg-[#FFF1E8]
                                  px-[10px]
                                  text-[11px]
                                  font-bold
                                  text-[#EA580C]

                                  sm:text-[12px]
                                "
                              >
                                <span
                                  className="
                                    h-[6px]
                                    w-[6px]
                                    rounded-full
                                    bg-[#F97316]
                                  "
                                />

                                المرحلة الحالية
                              </span>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                PAGE TITLE + ACTIONS
            ================================================== */}

            <section
              className="
                mt-6
                flex
                flex-col
                gap-4

                md:flex-row
                md:items-start
                md:justify-between

                xl:mt-[28px]
              "
            >
              <div>
                <h2
                  className="
                    m-0
                    text-[21px]
                    font-bold
                    leading-[31px]
                    text-[#14213D]

                    sm:text-[22px]

                    xl:text-[24px]
                  "
                >
                  متابعة حالة الطلب
                </h2>

                <p
                  className="
                    m-0
                    mt-[6px]
                    max-w-[760px]
                    text-[13px]
                    font-normal
                    leading-[24px]
                    text-[#64748B]

                    sm:text-[14px]
                    sm:leading-[26px]
                  "
                >
                  تتبع مسار طلب التدريب الميداني
                  والاعتمادات الأكاديمية والمؤسسية
                  في الوقت الفعلي
                </p>
              </div>

              <div
                className="
                  flex
                  flex-wrap
                  gap-[10px]
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    window.print()
                  }
                  className="
                    flex
                    h-[38px]
                    items-center
                    gap-[7px]
                    rounded-[8px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    px-[13px]
                    text-[11px]
                    font-bold
                    text-[#334155]

                    hover:bg-[#F8FAFC]
                  "
                >
                  <Printer size={15} />

                  طباعة الإشعار
                </button>

                <button
                  type="button"
                  className="
                    flex
                    h-[38px]
                    items-center
                    gap-[7px]
                    rounded-[8px]
                    border-0
                    bg-[#09379A]
                    px-[13px]
                    text-[11px]
                    font-bold
                    text-white

                    hover:bg-[#072E81]
                  "
                >
                  <HelpCircle size={15} />

                  تواصل مع المشرف
                </button>
              </div>
            </section>

            {/* =================================================
                DETAILS GRID
            ================================================== */}

            <section
              dir="ltr"
              className="
                mt-5
                grid
                grid-cols-1
                items-start
                gap-4

                lg:grid-cols-[300px_minmax(0,1fr)]

                xl:grid-cols-[320px_minmax(0,1fr)]
                xl:gap-5
              "
            >
              {/* LEFT */}

              <div
                dir="rtl"
                className="
                  flex
                  min-w-0
                  flex-col
                  gap-4
                "
              >
                {/* ORGANIZATION */}

                <article
                  className="
                    rounded-[14px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    p-4
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
                        h-[42px]
                        w-[42px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-[8px]
                        bg-[#EDF3FF]
                        text-[#09379A]
                      "
                    >
                      <Building2
                        size={21}
                      />
                    </div>

                    <div className="min-w-0">
                      <h3
                        className="
                          m-0
                          text-[15px]
                          font-bold
                          text-[#1E293B]
                        "
                      >
                        {
                          application.organizationShort
                        }
                      </h3>

                      <p
                        className="
                          m-0
                          mt-[4px]
                          text-[11px]
                          leading-[18px]
                          text-[#64748B]
                        "
                      >
                        الشريك الأكاديمي المعتمد
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      mt-4
                      flex
                      flex-col
                      gap-[11px]
                    "
                  >
                    <DetailRow
                      label="المدينة / المقر"
                      value={
                        application.location
                      }
                    />

                    <DetailRow
                      label="ساعات التدريب"
                      value={
                        application.hours
                      }
                      accent
                    />

                    <DetailRow
                      label="طبيعة الدوام"
                      value={
                        application.workType
                      }
                    />
                  </div>

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-[10px]
                      rounded-[8px]
                      bg-[#EFF4FF]
                      px-3
                      py-[10px]
                    "
                  >
                    <div
                      className="
                        flex
                        h-[30px]
                        w-[30px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#09379A]
                        text-white
                      "
                    >
                      <UserRound
                        size={14}
                      />
                    </div>

                    <div>
                      <span
                        className="
                          block
                          text-[10px]
                          leading-[16px]
                          text-[#64748B]
                        "
                      >
                        المشرف الميداني المعتمد
                      </span>

                      <strong
                        className="
                          mt-[2px]
                          block
                          text-[12px]
                          text-[#1E293B]
                        "
                      >
                        {
                          application.supervisor
                        }
                      </strong>
                    </div>
                  </div>
                </article>

                {/* ATTACHMENTS */}

                <article
                  className="
                    rounded-[14px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-[8px]
                    "
                  >
                    <ClipboardCheck
                      size={17}
                      className="text-[#09379A]"
                    />

                    <h3
                      className="
                        m-0
                        text-[13px]
                        font-bold
                        text-[#1E293B]
                      "
                    >
                      المستندات المرفقة بالطلب
                    </h3>
                  </div>

                  <div
                    className="
                      mt-3
                      flex
                      flex-col
                      gap-[7px]
                    "
                  >
                    {application.attachments.map(
                      (attachment) => (
                        <AttachmentRow
                          key={attachment}
                          name={attachment}
                        />
                      )
                    )}
                  </div>
                </article>
              </div>

              {/* RIGHT DETAILS */}

              <article
                dir="rtl"
                className="
                  min-w-0
                  rounded-[14px]
                  border
                  border-[#E2E8F0]
                  bg-white
                  p-4

                  sm:p-5
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    gap-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-[9px]
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
                      "
                    >
                      <ClipboardCheck
                        size={18}
                      />
                    </div>

                    <h3
                      className="
                        m-0
                        text-[16px]
                        font-bold
                        text-[#1E293B]
                      "
                    >
                      تفاصيل الطلب الأكاديمي
                    </h3>
                  </div>

                  <span
                    dir="ltr"
                    className="
                      flex
                      h-[25px]
                      w-fit
                      items-center
                      rounded-[6px]
                      bg-[#EFF4FF]
                      px-[9px]
                      text-[11px]
                      font-bold
                      text-[#09379A]
                    "
                  >
                    #{application.id}
                  </span>
                </div>

                <div
                  className="
                    mt-4
                    grid
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2

                    lg:grid-cols-3
                  "
                >
                  <InfoBox
                    label="رقم الطلب"
                    value={`#${application.id}`}
                    ltr
                  />

                  <InfoBox
                    label="حالة الطلب الحالية"
                  >
                    <CurrentStatusBadge
                      status={
                        requestStatus
                      }
                      label={
                        application.currentStatus
                      }
                    />
                  </InfoBox>

                  <InfoBox
                    label="تاريخ التقديم"
                    value={
                      application.submittedAt
                    }
                    ltr
                  />

                  <InfoBox
                    label="اسم الفرصة التدريبية"
                    value={
                      application.opportunity
                    }
                  />

                  <InfoBox
                    label="جهة التدريب المستضيفة"
                    value={
                      application.organization
                    }
                  />

                  <InfoBox
                    label="التخصص الأكاديمي والمسار"
                  >
                    <span
                      className="
                        mt-[6px]
                        inline-flex
                        min-h-[28px]
                        max-w-full
                        items-center
                        gap-[6px]
                        rounded-[7px]
                        bg-[#DFF8FE]
                        px-[9px]
                        py-[5px]
                        text-[11px]
                        font-bold
                        leading-[17px]
                        text-[#0E7490]
                      "
                    >
                      <GraduationCap
                        size={13}
                        className="shrink-0"
                      />

                      {application.major}
                    </span>
                  </InfoBox>
                </div>

                <div
                  className="
                    mt-3
                    rounded-[9px]
                    bg-[#F7F9FC]
                    px-4
                    py-[14px]
                  "
                >
                  <p
                    className="
                      m-0
                      text-[11px]
                      font-medium
                      text-[#64748B]
                    "
                  >
                    الملاحظات الموجهة من المشرف الميداني
                  </p>

                  <p
                    className="
                      m-0
                      mt-[7px]
                      text-[12px]
                      leading-[22px]
                      text-[#475569]

                      sm:text-[13px]
                      sm:leading-[23px]
                    "
                  >
                    {
                      application.supervisorNote
                    }
                  </p>
                </div>
              </article>
            </section>

            {/* =================================================
                AUDIT TABLE
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
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3

                  sm:flex-row
                  sm:items-start
                  sm:justify-between
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-[9px]
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
                    <ShieldCheck
                      size={18}
                    />
                  </div>

                  <div>
                    <h2
                      className="
                        m-0
                        text-[16px]
                        font-bold
                        text-[#1E293B]
                      "
                    >
                      جدول المراجعات وسجل التدقيق
                    </h2>

                    <p
                      className="
                        m-0
                        mt-[4px]
                        text-[11px]
                        leading-[18px]
                        text-[#64748B]
                      "
                    >
                      السجل الزمني لكافة الموافقات
                      والإجراءات
                    </p>
                  </div>
                </div>

                <span
                  className="
                    flex
                    min-h-[25px]
                    w-fit
                    items-center
                    rounded-full
                    bg-[#F1F5F9]
                    px-[10px]
                    text-[11px]
                    text-[#64748B]
                  "
                >
                  {auditRows.length} سجلات تدقيق
                </span>
              </div>

              <div
                className="
                  mt-4
                  overflow-x-auto
                "
              >
                <table
                  className="
                    w-full
                    min-w-[760px]
                    border-collapse
                  "
                >
                  <thead>
                    <tr
                      className="
                        bg-[#EFF3FB]
                      "
                    >
                      <TableHead>
                        التاريخ
                      </TableHead>

                      <TableHead>
                        الإجراء والبيان التدقيقي
                      </TableHead>

                      <TableHead>
                        المسؤول عن الاعتماد
                      </TableHead>

                      <TableHead>
                        حالة الإجراء
                      </TableHead>
                    </tr>
                  </thead>

                  <tbody>
                    {auditRows.map(
                      (row) => {
                        const RowIcon =
                          row.icon;

                        return (
                          <tr
                            key={
                              row.date +
                              row.action
                            }
                            className="
                              border-b
                              border-[#EEF2F7]

                              last:border-b-0
                            "
                          >
                            <td
                              dir="ltr"
                              className="
                                px-3
                                py-[15px]
                                text-[11px]
                                text-[#64748B]
                              "
                            >
                              {row.date}
                            </td>

                            <td
                              className="
                                px-3
                                py-[15px]
                              "
                            >
                              <strong
                                className="
                                  block
                                  text-[12px]
                                  leading-[19px]
                                  text-[#334155]
                                "
                              >
                                {row.action}
                              </strong>

                              <span
                                className="
                                  mt-[4px]
                                  block
                                  max-w-[370px]
                                  text-[11px]
                                  leading-[19px]
                                  text-[#64748B]
                                "
                              >
                                {row.details}
                              </span>
                            </td>

                            <td
                              className="
                                px-3
                                py-[15px]
                              "
                            >
                              <div
                                className="
                                  flex
                                  items-center
                                  gap-[7px]
                                  text-[11px]
                                  leading-[19px]
                                  text-[#334155]
                                "
                              >
                                <RowIcon
                                  size={14}
                                  className="
                                    shrink-0
                                    text-[#09379A]
                                  "
                                />

                                {row.owner}
                              </div>
                            </td>

                            <td
                              className="
                                px-3
                                py-[15px]
                              "
                            >
                              <AuditStatus
                                type={
                                  row.type
                                }
                                label={
                                  row.status
                                }
                              />
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* =================================================
                FINAL DECISION
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
              "
            >
              <h2
                className="
                  m-0
                  text-[17px]
                  font-bold
                  text-[#1E293B]
                "
              >
                حالة القرار النهائي
              </h2>

              <p
                className="
                  m-0
                  mt-[4px]
                  text-[11px]
                  leading-[18px]
                  text-[#64748B]
                "
              >
                تظهر هنا الحالة الفعلية للطلب بحسب
                نتيجة المراجعة والاعتماد
              </p>

              <div
                style={{
                  backgroundColor:
                    currentDecision.background,

                  borderColor:
                    currentDecision.border,
                }}
                className="
                  mt-4
                  flex
                  flex-col
                  gap-4
                  rounded-[12px]
                  border
                  p-4

                  sm:flex-row
                  sm:items-start
                "
              >
                <div
                  style={{
                    backgroundColor:
                      currentDecision.accent,
                  }}
                  className="
                    flex
                    h-[45px]
                    w-[45px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-white
                  "
                >
                  <DecisionIcon
                    size={21}
                  />
                </div>

                <div
                  className="
                    min-w-0
                    flex-1
                  "
                >
                  <span
                    style={{
                      color:
                        currentDecision.accent,
                    }}
                    className="
                      inline-flex
                      min-h-[25px]
                      items-center
                      rounded-full
                      bg-white/70
                      px-[9px]
                      text-[11px]
                      font-bold
                    "
                  >
                    {
                      currentDecision.label
                    }
                  </span>

                  <h3
                    className="
                      m-0
                      mt-[8px]
                      text-[15px]
                      font-bold
                      leading-[24px]
                      text-[#1E293B]
                    "
                  >
                    {
                      currentDecision.title
                    }
                  </h3>

                  <p
                    className="
                      m-0
                      mt-[6px]
                      max-w-[720px]
                      text-[12px]
                      leading-[22px]
                      text-[#64748B]

                      sm:text-[13px]
                      sm:leading-[23px]
                    "
                  >
                    {
                      currentDecision.description
                    }
                  </p>

                  {/* ACCEPTED */}

                  {requestStatus ===
                    "accepted" && (
                    <div
                      className="
                        mt-4
                        flex
                        flex-col
                        gap-[9px]

                        min-[480px]:flex-row
                        min-[480px]:flex-wrap
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/student/applications/${application.id}/accepted`
                          )
                        }
                        className="
                          flex
                          h-[38px]
                          items-center
                          justify-center
                          gap-[7px]
                          rounded-[8px]
                          border-0
                          bg-[#09379A]
                          px-[15px]
                          text-[11px]
                          font-bold
                          text-white

                          hover:bg-[#072E81]
                        "
                      >
                        عرض تفاصيل القبول

                        <ArrowLeft
                          size={14}
                        />
                      </button>

                      <button
                        type="button"
                        className="
                          flex
                          h-[38px]
                          items-center
                          justify-center
                          gap-[7px]
                          rounded-[8px]
                          border
                          border-[#D7DEE9]
                          bg-white
                          px-[13px]
                          text-[11px]
                          font-bold
                          text-[#334155]
                        "
                      >
                        <Download
                          size={14}
                        />

                        تحميل كتاب التنسيب
                      </button>

                      <button
                        type="button"
                        className="
                          flex
                          h-[38px]
                          items-center
                          justify-center
                          gap-[7px]
                          rounded-[8px]
                          border
                          border-[#D7DEE9]
                          bg-white
                          px-[13px]
                          text-[11px]
                          font-bold
                          text-[#334155]
                        "
                      >
                        <CalendarDays
                          size={14}
                        />

                        الجدول الزمني
                      </button>
                    </div>
                  )}

                  {/* REVISION */}

                  {requestStatus ===
                    "revision" && (
                    <div
                      className="
                        mt-4
                        flex
                        flex-col
                        gap-[9px]

                        min-[480px]:flex-row
                        min-[480px]:flex-wrap
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            "/student/apply-training/documents"
                          )
                        }
                        className="
                          flex
                          h-[38px]
                          items-center
                          justify-center
                          gap-[7px]
                          rounded-[8px]
                          border-0
                          bg-[#09379A]
                          px-[13px]
                          text-[11px]
                          font-bold
                          text-white
                        "
                      >
                        <RefreshCw
                          size={14}
                        />

                        إعادة رفع المستند
                      </button>

                      <button
                        type="button"
                        className="
                          flex
                          h-[38px]
                          items-center
                          justify-center
                          gap-[7px]
                          rounded-[8px]
                          border
                          border-[#D7DEE9]
                          bg-white
                          px-[13px]
                          text-[11px]
                          font-bold
                          text-[#334155]
                        "
                      >
                        <Info
                          size={14}
                        />

                        استفسار
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* =================================================
                HELP BAR
            ================================================== */}

            <section
              className="
                mt-5
                flex
                min-h-[66px]
                flex-col
                gap-4
                rounded-[10px]
                bg-[#09379A]
                px-4
                py-4
                text-white

                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-[10px]

                  sm:items-center
                "
              >
                <div
                  className="
                    flex
                    h-[32px]
                    w-[32px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                  "
                >
                  <Info
                    size={16}
                  />
                </div>

                <div>
                  <h3
                    className="
                      m-0
                      text-[11px]
                      font-bold
                    "
                  >
                    هل لديك استفسار بخصوص مراحل
                    الاعتماد والفرز؟
                  </h3>

                  <p
                    className="
                      m-0
                      mt-[4px]
                      text-[11px]
                      leading-[19px]
                      text-white/75
                    "
                  >
                    قسم التدريب الميداني متاح يوميا
                    من 8:00 صباحا حتى 2:00 ظهرا
                    لمراجعة المعاملات المتعثرة.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="
                  flex
                  h-[36px]
                  w-full
                  items-center
                  justify-center
                  gap-[6px]
                  rounded-[7px]
                  border-0
                  bg-white
                  px-[12px]
                  text-[11px]
                  font-bold
                  text-[#09379A]

                  sm:w-auto
                "
              >
                <MessageCircle
                  size={13}
                />

                دليل الطالب الميداني
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
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
  accent = false,
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-[12px]
      "
    >
      <span
        className="
          shrink-0
          text-[11px]
          leading-[19px]
          text-[#64748B]
        "
      >
        {label}
      </span>

      <strong
        className={`
          text-left
          text-[11px]
          font-bold
          leading-[19px]

          ${
            accent
              ? "text-[#09379A]"
              : "text-[#334155]"
          }
        `}
      >
        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   ATTACHMENT ROW
========================================================= */

function AttachmentRow({
  name,
}) {
  return (
    <button
      type="button"
      className="
        flex
        min-h-[38px]
        w-full
        items-center
        justify-between
        gap-[8px]
        rounded-[6px]
        border
        border-[#EEF2F7]
        bg-[#F8FAFC]
        px-[10px]
        py-[7px]
        text-[11px]
        text-[#334155]

        hover:border-[#D7E0EC]
      "
    >
      <span
        className="
          flex
          min-w-0
          items-center
          gap-[7px]
        "
      >
        <FileText
          size={14}
          className="
            shrink-0
            text-[#09379A]
          "
        />

        <span className="truncate">
          {name}
        </span>
      </span>

      <CheckCircle2
        size={14}
        className="
          shrink-0
          text-[#F97316]
        "
      />
    </button>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  label,
  value,
  children,
  ltr = false,
}) {
  return (
    <div
      className="
        min-w-0
        rounded-[9px]
        bg-[#F8FAFC]
        px-[13px]
        py-[12px]
      "
    >
      <p
        className="
          m-0
          text-[10px]
          font-medium
          leading-[17px]
          text-[#94A3B8]
        "
      >
        {label}
      </p>

      {children ? (
        children
      ) : (
        <strong
          dir={
            ltr
              ? "ltr"
              : "rtl"
          }
          className="
            mt-[6px]
            block
            text-[12px]
            font-bold
            leading-[20px]
            text-[#334155]
          "
        >
          {value}
        </strong>
      )}
    </div>
  );
}

/* =========================================================
   CURRENT STATUS
========================================================= */

function CurrentStatusBadge({
  status,
  label,
}) {
  const design = {
    waiting: {
      wrapper:
        "bg-[#DFF8FE] text-[#0E7490]",

      dot:
        "bg-[#06B6D4]",
    },

    accepted: {
      wrapper:
        "bg-[#ECFDF3] text-[#16844C]",

      dot:
        "bg-[#10B981]",
    },

    revision: {
      wrapper:
        "bg-[#FFF1F2] text-[#DC2626]",

      dot:
        "bg-[#EF4444]",
    },
  };

  const current =
    design[status] ||
    design.waiting;

  return (
    <span
      className={`
        mt-[6px]
        inline-flex
        min-h-[26px]
        items-center
        gap-[6px]
        rounded-full
        px-[9px]
        text-[11px]
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

      {label}
    </span>
  );
}

/* =========================================================
   AUDIT STATUS
========================================================= */

function AuditStatus({
  type,
  label,
}) {
  const isComplete =
    type === "complete";

  const isRevision =
    type === "revision";

  return (
    <span
      className={`
        inline-flex
        min-h-[26px]
        items-center
        gap-[6px]
        rounded-full
        px-[10px]
        text-[11px]
        font-bold

        ${
          isComplete
            ? `
              bg-[#ECFDF3]
              text-[#16844C]
            `
            : isRevision
            ? `
              bg-[#FFF1F2]
              text-[#DC2626]
            `
            : `
              bg-[#FFF0E7]
              text-[#D97706]
            `
        }
      `}
    >
      {isComplete ? (
        <CheckCircle2
          size={12}
        />
      ) : isRevision ? (
        <XCircle
          size={12}
        />
      ) : (
        <Clock3
          size={12}
        />
      )}

      {label}
    </span>
  );
}

/* =========================================================
   TABLE HEAD
========================================================= */

function TableHead({
  children,
}) {
  return (
    <th
      className="
        px-3
        py-[11px]
        text-right
        text-[11px]
        font-semibold
        text-[#64748B]
      "
    >
      {children}
    </th>
  );
}