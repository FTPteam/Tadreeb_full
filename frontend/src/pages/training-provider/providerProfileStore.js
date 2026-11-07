import { ACADEMIC_PROGRAMS } from "../../constants/academicPrograms.js";
import { getActiveProviderOrganization, updateActiveProviderOrganization } from "../../services/providerOrganization.js";
// بيانات توضيحية لواجهة جهة التدريب فقط؛ ليست بيانات اعتماد رسمية.
export const PROFILE_KEY = 'cis-provider-profile-v1';
export const RENEWAL_KEY = 'cis-provider-renewals-v1';
export const PROFILE_EVENT = 'cis-provider-profile-updated';
// Keep each organization's draft profile and renewal requests isolated in the demo browser.
// The backend will replace these keys with authenticated organization-scoped APIs.
const profileKey = (id) => `${PROFILE_KEY}:${String(id)}`;
const renewalKey = (id) => `${RENEWAL_KEY}:${String(id)}`;
const activeId = () => String(getActiveProviderOrganization()?.id || '1');
const providerDefaults = (organization) => String(organization?.id ?? '1') === '1'
  ? DEFAULT_PROFILE
  : { ...DEFAULT_PROFILE, name: '', activity: '', location: '', established: '', email: '', phone: '', capacity: 0, currentTrainees: 0, bio: '', specialties: [] };
function readLegacyForDefaultOrganization(key) {
  return activeId() === '1' ? localStorage.getItem(key) : null;
}

export const SPECIALTIES = ACADEMIC_PROGRAMS;

export const DEFAULT_PROFILE = {
  name: 'شركة القدس للاتصالات',
  activity: 'تقنية معلومات واتصالات',
  location: 'غزة - الرمال',
  established: '2008',
  email: 'info@alquds-tel.ps',
  phone: '08 282 0000',
  capacity: 20,
  currentTrainees: 14,
  bio: 'شركة رائدة في حلول الاتصالات وتطوير البرمجيات، وتستقبل طلاب كلية الهندسة وتكنولوجيا المعلومات سنويًا.',
  specialties: [...SPECIALTIES],
  // The logo is only held as a temporary object URL for preview, never in storage.
  logoName: '',
};

export const DEFAULT_DOCUMENTS = [
  { id: 'trade', name: 'السجل التجاري', expiration: '2026/08/31', note: 'ساري حتى', downloadUrl: null },
  { id: 'license', name: 'ترخيص مزاولة المهنة', expiration: '2026/03/31', note: 'ساري حتى', downloadUrl: null },
  { id: 'contract', name: 'اتفاقية التدريب مع الكلية', expiration: '2025/09/01', note: 'موقعة', downloadUrl: null },
];

export const DEFAULT_STAGES = [
  { name: 'تقديم طلب الاعتماد', date: '2025/08/01' },
  { name: 'مراجعة المستندات', date: '2025/08/10' },
  { name: 'زيارة ميدانية', date: '2025/08/20' },
  { name: 'اعتماد الجهة', date: '2025/09/01' },
];

function canStore() { return typeof window !== 'undefined' && !!window.localStorage; }
export function getProviderProfile() {
  const organization = getActiveProviderOrganization();
  const defaults = providerDefaults(organization);
  const organizationProfile = organization ? {
    organizationId: organization.id,
    name: organization.name,
    activity: organization.type || defaults.activity,
    location: organization.location || defaults.location,
    email: organization.email || defaults.email,
    phone: organization.phone || defaults.phone,
    capacity: Number(organization.capacity ?? organization.seats ?? defaults.capacity),
    approvalStatus: organization.status || "pending",
    reviewNote: organization.reviewNote || "",
    established: organization.established || defaults.established,
    bio: organization.bio || defaults.bio,
    specialties: Array.isArray(organization.specializations) && organization.specializations.length
      ? organization.specializations : [...defaults.specialties],
  } : {};
  if (!canStore()) return { ...defaults, ...organizationProfile, specialties: [...(organizationProfile.specialties || defaults.specialties)] };
  try {
    const saved = JSON.parse(localStorage.getItem(profileKey(activeId())) || readLegacyForDefaultOrganization(PROFILE_KEY) || "null");
    const localProfile = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    return {
      ...defaults,
      ...localProfile,
      ...organizationProfile,
      specialties: Array.isArray(organizationProfile.specialties)
        ? organizationProfile.specialties
        : Array.isArray(localProfile.specialties)
          ? localProfile.specialties.filter(x => SPECIALTIES.includes(x))
          : [...defaults.specialties],
      capacity: Number.isFinite(Number(organizationProfile.capacity ?? localProfile.capacity))
        && Number(organizationProfile.capacity ?? localProfile.capacity) > 0
        ? Number(organizationProfile.capacity ?? localProfile.capacity)
        : defaults.capacity,
      currentTrainees: Number(organization?.currentTrainees ?? 0),
    };
  } catch {
    return { ...defaults, ...organizationProfile, specialties: [...(organizationProfile.specialties || defaults.specialties)] };
  }
}
export function saveProviderProfile(patch) {
  const next = { ...getProviderProfile(), ...patch };
  if (!canStore()) throw Error("storage-unavailable");
  updateActiveProviderOrganization({
    name: next.name,
    type: next.activity,
    location: next.location,
    email: next.email,
    phone: next.phone,
    capacity: Number(next.capacity),
    seats: Number(next.capacity),
    supervisor: next.supervisor || "",
    bio: next.bio,
    specializations: next.specialties,
  });
  localStorage.setItem(profileKey(activeId()), JSON.stringify(next));
  window.dispatchEvent(new Event(PROFILE_EVENT));
  return next;
}
export function resubmitProviderAccreditation() {
  const current = getActiveProviderOrganization();
  if (!current || current.status !== "rejected") return false;
  updateActiveProviderOrganization({}, { resubmit: true });
  window.dispatchEvent(new Event(PROFILE_EVENT));
  return true;
}
export function getRenewalRequests() {
  if (!canStore()) return [];
  try {
    const result = JSON.parse(localStorage.getItem(renewalKey(activeId())) || readLegacyForDefaultOrganization(RENEWAL_KEY) || '[]');
    return Array.isArray(result) ? result : [];
  } catch { return []; }
}
export function saveRenewalRequest({ documentName, notes }) {
  if (!canStore()) throw Error('storage-unavailable');
  const request = { id: `renewal-${Date.now()}`, organizationId: activeId(), documentName: documentName.trim(), notes: notes.trim(), status: 'local-draft', createdAt: new Date().toISOString() };
  localStorage.setItem(renewalKey(activeId()), JSON.stringify([request, ...getRenewalRequests()]));
  window.dispatchEvent(new Event(PROFILE_EVENT));
  return request;
}
