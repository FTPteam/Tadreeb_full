import AcademicFooter from "../shared/AcademicFooter";
import Header from "./Header";

import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AdminPageLayout({
  children,
  breadcrumb,
  className = "",
}) {
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]"
    >
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <Header />

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-7 pt-5 sm:px-6 lg:px-8">
          <div
            className={`mx-auto w-full max-w-[1450px] ${className}`}
          >
            {breadcrumb && (
              <nav
                aria-label="مسار الصفحة"
                className="mb-4 flex items-center gap-2 text-[12px] text-[#64748B]"
              >
                <button
                  type="button"
                  onClick={() => navigate("/admin/dashboard")}
                  className="hover:text-[#09379A]"
                >
                  الرئيسية
                </button>
                <ChevronLeft size={15} />
                <span className="font-semibold text-[#111C2D]">
                  {breadcrumb}
                </span>
              </nav>
            )}

            {children}

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardPanel({ title, action, children }) {
  return (
    <section className="min-w-0 rounded-[12px] border border-[#E0E7F2] bg-white p-4 sm:p-5">
      <div className="mb-2 flex items-center justify-between gap-3 border-b border-[#E6EBF5] pb-4">
        <h2 className="m-0 text-[16px] font-bold text-[#062569]">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}


export function DashboardStat({
  label,
  value,
  unit,
  icon: Icon,
  color = "blue",
  onClick,
}) {
  const colors = {
    blue: "bg-[#E6EBF5] text-[#09379A]",
    green: "bg-[#DCFCE7] text-[#15803D]",
    orange: "bg-[#FFE5D9] text-[#B54708]",
    cyan: "bg-[#DDF6FF] text-[#08759B]",
  };

  const Component = onClick ? "button" : "article";

  return (
    <Component
      {...(onClick ? { type: "button", onClick } : {})}
      dir="rtl"
      className={`w-full rounded-[12px] border border-[#E0E7F2] bg-white p-5 text-right ${
        onClick
          ? "transition hover:border-[#09379A] hover:shadow-sm"
          : ""
      }`}
    >
      {/* ICON RIGHT / LABEL LEFT */}
      <div className="flex w-full items-center justify-between gap-3">
        <span
          className={`order-1 flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-[9px] ${
            colors[color] || colors.blue
          }`}
        >
          <Icon size={21} />
        </span>

        <span className="order-2 min-w-0 text-left text-[12px] font-medium text-[#111C2D]">
          {label}
        </span>
      </div>

      {/* VALUE RIGHT / UNIT NEXT TO VALUE */}
      <div className="mt-5 flex w-full items-baseline justify-start gap-2 text-right">
        <strong className="text-[30px] font-bold leading-none text-[#062569] sm:text-[35px]">
          {value}
        </strong>

        {unit && (
          <span className="text-[11px] text-[#64748B]">
            {unit}
          </span>
        )}
      </div>
    </Component>
  );
}


export function ExportButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[43px] items-center justify-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px] font-semibold transition hover:border-[#09379A] hover:text-[#09379A]"
    >
      <span>تصدير</span>
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v12m-4-4 4 4 4-4M5 17v4h14v-4" />
      </svg>
    </button>
  );
}

export function exportCsv(filename, headers, rows) {
  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((value) =>
          `"${String(value ?? "").replaceAll('"', '""')}"`
        )
        .join(",")
    )
    .join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
