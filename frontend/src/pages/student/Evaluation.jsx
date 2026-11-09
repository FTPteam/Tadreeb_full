import AcademicFooter from "../../components/shared/AcademicFooter";
import { useMemo, useState, useEffect } from "react";
import { api, apiList } from "../../api/client";
import { fetchCurrentTraining } from "../../api/student";
import { useNavigate } from "react-router-dom";

import {
  Building2,
  Check,
  CheckCircle2,
  GraduationCap,
  MessageSquareQuote,
  ShieldCheck,
  Star,
  UserRound,
  X,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

export default function Evaluation() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("student");

  const [ratings, setRatings] = useState({
    content: 4.5,
    trainer: 4,
    practical: 4,
    attendance: 5,
  });

  const [notes, setNotes] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [currentTraining, setCurrentTraining] = useState(null);
  const [trainerEvaluation, setTrainerEvaluation] = useState({
    score: 4,
    max: 5,
    percentage: 80,
    supervisor: "مشرف التدريب الميداني",
    organization: "جهة التدريب",
    note: "بانتظار اعتماد التقييم من جهة التدريب.",
  });

  const maxNotesLength = 900;

  useEffect(() => {
    fetchCurrentTraining().then((tr) => {
      if (tr) {
        setCurrentTraining(tr);
        // Fetch evaluations
        apiList("/evaluations/").then((evals) => {
          const pEval = evals.find(e => e.kind === "provider" && (!tr.applicationId || e.application === tr.applicationId));
          if (pEval) {
            const vals = Object.values(pEval.scores || {}).map(Number).filter(Number.isFinite);
            const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 4;
            setTrainerEvaluation({
              score: Math.round(avg * 10) / 10,
              max: 5,
              percentage: Math.round(avg * 20),
              supervisor: pEval.evaluator_name || "مشرف التدريب",
              organization: tr.organization || "جهة التدريب",
              note: pEval.notes || "تم رصد التقييم بنجاح.",
            });
          }
        }).catch(() => {});

        // Fetch my rating for this provider
        apiList("/provider-ratings/").then((ratingsList) => {
          if (Array.isArray(ratingsList) && ratingsList.length > 0) {
            const myRating = ratingsList[0];
            setIsSubmitted(true);
            if (myRating.comment) setNotes(myRating.comment);
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  const evaluationItems = [
    {
      key: "content",
      title: "محتوى الدورة",
      description:
        "مدى ملاءمة المحتوى النظري والتطبيق العملي لمتطلبات التدريب.",
    },
    {
      key: "trainer",
      title: "أسلوب المدرب",
      description:
        "وضوح الشرح والتوجيه المستمر والتفاعل الإيجابي مع المتدرب.",
    },
    {
      key: "practical",
      title: "التطبيق العملي",
      description:
        "توفر المعدات والمختبرات وفرص التطبيق الميداني الفعلي.",
    },
    {
      key: "attendance",
      title: "الالتزام والحضور",
      description:
        "الالتزام بالمواعيد وتوافر المتابعة والإشراف أثناء التدريب.",
    },
  ];

  const studentAverage = useMemo(() => {
    const values = Object.values(ratings);

    if (!values.length) return "0.0";

    const sum = values.reduce(
      (total, current) => total + current,
      0
    );

    return (sum / values.length).toFixed(1);
  }, [ratings]);

  const handleRatingChange = (key, value) => {
    if (isSubmitted) return;

    setRatings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleReset = () => {
    if (isSubmitted) return;

    setRatings({
      content: 0,
      trainer: 0,
      practical: 0,
      attendance: 0,
    });

    setNotes("");
  };

  const handleConfirmSubmit = async () => {
    setSubmitError("");
    try {
      if (currentTraining?.applicationId) {
        await api("/provider-ratings/", {
          method: "POST",
          body: {
            application: Number(currentTraining.applicationId),
            rating: Math.max(1, Math.min(5, Math.round(Number(studentAverage)))),
            comment: notes.trim() || "تقييم المتدرب لجهة التدريب",
          },
        });
      }
      setIsSubmitted(true);
      setShowConfirmModal(false);
    } catch (err) {
      setSubmitError(err?.message || "تعذر حفظ التقييم. حاول مرة أخرى.");
    }
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
        {/* HEADER */}

        <div className="relative shrink-0">
          <Header />
        </div>

        {/* =====================================================
            CONTENT
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

            xl:px-[40px]
            xl:pb-[40px]
            xl:pt-[18px]
          "
        >
          <div className="mx-auto w-full max-w-[1080px]">

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
                التقييم
              </span>
            </nav>

            {/* =================================================
                PAGE HEADER
            ================================================== */}

            <section
              className="
                mt-[6px]
                flex
                flex-col
                gap-4

                md:flex-row
                md:items-start
                md:justify-between
              "
            >
              <div className="min-w-0">
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-[10px]
                  "
                >
                  <h1
                    className="
                      m-0
                      text-[25px]
                      font-bold
                      leading-[38px]
                      text-[#14213D]

                      sm:text-[27px]

                      xl:text-[29px]
                      xl:leading-[40px]
                    "
                  >
                    التقييم الأكاديمي والميداني
                  </h1>

                  <span
                    className="
                      inline-flex
                      min-h-[27px]
                      items-center
                      rounded-full
                      border
                      border-[#BAE6FD]
                      bg-[#EFFAFF]
                      px-[10px]
                      text-[10px]
                      font-bold
                      text-[#0369A1]
                    "
                  >
                    الفصل الأول 2025/2026
                  </span>
                </div>

                <p
                  className="
                    m-0
                    mt-[4px]
                    max-w-[700px]
                    text-[12px]
                    leading-[22px]
                    text-[#64748B]

                    sm:text-[13px]
                    sm:leading-[24px]
                  "
                >
                  استعراض تقييم المشرف الميداني المعتمد
                  وتقديم التقييم النهائي للدورة التدريبية.
                </p>
              </div>

              <div
                className={`
                  flex
                  min-h-[38px]
                  w-fit
                  items-center
                  gap-[7px]
                  rounded-[8px]
                  border
                  px-[12px]
                  text-[10px]
                  font-bold

                  sm:text-[11px]

                  ${
                    isSubmitted
                      ? `
                        border-[#A7E6C4]
                        bg-[#F0FDF4]
                        text-[#15803D]
                      `
                      : `
                        border-[#BFDBFE]
                        bg-[#F8FBFF]
                        text-[#09379A]
                      `
                  }
                `}
              >
                <CheckCircle2
                  size={15}
                  strokeWidth={1.9}
                />

                {isSubmitted
                  ? "تم اعتماد التقييم"
                  : "السجل الأكاديمي مكتمل جزئيا"}
              </div>
            </section>

            {/* =================================================
                TRAINING SUMMARY
            ================================================== */}

            <section
              className="
                mt-[24px]
                flex
                flex-col
                gap-5
                rounded-[14px]
                border
                border-[#DDE5EF]
                bg-white
                px-4
                py-5
                shadow-[0_1px_2px_rgba(15,23,42,0.03)]

                sm:px-5

                lg:flex-row
                lg:items-center
                lg:justify-between
                lg:px-[22px]
                lg:py-[18px]
              "
            >
              {/* ORGANIZATION */}

              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-[13px]
                "
              >
                <div
                  className="
                    flex
                    h-[50px]
                    w-[50px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[10px]
                    bg-[#EEF3FF]
                    text-[#09379A]
                  "
                >
                  <Building2
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
                      gap-[8px]
                    "
                  >
                    <h2
                      className="
                        m-0
                        text-[17px]
                        font-bold
                        leading-[25px]
                        text-[#1E293B]

                        sm:text-[18px]
                      "
                    >
                      شركة القدس للاتصالات
                    </h2>

                    <span
                      className="
                        inline-flex
                        min-h-[24px]
                        items-center
                        rounded-[6px]
                        bg-[#EEF4FF]
                        px-[9px]
                        text-[10px]
                        font-medium
                        text-[#2563EB]
                      "
                    >
                      هندسة الاتصالات
                    </span>
                  </div>

                  <p
                    className="
                      m-0
                      mt-[5px]
                      text-[11px]
                      leading-[20px]
                      text-[#64748B]

                      sm:text-[12px]
                    "
                  >
                    برنامج التدريب العملي المعتمد لدى كلية
                    الدراسات المتوسطة
                  </p>
                </div>
              </div>

              {/* SUMMARY BLOCKS */}

              <div
                className="
                  grid
                  w-full
                  grid-cols-1
                  gap-[10px]

                  sm:grid-cols-3

                  lg:w-auto
                  lg:min-w-[430px]
                "
              >
                <SummaryBlock
                  label="الفترة التدريبية"
                  value="2025/10/01 — 2025/12/01"
                />

                <SummaryBlock
                  label="الساعات المنجزة"
                  value="120 / 120 ساعة"
                  highlighted
                />

                <div
                  className={`
                    flex
                    min-h-[68px]
                    flex-col
                    items-center
                    justify-center
                    rounded-[9px]
                    border
                    px-[13px]
                    py-[10px]
                    text-center

                    ${
                      isSubmitted
                        ? `
                          border-[#A7E6C4]
                          bg-[#F0FDF4]
                        `
                        : `
                          border-[#F7D58B]
                          bg-[#FFFBEB]
                        `
                    }
                  `}
                >
                  <span
                    className={`
                      h-[7px]
                      w-[7px]
                      rounded-full

                      ${
                        isSubmitted
                          ? "bg-[#10B981]"
                          : "bg-[#F59E0B]"
                      }
                    `}
                  />

                  <strong
                    className={`
                      mt-[6px]
                      text-[11px]
                      font-bold

                      ${
                        isSubmitted
                          ? "text-[#15803D]"
                          : "text-[#D97706]"
                      }
                    `}
                  >
                    {isSubmitted
                      ? "تم التقييم"
                      : "جاهز للتقييم"}
                  </strong>
                </div>
              </div>
            </section>

            {/* =================================================
                TABS
            ================================================== */}

            <section
              className="
                mt-[20px]
                overflow-x-auto
                border-b
                border-[#DDE5EF]
              "
            >
              <div
                className="
                  flex
                  min-w-max
                  items-end
                  gap-[22px]

                  sm:gap-[28px]
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab("student")
                  }
                  className={`
                    flex
                    items-center
                    gap-[7px]
                    whitespace-nowrap
                    border-0
                    border-b-[2px]
                    bg-transparent
                    pb-[12px]
                    text-[11px]
                    font-bold
                    transition

                    sm:text-[12px]

                    ${
                      activeTab === "student"
                        ? `
                          border-[#09379A]
                          text-[#1E293B]
                        `
                        : `
                          border-transparent
                          text-[#64748B]
                        `
                    }
                  `}
                >
                  <GraduationCap
                    size={16}
                    strokeWidth={1.8}
                  />

                  تقييم الطالب للدورة

                  <span
                    className={`
                      inline-flex
                      min-h-[22px]
                      items-center
                      rounded-full
                      px-[8px]
                      text-[9px]

                      ${
                        isSubmitted
                          ? `
                            bg-[#E9FFF4]
                            text-[#16A34A]
                          `
                          : `
                            bg-[#09379A]
                            text-white
                          `
                      }
                    `}
                  >
                    {isSubmitted
                      ? "تم الاعتماد"
                      : "مطلوب منك"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab("trainer")
                  }
                  className={`
                    flex
                    items-center
                    gap-[7px]
                    whitespace-nowrap
                    border-0
                    border-b-[2px]
                    bg-transparent
                    pb-[12px]
                    text-[11px]
                    font-bold
                    transition

                    sm:text-[12px]

                    ${
                      activeTab === "trainer"
                        ? `
                          border-[#09379A]
                          text-[#1E293B]
                        `
                        : `
                          border-transparent
                          text-[#64748B]
                        `
                    }
                  `}
                >
                  <Check
                    size={15}
                    strokeWidth={2}
                    className="text-[#10B981]"
                  />

                  تقييم المدرب الميداني

                  <span
                    className="
                      inline-flex
                      min-h-[21px]
                      items-center
                      rounded-full
                      bg-[#F1F5F9]
                      px-[8px]
                      text-[9px]
                      text-[#64748B]
                    "
                  >
                    معتمد
                  </span>
                </button>
              </div>
            </section>

            {/* =================================================
                STUDENT TAB
            ================================================== */}

            {activeTab === "student" ? (
              <section
                dir="ltr"
                className="
                  mt-[22px]
                  grid
                  grid-cols-1
                  items-start
                  gap-[22px]

                  lg:grid-cols-[310px_minmax(0,1fr)]
                "
              >
                {/* =============================================
                    TRAINER SUMMARY
                ============================================== */}

                <aside
                  dir="rtl"
                  className="
                    rounded-[14px]
                    border
                    border-[#DDE5EF]
                    bg-white
                    px-4
                    py-5
                    shadow-[0_1px_2px_rgba(15,23,42,0.03)]

                    sm:px-5
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
                        gap-[8px]
                      "
                    >
                      <ShieldCheck
                        size={18}
                        className="text-[#09379A]"
                      />

                      <h2
                        className="
                          m-0
                          text-[15px]
                          font-bold
                          text-[#1E293B]
                        "
                      >
                        تقييم المدرب الميداني
                      </h2>
                    </div>

                    <span
                      className="
                        inline-flex
                        min-h-[26px]
                        w-fit
                        items-center
                        rounded-full
                        border
                        border-[#BFDBFE]
                        bg-[#EFF6FF]
                        px-[9px]
                        text-[9px]
                        font-bold
                        text-[#09379A]
                      "
                    >
                      معتمد أكاديميا
                    </span>
                  </div>

                  {/* SCORE */}

                  <div
                    className="
                      mt-[18px]
                      rounded-[10px]
                      border
                      border-[#EEF2F7]
                      bg-[#F8FAFC]
                      px-[16px]
                      py-[18px]
                      text-center
                    "
                  >
                    <p
                      className="
                        m-0
                        text-[11px]
                        leading-[20px]
                        text-[#64748B]
                      "
                    >
                      الدرجة العامة للتقييم الميداني
                    </p>

                    <div
                      className="
                        mt-[11px]
                        flex
                        items-end
                        justify-center
                        gap-[4px]
                      "
                    >
                      <strong
                        className="
                          text-[35px]
                          font-bold
                          leading-[36px]
                          text-[#14213D]
                        "
                      >
                        {trainerEvaluation.score.toFixed(1)}
                      </strong>

                      <span
                        className="
                          mb-[4px]
                          text-[12px]
                          text-[#94A3B8]
                        "
                      >
                        / {trainerEvaluation.max.toFixed(1)}
                      </span>
                    </div>

                    <div className="mt-[8px]">
                      <ReadOnlyStars
                        value={trainerEvaluation.score}
                        size={17}
                      />
                    </div>

                    <span
                      className="
                        mt-[10px]
                        inline-flex
                        min-h-[24px]
                        items-center
                        rounded-full
                        bg-[#EEF4FF]
                        px-[9px]
                        text-[9px]
                        font-bold
                        text-[#09379A]
                      "
                    >
                      مستوى الأداء: جيد جدا (
                      {trainerEvaluation.percentage}%)
                    </span>
                  </div>

                  {/* SUPERVISOR */}

                  <div
                    className="
                      mt-[15px]
                      flex
                      items-center
                      gap-[10px]
                      rounded-[9px]
                      border
                      border-[#D9E7FC]
                      bg-[#F8FBFF]
                      px-[12px]
                      py-[12px]
                    "
                  >
                    <div
                      className="
                        flex
                        h-[40px]
                        w-[40px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#09379A]
                        text-white
                      "
                    >
                      <UserRound size={18} />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          m-0
                          text-[11px]
                          font-bold
                          leading-[20px]
                          text-[#334155]
                        "
                      >
                        المشرف الميداني:{" "}
                        {trainerEvaluation.supervisor}
                      </p>

                      <span
                        className="
                          mt-[2px]
                          block
                          text-[10px]
                          leading-[18px]
                          text-[#94A3B8]
                        "
                      >
                        رئيس قسم هندسة الاتصالات - غزة
                      </span>
                    </div>
                  </div>

                  {/* NOTE */}

                  <div
                    className="
                      mt-[15px]
                      rounded-[9px]
                      border
                      border-[#EEF2F7]
                      bg-[#F8FAFC]
                      px-[13px]
                      py-[13px]
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-[7px]
                      "
                    >
                      <MessageSquareQuote
                        size={16}
                        className="text-[#09379A]"
                      />

                      <strong
                        className="
                          text-[11px]
                          text-[#09379A]
                        "
                      >
                        ملاحظات المدرب الميداني
                      </strong>
                    </div>

                    <p
                      className="
                        m-0
                        mt-[8px]
                        text-[11px]
                        leading-[21px]
                        text-[#475569]
                      "
                    >
                      "{trainerEvaluation.note}"
                    </p>
                  </div>
                </aside>

                {/* =============================================
                    STUDENT EVALUATION
                ============================================== */}

                <section
                  dir="rtl"
                  className="
                    rounded-[14px]
                    border
                    border-[#DDE5EF]
                    bg-white
                    px-4
                    py-5
                    shadow-[0_1px_2px_rgba(15,23,42,0.03)]

                    sm:px-[22px]
                    sm:py-[22px]
                  "
                >
                  {/* HEADER */}

                  <div
                    className="
                      flex
                      flex-col
                      gap-2

                      sm:flex-row
                      sm:items-start
                      sm:justify-between
                      sm:gap-[15px]
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-[8px]
                      "
                    >
                      <Star
                        size={20}
                        fill="#F59E0B"
                        className="text-[#F59E0B]"
                      />

                      <h2
                        className="
                          m-0
                          text-[17px]
                          font-bold
                          text-[#1E293B]

                          sm:text-[18px]
                        "
                      >
                        تقييم الطالب للدورة
                      </h2>
                    </div>

                    <p
                      className="
                        m-0
                        text-[10px]
                        leading-[19px]
                        text-[#94A3B8]

                        sm:text-[11px]
                      "
                    >
                      {isSubmitted
                        ? "تم اعتماد التقييم النهائي"
                        : "يمكنك التقييم بنصف نجمة من 0.5 إلى 5"}
                    </p>
                  </div>

                  {/* SUBMITTED STATE */}

                  {isSubmitted && (
                    <div
                      className="
                        mt-[18px]
                        flex
                        items-start
                        gap-[10px]
                        rounded-[10px]
                        border
                        border-[#A7E6C4]
                        bg-[#F0FDF4]
                        px-[14px]
                        py-[13px]

                        sm:px-[16px]
                        sm:py-[14px]
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
                          bg-[#16A34A]
                          text-white
                        "
                      >
                        <Check
                          size={17}
                          strokeWidth={2.2}
                        />
                      </div>

                      <div>
                        <h3
                          className="
                            m-0
                            text-[12px]
                            font-bold
                            text-[#15803D]
                          "
                        >
                          تم إرسال التقييم النهائي واعتماده
                        </h3>

                        <p
                          className="
                            m-0
                            mt-[3px]
                            text-[10px]
                            leading-[19px]
                            text-[#64748B]

                            sm:text-[11px]
                          "
                        >
                          تم حفظ تقييمك بنجاح. بعد الاعتماد
                          النهائي لا يمكن تعديل الدرجات أو
                          الملاحظات.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* EVALUATION ITEMS */}

                  <div
                    className="
                      mt-[20px]
                      flex
                      flex-col
                      gap-[12px]
                    "
                  >
                    {evaluationItems.map((item) => (
                      <EvaluationRow
                        key={item.key}
                        title={item.title}
                        description={item.description}
                        value={ratings[item.key]}
                        disabled={isSubmitted}
                        onChange={(value) =>
                          handleRatingChange(
                            item.key,
                            value
                          )
                        }
                      />
                    ))}
                  </div>

                  {/* AVERAGE */}

                  <div
                    className="
                      mt-[16px]
                      flex
                      flex-col
                      gap-3
                      rounded-[9px]
                      border
                      border-[#E7ECF2]
                      bg-[#F8FAFC]
                      px-[16px]
                      py-[13px]

                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      sm:gap-[15px]
                    "
                  >
                    <div>
                      <p
                        className="
                          m-0
                          text-[11px]
                          text-[#64748B]
                        "
                      >
                        متوسط تقييمك
                      </p>

                      <strong
                        className="
                          mt-[3px]
                          block
                          text-[20px]
                          text-[#1E293B]
                        "
                      >
                        {studentAverage}

                        <span
                          className="
                            mr-[4px]
                            text-[11px]
                            font-medium
                            text-[#94A3B8]
                          "
                        >
                          / 5
                        </span>
                      </strong>
                    </div>

                    <ReadOnlyStars
                      value={Number(studentAverage)}
                      size={19}
                      color="#FBBF24"
                    />
                  </div>

                  {/* NOTES */}

                  <div className="mt-[18px]">
                    <div
                      className="
                        mb-[7px]
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <label
                        className="
                          text-[11px]
                          font-bold
                          text-[#334155]
                        "
                      >
                        ملاحظات إضافية
                      </label>

                      <span
                        className="
                          text-[10px]
                          text-[#94A3B8]
                        "
                      >
                        {notes.length} / {maxNotesLength}
                      </span>
                    </div>

                    <textarea
                      value={notes}
                      disabled={isSubmitted}
                      onChange={(event) => {
                        if (
                          event.target.value.length <=
                          maxNotesLength
                        ) {
                          setNotes(event.target.value);
                        }
                      }}
                      placeholder="اكتب ملاحظاتك أو مقترحاتك حول بيئة ومحتوى التدريب..."
                      className={`
                        min-h-[115px]
                        w-full
                        resize-none
                        rounded-[8px]
                        border
                        px-[13px]
                        py-[11px]
                        font-['Cairo']
                        text-[11px]
                        leading-[21px]
                        outline-none
                        transition

                        sm:text-[12px]

                        ${
                          isSubmitted
                            ? `
                              cursor-not-allowed
                              border-[#E2E8F0]
                              bg-[#F8FAFC]
                              text-[#64748B]
                            `
                            : `
                              border-[#D9E2EC]
                              bg-white
                              text-[#334155]

                              focus:border-[#09379A]
                              focus:ring-2
                              focus:ring-[#09379A]/10
                            `
                        }
                      `}
                    />
                  </div>

                  {/* ACTIONS */}

                  <div
                    className="
                      mt-[22px]
                      border-t
                      border-[#EEF2F7]
                      pt-[17px]
                    "
                  >
                    {!isSubmitted ? (
                      <div
                        className="
                          flex
                          flex-col
                          gap-4

                          sm:flex-row
                          sm:flex-wrap
                          sm:items-center
                          sm:justify-between
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-[8px]
                            text-[10px]
                            text-[#64748B]
                          "
                        >
                          <span
                            className="
                              h-[7px]
                              w-[7px]
                              rounded-full
                              bg-[#10B981]
                            "
                          />

                          حالة المسودة: محفوظة تلقائيا
                        </div>

                        <div
                          className="
                            flex
                            w-full
                            flex-col-reverse
                            gap-[9px]

                            sm:w-auto
                            sm:flex-row
                            sm:items-center
                          "
                        >
                          <button
                            type="button"
                            onClick={handleReset}
                            className="
                              min-h-[42px]
                              rounded-[8px]
                              border
                              border-[#D9E2EC]
                              bg-white
                              px-[14px]
                              text-[11px]
                              font-medium
                              text-[#64748B]
                              transition

                              hover:bg-[#F8FAFC]
                              hover:text-[#09379A]
                            "
                          >
                            إعادة تعيين التقييم
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmModal(true)
                            }
                            className="
                              flex
                              min-h-[42px]
                              items-center
                              justify-center
                              gap-[8px]
                              rounded-[8px]
                              border-0
                              bg-[#09379A]
                              px-[18px]
                              text-[11px]
                              font-bold
                              text-white
                              shadow-[0_3px_7px_rgba(9,55,154,0.15)]
                              transition

                              hover:bg-[#072E81]
                            "
                          >
                            <Check
                              size={15}
                              strokeWidth={2}
                            />

                            إرسال التقييم النهائي واعتماده
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="
                          flex
                          flex-col
                          gap-2

                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-[8px]
                            text-[11px]
                            font-medium
                            text-[#15803D]
                          "
                        >
                          <CheckCircle2 size={15} />

                          تم اعتماد تقييمك النهائي بنجاح
                        </div>

                        <span
                          className="
                            text-[10px]
                            text-[#94A3B8]
                          "
                        >
                          حالة التقييم: معتمد
                        </span>
                      </div>
                    )}
                  </div>
                </section>
              </section>
            ) : (
              /* =================================================
                  TRAINER TAB
              ================================================== */

              <section
                className="
                  mt-[22px]
                  rounded-[14px]
                  border
                  border-[#DDE5EF]
                  bg-white
                  px-4
                  py-5
                  shadow-[0_1px_2px_rgba(15,23,42,0.03)]

                  sm:px-[24px]
                  sm:py-[24px]
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-[9px]
                  "
                >
                  <ShieldCheck
                    size={19}
                    className="text-[#09379A]"
                  />

                  <h2
                    className="
                      m-0
                      text-[17px]
                      font-bold
                      text-[#1E293B]
                    "
                  >
                    تقييم المدرب الميداني
                  </h2>
                </div>

                <p
                  className="
                    m-0
                    mt-[8px]
                    text-[11px]
                    leading-[21px]
                    text-[#64748B]

                    sm:text-[12px]
                  "
                >
                  تم اعتماد تقييم المدرب الميداني وإرساله
                  إلى منسق الكلية الأكاديمي.
                </p>

                <div
                  className="
                    mt-[20px]
                    max-w-[460px]
                    rounded-[10px]
                    border
                    border-[#EEF2F7]
                    bg-[#F8FAFC]
                    px-[18px]
                    py-[18px]
                  "
                >
                  <p
                    className="
                      m-0
                      text-[11px]
                      text-[#64748B]
                    "
                  >
                    الدرجة النهائية
                  </p>

                  <strong
                    className="
                      mt-[7px]
                      block
                      text-[30px]
                      text-[#14213D]
                    "
                  >
                    {trainerEvaluation.score.toFixed(1)}

                    <span
                      className="
                        mr-[4px]
                        text-[12px]
                        font-medium
                        text-[#94A3B8]
                      "
                    >
                      / 5
                    </span>
                  </strong>

                  <div className="mt-[10px]">
                    <ReadOnlyStars
                      value={trainerEvaluation.score}
                      size={19}
                      color="#09379A"
                    />
                  </div>

                  <p
                    className="
                      m-0
                      mt-[14px]
                      text-[11px]
                      leading-[21px]
                      text-[#475569]
                    "
                  >
                    {trainerEvaluation.note}
                  </p>
                </div>
              </section>
            )}
          </div>
        
            <AcademicFooter audience="student" />
          </main>
      </div>

      {/* =====================================================
          CONFIRMATION MODAL
      ====================================================== */}

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
            aria-labelledby="evaluation-confirm-title"
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              max-h-[90dvh]
              w-full
              max-w-[430px]
              overflow-y-auto
              rounded-[16px]
              border
              border-[#E2E8F0]
              bg-white
              p-5
              shadow-[0_20px_60px_rgba(15,23,42,0.18)]

              sm:p-[22px]
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-[15px]
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
                    h-[40px]
                    w-[40px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[10px]
                    bg-[#EEF4FF]
                    text-[#09379A]
                  "
                >
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <h3
                    id="evaluation-confirm-title"
                    className="
                      m-0
                      text-[16px]
                      font-bold
                      text-[#1E293B]
                    "
                  >
                    تأكيد إرسال التقييم
                  </h3>

                  <p
                    className="
                      m-0
                      mt-[4px]
                      text-[11px]
                      leading-[20px]
                      text-[#64748B]
                    "
                  >
                    هل أنت متأكد من إرسال التقييم
                    النهائي واعتماده؟
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="إغلاق"
                onClick={() =>
                  setShowConfirmModal(false)
                }
                className="
                  flex
                  h-[32px]
                  w-[32px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-[7px]
                  border-0
                  bg-[#F8FAFC]
                  text-[#64748B]
                  transition

                  hover:bg-[#EEF2F7]
                "
              >
                <X size={15} />
              </button>
            </div>

            <div
              className="
                mt-[18px]
                rounded-[9px]
                border
                border-[#F6D58A]
                bg-[#FFFBEB]
                px-[13px]
                py-[11px]
              "
            >
              <p
                className="
                  m-0
                  text-[11px]
                  leading-[20px]
                  text-[#92400E]
                "
              >
                بعد الإرسال النهائي لن تتمكن من تعديل
                التقييم أو الملاحظات.
              </p>
            </div>

            <div
              className="
                mt-[20px]
                flex
                flex-col-reverse
                gap-[9px]

                sm:flex-row
                sm:items-center
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowConfirmModal(false)
                }
                className="
                  min-h-[40px]
                  rounded-[8px]
                  border
                  border-[#D9E2EC]
                  bg-white
                  px-[16px]
                  text-[11px]
                  font-bold
                  text-[#475569]
                  transition

                  hover:bg-[#F8FAFC]
                "
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="
                  flex
                  min-h-[40px]
                  items-center
                  justify-center
                  gap-[7px]
                  rounded-[8px]
                  border-0
                  bg-[#09379A]
                  px-[17px]
                  text-[11px]
                  font-bold
                  text-white
                  transition

                  hover:bg-[#072E81]
                "
              >
                <Check
                  size={14}
                  strokeWidth={2}
                />

                تأكيد الإرسال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SUMMARY BLOCK
========================================================= */

function SummaryBlock({
  label,
  value,
  highlighted = false,
}) {
  return (
    <div
      className={`
        flex
        min-h-[68px]
        flex-col
        justify-center
        rounded-[9px]
        border
        px-[13px]
        py-[10px]

        ${
          highlighted
            ? `
              border-[#D7E5FF]
              bg-[#F6F9FF]
            `
            : `
              border-[#EEF2F7]
              bg-[#F8FAFC]
            `
        }
      `}
    >
      <p
        className="
          m-0
          text-[10px]
          leading-[18px]
          text-[#94A3B8]
        "
      >
        {label}
      </p>

      <strong
        className={`
          mt-[5px]
          block
          text-[11px]
          font-bold
          leading-[19px]

          ${
            highlighted
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
   EVALUATION ROW
========================================================= */

function EvaluationRow({
  title,
  description,
  value,
  onChange,
  disabled = false,
}) {
  const [hoverValue, setHoverValue] = useState(null);

  const visibleValue =
    !disabled && hoverValue !== null
      ? hoverValue
      : value;

  return (
    <div
      className={`
        flex
        min-h-[76px]
        flex-col
        gap-4
        rounded-[9px]
        border
        border-[#E7ECF2]
        px-[14px]
        py-[13px]

        sm:flex-row
        sm:items-center
        sm:justify-between
        sm:gap-[20px]
        sm:px-[16px]

        ${
          disabled
            ? "bg-[#F8FAFC]"
            : "bg-[#FAFBFC]"
        }
      `}
    >
      <div className="min-w-0">
        <h3
          className="
            m-0
            text-[12px]
            font-bold
            leading-[20px]
            text-[#334155]

            sm:text-[13px]
          "
        >
          {title}
        </h3>

        <p
          className="
            m-0
            mt-[4px]
            text-[10px]
            leading-[19px]
            text-[#94A3B8]

            sm:text-[11px]
          "
        >
          {description}
        </p>
      </div>

      <div
        dir="ltr"
        className="
          flex
          shrink-0
          items-center
          justify-between
          gap-[10px]

          sm:justify-end
        "
      >
        <div
          className="
            flex
            items-center
            gap-[3px]
          "
          onMouseLeave={() => {
            if (!disabled) {
              setHoverValue(null);
            }
          }}
        >
          {[1, 2, 3, 4, 5].map(
            (starNumber) => (
              <HalfStarInput
                key={starNumber}
                starNumber={starNumber}
                value={visibleValue}
                disabled={disabled}
                onHover={setHoverValue}
                onChange={onChange}
              />
            )
          )}
        </div>

        <span
          className="
            min-w-[36px]
            text-center
            text-[11px]
            font-bold
            text-[#334155]
          "
        >
          {Number(value).toFixed(1)}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   HALF STAR INPUT
========================================================= */

function HalfStarInput({
  starNumber,
  value,
  onHover,
  onChange,
  disabled,
}) {
  const fullValue = starNumber;
  const halfValue = starNumber - 0.5;

  const fillPercentage =
    value >= fullValue
      ? 100
      : value >= halfValue
        ? 50
        : 0;

  const uniqueId = `star-${starNumber}-${String(value).replace(
    ".",
    "-"
  )}`;

  return (
    <div
      className={`
        relative
        h-[24px]
        w-[24px]

        ${
          disabled
            ? "cursor-default"
            : "cursor-pointer"
        }
      `}
    >
      <Star
        size={24}
        strokeWidth={1.6}
        className="absolute inset-0 text-[#CBD5E1]"
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
        style={{
          width: `${fillPercentage}%`,
        }}
      >
        <Star
          size={24}
          strokeWidth={1.6}
          fill="#FBBF24"
          className="text-[#FBBF24]"
        />
      </div>

      {!disabled && (
        <>
          <button
            type="button"
            aria-label={`${halfValue} من 5`}
            onMouseEnter={() =>
              onHover(halfValue)
            }
            onFocus={() =>
              onHover(halfValue)
            }
            onClick={() =>
              onChange(halfValue)
            }
            className="
              absolute
              inset-y-0
              left-0
              z-10
              w-1/2
              border-0
              bg-transparent
              p-0
            "
          />

          <button
            type="button"
            aria-label={`${fullValue} من 5`}
            onMouseEnter={() =>
              onHover(fullValue)
            }
            onFocus={() =>
              onHover(fullValue)
            }
            onClick={() =>
              onChange(fullValue)
            }
            className="
              absolute
              inset-y-0
              right-0
              z-10
              w-1/2
              border-0
              bg-transparent
              p-0
            "
          />
        </>
      )}

      <span className="sr-only" id={uniqueId}>
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   READ ONLY STARS
========================================================= */

function ReadOnlyStars({
  value,
  size = 16,
  color = "#FBBF24",
}) {
  return (
    <div
      dir="ltr"
      className="
        flex
        items-center
        justify-center
        gap-[3px]
      "
      aria-label={`التقييم ${value} من 5`}
    >
      {[1, 2, 3, 4, 5].map(
        (starNumber) => {
          const fullValue = starNumber;
          const halfValue = starNumber - 0.5;

          const fillPercentage =
            value >= fullValue
              ? 100
              : value >= halfValue
                ? 50
                : 0;

          return (
            <div
              key={starNumber}
              className="relative"
              style={{
                width: size,
                height: size,
              }}
            >
              <Star
                size={size}
                strokeWidth={1.6}
                className="
                  absolute
                  inset-0
                  text-[#CBD5E1]
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  overflow-hidden
                "
                style={{
                  width: `${fillPercentage}%`,
                }}
              >
                <Star
                  size={size}
                  strokeWidth={1.6}
                  fill={color}
                  style={{
                    color,
                  }}
                />
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}