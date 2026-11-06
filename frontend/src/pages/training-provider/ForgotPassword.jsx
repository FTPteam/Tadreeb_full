
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import AuthLayout from "./AuthLayout";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("هذا الحقل مطلوب");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    setError("");

    // محاكاة الإرسال لحين ربط خدمة البريد بالـ Backend.
    setSent(true);
  };

  return (
    <AuthLayout>
      {!sent ? (
        <>
          <div className="text-right">
            <h1 className="text-[27px] font-bold leading-[40px] text-[#111C2D] sm:text-[31px]">
              نسيت كلمة المرور؟
            </h1>

            <p className="mt-1 text-[14px] leading-6 text-[#64748B]">
              أدخل بريد الجهة وسنرسل لك رابطاً لإعادة التعيين.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mt-7">
              <label className="text-[14px] font-bold">
                البريد الإلكتروني للجهة
                <span className="mr-1 text-red-600">*</span>
              </label>

              <div className="relative mt-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className={`h-[45px] w-full rounded-[7px] border bg-white pl-[45px] pr-4 text-left text-[14px] outline-none focus:border-[#09379A] ${
                    error ? "border-red-500" : "border-[#CBD5E1]"
                  }`}
                />

                <Mail
                  size={19}
                  className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#64748B]"
                />
              </div>

              {error && (
                <p className="mt-2 flex items-center gap-1 text-[12px] text-red-600">
                  <AlertCircle size={14} />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="mt-6 h-[45px] w-full rounded-[8px] bg-[#09379A] text-[14px] font-bold text-white transition hover:bg-[#072F86]"
            >
              إرسال الرابط
            </button>

            <button
              type="button"
              onClick={() => navigate("/training-provider/login")}
              className="mt-4 flex h-[45px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#E0E7F2] text-[14px] font-semibold hover:bg-[#F8FAFC]"
            >
              العودة لتسجيل الدخول
              <ArrowLeft size={17} />
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
            <CheckCircle2 size={37} />
          </div>

          <h1 className="mt-7 text-[27px] font-bold text-[#111C2D] sm:text-[31px]">
            تحقق من بريدك
          </h1>

          <p className="mt-2 text-[14px] leading-7 text-[#64748B]">
            إذا كان البريد مسجلاً لدينا، فسيتم إرسال رابط إعادة التعيين إليه.
          </p>

          <p className="mt-3 break-all font-semibold text-[#09379A]" dir="ltr">
            {email}
          </p>

          <div className="mt-7 rounded-lg bg-[#F1F5F9] p-3 text-[12px] leading-6 text-[#64748B]">
            هذه حالة تجريبية. لن يصل بريد فعلي قبل ربط خدمة إرسال البريد.
          </div>

          <button
            type="button"
            onClick={() => {
              // إعادة الإرسال الفعلية ستتم عبر الـ Backend.
              setError("إعادة الإرسال غير مفعّلة قبل ربط خدمة البريد.");
            }}
            className="mt-6 flex h-[45px] w-full items-center justify-center gap-2 rounded-lg border border-[#E0E7F2] text-[13px] font-semibold text-[#09379A] hover:bg-[#F8FAFC]"
          >
            <RefreshCw size={16} />
            إعادة إرسال الرابط
          </button>

          {error && (
            <p className="mt-2 text-[12px] text-amber-700">{error}</p>
          )}

          <button
            type="button"
            onClick={() => navigate("/training-provider/login")}
            className="mt-5 text-[14px] font-semibold text-[#09379A] hover:underline"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
