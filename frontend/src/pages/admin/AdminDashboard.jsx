
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileCheck,
  Building2,
  Activity,
  FileText,
  Star,
  Clock3,
  AlertTriangle,
  CalendarClock,
  ChevronLeft,
} from "lucide-react";

import AdminPageLayout, {
  DashboardPanel,
  DashboardStat,
} from "../../components/admin/AdminPageLayout";

const ACTIVITIES = [
  {
    title: "تم قبول طلب الطالب محمود رضوان",
    time: "منذ 20 دقيقة",
    icon: FileCheck,
    color: "green",
    path: "/admin/training-requests",
  },
  {
    title: "تقرير أسبوعي جديد من أمل أحمد",
    time: "منذ ساعة",
    icon: FileText,
    color: "blue",
    path: "/admin/reports",
  },
  {
    title: "اعتماد جهة تدريب جديدة: شركة جوال",
    time: "اليوم",
    icon: Building2,
    color: "cyan",
    path: "/admin/training-organizations",
  },
  {
    title: "اكتمل تقييم الطالب أنس البيطار",
    time: "أمس",
    icon: Star,
    color: "orange",
    path: "/admin/evaluations",
  },
];

const ALERTS = [
  {
    title: "3 طلاب متأخرون في تسليم التقرير الأسبوعي",
    time: "اليوم",
    icon: AlertTriangle,
    color: "orange",
    path: "/admin/reports",
  },
  {
    title: "تنتهي فترة تدريب 12 طالبًا خلال أسبوع",
    time: "غدًا",
    icon: CalendarClock,
    color: "blue",
    path: "/admin/training-monitoring",
  },
];

const TRAINING_STATUSES = [
  { label: "قيد التدريب", value: 248, color: "bg-[#09379A]" },
  { label: "لم يبدأ", value: 38, color: "bg-[#09379A]" },
  { label: "منتهٍ", value: 18, color: "bg-[#15803D]" },
  { label: "متعثر", value: 8, color: "bg-[#09379A]" },
];

const ICON_COLORS = {
  blue: "bg-[#E6EBF5] text-[#09379A]",
  green: "bg-[#DCFCE7] text-[#15803D]",
  orange: "bg-[#FFE5D9] text-[#B54708]",
  cyan: "bg-[#DDF6FF] text-[#08759B]",
};

function IconTile({ icon: Icon, color }) {
  return (
    <span
      className={`flex h-[41px] w-[41px] shrink-0 items-center justify-center rounded-[8px] ${
        ICON_COLORS[color]
      }`}
    >
      <Icon size={19} />
    </span>
  );
}

function ViewAllButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-[7px] border border-[#09379A] px-3 py-1.5 text-[11px] font-semibold text-[#09379A] transition hover:bg-[#EEF4FF]"
    >
      عرض الكل
      <ChevronLeft size={14} />
    </button>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <AdminPageLayout className="space-y-5">
      {/* WELCOME */}
      <section className="rounded-[12px] bg-[#09379A] px-6 py-7 text-white">
        <h1 className="m-0 text-[23px] font-bold">
          مرحبًا د. سامر
        </h1>
        <p className="m-0 mt-2 text-[12px] text-[#D8E5FB]">
          نظرة عامة على طلباتك وجهات التدريب
        </p>
      </section>

      {/* MAIN STATISTICS */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <DashboardStat
          label="إجمالي الطلاب المتدربين"
          value="312"
          unit="طالب"
          icon={Users}
          color="blue"
          onClick={() => navigate("/admin/student-statistics")}
        />

        <DashboardStat
          label="الطلاب النشطون"
          value="248"
          unit="طالب"
          icon={Activity}
          color="green"
          onClick={() => navigate("/admin/training-statistics")}
        />

        <DashboardStat
          label="لم يبدأوا التدريب"
          value="38"
          unit="طالب"
          icon={Clock3}
          color="orange"
          onClick={() => navigate("/admin/training-statistics")}
        />

        <DashboardStat
          label="جهات التدريب"
          value="46"
          unit="جهة"
          icon={Building2}
          color="cyan"
          onClick={() => navigate("/admin/organization-statistics")}
        />
      </section>

      {/* PENDING TASKS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DashboardStat
          label="طلبات معلقة"
          value="18"
          unit="طلب"
          icon={FileCheck}
          color="orange"
          onClick={() => navigate("/admin/training-requests")}
        />

        
        <DashboardStat
          label="تقارير تحتاج مراجعة"
          value="24"
          unit="تقرير"
          icon={FileText}
          color="blue"
          onClick={() => navigate("/admin/dashboard/performance-reports")}
        />

      </section>

      {/* TRAINING STATUSES + ALERTS */}
      <section className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_325px]">
        <DashboardPanel
          title="حالات التدريب"
          action={
            <ViewAllButton
              onClick={() => navigate("/admin/training-statistics")}
            />
          }
        >
          <div>
            {TRAINING_STATUSES.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate("/admin/training-statistics")}
                className="block w-full border-b border-[#E6EBF5] py-4 text-right last:border-0 hover:bg-[#FAFBFE]"
              >
                <div className="mb-2 flex items-center justify-between text-[12px]">
                  <span className="font-semibold">
                    {item.label}
                  </span>
                  <span className="font-bold">{item.value}</span>
                </div>

                <div className="h-[7px] overflow-hidden rounded-full bg-[#E5EAF2]">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: `${(item.value / 248) * 100}%`,
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="تنبيهات مهمة"
          action={
            <ViewAllButton
              onClick={() => navigate("/admin/announcements")}
            />
          }
        >
          {ALERTS.map((alert) => (
            <button
              key={alert.title}
              type="button"
              onClick={() => navigate(alert.path)}
              className="flex w-full items-center gap-3 border-b border-[#E6EBF5] py-4 text-right last:border-0 hover:bg-[#FAFBFE]"
            >
              <IconTile icon={alert.icon} color={alert.color} />

              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold leading-5">
                  {alert.title}
                </span>
                <span className="mt-1 block text-[10px] text-[#64748B]">
                  {alert.time}
                </span>
              </span>

              <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#FF6534]" />
            </button>
          ))}
        </DashboardPanel>
      </section>

      {/* RECENT ACTIVITIES */}
      <DashboardPanel
        title="أحدث الأنشطة"
        action={
          <ViewAllButton
            onClick={() => navigate("/admin/recent-activities")}
          />
        }
      >
        {ACTIVITIES.map((activity) => (
          <button
            key={activity.title}
            type="button"
            onClick={() => navigate(activity.path)}
            className="flex w-full items-center gap-3 border-b border-[#E6EBF5] py-4 text-right last:border-0 hover:bg-[#FAFBFE]"
          >
            <IconTile
              icon={activity.icon}
              color={activity.color}
            />

            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-bold">
                {activity.title}
              </span>
              <span className="mt-1 block text-[10px] text-[#64748B]">
                {activity.time}
              </span>
            </span>
          </button>
        ))}
      </DashboardPanel>
    </AdminPageLayout>
  );
}
