import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Menu,
  ChevronLeft,
  Download,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

const students = [
  {
    name: "أمل أحمد",
    progress: 60,
    hours: 72,
    status: "active",
  },
  {
    name: "محمود رضوان",
    progress: 55,
    hours: 66,
    status: "active",
  },
  {
    name: "سارة عبد الرحمن",
    progress: 35,
    hours: 42,
    status: "active",
  },
  {
    name: "أنس البيطار",
    progress: 100,
    hours: 120,
    status: "completed",
  },
];

export default function TrainingProgress() {
  const navigate = useNavigate();

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-student-sidebar")
    );
  };

  const weeks = [18, 34, 53, 69, 78, 80];

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
                تقدم التدريب
              </span>
            </div>

            <section className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="m-0 text-[26px] font-bold">
                  تقدم التدريب
                </h1>

                <p className="m-0 mt-1 text-[13px] text-[#64748B]">
                  نسبة إنجاز الطلاب للساعات المعتمدة
                </p>
              </div>

              <button
                type="button"
                className="flex h-[44px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-5 text-[12px]"
              >
                <Download size={16} />
                تصدير
              </button>
            </section>

            <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_400px]">
              {/* CHART */}

              <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-6">
                <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                  متوسط التقدم الأسبوعي (%)
                </h2>

                <div className="mt-4 flex h-[180px] items-end justify-between gap-8 px-5">
                  {weeks.map((value, index) => (
                    <div
                      key={index}
                      className="flex flex-1 flex-col items-center gap-3"
                    >
                      <div
                        className="w-[44px] rounded-t-[6px] bg-[#09379A]"
                        style={{
                          height: `${value * 1.8}px`,
                        }}
                      />

                      <span className="text-[10px] text-[#64748B]">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* DISTRIBUTION */}

              <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-6">
                <h2 className="m-0 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
                  توزيع الحالات
                </h2>

                <div className="mt-5 space-y-5">
                  <Distribution
                    label="منتظم"
                    value={72}
                  />

                  <Distribution
                    label="متأخر"
                    value={18}
                  />

                  <Distribution
                    label="متعثر"
                    value={10}
                  />
                </div>
              </section>
            </div>

            {/* TABLE */}

            <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-6">
              <div className="overflow-x-auto rounded-[8px] border border-[#E0E7F2]">
                <table className="w-full min-w-[750px] border-collapse">
                  <thead>
                    <tr className="bg-[#F1F5F9] text-[10px] text-[#64748B]">
                      <th className="px-4 py-4">
                        الطالب
                      </th>

                      <th className="px-4 py-4">
                        التقدم
                      </th>

                      <th className="px-4 py-4">
                        الساعات
                      </th>

                      <th className="px-4 py-4">
                        الحالة
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => (
                      <tr
                        key={student.name}
                        className="border-t border-[#E6EBF5] text-[11px]"
                      >
                        <td className="px-4 py-5 font-bold">
                          {student.name}
                        </td>

                        <td className="px-4 py-5">
                          <div className="flex min-w-[190px] items-center gap-3">
                            <span className="text-[9px]">
                              {student.progress}%
                            </span>

                            <div className="h-[7px] flex-1 rounded-full bg-[#E5EAF2]">
                              <div
                                className="h-full rounded-full bg-[#09379A]"
                                style={{
                                  width: `${student.progress}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-5">
                          {student.hours} من 120
                        </td>

                        <td className="px-4 py-5">
                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1
                              rounded-full
                              px-3
                              py-1
                              text-[9px]

                              ${
                                student.status ===
                                "completed"
                                  ? "bg-[#DCFCE7] text-[#15803D]"
                                  : "bg-[#DDF6FF] text-[#08759B]"
                              }
                            `}
                          >
                            <span className="h-[5px] w-[5px] rounded-full bg-current" />

                            {student.status ===
                            "completed"
                              ? "منتهٍ"
                              : "قيد التدريب"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="m-0 text-[10px] text-[#64748B]">
                  عرض 1 - 4 من 248 طالبًا
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

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}

function Distribution({
  label,
  value,
}) {
  return (
    <div className="grid grid-cols-[60px_1fr_40px] items-center gap-3">
      <span className="text-[10px]">
        {label}
      </span>

      <div className="h-[7px] rounded-full bg-[#E5EAF2]">
        <div
          className="h-full rounded-full bg-[#09379A]"
          style={{
            width: `${value}%`,
          }}
        />
      </div>

      <strong className="text-[10px]">
        {value}%
      </strong>
    </div>
  );
}

