import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import AdminAuthLayout from "./AdminAuthLayout";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }
    setError("");
    // عرض تجريبي: لم يتم إرسال بريد فعلي، يلزم ربط API لاحقاً.
    setSubmitted(true);
  };
  return (
    <AdminAuthLayout>
      {submitted ? (
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#15803D] text-white"><CheckCircle2 size={30} /></div>
          <h1 className="text-[25px] font-bold text-[#121F36]">تم استلام الطلب تجريبياً</h1>
          <p className="mt-2 text-[13px] leading-7 text-[#64748B]">هذه محاكاة لواجهة الاستعادة، ولم تُرسل رسالة إلكترونية فعلية.</p>
          <Link to="/admin/reset-password" className="mt-6 flex h-11 w-full items-center justify-center rounded-[8px] bg-[#09379A] text-[13px] font-bold text-white">استعراض واجهة تعيين كلمة المرور</Link>
        </div>
      ) : (
        <>
          <h1 className="text-[29px] font-bold text-[#121F36]">نسيت كلمة المرور؟</h1>
          <p className="mt-2 text-[13px] leading-7 text-[#64748B]">أدخل بريد حساب الإدارة لاستعراض خطوات استعادة كلمة المرور.</p>
          <form onSubmit={submit} noValidate className="mt-7">
            <label htmlFor="admin-email" className="mb-2 block text-[13px] font-semibold">البريد الإلكتروني <span className="text-red-600">*</span></label>
            <div className="relative"><input id="admin-email" type="email" dir="ltr" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@alazhar.edu.ps" className={`h-12 w-full rounded-[8px] border px-11 text-left text-[13px] outline-none focus:border-[#09379A] ${error ? "border-red-500" : "border-[#E0E7F2]"}`} /><Mail size={18} className="absolute right-4 top-3.5 text-[#64748B]" /></div>
            {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
            <button type="submit" className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[#09379A] text-[14px] font-bold text-white">متابعة <ArrowLeft size={17} /></button>
          </form>
        </>
      )}
      <Link to="/admin/login" className="mt-5 block text-center text-[12px] font-bold text-[#09379A] hover:underline">العودة لتسجيل الدخول</Link>
    </AdminAuthLayout>
  );
}
