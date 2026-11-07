import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";

import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Bell,
  Menu,
  ChevronLeft,
  ArrowRight,
  Check,
  X,
  Clock3,
  Download,
  FileText,
  AlertCircle,
  CircleCheck,
  CircleX,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";
import { getRequest, decideRequest } from "./trainingRequestsStore";

// =====================================================
// SHARED REQUEST STORE
// =====================================================

// =====================================================
// MAIN PAGE
// =====================================================

export default function TrainingRequestDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [request, setRequest] = useState(() =>
    getRequest(id)
  );

  // General note written in the page
  const [note, setNote] = useState(
    request?.note || ""
  );

  // Decision modal: "approved" | "rejected" | null
  const [decision, setDecision] = useState(null);

  // Rejection reason written inside rejection modal
  const [rejectionReason, setRejectionReason] =
    useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isPending = request?.status === "pending";

  // Reload correct request if URL changes
  useEffect(() => {
    const nextRequest = getRequest(id);

    setRequest(nextRequest);
    setNote(nextRequest?.note || "");
    setRejectionReason("");
    setDecision(null);
    setError("");
  }, [id]);

  // Close modal with Escape
  useEffect(() => {
    if (!decision) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !saving) {
        closeDecision();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [decision, saving]);

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-admin-sidebar")
    );
  };

  const goBack = () => {
    navigate("/admin/training-requests");
  };

  // =====================================================
  // OPEN DECISION MODAL
  // =====================================================

  const openDecision = (type) => {
    if (!isPending || saving) return;

    setDecision(type);
    setRejectionReason("");
    setError("");
  };

  // =====================================================
  // CLOSE DECISION MODAL
  // =====================================================

  const closeDecision = () => {
    if (saving) return;

    setDecision(null);
    setRejectionReason("");
    setError("");
  };

  // =====================================================
  // CONFIRM APPROVAL / REJECTION
  // =====================================================

  const confirmDecision = () => {
    if (
      !request ||
      !decision ||
      !isPending ||
      saving
    ) {
      return;
    }

    // Rejection reason is mandatory
    if (
      decision === "rejected" &&
      !rejectionReason.trim()
    ) {
      setError("يرجى كتابة سبب رفض الطلب.");
      return;
    }

    const isApproval = decision === "approved";

    const updatedRequest = {
      ...request,
      status: isApproval
        ? "approved"
        : "rejected",

      // Main note is used for approval.
      // Rejection reason is recorded as the decision note.
      note: isApproval
        ? note.trim()
        : rejectionReason.trim(),

      rejectionReason: isApproval
        ? ""
        : rejectionReason.trim(),

      decisionDate: new Date()
        .toLocaleDateString("en-CA"),

      decidedBy: null, // Authenticated reviewer will come from the backend.
    };

    setSaving(true);

    let saved;
    try {
      saved = decideRequest(updatedRequest, updatedRequest.status);
    } catch (error) {
      setSaving(false);
      setError(error?.message || "تعذر حفظ القرار. يرجى المحاولة مرة أخرى.");
      return;
    }

    setRequest(updatedRequest);
    setDecision(null);
    setSaving(false);

    const successMessage = isApproval
      ? `تم تسجيل قبول الطلب ${request.id} من المشرف بنجاح.`
      : `تم تسجيل رفض الطلب ${request.id} بنجاح.`;

    navigate("/admin/training-requests", {
      replace: true,
      state: {
        successMessage,
      },
    });
  };

  // =====================================================
  // REQUEST NOT FOUND
  // =====================================================

  if (!request) {
    return (
      <div
        dir="rtl"
        className="flex h-screen w-full bg-[#F8FAFC] font-['Cairo']"
      >
        <Sidebar />

        <main className="flex min-w-0 flex-1 flex-col items-center justify-center gap-4 p-6">
          <FileText
            size={38}
            className="text-[#09379A]"
          />

          <h1 className="m-0 text-[22px] font-bold">
            الطلب غير موجود
          </h1>

          <p className="text-[13px] text-[#64748B]">
            لم يتم العثور على طلب بهذا الرقم.
          </p>

          <button
            type="button"
            onClick={goBack}
            className="rounded-lg bg-[#09379A] px-6 py-3 text-[12px] text-white"
          >
            العودة إلى طلبات التدريب
          </button>
        </main>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]"
    >
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader />

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1450px]">

            {/* ==========================================
                BREADCRUMB
            ========================================== */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B]">
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/dashboard")
                }
                className="hover:text-[#09379A]"
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <button
                type="button"
                onClick={goBack}
                className="hover:text-[#09379A]"
              >
                طلبات التدريب
              </button>

              <ChevronLeft size={15} />

              <span className="font-semibold text-[#111C2D]">
                تفاصيل الطلب
              </span>
            </div>

            {/* ==========================================
                PAGE TITLE + ACTION BUTTONS
            ========================================== */}
            <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="m-0 text-[24px] font-bold sm:text-[27px]">
                  تفاصيل الطلب #{request.id}
                </h1>

                <p className="m-0 mt-1 text-[12px] text-[#64748B]">
                  تم التقديم بتاريخ {request.requestDate}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* BACK TO REQUESTS */}
                <button
                  type="button"
                  onClick={goBack}
                  className="flex h-[42px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[11px] transition hover:border-[#09379A]"
                >
                  <ArrowRight size={16} />
                  الطلبات
                </button>

                {/* APPROVE / REJECT */}
                {isPending ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        openDecision("rejected")
                      }
                      className="flex h-[42px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[11px] transition hover:border-[#09379A]"
                    >
                      <X size={15} />
                      رفض
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openDecision("approved")
                      }
                      className="flex h-[42px] items-center gap-2 rounded-[8px] bg-[#FF6534] px-5 text-[11px] font-bold text-white transition hover:bg-[#E95526]"
                    >
                      <Check size={15} />
                      قبول
                    </button>
                  </>
                ) : (
                  <StatusBadge status={request.status} />
                )}
              </div>
            </section>

            {/* ==========================================
                PROGRESS STEPS
                CONNECTED LINES BETWEEN ALL STEPS
            ========================================== */}
            <ProgressSteps status={request.status} />

            {/* ==========================================
                CONTENT COLUMNS
            ========================================== */}
            <div className="mt-6 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_390px]">

              {/* RIGHT COLUMN */}
              <div className="min-w-0 space-y-5">

                {/* STUDENT DATA */}
                <Card title="بيانات الطالب">
                  <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                    <Info
                      label="الطالب"
                      value={
                        request.fullName ||
                        request.studentName
                      }
                    />

                    <Info
                      label="الرقم الجامعي"
                      value={request.studentId}
                    />

                    <Info
                      label="التخصص"
                      value={request.major}
                    />

                    <Info
                      label="المعدل"
                      value={request.gpa}
                    />
                  </div>
                </Card>

                {/* TRAINING DATA */}
                <Card title="بيانات التدريب">
                  <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                    <Info
                      label="جهة التدريب"
                      value={request.organization}
                    />

                    <Info
                      label="المسمى"
                      value={request.position}
                    />

                    <Info
                      label="المدة"
                      value={request.duration}
                    />

                    <Info
                      label="نمط الحضور"
                      value={request.attendanceMode}
                    />
                  </div>
                </Card>

                {/* ATTACHMENTS */}
                <Card title="المرفقات">
                  <div className="space-y-3">
                    <Attachment
                      name="السيرة الذاتية.pdf"
                      size="1.8 MB"
                    />

                    <Attachment
                      name="كتاب التدريب الرسمي.pdf"
                      size="650 KB"
                    />
                  </div>
                </Card>

                {/* GENERAL NOTE */}
                <Card title="إضافة ملاحظة">
                  <label
                    htmlFor="request-note"
                    className="mb-2 block text-[11px] font-semibold"
                  >
                    ملاحظة للطالب
                  </label>

                  <textarea
                    id="request-note"
                    rows={4}
                    value={note}
                    onChange={(event) =>
                      setNote(event.target.value)
                    }
                    readOnly={!isPending}
                    placeholder="اكتب ملاحظاتك هنا..."
                    className={`w-full resize-none rounded-[8px] border border-[#E0E7F2] p-3 text-[12px] leading-6 outline-none focus:border-[#09379A] ${
                      !isPending
                        ? "bg-[#F8FAFC] text-[#475569]"
                        : "bg-white"
                    }`}
                  />

                  {isPending ? (
                    <p className="m-0 mt-2 text-[10px] leading-5 text-[#64748B]">
                      يمكن إضافة ملاحظة عند قبول الطلب.
                      أما سبب الرفض فيُكتب داخل نافذة الرفض.
                    </p>
                  ) : (
                    <p className="m-0 mt-2 text-[10px] text-[#64748B]">
                      تم اتخاذ قرار بشأن هذا الطلب.
                    </p>
                  )}
                </Card>
              </div>

              {/* LEFT COLUMN */}
              <div className="min-w-0 space-y-5">

                {/* REQUEST TIMELINE */}
                <Card title="مسار الطلب">
                  <RequestTimeline request={request} />
                </Card>

                {/* CURRENT STATUS */}
                <Card title="الحالة الحالية">
                  <StatusBadge status={request.status} />

                  <p className="m-0 mt-4 text-[11px] leading-6 text-[#64748B]">
                    {request.status === "pending" &&
                      "الملف معروض على المشرف لاتخاذ قرار القبول."}

                    {request.status === "approved" &&
                      "تمت موافقة المشرف على الطلب. بانتظار الاعتماد النهائي للتدريب."}

                    {request.status === "rejected" &&
                      "تم رفض الطلب من المشرف. يمكن مراجعة سبب الرفض في سجل القرار."}
                  </p>
                </Card>

                {/* DECISION HISTORY */}
                {request.status !== "pending" && (
                  <Card title="سجل القرار">
                    <Info
                      label="القرار"
                      value={
                        request.status === "approved"
                          ? "موافقة المشرف"
                          : "رفض الطلب"
                      }
                    />

                    <div className="mt-4">
                      <Info
                        label="تاريخ القرار"
                        value={
                          request.decisionDate ||
                          "غير مسجل"
                        }
                      />
                    </div>

                    <div className="mt-4">
                      <Info
                        label="المشرف"
                        value={
                          request.decidedBy ||
                          "بانتظار ربط هوية المشرف"
                        }
                      />
                    </div>

                    <div className="mt-4">
                      <Info
                        label={
                          request.status === "rejected"
                            ? "سبب الرفض"
                            : "ملاحظة المشرف"
                        }
                        value={
                          request.note ||
                          "لا توجد ملاحظة مسجلة"
                        }
                      />
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>

      {/* ==========================================
          NEW APPROVAL MODAL FROM FIGMA
      ========================================== */}
      {decision === "approved" && (
        <DecisionModal
          type="approved"
          studentName={
            request.fullName ||
            request.studentName
          }
          saving={saving}
          error={error}
          onCancel={closeDecision}
          onConfirm={confirmDecision}
        />
      )}

      {/* ==========================================
          NEW REJECTION MODAL FROM FIGMA
      ========================================== */}
      {decision === "rejected" && (
        <DecisionModal
          type="rejected"
          studentName={
            request.fullName ||
            request.studentName
          }
          rejectionReason={rejectionReason}
          setRejectionReason={(value) => {
            setRejectionReason(value);
            setError("");
          }}
          saving={saving}
          error={error}
          onCancel={closeDecision}
          onConfirm={confirmDecision}
        />
      )}
    </div>
  );
}

// =====================================================
// PROGRESS STEPS
// NEW CONNECTED DESIGN
// =====================================================

function ProgressSteps({ status }) {
  const steps = [
    "تقديم الطلب",
    "مراجعة المشرف",
    "اعتماد التدريب",
    "بدء التدريب",
  ];

  // "approved" means the supervisor accepted the request.
  // It does not mean final training approval.
  const currentStep =
    status === "approved" ? 2 : 1;

  const isRejected = status === "rejected";

  return (
    <section className="w-full rounded-[12px] border border-[#E0E7F2] bg-white px-4 py-5 sm:px-6">
      {/* 
        CSS flex with a connector between each pair.
        RTL ordering is right to left.
      */}
      <div className="flex w-full flex-wrap items-center gap-y-4 md:flex-nowrap">
        {steps.map((label, index) => {
          const completed =
            !isRejected && index < currentStep;

          const active =
            !isRejected && index === currentStep;

          const rejected =
            isRejected && index === 1;

          const firstStep =
            isRejected && index === 0;

          const isDone = completed || firstStep;

          return (
            <div
              key={label}
              className={`flex min-w-0 items-center ${
                index === steps.length - 1
                  ? "shrink-0"
                  : "flex-1"
              }`}
            >
              {/* STEP NODE */}
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <span
                  className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    isDone
                      ? "bg-[#15803D] text-white"
                      : rejected
                      ? "bg-[#DC2626] text-white"
                      : active
                      ? "bg-[#09379A] text-white"
                      : "border-2 border-[#E0E7F2] bg-white text-[#64748B]"
                  }`}
                >
                  {isDone ? (
                    <Check size={16} />
                  ) : rejected ? (
                    <X size={16} />
                  ) : (
                    index + 1
                  )}
                </span>

                <span
                  className={`whitespace-nowrap text-[10px] sm:text-[11px] ${
                    isDone
                      ? "font-semibold text-[#15803D]"
                      : rejected
                      ? "font-bold text-[#DC2626]"
                      : active
                      ? "font-bold text-[#09379A]"
                      : "text-[#64748B]"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* CONNECTOR LINE */}
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className={`mx-3 h-[2px] min-w-[12px] flex-1 rounded-full sm:mx-4 ${
                    index === 0
                      ? "bg-[#15803D]"
                      : "bg-[#E0E7F2]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {status === "approved" && (
        <p className="m-0 mt-4 text-[11px] text-[#15803D]">
          تمت موافقة المشرف، وبانتظار اعتماد التدريب.
        </p>
      )}

      {status === "rejected" && (
        <p className="m-0 mt-4 text-[11px] text-[#DC2626]">
          انتهت مرحلة مراجعة المشرف برفض الطلب.
        </p>
      )}
    </section>
  );
}

// =====================================================
// REQUEST TIMELINE WITH VERTICAL CONNECTORS
// =====================================================

function RequestTimeline({ request }) {
  const steps = [
    {
      title: "تقديم الطلب",
      text: request.requestDate,
      state: "done",
    },
    {
      title: "مراجعة الطلب والمتطلبات",
      text: "تم استلام الطلب للمراجعة",
      state: "done",
    },
  ];

  if (request.status === "pending") {
    steps.push({
      title: "بانتظار قرار المشرف",
      text: "قيد المراجعة",
      state: "current",
    });
  }

  if (request.status === "approved") {
    steps.push(
      {
        title: "موافقة المشرف",
        text:
          request.decisionDate ||
          "تمت الموافقة",
        state: "done",
      },
      {
        title: "بانتظار اعتماد التدريب",
        text: "المرحلة التالية",
        state: "current",
      }
    );
  }

  if (request.status === "rejected") {
    steps.push({
      title: "رفض الطلب",
      text:
        request.decisionDate ||
        "تم اتخاذ القرار",
      state: "rejected",
    });
  }

  return (
    <div>
      {steps.map((step, index) => {
        const done = step.state === "done";
        const rejected = step.state === "rejected";
        const last = index === steps.length - 1;

        return (
          <div
            key={`${step.title}-${index}`}
            className="relative flex min-h-[65px] items-start gap-3 last:min-h-0"
          >
            {/* LINE CONNECTING TIMELINE STEPS */}
            {!last && (
              <span
                aria-hidden="true"
                className={`absolute right-[15px] top-[31px] bottom-0 w-[2px] ${
                  done
                    ? "bg-[#D2ECDD]"
                    : "bg-[#E0E7F2]"
                }`}
              />
            )}

            {/* ICON */}
            <div
              className={`relative z-10 flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full ${
                rejected
                  ? "bg-[#FEE2E2] text-[#DC2626]"
                  : done
                  ? "bg-[#15803D] text-white"
                  : "bg-[#E8EEF9] text-[#09379A]"
              }`}
            >
              {rejected ? (
                <X size={15} />
              ) : done ? (
                <Check size={15} />
              ) : (
                <Clock3 size={15} />
              )}
            </div>

            {/* TEXT */}
            <div className="min-w-0 pb-4">
              <h3 className="m-0 text-[12px] font-bold">
                {step.title}
              </h3>

              <p className="m-0 mt-1 text-[11px] text-[#64748B]">
                {step.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =====================================================
// NEW FIGMA APPROVE / REJECT MODALS
// =====================================================

function DecisionModal({
  type,
  studentName,
  rejectionReason = "",
  setRejectionReason,
  saving,
  error,
  onCancel,
  onConfirm,
}) {
  const isApproval = type === "approved";

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-[#0F172A]/55 p-4 font-['Cairo']"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !saving
        ) {
          onCancel();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-decision-title"
        aria-describedby="request-decision-description"
        className="my-auto w-full max-w-[475px] rounded-[12px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:p-[26px]"
      >
        {/* FIGMA ICON - TOP RIGHT */}
        <div
          className={`mb-[19px] flex h-[52px] w-[52px] items-center justify-center rounded-full ${
            isApproval
              ? "bg-[#DCFCE7] text-[#15803D]"
              : "bg-[#FEE2E2] text-[#DC2626]"
          }`}
        >
          {isApproval ? (
            <CircleCheck
              size={25}
              strokeWidth={2.1}
            />
          ) : (
            <CircleX
              size={25}
              strokeWidth={2.1}
            />
          )}
        </div>

        {/* TITLE */}
        <h2
          id="request-decision-title"
          className="m-0 text-right text-[19px] font-bold leading-8 text-[#111C2D]"
        >
          {isApproval ? "قبول الطلب" : "رفض الطلب"}
        </h2>

        {/* DESCRIPTION */}
        <p
          id="request-decision-description"
          className="m-0 mt-3 text-right text-[12px] leading-7 text-[#64748B]"
        >
          {isApproval
            ? "سيتم قبول طلب التدريب وإشعار الطالبة وجهة التدريب، هل تريد المتابعة؟"
            : `سيتم إشعار الطالب ${studentName} برفض الطلب، يرجى كتابة سبب الرفض ليظهر له.`}
        </p>

        {/* REJECTION REASON - ONLY IN REJECTION MODAL */}
        {!isApproval && (
          <div className="mt-5">
            <label
              htmlFor="rejection-reason"
              className="mb-2 block text-right text-[12px] font-semibold text-[#111C2D]"
            >
              سبب الرفض
            </label>

            <textarea
              id="rejection-reason"
              rows={4}
              autoFocus
              value={rejectionReason}
              onChange={(event) =>
                setRejectionReason(event.target.value)
              }
              placeholder="اكتب السبب..."
              className="min-h-[110px] w-full resize-none rounded-[8px] border border-[#E0E7F2] bg-white px-4 py-3 text-right text-[12px] leading-6 text-[#111C2D] outline-none transition focus:border-[#09379A] focus:ring-2 focus:ring-[#09379A]/10"
            />
          </div>
        )}

        {/* VALIDATION / STORAGE ERROR */}
        {error && (
          <div
            role="alert"
            className="mt-3 flex items-center gap-2 rounded-[8px] bg-[#FEF2F2] px-3 py-2.5 text-[11px] text-[#DC2626]"
          >
            <AlertCircle
              size={16}
              className="shrink-0"
            />
            {error}
          </div>
        )}

        {/* FIGMA ACTION BUTTONS */}
        <div className="mt-[17px] flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={onConfirm}
            className={`inline-flex h-[41px] items-center justify-center gap-2 rounded-[8px] px-5 text-[12px] font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isApproval
                ? "bg-[#FF6534] text-[#111C2D] hover:bg-[#E95526]"
                : "bg-[#09379A] text-white hover:bg-[#072E81]"
            }`}
          >
            {isApproval ? (
              <Check size={16} />
            ) : (
              <X size={16} />
            )}

            {saving
              ? "جاري الحفظ..."
              : isApproval
              ? "تأكيد القبول"
              : "تأكيد الرفض"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="inline-flex h-[41px] items-center justify-center rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px] font-semibold text-[#111C2D] transition hover:bg-[#F8FAFC] disabled:opacity-60"
          >
            إلغاء
          </button>
        </div>
      </section>
    </div>
  );
}

// =====================================================
// CARD
// =====================================================

function Card({ title, children }) {
  return (
    <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
      <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[16px] font-bold text-[#062569]">
        {title}
      </h2>

      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}

// =====================================================
// INFO FIELD
// =====================================================

function Info({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="m-0 text-[11px] text-[#64748B]">
        {label}
      </p>

      <p className="m-0 mt-1 break-words text-[12px] font-semibold leading-6">
        {value || "—"}
      </p>
    </div>
  );
}

// =====================================================
// ATTACHMENT
// =====================================================

function Attachment({ name, size }) {
  return (
    <div className="flex items-center gap-3 rounded-[9px] border border-[#86E3A9] bg-[#DCFCE7] px-4 py-4">
      <FileText
        size={18}
        className="shrink-0 text-[#15803D]"
      />

      <div className="min-w-0 flex-1">
        <p className="m-0 break-all text-[11px] font-bold">
          {name}
        </p>

        <p className="m-0 mt-1 text-[10px] text-[#64748B]">
          {size}
        </p>
      </div>

      {/* Icon only until real file URLs are available */}
      <Download
        size={16}
        className="shrink-0 text-[#111C2D]"
        aria-hidden="true"
      />
    </div>
  );
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ status }) {
  const statuses = {
    pending: {
      label: "بانتظار الاعتماد",
      style: "bg-[#FFE5D9] text-[#B54708]",
    },
    approved: {
      label: "مقبول من المشرف",
      style: "bg-[#DCFCE7] text-[#15803D]",
    },
    rejected: {
      label: "مرفوض",
      style: "bg-[#FEE2E2] text-[#DC2626]",
    },
  };

  const item =
    statuses[status] || statuses.pending;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ${item.style}`}
    >
      <span className="h-[6px] w-[6px] rounded-full bg-current" />

      {item.label}
    </span>
  );
}

// =====================================================
// HEADER
// =====================================================


