// Real Django-backed student registry for admin screens (FR-03, FR-05, FR-06).
import { fetchStudents, updateStudent, deleteStudent as apiDeleteStudent } from "../../api/studentsApi";

export const STUDENTS_STORAGE_KEY = "cis-admin-students-v1";
export const LEGACY_DELETED_KEY = "cis-deleted-student-ids-v1";

let cachedStudents = [];
let hasFetched = false;
let isFetching = false;

export function refreshStudents() {
  if (isFetching) return;
  isFetching = true;
  fetchStudents()
    .then((list) => {
      cachedStudents = list;
      hasFetched = true;
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("admin-students-updated"));
      }
    })
    .catch(() => {})
    .finally(() => {
      isFetching = false;
    });
}

if (typeof window !== "undefined") {
  refreshStudents();
}

export function getStudents() {
  if (!hasFetched && !isFetching) {
    refreshStudents();
  }
  return cachedStudents;
}

export function getStudent(id) {
  if (id === null || id === undefined) return null;
  return (
    getStudents().find(
      (s) =>
        String(s.id) === String(id) ||
        String(s.universityId) === String(id) ||
        String(s.profileId) === String(id) ||
        String(s.userId) === String(id)
    ) || null
  );
}

export function saveStudent(student) {
  const id = String(student?.id ?? "").trim();
  if (!id) throw new Error("الرقم الجامعي مطلوب");
  const existing = getStudent(id);
  const updated = { ...(existing || {}), ...student, id };
  const idx = cachedStudents.findIndex((s) => String(s.id) === id);
  if (idx !== -1) cachedStudents[idx] = updated;
  else cachedStudents.push(updated);

  if (existing?.profileId) {
    updateStudent(existing.profileId, existing.userId, student).catch(() => {});
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("admin-students-updated"));
  }
  return updated;
}

export function deleteStudent(id) {
  const existing = getStudent(id);
  cachedStudents = cachedStudents.filter((s) => String(s.id) !== String(id));
  if (existing?.userId || existing?.profileId) {
    apiDeleteStudent(existing.userId, existing.profileId).catch(() => {});
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("admin-students-updated"));
  }
}
