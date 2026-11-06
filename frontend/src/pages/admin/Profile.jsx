import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Menu,
  ChevronLeft,
  Camera,
  Mail,
  Phone,
  LockKeyhole,
  Pencil,
  CheckCircle2,
  X,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: "د. سامر يوسف",
    email: "samer@alazhar.edu.ps",
    phone: "0599123456",
    password: "12345678",
  });

  const [draft, setDraft] = useState(form);

  /* =========================================================
     MOBILE SIDEBAR
  ========================================================= */

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-student-sidebar")
    );
  };

  /* =========================================================
     IMAGE
  ========================================================= */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setProfileImage(imageUrl);
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const startEditing = () => {
    setDraft(form);
    setSaved(false);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(form);
    setIsEditing(false);
  };

  const saveChanges = () => {
    setForm(draft);
    setIsEditing(false);
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
            CONTENT - ONLY THIS AREA SCROLLS
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
                mb-3

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
                className="
                  hover:text-[#09379A]
                "
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
                الملف الشخصي
              </span>
            </div>

            {/* =============================================
                PAGE TITLE
            ============================================== */}

            <section className="mb-8">
              <h1
                className="
                  m-0

                  text-[25px]
                  font-bold
                  leading-9

                  text-[#111C2D]

                  sm:text-[28px]
                "
              >
                الملف الشخصي
              </h1>

              <p
                className="
                  m-0
                  mt-1

                  text-[13px]
                  text-[#64748B]
                "
              >
                بيانات المشرف وحسابه
              </p>
            </section>

            {/* SUCCESS */}

            {saved && (
              <div
                className="
                  mb-5

                  flex
                  items-center
                  gap-2

                  rounded-[9px]

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

                تم حفظ التعديلات بنجاح.
              </div>
            )}

            {/* =============================================
                PROFILE GRID
            ============================================== */}

            <div
              className="
                grid
                min-w-0
                grid-cols-1
                gap-5

                xl:grid-cols-[minmax(0,1.65fr)_400px]
              "
            >
              {/* ===========================================
                  PROFILE CARD
              ============================================ */}

              <section
                className="
                  min-h-[520px]

                  rounded-[12px]

                  border
                  border-[#E0E7F2]

                  bg-white

                  px-5
                  py-7

                  sm:px-7
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    items-center

                    text-center
                  "
                >
                  {/* IMAGE */}

                  <div
                    className="
                      flex
                      h-[96px]
                      w-[96px]

                      items-center
                      justify-center

                      overflow-hidden

                      rounded-full

                      bg-[#E9EFFC]

                      text-[32px]
                      font-bold
                      text-[#09379A]
                    "
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="الصورة الشخصية"
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    ) : (
                      "سم"
                    )}
                  </div>

                  <h2
                    className="
                      m-0
                      mt-4

                      text-[17px]
                      font-bold

                      text-[#111C2D]
                    "
                  >
                    {form.name}
                  </h2>

                  <span
                    className="
                      mt-2

                      inline-flex

                      rounded-full

                      bg-[#E8EEFF]

                      px-3
                      py-1

                      text-[10px]
                      font-semibold

                      text-[#315AC7]
                    "
                  >
                    مشرف أكاديمي
                  </span>

                  {/* IMAGE BUTTON */}

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="
                      mt-4

                      inline-flex
                      h-[42px]
                      items-center
                      justify-center
                      gap-2

                      rounded-[8px]

                      border
                      border-[#E0E7F2]

                      bg-white

                      px-4

                      text-[11px]
                      font-semibold

                      hover:border-[#09379A]
                      hover:text-[#09379A]
                    "
                  >
                    <Camera size={16} />

                    تغيير الصورة
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </section>

              {/* ===========================================
                  RIGHT CARDS
              ============================================ */}

              <div
                className="
                  flex
                  min-w-0
                  flex-col
                  gap-5
                "
              >
                {/* BASIC INFORMATION */}

                <section
                  className="
                    rounded-[12px]

                    border
                    border-[#E0E7F2]

                    bg-white

                    p-5
                  "
                >
                  <h2
                    className="
                      m-0

                      border-b
                      border-[#E6EBF5]

                      pb-4

                      text-[16px]
                      font-bold
                      text-[#062569]
                    "
                  >
                    المعلومات الأساسية
                  </h2>

                  <div
                    className="
                      mt-4

                      grid
                      grid-cols-1
                      gap-x-5
                      gap-y-5

                      sm:grid-cols-2
                      xl:grid-cols-1
                      2xl:grid-cols-2
                    "
                  >
                    <InformationItem
                      label="الاسم"
                      value={form.name}
                    />

                    <InformationItem
                      label="القسم"
                      value="قسم الحاسوب وتكنولوجيا المعلومات"
                    />

                    <InformationItem
                      label="التخصص"
                      value="هندسة البرمجيات"
                    />

                    <InformationItem
                      label="عدد الطلاب"
                      value="312 طالبًا"
                    />
                  </div>
                </section>

                {/* ACCOUNT */}

                <section
                  className="
                    rounded-[12px]

                    border
                    border-[#E0E7F2]

                    bg-white

                    p-5
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between

                      border-b
                      border-[#E6EBF5]

                      pb-4
                    "
                  >
                    <h2
                      className="
                        m-0

                        text-[16px]
                        font-bold
                        text-[#062569]
                      "
                    >
                      بيانات الحساب
                    </h2>

                    {!isEditing && (
                      <button
                        type="button"
                        onClick={startEditing}
                        className="
                          flex
                          h-[32px]
                          items-center
                          gap-1

                          rounded-[7px]

                          px-2

                          text-[10px]
                          font-semibold
                          text-[#09379A]

                          hover:bg-[#EEF4FF]
                        "
                      >
                        <Pencil size={13} />

                        تعديل
                      </button>
                    )}
                  </div>

                  <div className="mt-4 space-y-4">
                    <AccountField
                      label="البريد الإلكتروني"
                      icon={Mail}
                      type="email"
                      value={
                        isEditing
                          ? draft.email
                          : form.email
                      }
                      disabled={!isEditing}
                      onChange={(value) =>
                        setDraft((previous) => ({
                          ...previous,
                          email: value,
                        }))
                      }
                    />

                    <AccountField
                      label="رقم الهاتف"
                      icon={Phone}
                      value={
                        isEditing
                          ? draft.phone
                          : form.phone
                      }
                      disabled={!isEditing}
                      onChange={(value) =>
                        setDraft((previous) => ({
                          ...previous,
                          phone: value,
                        }))
                      }
                    />

                    <AccountField
                      label="كلمة المرور"
                      icon={LockKeyhole}
                      type="password"
                      value={
                        isEditing
                          ? draft.password
                          : form.password
                      }
                      disabled={!isEditing}
                      onChange={(value) =>
                        setDraft((previous) => ({
                          ...previous,
                          password: value,
                        }))
                      }
                    />
                  </div>

                  {/* ACTIONS */}

                  {isEditing && (
                    <div
                      className="
                        mt-5

                        flex
                        flex-col-reverse
                        gap-2

                        sm:flex-row
                      "
                    >
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="
                          flex
                          h-[42px]
                          items-center
                          justify-center
                          gap-2

                          rounded-[8px]

                          border
                          border-[#E0E7F2]

                          bg-white

                          px-4

                          text-[11px]
                          font-semibold

                          hover:bg-[#F8FAFC]
                        "
                      >
                        <X size={15} />

                        إلغاء
                      </button>

                      <button
                        type="button"
                        onClick={saveChanges}
                        className="
                          flex
                          h-[42px]
                          items-center
                          justify-center
                          gap-2

                          rounded-[8px]

                          bg-[#09379A]

                          px-5

                          text-[11px]
                          font-semibold
                          text-white

                          hover:bg-[#072E81]
                        "
                      >
                        <CheckCircle2 size={15} />

                        حفظ التعديلات
                      </button>
                    </div>
                  )}

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={startEditing}
                      className="
                        mt-5

                        inline-flex
                        h-[42px]
                        items-center
                        justify-center
                        gap-2

                        rounded-[8px]

                        bg-[#09379A]

                        px-5

                        text-[11px]
                        font-semibold
                        text-white

                        hover:bg-[#072E81]
                      "
                    >
                      <Pencil size={15} />

                      تعديل البيانات
                    </button>
                  )}
                </section>
              </div>
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
   INFORMATION ITEM
========================================================= */

function InformationItem({
  label,
  value,
}) {
  return (
    <div className="min-w-0">
      <p
        className="
          m-0

          text-[11px]
          text-[#64748B]
        "
      >
        {label}
      </p>

      <p
        className="
          m-0
          mt-1

          break-words

          text-[12px]
          font-semibold
          leading-6

          text-[#111C2D]
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   ACCOUNT FIELD
========================================================= */

function AccountField({
  label,
  icon: Icon,
  value,
  onChange,
  disabled,
  type = "text",
}) {
  return (
    <label className="block">
      <span
        className="
          mb-2
          block

          text-[11px]
          font-semibold

          text-[#334155]
        "
      >
        {label}
      </span>

      <div className="relative">
        <Icon
          size={17}
          className="
            pointer-events-none

            absolute
            right-3
            top-1/2

            -translate-y-1/2

            text-[#475569]
          "
        />

        <input
          type={type}
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onChange?.(event.target.value)
          }
          className={`
            h-[46px]
            w-full

            rounded-[8px]

            border
            border-[#E0E7F2]

            pr-10
            pl-3

            text-[12px]

            outline-none

            transition

            ${
              disabled
                ? `
                    cursor-default

                    bg-[#F8FAFC]

                    text-[#111C2D]
                  `
                : `
                    bg-white

                    focus:border-[#09379A]

                    focus:ring-2
                    focus:ring-[#09379A]/10
                  `
            }
          `}
        />
      </div>
    </label>
  );
}