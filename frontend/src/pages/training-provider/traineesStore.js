import { getOpportunity } from './opportunitiesStore.js';
import { getActiveProviderOrganizationId } from '../../services/providerOrganization.js';
import { findOtherActivePlacement } from '../../services/trainingLifecycle.js';
const KEY='cis-provider-trainees-v1', EVENT='cis-provider-trainees-updated';
const names=['أمل أحمد صيام','إسلام جمال القصاص','آية رامي بدير','بسمة إياد النجار','تالا ماهر الجدية','جنى وليد الشاعر','دعاء ياسر أبو عودة','رغد عماد أبو سليم','زياد أسامة حمد','سارة عبد الرحمن','ليلى حسن أبو شمالة','لينا محمود شعث','محمد إبراهيم رضوان','محمود إبراهيم رضوان','مصطفى هاني العرجا','يوسف نبيل عوض','كرم محمد النجار','عمر خليل الحداد','ريم سعيد الكرد','إسلام عادل حسن','رنا علي عمر','أحمد مصطفى'];
const supervisors=['خالد عودة','رنا الحلو','أحمد شحادة'];
function seeded(){return names.map((name,i)=>{const opId=['opp-5','opp-4','opp-5','opp-5','opp-3','opp-3','opp-5','opp-3','opp-2','opp-3','opp-1'][i%11];const op=getOpportunity(opId);const hours= i%8===3?120:i%8===4?120:i%8===5?0:i%8===6?53:i%8===7?46:[63,34,41][i%3];const required=op?.hours||120;const status=hours===0?'not_started':hours>=required?'completed':'active';return {id:'trainee-'+(i+1),organizationId:'1',studentId:i===0?'20231234':String(20231000+i*11+2),name,major:op?.specialty||'البرمجيات وقواعد البيانات',opportunityId:opId,opportunity:op?.title||'تدريب تطوير الويب',supervisor:supervisors[i%3],status,requiredHours:required,completedHours:Math.min(hours,required),attendance:i%8===5?null:85+(i%12),startDate:'2025-12-01',endDate:'2026-03-01',phone:'0599123485',email:'student@university.edu.ps',notes:[],plan:[{id:'p1',week:1,text:'التعرف على بيئة العمل والمهام الأساسية'}],attendanceRecords:[],logs:i===0?[{id:'log-1001',date:'2025-12-18',hours:6,title:'تصميم نموذج تسجيل الدخول',text:'أنجزت المهمة وفق الخطة الأسبوعية بعد توثيق الخطوات.',attachment:'log-1001.png',status:'pending',reviewNote:''}]:[],evaluation:i%5===0?null:{scores:[5,4,5,4,3],note:'أداء جيد والتزام واضح بالمهام.',by:'أحمد شحادة',date:'2025-12-15'},closedAt:null};});}
function browser(){return typeof window!=='undefined'}
export function getAllTrainees(){if(!browser())return seeded();try{const raw=localStorage.getItem(KEY);return raw===null?seeded():Array.isArray(JSON.parse(raw))?JSON.parse(raw):seeded();}catch{return seeded();}}
export function getTrainees(){const active=String(getActiveProviderOrganizationId());return getAllTrainees().filter(item=>String(item.organizationId??'1')===active);}
export function getTrainee(id){return getTrainees().find(x=>x.id===id||x.studentId===id)||null;}
function notify(){if(browser())window.dispatchEvent(new Event(EVENT));}
export function subscribeTrainees(cb){if(!browser())return()=>{};const storage=e=>{if(e.key===KEY)cb();};window.addEventListener(EVENT,cb);window.addEventListener('storage',storage);return()=>{window.removeEventListener(EVENT,cb);window.removeEventListener('storage',storage);};}
export function updateTrainee(id,patch){const items=getAllTrainees(),target=items.find(x=>x.id===id&&String(x.organizationId??'1')===String(getActiveProviderOrganizationId()));if(!target)return {ok:false,message:'المتدرب غير موجود'};const updated={...target,...patch};try{localStorage.setItem(KEY,JSON.stringify(items.map(x=>x.id===id?updated:x)));notify();return {ok:true,data:updated};}catch{return {ok:false,message:'تعذر حفظ البيانات'};}}
export function addPlan(id,text,week){if(!text?.trim())return {ok:false,message:'هذا الحقل مطلوب'};if(!Number.isInteger(Number(week))||Number(week)<1)return {ok:false,message:'أدخل أسبوعًا صحيحًا'};const t=getTrainee(id);if(!t)return {ok:false,message:'المتدرب غير موجود'};return updateTrainee(id,{plan:[...(t.plan||[]),{id:`plan-${Date.now()}`,week:Number(week),text:text.trim()}]});}
export function addNote(id,text){if(!text?.trim())return {ok:false,message:'هذا الحقل مطلوب'};const t=getTrainee(id);if(!t)return {ok:false,message:'المتدرب غير موجود'};return updateTrainee(id,{notes:[{id:`note-${Date.now()}`,text:text.trim(),date:new Date().toISOString().slice(0,10)},...(t.notes||[])]});}
export function setAttendance(id,record){
 if(!['present','late','absent'].includes(record.status))return {ok:false,message:'حالة حضور غير صحيحة'};
 const t=getTrainee(id);if(!t)return {ok:false,message:'المتدرب غير موجود'};
 if(t.status==='completed')return {ok:false,message:'لا يمكن إضافة حضور لتدريب منتهٍ'};
 if(t.source==='student' && ((t.startDate && record.date<t.startDate)||(t.endDate && record.date>t.endDate)))return {ok:false,message:'التاريخ خارج فترة التدريب المعتمدة'};
 const records=(t.attendanceRecords||[]).filter(r=>r.date!==record.date);
 records.unshift(record);
 const attended=records.filter(r=>['present','late'].includes(r.status)).length;
 const completedHours=Math.round(records.reduce((total,r)=>total+(['present','late'].includes(r.status)?Math.max(0,Number(r.hours)||0):0),0)*100)/100;
 // The first real attendance record replaces any decorative seeded hours.
 // The server will calculate this total from accepted attendance records.
 const attendance=records.length?Math.round(attended/records.length*100):null;
 return updateTrainee(id,{attendanceRecords:records,completedHours,attendance,status:t.status==='not_started'&&attended>0?'active':t.status});
}
export function reviewLog(id,logId,decision,note=''){
 const t=getTrainee(id);
 if(!t)return {ok:false,message:'المتدرب غير موجود'};
 // Review never adds hours: accredited hours come from attendance alone.
 if(!['approved','revision'].includes(decision))return {ok:false,message:'قرار غير صالح'};
 const log=(t.logs||[]).find(l=>l.id===logId);
 if(!log||log.status!=='pending')return {ok:false,message:'السجل غير مرسل أو تمت مراجعته سابقًا'};
 if(decision==='revision'&&!note.trim())return {ok:false,message:'ملاحظة المراجعة مطلوبة عند طلب التعديل'};
 return updateTrainee(id,{logs:t.logs.map(l=>l.id===logId?{...l,status:decision,reviewNote:note.trim(),reviewedAt:new Date().toISOString()}:l)});
}
export function saveEvaluation(id,scores,note){
 const t=getTrainee(id);
 if(!t)return {ok:false,message:'المتدرب غير موجود'};
 if(t.status==='not_started')return {ok:false,message:'لا يمكن تقييم متدرب لم يبدأ التدريب بعد'};
 if(t.status==='completed')return {ok:false,message:'التدريب منتهٍ؛ تعديل التقييم يتطلب إجراءً رسميًا من الإدارة'};
 if(!Array.isArray(scores)||scores.length!==5||scores.some(v=>!Number.isInteger(v)||v<1||v>5))return {ok:false,message:'يرجى تقييم جميع البنود من 1 إلى 5'};
 // Display the assigned supervisor, not a hard-coded person. Only the backend can
 // verify who actually submitted the evaluation.
 return updateTrainee(id,{evaluation:{scores:[...scores],note:String(note||'').trim(),by:t.supervisor||'غير محدد',date:new Date().toISOString().slice(0,10)}});
}
export function completionChecklist(t){return [{ok:Number(t.completedHours)>=Number(t.requiredHours),text:`إكمال الساعات المطلوبة (${t.completedHours} من ${t.requiredHours})`},{ok:!!t.evaluation,text:'اكتمال تقييم المتدرب'},{ok:!(t.logs||[]).some(l=>l.status==='pending'||l.status==='revision'),text:'اعتماد جميع السجلات اليومية'}];}
export function completeTrainee(id){const t=getTrainee(id);if(!t)return {ok:false,message:'المتدرب غير موجود'};if(completionChecklist(t).some(x=>!x.ok))return {ok:false,message:'متطلبات إنهاء التدريب غير مكتملة'};return updateTrainee(id,{status:'completed',closedAt:new Date().toISOString().slice(0,10)});}
export function exportTraineesCsv(items){const rows=[['الاسم','الرقم الجامعي','الفرصة','المشرف','الساعات المنجزة','المطلوبة','الحضور','الحالة'],...items.map(t=>[t.name,t.studentId,t.opportunity,t.supervisor,t.completedHours,t.requiredHours,t.attendance??'',({active:'قيد التدريب',completed:'منتهٍ',not_started:'لم يبدأ'})[t.status]])];const cell=x=>`"${String(x??'').replace(/^\s*[=+@-]/,"'$&").replace(/"/g,'""')} "`.trimEnd();const csv='\uFEFF'+rows.map(r=>r.map(cell).join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='provider-trainees.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
// Training provider demo dataset is isolated until backend authorization and syncing are implemented.

// Called only after BOTH academic and provider approvals for real student-submitted
// demo applications. Idempotent by application ID AND student/opportunity pair.
export function upsertApprovedStudentTrainee(application) {
  if (!application || application.source !== "student" || !application.studentId || !application.opportunityId) {
    return { ok: false, message: "بيانات الطلب غير مكتملة" };
  }
  const items = getAllTrainees();
  const existing = items.find(item =>
    String(item.applicationId || "") === String(application.id) ||
    (!item.applicationId && String(item.studentId) === String(application.studentId) &&
      String(item.opportunityId) === String(application.opportunityId))
  );
  if (existing) return { ok: true, created: false, record: existing };
  // Final mutation-boundary guard: independent of approval button checks.
  // Backend must enforce this within a DB transaction with a uniqueness policy.
  const otherActivePlacement = findOtherActivePlacement(items, application.studentId, application.id);
  if (otherActivePlacement) {
    return { ok: false, message: 'لدى الطالب تدريب فعّال آخر؛ لا يمكن إنشاء تدريب ثانٍ.', conflict: otherActivePlacement };
  }
  const opportunity = getOpportunity(application.opportunityId);
  if (!opportunity) return { ok: false, message: "فرصة التدريب غير موجودة" };
  const record = {
    id: `trainee-live-${application.id}`,
    organizationId: String(opportunity.organizationId ?? getActiveProviderOrganizationId()),
    applicationId: application.id,
    source: "student",
    studentId: String(application.studentId),
    name: application.name,
    major: application.major || opportunity.specialty,
    opportunityId: opportunity.id,
    opportunity: opportunity.title,
    supervisor: application.supervisor || opportunity.supervisor || "—",
    status: "not_started",
    requiredHours: Number(opportunity.hours) || 0,
    completedHours: 0,
    attendance: null,
    startDate: application.startDate || opportunity.startDate || "",
    endDate: opportunity.endDate || "",
    phone: application.phone || "",
    email: application.email || "",
    notes: [], plan: [], attendanceRecords: [], logs: [], evaluation: null, closedAt: null,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify([record, ...items]));
    notify();
    return { ok: true, created: true, record };
  } catch {
    return { ok: false, message: "تعذر إنشاء سجل المتدرب" };
  }
}
