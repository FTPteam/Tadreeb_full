// Real Django-backed training requests store for admin approvals (FR-13, FR-14, FR-18).
import { fetchRequests, fetchRequest, decideRequest as apiDecideRequest } from "../../api/admin";

export const REQUESTS_STORAGE_KEY = "cis-field-training-requests-v1";

let cachedRequests = [];
let hasFetched = false;
let isFetching = false;

export function refreshRequests() {
  if (isFetching) return;
  isFetching = true;
  fetchRequests()
    .then((data) => {
      cachedRequests = data;
      hasFetched = true;
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("admin-training-requests-updated"));
      }
    })
    .catch(() => {})
    .finally(() => {
      isFetching = false;
    });
}

export const refreshTrainingRequests = refreshRequests;

if (typeof window !== "undefined") {
  refreshRequests();
}

export function getRequests() {
  if (!hasFetched && !isFetching) {
    refreshRequests();
  }
  return cachedRequests;
}

export function getRequest(id) {
  if (id == null) return null;
  return cachedRequests.find((r) => String(r.id) === String(id) || String(r.applicationId) === String(id)) || null;
}

export async function decideRequest(request, status) {
  const result = await apiDecideRequest(request, status);
  refreshRequests();
  return result;
}

export function saveRequest(request) {
  const id = String(request?.id ?? "").trim();
  const existing = getRequest(id);
  const updated = { ...(existing || {}), ...request, id };
  const idx = cachedRequests.findIndex((r) => String(r.id) === id);
  if (idx !== -1) cachedRequests[idx] = updated;
  else cachedRequests.push(updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("admin-training-requests-updated"));
  }
  return updated;
}
