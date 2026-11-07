import PortalHeader from "../shared/PortalHeader";
import { getCurrentUser } from "../../api/auth";

const ROLE_LABELS = { coordinator: "منسق التدريب", admin: "مدير النظام", supervisor: "مشرف أكاديمي" };

export default function Header() {
  const user = getCurrentUser();
  const name = user?.full_name || user?.username || "";
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("");
  return <PortalHeader role="admin" name={name} subtitle={ROLE_LABELS[user?.role] || ""} initials={initials || "إ"} toggleEvent="toggle-admin-sidebar" logoutPath="/admin/login" onUnavailable={(label) => window.dispatchEvent(new CustomEvent("portal-unavailable", { detail: label }))} />;
}
