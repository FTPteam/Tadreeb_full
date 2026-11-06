import AcademicFooter from "../../components/shared/AcademicFooter";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BadgeCheck,
  CheckCircle2,
  Download,
  GraduationCap,
  Share2,
  ShieldCheck,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

export default function Certificate() {
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  const certificate = {
    studentName: "أمل أحمد",

    organization:
      "شركة القدس للاتصالات",

    startDate:
      "2025/10/01",

    endDate:
      "2025/12/01",

    hours: 120,

    documentNumber:
      "CIS-FT-2025-0842",

    issueDate:
      "2025/12/05",

    finalScore: 4.5,

    maxScore: 5.0,

    grade:
      "ممتاز",

    signer:
      "د. محمد الأسطل",

    signerTitle:
      "رئيس قسم التدريب الميداني",
  };

  /* =========================================================
     DOWNLOAD CERTIFICATE
     يفتح نافذة الطباعة ويمكن اختيار Save as PDF
  ========================================================= */

  const handleDownloadCertificate = () => {
    window.print();
  };

  /* =========================================================
     SHARE CERTIFICATE
  ========================================================= */

  const handleShareCertificate = async () => {
    const shareData = {
      title:
        "شهادة التدريب الميداني",

      text:
        `شهادة إتمام التدريب الميداني - ${certificate.studentName}`,

      url:
        window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(
          shareData
        );
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
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

      <div className="print:hidden">
        <Sidebar />
      </div>

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

        <div className="relative shrink-0 print:hidden">
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

            print:overflow-visible
            print:bg-white
            print:p-0
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1080px]

              print:max-w-none
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

                print:hidden
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
                الشهادة
              </span>
            </nav>

            {/* =====================================
                PAGE HEADER
            ====================================== */}

            <section
              className="
                mt-[6px]
                flex
                flex-col
                gap-4

                lg:flex-row
                lg:items-start
                lg:justify-between

                print:hidden
              "
            >
              {/* TITLE */}

              <div className="min-w-0">
                <h1
                  className="
                    m-0
                    text-[25px]
                    font-bold
                    leading-[38px]
                    text-[#09379A]

                    sm:text-[28px]

                    xl:text-[30px]
                    xl:leading-[42px]
                  "
                >
                  الشهادة الرسمية للتدريب الميداني
                </h1>

                <p
                  className="
                    m-0
                    mt-[4px]
                    max-w-[700px]
                    text-[12px]
                    leading-[22px]
                    text-[#64748B]

                    sm:text-[13px]
                    sm:leading-[24px]
                  "
                >
                  معاينة وتحميل الوثيقة الرسمية لإتمام
                  متطلبات التدريب الميداني المعتمدة
                  أكاديميا من كلية الدراسات المتوسطة.
                </p>
              </div>

              {/* CERTIFICATE STATE */}

              <div
                className="
                  flex
                  w-full
                  flex-col
                  gap-2
                  rounded-[10px]
                  border
                  border-[#D9E2EC]
                  bg-white
                  px-[14px]
                  py-[11px]

                  sm:w-auto
                  sm:min-w-[250px]
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:gap-[14px]
                "
              >
                <div>
                  <p
                    className="
                      m-0
                      text-[10px]
                      text-[#94A3B8]
                    "
                  >
                    محاكاة الحالة:
                  </p>
                </div>

                <div
                  className="
                    flex
                    min-h-[35px]
                    items-center
                    justify-center
                    gap-[7px]
                    rounded-[7px]
                    border
                    border-[#BFDBFE]
                    bg-[#EFF6FF]
                    px-[11px]
                    text-[10px]
                    font-bold
                    text-[#09379A]

                    sm:min-w-[155px]
                    sm:text-[11px]
                  "
                >
                  <BadgeCheck
                    size={15}
                  />

                  الشهادة معتمدة وجاهزة
                </div>
              </div>
            </section>

            {/* =====================================
                CERTIFICATE
            ====================================== */}

            <section
              id="certificate-print-area"
              className="
                relative
                mt-[24px]
                overflow-hidden
                rounded-[16px]
                border-[2px]
                border-[#0B4DBB]
                bg-white
                px-4
                py-8
                shadow-[0_2px_4px_rgba(15,23,42,0.03)]

                sm:px-6
                sm:py-10

                md:px-[36px]
                md:py-[42px]

                xl:px-[44px]
                xl:py-[44px]

                print:mt-0
                print:min-h-[185mm]
                print:rounded-none
                print:border-[2px]
                print:px-[16mm]
                print:py-[12mm]
                print:shadow-none
              "
            >
              {/* BACKGROUND WATERMARK */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-[53%]
                  -translate-x-1/2
                  -translate-y-1/2
                  opacity-[0.035]

                  print:opacity-[0.045]
                "
              >
                <GraduationCap
                  size={320}
                  strokeWidth={0.9}
                  className="
                    text-[#09379A]
                  "
                />
              </div>

              {/* CERTIFICATE CONTENT */}

              <div
                className="
                  relative
                  z-10
                  text-center
                "
              >
                {/* COLLEGE */}

                <h2
                  className="
                    m-0
                    text-[20px]
                    font-bold
                    leading-[32px]
                    text-[#1E293B]

                    sm:text-[23px]

                    md:text-[25px]

                    xl:text-[27px]
                  "
                >
                  كلية الدراسات المتوسطة - الأزهر
                </h2>

                <p
                  className="
                    m-0
                    mt-[5px]
                    text-[10px]
                    leading-[18px]
                    text-[#64748B]

                    sm:text-[11px]
                  "
                >
                  قسم التدريب الميداني والتطوير الأكاديمي
                </p>

                {/* CERTIFICATE TITLE */}

                <h3
                  className="
                    m-0
                    mt-[27px]
                    text-[28px]
                    font-bold
                    leading-[40px]
                    text-[#09379A]

                    sm:mt-[30px]
                    sm:text-[32px]

                    md:text-[35px]

                    xl:mt-[34px]
                    xl:text-[38px]
                    xl:leading-[48px]
                  "
                >
                  شهادة إتمام تدريب
                </h3>

                <p
                  className="
                    m-0
                    mt-[13px]
                    text-[11px]
                    text-[#64748B]

                    sm:mt-[16px]
                    sm:text-[13px]
                  "
                >
                  تمنح هذه الشهادة للطالبة
                </p>

                {/* STUDENT NAME */}

                <div
                  className="
                    mt-[8px]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <div
                    className="
                      min-w-[180px]
                      border-b
                      border-[#BFDBFE]
                      px-3
                      pb-[4px]

                      sm:min-w-[200px]
                    "
                  >
                    <strong
                      className="
                        text-[25px]
                        font-bold
                        leading-[36px]
                        text-[#09379A]

                        sm:text-[28px]

                        xl:text-[31px]
                        xl:leading-[38px]
                      "
                    >
                      {certificate.studentName}
                    </strong>
                  </div>
                </div>

                {/* DESCRIPTION */}

                <p
                  className="
                    mx-auto
                    mb-0
                    mt-[23px]
                    max-w-[690px]
                    text-[11px]
                    leading-[23px]
                    text-[#475569]

                    sm:mt-[26px]
                    sm:text-[12px]
                    sm:leading-[24px]
                  "
                >
                  وذلك لإتمامها برنامج التدريب الميداني
                  المعتمد في{" "}

                  <strong
                    className="
                      text-[#1E293B]
                    "
                  >
                    {certificate.organization}
                  </strong>

                  {" "}خلال الفترة من{" "}

                  <strong
                    dir="ltr"
                    className="
                      inline-block
                      text-[#1E293B]
                    "
                  >
                    {certificate.startDate}
                  </strong>

                  {" "}إلى{" "}

                  <strong
                    dir="ltr"
                    className="
                      inline-block
                      text-[#1E293B]
                    "
                  >
                    {certificate.endDate}
                  </strong>

                  ، بمجموع ساعات تدريبية معتمدة{" "}

                  <strong
                    className="
                      text-[#1E293B]
                    "
                  >
                    ({certificate.hours}) ساعة
                  </strong>
                  .
                </p>

                {/* =================================
                    DOCUMENT DETAILS
                ================================== */}

                <div
                  className="
                    mx-auto
                    mt-[26px]
                    grid
                    min-h-[52px]
                    max-w-[760px]
                    grid-cols-1
                    items-center
                    gap-3
                    rounded-[9px]
                    border
                    border-[#E2E8F0]
                    bg-[#F8FAFC]
                    px-[14px]
                    py-[11px]

                    sm:grid-cols-2

                    md:mt-[30px]
                    md:grid-cols-3
                    md:gap-[10px]
                    md:px-[16px]
                    md:py-[10px]
                  "
                >
                  <CertificateMeta
                    label="رقم الوثيقة"
                    value={
                      certificate.documentNumber
                    }
                  />

                  <CertificateMeta
                    label="تاريخ الإصدار"
                    value={
                      certificate.issueDate
                    }
                  />

                  {/* GRADE */}

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      gap-[7px]

                      sm:col-span-2

                      md:col-span-1
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        text-[#94A3B8]
                      "
                    >
                      التقدير العام:
                    </span>

                    <span
                      className="
                        flex
                        min-h-[27px]
                        items-center
                        rounded-[6px]
                        border
                        border-[#A7E6C4]
                        bg-[#ECFDF5]
                        px-[9px]
                        text-[10px]
                        font-bold
                        text-[#047857]
                      "
                    >
                      {certificate.grade}{" "}
                      (
                      {certificate.finalScore}
                      /
                      {certificate.maxScore}
                      )
                    </span>
                  </div>
                </div>

                {/* =================================
                    QR + SIGNATURE
                ================================== */}

                <div
                  className="
                    mt-[38px]
                    grid
                    grid-cols-1
                    items-end
                    gap-[32px]

                    md:mt-[48px]
                    md:grid-cols-2
                    md:gap-[30px]
                  "
                >
                  {/* QR */}

                  <div
                    className="
                      flex
                      justify-center

                      md:justify-start
                    "
                  >
                    <div>
                      <div
                        className="
                          flex
                          h-[82px]
                          w-[82px]
                          items-center
                          justify-center
                          rounded-[8px]
                          border
                          border-[#CBD5E1]
                          bg-white
                        "
                      >
                        <FakeQRCode />
                      </div>

                      <p
                        className="
                          m-0
                          mt-[7px]
                          text-[10px]
                          text-[#64748B]
                        "
                      >
                        التحقق من صحة الشهادة
                      </p>
                    </div>
                  </div>

                  {/* SIGNATURE */}

                  <div
                    className="
                      flex
                      justify-center

                      md:justify-end
                    "
                  >
                    <div
                      className="
                        min-w-[190px]
                        text-center
                      "
                    >
                      <p
                        className="
                          m-0
                          text-[10px]
                          text-[#64748B]

                          sm:text-[11px]
                        "
                      >
                        {certificate.signerTitle}
                      </p>

                      <div
                        className="
                          mt-[12px]
                          flex
                          h-[40px]
                          items-center
                          justify-center
                        "
                      >
                        <span
                          className="
                            -rotate-[7deg]
                            font-serif
                            text-[29px]
                            italic
                            text-[#09379A]
                          "
                        >
                          مـحـمـد
                        </span>
                      </div>

                      <strong
                        className="
                          mt-[4px]
                          block
                          text-[11px]
                          text-[#1E293B]

                          sm:text-[12px]
                        "
                      >
                        {certificate.signer}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* =====================================
                ACTION BUTTONS
            ====================================== */}

            <section
              className="
                mt-[24px]
                flex
                flex-col
                items-stretch
                justify-center
                gap-[10px]

                sm:flex-row
                sm:flex-wrap
                sm:items-center
                sm:gap-[12px]

                print:hidden
              "
            >
              {/* SHARE */}

              <button
                type="button"
                onClick={
                  handleShareCertificate
                }
                className="
                  flex
                  min-h-[44px]
                  w-full
                  items-center
                  justify-center
                  gap-[8px]
                  rounded-[8px]
                  border-0
                  bg-[#09379A]
                  px-[20px]
                  text-[11px]
                  font-bold
                  text-white
                  shadow-[0_3px_7px_rgba(9,55,154,0.18)]
                  transition

                  hover:bg-[#072E81]

                  sm:w-auto
                  sm:min-w-[195px]
                "
              >
                <Share2
                  size={16}
                  strokeWidth={1.8}
                />

                {copied
                  ? "تم نسخ الرابط"
                  : "مشاركة الشهادة"}
              </button>

              {/* DOWNLOAD */}

              <button
                type="button"
                onClick={
                  handleDownloadCertificate
                }
                className="
                  flex
                  min-h-[44px]
                  w-full
                  items-center
                  justify-center
                  gap-[8px]
                  rounded-[8px]
                  border
                  border-[#D5DFEA]
                  bg-white
                  px-[20px]
                  text-[11px]
                  font-bold
                  text-[#1E293B]
                  transition

                  hover:border-[#B7C8DA]
                  hover:bg-[#F8FAFC]

                  sm:w-auto
                  sm:min-w-[225px]
                "
              >
                <Download
                  size={16}
                  strokeWidth={1.8}
                  className="
                    text-[#09379A]
                  "
                />

                تحميل الشهادة (PDF)
              </button>
            </section>

            {/* =====================================
                VALIDITY NOTICE
            ====================================== */}

            <section
              className="
                mt-[22px]
                flex
                min-h-[60px]
                flex-col
                gap-3
                rounded-[11px]
                border
                border-[#DDE5EF]
                bg-white
                px-[16px]
                py-[13px]

                sm:flex-row
                sm:flex-wrap
                sm:items-center
                sm:justify-between
                sm:gap-[15px]

                print:hidden
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-[9px]

                  sm:items-center
                "
              >
                <ShieldCheck
                  size={17}
                  className="
                    mt-[1px]
                    shrink-0
                    text-[#09379A]

                    sm:mt-0
                  "
                />

                <p
                  className="
                    m-0
                    text-[10px]
                    leading-[19px]
                    text-[#64748B]

                    sm:text-[11px]
                    sm:leading-[20px]
                  "
                >
                  هذه الوثيقة مشفرة رقميا ومسجلة في
                  السجل الأكاديمي المركزي بجامعة الأزهر
                  تحت كود الاعتماد المباشر.
                </p>
              </div>

              <div
                className="
                  flex
                  min-h-[27px]
                  w-fit
                  items-center
                  gap-[6px]
                  rounded-full
                  border
                  border-[#A7E6C4]
                  bg-[#ECFDF5]
                  px-[10px]
                  text-[10px]
                  font-bold
                  text-[#047857]
                "
              >
                <span
                  className="
                    h-[6px]
                    w-[6px]
                    rounded-full
                    bg-[#10B981]
                  "
                />

                شهادة سارية ومعتمدة
              </div>
            </section>
          </div>
        
            <AcademicFooter audience="student" />
          </main>
      </div>

      {/* =========================================
          PRINT STYLES
      ========================================== */}

      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          html,
          body,
          #root {
            width: 100%;
            height: auto;
            overflow: visible !important;
            background: #ffffff !important;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .print\\:hidden {
            display: none !important;
          }

          main {
            overflow: visible !important;
            height: auto !important;
          }

          #certificate-print-area {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   CERTIFICATE META
========================================================= */

function CertificateMeta({
  label,
  value,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-center
        gap-[6px]
      "
    >
      <span
        className="
          text-[10px]
          text-[#94A3B8]
        "
      >
        {label}:
      </span>

      <strong
        dir="ltr"
        className="
          text-[10px]
          font-bold
          text-[#1E293B]

          sm:text-[11px]
        "
      >
        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   FRONTEND QR PLACEHOLDER
========================================================= */

function FakeQRCode() {
  const cells = [
    1, 1, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 0, 1, 0,
    1, 1, 1, 0, 1, 1, 1,
    0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 1, 1, 0, 1,
    0, 1, 0, 0, 1, 1, 0,
    1, 0, 1, 1, 0, 1, 1,
  ];

  return (
    <div
      dir="ltr"
      className="
        grid
        h-[56px]
        w-[56px]
        grid-cols-7
        gap-[2px]
      "
    >
      {cells.map(
        (cell, index) => (
          <span
            key={index}
            className={`
              rounded-[1px]

              ${
                cell
                  ? "bg-[#1E293B]"
                  : "bg-transparent"
              }
            `}
          />
        )
      )}
    </div>
  );
}