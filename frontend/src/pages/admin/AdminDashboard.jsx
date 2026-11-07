
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileCheck,
  Building2,
  Activity,
  FileText,
  Clock3,
  AlertTriangle,
  CalendarClock,
  ChevronLeft,
} from "lucide-react";

import AdminPageLayout, {
  DashboardPanel,
  DashboardStat,
} from "../../components/admin/AdminPageLayout";
import { useApi } from "../../api/useApi";
import { fetchStats } from "../../api/admin";
import { getCurrentUser } from "../../api/auth";


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
  // FR-36 / FR-38: live numbers from /api/stats/ (it answers by the user's role).
  const stats = useApi(fetchStats, []).data || {};
  const byStatus = stats.applications?.by_status || {};
  const user = getCurrentUser();
  const trainingStatuses = [
    { label: "قيد التدريب", value: byStatus.in_training || 0, color: "bg-[#09379A]" },
    { label: "موزّع بانتظار الجهة", value: byStatus.assigned || 0, color: "bg-[#09379A]" },
    { label: "أنهى الساعات", value: byStatus.completed || 0, color: "bg-[#15803D]" },
    { label: "حاصل على الشهادة", value: byStatus.certified || 0, color: "bg-[#15803D]" },
  ];
  const largest = Math.max(1, ...trainingStatuses.map(item => item.value));
  const alerts = [
    stats.training?.pending_days ? { title: `${stats.training.pending_days} أيام تدريب بانتظار تأكيد الجهات`, time: "الآن", icon: CalendarClock, color: "blue", path: "/admin/daily-logs" } : null,
    byStatus.submitted ? { title: `${byStatus.submitted} طلبات جديدة بانتظار المراجعة`, time: "الآن", icon: AlertTriangle, color: "orange", path: "/admin/training-requests" } : null,
  ].filter(Boolean);
  const pendingRequests = (byStatus.submitted || 0) + (byStatus.under_review || 0);
  const reportsToGrade = Math.max(0, (stats.reports?.submitted || 0) - (stats.reports?.graded || 0));

  return (
    <AdminPageLayout className="space-y-5">
      {/* WELCOME */}
      <section className="rounded-[12px] bg-[#09379A] px-6 py-7 text-white">
        <h1 className="m-0 text-[23px] font-bold">
          مرحبًا {user?.full_name || user?.username || ""}
        </h1>
        <p className="m-0 mt-2 text-[12px] text-[#D8E5FB]">
          نظرة عامة على طلباتك وجهات التدريب
        </p>
      </section>

      {/* MAIN STATISTICS */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <DashboardStat
          label="إجمالي الطلاب"
          value={String(stats.students ?? 0)}
          unit="طالب"
          icon={Users}
          color="blue"
          onClick={() => navigate("/admin/student-statistics")}
        />

        <DashboardStat
          label="الطلاب النشطون"
          value={String(byStatus.in_training ?? 0)}
          unit="طالب"
          icon={Activity}
          color="green"
          onClick={() => navigate("/admin/training-statistics")}
        />

        <DashboardStat
          label="لم يبدأوا التدريب"
          value={String((byStatus.accepted || 0) + (byStatus.assigned || 0))}
          unit="طالب"
          icon={Clock3}
          color="orange"
          onClick={() => navigate("/admin/training-statistics")}
        />

        <DashboardStat
          label="جهات التدريب"
          value={String(stats.providers?.approved ?? 0)}
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
          value={String(pendingRequests)}
          unit="طلب"
          icon={FileCheck}
          color="orange"
          onClick={() => navigate("/admin/training-requests")}
        />

        
        <DashboardStat
          label="تقارير تحتاج مراجعة"
          value={String(reportsToGrade)}
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
            {trainingStatuses.map((item) => (
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
                      width: `${(item.value / largest) * 100}%`,
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
          {alerts.map((alert) => (
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
        {[].map((activity) => (
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
