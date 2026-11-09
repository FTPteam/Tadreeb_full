import AcademicFooter from "../../components/shared/AcademicFooter";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Info,
  Paperclip,
  Send,
  Trash2,
  UploadCloud,
} from "lucide-react";

import Header from "../../components/student/Header";
import { api } from "../../api/client";
import { fetchMyApplication } from "../../api/student";
import Sidebar from "../../components/student/Sidebar";

const ATTENDANCE_KEY = "studentAttendanceRecords";
const EXCUSES_KEY = "studentAbsenceExcuses";

// بيانات تجريبية احتياطية عند عدم وجود سجل محفوظ.
const fallbackAttendance = [
  {
    id: 3,
    date: "2025/10/03",
    day: "الجمعة",
    status: "absent",
    note: "غياب غير مبرر",
  },
  {
    id: 15,
    date: "2025/10/21",
    day: "الثلاثاء",
    status: "absent",
    note: "غياب غير مبرر",
  },
];

function normalizeDate(value) {
  if (!value) return "";

  const parts = String(value).split(/[-/]/);

  if (parts.length !== 3) return "";

  const [year, month, day] = parts;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDateLabel(value) {
  const normalized = normalizeDate(value);

  if (!normalized) return value;

  const date = new Date(`${normalized}T12:00:00`);

  const dayName = new Intl.DateTimeFormat("ar", {
    weekday: "long",
  }).format(date);

  return `${dayName} ${normalized.replace(/-/g, "/")}`;
}

function readStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);

    if (!value) return fallback;

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function readAttendance() {
  const stored = readStorage(ATTENDANCE_KEY, null);

  if (stored?.length) return stored;

  return fallbackAttendance;
}

function readExcuses() {
  return readStorage(EXCUSES_KEY, []);
}

// يسمح بإعادة التقديم بعد رفض العذر فقط.
function hasActiveExcuse(excuses, date) {
  return excuses.some(
    (item) =>
      normalizeDate(item.date) === normalizeDate(date) &&
      item.status !== "rejected"
  );
}

export default function AbsenceExcuse() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const requestedDate = normalizeDate(
    location.state?.absenceDate
  );

  const [attendanceRows, setAttendanceRows] = useState(
    () => readAttendance()
  );

  const [savedExcuses, setSavedExcuses] = useState(
    () => readExcuses()
  );

  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // تحديث البيانات عند العودة إلى الصفحة.
  useEffect(() => {
    const refreshData = () => {
      setAttendanceRows(readAttendance());
      setSavedExcuses(readExcuses());
    };

    window.addEventListener("focus", refreshData);

    return () => {
      window.removeEventListener("focus", refreshData);
    };
  }, []);

  // استخراج أيام الغياب فقط من سجل الحضور.
  const availableDates = useMemo(() => {
    const absentRows = attendanceRows.filter(
      (row) => row.status === "absent"
    );

    const uniqueDates = new Map();

    absentRows.forEach((row) => {
      const date = normalizeDate(row.date);

      if (!date) return;

      if (!uniqueDates.has(date)) {
        uniqueDates.set(date, {
          value: date,
          label: formatDateLabel(date),
        });
      }
    });

    return Array.from(uniqueDates.values())
      .sort((a, b) => b.value.localeCompare(a.value))
      .map((item) => ({
        ...item,
        submitted: hasActiveExcuse(
          savedExcuses,
          item.value
        ),
      }));
  }, [attendanceRows, savedExcuses]);

  const getInitialDate = () => {
    const requested = availableDates.find(
      (item) =>
        item.value === requestedDate && !item.submitted
    );

    if (requested) return requested.value;

    return (
      availableDates.find((item) => !item.submitted)?.value ||
      ""
    );
  };

  const [formData, setFormData] = useState(() => ({
    date: "",
    excuseType: "",
    reason: "",
    notes: "",
  }));

  // اختيار تاريخ الغياب القادم من صفحة الحضور.
  useEffect(() => {
    setFormData((previous) => {
      const currentDateStillAvailable = availableDates.some(
        (item) =>
          item.value === previous.date && !item.submitted
      );

      if (currentDateStillAvailable) return previous;

      return {
        ...previous,
        date: getInitialDate(),
      };
    });
  }, [availableDates, requestedDate]);

  const selectedDateInfo = availableDates.find(
    (item) => item.value === formData.date
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      general: "",
    }));
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((previous) => ({
        ...previous,
        attachment: "يسمح فقط بملفات PDF أو JPG أو PNG.",
      }));

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        attachment: "حجم الملف يجب ألا يتجاوز 5 ميجابايت.",
      }));

      event.target.value = "";
      return;
    }

    setAttachment(file);

    setErrors((previous) => ({
      ...previous,
      attachment: "",
    }));
  };

  const removeAttachment = () => {
    setAttachment(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = "لا توجد أيام غياب متاحة لتقديم عذر.";
    }

    if (!formData.excuseType) {
      newErrors.excuseType = "يرجى اختيار نوع العذر.";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "يرجى كتابة سبب الغياب.";
    } else if (formData.reason.trim().length < 15) {
      newErrors.reason = "يرجى توضيح السبب بشكل أكبر.";
    }

    const latestExcuses = readExcuses();

    if (
      formData.date &&
      hasActiveExcuse(latestExcuses, formData.date)
    ) {
      newErrors.date =
        "تم تقديم عذر لهذا اليوم مسبقًا.";
    }

    const dateIsAbsent = attendanceRows.some(
      (row) =>
        row.status === "absent" &&
        normalizeDate(row.date) ===
          normalizeDate(formData.date)
    );

    if (formData.date && !dateIsAbsent) {
      newErrors.date =
        "التاريخ المحدد غير موجود ضمن أيام الغياب المسجلة.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const currentExcuses = readExcuses();

    if (hasActiveExcuse(currentExcuses, formData.date)) {
      setErrors((previous) => ({
        ...previous,
        date: "تم تقديم عذر لهذا اليوم مسبقًا.",
      }));

      setSavedExcuses(currentExcuses);
      return;
    }

    const newExcuse = {
      id: Date.now(),
      date: formData.date,
      excuseType: formData.excuseType,
      reason: formData.reason.trim(),
      notes: formData.notes.trim(),
      attachmentName: attachment?.name || "",
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    try {
      const myApp = await fetchMyApplication().catch(() => null);
      if (myApp?.id) {
        await api("/exception-requests/", {
          method: "POST",
          body: {
            application: Number(myApp.id),
            kind: "issue",
            reason: `طلب عذر غياب (${formData.excuseType}) لتاريخ ${formData.date}: ${formData.reason.trim()}`,
          },
        }).catch((e) => console.warn("Could not post exception request:", e));
      }

      const updatedExcuses = [
        ...currentExcuses,
        newExcuse,
      ];

      localStorage.setItem(
        EXCUSES_KEY,
        JSON.stringify(updatedExcuses)
      );

      setSavedExcuses(updatedExcuses);
      setSubmitted(true);
      setErrors({});
    } catch {
      setErrors((previous) => ({
        ...previous,
        general:
          "تعذر حفظ الطلب. تحقق من مساحة التخزين وحاول مجددًا.",
      }));
    }
  };

  const resetForm = () => {
    const refreshedExcuses = readExcuses();

    setSavedExcuses(refreshedExcuses);
    setAttendanceRows(readAttendance());

    setFormData({
      date: "",
      excuseType: "",
      reason: "",
      notes: "",
    });

    setAttachment(null);
    setErrors({});
    setSubmitted(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // شاشة نجاح الإرسال.
  if (submitted) {
    return (
      <PageShell>
        <main className="min-h-0 flex-1 overflow-y-auto bg-[#F8FAFC] px-4 py-8">
          <div className="mx-auto flex min-h-[calc(100vh-170px)] w-full max-w-[650px] items-center justify-center">
            <section className="w-full rounded-[18px] border border-[#BBF7D0] bg-white p-5 text-center shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-8">
              <div className="mx-auto flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#ECFDF3] text-[#16A34A]">
                <CheckCircle2 size={30} strokeWidth={2} />
              </div>

              <span className="mt-4 inline-flex min-h-[26px] items-center gap-[6px] rounded-full bg-[#FFF7ED] px-[10px] text-[11px] font-bold text-[#D97706]">
                <span className="h-[6px] w-[6px] rounded-full bg-[#F59E0B]" />
                قيد المراجعة
              </span>

              <h1 className="m-0 mt-4 text-[22px] font-bold leading-[34px] text-[#14213D] sm:text-[24px]">
                تم إرسال عذر الغياب بنجاح
              </h1>

              <p className="mx-auto mb-0 mt-[7px] max-w-[500px] text-[12px] leading-[22px] text-[#64748B] sm:text-[13px] sm:leading-[24px]">
                تم تسجيل طلب العذر بتاريخ{" "}
                <strong className="text-[#334155]">
                  {formData.date}
                </strong>
                ، وسيتم مراجعته من الجهة المختصة.
              </p>

              <div className="mt-5 rounded-[10px] border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-right">
                <div className="flex items-start gap-[8px]">
                  <Info
                    size={17}
                    className="mt-[2px] shrink-0 text-[#2563EB]"
                  />

                  <p className="m-0 text-[11px] leading-[20px] text-[#475569]">
                    تم حفظ بيانات الطلب محليًا في هذا المتصفح.
                    إرسال العذر لا يعني اعتماده تلقائيًا.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-[9px] sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/student/attendance")
                  }
                  className="flex min-h-[42px] items-center justify-center gap-[7px] rounded-[8px] border-0 bg-[#09379A] px-[18px] text-[11px] font-bold text-white hover:bg-[#072E81]"
                >
                  العودة إلى الحضور والغياب
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={
                    !availableDates.some(
                      (item) => !item.submitted
                    )
                  }
                  className="flex min-h-[42px] items-center justify-center rounded-[8px] border border-[#D9E2EC] bg-white px-[18px] text-[11px] font-bold text-[#475569] hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  تقديم عذر آخر
                </button>
              </div>
            </section>
          </div>
        
            <AcademicFooter audience="student" />
          </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] px-4 pb-8 pt-5 sm:px-5 sm:pt-6 md:px-6 md:pt-7 xl:px-[40px] xl:pb-[40px] xl:pt-[14px]">
        <div className="mx-auto w-full max-w-[1080px]">
          {/* مسار التنقل */}
          <nav
            aria-label="مسار التنقل"
            className="flex flex-wrap items-center gap-[7px] text-[11px] font-medium leading-[20px] sm:text-[12px] xl:text-[13px]"
          >
            <button
              type="button"
              onClick={() => navigate("/student/dashboard")}
              className="border-0 bg-transparent p-0 text-[#64748B] hover:text-[#09379A]"
            >
              الرئيسية
            </button>

            <span className="text-[#94A3B8]">›</span>

            <button
              type="button"
              onClick={() => navigate("/student/attendance")}
              className="border-0 bg-transparent p-0 text-[#64748B] hover:text-[#09379A]"
            >
              الحضور والغياب
            </button>

            <span className="text-[#94A3B8]">›</span>

            <span className="font-bold text-[#09379A]">
              تقديم عذر غياب
            </span>
          </nav>

          {/* عنوان الصفحة */}
          <section className="mt-[7px] flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="m-0 text-[24px] font-bold leading-[36px] text-[#14213D] sm:text-[26px] xl:text-[28px] xl:leading-[40px]">
                تقديم عذر غياب
              </h1>

              <p className="m-0 mt-[4px] max-w-[680px] text-[12px] leading-[22px] text-[#64748B] sm:text-[13px]">
                اختر يوم الغياب المسجل، ووضح سبب الغياب وأرفق المستندات الداعمة إن وجدت.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/student/attendance")}
              className="flex min-h-[38px] w-fit items-center gap-[7px] rounded-[8px] border border-[#D9E2EC] bg-white px-[13px] text-[11px] font-bold text-[#475569] hover:bg-[#F8FAFC]"
            >
              <ArrowRight size={14} />
              رجوع
            </button>
          </section>

          {/* تنبيه عدم وجود غياب */}
          {availableDates.filter((item) => !item.submitted).length ===
            0 && (
            <section className="mt-5 flex items-start gap-3 rounded-[12px] border border-[#BFDBFE] bg-[#EFF6FF] p-4">
              <Info
                size={19}
                className="mt-0.5 shrink-0 text-[#2563EB]"
              />

              <div>
                <h2 className="m-0 text-[13px] font-bold text-[#1E40AF]">
                  لا توجد أيام غياب متاحة لتقديم عذر
                </h2>

                <p className="mb-0 mt-1 text-[11px] leading-5 text-[#475569]">
                  ستظهر هنا أيام الغياب المسجلة التي لم يُقدَّم لها
                  عذر مسبقًا.
                </p>
              </div>
            </section>
          )}

          {/* النموذج والمعلومات الجانبية */}
          <section
            dir="ltr"
            className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-[22px]"
          >
            <form
              dir="rtl"
              onSubmit={handleSubmit}
              className="rounded-[14px] border border-[#DDE5EF] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-5 xl:px-6 xl:py-6"
            >
              <div className="flex items-center gap-[10px]">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] bg-[#EEF3FF] text-[#09379A]">
                  <FileText size={18} />
                </div>

                <div>
                  <h2 className="m-0 text-[16px] font-bold text-[#1E293B] sm:text-[17px]">
                    بيانات طلب العذر
                  </h2>

                  <p className="m-0 mt-[2px] text-[11px] leading-[18px] text-[#64748B]">
                    يرجى تعبئة البيانات المطلوبة بدقة قبل الإرسال.
                  </p>
                </div>
              </div>

              {/* تاريخ الغياب */}
              <FormGroup
                label="تاريخ الغياب"
                required
                error={errors.date}
              >
                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="absolute right-[13px] top-1/2 -translate-y-1/2 text-[#94A3B8]"
                  />

                  <select
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    disabled={
                      !availableDates.some(
                        (item) => !item.submitted
                      )
                    }
                    className={`h-[46px] w-full appearance-none rounded-[9px] border bg-white pr-[40px] pl-[14px] font-['Cairo'] text-[12px] font-medium text-[#334155] outline-none focus:border-[#09379A] focus:ring-2 focus:ring-[#09379A]/10 disabled:bg-[#F8FAFC] ${
                      errors.date
                        ? "border-[#FCA5A5]"
                        : "border-[#DDE5EF]"
                    }`}
                  >
                    <option value="">اختر يوم الغياب</option>

                    {availableDates.map((date) => (
                      <option
                        key={date.value}
                        value={date.value}
                        disabled={date.submitted}
                      >
                        {date.label}
                        {date.submitted
                          ? " — تم تقديم عذر"
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="mt-2 text-[10px] leading-[18px] text-[#64748B]">
                  يتم عرض أيام الغياب المسجلة في سجل الحضور فقط.
                </p>
              </FormGroup>

              {/* نوع العذر */}
              <FormGroup
                label="نوع العذر"
                required
                error={errors.excuseType}
              >
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { value: "medical", label: "مرضي" },
                    { value: "family", label: "ظرف عائلي" },
                    { value: "official", label: "رسمي" },
                    { value: "other", label: "أخرى" },
                  ].map((type) => {
                    const selected =
                      formData.excuseType === type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setFormData((previous) => ({
                            ...previous,
                            excuseType: type.value,
                          }));

                          setErrors((previous) => ({
                            ...previous,
                            excuseType: "",
                          }));
                        }}
                        className={`min-h-[42px] rounded-[8px] border px-3 text-[11px] font-bold transition ${
                          selected
                            ? "border-[#09379A] bg-[#EEF3FF] text-[#09379A]"
                            : "border-[#DDE5EF] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                        }`}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </FormGroup>

              {/* سبب الغياب */}
              <FormGroup
                label="سبب الغياب"
                required
                error={errors.reason}
              >
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  maxLength={500}
                  placeholder="اكتب سبب الغياب بشكل واضح..."
                  className={`min-h-[125px] w-full resize-y rounded-[9px] border bg-white px-4 py-3 font-['Cairo'] text-[12px] leading-[22px] text-[#334155] outline-none placeholder:text-[#94A3B8] focus:border-[#09379A] focus:ring-2 focus:ring-[#09379A]/10 ${
                    errors.reason
                      ? "border-[#FCA5A5]"
                      : "border-[#DDE5EF]"
                  }`}
                />

                <div className="mt-[5px] text-left text-[10px] text-[#94A3B8]">
                  {formData.reason.length}/500
                </div>
              </FormGroup>

              {/* المستند الداعم */}
              <FormGroup
                label="المستند الداعم"
                hint="اختياري"
                error={errors.attachment}
              >
                {!attachment ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex min-h-[115px] w-full flex-col items-center justify-center rounded-[10px] border border-dashed border-[#BFCDE1] bg-[#FAFBFD] px-4 py-4 text-center transition hover:border-[#09379A] hover:bg-[#F5F8FF]"
                  >
                    <UploadCloud
                      size={24}
                      className="text-[#09379A]"
                    />

                    <strong className="mt-[8px] text-[11px] text-[#334155]">
                      اضغط لرفع المستند
                    </strong>

                    <span className="mt-[3px] text-[10px] text-[#94A3B8]">
                      PDF, JPG, PNG — بحد أقصى 5MB
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-3 rounded-[10px] border border-[#DDE5EF] bg-[#F8FAFC] px-4 py-3">
                    <div className="flex min-w-0 items-center gap-[9px]">
                      <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[8px] bg-[#EEF3FF] text-[#09379A]">
                        <Paperclip size={16} />
                      </div>

                      <div className="min-w-0">
                        <strong className="block truncate text-[11px] text-[#334155]">
                          {attachment.name}
                        </strong>

                        <span className="mt-[2px] block text-[10px] text-[#94A3B8]">
                          {(attachment.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeAttachment}
                      aria-label="إزالة المرفق"
                      className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[7px] border border-[#FECACA] bg-[#FFF7F7] text-[#DC2626]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFile}
                  className="hidden"
                />
              </FormGroup>

              {/* ملاحظات إضافية */}
              <FormGroup
                label="ملاحظات إضافية"
                hint="اختياري"
              >
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  maxLength={300}
                  placeholder="أي تفاصيل إضافية ترغب في توضيحها..."
                  className="min-h-[90px] w-full resize-y rounded-[9px] border border-[#DDE5EF] bg-white px-4 py-3 font-['Cairo'] text-[12px] leading-[22px] text-[#334155] outline-none placeholder:text-[#94A3B8] focus:border-[#09379A] focus:ring-2 focus:ring-[#09379A]/10"
                />
              </FormGroup>

              {errors.general && (
                <p
                  role="alert"
                  className="mt-4 text-[11px] leading-5 text-[#DC2626]"
                >
                  {errors.general}
                </p>
              )}

              {/* أزرار النموذج */}
              <div className="mt-6 flex flex-col gap-[9px] border-t border-[#EEF2F7] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => navigate("/student/attendance")}
                  className="order-2 flex min-h-[42px] items-center justify-center rounded-[8px] border border-[#D9E2EC] bg-white px-[17px] text-[11px] font-bold text-[#475569] hover:bg-[#F8FAFC] sm:order-1"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={
                    !availableDates.some(
                      (item) => !item.submitted
                    )
                  }
                  className="order-1 flex min-h-[43px] items-center justify-center gap-[8px] rounded-[8px] border-0 bg-[#09379A] px-[20px] text-[11px] font-bold text-white shadow-[0_4px_12px_rgba(9,55,154,0.15)] hover:bg-[#072E81] disabled:cursor-not-allowed disabled:opacity-50 sm:order-2"
                >
                  <Send size={15} />
                  إرسال طلب العذر
                </button>
              </div>
            </form>

            {/* المعلومات الجانبية */}
            <aside
              dir="rtl"
              className="flex flex-col gap-4"
            >
              <section className="rounded-[14px] border border-[#DDE5EF] bg-white p-4">
                <h2 className="m-0 text-[14px] font-bold text-[#1E293B]">
                  حالة الطلب
                </h2>

                <div className="mt-4 flex items-start gap-[10px] rounded-[10px] bg-[#FFF7ED] p-3">
                  <div className="flex h-[33px] w-[33px] shrink-0 items-center justify-center rounded-full bg-[#FFEDD5] text-[#D97706]">
                    <Clock3 size={15} />
                  </div>

                  <div>
                    <strong className="text-[11px] text-[#9A5510]">
                      لم يتم الإرسال بعد
                    </strong>

                    <p className="m-0 mt-[3px] text-[11px] leading-[19px] text-[#64748B]">
                      بعد إرسال الطلب ستتحول حالته إلى قيد المراجعة.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[14px] border border-[#BFDBFE] bg-[#EFF6FF] p-4">
                <div className="flex items-start gap-[9px]">
                  <Info
                    size={17}
                    className="mt-[1px] shrink-0 text-[#2563EB]"
                  />

                  <div>
                    <h3 className="m-0 text-[12px] font-bold text-[#1E40AF]">
                      تعليمات تقديم العذر
                    </h3>

                    <ul className="m-0 mt-[8px] space-y-[7px] pr-[17px] text-[11px] leading-[19px] text-[#475569]">
                      <li>
                        يمكن تقديم العذر لأيام الغياب المسجلة.
                      </li>
                      <li>
                        يفضل إرفاق مستند داعم للأعذار الطبية أو الرسمية.
                      </li>
                      <li>
                        إرسال العذر لا يعني اعتماده تلقائيًا.
                      </li>
                      <li>
                        لا يمكن تقديم عذر آخر للتاريخ نفسه ما دام الطلب قيد المراجعة أو معتمدًا.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="rounded-[14px] border border-[#DDE5EF] bg-white p-4">
                <h3 className="m-0 text-[13px] font-bold text-[#1E293B]">
                  ملخص العذر
                </h3>

                <div className="mt-4 flex flex-col gap-[11px]">
                  <SummaryRow
                    label="التاريخ"
                    value={formData.date || "لم يتم الاختيار"}
                  />

                  <SummaryRow
                    label="نوع الطلب"
                    value={
                      selectedDateInfo
                        ? "عذر لغياب سابق"
                        : "غير محدد"
                    }
                  />

                  <SummaryRow
                    label="المرفق"
                    value={
                      attachment
                        ? "تم اختيار مستند"
                        : "لا يوجد"
                    }
                  />

                  <SummaryRow
                    label="الأعذار المقدمة"
                    value={String(savedExcuses.length)}
                  />
                </div>
              </section>
            </aside>
          </section>
        </div>
      
            <AcademicFooter audience="student" />
          </main>
    </PageShell>
  );
}

function PageShell({ children }) {
  return (
    <div
      dir="rtl"
      className="flex h-dvh w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#1E293B]"
    >
      <Sidebar />

      <div className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden bg-[#F8FAFC]">
        <div className="relative shrink-0">
          <Header />
        </div>

        {children}
      </div>
    </div>
  );
}

function FormGroup({
  label,
  required = false,
  hint,
  error,
  children,
}) {
  return (
    <div className="mt-5">
      <div className="mb-[7px] flex items-center justify-between gap-3">
        <label className="text-[12px] font-bold text-[#334155]">
          {label}

          {required && (
            <span className="mr-[3px] text-[#DC2626]">
              *
            </span>
          )}
        </label>

        {hint && (
          <span className="text-[10px] text-[#94A3B8]">
            {hint}
          </span>
        )}
      </div>

      {children}

      {error && (
        <div
          role="alert"
          className="mt-[6px] flex items-center gap-[5px] text-[11px] leading-5 text-[#DC2626]"
        >
          <AlertCircle size={13} />
          {error}
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[11px] text-[#94A3B8]">
        {label}
      </span>

      <strong className="text-left text-[11px] font-bold leading-[18px] text-[#334155]">
        {value}
      </strong>
    </div>
  );
}
