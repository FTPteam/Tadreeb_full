import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearActiveStudentId } from "../../services/studentTrainingEligibility";
import { logout as endSession } from "../../api/auth";
import { LayoutDashboard, Home, BriefcaseBusiness, Inbox, Users, CalendarCheck, Star, UserRoundCog, ChartNoAxesColumn, Bell, Building2, Settings, LogOut, X, ClipboardList, FileText, CalendarDays, CircleCheck, GraduationCap, FileCheck, BadgeCheck, Activity, UserRound } from "lucide-react";

const menus = {
  student: [
    ["الرئيسية", "/student/dashboard", Home], ["فرص التدريب", "/student/opportunities", BriefcaseBusiness], ["طلباتي", "/student/applications", ClipboardList], ["ملفي التدريبي", "/student/training-profile", FileText], ["السجل اليومي", "/student/daily-training-log", ClipboardList], ["الحضور والغياب", "/student/attendance", CalendarDays], ["التقارير", "/student/reports", FileText], ["التقييم", "/student/evaluation", Star], ["إنهاء التدريب", "/student/finish-training", CircleCheck], ["الشهادة", "/student/certificate", GraduationCap], ["الإشعارات", "/student/notifications", Bell], ["الملف الشخصي", "/student/profile", UserRound], ["الإعدادات", "/student/settings", Settings],
  ],
  admin: [
    ["لوحة التحكم", "/admin/dashboard", LayoutDashboard], ["الطلاب", "/admin/students", Users], ["طلبات التدريب", "/admin/training-requests", FileCheck], ["جهات التدريب", "/admin/training-organizations", Building2], ["اعتماد التدريب", "/admin/approvals", BadgeCheck], ["متابعة التدريب", "/admin/training-monitoring", Activity], ["السجلات اليومية", "/admin/daily-logs", ClipboardList], ["التقارير", "/admin/reports", FileText], ["التقييمات", "/admin/evaluations", Star], ["الإشعارات", "/admin/announcements", Bell], ["الملف الشخصي", "/admin/profile", UserRound], ["الإعدادات", "/admin/settings", Settings],
  ],
  provider: [
    ["لوحة التحكم", "/training-provider/dashboard", LayoutDashboard], ["فرص التدريب", "/training-provider/opportunities", BriefcaseBusiness], ["طلبات الطلاب", "/training-provider/requests", Inbox], ["المتدربون", "/training-provider/trainees", Users], ["الحضور والسجلات", "/training-provider/attendance", CalendarCheck], ["التقييمات", "/training-provider/evaluations", Star], ["المشرفون الميدانيون", "/training-provider/supervisors", UserRoundCog], ["الإحصائيات", "/training-provider/statistics", ChartNoAxesColumn], ["الإشعارات", "/training-provider/notifications", Bell], ["ملف الجهة", "/training-provider/profile", Building2], ["الإعدادات", "/training-provider/settings", Settings],
  ],
};
const providerImplemented = new Set(["/training-provider/dashboard", "/training-provider/opportunities", "/training-provider/requests", "/training-provider/trainees", "/training-provider/settings", "/training-provider/notifications", "/training-provider/evaluations", "/training-provider/profile", "/training-provider/supervisors", "/training-provider/attendance", "/training-provider/statistics"]);

export default function PortalSidebar({ role = "student", open, onClose, onLogout, onUnavailable }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [internalOpen, setInternalOpen] = useState(false);
  const controlled = typeof open === "boolean";
  const isOpen = controlled ? open : internalOpen;
  const items = menus[role] || menus.student;

  const close = () => { setInternalOpen(false); onClose?.(); };
  useEffect(() => {
    if (controlled) return;
    const eventName = `toggle-${role === "provider" ? "training-provider" : role}-sidebar`;
    const toggle = () => setInternalOpen((v) => !v);
    window.addEventListener(eventName, toggle);
    return () => window.removeEventListener(eventName, toggle);
  }, [controlled, role]);
  useEffect(() => { close(); }, [location.pathname]);
  useEffect(() => {
    if (!isOpen) return;
    const old = document.body.style.overflow;
    const esc = (e) => { if (e.key === "Escape") close(); };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = old; document.removeEventListener("keydown", esc); };
  }, [isOpen]);

  const handleLogout = () => {
    close();
    if (role === "student") clearActiveStudentId();
    endSession();
    if (onLogout) onLogout();
    else navigate(role === "provider" ? "/training-provider/login" : role === "admin" ? "/admin/login" : "/");
  };
  const title = role === "provider" ? "بوابة جهات التدريب الميداني" : role === "admin" ? "بوابة الإدارة والإشراف الأكاديمي" : "بوابة الطالب للتدريب الميداني";

  return <>
    <button type="button" aria-label="إغلاق القائمة" onClick={close} className={`fixed inset-0 z-40 bg-[#0F172A]/45 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} />
    <aside dir="rtl" aria-label={`قائمة ${role}`} className={`fixed right-0 top-0 z-50 flex h-screen w-[280px] shrink-0 flex-col overflow-hidden bg-[#09379A] font-['Cairo'] text-white transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"} lg:order-first lg:sticky lg:top-0 lg:z-auto lg:translate-x-0 lg:transition-none`}>
      <div className="relative flex h-[112px] shrink-0 items-center px-[18px] pt-[26px] lg:h-[96px] lg:pt-0">
        <img src="/logo.svg" alt="شعار بوابة التدريب الميداني" className="h-[48px] w-[48px] shrink-0 object-contain" />
        <div className="mr-[10px] min-w-0 text-right"><h2 className="m-0 whitespace-nowrap text-[15px] font-bold leading-[20px] tracking-[1px]">بوابة التدريب الميداني</h2><p className="m-0 mt-[3px] whitespace-nowrap text-[11px] font-medium leading-[17px] text-white/90">كلية الدراسات المتوسطة - الأزهر</p></div>
        <button type="button" aria-label="إغلاق القائمة" onClick={close} className="absolute left-[14px] top-[14px] hidden h-[32px] w-[32px] items-center justify-center rounded-[8px] border border-white/15 bg-white/10 text-white transition hover:bg-white/20 max-lg:flex"><X size={18}/></button>
      </div>
      <div className="sidebar-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <nav aria-label="القائمة الرئيسية" className="px-[9px] pb-[16px] pt-[20px]"><div className="flex flex-col gap-[4px]">
          {items.map(([label, path, Icon]) => {
            const active = location.pathname === path || location.pathname.startsWith(`${path}/`) || (role === "admin" && path === "/admin/training-organizations" && location.pathname.startsWith("/admin/approvals/training-providers"));
            const disabled = role === "provider" && !providerImplemented.has(path);
            return <NavLink key={path} to={path} onClick={(e) => { if (disabled) { e.preventDefault(); onUnavailable?.(label); return; } close(); }} aria-current={active ? "page" : undefined} className={`flex h-[44px] w-full items-center gap-[12px] rounded-[10px] px-[16px] text-[14px] leading-[20px] transition-all duration-200 ${active ? "bg-white font-bold text-[#09379A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]" : "bg-transparent font-medium text-white/90 hover:bg-white/10 hover:text-white"}`}><Icon size={20} strokeWidth={1.8} className="shrink-0"/><span className="whitespace-nowrap">{label}</span></NavLink>;
          })}
        </div></nav>
      </div>
      <div className="shrink-0 bg-[#09379A] pt-[8px]">
        <div className="px-[25px] pb-[12px]"><button type="button" onClick={handleLogout} className="flex h-[44px] w-full items-center gap-[12px] rounded-[10px] px-[8px] text-[14px] font-medium leading-[20px] text-white/90 transition hover:bg-white/10 hover:text-white"><LogOut size={21} strokeWidth={1.8} className="shrink-0"/><span>تسجيل الخروج</span></button></div>
        <div className="px-[12px] pb-[16px]"><div className="flex min-h-[68px] w-full flex-col items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.05] px-[15px] py-[12px] text-center"><p className="m-0 whitespace-nowrap text-[11px] leading-[16px] text-white/70">كلية الدراسات المتوسطة - بوابة التدريب</p><p className="m-0 mt-[2px] whitespace-nowrap text-[11px] font-bold leading-[16px] text-[#00B4D8]">{title}</p></div></div>
      </div>
    </aside>
    <style>{`.sidebar-scroll{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.24) transparent}.sidebar-scroll::-webkit-scrollbar{width:5px}.sidebar-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.24);border-radius:8px}`}</style>
  </>;
}
