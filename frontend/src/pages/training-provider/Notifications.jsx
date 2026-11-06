import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox, FileText, Star, BadgeCheck, CalendarCheck, BellOff,
  CheckCheck, Check, ChevronLeft, Settings, AlertCircle, X, LogOut,
} from 'lucide-react';
import Header from '../../components/training-provider/Header';
import Sidebar from '../../components/training-provider/Sidebar';
import ProviderFooter from '../../components/training-provider/ProviderFooter';
import {
  getProviderNotifications, markProviderNotificationRead,
  markAllProviderNotificationsRead, subscribeProviderNotifications,
} from './providerNotificationsStore';

const visuals = {
  request: {Icon:Inbox,bg:'#FFE5DA',fg:'#B93813'},
  log: {Icon:FileText,bg:'#E7EDF8',fg:'#09379A'},
  evaluation: {Icon:Star,bg:'#FFE5DA',fg:'#B93813'},
  approval: {Icon:BadgeCheck,bg:'#DCFCE7',fg:'#15803D'},
  attendance: {Icon:CalendarCheck,bg:'#E7EDF8',fg:'#09379A'},
};
const buttonClass = 'inline-flex h-[44px] items-center justify-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[13px] font-medium text-[#17233B] transition hover:bg-[#F8FAFC]';

export default function Notifications(){
  const navigate=useNavigate();
  const [mobile,setMobile]=useState(false);
  const [logoutOpen,setLogoutOpen]=useState(false);
  const [items,setItems]=useState(getProviderNotifications);
  const [tab,setTab]=useState('all');
  const [notice,setNotice]=useState('');
  useEffect(()=>subscribeProviderNotifications(()=>setItems(getProviderNotifications())),[]);
  const unread=items.filter(x=>!x.read).length;
  const shown=tab==='unread'?items.filter(x=>!x.read):items;
  const notify=text=>setNotice(text);
  const handleOpen=item=>{
    markProviderNotificationRead(item.id);
    const enabled=['/training-provider/requests','/training-provider/trainees','/training-provider/settings','/training-provider/opportunities','/training-provider/profile','/training-provider/attendance','/training-provider/evaluations'];
    if(enabled.includes(item.path)) navigate(item.path);
    else notify('تفاصيل هذا الإشعار ستكون متاحة عند تجهيز الصفحة المرتبطة به.');
  };
  const markAll=()=>{markAllProviderNotificationsRead();notify('تم تحديد جميع الإشعارات كمقروءة');};
  return (
    <div dir="rtl" className="flex h-dvh overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
      <Sidebar open={mobile} onClose={()=>setMobile(false)} onLogout={()=>setLogoutOpen(true)} onUnavailable={name=>notify(`صفحة «${name}» لم تجهز بعد.`)}/>
      <div className="provider-page-scroll h-dvh min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <Header onMenu={()=>setMobile(true)} onLogout={()=>setLogoutOpen(true)} onUnavailable={name=>notify(`صفحة «${name}» لم تجهز بعد.`)}/>
        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-[12px] text-[#64748B]">
                <button onClick={()=>navigate('/training-provider/dashboard')} className="hover:text-[#09379A]">لوحة التحكم</button>
                <ChevronLeft size={15}/><strong className="text-[#17233B]">الإشعارات</strong>
              </div>
              <h1 className="text-[30px] font-bold leading-tight">الإشعارات</h1>
              <p className="mt-1 text-[13px] text-[#64748B]">{unread} إشعارات غير مقروءة من أصل {items.length}.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={markAll} disabled={unread===0} className={`${buttonClass} disabled:cursor-not-allowed disabled:text-[#94A3B8] disabled:hover:bg-white`}><CheckCheck size={18}/>تحديد الكل كمقروء</button>
              <button type="button" onClick={()=>navigate('/training-provider/settings')} className={buttonClass}><Settings size={18}/>إعدادات الإشعارات</button>
            </div>
          </div>
          <div className="mb-5 mt-7 flex flex-wrap gap-2">
            {[["all",`الكل ${items.length}`],["unread",`غير المقروءة ${unread}`]].map(([value,label])=><button key={value} type="button" onClick={()=>setTab(value)} className={`h-[36px] rounded-full border px-5 text-[12px] ${tab===value?'border-[#09379A] bg-[#09379A] text-white':'border-[#E0E7F2] bg-white text-[#64748B] hover:bg-[#F1F5F9]'}`}>{label}</button>)}
          </div>
          <section className="min-h-[310px] overflow-hidden rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
            {shown.length===0?(
              <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#E7EDF8] text-[#09379A]"><BellOff size={32}/></span>
                <h2 className="mt-4 text-[19px] font-bold">{tab==='unread'?'لا توجد إشعارات غير مقروءة':'لا توجد إشعارات'}</h2>
                <p className="mt-2 text-[13px] text-[#64748B]">{tab==='unread'?'ستصلك هنا تنبيهات الطلبات والسجلات والتقييمات.':'ستظهر إشعارات جهة التدريب هنا عند ورودها.'}</p>
              </div>
            ):shown.map(item=>{
              const {Icon,bg,fg}=visuals[item.kind]||visuals.request;
              return <article key={item.id} className={`flex flex-wrap items-center justify-between gap-4 border-b border-[#E0E7F2] px-0 py-5 last:border-0 sm:px-1 ${!item.read?'bg-[#F4F7FF]':''}`}>
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[9px]" style={{backgroundColor:bg,color:fg}}><Icon size={22} strokeWidth={1.9}/></span>
                  <div className="min-w-0 text-right">
                    <h3 className="text-[14px] font-bold text-[#17233B]">{item.title}</h3>
                    <p className="mt-1 text-[12px] leading-6 text-[#64748B]">{item.description}</p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-[#64748B]"><span>{item.time}</span><span>•</span><span className="rounded-full bg-[#F1F5F9] px-3 py-1">{item.category}</span></div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!item.read&&<button type="button" onClick={()=>markProviderNotificationRead(item.id)} className="inline-flex h-9 items-center gap-2 rounded-[7px] border border-[#E0E7F2] bg-white px-3 text-[12px] hover:bg-[#F8FAFC]"><Check size={15}/>مقروء</button>}
                  <button type="button" onClick={()=>handleOpen(item)} className="inline-flex h-9 items-center gap-2 rounded-[7px] border border-[#E0E7F2] bg-white px-3 text-[12px] hover:bg-[#F8FAFC]"><ChevronLeft size={16}/>فتح</button>
                </div>
              </article>;
            })}
          </section>
          <ProviderFooter/>
        </main>
      </div>
      {logoutOpen&&<div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setLogoutOpen(false)}}><div role="dialog" aria-modal="true" dir="rtl" className="w-full max-w-[525px] rounded-[13px] bg-white p-7 shadow-2xl"><div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE5DA] text-[#B93813]"><LogOut size={27}/></div><h2 className="text-[22px] font-bold">تسجيل الخروج</h2><p className="mt-3 text-[14px] leading-7 text-[#64748B]">هل تريد تسجيل الخروج من بوابة جهة التدريب؟</p><div className="mt-7 flex gap-3"><button onClick={()=>navigate('/training-provider/login')} className="rounded-[8px] bg-[#C81E1E] px-5 py-3 text-white">تسجيل الخروج</button><button onClick={()=>setLogoutOpen(false)} className={buttonClass}>إلغاء</button></div></div></div>}
      {notice&&<div role="status" className="fixed bottom-6 left-6 z-[100] flex max-w-[360px] items-center gap-3 rounded-[10px] bg-[#111C2D] px-5 py-3 text-[13px] text-white shadow-xl"><Check size={17} className="text-[#4ADE80]"/><span>{notice}</span><button aria-label="إغلاق" onClick={()=>setNotice('')}><X size={16}/></button></div>}
    </div>
  );
}
