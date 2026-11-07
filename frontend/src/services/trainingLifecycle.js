/**
 * Tadreeb domain rules (pure functions, browser-independent).
 * This file describes the FRONTEND read model only. Real transitions and
 * authorization must be validated atomically by the Backend.
 *
 * The provider currently uses accepted/rejected; the academic portal uses
 * approved/rejected. We preserve both legacy vocabularies at their edges.
 */
export const PROVIDER_DECISIONS = Object.freeze({ pending: 'pending', accepted: 'accepted', rejected: 'rejected' });
export const ACADEMIC_DECISIONS = Object.freeze({ pending: 'pending', approved: 'approved', rejected: 'rejected' });
export const APPLICATION_STATUSES = Object.freeze({ pending: 'pending', accepted: 'accepted', rejected: 'rejected' });
export const PLACEMENT_STATUSES = Object.freeze({ notStarted: 'not_started', active: 'active', completed: 'completed', cancelled: 'cancelled' });

export function normalizeProviderDecision(value) {
  return value === 'accepted' || value === 'rejected' ? value : 'pending';
}
export function normalizeAcademicDecision(value) {
  return value === 'approved' || value === 'rejected' ? value : 'pending';
}
export function deriveApplicationProgress(providerDecision, academicDecision) {
  const provider = normalizeProviderDecision(providerDecision);
  const academic = normalizeAcademicDecision(academicDecision);
  const status = provider === 'rejected' || academic === 'rejected'
    ? 'rejected'
    : provider === 'accepted' && academic === 'approved'
      ? 'accepted' : 'pending';
  return {
    providerDecision: provider,
    academicDecision: academic,
    status,
    awaitingProvider: status === 'pending' && provider === 'pending',
    awaitingAcademic: status === 'pending' && academic === 'pending',
    canCreatePlacement: status === 'accepted',
  };
}

/** A student may have only one active placement across different applications. */
export function findOtherActivePlacement(placements, studentId, applicationId) {
  const student = String(studentId ?? '').trim();
  const current = String(applicationId ?? '').trim();
  if (!student) return null;
  return (Array.isArray(placements) ? placements : []).find(p =>
    String(p.studentId ?? '').trim() === student &&
    String(p.applicationId ?? '').trim() !== current &&
    ['active', 'not_started'].includes(p.status)
  ) || null;
}
