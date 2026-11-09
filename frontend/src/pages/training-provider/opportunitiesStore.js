import { ACADEMIC_PROGRAMS, isDepartmentProgram } from "../../constants/academicPrograms.js";
import { getActiveProviderOrganizationId, isActiveProviderApproved } from "../../services/providerOrganization.js";
import { getOrganization } from "../admin/trainingOrganizationsStore.js";
import { api, apiList } from "../../api/client.js";

const KEY = "cis-provider-opportunities-v1";
const EVENT = "cis-provider-opportunities-updated";

export const statusLabel = { draft: "مسودة", published: "منشورة", closed: "مغلقة" };
export const specialties = ACADEMIC_PROGRAMS;

let cachedOpportunities = [];
let hasFetched = false;
let isFetching = false;

function specNameToId(name) {
  const map = {
    "هندسة برمجيات": 1,
    "البرمجيات وقواعد البيانات": 1,
    "برمجة": 2,
    "تطوير الويب": 2,
    "شبكات": 3,
    "الاتصالات وإنترنت الأشياء": 3,
    "الدعم الفني": 3,
    "تكنولوجيا علم البيانات": 1,
    "محاسبة": 4,
    "إدارة أعمال": 5,
  };
  return map[name] || 1;
}

export function toStoreOpportunity(o) {
  return {
    id: String(o.id),
    numericId: o.id,
    organizationId: String(o.provider || "1"),
    title: o.title,
    specialty: o.specialization_name || "البرمجيات وقواعد البيانات",
    specializationId: o.specialization,
    mode: "حضوري",
    hours: 120,
    capacity: Number(o.seats) || 3,
    freeSeats: o.free_seats,
    applications: 0,
    deadline: o.end_date || "",
    startDate: o.start_date || "",
    endDate: o.end_date || "",
    supervisor: o.provider_name || "م. خالد عودة",
    description: o.description || o.tasks || "",
    requirements: typeof o.requirements === "string" ? o.requirements.split(/\r?\n/).filter(Boolean) : (o.requirements || []),
    skills: ["العمل الجماعي", "الالتزام"],
    status: o.status === "open" ? "published" : "closed",
    createdAt: o.created_at || new Date().toISOString(),
    applicants: [],
  };
}

export async function refreshOpportunities() {
  if (isFetching) return cachedOpportunities;
  isFetching = true;
  try {
    const list = await apiList("/opportunities/");
    cachedOpportunities = (list || []).map(toStoreOpportunity);
    hasFetched = true;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(EVENT));
    }
  } catch {
    // Keep cached
  } finally {
    isFetching = false;
  }
  return cachedOpportunities;
}

if (typeof window !== "undefined") {
  refreshOpportunities();
}

const browser = () => typeof window !== "undefined";

export function getOpportunities() {
  if (!hasFetched && !isFetching) {
    refreshOpportunities();
  }
  return cachedOpportunities;
}

export function subscribeOpportunities(cb) {
  if (!browser()) return () => {};
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener(EVENT, cb);
  };
}

export function getOpportunity(id) {
  const targetId = String(id ?? "").trim();
  return getOpportunities().find((x) => String(x.id) === targetId) || null;
}

function withOrganizationDetails(item) {
  if (!item) return null;
  const organization = getOrganization(item.organizationId ?? "1");
  return {
    ...item,
    organizationId: String(item.organizationId ?? "1"),
    organizationName: organization?.name || item.organization || "",
    organization: organization?.name || item.organization || "",
    organizationLocation: organization?.location || item.location || "",
    organizationDescription: organization?.description || organization?.about || "",
    organizationType: organization?.type || "",
  };
}

export function getStudentVisibleOpportunities() {
  return getOpportunities()
    .filter((item) => item.status === "published")
    .map(withOrganizationDetails);
}

export function getStudentVisibleOpportunity(id) {
  const item = getOpportunity(id);
  return item && item.status === "published" ? withOrganizationDetails(item) : null;
}

export function getProviderOpportunity(id) {
  const item = getOpportunity(id);
  return item || null;
}

export function getCurrentProviderOpportunities() {
  return getOpportunities();
}

export async function saveOpportunity(data, { publish = false } = {}) {
  const specId = data.specializationId || specNameToId(data.specialty);
  const status = publish ? "open" : (data.status === "published" ? "open" : "closed");

  const body = {
    title: data.title || "فرصة تدريب",
    specialization: specId,
    description: data.description || data.tasks || "تدريب عملي",
    tasks: data.tasks || data.description || "أداء مهام التدريب",
    requirements: Array.isArray(data.requirements) ? data.requirements.join("\n") : (data.requirements || "الالتزام بساعات الدوام"),
    seats: Number(data.capacity || data.seats || 3),
    start_date: data.startDate || "2026-03-01",
    end_date: data.endDate || "2026-05-30",
    location: data.location || "غزة",
    status,
  };

  let resultId = data.id;
  const isExisting = data.id && !String(data.id).startsWith("opp-");

  if (isExisting) {
    await api(`/opportunities/${data.id}/`, {
      method: "PATCH",
      body,
    });
  } else {
    const created = await api("/opportunities/", {
      method: "POST",
      body,
    });
    resultId = String(created.id);
  }

  await refreshOpportunities();
  return resultId;
}

export async function setOpportunityStatus(id, status) {
  const isExisting = id && !String(id).startsWith("opp-");
  if (isExisting) {
    const backendStatus = status === "published" ? "open" : "closed";
    await api(`/opportunities/${id}/`, {
      method: "PATCH",
      body: { status: backendStatus },
    }).catch(() => {});
  }
  await refreshOpportunities();
  return true;
}

export async function deleteOpportunityDraft(id) {
  const isExisting = id && !String(id).startsWith("opp-");
  if (isExisting) {
    await api(`/opportunities/${id}/`, {
      method: "DELETE",
    }).catch(() => {});
  }
  await refreshOpportunities();
  return true;
}

export function resetDemoOpportunities() {
  refreshOpportunities();
}

export function exportOpportunityCSV(items) {
  const rows = [
    ["الفرصة", "التخصص", "النمط", "المدة بالساعات", "المقاعد", "الطلبات", "آخر موعد", "الحالة"],
    ...items.map((o) => [
      o.title,
      o.specialty,
      o.mode,
      o.hours,
      o.capacity,
      o.applications,
      o.deadline,
      statusLabel[o.status] || o.status,
    ]),
  ];
  const escape = (v) =>
    `"${String(v ?? "")
      .replace(/^[\s]*[=+@\-]/, (m) => "'" + m)
      .replace(/"/g, '""')} "`.trimEnd();
  const csv = "\uFEFF" + rows.map((r) => r.map(escape).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "training-opportunities.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
