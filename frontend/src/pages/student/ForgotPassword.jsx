import AcademicFooter from "../../components/shared/AcademicFooter";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  Star,
} from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("samer@alazhar.edu.ps");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("يرجى إدخال البريد الإلكتروني.");
      return;
    }

    if (!email.includes("@")) {
      setError("يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }

    setError("");
    setSubmitted(true);
  };

  return (
    <div
      dir="ltr"
      className="
        min-h-dvh
        w-full
        bg-[#F8FAFC]
        font-['Cairo']
        text-[#1E293B]
      "
    >
      <div
        className="
          min-h-dvh
          w-full

          lg:grid
          lg:h-dvh
          lg:min-h-0
          lg:grid-cols-2
          lg:overflow-hidden
        "
      >
        {/* =====================================================
            LEFT / BRAND SIDE - DESKTOP
        ====================================================== */}

        <section
          dir="rtl"
          className="
            hidden
            bg-[#09379A]
            text-white

            lg:grid
            lg:h-dvh
            lg:grid-rows-[minmax(0,1fr)_130px]
            lg:overflow-hidden
          "
        >
          {/* MAIN BRAND AREA */}

          <div
            className="
              flex
              min-h-0
              items-center
              justify-center
              px-8
            "
          >
            <div
              className="
                flex
                flex-col
                items-center
                text-center

                lg:-translate-y-[42px]
                xl:-translate-y-[48px]
              "
            >
              <img
                src="/logo.svg"
                alt="شعار بوابة التدريب الميداني"
                className="
                  block
                  h-[120px]
                  w-[120px]
                  shrink-0
                  object-contain
                "
              />

              <h2
                className="
                  mb-0
                  mt-[18px]
                  whitespace-nowrap
                  text-[28px]
                  font-bold
                  leading-[1.35]
                  text-white

                  xl:text-[32px]
                "
              >
                بوابة التدريب الميداني
              </h2>

              <p
                className="
                  mb-0
                  mt-[5px]
                  whitespace-nowrap
                  text-[17px]
                  font-medium
                  leading-[1.7]
                  text-white/95

                  xl:text-[20px]
                "
              >
                كلية الدراسات المتوسطة - الأزهر
              </p>

              <p
                className="
                  mb-0
                  mt-[7px]
                  text-[14px]
                  font-normal
                  leading-[24px]
                  text-white/90

                  xl:text-[16px]
                "
              >
                “معاً نحو مستقبل مهني أفضل”
              </p>
            </div>
          </div>

          {/* FEATURES AREA */}

          <div
            className="
              px-[54px]
              pb-[20px]
            "
          >
            <div
              className="
                h-full
                border-t
                border-white/15
                pt-[20px]
              "
            >
              <div
                className="
                  grid
                  grid-cols-3
                  gap-4
                "
              >
                <Feature
                  icon={
                    <CheckCircle2
                      size={24}
                      strokeWidth={1.8}
                    />
                  }
                  text="متابعة مستمرة لحالة طلبك"
                />

                <Feature
                  icon={
                    <BriefcaseBusiness
                      size={24}
                      strokeWidth={1.8}
                    />
                  }
                  text="فرص تدريبية متنوعة"
                />

                <Feature
                  icon={
                    <Star
                      size={24}
                      strokeWidth={1.8}
                    />
                  }
                  text="تجربة تدريبية متميزة"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT / FORGOT PASSWORD SIDE
        ====================================================== */}

        <section
          dir="rtl"
          className="
            min-h-dvh
            overflow-x-hidden
            overflow-y-auto
            bg-[#F8FAFC]

            lg:grid
            lg:h-dvh
            lg:min-h-0
            lg:grid-rows-[minmax(0,1fr)_130px]
            lg:overflow-hidden
          "
        >
          {/* =====================================================
              MOBILE / TABLET BRAND
          ====================================================== */}

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              px-4
              pt-6
              text-center

              sm:pt-8

              lg:hidden
            "
          >
            <img
              src="/logo-colored.svg"
              alt="شعار بوابة التدريب الميداني"
              className="
                h-[110px]
                w-[110px]
                shrink-0
                object-contain

                sm:h-[125px]
                sm:w-[125px]
              "
            />

            <h2
              className="
                m-0
                mt-[10px]
                text-[21px]
                font-bold
                leading-[30px]
                text-[#09379A]

                sm:mt-[12px]
                sm:text-[24px]
                sm:leading-[34px]
              "
            >
              بوابة التدريب الميداني
            </h2>

            <p
              className="
                m-0
                mt-[2px]
                text-[13px]
                font-medium
                leading-[22px]
                text-[#64748B]

                sm:text-[15px]
                sm:leading-[25px]
              "
            >
              كلية الدراسات المتوسطة - الأزهر
            </p>
          </div>

          {/* =====================================================
              MAIN FORM AREA
          ====================================================== */}

          <div
            className="
              flex
              min-h-0
              items-start
              justify-center

              px-5
              pb-10
              pt-8

              sm:px-6
              sm:pt-10

              md:px-8

              lg:items-center
              lg:justify-end
              lg:px-10
              lg:py-0

              xl:px-[80px]
            "
          >
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="
                  w-full
                  max-w-[420px]

                  sm:max-w-[430px]

                  lg:max-w-[440px]
                "
              >
                {/* TITLE */}

                <div className="text-right">
                  <h1
                    className="
                      m-0
                      text-[26px]
                      font-semibold
                      leading-[38px]
                      text-black

                      sm:text-[29px]

                      lg:text-[30px]

                      xl:text-[32px]
                    "
                  >
                    نسيت كلمة المرور؟
                  </h1>

                  <p
                    className="
                      m-0
                      mt-[4px]
                      text-[14px]
                      font-normal
                      leading-[26px]
                      text-[#A1A1A1]

                      lg:text-[15px]

                      xl:text-[16px]
                    "
                  >
                    أدخل بريدك الجامعي وسنرسل لك رابط إعادة التعيين
                  </p>
                </div>

                {/* EMAIL */}

                <div className="mt-[24px]">
                  <label
                    htmlFor="email"
                    className="
                      flex
                      items-center
                      gap-[3px]
                      text-[14px]
                      font-bold
                      text-black

                      sm:text-[15px]

                      xl:text-[16px]
                    "
                  >
                    <span>البريد الإلكتروني</span>
                    <span className="text-[#EB0909]">*</span>
                  </label>

                  <div className="relative mt-[9px]">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      autoComplete="email"
                      className="
                        h-[48px]
                        w-full
                        rounded-[6px]
                        border
                        border-[#09379A]
                        bg-white
                        pl-[17px]
                        pr-[45px]
                        text-right
                        text-[14px]
                        font-medium
                        text-[#1E293B]
                        outline-none
                        transition-all
                        duration-200

                        focus:ring-[3px]
                        focus:ring-[#09379A]/10
                      "
                    />

                    <span
                      className="
                        pointer-events-none
                        absolute
                        right-[14px]
                        top-1/2
                        flex
                        -translate-y-1/2
                        items-center
                        justify-center
                        text-[#64748B]
                      "
                    >
                      <Mail
                        size={20}
                        strokeWidth={1.8}
                      />
                    </span>
                  </div>
                </div>

                {/* ERROR */}

                {error && (
                  <p
                    className="
                      m-0
                      mt-[8px]
                      text-[12px]
                      font-medium
                      text-[#DC2626]
                    "
                  >
                    {error}
                  </p>
                )}

                {/* SEND BUTTON */}

                <button
                  type="submit"
                  dir="ltr"
                  className="
                    mt-[24px]
                    flex
                    h-[48px]
                    w-full
                    cursor-pointer
                    items-center
                    justify-center
                    gap-[8px]
                    rounded-[10px]
                    border-0
                    bg-[#09379A]
                    text-[14px]
                    font-bold
                    text-white
                    shadow-[0_1px_2px_rgba(0,0,0,0.08)]
                    transition-all
                    duration-200

                    hover:bg-[#072F86]
                    hover:shadow-[0_5px_15px_rgba(9,55,154,0.16)]

                    active:scale-[0.995]

                    focus-visible:outline-none
                    focus-visible:ring-4
                    focus-visible:ring-[#09379A]/15
                  "
                >
                  <ArrowLeft
                    size={16}
                    strokeWidth={2}
                  />

                  <span dir="rtl">
                    إرسال رابط إعادة التعيين
                  </span>
                </button>

                {/* BACK TO LOGIN */}

                <button
                  type="button"
                  dir="ltr"
                  onClick={() => navigate("/")}
                  className="
                    mt-[24px]
                    flex
                    h-[48px]
                    w-full
                    cursor-pointer
                    items-center
                    justify-center
                    gap-[8px]
                    rounded-[10px]
                    border
                    border-[#09379A]
                    bg-transparent
                    text-[14px]
                    font-medium
                    text-[#09379A]
                    transition-all
                    duration-200

                    hover:bg-[#09379A]/5

                    active:scale-[0.995]

                    focus-visible:outline-none
                    focus-visible:ring-4
                    focus-visible:ring-[#09379A]/10
                  "
                >
                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                  />

                  <span dir="rtl">
                    العودة إلى تسجيل الدخول
                  </span>
                </button>
              </form>
            ) : (
              /* =================================================
                  SUCCESS STATE
              ================================================== */

              <div
                className="
                  w-full
                  max-w-[420px]

                  text-right

                  sm:max-w-[430px]

                  lg:max-w-[440px]
                "
              >
                <div
                  className="
                    flex
                    h-[58px]
                    w-[58px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#DCFCE7]
                    text-[#15803D]
                  "
                >
                  <CheckCircle2
                    size={29}
                    strokeWidth={1.8}
                  />
                </div>

                <h1
                  className="
                    m-0
                    mt-[20px]
                    text-[26px]
                    font-semibold
                    leading-[38px]
                    text-black

                    sm:text-[29px]

                    lg:text-[30px]

                    xl:text-[32px]
                  "
                >
                  تحقق من بريدك
                </h1>

                <p
                  className="
                    m-0
                    mt-[4px]
                    text-[14px]
                    font-normal
                    leading-[26px]
                    text-[#A1A1A1]

                    lg:text-[15px]

                    xl:text-[16px]
                  "
                >
                  تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الجامعي
                </p>

                <div
                  dir="ltr"
                  className="
                    mt-[20px]
                    rounded-[8px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    px-4
                    py-3
                    text-center
                    text-[14px]
                    font-medium
                    text-[#1E293B]
                  "
                >
                  {email}
                </div>

                <button
                  type="button"
                  dir="ltr"
                  onClick={() => navigate("/")}
                  className="
                    mt-[24px]
                    flex
                    h-[48px]
                    w-full
                    cursor-pointer
                    items-center
                    justify-center
                    gap-[8px]
                    rounded-[10px]
                    border-0
                    bg-[#09379A]
                    text-[14px]
                    font-bold
                    text-white
                    shadow-[0_1px_2px_rgba(0,0,0,0.08)]
                    transition-all
                    duration-200

                    hover:bg-[#072F86]

                    active:scale-[0.995]
                  "
                >
                  <ArrowLeft
                    size={16}
                    strokeWidth={2}
                  />

                  <span dir="rtl">
                    العودة إلى تسجيل الدخول
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* =====================================================
              COPYRIGHT AREA
          ====================================================== */}

          <div
            className="
              flex
              items-center
              justify-center
              px-5
              pb-6
              text-center

              sm:px-6

              md:px-8

              lg:px-10
              lg:pb-0

              xl:px-[80px]
            "
          >
            <AcademicFooter audience="student" compact />
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   FEATURE
========================================================= */

function Feature({ icon, text }) {
  return (
    <div
      className="
        flex
        min-w-0
        flex-col
        items-center
        gap-[8px]
        text-center
      "
    >
      <div
        className="
          flex
          h-[44px]
          w-[44px]
          shrink-0
          items-center
          justify-center
          rounded-[12px]
          bg-white/10
          text-white
        "
      >
        {icon}
      </div>

      <p
        className="
          m-0
          text-[10px]
          font-medium
          leading-[15px]
          text-white/95

          xl:text-[12px]
          xl:whitespace-nowrap
        "
      >
        {text}
      </p>
    </div>
  );
}