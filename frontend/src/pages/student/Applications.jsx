import AcademicFooter from "../../components/shared/AcademicFooter";
import { useEffect, useMemo, useState } from "react";
import { getApplications, subscribeApplications } from "../training-provider/providerApplicationsStore";
import { getOpportunity } from "../training-provider/opportunitiesStore";
import { getAcademicDecision, getAcademicDecisionRecord, getOverallApplicationStatus } from "../../services/trainingWorkflow";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FilePenLine,
  FileText,
  MapPin,
  Search,
  SlidersHorizontal,
  Timer,
} from "lucide-react";

import Header from "../../components/student/Header";
import Sidebar from "../../components/student/Sidebar";

export default function Applications() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("الكل");

  /* =========================================================
     FILTERS
  ========================================================= */

  const filters = [
    "الكل",
    "قيد المراجعة",
    "قيد الانتظار",
    "مقبول",
    "يحتاج تعديل",
    "مرفوض",
  ];

  /* =========================================================
     APPLICATIONS DATA
  ========================================================= */

  const demoApplications = [
    {
      id: "TR-2025-045",
      title: "تدريب في شركة القدس للاتصالات",
      organization: "شركة القدس للاتصالات (Paltel)",
      location: "غزة - الرمال الجنوبي",
      submittedAt: "2025/09/10",
      updatedAt: "2025/09/14",
      hours: "120 ساعة",
      status: "قيد الانتظار",
      statusType: "waiting",
      description:
        "تمت مراجعة البيانات والمستندات، والطلب بانتظار المصادقة النهائية.",
    },

    {
      id: "TR-2025-031",
      title: "تدريب في شركة التقنية الحديثة",
      organization: "شركة التقنية الحديثة",
      location: "غزة - الرمال",
      submittedAt: "2025/08/18",
      updatedAt: "2025/08/25",
      hours: "100 ساعة",
      status: "مقبول",
      statusType: "accepted",
      description:
        "تم اعتماد الطلب وقبول الطالب للبدء بإجراءات التدريب الميداني.",
    },

    {
      id: "TR-2025-018",
      title: "تدريب في مركز فلسطين للتطوير",
      organization: "مركز فلسطين للتطوير",
      location: "غزة",
      submittedAt: "2025/07/12",
      updatedAt: "2025/07/15",
      hours: "90 ساعة",
      status: "يحتاج تعديل",
      statusType: "revision",
      description:
        "يرجى تحديث أحد المستندات المطلوبة لإكمال إجراءات مراجعة الطلب.",
    },
  ];

  const [liveRequests, setLiveRequests] = useState(() => getApplications().filter(x => x.source === 'student'));
  useEffect(() => {
    const refresh = () => setLiveRequests(getApplications().filter(x => x.source === "student"));
    const unsubscribe = subscribeApplications(refresh);
    window.addEventListener("admin-training-requests-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      unsubscribe();
      window.removeEventListener("admin-training-requests-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  const liveApplications = liveRequests.map(row => {
    const opportunity = getOpportunity(row.opportunityId);
    const academicDecision = getAcademicDecision(row.id);
    const academicRecord = getAcademicDecisionRecord(row.id);
    const overall = getOverallApplicationStatus(row, academicDecision);
    const type = overall === "accepted" ? "accepted" : overall === "rejected" ? "rejected" : "waiting";
    const description = academicDecision === "rejected"
      ? "رفضت الإدارة الطلب: " + (academicRecord?.rejectionReason || academicRecord?.note || "راجع جهة الإشراف الأكاديمي")
      : row.status === "rejected"
        ? row.rejectionReason || "رفضت جهة التدريب الطلب"
        : overall === "accepted"
          ? "اكتملت موافقة الإدارة وجهة التدريب، وأصبح سجل التدريب جاهزًا"
          : academicDecision === "approved"
            ? "اعتمدت الإدارة الطلب، وبانتظار قرار جهة التدريب"
            : row.status === "accepted"
              ? "وافقت جهة التدريب، وبانتظار اعتماد الإدارة"
              : "الطلب بانتظار مراجعة الإدارة وجهة التدريب";
    return {
      id: row.id, title: opportunity?.title || "فرصة تدريب",
      organization: row.organization || "جهة التدريب", location: opportunity?.location || "غزة",
      submittedAt: row.date?.replaceAll("-", "/") || "",
      updatedAt: (row.decidedAt || row.date || "").replaceAll("-", "/"),
      hours: `${opportunity?.hours || 0} ساعة`,
      status: overall === "accepted" ? "مقبول" : overall === "rejected" ? "مرفوض" : "قيد الانتظار",
      statusType: type,
      description,
    };
  });
  const applications = [...liveApplications, ...demoApplications];

  /* =========================================================
     FILTER APPLICATIONS
  ========================================================= */

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const search =
        searchTerm.trim().toLowerCase();

      const matchesSearch =
        application.title
          .toLowerCase()
          .includes(search) ||
        application.organization
          .toLowerCase()
          .includes(search) ||
        application.id
          .toLowerCase()
          .includes(search);

      const matchesFilter =
        activeFilter === "الكل" ||
        application.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter, applications]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = [
    {
      label: "إجمالي الطلبات",
      value: applications.length,
      icon: FileText,
    },
    {
      label: "قيد المتابعة",
      value: applications.filter(
        (item) =>
          item.statusType === "waiting" ||
          item.statusType === "review"
      ).length,
      icon: Clock3,
    },
    {
      label: "طلبات مقبولة",
      value: applications.filter(
        (item) =>
          item.statusType === "accepted"
      ).length,
      icon: CheckCircle2,
    },
    {
      label: "تحتاج إجراء",
      value: applications.filter(
        (item) =>
          item.statusType === "revision"
      ).length,
      icon: FilePenLine,
    },
  ];

  /* =========================================================
     STATUS DESIGN
  ========================================================= */

  const getStatusStyle = (
    statusType
  ) => {
    switch (statusType) {
      case "accepted":
        return {
          wrapper:
            "bg-[#ECFDF3] text-[#16844C] border-[#BBE8C9]",
          dot: "bg-[#10B981]",
        };

      case "rejected":
      case "revision":
        return {
          wrapper:
            "bg-[#FFF1F2] text-[#DC2626] border-[#FECDD3]",
          dot: "bg-[#EF4444]",
        };

      case "waiting":
        return {
          wrapper:
            "bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]",
          dot: "bg-[#F97316]",
        };

      default:
        return {
          wrapper:
            "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
          dot: "bg-[#2563EB]",
        };
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
            CONTENT
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
                mb-2
                flex
                items-center
                gap-[7px]
                text-[11px]
                font-medium

                sm:text-[12px]

                xl:text-[13px]
              "
            >
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/student/dashboard"
                  )
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
                طلباتي
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
                  text-[#14213D]

                  sm:text-[25px]

                  xl:text-[28px]
                  xl:leading-[40px]
                "
              >
                طلباتي
              </h1>

              <p
                className="
                  m-0
                  mt-[3px]
                  max-w-[680px]
                  text-[12px]
                  leading-[21px]
                  text-[#64748B]

                  sm:text-[13px]

                  xl:text-[14px]
                  xl:leading-[22px]
                "
              >
                تابع طلبات التدريب الميداني
                وحالة كل طلب وآخر الإجراءات
                المرتبطة به
              </p>
            </section>

            {/* =================================================
                STATISTICS
            ================================================== */}
            <section
              className="
                mt-5
                grid
                grid-cols-1
                gap-3

                min-[420px]:grid-cols-2

                lg:grid-cols-4

                xl:gap-4
              "
            >
              {stats.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.label}
                    className="
                      flex
                      min-h-[86px]
                      items-center
                      gap-3
                      rounded-[12px]
                      border
                      border-[#E2E8F0]
                      bg-white
                      px-4
                      py-3
                      shadow-[0_1px_2px_rgba(15,23,42,0.03)]
                    "
                  >
                    <div
                      className="
                        flex
                        h-[42px]
                        w-[42px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-[10px]
                        bg-[#EEF3FF]
                        text-[#09379A]
                      "
                    >
                      <Icon
                        size={21}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div>
                      <p
                        className="
                          m-0
                          text-[10px]
                          text-[#64748B]

                          sm:text-[11px]
                        "
                      >
                        {item.label}
                      </p>

                      <strong
                        className="
                          mt-[2px]
                          block
                          text-[20px]
                          font-bold
                          text-[#1E293B]

                          sm:text-[22px]
                        "
                      >
                        {item.value}
                      </strong>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* =================================================
                SEARCH + FILTERS
            ================================================== */}
            <section
              className="
                mt-5
                rounded-[14px]
                border
                border-[#E2E8F0]
                bg-white
                p-3

                sm:p-4
              "
            >
              {/* SEARCH */}
              <div
                className="
                  flex
                  flex-col
                  gap-3

                  md:flex-row
                  md:items-center
                "
              >
                <div
                  className="
                    flex
                    h-[44px]
                    min-w-0
                    flex-1
                    items-center
                    rounded-[8px]
                    border
                    border-[#D9E2EC]
                    bg-white
                    px-3
                    transition

                    focus-within:border-[#09379A]
                    focus-within:ring-2
                    focus-within:ring-[#09379A]/10
                  "
                >
                  <Search
                    size={18}
                    strokeWidth={1.8}
                    className="
                      shrink-0
                      text-[#64748B]
                    "
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(
                        event.target.value
                      )
                    }
                    placeholder="ابحث باسم الفرصة أو الجهة أو رقم الطلب..."
                    className="
                      mr-2
                      h-full
                      min-w-0
                      flex-1
                      border-0
                      bg-transparent
                      font-['Cairo']
                      text-[11px]
                      text-[#334155]
                      outline-none

                      placeholder:text-[#94A3B8]

                      sm:text-[12px]
                    "
                  />
                </div>

                <button
                  type="button"
                  className="
                    flex
                    h-[44px]
                    w-full
                    shrink-0
                    items-center
                    justify-center
                    gap-[7px]
                    rounded-[8px]
                    border
                    border-[#D9E2EC]
                    bg-white
                    px-4
                    text-[11px]
                    font-bold
                    text-[#475569]
                    transition

                    hover:bg-[#F8FAFC]

                    md:w-auto
                  "
                >
                  <SlidersHorizontal
                    size={16}
                  />

                  تصفية
                </button>
              </div>

              {/* FILTERS */}
              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  gap-[7px]
                "
              >
                {filters.map((filter) => {
                  const isActive =
                    activeFilter === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() =>
                        setActiveFilter(
                          filter
                        )
                      }
                      className={`
                        min-h-[34px]
                        rounded-[9px]
                        border
                        px-3
                        text-[10px]
                        font-bold
                        transition

                        sm:text-[11px]

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
                              text-[#64748B]

                              hover:border-[#B8C8DF]
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
                APPLICATIONS HEADER
            ================================================== */}
            <section
              className="
                mt-5
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-[8px]
                "
              >
                <span
                  className="
                    h-[23px]
                    w-[4px]
                    rounded-full
                    bg-[#09379A]
                  "
                />

                <h2
                  className="
                    m-0
                    text-[15px]
                    font-bold
                    text-[#1E293B]

                    sm:text-[16px]
                  "
                >
                  طلبات التدريب
                </h2>
              </div>

              <span
                className="
                  rounded-full
                  bg-[#EEF2F7]
                  px-[9px]
                  py-[4px]
                  text-[9px]
                  text-[#64748B]
                "
              >
                {filteredApplications.length} طلب
              </span>
            </section>

            {/* =================================================
                APPLICATION CARDS
            ================================================== */}
            <section
              className="
                mt-3
                flex
                flex-col
                gap-4
              "
            >
              {filteredApplications.length >
              0 ? (
                filteredApplications.map(
                  (application) => {
                    const statusStyle =
                      getStatusStyle(
                        application.statusType
                      );

                    return (
                      <article
                        key={application.id}
                        className="
                          rounded-[14px]
                          border
                          border-[#E2E8F0]
                          bg-white
                          p-4
                          transition

                          hover:border-[#C5D3E6]
                          hover:shadow-[0_5px_18px_rgba(15,23,42,0.05)]

                          sm:p-5
                        "
                      >
                        {/* =====================================
                            TOP
                        ====================================== */}
                        <div
                          className="
                            flex
                            flex-col
                            gap-4

                            md:flex-row
                            md:items-start
                            md:justify-between
                          "
                        >
                          <div
                            className="
                              flex
                              min-w-0
                              items-start
                              gap-3
                            "
                          >
                            <div
                              className="
                                flex
                                h-[46px]
                                w-[46px]
                                shrink-0
                                items-center
                                justify-center
                                rounded-[11px]
                                bg-[#EEF3FF]
                                text-[#09379A]
                              "
                            >
                              <FileCheck2
                                size={22}
                                strokeWidth={1.7}
                              />
                            </div>

                            <div className="min-w-0">
                              <div
                                className="
                                  flex
                                  flex-wrap
                                  items-center
                                  gap-2
                                "
                              >
                                <h3
                                  className="
                                    m-0
                                    text-[15px]
                                    font-bold
                                    leading-[23px]
                                    text-[#1E293B]

                                    sm:text-[16px]

                                    xl:text-[17px]
                                  "
                                >
                                  {
                                    application.title
                                  }
                                </h3>

                                <span
                                  className={`
                                    inline-flex
                                    min-h-[24px]
                                    items-center
                                    gap-[5px]
                                    rounded-full
                                    border
                                    px-[9px]
                                    text-[9px]
                                    font-bold

                                    ${statusStyle.wrapper}
                                  `}
                                >
                                  <span
                                    className={`
                                      h-[5px]
                                      w-[5px]
                                      rounded-full

                                      ${statusStyle.dot}
                                    `}
                                  />

                                  {
                                    application.status
                                  }
                                </span>
                              </div>

                              <p
                                className="
                                  m-0
                                  mt-[3px]
                                  text-[10px]
                                  leading-[18px]
                                  text-[#64748B]

                                  sm:text-[11px]
                                "
                              >
                                {
                                  application.description
                                }
                              </p>
                            </div>
                          </div>

                          <div
                            className="
                              flex
                              shrink-0
                              items-center
                              rounded-[7px]
                              bg-[#F8FAFC]
                              px-[10px]
                              py-[6px]
                              text-[9px]
                              font-bold
                              text-[#64748B]
                            "
                            dir="ltr"
                          >
                            #{application.id}
                          </div>
                        </div>

                        {/* =====================================
                            DETAILS
                        ====================================== */}
                        <div
                          className="
                            mt-4
                            grid
                            grid-cols-1
                            gap-3
                            border-y
                            border-[#EEF2F7]
                            py-4

                            sm:grid-cols-2

                            lg:grid-cols-4
                          "
                        >
                          <ApplicationInfo
                            icon={Building2}
                            label="جهة التدريب"
                            value={
                              application.organization
                            }
                          />

                          <ApplicationInfo
                            icon={MapPin}
                            label="الموقع"
                            value={
                              application.location
                            }
                          />

                          <ApplicationInfo
                            icon={CalendarDays}
                            label="تاريخ التقديم"
                            value={
                              application.submittedAt
                            }
                            ltr
                          />

                          <ApplicationInfo
                            icon={Timer}
                            label="الساعات التدريبية"
                            value={
                              application.hours
                            }
                          />
                        </div>

                        {/* =====================================
                            BOTTOM
                        ====================================== */}
                        <div
                          className="
                            mt-4
                            flex
                            flex-col
                            gap-3

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              gap-[6px]
                              text-[9px]
                              text-[#94A3B8]

                              sm:text-[10px]
                            "
                          >
                            <Clock3
                              size={13}
                            />

                            آخر تحديث:

                            <span
                              dir="ltr"
                              className="
                                font-medium
                                text-[#64748B]
                              "
                            >
                              {
                                application.updatedAt
                              }
                            </span>
                          </div>

                          <div
                            className="
                              flex
                              flex-col
                              gap-2

                              min-[480px]:flex-row
                              min-[480px]:flex-wrap
                            "
                          >
                            {/* REVISION */}
                            {application.statusType ===
                              "revision" && (
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    "/student/apply-training/documents"
                                  )
                                }
                                className="
                                  flex
                                  h-[38px]
                                  items-center
                                  justify-center
                                  gap-[7px]
                                  rounded-[8px]
                                  border
                                  border-[#FECACA]
                                  bg-[#FFF7F7]
                                  px-[13px]
                                  text-[10px]
                                  font-bold
                                  text-[#DC2626]
                                  transition

                                  hover:bg-[#FFF1F2]
                                "
                              >
                                <FilePenLine
                                  size={14}
                                />

                                استكمال التعديل
                              </button>
                            )}

                            {/* ACCEPTED */}
                            {application.statusType ===
                              "accepted" && (
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/student/applications/${application.id}/accepted`
                                  )
                                }
                                className="
                                  flex
                                  h-[38px]
                                  items-center
                                  justify-center
                                  gap-[7px]
                                  rounded-[8px]
                                  border
                                  border-[#BBE8C9]
                                  bg-[#F0FDF4]
                                  px-[13px]
                                  text-[10px]
                                  font-bold
                                  text-[#16844C]
                                  transition

                                  hover:bg-[#DCFCE7]
                                "
                              >
                                <CheckCircle2
                                  size={14}
                                />

                                تفاصيل القبول
                              </button>
                            )}

                            {/* STATUS */}
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/student/applications/${application.id}/status`
                                )
                              }
                              className="
                                flex
                                h-[38px]
                                items-center
                                justify-center
                                gap-[7px]
                                rounded-[8px]
                                border-0
                                bg-[#09379A]
                                px-[15px]
                                text-[10px]
                                font-bold
                                text-white
                                transition

                                hover:bg-[#072E81]
                              "
                            >
                              متابعة حالة الطلب

                              <ArrowLeft
                                size={14}
                              />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )
              ) : (
                /* =================================================
                    EMPTY STATE
                ================================================== */
                <div
                  className="
                    flex
                    min-h-[240px]
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
                      bg-[#EEF3FF]
                      text-[#09379A]
                    "
                  >
                    <FileText
                      size={22}
                    />
                  </div>

                  <h3
                    className="
                      m-0
                      mt-3
                      text-[14px]
                      font-bold
                      text-[#1E293B]
                    "
                  >
                    لا توجد طلبات مطابقة
                  </h3>

                  <p
                    className="
                      m-0
                      mt-[4px]
                      text-[10px]
                      text-[#64748B]
                    "
                  >
                    جرّب تغيير البحث أو حالة
                    الطلب المحددة
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
                      text-[10px]
                      font-bold
                      text-[#09379A]
                      transition

                      hover:bg-[#09379A]
                      hover:text-white
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

/* =========================================================
   APPLICATION INFO
========================================================= */

function ApplicationInfo({
  icon: Icon,
  label,
  value,
  ltr = false,
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-start
        gap-[8px]
      "
    >
      <div
        className="
          flex
          h-[30px]
          w-[30px]
          shrink-0
          items-center
          justify-center
          rounded-[7px]
          bg-[#F3F6FB]
          text-[#09379A]
        "
      >
        <Icon
          size={14}
          strokeWidth={1.8}
        />
      </div>

      <div className="min-w-0">
        <p
          className="
            m-0
            text-[8px]
            text-[#94A3B8]

            sm:text-[9px]
          "
        >
          {label}
        </p>

        <strong
          dir={ltr ? "ltr" : "rtl"}
          className="
            mt-[3px]
            block
            text-[10px]
            font-bold
            leading-[17px]
            text-[#334155]

            sm:text-[11px]
          "
        >
          {value}
        </strong>
      </div>
    </div>
  );
}