
import { useState } from "react";
import {
  Users,
  Activity,
  CheckCircle2,
  Percent,
  CalendarDays,
} from "lucide-react";

import AdminPageLayout, {
  DashboardPanel,
  DashboardStat,
  ExportButton,
  exportCsv,
} from "../../components/admin/AdminPageLayout";

const PERIODS = {
  current: {
    total: 312,
    active: 248,
    completed: 18,
    average: 58,
    months: [
      { name: "أكتوبر", value: 18 },
      { name: "نوفمبر", value: 25 },
      { name: "ديسمبر", value: 32 },
      { name: "يناير", value: 35 },
      { name: "فبراير", value: 28 },
    ],
    majors: [
      { name: "تكنولوجيا علم البيانات", percent: 34 },
      { name: "الاتصالات وإنترنت الأشياء", percent: 22 },
      { name: "التصميم الجرافيكي والفنون الرقمية", percent: 16 },
      { name: "الدعم الفني", percent: 14 },
      { name: "الهيدروليك والنيوماتيك", percent: 14 },
    ],
  },
  previous: {
    total: 285,
    active: 210,
    completed: 42,
    average: 64,
    months: [
      { name: "أكتوبر", value: 14 },
      { name: "نوفمبر", value: 22 },
      { name: "ديسمبر", value: 29 },
      { name: "يناير", value: 31 },
      { name: "فبراير", value: 24 },
    ],
    majors: [
      { name: "تكنولوجيا علم البيانات", percent: 30 },
      { name: "الاتصالات وإنترنت الأشياء", percent: 25 },
      { name: "التصميم الجرافيكي والفنون الرقمية", percent: 17 },
      { name: "الدعم الفني", percent: 15 },
      { name: "الهيدروليك والنيوماتيك", percent: 13 },
    ],
  },
};

export default function TrainingStatistics() {
  const [period, setPeriod] = useState("current");
  const data = PERIODS[period];

  const maxMonthly = Math.max(
    ...data.months.map((item) => item.value),
    1
  );

  const exportData = () => {
    exportCsv(
      "training-statistics.csv",
      ["المؤشر", "القيمة"],
      [
        ["إجمالي الطلاب المتدربين", data.total],
        ["قيد التدريب", data.active],
        ["أنهوا التدريب", data.completed],
        ["متوسط الإنجاز %", data.average],
        ...data.months.map((item) => [
          `الطلاب الجدد - ${item.name}`,
          item.value,
        ]),
        ...data.majors.map((item) => [
          `التوزيع - ${item.name}`,
          `${item.percent}%`,
        ]),
      ]
    );
  };

  return (
    <AdminPageLayout breadcrumb="إحصائيات التدريب">
      <section className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[25px] font-bold">
            إحصائيات التدريب
          </h1>
          <p className="m-0 mt-1 text-[13px] text-[#64748B]">
            نظرة شاملة على التدريب الميداني
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <ExportButton onClick={exportData} />

          <div className="relative">
            <CalendarDays
              size={17}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            />
            <select
              aria-label="الفترة"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="h-[43px] appearance-none rounded-[8px] border border-[#E0E7F2] bg-white py-2 pl-4 pr-9 text-[12px] outline-none focus:border-[#09379A]"
            >
              <option value="current">الفترة: الفصل الحالي</option>
              <option value="previous">الفترة: الفصل السابق</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <DashboardStat
          label="الطلاب المتدربون"
          value={data.total}
          icon={Users}
          color="blue"
        />
        <DashboardStat
          label="قيد التدريب"
          value={data.active}
          icon={Activity}
          color="green"
        />
        <DashboardStat
          label="أنهوا التدريب"
          value={data.completed}
          icon={CheckCircle2}
          color="cyan"
        />
        <DashboardStat
          label="متوسط الإنجاز"
          value={data.average}
          unit="%"
          icon={Percent}
          color="orange"
        />
      </section>

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">
        {/* MONTHLY CHART */}
        <DashboardPanel title="الطلاب الجدد شهريًا">
          <div className="flex h-[245px] items-end justify-between gap-4 px-2 pt-4">
            {data.months.map((month) => (
              <div
                key={month.name}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
              >
                <div className="flex h-[200px] w-full items-end justify-center">
                  <div
                    title={`${month.value} طالب`}
                    className="w-[60%] max-w-[46px] rounded-t-[7px] bg-[#09379A] transition-all duration-300"
                    style={{
                      height: `${
                        (month.value / maxMonthly) * 100
                      }%`,
                    }}
                  />
                </div>

                <span className="mt-3 text-[10px] text-[#64748B]">
                  {month.name}
                </span>
              </div>
            ))}
          </div>
        </DashboardPanel>

        {/* DISTRIBUTION */}
        <DashboardPanel title="التوزيع حسب التخصص">
          <div className="space-y-5 pt-2">
            {data.majors.map((item) => (
              <div
                key={item.name}
                className="grid grid-cols-[minmax(0,1fr)_70px_38px] items-center gap-3"
              >
                <span className="text-[11px] leading-5">
                  {item.name}
                </span>

                <div className="h-[8px] overflow-hidden rounded-full bg-[#E5EAF2]">
                  <div
                    className="h-full rounded-full bg-[#09379A]"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>

                <span className="text-left text-[11px] font-bold">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </div>
    </AdminPageLayout>
  );
}
