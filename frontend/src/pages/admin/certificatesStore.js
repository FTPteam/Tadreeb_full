import { getTrainingStudent } from "./trainingMonitoringStore";

export const CERTIFICATES_STORAGE_KEY = "cis-admin-certificates-v1";

function readCertificates() {
  try {
    const result = JSON.parse(localStorage.getItem(CERTIFICATES_STORAGE_KEY) || "{}");
    return result && typeof result === "object" && !Array.isArray(result) ? result : {};
  } catch {
    return {};
  }
}

export function getCertificate(studentId) {
  const key = String(studentId ?? "").trim();
  return key ? readCertificates()[key] || null : null;
}

export function issueDemoCertificate(studentId) {
  const key = String(studentId ?? "").trim();
  const student = getTrainingStudent(key);
  if (!student || student.status !== "completed" || !student.completedAt) {
    throw new Error("لا يمكن تجهيز شهادة قبل اعتماد إنهاء التدريب.");
  }
  const existing = getCertificate(key);
  if (existing) return existing;

  const certificate = {
    studentId: key,
    studentName: student.name,
    organization: student.organization,
    major: student.major,
    startDate: student.startDate,
    endDate: student.endDate,
    completedHours: Number(student.completedHours) || 0,
    completedAt: student.completedAt,
    issuedAt: new Date().toISOString(),
    // This is a local preview identifier, not an official certificate number.
    previewId: `DEMO-${key}-${String(student.completedAt).replace(/\D/g, "")}`,
    type: "demo",
  };
  localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify({
    ...readCertificates(), [key]: certificate,
  }));
  window.dispatchEvent(new Event("admin-certificates-updated"));
  return certificate;
}
