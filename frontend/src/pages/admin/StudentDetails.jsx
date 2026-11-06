import AcademicFooter from "../../components/shared/AcademicFooter";
import AdminHeader from "../../components/admin/Header";

import { useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import {
  Bell,
  Menu,
  ChevronLeft,
  Pencil,
  Mail,
  CalendarCheck,
  Star,
  CheckCircle2,
  MessageSquare,
  Send,
  X,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";
import { getStudent } from "./studentsStore";

// =====================================================
// STUDENTS DATA
// =====================================================

const STUDENTS = {
  "20231234": {
    id: "20231234",
    name: "أمل أحمد صيام أبو زيد",
    major: "البرمجيات وقواعد البيانات",
    level: "الدبلوم المتوسط",
    organization: "شركة القدس للاتصالات",
    supervisor: "م. خالد عودة",
    phone: "0599000111",
    startDate: "2025/12/01",
    endDate: "2026/02/01",
    status: "قيد التدريب",
    completedHours: 72,
    totalHours: 120,
    attendance: 92,
    rating: 4.0,
    notes: "الطالبة ملتزمة بالحضور وتتعلم الأدوات الجديدة بسرعة.",
  },
  "20231045": {
    id: "20231045",
    name: "محمود إبراهيم رضوان",
    major: "تكنولوجيا علم البيانات",
    level: "الدبلوم المتوسط",
    organization: "شركة المشرق الرقمية",
    supervisor: "م. خالد عودة",
    phone: "0599000111",
    startDate: "2025/12/01",
    endDate: "2026/02/01",
    status: "قيد التدريب",
    completedHours: 84,
    totalHours: 120,
    attendance: 95,
    rating: 4.5,
    notes: "الطالب ملتزم ويحقق تقدمًا جيدًا في المهام المطلوبة.",
  },
  "20231188": {
    id: "20231188",
    name: "سارة عبد الرحمن",
    major: "الاتصالات وإنترنت الأشياء",
    level: "الدبلوم المتوسط",
    organization: "شركة جوال",
    supervisor: "م. خالد عودة",
    phone: "0599000111",
    startDate: "—",
    endDate: "—",
    status: "بانتظار الاعتماد",
    completedHours: 0,
    totalHours: 120,
    attendance: 0,
    rating: 0,
    notes: "الطلب قيد الاعتماد.",
  },
  "20231302": {
    id: "20231302",
    name: "أنس كمال البيطار",
    major: "إلكترونيات صناعية وتحكم",
    level: "الدبلوم المتوسط",
    organization: "شركة الأمل للأنظمة الصناعية",
    supervisor: "م. خالد عودة",
    phone: "0599000111",
    startDate: "2025/09/15",
    endDate: "2025/11/15",
    status: "منتهٍ",
    completedHours: 120,
    totalHours: 120,
    attendance: 97,
    rating: 4.8,
    notes: "أكمل الطالب التدريب بنجاح.",
  },
  "20231450": {
    id: "20231450",
    name: "هدى يوسف شهر",
    major: "التصميم الجرافيكي والفنون الرقمية",
    level: "الدبلوم المتوسط",
    organization: "استوديو بيكسل للتصميم",
    supervisor: "م. خالد عودة",
    phone: "0599000111",
    startDate: "2026/01/10",
    endDate: "2026/03/10",
    status: "لم يبدأ",
    completedHours: 0,
    totalHours: 120,
    attendance: 0,
    rating: 0,
    notes: "لم يبدأ التدريب بعد.",
  },
  "20231533": {
    id: "20231533",
    name: "بلال مصطفى الشيخ",
    major: "صيانة الحاسب الآلي",
    level: "الدبلوم المتوسط",
    organization: "—",
    supervisor: "م. خالد عودة",
    phone: "—",
    startDate: "—",
    endDate: "—",
    status: "مرفوض",
    completedHours: 0,
    totalHours: 120,
    attendance: 0,
    rating: 0,
    notes: "لم يتم اعتماد طلب التدريب.",
  },
  "20231601": {
    id: "20231601",
    name: "محمد خالد العطار",
    major: "البرمجيات وقواعد البيانات",
    level: "الدبلوم المتوسط",
    organization: "شركة التقنية الحديثة",
    supervisor: "م. خالد عودة",
    phone: "0599000111",
    startDate: "2026/01/15",
    endDate: "2026/03/15",
    status: "قيد التدريب",
    completedHours: 60,
    totalHours: 120,
    attendance: 90,
    rating: 4.2,
    notes: "الطالب يحقق تقدمًا مستمرًا.",
  },
  "20231628": {
    id: "20231628",
    name: "نور أحمد خليل",
    major: "تكنولوجيا علم البيانات",
    level: "الدبلوم المتوسط",
    organization: "شركة المشرق الرقمية",
    supervisor: "م. خالد عودة",
    phone: "—",
    startDate: "—",
    endDate: "—",
    status: "لم يبدأ",
    completedHours: 0,
    totalHours: 120,
    attendance: 0,
    rating: 0,
    notes: "بانتظار بدء التدريب.",
  },
  "20231712": {
    id: "20231712",
    name: "ياسمين محمود",
    major: "التصميم الجرافيكي والفنون الرقمية",
    level: "الدبلوم المتوسط",
    organization: "استوديو بيكسل للتصميم",
    supervisor: "م. خالد عودة",
    phone: "0599000111",
    startDate: "2025/08/20",
    endDate: "2025/10/20",
    status: "منتهٍ",
    completedHours: 120,
    totalHours: 120,
    attendance: 98,
    rating: 4.7,
    notes: "أتمت الطالبة متطلبات التدريب بنجاح.",
  },
  "20231744": {
    id: "20231744",
    name: "أحمد سامي ناصر",
    major: "إلكترونيات صناعية وتحكم",
    level: "الدبلوم المتوسط",
    organization: "—",
    supervisor: "م. خالد عودة",
    phone: "—",
    startDate: "—",
    endDate: "—",
    status: "بانتظار الاعتماد",
    completedHours: 0,
    totalHours: 120,
    attendance: 0,
    rating: 0,
    notes: "بانتظار اعتماد جهة التدريب.",
  },
  "20231805": {
    id: "20231805",
    name: "رنا محمد علي",
    major: "الاتصالات وإنترنت الأشياء",
    level: "الدبلوم المتوسط",
    organization: "شركة جوال",
    supervisor: "م. خالد عودة",
    phone: "0599000111",
    startDate: "2026/01/05",
    endDate: "2026/03/05",
    status: "قيد التدريب",
    completedHours: 75,
    totalHours: 120,
    attendance: 94,
    rating: 4.3,
    notes: "الطالبة ملتزمة بمتطلبات التدريب.",
  },
  "20231840": {
    id: "20231840",
    name: "خالد عادل حسن",
    major: "صيانة الحاسب الآلي",
    level: "الدبلوم المتوسط",
    organization: "شركة التقنية الحديثة",
    supervisor: "م. خالد عودة",
    phone: "—",
    startDate: "—",
    endDate: "—",
    status: "مرفوض",
    completedHours: 0,
    totalHours: 120,
    attendance: 0,
    rating: 0,
    notes: "لم يتم قبول طلب التدريب.",
  },
};

// =====================================================
// SAMPLE RECORDS
// =====================================================

const REPORTS = [
  {
    id: 3,
    title: "تقرير الأسبوع 3",
    date: "2025/12/22",
    status: "بانتظار المراجعة",
  },
  {
    id: 2,
    title: "تقرير الأسبوع 2",
    date: "2025/12/15",
    status: "معتمد",
  },
  {
    id: 1,
    title: "تقرير الأسبوع 1",
    date: "2025/12/08",
    status: "معتمد",
  },
];

const ATTENDANCE = [
  {
    date: "2025/12/22",
    day: "الإثنين",
    hours: "6 ساعات",
    status: "حاضر",
  },
  {
    date: "2025/12/21",
    day: "الأحد",
    hours: "6 ساعات",
    status: "حاضر",
  },
  {
    date: "2025/12/18",
    day: "الخميس",
    hours: "0 ساعات",
    status: "غائب",
  },
  {
    date: "2025/12/17",
    day: "الأربعاء",
    hours: "6 ساعات",
    status: "حاضر",
  },
];

const EVALUATIONS = [
  { name: "الالتزام والانضباط", score: "4.5 / 5" },
  { name: "الأداء العملي", score: "4.0 / 5" },
  { name: "التعاون والعمل الجماعي", score: "4.2 / 5" },
  { name: "اكتساب المهارات", score: "4.0 / 5" },
];

const TABS = [
  { id: "attendance", label: "الحضور" },
  { id: "reports", label: "التقارير" },
  { id: "evaluations", label: "التقييمات" },
  { id: "notes", label: "الملاحظات" },
];

const STATUS_COLORS = {
  "قيد التدريب": "bg-[#DDF6FF] text-[#08759B]",
  "بانتظار الاعتماد": "bg-[#FFF0E7] text-[#D95E24]",
  "لم يبدأ": "bg-[#F1F5F9] text-[#64748B]",
  "منتهٍ": "bg-[#DCFCE7] text-[#15803D]",
  "مرفوض": "bg-[#FEE2E2] text-[#DC2626]",
};

// =====================================================
// MAIN PAGE
// =====================================================

export default function StudentDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const passedStudent = location.state?.student;

  const student = useMemo(() => {
    const sharedStudent = getStudent(id);
    if (!sharedStudent) return null;

    return {
      ...(STUDENTS[id] || {}),
      ...(passedStudent && String(passedStudent.id) === String(id)
        ? passedStudent
        : {}),
      ...sharedStudent,
    };
  }, [id, passedStudent]);

  const [activeTab, setActiveTab] = useState("reports");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [notice, setNotice] = useState(
    location.state?.successMessage || ""
  );

  const progress = student
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(
            (Number(student.completedHours || 0) /
              Math.max(Number(student.totalHours || 120), 1)) *
              100
          )
        )
      )
    : 0;

  // =====================================================
  // ACTIONS
  // =====================================================

  const toggleSidebar = () => {
    window.dispatchEvent(
      new Event("toggle-admin-sidebar")
    );
  };

  const handleEditStudent = () => {
    if (!student) return;

    navigate(
      `/admin/students/${encodeURIComponent(student.id)}/edit`,
      {
        state: {
          student: { ...student },
        },
      }
    );
  };

  // =====================================================
  // NEW: OPEN STUDENT TRAINING HISTORY
  // =====================================================

  const handleViewTrainingHistory = () => {
    if (!student) return;

    navigate(
      `/admin/students/${encodeURIComponent(
        student.id
      )}/training-history`,
      {
        state: {
          student: { ...student },
          from: "student-details",
        },
      }
    );
  };

  const sendMessage = (event) => {
    event.preventDefault();

    if (!message.trim()) return;

    setMessages((previous) => [
      ...previous,
      message.trim(),
    ]);

    setMessage("");
    setShowMessage(false);

    setNotice(
      "تم حفظ الرسالة كمسودة محلية. الإرسال الفعلي يحتاج ربط النظام بالخادم."
    );
  };

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!student) {
    return (
      <div
        dir="rtl"
        className="flex h-screen w-full bg-[#F8FAFC] font-['Cairo']"
      >
        <Sidebar />

        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-[24px] font-bold text-[#09379A]">
            الطالب غير موجود
          </h1>

          <p className="text-[13px] text-[#64748B]">
            لم يتم العثور على طالب بهذا الرقم الجامعي.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/students")}
            className="rounded-lg bg-[#09379A] px-6 py-3 text-white"
          >
            العودة إلى الطلاب
          </button>
        </main>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]"
    >
      {/* SIDEBAR */}
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">

        {/* HEADER */}
        <AdminHeader />

        {/* SCROLLABLE CONTENT */}
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8 pt-3 sm:px-6 lg:px-9">
          <div className="mx-auto max-w-[1450px]">

            {/* BREADCRUMB */}
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B]">
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/dashboard")
                }
                className="hover:text-[#09379A]"
              >
                الرئيسية
              </button>

              <ChevronLeft size={15} />

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/students")
                }
                className="hover:text-[#09379A]"
              >
                الطلاب
              </button>

              <ChevronLeft size={15} />

              <span className="font-semibold text-[#111C2D]">
                تفاصيل الطالب
              </span>
            </div>

            {/* TITLE & ACTIONS */}
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="m-0 text-[23px] font-bold">
                  تفاصيل الطالب
                </h1>

                <p className="m-0 mt-1 text-[13px] text-[#64748B]">
                  {student.name} - {student.id}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleEditStudent}
                  className="inline-flex h-[43px] items-center gap-2 rounded-[8px] border border-[#E1E8F3] bg-white px-5 text-[12px] font-semibold transition hover:border-[#09379A] hover:text-[#09379A]"
                >
                  <Pencil size={16} />
                  تعديل
                </button>

                <button
                  type="button"
                  onClick={() => setShowMessage(true)}
                  className="inline-flex h-[43px] items-center gap-2 rounded-[8px] bg-[#09379A] px-5 text-[12px] font-semibold text-white transition hover:bg-[#072E81]"
                >
                  <Mail size={16} />
                  مراسلة الطالب
                </button>
              </div>
            </div>

            {/* NOTICE */}
            {notice && (
              <div
                role="status"
                className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-[#D7E4FA] bg-[#EEF4FF] px-4 py-3 text-[12px] text-[#09379A]"
              >
                <span>{notice}</span>

                <button
                  type="button"
                  onClick={() => setNotice("")}
                  aria-label="إغلاق التنبيه"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* MAIN COLUMNS */}
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.42fr_1fr]">

              {/* RIGHT COLUMN */}
              <div className="min-w-0 space-y-6">

                {/* STUDENT INFO */}
                <SectionCard title="معلومات الطالب">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-[#E1E8F2] pt-4 md:grid-cols-4">
                    <InfoField
                      label="الاسم"
                      value={student.name}
                    />

                    <InfoField
                      label="الرقم الجامعي"
                      value={student.id}
                    />

                    <InfoField
                      label="التخصص"
                      value={student.major}
                    />

                    <InfoField
                      label="المستوى"
                      value={
                        student.level || "الدبلوم المتوسط"
                      }
                    />
                  </div>
                </SectionCard>

                {/* TRAINING INFO */}
                <SectionCard title="معلومات التدريب">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-[#E1E8F2] pt-4 md:grid-cols-4">
                    <InfoField
                      label="جهة التدريب"
                      value={student.organization}
                    />

                    <InfoField
                      label="المشرف الميداني"
                      value={
                        <>
                          <div>{student.supervisor}</div>
                          <div dir="ltr" className="text-right">
                            {student.phone}
                          </div>
                        </>
                      }
                    />

                    <InfoField
                      label="تاريخ البداية"
                      value={student.startDate}
                    />

                    <InfoField
                      label="تاريخ النهاية"
                      value={student.endDate}
                    />
                  </div>
                </SectionCard>

                {/* TABS */}
                <div className="flex flex-wrap items-center gap-2">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-full border px-4 py-2 text-[12px] transition ${
                        activeTab === tab.id
                          ? "border-[#09379A] bg-[#09379A] font-semibold text-white"
                          : "border-[#E1E8F2] bg-white text-[#64748B] hover:border-[#09379A]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB CONTENT */}
                <div className="min-h-[290px] overflow-hidden rounded-[12px] border border-[#E1E8F2] bg-white">
                  {activeTab === "reports" && (
                    <ReportsTab />
                  )}

                  {activeTab === "attendance" && (
                    <AttendanceTab />
                  )}

                  {activeTab === "evaluations" && (
                    <EvaluationsTab />
                  )}

                  {activeTab === "notes" && (
                    <NotesTab
                      student={student}
                      messages={messages}
                    />
                  )}
                </div>
              </div>

              {/* LEFT COLUMN */}
              <div className="min-w-0 space-y-6">

                {/* TRAINING STATUS */}
                <section className="rounded-[12px] border border-[#E1E8F2] bg-white p-5 md:p-6">
                  <h2 className="mb-4 mt-0 text-[16px] font-bold text-[#062569]">
                    حالة التدريب
                  </h2>

                  <div className="border-t border-[#E1E8F2] pt-2">
                    {/* STATUS */}
                    <div
                      className={`flex items-center justify-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold ${
                        STATUS_COLORS[student.status] ||
                        STATUS_COLORS["لم يبدأ"]
                      }`}
                    >
                      <span className="h-[6px] w-[6px] rounded-full bg-current" />
                      {student.status}
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="mt-3 h-[8px] overflow-hidden rounded-full bg-[#E3EAF3]">
                      <div
                        className="h-full rounded-full bg-[#09379A] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* HOURS */}
                    <p className="mb-0 mt-3 text-[11px] text-[#64748B]">
                      تقدم التدريب {progress}% -{" "}
                      {student.completedHours} من{" "}
                      {student.totalHours} ساعة
                    </p>
                  </div>

                  {/* NEW: TRAINING HISTORY BUTTON */}
                  <div className="mt-4 border-t border-[#E1E8F2] pt-4">
                    <button
                      type="button"
                      onClick={handleViewTrainingHistory}
                      className="flex w-full items-center justify-between gap-2 rounded-[7px] px-1 py-1 text-[12px] font-bold text-[#09379A] transition hover:bg-[#EEF4FF]"
                    >
                      <span>عرض سجل التدريب</span>
                      <ChevronLeft size={17} />
                    </button>
                  </div>
                </section>

                {/* ATTENDANCE PERCENTAGE */}
                <div className="rounded-[12px] border border-[#E1E8F2] bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[9px] bg-[#DCFCE7] text-[#15803D]">
                      <CalendarCheck size={21} />
                    </div>

                    <h3 className="m-0 text-[13px] font-semibold">
                      نسبة الحضور
                    </h3>
                  </div>

                  <div className="mt-7 text-right">
                    <span className="text-[29px] font-bold text-[#09379A]">
                      {student.attendance}
                    </span>

                    <span className="mr-1 text-[12px] text-[#64748B]">
                      %
                    </span>
                  </div>
                </div>

                {/* CURRENT RATING */}
                <div className="rounded-[12px] border border-[#E1E8F2] bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[9px] bg-[#FFE5DB] text-[#B54708]">
                      <Star size={21} />
                    </div>

                    <h3 className="m-0 text-[13px] font-semibold">
                      التقييم الحالي
                    </h3>
                  </div>

                  <div className="mt-7 text-right">
                    <span className="text-[29px] font-bold text-[#09379A]">
                      {Number(student.rating || 0).toFixed(1)}
                    </span>

                    <span className="mr-1 text-[12px] text-[#64748B]">
                      من 5
                    </span>
                  </div>
                </div>

                {/* SUPERVISOR NOTES */}
                <SectionCard title="ملاحظات المشرف">
                  <div className="border-t border-[#E1E8F2] pt-4">
                    <p className="m-0 text-[12px] leading-7 text-[#64748B]">
                      {student.notes}
                    </p>
                  </div>
                </SectionCard>
              </div>
            </div>

            {/* FOOTER */}
            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>

      {/* MESSAGE MODAL */}
      {showMessage && (
        <Modal
          title={`مراسلة الطالب - ${student.name}`}
          onClose={() => setShowMessage(false)}
        >
          <form onSubmit={sendMessage}>
            <label className="mb-2 block text-[12px] font-semibold">
              نص الرسالة
            </label>

            <textarea
              required
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="اكتب رسالتك للطالب هنا..."
              rows={5}
              className="w-full resize-none rounded-lg border border-[#E1E8F2] p-3 text-[12px] outline-none focus:border-[#09379A]"
            />

            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#09379A] px-5 py-3 text-[12px] font-semibold text-white"
              >
                <Send size={16} />
                حفظ الرسالة
              </button>

              <button
                type="button"
                onClick={() => setShowMessage(false)}
                className="rounded-lg border border-[#E1E8F2] px-5 py-3 text-[12px]"
              >
                إلغاء
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// =====================================================
// COMPONENTS
// =====================================================

function SectionCard({ title, children }) {
  return (
    <section className="rounded-[12px] border border-[#E1E8F2] bg-white p-5 md:p-6">
      <h2 className="mb-4 mt-0 text-[16px] font-bold text-[#062569]">
        {title}
      </h2>

      {children}
    </section>
  );
}

function InfoField({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="m-0 mb-1 text-[11px] text-[#64748B]">
        {label}
      </p>

      <div className="break-words text-[12px] font-semibold leading-5 text-[#111C2D]">
        {value ?? "—"}
      </div>
    </div>
  );
}

function TableContainer({ children }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#E1E8F2]">
      <table className="w-full min-w-[420px] border-collapse text-right text-[12px]">
        {children}
      </table>
    </div>
  );
}

function TableHead({ columns }) {
  return (
    <thead className="bg-[#F1F5F9] text-[#64748B]">
      <tr>
        {columns.map((column) => (
          <th
            key={column}
            className="px-4 py-4 text-[11px] font-semibold"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function StatusBadge({ status }) {
  const color =
    status === "معتمد" || status === "حاضر"
      ? "bg-[#DCFCE7] text-[#15803D]"
      : status === "بانتظار المراجعة"
      ? "bg-[#FFE5DB] text-[#C45B20]"
      : "bg-[#FEE2E2] text-[#DC2626]";

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${color}`}
    >
      {status}
    </span>
  );
}

// =====================================================
// REPORTS TAB
// =====================================================

function ReportsTab() {
  return (
    <section>
      <div className="border-b border-[#E1E8F2] px-5 py-5">
        <h3 className="m-0 text-[16px] font-bold text-[#062569]">
          التقارير المرسلة
        </h3>
      </div>

      <div className="p-3">
        <TableContainer>
          <TableHead
            columns={["التقرير", "التاريخ", "الحالة"]}
          />

          <tbody>
            {REPORTS.map((report) => (
              <tr
                key={report.id}
                className="border-t border-[#E1E8F2]"
              >
                <td className="px-4 py-5">
                  {report.title}
                </td>

                <td className="px-4 py-5">
                  {report.date}
                </td>

                <td className="px-4 py-5">
                  <StatusBadge status={report.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </TableContainer>
      </div>
    </section>
  );
}

// =====================================================
// ATTENDANCE TAB
// =====================================================

function AttendanceTab() {
  return (
    <section>
      <div className="border-b border-[#E1E8F2] px-5 py-5">
        <h3 className="m-0 text-[16px] font-bold text-[#062569]">
          سجل الحضور والغياب
        </h3>
      </div>

      <div className="p-3">
        <TableContainer>
          <TableHead
            columns={[
              "التاريخ",
              "اليوم",
              "الساعات",
              "الحالة",
            ]}
          />

          <tbody>
            {ATTENDANCE.map((item) => (
              <tr
                key={item.date}
                className="border-t border-[#E1E8F2]"
              >
                <td className="px-4 py-4">
                  {item.date}
                </td>

                <td className="px-4 py-4">
                  {item.day}
                </td>

                <td className="px-4 py-4">
                  {item.hours}
                </td>

                <td className="px-4 py-4">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </TableContainer>
      </div>
    </section>
  );
}

// =====================================================
// EVALUATIONS TAB
// =====================================================

function EvaluationsTab() {
  return (
    <section>
      <div className="border-b border-[#E1E8F2] px-5 py-5">
        <h3 className="m-0 text-[16px] font-bold text-[#062569]">
          تقييم أداء الطالب
        </h3>
      </div>

      <div className="p-3">
        <TableContainer>
          <TableHead
            columns={["معيار التقييم", "الدرجة"]}
          />

          <tbody>
            {EVALUATIONS.map((item) => (
              <tr
                key={item.name}
                className="border-t border-[#E1E8F2]"
              >
                <td className="px-4 py-4">
                  {item.name}
                </td>

                <td className="px-4 py-4 font-bold text-[#09379A]">
                  {item.score}
                </td>
              </tr>
            ))}
          </tbody>
        </TableContainer>
      </div>
    </section>
  );
}

// =====================================================
// NOTES TAB
// =====================================================

function NotesTab({ student, messages }) {
  return (
    <section>
      <div className="border-b border-[#E1E8F2] px-5 py-5">
        <h3 className="m-0 text-[16px] font-bold text-[#062569]">
          الملاحظات والمتابعة
        </h3>
      </div>

      <div className="space-y-4 p-5">
        <div className="rounded-[9px] border border-[#E1E8F2] bg-[#F8FAFC] p-4">
          <div className="mb-2 flex items-center gap-2 text-[#09379A]">
            <MessageSquare size={17} />

            <h4 className="m-0 text-[12px] font-bold">
              ملاحظة المشرف
            </h4>
          </div>

          <p className="m-0 text-[12px] leading-7 text-[#64748B]">
            {student.notes}
          </p>
        </div>

        {messages.map((text, index) => (
          <div
            key={index}
            className="rounded-[9px] border border-[#DCE7F7] bg-[#EEF4FF] p-4"
          >
            <p className="mb-2 text-[12px] font-bold text-[#09379A]">
              مسودة رسالة {index + 1}
            </p>

            <p className="m-0 whitespace-pre-wrap text-[12px] leading-6">
              {text}
            </p>
          </div>
        ))}

        <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
          <CheckCircle2 size={16} />
          متابعة التدريب الميداني
        </div>
      </div>
    </section>
  );
}

// =====================================================
// MESSAGE MODAL
// =====================================================

function Modal({ title, onClose, children }) {
  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 font-['Cairo']"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="my-auto w-full max-w-[520px] rounded-[14px] bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="m-0 text-[17px] font-bold text-[#062569]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="rounded-lg p-2 text-[#64748B] hover:bg-[#F1F5F9]"
          >
            <X size={19} />
          </button>
        </div>

        {children}
      </section>
    </div>
  );
}
