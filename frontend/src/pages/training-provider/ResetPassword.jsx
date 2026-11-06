
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import AuthLayout from "./AuthLayout";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!password) {
      newErrors.password = "هذا الحقل مطلوب";
    } else if (password.length < 8) {
      newErrors.password = "يجب ألا تقل كلمة المرور عن 8 أحرف";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "يرجى تأكيد كلمة المرور";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // يلزم التحقق من token وحفظ كلمة المرور عبر الـ Backend.
    if (!token) {
      setErrors({
        general: "رابط إعادة التعيين غير صالح أو غير مكتمل.",
      });
      return;
    }

    // setErrors({
    //   general: "لم يتم ربط خدمة تغيير كلمة المرور بعد.",
    // });
    // محاكاة نجاح تغيير كلمة المرور لأغراض اختبار الواجهة فقط
    
    setErrors({});
    setSuccess(true);
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#15803D] text-white">
            <Check size={38} />
          </div>

          <h1 className="mt-7 text-[27px] font-bold text-[#111C2D] sm:text-[31px]">
            تم تغيير كلمة المرور
          </h1>

          <p className="mt-2 text-[14px] leading-7 text-[#64748B]">
            يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
          </p>

          <button
            type="button"
            onClick={() => navigate("/training-provider/login")}
            className="mt-7 h-[46px] w-full rounded-lg bg-[#09379A] font-semibold text-white hover:bg-[#072F86]"
          >
            تسجيل الدخول
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div>
        <h1 className="text-[27px] font-bold text-[#111C2D] sm:text-[31px]">
          كلمة مرور جديدة
        </h1>

        <p className="mt-2 text-[14px] leading-6 text-[#64748B]">
          اختر كلمة مرور قوية لا تقل عن 8 أحرف.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* NEW PASSWORD */}
          <PasswordField
            label="كلمة المرور الجديدة"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setErrors((prev) => ({
                ...prev,
                password: "",
                general: "",
              }));
            }}
            visible={showPassword}
            toggle={() => setShowPassword((v) => !v)}
            error={errors.password}
          />

          {/* CONFIRM PASSWORD */}
          <PasswordField
            label="تأكيد كلمة المرور"
            value={confirmPassword}
            onChange={(value) => {
              setConfirmPassword(value);
              setErrors((prev) => ({
                ...prev,
                confirmPassword: "",
                general: "",
              }));
            }}
            visible={showConfirm}
            toggle={() => setShowConfirm((v) => !v)}
            error={errors.confirmPassword}
          />

          {errors.general && (
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-[12px] leading-6 text-amber-700">
              <AlertCircle size={16} className="mt-1 shrink-0" />
              {errors.general}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 h-[45px] w-full rounded-lg bg-[#09379A] text-[14px] font-bold text-white hover:bg-[#072F86]"
          >
            حفظ كلمة المرور
          </button>

          <button
            type="button"
            onClick={() => navigate("/training-provider/login")}
            className="mt-4 h-[45px] w-full rounded-lg border border-[#E0E7F2] text-[14px] font-semibold hover:bg-[#F8FAFC]"
          >
            إلغاء
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  toggle,
  error,
}) {
  return (
    <div className="mt-6">
      <label className="text-[14px] font-bold text-[#111C2D]">
        {label}
        <span className="mr-1 text-red-600">*</span>
      </label>

      <div className="relative mt-3">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-[45px] w-full rounded-lg border bg-white px-[45px] text-right text-[14px] outline-none focus:border-[#09379A] ${
            error ? "border-red-500" : "border-[#CBD5E1]"
          }`}
        />

        <LockKeyhole
          size={19}
          className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#64748B]"
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-[#64748B] hover:bg-[#F1F5F9]"
          aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>

      {error && (
        <p className="mt-2 flex items-center gap-1 text-[12px] text-red-600">
          <AlertCircle size={13} />
          {error}
        </p>
      )}
    </div>
  );
}
