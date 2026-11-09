import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";

import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Bell, Menu, ChevronLeft, ArrowRight,
  Check, BadgeCheck, RotateCcw, X,
  AlertCircle,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

import {
  getEvaluation,
  saveEvaluation,
  calculateFinalScore,
  canReviewFinal,
  formatScore,
} from "./evaluationStore";

export default function FinalEvaluationReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [evaluation, setEvaluation] = useState(() =>
    getEvaluation(id)
  );

  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(
    location.state?.successMessage || ""
  );

  const detailsPath =
    `/admin/evaluations/${encodeURIComponent(id)}`;

  useEffect(() => {
    setEvaluation(getEvaluation(id));
  }, [id]);

  const ready = canReviewFinal(evaluation);
  const approved = evaluation?.status === "approved";
  const finalScore = calculateFinalScore(evaluation);

  const handleApprove = async () => {
    if (!evaluation || !ready || approved) {
      setError("لا يمكن اعتماد هذا التقييم في حالته الحالية.");
      return;
    }

    const updated = {
      ...evaluation,
      status: "approved",
      finalScore,
      approvedAt: new Date().toLocaleDateString("en-CA"),
      approvedBy: null, // Authenticated reviewer will come from the backend.
    };

    try {
      await saveEvaluation(updated);
      setEvaluation(updated);
      setShowConfirm(false);
      setError("");

      navigate(detailsPath, {
        replace: true,
        state: {
          successMessage:
            "تم اعتماد الدرجة النهائية بنجاح.",
        },
      });
    } catch (err) {
      setError(err?.message || "تعذر حفظ الاعتماد. حاول مرة أخرى.");
      setShowConfirm(false);
    }
  };

  const steps = [
    "تقييم الجهة",
    "تقييم المشرف",
    "المراجعة النهائية",
    "الاعتماد",
  ];

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]"
    >
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader />

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1450px]">

            {/* BREADCRUMB */}
            <div className="mb-7 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B]">
              <button
                onClick={() => navigate("/admin/dashboard")}
              >
                الرئيسية
              </button>
              <ChevronLeft size={15} />
              <button
                onClick={() => navigate("/admin/evaluations")}
              >
                التقييمات
              </button>
              <ChevronLeft size={15} />
              <button onClick={() => navigate(detailsPath)}>
                تفاصيل التقييم
              </button>
              <ChevronLeft size={15} />
              <span className="font-semibold text-[#111C2D]">
                التقييم النهائي
              </span>
            </div>

            {/* PAGE TITLE */}
            <section className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="m-0 text-[26px] font-bold">
                  مراجعة التقييم النهائي
                </h1>
                <p className="m-0 mt-1 text-[12px] text-[#64748B]">
                  {evaluation?.fullName || "تقييم غير موجود"}
                  {" - "}
                  {evaluation?.studentId || "—"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(detailsPath)}
                className="inline-flex h-[44px] items-center gap-2 rounded-lg border border-[#E0E7F2] bg-white px-5 text-[12px]"
              >
                <ArrowRight size={16} />
                رجوع
              </button>
            </section>

            {!evaluation ? (
              <div className="rounded-xl border border-[#E0E7F2] bg-white p-10 text-center">
                التقييم غير موجود.
              </div>
            ) : (
              <>
                {/* PROGRESS STEPS */}
                <section className="mb-6 rounded-[12px] border border-[#E0E7F2] bg-white px-4 py-5 sm:px-6">
                  <div className="flex w-full flex-wrap items-center gap-y-4 md:flex-nowrap">
                    {steps.map((step, index) => {
                      const done = approved
                        ? true
                        : index < 2;

                      const active = !approved && index === 2;

                      return (
                        <div
                          key={step}
                          className={`flex min-w-0 items-center ${
                            index === 3 ? "shrink-0" : "flex-1"
                          }`}
                        >
                          <div className="flex shrink-0 items-center gap-2">
                            <span
                              className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                                done
                                  ? "bg-[#15803D] text-white"
                                  : active
                                  ? "bg-[#09379A] text-white"
                                  : "border-2 border-[#E0E7F2] text-[#64748B]"
                              }`}
                            >
                              {done ? <Check size={17} /> : index + 1}
                            </span>
                            <span
                              className={`whitespace-nowrap text-[10px] font-semibold sm:text-[11px] ${
                                done
                                  ? "text-[#15803D]"
                                  : active
                                  ? "text-[#09379A]"
                                  : "text-[#64748B]"
                              }`}
                            >
                              {step}
                            </span>
                          </div>

                          {index < 3 && (
                            <div
                              aria-hidden="true"
                              className={`mx-3 h-[2px] min-w-[10px] flex-1 sm:mx-4 ${
                                done && (approved || index < 2)
                                  ? "bg-[#15803D]"
                                  : "bg-[#E0E7F2]"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                {notice && (
                  <div
                    role="status"
                    className="mb-5 flex items-center justify-between rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[12px] text-[#15803D]"
                  >
                    {notice}
                    <button onClick={() => setNotice("")}>
                      <X size={16} />
                    </button>
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="mb-5 flex items-center gap-2 rounded-lg bg-[#FEF2F2] px-4 py-3 text-[12px] text-[#DC2626]"
                  >
                    <AlertCircle size={17} />
                    {error}
                  </div>
                )}

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_390px]">
                  {/* COMPONENTS TABLE */}
                  <section className="min-w-0 rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
                    <h2 className="m-0 mb-4 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                      مكونات الدرجة النهائية
                    </h2>

                    <div className="max-w-full overflow-x-auto rounded-[8px] border border-[#E0E7F2]">
                      <table className="w-full min-w-[490px] border-collapse text-right text-[11px]">
                        <thead className="bg-[#F1F5F9] text-[#64748B]">
                          <tr>
                            <th className="px-4 py-4">العنصر</th>
                            <th className="px-4 py-4">الدرجة</th>
                            <th className="px-4 py-4">المقيّم</th>
                            <th className="px-4 py-4">الحالة</th>
                          </tr>
                        </thead>

                        <tbody>
                          <GradeRow
                            title="تقييم المشرف الميداني"
                            score={
                              evaluation.fieldScore == null
                                ? "—"
                                : `${formatScore(evaluation.fieldScore, 1)} من 5`
                            }
                            reviewer={
                              evaluation.fieldSupervisor || "المشرف الميداني"
                            }
                            completed={evaluation.fieldScore != null}
                          />

                          <GradeRow
                            title="تقييم المشرف الأكاديمي"
                            score={
                              evaluation.academicScore == null
                                ? "—"
                                : `${formatScore(evaluation.academicScore, 1)} من 5`
                            }
                            reviewer={
                              evaluation.academicSupervisor ||
                              "غير محدد"
                            }
                            completed={evaluation.academicScore != null}
                          />

                          <GradeRow
                            title="الحضور والالتزام"
                            score={
                              evaluation.attendance == null
                                ? "—"
                                : `${evaluation.attendance}%`
                            }
                            reviewer="النظام"
                            computed
                            completed={evaluation.attendance != null}
                          />
                        </tbody>
                      </table>
                    </div>

                    <p className="m-0 mt-4 text-[11px] leading-6 text-[#64748B]">
                      تُعرض نسبة الحضور كمؤشر مستقل. الدرجة
                      النهائية التجريبية محسوبة من متوسط تقييم
                      المشرف الميداني والمشرف الأكاديمي فقط.
                    </p>
                  </section>

                  {/* FINAL SCORE */}
                  <section className="min-h-[280px] rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
                    <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                      الدرجة النهائية
                    </h2>

                    <div className="pt-4 text-center">
                      <strong className="block text-[45px] font-bold leading-none text-[#062569]">
                        {formatScore(finalScore)}
                      </strong>

                      <p className="m-0 mt-2 text-[11px] text-[#64748B]">
                        {finalScore == null
                          ? "الدرجة غير مكتملة"
                          : "من 5"}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap justify-between gap-3">
                      {approved ? (
                        <span className="inline-flex h-[44px] items-center gap-2 rounded-lg bg-[#DCFCE7] px-4 text-[11px] font-bold text-[#15803D]">
                          <Check size={16} />
                          الدرجة معتمدة
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={!ready}
                          onClick={() => setShowConfirm(true)}
                          className="inline-flex h-[44px] items-center gap-2 rounded-[8px] bg-[#FF6534] px-5 text-[11px] font-bold text-white hover:bg-[#E95526] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <BadgeCheck size={17} />
                          اعتماد الدرجة
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => navigate(detailsPath)}
                        className="inline-flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[11px]"
                      >
                        <RotateCcw size={16} />
                        رجوع
                      </button>
                    </div>

                    {!ready && (
                      <p className="mt-4 text-[11px] leading-6 text-[#B54708]">
                        يجب اكتمال التقييمين الميداني والأكاديمي
                        قبل اعتماد الدرجة.
                      </p>
                    )}
                  </section>
                </div>
              </>
            )}

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>

      {/* APPROVAL CONFIRMATION */}
      {showConfirm && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0F172A]/55 p-4 font-['Cairo']"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowConfirm(false);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="approve-evaluation-title"
            className="w-full max-w-[480px] rounded-[12px] bg-white p-7 shadow-xl"
          >
            <div className="mb-5 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
              <BadgeCheck size={27} />
            </div>

            <h2
              id="approve-evaluation-title"
              className="m-0 text-[20px] font-bold"
            >
              اعتماد الدرجة النهائية
            </h2>

            <p className="m-0 mt-3 text-[12px] leading-7 text-[#64748B]">
              هل تريد اعتماد الدرجة النهائية
              {" "}
              <strong>{formatScore(finalScore)} من 5</strong>
              {" "}
              للطالب
              {" "}
              {evaluation?.fullName}؟
              بعد الاعتماد لن تكون قابلة للتعديل من هذه الواجهة.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex h-[44px] items-center gap-2 rounded-[8px] bg-[#FF6534] px-5 text-[12px] font-bold text-white"
              >
                <Check size={16} />
                تأكيد الاعتماد
              </button>

              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="h-[44px] rounded-[8px] border border-[#E0E7F2] px-5 text-[12px]"
              >
                إلغاء
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function GradeRow({
  title,
  score,
  reviewer,
  completed,
  computed = false,
}) {
  return (
    <tr className="border-t border-[#E6EBF5]">
      <td className="px-4 py-5 font-semibold">{title}</td>
      <td className="px-4 py-5">{score}</td>
      <td className="px-4 py-5">{reviewer}</td>
      <td className="px-4 py-5">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] ${
            completed
              ? computed
                ? "bg-[#DDF6FF] text-[#08759B]"
                : "bg-[#DCFCE7] text-[#15803D]"
              : "bg-[#F1F5F9] text-[#64748B]"
          }`}
        >
          <span className="h-[6px] w-[6px] rounded-full bg-current" />
          {completed
            ? computed
              ? "محسوب"
              : "مكتمل"
            : "غير مكتمل"}
        </span>
      </td>
    </tr>
  );
}




