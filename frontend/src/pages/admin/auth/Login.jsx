import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import AdminAuthLayout from "./AdminAuthLayout";
import { HOME_BY_ROLE, login, logout } from "../../../api/auth";

const STAFF_ROLES = ["coordinator", "admin", "supervisor"];

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.identifier.trim()) nextErrors.identifier = "هذا الحقل مطلوب";
    if (!form.password) nextErrors.password = "هذا الحقل مطلوب";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    try {
      const user = await login(form.identifier, form.password);
      if (!STAFF_ROLES.includes(user.role)) {
        logout();
        setErrors({ form: "هذا الحساب ليس حساب إدارة. استخدم بوابة الدخول الخاصة بدورك." });
        return;
      }
      navigate(HOME_BY_ROLE[user.role]);
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminAuthLayout>
      <div className="mb-7 text-right">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7EDF8] text-[#09379A]"><ShieldCheck size={27} /></div>
        <h1 className="text-[29px] font-bold text-[#121F36]">تسجيل دخول الإدارة</h1>
        <p className="mt-2 text-[13px] leading-7 text-[#64748B]">أدخل بيانات حسابك للوصول إلى لوحة الإدارة والإشراف الأكاديمي.</p>
      </div>
      <form onSubmit={submit} noValidate className="space-y-5">
        <div>
          <label htmlFor="admin-identifier" className="mb-2 block text-[13px] font-semibold">البريد الإلكتروني أو اسم المستخدم <span className="text-red-600">*</span></label>
          <div className="relative"><input id="admin-identifier" dir="auto" autoComplete="username" value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} placeholder="أدخل البريد الإلكتروني أو اسم المستخدم" className={`h-12 w-full rounded-[8px] border bg-white pr-11 pl-4 text-[13px] outline-none focus:border-[#09379A] ${errors.identifier ? "border-red-500" : "border-[#E0E7F2]"}`} /><UserRound size={18} className="absolute right-4 top-3.5 text-[#64748B]" /></div>
          {errors.identifier && <p className="mt-1 text-[11px] text-red-600">{errors.identifier}</p>}
        </div>
        <div>
          <label htmlFor="admin-password" className="mb-2 block text-[13px] font-semibold">كلمة المرور <span className="text-red-600">*</span></label>
          <div className="relative"><input id="admin-password" dir="ltr" type={showPassword ? "text" : "password"} autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="أدخل كلمة المرور" className={`h-12 w-full rounded-[8px] border bg-white px-11 text-right text-[13px] outline-none focus:border-[#09379A] ${errors.password ? "border-red-500" : "border-[#E0E7F2]"}`} /><LockKeyhole size={18} className="absolute right-4 top-3.5 text-[#64748B]" /><button type="button" aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} onClick={() => setShowPassword((s) => !s)} className="absolute left-3 top-3.5 text-[#64748B]">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
          {errors.password && <p className="mt-1 text-[11px] text-red-600">{errors.password}</p>}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-[12px]">
          <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-[#09379A]" />تذكرني</label>
          <Link to="/admin/forgot-password" className="font-bold text-[#09379A] hover:underline">نسيت كلمة المرور؟</Link>
        </div>
        {errors.form && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-[12px] text-red-700">{errors.form}</p>}
        <button type="submit" disabled={submitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[#09379A] text-[14px] font-bold text-white hover:bg-[#092E80] disabled:opacity-60">{submitting ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"} <ArrowLeft size={17} /></button>
      </form>
      <p className="mt-6 text-center text-[12px] text-[#64748B]">بوابة خاصة بالإدارة والمشرفين الأكاديميين</p>
    </AdminAuthLayout>
  );
}
