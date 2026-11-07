import { api, getTokens, setTokens } from "./client";

const USER_KEY = "tadreeb-user-v1";

// Where each role lands after logging in.
export const HOME_BY_ROLE = {
  student: "/student/dashboard",
  coordinator: "/admin/dashboard",
  admin: "/admin/dashboard",
  supervisor: "/admin/dashboard",
  provider: "/training-provider/dashboard",
};

export function getCurrentUser() {
  if (!getTokens()?.access) return null;
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

/** FR-01: log in with the university ID / username or the email. Returns {id, username, full_name, role}. */
export async function login(username, password) {
  const tokens = await api("/auth/login/", {
    method: "POST",
    body: { username: String(username).trim(), password },
    auth: false,
  });
  setTokens(tokens);
  const user = await api("/auth/me/");
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Storage blocked: fine for this tab.
  }
  return user;
}

export function logout() {
  setTokens(null);
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    // Nothing to clear.
  }
}

/** FR-02: send the reset link. The answer is the same whether or not the email exists. */
export function requestPasswordReset(email) {
  return api("/auth/password-reset/", { method: "POST", body: { email }, auth: false });
}

export function confirmPasswordReset(uid, token, newPassword) {
  return api("/auth/password-reset/confirm/", {
    method: "POST",
    body: { uid, token, new_password: newPassword },
    auth: false,
  });
}
