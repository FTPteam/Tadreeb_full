import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CalendarDays, ClipboardList, FileCheck2, Clock3, Pencil, Send, Trash2, X, Info, ChevronLeft, CheckCircle2, Lightbulb, Save } from 'lucide-react';
import Header from '../../components/student/Header';
import Sidebar from '../../components/student/Sidebar';
import AcademicFooter from '../../components/shared/AcademicFooter';
import { getWeeklyLogSummary } from '../../services/dailyTrainingLogs';
import { useApi } from '../../api/useApi';
import { fetchCurrentTraining, fetchDailyLogs, saveDailyLog } from '../../api/student';

// BR-05: a day waits for the provider's confirmation, and is locked once confirmed.
const LOG_STATES = { pending: 'بانتظار تأكيد الجهة', approved: 'مؤكد من الجهة' };

const input = 'h-11 w-full rounded-lg border border-[#DBE3F1] bg-white px-3 text-[13px] outline-none transition focus:border-[#09379A] focus:ring-2 focus:ring-[#09379A]/10';
const today = () => { const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const badge={ draft:'bg-slate-100 text-slate-700',pending:'bg-blue-50 text-[#09379A]',revision:'bg-amber-50 text-amber-700',approved:'bg-emerald-50 text-emerald-700' };
function Status({state}) { return <span className={`inline-flex shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${badge[state]||badge.draft}`}>{LOG_STATES[state]||state}</span>; }
function initial(log) { return {id:log?.id||'',date:log?.date||today(),hours:log?.hours||'',tasks:log?.tasks?.length?log.tasks:[''],learning:log?.learning||'',challenges:log?.challenges||''}; }
export default function DailyTrainingLog(){
 const navigate=useNavigate();
 const logsState=useApi(fetchDailyLogs,[],[]);
 const logs=logsState.data||[];
 const training=useApi(fetchCurrentTraining,[]).data;
 const [form,setForm]=useState(null);
 const [message,setMessage]=useState('');
 const [saving,setSaving]=useState(false);
 const taskInputs=useRef([]);
 const [showOptional,setShowOptional]=useState(false);
 const week=useMemo(()=>getWeeklyLogSummary(logs),[logs]);
 const save=async()=>{
  if(saving)return;
  setSaving(true);
  try{
   const notes=[form.learning,form.challenges].map(t=>t.trim()).filter(Boolean).join('\n');
   await saveDailyLog({id:form.id,applicationId:training?.applicationId,date:form.date,hours:Number(form.hours),tasks:form.tasks.map(t=>t.trim()),notes});
   setForm(null);
   setMessage('تم حفظ سجل اليوم، وهو الآن بانتظار تأكيد جهة التدريب.');
   logsState.reload();
  }catch(error){setMessage(error.message);}
  finally{setSaving(false);}
 };
 const edit=log=>{setForm(initial(log));setShowOptional(Boolean(log?.learning || log?.challenges));setMessage('');};
 const startToday=()=>{const old=logs.find(l=>l.date===today());if(old && old.status==='approved'){setMessage('أكدت جهة التدريب سجل اليوم، ولا يمكن تعديله. يمكنك الاطلاع عليه من قائمة السجلات.');return;}edit(old||null);};
 const addTask=()=>{if(form.tasks.length>=8)return;const next=form.tasks.length;setForm(f=>({...f,tasks:[...f.tasks,'']}));requestAnimationFrame(()=>taskInputs.current[next]?.focus());};
 const updateTask=(index,value)=>setForm(f=>({...f,tasks:f.tasks.map((t,i)=>i===index?value:t)}));
 const removeTask=index=>setForm(f=>({...f,tasks:f.tasks.filter((_,i)=>i!==index)}));
 const onTaskPaste=(event,index)=>{const content=event.clipboardData.getData('text');const lines=content.split(/\r?\n/).map(t=>t.trim()).filter(Boolean);if(lines.length<2)return;event.preventDefault();setForm(f=>{const updated=[...f.tasks];updated.splice(index,1,...lines.map(t=>t.slice(0,180)));return {...f,tasks:updated.slice(0,8)};});};
 const onTaskKeyDown=(event,index)=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();if(index===form.tasks.length-1)addTask();else taskInputs.current[index+1]?.focus();}};
 return <div dir="rtl" className="flex h-dvh overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
   <Sidebar/>
   <div className="flex h-dvh min-h-0 min-w-0 flex-1 flex-col overflow-hidden"><Header/>
    <main dir="rtl" className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1250px]">
     <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div><p className="mb-2 text-[12px] text-[#64748B]"><button onClick={()=>navigate('/student/dashboard')}>الرئيسية</button> / السجل اليومي</p><h1 className="text-[27px] font-bold text-[#102C61]">سجلي التدريبي اليومي</h1><p className="mt-2 text-[13px] leading-7 text-[#64748B]">دوّن مهامك في دقائق، وأرسل سجل اليوم للمشرف عندما تنتهي.</p></div>
      <button disabled={!training||training.status==='completed'} onClick={startToday} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#09379A] px-5 text-[13px] font-bold text-white hover:bg-[#082F85] disabled:cursor-not-allowed disabled:opacity-50"><Plus size={18}/>تسجيل مهام اليوم</button>
     </div>
     {message&&<div role="status" className="mb-5 flex items-center justify-between gap-2 rounded-lg border border-[#BAD1FB] bg-[#F1F6FF] px-4 py-3 text-[13px] text-[#09379A]">{message}<button onClick={()=>setMessage('')} aria-label="إغلاق"><X size={16}/></button></div>}
     {!training&&<div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-900">لا يوجد تدريب معتمد مرتبط بحسابك؛ يمكنك إضافة السجلات بعد اعتماد التدريب.</div>}
     <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[[CalendarDays,'أيام هذا الأسبوع',week.days],[ClipboardList,'مهام هذا الأسبوع',week.tasks],[FileCheck2,'سجلات معتمدة',logs.filter(l=>l.status==='approved').length],[Clock3,'بانتظار المراجعة',logs.filter(l=>l.status==='pending').length]].map(([Icon,label,value])=><div key={label} className="rounded-xl border border-[#E0E7F2] bg-white p-4"><span className="mb-3 inline-flex rounded-lg bg-[#EAF1FF] p-2 text-[#09379A]"><Icon size={18}/></span><p className="text-[12px] text-[#64748B]">{label}</p><b className="text-[25px] text-[#0F2E74]">{value}</b></div>)}
     </div>
     {form&&<section className="mb-7 rounded-xl border border-[#B9CAEA] bg-white p-4 shadow-[0_8px_32px_rgba(9,55,154,0.07)] sm:p-6" aria-label="نموذج السجل اليومي">
      <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-[19px] font-bold text-[#102C61]">{form.id?'تعديل سجل اليوم':'تسجيل إنجازات يوم التدريب'}</h2><p className="mt-1 text-[12px] text-[#64748B]">سجل واحد لليوم، ويمكنك إضافة عدة مهام.</p></div><button onClick={()=>setForm(null)} className="rounded-lg border p-2" aria-label="إغلاق النموذج"><X size={19}/></button></div>
      <label className="mb-5 block text-[13px] font-semibold">تاريخ التدريب <span className="font-normal text-[11px] text-[#64748B]">(يُحدد تلقائيًا ويمكن تغييره)</span><input type="date" min={training?.startDate||undefined} max={training?.endDate && training.endDate<today()?training.endDate:today()} value={form.date} disabled={Boolean(form.id)} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className={`${input} mt-2 max-w-[290px] disabled:bg-slate-50`}/></label>
      <label className="mb-5 block text-[13px] font-semibold">عدد الساعات <span className="text-red-500">*</span><input type="number" min="0.25" max="12" step="0.25" value={form.hours} onChange={e=>setForm(f=>({...f,hours:e.target.value}))} placeholder="مثال: 6" className={`${input} mt-2 max-w-[290px]`}/></label>
      <div className="mb-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><label className="text-[13px] font-bold">ماذا أنجزت اليوم؟ <span className="text-red-500">*</span></label><span className="text-[11px] text-[#64748B]">اكتب اسم كل مهمة باختصار</span></div>
      <div className="space-y-3">{form.tasks.map((task,i)=><div key={i} className="flex gap-2"><span className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EDF3FF] text-[12px] font-bold text-[#09379A]">{i+1}</span><input aria-label={`المهمة ${i+1}`} value={task} maxLength={180} onChange={e=>updateTask(i,e.target.value)} placeholder="مثال: تطوير واجهة تسجيل الدخول" className={input} ref={element=>{taskInputs.current[i]=element;}} autoFocus={i===0} onKeyDown={event=>onTaskKeyDown(event,i)} onPaste={event=>onTaskPaste(event,i)}/><button disabled={form.tasks.length===1} onClick={()=>removeTask(i)} className="h-11 rounded-lg border border-red-100 px-3 text-red-600 disabled:opacity-30" aria-label="حذف المهمة"><Trash2 size={17}/></button></div>)}</div>
      <p className="mt-2 text-[11px] leading-6 text-[#64748B]">اضغط Enter للانتقال إلى مهمة جديدة، أو الصق عدة مهام في أسطر منفصلة. لا تحتاج لكتابة شرح طويل.</p>
      {form.tasks.length<8&&<button onClick={addTask} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#B8C9E9] px-4 py-2 text-[12px] font-bold text-[#09379A] hover:bg-[#F0F5FF]"><Plus size={15}/>إضافة مهمة أخرى</button>}</div>
      <div className="mt-5 rounded-lg border border-[#E0E7F2] bg-[#FBFCFF] p-3 sm:p-4">
        <button type="button" aria-expanded={showOptional} onClick={()=>setShowOptional(value=>!value)} className="flex w-full items-center justify-between gap-3 text-right text-[13px] font-bold text-[#09379A]">
          <span className="inline-flex items-center gap-2"><Lightbulb size={17}/>ماذا تعلمت؟ وهل واجهت تحديات؟ <span className="text-[11px] font-normal text-[#64748B]">(اختياري تمامًا)</span></span>
          <span className="text-[12px]">{showOptional?'إخفاء':'إضافة تفاصيل'}</span>
        </button>
        {showOptional&&<div className="mt-4 grid gap-4 lg:grid-cols-2"><label className="block text-[13px] font-semibold">ما الذي تعلمته؟<textarea rows={3} maxLength={1200} placeholder="مثال: تعلمت استخدام أدوات التحقق من البيانات" value={form.learning} onChange={e=>setForm(f=>({...f,learning:e.target.value}))} className={`${input} mt-2 h-auto min-h-[100px] py-3`}/></label><label className="block text-[13px] font-semibold">التحديات أو الملاحظات<textarea rows={3} maxLength={1200} placeholder="اختياري: هل واجهت مشكلة أو احتجت مساعدة؟" value={form.challenges} onChange={e=>setForm(f=>({...f,challenges:e.target.value}))} className={`${input} mt-2 h-auto min-h-[100px] py-3`}/></label></div>}
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#F1F5F9] p-3 text-[12px] leading-6 text-[#64748B]"><Info size={16} className="mt-1 shrink-0"/>تُحتسب الساعات ضمن ساعات التدريب بعد أن تؤكد جهة التدريب هذا اليوم.</div>
      <div className="mt-5 flex flex-col gap-3 border-t border-[#E0E7F2] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 text-[11px] leading-6 text-[#64748B]">يمكنك تعديل السجل حتى تؤكده جهة التدريب.</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
          <button disabled={saving || !form.hours || !form.tasks.some(task=>task.trim())} onClick={save} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#09379A] px-6 text-[13px] font-bold text-white hover:bg-[#082F85] disabled:cursor-not-allowed disabled:opacity-50">{form.id?<Save size={16}/>:<Send size={17}/>}{form.id?'حفظ التعديل':'إرسال سجل اليوم'}</button>
        </div>
      </div>
     </section>}
     <section className="overflow-hidden rounded-xl border border-[#E0E7F2] bg-white"><div className="flex items-center justify-between border-b border-[#E0E7F2] px-5 py-4"><h2 className="text-[16px] font-bold text-[#102C61]">السجلات اليومية</h2><span className="text-[12px] text-[#64748B]">{logs.length} سجل</span></div>
      {logs.length===0?<div className="px-5 py-16 text-center"><ClipboardList size={35} className="mx-auto text-[#A2B5D9]"/><h3 className="mt-3 font-bold">لم تضف سجلات بعد</h3><p className="mt-2 text-[13px] text-[#64748B]">ابدأ بإضافة أول سجل من زر «إضافة سجل يومي».</p></div>:<div className="divide-y divide-[#E9EEF6]">{logs.map(log=><div key={log.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 hover:bg-[#FCFDFF]"><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><span className="text-[12px] text-[#64748B]">{log.date}</span><Status state={log.status}/></div><p className="truncate text-[14px] font-bold text-[#17233B]">{log.tasks.join(' • ')||'مسودة'}</p><p className="mt-1 text-[11px] text-[#64748B]">{log.tasks.length} مهام · {log.hours} ساعة</p></div><div className="flex gap-2">{log.status==='pending'&&<button onClick={()=>edit(log)} className="inline-flex items-center gap-2 rounded-lg border border-[#B8C9E9] px-3 py-2 text-[12px] text-[#09379A]"><Pencil size={15}/>تعديل</button>}<button onClick={()=>navigate(`/student/daily-training-log/details?id=${encodeURIComponent(log.id)}`)} className="inline-flex items-center gap-1 rounded-lg border border-[#E0E7F2] px-3 py-2 text-[12px]">التفاصيل <ChevronLeft size={15}/></button></div></div>)}</div>}
     </section>
     <div className="mt-4 rounded-lg border border-[#E0E7F2] bg-[#F8FAFC] px-4 py-3 text-[12px] text-[#64748B]">الملخص الأسبوعي يُنشأ تلقائيًا من المهام المسجلة. الحضور والساعات المعتمدة لهما سجل مستقل.</div>
     <AcademicFooter audience="student"/></div></main>
   </div>
  </div>;
}
