// Demo frontend consistency guard, NOT a security/authorization mechanism.
// Enforce this invariant transactionally in the backend before real deployment.
const CURRENT_STATES = new Set(['قيد التدريب']);
const ENROLLED_STATES = new Set(['active', 'not_started']);

/**
 * Find a conflicting ongoing training. `requests` must be the full list for
 * the relevant approval authority; never compare by student name.
 */
export function findTrainingConflict({ studentId, currentRequestId, student, requests = [], trainees = [] }) {
  const id = String(studentId ?? '').trim();
  const current = String(currentRequestId ?? '');
  if (!id) return null;

  const other = requests.find(row =>
    String(row.studentId ?? '') === id &&
    (!current || String(row.id ?? '') !== current) &&
    ['approved', 'accepted'].includes(row.status)
  );
  if (other) return {
    type: 'approved',
    requestId: other.id,
    opportunity: other.position || other.opportunity || other.opportunityTitle || 'غير محددة',
    organization: other.organizationName || other.organization || '',
  };

  const activeTrainee = trainees.find(row =>
    String(row.studentId ?? '') === id &&
    (!current || String(row.applicationId ?? '') !== current) &&
    ENROLLED_STATES.has(row.status)
  );
  if (activeTrainee) return {
    type: activeTrainee.status === 'active' ? 'in_progress' : 'not_started',
    opportunity: activeTrainee.opportunity || 'غير محددة',
    organization: activeTrainee.organizationName || '',
    requestId: activeTrainee.applicationId || '',
  };

  // Registry is an independent source used for imported/legacy trainees.
  // Completed training is NOT considered an active conflict.
  // The academic approval of the SAME application is not a second placement.
  // Keep the active-training restriction for every other application.
  const isCurrentAcademicApproval = Boolean(current) &&
    String(student?.activeRequestId ?? '') === current;
  if (student && (CURRENT_STATES.has(student.status) ||
      (student.status === 'لم يبدأ' && student.requestStatus === 'approved' && !isCurrentAcademicApproval))) {
    return {
      type: student.status === 'قيد التدريب' ? 'in_progress' : 'not_started',
      opportunity: student.opportunity || student.position || 'غير محددة',
      organization: student.organization || '',
    };
  }
  return null;
}

export function trainingConflictMessage(conflict, studentName = 'الطالب') {
  if (!conflict) return '';
  const name = studentName || 'الطالب';
  const state = conflict.type === 'approved' ? 'لديه طلب تدريب معتمد بالفعل'
    : conflict.type === 'in_progress' ? 'حالته الحالية «قيد التدريب»'
    : 'لديه تدريب معتمد ولم يبدأ بعد';
  const details = [
    conflict.opportunity && conflict.opportunity !== 'غير محددة' ? `الفرصة: «${conflict.opportunity}»` : '',
    conflict.organization ? `الجهة: «${conflict.organization}»` : '',
    conflict.requestId ? `رقم الطلب: ${conflict.requestId}` : '',
  ].filter(Boolean).join('، ');
  return `لا يمكن اعتماد طلب تدريب جديد؛ ${name} ${state}.${details ? ` ${details}.` : ''} يُسمح بتدريب فعّال واحد فقط للطالب، ويجب إنهاؤه أو إلغاؤه رسميًا قبل اعتماد تدريب آخر.`;
}
