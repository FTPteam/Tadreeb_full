import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import Header from '../../components/student/Header';
import Sidebar from '../../components/student/Sidebar';
import AcademicFooter from '../../components/shared/AcademicFooter';
import { subscribeApplications } from '../training-provider/providerApplicationsStore';
import { getMyApplication } from './studentApplicationView';
function Info({label,value}){return <div className="rounded-lg bg-[#F8FAFC] p-4"><p className="mb-2 text-xs text-[#64748B]">{label}</p><p className="text-sm font-bold">{value || '—'}</p></div>}
export default function TrainingAccepted(){
  const navigate=useNavigate();const {id}=useParams();
  const [application,setApplication]=useState(()=>getMyApplication(id));
  useEffect(()=>{const refresh=()=>setApplication(getMyApplication(id));const unsubscribe=subscribeApplications(refresh);window.addEventListener('admin-training-requests-updated',refresh);return()=>{unsubscribe();window.removeEventListener('admin-training-requests-updated',refresh)}},[id]);
  return <div dir="rtl" className="flex h-dvh overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden"><Header />
        <main dir="rtl" className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1100px]"><button type="button" onClick={() => navigate('/student/applications')} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#09379A]"><ArrowRight size={17} /> العودة إلى طلباتي</button>
          {!application || application.overallStatus !== 'accepted' ? <section className="rounded-xl border border-[#E0E7F2] bg-white p-8 text-center"><ShieldCheck size={36} className="mx-auto mb-3 text-[#09379A]" /><h1 className="text-xl font-bold">تفاصيل القبول غير متاحة</h1><p className="mt-2 text-sm leading-7 text-[#64748B]">لا يظهر خطاب القبول إلا بعد موافقة الإدارة وجهة التدريب على طلب تابع لحسابك.</p></section>
          : <><div className="mb-6"><h1 className="text-2xl font-bold text-[#102C61]">تم قبول طلب التدريب</h1><p className="mt-2 text-sm text-[#64748B]">اكتملت موافقة الإدارة وجهة التدريب على الطلب رقم {application.id}.</p></div>
          <section className="rounded-xl border border-[#E0E7F2] bg-white p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-800"><CheckCircle2 size={24}/><span className="font-bold">طلبك معتمد من الطرفين</span></div>
            <div className="grid gap-4 sm:grid-cols-2"><Info label="الجهة" value={application.organizationName}/><Info label="فرصة التدريب" value={application.opportunityTitle}/><Info label="التخصص" value={application.specialty}/><Info label="الساعات المطلوبة" value={application.requiredHours ? `${application.requiredHours} ساعة` : 'غير محددة'}/><Info label="تاريخ البداية" value={application.startDate}/><Info label="تاريخ النهاية المتوقع" value={application.endDate}/></div>
            <p className="mt-6 rounded-xl border border-[#D9E4F5] bg-[#F8FAFC] p-4 text-sm leading-7 text-[#475569]">هذه تفاصيل الموافقة التجريبية. خطاب التنسيب الرسمي والمستندات المعتمدة ستكون متاحة بعد ربط النظام بالـBackend واعتمادها من الكلية.</p>
            <button onClick={() => navigate('/student/training-profile')} className="mt-5 rounded-lg bg-[#09379A] px-6 py-3 text-sm font-bold text-white">الانتقال إلى ملف التدريب</button>
          </section></>}
<AcademicFooter audience="student" /></div>
        </main>
      </div>
    </div>;
}
