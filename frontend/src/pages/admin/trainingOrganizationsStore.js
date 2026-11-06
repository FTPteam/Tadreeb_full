// Shared demo-only organization registry for admin screens.
// Server-side authorization and approval checks are required in production.
export const ORGANIZATIONS_STORAGE_KEY = "cis-training-organizations-v1";
export const ORGANIZATIONS_EVENT = "admin-organizations-updated";
const INITIAL_ORGANIZATIONS = [
  { id: 1, name: "شركة القدس للاتصالات", type: "تقنية معلومات", location: "غزة - الرمال", students: 42, status: "approved", phone: "0599 000 111", email: "info@alquds-tel.ps", supervisor: "خالد عودة", source: "seed" },
  { id: 2, name: "شركة الأمل للأنظمة الصناعية", type: "صناعي", location: "غزة - المنطقة الصناعية", students: 14, status: "approved", phone: "08 282 3000" },
  { id: 3, name: "مركز الصيانة الفنية المتقدم", type: "صيانة", location: "خان يونس", students: 25, status: "renewal", phone: "08 205 4400", requestDate: "2025/12/02" },
  { id: 4, name: "استوديو بيكسل للتصميم", type: "تصميم", location: "غزة - الرمال", students: 8, status: "pending", phone: "08 288 9122", requestDate: "2025/11/28" },
  { id: 5, name: "شركة المشرق الرقمية", type: "تقنية معلومات", location: "غزة - النصر", students: 21, status: "approved", phone: "0598 440 220" },
  { id: 6, name: "شركة الشرق للصناعات", type: "صناعي", location: "دير البلح", students: 11, status: "renewal", phone: "08 255 1190" },
  { id: 7, name: "مركز المستقبل للصيانة", type: "صيانة", location: "غزة", students: 18, status: "approved", phone: "0597 881 120" },
  { id: 8, name: "استوديو رؤية", type: "تصميم", location: "رفح", students: 6, status: "approved", phone: "0599 761 550" },
  { id: 9, name: "شركة الهيدروليك الحديثة", type: "صناعي", location: "غزة", students: 0, status: "pending", phone: "—", requestDate: "2025/11/20" },
  { id: 10, name: "شركة التقنية الحديثة", type: "تقنية معلومات", location: "غزة", students: 0, status: "pending", phone: "—", requestDate: "2025/11/17" },
  { id: 11, name: "مركز الأمل للتدريب", type: "صيانة", location: "خان يونس", students: 0, status: "pending", phone: "—", requestDate: "2025/11/12" },
  { id: 12, name: "مؤسسة المستقبل", type: "تصميم", location: "غزة", students: 0, status: "pending", phone: "—", requestDate: "2025/11/08" },
];

function overrides() {
  try {
    const data = JSON.parse(localStorage.getItem(ORGANIZATIONS_STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data.filter(item => item && item.id != null) : [];
  } catch { return []; }
}
export function getOrganizations({includeDeleted = false} = {}) {
  const saved = overrides();
  const byId = new Map(INITIAL_ORGANIZATIONS.map(item => [String(item.id), {...item}]));
  for (const item of saved) {
    const id = String(item.id);
    byId.set(id, {...(byId.get(id) || {}), ...item, id: byId.get(id)?.id ?? item.id});
  }
  const records = [...byId.values()];
  return includeDeleted ? records : records.filter(item => !item.deletedAt);
}
export function getOrganization(id) {
  if (id == null) return null;
  return getOrganizations().find(item => String(item.id) === String(id)) || null;
}
export function saveOrganization(org) {
  if (!org || org.id == null || !String(org.name || "").trim()) throw new Error("بيانات جهة التدريب غير صالحة");
  const current = getOrganizations({includeDeleted:true}).find(item => String(item.id) === String(org.id));
  const merged = {...(current || {}), ...org, id: current?.id ?? org.id};
  const records = overrides();
  const index = records.findIndex(item => String(item.id) === String(org.id));
  if (index === -1) records.push(merged); else records[index] = merged;
  localStorage.setItem(ORGANIZATIONS_STORAGE_KEY, JSON.stringify(records));
  window.dispatchEvent(new Event(ORGANIZATIONS_EVENT));
  return merged;
}
export function createOrganization(data) {
  const name = String(data.name || "").trim();
  if (!name) throw new Error("اسم الجهة مطلوب");
  if (getOrganizations({includeDeleted:true}).some(item => item.name.trim() === name)) throw new Error("جهة التدريب موجودة بالفعل");
  const email = String(data.email || "").trim().toLowerCase();
  if (email && getOrganizations({includeDeleted:true}).some(item => String(item.email || "").trim().toLowerCase() === email)) {
    throw new Error("البريد الإلكتروني مرتبط بجهة تدريب أخرى");
  }
  const id = `ORG-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  return saveOrganization({...data, email, id, name, status:"pending", approvalStatus:"بانتظار الاعتماد", requestDate:new Date().toISOString().slice(0,10).replaceAll("-","/"), students:0, deletedAt:null});
}
export function deleteOrganization(id) {
  const item = getOrganization(id);
  if (!item) throw new Error("جهة التدريب غير موجودة");
  return saveOrganization({...item, deletedAt:new Date().toISOString()});
}
export function restoreOrganization(id) {
  const item = getOrganizations({includeDeleted:true}).find(x=>String(x.id)===String(id));
  if (!item) throw new Error("جهة التدريب غير موجودة");
  return saveOrganization({...item, deletedAt:null});
}
export function findOrganizationByName(name) {
  const normalized = String(name || "").trim();
  return getOrganizations().find(item => item.name.trim() === normalized) || null;
}
export function findOrganizationByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) return null;
  return getOrganizations().find(item => String(item.email || "").trim().toLowerCase() === normalized) || null;
}
export function canAcceptOrganization(name, organizationId) {
  const organization = organizationId != null ? getOrganization(organizationId) : findOrganizationByName(name);
  return organization?.status === "approved";
}
