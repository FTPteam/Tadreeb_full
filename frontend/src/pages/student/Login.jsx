import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Star,
  UserRound,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [formData, setFormData] = useState({
    studentId: "20220845",
    password: "123456789012",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    navigate("/student/dashboard");
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
            RIGHT / LOGIN SIDE
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
            <form
              onSubmit={handleSubmit}
              className="
                w-full
                max-w-[420px]

                sm:max-w-[430px]

                lg:max-w-[440px]
              "
            >
              {/* WELCOME */}

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
                  مرحباً بك مجدداً
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
                  سجل دخولك إلى حسابك للاستمرار
                </p>
              </div>

              {/* STUDENT ID */}

              <div className="mt-[24px]">
                <label
                  htmlFor="studentId"
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
                  <span>رقم الطالب</span>

                  <span className="text-[#EB0909]">
                    *
                  </span>
                </label>

                <div className="relative mt-[9px]">
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    inputMode="numeric"
                    value={formData.studentId}
                    onChange={handleChange}
                    autoComplete="username"
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
                      text-[#09379A]
                    "
                  >
                    <UserRound
                      size={20}
                      strokeWidth={1.8}
                    />
                  </span>
                </div>
              </div>

              {/* PASSWORD */}

              <div className="mt-[20px]">
                <label
                  htmlFor="password"
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
                  <span>كلمة المرور</span>

                  <span className="text-[#EB0909]">
                    *
                  </span>
                </label>

                <div className="relative mt-[9px]">
                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="
                      h-[48px]
                      w-full
                      rounded-[6px]
                      border
                      border-[#E2E8F0]
                      bg-white
                      px-[45px]
                      text-right
                      text-[14px]
                      font-normal
                      text-[#1E293B]
                      outline-none
                      transition-all
                      duration-200

                      focus:border-[#09379A]
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
                    <LockKeyhole
                      size={20}
                      strokeWidth={1.8}
                    />
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "إخفاء كلمة المرور"
                        : "إظهار كلمة المرور"
                    }
                    className="
                      absolute
                      left-[10px]
                      top-1/2
                      flex
                      h-[36px]
                      w-[36px]
                      -translate-y-1/2
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-[7px]
                      border-0
                      bg-transparent
                      p-0
                      text-[#64748B]
                      transition-all
                      duration-200

                      hover:bg-[#F1F5F9]
                      hover:text-[#09379A]

                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#09379A]/20
                    "
                  >
                    {showPassword ? (
                      <EyeOff
                        size={20}
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Eye
                        size={20}
                        strokeWidth={1.8}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* REMEMBER / FORGOT */}

              <div
                className="
                  mt-[14px]
                  flex
                  min-h-[28px]
                  items-center
                  justify-between
                  gap-3
                "
              >
                <label
                  className="
                    flex
                    shrink-0
                    cursor-pointer
                    select-none
                    items-center
                    gap-[8px]
                    text-[13px]
                    text-[#1E293B]

                    xl:text-[14px]
                  "
                >
                  <CustomCheckbox
                    checked={rememberMe}
                    onChange={() =>
                      setRememberMe(
                        (prev) => !prev
                      )
                    }
                  />

                  <span>تذكرني</span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/forgot-password")
                  }
                  className="
                    border-0
                    bg-transparent
                    p-0
                    text-[13px]
                    text-[#09379A]
                    transition

                    hover:underline

                    xl:text-[14px]
                  "
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                dir="ltr"
                className="
                  mt-[20px]
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
                  تسجيل الدخول
                </span>
              </button>
            </form>
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
            <p
              className="
                m-0
                text-[10px]
                font-normal
                leading-[18px]
                text-[#94A3B8]

                sm:text-[11px]

                xl:text-[12px]
              "
            >
              © 2027 كلية الدراسات المتوسطة - جامعة الأزهر. جميع الحقوق محفوظة.
            </p>
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

/* =========================================================
   CHECKBOX
========================================================= */

function CustomCheckbox({
  checked,
  onChange,
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      aria-label="تذكرني"
      className={`
        flex
        h-[16px]
        w-[16px]
        shrink-0
        cursor-pointer
        items-center
        justify-center
        rounded-[3px]
        border
        p-0
        transition-all
        duration-200

        ${
          checked
            ? `
                border-[#09379A]
                bg-[#09379A]
                text-white
              `
            : `
                border-[#CBD5E1]
                bg-white
                text-transparent
              `
        }
      `}
    >
      <Check
        size={11}
        strokeWidth={2.3}
      />
    </button>
  );
}