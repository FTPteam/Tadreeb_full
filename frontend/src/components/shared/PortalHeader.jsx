import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, UserRound, Building2, Settings, LogOut } from "lucide-react";

export default function PortalHeader({ role = "student", name, subtitle, initials, toggleEvent, logoutPath, onLogout, onUnavailable, onMenu }) {
  const navigate = useNavigate();
  const [panel, setPanel] = useState("");
  const wrap = useRef(null);

  useEffect(() => {
    const close = (event) => { if (wrap.current && !wrap.current.contains(event.target)) setPanel(""); };
    const escape = (event) => { if (event.key === "Escape") setPanel(""); };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, []);

  const routeFor = (label) => {
    const prefix = role === "provider" ? "/training-provider" : role === "admin" ? "/admin" : "/student";
    if (label === "الملف الشخصي" || label === "ملف الجهة") return `${prefix}/profile`;
    if (label === "الإعدادات") return `${prefix}/settings`;
    if (label === "الإشعارات" || label === "تفاصيل الإشعار")
      return role === "admin" ? "/admin/announcements" : `${prefix}/notifications`;
    return null;
  };
  const goTo = (label) => {
    setPanel("");
    const path = routeFor(label);
    if (path) navigate(path);
    else onUnavailable?.(label);
  };
  const logout = () => {
    setPanel("");
    if (onLogout) onLogout();
    else navigate(logoutPath || "/");
  };

  const menuItems = role === "provider"
    ? [["ملف الجهة", Building2], ["الإعدادات", Settings], ["تسجيل الخروج", LogOut]]
    : role === "admin"
      ? [["الملف الشخصي", UserRound], ["الإعدادات", Settings], ["تسجيل الخروج", LogOut]]
      : [["الملف الشخصي", UserRound], ["الإعدادات", Settings], ["تسجيل الخروج", LogOut]];

  return (
    <header dir="ltr" className="relative z-30 flex h-[72px] w-full shrink-0 items-center bg-white px-4 shadow-[0_1px_4px_rgba(0,0,0,0.16)] sm:px-6 lg:px-[43px]">
      <div ref={wrap} className="relative flex min-w-0 items-center">
        <button type="button" onClick={() => setPanel((v) => v === "user" ? "" : "user")} aria-expanded={panel === "user"} aria-label="قائمة الحساب" className="flex min-w-0 shrink-0 items-center text-left">
          <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full border border-[#09379A]/20 bg-[#09379A]/10 font-['Cairo'] text-[14px] font-semibold text-[#09379A]">{initials}</span>
          <span dir="rtl" className="ml-[16px] mr-0 min-w-0 shrink-0 text-right font-['Cairo']">
            <span className="block whitespace-nowrap text-[14px] font-semibold leading-[18px] text-[#1E293B]">{name}</span>
            <span className="mt-[2px] block max-w-[245px] truncate text-[12px] leading-[14px] text-[#64748B]">{subtitle}</span>
          </span>
        </button>
        <span className="ml-[16px] mr-[15px] h-[32px] w-px shrink-0 bg-[#E2E8F0]" />
        <button type="button" aria-label="الإشعارات" aria-expanded={panel === "bell"} onClick={() => setPanel((v) => v === "bell" ? "" : "bell")} className="relative flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[8px] text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#09379A]">
          <Bell size={20} strokeWidth={1.8} />
        </button>
        {panel === "bell" && <div dir="rtl" className="absolute left-0 top-[52px] z-50 w-[min(340px,calc(100vw-32px))] rounded-[12px] border border-[#E0E7F2] bg-white p-4 text-right shadow-xl">
          <p className="text-[13px] font-bold text-[#1E293B]">الإشعارات</p>
          <p className="mt-2 text-[12px] leading-6 text-[#64748B]">افتح صفحة الإشعارات لمتابعة آخر التحديثات. لا توجد بيانات إشعارات مباشرة في هذا الاختصار التجريبي.</p>
          <button type="button" onClick={() => goTo("الإشعارات")} className="mt-4 w-full rounded-lg bg-[#09379A] px-4 py-3 text-[12px] font-semibold text-white hover:bg-[#072F86]">فتح صفحة الإشعارات</button>
        </div>}
        {panel === "user" && <div dir="rtl" className="absolute left-0 top-[52px] z-50 w-[226px] rounded-[11px] border border-[#E0E7F2] bg-white p-2 text-right shadow-xl">{menuItems.map(([label, Icon]) => <button key={label} type="button" onClick={() => { setPanel(""); if (label === "تسجيل الخروج") logout(); else goTo(label); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[13px] text-[#1E293B] hover:bg-[#F8FAFC]"><Icon size={17}/>{label}</button>)}</div>}
      </div>
      <button type="button" aria-label="فتح القائمة" onClick={() => onMenu ? onMenu() : window.dispatchEvent(new Event(toggleEvent))} className="ml-auto hidden h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-[9px] border border-[#E2E8F0] bg-white text-[#09379A] transition hover:border-[#C8D5E7] hover:bg-[#F8FAFC] active:scale-[0.97] max-lg:flex"><Menu size={22} strokeWidth={1.8}/></button>
    </header>
  );
}
