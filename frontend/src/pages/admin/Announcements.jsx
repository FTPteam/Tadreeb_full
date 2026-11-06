import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  ChevronLeft,
  CheckCheck,
  FileCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock3,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

/* =========================================================
   NOTIFICATIONS DATA
========================================================= */

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "requests",
    title: "طلب تدريب جديد",
    description:
      "قدمت الطالبة هدى شهير طلبًا جديدًا في استوديو بيكسل",
    time: "منذ 10 دقائق",
    badge: "طلب",
    read: false,
    icon: FileCheck,
    iconClass: "bg-[#FFE5D9] text-[#B54708]",
  },
  {
    id: 2,
    type: "reports",
    title: "تقرير يحتاج مراجعة",
    description:
      "أرسلت أمل أحمد تقرير الأسبوع 3",
    time: "منذ ساعة",
    badge: "تقرير",
    read: false,
    icon: FileText,
    iconClass: "bg-[#E8EEF9] text-[#09379A]",
  },
  {
    id: 3,
    type: "completed",
    title: "انتهى التدريب",
    description:
      "أنهى الطالب أنس البيطار فترة التدريب بنجاح",
    time: "أمس",
    badge: "تدريب",
    read: true,
    icon: CheckCircle2,
    iconClass: "bg-[#DCFCE7] text-[#15803D]",
  },
  {
    id: 4,
    type: "alerts",
    title: "تنبيه مهم",
    description:
      "3 طلاب متأخرون في تسليم التقرير الأسبوعي",
    time: "أمس",
    badge: "تنبيه",
    read: true,
    icon: AlertTriangle,
    iconClass: "bg-[#FFE5D9] text-[#B54708]",
  },
  {
    id: 5,
    type: "requests",
    title: "طلب تدريب جديد",
    description:
      "قدم الطالب محمود رضوان طلب تدريب جديد",
    time: "منذ يومين",
    badge: "طلب",
    read: true,
    icon: FileCheck,
    iconClass: "bg-[#FFE5D9] text-[#B54708]",
  },
  {
    id: 6,
    type: "reports",
    title: "تقرير أسبوعي جديد",
    description:
      "تم إرسال تقرير أسبوعي جديد من سارة عبد الرحمن",
    time: "منذ يومين",
    badge: "تقرير",
    read: true,
    icon: FileText,
    iconClass: "bg-[#E8EEF9] text-[#09379A]",
  },
  {
    id: 7,
    type: "completed",
    title: "اكتمال فترة التدريب",
    description:
      "أكملت نور خليل جميع الساعات التدريبية المطلوبة",
    time: "منذ 3 أيام",
    badge: "تدريب",
    read: true,
    icon: CheckCircle2,
    iconClass: "bg-[#DCFCE7] text-[#15803D]",
  },
  {
    id: 8,
    type: "alerts",
    title: "اقتراب موعد تسليم",
    description:
      "موعد تسليم التقارير الأسبوعية خلال يومين",
    time: "منذ 3 أيام",
    badge: "تنبيه",
    read: true,
    icon: Clock3,
    iconClass: "bg-[#DDF6FF] text-[#08759B]",
  },
];

/* =========================================================
   FILTERS
========================================================= */

const FILTERS = [
  {
    id: "all",
    label: "الكل",
  },
  {
    id: "requests",
    label: "طلبات جديدة",
  },
  {
    id: "reports",
    label: "تقارير",
  },
  {
    id: "completed",
    label: "تدريبات منتهية",
  },
  {
    id: "alerts",
    label: "تنبيهات",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function Announcements() {
  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState(INITIAL_NOTIFICATIONS);

  const [activeFilter, setActiveFilter] =
    useState("all");

  /* =======================================================
     FILTERED NOTIFICATIONS
  ======================================================= */

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") {
      return notifications;
    }

    return notifications.filter(
      (notification) =>
        notification.type === activeFilter
    );
  }, [notifications, activeFilter]);

  /* =======================================================
     UNREAD
  ======================================================= */

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  /* =======================================================
     ACTIONS
  ======================================================= */

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const handleNotification = (notification) => {
    markAsRead(notification.id);

    if (notification.type === "requests") {
      navigate("/admin/training-requests");
      return;
    }

    if (notification.type === "reports") {
      navigate("/admin/reports");
      return;
    }

    if (notification.type === "completed") {
      navigate("/admin/training-monitoring");
      return;
    }

    if (notification.type === "alerts") {
      navigate("/admin/reports");
    }
  };

  /* =======================================================
     MOBILE SIDEBAR
  ======================================================= */

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
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar />

      {/* =====================================================
          PAGE
      ====================================================== */}

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
        {/* =================================================
            HEADER
        ================================================== */}

        <AdminHeader />

        {/* =================================================
            CONTENT - ONLY THIS AREA SCROLLS
        ================================================== */}

        <main
          className="
            w-full
            min-w-0
            flex-1

            overflow-x-hidden
            overflow-y-auto

            px-4
            pb-8
            pt-5

            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1450px]
            "
          >
            {/* =============================================
                BREADCRUMB
            ============================================== */}

            <div
              className="
                mb-3

                flex
                items-center
                gap-2

                text-[12px]
                text-[#64748B]
              "
            >
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/dashboard")
                }
                className="
                  hover:text-[#09379A]
                "
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <span
                className="
                  font-semibold
                  text-[#111C2D]
                "
              >
                الإشعارات
              </span>
            </div>

            {/* =============================================
                TITLE
            ============================================== */}

            <section
              className="
                mb-6

                flex
                flex-col
                gap-4

                sm:flex-row
                sm:items-start
                sm:justify-between
              "
            >
              <div>
                <h1
                  className="
                    m-0

                    text-[24px]
                    font-bold
                    leading-9

                    text-[#111C2D]

                    sm:text-[27px]
                  "
                >
                  الإشعارات
                </h1>

                <p
                  className="
                    m-0
                    mt-1

                    text-[13px]
                    leading-6

                    text-[#64748B]
                  "
                >
                  آخر التحديثات المتعلقة بطلابك
                </p>
              </div>

              <button
                type="button"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="
                  inline-flex
                  h-[44px]
                  items-center
                  justify-center
                  gap-2

                  rounded-[8px]

                  border
                  border-[#E0E7F2]

                  bg-white

                  px-4

                  text-[12px]
                  font-semibold

                  text-[#111C2D]

                  transition

                  hover:border-[#09379A]
                  hover:text-[#09379A]

                  disabled:cursor-default
                  disabled:opacity-50
                "
              >
                <CheckCheck size={17} />

                تحديد الكل كمقروء
              </button>
            </section>

            {/* =============================================
                FILTERS
            ============================================== */}

            <section
              className="
                mb-6

                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() =>
                    setActiveFilter(filter.id)
                  }
                  className={`
                    h-[36px]

                    rounded-full

                    border

                    px-4

                    text-[11px]

                    transition

                    ${
                      activeFilter === filter.id
                        ? `
                            border-[#09379A]
                            bg-[#09379A]
                            font-semibold
                            text-white
                          `
                        : `
                            border-[#E0E7F2]
                            bg-white
                            text-[#475569]
                            hover:border-[#B9C9E8]
                          `
                    }
                  `}
                >
                  {filter.label}
                </button>
              ))}
            </section>

            {/* =============================================
                NOTIFICATIONS
            ============================================== */}

            <section
              className="
                w-full
                min-w-0

                overflow-hidden

                rounded-[12px]

                border
                border-[#E0E7F2]

                bg-white
              "
            >
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(
                  (notification, index) => {
                    const Icon = notification.icon;

                    return (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() =>
                          handleNotification(
                            notification
                          )
                        }
                        className={`
                          relative

                          flex
                          w-full
                          min-w-0

                          items-start
                          gap-4

                          px-4
                          py-5

                          text-right

                          transition-colors

                          sm:px-6

                          ${
                            index !==
                            filteredNotifications.length -
                              1
                              ? `
                                  border-b
                                  border-[#E6EBF5]
                                `
                              : ""
                          }

                          ${
                            notification.read
                              ? `
                                  bg-white
                                  hover:bg-[#FAFBFE]
                                `
                              : `
                                  bg-[#F5F8FE]
                                  hover:bg-[#EEF4FC]
                                `
                          }
                        `}
                      >
                        {/* ICON */}

                        <div
                          className={`
                            flex
                            h-[46px]
                            w-[46px]
                            shrink-0

                            items-center
                            justify-center

                            rounded-[9px]

                            ${notification.iconClass}
                          `}
                        >
                          <Icon
                            size={20}
                            strokeWidth={1.8}
                          />
                        </div>

                        {/* CONTENT */}

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <h2
                            className="
                              m-0

                              text-[12px]
                              font-bold
                              leading-6

                              text-[#111C2D]

                              sm:text-[13px]
                            "
                          >
                            {notification.title}
                          </h2>

                          <p
                            className="
                              m-0
                              mt-[2px]

                              text-[12px]
                              leading-6

                              text-[#64748B]

                              sm:text-[13px]
                            "
                          >
                            {notification.description}
                          </p>

                          <div
                            className="
                              mt-1

                              flex
                              flex-wrap
                              items-center
                              gap-2
                            "
                          >
                            <span
                              className="
                                rounded-full

                                bg-[#F1F5F9]

                                px-2
                                py-[2px]

                                text-[9px]
                                font-medium

                                text-[#475569]
                              "
                            >
                              {notification.badge}
                            </span>

                            <span
                              className="
                                text-[10px]
                                text-[#64748B]
                              "
                            >
                              {notification.time}
                            </span>
                          </div>
                        </div>

                        {/* UNREAD DOT */}

                        {!notification.read && (
                          <span
                            className="
                              absolute
                              left-[23px]
                              top-1/2

                              h-[7px]
                              w-[7px]

                              -translate-y-1/2

                              rounded-full

                              bg-[#FF6B35]
                            "
                          />
                        )}
                      </button>
                    );
                  }
                )
              ) : (
                <div
                  className="
                    flex
                    min-h-[300px]
                    flex-col
                    items-center
                    justify-center

                    px-5
                    py-12

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

                      bg-[#F1F5F9]

                      text-[#64748B]
                    "
                  >
                    <Bell size={24} />
                  </div>

                  <h3
                    className="
                      m-0
                      mt-4

                      text-[14px]
                      font-bold

                      text-[#334155]
                    "
                  >
                    لا توجد إشعارات
                  </h3>

                  <p
                    className="
                      m-0
                      mt-1

                      text-[11px]
                      text-[#64748B]
                    "
                  >
                    لا توجد إشعارات مطابقة لهذا التصنيف.
                  </p>
                </div>
              )}
            </section>

            {/* =============================================
                FOOTER
            ============================================== */}

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}