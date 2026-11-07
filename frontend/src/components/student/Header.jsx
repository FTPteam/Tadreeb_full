import PortalHeader from "../shared/PortalHeader";
import { useNavigate } from "react-router-dom";
import { getStudent } from "../../pages/admin/studentsStore";
import { clearActiveStudentId, getActiveStudentId } from "../../services/studentTrainingEligibility";

export default function Header() {
  const navigate = useNavigate();
  const studentId = getActiveStudentId();
  const student = getStudent(studentId);
  const displayName = student?.name || `طالب ${studentId}`;
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
