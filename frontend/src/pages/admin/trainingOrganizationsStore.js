// Real Django-backed organization registry for admin screens (FR-07, FR-08).
import { api, apiList } from "../../api/client";

export const ORGANIZATIONS_STORAGE_KEY = "cis-training-organizations-v1";
export const ORGANIZATIONS_EVENT = "admin-organizations-updated";

let cachedProviders = [];
let hasFetched = false;
let isFetching = false;

function mapProvider(p) {
  return {
    id: p.id,
    name: p.name,
    type: p.sector || "تقنية معلومات",
    sector: p.sector || "تقنية معلومات",
    location: `${p.city || "غزة"}${p.address ? " - " + p.address : ""}`,
    city: p.city || "غزة",
    address: p.address || "",
    students: p.capacity || 10,
    capacity: p.capacity || 10,
    status: p.status === "approved" ? "approved" : "pending",
    approvalStatus: p.status === "approved" ? "معتمدة" : "موقوفة",
    phone: p.contact_phone || "—",
    email: p.contact_email || "—",
    supervisor: p.contact_name || "—",
    contact_name: p.contact_name || "",
    contact_phone: p.contact_phone || "",
    contact_email: p.contact_email || "",
    requestDate: (p.created_at || "").slice(0, 10).replaceAll("-", "/"),
    source: "django",
  };
}

export function refreshOrganizations() {
  if (isFetching) return;
  isFetching = true;
  apiList("/providers/")
    .then((data) => {
      cachedProviders = data.map(mapProvider);
      hasFetched = true;
      window.dispatchEvent(new Event(ORGANIZATIONS_EVENT));
    })
    .catch(() => {})
    .finally(() => {
      isFetching = false;
    });
}

// Trigger initial fetch immediately
if (typeof window !== "undefined") {
  refreshOrganizations();
}

export function getOrganizations({ includeDeleted = false } = {}) {
  if (!hasFetched && !isFetching) {
    refreshOrganizations();
  }
  return cachedProviders;
}

export function getOrganization(id) {
  if (id == null) return null;
  return cachedProviders.find((item) => String(item.id) === String(id)) || null;
}

export async function createOrganization(data) {
  const name = String(data.name || "").trim();
  if (!name) throw new Error("اسم الجهة مطلوب");

  const body = {
    name,
    sector: data.type || data.sector || "تقنية معلومات",
    city: data.city || "غزة",
    address: data.address || data.location || "",
    contact_name: data.contact_name || data.supervisor || "المسؤول",
    contact_phone: data.phone || data.contact_phone || "0599000000",
    contact_email: data.email || data.contact_email || "",
    capacity: Number(data.capacity || data.students || 10),
    status: data.status === "approved" ? "approved" : "approved",
  };

  const created = await api("/providers/", {
    method: "POST",
    body,
  });

  const mapped = mapProvider(created);
  cachedProviders = [mapped, ...cachedProviders];
  window.dispatchEvent(new Event(ORGANIZATIONS_EVENT));
  return mapped;
}

export async function saveOrganization(org) {
  if (!org || org.id == null || !String(org.name || "").trim()) {
    throw new Error("بيانات جهة التدريب غير صالحة");
  }

  const body = {};
  if (org.name) body.name = org.name;
  if (org.sector || org.type) body.sector = org.sector || org.type;
  if (org.city) body.city = org.city;
  if (org.address || org.location) body.address = org.address || org.location;
  if (org.contact_name || org.supervisor) body.contact_name = org.contact_name || org.supervisor;
  if (org.phone || org.contact_phone) body.contact_phone = org.phone || org.contact_phone;
  if (org.email || org.contact_email) body.contact_email = org.email || org.contact_email;
  if (org.capacity || org.students) body.capacity = Number(org.capacity || org.students);
  if (org.status) body.status = org.status === "approved" ? "approved" : "suspended";

  let updated = null;
  try {
    updated = await api(`/providers/${org.id}/`, {
      method: "PATCH",
      body,
    });
  } catch (error) {
    // If not on server or ID mismatch, update local cache
    updated = { ...org, ...body };
  }

  const mapped = mapProvider(updated);
  cachedProviders = cachedProviders.map((item) =>
    String(item.id) === String(org.id) ? mapped : item
  );
  window.dispatchEvent(new Event(ORGANIZATIONS_EVENT));
  return mapped;
}

export async function deleteOrganization(id) {
  try {
    await api(`/providers/${id}/`, { method: "DELETE" });
  } catch {}
  cachedProviders = cachedProviders.filter((item) => String(item.id) !== String(id));
  window.dispatchEvent(new Event(ORGANIZATIONS_EVENT));
  return true;
}

export function restoreOrganization(id) {
  return true;
}

export function findOrganizationByName(name) {
  const normalized = String(name || "").trim();
  return cachedProviders.find((item) => item.name.trim() === normalized) || null;
}

export function findOrganizationByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) return null;
  return (
    cachedProviders.find(
      (item) => String(item.email || "").trim().toLowerCase() === normalized
    ) || null
  );
}

export function canAcceptOrganization(name, organizationId) {
  const organization =
    organizationId != null
      ? getOrganization(organizationId)
      : findOrganizationByName(name);
  return organization?.status === "approved";
}
