
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Building2,
  AlertCircle,
} from "lucide-react";

import AuthLayout from "./AuthLayout";
import { findProviderOrganizationByEmail, setActiveProviderOrganization } from "../../services/providerOrganization";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showSSO, setShowSSO] = useState(false);
  const [ssoNotice, setSsoNotice] = useState(false);
  const [errors, setErrors] = useState({});

  // TODO (Backend): إعادة تفعيل حالة خطأ تسجيل الدخول.
  // const [loginError, setLoginError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // TODO (Backend): إعادة تفعيل مسح خطأ المصادقة.
    // setLoginError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "هذا الحقل مطلوب";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }

    if (!formData.password.trim()) {
      newErrors.password = "هذا الحقل مطلوب";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    /*
     * TODO (Backend): تفعيل تسجيل الدخول الحقيقي.
     *
     * عند ربط الـ API:
     * 1. إرسال البريد وكلمة المرور لخدمة المصادقة.
     * 2. التحقق من بيانات الدخول ودور المستخدم.
     * 3. إنشاء جلسة مصادقة آمنة.
     * 4. التعامل مع أخطاء تسجيل الدخول.
     * 5. تفعيل خيار "تذكرني".
     * 6. الانتقال للداشبورد بعد نجاح المصادقة فقط.
     */

    // TEMP demo flow: credentials are not authenticated until the backend is connected.
    const organization = findProviderOrganizationByEmail(formData.email);
    if (organization) setActiveProviderOrganization(organization.id);
    else setActiveProviderOrganization("1"); // Keep the existing seeded demo account available.
    navigate("/training-provider/dashboard", { replace: true });
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} noValidate>
        <div className="text-right">
          <h1 className="m-0 text-[26px] font-semibold leading-[38px] text-[#111C2D] sm:text-[29px] xl:text-[32px]">
            مرحباً بك مجدداً
          </h1>

          <p className="m-0 mt-1 text-[14px] leading-[26px] text-[#64748B]">
            سجل دخولك إلى بوابة جهة التدريب للمتابعة
          </p>
        </div>

        {/* EMAIL */}
        <div className="mt-6">
          <FieldLabel>البريد الإلكتروني للجهة</FieldLabel>

          <div className="relative mt-[9px]">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.ps"
              autoComplete="username"
              className={inputClass(!!errors.email, "left")}
            />

            <Mail
              className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#64748B]"
              size={20}
            />
          </div>

          <ErrorMessage>{errors.email}</ErrorMessage>
        </div>

        {/* PASSWORD */}
        <div className="mt-5">
          <FieldLabel>كلمة المرور</FieldLabel>

          <div className="relative mt-[9px]">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="أدخل كلمة المرور"
              autoComplete="current-password"
              className={inputClass(!!errors.password, "right")}
            />

            <LockKeyhole
              className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#64748B]"
              size={20}
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword
                  ? "إخفاء كلمة المرور"
                  : "إظهار كلمة المرور"
              }
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-[#64748B] hover:bg-[#F1F5F9]"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          <ErrorMessage>{errors.password}</ErrorMessage>
        </div>

        {/* REMEMBER / FORGOT */}
        <div className="mt-[18px] flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-[13px]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 accent-[#09379A]"
            />
            تذكرني
          </label>

          <button
            type="button"
            onClick={() =>
              navigate("/training-provider/forgot-password")
            }
            className="text-[13px] text-[#09379A] hover:underline"
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        {/*
          TODO (Backend): إعادة تفعيل تنبيه فشل المصادقة.

          {loginError && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] leading-6 text-red-600">
              <AlertCircle
                size={17}
                className="mt-1 shrink-0"
              />
              {loginError}
            </div>
          )}
        */}

        {/* LOGIN */}
        <button
          type="submit"
          className="mt-5 flex h-[48px] w-full items-center justify-center gap-2 rounded-[9px] bg-[#09379A] text-[14px] font-bold text-white transition hover:bg-[#072F86]"
        >
          <ArrowLeft size={17} />
          تسجيل الدخول
        </button>

        {/* SSO */}
        <button
          type="button"
          onClick={() => {
            setShowSSO(true);
            setSsoNotice(false);
          }}
          className="mt-3 flex h-[46px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white text-[13px] font-semibold text-[#09379A] transition hover:bg-[#F8FAFC]"
        >
          <Building2 size={18} />
          الدخول عبر بريد الجهة
        </button>
        <p className="mt-5 text-center text-[12px] text-[#64748B]">
          جهة جديدة؟{" "}
          <button type="button" onClick={() => navigate("/training-provider/register")} className="font-bold text-[#09379A] hover:underline">
            سجّل جهة التدريب
          </button>
        </p>
      </form>

      {/* SSO MODAL */}
      {showSSO && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowSSO(false);
            }
          }}
        >
          <div className="w-full max-w-[520px] rounded-[14px] bg-white p-7 shadow-xl sm:p-9">
            <div className="mb-5 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#E6EBF5] text-[#09379A]">
              <Building2 size={27} />
            </div>

            <h2 className="text-[21px] font-bold text-[#111C2D]">
              الدخول عبر بريد الجهة
            </h2>

            <p className="mt-3 text-[14px] leading-7 text-[#64748B]">
              سيتم تحويلك إلى صفحة المصادقة الخاصة بمؤسستك، ثم
              العودة إلى البوابة. (محاكاة)
            </p>

            {ssoNotice && (
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-700">
                المصادقة الموحدة غير مربوطة بعد. يلزم إعداد خدمة
                SSO مع الجهة.
              </p>
            )}

            <div className="mt-7 flex flex-row-reverse gap-3">
              <button
                type="button"
                onClick={() => setShowSSO(false)}
                className="h-[44px] flex-1 rounded-lg border border-[#E0E7F2]"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={() => setSsoNotice(true)}
                className="flex h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#09379A] text-white"
              >
                متابعة <ArrowLeft size={17} />
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="flex items-center gap-1 text-[14px] font-bold text-[#111C2D]">
      {children}
      <span className="text-red-600">*</span>
    </label>
  );
}

function ErrorMessage({ children }) {
  if (!children) return null;

  return (
    <p className="mt-2 flex items-center gap-1 text-[12px] text-red-600">
      <AlertCircle size={13} />
      {children}
    </p>
  );
}

function inputClass(hasError, direction) {
  return `h-[44px] w-full rounded-[7px] border bg-white text-[14px] text-[#1E293B] outline-none transition focus:border-[#09379A] focus:ring-2 focus:ring-[#09379A]/10 ${
    direction === "left"
      ? "pl-[45px] pr-4 text-left"
      : "pl-[45px] pr-[45px] text-right"
  } ${
    hasError ? "border-red-500" : "border-[#CBD5E1]"
  }`;
}
