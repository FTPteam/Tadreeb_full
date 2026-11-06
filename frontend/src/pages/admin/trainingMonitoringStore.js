import { getSharedAttendance } from '../../services/sharedAttendance';
import { getStudents } from "./studentsStore";
import { getFinalReportApproval } from "./reportsStore";
import { getEvaluation } from "./evaluationStore";



export const MONITORING_STORAGE_KEY = "cis-training-monitoring-v1";

export const TRAINING_HOURS_REQUIRED = 120;

export const TRAINING_STUDENTS = [

  {

    id: "20231234",

    name: "أمل أحمد صيام",

    shortName: "أمل أحمد",

    major: "البرمجيات وقواعد البيانات",

    organization: "شركة القدس للاتصالات",

    supervisor: "م. خالد عودة",

    startDate: "2025/12/01",

    endDate: "2026/02/01",

    requiredHours: 120,

    completedHours: 72,

    attendance: 92,

    attendanceDays: 22,

    absenceDays: 2,

    reportsSubmitted: 3,

    reportsRequired: 4,

    lateReports: 1,

    fieldScore: 4.0,

    evaluationId: "1",

    status: "training",

    weeklyProgress: [12, 24, 35, 48, 55, 60],

    reports: [

      {

        id: "3",

        title: "تقرير الأسبوع 3",

        date: "2025/12/22",

        status: "review",

      },

      {

        id: "2",

        title: "تقرير الأسبوع 2",

        date: "2025/12/15",

        status: "approved",

      },

      {

        id: "1",

        title: "تقرير الأسبوع 1",

        date: "2025/12/08",

        status: "approved",

      },

    ],

    attendanceRecords: [

      {

        id: 1,

        date: "2025/12/22",

        checkIn: "08:55",

        checkOut: "16:05",

        duration: "7 ساعات",

        status: "present",

      },

      {

        id: 2,

        date: "2025/12/21",

        checkIn: "09:00",

        checkOut: "16:00",

        duration: "7 ساعات",

        status: "present",

      },

      {

        id: 3,

        date: "2025/12/18",

        checkIn: "—",

        checkOut: "—",

        duration: "—",

        status: "absent",

      },

    ],

    timeline: [

      {

        title: "بدء التدريب",

        date: "2025/12/01",

        completed: true,

      },

      {

        title: "تقرير الأسبوع 1",

        date: "معتمد",

        completed: true,

      },

      {

        title: "زيارة المشرف",

        date: "2025/12/10",

        completed: true,

      },

      {

        title: "تقرير الأسبوع 3",

        date: "بانتظار المراجعة",

        completed: false,

      },

      {

        title: "التقييم النهائي",

        date: "بعد استكمال المتطلبات",

        completed: false,

      },

    ],

    finalReportApproved: false,

    organizationEvaluationComplete: true,

    academicEvaluationApproved: false,

  },

  {

    id: "20231045",

    name: "محمود إبراهيم رضوان",

    shortName: "محمود رضوان",

    major: "تكنولوجيا علم البيانات",

    organization: "شركة المشرق الرقمية",

    supervisor: "م. أحمد سالم",

    startDate: "2025/12/01",

    endDate: "2026/02/01",

    requiredHours: 120,

    completedHours: 66,

    attendance: 88,

    attendanceDays: 21,

    absenceDays: 3,

    reportsSubmitted: 2,

    reportsRequired: 4,

    lateReports: 1,

    fieldScore: 3.5,

    evaluationId: "2",

    status: "training",

    weeklyProgress: [10, 18, 26, 35, 46, 55],

    reports: [],

    attendanceRecords: [],

    timeline: [],

    finalReportApproved: false,

    organizationEvaluationComplete: false,

    academicEvaluationApproved: false,

  },

  {

    id: "20231188",

    name: "سارة عبد الرحمن",

    shortName: "سارة عبد الرحمن",

    major: "الاتصالات وإنترنت الأشياء",

    organization: "شركة جوال",

    supervisor: "م. يوسف ناصر",

    startDate: "2025/12/01",

    endDate: "2026/02/01",

    requiredHours: 120,

    completedHours: 42,

    attendance: 81,

    attendanceDays: 17,

    absenceDays: 4,

    reportsSubmitted: 2,

    reportsRequired: 4,

    lateReports: 1,

    fieldScore: 4.2,

    evaluationId: "5",

    status: "training",

    weeklyProgress: [5, 11, 19, 24, 30, 35],

    reports: [],

    attendanceRecords: [],

    timeline: [],

    finalReportApproved: false,

    organizationEvaluationComplete: false,

    academicEvaluationApproved: false,

  },

  {

    id: "20231302",

    name: "أنس كمال البيطار",

    shortName: "أنس البيطار",

    major: "إلكترونيات صناعية وتحكم",

    organization: "شركة الأمل للأنظمة الصناعية",

    supervisor: "م. خالد عودة",

    startDate: "2025/09/15",

    endDate: "2025/12/15",

    requiredHours: 120,

    completedHours: 120,

    attendance: 95,

    attendanceDays: 24,

    absenceDays: 1,

    reportsSubmitted: 8,

    reportsRequired: 8,

    lateReports: 0,

    fieldScore: 4.5,

    evaluationId: "3",

    status: "training",

    weeklyProgress: [20, 37, 56, 74, 89, 100],

    reports: [],

    attendanceRecords: [],

    timeline: [

      {

        title: "بدء التدريب",

        date: "2025/09/15",

        completed: true,

      },

      {

        title: "استكمال الساعات",

        date: "120 ساعة",

        completed: true,

      },

      {

        title: "اعتماد التقرير النهائي",

        date: "معتمد",

        completed: true,

      },

      {

        title: "اعتماد التقييم النهائي",

        date: "معتمد",

        completed: true,

      },

    ],

    finalReportApproved: true,

    organizationEvaluationComplete: true,

    academicEvaluationApproved: true,

  },

  {

    id: "20231450",

    name: "هدى يوسف شهير",

    shortName: "هدى شهير",

    major: "التصميم الجرافيكي والفنون الرقمية",

    organization: "استوديو بيكسل للتصميم",

    supervisor: "م. خالد عودة",

    startDate: "2026/01/10",

    endDate: "2026/03/10",

    requiredHours: 120,

    completedHours: 0,

    attendance: 0,

    attendanceDays: 0,

    absenceDays: 0,

    reportsSubmitted: 0,

    reportsRequired: 4,

    lateReports: 0,

    fieldScore: null,

    evaluationId: "4",

    status: "not_started",

    weeklyProgress: [],

    reports: [],

    attendanceRecords: [],

    timeline: [],

    finalReportApproved: false,

    organizationEvaluationComplete: false,

    academicEvaluationApproved: false,

  },

  {

    id: "20231533",

    name: "بلال مصطفى الشيخ",

    shortName: "بلال الشيخ",

    major: "صيانة الحاسب الآلي",

    organization: "مركز الصيانة الفنية المتقدم",

    supervisor: "م. أحمد سالم",

    startDate: "2025/12/01",

    endDate: "2026/02/01",

    requiredHours: 120,

    completedHours: 34,

    attendance: 70,

    attendanceDays: 14,

    absenceDays: 6,

    reportsSubmitted: 1,

    reportsRequired: 4,

    lateReports: 2,

    fieldScore: 3.8,

    evaluationId: "6",

    status: "training",

    weeklyProgress: [5, 10, 16, 20, 24, 28],

    reports: [],

    attendanceRecords: [],

    timeline: [],

    finalReportApproved: false,

    organizationEvaluationComplete: false,

    academicEvaluationApproved: false,

  },

];

// =========================================================
// LOCAL DEMO STORAGE
// This file is a frontend prototype, not an authorization layer.
// The backend must be the source of truth for approvals and hours.
// =========================================================

function getSavedUpdates() {
  try {
    if (typeof window === "undefined") return {};

    const saved = JSON.parse(
      window.localStorage.getItem(MONITORING_STORAGE_KEY) || "{}"
    );

    return saved && typeof saved === "object" && !Array.isArray(saved)
      ? saved
      : {};
  } catch {
    return {};
  }
}

function validNonNegativeNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : fallback;
}

// Read identity and placement from the shared student registry, rather than
// allowing a second copy of a name/organization to become stale.
// Preserve monitoring-only figures and approval flags from this store.
export function getTrainingStudents() {
  const updates = getSavedUpdates();
  const registry = getStudents();
  const activeStatuses = new Set(["قيد التدريب", "منتهٍ", "لم يبدأ"]);
  const baseById = new Map(TRAINING_STUDENTS.map(item => [String(item.id), item]));

  return registry.flatMap(record => {
    const id = String(record.id);
    const seed = baseById.get(id);
    const relevant = activeStatuses.has(record.status);
    // Do not fabricate a training record for applicants/rejected students.
    if (!relevant && !seed) return [];
    if (!relevant && seed && !updates[id]?.completedAt) return [];

    const saved = updates[id];
    const changes = saved && typeof saved === "object" && !Array.isArray(saved)
      ? saved : {};
    const status = record.status === "منتهٍ" || changes.status === "completed"
      ? "completed"
      : record.status === "لم يبدأ" ? "not_started" : "training";
    const base = seed || {
      id, name: record.name, shortName: record.name,
      major: record.major, organization: record.organization,
      supervisor: record.supervisor || "—",
      startDate: record.startDate || "—", endDate: "—",
      requiredHours: TRAINING_HOURS_REQUIRED, completedHours: 0,
      attendance: 0, attendanceDays: 0, absenceDays: 0,
      reportsSubmitted: 0, reportsRequired: 4, lateReports: 0,
      fieldScore: null, evaluationId: null, weeklyProgress: [],
      reports: [], attendanceRecords: [], timeline: [],
      finalReportApproved: false, organizationEvaluationComplete: false,
      academicEvaluationApproved: false,
    };
    const finalReportDecision = getFinalReportApproval(id);
    const evaluation = changes.evaluationId || base.evaluationId
      ? getEvaluation(changes.evaluationId || base.evaluationId) : null;
    // Real attendance records take precedence over historical demo metrics.
    const attendanceData = getSharedAttendance(id);
    const attendanceUpdates = attendanceData.records.length ? {
      completedHours: attendanceData.stats.hours,
      attendance: attendanceData.stats.rate,
      attendanceDays: attendanceData.stats.present + attendanceData.stats.late,
      absenceDays: attendanceData.stats.absent,
      attendanceRecords: attendanceData.records.map(row => ({
        id: row.id || `${id}-${row.date}`, date: row.date,
        checkIn: row.inTime || '—', checkOut: row.outTime || '—',
        duration: row.status === 'absent' ? '—' : `${Number(row.hours ?? 0)} ساعة`,
        status: row.status,
      })),
    } : {};
    return [{
      ...base, ...changes, ...attendanceUpdates,
      // Read actual approval decisions whenever a corresponding record exists.
      finalReportApproved: finalReportDecision === null
        ? (changes.finalReportApproved ?? base.finalReportApproved)
        : finalReportDecision,
      academicEvaluationApproved: evaluation
        ? evaluation.status === "approved"
        : (changes.academicEvaluationApproved ?? base.academicEvaluationApproved),
      // Registry is authoritative for student identity and current placement.
      id, name: record.name || base.name,
      shortName: record.name || base.shortName,
      major: record.major || base.major,
      organization: record.organization || base.organization,
      status,
      // Academic supervisor shown on student registry and field supervisor
      // in monitoring are different roles: keep the existing field supervisor.
      supervisor: seed?.supervisor || changes.supervisor || record.supervisor || "—",
      startDate: record.startDate && record.startDate !== "—"
        ? record.startDate : (changes.startDate || base.startDate),
    }];
  });
}

export function getTrainingStudent(id) {
  if (id == null) return null;
  return (
    getTrainingStudents().find(
      (student) => String(student.id) === String(id)
    ) || null
  );
}

export function getProgress(student) {
  if (!student) return 0;

  const completed = validNonNegativeNumber(student.completedHours);
  const required = validNonNegativeNumber(
    student.requiredHours,
    TRAINING_HOURS_REQUIRED
  );

  if (required <= 0) return 0;

  return Math.min(100, Math.round((completed / required) * 100));
}

export function getMonitoringStatus(student) {
  if (!student) return "unknown";
  if (student.status === "completed") return "completed";
  if (student.status === "not_started") return "not_started";

  const attendance = validNonNegativeNumber(student.attendance);
  const lateReports = validNonNegativeNumber(student.lateReports);

  if (attendance < 80 || lateReports >= 2) return "at_risk";
  if (lateReports > 0) return "late";
  return "regular";
}

export const STATUS_UI = {
  regular: {
    label: "منتظم",
    className: "bg-[#DCFCE7] text-[#15803D]",
  },
  late: {
    label: "متأخر",
    className: "bg-[#FFF0E4] text-[#B54708]",
  },
  at_risk: {
    label: "متعثر",
    className: "bg-[#FEE2E2] text-[#DC2626]",
  },
  completed: {
    label: "منتهٍ",
    className: "bg-[#DCFCE7] text-[#15803D]",
  },
  not_started: {
    label: "لم يبدأ",
    className: "bg-[#F1F5F9] text-[#475569]",
  },
  unknown: {
    label: "غير محدد",
    className: "bg-[#F1F5F9] text-[#475569]",
  },
};

export function getCompletionRequirements(student) {
  if (!student) return [];

  const requiredHours = validNonNegativeNumber(
    student.requiredHours,
    TRAINING_HOURS_REQUIRED
  );
  const completedHours = validNonNegativeNumber(student.completedHours);
  const reportsRequired = validNonNegativeNumber(student.reportsRequired);
  const reportsSubmitted = validNonNegativeNumber(student.reportsSubmitted);

  // Final report and evaluations are separate approval requirements.
  return [
    {
      key: "hours",
      label: `استكمال ${requiredHours} ساعة تدريبية`,
      done: requiredHours > 0 && completedHours >= requiredHours,
    },
    {
      key: "reports",
      label: "تسليم جميع التقارير المطلوبة",
      done: reportsSubmitted >= reportsRequired,
    },
    {
      key: "finalReport",
      label: "اعتماد التقرير النهائي",
      done: student.finalReportApproved === true,
    },
    {
      key: "organizationEvaluation",
      label: "اكتمال تقييم جهة التدريب",
      done: student.organizationEvaluationComplete === true,
    },
    {
      key: "academicEvaluation",
      label: "اعتماد التقييم الأكاديمي والنهائي",
      done: student.academicEvaluationApproved === true,
    },
  ];
}

export function canCompleteTraining(student) {
  return Boolean(
    student &&
      student.status !== "completed" &&
      getCompletionRequirements(student).every((requirement) => requirement.done)
  );
}

export function saveTrainingStudent(student) {
  if (!student || student.id == null || String(student.id).trim() === "") {
    throw new Error("معرّف الطالب غير صالح");
  }

  if (typeof window === "undefined") {
    throw new Error("التخزين المحلي غير متاح");
  }

  const studentId = String(student.id);
  const updates = getSavedUpdates();
  window.localStorage.setItem(
    MONITORING_STORAGE_KEY,
    JSON.stringify({
      ...updates,
      [studentId]: { ...student, id: studentId },
    })
  );

  window.dispatchEvent(new Event("training-monitoring-updated"));
}

// CSV cells beginning with spreadsheet formula operators are escaped.
function csvCell(value) {
  const text = String(value ?? "");
  const safe = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function exportMonitoringCsv(students) {
  const rows = [
    [
      "الرقم الجامعي",
      "الطالب",
      "التخصص",
      "جهة التدريب",
      "الساعات المنجزة",
      "الساعات المطلوبة",
      "نسبة التقدم",
      "نسبة الحضور",
      "الحالة",
    ],
    ...students.map((student) => [
      student.id,
      student.name,
      student.major,
      student.organization,
      student.completedHours,
      student.requiredHours,
      `${getProgress(student)}%`,
      `${student.attendance ?? 0}%`,
      STATUS_UI[getMonitoringStatus(student)].label,
    ]),
  ];

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "training-monitoring.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
