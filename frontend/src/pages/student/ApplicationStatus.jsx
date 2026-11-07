import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import Header from '../../components/student/Header';
import Sidebar from '../../components/student/Sidebar';
import AcademicFooter from '../../components/shared/AcademicFooter';
import { subscribeApplications } from '../training-provider/providerApplicationsStore';
import { getMyApplication } from './studentApplicationView';

const decisionLabel = value => value === 'approved' || value === 'accepted' ? 'موافق' : value === 'rejected' ? 'مرفوض' : 'بانتظار المراجعة';
function Info({label,value}) {return <div className="rounded-lg bg-[#F8FAFC] p-4"><p className="mb-2 text-xs text-[#64748B]">{label}</p><p className="text-sm font-bold text-[#17233B]">{value || '—'}</p></div>}
export default function ApplicationStatus() {
  const navigate = useNavigate(); const {id} = useParams();
  const [application,setApplication] = useState(() => getMyApplication(id));
  useEffect(() => {
    const refresh = () => setApplication(getMyApplication(id));
    const unsubscribe = subscribeApplications(refresh);
    window.addEventListener('admin-training-requests-updated',refresh);
    window.addEventListener('storage',refresh);
    return () => {unsubscribe();window.removeEventListener('admin-training-requests-updated',refresh);window.removeEventListener('storage',refresh)};
  },[id]);
  return <div dir="rtl" className="flex h-dvh overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden"><Header />
        <main dir="rtl" className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1100px]"><button type="button" onClick={() => navigate('/student/applications')} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#09379A]"><ArrowRight size={17} /> العودة إلى طلباتي</button>
          {!application ? <section className="rounded-xl border border-[#E0E7F2] bg-white p-8 text-center"><FileText className="mx-auto mb-3 text-[#09379A]" size={32} /><h1 className="text-xl font-bold">الطلب غير موجود</h1><p className="mt-2 text-sm text-[#64748B]">لا يوجد طلب بهذا الرقم مرتبط بحسابك الحالي.</p></section>
          : <><div className="mb-6"><h1 className="text-2xl font-bold text-[#102C61]">حالة طلب التدريب</h1><p className="mt-2 text-sm text-[#64748B]">رقم الطلب: {application.id}</p></div>
            <section className="rounded-xl border border-[#E0E7F2] bg-white p-5 sm:p-7">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold">{application.opportunityTitle}</h2><span className={`rounded-full px-4 py-2 text-xs font-bold ${application.overallStatus === 'accepted' ? 'bg-emerald-50 text-emerald-700' : application.overallStatus === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{application.overallStatus === 'accepted' ? 'مقبول' : application.overallStatus === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}</span></div>
              <div className="grid gap-4 sm:grid-cols-2"><Info label="جهة التدريب" value={application.organizationName} /><Info label="التخصص" value={application.specialty} /><Info label="تاريخ التقديم" value={application.date} /><Info label="الساعات المطلوبة" value={application.requiredHours ? `${application.requiredHours} ساعة` : 'غير محددة'} /><Info label="موافقة الإدارة" value={decisionLabel(application.academicDecision)} /><Info label="موافقة جهة التدريب" value={decisionLabel(application.status)} /></div>
              <div role="status" className="mt-6 rounded-xl border border-[#DBE3F1] bg-[#F4F7FC] p-4 text-sm leading-7">{application.note}</div>
              {application.overallStatus === 'accepted' && <button type="button" className="mt-5 rounded-lg bg-[#09379A] px-6 py-3 text-sm font-bold text-white" onClick={() => navigate(`/student/applications/${encodeURIComponent(application.id)}/accepted`)}>تفاصيل القبول</button>}
            </section></>}
<AcademicFooter audience="student" /></div>
        </main>
      </div>
    </div>;
}
