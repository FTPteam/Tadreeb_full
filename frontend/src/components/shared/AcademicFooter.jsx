import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, Download, Headset, X } from "lucide-react";

// TODO (Backend/University): Replace with approved contacts and role-specific official guides.
const CONTACT = {
  email: "training@alzahar.edu.ps",
  phone: "08 282 0100",
  hours: "الأحد - الخميس، 8:00 ص - 3:00 م",
};

const ROLE_GUIDES = {
  student: {
    title: "دليل الطالب للتدريب الميداني",
    description: "يشرح الدليل خطوات التقديم لفرص التدريب، ومتابعة الطلبات، وتسجيل الحضور والسجلات، ومتطلبات إنهاء التدريب.",
  },
  admin: {
    title: "دليل المشرف الأكاديمي للتدريب الميداني",
    description: "يشرح الدليل آلية مراجعة الطلبات، ومتابعة الطلاب والجهات، وتقييم التدريب واعتماد إنهائه.",
  },
  provider: {
    title: "دليل الجهة للتدريب الميداني",
    description: "يشرح الدليل خطوات استقبال المتدربين ومتابعتهم وتقييمهم، ومواعيد التسليم المعتمدة لدى الكلية.",
  },
};

export default function AcademicFooter({ audience = "student", compact = false }) {
  const [active, setActive] = useState(null);
  const guide = ROLE_GUIDES[audience] || ROLE_GUIDES.student;

  useEffect(() => {
    if (!active) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active]);

  const dialog = active ? createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0F172A]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setActive(null);
      }}
    >
      <div
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="academic-footer-dialog-title"
        className="relative max-h-[calc(100dvh-32px)] w-full max-w-[520px] overflow-y-auto rounded-[14px] bg-white p-7 text-right font-['Cairo'] text-[#17233B] shadow-2xl sm:p-9"
      >
        <button
          type="button"
          aria-label="إغلاق النافذة"
          onClick={() => setActive(null)}
          className="absolute left-4 top-4 rounded-lg p-1.5 text-[#64748B] hover:bg-[#F1F5F9]"
        >
          <X size={18} />
        </button>
        <span className="mb-5 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#E7EDF8] text-[#09379A]">
          {active === "guide" ? <BookOpen size={27} strokeWidth={1.8} /> : <Headset size={27} strokeWidth={1.8} />}
        </span>

        {active === "guide" ? (
          <>
            <h2 id="academic-footer-dialog-title" className="text-[22px] font-bold">{guide.title}</h2>
            <p className="mt-3 text-[14px] leading-8 text-[#64748B]">{guide.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {/* TODO (University): Add the university-approved PDF to public/ and enable download. */}
              <button type="button" disabled title="ملف الدليل الرسمي غير مرفق بعد" className="flex h-[44px] cursor-not-allowed items-center gap-2 rounded-[8px] bg-[#09379A] px-5 text-[13px] font-semibold text-white opacity-60">
                <Download size={17} /> تحميل الدليل (PDF)
              </button>
              <button type="button" onClick={() => setActive(null)} className="h-[44px] rounded-[8px] border border-[#E0E7F2] px-5 text-[13px]">إغلاق</button>
            </div>
            <p className="mt-3 text-[11px] text-[#64748B]">سيُفعّل التحميل بعد إضافة الدليل الرسمي المعتمد.</p>
          </>
        ) : (
          <>
            <h2 id="academic-footer-dialog-title" className="text-[22px] font-bold">الدعم الفني والأكاديمي</h2>
            <p className="mt-3 text-[14px] leading-8 text-[#64748B]">لأي استفسار تواصل مع مكتب التدريب الميداني في الكلية.</p>
            <dl className="mt-5 space-y-4 text-[13px]">
              <div><dt className="text-[#64748B]">البريد الإلكتروني</dt><dd dir="ltr" className="mt-1 text-right font-semibold">{CONTACT.email}</dd></div>
              <div><dt className="text-[#64748B]">الهاتف</dt><dd dir="ltr" className="mt-1 text-right font-semibold">{CONTACT.phone}</dd></div>
              <div><dt className="text-[#64748B]">ساعات العمل</dt><dd className="mt-1 font-semibold">{CONTACT.hours}</dd></div>
            </dl>
            <div className="mt-7 flex justify-start">
              <button type="button" onClick={() => setActive(null)} className="h-[44px] rounded-[8px] border border-[#E0E7F2] px-5 text-[13px]">إغلاق</button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <footer dir="rtl" className={`${compact ? "my-2" : "mt-9 pb-3"} flex flex-wrap items-center justify-between gap-3 text-[11px] leading-5 text-[#64748B]`}>
        <span>جميع الحقوق محفوظة © {new Date().getFullYear()} كلية الدراسات المتوسطة - جامعة الأزهر - غزة</span>
        <div className="flex flex-wrap items-center gap-3 text-[#09379A]">
          <button type="button" onClick={() => setActive("guide")} className="hover:underline">{guide.title}</button>
          <span aria-hidden="true">•</span>
          <button type="button" onClick={() => setActive("support")} className="hover:underline">الدعم الفني والأكاديمي</button>
        </div>
      </footer>
      {dialog}
    </>
  );
}
