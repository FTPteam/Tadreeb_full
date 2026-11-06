import AcademicFooter from "../../components/shared/AcademicFooter";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Star,
} from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    password: "123456789012",
    confirmPassword: "123456789012",
  });

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const passwordChecks = useMemo(() => {
    return {
      length: form.password.length >= 8,
      number: /\d/.test(form.password),
    };
  }, [form.password]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.password || !form.confirmPassword) {
      setError("يرجى إدخال كلمة المرور وتأكيدها.");
      return;
    }

    if (!passwordChecks.length) {
      setError("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.");
      return;
    }

    if (!passwordChecks.number) {
      setError("يجب أن تحتوي كلمة المرور على رقم واحد على الأقل.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    setError("");
    setSaved(true);
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
            LEFT / BRAND SIDE
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
          {/* MAIN BRAND */}

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

          {/* FEATURES */}

          <div className="px-[54px] pb-[20px]">
            <div
              className="
                h-full
                border-t
                border-white/15
                pt-[20px]
              "
            >
              <div className="grid grid-cols-3 gap-4">
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
            RIGHT / RESET PASSWORD
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
          {/* MOBILE BRAND */}

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

                sm:text-[24px]
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
                text-[#64748B]

                sm:text-[15px]
              "
            >
              كلية الدراسات المتوسطة - الأزهر
            </p>
          </div>

          {/* FORM AREA */}

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
            {!saved ? (
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
                    إعادة تعيين كلمة المرور
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
                    اختر كلمة مرور جديدة قوية لحسابك
                  </p>
                </div>

                {/* NEW PASSWORD */}

                <div className="mt-[24px]">
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
                    <span>كلمة المرور الجديدة</span>
                    <span className="text-[#EB0909]">*</span>
                  </label>

                  <div className="relative mt-[9px]">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      className="
                        h-[48px]
                        w-full

                        rounded-[6px]

                        border
                        border-[#09379A]

                        bg-white

                        px-[45px]

                        text-right
                        text-[14px]
                        font-normal
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
                      <LockKeyhole
                        size={20}
                        strokeWidth={1.8}
                      />
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
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

                        items-center
                        justify-center

                        rounded-[7px]

                        border-0

                        bg-transparent

                        p-0

                        text-[#64748B]

                        hover:bg-[#F1F5F9]
                        hover:text-[#09379A]
                      "
                    >
                      {showPassword ? (
                        <EyeOff size={20} strokeWidth={1.8} />
                      ) : (
                        <Eye size={20} strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}

                <div className="mt-[20px]">
                  <label
                    htmlFor="confirmPassword"
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
                    <span>تأكيد كلمة المرور</span>
                    <span className="text-[#EB0909]">*</span>
                  </label>

                  <div className="relative mt-[9px]">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={form.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
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
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showConfirmPassword
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

                        items-center
                        justify-center

                        rounded-[7px]

                        border-0

                        bg-transparent

                        p-0

                        text-[#64748B]

                        hover:bg-[#F1F5F9]
                        hover:text-[#09379A]
                      "
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} strokeWidth={1.8} />
                      ) : (
                        <Eye size={20} strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                </div>

                {/* PASSWORD REQUIREMENTS */}

                <div className="mt-[18px] space-y-[7px]">
                  <PasswordRequirement
                    valid={passwordChecks.length}
                    text="8 أحرف على الأقل"
                  />

                  <PasswordRequirement
                    valid={passwordChecks.number}
                    text="تحتوي على رقم"
                  />
                </div>

                {/* ERROR */}

                {error && (
                  <p
                    className="
                      m-0
                      mt-[12px]

                      rounded-[7px]

                      bg-[#FEF2F2]

                      px-3
                      py-2

                      text-[11px]
                      font-medium
                      text-[#DC2626]
                    "
                  >
                    {error}
                  </p>
                )}

                {/* SAVE */}

                <button
                  type="submit"
                  dir="ltr"
                  className="
                    mt-[26px]

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
                    حفظ كلمة المرور
                  </span>
                </button>
              </form>
            ) : (
              /* SUCCESS */

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
                    h-[60px]
                    w-[60px]

                    items-center
                    justify-center

                    rounded-full

                    bg-[#DCFCE7]

                    text-[#15803D]
                  "
                >
                  <CheckCircle2
                    size={30}
                    strokeWidth={1.8}
                  />
                </div>

                <h1
                  className="
                    m-0
                    mt-5

                    text-[27px]
                    font-semibold
                    text-black
                  "
                >
                  تم تغيير كلمة المرور
                </h1>

                <p
                  className="
                    m-0
                    mt-2

                    text-[14px]
                    leading-6
                    text-[#A1A1A1]
                  "
                >
                  تم حفظ كلمة المرور الجديدة بنجاح، يمكنك الآن تسجيل الدخول.
                </p>

                <button
                  type="button"
                  dir="ltr"
                  onClick={() => navigate("/")}
                  className="
                    mt-[24px]

                    flex
                    h-[48px]
                    w-full

                    items-center
                    justify-center
                    gap-[8px]

                    rounded-[10px]

                    bg-[#09379A]

                    text-[14px]
                    font-bold
                    text-white

                    hover:bg-[#072F86]
                  "
                >
                  <ArrowLeft size={16} />

                  <span dir="rtl">
                    الانتقال إلى تسجيل الدخول
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* FOOTER */}

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
   PASSWORD REQUIREMENT
========================================================= */

function PasswordRequirement({
  valid,
  text,
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-[7px]

        text-[11px]
        font-medium

        ${
          valid
            ? "text-[#15803D]"
            : "text-[#94A3B8]"
        }
      `}
    >
      <CheckCircle2
        size={14}
        strokeWidth={1.8}
      />

      <span>{text}</span>
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