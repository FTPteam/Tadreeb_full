import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Menu,
  ChevronLeft,
  ArrowRight,
  Save,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

const CRITERIA = [
  {
    id: "technical",
    title: "المهارات الفنية والتطبيقية",
  },
  {
    id: "discipline",
    title: "الالتزام والانضباط",
  },
  {
    id: "communication",
    title: "التواصل والعمل الجماعي",
  },
  {
    id: "innovation",
    title: "الابتكار وحل المشكلات",
  },
];

export default function StudentEvaluation() {
  const navigate = useNavigate();

  const [scores, setScores] = useState({
    technical: 4,
    discipline: 5,
    communication: 4,
    innovation: null,
  });

  const [notes, setNotes] = useState("");

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-student-sidebar")
    );
  };

  const handleSave = () => {
    navigate("/admin/evaluations");
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

      <div
        className="
          flex
          h-screen
          min-w-0
          flex-1
          flex-col
          overflow-hidden
        "
      >
        <AdminHeader />

        <main
          className="
            min-w-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            px-4
            pb-7
            pt-5
            sm:px-6
            lg:px-8
          "
        >
          <div className="mx-auto w-full max-w-[1450px]">
            {/* BREADCRUMB */}

            <div
              className="
                mb-8
                flex
                items-center
                gap-2
                text-[12px]
                text-[#64748B]
              "
            >
              <button
                onClick={() =>
                  navigate("/admin/dashboard")
                }
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <span className="font-bold text-[#111C2D]">
                إضافة تقييم
              </span>
            </div>

            {/* PAGE HEADER */}

            <section
              className="
                mb-6
                flex
                items-start
                justify-between
              "
            >
              <div>
                <h1
                  className="
                    m-0
                    text-[26px]
                    font-bold
                    text-[#111C2D]
                  "
                >
                  إضافة تقييم
                </h1>

                <p className="m-0 mt-1 text-[13px] text-[#64748B]">
                  تقييم المشرف الأكاديمي - أمل أحمد صيام
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/admin/evaluations")
                }
                className="
                  flex
                  h-[44px]
                  items-center
                  gap-2
                  rounded-[8px]
                  border
                  border-[#E0E7F2]
                  bg-white
                  px-5
                  text-[11px]
                "
              >
                <ArrowRight size={16} />
                رجوع
              </button>
            </section>

            <div
              className="
                grid
                grid-cols-1
                gap-6
                xl:grid-cols-[minmax(0,1.65fr)_400px]
              "
            >
              {/* CRITERIA */}

              <section
                className="
                  rounded-[12px]
                  border
                  border-[#E0E7F2]
                  bg-white
                  p-6
                "
              >
                <h2
                  className="
                    m-0
                    border-b
                    border-[#E6EBF5]
                    pb-4
                    text-[17px]
                    font-bold
                    text-[#062569]
                  "
                >
                  معايير التقييم (1-5)
                </h2>

                <div>
                  {CRITERIA.map((criterion) => (
                    <div
                      key={criterion.id}
                      className="
                        flex
                        min-h-[76px]
                        flex-col
                        justify-center
                        gap-3
                        border-b
                        border-[#E6EBF5]
                        py-3
                        last:border-b-0
                        md:flex-row
                        md:items-center
                        md:justify-between
                      "
                    >
                      <span className="text-[12px] font-bold">
                        {criterion.title}
                      </span>

                      <div
                        dir="ltr"
                        className="flex gap-2"
                      >
                        {[5, 4, 3, 2, 1].map(
                          (number) => (
                            <button
                              key={number}
                              type="button"
                              onClick={() =>
                                setScores(
                                  (previous) => ({
                                    ...previous,
                                    [criterion.id]:
                                      number,
                                  })
                                )
                              }
                              className={`
                                h-[44px]
                                w-[44px]
                                rounded-[7px]
                                border
                                text-[12px]
                                font-medium

                                ${
                                  scores[
                                    criterion.id
                                  ] === number
                                    ? `
                                        border-[#09379A]
                                        bg-[#09379A]
                                        text-white
                                      `
                                    : `
                                        border-[#E0E7F2]
                                        bg-white
                                        text-[#1E293B]
                                      `
                                }
                              `}
                            >
                              {number}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* NOTES */}

              <section
                className="
                  h-fit
                  rounded-[12px]
                  border
                  border-[#E0E7F2]
                  bg-white
                  p-6
                "
              >
                <h2
                  className="
                    m-0
                    border-b
                    border-[#E6EBF5]
                    pb-4
                    text-[17px]
                    font-bold
                    text-[#062569]
                  "
                >
                  الملاحظات
                </h2>

                <label
                  className="
                    mb-2
                    mt-4
                    block
                    text-[11px]
                    font-medium
                  "
                >
                  ملاحظات وتوصيات
                </label>

                <textarea
                  rows={5}
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  placeholder="اكتب ملاحظاتك..."
                  className="
                    w-full
                    resize-none
                    rounded-[8px]
                    border
                    border-[#E0E7F2]
                    p-3
                    text-[12px]
                    outline-none
                    focus:border-[#09379A]
                  "
                />

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/admin/evaluations")
                    }
                    className="
                      h-[44px]
                      rounded-[8px]
                      border
                      border-[#E0E7F2]
                      bg-white
                      px-5
                      text-[11px]
                    "
                  >
                    إلغاء
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="
                      flex
                      h-[44px]
                      items-center
                      gap-2
                      rounded-[8px]
                      bg-[#09379A]
                      px-5
                      text-[11px]
                      font-bold
                      text-white
                    "
                  >
                    <Save size={16} />
                    حفظ التقييم
                  </button>
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

