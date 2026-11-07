import AcademicFooter from "../../components/shared/AcademicFooter";
import { useNavigate } from "react-router-dom";
import { getMyApplications } from "./studentApplicationView";
import { getCurrentTraining } from "../../services/dailyTrainingLogs";
import { getStudentVisibleOpportunities } from "../training-provider/opportunitiesStore";
import { selectOpportunity } from "./studentApplicationDraft";

import {
  Clock3,
  BriefcaseBusiness,
  ClipboardList,
  Compass,
  ChevronLeft,
  Code2,
  BarChart3,
  Network,
  Bell,
  BellOff,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

export default function Dashboard() {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  // All values below come from the current demo stores, never fixed promotional counts.
  const training = getCurrentTraining();
  const myApplications = getMyApplications();
  const availableOpportunities = getStudentVisibleOpportunities().filter(o => o.status === 'published');
  const statistics = [
    { title: 'الساعات المنجزة', value: Number(training?.completedHours) || 0, icon: Clock3 },
    { title: 'تدريبي الحالي', value: training && ['active','not_started'].includes(training.status) ? 1 : 0, icon: BriefcaseBusiness },
    { title: 'طلباتي الحالية', value: myApplications.length, icon: ClipboardList },
    { title: 'فرص تدريب متاحة', value: availableOpportunities.length, icon: Compass },
  ];
  const opportunities = availableOpportunities.slice(0,3).map((o,index) => ({
    id: o.id, title: o.title, field: o.specialty || '—', type: o.mode || 'غير محدد',
    icon: [Code2, BarChart3, Network][index % 3],
    iconBg: ['#E5F8FC','#FFF5E5','#E9FBF5'][index % 3],
    iconBorder: ['#AAE7F2','#FCD89B','#AFE9D6'][index % 3],
    chipBg: ['rgba(0,180,216,0.15)','rgba(245,158,11,0.15)','rgba(16,185,129,0.15)'][index % 3],
    chipDot: ['#00B4D8','#F59E0B','#10B981'][index % 3],
  }));
  // Notifications require a backend source; do not display invented dates or events.
  const notifications = [];

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
          MAIN SIDE
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
        {/* HEADER */}
        <Header />

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
            pb-6
            pt-5

            sm:px-5
            sm:pt-6

            md:px-6
            md:pb-7
            md:pt-7

            xl:px-[40px]
            xl:pb-[30px]
            xl:pt-[32px]
          "
        >
          <div className="mx-auto w-full max-w-[1080px]">
            {/* =================================================
                WELCOME BANNER
            ================================================== */}
            <section
              className="
                flex
                w-full
                min-h-[118px]
                items-center
                rounded-[14px]
                bg-[#09379A]
                px-5
                py-5
                text-white

                sm:min-h-[128px]
                sm:px-6

                md:min-h-[138px]
                md:px-8

                xl:h-[148px]
                xl:px-[40px]
                xl:py-0
              "
            >
              <div className="w-full text-right">
                <h1
                  className="
                    m-0
                    text-[20px]
                    font-bold
                    leading-[29px]
                    text-white

                    sm:text-[22px]
                    sm:leading-[30px]

                    xl:text-[24px]
                  "
                >
                  مرحباً أمل
                </h1>

                <p
                  className="
                    m-0
                    mt-[6px]
                    max-w-[520px]
                    text-[12px]
                    font-medium
                    leading-[20px]
                    text-white/95

                    sm:mt-[8px]
                    sm:text-[13px]
                    sm:leading-[21px]

                    xl:text-[14px]
                  "
                >
                  نتمنى لك رحلة تدريبية مليئة بالنجاح والتميز
                </p>
              </div>
            </section>

            {/* =================================================
                STATISTICS
            ================================================== */}
            <section
              className="
                mt-4
                grid
                w-full
                grid-cols-1
                gap-3

                min-[420px]:grid-cols-2

                sm:mt-5
                sm:gap-4

                lg:grid-cols-4

                xl:mt-[24px]
                xl:gap-[24px]
              "
            >
              {statistics.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="
                      flex
                      min-h-[88px]
                      min-w-0
                      items-center
                      rounded-[12px]
                      border
                      border-[#E2E8F0]
                      bg-white
                      px-4
                      py-4
                      shadow-[0_1px_1.5px_rgba(0,0,0,0.03)]

                      sm:min-h-[92px]
                      sm:px-[18px]

                      xl:h-[93px]
                      xl:px-[21px]
                      xl:py-0
                    "
                  >
                    <div
                      className="
                        flex
                        h-[40px]
                        w-[40px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-[10px]
                        border
                        border-[#E2E8F0]/60
                        bg-[#F8FAFC]
                        text-[#09379A]
                      "
                    >
                      <Icon size={22} strokeWidth={1.8} />
                    </div>

                    <div
                      className="
                        mr-3
                        min-w-0
                        flex-1
                        text-right

                        xl:mr-[16px]
                      "
                    >
                      <p
                        className="
                          m-0
                          text-[12px]
                          font-medium
                          leading-[18px]
                          text-[#64748B]

                          sm:text-[13px]

                          xl:text-[14px]
                          xl:whitespace-nowrap
                        "
                      >
                        {item.title}
                      </p>

                      <p
                        className="
                          m-0
                          mt-[2px]
                          text-[21px]
                          font-bold
                          leading-[30px]
                          text-[#1E293B]

                          sm:text-[22px]

                          xl:mt-[3px]
                          xl:text-[24px]
                          xl:leading-[32px]
                        "
                      >
                        {item.value}
                      </p>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* =================================================
                LOWER CARDS
            ================================================== */}
            <section
              dir="ltr"
              className="
                mt-4
                grid
                w-full
                grid-cols-1
                items-start
                gap-4

                sm:mt-5

                lg:grid-cols-[440fr_616fr]

                xl:mt-[24px]
                xl:gap-[24px]
              "
            >
              {/* =================================================
                  NOTIFICATIONS
              ================================================== */}
              <section
                dir="rtl"
                className="
                  w-full
                  min-w-0
                  overflow-hidden
                  rounded-[14px]
                  border
                  border-[#E2E8F0]
                  bg-white
                  px-4
                  pt-4
                  shadow-[0_1px_1.5px_rgba(0,0,0,0.03)]

                  sm:px-5
                  sm:pt-5

                  lg:h-[376px]

                  xl:px-[24px]
                  xl:pt-[24px]
                "
              >
                <div
                  className="
                    flex
                    min-h-[48px]
                    items-start
                    justify-between
                    gap-3
                    border-b
                    border-[#E2E8F0]
                    pb-3

                    sm:min-h-[52px]
                  "
                >
                  <h2
                    className="
                      m-0
                      min-w-0
                      text-[16px]
                      font-bold
                      leading-[25px]
                      text-[#1E293B]

                      sm:text-[17px]

                      xl:text-[18px]
                      xl:leading-[26px]
                    "
                  >
                    آخر الإشعارات
                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/student/notifications")
                    }
                    className="
                      flex
                      h-[34px]
                      shrink-0
                      items-center
                      justify-center
                      gap-[4px]
                      rounded-[9px]
                      border
                      border-[#09379A]
                      bg-white
                      px-3
                      text-[12px]
                      font-normal
                      text-[#09379A]
                      transition
                      hover:bg-[#F8FAFC]

                      sm:h-[36px]
                      sm:gap-[6px]
                      sm:px-[14px]
                      sm:text-[13px]

                      xl:px-[16px]
                      xl:text-[14px]
                    "
                  >
                    <span>عرض الكل</span>

                    <ChevronLeft
                      size={15}
                      strokeWidth={1.8}
                    />
                  </button>
                </div>

                {notifications.length > 0 ? (
                  <div>
                    {notifications.map(
                      (notification, index) => (
                        <button
                          type="button"
                          key={notification.title}
                          onClick={() =>
                            navigate(
                              "/student/notifications"
                            )
                          }
                          className={`
                            flex
                            min-h-[70px]
                            w-full
                            items-center
                            bg-white
                            px-1
                            py-3
                            text-right
                            transition
                            hover:bg-[#F8FAFC]

                            sm:min-h-[72px]
                            sm:px-[8px]

                            ${
                              index !==
                              notifications.length - 1
                                ? "border-b border-[#E2E8F0]"
                                : ""
                            }
                          `}
                        >
                          <div
                            className="
                              flex
                              h-[32px]
                              w-[32px]
                              shrink-0
                              items-center
                              justify-center
                              rounded-[8px]
                              bg-[#EEF2F8]
                              text-[#09379A]
                            "
                          >
                            <Bell
                              size={17}
                              strokeWidth={1.7}
                            />
                          </div>

                          <div
                            className="
                              mr-[10px]
                              min-w-0
                              flex-1

                              sm:mr-[12px]
                            "
                          >
                            <p
                              className="
                                m-0
                                line-clamp-2
                                text-[12px]
                                font-semibold
                                leading-[18px]
                                text-[#1E293B]

                                sm:text-[13px]
                                sm:leading-[19px]

                                md:truncate
                              "
                            >
                              {notification.title}
                            </p>

                            <p
                              dir="ltr"
                              className="
                                m-0
                                mt-[2px]
                                text-right
                                text-[10px]
                                font-normal
                                leading-[14px]
                                text-[#94A3B8]
                              "
                            >
                              {notification.date}
                            </p>
                          </div>

                          {notification.unread && (
                            <span
                              className="
                                ml-[4px]
                                h-[6px]
                                w-[6px]
                                shrink-0
                                rounded-full
                                bg-[#FF6B35]
                              "
                            />
                          )}
                        </button>
                      )
                    )}
                  </div>
                ) : (
                  <div
                    className="
                      flex
                      min-h-[220px]
                      flex-col
                      items-center
                      justify-center
                      py-8
                      text-center
                      text-[#64748B]

                      lg:h-[270px]
                    "
                  >
                    <div
                      className="
                        mb-[12px]
                        flex
                        h-[44px]
                        w-[44px]
                        items-center
                        justify-center
                        rounded-[10px]
                        bg-[#F8FAFC]
                      "
                    >
                      <BellOff
                        size={21}
                        strokeWidth={1.7}
                      />
                    </div>

                    <p
                      className="
                        m-0
                        text-[13px]
                        font-medium
                        leading-[20px]
                      "
                    >
                      لا توجد إشعارات جديدة حالياً
                    </p>
                  </div>
                )}
              </section>

              {/* =================================================
                  OPPORTUNITIES
              ================================================== */}
              <section
                dir="rtl"
                className="
                  w-full
                  min-w-0
                  overflow-hidden
                  rounded-[14px]
                  border
                  border-[#E2E8F0]
                  bg-white
                  px-4
                  pt-4
                  shadow-[0_1px_1.5px_rgba(0,0,0,0.03)]

                  sm:px-5
                  sm:pt-5

                  lg:h-[376px]

                  xl:px-[24px]
                  xl:pt-[24px]
                "
              >
                <div
                  className="
                    flex
                    min-h-[48px]
                    items-start
                    justify-between
                    gap-3
                    border-b
                    border-[#E2E8F0]
                    pb-3

                    sm:min-h-[52px]
                  "
                >
                  <h2
                    className="
                      m-0
                      min-w-0
                      text-[16px]
                      font-bold
                      leading-[25px]
                      text-[#1E293B]

                      sm:text-[17px]

                      xl:text-[18px]
                      xl:leading-[26px]
                    "
                  >
                    فرص تدريب مقترحة لك
                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/student/opportunities")
                    }
                    className="
                      flex
                      h-[34px]
                      shrink-0
                      items-center
                      justify-center
                      gap-[4px]
                      rounded-[9px]
                      border
                      border-[#09379A]
                      bg-white
                      px-3
                      text-[12px]
                      font-normal
                      text-[#09379A]
                      transition
                      hover:bg-[#F8FAFC]

                      sm:h-[36px]
                      sm:gap-[6px]
                      sm:px-[14px]
                      sm:text-[13px]

                      xl:px-[16px]
                      xl:text-[14px]
                    "
                  >
                    <span>عرض الكل</span>

                    <ChevronLeft
                      size={15}
                      strokeWidth={1.8}
                    />
                  </button>
                </div>

                <div>
                  {opportunities.map(
                    (opportunity, index) => {
                      const Icon = opportunity.icon;

                      return (
                        <button
                          type="button"
                          key={opportunity.title}
                          onClick={() => {
                            selectOpportunity(opportunity.id);
                            navigate('/student/opportunities/details');
                          }}
                          className={`
                            flex
                            min-h-[86px]
                            w-full
                            items-center
                            rounded-[10px]
                            bg-white
                            px-1
                            py-3
                            text-right
                            transition
                            hover:bg-[#F8FAFC]

                            sm:px-[8px]

                            lg:h-[88px]
                            lg:py-0

                            ${
                              index !==
                              opportunities.length - 1
                                ? "border-b border-[#E2E8F0]"
                                : ""
                            }
                          `}
                        >
                          <div
                            style={{
                              backgroundColor:
                                opportunity.iconBg,
                              borderColor:
                                opportunity.iconBorder,
                            }}
                            className="
                              flex
                              h-[44px]
                              w-[44px]
                              shrink-0
                              items-center
                              justify-center
                              rounded-[10px]
                              border
                              text-[#09379A]

                              sm:h-[48px]
                              sm:w-[48px]
                            "
                          >
                            <Icon
                              size={22}
                              strokeWidth={1.8}
                            />
                          </div>

                          <div
                            className="
                              mr-3
                              min-w-0
                              flex-1

                              sm:mr-[14px]
                            "
                          >
                            <h3
                              className="
                                m-0
                                line-clamp-2
                                text-[14px]
                                font-semibold
                                leading-[21px]
                                text-[#1E293B]

                                sm:text-[15px]
                                sm:leading-[22px]

                                md:truncate

                                xl:text-[16px]
                                xl:leading-[23px]
                              "
                            >
                              {opportunity.title}
                            </h3>

                            <div
                              className="
                                mt-[5px]
                                flex
                                flex-wrap
                                items-center
                                gap-[6px]

                                sm:gap-[8px]
                              "
                            >
                              <span
                                style={{
                                  backgroundColor:
                                    opportunity.chipBg,
                                }}
                                className="
                                  flex
                                  min-h-[23px]
                                  items-center
                                  gap-[5px]
                                  rounded-[9px]
                                  px-2
                                  text-[10px]
                                  leading-[17px]
                                  text-[#1E293B]

                                  sm:h-[24px]
                                  sm:px-[10px]
                                  sm:text-[11px]

                                  xl:text-[12px]
                                  xl:leading-[18px]
                                "
                              >
                                <span
                                  style={{
                                    backgroundColor:
                                      opportunity.chipDot,
                                  }}
                                  className="
                                    h-[5px]
                                    w-[5px]
                                    shrink-0
                                    rounded-full
                                  "
                                />

                                {opportunity.field}
                              </span>

                              <span
                                className="
                                  flex
                                  min-h-[23px]
                                  items-center
                                  rounded-[9px]
                                  border
                                  border-[#E2E8F0]
                                  bg-white
                                  px-2
                                  text-[10px]
                                  leading-[17px]
                                  text-[#64748B]

                                  sm:h-[24px]
                                  sm:px-[10px]
                                  sm:text-[11px]

                                  xl:text-[12px]
                                  xl:leading-[18px]
                                "
                              >
                                {opportunity.type}
                              </span>
                            </div>
                          </div>

                          <ChevronLeft
                            size={18}
                            strokeWidth={1.8}
                            className="
                              mr-1
                              shrink-0
                              text-[#94A3B8]

                              sm:mr-[8px]
                              sm:size-[20px]
                            "
                          />
                        </button>
                      );
                    }
                  )}
                </div>
              </section>
            </section>

            {/* =================================================
                FOOTER
            ================================================== */}
            <AcademicFooter audience="student" />
          </div>
        </main>
      </div>
    </div>
  );
}