import { ACADEMIC_PROGRAMS, isDepartmentProgram } from "../../constants/academicPrograms.js";
import { getActiveProviderOrganizationId, isActiveProviderApproved } from "../../services/providerOrganization.js";
import { getOrganization } from "../admin/trainingOrganizationsStore.js";
// Frontend-only demo data for the training provider; replace with an authenticated API later.
const KEY = 'cis-provider-opportunities-v1';
const EVENT = 'cis-provider-opportunities-updated';
const seed = [
 {id:'opp-1',organizationId:'1',title:'تدريب التصميم والمونتاج',specialty:'التصميم والمونتاج',mode:'حضوري',hours:100,capacity:4,applications:0,deadline:'',startDate:'2025-12-01',endDate:'2026-02-01',supervisor:'خالد عودة',description:'فرصة تدريب في أعمال التصميم والمونتاج.',requirements:['الالتزام بساعات الدوام'],skills:['التصميم'],status:'draft',createdAt:'2025-10-20T12:00:00',applicants:[]},
 {id:'opp-2',organizationId:'1',title:'تدريب الدعم الفني',specialty:'الدعم الفني',mode:'حضوري',hours:80,capacity:3,applications:4,deadline:'2025-10-30',startDate:'2025-11-01',endDate:'2026-01-01',supervisor:'خالد عودة',description:'المساعدة في تقديم خدمات الدعم الفني.',requirements:['أساسيات الحاسوب'],skills:['حل المشكلات'],status:'closed',createdAt:'2025-10-21T12:00:00',applicants:[]},
 {id:'opp-3',organizationId:'1',title:'تدريب تحليل البيانات',specialty:'تكنولوجيا علم البيانات',mode:'حضوري',hours:120,capacity:4,applications:5,deadline:'2025-11-15',startDate:'2025-12-01',endDate:'2026-02-01',supervisor:'خالد عودة',description:'تدريب عملي على تحليل البيانات وإعداد التقارير.',requirements:['المعرفة الأساسية بالجداول'],skills:['تحليل البيانات'],status:'published',createdAt:'2025-10-22T12:00:00',applicants:[]},
 {id:'opp-4',organizationId:'1',title:'تدريب شبكات الاتصالات',specialty:'الاتصالات وإنترنت الأشياء',mode:'حضوري',hours:100,capacity:5,applications:6,deadline:'2025-11-25',startDate:'2025-12-01',endDate:'2026-02-01',supervisor:'خالد عودة',description:'التدريب على صيانة شبكات الاتصالات وتشغيلها.',requirements:['مبادئ الشبكات'],skills:['الاتصالات'],status:'published',createdAt:'2025-10-23T12:00:00',applicants:[]},
 {id:'opp-5',organizationId:'1',title:'تدريب تطوير الويب',specialty:'البرمجيات وقواعد البيانات',mode:'حضوري',hours:120,capacity:8,applications:9,deadline:'2025-11-20',startDate:'2025-12-01',endDate:'2026-02-01',supervisor:'خالد عودة',description:'تدريب عملي على تطوير تطبيقات الويب ضمن فريق برمجي تحت إشراف مهندس متخصص، ويشمل تصميم الواجهات وربطها بقواعد البيانات.',requirements:['أن يكون الطالب مسجلاً في الفصل الحالي','اجتياز مساقات البرمجة الأساسية','الالتزام بساعات الدوام المحددة'],skills:['HTML / CSS','JavaScript','قواعد البيانات','العمل الجماعي'],status:'published',createdAt:'2025-10-24T12:00:00',applicants:[{id:'1',name:'أمل أحمد صيام',studentId:'20231234',applicationId:'APP-0400',status:'accepted'},{id:'2',name:'كرم محمد النجار',studentId:'20231240',applicationId:'APP-0399',status:'accepted'},{id:'3',name:'دعاء ياسر أبو عودة',studentId:'20231252',applicationId:'APP-0398',status:'accepted'},{id:'4',name:'عمر خليل الحداد',studentId:'20231267',applicationId:'APP-0397',status:'accepted'},{id:'5',name:'ريم سعيد الكرد',studentId:'20231281',applicationId:'APP-0396',status:'accepted'},{id:'6',name:'هبة سامي القدرة',studentId:'20231301',applicationId:'APP-0412',status:'pending'},{id:'7',name:'نادين عصام اللوح',studentId:'20231302',applicationId:'APP-0414',status:'pending'},{id:'8',name:'ضياء محمد الغلبيني',studentId:'20231303',applicationId:'APP-0415',status:'pending'},{id:'9',name:'شهد خالد الأسطل',studentId:'20231304',applicationId:'APP-0421',status:'rejected'}]}
];
export const statusLabel={draft:'مسودة',published:'منشورة',closed:'مغلقة'};
export const specialties = ACADEMIC_PROGRAMS;
const browser=()=>typeof window!=='undefined';
export function getOpportunities(){if(!browser())return seed.map(x=>({...x}));try{const value=localStorage.getItem(KEY);if(!value)return seed.map(x=>({...x}));const rows=JSON.parse(value);return Array.isArray(rows)?rows:seed.map(x=>({...x}));}catch{return seed.map(x=>({...x}));}}
function commit(items){if(!browser())return;localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new Event(EVENT));}
export function subscribeOpportunities(cb){if(!browser())return()=>{};const onStorage=e=>{if(e.key===KEY)cb();};window.addEventListener(EVENT,cb);window.addEventListener('storage',onStorage);return()=>{window.removeEventListener(EVENT,cb);window.removeEventListener('storage',onStorage);};}
export function getOpportunity(id){return getOpportunities().find(x=>x.id===id)||null;}
function withOrganizationDetails(item) {
  if (!item) return null;
  const organization = getOrganization(item.organizationId ?? "1");
  return {
    ...item,
    organizationId: String(item.organizationId ?? "1"),
    organizationName: organization?.name || item.organization || "",
    organization: organization?.name || item.organization || "",
    organizationLocation: organization?.location || item.location || "",
    organizationDescription: organization?.description || organization?.about || "",
    organizationType: organization?.type || "",
  };
}
export function getStudentVisibleOpportunities(){
  return getOpportunities()
    .filter(item =>
      item.status === "published" &&
      getOrganization(item.organizationId ?? "1")?.status === "approved"
    )
    .map(withOrganizationDetails);
}
export function getStudentVisibleOpportunity(id){
  const item=getOpportunity(id);
  return item && item.status === "published" &&
    getOrganization(item.organizationId ?? "1")?.status === "approved"
    ? withOrganizationDetails(item) : null;
}
export function getProviderOpportunity(id){
  const item=getOpportunity(id);
  return item && String(item.organizationId ?? "1") === String(getActiveProviderOrganizationId()) ? item : null;
}
export function getCurrentProviderOpportunities(){
  const organizationId=String(getActiveProviderOrganizationId());
  return getOpportunities().filter(item=>String(item.organizationId ?? "1")===organizationId);
}
export function saveOpportunity(data,{publish=false}={}){
  if(data.specialty&&!isDepartmentProgram(data.specialty))throw new Error('يرجى اختيار تخصص من قسم الهندسة وتكنولوجيا المعلومات.');
  const approved=isActiveProviderApproved();
  if(publish&&!approved)throw new Error('لا يمكن نشر الفرص قبل اعتماد جهة التدريب من الإدارة.');
  const items=getOpportunities();
  const id=data.id||`opp-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  const prior=items.find(x=>x.id===id);
  const organizationId=String(prior?.organizationId ?? getActiveProviderOrganizationId());
  if(prior&&organizationId!==String(getActiveProviderOrganizationId()))throw new Error('لا تملك هذه الجهة صلاحية تعديل هذه الفرصة.');
  const status=publish?'published':(!approved&&prior?.status==='published'?'closed':prior?.status==='published'?'published':data.status||'draft');
  const next={...prior,...data,id,organizationId,status,applications:prior?.applications||0,applicants:prior?.applicants||[],createdAt:prior?.createdAt||new Date().toISOString()};
  commit(prior?items.map(x=>x.id===id?next:x):[next,...items]);
  return id;
}
export function setOpportunityStatus(id,status){
  if(!['closed','published','draft'].includes(status))return false;
  const items=getOpportunities();const found=items.find(x=>x.id===id);
  if(!found||String(found.organizationId ?? "1")!==String(getActiveProviderOrganizationId()))return false;
  if(status==='published'&&!isActiveProviderApproved())return false;
  if(status==='draft'&&found.status!=='draft')return false;
  commit(items.map(x=>x.id===id?{...x,status}:x));return true;
}
export function deleteOpportunityDraft(id){
  const items=getOpportunities();const item=items.find(x=>x.id===id);
  if(!item||String(item.organizationId ?? "1")!==String(getActiveProviderOrganizationId())||item.status!=='draft')return false;
  commit(items.filter(x=>x.id!==id));return true;
}
export function resetDemoOpportunities(){if(!browser())return;localStorage.removeItem(KEY);window.dispatchEvent(new Event(EVENT));}
export function exportOpportunityCSV(items){const rows=[['الفرصة','التخصص','النمط','المدة بالساعات','المقاعد','الطلبات','آخر موعد','الحالة'],...items.map(o=>[o.title,o.specialty,o.mode,o.hours,o.capacity,o.applications,o.deadline,statusLabel[o.status]])];const escape=v=>`"${String(v??'').replace(/^[\s]*[=+@\-]/,m=>"'"+m).replace(/"/g,'""')} "`.trimEnd();const csv='\uFEFF'+rows.map(r=>r.map(escape).join(',')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download='training-opportunities.csv';document.body.appendChild(anchor);anchor.click();anchor.remove();URL.revokeObjectURL(url);}
