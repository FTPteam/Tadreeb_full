import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, HOME_BY_ROLE, logout } from "../../api/auth";

// Pages anyone can open without logging in.
const PUBLIC_PATHS = [
  /^\/$/,
  /^\/(student\/)?login$/,
  /^\/(forgot|reset)-password/,
  /^\/admin\/(login|forgot-password|reset-password)/,
  /^\/training-provider\/(login|register|forgot-password|reset-password)/,
];

// Each portal, the roles allowed in it, and its login page.
const PORTALS = [
  { prefix: "/student", roles: ["student"], login: "/student/login" },
  { prefix: "/admin", roles: ["coordinator", "admin", "supervisor"], login: "/admin/login" },
  { prefix: "/training-provider", roles: ["provider"], login: "/training-provider/login" },
];

/** Keeps each portal for its own roles. The backend still checks every request (NFR-18). */
export default function AuthGate({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const portal = PORTALS.find(item => pathname.startsWith(item.prefix));

  useEffect(() => {
    const onExpired = () => {
      logout();
      navigate(portal?.login || "/student/login", { replace: true });
    };
    window.addEventListener("tadreeb-session-expired", onExpired);
    return () => window.removeEventListener("tadreeb-session-expired", onExpired);
  }, [navigate, portal]);

  if (PUBLIC_PATHS.some(pattern => pattern.test(pathname)) || !portal) return children;

  const user = getCurrentUser();
  if (!user) return <Navigate to={portal.login} replace />;
  if (!portal.roles.includes(user.role)) return <Navigate to={HOME_BY_ROLE[user.role] || portal.login} replace />;
  return children;
}
