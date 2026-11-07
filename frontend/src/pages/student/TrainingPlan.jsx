import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, ClipboardList, Clock3 } from 'lucide-react';
import Header from '../../components/student/Header';
import Sidebar from '../../components/student/Sidebar';
import AcademicFooter from '../../components/shared/AcademicFooter';
import { getCurrentTraining } from '../../services/dailyTrainingLogs';
export default function TrainingPlan(){
  const navigate=useNavigate(); const training=getCurrentTraining(); const plan=training?.plan||[];
  return <div dir="rtl" className="flex h-dvh overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
    <Sidebar/><div className="flex min-w-0 flex-1 flex-col overflow-hidden"><Header/>
    <main dir="rtl" className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1100px]">
      <button onClick={()=>navigate('/student/training-profile')} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#09379A]"><ArrowRight size={17}/>الملف التدريبي</button>
      <h1 className="text-2xl font-bold text-[#102C61]">الخطة التدريبية</h1><p className="mt-2 text-sm text-[#64748B]">المهام التي يحددها المشرف الميداني، دون عرض خطة افتراضية لا تخص تدريبك.</p>
      {!training ? <section className="mt-6 rounded-xl border border-[#E0E7F2] bg-white p-8 text-center"><ClipboardList className="mx-auto mb-3 text-[#09379A]"/><h2 className="font-bold">لا يوجد تدريب معتمد مرتبط بحسابك</h2></section> : <>
      <section className="mt-6 grid gap-3 sm:grid-cols-3">{[[CalendarDays,'تاريخ البداية',training.startDate||'—'],[Clock3,'الساعات المطلوبة',`${Number(training.requiredHours)||0} ساعة`],[ClipboardList,'بنود الخطة',plan.length]].map(([Icon,label,value])=><div key={label} className="rounded-xl border border-[#E0E7F2] bg-white p-5"><Icon size={20} className="mb-3 text-[#09379A]"/><p className="text-xs text-[#64748B]">{label}</p><b className="mt-1 block text-lg">{value}</b></div>)}</section>
      <section className="mt-6 rounded-xl border border-[#E0E7F2] bg-white p-5 sm:p-7"><h2 className="mb-4 font-bold text-[#102C61]">بنود الخطة</h2>
      {!plan.length ? <p className="py-10 text-center text-sm text-[#64748B]">لم تضف جهة التدريب خطة لهذا المتدرب بعد.</p> : <div className="space-y-3">{plan.map((task,i)=><div key={task.id||i} className="flex items-start gap-3 rounded-lg border border-[#E0E7F2] bg-[#FAFCFF] p-4"><span className="rounded-lg bg-[#E7EDF8] px-3 py-2 text-xs font-bold text-[#09379A]">الأسبوع {task.week||'—'}</span><p className="text-sm leading-7">{task.text||task.title||'بند تدريبي'}</p></div>)}</div>}
      </section></>}
      <AcademicFooter audience="student"/>
    </div></main></div>
  </div>;
}
