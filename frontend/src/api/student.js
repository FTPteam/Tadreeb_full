// Student data from the backend, shaped like the fields the student pages already use.
// Field names on the backend: docs/API_MAP.md, section 3.
import { api, apiDownload, apiList } from "./client";

// Backend lifecycle → the three states the student pages show.
const ACCEPTED = ["accepted", "assigned", "in_training", "completed", "approved", "certified"];
const REJECTED = ["rejected", "withdrawn"];

export function overallStatus(status) {
  if (ACCEPTED.includes(status)) return "accepted";
  if (REJECTED.includes(status)) return "rejected";
  return "pending";
}

export function toOpportunity(o) {
  return {
    id: String(o.id),
    title: o.title,
    specialty: o.specialization_name || "—",
    specializationId: o.specialization,
    organization: o.provider_name,
    organizationName: o.provider_name,
    organizationId: String(o.provider),
    location: o.location || "غير محدد",
    organizationLocation: o.location || "",
    mode: "حضوري",
    startDate: o.start_date || "",
    endDate: o.end_date || "",
    capacity: o.seats,
    freeSeats: o.free_seats,
    description: o.description || o.tasks || "",
    tasks: o.tasks || "",
    requirements: o.requirements ? o.requirements.split(/\r?\n/).filter(Boolean) : [],
    skills: [],
    status: o.status === "open" ? "published" : "closed",
    statusDisplay: o.status_display,
  };
}

export function toApplication(a) {
  const first = a.preferences?.[0];
  const status = overallStatus(a.status);
  return {
    id: String(a.id),
    backendStatus: a.status,
    statusDisplay: a.status_display,
    opportunityId: String(a.placement?.opportunity ?? first?.opportunity ?? ""),
    opportunityTitle: a.placement?.opportunity_title || first?.opportunity_title || "لم تُحدد فرصة بعد",
    organizationName: a.placement?.provider_name || first?.provider_name || "جهة التدريب",
    organization: a.placement?.provider_name || first?.provider_name || "",
    location: "—",
    startDate: a.placement?.start_date || "",
    endDate: a.placement?.end_date || "",
    submittedAt: a.submitted_at || a.created_at,
    date: (a.submitted_at || a.created_at || "").slice(0, 10),
    supervisor: a.supervisor_name || "",
    placement: a.placement,
    preferences: a.preferences || [],
    documents: a.documents || [],
    history: a.history || [],
    allowedActions: a.allowed_actions || [],
    overallStatus: status,
    academicDecision: status === "accepted" ? "approved" : status,
    note: a.status_reason || a.status_display,
  };
}

export async function fetchMyApplications() {
  return (await apiList("/applications/")).map(toApplication);
}

/** The student's open application (one at a time), or null. */
export async function fetchMyApplication() {
  const rows = await fetchMyApplications();
  return rows[0] || null;
}

/** FR-07: open opportunities in the student's own specialization. */
export async function fetchOpportunities() {
  const profile = await fetchProfile();
  const query = profile.specialization ? `?specialization=${profile.specialization}` : "";
  return (await apiList(`/opportunities/${query}`)).map(toOpportunity);
}

export async function fetchOpportunity(id) {
  return toOpportunity(await api(`/opportunities/${id}/`));
}

/** FR-06 + one open application at a time: {canApply, reason, application}. */
export async function fetchApplyEligibility() {
  const [profile, applications] = await Promise.all([fetchProfile(), fetchMyApplications()]);
  const open = applications.find(a => !["rejected", "withdrawn", "draft", "needs_changes"].includes(a.backendStatus));
  if (!profile.eligibility?.is_eligible) {
    return { canApply: false, reason: profile.eligibility?.reasons?.join(" ") || "أنت غير مؤهل للتدريب حاليًا.", application: open || null };
  }
  if (open) {
    return { canApply: false, reason: `لديك طلب تدريب حالته «${open.statusDisplay}»، ولا يمكنك التقديم على فرصة أخرى.`, application: open };
  }
  return { canApply: true, reason: "", application: null };
}

export function fetchProfile() {
  return api("/students/me/");
}

export function updateProfile(fields) {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, value);
  });
  return api("/students/me/", { method: "PATCH", form });
}

/** Create the draft with up to 3 ranked opportunities, then submit it (FR-08, FR-09). */
export async function applyForTraining(opportunityIds, { submit = true } = {}) {
  const existing = (await apiList("/applications/")).find(a => ["draft", "needs_changes"].includes(a.status));
  const application = existing
    ? await api(`/applications/${existing.id}/`, { method: "PATCH", body: { opportunity_ids: opportunityIds } })
    : await api("/applications/", { method: "POST", body: { opportunity_ids: opportunityIds } });
  return submit ? api(`/applications/${application.id}/submit/`, { method: "POST" }) : application;
}

export function uploadApplicationDocument(applicationId, title, file) {
  const form = new FormData();
  form.append("application", applicationId);
  form.append("title", title);
  form.append("file", file);
  return api("/application-documents/", { method: "POST", form });
}

/** The current training, in the shape of the old trainee record. */
export async function fetchCurrentTraining() {
  const application = await fetchMyApplication();
  if (!application?.placement) return null;
  const progress = await api(`/daily-logs/progress/?application=${application.id}`).catch(() => null);
  const status = { in_training: "active", assigned: "not_started" }[application.backendStatus] || "completed";
  return {
    id: application.id,
    applicationId: application.id,
    status,
    organization: application.organizationName,
    opportunity: application.opportunityTitle,
    supervisor: application.supervisor,
    startDate: application.startDate,
    endDate: application.endDate,
    completedHours: progress?.confirmed_hours ?? 0,
    requiredHours: progress?.required_hours ?? 0,
    remainingHours: progress?.remaining_hours ?? 0,
    percent: progress?.percent ?? 0,
  };
}

export function toDailyLog(log) {
  const tasks = String(log.tasks || "").split(/\r?\n/).map(t => t.trim()).filter(Boolean);
  return {
    id: String(log.id),
    applicationId: String(log.application),
    date: log.date,
    hours: Number(log.hours) || 0,
    tasks,
    title: tasks[0] || log.absence_reason || "يوم تدريب",
    learning: log.notes || "",
    challenges: "",
    isExcused: log.is_excused,
    absenceReason: log.absence_reason,
    // BR-05: confirmed by the provider = approved, otherwise waiting for it.
    status: log.confirmed_at ? "approved" : "pending",
    confirmedAt: log.confirmed_at,
    reviewNote: "",
    createdAt: log.created_at,
  };
}

export async function fetchDailyLogs() {
  return (await apiList("/daily-logs/")).map(toDailyLog).sort((a, b) => b.date.localeCompare(a.date));
}

/** FR-20: one log per day; a confirmed day can't be changed. */
export function saveDailyLog({ id, applicationId, date, hours, tasks, notes = "" }) {
  const body = { date, hours, tasks: (Array.isArray(tasks) ? tasks : [tasks]).filter(Boolean).join("\n"), notes };
  return id
    ? api(`/daily-logs/${id}/`, { method: "PATCH", body })
    : api("/daily-logs/", { method: "POST", body: { ...body, application: Number(applicationId) } });
}

export function fetchAttendance(applicationId) {
  return api(`/daily-logs/attendance/${applicationId ? `?application=${applicationId}` : ""}`);
}

export function toNotification(n) {
  return {
    id: String(n.id),
    title: n.title,
    description: n.message,
    kind: n.kind,
    unread: !n.is_read,
    time: n.created_at,
  };
}

export async function fetchNotifications() {
  return (await apiList("/notifications/")).map(toNotification);
}

export function markNotificationRead(id) {
  return api(`/notifications/${id}/read/`, { method: "POST" });
}

export function markAllNotificationsRead() {
  return api("/notifications/read-all/", { method: "POST" });
}

export async function fetchMyCertificate() {
  return (await apiList("/certificates/"))[0] || null;
}

export function downloadCertificate(certificate) {
  return apiDownload(`/certificates/${certificate.id}/pdf/`, `certificate-${certificate.serial_number}.pdf`);
}

export function downloadPlacementLetter(placementId) {
  return apiDownload(`/placements/${placementId}/letter/`, "training-letter.pdf");
}
