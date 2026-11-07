import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowRight, Download, FileCheck2 } from 'lucide-react';
import Header from '../../components/student/Header';
import Sidebar from '../../components/student/Sidebar';
import AcademicFooter from '../../components/shared/AcademicFooter';
import { useApi } from '../../api/useApi';
import { downloadCertificate, fetchCurrentTraining, fetchMyCertificate } from '../../api/student';

export default function Certificate(){
  const navigate=useNavigate();
  const training=useApi(fetchCurrentTraining,[]).data;
  const certificate=useApi(fetchMyCertificate,[]).data;
  const [error,setError]=useState('');
  const download=()=>downloadCertificate(certificate).catch(e=>setError(e.message));
  return <div dir="rtl" className="flex h-dvh overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
    <Sidebar/><div className="flex min-w-0 flex-1 flex-col overflow-hidden"><Header/>
      <main dir="rtl" className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1050px]">
        <button onClick={()=>navigate('/student/dashboard')} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#09379A]"><ArrowRight size={17}/>الرئيسية</button>
        <h1 className="mb-2 text-2xl font-bold text-[#102C61]">شهادة التدريب الميداني</h1>
        <p className="mb-6 text-sm text-[#64748B]">حالة الشهادة وخطوات إصدارها الرسمي.</p>
        <section className="rounded-2xl border border-[#E0E7F2] bg-white p-6 sm:p-10">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDF3FF] text-[#09379A]"><Award size={28}/></div>
          {certificate ? <>
            <h2 className="mb-3 text-xl font-bold text-[#102C61]">{certificate.is_valid ? 'شهادتك جاهزة' : 'تم إلغاء الشهادة'}</h2>
            <div className="mt-4 grid gap-3 rounded-xl bg-[#F8FAFC] p-4 text-sm sm:grid-cols-2">
              <span>رقم الشهادة: <b dir="ltr">{certificate.serial_number}</b></span>
              <span>جهة التدريب: <b>{certificate.provider_name}</b></span>
              <span>فترة التدريب: <b>{certificate.start_date} → {certificate.end_date}</b></span>
              <span>الساعات: <b>{certificate.total_hours}</b></span>
            </div>
            {certificate.is_valid && <button onClick={download} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#09379A] px-5 py-3 text-sm font-bold text-white"><Download size={17}/>تنزيل الشهادة PDF</button>}
            {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
          </> : <>
            <h2 className="mb-3 text-xl font-bold text-[#102C61]">الشهادة غير متاحة بعد</h2>
            <p className="max-w-[680px] text-sm leading-8 text-[#64748B]">تصدر الشهادة تلقائيًا بعد إكمال الساعات المطلوبة واكتمال التقييمات واعتماد الإدارة لإنهاء التدريب.</p>
            {training&&<div className="mt-6 flex flex-wrap gap-3 rounded-xl bg-[#F8FAFC] p-4 text-sm"><span>التدريب: <b>{training.opportunity||'—'}</b></span><span>الساعات المؤكدة: <b>{Number(training.completedHours)||0} / {Number(training.requiredHours)||0}</b></span></div>}
            <div className="mt-6 flex flex-wrap gap-3"><button onClick={()=>navigate('/student/training-profile')} className="inline-flex items-center gap-2 rounded-lg bg-[#09379A] px-5 py-3 text-sm font-bold text-white"><FileCheck2 size={17}/>ملف التدريب</button><button onClick={()=>navigate('/student/finish-training')} className="rounded-lg border border-[#E0E7F2] px-5 py-3 text-sm font-semibold">متطلبات الإنهاء</button></div>
          </>}
        </section><AcademicFooter audience="student"/></div></main>
    </div></div>;
}
