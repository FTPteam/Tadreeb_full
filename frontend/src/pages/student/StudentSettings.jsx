import AcademicFooter from "../../components/shared/AcademicFooter";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  ChevronLeft,
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  ClipboardCheck,
  CalendarCheck,
  Mail,
  SlidersHorizontal,
  Languages,
  Info,
} from "lucide-react";

import Sidebar from "../../components/student/Sidebar";
import Header from "../../components/student/Header";

// =====================================================
// INITIAL SETTINGS
// =====================================================

const INITIAL_NOTIFICATIONS = {
  applicationUpdates: true,
  weeklyReports: true,
  trainingReminders: true,
  announcements: false,
};

const INITIAL_PREFERENCES = {
  language: "ar",
};

// =====================================================
// MAIN PAGE
// =====================================================

export default function StudentSettings() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(
    INITIAL_NOTIFICATIONS
  );

  const [preferences, setPreferences] = useState(
    INITIAL_PREFERENCES
  );

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPassword: false,
    confirm: false,
  });

  const [notificationMessage, setNotificationMessage] =
    useState("");

  const [preferenceMessage, setPreferenceMessage] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] = useState("");

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const toggleNotification = (key) => {
    setNotifications((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));

    setNotificationMessage("");
  };

  const saveNotifications = () => {
    // TODO BACKEND:
    // PATCH /api/student/settings/notifications
    // Body: notifications
    // Show successful save only after the API confirms it.

    setNotificationMessage(
      "التعديلات جاهزة للحفظ عند ربط خدمة الإعدادات."
    );
  };

  // =====================================================
  // PREFERENCES
  // =====================================================

  const savePreferences = () => {
    // TODO BACKEND:
    // PATCH /api/student/settings/preferences
    // Body: preferences

    setPreferenceMessage(
      "تم تجهيز التفضيلات، وسيتم حفظها عند ربط الـ Backend."
    );
  };

  // =====================================================
  // PASSWORD CHANGE
  // =====================================================

  const updatePasswordField = (key, value) => {
    setPasswords((previous) => ({
      ...previous,
      [key]: value,
    }));

    setPasswordError("");
    setPasswordMessage("");
  };

  const togglePasswordVisibility = (key) => {
    setShowPasswords((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const changePassword = (event) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordMessage("");

    if (
      !passwords.current ||
      !passwords.newPassword ||
      !passwords.confirm
    ) {
      setPasswordError(
        "يرجى تعبئة جميع حقول كلمة المرور."
      );
      return;
    }

    if (passwords.newPassword.length < 8) {
      setPasswordError(
        "يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل."
      );
      return;
    }

    if (passwords.newPassword !== passwords.confirm) {
      setPasswordError(
        "كلمة المرور الجديدة وتأكيدها غير متطابقتين."
      );
      return;
    }

    if (passwords.current === passwords.newPassword) {
      setPasswordError(
        "يجب اختيار كلمة مرور مختلفة عن الحالية."
      );
      return;
    }

    // TODO BACKEND:
    // POST /api/student/change-password
    //
    // Verify current password on the server.
    // Never store passwords in localStorage.
    // Clear fields only after a successful API response.

    setPasswordMessage(
      "البيانات مستوفية للشروط، وتغيير كلمة المرور سيتفعّل بعد ربط الـ Backend."
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]"
    >
      {/* SHARED STUDENT SIDEBAR */}
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">

        {/* SHARED STUDENT HEADER */}
        <Header />

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1450px]">

            {/* BREADCRUMB */}
            <nav className="mb-7 flex items-center gap-2 text-[13px] text-[#475569]">
              <button
                type="button"
                onClick={() =>
                  navigate("/student/dashboard")
                }
                className="hover:text-[#09379A]"
              >
                الرئيسية
              </button>

              <ChevronLeft size={16} />

              <span className="font-bold text-[#111C2D]">
                الإعدادات
              </span>
            </nav>

            {/* PAGE TITLE */}
            <section className="mb-6">
              <h1 className="m-0 text-[28px] font-bold leading-10 text-[#111C2D]">
                الإعدادات
              </h1>

              <p className="m-0 mt-2 text-[14px] leading-7 text-[#475569]">
                إدارة تفضيلات الحساب والإشعارات والأمان
              </p>
            </section>

            {/* SETTINGS GRID */}
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_390px]">

              {/* RIGHT COLUMN */}
              <div className="min-w-0 space-y-6">

                {/* NOTIFICATIONS */}
                <Section
                  title="إعدادات الإشعارات"
                  subtitle="اختر التنبيهات التي ترغب في استلامها داخل البوابة"
                  icon={Bell}
                >
                  <div className="divide-y divide-[#E6EBF5]">
                    <SettingToggle
                      icon={ClipboardCheck}
                      title="تحديثات طلب التدريب"
                      description="تنبيه عند قبول أو رفض طلب التدريب أو تحديث حالته"
                      checked={
                        notifications.applicationUpdates
                      }
                      onChange={() =>
                        toggleNotification(
                          "applicationUpdates"
                        )
                      }
                    />

                    <SettingToggle
                      icon={FileText}
                      title="التقارير الأسبوعية"
                      description="التذكير بتسليم التقارير وظهور ملاحظات المشرف"
                      checked={
                        notifications.weeklyReports
                      }
                      onChange={() =>
                        toggleNotification("weeklyReports")
                      }
                    />

                    <SettingToggle
                      icon={CalendarCheck}
                      title="مواعيد التدريب"
                      description="التنبيه بالمواعيد المهمة والمتطلبات القادمة"
                      checked={
                        notifications.trainingReminders
                      }
                      onChange={() =>
                        toggleNotification(
                          "trainingReminders"
                        )
                      }
                    />

                    <SettingToggle
                      icon={Mail}
                      title="الإعلانات العامة"
                      description="استلام إشعارات الإعلانات والأخبار الجديدة"
                      checked={notifications.announcements}
                      onChange={() =>
                        toggleNotification("announcements")
                      }
                    />
                  </div>

                  {notificationMessage && (
                    <InfoMessage>
                      {notificationMessage}
                    </InfoMessage>
                  )}

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={saveNotifications}
                      className="inline-flex h-[45px] items-center justify-center gap-2 rounded-[8px] bg-[#09379A] px-5 text-[14px] font-semibold text-white transition hover:bg-[#072E81]"
                    >
                      <Save size={18} />
                      حفظ الإشعارات
                    </button>
                  </div>
                </Section>

                {/* SECURITY */}
                <Section
                  title="الأمان وكلمة المرور"
                  subtitle="تحديث كلمة المرور الخاصة بحسابك"
                  icon={ShieldCheck}
                >
                  <form
                    onSubmit={changePassword}
                    className="space-y-4"
                  >
                    <PasswordInput
                      id="current-password"
                      label="كلمة المرور الحالية"
                      placeholder="أدخل كلمة المرور الحالية"
                      value={passwords.current}
                      visible={showPasswords.current}
                      onChange={(value) =>
                        updatePasswordField(
                          "current",
                          value
                        )
                      }
                      onToggle={() =>
                        togglePasswordVisibility("current")
                      }
                      autoComplete="current-password"
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <PasswordInput
                        id="new-password"
                        label="كلمة المرور الجديدة"
                        placeholder="8 أحرف على الأقل"
                        value={passwords.newPassword}
                        visible={showPasswords.newPassword}
                        onChange={(value) =>
                          updatePasswordField(
                            "newPassword",
                            value
                          )
                        }
                        onToggle={() =>
                          togglePasswordVisibility(
                            "newPassword"
                          )
                        }
                        autoComplete="new-password"
                      />

                      <PasswordInput
                        id="confirm-password"
                        label="تأكيد كلمة المرور"
                        placeholder="أعد إدخال كلمة المرور"
                        value={passwords.confirm}
                        visible={showPasswords.confirm}
                        onChange={(value) =>
                          updatePasswordField(
                            "confirm",
                            value
                          )
                        }
                        onToggle={() =>
                          togglePasswordVisibility("confirm")
                        }
                        autoComplete="new-password"
                      />
                    </div>

                    {/* SECURITY ADVICE */}
                    <div className="flex items-start gap-2 rounded-[8px] bg-[#F8FAFC] p-3 text-[13px] leading-7 text-[#475569]">
                      <Info
                        size={18}
                        className="mt-1 shrink-0 text-[#09379A]"
                      />

                      <span>
                        استخدم كلمة مرور قوية ومختلفة عن كلمات
                        المرور التي تستخدمها في حساباتك الأخرى.
                      </span>
                    </div>

                    {/* PASSWORD ERROR */}
                    {passwordError && (
                      <div
                        role="alert"
                        className="flex items-start gap-2 rounded-lg bg-[#FEF2F2] px-4 py-3 text-[13px] leading-6 text-[#DC2626]"
                      >
                        <AlertCircle
                          size={18}
                          className="mt-1 shrink-0"
                        />
                        {passwordError}
                      </div>
                    )}

                    {/* PASSWORD MESSAGE */}
                    {passwordMessage && (
                      <InfoMessage>
                        {passwordMessage}
                      </InfoMessage>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex h-[45px] items-center justify-center gap-2 rounded-[8px] bg-[#09379A] px-5 text-[14px] font-semibold text-white transition hover:bg-[#072E81]"
                      >
                        <LockKeyhole size={18} />
                        تحديث كلمة المرور
                      </button>
                    </div>
                  </form>
                </Section>
              </div>

              {/* LEFT COLUMN */}
              <div className="min-w-0 space-y-6">

                {/* PREFERENCES */}
                <Section
                  title="تفضيلات الاستخدام"
                  subtitle="إعدادات عرض البوابة"
                  icon={SlidersHorizontal}
                >
                  <div>
                    <label
                      htmlFor="language"
                      className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-[#111C2D]"
                    >
                      <Languages
                        size={18}
                        className="text-[#09379A]"
                      />

                      لغة الواجهة
                    </label>

                    <select
                      id="language"
                      value={preferences.language}
                      onChange={(event) => {
                        setPreferences((previous) => ({
                          ...previous,
                          language: event.target.value,
                        }));

                        setPreferenceMessage("");
                      }}
                      className="h-[46px] w-full rounded-[8px] border border-[#E0E7F2] bg-white px-3 text-[14px] font-medium text-[#111C2D] outline-none focus:border-[#09379A]"
                    >
                      <option value="ar">العربية</option>
                    </select>

                    <p className="m-0 mt-2 text-[13px] leading-6 text-[#475569]">
                      العربية هي اللغة المتاحة حاليًا.
                    </p>
                  </div>

                  {preferenceMessage && (
                    <InfoMessage>
                      {preferenceMessage}
                    </InfoMessage>
                  )}

                  <button
                    type="button"
                    onClick={savePreferences}
                    className="mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#09379A] bg-white px-5 text-[14px] font-semibold text-[#09379A] transition hover:bg-[#EEF4FF]"
                  >
                    <Save size={18} />
                    حفظ التفضيلات
                  </button>
                </Section>

                {/* ACCOUNT SECURITY */}
                <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[9px] bg-[#E8EEF9] text-[#09379A]">
                      <ShieldCheck size={22} />
                    </span>

                    <div>
                      <h2 className="m-0 text-[18px] font-bold text-[#062569]">
                        حماية حسابك
                      </h2>

                      <p className="m-0 mt-1 text-[13px] leading-6 text-[#475569]">
                        نصائح للحفاظ على أمان بياناتك
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Tip text="لا تشارك كلمة المرور مع أي شخص." />
                    <Tip text="استخدم كلمة مرور مختلفة عن حساباتك الأخرى." />
                    <Tip text="سجّل الخروج عند استخدام جهاز مشترك." />
                  </div>
                </section>
              </div>
            </div>

            <AcademicFooter audience="student" />
          </div>
        </main>
      </div>
    </div>
  );
}

// =====================================================
// SECTION COMPONENT
// =====================================================

function Section({
  title,
  subtitle,
  icon: Icon,
  children,
}) {
  return (
    <section className="min-w-0 rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3 border-b border-[#E6EBF5] pb-4">
        <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[8px] bg-[#E8EEF9] text-[#09379A]">
          <Icon size={21} />
        </span>

        <div className="min-w-0">
          <h2 className="m-0 text-[19px] font-bold leading-8 text-[#062569]">
            {title}
          </h2>

          <p className="m-0 mt-1 text-[13px] leading-6 text-[#475569]">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

// =====================================================
// NOTIFICATION TOGGLE
// =====================================================

function SettingToggle({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-[#09379A]">
          <Icon size={19} />
        </span>

        <div className="min-w-0">
          <p className="m-0 text-[15px] font-bold leading-6 text-[#111C2D]">
            {title}
          </p>

          <p className="m-0 mt-1 text-[13px] leading-6 text-[#475569]">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={onChange}
        className={`relative h-[27px] w-[48px] shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#09379A]/20 ${
          checked
            ? "bg-[#09379A]"
            : "bg-[#CBD5E1]"
        }`}
      >
        <span
          className={`absolute top-[3px] h-[21px] w-[21px] rounded-full bg-white shadow-sm transition-all ${
            checked
              ? "right-[3px]"
              : "right-[24px]"
          }`}
        />
      </button>
    </div>
  );
}

// =====================================================
// PASSWORD INPUT
// =====================================================

function PasswordInput({
  id,
  label,
  placeholder,
  value,
  visible,
  onChange,
  onToggle,
  autoComplete,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[14px] font-semibold text-[#111C2D]"
      >
        {label}
      </label>

      <div className="relative">
        <LockKeyhole
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]"
        />

        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="h-[46px] w-full rounded-[8px] border border-[#E0E7F2] bg-white pl-11 pr-10 text-[14px] font-medium text-[#111C2D] outline-none placeholder:font-normal placeholder:text-[#64748B] focus:border-[#09379A] focus:ring-2 focus:ring-[#09379A]/10"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            visible
              ? "إخفاء كلمة المرور"
              : "إظهار كلمة المرور"
          }
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#09379A]"
        >
          {visible ? (
            <EyeOff size={19} />
          ) : (
            <Eye size={19} />
          )}
        </button>
      </div>
    </div>
  );
}

// =====================================================
// INFO MESSAGE
// =====================================================

function InfoMessage({ children }) {
  return (
    <div
      role="status"
      className="mt-4 flex items-start gap-2 rounded-[8px] border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-3 text-[13px] leading-6 text-[#09379A]"
    >
      <CheckCircle2
        size={18}
        className="mt-1 shrink-0"
      />

      <span>{children}</span>
    </div>
  );
}

// =====================================================
// SECURITY TIP
// =====================================================

function Tip({ text }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2
        size={18}
        className="mt-1 shrink-0 text-[#15803D]"
      />

      <p className="m-0 text-[13px] leading-7 text-[#475569]">
        {text}
      </p>
    </div>
  );
}

// =====================================================
// FOOTER
// =====================================================


