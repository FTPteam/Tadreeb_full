import PortalHeader from "../shared/PortalHeader";
import { getProviderProfile } from "../../pages/training-provider/providerProfileStore";

export default function Header({ onMenu, onLogout, onUnavailable }) {
  const profile = getProviderProfile();
  const organizationName = profile.name || "جهة التدريب";
  return (
    <PortalHeader
      role="provider"
      name={organizationName}
      subtitle="حساب جهة التدريب"
      initials={organizationName.slice(0, 2)}
      toggleEvent="toggle-training-provider-sidebar"
      logoutPath="/training-provider/login"
      onMenu={onMenu}
      onLogout={onLogout}
      onUnavailable={onUnavailable}
    />
  );
}
