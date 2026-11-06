import AcademicFooter from "../../components/shared/AcademicFooter";
import { getOrganization as getSharedOrganization, saveOrganization } from "./trainingOrganizationsStore";
import { getStudents } from "./studentsStore";
import AdminHeader from "../../components/admin/Header";

import { useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  Bell, Menu, ChevronLeft, ChevronRight, ArrowRight,
  Pencil, Users, BedSingle, CalendarClock, Star,
  CircleCheck, Building2, X, Check, AlertCircle,
  Clock3, FileText,
} from "lucide-react";

import Sidebar from "../../components/admin/Sidebar";

const STORAGE_KEY = "cis-training-organizations-v1";
const PAGE_SIZE = 4;

const DEMO_ORGANIZATIONS = [
  {
    id: 1,
    name: "شركة القدس للاتصالات",
    type: "تقنية معلومات",
    location: "غزة - الرمال",
    phone: "0599 000 111",
    email: "training@qudscom.ps",
    supervisor: "م. خالد عودة",
    students: 42,
    seats: 60,
    availableSeats: 18,
    status: "approved",
    agreementExpiry: "2026/09/01",
    rating: 4.4,
    specializations: [
      "تكنولوجيا علم البيانات",
      "الاتصالات وإنترنت الأشياء",
      "التصميم الجرافيكي والفنون الرقمية",
    ],
  },
  {
    id: 2,
    name: "شركة الأمل للأنظمة الصناعية",
    type: "صناعي",
    location: "غزة - المنطقة الصناعية",
    phone: "08 282 3000",
    students: 14,
    status: "approved",
  },
  {
    id: 3,
    name: "مركز الصيانة الفنية المتقدم",
    type: "صيانة",
    location: "خان يونس",
    phone: "08 205 4400",
    students: 25,
    status: "renewal",
    requestDate: "2025/12/02",
  },
  {
    id: 4,
    name: "استوديو بيكسل للتصميم",
    type: "تصميم",
    location: "غزة - الرمال",
    phone: "08 288 9122",
    students: 8,
    status: "pending",
    requestDate: "2025/11/28",
  },
  { id: 5, name: "شركة المشرق الرقمية", type: "تقنية معلومات", location: "غزة - النصر", students: 21, status: "approved", phone: "0598 440 220" },
  { id: 6, name: "شركة الشرق للصناعات", type: "صناعي", location: "دير البلح", students: 11, status: "renewal" },
  { id: 7, name: "مركز المستقبل للصيانة", type: "صيانة", location: "غزة", students: 18, status: "approved" },
  { id: 8, name: "استوديو رؤية", type: "تصميم", location: "رفح", students: 6, status: "approved" },
  { id: 9, name: "شركة الهيدروليك الحديثة", type: "صناعي", location: "غزة", students: 0, status: "pending", requestDate: "2025/11/20" },
  { id: 10, name: "شركة التقنية الحديثة", type: "تقنية معلومات", location: "غزة", students: 0, status: "pending", requestDate: "2025/11/17" },
  { id: 11, name: "مركز الأمل للتدريب", type: "صيانة", location: "خان يونس", students: 0, status: "pending", requestDate: "2025/11/12" },
  { id: 12, name: "مؤسسة المستقبل", type: "تصميم", location: "غزة", students: 0, status: "pending", requestDate: "2025/11/08" },
];

const DEMO_STUDENTS = [
  { id: 1, name: "أمل أحمد صيام", specialization: "البرمجيات وقواعد البيانات", status: "training" },
  { id: 2, name: "محمود إبراهيم رضوان", specialization: "تكنولوجيا علم البيانات", status: "training" },
  { id: 3, name: "سارة عبد الرحمن", specialization: "الاتصالات وإنترنت الأشياء", status: "waiting" },
  { id: 4, name: "أنس كمال البيطار", specialization: "إلكترونيات صناعية وتحكم", status: "completed" },
  { id: 5, name: "نور خليل", specialization: "البرمجيات وقواعد البيانات", status: "training" },
  { id: 6, name: "بلال الشيخ", specialization: "تكنولوجيا علم البيانات", status: "training" },
  { id: 7, name: "محمد العطار", specialization: "الاتصالات وإنترنت الأشياء", status: "waiting" },
  { id: 8, name: "ياسمين محمود", specialization: "البرمجيات وقواعد البيانات", status: "completed" },
];

const STATUS_CONFIG = {
  approved: { label: "معتمدة", style: "bg-[#DCFCE7] text-[#15803D]" },
  pending: { label: "بانتظار الاعتماد", style: "bg-[#FFE5D9] text-[#B54708]" },
  review: { label: "قيد المراجعة", style: "bg-[#DDF6FF] text-[#08759B]" },
  renewal: { label: "قيد التجديد", style: "bg-[#FFF0D9] text-[#B54708]" },
  rejected: { label: "مرفوضة", style: "bg-[#FEE2E2] text-[#DC2626]" },
};

function loadOrganization(id, passed) {
  const initial = DEMO_ORGANIZATIONS.find(item => String(item.id) === String(id));
  const shared = getSharedOrganization(id);
  if (!shared) return null;
  const item = {...(initial || {}), ...((passed && String(passed.id)===String(id)) ? passed : {}), ...shared};
  const activeStudents = Number(item.activeStudents ?? item.students ?? 0);
  const seats = Number(item.seats ?? item.capacity ?? 0);
  return {
    ...item, id: item.id ?? id, name: item.name || "جهة تدريب",
    type:item.type || "—", location:item.location || "—", phone:item.phone || "—",
    email:item.email || "—", supervisor:item.supervisor || item.supervisorName || "—",
    activeStudents, availableSeats:Number(item.availableSeats ?? Math.max(0,seats-activeStudents)),
    agreementExpiry:item.agreementExpiry || item.agreementEndDate || "—",
    renewalDate:item.renewalDate || (item.agreementExpiry ? String(item.agreementExpiry).slice(0,7) : "—"),
    specializations:Array.isArray(item.specializations) ? item.specializations : [],
    status:item.status || "pending"
  };
}
function persistOrganization(item) {
  try { saveOrganization(item); return true; } catch { return false; }
}

export default function TrainingOrganizationDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [organization, setOrganization] = useState(() =>
    loadOrganization(id, location.state?.organization)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(
    location.state?.successMessage || ""
  );

  const canDecide = ["pending", "review", "renewal"].includes(
    organization?.status
  );

  const students = useMemo(
    () => getStudents().filter(student => student.organization === organization?.name).map(student => ({
      id:student.id, name:student.name, specialization:student.major,
      status: student.status === "منتهٍ" ? "completed" : student.status === "قيد التدريب" ? "training" : "waiting"
    })),
    [id, organization?.name]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(students.length / PAGE_SIZE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const visibleStudents = students.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const goToOrganizations = () => {
    navigate("/admin/training-organizations");
  };

  const goToApprovals = () => {
    navigate("/admin/approvals/training-providers");
  };

  const handleEdit = () => {
    if (!organization) return;

    navigate(
      `/admin/training-organizations/${encodeURIComponent(id)}/edit`,
      { state: { organization } }
    );
  };

  const markReview = () => {
    if (!organization || organization.status !== "pending") return;

    const updated = {
      ...organization,
      status: "review",
      approvalStatus: "قيد المراجعة",
    };

    if (!persistOrganization(updated)) {
      setNotice("تعذر حفظ حالة المراجعة محليًا.");
      return;
    }

    setOrganization(updated);
    setNotice("تم تسجيل بدء مراجعة الجهة.");
  };

  const openDecision = (type) => {
    if (!canDecide) return;
    setNote(organization.reviewNote || "");
    setError("");
    setDecision(type);
  };

  const confirmDecision = () => {
    if (!organization || !decision || !canDecide) return;

    if (decision === "rejected" && !note.trim()) {
      setError("يرجى كتابة سبب رفض اعتماد الجهة.");
      return;
    }

    const approved = decision === "approved";
    const updated = {
      ...organization,
      status: approved ? "approved" : "rejected",
      approvalStatus: approved ? "معتمدة" : "مرفوضة",
      reviewNote: note.trim(),
      decisionDate: new Date().toLocaleDateString("en-CA"),
      decidedBy: "د. سامر يوسف",
    };

    if (!persistOrganization(updated)) {
      setError("تعذر حفظ القرار في المتصفح.");
      return;
    }

    setOrganization(updated);
    setDecision(null);
    setNotice(
      approved
        ? "تم اعتماد الجهة بنجاح وتحديث حالتها."
        : "تم تسجيل رفض اعتماد الجهة مع السبب."
    );
  };

  if (!organization) {
    return (
      <div
        dir="rtl"
        className="flex h-screen bg-[#F8FAFC] font-['Cairo']"
      >
        <Sidebar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
          <Building2 size={38} className="text-[#09379A]" />
          <h1 className="text-[22px] font-bold">
            جهة التدريب غير موجودة
          </h1>
          <button
            type="button"
            onClick={goToOrganizations}
            className="rounded-lg bg-[#09379A] px-5 py-3 text-white"
          >
            العودة إلى جهات التدريب
          </button>
        </main>
      </div>
    );
  }

  const statusConfig =
    STATUS_CONFIG[organization.status] || STATUS_CONFIG.pending;

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]"
    >
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader />

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1450px]">

            {/* BREADCRUMB */}
            <div className="mb-6 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B]">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
              >
                الرئيسية
              </button>
              <ChevronLeft size={15} />
              <button type="button" onClick={goToOrganizations}>
                جهات التدريب
              </button>
              <ChevronLeft size={15} />
              <span className="font-semibold text-[#111C2D]">
                تفاصيل الجهة
              </span>
            </div>

            {/* TITLE AND ACTIONS */}
            <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="m-0 text-[26px] font-bold sm:text-[30px]">
                  {organization.name}
                </h1>
                <p className="m-0 mt-1 text-[13px] text-[#64748B]">
                  تفاصيل جهة التدريب
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={goToOrganizations}
                  className="inline-flex h-[42px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[11px]"
                >
                  <ArrowRight size={16} />
                  الجهات
                </button>

                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex h-[42px] items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[11px]"
                >
                  <Pencil size={15} />
                  تعديل
                </button>
              </div>
            </section>

            {notice && (
              <div
                role="status"
                className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-[#D7E4FA] bg-[#EEF4FF] px-4 py-3 text-[12px] text-[#09379A]"
              >
                <span>{notice}</span>
                <button
                  type="button"
                  aria-label="إغلاق التنبيه"
                  onClick={() => setNotice("")}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* UPDATED STATISTICS */}
            <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
              <StatCard
                title="طلاب حاليون"
                value={organization.activeStudents}
                suffix="طالب"
                icon={Users}
                iconClass="bg-[#E8EEF9] text-[#09379A]"
              />
              <StatCard
                title="مقاعد متاحة"
                value={organization.availableSeats}
                suffix="مقعد"
                icon={BedSingle}
                iconClass="bg-[#DCFCE7] text-[#15803D]"
              />
              <StatCard
                title="تاريخ التجديد"
                value={organization.renewalDate}
                icon={CalendarClock}
                iconClass="bg-[#FFE5D9] text-[#B54708]"
              />
              <StatCard
                title="تقييم الجهة"
                value={organization.rating ?? "—"}
                suffix={organization.rating != null ? "من 5" : ""}
                icon={Star}
                iconClass="bg-[#DDF6FF] text-[#08759B]"
              />
            </section>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_380px]">

              {/* RIGHT COLUMN */}
              <div className="flex min-w-0 flex-col gap-6">

                <Section title="معلومات الجهة">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoItem label="نوع الجهة" value={organization.type} />
                    <InfoItem label="الموقع" value={organization.location} />
                    <InfoItem label="المشرف الميداني" value={organization.supervisor} />
                    <InfoItem label="الهاتف" value={organization.phone} />
                    <InfoItem label="البريد" value={organization.email} ltr />
                    <InfoItem label="حالة الاعتماد" value={statusConfig.label} />
                  </div>
                </Section>

                <Section title="الطلاب المسجلون">
                  <div className="overflow-x-auto rounded-[8px] border border-[#E0E7F2]">
                    <table className="w-full min-w-[440px] border-collapse text-right">
                      <thead className="bg-[#F1F5F9] text-[11px] text-[#64748B]">
                        <tr>
                          <th className="px-4 py-4">الطالب</th>
                          <th className="px-4 py-4">التخصص</th>
                          <th className="px-4 py-4">الحالة</th>
                        </tr>
                      </thead>

                      <tbody>
                        {visibleStudents.map((student) => (
                          <tr
                            key={student.id}
                            className="border-t border-[#E6EBF5] text-[11px]"
                          >
                            <td className="px-4 py-5 font-bold">
                              {student.name}
                            </td>
                            <td className="px-4 py-5">
                              {student.specialization}
                            </td>
                            <td className="px-4 py-5">
                              <StudentStatus status={student.status} />
                            </td>
                          </tr>
                        ))}

                        {visibleStudents.length === 0 && (
                          <tr>
                            <td
                              colSpan={3}
                              className="px-4 py-10 text-center text-[12px] text-[#64748B]"
                            >
                              لا تتوفر سجلات طلاب لهذه الجهة في البيانات التجريبية.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION */}
                  <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <p className="m-0 text-[10px] text-[#64748B]">
                      عرض{" "}
                      {students.length ? (safePage - 1) * PAGE_SIZE + 1 : 0}
                      {" - "}
                      {Math.min(safePage * PAGE_SIZE, students.length)}
                      {" من "}
                      {students.length} سجلات متاحة
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={safePage === 1}
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        className="flex h-[34px] items-center gap-1 rounded-full border border-[#E0E7F2] px-3 text-[10px] disabled:opacity-40"
                      >
                        <ChevronRight size={13} />
                        السابق
                      </button>

                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`h-[34px] min-w-[34px] rounded-full border text-[10px] ${
                            page === safePage
                              ? "border-[#09379A] bg-[#09379A] text-white"
                              : "border-[#E0E7F2] bg-white"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        disabled={safePage === totalPages}
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        className="flex h-[34px] items-center gap-1 rounded-full border border-[#E0E7F2] px-3 text-[10px] disabled:opacity-40"
                      >
                        التالي
                        <ChevronLeft size={13} />
                      </button>
                    </div>
                  </div>
                </Section>
              </div>

              {/* LEFT COLUMN */}
              <div className="flex min-w-0 flex-col gap-6">
                <Section title="حالة الاعتماد">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold ${statusConfig.style}`}
                  >
                    <span className="h-[6px] w-[6px] rounded-full bg-current" />
                    {statusConfig.label}
                  </span>

                  <p className="mb-0 mt-4 text-[11px] leading-6 text-[#64748B]">
                    تاريخ انتهاء الاتفاقية: {organization.agreementExpiry}
                  </p>

                  {canDecide ? (
                    <>
                      <p className="mb-4 mt-3 text-[11px] leading-6 text-[#64748B]">
                        راجع معلومات الجهة والتخصصات والوثائق قبل اتخاذ قرار الاعتماد.
                      </p>

                      {organization.status === "pending" && (
                        <button
                          type="button"
                          onClick={markReview}
                          className="mb-3 flex w-full items-center justify-center gap-2 rounded-[8px] border border-[#09379A] bg-[#EEF4FF] px-4 py-3 text-[11px] font-semibold text-[#09379A]"
                        >
                          <Clock3 size={15} />
                          بدء المراجعة
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => openDecision("approved")}
                          className="flex h-[40px] items-center justify-center gap-2 rounded-[8px] bg-[#15803D] px-3 text-[11px] font-bold text-white hover:bg-[#166534]"
                        >
                          <Check size={15} />
                          اعتماد الجهة
                        </button>

                        <button
                          type="button"
                          onClick={() => openDecision("rejected")}
                          className="flex h-[40px] items-center justify-center gap-2 rounded-[8px] border border-[#FECACA] bg-white px-3 text-[11px] font-semibold text-[#DC2626] hover:bg-[#FEF2F2]"
                        >
                          <X size={15} />
                          رفض الاعتماد
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-4 rounded-[8px] bg-[#F8FAFC] p-3 text-[11px] leading-6 text-[#64748B]">
                      {organization.status === "approved"
                        ? "هذه الجهة معتمدة حاليًا، ويمكن إدارة بياناتها من زر تعديل."
                        : "تم رفض اعتماد الجهة. السبب مسجل في سجل القرار أدناه."}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={goToApprovals}
                    className="mt-4 w-full border-t border-[#E0E7F2] pt-3 text-right text-[11px] font-bold text-[#09379A] hover:underline"
                  >
                    العودة إلى طلبات الاعتماد
                  </button>
                </Section>

                <Section title="التخصصات المقبولة">
                  {organization.specializations.length ? (
                    <div className="space-y-3">
                      {organization.specializations.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-[11px]">
                          <CircleCheck size={16} className="shrink-0 text-[#15803D]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#64748B]">
                      لم تُحدد تخصصات لهذه الجهة.
                    </p>
                  )}
                </Section>

                <Section title="بيانات التواصل">
                  <InfoItem label="المشرف الميداني" value={organization.supervisor} />

                  <div className="mt-4">
                    <InfoItem label="رقم الهاتف" value={organization.phone} />
                  </div>

                  <div className="mt-4">
                    <InfoItem label="البريد الإلكتروني" value={organization.email} ltr />
                  </div>
                </Section>

                <Section title="وثائق الجهة">
                  <div className="flex items-center gap-3 rounded-lg border border-[#E0E7F2] bg-[#F8FAFC] p-3">
                    <FileText size={20} className="shrink-0 text-[#09379A]" />
                    <div className="min-w-0">
                      <p className="m-0 text-[11px] font-semibold">
                        اتفاقية التعاون
                      </p>
                      <p className="m-0 mt-1 break-all text-[10px] text-[#64748B]">
                        {organization.agreementFileName ||
                          "لم يُرفق ملف حقيقي بعد"}
                      </p>
                    </div>
                  </div>
                </Section>

                {(organization.decisionDate || organization.reviewNote) && (
                  <Section title="سجل القرار">
                    <InfoItem
                      label="تاريخ القرار"
                      value={organization.decisionDate || "—"}
                    />
                    <div className="mt-4">
                      <InfoItem
                        label="المراجع"
                        value={organization.decidedBy || "—"}
                      />
                    </div>
                    <div className="mt-4">
                      <InfoItem
                        label="ملاحظة القرار"
                        value={organization.reviewNote || "لا توجد ملاحظة"}
                      />
                    </div>
                  </Section>
                )}
              </div>
            </div>

            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>

      {/* APPROVAL / REJECTION MODAL */}
      {decision && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 font-['Cairo']"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDecision(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={
              decision === "approved"
                ? "تأكيد اعتماد الجهة"
                : "تأكيد رفض اعتماد الجهة"
            }
            className="my-auto w-full max-w-[500px] rounded-[14px] bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="m-0 text-[18px] font-bold text-[#062569]">
                {decision === "approved"
                  ? "تأكيد اعتماد الجهة"
                  : "تأكيد رفض اعتماد الجهة"}
              </h2>

              <button
                type="button"
                aria-label="إغلاق"
                onClick={() => setDecision(null)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-4 rounded-lg bg-[#F1F5F9] p-4">
              <p className="m-0 text-[12px] font-bold">
                {organization.name}
              </p>
              <p className="m-0 mt-1 text-[11px] text-[#64748B]">
                {organization.type} - {organization.location}
              </p>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-[12px] font-semibold">
                ملاحظة المراجعة
                {decision === "rejected" && (
                  <span className="mr-1 text-[#DC2626]">*</span>
                )}
              </span>

              <textarea
                rows={4}
                value={note}
                onChange={(event) => {
                  setNote(event.target.value);
                  setError("");
                }}
                placeholder={
                  decision === "rejected"
                    ? "اكتب سبب رفض الاعتماد..."
                    : "أضف ملاحظة إن وجدت..."
                }
                className="w-full resize-none rounded-lg border border-[#E0E7F2] p-3 text-[12px] outline-none focus:border-[#09379A]"
              />
            </label>

            {error && (
              <div
                role="alert"
                className="mt-3 flex items-start gap-2 rounded-lg bg-[#FEF2F2] p-3 text-[12px] text-[#DC2626]"
              >
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDecision(null)}
                className="rounded-lg border border-[#E0E7F2] px-5 py-3 text-[12px]"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={confirmDecision}
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-3 text-[12px] font-bold text-white ${
                  decision === "approved" ? "bg-[#15803D]" : "bg-[#DC2626]"
                }`}
              >
                {decision === "approved"
                  ? <Check size={16} />
                  : <X size={16} />}

                {decision === "approved"
                  ? "تأكيد الاعتماد"
                  : "تأكيد الرفض"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

// =====================================================
// SHARED COMPONENTS
// =====================================================

function Section({ title, children }) {
  return (
    <section className="rounded-[12px] border border-[#E0E7F2] bg-white p-5">
      <h2 className="m-0 mb-4 border-b border-[#E6EBF5] pb-4 text-[17px] font-bold text-[#062569]">
        {title}
      </h2>
      {children}
    </section>
  );
}

// UPDATED: ICON RIGHT, LABEL LEFT, VALUE BELOW
function StatCard({
  title,
  value,
  suffix = "",
  icon: Icon,
  iconClass,
}) {
  return (
    <div
      dir="rtl"
      className="min-w-0 rounded-[12px] border border-[#E0E7F2] bg-white p-5"
    >
      <div className="flex w-full items-center justify-between gap-3">
        <div
          className={`flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-[8px] ${iconClass}`}
        >
          <Icon size={20} />
        </div>

        <span className="min-w-0 text-left text-[12px] font-semibold leading-5 text-[#111C2D]">
          {title}
        </span>
      </div>

      <div className="mt-5 flex items-baseline justify-start gap-2">
        <strong className="text-[27px] font-bold leading-none text-[#09379A]">
          {value}
        </strong>

        {suffix && (
          <span className="text-[11px] text-[#64748B]">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value, ltr = false }) {
  return (
    <div className="min-w-0">
      <p className="m-0 text-[11px] text-[#64748B]">
        {label}
      </p>

      <p
        dir={ltr ? "ltr" : "rtl"}
        className={`mb-0 mt-1 break-words text-[12px] font-semibold ${
          ltr ? "text-right" : ""
        }`}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

function StudentStatus({ status }) {
  const config = {
    training: ["قيد التدريب", "bg-[#DDF6FF] text-[#08759B]"],
    waiting: ["بانتظار البدء", "bg-[#FFE5D9] text-[#B54708]"],
    completed: ["منتهٍ", "bg-[#DCFCE7] text-[#15803D]"],
  };

  const [label, className] =
    config[status] || ["غير محدد", "bg-[#F1F5F9] text-[#475569]"];

  return (
    <span className={`inline-flex rounded-full px-3 py-1.5 text-[10px] ${className}`}>
      {label}
    </span>
  );
}


