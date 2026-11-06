// Shared demo report decisions. Server-side approval must replace this before production.
export const REPORTS_STORAGE_KEY = "cis-admin-report-decisions-v1";

export const INITIAL_REPORTS = [
  {
    id: 1,
    student: "أمل أحمد",
    type: "تقرير أسبوعي - الأسبوع 3",
    date: "2025/12/22",
    status: "pending",
    note: "",
  },
  {
    id: 2,
    student: "محمود رضوان",
    type: "تقرير أسبوعي - الأسبوع 3",
    date: "2025/12/21",
    status: "pending",
    note: "",
  },
  {
    id: 3,
    student: "أنس البيطار",
    type: "التقرير النهائي",
    date: "2025/12/18",
    status: "approved",
    note: "عمل ممتاز",
  },
  {
    id: 4,
    student: "سارة عبد الرحمن",
    type: "تقرير أسبوعي - الأسبوع 2",
    date: "2025/12/15",
    status: "revision",
    note: "أضف المخرجات",
  },
  {
    id: 5,
    student: "هدى شهير",
    type: "تقرير أسبوعي - الأسبوع 1",
    date: "2025/12/13",
    status: "approved",
    note: "مقبول",
  },
  {
    id: 6,
    student: "بلال الشيخ",
    type: "تقرير أسبوعي - الأسبوع 2",
    date: "2025/12/12",
    status: "pending",
    note: "",
  },
  {
    id: 7,
    student: "نور خليل",
    type: "التقرير النهائي",
    date: "2025/12/10",
    status: "approved",
    note: "ممتاز",
  },
  {
    id: 8,
    student: "محمد العطار",
    type: "تقرير أسبوعي - الأسبوع 4",
    date: "2025/12/09",
    status: "revision",
    note: "يرجى إضافة تفاصيل أكثر",
  },
];


const STUDENT_IDS = {
  1: "20231234", 2: "20231045", 3: "20231302", 4: "20231188",
  5: "20231450", 6: "20231533", 7: "20231628", 8: "20231601",
};

function readUpdates() {
  try {
    if (typeof window === "undefined") return {};
    const parsed = JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch { return {}; }
}

export function getReports() {
  const changes = readUpdates();
  return INITIAL_REPORTS.map(report => ({
    ...report,
    ...(changes[report.id] || {}),
    id: report.id,
    studentId: STUDENT_IDS[report.id],
  }));
}

export function getReport(id) {
  return getReports().find(report => String(report.id) === String(id)) || null;
}

export function updateReport(id, patch) {
  const report = getReport(id);
  if (!report) throw new Error("التقرير غير موجود");
  if (!["approved", "pending", "revision"].includes(patch?.status)) {
    throw new Error("حالة التقرير غير صالحة");
  }
  const updated = { ...report, status: patch.status, note: String(patch.note ?? report.note) };
  const changes = readUpdates();
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify({
    ...changes, [report.id]: { status: updated.status, note: updated.note },
  }));
  window.dispatchEvent(new Event("admin-reports-updated"));
  window.dispatchEvent(new Event("training-monitoring-updated"));
  return updated;
}

export function getFinalReportApproval(studentId) {
  const report = getReports().find(item =>
    String(item.studentId) === String(studentId) && item.type.includes("النهائي")
  );
  return report ? report.status === "approved" : null;
}
