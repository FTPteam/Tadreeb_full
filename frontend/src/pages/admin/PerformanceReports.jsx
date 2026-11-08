import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Plus,
  Eye,
  Download,
  FileText,
  Building2,
  Star,
  CalendarCheck,
  X,
  Printer,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";

const INITIAL_REPORTS = [
  {
    id: 1,
    title: "تقرير أداء الطلاب الفصلي",
    period: "فصل 2024/2025",
    type: "PDF",
    icon: FileText,
    iconClass: "bg-[#E8EEF9] text-[#09379A]",
  },
  {
    id: 2,
    title: "تقرير أداء جهات التدريب",
    period: "فصل 2024/2025",
    type: "PDF",
    icon: Building2,
    iconClass: "bg-[#DDF6FF] text-[#08759B]",
  },
  {
    id: 3,
    title: "تقرير التقييمات النهائية",
    period: "فصل 2024/2025",
    type: "XLSX",
    icon: Star,
    iconClass: "bg-[#FFE5D9] text-[#B54708]",
  },
  {
    id: 4,
    title: "تقرير الحضور الشهري",
    period: "ديسمبر 2025",
    type: "XLSX",
    icon: CalendarCheck,
    iconClass: "bg-[#DCFCE7] text-[#15803D]",
  },
];

function getReportRows(report) {
  // هذه بيانات تعريفية فقط؛ محتوى التقرير الفعلي يحتاج مصدر بيانات من النظام.
  return [
    ["اسم التقرير", report.title],
    ["الفترة", report.period],
    ["صيغة الملف", report.type],
    ["مصدر البيانات", "لم يتم ربط محتوى التقرير بعد"],
  ];
}

function printReport(report) {
  const rows = getReportRows(report);
  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><th>${label}</th><td>${value}</td></tr>`
    )
    .join("");

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    alert("يرجى السماح بالنوافذ المنبثقة لمعاينة التقرير.");
    return;
  }

  printWindow.document.write(`
    <!doctype html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 36px; color: #111c2d; }
          h1 { color: #09379a; font-size: 24px; margin-bottom: 8px; }
          p { color: #64748b; margin-bottom: 28px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #dbe3ef; padding: 14px; text-align: right; }
          th { width: 30%; background: #f1f5f9; }
          .note { margin-top: 24px; padding: 14px; background: #fff7ed; color: #9a3412; }
          @media print { body { padding: 12px; } }
        </style>
      </head>
      <body>
        <h1>${report.title}</h1>
        <p>${report.period}</p>
        <table>${rowsHtml}</table>
        <div class="note">
          هذه معاينة تعريفية مولّدة من الواجهة. لم يتم ربط بيانات التقرير التفصيلية بعد.
        </div>
        <script>
          window.onload = () => window.print();
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

function downloadExcel(report) {
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["بيانات التقرير"],
    ...getReportRows(report),
    [],
    ["ملاحظة", "هذا ملف تعريفي تجريبي؛ بيانات التقرير التفصيلية غير مربوطة."],
  ]);
  worksheet["!cols"] = [{ wch: 24 }, { wch: 55 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "التقرير");
  XLSX.writeFile(workbook, `${report.title}.xlsx`);
}

export default function PerformanceReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState(null);

  const createReport = () => {
    const nextReport = {
      id: Date.now(),
      title: "تقرير أداء جديد",
      period: "فصل 2024/2025",
      type: "PDF",
      icon: FileText,
      iconClass: "bg-[#E8EEF9] text-[#09379A]",
    };
    setReports((previous) => [nextReport, ...previous]);
  };

  const handleDownload = (report) => {
    if (report.type === "PDF") {
      printReport(report);
    } else {
      downloadExcel(report);
    }
  };

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]"
    >
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 pb-7 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1450px]">
            <div className="mb-8 flex items-center gap-2 text-[12px] text-[#64748B]">
              <button onClick={() => navigate("/admin/dashboard")}>
                الرئيسية
              </button>
              <ChevronLeft size={15} />
              <span className="font-semibold text-[#111C2D]">
                تقارير الأداء
              </span>
            </div>

            <section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="m-0 text-[26px] font-bold">تقارير الأداء</h1>
                <p className="m-0 mt-1 text-[13px] text-[#64748B]">
                  تقارير إدارية جاهزة للمعاينة والتنزيل
                </p>
              </div>

              <button
                type="button"
                onClick={createReport}
                className="flex h-[44px] items-center gap-2 rounded-[8px] border-0 bg-[#FF6534] px-5 text-[12px] font-bold text-white hover:bg-[#E95526]"
              >
                <Plus size={17} />
                إنشاء تقرير
              </button>
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {reports.map((report) => {
                const Icon = report.icon;
                return (
                  <article
                    key={report.id}
                    className="rounded-[12px] border border-[#E0E7F2] bg-white p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[9px] ${report.iconClass}`}
                        >
                          <Icon size={20} />
                        </div>
                        <div>
                          <h2 className="m-0 text-[14px] font-bold text-[#111C2D]">
                            {report.title}
                          </h2>
                          <p className="m-0 mt-1 text-[10px] text-[#64748B]">
                            {report.period}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-[#F1F5F9] px-3 py-[5px] text-[9px] font-semibold text-[#475569]">
                        {report.type}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="flex h-[34px] items-center gap-2 rounded-[7px] border border-[#E0E7F2] bg-white px-4 text-[10px] hover:border-[#09379A]"
                      >
                        <Eye size={14} />
                        معاينة
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload(report)}
                        className="flex h-[34px] items-center gap-2 rounded-[7px] border-0 bg-[#09379A] px-4 text-[10px] font-semibold text-white hover:bg-[#072d7d]"
                      >
                        <Download size={14} />
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

      {selectedReport && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/55 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedReport(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-preview-title"
            className="flex max-h-[92vh] w-full max-w-[850px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <h2
                  id="report-preview-title"
                  className="m-0 text-[16px] font-bold text-[#111C2D]"
                >
                  معاينة التقرير
                </h2>
                <p className="m-0 mt-1 text-[11px] text-[#64748B]">
                  {selectedReport.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                aria-label="إغلاق المعاينة"
                className="rounded-lg p-2 text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <X size={20} />
              </button>
            </header>

            <div className="overflow-y-auto bg-[#F8FAFC] p-4 sm:p-7">
              <div className="mx-auto max-w-[680px] rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-8">
                <div className="border-b-2 border-[#09379A] pb-4">
                  <p className="m-0 text-[11px] font-semibold text-[#64748B]">
                    بوابة التدريب الميداني
                  </p>
                  <h3 className="mb-2 mt-3 text-xl font-bold text-[#09379A]">
                    {selectedReport.title}
                  </h3>
                  <p className="m-0 text-xs text-[#64748B]">
                    {selectedReport.period}
                  </p>
                </div>

                <div className="mt-6 overflow-hidden rounded-lg border border-[#E2E8F0]">
                  {getReportRows(selectedReport).map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[minmax(110px,0.7fr)_1.3fr] border-b border-[#E2E8F0] last:border-b-0"
                    >
                      <div className="bg-[#F1F5F9] px-3 py-3 text-xs font-bold text-[#334155]">
                        {label}
                      </div>
                      <div className="px-3 py-3 text-xs text-[#475569]">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] p-4 text-xs leading-6 text-[#9A3412]">
                  هذه معاينة تعريفية مولّدة من الواجهة فقط. لم يتم ربط محتوى
                  التقرير التفصيلي أو سجلاته الفعلية بالـBackend.
                </div>
              </div>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] px-5 py-4">
              <span className="text-[11px] text-[#64748B]">
                صيغة التقرير: {selectedReport.type}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="h-9 rounded-lg border border-[#E0E7F2] px-4 text-xs text-[#334155] hover:bg-[#F8FAFC]"
                >
                  إغلاق
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(selectedReport)}
                  className="flex h-9 items-center gap-2 rounded-lg bg-[#09379A] px-4 text-xs font-semibold text-white hover:bg-[#072d7d]"
                >
                  {selectedReport.type === "PDF" ? (
                    <Printer size={14} />
                  ) : (
                    <FileSpreadsheet size={14} />
                  )}
                  {selectedReport.type === "PDF"
                    ? "طباعة / حفظ PDF"
                    : "تنزيل Excel"}
                </button>
              </div>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
