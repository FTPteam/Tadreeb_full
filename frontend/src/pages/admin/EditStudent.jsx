import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";

import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  ArrowRight,
  Mail,
  Phone,
  Save,
  ChevronLeft,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";
import { fetchStudent, updateStudent, fetchDepartments } from "../../api/studentsApi";
import { ACADEMIC_PROGRAMS } from "../../constants/academicPrograms";

export default function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [student, setStudent] = useState(location.state?.student || null);
  const [loading, setLoading] = useState(!location.state?.student);
  const [submitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: location.state?.student?.name || "",
    studentId: id || location.state?.student?.id || "",
    major: location.state?.student?.major || "",
    departmentId: location.state?.student?.departmentId || null,
    specializationId: location.state?.student?.specializationId || null,
    level: location.state?.student?.level || "الدبلوم المتوسط",
    email: location.state?.student?.email !== "—" ? location.state?.student?.email || "" : "",
    phone: location.state?.student?.phone !== "—" ? location.state?.student?.phone || "" : "",
    supervisor: location.state?.student?.supervisor || "",
    organization: location.state?.student?.organization || "",
    notes: location.state?.student?.notes || "",
  });

  useEffect(() => {
    fetchDepartments().then(setDepartments).catch(() => {});
    if (id) {
      fetchStudent(id)
        .then((data) => {
          if (data) {
            setStudent(data);
            setForm((prev) => ({
              ...prev,
              name: data.name || prev.name,
              studentId: data.universityId || data.id || prev.studentId,
              major: data.major !== "—" ? data.major : prev.major,
              departmentId: data.departmentId || prev.departmentId,
              specializationId: data.specializationId || prev.specializationId,
              email: data.email !== "—" ? data.email : prev.email,
              phone: data.phone !== "—" ? data.phone : prev.phone,
              supervisor: data.supervisor !== "—" ? data.supervisor : prev.supervisor,
              organization: data.organization !== "—" ? data.organization : prev.organization,
            }));
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const update = (name, value) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "major") {
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

  const handleBack = () => {
    navigate(`/admin/students/${encodeURIComponent(form.studentId || id)}`, {
      state: { student },
    });
  };

  const save = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("يرجى إدخال اسم الطالب.");
      return;
    }

    const nameParts = form.name.trim().split(/\s+/);
    const firstName = nameParts.shift() || "";
    const lastName = nameParts.join(" ") || " ";

    try {
      setSubmitting(true);
      setError("");

      await updateStudent(student?.profileId, student?.userId, {
        firstName,
        lastName,
        email: form.email.trim(),
        phone: form.phone.trim(),
        department: form.departmentId,
        specialization: form.specializationId,
      });

      const updated = {
        ...(student || {}),
        name: form.name.trim(),
        major: form.major,
        email: form.email.trim(),
        phone: form.phone.trim(),
      };

      navigate(`/admin/students/${encodeURIComponent(form.studentId || id)}`, {
        replace: true,
        state: {
          student: updated,
          successMessage: "تم تحديث بيانات الطالب في النظام بنجاح.",
        },
      });
    } catch (err) {
      setError(err?.data?.detail || err?.message || "تعذر حفظ بيانات الطالب. حاول مجددًا.");
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

              <button onClick={() => navigate("/admin/students")}>
                الطلاب
              </button>

              <ChevronLeft size={15} />

              <span className="font-semibold text-[#111C2D]">
                تعديل بيانات الطالب
              </span>
            </div>

            <section className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h1 className="m-0 text-[27px] font-bold">
                  تعديل بيانات الطالب
                </h1>

                <p className="m-0 mt-1 text-[13px] text-[#64748B]">
                  تحديث البيانات الشخصية والأكاديمية للطالب
                </p>
              </div>

              <button
                type="button"
                onClick={handleBack}
                className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px]"
              >
                <ArrowRight size={17} />
                رجوع للتفاصيل
              </button>
            </section>

            {error && (
              <div className="mb-5 rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] p-4 text-[13px] font-medium text-[#DC2626]">
                {error}
              </div>
            )}

            <form
              onSubmit={save}
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

                <Field label="الرقم الجامعي">
                  <input
                    value={form.studentId}
                    disabled
                    className={`${inputClass} bg-[#F8FAFC] text-[#64748B] cursor-not-allowed`}
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

                <Field label="البريد الإلكتروني">
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={17} />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="student@alazhar.edu.ps"
                      className={`${inputClass} pr-10`}
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
                  <input
                    value={form.supervisor || "—"}
                    disabled
                    className={`${inputClass} bg-[#F8FAFC] text-[#64748B] cursor-not-allowed`}
                  />
                </Field>

                <Field label="جهة التدريب">
                  <input
                    value={form.organization || "—"}
                    disabled
                    className={`${inputClass} bg-[#F8FAFC] text-[#64748B] cursor-not-allowed`}
                  />
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

              <div className="mt-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
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
                  {submitting ? "جاري الحفظ..." : "حفظ التعديلات"}
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
