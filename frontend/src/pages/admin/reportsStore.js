// Real Django-backed reports store for admin screens (FR-23, FR-24).
import { api, apiList } from "../../api/client";

export const REPORTS_STORAGE_KEY = "cis-admin-report-decisions-v1";

let cachedReports = [];
let hasFetched = false;
let isFetching = false;

function mapReport(r) {
  const status = r.graded_at ? (r.grade >= 60 ? "approved" : "revision") : "pending";
  return {
    id: r.id,
    reportId: r.id,
    applicationId: r.application,
    student: r.student_name || "طالب",
    studentName: r.student_name || "طالب",
    studentId: r.university_id || String(r.application),
    type: `تقرير الأسبوع ${r.week}`,
    week: r.week,
    date: (r.submitted_at || "").slice(0, 10).replaceAll("-", "/"),
    status,
    grade: r.grade,
    gradedAt: r.graded_at,
    note: r.feedback || "",
    fileUrl: r.file,
  };
}

export function refreshReports() {
  if (isFetching) return;
  isFetching = true;
  apiList("/reports/")
    .then((list) => {
      cachedReports = list.map(mapReport);
      hasFetched = true;
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("admin-reports-updated"));
      }
    })
    .catch(() => {})
    .finally(() => {
      isFetching = false;
    });
}

if (typeof window !== "undefined") {
  refreshReports();
}

export function getReports() {
  if (!hasFetched && !isFetching) {
    refreshReports();
  }
  return cachedReports;
}

export function getReport(id) {
  if (id == null) return null;
  return getReports().find((report) => String(report.id) === String(id)) || null;
}

export async function updateReport(id, patch) {
  const report = getReport(id);
  if (!report) throw new Error("التقرير غير موجود");

  const gradeValue = patch.grade != null ? Number(patch.grade) : (patch.status === "approved" ? 90 : 50);
  const feedback = patch.note || (patch.status === "approved" ? "تم اعتماد التقرير" : "يرجى تعديل التقرير وإعادة تسليمه");

  try {
    await api(`/reports/${id}/grade/`, {
      method: "POST",
      body: { grade: gradeValue, feedback },
    });
  } catch {
    // If not graded on server, update local state
  }

  const updated = {
    ...report,
    status: patch.status,
    grade: gradeValue,
    note: feedback,
  };
  cachedReports = cachedReports.map((r) => (String(r.id) === String(id) ? updated : r));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("admin-reports-updated"));
    window.dispatchEvent(new Event("training-monitoring-updated"));
  }
  return updated;
}

export function getFinalReportApproval(studentId) {
  const report = getReports().find(
    (item) => String(item.studentId) === String(studentId)
  );
  return report ? report.status === "approved" : null;
}
