import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, CheckCircle2, Eye, EyeOff, LockKeyhole } from "lucide-react";
import AdminAuthLayout from "./AdminAuthLayout";

export default function AdminResetPassword() {
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (form.password.length < 8) next.password = "كلمة المرور يجب ألا تقل عن 8 أحرف.";
    if (!form.confirm) next.confirm = "هذا الحقل مطلوب";
    else if (form.confirm !== form.password) next.confirm = "كلمتا المرور غير متطابقتين.";
    setErrors(next);
    if (Object.keys(next).length) return;
    // محاكاة نجاح فقط: لا يتم تعديل أي كلمة مرور فعلية دون رمز استعادة وAPI.
    setSuccess(true);
  };
  return (
    <AdminAuthLayout>
      {success ? (
        <div className="text-center"><div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#15803D] text-white"><Check size={30} /></div><h1 className="text-[27px] font-bold text-[#121F36]">تمت المحاكاة بنجاح</h1><p className="mt-2 text-[13px] leading-7 text-[#64748B]">تم اختبار واجهة تغيير كلمة المرور، دون تعديل بيانات الحساب فعلياً.</p><Link to="/admin/login" className="mt-6 flex h-12 w-full items-center justify-center rounded-[8px] bg-[#09379A] text-[14px] font-bold text-white">تسجيل الدخول</Link></div>
      ) : (
        <><div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7EDF8] text-[#09379A]"><LockKeyhole size={26} /></div><h1 className="text-[29px] font-bold text-[#121F36]">تعيين كلمة مرور جديدة</h1><p className="mt-2 text-[13px] leading-7 text-[#64748B]">أدخل كلمة المرور الجديدة وأكّدها. هذه واجهة تجريبية لحين ربط خدمة الاستعادة.</p>
          <form onSubmit={submit} noValidate className="mt-7 space-y-5">
            {[{ key: "password", label: "كلمة المرور الجديدة", auto: "new-password" }, { key: "confirm", label: "تأكيد كلمة المرور", auto: "new-password" }].map(({ key, label, auto }) => (
              <div key={key}><label htmlFor={`admin-${key}`} className="mb-2 block text-[13px] font-semibold">{label} <span className="text-red-600">*</span></label><div className="relative"><input id={`admin-${key}`} type={visible ? "text" : "password"} autoComplete={auto} dir="ltr" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} className={`h-12 w-full rounded-[8px] border px-11 text-right text-[13px] outline-none focus:border-[#09379A] ${errors[key] ? "border-red-500" : "border-[#E0E7F2]"}`} /><LockKeyhole size={17} className="absolute right-4 top-3.5 text-[#64748B]" /><button type="button" onClick={() => setVisible((x) => !x)} aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} className="absolute left-4 top-3.5 text-[#64748B]">{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{errors[key] && <p className="mt-1 text-[11px] text-red-600">{errors[key]}</p>}</div>
            ))}
            <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[#09379A] text-[14px] font-bold text-white"><CheckCircle2 size={17} />تغيير كلمة المرور</button>
          </form></>
      )}
      {!success && <Link to="/admin/login" className="mt-5 block text-center text-[12px] font-bold text-[#09379A] hover:underline">العودة لتسجيل الدخول</Link>}
    </AdminAuthLayout>
  );
}
