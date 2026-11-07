import { getApplications as getAllProviderApplications } from "../training-provider/providerApplicationsStore";
import { getOpportunity } from "../training-provider/opportunitiesStore";
import { canAcceptOrganization, getOrganization } from "./trainingOrganizationsStore";
// Shared demo-only training request store for admin pages.
// Real approval and authorization must happen on the backend.
import { getStudent, saveStudent } from "./studentsStore";
import { findTrainingConflict, trainingConflictMessage } from "../../services/activeTrainingGuard";
import { reconcileTrainingApplication } from "../../services/trainingWorkflow";

export const REQUESTS_STORAGE_KEY = "cis-field-training-requests-v1";

const INITIAL_REQUESTS = [
  {
    id: "APP-0412",
    studentId: "20231234",
    studentName: "أمل أحمد",
    fullName: "أمل أحمد صيام أبو زيد",
    major: "البرمجيات وقواعد البيانات",
    gpa: "3.42",
    organization: "شركة القدس للاتصالات",
    requestDate: "2025/10/01",
    position: "تدريب تطوير الويب",
    duration: "120 ساعة",
    attendanceMode: "حضوري",
    status: "pending",
    note: "",
  },
  {
    id: "APP-0409",
    studentId: "20231045",
    studentName: "محمود رضوان",
    fullName: "محمود إبراهيم رضوان",
    major: "تكنولوجيا علم البيانات",
    gpa: "3.65",
    organization: "شركة المشرق الرقمية",
    requestDate: "2025/09/29",
    position: "تدريب تحليل البيانات",
    duration: "120 ساعة",
    attendanceMode: "حضوري",
    status: "approved",
    note: "",
  },
  {
    id: "APP-0405",
    studentId: "20231533",
    studentName: "بلال الشيخ",
    fullName: "بلال مصطفى الشيخ",
    major: "صيانة الحاسب الآلي",
    gpa: "2.90",
    organization: "شركة جوال",
    requestDate: "2025/09/27",
    position: "تدريب صيانة ودعم فني",
    duration: "120 ساعة",
    attendanceMode: "حضوري",
    status: "rejected",
    note: "",
  },
  {
    id: "APP-0401",
    studentId: "20231450",
    studentName: "هدى شهير",
    fullName: "هدى شهير",
    major: "التصميم الجرافيكي والفنون الرقمية",
    gpa: "3.50",
    organization: "استوديو بيكسل الإبداعية",
    requestDate: "2025/09/25",
    position: "تدريب تصميم جرافيكي",
    duration: "120 ساعة",
    attendanceMode: "حضوري",
    status: "pending",
    note: "",
  },
  {
    id: "APP-0398",
    studentId: "20231744",
    studentName: "أحمد ناصر",
    fullName: "أحمد سامي ناصر",
    major: "إلكترونيات صناعية وتحكم",
    gpa: "3.10",
    organization: "شركة التقنية الحديثة",
    requestDate: "2025/09/21",
    position: "تدريب أنظمة التحكم",
    duration: "120 ساعة",
    attendanceMode: "حضوري",
    status: "approved",
    note: "",
  },
  {
    id: "APP-0394",
    studentId: "20231628",
    studentName: "نور خليل",
    fullName: "نور أحمد خليل",
    major: "تكنولوجيا علم البيانات",
    gpa: "3.70",
    organization: "شركة الأمل للأنظمة",
    requestDate: "2025/09/19",
    position: "تدريب معالجة البيانات",
    duration: "120 ساعة",
    attendanceMode: "حضوري",
    status: "pending",
    note: "",
  },
  {
    id: "APP-0390",
    studentId: "20231712",
    studentName: "ياسمين محمود",
    fullName: "ياسمين محمود",
    major: "التصميم الجرافيكي والفنون الرقمية",
    gpa: "3.30",
    organization: "شركة جوال",
    requestDate: "2025/09/17",
    position: "تدريب التصميم الرقمي",
    duration: "120 ساعة",
    attendanceMode: "حضوري",
    status: "rejected",
    note: "",
  },
  {
    id: "APP-0388",
    studentId: "20231601",
    studentName: "محمد العطار",
    fullName: "محمد خالد العطار",
    major: "البرمجيات وقواعد البيانات",
    gpa: "3.60",
    organization: "شركة القدس للاتصالات",
    requestDate: "2025/09/15",
    position: "تدريب تطوير البرمجيات",
    duration: "120 ساعة",
    attendanceMode: "حضوري",
    status: "approved",
    note: "",
  },
];

function savedRequests() {
  try {
    if (typeof window === "undefined") return [];
    const value = JSON.parse(window.localStorage.getItem(REQUESTS_STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter(item => item && item.id != null) : [];
  } catch {
    return [];
  }
}

export function getRequests() {
  const saved = savedRequests();
  const byId = new Map(INITIAL_REQUESTS.map(item => [String(item.id), { ...item }]));
  saved.forEach(item => {
    const id = String(item.id);
    byId.set(id, { ...(byId.get(id) || {}), ...item, id });
  });
  // New student submissions always start awaiting an independent academic decision.
  // The provider decision is NOT an academic approval.
  for (const row of getAllProviderApplications().filter(x => x.source === "student")) {
    const opportunity = getOpportunity(row.opportunityId);
    const id = String(row.id);
    if (!byId.has(id)) byId.set(id, {
      id, studentId: row.studentId, studentName: row.name, fullName: row.name,
      major: row.major, gpa: row.gpa || "", organization: row.organization || "جهة التدريب",
      requestDate: row.date?.replaceAll("-", "/") || "", position: opportunity?.title || "فرصة تدريب",
      duration: `${opportunity?.hours || 0} ساعة`, attendanceMode: opportunity?.mode || "حضوري",
      status: "pending", note: "", source: "student", opportunityId: row.opportunityId,
    });
  }
  return [...byId.values()].map(request => {
    const opportunity = request.opportunityId ? getOpportunity(request.opportunityId) : null;
    const organizationId = opportunity?.organizationId ?? request.organizationId;
    const organization = organizationId != null ? getOrganization(organizationId) : null;
    const student = getStudent(request.studentId);
    return {
      ...request,
      organizationId: organizationId != null ? String(organizationId) : request.organizationId,
      organization: organization?.name || request.organization || "غير محدد",
      organizationName: organization?.name || request.organization || "غير محدد",
      position: opportunity?.title || request.position || "غير محدد",
      duration: opportunity?.hours != null ? `${opportunity.hours} ساعة` : request.duration || "غير محدد",
      attendanceMode: opportunity?.mode || request.attendanceMode || "غير محدد",
      major: student?.major || request.major,
      studentName: student?.name || request.studentName,
      fullName: student?.name || request.fullName || request.studentName,
    };
  });
}

export function getRequest(id) {
  if (id == null) return null;
  return getRequests().find(item => String(item.id) === String(id)) || null;
}

export function saveRequest(request) {
  const id = String(request?.id ?? "").trim();
  if (!id) throw new Error("معرّف الطلب غير صالح");
  const current = getRequest(id);
  const records = savedRequests();
  const merged = { ...(current || {}), ...request, id };
  const index = records.findIndex(item => String(item.id) === id);
  if (index === -1) records.push(merged);
  else records[index] = merged;
  window.localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(records));
  window.dispatchEvent(new Event("admin-training-requests-updated"));
  return merged;
}

function assertSingleActiveTraining(request) {
  const otherRequests = getRequests().filter(row => row.status === "approved");
  const conflict = findTrainingConflict({
    studentId: request.studentId,
    currentRequestId: request.id,
    student: getStudent(request.studentId),
    requests: otherRequests,
  });
  if (conflict) {
    throw new Error(trainingConflictMessage(conflict, request.fullName || request.studentName));
  }
}

// A decision also updates the shared student registry used by admin pages.
// Keep existing training status if the student already started or completed.
export function decideRequest(request, status) {
  if (!["approved", "rejected"].includes(status)) throw new Error("قرار غير صالح");
  const current = getRequest(request?.id);
  if (!current || current.status !== "pending") throw new Error("هذا الطلب غير متاح لاتخاذ قرار");
  if (current.source === "student") {
    if (status === "approved" && !canAcceptOrganization(current.organization, current.organizationId)) {
      throw new Error("جهة التدريب غير معتمدة لدى الإدارة. يجب اعتماد الجهة أولًا.");
    }
    if (status === "approved") {
      const providerDecision = getAllProviderApplications().find(row =>
        row.source === "student" &&
        String(row.id) === String(current.id) &&
        String(row.studentId) === String(current.studentId)
      );
      if (providerDecision?.status === "rejected") {
        throw new Error("جهة التدريب رفضت هذا الطلب. لا يمكن اعتماده أكاديميًا؛ يمكن للطالب التقديم لفرصة أخرى.");
      }
      assertSingleActiveTraining(current);
    }
    const saved = saveRequest({ ...current, ...request, status });
    // A student account may not yet exist in the admin prototype registry.
    // Create a minimal record only when the academic approval succeeds.
    if (status === "approved") {
      const student = getStudent(current.studentId);
      saveStudent({ ...(student || {}), id: String(current.studentId),
        name: student?.name || current.fullName || current.studentName,
        major: student?.major || current.major,
        organization: current.organization,
        requestStatus: "approved",
        activeRequestId: String(current.id),
        status: student?.status === "منتهٍ" || student?.status === "قيد التدريب" ? student.status : "لم يبدأ",
      });
    }
    const providerRow = getAllProviderApplications().find(row =>
      row.source === "student" &&
      String(row.id) === String(current.id) &&
      String(row.studentId) === String(current.studentId)
    );
    if (providerRow) reconcileTrainingApplication(providerRow, status);
    return saved;
  }
  const studentId = String(current.studentId || "");
  const student = getStudent(studentId);
  if (!student) throw new Error("الطالب غير موجود في سجل الإدارة");
  if (status === "approved") {
    if (!canAcceptOrganization(current.organization, current.organizationId)) throw new Error("جهة التدريب غير معتمدة أو غير مسجلة، لا يمكن قبول الطلب");
    assertSingleActiveTraining(current);
  }
  // Request decision and training progress are separate concepts.
  // Approval does not mean the student has started attending training.
  const studentUpdate = { ...student, requestStatus: status };
  if (status === "approved") {
    studentUpdate.activeRequestId = String(current.id);
    studentUpdate.organization = current.organization || student.organization;
    // Keep in-progress and completed training intact. Otherwise the approved
    // student is waiting to start, NOT already in training.
    if (!["قيد التدريب", "منتهٍ"].includes(student.status)) {
      studentUpdate.status = "لم يبدأ";
    }
  }
  // A rejected application must NOT change the student's training progress;
  // the two statuses have independent lifecycles.
  const saved = saveRequest({ ...current, ...request, status });
  try {
    saveStudent(studentUpdate);
  } catch (error) {
    try { saveRequest(current); } catch {}
    throw error;
  }
  return saved;
}
