import PortalHeader from "../shared/PortalHeader";
export default function Header() {
  return <PortalHeader role="admin" name="د. سامر يوسف" subtitle="مشرف أكاديمي" initials="سم" toggleEvent="toggle-admin-sidebar" logoutPath="/admin/login" onUnavailable={(name) => window.dispatchEvent(new CustomEvent("portal-unavailable", { detail: name }))} />;
}
