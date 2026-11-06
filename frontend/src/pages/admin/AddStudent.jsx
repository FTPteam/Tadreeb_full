import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function AddStudent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    studentId: "",
    major: "",
    level: "",
    email: "",
    phone: "",
    supervisor: "د. سامر يوسف",
    organization: "",
    notes: "",
  });

  const update = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleSidebar = () => {
    window.dispatchEvent(new Event("toggle-student-sidebar"));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const id = form.studentId.trim();
    if (!id || !form.name.trim() || !form.major.trim()) {
      window.alert("يرجى إدخال الاسم والرقم الجامعي والتخصص.");
      return;
    }
    if (getStudent(id)) {
      window.alert("يوجد طالب مسجل بنفس الرقم الجامعي.");
      return;
    }
    try {
      saveStudent({
        id,
        name: form.name.trim(),
        major: form.major,
        level: form.level || "الدبلوم المتوسط",
        email: form.email.trim(),
        phone: form.phone.trim(),
        supervisor: form.supervisor,
        organization: form.organization,
        notes: form.notes.trim(),
        status: "لم يبدأ",
        startDate: "—",
      });
      navigate("/admin/students");
    } catch {
      window.alert("تعذر حفظ الطالب. تأكد من مساحة التخزين وحاول مجددًا.");
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

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-[1450px]">
            <div className="mb-3 flex items-center gap-2 text-[12px] text-[#64748B]">
              <button onClick={() => navigate("/admin/dashboard")}>
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <span className="font-semibold text-[#111C2D]">
                إضافة طالب
              </span>
            </div>

            <section className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h1 className="m-0 text-[27px] font-bold">
                  إضافة طالب
                </h1>

                <p className="m-0 mt-1 text-[13px] text-[#64748B]">
                  إدخال بيانات الطالب وتخصصه
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/students")}
                className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px]"
              >
                <ArrowRight size={17} />
                رجوع
              </button>
            </section>

            <form
              onSubmit={handleSubmit}
              className="rounded-[12px] border border-[#E0E7F2] bg-white p-6"
            >
              <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                بيانات الطالب
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="الاسم الكامل">
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="اكتب اسم الطالب..."
                    className={inputClass}
                  />
                </Field>

                <Field label="الرقم الجامعي">
                  <input
                    value={form.studentId}
                    onChange={(e) => update("studentId", e.target.value)}
                    placeholder="مثال: 20231234"
                    className={inputClass}
                  />
                </Field>

                <Field label="التخصص">
                  <select
                    value={form.major}
                    onChange={(e) => update("major", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">اختر التخصص</option>
                    {ACADEMIC_PROGRAMS.map((major) => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </select>
                </Field>

                <Field label="المستوى">
                  <select
                    value={form.level}
                    onChange={(e) => update("level", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">اختر المستوى</option>
                    <option>الدبلوم المتوسط</option>
                    <option>المستوى الأول</option>
                    <option>المستوى الثاني</option>
                  </select>
                </Field>

                <Field label="البريد الإلكتروني">
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2" size={17} />
                    <input
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="name@alazhar.edu.ps"
                      className={`${inputClass} pr-10`}
                    />
                  </div>
                </Field>

                <Field label="رقم الهاتف">
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2" size={17} />
                    <input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="05XXXXXXXX"
                      className={`${inputClass} pr-10`}
                    />
                  </div>
                </Field>

                <Field label="المشرف الأكاديمي">
                  <select
                    value={form.supervisor}
                    onChange={(e) => update("supervisor", e.target.value)}
                    className={inputClass}
                  >
                    <option>د. سامر يوسف</option>
                  </select>
                </Field>

                <Field label="جهة التدريب">
                  <select
                    value={form.organization}
                    onChange={(e) => update("organization", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">اختر جهة التدريب</option>
                    <option>شركة القدس للاتصالات</option>
                    <option>شركة جوال</option>
                    <option>استوديو بيكسل</option>
                  </select>
                </Field>
              </div>

              <Field label="ملاحظات" className="mt-5">
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="أضف ملاحظة إن وجدت..."
                  className={`${inputClass} h-auto resize-none py-3`}
                />
              </Field>

              <div className="mt-5 rounded-[7px] bg-[#F1F5F9] px-4 py-3 text-[11px] text-[#64748B]">
                التخصصات المتاحة ضمن {ACADEMIC_DEPARTMENT} فقط.
              </div>

              <div className="mt-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigate("/admin/students")}
                  className="h-[42px] rounded-[8px] border border-[#E0E7F2] px-5 text-[11px]"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="flex h-[42px] items-center gap-2 rounded-[8px] bg-[#09379A] px-5 text-[11px] font-bold text-white"
                >
                  <Save size={15} />
                  إضافة الطالب
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

const inputClass =
  "h-[47px] w-full rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[12px] outline-none focus:border-[#09379A] focus:ring-2 focus:ring-[#09379A]/10";

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[11px] font-semibold">
        {label}
      </span>
      {children}
    </label>
  );
}



