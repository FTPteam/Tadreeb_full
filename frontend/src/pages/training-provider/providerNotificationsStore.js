import { api, apiList } from "../../api/client.js";

const EVENT = "cis-provider-notifications-change";

let cachedNotifications = [];
let hasFetched = false;
let isFetching = false;

function toProviderNotification(n) {
  return {
    id: n.id,
    title: n.title,
    description: n.message,
    time: n.created_at ? new Date(n.created_at).toLocaleDateString("ar-EG", { hour: "2-digit", minute: "2-digit" }) : "",
    category: n.kind === "training" ? "تدريب" : "طلب",
    kind: n.kind || "request",
    read: Boolean(n.is_read),
    path: "/training-provider/requests",
  };
}

export async function refreshProviderNotifications() {
  if (isFetching) return cachedNotifications;
  isFetching = true;
  try {
    const list = await apiList("/notifications/");
    cachedNotifications = (list || []).map(toProviderNotification);
    hasFetched = true;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(EVENT));
    }
  } catch {
    // Keep cached
  } finally {
    isFetching = false;
  }
  return cachedNotifications;
}

if (typeof window !== "undefined") {
  refreshProviderNotifications();
}

export function getProviderNotifications() {
  if (!hasFetched && !isFetching) {
    refreshProviderNotifications();
  }
  return cachedNotifications;
}

export async function markProviderNotificationRead(id) {
  try {
    await api(`/notifications/${id}/read/`, { method: "POST" });
  } catch {}
  cachedNotifications = cachedNotifications.map((item) =>
    item.id === id ? { ...item, read: true } : item
  );
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT));
  }
}

export async function markAllProviderNotificationsRead() {
  try {
    await api("/notifications/read-all/", { method: "POST" });
  } catch {}
  cachedNotifications = cachedNotifications.map((item) => ({ ...item, read: true }));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT));
  }
}

export function subscribeProviderNotifications(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener(EVENT, callback);
  };
}

export function resetProviderNotifications() {
  refreshProviderNotifications();
}
