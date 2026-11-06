import PortalHeader from "../shared/PortalHeader";
export default function Header() {
  return <PortalHeader role="student" name="أمل أحمد" subtitle="طالبة" initials="أح" toggleEvent="toggle-student-sidebar" logoutPath="/student/login" onUnavailable={(name) => window.dispatchEvent(new CustomEvent("portal-unavailable", { detail: name }))} />;
}
