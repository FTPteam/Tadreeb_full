import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Mail,
  Phone,
  Save,
  ChevronLeft,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";
import { createStudent, fetchDepartments, fetchSupervisors } from "../../api/studentsApi";
import { ACADEMIC_PROGRAMS, ACADEMIC_DEPARTMENT } from "../../constants/academicPrograms";

export default function AddStudent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    studentId: "",
    major: "",
    departmentId: null,
    specializationId: null,
    level: "الدبلوم المتوسط",
    email: "",
    phone: "",
    supervisor: "",
    supervisorId: null,
    organization: "",
    notes: "",
  });

  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDepartments().then(setDepartments).catch(() => {});
    fetchSupervisors().then(setSupervisors).catch(() => {});
  }, []);

  const update = (name, value) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "major") {
        // Find matching specialization from real departments
        for (const d of departments) {
          const spec = d.specializations?.find(
            (s) => s.name === value || value.includes(s.name) || s.name.includes(value)
          );
          if (spec) {
            next.specializationId = spec.id;
            next.departmentId = d.id;
            break;
          }
        }
      }
      return next;
    });
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const id = form.studentId.trim();
    const name = form.name.trim();
    const email = form.email.trim();

    if (!id || !name) {
      setError("يرجى إدخال الاسم والرقم الجامعي.");
      return;
    }

    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني لتفعيل حساب الطالب.");
      return;
    }

    const nameParts = name.split(/\s+/);
    const firstName = nameParts.shift() || "";
    const lastName = nameParts.join(" ") || " ";

    try {
      setSubmitting(true);
      setError("");

      await createStudent({
        username: id,
        firstName,
        lastName,
        email,
        phone: form.phone.trim(),
        department: form.departmentId || (departments[0]?.id ?? null),
        specialization: form.specializationId || (departments[0]?.specializations?.[0]?.id ?? null),
      });

      navigate("/admin/students", {
        state: { successMessage: `تم إنشاء حساب الطالب ${name} بنجاح.` },
      });
    } catch (err) {
      setError(err?.data?.detail || err?.message || "تعذر إضافة الطالب. يرجى المحاولة مرة أخرى.");
    } finally {
      setSubmitting(false);
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
                  إدخال بيانات الطالب وتخصصه الأكاديمي في النظام
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

            {error && (
              <div className="mb-5 rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] p-4 text-[13px] font-medium text-[#DC2626]">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="rounded-[12px] border border-[#E0E7F2] bg-white p-6"
            >
              <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                بيانات الطالب
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="الاسم الكامل *">
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="اكتب اسم الطالب..."
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="الرقم الجامعي *">
                  <input
                    value={form.studentId}
                    onChange={(e) => update("studentId", e.target.value)}
                    placeholder="مثال: 120260099"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="التخصص">
                  <select
                    value={form.major}
                    onChange={(e) => update("major", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">اختر التخصص</option>
                    {departments.flatMap((d) => d.specializations || []).length > 0
                      ? departments.flatMap((d) => d.specializations || []).map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name} ({departments.find((d) => d.id === s.department)?.name || ""})
                          </option>
                        ))
                      : ACADEMIC_PROGRAMS.map((major) => (
                          <option key={major} value={major}>
                            {major}
                          </option>
                        ))}
                  </select>
                </Field>

                <Field label="المستوى">
                  <select
                    value={form.level}
                    onChange={(e) => update("level", e.target.value)}
                    className={inputClass}
                  >
                    <option>الدبلوم المتوسط</option>
                    <option>المستوى الأول</option>
                    <option>المستوى الثاني</option>
                  </select>
                </Field>

                <Field label="البريد الإلكتروني *">
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={17} />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="student@alazhar.edu.ps"
                      className={`${inputClass} pr-10`}
                      required
                    />
                  </div>
                </Field>

                <Field label="رقم الهاتف">
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={17} />
                    <input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="059XXXXXXX"
                      className={`${inputClass} pr-10`}
                    />
                  </div>
                </Field>

                <Field label="المشرف الأكاديمي">
                  <select
                    value={form.supervisorId || ""}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : null;
                      const sup = supervisors.find((s) => s.id === val);
                      update("supervisorId", val);
                      update("supervisor", sup?.full_name || sup?.username || "");
                    }}
                    className={inputClass}
                  >
                    <option value="">(اختياري) اختر المشرف الأكاديمي</option>
                    {supervisors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.full_name || s.username} ({s.students_count || 0} طلاب)
                      </option>
                    ))}
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
                التخصصات المتاحة متوافقة مع قاعدة بيانات كلية الدراسات المتوسطة - جامعة الأزهر.
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
                  disabled={submitting}
                  className="flex h-[42px] items-center gap-2 rounded-[8px] bg-[#09379A] px-5 text-[11px] font-bold text-white transition hover:bg-[#072d7d] disabled:opacity-50"
                >
                  <Save size={15} />
                  {submitting ? "جاري الحفظ..." : "إضافة الطالب"}
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
      <span className="mb-2 block text-[11px] font-semibold text-[#111C2D]">
        {label}
      </span>
      {children}
    </label>
  );
}
