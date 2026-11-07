import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, CalendarDays, ClipboardList, Clock3, FileText, NotebookPen, ShieldCheck, UserRound } from 'lucide-react';
import Header from '../../components/student/Header';
import Sidebar from '../../components/student/Sidebar';
import AcademicFooter from '../../components/shared/AcademicFooter';
import { getCurrentTraining } from '../../services/dailyTrainingLogs';
import { getActiveStudentId } from '../../services/studentTrainingEligibility';
import { getStudent } from '../admin/studentsStore';

function Info({title,value}){
  return <div className="rounded-xl border border-[#E0E7F2] bg-[#FBFCFF] p-4"><p className="text-xs text-[#64748B]">{title}</p><p className="mt-2 text-sm font-bold text-[#17233B]">{value || '—'}</p></div>;
}
export default function TrainingProfile(){
  const navigate=useNavigate();const student=getStudent(getActiveStudentId());const training=getCurrentTraining();
  const status=training?.status==='active'?'قيد التدريب':training?.status==='completed'?'منتهٍ':training?.status==='not_started'?'معتمد ولم يبدأ':'لا يوجد تدريب معتمد';
  const actions=[
    {label:'خطة التدريب',path:'/student/training-plan',Icon:ClipboardList},
    {label:'الحضور والساعات',path:'/student/attendance',Icon:Clock3},
    {label:'السجل اليومي',path:'/student/daily-training-log',Icon:NotebookPen},
    {label:'إنهاء التدريب',path:'/student/finish-training',Icon:ShieldCheck},
  ];
  return <div dir="rtl" className="flex h-dvh overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
    <Sidebar/><div className="flex min-w-0 flex-1 flex-col overflow-hidden"><Header/>
      <main dir="rtl" className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1150px]">
        <button onClick={()=>navigate('/student/dashboard')} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#09379A]"><ArrowRight size={17}/>لوحة التحكم</button>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-[#102C61]">ملفي التدريبي</h1><p className="mt-2 text-sm text-[#64748B]">ملخص التدريب المرتبط بحسابك الحالي.</p></div><span className="rounded-full border border-[#D6E3FA] bg-[#EDF3FF] px-4 py-2 text-xs font-bold text-[#09379A]">{status}</span></div>
        {!training ? <section className="rounded-xl border border-[#E0E7F2] bg-white p-7 text-center"><FileText className="mx-auto mb-3 text-[#09379A]" size={32}/><h2 className="font-bold">لا يوجد تدريب معتمد مرتبط بحسابك حاليًا</h2><p className="mt-2 text-sm text-[#64748B]">يمكنك متابعة الطلبات أو استعراض الفرص المتاحة.</p><div className="mt-5 flex justify-center gap-3"><button className="rounded-lg bg-[#09379A] px-5 py-3 text-sm font-bold text-white" onClick={()=>navigate('/student/applications')}>طلباتي</button><button className="rounded-lg border px-5 py-3 text-sm" onClick={()=>navigate('/student/opportunities')}>الفرص</button></div></section> : <>
          <section className="rounded-xl border border-[#E0E7F2] bg-white p-5 sm:p-7"><div className="mb-5 flex items-center gap-2"><Building2 className="text-[#09379A]" size={22}/><h2 className="text-lg font-bold">{training.opportunity||'التدريب الميداني'}</h2></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Info title="الطالب" value={student?.name || training.name}/><Info title="الرقم الجامعي" value={getActiveStudentId()}/><Info title="التخصص" value={student?.major||training.major}/>
              <Info title="جهة التدريب" value={training.organization || student?.organization}/><Info title="المشرف الميداني" value={training.supervisor}/><Info title="المشرف الأكاديمي" value={student?.supervisor}/>
              <Info title="تاريخ البداية" value={training.startDate}/><Info title="تاريخ النهاية" value={training.endDate}/><Info title="الساعات" value={`${Number(training.completedHours)||0} / ${Number(training.requiredHours)||0} ساعة`}/>
            </div>
          </section>
          <section className="mt-6 rounded-xl border border-[#E0E7F2] bg-white p-5 sm:p-7"><h2 className="mb-4 text-lg font-bold text-[#102C61]">الوصول السريع</h2><div className="grid gap-3 sm:grid-cols-2">{actions.map(({label,path,Icon})=><button key={path} onClick={()=>navigate(path)} className="flex items-center gap-3 rounded-xl border border-[#DDE6F6] bg-[#FAFCFF] p-4 text-right text-sm font-bold text-[#09379A] transition hover:border-[#93ADD9] hover:bg-[#F0F5FF]"><Icon size={20}/>{label}</button>)}</div></section>
          <div className="mt-5 rounded-xl border border-[#DDE6F6] bg-[#F6F9FF] p-4 text-xs leading-7 text-[#64748B]">المرفقات والتقييمات المعتمدة والوثائق الرسمية ستظهر بعد ربط النظام بمصدرها الحقيقي عبر الـBackend، ولن تُعرض بيانات افتراضية على أنها وثائق رسمية.</div>
        </>}
        <AcademicFooter audience="student"/>
      </div></main>
    </div>
  </div>;
}
