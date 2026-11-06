import { ACADEMIC_PROGRAMS } from "../../constants/academicPrograms.js";
import { getActiveProviderOrganization, updateActiveProviderOrganization } from "../../services/providerOrganization.js";
// بيانات توضيحية لواجهة جهة التدريب فقط؛ ليست بيانات اعتماد رسمية.
export const PROFILE_KEY = 'cis-provider-profile-v1';
export const RENEWAL_KEY = 'cis-provider-renewals-v1';
export const PROFILE_EVENT = 'cis-provider-profile-updated';

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
  const organizationProfile = organization ? {
    organizationId: organization.id,
    name: organization.name,
    activity: organization.type || DEFAULT_PROFILE.activity,
    location: organization.location || DEFAULT_PROFILE.location,
    email: organization.email || DEFAULT_PROFILE.email,
    phone: organization.phone || DEFAULT_PROFILE.phone,
    capacity: Number(organization.capacity ?? organization.seats ?? DEFAULT_PROFILE.capacity),
    approvalStatus: organization.status || "pending",
    reviewNote: organization.reviewNote || "",
    established: organization.established || DEFAULT_PROFILE.established,
    bio: organization.bio || DEFAULT_PROFILE.bio,
    specialties: Array.isArray(organization.specializations) && organization.specializations.length
      ? organization.specializations : [...DEFAULT_PROFILE.specialties],
  } : {};
  if (!canStore()) return { ...DEFAULT_PROFILE, ...organizationProfile, specialties: [...(organizationProfile.specialties || DEFAULT_PROFILE.specialties)] };
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
    const localProfile = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    return {
      ...DEFAULT_PROFILE,
      ...localProfile,
      ...organizationProfile,
      specialties: Array.isArray(organizationProfile.specialties)
        ? organizationProfile.specialties
        : Array.isArray(localProfile.specialties)
          ? localProfile.specialties.filter(x => SPECIALTIES.includes(x))
          : [...SPECIALTIES],
      capacity: Number.isFinite(Number(organizationProfile.capacity ?? localProfile.capacity))
        && Number(organizationProfile.capacity ?? localProfile.capacity) > 0
        ? Number(organizationProfile.capacity ?? localProfile.capacity)
        : DEFAULT_PROFILE.capacity,
      currentTrainees: DEFAULT_PROFILE.currentTrainees,
    };
  } catch {
    return { ...DEFAULT_PROFILE, ...organizationProfile, specialties: [...(organizationProfile.specialties || SPECIALTIES)] };
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
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
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
    const result = JSON.parse(localStorage.getItem(RENEWAL_KEY) || '[]');
    return Array.isArray(result) ? result : [];
  } catch { return []; }
}
export function saveRenewalRequest({ documentName, notes }) {
  if (!canStore()) throw Error('storage-unavailable');
  const request = { id: `renewal-${Date.now()}`, documentName: documentName.trim(), notes: notes.trim(), status: 'local-draft', createdAt: new Date().toISOString() };
  localStorage.setItem(RENEWAL_KEY, JSON.stringify([request, ...getRenewalRequests()]));
  window.dispatchEvent(new Event(PROFILE_EVENT));
  return request;
}
