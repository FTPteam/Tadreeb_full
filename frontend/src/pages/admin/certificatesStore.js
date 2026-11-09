import { api, apiDownload, apiList } from "../../api/client";
import { getTrainingStudent } from "./trainingMonitoringStore";

export const CERTIFICATES_STORAGE_KEY = "cis-admin-certificates-v1";

let cachedCertificates = [];
let hasFetched = false;
let isFetching = false;

export async function refreshCertificates() {
  if (isFetching) return cachedCertificates;
  isFetching = true;
  try {
    const list = await apiList("/certificates/");
    cachedCertificates = (list || []).map((c) => ({
      id: c.id,
      applicationId: c.application,
      studentId: String(c.university_id || ""),
      studentName: c.student_name,
      organization: c.provider_name,
      major: c.specialization,
      opportunityTitle: c.opportunity_title,
      startDate: c.start_date,
      endDate: c.end_date,
      completedHours: Number(c.total_hours) || 0,
      completedAt: c.issued_at ? String(c.issued_at).slice(0, 10) : "",
      issuedAt: c.issued_at,
      serialNumber: c.serial_number,
      verificationCode: c.verification_code,
      isValid: c.is_valid,
      previewId: c.serial_number || `CERT-${c.university_id}`,
      type: "official",
    }));
    hasFetched = true;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin-certificates-updated"));
    }
  } catch {
    // Keep in-memory cache if offline
  } finally {
    isFetching = false;
  }
  return cachedCertificates;
}

if (typeof window !== "undefined") {
  refreshCertificates();
}

export function getCertificate(studentId) {
  if (!hasFetched && !isFetching) {
    refreshCertificates();
  }
  const key = String(studentId ?? "").trim();
  if (!key) return null;
  return (
    cachedCertificates.find(
      (c) =>
        String(c.studentId) === key ||
        String(c.applicationId) === key ||
        String(c.id) === key
    ) || null
  );
}

export async function issueDemoCertificate(studentId) {
  const key = String(studentId ?? "").trim();
  const student = getTrainingStudent(key);
  if (!student || (student.status !== "completed" && student.status !== "certified")) {
    throw new Error("لا يمكن تجهيز شهادة قبل اعتماد إنهاء التدريب.");
  }

  const existing = getCertificate(key);
  if (existing) return existing;

  // Real backend issue: POST /api/certificates/ with { application: id }
  const applicationId = student.applicationId || student.id;
  try {
    const res = await api("/certificates/", {
      method: "POST",
      body: { application: Number(applicationId) },
    });
    await refreshCertificates();
    return getCertificate(key) || {
      id: res.id,
      studentId: key,
      studentName: res.student_name || student.name,
      organization: res.provider_name || student.organization,
      major: res.specialization || student.major,
      completedHours: Number(res.total_hours) || Number(student.completedHours) || 0,
      completedAt: res.issued_at ? String(res.issued_at).slice(0, 10) : student.completedAt,
      issuedAt: res.issued_at,
      serialNumber: res.serial_number,
      previewId: res.serial_number,
      type: "official",
    };
  } catch (err) {
    // If backend rejects or says already issued/not ready, throw clear message
    throw new Error(err?.message || "تعذر إصدار الشهادة من الخادم. تأكد من اكتمال الاعتماد والدرجات.");
  }
}

export function downloadCertificatePdf(certificate) {
  if (!certificate?.id) {
    window.print();
    return Promise.resolve();
  }
  return apiDownload(
    `/certificates/${certificate.id}/pdf/`,
    `certificate-${certificate.serialNumber || certificate.studentId}.pdf`
  );
}
