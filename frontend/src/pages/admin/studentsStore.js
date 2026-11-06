// Shared browser-only student registry for the admin prototype.
// Replace with authenticated server endpoints before deployment.
export const STUDENTS_STORAGE_KEY = "cis-admin-students-v1";
export const LEGACY_DELETED_KEY = "cis-deleted-student-ids-v1";

export const INITIAL_STUDENTS = [
  {
    id: "20231234",
    name: "أمل أحمد صيام",
    major: "البرمجيات وقواعد البيانات",
    organization: "شركة القدس للاتصالات",
    status: "قيد التدريب",
    supervisor: "د. سامر يوسف",
    startDate: "2025/12/01",
  },
  {
    id: "20231045",
    name: "محمود إبراهيم رضوان",
    major: "تكنولوجيا علم البيانات",
    organization: "شركة المشرق الرقمية",
    status: "قيد التدريب",
    supervisor: "د. سامر يوسف",
    startDate: "2025/12/01",
  },
  {
    id: "20231188",
    name: "سارة عبد الرحمن",
    major: "الاتصالات وإنترنت الأشياء",
    organization: "شركة جوال",
    status: "بانتظار الاعتماد",
    supervisor: "د. سامر يوسف",
    startDate: "—",
  },
  {
    id: "20231302",
    name: "أنس كمال البيطار",
    major: "إلكترونيات صناعية وتحكم",
    organization: "شركة الأمل للأنظمة الصناعية",
    status: "منتهٍ",
    supervisor: "د. سامر يوسف",
    startDate: "2025/09/15",
  },
  {
    id: "20231450",
    name: "هدى يوسف شهر",
    major: "التصميم الجرافيكي والفنون الرقمية",
    organization: "استوديو بيكسل للتصميم",
    status: "لم يبدأ",
    supervisor: "د. سامر يوسف",
    startDate: "2026/01/10",
  },
  {
    id: "20231533",
    name: "بلال مصطفى الشيخ",
    major: "صيانة الحاسب الآلي",
    organization: "—",
    status: "مرفوض",
    supervisor: "د. سامر يوسف",
    startDate: "—",
  },
  {
    id: "20231601",
    name: "محمد خالد العطار",
    major: "البرمجيات وقواعد البيانات",
    organization: "شركة التقنية الحديثة",
    status: "قيد التدريب",
    supervisor: "د. سامر يوسف",
    startDate: "2026/01/15",
  },
  {
    id: "20231628",
    name: "نور أحمد خليل",
    major: "تكنولوجيا علم البيانات",
    organization: "شركة المشرق الرقمية",
    status: "لم يبدأ",
    supervisor: "د. سامر يوسف",
    startDate: "—",
  },
  {
    id: "20231712",
    name: "ياسمين محمود",
    major: "التصميم الجرافيكي والفنون الرقمية",
    organization: "استوديو بيكسل للتصميم",
    status: "منتهٍ",
    supervisor: "د. سامر يوسف",
    startDate: "2025/08/20",
  },
  {
    id: "20231744",
    name: "أحمد سامي ناصر",
    major: "إلكترونيات صناعية وتحكم",
    organization: "—",
    status: "بانتظار الاعتماد",
    supervisor: "د. سامر يوسف",
    startDate: "—",
  },
  {
    id: "20231805",
    name: "رنا محمد علي",
    major: "الاتصالات وإنترنت الأشياء",
    organization: "شركة جوال",
    status: "قيد التدريب",
    supervisor: "د. سامر يوسف",
    startDate: "2026/01/05",
  },
  {
    id: "20231840",
    name: "خالد عادل حسن",
    major: "صيانة الحاسب الآلي",
    organization: "شركة التقنية الحديثة",
    status: "مرفوض",
    supervisor: "د. سامر يوسف",
    startDate: "—",
  },
];

function readJSON(key, fallback) {
  try {
    if (typeof window === "undefined") return fallback;
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value === null ? fallback : value;
  } catch { return fallback; }
}

export function getStudents() {
  const legacyDeleted = readJSON(LEGACY_DELETED_KEY, []);
  const deletedIds = new Set(Array.isArray(legacyDeleted) ? legacyDeleted.map(String) : []);
  const updates = readJSON(STUDENTS_STORAGE_KEY, {});
  const records = updates && typeof updates === "object" && !Array.isArray(updates) ? updates : {};
  const defaults = INITIAL_STUDENTS.filter(student => !deletedIds.has(String(student.id)));
  const byId = new Map(defaults.map(student => [String(student.id), student]));
  Object.entries(records).forEach(([id, value]) => {
    if (value === null) { byId.delete(id); return; }
    if (!value || typeof value !== "object" || Array.isArray(value)) return;
    if (deletedIds.has(id)) return;
    const current = byId.get(id) || {};
    byId.set(id, { ...current, ...value, id });
  });
  return Array.from(byId.values());
}

export function getStudent(id) {
  if (id === null || id === undefined) return null;
  return getStudents().find(student => String(student.id) === String(id)) || null;
}

function persistChanges(changes) {
  if (typeof window === "undefined") throw new Error("التخزين غير متاح");
  window.localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(changes));
  window.dispatchEvent(new Event("admin-students-updated"));
}

export function saveStudent(student) {
  const id = String(student?.id ?? "").trim();
  if (!id) throw new Error("الرقم الجامعي مطلوب");
  const updates = readJSON(STUDENTS_STORAGE_KEY, {});
  const records = updates && typeof updates === "object" && !Array.isArray(updates) ? updates : {};
  persistChanges({ ...records, [id]: { ...getStudent(id), ...student, id } });
  return getStudent(id);
}

export function deleteStudent(id) {
  const key = String(id ?? "").trim();
  if (!key || !getStudent(key)) throw new Error("الطالب غير موجود");
  const updates = readJSON(STUDENTS_STORAGE_KEY, {});
  const records = updates && typeof updates === "object" && !Array.isArray(updates) ? updates : {};
  persistChanges({ ...records, [key]: null });
}
