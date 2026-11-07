import { getApplicationDraft, getSelectedOpportunity, clearApplicationDraft } from "./studentApplicationDraft";
import { applyForTraining, updateProfile, uploadApplicationDocument } from "../../api/student";
import AcademicFooter from "../../components/shared/AcademicFooter";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  FileText,
  Image,
  Mail,
  Paperclip,
  RefreshCw,
  Upload,
  XCircle,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

export default function TrainingDocuments() {
  const navigate = useNavigate();
  const [submissionError, setSubmissionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // The chosen files, uploaded to the backend when the application is sent.
  const filesRef = useRef({});

  /* =========================================================
     INPUT REFS
  ========================================================= */

  const transcriptInputRef = useRef(null);
  const idInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const letterInputRef = useRef(null);
  const cvInputRef = useRef(null);
  const extraInputRef = useRef(null);

  /* =========================================================
     DOCUMENT STATES
  ========================================================= */

  const [documents, setDocuments] = useState({
    transcript: {
      uploaded: false,
      fileName: "",
      size: "",
      progress: 0,
      error: "",
    },

    idCard: {
      uploaded: false,
      fileName: "",
      size: "",
      progress: 0,
      error: "",
    },

    photo: {
      uploaded: false,
      fileName: "",
      size: "",
      progress: 0,
      error: "",
    },

    recommendation: {
      uploaded: false,
      fileName: "",
      size: "",
      progress: 0,
      error: "",
    },

    cv: {
      uploaded: false,
      fileName: "",
      size: "",
      progress: 0,
      error: "",
    },

    extra: {
      uploaded: false,
      fileName: "",
      size: "",
      progress: 0,
      error: "",
    },
  });

  const [uploadingKey, setUploadingKey] =
    useState(null);

  /* =========================================================
     ACCEPTED FILE TYPES
  ========================================================= */

  const acceptedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const maxFileSize =
    5 * 1024 * 1024;

  /* =========================================================
     FILE SIZE
  ========================================================= */

  const getFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(
        bytes / 1024
      ).toFixed(0)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  /* =========================================================
     FILE VALIDATION
  ========================================================= */

  const validateFile = (
    documentKey,
    file
  ) => {
    const isPhoto =
      documentKey === "photo";

    if (
      isPhoto &&
      ![
        "image/jpeg",
        "image/png",
      ].includes(file.type)
    ) {
      return "الصورة الشخصية يجب أن تكون بصيغة JPG أو PNG.";
    }

    if (
      !isPhoto &&
      !acceptedTypes.includes(file.type)
    ) {
      return "نوع الملف غير مدعوم. يرجى رفع PDF أو JPG أو PNG أو DOC.";
    }

    if (
      file.size > maxFileSize
    ) {
      return "تجاوز حجم الملف الحد الأقصى المسموح به وهو 5 ميجابايت.";
    }

    return "";
  };

  /* =========================================================
     FILE SELECT
  ========================================================= */

  const handleFileSelect = (
    documentKey,
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError =
      validateFile(
        documentKey,
        file
      );

    if (validationError) {
      setDocuments(
        (previous) => ({
          ...previous,

          [documentKey]: {
            uploaded: false,
            fileName: file.name,
            size: getFileSize(
              file.size
            ),
            progress: 0,
            error:
              validationError,
          },
        })
      );

      event.target.value = "";
      return;
    }

    filesRef.current[documentKey] = file;

    setUploadingKey(
      documentKey
    );

    setDocuments(
      (previous) => ({
        ...previous,

        [documentKey]: {
          uploaded: false,
          fileName: file.name,
          size: getFileSize(
            file.size
          ),
          progress: 25,
          error: "",
        },
      })
    );

    window.setTimeout(() => {
      setDocuments(
        (previous) => ({
          ...previous,

          [documentKey]: {
            ...previous[
              documentKey
            ],

            progress: 65,
          },
        })
      );
    }, 300);

    window.setTimeout(() => {
      setDocuments(
        (previous) => ({
          ...previous,

          [documentKey]: {
            ...previous[
              documentKey
            ],

            progress: 88,
          },
        })
      );
    }, 600);

    window.setTimeout(() => {
      setDocuments(
        (previous) => ({
          ...previous,

          [documentKey]: {
            ...previous[
              documentKey
            ],

            uploaded: true,
            progress: 100,
            error: "",
          },
        })
      );

      setUploadingKey(null);

      event.target.value = "";
    }, 950);
  };

  /* =========================================================
     RESET ERROR / RETRY
  ========================================================= */

  const retryUpload = (
    documentKey,
    inputRef
  ) => {
    setDocuments(
      (previous) => ({
        ...previous,

        [documentKey]: {
          uploaded: false,
          fileName: "",
          size: "",
          progress: 0,
          error: "",
        },
      })
    );

    window.setTimeout(() => {
      inputRef.current?.click();
    }, 0);
  };

  /* =========================================================
     REQUIRED DOCUMENTS
  ========================================================= */

  const requiredDocumentsComplete =
    documents.transcript.uploaded &&
    documents.idCard.uploaded &&
    documents.photo.uploaded;

  const isUploading =
    uploadingKey !== null;

  /* =========================================================
     NEXT
  ========================================================= */

  const DOCUMENT_TITLES = {
    transcript: "كشف الدرجات",
    idCard: "البطاقة الشخصية",
    photo: "صورة شخصية",
    recommendation: "خطاب توصية",
    cv: "السيرة الذاتية",
    extra: "مستند إضافي",
  };

  const handleNext = async () => {
    if (
      !requiredDocumentsComplete ||
      isUploading ||
      submitting
    ) {
      return;
    }
    const opportunityId = Number(getSelectedOpportunity());
    if (!opportunityId) {
      setSubmissionError("اختر فرصة تدريب أولًا.");
      return;
    }

    setSubmitting(true);
    setSubmissionError("");
    try {
      // The backend checks eligibility, the specialization and the open application (FR-06, FR-08).
      const draft = getApplicationDraft() || {};
      if (draft.phone || draft.email) {
        await updateProfile({ phone: draft.phone, email: draft.email });
      }
      const application = await applyForTraining([opportunityId], { submit: false });
      for (const [key, file] of Object.entries(filesRef.current)) {
        await uploadApplicationDocument(application.id, DOCUMENT_TITLES[key] || key, file);
      }
      await applyForTraining([opportunityId]);
      clearApplicationDraft();
      navigate("/student/applications");
    } catch (error) {
      setSubmissionError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     DOCUMENT CARD
  ========================================================= */

  const DocumentCard = ({
    title,
    description,
    documentKey,
    inputRef,
    icon: Icon,
    required = false,
    accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  }) => {
    const document =
      documents[documentKey];

    const hasProgress =
      document.fileName &&
      !document.uploaded &&
      !document.error &&
      document.progress > 0;

    return (
      <article
        className="
          flex
          min-h-[148px]
          min-w-0
          flex-col
          justify-between
          rounded-[14px]
          border
          border-[#DCE4EF]
          bg-white
          p-4
          transition

          hover:border-[#B6C9EC]

          sm:min-h-[154px]

          xl:px-[16px]
          xl:py-[15px]
        "
      >
        {/* =====================================
            CARD TOP
        ====================================== */}
        <div>
          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >
            <div
              className="
                min-w-0
                text-right
              "
            >
              <h3
                className="
                  m-0
                  text-[13px]
                  font-bold
                  leading-[21px]
                  text-[#1E293B]

                  xl:text-[14px]
                  xl:leading-[22px]
                "
              >
                {title}

                {required && (
                  <span
                    className="
                      mr-[2px]
                      text-[#DC2626]
                    "
                  >
                    *
                  </span>
                )}
              </h3>

              <p
                className="
                  m-0
                  mt-[3px]
                  text-[9px]
                  leading-[15px]
                  text-[#94A3B8]

                  xl:text-[10px]
                  xl:leading-[16px]
                "
              >
                {description}
              </p>
            </div>

            <div
              className="
                flex
                h-[38px]
                w-[38px]
                shrink-0
                items-center
                justify-center
                rounded-[10px]
                bg-[#F0F5FD]
                text-[#8EA4C5]

                sm:h-[40px]
                sm:w-[40px]
                sm:rounded-full
              "
            >
              <Icon
                size={19}
                strokeWidth={1.7}
              />
            </div>
          </div>

          {/* =====================================
              SUCCESS BADGE
          ====================================== */}
          {document.uploaded && (
            <div className="mt-[7px]">
              <span
                className="
                  inline-flex
                  min-h-[22px]
                  items-center
                  gap-[5px]
                  rounded-[10px]
                  bg-[#E8FFF3]
                  px-[8px]
                  text-[9px]
                  font-medium
                  text-[#12A766]
                "
              >
                <span
                  className="
                    h-[5px]
                    w-[5px]
                    rounded-full
                    bg-[#10B981]
                  "
                />

                تم الرفع بنجاح
              </span>
            </div>
          )}
        </div>

        {/* =====================================
            UPLOADED STATE
        ====================================== */}
        {document.uploaded ? (
          <div
            className="
              mt-[10px]
              flex
              min-h-[42px]
              min-w-0
              items-center
              justify-between
              gap-[8px]
              rounded-[7px]
              border
              border-[#D9E2EC]
              bg-[#F8FAFC]
              px-[10px]
            "
          >
            <div
              className="
                flex
                min-w-0
                flex-1
                items-center
                gap-[7px]
              "
            >
              <CheckCircle2
                size={15}
                strokeWidth={1.8}
                className="
                  shrink-0
                  text-[#10B981]
                "
              />

              <span
                dir="ltr"
                title={
                  document.fileName
                }
                className="
                  min-w-0
                  truncate
                  text-[9px]
                  text-[#475569]

                  xl:text-[10px]
                "
              >
                {document.fileName}
              </span>

              <span
                className="
                  shrink-0
                  whitespace-nowrap
                  text-[8px]
                  text-[#94A3B8]

                  xl:text-[9px]
                "
              >
                {document.size}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                inputRef.current?.click()
              }
              className="
                shrink-0
                cursor-pointer
                border-0
                bg-transparent
                p-0
                text-[9px]
                font-bold
                text-[#09379A]

                hover:underline

                xl:text-[10px]
              "
            >
              استبدال
            </button>
          </div>
        ) : document.error ? (
          /* =====================================
              ERROR STATE
          ====================================== */
          <div
            className="
              mt-[10px]
              flex
              min-h-[58px]
              items-center
              justify-between
              gap-[10px]
              rounded-[8px]
              border
              border-[#FDA4AF]
              bg-[#FFF6F7]
              px-[10px]
              py-[7px]
            "
          >
            <div className="min-w-0">
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-[6px]
                "
              >
                <XCircle
                  size={15}
                  className="
                    shrink-0
                    text-[#DC2626]
                  "
                />

                <span
                  dir="ltr"
                  className="
                    min-w-0
                    truncate
                    text-[9px]
                    font-bold
                    text-[#DC2626]

                    xl:text-[10px]
                  "
                >
                  {document.fileName}
                </span>
              </div>

              <p
                className="
                  m-0
                  mt-[3px]
                  text-[8px]
                  leading-[14px]
                  text-[#DC2626]
                "
              >
                {document.error}
              </p>
            </div>

            <button
              type="button"
              aria-label="إعادة المحاولة"
              onClick={() =>
                retryUpload(
                  documentKey,
                  inputRef
                )
              }
              className="
                flex
                h-[32px]
                w-[32px]
                shrink-0
                cursor-pointer
                items-center
                justify-center
                rounded-[7px]
                border-0
                bg-transparent
                p-0
                text-[#DC2626]
                transition

                hover:bg-[#FEE2E2]
              "
            >
              <RefreshCw size={15} />
            </button>
          </div>
        ) : hasProgress ? (
          /* =====================================
              UPLOADING STATE
          ====================================== */
          <div
            className="
              mt-[10px]
              rounded-[8px]
              border
              border-[#09379A]
              bg-white
              px-[10px]
              py-[8px]
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-[10px]
              "
            >
              <span
                dir="ltr"
                className="
                  min-w-0
                  truncate
                  text-[9px]
                  font-bold
                  text-[#475569]

                  xl:text-[10px]
                "
              >
                {document.fileName}
              </span>

              <span
                className="
                  shrink-0
                  text-[9px]
                  font-bold
                  text-[#09379A]
                "
              >
                {document.progress}%
              </span>
            </div>

            <div
              className="
                mt-[7px]
                h-[6px]
                w-full
                overflow-hidden
                rounded-full
                bg-[#E8EEF7]
              "
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-[#09379A]
                  transition-all
                  duration-300
                "
                style={{
                  width: `${document.progress}%`,
                }}
              />
            </div>
          </div>
        ) : (
          /* =====================================
              EMPTY STATE
          ====================================== */
          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            className="
              mt-[10px]
              flex
              h-[34px]
              w-full
              cursor-pointer
              items-center
              justify-center
              gap-[6px]
              rounded-[6px]
              border
              border-[#C9D5E6]
              bg-white
              text-[10px]
              font-bold
              text-[#09379A]
              transition

              hover:border-[#09379A]
              hover:bg-[#F6F9FF]
            "
          >
            <Upload
              size={13}
              strokeWidth={1.8}
            />

            رفع الملف
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(event) =>
            handleFileSelect(
              documentKey,
              event
            )
          }
          className="hidden"
        />
      </article>
    );
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
      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <Sidebar />

      {/* =====================================================
          MAIN AREA
      ====================================================== */}
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
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div
          className="
            relative
            shrink-0
          "
        >
          <Header />
        </div>

        {/* =====================================================
            MAIN SCROLL
        ====================================================== */}
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
            md:pt-7

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
            {/* =================================================
                BREADCRUMB
            ================================================== */}
            <nav
              aria-label="مسار التنقل"
              className="
                mb-2
                flex
                flex-wrap
                items-center
                gap-[7px]
                text-[11px]
                font-medium

                sm:text-[12px]

                xl:mb-[5px]
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
                  cursor-pointer
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

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/student/opportunities"
                  )
                }
                className="
                  cursor-pointer
                  border-0
                  bg-transparent
                  p-0
                  font-bold
                  text-[#09379A]
                "
              >
                فرص التدريب
              </button>
            </nav>

            {/* =================================================
                PAGE TITLE
            ================================================== */}
            <section className="text-right">
              <h1
                className="
                  m-0
                  text-[23px]
                  font-bold
                  leading-[34px]
                  text-[#14213D]

                  sm:text-[25px]

                  xl:text-[28px]
                  xl:leading-[40px]
                "
              >
                استمارة التقديم على التدريب
              </h1>

              <p
                className="
                  m-0
                  mt-[3px]
                  max-w-[720px]
                  text-[12px]
                  leading-[21px]
                  text-[#64748B]

                  sm:text-[13px]

                  xl:mt-[4px]
                  xl:text-[14px]
                  xl:leading-[22px]
                "
              >
                يرجى رفع المستندات التالية بصيغة PDF أو
                صورة واضحة لإتمام مسوغات التدريب الميداني
              </p>
            </section>

            {/* =================================================
                STEPPER
            ================================================== */}
            <section
              className="
                mt-5
                rounded-[14px]
                border
                border-[#E2E8F0]
                bg-white
                px-3
                py-5

                sm:px-6
                sm:py-6

                md:px-10

                xl:mt-[18px]
                xl:px-[50px]
                xl:py-[28px]
              "
            >
              <div className="relative">
                {/* BASE LINE */}
                <div
                  className="
                    absolute
                    left-[16%]
                    right-[16%]
                    top-[16px]
                    h-[3px]
                    bg-[#E2E8F0]

                    sm:top-[18px]

                    xl:left-[17%]
                    xl:right-[17%]
                    xl:top-[19px]
                    xl:h-[4px]
                  "
                />

                {/* COMPLETED LINE */}
                <div
                  className="
                    absolute
                    right-[16%]
                    top-[16px]
                    h-[3px]
                    w-[34%]
                    bg-[#09379A]

                    sm:top-[18px]

                    xl:right-[17%]
                    xl:top-[19px]
                    xl:h-[4px]
                    xl:w-[33%]
                  "
                />

                <div
                  className="
                    relative
                    z-10
                    grid
                    grid-cols-3
                  "
                >
                  {/* =============================================
                      STEP 1 - COMPLETED
                  ============================================== */}
                  <div
                    className="
                      flex
                      min-w-0
                      flex-col
                      items-center
                      text-center
                    "
                  >
                    <div
                      className="
                        flex
                        h-[34px]
                        w-[34px]
                        items-center
                        justify-center
                        rounded-full
                        bg-[#09379A]
                        text-white

                        sm:h-[38px]
                        sm:w-[38px]

                        xl:h-[40px]
                        xl:w-[40px]
                      "
                    >
                      <Check
                        size={18}
                        strokeWidth={2.2}
                      />
                    </div>

                    <h3
                      className="
                        m-0
                        mt-[7px]
                        text-[10px]
                        font-bold
                        leading-[16px]
                        text-[#1E293B]

                        sm:text-[11px]

                        xl:text-[13px]
                      "
                    >
                      البيانات الأساسية
                    </h3>

                    <span
                      className="
                        mt-[2px]
                        hidden
                        text-[8px]
                        font-medium
                        text-[#10B981]

                        sm:block
                        sm:text-[9px]
                      "
                    >
                      تم الاكتمال
                    </span>
                  </div>

                  {/* =============================================
                      STEP 2 - ACTIVE
                  ============================================== */}
                  <div
                    className="
                      flex
                      min-w-0
                      flex-col
                      items-center
                      text-center
                    "
                  >
                    <div
                      className="
                        flex
                        h-[34px]
                        w-[34px]
                        items-center
                        justify-center
                        rounded-full
                        bg-[#09379A]
                        text-[12px]
                        font-bold
                        text-white
                        shadow-[0_0_0_4px_#E7EFFF]

                        sm:h-[38px]
                        sm:w-[38px]
                        sm:text-[13px]

                        xl:h-[40px]
                        xl:w-[40px]
                        xl:text-[14px]
                      "
                    >
                      2
                    </div>

                    <h3
                      className="
                        m-0
                        mt-[7px]
                        text-[10px]
                        font-bold
                        leading-[16px]
                        text-[#09379A]

                        sm:text-[11px]

                        xl:text-[13px]
                      "
                    >
                      المستندات
                    </h3>

                    <span
                      className="
                        mt-[3px]
                        inline-flex
                        min-h-[18px]
                        items-center
                        rounded-[5px]
                        bg-[#EFF4FF]
                        px-[6px]
                        text-[8px]
                        font-bold
                        leading-[14px]
                        text-[#09379A]

                        sm:px-[7px]
                        sm:text-[9px]
                      "
                    >
                      الخطوة الحالية
                    </span>
                  </div>

                  {/* =============================================
                      STEP 3
                  ============================================== */}
                  <div
                    className="
                      flex
                      min-w-0
                      flex-col
                      items-center
                      text-center
                    "
                  >
                    <div
                      className="
                        flex
                        h-[34px]
                        w-[34px]
                        items-center
                        justify-center
                        rounded-full
                        border-2
                        border-[#CBD5E1]
                        bg-white
                        text-[12px]
                        font-bold
                        text-[#94A3B8]

                        sm:h-[38px]
                        sm:w-[38px]
                        sm:text-[13px]

                        xl:h-[40px]
                        xl:w-[40px]
                        xl:text-[14px]
                      "
                    >
                      3
                    </div>

                    <h3
                      className="
                        m-0
                        mt-[7px]
                        text-[10px]
                        font-bold
                        leading-[16px]
                        text-[#64748B]

                        sm:text-[11px]

                        xl:text-[13px]
                      "
                    >
                      تأكيد الطلب
                    </h3>

                    <span
                      className="
                        mt-[2px]
                        hidden
                        text-[8px]
                        text-[#94A3B8]

                        sm:block
                        sm:text-[9px]
                      "
                    >
                      المراجعة والإرسال
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                DOCUMENTS HEADER
            ================================================== */}
            <section
              className="
                mt-4
                flex
                flex-col
                gap-3

                sm:flex-row
                sm:items-center
                sm:justify-between

                xl:mt-[14px]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-[8px]
                "
              >
                <span
                  className="
                    h-[23px]
                    w-[4px]
                    shrink-0
                    rounded-full
                    bg-[#09379A]

                    xl:h-[24px]
                  "
                />

                <h2
                  className="
                    m-0
                    text-[15px]
                    font-bold
                    text-[#1E293B]

                    sm:text-[16px]

                    xl:text-[17px]
                  "
                >
                  المستندات المطلوبة
                </h2>
              </div>

              <div
                className="
                  flex
                  min-h-[26px]
                  w-fit
                  max-w-full
                  items-center
                  rounded-[13px]
                  bg-[#F3F6FA]
                  px-[10px]
                  text-[8px]
                  leading-[15px]
                  text-[#64748B]

                  sm:px-[11px]
                  sm:text-[9px]
                "
              >
                الحد الأقصى لحجم الملف: 5 ميجابايت -
                الصيغ المقبولة: PDF, JPG, PNG, DOC
              </div>
            </section>

            {/* =================================================
                DOCUMENTS GRID
            ================================================== */}
            <section
              className="
                mt-3
                grid
                grid-cols-1
                gap-3

                sm:grid-cols-2

                xl:grid-cols-3
                xl:gap-[14px]
              "
            >
              <DocumentCard
                title="كشف علامات حديث"
                description="إلزامي - PDF"
                documentKey="transcript"
                inputRef={
                  transcriptInputRef
                }
                icon={FileText}
                required
                accept=".pdf"
              />

              <DocumentCard
                title="صورة عن الهوية"
                description="PDF, JPG, PNG - سارية"
                documentKey="idCard"
                inputRef={idInputRef}
                icon={FileText}
                required
                accept=".pdf,.jpg,.jpeg,.png"
              />

              <DocumentCard
                title="صورة شخصية رسمية"
                description="يفضل بخلفية رسمية - JPG, PNG"
                documentKey="photo"
                inputRef={photoInputRef}
                icon={Camera}
                required
                accept=".jpg,.jpeg,.png"
              />

              <DocumentCard
                title="رسالة تحفيزية للجهة"
                description="اختياري - PDF, DOC"
                documentKey="recommendation"
                inputRef={letterInputRef}
                icon={Mail}
                accept=".pdf,.doc,.docx"
              />

              <DocumentCard
                title="سيرة ذاتية محدثة"
                description="اختياري - PDF, DOC"
                documentKey="cv"
                inputRef={cvInputRef}
                icon={Image}
                accept=".pdf,.doc,.docx"
              />

              <DocumentCard
                title="أي مستندات إضافية"
                description="شهادات، دورات - اختياري"
                documentKey="extra"
                inputRef={extraInputRef}
                icon={Paperclip}
              />
            </section>

            {/* =================================================
                INFO MESSAGE
            ================================================== */}
            <section
              className="
                mt-4
                flex
                min-h-[42px]
                items-start
                gap-[8px]
                rounded-[9px]
                border
                border-[#BFD6FF]
                bg-[#F2F7FF]
                px-3
                py-[10px]
                text-[9px]
                leading-[17px]
                text-[#64748B]

                sm:items-center
                sm:px-4
                sm:text-[10px]
                sm:leading-[18px]
              "
            >
              <CheckCircle2
                size={16}
                strokeWidth={1.7}
                className="
                  mt-[1px]
                  shrink-0
                  text-[#09379A]

                  sm:mt-0
                "
              />

              <span>
                تم تدقيق المستندات المرفوعة من قبل وحدة
                التدريب الميداني بالكلية قبل إرسال ملف
                الترشيح للمؤسسة الشريكة، يرجى التأكد من
                وضوح الأختام الرسمية في كشف العلامات.
              </span>
            </section>

            {/* =================================================
                REQUIRED MESSAGE
            ================================================== */}
            {!requiredDocumentsComplete && (
              <p
                className="
                  m-0
                  mt-3
                  text-[10px]
                  font-medium
                  text-[#64748B]
                "
              >
                يجب رفع جميع المستندات الإلزامية قبل
                الانتقال إلى تأكيد الطلب.
              </p>
            )}

            {/* =================================================
                ACTIONS
            ================================================== */}
            <section
              className="
                mt-5
                flex
                flex-col
                gap-3

                sm:flex-row
                sm:items-center
                sm:justify-between

                xl:mt-[20px]
              "
            >
              <button
                type="button"
                disabled={
                  !requiredDocumentsComplete ||
                  isUploading
                }
                onClick={handleNext}
                className={`
                  order-1
                  flex
                  h-[44px]
                  w-full
                  items-center
                  justify-center
                  gap-[8px]
                  rounded-[9px]
                  border-0
                  px-[20px]
                  text-[12px]
                  font-bold
                  transition

                  sm:w-auto
                  sm:min-w-[220px]

                  xl:text-[13px]

                  ${
                    requiredDocumentsComplete &&
                    !isUploading
                      ? `
                        cursor-pointer
                        bg-[#09379A]
                        text-white
                        shadow-[0_3px_7px_rgba(9,55,154,0.18)]

                        hover:bg-[#072E81]
                      `
                      : `
                        cursor-not-allowed
                        bg-[#CBD5E1]
                        text-white
                      `
                  }
                `}
              >
                <span>
                  التالي: تأكيد ومراجعة الطلب
                </span>

                <ArrowLeft
                  size={17}
                  strokeWidth={1.8}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/student/apply-training"
                  )
                }
                className="
                  order-2
                  flex
                  h-[40px]
                  w-full
                  cursor-pointer
                  items-center
                  justify-center
                  gap-[7px]
                  rounded-[8px]
                  border
                  border-[#D7DEE9]
                  bg-white
                  px-[16px]
                  text-[11px]
                  font-bold
                  text-[#09379A]
                  transition

                  hover:bg-[#F8FAFC]

                  sm:w-auto
                  sm:h-[38px]
                "
              >
                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                />

                العودة إلى البيانات الأساسية
              </button>
            </section>
          </div>
        
            {submissionError && <div role="alert" className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{submissionError}</div>}
            <AcademicFooter audience="student" />
          </main>
      </div>
    </div>
  );
}