import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Check, ChevronLeft, LockKeyhole, RotateCcw, X } from "lucide-react";
import Header from "../../components/training-provider/Header";
import Sidebar from "../../components/training-provider/Sidebar";
import ProviderFooter from "../../components/training-provider/ProviderFooter";
import { resetDemoOpportunities } from "./opportunitiesStore";
import { resetDemoApplications } from "./providerApplicationsStore";

const SETTINGS_KEY = "cis-provider-settings-v1";
const DEFAULTS = { newRequests: true, dailyLogs: true, email: false };
const TRAINEES_KEY = "cis-provider-trainees-v1";

function readSettings() {
  try {
    const data = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
    return { ...DEFAULTS, ...(data && typeof data === "object" ? data : {}) };
  } catch { return { ...DEFAULTS }; }
}

function Card({ title, children, className = "" }) {
  return <section className={`rounded-[12px] border border-[#E0E7F2] bg-white p-6 ${className}`}>
    <h2 className="mb-5 border-b border-[#E0E7F2] pb-4 text-[18px] font-bold text-[#092B78]">{title}</h2>
    {children}
  </section>;
}

function Toggle({ checked, onChange, label }) {
  return <button type="button" role="switch" aria-label={label} aria-checked={checked} onClick={() => onChange(!checked)}
    className={`relative h-[26px] w-[45px] shrink-0 rounded-full transition-colors ${checked ? "bg-[#09379A]" : "bg-[#CBD5E1]"}`}>
    <span className={`absolute top-[3px] h-[20px] w-[20px] rounded-full bg-white shadow-sm transition-all ${checked ? "left-[3px]" : "right-[3px]"}`} />
  </button>;
}

function PasswordField({ label, name, value, onChange, error }) {
  return <div className="mb-5">
    <label htmlFor={name} className="mb-2 block text-[13px] font-semibold text-[#17233B]">{label} <span className="text-red-600">*</span></label>
    <div className="relative">
      <input id={name} name={name} type="password" value={value} onChange={e => onChange(e.target.value)} autoComplete={name === "current" ? "current-password" : "new-password"}
        aria-invalid={Boolean(error)} className={`h-[47px] w-full rounded-[8px] border bg-white py-2 pl-11 pr-3 text-[14px] outline-none focus:ring-2 focus:ring-[#09379A]/10 ${error ? "border-red-500" : "border-[#E0E7F2] focus:border-[#09379A]"}`} />
      <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#50627D]" />
    </div>
    {error && <p role="alert" className="mt-2 flex items-center gap-1 text-[12px] text-red-600"><AlertCircle size={14}/>{error}</p>}
  </div>;
}

export default function Settings() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [settings, setSettings] = useState(readSettings);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");

  const unavailable = name => setNotice(`صفحة «${name}» غير متاحة حاليًا.`);
  const setPreference = (key, value) => {
    const next = { ...settings, [key]: value };
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); setSettings(next); }
    catch { setNotice("تعذر حفظ تفضيلات الإشعارات في المتصفح."); }
  };

  const updatePassword = e => {
    e.preventDefault();
    const nextErrors = {};
    if (!passwords.current) nextErrors.current = "هذا الحقل مطلوب";
    if (!passwords.next) nextErrors.next = "هذا الحقل مطلوب";
    else if (passwords.next.length < 8) nextErrors.next = "كلمة المرور يجب ألا تقل عن 8 أحرف";
    if (!passwords.confirm) nextErrors.confirm = "هذا الحقل مطلوب";
    else if (passwords.confirm !== passwords.next) nextErrors.confirm = "كلمتا المرور غير متطابقتين";
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) {
      // Passwords are deliberately NOT stored in localStorage or changed without an auth API.
      setNotice("البيانات صحيحة، لكن تغيير كلمة المرور يحتاج ربط خدمة الحسابات بالخادم. لم تتغير كلمة المرور.");
    }
  };

  const confirmRestore = () => {
    try {
      // Reset ONLY provider demo records. Admin/student storage remains untouched.
      resetDemoOpportunities();
      resetDemoApplications();
      localStorage.removeItem(TRAINEES_KEY);
      window.dispatchEvent(new Event("cis-provider-trainees-updated"));
      localStorage.removeItem(SETTINGS_KEY);
      setSettings({ ...DEFAULTS });
      setPasswords({ current: "", next: "", confirm: "" });
      setErrors({});
      setResetOpen(false);
      setNotice("تمت استعادة بيانات جهة التدريب التجريبية الأصلية. التغييرات المحلية السابقة لا يمكن التراجع عنها.");
    } catch {
      setResetOpen(false);
      setNotice("تعذرت استعادة بعض البيانات. راجع إعدادات التخزين في المتصفح.");
    }
  };

  return <div dir="rtl" className="flex h-dvh overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
    <Sidebar open={mobile} onClose={() => setMobile(false)} onLogout={() => setLogoutOpen(true)} onUnavailable={unavailable} />
    <div className="provider-page-scroll h-dvh min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
      <Header onMenu={() => setMobile(true)} onLogout={() => setLogoutOpen(true)} onUnavailable={unavailable} />
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-5 sm:px-6 lg:px-8">
        <nav className="mb-3 flex items-center gap-2 text-[12px] text-[#64748B]">
          <Link to="/training-provider/dashboard" className="hover:text-[#09379A]">لوحة التحكم</Link><ChevronLeft size={14}/><strong className="text-[#17233B]">الإعدادات</strong>
        </nav>
        <div className="mb-7"><h1 className="text-[30px] font-bold leading-tight text-[#111C2D]">الإعدادات</h1><p className="mt-1 text-[14px] text-[#64748B]">إعدادات الحساب والإشعارات والأمان.</p></div>
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <div className="order-2 lg:order-2">
            <Card title="تغيير كلمة المرور" className="h-full min-h-[560px]">
              <form onSubmit={updatePassword} noValidate>
                <PasswordField label="كلمة المرور الحالية" name="current" value={passwords.current} error={errors.current} onChange={v => { setPasswords(p => ({ ...p, current: v })); setErrors(p => ({ ...p, current: "" })); }} />
                <PasswordField label="كلمة المرور الجديدة" name="next" value={passwords.next} error={errors.next} onChange={v => { setPasswords(p => ({ ...p, next: v })); setErrors(p => ({ ...p, next: "" })); }} />
                <PasswordField label="تأكيد كلمة المرور الجديدة" name="confirm" value={passwords.confirm} error={errors.confirm} onChange={v => { setPasswords(p => ({ ...p, confirm: v })); setErrors(p => ({ ...p, confirm: "" })); }} />
                <div className="mt-5 flex justify-start"><button type="submit" className="flex h-[44px] items-center justify-center gap-2 rounded-[8px] bg-[#09379A] px-5 text-[13px] font-semibold text-white hover:bg-[#072F86]"><Check size={18}/>تحديث كلمة المرور</button></div>
              </form>
            </Card>
          </div>
          <div className="order-1 space-y-6 lg:order-1">
            <Card title="الإشعارات">
              {[
                ["newRequests", "طلبات التدريب الجديدة", "إشعار عند وصول طلب جديد"],
                ["dailyLogs", "السجلات اليومية", "إشعار عند إرسال متدرب لسجل جديد"],
                ["email", "إشعارات البريد الإلكتروني", "نسخة من الإشعارات على بريدك"],
              ].map(([key, title, desc], i) => <div key={key} className={`flex items-center justify-between gap-4 py-4 ${i < 2 ? "border-b border-[#E0E7F2]" : ""}`}>
                <div><h3 className="text-[13px] font-bold">{title}</h3><p className="mt-1 text-[11px] text-[#64748B]">{desc}</p></div>
                <Toggle checked={settings[key]} onChange={v => setPreference(key, v)} label={title}/>
              </div>)}
            </Card>
            <Card title="الحساب">
              <dl className="grid grid-cols-2 gap-x-3 gap-y-5 text-[12px]">
                <div><dt className="text-[#64748B]">المستخدم</dt><dd className="mt-1 font-semibold">م. خالد عودة</dd></div>
                <div><dt className="text-[#64748B]">البريد</dt><dd dir="ltr" className="mt-1 text-right font-semibold break-all">khaled@alquds-tel.ps</dd></div>
                <div><dt className="text-[#64748B]">اللغة</dt><dd className="mt-1 font-semibold">العربية (RTL)</dd></div>
                <div><dt className="text-[#64748B]">المنطقة الزمنية</dt><dd className="mt-1 font-semibold">غزة (GMT+2)</dd></div>
              </dl>
            </Card>
            <Card title="منطقة التجربة">
              <p className="text-[12px] leading-6 text-[#64748B]">يعيد البيانات التجريبية إلى حالتها الأولى (يفقد عند تجربة النموذج).</p>
              <div className="mt-3 flex justify-start"><button type="button" onClick={() => setResetOpen(true)} className="flex h-[45px] items-center gap-2 rounded-[8px] border border-red-300 px-5 text-[13px] text-red-600 hover:bg-red-50"><RotateCcw size={18}/>استعادة البيانات الأصلية</button></div>
            </Card>
          </div>
        </div>
        <ProviderFooter />
      </main>
    </div>

    {resetOpen && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setResetOpen(false); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="restore-title" className="w-full max-w-[525px] rounded-[13px] bg-white p-7 text-right shadow-2xl">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-[#C81E1E]"><RotateCcw size={27}/></div>
        <h2 id="restore-title" className="text-[21px] font-bold">استعادة البيانات الأصلية</h2>
        <p className="mt-3 text-[14px] leading-7 text-[#64748B]">ستفقد جميع التغييرات التي أجريتها أثناء التجربة على فرص جهة التدريب وطلباتها ومتدربيها وتفضيلات الإشعارات. لن تتأثر بيانات الطلاب أو الإدارة.</p>
        <div className="mt-7 flex items-center gap-3"><button onClick={confirmRestore} className="flex h-11 items-center gap-2 rounded-[8px] bg-[#C81E1E] px-5 text-[13px] text-white"><RotateCcw size={17}/>استعادة</button><button onClick={() => setResetOpen(false)} className="h-11 rounded-[8px] border border-[#E0E7F2] px-5 text-[13px]">إلغاء</button></div>
      </div>
    </div>}
    {logoutOpen && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4" onMouseDown={e => { if(e.target === e.currentTarget)setLogoutOpen(false); }}><div role="dialog" aria-modal="true" className="w-full max-w-[525px] rounded-xl bg-white p-7"><h2 className="text-[21px] font-bold">تسجيل الخروج</h2><p className="my-4 text-[14px] text-[#64748B]">هل تريد تسجيل الخروج من بوابة جهة التدريب؟</p><div className="flex gap-3"><button onClick={() => navigate("/training-provider/login")} className="rounded-lg bg-red-600 px-5 py-3 text-white">تسجيل الخروج</button><button onClick={() => setLogoutOpen(false)} className="rounded-lg border border-[#E0E7F2] px-5 py-3">إلغاء</button></div></div></div>}
    {notice && <div role="status" className="fixed bottom-5 left-5 z-[95] flex max-w-[420px] items-start gap-3 rounded-[9px] border border-[#E0E7F2] bg-white p-4 text-[13px] shadow-xl"><AlertCircle size={18} className="shrink-0 text-[#09379A]"/><span className="flex-1">{notice}</span><button type="button" aria-label="إغلاق التنبيه" onClick={() => setNotice("")}><X size={16}/></button></div>}
  </div>;
}
