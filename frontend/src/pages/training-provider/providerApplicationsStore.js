import { getProviderProfile } from "./providerProfileStore";
import { getAcademicDecision, reconcileTrainingApplication } from "../../services/trainingWorkflow";
import { getOpportunities, getOpportunity, getStudentVisibleOpportunity, getProviderOpportunity, saveOpportunity } from "./opportunitiesStore";
import { getActiveProviderOrganizationId } from "../../services/providerOrganization";
import { getOrganization } from "../admin/trainingOrganizationsStore";
import { getStudent } from "../admin/studentsStore";
import { findTrainingConflict, trainingConflictMessage } from "../../services/activeTrainingGuard";
import { getActiveStudentId, getStudentApplicationEligibility } from "../../services/studentTrainingEligibility";
import { api, apiList } from "../../api/client";

const KEY = "cis-provider-applications-v1";
const EVENT = "cis-provider-applications-updated";

let cachedApplications = [];
let hasFetched = false;
let isFetching = false;

function mapBackendToProviderApplication(app) {
  const placement = app.placement;
  const oppId = String(placement?.opportunity ?? app.preferences?.[0]?.opportunity ?? "1");
  const isConfirmed = Boolean(placement?.provider_confirmed_at);
  const status = isConfirmed
    ? "accepted"
    : app.status === "rejected" || app.status === "withdrawn"
    ? "rejected"
    : "pending";

  return {
    id: String(app.id),
    numericId: app.id,
    name: app.student_name || `طالب ${app.student}`,
    studentId: String(app.university_id || app.student),
    major: app.specialization_name || "البرمجيات وقواعد البيانات",
    opportunityId: oppId,
    status,
    date: (app.submitted_at || app.created_at || "").slice(0, 10),
    phone: app.student_phone || "0599123485",
    email: app.student_email || "",
    gpa: 89,
    reason: app.preferences?.[0]?.notes || "أرغب في تطبيق ما تعلمته عمليًا وتطوير مهاراتي ضمن بيئة عمل حقيقية.",
    organization: placement?.provider_name || app.organization_name || "جهة التدريب",
    organizationId: String(placement?.provider || "1"),
    supervisor: app.supervisor_name || "خالد عودة",
    startDate: placement?.start_date || "2026-03-01",
    source: "student",
  };
}

export async function refreshProviderApplications() {
  if (isFetching) return cachedApplications;
  isFetching = true;
  try {
    const list = await apiList("/applications/");
    cachedApplications = (list || []).map(mapBackendToProviderApplication);
    hasFetched = true;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(EVENT));
    }
  } catch {
    // Keep cached
  } finally {
    isFetching = false;
  }
  return cachedApplications;
}

if (typeof window !== "undefined") {
  refreshProviderApplications();
}

const canBrowser = () => typeof window !== "undefined";

export function getApplications() {
  if (!hasFetched && !isFetching) {
    refreshProviderApplications();
  }
  return cachedApplications;
}

export function getProviderApplications() {
  return getApplications();
}

export function subscribeApplications(cb) {
  if (!canBrowser()) return () => {};
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener(EVENT, cb);
  };
}

const notify = () => {
  if (canBrowser()) window.dispatchEvent(new Event(EVENT));
};

export async function decideApplication(id, decision, details = {}) {
  if (!["accepted", "rejected"].includes(decision)) return { ok: false, message: "قرار غير صالح" };

  const records = getApplications();
  const record = records.find((x) => String(x.id) === String(id));
  if (!record || record.status !== "pending") return { ok: false, message: "الطلب غير موجود أو سبق اتخاذ قرار بشأنه" };

  if (decision === "accepted") {
    try {
      // Call backend FR-16 endpoint: POST /api/applications/<id>/confirm/
      await api(`/applications/${record.numericId || id}/confirm/`, {
        method: "POST",
      });
      await refreshProviderApplications();
      notify();
      return { ok: true, record: { ...record, status: "accepted" } };
    } catch (err) {
      // If error from backend, return Arabic error message
      return { ok: false, message: err?.message || "تعذر تأكيد قبول الطالب على الخادم." };
    }
  } else {
    // Rejection or issue
    if (!details.rejectionReason?.trim() || details.rejectionReason.trim().length < 5) {
      return { ok: false, message: "يجب كتابة سبب رفض واضح" };
    }
    try {
      await api("/exception-requests/", {
        method: "POST",
        body: {
          application: Number(record.numericId || id),
          kind: "issue",
          reason: `رفض جهة التدريب: ${details.rejectionReason.trim()}`,
        },
      });
      await refreshProviderApplications();
      notify();
      return { ok: true, record: { ...record, status: "rejected" } };
    } catch (err) {
      return { ok: false, message: err?.message || "تعذر حفظ رفض الطلب على الخادم." };
    }
  }
}

export function exportApplicationsCsv(records) {
  const cols = [
    ["الطالب", "الرقم الجامعي", "رقم الطلب", "الفرصة", "التخصص", "التاريخ", "الحالة"],
    ...records.map((x) => [
      x.name,
      x.studentId,
      x.id,
      getOpportunity(x.opportunityId)?.title || "فرصة غير متاحة",
      x.major,
      x.date,
      ({ pending: "معلق", accepted: "مقبول", rejected: "مرفوض" })[x.status] || x.status,
    ]),
  ];
  const cell = (x) => `"${String(x ?? "").replace(/^\s*[=+@-]/, "'$&").replace(/"/g, '""')} "`.trimEnd();
  const csv = "\uFEFF" + cols.map((r) => r.map(cell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "provider-student-applications.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function resetDemoApplications() {
  refreshProviderApplications();
}

export async function submitStudentApplication(form, opportunityId) {
  try {
    const oppIdNum = Number(opportunityId);
    if (!Number.isFinite(oppIdNum)) {
      return { ok: false, message: "فرصة التدريب غير صالحة" };
    }
    const res = await api("/applications/", {
      method: "POST",
      body: {
        opportunity_ids: [oppIdNum],
      },
    });
    // Auto-submit draft
    await api(`/applications/${res.id}/submit/`, { method: "POST" });
    await refreshProviderApplications();
    return { ok: true, record: mapBackendToProviderApplication(res) };
  } catch (err) {
    return { ok: false, message: err?.message || "تعذر تقديم الطلب على الخادم." };
  }
}
