import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bell, Menu, ChevronLeft, ArrowRight,
  Save, AlertCircle, Check,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

import {
  CRITERIA,
  getEvaluation,
  saveEvaluation,
  hasCompleteAcademicCriteria,
} from "./evaluationStore";

export default function AddEvaluation() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [evaluation, setEvaluation] = useState(() =>
    getEvaluation(id)
  );

  const [ratings, setRatings] = useState(
    () => ({ ...getEvaluation(id)?.academicCriteria })
  );

  const [note, setNote] = useState(
    () => getEvaluation(id)?.academicNote || ""
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const detailsPath =
    `/admin/evaluations/${encodeURIComponent(id)}`;

  useEffect(() => {
    const item = getEvaluation(id);
    setEvaluation(item);
    setRatings({ ...(item?.academicCriteria || {}) });
    setNote(item?.academicNote || "");
    setError("");
  }, [id]);

  const updateRating = (key, value) => {
    setRatings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setError("");
  };

  const handleSave = () => {
    if (!evaluation) return;

    if (evaluation.status === "approved") {
      setError("لا يمكن تعديل تقييم تم اعتماده نهائيًا.");
      return;
    }

    if (evaluation.fieldScore == null) {
      setError(
        "يجب تسجيل تقييم المشرف الميداني قبل إضافة التقييم الأكاديمي."
      );
      return;
    }

    if (
      !hasCompleteAcademicCriteria({
        academicCriteria: ratings,
      })
    ) {
      setError("يرجى اختيار درجة من 1 إلى 5 لجميع المعايير.");
      return;
    }

    const values = CRITERIA.map(
      ({ key }) => Number(ratings[key])
    );

    const academicScore =
      Math.round(
        (values.reduce((sum, value) => sum + value, 0) /
          values.length) * 100
      ) / 100;

    const updated = {
      ...evaluation,
      academicCriteria: { ...ratings },
      academicScore,
      academicNote: note.trim(),
      academicSupervisor: "د. سامر يوسف",
      academicSavedAt: new Date().toLocaleDateString("en-CA"),
      status: "completed",
    };

    setSaving(true);

    try {
      saveEvaluation(updated);

      navigate(`${detailsPath}/final-review`, {
        replace: true,
        state: {
          successMessage:
            "تم حفظ التقييم الأكاديمي بنجاح. يمكنك الآن مراجعة الدرجة النهائية.",
        },
      });
    } catch {
      setError("تعذر حفظ التقييم محليًا. حاول مرة أخرى.");
      setSaving(false);
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
            <div className="mb-7 flex items-center gap-2 text-[12px] text-[#64748B]">
              <button
                onClick={() => navigate("/admin/dashboard")}
              >
                الرئيسية
              </button>
              <ChevronLeft size={15} />
              <button onClick={() => navigate("/admin/evaluations")}>
                التقييمات
              </button>
              <ChevronLeft size={15} />
              <span className="font-bold text-[#111C2D]">
                إضافة تقييم
              </span>
            </div>

            {/* HEADER */}
            <section className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="m-0 text-[26px] font-bold">
                  {evaluation?.academicScore != null
                    ? "تعديل التقييم"
                    : "إضافة تقييم"}
                </h1>
                <p className="m-0 mt-1 text-[12px] text-[#64748B]">
                  تقييم المشرف الأكاديمي -
                  {" "}
                  {evaluation?.fullName || "طالب غير معروف"}
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

            {!evaluation ? (
              <div className="rounded-xl border border-[#E0E7F2] bg-white p-10 text-center">
                التقييم غير موجود.
              </div>
            ) : (
              <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_390px]">

                {/* RIGHT - CRITERIA */}
                <section className="min-w-0 rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
                  <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                    معايير التقييم (1-5)
                  </h2>

                  <div className="mt-2">
                    {CRITERIA.map(({ key, label }) => (
                      <div
                        key={key}
                        className="flex flex-col gap-4 border-b border-[#E6EBF5] py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <label className="text-[12px] font-bold">
                          {label}
                        </label>

                        <div
                          role="group"
                          aria-label={label}
                          className="flex flex-wrap items-center gap-2"
                        >
                          {[1, 2, 3, 4, 5].map((value) => {
                            const selected =
                              Number(ratings[key]) === value;

                            return (
                              <button
                                key={value}
                                type="button"
                                disabled={evaluation.status === "approved"}
                                onClick={() => updateRating(key, value)}
                                aria-pressed={selected}
                                className={`flex h-[44px] w-[44px] items-center justify-center rounded-[8px] border text-[12px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                  selected
                                    ? "border-[#09379A] bg-[#09379A] text-white"
                                    : "border-[#E0E7F2] bg-white hover:border-[#09379A]"
                                }`}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* LEFT - NOTES */}
                <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
                  <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                    الملاحظات
                  </h2>

                  <label
                    htmlFor="academic-notes"
                    className="mt-3 block text-[11px] font-medium"
                  >
                    ملاحظات وتوصيات
                  </label>

                  <textarea
                    id="academic-notes"
                    rows={5}
                    value={note}
                    disabled={evaluation.status === "approved"}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="اكتب ملاحظاتك..."
                    className="mt-2 min-h-[120px] w-full resize-none rounded-[8px] border border-[#E0E7F2] bg-white p-3 text-[12px] leading-6 outline-none focus:border-[#09379A] disabled:bg-[#F1F5F9]"
                  />

                  {error && (
                    <div
                      role="alert"
                      className="mt-4 flex items-start gap-2 rounded-lg bg-[#FEF2F2] p-3 text-[11px] leading-6 text-[#DC2626]"
                    >
                      <AlertCircle
                        size={17}
                        className="mt-1 shrink-0"
                      />
                      {error}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={
                        saving ||
                        evaluation.status === "approved"
                      }
                      onClick={handleSave}
                      className="inline-flex h-[44px] items-center gap-2 rounded-[8px] bg-[#09379A] px-5 text-[12px] font-bold text-white hover:bg-[#072E81] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? (
                        <Check size={16} />
                      ) : (
                        <Save size={16} />
                      )}
                      {saving ? "جاري الحفظ..." : "حفظ التقييم"}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(detailsPath)}
                      className="h-[44px] rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px]"
                    >
                      إلغاء
                    </button>
                  </div>
                </section>
              </div>
            )}

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}




