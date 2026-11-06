
import {
  Users,
  UserRoundCheck,
  UserRoundX,
  AlertTriangle,
} from "lucide-react";

import AdminPageLayout, {
  DashboardPanel,
  DashboardStat,
  ExportButton,
  exportCsv,
} from "../../components/admin/AdminPageLayout";

const STUDENT_MAJORS = [
  {
    name: "تكنولوجيا علم البيانات",
    count: 64,
    progress: 62,
    attendance: 93,
  },
  {
    name: "الاتصالات وإنترنت الأشياء",
    count: 48,
    progress: 58,
    attendance: 90,
  },
  {
    name: "التصميم الجرافيكي والفنون الرقمية",
    count: 36,
    progress: 55,
    attendance: 91,
  },
  {
    name: "الدعم الفني",
    count: 30,
    progress: 60,
    attendance: 88,
  },
  {
    name: "الهيدروليك والنيوماتيك",
    count: 28,
    progress: 52,
    attendance: 92,
  },
  {
    name: "إلكترونيات صناعية وتحكم",
    count: 26,
    progress: 57,
    attendance: 89,
  },
  {
    name: "تكنولوجيا الهواتف النقالة",
    count: 24,
    progress: 49,
    attendance: 90,
  },
  {
    name: "صيانة الحاسب الآلي",
    count: 22,
    progress: 61,
    attendance: 94,
  },
  {
    name: "البرمجيات وقواعد البيانات",
    count: 20,
    progress: 54,
    attendance: 87,
  },
  {
    name: "التصميم والمونتاج",
    count: 14,
    progress: 50,
    attendance: 91,
  },
];

export default function StudentStatistics() {
  const handleExport = () => {
    exportCsv(
      "student-statistics.csv",
      [
        "التخصص",
        "عدد الطلاب",
        "متوسط التقدم %",
        "متوسط الحضور %",
      ],
      STUDENT_MAJORS.map((item) => [
        item.name,
        item.count,
        item.progress,
        item.attendance,
      ])
    );
  };

  return (
    <AdminPageLayout breadcrumb="إحصائيات الطلاب">
      {/* TITLE */}
      <section className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[25px] font-bold">
            إحصائيات الطلاب
          </h1>
          <p className="m-0 mt-1 text-[13px] text-[#64748B]">
            أداء الطلاب حسب التخصص
          </p>
        </div>

        <ExportButton onClick={handleExport} />
      </section>

      {/* STATS */}
      <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <DashboardStat
          label="إجمالي الطلاب"
          value="312"
          icon={Users}
          color="blue"
        />

        <DashboardStat
          label="منتظمون"
          value="272"
          icon={UserRoundCheck}
          color="green"
        />

        <DashboardStat
          label="متأخرون"
          value="32"
          icon={UserRoundX}
          color="orange"
        />

        <DashboardStat
          label="متعثرون"
          value="8"
          icon={AlertTriangle}
          color="cyan"
        />
      </section>

      {/* MAJORS TABLE */}
      <DashboardPanel title="الطلاب حسب التخصص">
        <div className="overflow-x-auto rounded-[8px] border border-[#E0E7F2]">
          <table className="w-full min-w-[680px] border-collapse text-right text-[12px]">
            <thead className="bg-[#F1F5F9] text-[11px] text-[#64748B]">
              <tr>
                <th className="px-4 py-5">
                  التخصص
                </th>
                <th className="px-4 py-5">
                  عدد الطلاب
                </th>
                <th className="px-4 py-5">
                  متوسط التقدم
                </th>
                <th className="px-4 py-5">
                  متوسط الحضور
                </th>
              </tr>
            </thead>

            <tbody>
              {STUDENT_MAJORS.map((major) => (
                <tr
                  key={major.name}
                  className="border-t border-[#E6EBF5] hover:bg-[#FAFBFE]"
                >
                  <td className="px-4 py-5">
                    {major.name}
                  </td>

                  <td className="px-4 py-5">
                    {major.count}
                  </td>

                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-[8px] w-[90px] overflow-hidden rounded-full bg-[#E5EAF2]">
                        <div
                          className="h-full rounded-full bg-[#09379A]"
                          style={{
                            width: `${major.progress}%`,
                          }}
                        />
                      </div>

                      <span className="text-[11px]">
                        {major.progress}%
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-5">
                    {major.attendance}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardPanel>
    </AdminPageLayout>
  );
}
