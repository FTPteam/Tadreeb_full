import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock3, ClipboardCheck, ShieldCheck, XCircle } from 'lucide-react';
import Header from '../../components/student/Header';
import Sidebar from '../../components/student/Sidebar';
import AcademicFooter from '../../components/shared/AcademicFooter';
import { getCurrentTraining } from '../../services/dailyTrainingLogs';

export default function FinishTraining(){
  const navigate=useNavigate();const training=getCurrentTraining();
  const completed=Number(training?.completedHours)||0,required=Number(training?.requiredHours)||0;
  const requirements=training ? [
    {label:'استكمال الساعات التدريبية المطلوبة',ok:required>0 && completed>=required,details:`${completed} من ${required} ساعة`},
    {label:'تقييم جهة التدريب',ok:Boolean(training.evaluation),details:training.evaluation?'موجود':'بانتظار تقييم الجهة'},
    {label:'مراجعة السجلات اليومية',ok:!(training.logs||[]).some(l=>['pending','revision'].includes(l.status)),details:'لا توجد سجلات بانتظار المراجعة أو التعديل'},
  ] : [];
  const ready=Boolean(training)&&requirements.every(r=>r.ok);
  return <div dir="rtl" className="flex h-dvh overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
    <Sidebar/><div className="flex min-w-0 flex-1 flex-col overflow-hidden"><Header/>
      <main dir="rtl" className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1080px]">
        <button onClick={()=>navigate('/student/training-profile')} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#09379A]"><ArrowRight size={17}/>الملف التدريبي</button>
        <h1 className="text-2xl font-bold text-[#102C61]">إنهاء التدريب الميداني</h1><p className="mt-2 text-sm leading-7 text-[#64748B]">متابعة متطلبات الإنهاء، دون اعتماد نهاية التدريب أو إصدار شهادة من واجهة الطالب.</p>
        {!training ? <div className="mt-6 rounded-xl border border-[#E0E7F2] bg-white p-8 text-center"><Clock3 size={32} className="mx-auto mb-3 text-[#09379A]"/><h2 className="font-bold">لا يوجد تدريب مرتبط بحسابك</h2></div> : <>
          <section className="mt-6 grid gap-3 sm:grid-cols-3">{[[Clock3,'الساعات المنجزة',completed],[ClipboardCheck,'الساعات المطلوبة',required],[ShieldCheck,'حالة التدريب',training.status==='completed'?'منتهٍ':training.status==='active'?'قيد التدريب':'لم يبدأ']].map(([Icon,label,value])=><div key={label} className="rounded-xl border border-[#E0E7F2] bg-white p-5"><Icon size={20} className="mb-3 text-[#09379A]"/><p className="text-xs text-[#64748B]">{label}</p><b className="mt-1 block text-xl">{value}</b></div>)}</section>
          <section className="mt-6 rounded-xl border border-[#E0E7F2] bg-white p-5 sm:p-7"><h2 className="text-lg font-bold text-[#102C61]">قائمة متطلبات الإنهاء</h2><div className="mt-5 space-y-3">{requirements.map(r=><div key={r.label} className="flex items-start gap-3 rounded-lg bg-[#F8FAFC] p-4">{r.ok?<CheckCircle2 className="mt-1 shrink-0 text-emerald-600" size={20}/>:<XCircle className="mt-1 shrink-0 text-amber-600" size={20}/>}<div><p className="text-sm font-bold">{r.label}</p><p className="mt-1 text-xs text-[#64748B]">{r.details}</p></div></div>)}</div>
          <div role="status" className="mt-6 rounded-lg border border-[#C8D8F3] bg-[#F1F6FF] p-4 text-sm leading-8 text-[#09379A]">{training.status==='completed'?'سجل التدريب منتهٍ في بيانات العرض. إصدار الشهادة الرسمية يحتاج اعتمادًا من الإدارة وخدمة Backend.':ready?'المتطلبات المسجلة مكتملة مبدئيًا. ينتظر الإنهاء اعتماد الإدارة من النظام الحقيقي.':'لا يزال هناك متطلبات غير مكتملة. راجع جهة التدريب والمشرف الأكاديمي.'}</div>
          <button type="button" onClick={()=>navigate('/student/certificate')} className="mt-5 rounded-lg border border-[#C8D8F3] bg-white px-5 py-3 text-sm font-bold text-[#09379A]">حالة الشهادة</button>
          </section></>}
        <AcademicFooter audience="student"/>
      </div></main>
    </div>
  </div>;
}
