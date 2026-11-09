import AcademicFooter from "../../components/shared/AcademicFooter";
import { getStudent } from "../admin/studentsStore";
import { getActiveStudentId } from "../../services/studentTrainingEligibility";
import { useState, useEffect } from "react";
import { fetchProfile, updateProfile } from "../../api/student";
import { useNavigate } from "react-router-dom";

import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  Edit3,
  IdCard,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

export default function Profile() {
  const navigate = useNavigate();
  const currentStudent = getStudent(getActiveStudentId());

  const [isEditing, setIsEditing] =
    useState(false);

  const [formData, setFormData] =
    useState({
      fullName:
        currentStudent?.name || "غير محدد",

      studentId:
        getActiveStudentId(),

      college:
        "كلية الدراسات المتوسطة",

      major:
        currentStudent?.major || "غير محدد",

      email:
        "",

      phone:
        "",
    });

  const [savedData, setSavedData] =
    useState(formData);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        const mapped = {
          fullName: data.full_name || data.university_id || "طالب",
          studentId: String(data.university_id || ""),
          college: "كلية الدراسات المتوسطة",
          major: data.specialization_name || "—",
          email: data.email || "",
          phone: data.phone || "",
        };
        setFormData(mapped);
        setSavedData(mapped);
      })
      .catch(() => {});
  }, []);

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const handleEdit = () => {
    setSavedData(formData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(savedData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaveError("");
      setSaveSuccess("");
      await updateProfile({ email: formData.email, phone: formData.phone });
      setSavedData(formData);
      setIsEditing(false);
      setSaveSuccess("تم حفظ التعديلات بنجاح.");
    } catch (err) {
      setSaveError(err?.message || "تعذر حفظ البيانات.");
    }
  };

  return (
    <div
      dir="rtl"
      className="
        flex
        h-dvh
        w-full
        overflow-hidden
        bg-[#F8FAFC]
        font-['Cairo']
        text-[#1E293B]
      "
    >
      {/* =========================================
          SIDEBAR
      ========================================== */}

      <Sidebar />

      {/* =========================================
          MAIN AREA
      ========================================== */}

      <div
        className="
          flex
          h-dvh
          min-w-0
          flex-1
          flex-col
          overflow-hidden
          bg-[#F8FAFC]
        "
      >
        {/* =========================================
            HEADER
        ========================================== */}

        <div className="relative shrink-0">
          <Header />
        </div>

        {/* =========================================
            CONTENT
        ========================================== */}

        <main
          className="
            min-h-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            bg-[#F8FAFC]

            px-4
            pb-8
            pt-5

            sm:px-5
            sm:pt-6

            md:px-6

            xl:px-[40px]
            xl:pb-[40px]
            xl:pt-[14px]
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1080px]
            "
          >
            {/* =====================================
                BREADCRUMB
            ====================================== */}

            <nav
              aria-label="مسار التنقل"
              className="
                flex
                flex-wrap
                items-center
                gap-[7px]
                text-[11px]
                font-medium
                leading-[20px]

                sm:text-[12px]

                xl:text-[13px]
              "
            >
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/student/dashboard"
                  )
                }
                className="
                  border-0
                  bg-transparent
                  p-0
                  text-[#64748B]
                  transition

                  hover:text-[#09379A]
                "
              >
                الرئيسية
              </button>

              <span
                className="
                  text-[#94A3B8]
                "
              >
                ›
              </span>

              <span
                className="
                  font-bold
                  text-[#09379A]
                "
              >
                الملف الشخصي
              </span>
            </nav>

            {/* =====================================
                PAGE HEADER
            ====================================== */}

            <section
              className="
                mt-[6px]
              "
            >
              <h1
                className="
                  m-0
                  text-[25px]
                  font-bold
                  leading-[38px]
                  text-[#14213D]

                  sm:text-[27px]

                  xl:text-[30px]
                  xl:leading-[42px]
                "
              >
                الملف الشخصي
              </h1>

              <p
                className="
                  m-0
                  mt-[2px]
                  max-w-[600px]
                  text-[12px]
                  leading-[22px]
                  text-[#64748B]

                  sm:text-[13px]
                "
              >
                عرض بيانات الطالب الأكاديمية
                والشخصية المعتمدة
              </p>
            </section>

            {/* =====================================
                PROFILE HERO
            ====================================== */}

            <section
              className="
                mt-[22px]
                flex
                min-h-[215px]
                flex-col
                items-center
                justify-center
                rounded-[14px]
                border
                border-[#DDE5EF]
                bg-white
                px-4
                py-6
                text-center
                shadow-[0_1px_2px_rgba(15,23,42,0.03)]

                sm:min-h-[220px]
                sm:px-[24px]
                sm:py-[26px]
              "
            >
              {/* AVATAR */}

              <div className="relative">
                <div
                  className="
                    flex
                    h-[82px]
                    w-[82px]
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#DDE5EF]
                    bg-[#F8FAFC]
                    text-[#94A3B8]

                    sm:h-[86px]
                    sm:w-[86px]
                  "
                >
                  <UserRound
                    size={42}
                    strokeWidth={1.5}
                  />
                </div>

                <div
                  className="
                    absolute
                    bottom-[1px]
                    left-[1px]
                    flex
                    h-[25px]
                    w-[25px]
                    items-center
                    justify-center
                    rounded-full
                    border-[3px]
                    border-white
                    bg-[#10B981]
                    text-white
                  "
                >
                  <CheckCircle2
                    size={13}
                    strokeWidth={2.2}
                  />
                </div>
              </div>

              {/* NAME */}

              <h2
                className="
                  m-0
                  mt-[14px]
                  text-[18px]
                  font-bold
                  leading-[30px]
                  text-[#1E293B]

                  sm:text-[19px]
                "
              >
                {formData.fullName}
              </h2>

              {/* META */}

              <div
                className="
                  mt-[10px]
                  flex
                  max-w-full
                  flex-wrap
                  items-center
                  justify-center
                  gap-[8px]
                "
              >
                <span
                  className="
                    inline-flex
                    min-h-[27px]
                    max-w-full
                    items-center
                    gap-[6px]
                    rounded-full
                    bg-[#F1F5F9]
                    px-[11px]
                    text-[10px]
                    text-[#64748B]

                    sm:text-[11px]
                  "
                >
                  الرقم الجامعي:

                  <strong
                    dir="ltr"
                    className="
                      font-bold
                      text-[#334155]
                    "
                  >
                    {formData.studentId}
                  </strong>
                </span>

                <span
                  className="
                    inline-flex
                    min-h-[27px]
                    max-w-full
                    items-center
                    gap-[6px]
                    rounded-full
                    border
                    border-[#BAE6FD]
                    bg-[#EFFAFF]
                    px-[11px]
                    text-[10px]
                    font-bold
                    text-[#0369A1]

                    sm:text-[11px]
                  "
                >
                  <span
                    className="
                      h-[6px]
                      w-[6px]
                      shrink-0
                      rounded-full
                      bg-[#0EA5E9]
                    "
                  />

                  <span className="truncate">
                    التخصص التقني:{" "}
                    {formData.major}
                  </span>
                </span>
              </div>
            </section>

            {/* =====================================
                BASIC INFORMATION
            ====================================== */}

            <section
              className="
                mt-[22px]
                rounded-[14px]
                border
                border-[#DDE5EF]
                bg-white
                px-4
                py-5
                shadow-[0_1px_2px_rgba(15,23,42,0.03)]

                sm:px-[22px]
                sm:py-[20px]
              "
            >
              {/* HEADER */}

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  border-b
                  border-[#EEF2F7]
                  pb-[14px]

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:gap-[15px]
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-[9px]
                  "
                >
                  <div
                    className="
                      flex
                      h-[32px]
                      w-[32px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-[7px]
                      bg-[#EEF4FF]
                      text-[#09379A]
                    "
                  >
                    <IdCard
                      size={16}
                      strokeWidth={1.8}
                    />
                  </div>

                  <h2
                    className="
                      m-0
                      text-[16px]
                      font-bold
                      text-[#1E293B]

                      sm:text-[17px]
                    "
                  >
                    المعلومات الأساسية
                  </h2>
                </div>

                <span
                  className="
                    flex
                    min-h-[24px]
                    w-fit
                    items-center
                    rounded-[6px]
                    bg-[#F1F5F9]
                    px-[9px]
                    text-[10px]
                    text-[#64748B]
                  "
                >
                  بيانات السجل الرسمي
                </span>
              </div>

              {/* DATA GRID */}

              <div
                className="
                  mt-[20px]
                  grid
                  grid-cols-1
                  gap-x-[38px]
                  gap-y-[24px]

                  md:grid-cols-2
                "
              >
                {/* Academic fixed fields */}

                <ProfileField
                  label="الاسم الكامل"
                  value={
                    formData.fullName
                  }
                />

                <ProfileField
                  label="الرقم الجامعي"
                  value={
                    formData.studentId
                  }
                  icon={Lock}
                />

                <ProfileField
                  label="الكلية"
                  value={
                    formData.college
                  }
                />

                <ProfileField
                  label="التخصص / القسم"
                  value={
                    formData.major
                  }
                />

                {/* Contact editable fields */}

                <ProfileField
                  label="البريد الإلكتروني"
                  value={
                    formData.email
                  }
                  name="email"
                  editable={
                    isEditing
                  }
                  onChange={
                    handleChange
                  }
                  icon={Mail}
                  actionText={
                    !isEditing
                      ? "تعديل التواصل"
                      : null
                  }
                  onAction={
                    handleEdit
                  }
                  inputType="email"
                  dir="ltr"
                />

                <ProfileField
                  label="رقم الهاتف"
                  value={
                    formData.phone
                  }
                  name="phone"
                  editable={
                    isEditing
                  }
                  onChange={
                    handleChange
                  }
                  icon={Phone}
                  actionText={
                    !isEditing
                      ? "تعديل التواصل"
                      : null
                  }
                  onAction={
                    handleEdit
                  }
                  inputType="tel"
                  dir="ltr"
                />
              </div>
            </section>

            {/* =====================================
                ACCOUNT INFORMATION
            ====================================== */}

            <section
              className="
                mt-[22px]
                rounded-[14px]
                border
                border-[#DDE5EF]
                bg-white
                px-4
                py-5
                shadow-[0_1px_2px_rgba(15,23,42,0.03)]

                sm:px-[22px]
                sm:py-[20px]
              "
            >
              {/* TITLE */}

              <div
                className="
                  flex
                  items-center
                  gap-[9px]
                  border-b
                  border-[#EEF2F7]
                  pb-[14px]
                "
              >
                <div
                  className="
                    flex
                    h-[32px]
                    w-[32px]
                    items-center
                    justify-center
                    rounded-[7px]
                    bg-[#F2F0FF]
                    text-[#6366F1]
                  "
                >
                  <ShieldCheck
                    size={16}
                    strokeWidth={1.8}
                  />
                </div>

                <h2
                  className="
                    m-0
                    text-[16px]
                    font-bold
                    text-[#1E293B]

                    sm:text-[17px]
                  "
                >
                  معلومات الحساب
                </h2>
              </div>

              {/* ACCOUNT CONTENT */}

              <div
                className="
                  mt-[18px]
                  grid
                  grid-cols-1
                  items-center
                  gap-[18px]

                  md:grid-cols-2

                  lg:gap-[32px]
                "
              >
                {/* STATUS */}

                <div>
                  <p
                    className="
                      m-0
                      text-[11px]
                      text-[#94A3B8]
                    "
                  >
                    حالة الحساب الأكاديمي
                  </p>

                  <div
                    className="
                      mt-[7px]
                      inline-flex
                      min-h-[31px]
                      items-center
                      gap-[7px]
                      rounded-[7px]
                      border
                      border-[#A7E6C4]
                      bg-[#ECFDF5]
                      px-[11px]
                      text-[10px]
                      font-bold
                      text-[#047857]

                      sm:text-[11px]
                    "
                  >
                    <CheckCircle2
                      size={14}
                    />

                    نشط ومؤهل للتدريب
                  </div>
                </div>

                {/* LINKED SYSTEM */}

                <div
                  className="
                    flex
                    min-h-[60px]
                    items-center
                    gap-[11px]
                    rounded-[9px]
                    border
                    border-[#DDE5EF]
                    bg-[#F8FAFC]
                    px-[14px]
                    py-[11px]
                  "
                >
                  <div
                    className="
                      flex
                      h-[34px]
                      w-[34px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-[8px]
                      bg-[#E9FFF4]
                      text-[#10B981]
                    "
                  >
                    <Building2
                      size={16}
                    />
                  </div>

                  <span
                    className="
                      text-[11px]
                      leading-[20px]
                      text-[#475569]
                    "
                  >
                    الحساب مرتبط بالنظام الأكاديمي
                    المركزي - تم التحقق من الهوية
                  </span>
                </div>
              </div>
            </section>

            {/* =====================================
                BOTTOM ACTIONS
            ====================================== */}

            <section
              className="
                mt-[55px]
                flex
                flex-col
                gap-4
                border-t
                border-[#E2E8F0]
                pt-[18px]

                sm:flex-row
                sm:flex-wrap
                sm:items-center
                sm:justify-between

                xl:mt-[90px]
              "
            >
              <p
                className="
                  m-0
                  max-w-[650px]
                  text-[10px]
                  leading-[19px]
                  text-[#94A3B8]

                  sm:text-[11px]
                  sm:leading-[20px]
                "
              >
                * يسمح بتعديل بيانات التواصل فقط
                (البريد ورقم الهاتف)، أما البيانات
                الأكاديمية فمعتمدة مركزيا.
              </p>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={
                    handleEdit
                  }
                  className="
                    flex
                    min-h-[42px]
                    w-full
                    items-center
                    justify-center
                    gap-[8px]
                    rounded-[8px]
                    border-0
                    bg-[#09379A]
                    px-[18px]
                    text-[11px]
                    font-bold
                    text-white
                    shadow-[0_3px_8px_rgba(9,55,154,0.16)]
                    transition

                    hover:bg-[#072E81]

                    sm:w-auto
                  "
                >
                  <Edit3
                    size={15}
                  />

                  تعديل البيانات
                </button>
              ) : (
                <div
                  className="
                    flex
                    w-full
                    flex-col-reverse
                    gap-[9px]

                    sm:w-auto
                    sm:flex-row
                    sm:items-center
                  "
                >
                  <button
                    type="button"
                    onClick={
                      handleCancel
                    }
                    className="
                      min-h-[40px]
                      rounded-[8px]
                      border
                      border-[#D9E2EC]
                      bg-white
                      px-[15px]
                      text-[11px]
                      font-bold
                      text-[#475569]
                      transition

                      hover:bg-[#F8FAFC]
                    "
                  >
                    إلغاء
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleSave
                    }
                    className="
                      flex
                      min-h-[40px]
                      items-center
                      justify-center
                      gap-[7px]
                      rounded-[8px]
                      border-0
                      bg-[#09379A]
                      px-[17px]
                      text-[11px]
                      font-bold
                      text-white
                      transition

                      hover:bg-[#072E81]
                    "
                  >
                    <BadgeCheck
                      size={14}
                    />

                    حفظ التعديلات
                  </button>
                </div>
              )}
            </section>
          </div>
        
            <AcademicFooter audience="student" />
          </main>
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE FIELD
========================================================= */

function ProfileField({
  label,
  value,
  name,
  editable = false,
  onChange,
  icon: Icon,
  actionText,
  onAction,
  inputType = "text",
  dir,
}) {
  return (
    <div
      className="
        min-w-0
      "
    >
      <p
        className="
          m-0
          text-[11px]
          leading-[18px]
          text-[#94A3B8]
        "
      >
        {label}
      </p>

      {editable ? (
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          dir={dir}
          className="
            mt-[6px]
            h-[42px]
            w-full
            rounded-[7px]
            border
            border-[#D9E2EC]
            bg-white
            px-[11px]
            font-['Cairo']
            text-[12px]
            font-semibold
            text-[#334155]
            outline-none
            transition

            focus:border-[#09379A]
            focus:ring-2
            focus:ring-[#09379A]/10
          "
        />
      ) : (
        <div
          className="
            mt-[7px]
            flex
            min-h-[28px]
            items-center
            justify-between
            gap-[12px]
          "
        >
          {/* VALUE */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-[7px]
            "
          >
            {Icon && (
              <Icon
                size={14}
                className="
                  shrink-0
                  text-[#94A3B8]
                "
              />
            )}

            <strong
              dir={dir}
              className="
                min-w-0
                break-all
                text-[12px]
                font-bold
                leading-[20px]
                text-[#334155]

                sm:text-[13px]
              "
            >
              {value}
            </strong>
          </div>

          {/* ACTION */}

          {actionText && (
            <button
              type="button"
              onClick={
                onAction
              }
              className="
                flex
                shrink-0
                items-center
                gap-[4px]
                whitespace-nowrap
                border-0
                bg-transparent
                p-0
                text-[10px]
                font-bold
                text-[#09379A]
                transition

                hover:underline
              "
            >
              <Edit3
                size={12}
              />

              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}