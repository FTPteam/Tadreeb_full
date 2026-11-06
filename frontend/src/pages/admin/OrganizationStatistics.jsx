
import {
  Building2,
  Armchair,
  Percent,
  Star,
} from "lucide-react";

import AdminPageLayout, {
  DashboardPanel,
  DashboardStat,
  ExportButton,
  exportCsv,
} from "../../components/admin/AdminPageLayout";

const ORGANIZATIONS = [
  {
    id: 1,
    name: "شركة القدس للاتصالات",
    students: 42,
    seats: 18,
    occupancy: 70,
    rating: 4.4,
  },
  {
    id: 2,
    name: "شركة المشرق الرقمية",
    students: 30,
    seats: 10,
    occupancy: 75,
    rating: 4.2,
  },
  {
    id: 3,
    name: "شركة جوال",
    students: 25,
    seats: 5,
    occupancy: 83,
    rating: 4.5,
  },
  {
    id: 4,
    name: "شركة الأمل للأنظمة الصناعية",
    students: 14,
    seats: 6,
    occupancy: 70,
    rating: 4.1,
  },
  {
    id: 5,
    name: "استوديو بيكسل للتصميم",
    students: 8,
    seats: 4,
    occupancy: 66,
    rating: 4.0,
  },
];

export default function OrganizationStatistics() {
  const handleExport = () => {
    exportCsv(
      "organization-statistics.csv",
      [
        "الجهة",
        "الطلاب",
        "المقاعد الشاغرة",
        "نسبة الإشغال",
        "التقييم من 5",
      ],
      ORGANIZATIONS.map((item) => [
        item.name,
        item.students,
        item.seats,
        `${item.occupancy}%`,
        item.rating,
      ])
    );
  };

  return (
    <AdminPageLayout breadcrumb="إحصائيات الجهات">
      <section className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[25px] font-bold">
            إحصائيات جهات التدريب
          </h1>
          <p className="m-0 mt-1 text-[13px] text-[#64748B]">
            الاستيعاب والإشغال وتقييم الجهات
          </p>
        </div>

        <ExportButton onClick={handleExport} />
      </section>

      {/* KPI CARDS */}
      <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <DashboardStat
          label="الجهات"
          value="46"
          icon={Building2}
          color="blue"
        />
        <DashboardStat
          label="المقاعد المتاحة"
          value="168"
          icon={Armchair}
          color="green"
        />
        <DashboardStat
          label="نسبة الإشغال"
          value="65"
          unit="%"
          icon={Percent}
          color="orange"
        />
        <DashboardStat
          label="متوسط تقييم الجهات"
          value="4.2"
          unit="من 5"
          icon={Star}
          color="cyan"
        />
      </section>

      {/* PERFORMANCE TABLE */}
      <DashboardPanel title="أداء الجهات">
        <div className="overflow-x-auto rounded-[8px] border border-[#E0E7F2]">
          <table className="w-full min-w-[720px] border-collapse text-right text-[12px]">
            <thead className="bg-[#F1F5F9] text-[11px] text-[#64748B]">
              <tr>
                <th className="px-4 py-5">الجهة</th>
                <th className="px-4 py-5">الطلاب</th>
                <th className="px-4 py-5">المقاعد الشاغرة</th>
                <th className="px-4 py-5">الإشغال</th>
                <th className="px-4 py-5">التقييم</th>
              </tr>
            </thead>

            <tbody>
              {ORGANIZATIONS.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-[#E6EBF5] hover:bg-[#FAFBFE]"
                >
                  <td className="px-4 py-6 font-bold">
                    {item.name}
                  </td>

                  <td className="px-4 py-6">
                    {item.students}
                  </td>

                  <td className="px-4 py-6">
                    {item.seats}
                  </td>

                  <td className="px-4 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-[8px] w-[100px] overflow-hidden rounded-full bg-[#E5EAF2]">
                        <div
                          className="h-full rounded-full bg-[#09379A]"
                          style={{
                            width: `${item.occupancy}%`,
                          }}
                        />
                      </div>

                      <span className="text-[11px]">
                        {item.occupancy}%
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-6">
                    {item.rating.toFixed(1)} / 5
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
