import AcademicFooter from "../../components/shared/AcademicFooter";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, GraduationCap, Printer, AlertCircle } from "lucide-react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import { getTrainingStudent } from "./trainingMonitoringStore";
import { getCertificate, issueDemoCertificate } from "./certificatesStore";

export default function TrainingCertificate() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const student = getTrainingStudent(studentId);
  const [certificate, setCertificate] = useState(() => getCertificate(studentId));
  const [error, setError] = useState("");
  const eligible = student?.status === "completed" && Boolean(student.completedAt);
  const detailsPath = `/admin/training-monitoring/${encodeURIComponent(studentId || "")}`;

  const issue = () => {
    try {
      const result = issueDemoCertificate(studentId);
      setCertificate(result);
      setError("");
    } catch (err) {
      setError(err.message || "تعذر تجهيز الشهادة التجريبية.");
    }
  };

  return (
    <div dir="rtl" className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]">
      <div className="print:hidden"><Sidebar /></div>
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden print:h-auto print:overflow-visible">
        <div className="print:hidden"><Header /></div>
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-8 print:overflow-visible print:p-0">
          <div className="mx-auto max-w-[1100px]">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
              <div>
                <h1 className="text-[26px] font-bold">شهادة إتمام التدريب</h1>
                <p className="mt-1 text-[12px] text-[#64748B]">معاينة تجريبية وليست شهادة رسمية</p>
              </div>
              <button type="button" onClick={() => navigate(detailsPath)} className="inline-flex h-[43px] items-center gap-2 rounded-lg border border-[#E0E7F2] bg-white px-4 text-[12px]">
                <ArrowRight size={16} /> رجوع لتفاصيل التدريب
              </button>
            </div>

            {!student || !eligible ? (
              <section className="rounded-xl border border-[#E0E7F2] bg-white p-10 text-center print:hidden">
                <AlertCircle className="mx-auto text-[#B54708]" size={32}/>
                <p className="mt-4 text-[14px] font-bold">لا يمكن تجهيز شهادة لهذا السجل</p>
                <p className="mt-2 text-[12px] text-[#64748B]">يشترط أن يكون تدريب الطالب منتهيًا ومعتمدًا.</p>
              </section>
            ) : (
              <>
                <div className="mb-5 flex flex-wrap gap-3 print:hidden">
                  <button type="button" onClick={issue} disabled={Boolean(certificate)} className="inline-flex h-[44px] items-center gap-2 rounded-lg bg-[#09379A] px-5 text-[12px] font-bold text-white disabled:cursor-default disabled:opacity-50">
                    <GraduationCap size={18} /> {certificate ? "تم تجهيز المعاينة" : "تجهيز شهادة تجريبية"}
                  </button>
                  {certificate && (
                    <button type="button" onClick={() => window.print()} className="inline-flex h-[44px] items-center gap-2 rounded-lg border border-[#E0E7F2] bg-white px-5 text-[12px] font-semibold">
                      <Printer size={18}/> طباعة / حفظ PDF
                    </button>
                  )}
                </div>
                {error && <div role="alert" className="mb-5 rounded-lg bg-[#FEF2F2] p-4 text-[12px] text-[#DC2626] print:hidden">{error}</div>}
                <section className="relative overflow-hidden rounded-[14px] border border-[#E0E7F2] bg-white p-7 text-center sm:p-12 print:border-0 print:shadow-none">
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[70px] font-black text-[#09379A]/[0.05] -rotate-12 sm:text-[110px]">نسخة تجريبية</div>
                  <div className="relative">
                    <p className="text-[14px] font-bold text-[#09379A]">كلية الدراسات المتوسطة - جامعة الأزهر - غزة</p>
                    <GraduationCap size={45} className="mx-auto my-6 text-[#09379A]"/>
                    <h2 className="mb-6 text-[28px] font-bold text-[#062569]">شهادة إتمام التدريب الميداني</h2>
                    <p className="text-[14px] leading-9">تشهد الكلية أن الطالب/ة</p>
                    <h3 className="my-4 text-[24px] font-bold text-[#111C2D]">{certificate?.studentName || student.name}</h3>
                    <p className="mx-auto max-w-[750px] text-[14px] leading-9">
                      قد أتمّ/ت متطلبات التدريب الميداني لدى <strong>{certificate?.organization || student.organization}</strong>
                      ، بإجمالي <strong>{certificate?.completedHours ?? student.completedHours} ساعة</strong>.
                    </p>
                    <div className="mt-8 grid grid-cols-1 gap-3 border-t border-[#E0E7F2] pt-6 text-right text-[12px] text-[#475569] sm:grid-cols-2">
                      <p>الرقم الجامعي: <strong>{student.id}</strong></p>
                      <p>التخصص: <strong>{certificate?.major || student.major}</strong></p>
                      <p>تاريخ إنهاء التدريب: <strong>{certificate?.completedAt || student.completedAt}</strong></p>
                      <p>رقم المعاينة: <strong dir="ltr">{certificate?.previewId || "غير مُنشأ"}</strong></p>
                    </div>
                    <p className="mt-7 text-[12px] font-bold text-[#B54708]">للعرض والتجربة فقط — غير صالحة كوثيقة رسمية أو للتحقق الخارجي</p>
                  </div>
                </section>
              </>
            )}
          </div>
        
            <AcademicFooter audience="admin" />
          </main>
      </div>
    </div>
  );
}
