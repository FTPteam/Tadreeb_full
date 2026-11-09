import AcademicFooter from "../../components/shared/AcademicFooter";
import { getStudent, saveStudent } from "./studentsStore";
import AdminHeader from "../../components/admin/Header";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bell, Menu, ChevronLeft, ArrowRight,
  Check, Clock3, GraduationCap, BadgeCheck,
  AlertCircle, X,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

import {
  getTrainingStudent,
  getCompletionRequirements,
  canCompleteTraining,
  saveTrainingStudent,
} from "./trainingMonitoringStore";

const STEPS = [
  "تقرير نهائي",
  "التقييم",
  "مراجعة المشرف",
  "إنهاء التدريب",
];

export default function CompleteTraining() {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [student, setStudent] = useState(() =>
    getTrainingStudent(studentId)
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  const detailsPath = `/admin/training-monitoring/${encodeURIComponent(
    studentId
  )}`;

  useEffect(() => {
    setStudent(getTrainingStudent(studentId));
  }, [studentId]);

  useEffect(() => {
    if (!confirmOpen) return;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setConfirmOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () =>
      window.removeEventListener("keydown", closeOnEscape);
  }, [confirmOpen]);

  const requirements = getCompletionRequirements(student);
  const ready = canCompleteTraining(student);
  const completed = student?.status === "completed";

  const handleComplete = async () => {
    const latest = getTrainingStudent(studentId);

    if (!canCompleteTraining(latest)) {
      setError(
        "لا يمكن إنهاء التدريب قبل اكتمال جميع المتطلبات."
      );
      setConfirmOpen(false);
      return;
    }

    const updated = {
      ...latest,
      status: "completed",
      completedAt: new Date().toLocaleDateString("en-CA"),
      completedBy: null,
    };

    try {
      await saveTrainingStudent(updated);
      setStudent(updated);
      setConfirmOpen(false);

      navigate(detailsPath, {
        replace: true,
        state: {
          successMessage: "تم إنهاء التدريب بنجاح.",
        },
      });
    } catch (err) {
      setConfirmOpen(false);
      setError(err?.message || "تعذر حفظ إنهاء التدريب. حاول مرة أخرى.");
    }
  };

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
            <nav className="mb-7 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B]">
              <button
                onClick={() => navigate("/admin/dashboard")}
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <button
                onClick={() =>
                  navigate("/admin/training-monitoring")
                }
              >
                متابعة التدريب
              </button>

              <ChevronLeft size={15} />

              <button onClick={() => navigate(detailsPath)}>
                تفاصيل الطالب
              </button>

              <ChevronLeft size={15} />

              <span className="font-bold text-[#111C2D]">
                إنهاء التدريب
              </span>
            </nav>

            {/* TITLE */}
            <section className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="m-0 text-[26px] font-bold">
                  إنهاء التدريب
                </h1>

                <p className="m-0 mt-1 text-[12px] text-[#64748B]">
                  {student
                    ? `استكمال متطلبات إنهاء تدريب ${student.name}`
                    : "الطالب غير موجود"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(detailsPath)}
                className="inline-flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px]"
              >
                <ArrowRight size={16} />
                رجوع
              </button>
            </section>

            {!student ? (
              <section className="rounded-xl border border-[#E0E7F2] bg-white p-10 text-center">
                <AlertCircle
                  size={36}
                  className="mx-auto text-[#DC2626]"
                />
                <p className="mt-4 text-[14px] font-bold">
                  الطالب غير موجود
                </p>
                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/training-monitoring")
                  }
                  className="mt-4 rounded-lg bg-[#09379A] px-5 py-3 text-[12px] text-white"
                >
                  العودة إلى متابعة التدريب
                </button>
              </section>
            ) : (
              <>
                {/* STEPS */}
                <section className="mb-6 rounded-[12px] border border-[#E0E7F2] bg-white px-4 py-5 sm:px-6">
                  <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
                    {STEPS.map((step, index) => {
                      const done = completed || index < 2;
                      const active = !completed && index === 2;

                      return (
                        <div
                          key={step}
                          className={`flex min-w-0 items-center ${
                            index < STEPS.length - 1
                              ? "flex-1"
                              : "shrink-0"
                          }`}
                        >
                          <span className="flex shrink-0 items-center gap-2">
                            <span
                              className={`flex h-[32px] w-[32px] items-center justify-center rounded-full text-[11px] font-bold ${
                                done
                                  ? "bg-[#15803D] text-white"
                                  : active
                                  ? "bg-[#09379A] text-white"
                                  : "border-2 border-[#E0E7F2] text-[#64748B]"
                              }`}
                            >
                              {done ? (
                                <Check size={17} />
                              ) : (
                                index + 1
                              )}
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
                          </span>

                          {index !== STEPS.length - 1 && (
                            <div
                              className={`mx-3 h-[2px] min-w-[10px] flex-1 ${
                                index < 2 || completed
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

                {error && (
                  <div
                    role="alert"
                    className="mb-5 flex items-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4 text-[12px] text-[#DC2626]"
                  >
                    <AlertCircle size={17} />
                    {error}
                  </div>
                )}

                {/* CONTENT */}
                <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_390px]">
                  <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
                    <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                      متطلبات الإنهاء
                    </h2>

                    <div className="mt-4 space-y-4">
                      {requirements.map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center gap-3 text-[12px]"
                        >
                          {item.done ? (
                            <Check
                              size={18}
                              className="shrink-0 text-[#15803D]"
                            />
                          ) : (
                            <Clock3
                              size={18}
                              className="shrink-0 text-[#B54708]"
                            />
                          )}

                          <span
                            className={
                              item.done
                                ? "text-[#111C2D]"
                                : "font-semibold text-[#B54708]"
                            }
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
                    <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                      الإنهاء
                    </h2>

                    <div
                      className={`mt-3 flex items-center gap-3 rounded-lg border p-4 ${
                        completed || ready
                          ? "border-[#B7C9FF] bg-[#E8EEF9]"
                          : "border-[#FDE68A] bg-[#FFFBEB]"
                      }`}
                    >
                      <span
                        className={`flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full ${
                          completed || ready
                            ? "bg-[#09379A] text-white"
                            : "bg-[#FEF3C7] text-[#B54708]"
                        }`}
                      >
                        {completed || ready ? (
                          <GraduationCap size={27} />
                        ) : (
                          <Clock3 size={27} />
                        )}
                      </span>

                      <div>
                        <p className="m-0 text-[13px] font-bold">
                          {completed
                            ? "تم إنهاء التدريب"
                            : ready
                            ? "جاهز لإنهاء التدريب"
                            : "متطلبات الإنهاء غير مكتملة"}
                        </p>

                        <p className="m-0 mt-1 text-[11px] leading-5 text-[#64748B]">
                          {completed
                            ? "تم تسجيل إنهاء فترة التدريب."
                            : ready
                            ? "يمكن تأكيد الإنهاء بعد المراجعة."
                            : "أكمل المتطلبات الناقصة أولًا."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setConfirmOpen(true)}
                        disabled={!ready}
                        className="inline-flex h-[44px] items-center gap-2 rounded-lg bg-[#FF6534] px-5 text-[12px] font-bold text-white transition hover:bg-[#E95526] disabled:cursor-not-allowed disabled:bg-[#E5EAF2] disabled:text-[#64748B]"
                      >
                        <BadgeCheck size={17} />
                        {completed
                          ? "تم الإنهاء"
                          : "إنهاء التدريب"}
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(detailsPath)}
                        className="h-[44px] rounded-lg border border-[#E0E7F2] bg-white px-5 text-[12px]"
                      >
                        إلغاء
                      </button>
                    </div>
                  </section>
                </div>
              </>
            )}

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>

      {/* CONFIRMATION MODAL */}
      {confirmOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0F172A]/55 p-4 font-['Cairo']"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setConfirmOpen(false);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="finish-title"
            className="w-full max-w-[500px] rounded-[12px] bg-white p-7 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
                <GraduationCap size={27} />
              </div>

              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                aria-label="إغلاق"
              >
                <X size={20} />
              </button>
            </div>

            <h2
              id="finish-title"
              className="m-0 mt-5 text-[20px] font-bold"
            >
              تأكيد إنهاء التدريب
            </h2>

            <p className="m-0 mt-3 text-[12px] leading-7 text-[#64748B]">
              هل تريد تأكيد إنهاء فترة التدريب للطالب
              {" "}
              <strong>{student?.name}</strong>؟
              سيتم تحديث حالته إلى «منتهٍ» في متابعة التدريب.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex h-[44px] items-center gap-2 rounded-lg bg-[#FF6534] px-5 text-[12px] font-bold text-white"
              >
                <Check size={16} />
                تأكيد الإنهاء
              </button>

              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="h-[44px] rounded-lg border border-[#E0E7F2] px-5 text-[12px]"
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




