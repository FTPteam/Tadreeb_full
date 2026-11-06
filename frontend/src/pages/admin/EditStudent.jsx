import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";

import { useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  ArrowRight,
  Bell,
  Menu,
  Mail,
  Phone,
  Save,
  ChevronLeft,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";
import { getStudent, saveStudent } from "./studentsStore";
import { ACADEMIC_PROGRAMS, ACADEMIC_DEPARTMENT } from "../../constants/academicPrograms";

// =====================================================
// OPTIONS
// =====================================================

const MAJORS = ACADEMIC_PROGRAMS;

const LEVELS = [
  "الدبلوم المتوسط",
];

const SUPERVISORS = [
  "د. سامر يوسف",
  "م. خالد عودة",
];

const ORGANIZATIONS = [
  "شركة القدس للاتصالات",
  "شركة جوال",
  "شركة المشرق الرقمية",
  "شركة الأمل للأنظمة الصناعية",
  "استوديو بيكسل للتصميم",
  "شركة التقنية الحديثة",
];

// =====================================================
// MAIN PAGE
// =====================================================

export default function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // بيانات الطالب القادمة من StudentDetails
  const student = getStudent(id || location.state?.student?.id);

  // رقم الطالب الحالي لا يتغير أثناء التعديل
  const studentId = id || student?.id || "";

  // =====================================================
  // FORM STATE
  // =====================================================

  const [form, setForm] = useState(() => ({
    name: student?.name || "",
    studentId: studentId,
    major: student?.major || "",
    level: student?.level || "الدبلوم المتوسط",
    email: student?.email || "",
    phone: student?.phone || "",
    supervisor: student?.supervisor || "",
    organization: student?.organization || "",
    notes: student?.notes || "",
  }));

  const [error, setError] = useState("");

  // =====================================================
  // UPDATE FIELD
  // =====================================================

  const update = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =====================================================
  // SIDEBAR
  // =====================================================

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-admin-sidebar")
    );
  };

  // =====================================================
  // GO BACK TO STUDENT DETAILS
  // =====================================================

  const handleBack = () => {
    if (!studentId) {
      navigate("/admin/students");
      return;
    }

    navigate(
      `/admin/students/${encodeURIComponent(studentId)}`,
      {
        state: {
          student: student || undefined,
        },
      }
    );
  };

  // =====================================================
  // SAVE CHANGES
  // =====================================================

  const save = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("يرجى إدخال اسم الطالب.");
      return;
    }

    if (!form.studentId.trim()) {
      setError("الرقم الجامعي مطلوب.");
      return;
    }

    if (!form.major.trim()) {
      setError("يرجى اختيار التخصص.");
      return;
    }

    const updatedStudent = {
      ...(student || {}),
      id: studentId,
      name: form.name.trim(),
      major: form.major,
      level: form.level,
      email: form.email.trim(),
      phone: form.phone.trim(),
      supervisor: form.supervisor,
      organization: form.organization,
      notes: form.notes.trim(),
    };

    try {
      saveStudent(updatedStudent);
    } catch {
      setError("تعذر حفظ بيانات الطالب. حاول مجددًا.");
      return;
    }

    // الرجوع إلى تفاصيل نفس الطالب
    navigate(
      `/admin/students/${encodeURIComponent(studentId)}`,
      {
        replace: true,
        state: {
          student: updatedStudent,
          successMessage: "تم تحديث بيانات الطالب بنجاح.",
        },
      }
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]"
    >
      {/* SIDEBAR */}
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        {/* HEADER */}
        <AdminHeader />

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1450px]">

            {/* BREADCRUMB */}
            <div className="mb-3 flex items-center gap-2 text-[12px] text-[#64748B]">
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
                onClick={() => navigate("/admin/students")}
                className="hover:text-[#09379A]"
              >
                الطلاب
              </button>

              <ChevronLeft size={15} />

              <button
                type="button"
                onClick={handleBack}
                className="hover:text-[#09379A]"
              >
                تفاصيل الطالب
              </button>

              <ChevronLeft size={15} />

              <span className="font-semibold text-[#111C2D]">
                تعديل الطالب
              </span>
            </div>

            {/* PAGE TITLE */}
            <section className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row">
              <div>
                <h1 className="m-0 text-[27px] font-bold">
                  تعديل بيانات الطالب
                </h1>

                <p className="mt-1 text-[13px] text-[#64748B]">
                  تحديث بيانات الطالب{" "}
                  <span className="font-semibold text-[#09379A]">
                    {student?.name || form.name || studentId}
                  </span>
                </p>
              </div>

              {/* BACK BUTTON */}
              <button
                type="button"
                onClick={handleBack}
                className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px] transition hover:border-[#09379A] hover:text-[#09379A]"
              >
                <ArrowRight size={17} />
                رجوع
              </button>
            </section>

            {/* FORM */}
            <form
              onSubmit={save}
              className="rounded-[12px] border border-[#E0E7F2] bg-white p-4 sm:p-6"
            >
              <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                بيانات الطالب
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* STUDENT NAME */}
                <Input
                  label="الاسم الكامل"
                  value={form.name}
                  onChange={(value) =>
                    update("name", value)
                  }
                  required
                />

                {/* STUDENT ID */}
                <Input
                  label="الرقم الجامعي"
                  value={form.studentId}
                  readOnly
                  helperText="الرقم الجامعي ثابت للحفاظ على ارتباط سجلات الطالب."
                />

                {/* MAJOR */}
                <Select
                  label="التخصص"
                  value={form.major}
                  onChange={(value) =>
                    update("major", value)
                  }
                  options={MAJORS}
                />

                {/* LEVEL */}
                <Select
                  label="المستوى"
                  value={form.level}
                  onChange={(value) =>
                    update("level", value)
                  }
                  options={LEVELS}
                />

                {/* EMAIL */}
                <IconInput
                  label="البريد الإلكتروني"
                  icon={Mail}
                  type="email"
                  value={form.email}
                  onChange={(value) =>
                    update("email", value)
                  }
                />

                {/* PHONE */}
                <IconInput
                  label="رقم الهاتف"
                  icon={Phone}
                  type="tel"
                  value={form.phone}
                  onChange={(value) =>
                    update("phone", value)
                  }
                />

                {/* SUPERVISOR */}
                <Select
                  label="المشرف الأكاديمي"
                  value={form.supervisor}
                  onChange={(value) =>
                    update("supervisor", value)
                  }
                  options={SUPERVISORS}
                />

                {/* ORGANIZATION */}
                <Select
                  label="جهة التدريب"
                  value={form.organization}
                  onChange={(value) =>
                    update("organization", value)
                  }
                  options={ORGANIZATIONS}
                />
              </div>

              {/* NOTES */}
              <label className="mt-5 block">
                <span className="mb-2 block text-[11px] font-semibold">
                  ملاحظات
                </span>

                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(event) =>
                    update("notes", event.target.value)
                  }
                  placeholder="أضف ملاحظة إن وجدت..."
                  className="w-full resize-none rounded-[8px] border border-[#E0E7F2] p-3 text-[12px] outline-none focus:border-[#09379A] focus:ring-2 focus:ring-[#09379A]/10"
                />
              </label>

              {/* INFO */}
              <div className="mt-5 rounded-[7px] bg-[#F1F5F9] px-4 py-3 text-[11px] leading-6 text-[#64748B]">
                التخصصات المتاحة ضمن {ACADEMIC_DEPARTMENT} فقط.
              </div>

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[12px] text-[#DC2626]"
                >
                  {error}
                </div>
              )}

              {/* FORM ACTIONS */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">

                {/* CANCEL */}
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-[42px] rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[11px] transition hover:bg-[#F8FAFC]"
                >
                  إلغاء
                </button>

                {/* SAVE */}
                <button
                  type="submit"
                  className="flex h-[42px] items-center gap-2 rounded-[8px] bg-[#09379A] px-5 text-[11px] font-bold text-white transition hover:bg-[#072E81]"
                >
                  <Save size={15} />
                  حفظ التغييرات
                </button>
              </div>
            </form>

            {/* FOOTER */}
            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}

// =====================================================
// SHARED INPUT CLASS
// =====================================================

const inputClass =
  "h-[47px] w-full rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[12px] outline-none focus:border-[#09379A] focus:ring-2 focus:ring-[#09379A]/10";

// =====================================================
// INPUT COMPONENT
// =====================================================

function Input({
  label,
  value,
  onChange,
  required = false,
  readOnly = false,
  helperText,
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-semibold">
        {label}
        {required && (
          <span className="mr-1 text-[#DC2626]">*</span>
        )}
      </span>

      <input
        required={required}
        readOnly={readOnly}
        value={value}
        onChange={(event) =>
          onChange?.(event.target.value)
        }
        className={`${inputClass} ${
          readOnly
            ? "cursor-not-allowed bg-[#F8FAFC] text-[#64748B]"
            : ""
        }`}
      />

      {helperText && (
        <span className="mt-1 block text-[10px] text-[#94A3B8]">
          {helperText}
        </span>
      )}
    </label>
  );
}

// =====================================================
// ICON INPUT
// =====================================================

function IconInput({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-semibold">
        {label}
      </span>

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]"
        />

        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`${inputClass} pr-10`}
        />
      </div>
    </label>
  );
}

// =====================================================
// SELECT COMPONENT
// =====================================================

function Select({
  label,
  value,
  onChange,
  options,
}) {
  // إذا كانت القيمة الحالية ليست ضمن الخيارات،
  // نظهرها حتى لا تختفي بيانات الطالب.
  const allOptions =
    value && !options.includes(value)
      ? [value, ...options]
      : options;

  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-semibold">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={inputClass}
      >
        <option value="">
          اختر {label}
        </option>

        {allOptions.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

// =====================================================
// HEADER COMPONENT
// =====================================================


