import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, BriefcaseBusiness, Inbox, FileText, Star, CalendarCheck, ChevronLeft, UserRound, Plus, ChartNoAxesColumn, LogOut, X, AlertCircle } from "lucide-react";
import Sidebar from "../../components/training-provider/Sidebar";
import Header from "../../components/training-provider/Header";
import ProviderFooter from "../../components/training-provider/ProviderFooter";
import { getOpportunities, getProviderStats, subscribeProviderData } from "../../api/provider";

const tones={blue:"bg-[#E7EDF8] text-[#09379A]",orange:"bg-[#FFE5DA] text-[#BC481C]",green:"bg-[#DCFCE7] text-[#15803D]",sky:"bg-[#DDF6FD] text-[#047BA2]"};
function Stat({ Icon, label, value, unit, tone, onClick }) { return <button type="button" onClick={onClick} className="w-full rounded-[11px] border border-[#E0E7F2] bg-white px-5 py-4 text-right transition hover:border-[#B5C6E5] hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#09379A]"><div className="flex items-center justify-between gap-2"><span className="text-[12px] font-semibold text-[#374151]">{label}</span><span className={`flex h-9 w-9 items-center justify-center rounded-[8px] ${tones[tone]}`}><Icon size={18}/></span></div><div className="mt-3 flex items-end gap-2"><strong className="text-[29px] leading-none text-[#092B78]">{value}</strong><small className="pb-1 text-[11px] text-[#8290A5]">{unit}</small></div></button>; }
function Box({title,action,children,className=""}) {return <section className={`rounded-[11px] border border-[#E0E7F2] bg-white p-5 ${className}`}><div className="mb-3 flex min-h-[30px] items-center justify-between border-b border-[#E8EDF5] pb-3"><h2 className="text-[15px] font-bold text-[#092B78]">{title}</h2>{action}</div>{children}</section>}
function LogoutModal({ onClose, onLogout }) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="provider-logout-title"
        dir="rtl"
        className="w-full max-w-[530px] rounded-[13px] bg-white px-8 py-7 text-right shadow-2xl"
      >
        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${tones.orange}`}>
          <LogOut size={28} />
        </div>
        <h2 id="provider-logout-title" className="text-[22px] font-bold text-[#121F36]">
          تسجيل الخروج
        </h2>
        <p className="mt-3 text-[14px] leading-8 text-[#64748B]">
          هل تريد تسجيل الخروج من بوابة جهة التدريب؟ ستحتاج إلى إدخال بياناتك مرة أخرى للدخول.
        </p>
        <div className="mt-7 flex flex-row items-center gap-3">
          <button type="button" onClick={onLogout} className="flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#C81E1E] px-6 text-[13px] font-bold text-white">
            <LogOut size={17} />تسجيل الخروج
          </button>
          <button type="button" onClick={onClose} className="h-11 rounded-[8px] border border-[#E0E7F2] px-5 text-[13px]">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
export default function Dashboard(){
  const navigate=useNavigate();
  const [mobile,setMobile]=useState(false);
  const [modal,setModal]=useState(null);
  const [notice,setNotice]=useState("");
  const [, setVersion] = useState(0);
  useEffect(() => subscribeProviderData(() => setVersion(v => v + 1)), []);
  // FR-36: the provider's numbers and to-do list from /api/stats/provider/.
  const stats = getProviderStats();
  const organization = { name: stats?.provider_name, status: 'approved' };
  const incoming = (stats?.pending_acceptances || []).map(item => ({ name: item.student_name, major: item.opportunity_title, date: item.start_date }));
  const evaluations = [];
  const activities = [];
  const isSeedOrganization = true;
  // يستقبل روابط الهيدر والسايدبار القديمة، ويحوّلها الآن إلى الصفحات المنجزة.
  const goToSection = (name) => {
    const routes = {
      "لوحة التحكم": "/training-provider/dashboard",
      "فرص التدريب": "/training-provider/opportunities",
      "إضافة فرصة تدريب": "/training-provider/opportunities/add",
      "طلبات الطلاب": "/training-provider/requests",
      "تفاصيل طلب التدريب": "/training-provider/requests",
      "المتدربون": "/training-provider/trainees",
      "الحضور والسجلات": "/training-provider/attendance",
      "سجل الحضور": "/training-provider/attendance",
      "السجلات اليومية": "/training-provider/attendance",
      "التقييمات": "/training-provider/evaluations",
      "تفاصيل التقييم": "/training-provider/evaluations",
      "المشرفون الميدانيون": "/training-provider/supervisors",
      "الإحصائيات": "/training-provider/statistics",
      "الإشعارات": "/training-provider/notifications",
      "تفاصيل الإشعار": "/training-provider/notifications",
      "ملف الجهة": "/training-provider/profile",
      "الإعدادات": "/training-provider/settings",
    };
    const route = routes[name];
    if (route) {
      setNotice("");
      setMobile(false);
      navigate(route);
    } else {
      setNotice(`تعذر العثور على رابط «${name}».`);
    }
  };
  const logout=()=>{setModal(null);navigate("/training-provider/login");};
  return <div dir="rtl" className="flex h-dvh overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
    <Sidebar open={mobile} onClose={()=>setMobile(false)} onLogout={()=>setModal("logout")} onUnavailable={goToSection}/>
    <div className="provider-page-scroll h-dvh min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
      <Header onMenu={()=>setMobile(true)} onLogout={()=>setModal("logout")} onUnavailable={goToSection}/>
      <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:px-8">
        <div className="rounded-[10px] bg-[#09379A] px-7 py-7 text-white"><h1 className="text-[24px] font-bold">مرحباً بجهة التدريب</h1><p className="mt-1 text-[12px] text-white/85">{organization?.name || 'جهة التدريب'} • بوابة متابعة التدريب الميداني</p></div>
        {organization?.status !== 'approved' && <div className="mt-4 rounded-[10px] border border-[#F5D7A5] bg-[#FFF8E8] px-5 py-4 text-[12px] leading-7 text-[#8A5A12]"><strong>حالة الاعتماد: {organization?.status === 'rejected' ? 'مرفوضة' : 'بانتظار اعتماد الإدارة'}.</strong> يمكنك استكمال بيانات الجهة وتجهيز الفرص كمسودات، لكن نشر الفرص واستقبال طلبات الطلاب يتطلب اعتماد الإدارة أولًا. <button onClick={()=>navigate('/training-provider/profile')} className="mr-2 font-bold underline">عرض ملف الجهة</button></div>}
        <div className="mt-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
          <Stat Icon={Users} label="المتدربون الحاليون" value={String(stats?.active_trainees ?? 0)} unit="متدرب" tone="blue" onClick={()=>navigate("/training-provider/trainees")}/>
          <Stat Icon={BriefcaseBusiness} label="فرص منشورة" value={String(getOpportunities().filter(o => o.status === "published").length)} unit="فرص" tone="green" onClick={()=>navigate("/training-provider/opportunities")}/>
          <Stat Icon={Inbox} label="طلبات معلقة" value={String(stats?.pending_tasks?.students_to_accept ?? 0)} unit="طلب" tone="orange" onClick={()=>navigate("/training-provider/requests")}/>
          <Stat Icon={FileText} label="سجلات بانتظار المراجعة" value={String(stats?.pending_tasks?.days_to_confirm ?? 0)} unit="سجل" tone="sky" onClick={()=>navigate("/training-provider/attendance", { state: { tab: "logs", status: "pending" } })}/>
        </div>
        <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.62fr_1fr]">
          <Box title="أحدث طلبات التدريب" action={<button onClick={()=>navigate("/training-provider/requests")} className="rounded-[6px] border border-[#E0E7F2] px-3 py-1 text-[11px]">عرض الكل <ChevronLeft size={13} className="mr-1 inline"/></button>}>
            {(isSeedOrganization ? incoming : []).map((item,i)=><button key={i} onClick={()=>navigate("/training-provider/requests")} className="flex w-full items-center gap-3 border-b border-[#E8EDF5] py-3 text-right last:border-0"><span className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${tones.orange}`}><UserRound size={20}/></span><span className="flex-1"><span className="block text-[12px] font-bold">{item.name}</span><span className="text-[11px] text-[#64748B]">{item.major} • {item.date}</span></span><span className="rounded-full bg-[#FFE6D8] px-3 py-1 text-[10px] text-[#BD4A1E]">• معلّق</span></button>)}
          </Box>
          <Box title="تقييمات مطلوبة" action={<button onClick={()=>navigate("/training-provider/evaluations")} className="rounded-[6px] border border-[#E0E7F2] px-3 py-1 text-[11px]">عرض الكل <ChevronLeft size={13} className="mr-1 inline"/></button>}>
            {(isSeedOrganization ? evaluations : []).map((item,i)=><button key={i} onClick={()=>navigate("/training-provider/evaluations")} className="flex w-full items-center gap-3 border-b border-[#E8EDF5] py-3 text-right last:border-0"><span className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${tones.blue}`}><Star size={20}/></span><span className="flex-1"><span className="block text-[12px] font-bold">{item.name}</span><span className="text-[11px] text-[#64748B]">{item.field}</span></span><ChevronLeft size={16}/></button>)}
          </Box>
          <Box title="الحضور اليوم">
            <div className="grid grid-cols-3 gap-3">{[["حاضر","8","green"],["متأخر","1","orange"],["غائب","2","red"]].map(([name,count,tone])=><div key={name} className="rounded-[10px] border border-[#E0E7F2] py-3 text-center"><span className={`rounded-full px-3 py-1 text-[10px] ${tone==="green"?"bg-green-100 text-green-700":tone==="orange"?"bg-orange-100 text-orange-700":"bg-red-100 text-red-600"}`}>• {name}</span><strong className="mt-3 block text-[25px]">{count}</strong><small className="text-[10px] text-[#64748B]">{name} من 11</small></div>)}</div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><span className="text-[11px] text-[#64748B]">حضور اليوم 2025/12/18</span><button onClick={()=>navigate("/training-provider/attendance")} className="flex items-center gap-2 rounded-[6px] bg-[#09379A] px-3 py-2 text-[11px] font-semibold text-white"><CalendarCheck size={14}/>سجل الحضور</button></div>
          </Box>
          <div className="space-y-5">
            <Box title="آخر النشاطات">{(isSeedOrganization ? activities : []).map((item,i)=><button type="button" key={i} onClick={()=>navigate(i===0?"/training-provider/requests":i===1?"/training-provider/attendance":i===2?"/training-provider/attendance":"/training-provider/evaluations")} className="flex w-full items-center gap-3 border-b border-[#E8EDF5] py-3 text-right last:border-0 hover:bg-[#F8FAFC]"><span className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${tones[item.tone]}`}><item.Icon size={18}/></span><div><span className="block text-[12px] font-bold">{item.title}</span><small className="text-[11px] text-[#64748B]">{item.time}</small></div></button>)}</Box>
            <Box title="إجراءات سريعة"><div className="space-y-2"><button onClick={()=>navigate("/training-provider/opportunities/add")} className="flex h-9 w-full items-center justify-center gap-2 rounded-[6px] bg-[#09379A] text-[12px] text-white"><Plus size={16}/>إضافة فرصة تدريب</button><button onClick={()=>navigate("/training-provider/trainees")} className="flex h-9 w-full items-center justify-center gap-2 rounded-[6px] border border-[#E0E7F2] text-[12px]"><Users size={16}/>المتدربون</button><button onClick={()=>navigate("/training-provider/statistics")} className="flex h-9 w-full items-center justify-center gap-2 rounded-[6px] border border-[#E0E7F2] text-[12px]"><ChartNoAxesColumn size={16}/>الإحصائيات</button></div></Box>
          </div>
        </div>
        <ProviderFooter />
      </main>
    </div>
    {modal === "logout" && <LogoutModal onClose={()=>setModal(null)} onLogout={logout} />}
    {notice&&<div role="status" className="fixed bottom-5 left-5 z-[80] flex max-w-[340px] items-center gap-3 rounded-[9px] border border-[#E0E7F2] bg-white p-4 text-[12px] shadow-xl"><AlertCircle size={17} className="shrink-0 text-[#09379A]"/><span>{notice}</span><button onClick={()=>setNotice("")} aria-label="إغلاق التنبيه"><X size={16}/></button></div>}
  </div>;
}
