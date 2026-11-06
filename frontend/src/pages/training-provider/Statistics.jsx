import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, GraduationCap, CalendarCheck, Star, Download, Printer,
  RefreshCw, AlertTriangle, Check, X, LogOut,
} from "lucide-react";
import Header from "../../components/training-provider/Header";
import Sidebar from "../../components/training-provider/Sidebar";
import ProviderFooter from "../../components/training-provider/ProviderFooter";
import { getTrainees, subscribeTrainees } from "./traineesStore";

const BLUE = "#09379A";
const card = "rounded-[12px] border border-[#E0E7F2] bg-white";
const button = "inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[13px] font-medium text-[#17233B] hover:bg-[#F8FAFC] disabled:opacity-50";

const seedWeekly = [30, 47, 262, 278];
const weeks = ["أ4", "أ5", "أ6", "أ7"];
const specialties = ["البرمجيات وقواعد البيانات", "الاتصالات وإنترنت الأشياء", "تكنولوجيا علم البيانات", "الدعم الفني", "التصميم والمونتاج"];

const valid = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;
const percent = (num, denom) => denom > 0 ? Math.round(100 * num / denom) : 0;

function IconStat({ Icon, title, value, suffix, color, background }) {
  return (
    <div className={`${card} min-h-[150px] p-5`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-semibold">{title}</span>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[9px]" style={{ backgroundColor: background, color }}>
          <Icon size={22} strokeWidth={1.9} />
        </span>
      </div>
      <div className="mt-5 flex items-end gap-2">
        <strong className="text-[36px] font-bold leading-none text-[#092B78]">{value}</strong>
        <span className="pb-1 text-[11px] text-[#64748B]">{suffix}</span>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className={`${card} h-[135px] p-5`}><div className="flex justify-between"><div className="mt-2 h-3 w-28 rounded bg-[#E5EAF3]"/><div className="h-11 w-11 rounded-lg bg-[#E5EAF3]"/></div><div className="mt-6 h-8 w-16 rounded bg-[#E5EAF3]"/></div>)}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={`${card} h-[330px] p-6`}><div className="h-4 w-40 rounded bg-[#E5EAF3]"/><div className="mt-12 flex h-[195px] items-end justify-around">{[60, 88, 120, 150].map((h,i)=><div key={i} className="w-12 rounded bg-[#E5EAF3]" style={{height:h}}/>)}</div></div>
        <div className={`${card} h-[330px] p-6`}><div className="h-4 w-44 rounded bg-[#E5EAF3]"/>{Array.from({length:5},(_,i)=><div key={i} className="mt-7 h-3 rounded bg-[#E5EAF3]" style={{width:`${98-i*9}%`}}/>)}</div>
      </div>
      <div className={`${card} h-[180px] p-6`}><div className="h-4 w-32 rounded bg-[#E5EAF3]"/><div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">{[0,1,2,3].map(i=><div key={i} className="h-20 rounded-lg bg-[#F1F4F8]"/>)}</div></div>
    </div>
  );
}

function exportCsv(data) {
  const csvCell = (value) => `"${String(value ?? "").replace(/^\s*[=+@-]/, "'$&").replace(/"/g, '""')} "`.trimEnd();
  const lines = [
    ["المؤشر", "القيمة"],
    ["إجمالي المتدربين", data.total],
    ["نسبة إكمال التدريب (%)", data.completion],
    ["متوسط الحضور (%)", data.attendance],
    ["متوسط التقييم من 5", data.rating],
    ...data.specialties.map(x => [`التخصص: ${x.name}`, x.count]),
    ...data.states.map(x => [`الحالة: ${x.name}`, x.count]),
  ];
  const csv = "\uFEFF" + lines.map(r => r.map(csvCell).join(",")).join("\r\n");
  const href = URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8"}));
  const link = document.createElement("a");
  link.href = href;
  link.download = "provider-statistics.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export default function Statistics() {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState(getTrainees);
  const [mobile, setMobile] = useState(false);
  const [menu, setMenu] = useState(false);
  const [logout, setLogout] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => subscribeTrainees(() => setTrainees(getTrainees())), []);

  const stats = useMemo(() => {
    const total = trainees.length;
    const completed = trainees.filter(t => t.status === "completed").length;
    const attendanceValues = trainees.map(t => t.attendance).filter(v => v !== null && v !== undefined && Number.isFinite(Number(v)));
    const attendance = attendanceValues.length ? Math.round(attendanceValues.reduce((a,b)=>a+valid(b),0)/attendanceValues.length) : 0;
    const rated = trainees.filter(t => t.evaluation && Array.isArray(t.evaluation.scores) && t.evaluation.scores.length === 5);
    const rating = rated.length ? (rated.reduce((sum,t) => sum+t.evaluation.scores.reduce((a,b)=>a+valid(b),0)/5,0)/rated.length).toFixed(1) : "0.0";
    const grouped = specialties.map(name => ({name, count:trainees.filter(t=>t.major===name).length}));
    trainees.forEach(t => {if (!grouped.some(x => x.name === t.major)) {const found = grouped.find(x=>x.name === (t.major || "غير محدد")); if(found)found.count++;else grouped.push({name:t.major || "غير محدد",count:1});}});
    const states = [
      {name:"قيد التدريب", count:trainees.filter(t=>t.status==="active").length, style:"bg-[#DDF5FF] text-[#087BA3]"},
      {name:"لم يبدأ", count:trainees.filter(t=>t.status==="not_started").length, style:"bg-[#EFF3F8] text-[#64748B]"},
      {name:"منتهٍ", count:completed, style:"bg-[#DCFCE7] text-[#15803D]"},
      {name:"طلبات معلقة", count:0, style:"bg-[#FFE8DA] text-[#BE501F]"},
    ];
    return {total,completion:percent(completed,total),attendance,rating,specialties:grouped,states};
  }, [trainees]);

  const availableWeekly = useMemo(() => {
    // Weekly data can be calculated only when attendance records include approved hour totals.
    const counts = [0,0,0,0];
    let found = false;
    trainees.forEach(t => (t.attendanceRecords || []).forEach(r => {
      if (!r.date || r.approved !== true || !Number.isFinite(Number(r.hours))) return;
      found = true;
      const weekIndex = Math.min(3, Math.max(0, Math.floor((new Date(r.date).getUTCDate()-1)/7)));
      counts[weekIndex] += valid(r.hours);
    }));
    return {values: found ? counts : seedWeekly, demo: !found};
  }, [trainees]);

  const maxWeekly = Math.max(1, ...availableWeekly.values);
  const maxSpecialty = Math.max(1, ...stats.specialties.map(s=>s.count));
  const unavailable = name => setToast(`صفحة «${name}» لم تُجهز بعد`);

  return (
    <div dir="rtl" className="flex h-dvh overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
      <Sidebar open={mobile} onClose={()=>setMobile(false)} onLogout={()=>setLogout(true)} onUnavailable={unavailable}/>
      <div className="provider-page-scroll h-dvh min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
        <Header onMenu={()=>setMobile(true)} onLogout={()=>setLogout(true)} onUnavailable={unavailable}/>
        <main className="mx-auto w-full max-w-[1550px] flex-1 px-4 py-4 sm:px-6 lg:px-8">
          <div className="text-[12px] text-[#64748B]">لوحة التحكم　 ‹　 <b className="text-[#17233B]">الإحصائيات</b></div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div><h1 className="text-[30px] font-bold leading-tight">الإحصائيات</h1><p className="mt-1 text-[13px] text-[#64748B]">ملخص أداء التدريب في الجهة للفصل الحالي.</p></div>
            <div className="flex gap-3 print:hidden"><div className="relative"><button type="button" className={button} onClick={()=>setMenu(v=>!v)}><Download size={18}/> تصدير</button>{menu&&<div className="absolute left-0 top-12 z-30 w-52 rounded-[11px] border border-[#E0E7F2] bg-white p-2 text-right shadow-lg"><p className="px-3 pb-2 text-xs text-[#64748B]">تصدير</p><button className="block w-full rounded-lg p-2 text-right text-[12px] hover:bg-[#F8FAFC]" onClick={()=>{setMenu(false);exportCsv(stats);}}>تصدير CSV (Excel)</button><button className="block w-full rounded-lg p-2 text-right text-[12px] hover:bg-[#F8FAFC]" onClick={()=>{setMenu(false);window.print();}}>حفظ PDF / طباعة</button></div>}</div><button type="button" className={button} onClick={()=>window.print()}><Printer size={18}/> طباعة</button></div>
          </div>
          <div className="mt-7">
            {loading ? <LoadingSkeleton/> : error ?
              <section className={`${card} flex min-h-[365px] flex-col items-center justify-center px-5 text-center`}><div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#FEE2E2] text-[#C81E1E]"><AlertTriangle size={32}/></div><h2 className="mt-4 text-[19px] font-bold">تعذر تحميل الإحصائيات</h2><p className="mt-3 text-sm text-[#64748B]">حدث خطأ أثناء الاتصال بالخادم. أعد المحاولة.</p><button className="mt-4 flex items-center gap-2 rounded-lg bg-[#09379A] px-5 py-3 text-sm text-white" onClick={()=>{setError(false);setTrainees(getTrainees());}}><RefreshCw size={17}/> إعادة المحاولة</button></section>
            : <div className="space-y-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <IconStat Icon={Users} title="إجمالي المتدربين" value={stats.total} suffix="متدرب" background="#E7EDF8" color={BLUE}/>
                <IconStat Icon={GraduationCap} title="نسبة إكمال التدريب" value={stats.completion} suffix="%" background="#DDFBE8" color="#15803D"/>
                <IconStat Icon={CalendarCheck} title="متوسط الحضور" value={stats.attendance} suffix="%" background="#DDF5FF" color="#087BA3"/>
                <IconStat Icon={Star} title="متوسط التقييم" value={stats.rating} suffix="من 5" background="#FFE5D8" color="#B93813"/>
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <section className={`${card} min-h-[330px] p-6`}><h2 className="border-b border-[#E0E7F2] pb-4 text-[17px] font-bold text-[#0C2C73]">الساعات المعتمدة أسبوعيًا</h2><div className="mt-7 flex h-[185px] items-end justify-around gap-5 border-b border-[#E0E7F2] px-2">{availableWeekly.values.map((v,i)=><div key={weeks[i]} className="flex h-full flex-1 flex-col items-center justify-end"><span className="mb-1 text-[12px] font-bold">{v}</span><div className="w-[44px] max-w-full rounded-t-[5px] bg-[#09379A]" style={{height:`${Math.max(3,v/maxWeekly*145)}px`}}/><span className="absolute translate-y-5 text-[11px] text-[#64748B]">{weeks[i]}</span></div>)}</div><p className="mt-8 text-[11px] text-[#64748B]">{availableWeekly.demo ? "قيم أسبوعية توضيحية حتى تتوفر سجلات ساعات معتمدة ومؤرخة." : "الساعات المعتمدة لكل أسبوع من أيام الشهر الحالي."}</p></section>
                <section className={`${card} min-h-[330px] p-6`}><h2 className="border-b border-[#E0E7F2] pb-4 text-[17px] font-bold text-[#0C2C73]">المتدربون حسب التخصص</h2><div className="mt-4 space-y-4">{stats.specialties.map(s=><div key={s.name} className="flex items-center gap-3 text-[12px]"><span className="w-[43%] shrink-0 text-right">{s.name}</span><div className="h-[8px] flex-1 overflow-hidden rounded-full bg-[#E2E8F0]"><div className="h-full rounded-full bg-[#09379A]" style={{width:`${s.count/maxSpecialty*100}%`}}/></div><strong className="w-6 text-center">{s.count}</strong></div>)}</div></section>
              </div>
              <section className={`${card} p-6`}><h2 className="border-b border-[#E0E7F2] pb-4 text-[17px] font-bold text-[#0C2C73]">توزيع الحالات</h2><div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.states.map(s=><div key={s.name} className="flex min-h-[105px] flex-col items-center justify-center gap-3 rounded-[11px] border border-[#E0E7F2]"><span className={`rounded-full px-3 py-1 text-[11px] ${s.style}`}>● {s.name}</span><strong className="text-[27px] leading-none">{s.count}</strong></div>)}</div><p className="mt-3 text-[11px] text-[#64748B]">تعتمد حالات المتدربين على ملفات المتدربين؛ عدد الطلبات المعلقة يحتاج ربطًا مباشرًا مع بيانات الطلبات.</p></section>
            </div>}
          </div>
          <ProviderFooter/>
        </main>
      </div>
      {logout&&<div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4"><div dir="rtl" role="dialog" aria-modal="true" className="w-full max-w-[510px] rounded-[13px] bg-white p-8 text-right shadow-xl"><div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE5D8] text-[#B93813]"><LogOut size={27}/></div><h2 className="text-xl font-bold">تسجيل الخروج</h2><p className="mt-3 text-sm text-[#64748B]">هل تريد تسجيل الخروج من بوابة جهة التدريب؟</p><div className="mt-8 flex gap-3"><button className="rounded-lg bg-[#C91D1D] px-5 py-3 text-white" onClick={()=>navigate("/training-provider/login")}>تسجيل الخروج</button><button className={button} onClick={()=>setLogout(false)}>إلغاء</button></div></div></div>}
      {toast&&<div role="status" className="fixed bottom-6 left-6 z-[100] flex items-center gap-3 rounded-xl bg-[#17233B] px-4 py-3 text-sm text-white shadow-xl"><Check size={17} className="text-[#86EFAC]"/>{toast}<button aria-label="إغلاق" onClick={()=>setToast("")}><X size={16}/></button></div>}
    </div>
  );
}
