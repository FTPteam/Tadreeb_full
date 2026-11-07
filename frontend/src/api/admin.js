// Coordinator / admin / supervisor data from the backend, shaped like the admin pages'
// old browser stores (trainingRequestsStore). Field names: docs/API_MAP.md, section 4.
import { api, apiList } from "./client";
import { getCurrentUser } from "./auth";

const PENDING = ["submitted", "under_review", "needs_changes"];
const REJECTED = ["rejected", "withdrawn"];

export function fetchStats() {
  return api("/stats/");
}

function toRequest(a) {
  const first = a.preferences?.[0];
  const decision = a.history?.slice().reverse().find(step => ["accepted", "rejected"].includes(step.to_status));
  return {
    id: String(a.id),
    applicationId: a.id,
    studentId: a.student_university_id,
    studentName: a.student_name,
    fullName: a.student_name,
    major: "—",
    gpa: "—",
    organization: a.placement?.provider_name || first?.provider_name || "غير محدد",
    organizationName: a.placement?.provider_name || first?.provider_name || "غير محدد",
    opportunityId: String(a.placement?.opportunity ?? first?.opportunity ?? ""),
    position: a.placement?.opportunity_title || first?.opportunity_title || "غير محدد",
    duration: a.placement ? `${a.placement.start_date} → ${a.placement.end_date}` : "يُحدد عند التوزيع",
    attendanceMode: "حضوري",
    requestDate: (a.submitted_at || a.created_at || "").slice(0, 10).replaceAll("-", "/"),
    // The admin pages show three states: waiting, accepted (approved) and rejected.
    status: PENDING.includes(a.status) ? "pending" : REJECTED.includes(a.status) ? "rejected" : "approved",
    backendStatus: a.status,
    statusDisplay: a.status_display,
    supervisor: a.supervisor,
    supervisorName: a.supervisor_name || "",
    preferences: a.preferences || [],
    allowedActions: a.allowed_actions || [],
    note: a.status_reason || "",
    rejectionReason: REJECTED.includes(a.status) ? a.status_reason : "",
    decisionDate: decision?.created_at?.slice(0, 10) || "",
    decidedBy: null,
  };
}

/** Applications the coordinator works on (drafts aren't shown to staff). */
export async function fetchRequests() {
  return (await apiList("/applications/")).filter(a => a.status !== "draft").map(toRequest);
}

export async function fetchRequest(id) {
  return toRequest(await api(`/applications/${id}/`));
}

function transition(id, status, reason = "") {
  return api(`/applications/${id}/transition/`, { method: "POST", body: { status, reason } });
}

/**
 * "approved": accept the application (FR-13), then — for the coordinator — assign a supervisor
 * if none is set and allocate the student to their first choice (FR-14, FR-18).
 * "rejected": reject with the reason. Returns a message describing what was done.
 */
export async function decideRequest(request, status) {
  const id = request.applicationId || request.id;
  let application = await api(`/applications/${id}/`);

  if (status === "rejected") {
    if (application.status === "submitted") await transition(id, "under_review");
    await transition(id, "rejected", request.rejectionReason || request.note);
    return "تم رفض الطلب وإبلاغ الطالب بالسبب.";
  }

  if (application.status === "submitted") application = await transition(id, "under_review");
  if (application.status === "under_review") application = await transition(id, "accepted", request.note || "");

  // Only the coordinator allocates (FR-14); a supervisor's approval stops at "accepted".
  if (getCurrentUser()?.role !== "coordinator") return "تم قبول الطلب، وبانتظار توزيع منسق التدريب.";

  const notes = ["تم قبول الطلب"];
  if (!application.supervisor) {
    // Demo shortcut until the page gets a supervisor picker: the first active supervisor.
    const [supervisor] = await apiList("/users/?role=supervisor&is_active=true");
    if (!supervisor) return `${notes[0]}. لا يوجد مشرف أكاديمي لتعيينه، أضف مشرفًا ثم وزّع الطالب.`;
    application = await api(`/applications/${id}/assign-supervisor/`, { method: "POST", body: { supervisor: supervisor.id } });
    notes.push(`وتعيين ${supervisor.full_name || supervisor.username} مشرفًا`);
  }
  const first = application.preferences?.[0];
  if (first) {
    try {
      await api(`/applications/${id}/allocate/`, { method: "POST", body: { opportunity: first.opportunity } });
      notes.push(`وتوزيع الطالب على «${first.opportunity_title}»، وبانتظار تأكيد الجهة`);
    } catch (error) {
      notes.push(`ولم يتم التوزيع: ${error.message}`);
    }
  }
  return `${notes.join("، ")}.`;
}
