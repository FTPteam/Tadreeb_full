import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Menu,
  ChevronLeft,
  Plus,
  Eye,
  Download,
  FileText,
  Building2,
  Star,
  CalendarCheck,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

const INITIAL_REPORTS = [
  {
    id: 1,
    title: "تقرير أداء الطلاب الفصلي",
    period: "فصل 2024/2025",
    type: "PDF",
    icon: FileText,
    iconClass:
      "bg-[#E8EEF9] text-[#09379A]",
  },
  {
    id: 2,
    title: "تقرير أداء جهات التدريب",
    period: "فصل 2024/2025",
    type: "PDF",
    icon: Building2,
    iconClass:
      "bg-[#DDF6FF] text-[#08759B]",
  },
  {
    id: 3,
    title: "تقرير التقييمات النهائية",
    period: "فصل 2024/2025",
    type: "XLSX",
    icon: Star,
    iconClass:
      "bg-[#FFE5D9] text-[#B54708]",
  },
  {
    id: 4,
    title: "تقرير الحضور الشهري",
    period: "ديسمبر 2025",
    type: "XLSX",
    icon: CalendarCheck,
    iconClass:
      "bg-[#DCFCE7] text-[#15803D]",
  },
];

export default function PerformanceReports() {
  const navigate = useNavigate();

  const [reports, setReports] =
    useState(INITIAL_REPORTS);

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-student-sidebar")
    );
  };

  const createReport = () => {
    const nextReport = {
      id: Date.now(),
      title: "تقرير أداء جديد",
      period: "فصل 2024/2025",
      type: "PDF",
      icon: FileText,
      iconClass:
        "bg-[#E8EEF9] text-[#09379A]",
    };

    setReports((previous) => [
      nextReport,
      ...previous,
    ]);
  };

  const downloadReport = (report) => {
    const content = `
${report.title}
${report.period}
نوع الملف: ${report.type}
`;

    const blob = new Blob(
      [content],
      {
        type: "text/plain;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `${report.title}.txt`;

    link.click();

    URL.revokeObjectURL(url);
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
      <Sidebar />

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
        {/* HEADER */}

        <AdminHeader />

        {/* CONTENT */}

        <main
          className="
            flex-1
            overflow-x-hidden
            overflow-y-auto
            px-4
            pb-7
            pt-5
            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              mx-auto
              max-w-[1450px]
            "
          >
            {/* BREADCRUMB */}

            <div
              className="
                mb-8
                flex
                items-center
                gap-2
                text-[12px]
                text-[#64748B]
              "
            >
              <button
                onClick={() =>
                  navigate(
                    "/admin/dashboard"
                  )
                }
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
                تقارير الأداء
              </span>
            </div>

            {/* TITLE */}

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
                  "
                >
                  تقارير الأداء
                </h1>

                <p
                  className="
                    m-0
                    mt-1
                    text-[13px]
                    text-[#64748B]
                  "
                >
                  تقارير إدارية جاهزة للتنزيل
                </p>
              </div>

              <button
                type="button"
                onClick={createReport}
                className="
                  flex
                  h-[44px]
                  items-center
                  gap-2
                  rounded-[8px]
                  border-0
                  bg-[#FF6534]
                  px-5
                  text-[12px]
                  font-bold
                  text-white
                  hover:bg-[#E95526]
                "
              >
                <Plus size={17} />

                إنشاء تقرير
              </button>
            </section>

            {/* REPORTS */}

            <section
              className="
                grid
                grid-cols-1
                gap-5
                xl:grid-cols-2
              "
            >
              {reports.map((report) => {
                const Icon =
                  report.icon;

                return (
                  <article
                    key={report.id}
                    className="
                      rounded-[12px]
                      border
                      border-[#E0E7F2]
                      bg-white
                      p-6
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >
                      <div
                        className="
                          flex
                          items-start
                          gap-3
                        "
                      >
                        <div
                          className={`
                            flex
                            h-[46px]
                            w-[46px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-[9px]
                            ${report.iconClass}
                          `}
                        >
                          <Icon
                            size={20}
                          />
                        </div>

                        <div>
                          <h2
                            className="
                              m-0
                              text-[14px]
                              font-bold
                              text-[#111C2D]
                            "
                          >
                            {report.title}
                          </h2>

                          <p
                            className="
                              m-0
                              mt-1
                              text-[10px]
                              text-[#64748B]
                            "
                          >
                            {report.period}
                          </p>
                        </div>
                      </div>

                      <span
                        className="
                          rounded-full
                          bg-[#F1F5F9]
                          px-3
                          py-[5px]
                          text-[9px]
                          font-semibold
                          text-[#475569]
                        "
                      >
                        {report.type}
                      </span>
                    </div>

                    <div
                      className="
                        mt-5
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            `معاينة: ${report.title}`
                          )
                        }
                        className="
                          flex
                          h-[34px]
                          items-center
                          gap-2
                          rounded-[7px]
                          border
                          border-[#E0E7F2]
                          bg-white
                          px-4
                          text-[10px]
                          hover:border-[#09379A]
                        "
                      >
                        <Eye size={14} />
                        معاينة
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          downloadReport(
                            report
                          )
                        }
                        className="
                          flex
                          h-[34px]
                          items-center
                          gap-2
                          rounded-[7px]
                          border-0
                          bg-[#09379A]
                          px-4
                          text-[10px]
                          font-semibold
                          text-white
                        "
                      >
                        <Download
                          size={14}
                        />

                        تنزيل
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}

function UserInfo() {
  return (
    <div className="flex items-center gap-2">
      <div
        className="
          flex
          h-[44px]
          w-[44px]
          items-center
          justify-center
          rounded-full
          bg-[#E6EBF5]
          text-[12px]
          font-bold
          text-[#09379A]
        "
      >
        سم
      </div>

      <div>
        <p className="m-0 text-[12px] font-bold">
          د. سامر يوسف
        </p>

        <p className="m-0 text-[10px] text-[#64748B]">
          مشرف أكاديمي
        </p>
      </div>
    </div>
  );
}

