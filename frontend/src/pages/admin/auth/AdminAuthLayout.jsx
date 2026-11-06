import AcademicFooter from "../../../components/shared/AcademicFooter";

import {
  CheckCircle2,
  BriefcaseBusiness,
  ShieldCheck,
} from "lucide-react";

const features = [
  { Icon: CheckCircle2, text: "متابعة طلبات التدريب" },
  { Icon: BriefcaseBusiness, text: "إدارة الجهات والفرص" },
  { Icon: ShieldCheck, text: "إشراف أكاديمي متكامل" },
];

export default function AdminAuthLayout({ children }) {
  return (
    <div
      dir="ltr"
      className="fixed inset-0 z-0 w-full overflow-hidden bg-white font-['Cairo'] text-[#1E293B]"
    >
      <div className="grid h-full min-h-0 w-full grid-cols-1 overflow-hidden lg:grid-cols-2">

        {/* القسم الأزرق */}
        <section
          dir="rtl"
          className="relative hidden h-full min-h-0 overflow-hidden bg-[#09379A] text-white lg:flex lg:flex-col"
        >
          {/* الشعار والعنوان */}
          <div className="flex min-h-0 flex-1 items-center justify-center px-8 pb-10">
            <div className="flex flex-col items-center text-center">
              <img
                src="/logo.svg"
                alt="شعار بوابة التدريب الميداني"
                className="h-[120px] w-[120px] object-contain"
              />

              <h2 className="mt-[18px] text-[28px] font-bold xl:text-[32px]">
                بوابة التدريب الميداني
              </h2>

              <p className="mt-[5px] text-[17px] font-medium xl:text-[20px]">
                كلية الدراسات المتوسطة - الأزهر
              </p>

              <p className="mt-[7px] text-[14px] text-white/90 xl:text-[16px]">
                «معاً نحو مستقبل مهني أفضل»
              </p>
            </div>
          </div>

          {/* المميزات أسفل القسم */}
          <div className="shrink-0 px-8 pb-5 xl:px-[54px]">
            <div className="border-t border-white/15 pt-5">
              <div className="grid grid-cols-3 gap-4">
                {features.map(({ Icon, text }) => (
                  <div
                    key={text}
                    className="flex min-w-0 flex-col items-center gap-2 text-center"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <Icon size={24} />
                    </div>

                    <span className="text-[10px] font-medium leading-4 text-white/95 xl:text-[12px]">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* القسم الأبيض */}
        <section
          dir="rtl"
          className="flex h-full min-h-0 flex-col overflow-hidden bg-white"
        >
          {/* شعار الجوال */}
          <div className="flex shrink-0 flex-col items-center px-4 pt-6 text-center lg:hidden">
            <img
              src="/logo-colored.svg"
              alt="شعار بوابة التدريب الميداني"
              className="h-[100px] w-[100px] object-contain"
            />

            <h2 className="mt-2 text-[21px] font-bold text-[#09379A]">
              بوابة التدريب الميداني
            </h2>

            <p className="mt-1 text-[13px] text-[#64748B]">
              كلية الدراسات المتوسطة - الأزهر
            </p>
          </div>

          {/* نموذج تسجيل الدخول */}
          <main className="flex min-h-0 flex-1 items-start justify-center overflow-x-hidden overflow-y-auto overscroll-contain px-5 pb-8 pt-8 sm:px-6 lg:items-center lg:px-10 lg:py-5 xl:px-[80px]">
            <div className="w-full max-w-[440px] shrink-0">
              {children}
            </div>
          </main>

          {/* الفوتر */}
          <div className="shrink-0 px-5 pb-3"><AcademicFooter audience="admin" compact /></div>
        </section>
      </div>
    </div>
  );
}
