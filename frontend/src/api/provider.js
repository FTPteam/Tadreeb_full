// Training-provider data from the backend, with the same function names and shapes the
// provider pages used with their browser stores. Getters read a cache that loads from the
// API on first use; subscribe() re-renders the page when fresh data arrives.
import { api, apiList } from "./client";

const EVENT = "tadreeb-provider-data";
const cache = { applications: [], opportunities: [], logs: [], stats: null };
let loading = null;
let loaded = false;

const ACCEPTED = ["in_training", "completed", "approved", "certified"];

function toRequest(a) {
  const placement = a.placement;
  const status = ACCEPTED.includes(a.status) ? "accepted"
    : ["rejected", "withdrawn"].includes(a.status) ? "rejected"
      : "pending";
  return {
    id: String(a.id),
    applicationId: a.id,
    name: a.student_name,
    studentId: a.student_university_id,
    major: a.specialization_name || "—",
    opportunityId: String(placement?.opportunity ?? a.preferences?.[0]?.opportunity ?? ""),
    opportunityTitle: placement?.opportunity_title || "",
    status,
    backendStatus: a.status,
    statusDisplay: a.status_display,
    date: (a.submitted_at || a.created_at || "").slice(0, 10),
    phone: "—",
    gpa: null,
    reason: a.status_reason || "",
    supervisor: a.supervisor_name || "",
    startDate: placement?.start_date || "",
    endDate: placement?.end_date || "",
    rejectionReason: a.status_reason || "",
  };
}

function toOpportunity(o) {
  return {
    id: String(o.id),
    organizationId: String(o.provider),
    title: o.title,
    specialty: o.specialization_name,
    specialization: o.specialization,
    mode: "حضوري",
    hours: 0,
    capacity: o.seats,
    freeSeats: o.free_seats,
    applications: o.seats - o.free_seats,
    deadline: "",
    startDate: o.start_date || "",
    endDate: o.end_date || "",
    supervisor: "",
    location: o.location,
    description: o.description || o.tasks || "",
    requirements: o.requirements ? o.requirements.split(/\r?\n/).filter(Boolean) : [],
    skills: [],
    status: o.status === "open" ? "published" : "closed",
    createdAt: o.created_at,
    applicants: [],
  };
}

function toLog(log) {
  const tasks = String(log.tasks || "").split(/\r?\n/).map(t => t.trim()).filter(Boolean);
  return {
    id: String(log.id),
    traineeId: String(log.application),
    applicationId: log.application,
    name: log.student_name,
    student: log.student_name,
    studentId: log.university_id,
    date: log.date,
    hours: Number(log.hours) || 0,
    tasks,
    title: tasks[0] || log.absence_reason || "سجل يومي",
    description: log.notes || tasks.join("، "),
    learning: log.notes || "",
    challenges: "",
    isExcused: log.is_excused,
    // BR-05: confirmed = approved; waiting for the provider = pending.
    status: log.confirmed_at ? "approved" : "pending",
    reviewNote: log.absence_reason || "",
  };
}

export async function refreshProviderData() {
  loading ??= Promise.all([
    apiList("/applications/"),
    apiList("/opportunities/"),
    apiList("/provider-daily-logs/"),
    api("/stats/provider/").catch(() => null),
  ])
    .then(([applications, opportunities, logs, stats]) => {
      cache.applications = applications.map(toRequest);
      cache.opportunities = opportunities.map(toOpportunity);
      cache.logs = logs.map(toLog);
      cache.stats = stats;
      loaded = true;
      window.dispatchEvent(new Event(EVENT));
    })
    .catch(() => {})
    .finally(() => { loading = null; });
  return loading;
}

function ensureLoaded() {
  if (!loaded && !loading && typeof window !== "undefined") refreshProviderData();
}

export function subscribeProviderData(callback) {
  window.addEventListener(EVENT, callback);
  ensureLoaded();
  return () => window.removeEventListener(EVENT, callback);
}

// --- requests (placed students waiting for the provider) ---

export function getProviderApplications() {
  ensureLoaded();
  return cache.applications;
}

export const subscribeApplications = subscribeProviderData;

/** FR-16: accept = confirm the placement (starts the training). Decline = report an issue to the coordinator. */
export async function decideApplication(id, decision, details = {}) {
  try {
    if (decision === "accepted") {
      await api(`/applications/${id}/confirm/`, { method: "POST" });
    } else {
      const reason = (details.rejectionReason || "").trim();
      if (reason.length < 10) return { ok: false, message: "يجب كتابة سبب رفض واضح (10 أحرف على الأقل)" };
      await api("/exception-requests/", {
        method: "POST",
        body: { application: Number(id), kind: "issue", reason: `رفض الجهة للطالب: ${reason}` },
      });
    }
    await refreshProviderData();
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error.message };
  }
}

// --- opportunities ---

export function getOpportunities() {
  ensureLoaded();
  return cache.opportunities;
}

export function getOpportunity(id) {
  return getOpportunities().find(item => item.id === String(id)) || null;
}

export const getProviderOpportunity = getOpportunity;
export const getCurrentProviderOpportunities = getOpportunities;
export const subscribeOpportunities = subscribeProviderData;

export async function setOpportunityStatus(id, status) {
  try {
    await api(`/opportunities/${id}/`, { method: "PATCH", body: { status: status === "published" ? "open" : "closed" } });
    await refreshProviderData();
    return true;
  } catch {
    return false;
  }
}

// --- daily logs (FR-21, BR-05) ---

export function getDailyLogs() {
  ensureLoaded();
  return cache.logs;
}

export const subscribeDailyLogs = subscribeProviderData;

/** "approved" confirms the day (BR-05). There is no "return for edit" on the backend:
 * an unconfirmed day simply stays open, and the student can still edit it. */
export async function saveDailyLogDecision(id, decision) {
  if (decision !== "approved") {
    return { ok: false, message: "يبقى السجل بانتظار التأكيد، ويستطيع الطالب تعديله حتى تؤكده الجهة." };
  }
  try {
    await api(`/provider-daily-logs/${id}/confirm/`, { method: "POST" });
    await refreshProviderData();
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error.message };
  }
}

// --- attendance for one date, built from the daily logs ---

// BR-06 default (TADREEB_REQUIRED_TRAINING_HOURS). A department may set its own number,
// which the provider API doesn't return yet.
const DEFAULT_REQUIRED_HOURS = 240;

/** The students training now, in the shape of the old trainee records. */
export function getTrainees() {
  const logs = getDailyLogs();
  return getProviderApplications()
    .filter(row => ["in_training", "completed"].includes(row.backendStatus))
    .map(row => {
      const own = logs.filter(log => log.traineeId === row.id);
      const confirmed = own.filter(log => log.status === "approved" && !log.isExcused);
      return {
        ...row,
        opportunity: row.opportunityTitle,
        status: row.backendStatus === "completed" ? "completed" : "active",
        completedHours: confirmed.reduce((sum, log) => sum + log.hours, 0),
        requiredHours: DEFAULT_REQUIRED_HOURS,
        attendance: own.length ? Math.round((confirmed.length / own.length) * 100) : 0,
      };
    });
}

export const subscribeTrainees = subscribeProviderData;

export function getAttendanceRows(date) {
  const logs = getDailyLogs();
  return getTrainees().map(trainee => {
    const log = logs.find(item => item.traineeId === trainee.id && item.date === date);
    const own = logs.filter(item => item.traineeId === trainee.id);
    const confirmed = own.filter(item => item.status === "approved" && !item.isExcused).length;
    return {
      id: trainee.id,
      name: trainee.name,
      opportunity: trainee.opportunity,
      // A day counts as present once the provider confirms the student's log.
      status: !log ? "unrecorded" : log.isExcused ? "absent" : log.status === "approved" ? "present" : "unrecorded",
      recorded: Boolean(log && (log.status === "approved" || log.isExcused)),
      logId: log?.id || "",
      inTime: "",
      outTime: "",
      rate: own.length ? Math.round((confirmed / own.length) * 100) : null,
      hours: log?.hours ?? 0,
    };
  });
}

/** Present = confirm the student's log for that day. Absent with a reason = an excused day (FR-22). */
export async function saveAttendanceRow(id, value, date) {
  const row = getAttendanceRows(date).find(item => item.id === String(id));
  try {
    if (value.status === "absent") {
      const reason = (value.reason || "").trim();
      if (!reason) {
        return { ok: false, message: "اليوم بدون سجل يُحسب غيابًا تلقائيًا. سجّل الغياب هنا فقط إذا كان بعذر، واكتب السبب." };
      }
      await api("/provider-daily-logs/record-absence/", { method: "POST", body: { application: Number(id), date, reason } });
    } else {
      if (!row?.logId) return { ok: false, message: "لم يسجّل الطالب هذا اليوم بعد. يُسجَّل الحضور بتأكيد سجله اليومي." };
      await api(`/provider-daily-logs/${row.logId}/confirm/`, { method: "POST" });
    }
    await refreshProviderData();
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error.message };
  }
}

// --- dashboard (FR-36) ---

export function getProviderStats() {
  ensureLoaded();
  return cache.stats;
}
