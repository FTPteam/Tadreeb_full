/**
 * Unified academic specialization catalog for the Engineering & IT department.
 * Confirm final official names/codes with the university registrar before API integration.
 * These are engineering/IT specializations already represented in the prototype.
 */
export const ACADEMIC_DEPARTMENT = "قسم الهندسة وتكنولوجيا المعلومات";

export const ACADEMIC_PROGRAMS = Object.freeze([
  "البرمجيات وقواعد البيانات",
  "تكنولوجيا المعلومات",
  "تكنولوجيا علم البيانات",
  "الاتصالات وإنترنت الأشياء",
  "التصميم الجرافيكي والفنون الرقمية",
  "التصميم والمونتاج",
  "الدعم الفني",
  "إلكترونيات صناعية وتحكم",
  "صيانة الحاسب الآلي",
  "تكنولوجيا الهواتف النقالة",
  "الهيدروليك والنيوماتيك",
]);

// A future API can replace these labels with backend-owned program IDs.
export function isDepartmentProgram(value) {
  return ACADEMIC_PROGRAMS.includes(String(value || "").trim());
}
