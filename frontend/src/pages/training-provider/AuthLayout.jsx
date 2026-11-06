import AcademicFooter from "../../components/shared/AcademicFooter";

import {
  CheckCircle2,
  BriefcaseBusiness,
  Star,
} from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div
      dir="ltr"
      className="min-h-dvh w-full bg-white font-['Cairo'] text-[#1E293B]"
    >
      <div className="min-h-dvh w-full lg:grid lg:h-dvh lg:min-h-0 lg:grid-cols-2 lg:overflow-hidden">

        {/* BRAND SIDE */}
        <section
          dir="rtl"
          className="hidden bg-[#09379A] text-white lg:grid lg:h-dvh lg:grid-rows-[minmax(0,1fr)_130px] lg:overflow-hidden"
        >
          <div className="flex min-h-0 items-center justify-center px-8">
            <div className="flex -translate-y-[42px] flex-col items-center text-center">
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
                "معاً نحو مستقبل مهني أفضل"
              </p>
            </div>
          </div>

          <div className="px-[54px] pb-[20px]">
            <div className="border-t border-white/15 pt-[20px]">
              <div className="grid grid-cols-3 gap-4">
                <Feature
                  icon={<CheckCircle2 size={24} />}
                  text="متابعة مستمرة للمتدربين"
                />
                <Feature
                  icon={<BriefcaseBusiness size={24} />}
                  text="فرص تدريبية متنوعة"
                />
                <Feature
                  icon={<Star size={24} />}
                  text="تجربة تدريبية متميزة"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT SIDE */}
        <section
          dir="rtl"
          className="flex min-h-dvh flex-col overflow-y-auto bg-white lg:h-dvh lg:min-h-0 lg:overflow-hidden"
        >
          {/* MOBILE BRAND */}
          <div className="flex flex-col items-center px-4 pt-6 text-center lg:hidden">
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

          {/* PAGE CONTENT */}
          <main className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto px-5 pb-8 pt-8 sm:px-6 sm:pt-10 lg:items-center lg:px-10 lg:py-6 xl:px-[80px]">
            <div className="w-full max-w-[440px]">
              {children}
            </div>
          </main>

          {/* FOOTER */}
          <div className="shrink-0 px-5 pb-3"><AcademicFooter audience="provider" compact /></div>
        </section>
      </div>
    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-white/10 text-white">
        {icon}
      </div>
      <p className="m-0 text-[10px] font-medium leading-[15px] text-white/95 xl:text-[12px] xl:whitespace-nowrap">
        {text}
      </p>
    </div>
  );
}
