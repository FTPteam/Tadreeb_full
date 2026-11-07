// Student-facing projection only. Real authorization and data access must be enforced by the API.
import { getApplications } from '../training-provider/providerApplicationsStore';
import { getOpportunity } from '../training-provider/opportunitiesStore';
import { getAcademicDecision, getAcademicDecisionRecord, getOverallApplicationStatus } from '../../services/trainingWorkflow';
import { getActiveStudentId } from '../../services/studentTrainingEligibility';

export function getMyApplications() {
  const studentId = String(getActiveStudentId());
  return getApplications()
    .filter(row => row.source === 'student' && String(row.studentId) === studentId)
    .map(row => {
      const opportunity = getOpportunity(row.opportunityId);
      const academic = getAcademicDecision(row.id);
      const status = getOverallApplicationStatus(row, academic);
      const academicRecord = getAcademicDecisionRecord(row.id);
      return {
        ...row,
        opportunityTitle: opportunity?.title || 'فرصة تدريب غير متاحة',
        organizationName: row.organization || opportunity?.organizationName || 'جهة التدريب',
        location: opportunity?.location || 'غير محدد',
        requiredHours: Number(opportunity?.hours) || 0,
        startDate: row.startDate || opportunity?.startDate || '',
        endDate: opportunity?.endDate || '',
        specialty: opportunity?.specialty || row.major || '—',
        academicDecision: academic,
        overallStatus: status,
        note: academic === 'rejected' ? (academicRecord?.rejectionReason || academicRecord?.note || 'رفضت الإدارة الطلب')
          : row.status === 'rejected' ? (row.rejectionReason || 'رفضت جهة التدريب الطلب')
          : status === 'accepted' ? 'اكتملت موافقة الإدارة وجهة التدريب.'
          : academic === 'approved' ? 'وافقت الإدارة؛ بانتظار موافقة جهة التدريب.'
          : row.status === 'accepted' ? 'وافقت جهة التدريب؛ بانتظار موافقة الإدارة.'
          : 'بانتظار مراجعة الإدارة وجهة التدريب.',
      };
    });
}
export function getMyApplication(id) {
  return getMyApplications().find(item => String(item.id) === String(id)) || null;
}
