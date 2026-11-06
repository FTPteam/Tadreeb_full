import { getAllDailyTrainingLogs } from '../../services/dailyTrainingLogs';
import { getTrainees, getTrainee, setAttendance, reviewLog, subscribeTrainees } from './traineesStore';
const KEY='cis-provider-daily-logs-v1';
const EVENT='cis-provider-daily-logs-updated';
const EVENT_ATT='cis-provider-attendance-v1';
// Local date for the selected training day; no fixed historical date in production UI.
export const getLocalTrainingDate = () => {
 const d = new Date();
 return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
export const DISPLAY_DATE = getLocalTrainingDate();
export function getDailyLogs(){
 const ids=new Set(getTrainees().map(t=>String(t.id)));
 return getAllDailyTrainingLogs().filter(l=>ids.has(String(l.traineeId)) && l.status!=='draft').map(l=>({
  ...l, name:l.student, description:l.learning || l.text || l.tasks.join('، '),
  title:l.tasks[0] || l.title || 'سجل يومي', hours:Number(l.hours||0),
 }));
}
export function subscribeDailyLogs(fn){
 if(typeof window==='undefined')return ()=>{};
 window.addEventListener(EVENT,fn);
 window.addEventListener('cis-provider-trainees-updated',fn);
 const s=e=>{if([KEY,'cis-provider-trainees-v1'].includes(e.key))fn();};
 window.addEventListener('storage',s);
 return ()=>{window.removeEventListener(EVENT,fn);window.removeEventListener('cis-provider-trainees-updated',fn);window.removeEventListener('storage',s);};
}
export function saveDailyLogDecision(id,decision,note=''){
 const record=getDailyLogs().find(l=>String(l.id)===String(id));
 if(!record)return {ok:false,message:'السجل غير موجود أو لا ينتمي إلى جهتك'};
 return reviewLog(record.traineeId,id,decision,note);
}
export function getAttendanceRows(date = getLocalTrainingDate()) {
 return getTrainees().filter(t => ['active','not_started'].includes(t.status) || (t.attendanceRecords||[]).some(r=>r.date===date)).map(t => {
  const record = (t.attendanceRecords || []).find(r => r.date === date);
  const historical = (t.attendanceRecords || []).filter(r => r?.date && ['present','late','absent'].includes(r.status));
  const attended = historical.filter(r => r.status === 'present' || r.status === 'late').length;
  const rate = historical.length ? Math.round(attended / historical.length * 100) : null;
  return {
   id:t.id, name:t.name, opportunity:t.opportunity,
   status:record?.status || 'unrecorded', recorded:Boolean(record),
   inTime:record?.inTime || '', outTime:record?.outTime || '',
   rate, hours:record?.hours ?? 0,
  };
 });
}
export function saveAttendanceRow(id, value, date = getLocalTrainingDate()) {
 if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date > getLocalTrainingDate()) return {ok:false,message:'تاريخ الحضور غير صالح أو في المستقبل'};
 if (!['present','late','absent'].includes(value.status)) return {ok:false,message:'حالة الحضور غير صحيحة'};
 let hours = 0;
 if (value.status !== 'absent') {
  if (!/^\d{2}:\d{2}$/.test(value.inTime || '') || !/^\d{2}:\d{2}$/.test(value.outTime || '')) return {ok:false,message:'أدخل وقت الحضور والانصراف'};
  const [sh,sm] = value.inTime.split(':').map(Number);
  const [eh,em] = value.outTime.split(':').map(Number);
  if (sh > 23 || eh > 23 || sm > 59 || em > 59) return {ok:false,message:'أوقات الحضور غير صالحة'};
  const minutes = (eh * 60 + em) - (sh * 60 + sm);
  if (minutes <= 0 || minutes > 16 * 60) return {ok:false,message:'يجب أن يكون وقت الانصراف بعد الحضور بمدة لا تتجاوز 16 ساعة'};
  hours = Math.round(minutes / 60 * 100) / 100;
 }
 return setAttendance(id,{date,status:value.status,inTime:value.status==='absent'?'':value.inTime,outTime:value.status==='absent'?'':value.outTime,hours});
}
export function downloadAttendanceCSV(items){
 const safe=(v)=>{const str=String(v??'');return '"'+str.replace(/^\s*[=+@-]/,"'$&").replace(/"/g,'""')+'"';};
 const content='\uFEFF'+items.map(row=>row.map(safe).join(',')).join('\r\n');
 const blob=new Blob([content],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='provider-attendance-logs.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
