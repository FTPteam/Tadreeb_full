import AcademicFooter from "../../components/shared/AcademicFooter";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Info,
  Mail,
  MapPin,
  Printer,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

export default function TrainingAccepted() {
  const navigate = useNavigate();
  const { id } = useParams();

  /* =========================================================
     ACCEPTED APPLICATION DATA
     Front-End Mock Data
     لاحقا تأتي من الـ API حسب id
  ========================================================= */

  const acceptedApplications = {
    "TR-2025-031": {
      id: "TR-2025-031",
      placementNumber: "TRN-2025-0844",
      reference: "AXZ-844",

      organizationName: "شركة القدس للاتصالات",
      organizationCode: "PAL-TEL-GZ-2025",
      category: "هندسة شبكات",

      description:
        "تدريب ميداني متخصص في مجال هندسة الاتصالات والبنية التحتية للشبكات السلكية واللاسلكية وتقنيات الألياف الضوئية.",

      academicSupervisor: "د. أحمد محمود",
      academicSupervisorSub: "كلية الدراسات المتوسطة",

      fieldSupervisor: "م. سمير خليل",
      fieldSupervisorSub: "رئيس قسم الشبكات والتقنية",

      location: "غزة - الرمال",
      locationSub: "برج الأمل - ط 4",

      startDate: "2025/10/01",
      startDateSub: "الأربعاء 08:30 ص",

      endDate: "2025/12/01",
      endDateSub: "التاريخ المتوقع للفصل",

      duration: "8 أسابيع",
      hours: 120,

      address:
        "شارع عمر المختار - مفترق الرمال",

      student: {
        name: "أمل أحمد سعيد",
        number: "145892023",
        major: "علوم شبكات وتكنولوجيا",
        college:
          "كلية الدراسات المتوسطة - جامعة الأزهر",
      },
    },
  };

  const application =
    acceptedApplications[id] ||
    acceptedApplications["TR-2025-031"];

  /* =========================================================
     NEXT STEPS
  ========================================================= */

  const steps = [
    {
      id: 1,
      title: "توقيع اتفاقية التدريب",
      description:
        "تم الاعتماد والتوقيع الرسمي للطرفين",
      date: "2025/09/20",
      time: "11:24 ص",
      status: "completed",
    },
    {
      id: 2,
      title: "رفع المستندات المطلوبة",
      description:
        "تم تدقيق كشف العلامات والهوية الجامعية بنجاح",
      date: "2025/09/22",
      time: "02:15 م",
      status: "completed",
    },
    {
      id: 3,
      title: "إعداد خطة التدريب",
      description:
        "بانتظار الاجتماع مع المشرف الميداني لوضع ومصادقة المهام العملية",
      date: "2025/10/05",
      time: "",
      status: "current",
    },
    {
      id: 4,
      title: "مباشرة التدريب الميداني",
      description:
        "الموعد المجدول: 2025/10/01، تمام الساعة 08:30 صباحا بمقر الشركة.",
      date: "",
      time: "",
      status: "upcoming",
    },
  ];

  /* =========================================================
     HOURS
  ========================================================= */

  const hourDistribution = [
    {
      label: "التهيئة والتسجيل",
      hours: 30,
      width: "25%",
      color: "#163B8C",
    },
    {
      label: "المهام الميدانية",
      hours: 54,
      width: "45%",
      color: "#FF6B35",
    },
    {
      label: "المناقشة والتقييم",
      hours: 36,
      width: "30%",
      color: "#38BDF8",
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
                TOP BAR
            ================================================== */}
            <section
              className="
                flex
                flex-col
                gap-3

                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* BREADCRUMB */}
              <nav
                aria-label="مسار التنقل"
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-[7px]
                  text-[11px]
                  font-medium

                  sm:text-[12px]

                  xl:text-[13px]
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

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/student/applications/${application.id}/status`
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
                  متابعة حالة الطلب
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
                  قبول التدريب
                </span>
              </nav>

              {/* TOP ACTIONS */}
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    window.print()
                  }
                  className="
                    flex
                    h-[34px]
                    items-center
                    gap-[7px]
                    rounded-[8px]
                    border
                    border-[#D9E2EC]
                    bg-white
                    px-[12px]
                    text-[10px]
                    font-bold
                    text-[#334155]
                    transition

                    hover:bg-[#F8FAFC]
                  "
                >
                  <Printer size={14} />

                  طباعة الإشعار
                </button>

                <button
                  type="button"
                  className="
                    flex
                    h-[34px]
                    items-center
                    gap-[7px]
                    rounded-[8px]
                    border
                    border-[#D9E2EC]
                    bg-white
                    px-[12px]
                    text-[10px]
                    font-bold
                    text-[#334155]
                    transition

                    hover:bg-[#F8FAFC]
                  "
                >
                  <Download
                    size={14}
                    className="text-[#09379A]"
                  />

                  كتاب التنسيب (PDF)
                </button>
              </div>
            </section>

            {/* =================================================
                PAGE TITLE
            ================================================== */}
            <section
              className="
                mt-4
                flex
                flex-col
                gap-2

                sm:flex-row
                sm:items-start
                sm:justify-between
              "
            >
              <div>
                <h1
                  className="
                    m-0
                    text-[24px]
                    font-bold
                    leading-[35px]
                    text-[#09379A]

                    sm:text-[26px]

                    xl:text-[28px]
                    xl:leading-[40px]
                  "
                >
                  قبول التدريب
                </h1>

                <p
                  className="
                    m-0
                    mt-[2px]
                    text-[11px]
                    leading-[20px]
                    text-[#64748B]

                    sm:text-[12px]

                    xl:text-[13px]
                    xl:leading-[21px]
                  "
                >
                  تهانينا! تم اعتماد وترشيح ملفك
                  التدريبي رسميا لدى جهة التدريب
                  الشريكة.
                </p>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-[6px]
                  text-[9px]
                  text-[#64748B]
                "
              >
                <span
                  className="
                    h-[7px]
                    w-[7px]
                    rounded-full
                    bg-[#FF6B35]
                  "
                />

                إشعار رسمي معتمد
              </div>
            </section>

            {/* =================================================
                ACCEPTANCE BANNER
            ================================================== */}
            <section
              className="
                mt-5
                flex
                flex-col
                gap-5
                rounded-[14px]
                border
                border-[#CFE0FB]
                bg-[#F5F9FF]
                p-4

                sm:p-5

                md:flex-row
                md:items-center
                md:justify-between

                xl:px-[24px]
                xl:py-[20px]
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-start
                  gap-[14px]
                "
              >
                <div
                  className="
                    flex
                    h-[46px]
                    w-[46px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[10px]
                    bg-[#E4EEFF]
                    text-[#09379A]
                  "
                >
                  <ShieldCheck
                    size={23}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0">
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-[10px]
                    "
                  >
                    <h2
                      className="
                        m-0
                        text-[16px]
                        font-bold
                        text-[#1E293B]

                        sm:text-[17px]

                        xl:text-[18px]
                      "
                    >
                      تم قبولك في التدريب بنجاح
                    </h2>

                    <span
                      dir="ltr"
                      className="
                        flex
                        h-[23px]
                        items-center
                        rounded-[6px]
                        border
                        border-[#C7D7F7]
                        bg-[#EDF3FF]
                        px-[8px]
                        text-[9px]
                        font-medium
                        text-[#2563EB]
                      "
                    >
                      {application.placementNumber}
                    </span>
                  </div>

                  <p
                    className="
                      m-0
                      mt-[8px]
                      max-w-[620px]
                      text-[10px]
                      leading-[19px]
                      text-[#64748B]

                      sm:text-[11px]
                      sm:leading-[20px]
                    "
                  >
                    تهانينا! تم قبولك في فرصة التدريب.
                    يرجى الاطلاع على التفاصيل التالية
                    والبدء بإجراءات مباشرة التدريب
                    المعتمدة أكاديميا لمتابعة المهام في
                    الموعد المحدد.
                  </p>
                </div>
              </div>

              <div
                className="
                  shrink-0

                  md:text-left
                "
              >
                <button
                  type="button"
                  className="
                    flex
                    h-[36px]
                    w-full
                    items-center
                    justify-center
                    gap-[7px]
                    rounded-[8px]
                    border-0
                    bg-[#09379A]
                    px-[13px]
                    text-[10px]
                    font-bold
                    text-white
                    transition

                    hover:bg-[#072E81]

                    md:w-auto
                  "
                >
                  <ExternalLink size={14} />

                  معاينة التنسيب
                </button>

                <div
                  className="
                    mt-[7px]
                    flex
                    items-center
                    gap-[5px]
                    text-[8px]
                    font-bold
                    text-[#16A34A]
                  "
                >
                  <CheckCircle2 size={12} />

                  كتاب التنسيب معتمد وموقع رسميا
                </div>

                <p
                  dir="ltr"
                  className="
                    m-0
                    mt-[2px]
                    text-right
                    text-[7px]
                    text-[#94A3B8]
                  "
                >
                  REF: {application.reference}
                </p>
              </div>
            </section>

            {/* =================================================
                MAIN GRID
            ================================================== */}
            <section
              dir="ltr"
              className="
                mt-5
                grid
                grid-cols-1
                items-start
                gap-5

                lg:grid-cols-[315px_minmax(0,1fr)]

                xl:mt-[22px]
                xl:gap-[22px]
              "
            >
              {/* =================================================
                  LEFT COLUMN
              ================================================== */}
              <div
                dir="rtl"
                className="
                  flex
                  min-w-0
                  flex-col
                  gap-5
                "
              >
                {/* =============================================
                    NEXT STEPS
                ============================================== */}
                <section
                  className="
                    rounded-[14px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    p-4

                    xl:px-[18px]
                    xl:py-[18px]
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <div>
                      <h2
                        className="
                          m-0
                          text-[15px]
                          font-bold
                          text-[#1E293B]

                          xl:text-[16px]
                        "
                      >
                        خطواتك القادمة
                      </h2>

                      <p
                        className="
                          m-0
                          mt-[2px]
                          text-[9px]
                          leading-[16px]
                          text-[#94A3B8]
                        "
                      >
                        استكمل الإجراءات التالية
                        لبدء تدريبك رسميا
                      </p>
                    </div>

                    <div
                      className="
                        flex
                        h-[34px]
                        w-[34px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-[8px]
                        bg-[#F1F5F9]
                        text-[#64748B]
                      "
                    >
                      <FileText size={17} />
                    </div>
                  </div>

                  <div
                    className="
                      mt-4
                      flex
                      flex-col
                      gap-[9px]
                    "
                  >
                    {steps.map((step) => (
                      <article
                        key={step.id}
                        className={`
                          flex
                          items-start
                          gap-[10px]
                          rounded-[10px]
                          border
                          px-[12px]
                          py-[11px]

                          ${
                            step.status ===
                            "completed"
                              ? `
                                border-[#D5E2F5]
                                bg-[#F8FBFF]
                              `
                              : step.status ===
                                "current"
                              ? `
                                border-[#FDBA74]
                                bg-[#FFF7ED]
                              `
                              : `
                                border-[#E2E8F0]
                                bg-[#F8FAFC]
                              `
                          }
                        `}
                      >
                        <div
                          className={`
                            flex
                            h-[31px]
                            w-[31px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-full

                            ${
                              step.status ===
                              "completed"
                                ? `
                                  bg-[#0E4BB7]
                                  text-white
                                `
                                : step.status ===
                                  "current"
                                ? `
                                  bg-[#FF6B35]
                                  text-white
                                `
                                : `
                                  bg-[#E2E8F0]
                                  text-[#94A3B8]
                                `
                            }
                          `}
                        >
                          {step.status ===
                          "completed" ? (
                            <CheckCircle2
                              size={17}
                            />
                          ) : step.status ===
                            "current" ? (
                            <RefreshCw size={16} />
                          ) : (
                            <Clock3 size={15} />
                          )}
                        </div>

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-[8px]
                            "
                          >
                            <h3
                              className="
                                m-0
                                text-[10px]
                                font-bold
                                leading-[17px]
                                text-[#334155]

                                xl:text-[11px]
                              "
                            >
                              {step.id}. {step.title}
                            </h3>

                            <span
                              className={`
                                shrink-0
                                whitespace-nowrap
                                text-[8px]
                                font-bold

                                ${
                                  step.status ===
                                  "completed"
                                    ? "text-[#2563EB]"
                                    : step.status ===
                                      "current"
                                    ? "text-[#EA580C]"
                                    : "text-[#94A3B8]"
                                }
                              `}
                            >
                              {step.status ===
                              "completed"
                                ? "مكتمل"
                                : step.status ===
                                  "current"
                                ? "قيد المتابعة"
                                : "قادم"}
                            </span>
                          </div>

                          <p
                            className="
                              m-0
                              mt-[3px]
                              text-[8px]
                              leading-[14px]
                              text-[#64748B]
                            "
                          >
                            {step.description}
                          </p>

                          {(step.date ||
                            step.time) && (
                            <p
                              dir="ltr"
                              className="
                                m-0
                                mt-[4px]
                                text-right
                                text-[7px]
                                text-[#94A3B8]
                              "
                            >
                              {step.date}

                              {step.time &&
                                ` • ${step.time}`}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* =============================================
                    DIRECT ACTIONS
                ============================================== */}
                <section
                  className="
                    rounded-[14px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    p-4

                    xl:px-[18px]
                    xl:py-[18px]
                  "
                >
                  <span
                    className="
                      text-[8px]
                      text-[#94A3B8]
                    "
                  >
                    إجراء سريع
                  </span>

                  <h2
                    className="
                      m-0
                      mt-[4px]
                      text-[15px]
                      font-bold
                      text-[#1E293B]
                    "
                  >
                    الإجراءات المباشرة
                  </h2>

                  <p
                    className="
                      m-0
                      mt-[8px]
                      text-[9px]
                      leading-[17px]
                      text-[#64748B]
                    "
                  >
                    الانتقال الفوري إلى بيئة العمل
                    الميدانية ومتابعة المهام المعتمدة
                    والأنشطة الأسبوعية مع المشرف.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/student/training-profile"
                      )
                    }
                    className="
                      mt-[13px]
                      flex
                      h-[42px]
                      w-full
                      items-center
                      justify-center
                      gap-[8px]
                      rounded-[8px]
                      border-0
                      bg-[#09379A]
                      text-[11px]
                      font-bold
                      text-white
                      shadow-[0_3px_7px_rgba(9,55,154,0.18)]
                      transition

                      hover:bg-[#072E81]
                    "
                  >
                    الانتقال إلى ملف التدريب

                    <ArrowLeft size={15} />
                  </button>

                  <button
                    type="button"
                    className="
                      mt-[10px]
                      flex
                      min-h-[42px]
                      w-full
                      items-center
                      justify-center
                      gap-[8px]
                      rounded-[8px]
                      border
                      border-[#D9E2EC]
                      bg-white
                      px-[10px]
                      text-[10px]
                      font-bold
                      text-[#334155]
                      transition

                      hover:bg-[#F8FAFC]
                    "
                  >
                    <Download
                      size={14}
                      className="text-[#09379A]"
                    />

                    تحميل كتاب القبول والتنسيب الرسمي
                    (PDF)
                  </button>

                  <div
                    className="
                      mt-[11px]
                      flex
                      items-center
                      gap-[8px]
                      rounded-[8px]
                      border
                      border-[#E2E8F0]
                      bg-[#F8FAFC]
                      px-[11px]
                      py-[10px]
                    "
                  >
                    <Mail
                      size={15}
                      className="
                        shrink-0
                        text-[#09379A]
                      "
                    />

                    <div className="min-w-0">
                      <p
                        className="
                          m-0
                          text-[8px]
                          text-[#64748B]
                        "
                      >
                        لأي استفسار تواصل مع منسق
                        التدريب:
                      </p>

                      <p
                        dir="ltr"
                        className="
                          m-0
                          mt-[2px]
                          truncate
                          text-[9px]
                          font-bold
                          text-[#2563EB]
                        "
                      >
                        training@alazhar.edu.ps
                      </p>
                    </div>
                  </div>
                </section>

                {/* =============================================
                    STUDENT INFO
                ============================================== */}
                <section
                  className="
                    flex
                    items-center
                    justify-between
                    gap-[12px]
                    rounded-[14px]
                    border
                    border-[#CFE0FB]
                    bg-[#F3F8FF]
                    px-[17px]
                    py-[15px]
                  "
                >
                  <div className="min-w-0">
                    <h3
                      className="
                        m-0
                        text-[12px]
                        font-bold
                        text-[#1E293B]
                      "
                    >
                      {application.student.name}
                    </h3>

                    <p
                      className="
                        m-0
                        mt-[3px]
                        text-[8px]
                        leading-[15px]
                        text-[#64748B]
                      "
                    >
                      الرقم الجامعي:{" "}
                      {application.student.number} •{" "}
                      {application.student.major}
                    </p>

                    <p
                      className="
                        m-0
                        mt-[2px]
                        text-[8px]
                        text-[#09379A]
                      "
                    >
                      {application.student.college}
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-[36px]
                      w-[36px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#09379A]
                      text-white
                    "
                  >
                    <Info size={17} />
                  </div>
                </section>
              </div>

              {/* =================================================
                  RIGHT COLUMN
              ================================================== */}
              <div
                dir="rtl"
                className="
                  flex
                  min-w-0
                  flex-col
                  gap-[22px]
                "
              >
                {/* =============================================
                    ORGANIZATION DETAILS
                ============================================== */}
                <section
                  className="
                    rounded-[14px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    p-4

                    sm:p-5

                    xl:px-[22px]
                    xl:py-[20px]
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-4

                      sm:flex-row
                      sm:items-start
                      sm:justify-between
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        items-start
                        gap-[14px]
                      "
                    >
                      <div
                        className="
                          flex
                          h-[58px]
                          w-[58px]
                          shrink-0
                          items-center
                          justify-center
                          rounded-[10px]
                          border
                          border-[#E2E8F0]
                          bg-[#F1F5F9]
                          text-[#09379A]
                        "
                      >
                        <Building2 size={25} />
                      </div>

                      <div className="min-w-0">
                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-[8px]
                          "
                        >
                          <span
                            className="
                              flex
                              h-[23px]
                              items-center
                              rounded-[10px]
                              bg-[#E7EEFF]
                              px-[9px]
                              text-[9px]
                              font-bold
                              text-[#2563EB]
                            "
                          >
                            {application.category}
                          </span>

                          <span
                            className="
                              text-[8px]
                              text-[#94A3B8]
                            "
                          >
                            الرمز التعريفي للمؤسسة:
                          </span>

                          <span
                            dir="ltr"
                            className="
                              text-[8px]
                              text-[#94A3B8]
                            "
                          >
                            {application.organizationCode}
                          </span>
                        </div>

                        <h2
                          className="
                            m-0
                            mt-[6px]
                            text-[18px]
                            font-bold
                            text-[#1E293B]

                            sm:text-[19px]

                            xl:text-[20px]
                          "
                        >
                          {application.organizationName}
                        </h2>

                        <p
                          className="
                            m-0
                            mt-[4px]
                            max-w-[560px]
                            text-[10px]
                            leading-[17px]
                            text-[#64748B]
                          "
                        >
                          {application.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className="
                        flex
                        h-[25px]
                        w-fit
                        shrink-0
                        items-center
                        gap-[5px]
                        rounded-[12px]
                        border
                        border-[#AFC8FA]
                        bg-[#EEF4FF]
                        px-[10px]
                        text-[9px]
                        font-bold
                        text-[#09379A]
                      "
                    >
                      <span
                        className="
                          h-[6px]
                          w-[6px]
                          rounded-full
                          bg-[#2563EB]
                        "
                      />

                      مقبول ومثبت
                    </span>
                  </div>

                  {/* INFO GRID */}
                  <div
                    className="
                      mt-5
                      grid
                      grid-cols-1
                      gap-3

                      sm:grid-cols-2

                      xl:grid-cols-3
                    "
                  >
                    <InfoCard
                      icon={GraduationCap}
                      label="المشرف الأكاديمي"
                      value={
                        application.academicSupervisor
                      }
                      sub={
                        application.academicSupervisorSub
                      }
                    />

                    <InfoCard
                      icon={Building2}
                      label="المشرف الميداني"
                      value={
                        application.fieldSupervisor
                      }
                      sub={
                        application.fieldSupervisorSub
                      }
                    />

                    <InfoCard
                      icon={MapPin}
                      label="مكان التدريب"
                      value={application.location}
                      sub={application.locationSub}
                    />

                    <InfoCard
                      icon={CalendarDays}
                      label="تاريخ البدء"
                      value={application.startDate}
                      sub={
                        application.startDateSub
                      }
                    />

                    <InfoCard
                      icon={CalendarDays}
                      label="تاريخ الانتهاء"
                      value={application.endDate}
                      sub={application.endDateSub}
                    />

                    <InfoCard
                      icon={Clock3}
                      label="مدة التدريب الإجمالية"
                      value={application.duration}
                      sub={`${application.hours} ساعة تدريبية`}
                      accent
                    />
                  </div>

                  {/* LOCATION */}
                  <div
                    className="
                      mt-[14px]
                      flex
                      min-h-[52px]
                      flex-col
                      gap-3
                      rounded-[9px]
                      border
                      border-[#E2E8F0]
                      bg-[#F8FAFC]
                      px-[14px]
                      py-3

                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        gap-[8px]
                      "
                    >
                      <MapPin
                        size={16}
                        className="
                          mt-[1px]
                          shrink-0
                          text-[#09379A]
                        "
                      />

                      <div>
                        <strong
                          className="
                            block
                            text-[10px]
                            text-[#334155]
                          "
                        >
                          مقر التدريب:{" "}
                          {application.address}
                        </strong>

                        <span
                          className="
                            mt-[2px]
                            block
                            text-[8px]
                            leading-[15px]
                            text-[#94A3B8]
                          "
                        >
                          مطلوب إبراز كتاب التنسيب
                          الرسمي المعتمد عند بوابة
                          الشركة يوم المباشرة.
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="
                        flex
                        w-fit
                        items-center
                        gap-[5px]
                        border-0
                        bg-transparent
                        p-0
                        text-[9px]
                        font-bold
                        text-[#2563EB]
                      "
                    >
                      <ExternalLink size={13} />

                      عرض الخريطة التفاعلية
                    </button>
                  </div>
                </section>

                {/* =============================================
                    HOURS DISTRIBUTION
                ============================================== */}
                <section
                  className="
                    rounded-[14px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    p-4

                    sm:p-5

                    xl:px-[22px]
                    xl:py-[21px]
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
                          h-[18px]
                          items-end
                          gap-[3px]
                        "
                      >
                        <span
                          className="
                            h-[7px]
                            w-[3px]
                            bg-[#09379A]
                          "
                        />

                        <span
                          className="
                            h-[12px]
                            w-[3px]
                            bg-[#09379A]
                          "
                        />

                        <span
                          className="
                            h-[17px]
                            w-[3px]
                            bg-[#09379A]
                          "
                        />
                      </div>

                      <h2
                        className="
                          m-0
                          text-[17px]
                          font-bold
                          text-[#1E293B]

                          sm:text-[18px]

                          xl:text-[19px]
                        "
                      >
                        توزيع الساعات التدريبية
                      </h2>
                    </div>

                    <p
                      className="
                        m-0
                        text-[10px]
                        font-bold
                        text-[#64748B]
                      "
                    >
                      المستهدف: {application.hours} ساعة{" "}
                      <span className="text-[#94A3B8]">
                        (100%)
                      </span>
                    </p>
                  </div>

                  {/* BAR */}
                  <div
                    dir="ltr"
                    className="
                      mt-[22px]
                      flex
                      h-[16px]
                      w-full
                      overflow-hidden
                      rounded-full
                      bg-[#E2E8F0]
                    "
                  >
                    {hourDistribution.map(
                      (item) => (
                        <div
                          key={item.label}
                          style={{
                            width: item.width,
                            backgroundColor:
                              item.color,
                          }}
                          className="h-full"
                        />
                      )
                    )}
                  </div>

                  {/* LEGEND */}
                  <div
                    className="
                      mt-[18px]
                      flex
                      flex-wrap
                      items-center
                      justify-start
                      gap-x-6
                      gap-y-3

                      sm:justify-around
                    "
                  >
                    {hourDistribution.map(
                      (item) => (
                        <div
                          key={item.label}
                          className="
                            flex
                            items-center
                            gap-[7px]
                            text-[9px]
                            text-[#64748B]

                            sm:text-[10px]
                          "
                        >
                          <span
                            style={{
                              backgroundColor:
                                item.color,
                            }}
                            className="
                              h-[8px]
                              w-[8px]
                              shrink-0
                              rounded-full
                            "
                          />

                          <span>
                            {item.label} ({item.hours} س)
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </section>
              </div>
            </section>

            {/* =================================================
                BACK ACTION
            ================================================== */}
            <div
              className="
                mt-5
                flex
                justify-start
              "
            >
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/student/applications/${application.id}/status`
                  )
                }
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
                  px-[14px]
                  text-[10px]
                  font-bold
                  text-[#09379A]
                  transition

                  hover:bg-[#F8FAFC]
                "
              >
                <ArrowRight size={15} />

                العودة إلى متابعة الطلب
              </button>
            </div>
          </div>
        
            <AcademicFooter audience="student" />
          </main>
      </div>
    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
}) {
  return (
    <div
      className="
        flex
        min-h-[86px]
        min-w-0
        items-center
        gap-[10px]
        rounded-[10px]
        border
        border-[#E2E8F0]
        bg-[#F8FAFC]
        px-[13px]
        py-[12px]
      "
    >
      <div
        className={`
          flex
          h-[34px]
          w-[34px]
          shrink-0
          items-center
          justify-center
          rounded-[8px]

          ${
            accent
              ? `
                bg-[#FFF2E8]
                text-[#FF6B35]
              `
              : `
                bg-[#EEF3FF]
                text-[#09379A]
              `
          }
        `}
      >
        <Icon
          size={17}
          strokeWidth={1.8}
        />
      </div>

      <div className="min-w-0">
        <p
          className="
            m-0
            text-[8px]
            text-[#94A3B8]
          "
        >
          {label}
        </p>

        <strong
          className={`
            mt-[3px]
            block
            text-[11px]
            font-bold
            leading-[18px]

            ${
              accent
                ? "text-[#FF6B35]"
                : "text-[#334155]"
            }
          `}
        >
          {value}
        </strong>

        <span
          className="
            mt-[2px]
            block
            text-[8px]
            leading-[15px]
            text-[#64748B]
          "
        >
          {sub}
        </span>
      </div>
    </div>
  );
}