// Browser-only eligibility check for the student demo. Backend must recheck atomically.
import { getStudent } from '../pages/admin/studentsStore';
import { getRequests } from '../pages/admin/trainingRequestsStore';
import { getAllTrainees } from '../pages/training-provider/traineesStore';
import { findTrainingConflict } from './activeTrainingGuard';

const SESSION_KEY = 'tadreeb-active-student-id-v1';
const DEMO_STUDENT_ID = '20231234';

export function getActiveStudentId() {
  if (typeof window === 'undefined') return DEMO_STUDENT_ID;
  return String(sessionStorage.getItem(SESSION_KEY) || DEMO_STUDENT_ID).trim();
}

export function setActiveStudentId(id) {
  if (typeof window !== 'undefined') sessionStorage.setItem(SESSION_KEY, String(id || '').trim());
}

export function clearActiveStudentId() {
  if (typeof window !== 'undefined') sessionStorage.removeItem(SESSION_KEY);
}

export function getStudentApplicationEligibility(studentId = getActiveStudentId()) {
  const id = String(studentId || '').trim();
  if (!id) return { canApply: false, reason: 'الرقم الجامعي غير متوفر. سجّل دخولك أولًا.' };
  const conflict = findTrainingConflict({
    studentId: id,
    student: getStudent(id),
    requests: getRequests(),
    trainees: getAllTrainees(),
  });
  if (!conflict) return { canApply: true, reason: '', conflict: null };
  const current = conflict.type === 'approved' ? 'تدريب معتمد' : conflict.type === 'in_progress' ? 'تدريب قيد التنفيذ' : 'تدريب معتمد لم يبدأ بعد';
  const details = [
    conflict.opportunity && conflict.opportunity !== 'غير محددة' ? `الفرصة: ${conflict.opportunity}` : '',
    conflict.organization ? `الجهة: ${conflict.organization}` : '',
  ].filter(Boolean).join('، ');
  return {
    canApply: false,
    conflict,
    reason: `لديك ${current} حاليًا، ولذلك لا يمكنك التقديم على فرصة تدريب جديدة حتى إنهائه أو إلغائه رسميًا.${details ? ` (${details})` : ''}`,
  };
}
