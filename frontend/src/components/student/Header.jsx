import PortalHeader from "../shared/PortalHeader";
import { useNavigate } from "react-router-dom";
import { clearActiveStudentId } from "../../services/studentTrainingEligibility";
import { getCurrentUser } from "../../api/auth";

export default function Header() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const displayName = user?.full_name || (user ? `طالب ${user.username}` : "طالب");
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("");
  return <PortalHeader
    role="student"
    name={displayName}
    subtitle="طالب"
    initials={initials || "ط"}
    toggleEvent="toggle-student-sidebar"
    logoutPath="/student/login"
    onLogout={() => { clearActiveStudentId(); navigate("/student/login"); }}
    onUnavailable={(name) => window.dispatchEvent(new CustomEvent("portal-unavailable", { detail: name }))}
  />;
}
