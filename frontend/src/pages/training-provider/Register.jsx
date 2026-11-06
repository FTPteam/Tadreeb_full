import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Building2, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { registerProviderOrganization } from "../../services/providerOrganization";

const initial = { name: "", type: "", location: "", phone: "", email: "", supervisor: "", seats: "0" };
const control = "h-[44px] w-full rounded-[7px] border border-[#CBD5E1] bg-white px-4 text-[13px] text-[#1E293B] outline-none transition focus:border-[#09379A] focus:ring-2 focus:ring-[#09379A]/10";
const fields = [
  ["name", "اسم جهة التدريب", "text", true],
  ["type", "نوع النشاط", "text", true],
  ["location", "موقع الجهة", "text", true],
  ["phone", "رقم الهاتف", "tel", true],
  ["email", "البريد الإلكتروني الرسمي", "email", true],
  ["supervisor", "اسم المشرف الميداني", "text", false],
  ["seats", "الطاقة الاستيعابية", "number", false],
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = event => {
    event.preventDefault();
    setError("");
    if (!form.name.trim() || !form.type.trim() || !form.location.trim() || !form.phone.trim() || !form.email.trim()) {
      setError("يرجى تعبئة جميع الحقول المطلوبة.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }
    const seats = Number(form.seats || 0);
    if (!Number.isInteger(seats) || seats < 0) {
      setError("الطاقة الاستيعابية يجب أن تكون رقمًا صحيحًا غير سالب.");
      return;
    }
    try {
      registerProviderOrganization({ ...form, name: form.name.trim(), email: form.email.trim().toLowerCase(), seats, capacity: seats, students: 0 });
      setDone(true);
    } catch (e) {
      setError(e.message || "تعذر إرسال طلب التسجيل.");
    }
  };

  return (
    <AuthLayout>
      <div className="mb-5 text-right">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7EDF8] text-[#09379A]"><Building2 size={27}/></div>
        <h1 className="text-[27px] font-bold text-[#121F36]">تسجيل جهة تدريب جديدة</h1>
        <p className="mt-2 text-[13px] leading-7 text-[#64748B]">أدخل بيانات مؤسستك لإرسال طلب اعتماد إلى إدارة التدريب الميداني.</p>
      </div>

      {done ? (
        <div className="rounded-xl border border-[#BBE7C9] bg-[#F0FDF4] p-5 text-right">
          <CheckCircle2 size={30} className="text-[#15803D]"/>
          <h2 className="mt-3 text-[17px] font-bold text-[#166534]">تم إرسال طلب التسجيل بنجاح</h2>
          <p className="mt-2 text-[13px] leading-7 text-[#475569]">حُفظت بيانات الجهة بحالة «بانتظار الاعتماد». ستتمكن من الدخول واستكمال الملف، لكن نشر الفرص واستقبال طلبات الطلاب سيبقى متاحًا بعد اعتماد الإدارة.</p>
          <button onClick={() => navigate("/training-provider/login", { replace: true })} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#09379A] text-[13px] font-bold text-white">الانتقال إلى تسجيل الدخول <ArrowLeft size={16}/></button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map(([key, label, type, required]) => (
              <label key={key} className={`block text-right text-[12px] font-semibold ${key === "email" || key === "name" ? "sm:col-span-2" : ""}`}>
                {label}{required && <span className="mr-1 text-red-600">*</span>}
                <div className="relative mt-2">
                  <input type={type} min={type === "number" ? 0 : undefined} required={required} value={form[key]} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} className={`${control} ${key === "email" ? "pl-11 text-left" : ""}`} placeholder={key === "email" ? "name@company.ps" : ""}/>
                  {key === "email" && <Mail size={17} className="absolute left-4 top-3.5 text-[#64748B]"/>}
                </div>
              </label>
            ))}
          </div>
          <p className="rounded-lg bg-[#EEF4FF] p-3 text-[11px] leading-6 text-[#475569]">إرسال الطلب لا يعني اعتماد الجهة تلقائيًا. ستراجع الإدارة البيانات قبل تفعيل صلاحية نشر الفرص.</p>
          {error && <p role="alert" className="flex items-center gap-2 text-[12px] text-red-600"><AlertCircle size={15}/>{error}</p>}
          <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#09379A] text-[13px] font-bold text-white">إرسال طلب التسجيل <ArrowLeft size={17}/></button>
          <p className="text-center text-[12px] text-[#64748B]">لديك حساب بالفعل؟ <Link to="/training-provider/login" className="font-bold text-[#09379A] hover:underline">تسجيل الدخول</Link></p>
        </form>
      )}
    </AuthLayout>
  );
}
