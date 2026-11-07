import { useNavigate } from 'react-router-dom';
import { Award, ArrowRight, FileCheck2 } from 'lucide-react';
import Header from '../../components/student/Header';
import Sidebar from '../../components/student/Sidebar';
import AcademicFooter from '../../components/shared/AcademicFooter';
import { getCurrentTraining } from '../../services/dailyTrainingLogs';

export default function Certificate(){
  const navigate=useNavigate();const training=getCurrentTraining();const complete=training?.status==='completed';
  return <div dir="rtl" className="flex h-dvh overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
    <Sidebar/><div className="flex min-w-0 flex-1 flex-col overflow-hidden"><Header/>
      <main dir="rtl" className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1050px]">
        <button onClick={()=>navigate('/student/dashboard')} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#09379A]"><ArrowRight size={17}/>الرئيسية</button>
        <h1 className="mb-2 text-2xl font-bold text-[#102C61]">شهادة التدريب الميداني</h1>
        <p className="mb-6 text-sm text-[#64748B]">حالة الشهادة وخطوات إصدارها الرسمي.</p>
        <section className="rounded-2xl border border-[#E0E7F2] bg-white p-6 sm:p-10">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDF3FF] text-[#09379A]"><Award size={28}/></div>
          <h2 className="mb-3 text-xl font-bold text-[#102C61]">{complete ? 'بانتظار إصدار الشهادة الرسمية' : 'الشهادة غير متاحة بعد'}</h2>
          <p className="max-w-[680px] text-sm leading-8 text-[#64748B]">{complete ? 'تظهر حالة التدريب منتهية في البيانات التجريبية، لكن لم تُصدر شهادة رسمية عبر النظام بعد. ستتاح الشهادة المعتمدة ورقمها وتوقيعها بعد ربط خدمة إصدار الشهادات والتحقق منها.' : 'ستتاح الشهادة بعد استيفاء متطلبات التدريب والتقييم واعتماد الإنهاء من الإدارة، ثم إصدار الوثيقة عبر خدمة الشهادات في الـBackend.'}</p>
          {training&&<div className="mt-6 flex flex-wrap gap-3 rounded-xl bg-[#F8FAFC] p-4 text-sm"><span>التدريب: <b>{training.opportunity||'—'}</b></span><span>الساعات: <b>{Number(training.completedHours)||0} / {Number(training.requiredHours)||0}</b></span></div>}
          <div className="mt-6 flex flex-wrap gap-3"><button onClick={()=>navigate('/student/training-profile')} className="inline-flex items-center gap-2 rounded-lg bg-[#09379A] px-5 py-3 text-sm font-bold text-white"><FileCheck2 size={17}/>ملف التدريب</button><button onClick={()=>navigate('/student/finish-training')} className="rounded-lg border border-[#E0E7F2] px-5 py-3 text-sm font-semibold">متطلبات الإنهاء</button></div>
        </section><AcademicFooter audience="student"/></div></main>
    </div></div>;
}
