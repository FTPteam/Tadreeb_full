import AcademicFooter from "../../components/shared/AcademicFooter";
import { useMemo, useState } from "react";
import { selectOpportunity } from "./studentApplicationDraft";
import { useApi } from "../../api/useApi";
import { fetchOpportunities } from "../../api/student";
import { useNavigate } from "react-router-dom";

import {
  Search,
  SlidersHorizontal,
  MapPin,
  CalendarDays,
  Clock3,
  ArrowLeft,
  BriefcaseBusiness,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

export default function TrainingOpportunities() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("الكل");

  const filters = [
    "الكل",
    "داخلي",
    "خارجي",
    "حضوري",
    "عن بعد",
  ];

  // The backend only returns open opportunities in the student's specialization (FR-07).
  const { data: providerOpportunities, error: loadError } = useApi(fetchOpportunities, [], []);
  const opportunities = (providerOpportunities || [])
    .filter((opportunity) => opportunity.status === 'published')
    .map((opportunity, index) => ({
      id: opportunity.id,
      title: opportunity.title,
      organization: opportunity.organizationName || "جهة التدريب",
      category: opportunity.specialty,
      mode: opportunity.mode,
      location: opportunity.location || 'غزة',
      date: opportunity.startDate || 'غير محدد',
      hours: `${opportunity.freeSeats ?? 0} مقاعد متاحة`,
      image: `/TrainingOpportunities-${index % 3}.jpg`,
      categoryBg: '#E6F8FB', categoryText: '#287E8C',
    }));

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opportunity) => {
      const matchesSearch =
        opportunity.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        opportunity.category
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        opportunity.location
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        opportunity.organization
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === "الكل" ||
        opportunity.mode === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter, opportunities]);

  return (
    <div
      dir="rtl"
      className="
        flex
        h-dvh
        w-full
        overflow-hidden
        bg-[#F8FAFC]
        font-['Cairo']
        text-[#1E293B]
      "
    >
      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <Sidebar />

      {/* =====================================================
          MAIN AREA
      ====================================================== */}
      <div
        className="
          flex
          h-dvh
          min-w-0
          flex-1
          flex-col
          overflow-hidden
          bg-[#F8FAFC]
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="relative shrink-0">
          <Header />
        </div>

        {/* =====================================================
            SCROLLABLE CONTENT
        ====================================================== */}
        <main
          className="
            min-h-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            bg-[#F8FAFC]

            px-4
            pb-8
            pt-5

            sm:px-5
            sm:pt-6

            md:px-6
            md:pt-7

            xl:px-[40px]
            xl:pb-[40px]
            xl:pt-[14px]
          "
        >
          <div className="mx-auto w-full max-w-[1080px]">
            {/* =================================================
                BREADCRUMB
            ================================================== */}
            <nav
              aria-label="مسار التنقل"
              className="
                mb-2
                flex
                items-center
                justify-start
                gap-[7px]
                text-[11px]
                font-medium

                sm:text-[12px]

                xl:mb-[5px]
                xl:text-[13px]
              "
            >
              <button
                type="button"
                onClick={() =>
                  navigate("/student/dashboard")
                }
                className="
                  border-0
                  bg-transparent
                  p-0
                  text-[#64748B]
                  transition

                  hover:text-[#09379A]
                "
              >
                الرئيسية
              </button>

              <span className="text-[#94A3B8]">
                ›
              </span>

              <span className="font-bold text-[#09379A]">
                فرص التدريب
              </span>
            </nav>

            {/* =================================================
                PAGE TITLE
            ================================================== */}
            <section className="text-right">
              <h1
                className="
                  m-0
                  text-[23px]
                  font-bold
                  leading-[34px]
                  text-[#09379A]

                  sm:text-[25px]

                  xl:text-[28px]
                  xl:leading-[40px]
                "
              >
                فرص التدريب
              </h1>

              <p
                className="
                  m-0
                  mt-[2px]
                  max-w-[680px]
                  text-[13px]
                  font-normal
                  leading-[22px]
                  text-[#475569]

                  sm:text-[14px]

                  xl:mt-[4px]
                  xl:text-[15px]
                  xl:leading-[24px]
                "
              >
                اكتشف الفرص التدريبية المناسبة لتخصصك وابدأ رحلتك المهنية
              </p>
            </section>

            {/* =================================================
                SEARCH + FILTERS
            ================================================== */}
            <section
              className="
                mt-4
                w-full
                rounded-[14px]
                border
                border-[#E2E8F0]
                bg-white
                px-3
                py-3
                shadow-[0_1px_2px_rgba(15,23,42,0.04)]

                sm:px-4
                sm:py-4

                xl:mt-[16px]
                xl:min-h-[140px]
                xl:px-[16px]
                xl:py-[15px]
              "
            >
              {/* SEARCH ROW */}
              <div
                dir="ltr"
                className="
                  flex
                  w-full
                  flex-col
                  gap-3

                  sm:flex-row
                  sm:items-center

                  xl:gap-[14px]
                "
              >
                {/* FILTER BUTTON */}
                <button
                  type="button"
                  className="
                    order-2
                    flex
                    h-[46px]
                    w-full
                    shrink-0
                    items-center
                    justify-center
                    gap-[8px]
                    rounded-[9px]
                    border
                    border-[#09379A]
                    bg-white
                    text-[13px]
                    font-bold
                    text-[#09379A]
                    transition

                    hover:bg-[#F5F7FB]

                    sm:order-1
                    sm:w-[100px]

                    xl:h-[51px]
                    xl:w-[108px]
                    xl:gap-[10px]
                    xl:rounded-[10px]
                    xl:text-[14px]
                  "
                >
                  <span>تصفية</span>

                  <SlidersHorizontal
                    size={18}
                    strokeWidth={1.8}
                  />
                </button>

                {/* SEARCH */}
                <div
                  dir="rtl"
                  className="
                    order-1
                    flex
                    h-[46px]
                    min-w-0
                    flex-1
                    items-center
                    rounded-[8px]
                    border
                    border-[#D9E1EC]
                    bg-white
                    px-3
                    transition

                    focus-within:border-[#09379A]
                    focus-within:ring-2
                    focus-within:ring-[#09379A]/10

                    sm:order-2

                    xl:h-[51px]
                    xl:px-[16px]
                  "
                >
                  <Search
                    size={19}
                    strokeWidth={1.8}
                    className="
                      shrink-0
                      text-[#64748B]

                      xl:size-[20px]
                    "
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="ابحث عن فرصة تدريب..."
                    className="
                      mr-2
                      h-full
                      min-w-0
                      flex-1
                      border-0
                      bg-transparent
                      font-['Cairo']
                      text-[13px]
                      font-normal
                      text-[#1E293B]
                      outline-none
                      placeholder:text-[#94A3B8]

                      xl:mr-[10px]
                      xl:text-[14px]
                    "
                  />
                </div>
              </div>

              {/* FILTERS */}
              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  items-center
                  justify-start
                  gap-[6px]

                  sm:mt-4

                  xl:mt-[18px]
                  xl:gap-[7px]
                "
              >
                {filters.map((filter) => {
                  const isActive =
                    activeFilter === filter;

                  return (
                    <button
                      type="button"
                      key={filter}
                      onClick={() =>
                        setActiveFilter(filter)
                      }
                      className={`
                        min-h-[34px]
                        rounded-[9px]
                        border
                        px-3
                        text-[12px]
                        font-medium
                        transition-all

                        sm:min-h-[36px]
                        sm:px-4

                        xl:h-[38px]
                        xl:px-[19px]
                        xl:rounded-[11px]
                        xl:text-[13px]

                        ${
                          isActive
                            ? `
                              border-[#09379A]
                              bg-[#09379A]
                              text-white
                            `
                            : `
                              border-[#E2E8F0]
                              bg-white
                              text-[#475569]

                              hover:border-[#09379A]/40
                              hover:bg-[#F8FAFC]
                            `
                        }
                      `}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* =================================================
                OPPORTUNITIES
            ================================================== */}
            <section
              className="
                mt-4
                flex
                flex-col
                gap-3

                xl:mt-[15px]
                xl:gap-[14px]
              "
            >
              {filteredOpportunities.length > 0 ? (
                filteredOpportunities.map(
                  (opportunity) => (
                    <article
                      key={opportunity.id}
                      className="
                        group
                        flex
                        w-full
                        flex-col
                        gap-4
                        rounded-[14px]
                        border
                        border-[#DDE5EF]
                        bg-white
                        p-4
                        transition-all
                        duration-200

                        hover:border-[#09379A]/35
                        hover:shadow-[0_5px_18px_rgba(15,23,42,0.07)]

                        sm:p-5

                        md:flex-row
                        md:items-center
                        md:justify-between

                        xl:min-h-[146px]
                        xl:px-[23px]
                        xl:py-[23px]
                      "
                    >
                      {/* =====================================
                          INFORMATION SIDE
                      ====================================== */}
                      <div
                        className="
                          flex
                          min-w-0
                          flex-1
                          items-start

                          sm:items-center
                        "
                      >
                        {/* IMAGE */}
                        <div
                          className="
                            relative
                            h-[78px]
                            w-[92px]
                            shrink-0
                            overflow-hidden
                            rounded-[9px]
                            bg-[#F5F7FB]

                            sm:h-[88px]
                            sm:w-[108px]

                            xl:h-[96px]
                            xl:w-[120px]
                            xl:rounded-[10px]
                          "
                        >
                          <img
                            src={opportunity.image}
                            alt={opportunity.title}
                            className="
                              absolute
                              inset-0
                              h-full
                              w-full
                              object-cover
                            "
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />

                          <div
                            className="
                              flex
                              h-full
                              w-full
                              items-center
                              justify-center
                              text-[#09379A]
                            "
                          >
                            <BriefcaseBusiness
                              size={28}
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>

                        {/* DETAILS */}
                        <div
                          className="
                            mr-3
                            min-w-0
                            flex-1
                            text-right

                            sm:mr-4

                            xl:mr-[17px]
                          "
                        >
                          <h2
                            className="
                              m-0
                              text-[15px]
                              font-bold
                              leading-[23px]
                              text-[#172033]

                              sm:text-[16px]
                              sm:leading-[25px]

                              xl:text-[18px]
                              xl:leading-[27px]
                            "
                          >
                            {opportunity.title}
                          </h2>
                          <p className="m-0 mt-1 text-[11px] font-semibold text-[#64748B]">
                            <span className="text-[#09379A]">جهة التدريب:</span>{" "}
                            {opportunity.organization}
                          </p>

                          {/* CHIPS */}
                          <div
                            className="
                              mt-[5px]
                              flex
                              flex-wrap
                              items-center
                              gap-[5px]

                              xl:mt-[6px]
                              xl:gap-[7px]
                            "
                          >
                            <span
                              style={{
                                backgroundColor:
                                  opportunity.categoryBg,
                                color:
                                  opportunity.categoryText,
                              }}
                              className="
                                flex
                                min-h-[25px]
                                items-center
                                rounded-[8px]
                                px-2
                                text-[10px]
                                font-medium

                                sm:min-h-[28px]
                                sm:px-[10px]
                                sm:text-[11px]

                                xl:min-h-[30px]
                                xl:px-[13px]
                                xl:rounded-[10px]
                                xl:text-[12px]
                              "
                            >
                              {opportunity.category}
                            </span>

                            <span
                              className="
                                flex
                                min-h-[25px]
                                items-center
                                rounded-[8px]
                                border
                                border-[#E2E8F0]
                                bg-[#F8FAFC]
                                px-2
                                text-[10px]
                                font-normal
                                text-[#64748B]

                                sm:min-h-[28px]
                                sm:px-[10px]
                                sm:text-[11px]

                                xl:min-h-[30px]
                                xl:px-[13px]
                                xl:rounded-[10px]
                                xl:text-[12px]
                              "
                            >
                              {opportunity.mode}
                            </span>
                          </div>

                          {/* METADATA */}
                          <div
                            className="
                              mt-2
                              flex
                              flex-wrap
                              items-center
                              gap-x-3
                              gap-y-1
                              text-[10px]
                              font-normal
                              text-[#6B7280]

                              sm:text-[11px]

                              xl:mt-[11px]
                              xl:gap-[20px]
                            "
                          >
                            <div
                              className="
                                flex
                                items-center
                                gap-[4px]
                              "
                            >
                              <MapPin
                                size={14}
                                strokeWidth={1.7}
                              />

                              <span>
                                {opportunity.location}
                              </span>
                            </div>

                            <div
                              className="
                                flex
                                items-center
                                gap-[4px]
                              "
                            >
                              <CalendarDays
                                size={14}
                                strokeWidth={1.7}
                              />

                              <span dir="ltr">
                                {opportunity.date}
                              </span>
                            </div>

                            <div
                              className="
                                flex
                                items-center
                                gap-[4px]
                              "
                            >
                              <Clock3
                                size={14}
                                strokeWidth={1.7}
                              />

                              <span>
                                {opportunity.hours}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* =====================================
                          DETAILS BUTTON
                      ====================================== */}
                      <button
                        type="button"
                        onClick={() => {
                          selectOpportunity(opportunity.id);
                          navigate("/student/opportunities/details");
                        }}
                        className="
                          flex
                          h-[42px]
                          w-full
                          shrink-0
                          items-center
                          justify-center
                          gap-[8px]
                          rounded-[9px]
                          border
                          border-[#09379A]
                          bg-white
                          text-[13px]
                          font-medium
                          text-[#09379A]
                          transition

                          group-hover:bg-[#F5F7FB]

                          hover:!bg-[#09379A]
                          hover:!text-white

                          md:w-[130px]

                          xl:h-[46px]
                          xl:w-[145px]
                          xl:gap-[10px]
                          xl:rounded-[10px]
                          xl:text-[14px]
                        "
                      >
                        <span>عرض التفاصيل</span>

                        <ArrowLeft
                          size={17}
                          strokeWidth={1.7}
                        />
                      </button>
                    </article>
                  )
                )
              ) : (
                /* =================================================
                    EMPTY STATE
                ================================================== */
                <div
                  className="
                    flex
                    min-h-[220px]
                    w-full
                    flex-col
                    items-center
                    justify-center
                    rounded-[14px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    px-5
                    py-8
                    text-center

                    xl:min-h-[250px]
                    xl:px-[24px]
                  "
                >
                  <div
                    className="
                      flex
                      h-[48px]
                      w-[48px]
                      items-center
                      justify-center
                      rounded-[11px]
                      bg-[#F5F7FB]
                      text-[#09379A]

                      xl:h-[52px]
                      xl:w-[52px]
                      xl:rounded-[12px]
                    "
                  >
                    <Search
                      size={23}
                      strokeWidth={1.7}
                    />
                  </div>

                  <h3
                    className="
                      m-0
                      mt-3
                      text-[15px]
                      font-bold
                      leading-[23px]
                      text-[#1E293B]

                      xl:mt-[14px]
                      xl:text-[16px]
                      xl:leading-[24px]
                    "
                  >
                    لا توجد فرص تدريب مطابقة
                  </h3>

                  <p
                    className="
                      m-0
                      mt-1
                      text-[12px]
                      font-normal
                      leading-[19px]
                      text-[#64748B]

                      xl:mt-[5px]
                      xl:text-[13px]
                      xl:leading-[20px]
                    "
                  >
                    {loadError || "جرّب تغيير كلمة البحث أو اختيار تصنيف آخر"}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setActiveFilter("الكل");
                    }}
                    className="
                      mt-4
                      h-[36px]
                      rounded-[8px]
                      border
                      border-[#09379A]
                      bg-white
                      px-4
                      text-[12px]
                      font-medium
                      text-[#09379A]
                      transition

                      hover:bg-[#09379A]
                      hover:text-white

                      xl:h-[38px]
                      xl:px-[18px]
                      xl:rounded-[9px]
                      xl:text-[13px]
                    "
                  >
                    إعادة ضبط البحث
                  </button>
                </div>
              )}
            </section>
          </div>
        
            <AcademicFooter audience="student" />
          </main>
      </div>
    </div>
  );
}