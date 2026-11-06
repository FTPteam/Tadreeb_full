import AcademicFooter from "../../components/shared/AcademicFooter";
import { useEffect, useState } from "react";
import { getSharedAttendance, subscribeSharedAttendance } from "../../services/sharedAttendance";
import AdminHeader from "../../components/admin/Header";
import { useNavigate, useParams } from "react-router-dom";

import {
  Bell,
  Menu,
  ChevronLeft,
  ArrowRight,
  Download,
  CalendarCheck,
  CalendarX2,
  Percent,
  Clock3,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

const attendanceRows = [
  {
    date: "2025/12/22",
    inTime: "08:55",
    outTime: "16:05",
    hours: "7 ساعات",
    status: "present",
  },
  {
    date: "2025/12/21",
    inTime: "09:00",
    outTime: "16:00",
    hours: "7 ساعات",
    status: "present",
  },
  {
    date: "2025/12/18",
    inTime: "—",
    outTime: "—",
    hours: "—",
    status: "absent",
  },
];

export default function StudentAttendance() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [attendanceData, setAttendanceData] = useState(() => getSharedAttendance(id));
  useEffect(() => {
    const refresh = () => setAttendanceData(getSharedAttendance(id));
    refresh();
    return subscribeSharedAttendance(refresh);
  }, [id]);
  const attendanceRows = attendanceData.records.map((row, index) => ({
    date: String(row.date).replaceAll("-", "/"),
    inTime: row.inTime || "—",
    outTime: row.outTime || "—",
    hours: row.status === "absent" ? "—" : `${Number(row.hours ?? row.durationHours ?? 0)} ساعة`,
    status: row.status,
    key: row.id || `${row.date}-${index}`,
  }));
  const { trainee, stats } = attendanceData;


  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-student-sidebar")
    );
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

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1450px]">
            <div className="mb-8 flex items-center gap-2 text-[12px] text-[#64748B]">
              <button
                onClick={() =>
                  navigate("/admin/dashboard")
                }
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <span className="font-bold text-[#111C2D]">
                الحضور
              </span>
            </div>

            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="m-0 text-[26px] font-bold">
                  الحضور
                </h1>

                <p className="m-0 mt-1 text-[13px] text-[#64748B]">
                  {trainee?.name || "بيانات المتدرب"} - سجل الحضور
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/admin/training-monitoring/${id}?tab=attendance`)
                  }
                  className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px]"
                >
                  <ArrowRight size={16} />
                  رجوع
                </button>

                <button
                  type="button"
                  className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px]"
                >
                  <Download size={16} />
                  تصدير
                </button>
              </div>
            </div>

            <section className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <AttendanceStat
                title="أيام الحضور"
                value={String(stats.present)}
                suffix="يوم"
                icon={CalendarCheck}
                iconClass="bg-[#DCFCE7] text-[#15803D]"
              />

              <AttendanceStat
                title="أيام الغياب"
                value={String(stats.absent)}
                suffix="يوم"
                icon={CalendarX2}
                iconClass="bg-[#FFE5D9] text-[#C2410C]"
              />

              <AttendanceStat
                title="نسبة الحضور"
                value={String(stats.rate)}
                suffix="%"
                icon={Percent}
                iconClass="bg-[#E8EEF9] text-[#09379A]"
              />

              <AttendanceStat
                title="الساعات المنجزة"
                value={String(stats.hours)}
                suffix="ساعة"
                icon={Clock3}
                iconClass="bg-[#DDF6FF] text-[#08759B]"
              />
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_395px]">
              {/* TABLE */}

              <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-6">
                <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                  سجل الحضور
                </h2>

                <div className="mt-0 overflow-x-auto">
                  <table className="w-full min-w-[650px] border-collapse">
                    <thead>
                      <tr className="bg-[#F1F5F9] text-[10px] text-[#64748B]">
                        <th className="px-4 py-4">
                          التاريخ
                        </th>
                        <th className="px-4 py-4">
                          الدخول
                        </th>
                        <th className="px-4 py-4">
                          الخروج
                        </th>
                        <th className="px-4 py-4">
                          المدة
                        </th>
                        <th className="px-4 py-4">
                          الحالة
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendanceRows.length === 0 ? (
                        <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-[#64748B]">لا توجد سجلات حضور مسجلة لهذا المتدرب حتى الآن.</td></tr>
                      ) : attendanceRows.map((row) => (
                        <tr
                          key={row.key || row.date}
                          className="border-t border-[#E6EBF5] text-[11px]"
                        >
                          <td className="px-4 py-5">
                            {row.date}
                          </td>
                          <td className="px-4 py-5">
                            {row.inTime}
                          </td>
                          <td className="px-4 py-5">
                            {row.outTime}
                          </td>
                          <td className="px-4 py-5">
                            {row.hours}
                          </td>
                          <td className="px-4 py-5">
                            <AttendanceStatus
                              status={row.status}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="m-0 text-[10px] text-[#64748B]">
                    عرض {attendanceRows.length} سجل حضور
                  </p>

                  <div className="flex gap-2">
                    {[
                      "السابق",
                      "1",
                      "2",
                      "3",
                      "التالي",
                    ].map((item) => (
                      <button
                        key={item}
                        className={`
                          h-[36px]
                          rounded-full
                          border
                          px-4
                          text-[10px]

                          ${
                            item === "1"
                              ? "border-[#09379A] bg-[#09379A] text-white"
                              : "border-[#E0E7F2] bg-white"
                          }
                        `}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* CALENDAR */}

              <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-6">
                <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                  التقويم
                </h2>

                <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                  {[
                    "أحد",
                    "اثنين",
                    "ثلاثاء",
                    "أربعاء",
                    "خميس",
                    "جمعة",
                    "سبت",
                  ].map((day) => (
                    <span
                      key={day}
                      className="text-[9px] text-[#64748B]"
                    >
                      {day}
                    </span>
                  ))}

                  {Array.from(
                    { length: 28 },
                    (_, i) => i + 1
                  ).map((day) => {
                    const absent =
                      day === 4 || day === 17;

                    const present =
                      [
                        1, 2, 3, 5, 8, 9,
                        10, 11, 12, 15, 16,
                        18, 19, 22, 23, 24,
                        25, 26,
                      ].includes(day);

                    return (
                      <div
                        key={day}
                        className={`
                          flex
                          h-[36px]
                          items-center
                          justify-center
                          rounded-[8px]
                          text-[10px]

                          ${
                            absent
                              ? "bg-[#FEE2E2] text-[#B91C1C]"
                              : present
                              ? "bg-[#DCFCE7] text-[#15803D]"
                              : "text-[#94A3B8]"
                          }
                        `}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}

function AttendanceStat({
  title,
  value,
  suffix,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="min-h-[150px] rounded-[12px] border border-[#E0E7F2] bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold">
          {title}
        </span>

        <div
          className={`flex h-[44px] w-[44px] items-center justify-center rounded-[9px] ${iconClass}`}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-7 flex items-baseline gap-2">
        <strong className="text-[30px] text-[#062569]">
          {value}
        </strong>

        <span className="text-[10px] text-[#64748B]">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function AttendanceStatus({ status }) {
  const present = status === "present";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1
        rounded-full
        px-3
        py-1
        text-[9px]
        font-semibold

        ${
          present
            ? "bg-[#DCFCE7] text-[#15803D]"
            : "bg-[#FEE2E2] text-[#B91C1C]"
        }
      `}
    >
      <span className="h-[5px] w-[5px] rounded-full bg-current" />

      {present ? "حاضر" : "غائب"}
    </span>
  );
}

