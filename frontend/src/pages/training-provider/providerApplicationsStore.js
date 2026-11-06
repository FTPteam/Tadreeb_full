import { getProviderProfile } from "./providerProfileStore";
import { getAcademicDecision, reconcileTrainingApplication } from "../../services/trainingWorkflow";
import { getOpportunities, getOpportunity, getStudentVisibleOpportunity, getProviderOpportunity, saveOpportunity } from './opportunitiesStore';
import { getActiveProviderOrganizationId } from '../../services/providerOrganization';
import { getOrganization } from '../admin/trainingOrganizationsStore';
import { getStudent } from '../admin/studentsStore';
import { findTrainingConflict, trainingConflictMessage } from '../../services/activeTrainingGuard';
import { getActiveStudentId, getStudentApplicationEligibility } from '../../services/studentTrainingEligibility';

const KEY='cis-provider-applications-v1';
const EVENT='cis-provider-applications-updated';
const student=(id,name,number,major,opportunityId,status,date,extra={})=>({id,name,studentId:number,major,opportunityId,status,date,phone:'0599123485',gpa:89,reason:'أرغب في تطبيق ما تعلمته عمليًا وتطوير مهاراتي ضمن بيئة عمل حقيقية.',...extra});
const defaults=[
student('APP-0417','لمى أيمن الصوارني','20231368','تكنولوجيا علم البيانات','opp-3','pending','2025-10-07'),
student('APP-0416','وسام فؤاد جبراني','20231356','الاتصالات وإنترنت الأشياء','opp-4','pending','2025-10-06'),
student('APP-0414','نادين عصام اللوح','20231333','البرمجيات وقواعد البيانات','opp-5','pending','2025-10-05'),
student('APP-0415','ضياء محمد الغلبيني','20231345','البرمجيات وقواعد البيانات','opp-5','pending','2025-10-05'),
student('APP-0413','طارق ياسر الأغا','20231321','الاتصالات وإنترنت الأشياء','opp-4','pending','2025-10-04'),
student('APP-0412','هبة سامي القدرة','20231310','البرمجيات وقواعد البيانات','opp-5','pending','2025-10-03'),
...['آية رامي بدير','مصطفى هاني العرجا','يوسف نبيل عوض','جنى وليد الشاعر','رغد عماد أبو سليم','محمود إبراهيم رضوان','سارة عبد الرحمن','إسلام جمال القصاص','أمل أحمد صيام','كرم محمد النجار','دعاء ياسر أبو عودة','عمر خليل الحداد','ريم سعيد الكرد','محمد فادي'].map((n,i)=>student('APP-'+String(387+i).padStart(4,'0'),n,String(20231405+i),'الدعم الفني',i<3?'opp-2':i<5?'opp-3':i<9?'opp-4':'opp-5','accepted',`2025-09-${String(23-i).padStart(2,'0')}`,{supervisor:'خالد عودة',startDate:'2025-12-01'})),
...['شهد خالد الأسطل','رامي سليم المدهون','حنين عبد الله أبو شعبان','بلال مصطفى الشيخ'].map((n,i)=>student('APP-'+(421-i),n,String(20231561-i),'الدعم الفني',i===0?'opp-5':'opp-2','rejected',`2025-09-${30-i}`,{rejectionReason:'لا تتوافق خبرة الطالب مع متطلبات الفرصة.'}))
];
const canBrowser=()=>typeof window!=='undefined';
export function getApplications(){if(!canBrowser())return defaults.map(x=>({...x}));try{const raw=localStorage.getItem(KEY);if(raw===null)return defaults.map(x=>({...x}));const rows=JSON.parse(raw);return Array.isArray(rows)?rows:defaults.map(x=>({...x}));}catch{return defaults.map(x=>({...x}));}}
export function getProviderApplications(){
 const activeId=String(getActiveProviderOrganizationId());
 return getApplications().filter(row=>{
   const opportunity=getOpportunity(row.opportunityId);
   const rowOrg=row.organizationId ?? opportunity?.organizationId ?? "1";
   return String(rowOrg)===activeId;
 });
}
export function subscribeApplications(cb){if(!canBrowser())return()=>{};const fn=e=>{if(e.key===KEY)cb();};window.addEventListener(EVENT,cb);window.addEventListener('storage',fn);return()=>{window.removeEventListener(EVENT,cb);window.removeEventListener('storage',fn);};}
const notify=()=>{if(canBrowser())window.dispatchEvent(new Event(EVENT));};
const acceptedSeats=(op,items,excludeId)=>{const fromStore=op?.applicants?.filter(a=>a.status==='accepted' && a.applicationId!==excludeId).map(a=>a.applicationId)||[];const fromApp=items.filter(a=>a.opportunityId===op.id&&a.status==='accepted'&&a.id!==excludeId).map(a=>a.id);return new Set([...fromStore,...fromApp]).size;};
export function decideApplication(id,decision,details={}){
 if(!['accepted','rejected'].includes(decision))return {ok:false,message:'قرار غير صالح'};
 const records=getApplications();const record=records.find(x=>x.id===id);
 if(!record||record.status!=='pending')return {ok:false,message:'الطلب غير موجود أو سبق اتخاذ قرار بشأنه'};
 if(record.source==='student' && getAcademicDecision(id)==='rejected')return {ok:false,message:'رفضت الإدارة هذا الطلب، ولا يمكن قبوله لدى الجهة'};
 const op=getProviderOpportunity(record.opportunityId);
 if(!op)return {ok:false,message:'فرصة التدريب غير موجودة'};
 if(decision==='accepted'){
  // Provider approval must not create a second simultaneous placement either.
  const conflict = findTrainingConflict({
    studentId: record.studentId,
    currentRequestId: record.id,
    student: getStudent(record.studentId),
    requests: records.filter(row => row.status === 'accepted').map(row => ({
      ...row,
      position: getOpportunity(row.opportunityId)?.title,
      organizationName: row.organization,
    })),
  });
  if(conflict) return {ok:false,message:trainingConflictMessage(conflict,record.name)};
  if(!details.supervisor?.trim())return {ok:false,message:'يرجى اختيار المشرف الميداني'};
  if(!details.startDate)return {ok:false,message:'تاريخ بدء التدريب مطلوب'};
  if(acceptedSeats(op,records,id)>=Number(op.capacity))return {ok:false,message:'لا توجد مقاعد متاحة لهذه الفرصة'};
 }else if(!details.rejectionReason?.trim()||details.rejectionReason.trim().length<10)return {ok:false,message:'يجب كتابة سبب رفض واضح (10 أحرف على الأقل)'};
 const updated={...record,status:decision,...(decision==='accepted'?{supervisor:details.supervisor,startDate:details.startDate,note:details.note||''}:{rejectionReason:details.rejectionReason.trim()})};
 try{
  const next=records.map(x=>x.id===id?updated:x);
  // Keep the opportunity details view synchronized with the request decision.
  const applicants=[...(op.applicants||[])];const existing=applicants.findIndex(x=>x.applicationId===id);
  const applicant={id:updated.studentId,name:updated.name,studentId:updated.studentId,applicationId:id,status:decision};
  if(existing>=0)applicants[existing]={...applicants[existing],...applicant};else applicants.push(applicant);
  saveOpportunity({...op,applicants,applications:Math.max(Number(op.applications)||0,applicants.length)});
  localStorage.setItem(KEY,JSON.stringify(next));notify();
  if (updated.source === "student") reconcileTrainingApplication(updated, getAcademicDecision(id));
  return {ok:true,record:updated};
 }catch{return {ok:false,message:'تعذر حفظ القرار في التخزين المحلي'};}
}
export function exportApplicationsCsv(records){const cols=[['الطالب','الرقم الجامعي','رقم الطلب','الفرصة','التخصص','التاريخ','الحالة'],...records.map(x=>[x.name,x.studentId,x.id,getOpportunity(x.opportunityId)?.title||'فرصة غير متاحة',x.major,x.date,({pending:'معلق',accepted:'مقبول',rejected:'مرفوض'})[x.status]])];const cell=x=>`"${String(x??'').replace(/^\s*[=+@-]/,"'$&").replace(/"/g,'""')} "`.trimEnd();const csv='\uFEFF'+cols.map(r=>r.map(cell).join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='provider-student-applications.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function resetDemoApplications(){if(!canBrowser())return;localStorage.removeItem(KEY);notify();}


// Phase 1 browser-only bridge: student submission -> provider requests -> admin read model.
// Do not use this store for multi-user deployment; replace with authenticated API calls.
export function submitStudentApplication(form, opportunityId) {
  const opportunity = getStudentVisibleOpportunity(opportunityId);
  if (!opportunity || opportunity.status !== 'published') {
    return { ok: false, message: 'فرصة التدريب غير متاحة للتقديم' };
  }
  if (opportunity.deadline && opportunity.deadline < new Date().toISOString().slice(0,10)) {
    return { ok: false, message: 'انتهى موعد التقديم على هذه الفرصة' };
  }
  if (!String(form.studentId || '').trim() || !String(form.fullName || '').trim()) {
    return { ok: false, message: 'يرجى استكمال بيانات الطالب' };
  }
  if (!String(form.motivation || '').trim()) {
    return { ok: false, message: 'سبب التقديم مطلوب' };
  }
  // Revalidate at the mutation boundary; a disabled button is not sufficient.
  const currentStudentId = getActiveStudentId();
  if (String(form.studentId).trim() !== currentStudentId) {
    return { ok: false, message: 'الرقم الجامعي لا يطابق حساب الطالب الحالي.' };
  }
  const eligibility = getStudentApplicationEligibility(currentStudentId);
  if (!eligibility.canApply) return { ok: false, message: eligibility.reason };
  const records = getApplications();
  const previous = records.find(row => row.source === 'student' &&
    String(row.studentId) === String(form.studentId) && row.opportunityId === opportunityId);
  if (previous) return { ok: false, message: 'تم تقديم طلب لهذه الفرصة مسبقًا', record: previous };
  const record = {
    id: `LIVE-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
    name: form.fullName.trim(), studentId: String(form.studentId).trim(),
    major: form.major, opportunityId, status: 'pending',
    date: new Date().toISOString().slice(0,10),
    phone: form.phone, email: form.email, reason: form.motivation,
    organization: getOrganization(opportunity.organizationId ?? '1')?.name || opportunity.organizationName || opportunity.organization || getProviderProfile().name || "جهة التدريب",
    organizationId: String(opportunity.organizationId ?? '1'),
    source: 'student', academicYear: form.academicYear,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify([record, ...records]));
    notify();
    return { ok: true, record };
  } catch {
    return { ok: false, message: 'تعذر حفظ الطلب في هذا المتصفح' };
  }
}
