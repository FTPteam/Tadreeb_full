import AcademicFooter from "../../components/shared/AcademicFooter";
import { ACADEMIC_PROGRAMS } from "../../constants/academicPrograms";
import { getOrganization as getSharedOrganization, saveOrganization } from "./trainingOrganizationsStore";
import AdminHeader from "../../components/admin/Header";

import { useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import {
  Bell,
  Menu,
  ChevronLeft,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  Upload,
  Save,
  X,
  AlertCircle,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

const STORAGE_KEY = "cis-training-organizations-v1";

const SPECIALIZATIONS = ACADEMIC_PROGRAMS;

const TYPES = [
  "تقنية معلومات واتصالات",
  "تقنية معلومات",
  "صناعي",
  "صيانة",
  "تصميم",
  "شركة",
  "مؤسسة",
  "مركز",
  "مصنع",
  "استوديو",
];

const DEFAULT_ORGANIZATION = {
  id: 1,
  name: "شركة القدس للاتصالات",
  type: "تقنية معلومات واتصالات",
  location: "غزة - الرمال",
  seats: 60,
  supervisor: "م. خالد عودة",
  phone: "0599000111",
  email: "training@qudscom.ps",
  agreementExpiry: "2026/09/01",
  specializations: [
    "تكنولوجيا علم البيانات",
    "الاتصالات وإنترنت الأشياء",
    "التصميم الجرافيكي والفنون الرقمية",
  ],
};

function getOrganization(id, passed) {
  const saved = getSharedOrganization(id);
  if (!saved) return null;
  const fallback = String(id) === "1" ? DEFAULT_ORGANIZATION : {};
  return {...fallback, ...((passed && String(passed.id)===String(id)) ? passed : {}), ...saved};
}
function saveOrganizationLocally(organization) {
  try { saveOrganization(organization); return true; } catch { return false; }
}

const inputClass =
  "h-[47px] w-full min-w-0 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[12px] text-[#111C2D] outline-none transition focus:border-[#09379A] focus:ring-2 focus:ring-[#09379A]/10";

export default function EditTrainingOrganization() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [originalOrganization] = useState(() =>
    getOrganization(id, location.state?.organization)
  );

  const [form, setForm] = useState(() => ({
    name: originalOrganization?.name || "",
    type: originalOrganization?.type || "",
    location: originalOrganization?.location || "",
    seats: String(
      originalOrganization?.seats ??
      originalOrganization?.capacity ??
      originalOrganization?.availableSeats ??
      0
    ),
    supervisor:
      originalOrganization?.supervisor ||
      originalOrganization?.supervisorName ||
      "",
    phone: originalOrganization?.phone || "",
    email: originalOrganization?.email || "",
    agreementEndDate:
      originalOrganization?.agreementExpiry ||
      originalOrganization?.agreementEndDate ||
      "",
  }));

  const [
    selectedSpecializations,
    setSelectedSpecializations,
  ] = useState(() =>
    Array.isArray(originalOrganization?.specializations)
      ? originalOrganization.specializations
      : []
  );

  const [agreementFile, setAgreementFile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-admin-sidebar")
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const toggleSpecialization = (specialization) => {
    setSelectedSpecializations((previous) =>
      previous.includes(specialization)
        ? previous.filter(
            (item) => item !== specialization
          )
        : [...previous, specialization]
    );
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("يسمح برفع ملف PDF فقط.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الملف يجب ألا يتجاوز 5MB.");
      event.target.value = "";
      return;
    }

    setAgreementFile(file);
    setError("");
  };

  // Return to details of the SAME organization
  const goBack = () => {
    if (!id) {
      navigate("/admin/training-organizations");
      return;
    }

    navigate(
      `/admin/training-organizations/${encodeURIComponent(id)}`,
      {
        state: {
          organization: originalOrganization,
        },
      }
    );
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!originalOrganization) {
      setError("بيانات جهة التدريب غير متوفرة.");
      return;
    }

    if (!form.name.trim()) {
      setError("يرجى إدخال اسم جهة التدريب.");
      return;
    }

    if (!form.type.trim()) {
      setError("يرجى اختيار نوع الجهة.");
      return;
    }

    if (!form.location.trim()) {
      setError("يرجى إدخال الموقع.");
      return;
    }

    if (!form.supervisor.trim()) {
      setError("يرجى إدخال اسم المشرف الميداني.");
      return;
    }

    if (!form.phone.trim()) {
      setError("يرجى إدخال رقم الهاتف.");
      return;
    }

    if (!form.email.trim()) {
      setError("يرجى إدخال البريد الإلكتروني.");
      return;
    }

    const seats = Number(form.seats);

    if (!Number.isInteger(seats) || seats < 0) {
      setError("يرجى إدخال عدد مقاعد صحيح.");
      return;
    }

    const updatedOrganization = {
      ...originalOrganization,
      id: originalOrganization.id,
      name: form.name.trim(),
      type: form.type,
      location: form.location.trim(),
      seats,
      capacity: seats,
      supervisor: form.supervisor.trim(),
      supervisorName: form.supervisor.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      agreementExpiry: form.agreementEndDate,
      agreementEndDate: form.agreementEndDate,
      renewalDate: form.agreementEndDate
        ? form.agreementEndDate.slice(0, 7)
        : originalOrganization.renewalDate || "—",
      specializations: [...selectedSpecializations],
      ...(agreementFile
        ? {
            agreementFileName: agreementFile.name,
            agreementFileSize: agreementFile.size,
          }
        : {}),
    };

    setSaving(true);

    const success = saveOrganizationLocally(
      updatedOrganization
    );

    if (!success) {
      setSaving(false);
      setError(
        "تعذر حفظ البيانات محليًا. تحقق من إعدادات التخزين في المتصفح."
      );
      return;
    }

    navigate(
      `/admin/training-organizations/${encodeURIComponent(id)}`,
      {
        replace: true,
        state: {
          organization: updatedOrganization,
          successMessage:
            "تم حفظ تعديلات جهة التدريب بنجاح.",
        },
      }
    );
  };

  if (!originalOrganization) {
    return (
      <div
        dir="rtl"
        className="flex h-screen bg-[#F8FAFC] font-['Cairo']"
      >
        <Sidebar />

        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-[22px] font-bold text-[#09379A]">
            جهة التدريب غير موجودة
          </h1>

          <p className="text-[12px] text-[#64748B]">
            لم يتم العثور على بيانات الجهة المطلوبة.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/training-organizations")
            }
            className="rounded-lg bg-[#09379A] px-5 py-3 text-white"
          >
            العودة إلى جهات التدريب
          </button>
        </main>
      </div>
    );
  }

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
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="hover:text-[#09379A]"
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/training-organizations")
                }
                className="hover:text-[#09379A]"
              >
                جهات التدريب
              </button>

              <ChevronLeft size={15} />

              <button
                type="button"
                onClick={goBack}
                className="hover:text-[#09379A]"
              >
                تفاصيل الجهة
              </button>

              <ChevronLeft size={15} />

              <span className="font-semibold text-[#111C2D]">
                تعديل جهة التدريب
              </span>
            </div>

            {/* PAGE TITLE */}
            <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="m-0 text-[27px] font-bold sm:text-[30px]">
                  تعديل جهة التدريب
                </h1>

                <p className="m-0 mt-1 text-[13px] text-[#64748B]">
                  تحديث بيانات {originalOrganization.name}
                </p>
              </div>

              <button
                type="button"
                onClick={goBack}
                className="inline-flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px] font-semibold transition hover:border-[#09379A] hover:text-[#09379A]"
              >
                <ArrowRight size={17} />
                رجوع
              </button>
            </section>

            {/* EDIT FORM */}
            <form
              onSubmit={handleSave}
              className="rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6"
            >
              <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[18px] font-bold text-[#062569]">
                بيانات الجهة
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                <TextField
                  label="اسم الجهة"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <SelectField
                  label="نوع الجهة"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  options={TYPES}
                  required
                />

                <TextField
                  label="الموقع"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  icon={MapPin}
                  required
                />

                <TextField
                  label="عدد المقاعد"
                  name="seats"
                  type="number"
                  min="0"
                  value={form.seats}
                  onChange={handleChange}
                  required
                />

                <TextField
                  label="اسم المشرف الميداني"
                  name="supervisor"
                  value={form.supervisor}
                  onChange={handleChange}
                  required
                />

                <TextField
                  label="رقم الهاتف"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  icon={Phone}
                  required
                />

                <TextField
                  label="البريد الإلكتروني"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  icon={Mail}
                  required
                />

                <TextField
                  label="تاريخ انتهاء الاتفاقية"
                  name="agreementEndDate"
                  type="date"
                  value={form.agreementEndDate}
                  onChange={handleChange}
                  icon={CalendarDays}
                />
              </div>

              {/* SPECIALIZATIONS */}
              <div className="mt-6">
                <h3 className="m-0 mb-3 text-[12px] font-bold text-[#334155]">
                  التخصصات المقبولة
                </h3>

                <div className="flex flex-wrap gap-2">
                  {SPECIALIZATIONS.map((specialization) => {
                    const selected =
                      selectedSpecializations.includes(
                        specialization
                      );

                    return (
                      <button
                        key={specialization}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          toggleSpecialization(specialization)
                        }
                        className={`rounded-full px-3 py-[7px] text-[10px] font-medium transition ${
                          selected
                            ? "bg-[#DCE7FF] text-[#2563EB]"
                            : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E8EEF5]"
                        }`}
                      >
                        {specialization}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AGREEMENT UPLOAD */}
              <div className="mt-6 rounded-[10px] border border-dashed border-[#D7E1F0] px-5 py-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[8px] bg-[#E7EEFC] text-[#09379A]">
                      <Upload size={19} />
                    </div>

                    <div>
                      <p className="m-0 text-[12px] font-bold">
                        رفع اتفاقية التعاون
                      </p>
                      <p className="m-0 mt-1 text-[10px] text-[#64748B]">
                        PDF حتى 5MB
                      </p>

                      {agreementFile ? (
                        <p className="m-0 mt-1 max-w-[280px] truncate text-[10px] font-semibold text-[#09379A]">
                          {agreementFile.name}
                        </p>
                      ) : originalOrganization.agreementFileName ? (
                        <p className="m-0 mt-1 text-[10px] text-[#64748B]">
                          الملف المسجل:{" "}
                          {originalOrganization.agreementFileName}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <label className="inline-flex h-[44px] cursor-pointer items-center justify-center rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[11px] font-semibold hover:border-[#09379A] hover:text-[#09379A]">
                    اختيار ملف
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {agreementFile && (
                  <button
                    type="button"
                    onClick={() => setAgreementFile(null)}
                    className="mt-3 inline-flex items-center gap-1 text-[11px] text-[#DC2626]"
                  >
                    <X size={14} />
                    إلغاء اختيار الملف
                  </button>
                )}

                <p className="mb-0 mt-3 text-[10px] leading-5 text-[#64748B]">
                  في النسخة التجريبية يُحفظ اسم الملف فقط.
                  رفع الاتفاقية فعليًا يحتاج ربط خدمة تخزين الملفات.
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  className="mt-5 flex items-center gap-2 rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[12px] text-[#DC2626]"
                >
                  <AlertCircle size={17} />
                  {error}
                </div>
              )}

              {/* ACTIONS */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="h-[44px] rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[11px] font-semibold hover:bg-[#F8FAFC]"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-[44px] items-center justify-center gap-2 rounded-[8px] bg-[#09379A] px-5 text-[11px] font-bold text-white transition hover:bg-[#072F86] disabled:opacity-60"
                >
                  <Save size={16} />
                  {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              </div>
            </form>

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}

function TextField({
  label,
  name,
  value,
  onChange,
  type = "text",
  icon: Icon,
  min,
  required = false,
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-medium text-[#334155]">
        {label}
        {required && (
          <span className="mr-1 text-[#DC2626]">*</span>
        )}
      </span>

      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#334155]"
          />
        )}

        <input
          type={type}
          name={name}
          min={min}
          required={required}
          value={value}
          onChange={onChange}
          dir={type === "email" || type === "tel" ? "ltr" : "rtl"}
          className={`${inputClass} ${
            Icon ? "pr-11" : ""
          } ${
            type === "email" || type === "tel"
              ? "text-left"
              : ""
          }`}
        />
      </div>
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) {
  const allOptions =
    value && !options.includes(value)
      ? [value, ...options]
      : options;

  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-medium text-[#334155]">
        {label}
        {required && (
          <span className="mr-1 text-[#DC2626]">*</span>
        )}
      </span>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={inputClass}
      >
        <option value="">اختر نوع الجهة</option>

        {allOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}


