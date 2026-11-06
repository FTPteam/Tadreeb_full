import AcademicFooter from "../../components/shared/AcademicFooter";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Download,
  FileText,
  History,
  RefreshCw,
  UserX,
  X,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

const availableReports = [
  {
    id: 1,
    type: "attendance",
    title: "تقرير الحضور والغياب",
    meta: "PDF • تقرير الحضور",
  },
  {
    id: 2,
    type: "performance",
    title: "تقرير أداء الطالب",
    meta: "PDF • تقرير الأداء",
  },
  {
    id: 3,
    type: "evaluation",
    title: "تقرير تقييم المدرب",
    meta: "PDF • تقرير التقييم",
  },
  {
    id: 4,
    type: "final",
    title: "تقرير ختامي للتدريب",
    meta: "PDF • التقرير الختامي",
  },
];

const weeklyHours = [
  {
    week: "الأسبوع 1",
    value: 28,
  },
  {
    week: "الأسبوع 2",
    value: 26,
  },
  {
    week: "الأسبوع 3",
    value: 30,
  },
  {
    week: "الأسبوع 4",
    value: 27,
  },
];

export default function Reports() {
  const navigate = useNavigate();

  const [reportType, setReportType] =
    useState("attendance");

  const [trainingProgram, setTrainingProgram] =
    useState("all");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [history, setHistory] =
    useState([]);

  const [historyOpen, setHistoryOpen] =
    useState(false);

  const [error, setError] =
    useState("");

  const selectedReport =
    availableReports.find(
      (report) =>
        report.type === reportType
    ) || availableReports[0];

  /* =========================================================
     DOWNLOAD REPORT
  ========================================================= */

  const handleDownloadReport = (
    report = selectedReport
  ) => {
    setError("");

    if (
      fromDate &&
      toDate &&
      fromDate > toDate
    ) {
      setError(
        "تاريخ البداية يجب ألا يكون بعد تاريخ النهاية."
      );
      return;
    }

    const programNames = {
      all: "جميع البرامج",
      networks: "شبكات واتصالات",
      it: "تقنية المعلومات",
    };

    const reportRows = [
      ["اسم التقرير", report.title],
      [
        "البرنامج التدريبي",
        programNames[trainingProgram],
      ],
      [
        "من تاريخ",
        fromDate || "غير محدد",
      ],
      [
        "إلى تاريخ",
        toDate || "غير محدد",
      ],
      [
        "إجمالي الساعات",
        "120 ساعة",
      ],
      [
        "نسبة الحضور",
        "92%",
      ],
      [
        "عدد أيام الحضور",
        "24 يوما",
      ],
      [
        "عدد مرات الغياب",
        "يومان",
      ],
    ];

    const tableRows =
      reportRows
        .map(
          ([label, value]) => `
            <tr>
              <th>${label}</th>
              <td>${value}</td>
            </tr>
          `
        )
        .join("");

    const printWindow =
      window.open("", "_blank");

    if (!printWindow) {
      setError(
        "تعذر فتح التقرير. يرجى السماح بالنوافذ المنبثقة للصفحة."
      );
      return;
    }

    printWindow.document.open();

    printWindow.document.write(`
      <!DOCTYPE html>

      <html
        lang="ar"
        dir="rtl"
      >
        <head>
          <meta charset="UTF-8" />

          <title>
            ${report.title}
          </title>

          <style>
            body {
              font-family: Tahoma, Arial, sans-serif;
              direction: rtl;
              margin: 40px;
              color: #1e293b;
            }

            h1 {
              color: #09379A;
              font-size: 24px;
              margin-bottom: 8px;
            }

            p {
              color: #64748b;
              font-size: 13px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 28px;
            }

            th,
            td {
              border: 1px solid #dbe3ef;
              padding: 13px;
              text-align: right;
              font-size: 13px;
            }

            th {
              width: 35%;
              background: #f1f5f9;
            }

            @media print {
              body {
                margin: 15mm;
              }
            }
          </style>
        </head>

        <body>
          <h1>
            ${report.title}
          </h1>

          <p>
            بوابة التدريب الميداني — تقرير تجريبي
          </p>

          <p>
            تاريخ الإصدار:
            ${new Date().toLocaleDateString(
              "ar"
            )}
          </p>

          <table>
            ${tableRows}
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();

    setHistory(
      (previous) => [
        {
          id: `${Date.now()}-${report.id}`,
          reportId: report.id,
          title: report.title,
          date: new Date().toLocaleString(
            "ar"
          ),
        },
        ...previous,
      ]
    );

    printWindow.focus();
    printWindow.print();
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
        "
      >
        {/* HEADER */}

        <div className="shrink-0">
          <Header />
        </div>

        {/* =====================================================
            CONTENT
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
            pt-[18px]

            sm:px-[24px]

            xl:px-[40px]
            xl:pb-[40px]
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

            <div
              className="
                flex
                items-center
                gap-[7px]
                text-[12px]
                leading-[20px]

                sm:text-[13px]
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
                التقارير
              </span>
            </div>

            {/* =================================================
                PAGE TITLE
                لا نكبر العنوان الرئيسي
            ================================================== */}

            <section
              className="
                mt-[5px]
              "
            >
              <h1
                className="
                  m-0
                  text-[26px]
                  font-bold
                  leading-[42px]
                  text-[#14213D]

                  sm:text-[30px]
                "
              >
                التقارير
              </h1>
            </section>

            {/* =================================================
                FILTER CARD
            ================================================== */}

            <section
              className="
                mt-[18px]
                w-full
                rounded-[14px]
                border
                border-[#DDE5EF]
                bg-white
                px-4
                py-5
                shadow-[0_1px_2px_rgba(15,23,42,0.03)]

                sm:px-[24px]
                sm:py-[22px]
              "
            >
              {/* ROW 1 */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-[22px]

                  lg:grid-cols-2
                "
              >
                {/* TYPE */}

                <FilterSelect
                  label="نوع التقرير"
                  value={reportType}
                  onChange={(
                    event
                  ) =>
                    setReportType(
                      event.target.value
                    )
                  }
                >
                  {availableReports.map(
                    (report) => (
                      <option
                        key={
                          report.id
                        }
                        value={
                          report.type
                        }
                      >
                        {
                          report.title
                        }
                      </option>
                    )
                  )}
                </FilterSelect>

                {/* DATE RANGE */}

                <div>
                  <label
                    className="
                      mb-[7px]
                      block
                      text-[12px]
                      font-medium
                      leading-[18px]
                      text-[#64748B]
                    "
                  >
                    الفترة الزمنية
                  </label>

                  <div
                    className="
                      flex
                      min-h-[44px]
                      items-center
                      gap-2
                      rounded-[8px]
                      border
                      border-[#D9E2EC]
                      bg-white
                      px-3
                      transition

                      focus-within:border-[#09379A]
                      focus-within:ring-2
                      focus-within:ring-[#09379A]/10
                    "
                  >
                    <CalendarDays
                      size={16}
                      strokeWidth={1.7}
                      className="
                        shrink-0
                        text-[#94A3B8]
                      "
                    />

                    <div
                      className="
                        grid
                        min-w-0
                        flex-1
                        grid-cols-[1fr_auto_1fr]
                        items-center
                        gap-2
                      "
                    >
                      <input
                        aria-label="من تاريخ"
                        type="date"
                        value={
                          fromDate
                        }
                        max={
                          toDate ||
                          undefined
                        }
                        onChange={(
                          event
                        ) =>
                          setFromDate(
                            event
                              .target
                              .value
                          )
                        }
                        className="
                          min-w-0
                          w-full
                          border-0
                          bg-transparent
                          font-['Cairo']
                          text-[11px]
                          text-[#334155]
                          outline-none

                          sm:text-[12px]
                        "
                      />

                      <span
                        className="
                          text-[11px]
                          text-[#94A3B8]
                        "
                      >
                        إلى
                      </span>

                      <input
                        aria-label="إلى تاريخ"
                        type="date"
                        value={toDate}
                        min={
                          fromDate ||
                          undefined
                        }
                        onChange={(
                          event
                        ) =>
                          setToDate(
                            event
                              .target
                              .value
                          )
                        }
                        className="
                          min-w-0
                          w-full
                          border-0
                          bg-transparent
                          font-['Cairo']
                          text-[11px]
                          text-[#334155]
                          outline-none

                          sm:text-[12px]
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 2 */}

              <div
                className="
                  mt-[20px]
                  w-full

                  lg:w-[calc(50%-11px)]
                "
              >
                <FilterSelect
                  label="البرنامج التدريبي"
                  value={
                    trainingProgram
                  }
                  onChange={(
                    event
                  ) =>
                    setTrainingProgram(
                      event.target.value
                    )
                  }
                >
                  <option value="all">
                    جميع البرامج
                  </option>

                  <option value="networks">
                    شبكات واتصالات
                  </option>

                  <option value="it">
                    تقنية المعلومات
                  </option>
                </FilterSelect>
              </div>

              {error && (
                <p
                  role="alert"
                  className="
                    mt-3
                    text-[12px]
                    font-medium
                    text-red-600
                  "
                >
                  {error}
                </p>
              )}

              {/* ACTIONS */}

              <div
                className="
                  mt-[22px]
                  flex
                  flex-wrap
                  items-center
                  justify-start
                  gap-[10px]
                  border-t
                  border-[#EEF2F7]
                  pt-[18px]
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    handleDownloadReport()
                  }
                  className="
                    flex
                    min-h-[42px]
                    items-center
                    justify-center
                    gap-[8px]
                    rounded-[8px]
                    border-0
                    bg-[#09379A]
                    px-[19px]
                    text-[12px]
                    font-bold
                    text-white
                    shadow-[0_3px_7px_rgba(9,55,154,0.18)]
                    transition

                    hover:bg-[#072E81]
                  "
                >
                  <Download
                    size={15}
                  />

                  تحميل تقرير
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setHistoryOpen(
                      true
                    )
                  }
                  className="
                    flex
                    min-h-[42px]
                    items-center
                    justify-center
                    gap-[8px]
                    rounded-[8px]
                    border
                    border-[#C9D9F8]
                    bg-white
                    px-[17px]
                    text-[12px]
                    font-bold
                    text-[#09379A]
                    transition

                    hover:bg-[#F5F8FF]
                  "
                >
                  <History
                    size={15}
                  />

                  سجل التحميل
                </button>
              </div>
            </section>

            {/* =================================================
                STATISTICS
            ================================================== */}

            <section
              className="
                mt-[22px]
                grid
                grid-cols-1
                gap-[18px]

                sm:grid-cols-2

                xl:grid-cols-4
              "
            >
              <StatisticCard
                label="إجمالي الساعات"
                value="120"
                description="ساعة تدريبية معتمدة"
                icon={Clock3}
                iconClass="
                  bg-[#EEF4FF]
                  text-[#09379A]
                "
              />

              <StatisticCard
                label="نسبة الحضور"
                value="92%"
                description="أداء فصلي مرتفع"
                icon={RefreshCw}
                iconClass="
                  bg-[#E9FFF4]
                  text-[#10B981]
                "
                badge="ممتاز"
                valueClass="
                  text-[#09379A]
                "
              />

              <StatisticCard
                label="عدد الأيام الفعلية"
                value="24"
                description="يوما من أصل 26"
                icon={
                  CalendarDays
                }
                iconClass="
                  bg-[#EEF4FF]
                  text-[#09379A]
                "
              />

              <StatisticCard
                label="عدد مرات الغياب"
                value="2"
                description="غياب موثق بعذر"
                icon={UserX}
                iconClass="
                  bg-[#FFF0F0]
                  text-[#EF4444]
                "
                valueClass="
                  text-[#EF4444]
                "
              />
            </section>

            {/* =================================================
                LOWER CONTENT
            ================================================== */}

            <section
              className="
                mt-[22px]
                grid
                grid-cols-1
                items-stretch
                gap-[20px]

                lg:grid-cols-2

                xl:grid-cols-3
              "
            >
              {/* =================================================
                  AVAILABLE REPORTS
              ================================================== */}

              <article
                className="
                  min-w-0
                  rounded-[14px]
                  border
                  border-[#DDE5EF]
                  bg-white
                  px-4
                  py-5
                  shadow-[0_1px_2px_rgba(15,23,42,0.03)]

                  sm:px-[20px]
                "
              >
                <h2
                  className="
                    m-0
                    text-[17px]
                    font-bold
                    text-[#1E293B]
                  "
                >
                  أهم التقارير المتاحة
                </h2>

                <p
                  className="
                    m-0
                    mt-[3px]
                    text-[11px]
                    leading-[19px]
                    text-[#94A3B8]
                  "
                >
                  مستندات وتقارير جاهزة للتصدير
                </p>

                <div
                  className="
                    mt-[18px]
                    flex
                    flex-col
                    gap-[11px]
                  "
                >
                  {availableReports.map(
                    (report) => (
                      <button
                        key={
                          report.id
                        }
                        type="button"
                        onClick={() =>
                          handleDownloadReport(
                            report
                          )
                        }
                        className="
                          flex
                          min-h-[63px]
                          w-full
                          items-center
                          justify-between
                          gap-[10px]
                          rounded-[9px]
                          border
                          border-[#E7ECF2]
                          bg-white
                          px-[12px]
                          text-right
                          transition

                          hover:border-[#C9D7EA]
                          hover:bg-[#F8FAFC]
                        "
                      >
                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-[10px]
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
                              bg-[#EEF4FF]
                              text-[#09379A]
                            "
                          >
                            <FileText
                              size={
                                16
                              }
                            />
                          </div>

                          <div className="min-w-0">
                            <h3
                              className="
                                m-0
                                text-[12px]
                                font-bold
                                text-[#334155]
                              "
                            >
                              {
                                report.title
                              }
                            </h3>

                            <p
                              className="
                                m-0
                                mt-[4px]
                                text-[10px]
                                text-[#94A3B8]
                              "
                            >
                              اضغط
                              لعرض
                              التقرير
                              وحفظه
                            </p>
                          </div>
                        </div>

                        <Download
                          size={14}
                          className="
                            shrink-0
                            text-[#94A3B8]
                          "
                        />
                      </button>
                    )
                  )}
                </div>

                <div
                  className="
                    mt-[18px]
                    flex
                    items-center
                    gap-[6px]
                    border-t
                    border-[#EEF2F7]
                    pt-[12px]
                    text-[10px]
                    leading-[18px]
                    text-[#94A3B8]
                  "
                >
                  <span
                    className="
                      h-[6px]
                      w-[6px]
                      shrink-0
                      rounded-full
                      bg-[#10B981]
                    "
                  />

                  التقارير المعروضة تجريبية وغير مرتبطة
                  بقاعدة بيانات فعلية.
                </div>
              </article>

              {/* =================================================
                  WEEKLY HOURS
                  مطابق أكثر للصورة
              ================================================== */}

              <article
                className="
                  min-w-0
                  rounded-[14px]
                  border
                  border-[#DDE5EF]
                  bg-white
                  px-4
                  py-5
                  shadow-[0_1px_2px_rgba(15,23,42,0.03)]

                  sm:px-[20px]
                "
              >
                <h2
                  className="
                    m-0
                    text-[17px]
                    font-bold
                    text-[#1E293B]
                  "
                >
                  توزيع الساعات حسب الأسابيع
                </h2>

                <p
                  className="
                    m-0
                    mt-[3px]
                    text-[11px]
                    leading-[19px]
                    text-[#94A3B8]
                  "
                >
                  معدل الساعات المنجزة أسبوعيا
                </p>

                {/* CHART */}

                <div
                  className="
                    relative
                    mt-[24px]
                    h-[218px]
                    w-full
                    overflow-hidden
                  "
                >
                  {/* 40 HOURS LINE */}

                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      top-[15px]
                      border-t
                      border-dashed
                      border-[#E8EEF5]
                    "
                  >
                    <span
                      className="
                        absolute
                        -top-[17px]
                        left-0
                        text-[9px]
                        text-[#94A3B8]
                      "
                    >
                      40 س
                    </span>
                  </div>

                  {/* 20 HOURS LINE */}

                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      top-[96px]
                      border-t
                      border-dashed
                      border-[#E8EEF5]
                    "
                  >
                    <span
                      className="
                        absolute
                        -top-[16px]
                        left-0
                        text-[9px]
                        text-[#94A3B8]
                      "
                    >
                      20 س
                    </span>
                  </div>

                  {/* BASE LINE */}

                  <div
                    className="
                      absolute
                      bottom-[34px]
                      left-0
                      right-0
                      border-t
                      border-[#E8EEF5]
                    "
                  />

                  {/* COLUMNS */}

                  <div
                    className="
                      absolute
                      inset-x-[8px]
                      bottom-0
                      top-[18px]
                      flex
                      items-end
                      justify-between
                      gap-[12px]

                      sm:gap-[18px]
                    "
                  >
                    {weeklyHours.map(
                      (item) => {
                        const barHeight =
                          Math.max(
                            20,
                            (item.value /
                              40) *
                              142
                          );

                        return (
                          <div
                            key={
                              item.week
                            }
                            className="
                              flex
                              h-full
                              min-w-0
                              flex-1
                              flex-col
                              items-center
                              justify-end
                            "
                          >
                            {/* VALUE */}

                            <span
                              className="
                                mb-[5px]
                                text-[10px]
                                font-bold
                                text-[#64748B]
                              "
                            >
                              {
                                item.value
                              }
                            </span>

                            {/* BAR */}

                            <div
                              className="
                                flex
                                h-[142px]
                                w-full
                                items-end
                                justify-center
                              "
                            >
                              <div
                                title={`${item.week}: ${item.value} ساعة`}
                                className="
                                  w-full
                                  max-w-[46px]
                                  rounded-t-[6px]
                                  bg-[#09379A]
                                  shadow-[0_2px_5px_rgba(9,55,154,0.08)]
                                  transition

                                  hover:bg-[#1749B8]

                                  sm:max-w-[52px]
                                "
                                style={{
                                  height: `${barHeight}px`,
                                }}
                              />
                            </div>

                            {/* WEEK */}

                            <span
                              className="
                                mt-[9px]
                                whitespace-nowrap
                                text-[10px]
                                font-medium
                                text-[#64748B]

                                sm:text-[11px]
                              "
                            >
                              {
                                item.week
                              }
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* FOOTER */}

                <div
                  className="
                    mt-[10px]
                    border-t
                    border-[#EEF2F7]
                    pt-[16px]
                    text-center
                  "
                >
                  <p
                    className="
                      m-0
                      text-[11px]
                      font-semibold
                      leading-[19px]
                      text-[#10A36A]
                    "
                  >
                    المتوسط الأسبوعي المطلوب:
                    30 ساعة / مكتمل
                  </p>

                  <p
                    className="
                      m-0
                      mt-[4px]
                      text-[11px]
                      font-bold
                      text-[#10A36A]
                    "
                  >
                    100%
                  </p>
                </div>
              </article>

              {/* =================================================
                  ATTENDANCE DONUT
              ================================================== */}

              <article
                className="
                  min-w-0
                  rounded-[14px]
                  border
                  border-[#DDE5EF]
                  bg-white
                  px-4
                  py-5
                  shadow-[0_1px_2px_rgba(15,23,42,0.03)]

                  sm:px-[20px]

                  lg:col-span-2

                  xl:col-span-1
                "
              >
                <h2
                  className="
                    m-0
                    text-[17px]
                    font-bold
                    text-[#1E293B]
                  "
                >
                  نسبة الحضور والغياب
                </h2>

                <p
                  className="
                    m-0
                    mt-[3px]
                    text-[11px]
                    leading-[19px]
                    text-[#94A3B8]
                  "
                >
                  توزيع أيام التدريب الفعلي
                </p>

                <div
                  className="
                    mt-[32px]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <div
                    role="img"
                    aria-label="نسبة الحضور 92 بالمئة"
                    className="
                      relative
                      h-[160px]
                      w-[160px]
                      rounded-full
                    "
                    style={{
                      background:
                        "conic-gradient(#10B981 0deg 331.2deg, #EF4444 331.2deg 360deg)",
                    }}
                  >
                    <div
                      className="
                        absolute
                        inset-[16px]
                        flex
                        flex-col
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                      "
                    >
                      <strong
                        className="
                          text-[27px]
                          font-bold
                          leading-[30px]
                          text-[#1E293B]
                        "
                      >
                        92%
                      </strong>

                      <span
                        className="
                          mt-[3px]
                          text-[10px]
                          text-[#94A3B8]
                        "
                      >
                        نسبة الالتزام
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="
                    mt-[38px]
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-x-[28px]
                    gap-y-3
                    border-t
                    border-[#EEF2F7]
                    pt-[14px]
                    text-[10px]
                    text-[#64748B]
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-[6px]
                    "
                  >
                    <span
                      className="
                        h-[7px]
                        w-[7px]
                        rounded-full
                        bg-[#10B981]
                      "
                    />

                    حاضر (24 يوما)
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-[6px]
                    "
                  >
                    <span
                      className="
                        h-[7px]
                        w-[7px]
                        rounded-full
                        bg-[#EF4444]
                      "
                    />

                    غائب (يومان)
                  </div>
                </div>
              </article>
            </section>
          </div>
        
            <AcademicFooter audience="student" />
          </main>
      </div>

      {/* =====================================================
          DOWNLOAD HISTORY
      ====================================================== */}

      {historyOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-900/40
            p-4
          "
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setHistoryOpen(
                false
              );
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-history-title"
            className="
              max-h-[85dvh]
              w-full
              max-w-[480px]
              overflow-y-auto
              rounded-[14px]
              border
              border-[#DDE5EF]
              bg-white
              p-5
              shadow-2xl

              sm:p-6
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div>
                <h2
                  id="download-history-title"
                  className="
                    text-[17px]
                    font-bold
                    text-[#14213D]
                  "
                >
                  سجل التحميل
                </h2>

                <p
                  className="
                    mt-1
                    text-[11px]
                    leading-[19px]
                    text-[#94A3B8]
                  "
                >
                  التقارير التي طلبت عرضها خلال
                  الجلسة الحالية
                </p>
              </div>

              <button
                type="button"
                aria-label="إغلاق"
                onClick={() =>
                  setHistoryOpen(
                    false
                  )
                }
                className="
                  rounded-lg
                  p-2
                  text-slate-500
                  transition

                  hover:bg-slate-100
                "
              >
                <X size={18} />
              </button>
            </div>

            {history.length === 0 ? (
              <div
                className="
                  py-10
                  text-center
                "
              >
                <History
                  className="
                    mx-auto
                    text-slate-300
                  "
                  size={30}
                />

                <p
                  className="
                    mt-3
                    text-[13px]
                    font-medium
                    text-slate-600
                  "
                >
                  لا توجد تقارير في سجل التحميل حتى
                  الآن.
                </p>

                <p
                  className="
                    mt-1
                    text-[11px]
                    text-slate-400
                  "
                >
                  عند فتح تقرير من القائمة سيظهر هنا.
                </p>
              </div>
            ) : (
              <div
                className="
                  mt-5
                  space-y-3
                "
              >
                {history.map(
                  (item) => (
                    <div
                      key={
                        item.id
                      }
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        rounded-lg
                        border
                        border-[#E7ECF2]
                        p-3
                      "
                    >
                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-3
                        "
                      >
                        <span
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#EEF4FF]
                            text-[#09379A]
                          "
                        >
                          <FileText
                            size={
                              17
                            }
                          />
                        </span>

                        <div className="min-w-0">
                          <p
                            className="
                              text-[12px]
                              font-bold
                              text-slate-700
                            "
                          >
                            {
                              item.title
                            }
                          </p>

                          <p
                            className="
                              mt-1
                              text-[10px]
                              text-slate-400
                            "
                          >
                            {
                              item.date
                            }
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const report =
                            availableReports.find(
                              (
                                entry
                              ) =>
                                entry.id ===
                                item.reportId
                            );

                          if (
                            report
                          ) {
                            handleDownloadReport(
                              report
                            );
                          }
                        }}
                        className="
                          shrink-0
                          rounded-lg
                          p-2
                          text-[#09379A]
                          transition

                          hover:bg-blue-50
                        "
                        aria-label={`فتح ${item.title}`}
                      >
                        <Download
                          size={
                            16
                          }
                        />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                setHistoryOpen(
                  false
                )
              }
              className="
                mt-5
                min-h-[40px]
                w-full
                rounded-lg
                bg-[#09379A]
                px-4
                text-[12px]
                font-bold
                text-white
                transition

                hover:bg-[#072E81]
              "
            >
              إغلاق
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({
  label,
  value,
  onChange,
  children,
}) {
  return (
    <div className="min-w-0">
      <label
        className="
          mb-[7px]
          block
          text-[12px]
          font-medium
          leading-[18px]
          text-[#64748B]
        "
      >
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="
            h-[44px]
            w-full
            appearance-none
            rounded-[8px]
            border
            border-[#D9E2EC]
            bg-white
            px-[13px]
            pl-[36px]
            font-['Cairo']
            text-[12px]
            text-[#334155]
            outline-none
            transition

            focus:border-[#09379A]
            focus:ring-2
            focus:ring-[#09379A]/10
          "
        >
          {children}
        </select>

        <ChevronDown
          size={15}
          className="
            pointer-events-none
            absolute
            left-[12px]
            top-1/2
            -translate-y-1/2
            text-[#94A3B8]
          "
        />
      </div>
    </div>
  );
}

/* =========================================================
   STATISTIC CARD
   الأيقونة يمين والكلام يسار
========================================================= */

function StatisticCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
  valueClass = "text-[#14213D]",
  badge,
}) {
  return (
    <article
      className="
        min-h-[140px]
        rounded-[14px]
        border
        border-[#DDE5EF]
        bg-white
        px-[18px]
        py-[18px]
        shadow-[0_1px_2px_rgba(15,23,42,0.03)]
      "
    >
      <div
        className="
          flex
          h-full
          items-start
          justify-between
          gap-4
        "
      >
        {/* ICON — RIGHT */}

        <div
          className={`
            flex
            h-[38px]
            w-[38px]
            shrink-0
            items-center
            justify-center
            rounded-[9px]

            ${iconClass}
          `}
        >
          <Icon
            size={18}
            strokeWidth={1.8}
          />
        </div>

        {/* CONTENT — LEFT */}

        <div
          className="
            min-w-0
            flex-1
            text-left
          "
          dir="rtl"
        >
          <p
            className="
              m-0
              text-[12px]
              font-medium
              leading-[20px]
              text-[#64748B]
            "
          >
            {label}
          </p>

          <div
            className="
              mt-[12px]
              flex
              flex-wrap
              items-center
              justify-end
              gap-[7px]
            "
          >
            {badge && (
              <span
                className="
                  flex
                  min-h-[22px]
                  items-center
                  rounded-full
                  bg-[#E9FFF4]
                  px-[8px]
                  text-[9px]
                  font-bold
                  text-[#16A34A]
                "
              >
                {badge}
              </span>
            )}

            <strong
              className={`
                text-[30px]
                font-bold
                leading-[34px]

                ${valueClass}
              `}
            >
              {value}
            </strong>
          </div>

          <p
            className="
              m-0
              mt-[7px]
              text-[11px]
              leading-[19px]
              text-[#64748B]
            "
          >
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}