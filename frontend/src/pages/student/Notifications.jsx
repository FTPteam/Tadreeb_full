import AcademicFooter from "../../components/shared/AcademicFooter";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Bell,
  BookOpen,
  Check,
  ClipboardCheck,
  FileText,
  Megaphone,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";
import { useApi } from "../../api/useApi";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "../../api/student";

// Notification kind → its label and the page it opens.
const KIND_VIEW = {
  application: ["طلب ميداني", "/student/applications"],
  training: ["التدريب", "/student/daily-training-log"],
  report: ["التقارير", "/student/reports"],
  announcement: ["إعلانات عامة", "/student/dashboard"],
};

async function loadNotifications() {
  return (await fetchNotifications()).map(item => ({
    ...item,
    type: item.kind,
    category: KIND_VIEW[item.kind]?.[0] || "إشعار",
    target: KIND_VIEW[item.kind]?.[1] || "/student/dashboard",
    time: new Date(item.time).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" }),
  }));
}

export default function Notifications() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");

  const loaded = useApi(loadNotifications, [], []);
  const [readIds, setReadIds] = useState(() => new Set());
  const notifications = (loaded.data || []).map(item =>
    readIds.has(item.id) ? { ...item, unread: false } : item,
  );
  const setNotifications = update => {
    const next = update(notifications);
    setReadIds(new Set(next.filter(item => !item.unread).map(item => item.id)));
  };

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const visibleNotifications = filter === "unread"
    ? notifications.filter((notification) => notification.unread)
    : notifications;

  const markAllAsRead = () => {
    markAllNotificationsRead().catch(() => {});
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const openNotification = (notification) => {
    if (notification.unread) markNotificationRead(notification.id).catch(() => {});
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              unread: false,
            }
          : item
      )
    );

    if (notification.target) {
      navigate(notification.target);
    }
  };

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

            xl:px-[40px]
            xl:pb-[40px]
            xl:pt-[14px]
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1080px]
            "
          >
            {/* =================================================
                BREADCRUMB
            ================================================== */}

            <nav
              aria-label="مسار التنقل"
              className="
                flex
                flex-wrap
                items-center
                gap-[7px]
                text-[11px]
                font-medium
                leading-[20px]
                text-[#64748B]

                sm:text-[12px]

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

              <span
                className="
                  font-bold
                  text-[#09379A]
                "
              >
                الإشعارات
              </span>
            </nav>

            {/* =================================================
                PAGE HEADER
            ================================================== */}

            <section
              className="
                mt-[6px]
                flex
                flex-col
                gap-2

                md:flex-row
                md:items-start
                md:justify-between
                md:gap-5
              "
            >
              <div>
                <h1
                  className="
                    m-0
                    text-[26px]
                    font-bold
                    leading-[40px]
                    text-[#09379A]

                    sm:text-[28px]

                    xl:text-[30px]
                    xl:leading-[42px]
                  "
                >
                  الإشعارات
                </h1>

                <p
                  className="
                    m-0
                    mt-[3px]
                    max-w-[680px]
                    text-[12px]
                    leading-[22px]
                    text-[#64748B]

                    sm:text-[13px]
                    sm:leading-[24px]
                  "
                >
                  تابع آخر التحديثات والإعلانات المتعلقة
                  بمسارك في التدريب الميداني
                </p>
              </div>
            </section>

            {/* =================================================
                FILTER BAR
            ================================================== */}

            <section
              className="
                mt-[22px]
                flex
                flex-col
                gap-4
                border-b
                border-[#E2E8F0]
                pb-[16px]

                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:gap-5
              "
            >
              {/* FILTER BUTTONS */}

              <div
                className="
                  flex
                  w-full
                  items-center
                  gap-[8px]

                  sm:w-auto
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setFilter("all")
                  }
                  className={`
                    flex
                    h-[38px]
                    min-w-[72px]
                    flex-1
                    items-center
                    justify-center
                    rounded-[8px]
                    border
                    px-[18px]
                    text-[11px]
                    font-bold
                    transition

                    sm:flex-none

                    ${
                      filter === "all"
                        ? `
                          border-[#09379A]
                          bg-[#09379A]
                          text-white
                        `
                        : `
                          border-[#D9E2EC]
                          bg-white
                          text-[#475569]

                          hover:bg-[#F8FAFC]
                        `
                    }
                  `}
                >
                  الكل
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFilter("unread")
                  }
                  className={`
                    flex
                    h-[38px]
                    min-w-[115px]
                    flex-1
                    items-center
                    justify-center
                    gap-[7px]
                    rounded-[8px]
                    border
                    px-[14px]
                    text-[11px]
                    font-bold
                    transition

                    sm:flex-none

                    ${
                      filter === "unread"
                        ? `
                          border-[#09379A]
                          bg-[#EEF4FF]
                          text-[#09379A]
                        `
                        : `
                          border-[#D9E2EC]
                          bg-white
                          text-[#475569]

                          hover:bg-[#F8FAFC]
                        `
                    }
                  `}
                >
                  غير مقروءة

                  {unreadCount > 0 && (
                    <span
                      className="
                        flex
                        h-[21px]
                        min-w-[21px]
                        items-center
                        justify-center
                        rounded-full
                        bg-[#FF6B35]
                        px-[6px]
                        text-[9px]
                        font-bold
                        text-white
                      "
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* MARK ALL */}

              <button
                type="button"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className={`
                  flex
                  w-fit
                  items-center
                  gap-[6px]
                  border-0
                  bg-transparent
                  p-0
                  text-[11px]
                  font-bold
                  transition

                  ${
                    unreadCount > 0
                      ? `
                        cursor-pointer
                        text-[#09379A]

                        hover:underline
                      `
                      : `
                        cursor-default
                        text-[#94A3B8]
                      `
                  }
                `}
              >
                <Check
                  size={14}
                  strokeWidth={2}
                />

                تحديد الكل كمقروء
              </button>
            </section>

            {/* =================================================
                NOTIFICATIONS
            ================================================== */}

            <section
              className="
                mt-[27px]
                flex
                flex-col
                gap-[15px]

                sm:gap-[16px]
              "
            >
              {visibleNotifications.length > 0 ? (
                visibleNotifications.map(
                  (notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={
                        notification
                      }
                      onClick={() =>
                        openNotification(
                          notification
                        )
                      }
                    />
                  )
                )
              ) : (
                <EmptyNotifications />
              )}
            </section>
          </div>
        
            <AcademicFooter audience="student" />
          </main>
      </div>
    </div>
  );
}

/* =========================================================
   NOTIFICATION CARD
========================================================= */

function NotificationCard({
  notification,
  onClick,
}) {
  const config = {
    application: {
      icon: ClipboardCheck,
      iconBox:
        "bg-[#EEF4FF] text-[#09379A]",
    },

    training: {
      icon: BookOpen,
      iconBox:
        "bg-[#ECFEFF] text-[#0891B2]",
    },

    report: {
      icon: FileText,
      iconBox:
        "bg-[#F8FAFC] text-[#475569]",
    },

    announcement: {
      icon: Megaphone,
      iconBox:
        "bg-[#EFFAFF] text-[#0284C7]",
    },
  };

  const {
    icon: Icon,
    iconBox,
  } =
    config[notification.type] ||
    config.report;

  return (
    <article
      className={`
        relative
        w-full
        overflow-hidden
        rounded-[14px]
        border
        transition

        ${
          notification.unread
            ? `
              border-[#D8E4F5]
              bg-white
              shadow-[0_2px_7px_rgba(15,23,42,0.04)]
            `
            : `
              border-[#E2E8F0]
              bg-white
            `
        }
      `}
    >
      <div
        className="
          flex
          flex-col
          gap-4
          px-4
          py-4

          sm:px-[18px]
          sm:py-[17px]

          md:flex-row
          md:items-center
          md:justify-between
          md:gap-5

          xl:min-h-[116px]
          xl:px-[20px]
          xl:py-[18px]
        "
      >
        {/* =================================================
            MAIN CONTENT
        ================================================== */}

        <div
          className="
            flex
            min-w-0
            flex-1
            items-start
            gap-[12px]

            sm:gap-[14px]
          "
        >
          {/* ICON */}

          <div
            className={`
              flex
              h-[44px]
              w-[44px]
              shrink-0
              items-center
              justify-center
              rounded-[10px]

              sm:h-[48px]
              sm:w-[48px]

              ${iconBox}
            `}
          >
            <Icon
              size={21}
              strokeWidth={1.7}
            />
          </div>

          {/* TEXT */}

          <div className="min-w-0 flex-1">
            {/* TITLE */}

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-[8px]
              "
            >
              {notification.unread && (
                <span
                  aria-label="غير مقروء"
                  className="
                    h-[8px]
                    w-[8px]
                    shrink-0
                    rounded-full
                    bg-[#FF6B35]
                    ring-[4px]
                    ring-[#FFF0E9]
                  "
                />
              )}

              <h2
                className="
                  m-0
                  text-[14px]
                  font-bold
                  leading-[22px]
                  text-[#1E293B]

                  sm:text-[15px]
                "
              >
                {notification.title}
              </h2>
            </div>

            {/* DESCRIPTION */}

            <p
              className="
                m-0
                mt-[5px]
                max-w-[780px]
                text-[11px]
                leading-[21px]
                text-[#64748B]

                sm:text-[12px]
                sm:leading-[23px]
              "
            >
              {notification.description}
            </p>

            {/* META */}

            <div
              className="
                mt-[9px]
                flex
                flex-wrap
                items-center
                gap-x-[10px]
                gap-y-[7px]
              "
            >
              <span
                className="
                  flex
                  min-h-[24px]
                  items-center
                  rounded-[6px]
                  bg-[#EEF4FF]
                  px-[9px]
                  text-[9px]
                  font-bold
                  text-[#2563EB]

                  sm:text-[10px]
                "
              >
                {notification.category}
              </span>

              <span
                className="
                  hidden
                  h-[4px]
                  w-[4px]
                  rounded-full
                  bg-[#CBD5E1]

                  sm:block
                "
              />

              <span
                className="
                  text-[9px]
                  text-[#94A3B8]

                  sm:text-[10px]
                "
              >
                {notification.time}
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            OPEN BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={onClick}
          aria-label={`فتح ${notification.title}`}
          className="
            flex
            h-[38px]
            w-full
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-[8px]
            border
            border-[#E2E8F0]
            bg-white
            text-[11px]
            font-bold
            text-[#64748B]
            transition

            hover:border-[#C9D9F8]
            hover:bg-[#F5F8FF]
            hover:text-[#09379A]

            md:h-[36px]
            md:w-[36px]
            md:rounded-full
            md:border-0
            md:bg-transparent
          "
        >
          <span className="md:hidden">
            فتح الإشعار
          </span>

          <ArrowLeft
            size={18}
            strokeWidth={1.7}
          />
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyNotifications() {
  return (
    <div
      className="
        flex
        min-h-[320px]
        flex-col
        items-center
        justify-center
        rounded-[14px]
        border
        border-[#DDE5EF]
        bg-white
        px-[24px]
        py-[40px]
        text-center
      "
    >
      <div
        className="
          flex
          h-[56px]
          w-[56px]
          items-center
          justify-center
          rounded-full
          bg-[#EEF4FF]
          text-[#09379A]
        "
      >
        <Bell
          size={25}
          strokeWidth={1.7}
        />
      </div>

      <h3
        className="
          m-0
          mt-[14px]
          text-[16px]
          font-bold
          text-[#1E293B]
        "
      >
        لا توجد إشعارات
      </h3>

      <p
        className="
          m-0
          mt-[5px]
          max-w-[340px]
          text-[11px]
          leading-[20px]
          text-[#64748B]

          sm:text-[12px]
        "
      >
        لا توجد إشعارات مطابقة للحالة المحددة حاليا.
        ستظهر هنا أي تحديثات جديدة تخص تدريبك الميداني.
      </p>
    </div>
  );
}