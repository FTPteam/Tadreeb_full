// The one place that talks to the Tadreeb backend.
// Base address comes from VITE_API_URL (see frontend/.env.example).

const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");
const TOKENS_KEY = "tadreeb-auth-v1";

export class ApiError extends Error {
  constructor(status, data) {
    super(errorMessage(data, status));
    this.status = status;
    this.data = data;
  }
}

// The backend answers errors in Arabic, as {"detail": "..."}, ["..."] or {"field": ["..."]}.
function errorMessage(data, status) {
  if (typeof data === "string" && data.trim() && !data.trim().startsWith("<")) return data;
  if (Array.isArray(data)) return data.map(item => errorMessage(item, status)).join(" ");
  if (data && typeof data === "object") {
    if (data.detail) return errorMessage(data.detail, status);
    const first = Object.values(data)[0];
    if (first) return errorMessage(first, status);
  }
  if (status === 0) return "تعذّر الاتصال بالخادم. تأكد من اتصالك بالإنترنت.";
  if (status === 403) return "لا تملك صلاحية تنفيذ هذا الإجراء.";
  if (status === 404) return "العنصر غير موجود.";
  return "حدث خطأ غير متوقع. حاول مرة أخرى.";
}

export function getTokens() {
  try {
    return JSON.parse(localStorage.getItem(TOKENS_KEY) || "null");
  } catch {
    return null;
  }
}

export function setTokens(tokens) {
  try {
    if (tokens) localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
    else localStorage.removeItem(TOKENS_KEY);
  } catch {
    // Storage blocked: the user stays logged in until the page reloads.
  }
}

let refreshing = null;

// NFR-05: the refresh token rotates, so the new one must replace the old one.
async function refreshTokens() {
  const tokens = getTokens();
  if (!tokens?.refresh) return false;
  refreshing ??= fetch(`${API_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: tokens.refresh }),
  })
    .then(async response => {
      if (!response.ok) return false;
      const data = await response.json();
      setTokens({ access: data.access, refresh: data.refresh || tokens.refresh });
      return true;
    })
    .catch(() => false)
    .finally(() => { refreshing = null; });
  return refreshing;
}

function sessionExpired() {
  setTokens(null);
  window.dispatchEvent(new Event("tadreeb-session-expired"));
}

async function send(path, { method = "GET", body, form, auth = true } = {}) {
  const headers = {};
  const token = getTokens()?.access;
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form;
  else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const url = /^https?:/.test(path) ? path : `${API_URL}${path}`;
  return fetch(url, { method, headers, body: payload });
}

async function parse(response) {
  if (response.status === 204) return null;
  const type = response.headers.get("Content-Type") || "";
  return type.includes("json") ? response.json() : response.text();
}

/** api("/applications/", {method: "POST", body: {...}}) → the JSON answer, or throws ApiError. */
export async function api(path, options = {}) {
  // A visitor who never logged in has no session to expire: no redirect for them.
  const hadSession = Boolean(getTokens()?.access);
  let response;
  try {
    response = await send(path, options);
    if (response.status === 401 && options.auth !== false && (await refreshTokens())) {
      response = await send(path, options);
    }
  } catch {
    throw new ApiError(0, null);
  }
  if (response.status === 401 && options.auth !== false && hadSession) sessionExpired();
  const data = await parse(response);
  if (!response.ok) throw new ApiError(response.status, data);
  return data;
}

/** All pages of a paginated list ({count, next, results}) as one array. */
export async function apiList(path) {
  const rows = [];
  let next = path;
  while (next) {
    const data = await api(next);
    if (Array.isArray(data)) return data;
    rows.push(...(data.results || []));
    next = data.next;
  }
  return rows;
}

/** Download a file the backend generates (PDF, Excel) with the login token. */
export async function apiDownload(path, filename) {
  let response = await send(path);
  if (response.status === 401 && (await refreshTokens())) response = await send(path);
  if (!response.ok) throw new ApiError(response.status, await parse(response));
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
