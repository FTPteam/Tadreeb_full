// Browser-only integration bridge. This is NOT an authorization boundary.
// The backend must own approvals and create trainee records transactionally.
import { upsertApprovedStudentTrainee } from "../pages/training-provider/traineesStore";
import { deriveApplicationProgress } from "./trainingLifecycle";

const ADMIN_KEY = "cis-field-training-requests-v1";

export function getAcademicDecisionRecord(applicationId) {
  if (typeof window === "undefined") return null;
  try {
    const records = JSON.parse(localStorage.getItem(ADMIN_KEY) || "[]");
    return Array.isArray(records)
      ? records.find(row => String(row.id) === String(applicationId)) || null
      : null;
  } catch {
    return null;
  }
}

export function getAcademicDecision(applicationId) {
  const decision = getAcademicDecisionRecord(applicationId)?.status;
  return decision === "approved" || decision === "rejected" ? decision : "pending";
}

export function getOverallApplicationStatus(application, academicDecision = getAcademicDecision(application?.id)) {
  if (!application) return "pending";
  return deriveApplicationProgress(application.status, academicDecision).status;
}

export function reconcileTrainingApplication(application, academicDecision = getAcademicDecision(application?.id)) {
  const overallStatus = getOverallApplicationStatus(application, academicDecision);
  if (overallStatus !== "accepted") return { ok: true, created: false, status: overallStatus };
  const result = upsertApprovedStudentTrainee(application);
  return { ...result, status: overallStatus };
}
