import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Menu,
  ChevronLeft,
  Save,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

export default function Settings() {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    newRequests: true,
    reports: true,
    emailNotifications: false,
    weeklySummary: true,
    language: "العربية (RTL)",
    timezone: "غزة (GMT+2)",
    semester: "الثاني 2024 / 2025",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "123456789",
    newPassword: "123456789",
    confirmPassword: "123456789",
  });

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-student-sidebar")
    );
  };

  const handleSettingChange = (name, value) => {
    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div
      dir="rtl"
      className="
        flex
        h-screen
        w-full
        overflow-hidden
        bg-[#F8FAFC]
        font-['Cairo']
        text-[#111C2D]
      "
    >
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div
        className="
          flex
          h-screen
          min-w-0
          flex-1
          flex-col
          overflow-hidden
        "
      >
        {/* =================================================
            HEADER
        ================================================== */}

        <AdminHeader />

        {/* =================================================
            CONTENT
        ================================================== */}

        <main
          className="
            w-full
            min-w-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            px-4
            pb-8
            pt-5
            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1450px]
            "
          >
            {/* =============================================
                BREADCRUMB
            ============================================== */}

            <div
              className="
                mb-5
                flex
                items-center
                gap-2
                text-[12px]
                text-[#64748B]
              "
            >
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/dashboard")
                }
                className="hover:text-[#09379A]"
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <span
                className="
                  font-semibold
                  text-[#111C2D]
                "
              >
                الإعدادات
              </span>
            </div>

            {/* =============================================
                TITLE + SAVE
            ============================================== */}

            <section
              className="
                mb-7
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-start
                sm:justify-between
              "
            >
              <div>
                <h1
                  className="
                    m-0
                    text-[26px]
                    font-bold
                    leading-9
                    text-[#111C2D]
                  "
                >
                  الإعدادات
                </h1>

                <p
                  className="
                    m-0
                    mt-1
                    text-[13px]
                    text-[#64748B]
                  "
                >
                  تفضيلات الحساب والإشعارات
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="
                  inline-flex
                  h-[44px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[8px]
                  bg-[#09379A]
                  px-5
                  text-[12px]
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#072F86]
                "
              >
                <Save size={16} />

                حفظ التغييرات
              </button>
            </section>

            {saved && (
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-2
                  rounded-[8px]
                  border
                  border-[#BBF7D0]
                  bg-[#F0FDF4]
                  px-4
                  py-3
                  text-[11px]
                  font-semibold
                  text-[#15803D]
                "
              >
                <CheckCircle2 size={17} />

                تم حفظ الإعدادات بنجاح.
              </div>
            )}

            {/* =============================================
                GRID
            ============================================== */}

            <div
              className="
                grid
                min-w-0
                grid-cols-1
                gap-6
                xl:grid-cols-[minmax(0,1.55fr)_435px]
              "
            >
              {/* ===========================================
                  RIGHT COLUMN
              ============================================ */}

              <div
                className="
                  flex
                  min-w-0
                  flex-col
                  gap-6
                "
              >
                {/* NOTIFICATIONS */}

                <section
                  className="
                    rounded-[12px]
                    border
                    border-[#E0E7F2]
                    bg-white
                    p-6
                  "
                >
                  <h2
                    className="
                      m-0
                      border-b
                      border-[#E6EBF5]
                      pb-4
                      text-[17px]
                      font-bold
                      text-[#062569]
                    "
                  >
                    الإشعارات
                  </h2>

                  <div>
                    <NotificationSetting
                      title="إشعارات الطلبات الجديدة"
                      description="تنبيه عند وصول طلب تدريب جديد"
                      checked={settings.newRequests}
                      onChange={() =>
                        handleSettingChange(
                          "newRequests",
                          !settings.newRequests
                        )
                      }
                    />

                    <NotificationSetting
                      title="إشعارات التقارير"
                      description="تنبيه عند إرسال تقرير للمراجعة"
                      checked={settings.reports}
                      onChange={() =>
                        handleSettingChange(
                          "reports",
                          !settings.reports
                        )
                      }
                    />

                    <NotificationSetting
                      title="إشعارات البريد الإلكتروني"
                      description="نسخة من الإشعارات على بريدك الجامعي"
                      checked={
                        settings.emailNotifications
                      }
                      onChange={() =>
                        handleSettingChange(
                          "emailNotifications",
                          !settings.emailNotifications
                        )
                      }
                    />

                    <NotificationSetting
                      title="ملخص أسبوعي"
                      description="ملخص نشاط الطلاب كل أسبوع"
                      checked={settings.weeklySummary}
                      onChange={() =>
                        handleSettingChange(
                          "weeklySummary",
                          !settings.weeklySummary
                        )
                      }
                      last
                    />
                  </div>
                </section>

                {/* PASSWORD */}

                <section
                  className="
                    rounded-[12px]
                    border
                    border-[#E0E7F2]
                    bg-white
                    p-6
                  "
                >
                  <h2
                    className="
                      m-0
                      border-b
                      border-[#E6EBF5]
                      pb-4
                      text-[17px]
                      font-bold
                      text-[#062569]
                    "
                  >
                    تغيير كلمة المرور
                  </h2>

                  <div className="mt-4">
                    <PasswordField
                      label="كلمة المرور الحالية"
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                    />

                    <div
                      className="
                        mt-5
                        grid
                        grid-cols-1
                        gap-5
                        md:grid-cols-2
                      "
                    >
                      <PasswordField
                        label="كلمة المرور الجديدة"
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                      />

                      <PasswordField
                        label="تأكيد كلمة المرور"
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* ===========================================
                  GENERAL SETTINGS
              ============================================ */}

              <section
                className="
                  h-fit
                  rounded-[12px]
                  border
                  border-[#E0E7F2]
                  bg-white
                  p-6
                "
              >
                <h2
                  className="
                    m-0
                    border-b
                    border-[#E6EBF5]
                    pb-4
                    text-[17px]
                    font-bold
                    text-[#062569]
                  "
                >
                  التفضيلات العامة
                </h2>

                <div className="mt-4 space-y-5">
                  <SelectField
                    label="اللغة"
                    value={settings.language}
                    onChange={(value) =>
                      handleSettingChange(
                        "language",
                        value
                      )
                    }
                    options={[
                      "العربية (RTL)",
                      "English (LTR)",
                    ]}
                  />

                  <SelectField
                    label="المنطقة الزمنية"
                    value={settings.timezone}
                    onChange={(value) =>
                      handleSettingChange(
                        "timezone",
                        value
                      )
                    }
                    options={[
                      "غزة (GMT+2)",
                      "القدس (GMT+2)",
                      "UTC",
                    ]}
                  />

                  <SelectField
                    label="الفصل الدراسي"
                    value={settings.semester}
                    onChange={(value) =>
                      handleSettingChange(
                        "semester",
                        value
                      )
                    }
                    options={[
                      "الثاني 2024 / 2025",
                      "الأول 2024 / 2025",
                      "الصيفي 2024 / 2025",
                    ]}
                  />
                </div>
              </section>
            </div>

            {/* =============================================
                FOOTER
            ============================================== */}

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   NOTIFICATION SETTING
========================================================= */

function NotificationSetting({
  title,
  description,
  checked,
  onChange,
  last = false,
}) {
  return (
    <div
      className={`
        flex
        min-h-[78px]
        items-center
        justify-between
        gap-5
        py-4

        ${
          !last
            ? "border-b border-[#E6EBF5]"
            : ""
        }
      `}
    >
      <div className="min-w-0">
        <h3
          className="
            m-0
            text-[12px]
            font-bold
            text-[#111C2D]
          "
        >
          {title}
        </h3>

        <p
          className="
            m-0
            mt-[2px]
            text-[12px]
            leading-5
            text-[#64748B]
          "
        >
          {description}
        </p>
      </div>

      <Toggle
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

function Toggle({
  checked,
  onChange,
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={`
        relative
        h-[25px]
        w-[44px]
        shrink-0
        rounded-full
        transition-colors
        duration-200

        ${
          checked
            ? "bg-[#0B47B7]"
            : "bg-[#C9D6E6]"
        }
      `}
    >
      <span
        className={`
          absolute
          top-[3px]
          h-[19px]
          w-[19px]
          rounded-full
          bg-white
          shadow-sm
          transition-all
          duration-200

          ${
            checked
              ? "left-[3px]"
              : "left-[22px]"
          }
        `}
      />
    </button>
  );
}

/* =========================================================
   SELECT FIELD
========================================================= */

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <label className="block">
      <span
        className="
          mb-2
          block
          text-[11px]
          font-medium
          text-[#334155]
        "
      >
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          h-[47px]
          w-full
          cursor-pointer
          rounded-[8px]
          border
          border-[#E0E7F2]
          bg-white
          px-4
          text-[12px]
          text-[#1E293B]
          outline-none
          transition
          focus:border-[#09379A]
          focus:ring-2
          focus:ring-[#09379A]/10
        "
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

/* =========================================================
   PASSWORD FIELD
========================================================= */

function PasswordField({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <label className="block">
      <span
        className="
          mb-2
          block
          text-[11px]
          font-medium
          text-[#334155]
        "
      >
        {label}
      </span>

      <div className="relative">
        <LockKeyhole
          size={17}
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-[#334155]
          "
        />

        <input
          type="password"
          name={name}
          value={value}
          onChange={onChange}
          className="
            h-[47px]
            w-full
            rounded-[8px]
            border
            border-[#E0E7F2]
            bg-white
            pr-10
            pl-3
            text-[12px]
            text-[#111C2D]
            outline-none
            transition
            focus:border-[#09379A]
            focus:ring-2
            focus:ring-[#09379A]/10
          "
        />
      </div>
    </label>
  );
}