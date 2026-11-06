
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileCheck,
  FileText,
  Building2,
  Star,
  UserRoundPlus,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import AdminPageLayout, {
  ExportButton,
  exportCsv,
} from "../../components/admin/AdminPageLayout";

const PAGE_SIZE = 6;

const ACTIVITIES = [
  {
    id: 1,
    type: "requests",
    title: "تم قبول طلب الطالب محمود رضوان",
    detail: "بواسطة: د. سامر يوسف",
    time: "منذ 20 دقيقة",
    icon: FileCheck,
    color: "green",
    path: "/admin/training-requests",
  },
  {
    id: 2,
    type: "reports",
    title: "تقرير أسبوعي جديد من أمل أحمد",
    detail: "الأسبوع 3",
    time: "منذ ساعة",
    icon: FileText,
    color: "blue",
    path: "/admin/reports",
  },
  {
    id: 3,
    type: "organizations",
    title: "اعتماد جهة تدريب جديدة: شركة جوال",
    detail: "بواسطة: د. سامر يوسف",
    time: "10:30 ص",
    icon: Building2,
    color: "cyan",
    path: "/admin/training-organizations",
  },
  {
    id: 4,
    type: "evaluations",
    title: "اكتمل تقييم الطالب أنس البيطار",
    detail: "4.5 من 5",
    time: "أمس",
    icon: Star,
    color: "orange",
    path: "/admin/evaluations",
  },
  {
    id: 5,
    type: "requests",
    title: "إضافة الطالبة هدى شهر",
    detail: "التصميم الجرافيكي والفنون الرقمية",
    time: "أمس",
    icon: UserRoundPlus,
    color: "blue",
    path: "/admin/students",
  },
  {
    id: 6,
    type: "requests",
    title: "رفض طلب الطالب بلال الشيخ",
    detail: "جهة التدريب غير مناسبة للتخصص",
    time: "2025/12/20",
    icon: X,
    color: "orange",
    path: "/admin/training-requests",
  },
  {
    id: 7,
    type: "reports",
    title: "تمت مراجعة تقرير الأسبوع الثاني",
    detail: "الطالبة أمل أحمد",
    time: "2025/12/19",
    icon: FileText,
    color: "blue",
    path: "/admin/reports",
  },
  {
    id: 8,
    type: "organizations",
    title: "إضافة مركز تدريب جديد",
    detail: "مركز الصيانة الفنية المتقدم",
    time: "2025/12/18",
    icon: Building2,
    color: "cyan",
    path: "/admin/training-organizations",
  },
  {
    id: 9,
    type: "evaluations",
    title: "تقييم جديد للطالب محمود رضوان",
    detail: "4.3 من 5",
    time: "2025/12/17",
    icon: Star,
    color: "orange",
    path: "/admin/evaluations",
  },
  {
    id: 10,
    type: "reports",
    title: "رفع تقرير تدريبي جديد",
    detail: "الأسبوع الثاني",
    time: "2025/12/16",
    icon: FileText,
    color: "blue",
    path: "/admin/reports",
  },
  {
    id: 11,
    type: "requests",
    title: "قبول طلب تدريب جديد",
    detail: "تخصص تكنولوجيا علم البيانات",
    time: "2025/12/15",
    icon: FileCheck,
    color: "green",
    path: "/admin/training-requests",
  },
  {
    id: 12,
    type: "organizations",
    title: "تحديث بيانات إحدى جهات التدريب",
    detail: "شركة القدس للاتصالات",
    time: "2025/12/14",
    icon: Building2,
    color: "cyan",
    path: "/admin/training-organizations",
  },
];

const TABS = [
  { id: "all", label: "الكل" },
  { id: "requests", label: "الطلبات" },
  { id: "reports", label: "التقارير" },
  { id: "evaluations", label: "التقييمات" },
  { id: "organizations", label: "جهات التدريب" },
];

const ICON_COLORS = {
  blue: "bg-[#E6EBF5] text-[#09379A]",
  green: "bg-[#DCFCE7] text-[#15803D]",
  orange: "bg-[#FFE5D9] text-[#B54708]",
  cyan: "bg-[#DDF6FF] text-[#08759B]",
};

export default function RecentActivities() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredActivities = useMemo(
    () =>
      ACTIVITIES.filter(
        (item) => activeTab === "all" || item.type === activeTab
      ),
    [activeTab]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredActivities.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleActivities = filteredActivities.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleExport = () => {
    exportCsv(
      "recent-activities.csv",
      ["النشاط", "التفاصيل", "الوقت", "التصنيف"],
      filteredActivities.map((item) => [
        item.title,
        item.detail,
        item.time,
        TABS.find((tab) => tab.id === item.type)?.label || "",
      ])
    );
  };

  return (
    <AdminPageLayout breadcrumb="أحدث الأنشطة">
      {/* PAGE TITLE */}
      <section className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[25px] font-bold">
            أحدث الأنشطة
          </h1>
          <p className="m-0 mt-1 text-[13px] text-[#64748B]">
            سجل نشاط المشرف والطلاب
          </p>
        </div>

        <ExportButton onClick={handleExport} />
      </section>

      {/* TABS */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
            }}
            className={`rounded-full border px-5 py-2 text-[12px] transition ${
              activeTab === tab.id
                ? "border-[#09379A] bg-[#09379A] font-semibold text-white"
                : "border-[#E0E7F2] bg-white text-[#64748B] hover:border-[#09379A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ACTIVITIES */}
      <section className="rounded-[12px] border border-[#E0E7F2] bg-white px-5 py-5 sm:px-6">
        {visibleActivities.length > 0 ? (
          visibleActivities.map((activity) => {
            const Icon = activity.icon;

            return (
              <button
                key={activity.id}
                type="button"
                onClick={() => navigate(activity.path)}
                className="flex w-full items-center gap-4 border-b border-[#E6EBF5] py-4 text-right transition last:border-0 hover:bg-[#FAFBFE]"
              >
                <span
                  className={`flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[9px] ${
                    ICON_COLORS[activity.color]
                  }`}
                >
                  <Icon size={21} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold leading-6">
                    {activity.title}
                  </span>
                  <span className="mt-1 block text-[12px] text-[#64748B]">
                    {activity.detail}
                  </span>
                </span>

                <span className="shrink-0 text-[11px] text-[#64748B] sm:text-[12px]">
                  {activity.time}
                </span>
              </button>
            );
          })
        ) : (
          <p className="py-10 text-center text-[13px] text-[#64748B]">
            لا توجد أنشطة ضمن هذا التصنيف.
          </p>
        )}
      </section>

      {/* PAGINATION */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-[12px] text-[#64748B]">
          عرض{" "}
          {filteredActivities.length
            ? (safePage - 1) * PAGE_SIZE + 1
            : 0}
          {" - "}
          {Math.min(
            safePage * PAGE_SIZE,
            filteredActivities.length
          )}
          {" من "}
          {filteredActivities.length} نشاطًا
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setCurrentPage(safePage - 1)}
            className="flex h-[35px] items-center gap-1 rounded-full border border-[#E0E7F2] bg-white px-3 text-[11px] disabled:opacity-40"
          >
            <ChevronRight size={14} />
            السابق
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`h-[35px] min-w-[35px] rounded-full border text-[11px] ${
                page === safePage
                  ? "border-[#09379A] bg-[#09379A] text-white"
                  : "border-[#E0E7F2] bg-white"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage(safePage + 1)}
            className="flex h-[35px] items-center gap-1 rounded-full border border-[#E0E7F2] bg-white px-3 text-[11px] disabled:opacity-40"
          >
            التالي
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>
    </AdminPageLayout>
  );
}
