import {
  createOrganization,
  findOrganizationByEmail,
  getOrganization,
  getOrganizations,
  saveOrganization,
} from "../pages/admin/trainingOrganizationsStore.js";

export const ACTIVE_PROVIDER_ORGANIZATION_KEY = "cis-active-provider-organization-v1";
export const PROVIDER_ORGANIZATION_EVENT = "cis-provider-organization-updated";

const browser = () => typeof window !== "undefined";

export function setActiveProviderOrganization(id) {
  if (!browser()) return;
  sessionStorage.setItem(ACTIVE_PROVIDER_ORGANIZATION_KEY, String(id));
  window.dispatchEvent(new Event(PROVIDER_ORGANIZATION_EVENT));
}

export function clearActiveProviderOrganization() {
  if (!browser()) return;
  sessionStorage.removeItem(ACTIVE_PROVIDER_ORGANIZATION_KEY);
  window.dispatchEvent(new Event(PROVIDER_ORGANIZATION_EVENT));
}

export function getActiveProviderOrganizationId() {
  if (!browser()) return "1";
  const stored = sessionStorage.getItem(ACTIVE_PROVIDER_ORGANIZATION_KEY);
  if (stored && getOrganization(stored)) return String(stored);
  const legacy = getOrganizations().find(
    item => item.name === "شركة القدس للاتصالات"
  );
  return String(legacy?.id ?? "1");
}

export function getActiveProviderOrganization() {
  return getOrganization(getActiveProviderOrganizationId());
}

export function registerProviderOrganization(data) {
  const organization = createOrganization({
    ...data,
    email: String(data.email || "").trim().toLowerCase(),
    status: "pending",
    source: "self-registration",
    approvalStatus: "بانتظار الاعتماد",
  });
  setActiveProviderOrganization(organization.id);
  return organization;
}

export function findProviderOrganizationByEmail(email) {
  return findOrganizationByEmail(email);
}

export function updateActiveProviderOrganization(patch, { resubmit = false } = {}) {
  const current = getActiveProviderOrganization();
  if (!current) throw new Error("لم يتم تحديد جهة التدريب الحالية.");
  const normalizedEmail = patch.email ? String(patch.email).trim().toLowerCase() : current.email;
  const duplicate = normalizedEmail && getOrganizations().some(
    item => String(item.id) !== String(current.id) &&
      String(item.email || "").trim().toLowerCase() === normalizedEmail
  );
  if (duplicate) throw new Error("البريد الإلكتروني مرتبط بجهة تدريب أخرى.");
  const nextStatus = resubmit && current.status === "rejected" ? "pending" : current.status;
  const updated = saveOrganization({
    ...current,
    ...patch,
    id: current.id,
    email: patch.email ? String(patch.email).trim().toLowerCase() : current.email,
    status: nextStatus,
    ...(resubmit ? {
      approvalStatus: "بانتظار الاعتماد",
      reviewNote: "",
      requestDate: new Date().toISOString().slice(0, 10).replaceAll("-", "/"),
      resubmittedAt: new Date().toISOString(),
    } : {}),
  });
  window.dispatchEvent(new Event(PROVIDER_ORGANIZATION_EVENT));
  return updated;
}

export function isActiveProviderApproved() {
  return getActiveProviderOrganization()?.status === "approved";
}
