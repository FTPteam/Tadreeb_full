// Shared browser-only daily training log workflow.
// Production must implement student/organization authorization and concurrency on the server.
import { getAllTrainees } from '../pages/training-provider/traineesStore';
import { getActiveStudentId } from './studentTrainingEligibility';
import { getActiveProviderOrganizationId } from './providerOrganization';

const KEY = 'cis-provider-trainees-v1';
const EVENT = 'cis-provider-trainees-updated';
export const LOG_STATES = { draft: 'مسودة', pending: 'بانتظار المراجعة', revision: 'يحتاج تعديل', approved: 'معتمد' };
const text = value => String(value ?? '').trim();
const localDate = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export function getCurrentTraining(studentId = getActiveStudentId()) {
  const items = getAllTrainees().filter(t => String(t.studentId) === String(studentId));
  return items.find(t => t.status === 'active') || items.find(t => t.status === 'not_started') || items[0] || null;
}
export function normalizeDailyLog(log) {
  const tasks = Array.isArray(log.tasks) && log.tasks.length
    ? log.tasks.map(t => typeof t === 'string' ? t : text(t.title || t.text)).filter(Boolean)
    : [text(log.title)].filter(Boolean);
  return { ...log, tasks, learning: text(log.learning), challenges: text(log.challenges), status: log.status || 'draft' };
}
function normalizeLogWithAttendance(log, trainee) {
  const normalized = normalizeDailyLog(log);
  const record = (trainee.attendanceRecords || []).find(row => row.date === normalized.date);
  // A log documents tasks; its displayed hours always follow the attendance record.
  return { ...normalized, hours: record && ['present','late'].includes(record.status) ? Math.max(0,Number(record.hours)||0) : 0 };
}
export function getLogsForStudent(studentId = getActiveStudentId()) {
  const trainee = getCurrentTraining(studentId);
  return (trainee?.logs || []).map(log=>normalizeLogWithAttendance(log,trainee)).sort((a,b) => String(b.date).localeCompare(String(a.date)));
}
export function getDailyLog(studentId, logId) {
  return getLogsForStudent(studentId).find(l => String(l.id) === String(logId)) || null;
}
export function getAllDailyTrainingLogs() {
  return getAllTrainees().flatMap(t => (t.logs || []).map(l => ({ ...normalizeLogWithAttendance(l,t), traineeId:t.id, studentId:t.studentId, student:t.name, organizationId:t.organizationId, opportunity:t.opportunity, supervisor:t.supervisor })) ).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
}
function writeTrainee(id, patch) {
  if (typeof window === 'undefined') return { ok:false, message:'الحفظ متاح في المتصفح فقط' };
  const all = getAllTrainees();
  if (!all.some(t => t.id === id)) return { ok:false, message:'التدريب غير موجود' };
  try {
    localStorage.setItem(KEY, JSON.stringify(all.map(t => t.id === id ? { ...t, ...patch } : t)));
    window.dispatchEvent(new Event(EVENT));
    return { ok:true };
  } catch { return { ok:false, message:'تعذر حفظ السجل في المتصفح' }; }
}
export function upsertStudentDailyLog({ studentId = getActiveStudentId(), id, date, tasks, learning='', challenges='', mode='draft' }) {
  if (String(studentId) !== String(getActiveStudentId())) return {ok:false,message:'لا يمكن تعديل سجل طالب آخر'};
  const trainee = getCurrentTraining(studentId);
  if (!trainee) return {ok:false,message:'لا يوجد تدريب معتمد مرتبط بحسابك حاليًا'};
  if (trainee.status === 'completed') return {ok:false,message:'هذا التدريب منتهٍ، ولا يمكن إضافة سجلات جديدة إليه'};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text(date)) || date > localDate()) return {ok:false,message:'اختر تاريخًا صحيحًا لا يتجاوز اليوم'};
  // Enforce dates for real approved placements; older demo fixtures predate current dates.
  if (trainee.source === 'student' && ((trainee.startDate && date < trainee.startDate) || (trainee.endDate && date > trainee.endDate))) {
    return {ok:false,message:'يجب أن يكون التاريخ ضمن فترة التدريب المعتمدة'};
  }
  const rows = (Array.isArray(tasks) ? tasks : []).map(text).filter(Boolean);
  if (rows.length > 8 || rows.some(t=>t.length>180)) return {ok:false,message:'يمكن إضافة حتى 8 مهام، بحد أقصى 180 حرفًا لكل مهمة'};
  if (mode === 'pending' && !rows.length) return {ok:false,message:'أضف مهمة واحدة على الأقل قبل الإرسال للمراجعة'};
  const attendance = (trainee.attendanceRecords || []).find(r => r.date === date);
  if (mode === 'pending' && attendance?.status === 'absent') return {ok:false,message:'اليوم مسجّل غيابًا؛ لا يمكن إرسال سجل مهام لهذا اليوم. راجع جهة التدريب إذا كان هناك خطأ'};
  const all = trainee.logs || [];
  const previous = id ? all.find(l => String(l.id) === String(id)) : all.find(l => l.date === date);
  if (previous && !['draft','revision'].includes(previous.status)) return {ok:false,message:'هذا السجل مرسل أو معتمد بالفعل، ولا يمكن تعديله'};
  if (all.some(l => l.date === date && l.id !== previous?.id)) return {ok:false,message:'يوجد سجل آخر لهذا اليوم؛ افتحه وأضف المهام إليه'};
  const now = new Date().toISOString();
  const log = {
    ...(previous||{}), id: previous?.id || `student-log-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
    date, tasks: rows, title: rows[0] || 'مسودة يومية', text: rows.join('، '),
    learning: text(learning).slice(0,1200), challenges: text(challenges).slice(0,1200),
    // Hours shown for context only, never increment the trainee's completedHours here.
    hours: attendance && attendance.status !== 'absent' ? Number(attendance.hours || 0) : 0,
    status: mode === 'pending' ? 'pending' : 'draft', reviewNote: mode === 'pending' ? '' : (previous?.reviewNote || ''),
    attachment: previous?.attachment || '', createdAt: previous?.createdAt || now, updatedAt: now,
  };
  const result = writeTrainee(trainee.id, { logs: [...all.filter(l=>l.id!==previous?.id), log] });
  return { ...result, log };
}
export function reviewDailyTrainingLog({ traineeId, logId, decision, note='' }) {
  if (!['approved','revision'].includes(decision)) return {ok:false,message:'قرار غير صالح'};
  if (decision==='revision' && !text(note)) return {ok:false,message:'اكتب سبب إعادة السجل للتعديل'};
  const trainee = getAllTrainees().find(t => String(t.id) === String(traineeId));
  if (!trainee) return {ok:false,message:'المتدرب غير موجود'};
  if (String(trainee.organizationId ?? '1') !== String(getActiveProviderOrganizationId())) return {ok:false,message:'السجل لا يتبع جهة التدريب الحالية'};
  const log = (trainee.logs || []).find(l=>String(l.id)===String(logId));
  if (!log) return {ok:false,message:'السجل غير موجود'};
  if (log.status !== 'pending') return {ok:false,message:'لا يمكن مراجعة سجل غير مرسل أو سبق اتخاذ قرار بشأنه'};
  const updated = { ...log, status:decision, reviewNote:text(note), reviewedAt:new Date().toISOString() };
  return writeTrainee(trainee.id, {logs:trainee.logs.map(l=>l.id===log.id?updated:l)});
}
export function subscribeTrainingLogs(callback) {
  if (typeof window === 'undefined') return ()=>{};
  const storage = event => { if (event.key === KEY) callback(); };
  window.addEventListener(EVENT,callback); window.addEventListener('storage',storage);
  return ()=>{ window.removeEventListener(EVENT,callback);window.removeEventListener('storage',storage); };
}
export function getWeeklyLogSummary(logs, date = localDate()) {
  const day = new Date(`${date}T12:00:00`);
  const offset = (day.getDay() + 1) % 7; // Saturday starts the week.
  day.setDate(day.getDate()-offset);
  const start = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
  day.setDate(day.getDate()+6);
  const end = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
  const week = logs.filter(l=>l.date>=start && l.date<=end);
  return { start,end,days:week.length, tasks:week.reduce((n,l)=>n+(l.tasks?.length||0),0),approved:week.filter(l=>l.status==='approved').length,pending:week.filter(l=>l.status==='pending').length };
}
