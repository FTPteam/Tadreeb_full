import { getTrainees } from './traineesStore.js';
import { getCurrentProviderOpportunities } from './opportunitiesStore.js';
import { getActiveProviderOrganizationId } from '../../services/providerOrganization.js';

const KEY = 'cis-provider-supervisors-v1';
const EVENT = 'cis-provider-supervisors-updated';
export const initialSupervisors = [
  { id:'sup-ahmad', organizationId:'1', name:'أحمد شحادة', title:'رئيس قسم الدعم الفني', department:'الدعم الفني', capacity:4, email:'ahmad@alquds-tel.ps', phone:'0599444555' },
  { id:'sup-khaled', organizationId:'1', name:'خالد عودة', title:'مدير تطوير البرمجيات', department:'تطوير البرمجيات', capacity:6, email:'khaled@alquds-tel.ps', phone:'0599000111' },
  { id:'sup-rana', organizationId:'1', name:'رنا الحلو', title:'مسؤولة تحليل البيانات', department:'البيانات والشبكات', capacity:8, email:'rana@alquds-tel.ps', phone:'0599222333' },
];
const hasWindow = () => typeof window !== 'undefined';
function getAllSupervisors() {
  if (!hasWindow()) return initialSupervisors.map(x=>({...x}));
  try { const raw=localStorage.getItem(KEY); if(raw===null)return initialSupervisors.map(x=>({...x})); const rows=JSON.parse(raw); return Array.isArray(rows)?rows:initialSupervisors.map(x=>({...x})); }
  catch { return initialSupervisors.map(x=>({...x})); }
}
export function getSupervisors() {
  const active=String(getActiveProviderOrganizationId());
  return getAllSupervisors().filter(row=>String(row.organizationId??"1")===active);
}
function commit(rows) {
  try { localStorage.setItem(KEY, JSON.stringify(rows)); window.dispatchEvent(new Event(EVENT)); return { ok: true }; }
  catch { return { ok:false, message:'تعذر حفظ البيانات في المتصفح' }; }
}
export function subscribeSupervisors(fn) {
  if (!hasWindow()) return () => {};
  const storage = e => { if(e.key===KEY) fn(); };
  window.addEventListener(EVENT,fn); window.addEventListener('storage',storage);
  return () => { window.removeEventListener(EVENT,fn); window.removeEventListener('storage',storage); };
}
export function superviseesFor(supervisor) {
  return getTrainees().filter(t => t.supervisor === supervisor.name);
}
export function vacanciesFor(supervisor) {
  return getCurrentProviderOpportunities().filter(o => o.supervisor === supervisor.name);
}
export function supervisorWorkload(supervisor) {
  const trainees = superviseesFor(supervisor).filter(t => t.status !== 'completed');
  return { trainees, opportunities: vacanciesFor(supervisor), count: trainees.length, capacity: Number(supervisor.capacity)||0 };
}
export function validateSupervisor(data, existingId = null) {
  const errors = {};
  ['name','title','department','email','phone'].forEach(k => { if (!String(data[k]??'').trim()) errors[k]='هذا الحقل مطلوب'; });
  if(!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email='صيغة البريد الإلكتروني غير صحيحة';
  if(!errors.phone && !/^0[0-9]{8,9}$/.test(String(data.phone).replace(/[\s-]/g,''))) errors.phone='يرجى إدخال رقم جوال صحيح';
  if(!Number.isInteger(Number(data.capacity)) || Number(data.capacity)<1) errors.capacity='أدخل حدًا أقصى صحيحًا لا يقل عن 1';
  const other=getSupervisors().filter(s=>s.id!==existingId);
  if(!errors.email && other.some(s=>s.email.toLowerCase()===data.email.trim().toLowerCase()))errors.email='البريد الإلكتروني مستخدم لمشرف آخر';
  if(!errors.phone && other.some(s=>s.phone.replace(/[\s-]/g,'')===String(data.phone).replace(/[\s-]/g,'')))errors.phone='رقم الجوال مستخدم لمشرف آخر';
  if(existingId){ const current=getSupervisors().find(s=>s.id===existingId); if(current){
    const attached=supervisorWorkload(current);
    if(Number(data.capacity)<attached.count) errors.capacity=`الحد الأدنى ${attached.count} لوجود متدربين حاليين`;
    if(current.name!==data.name.trim() && (attached.count>0||attached.opportunities.length>0)) errors.name='لا يمكن تغيير اسم مشرف مرتبط بفرص أو متدربين قبل ربط المعرّفات الدائمة';
  }}
  return errors;
}
export function saveSupervisor(data, existingId=null) {
  const errors=validateSupervisor(data,existingId); if(Object.keys(errors).length)return {ok:false,errors};
  const allRows=getAllSupervisors(); const rows=getSupervisors(); if(existingId && !rows.some(s=>s.id===existingId))return {ok:false,message:'المشرف غير موجود'};
  const record={id:existingId||`sup-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,organizationId:String(getActiveProviderOrganizationId()),name:data.name.trim(),title:data.title.trim(),department:data.department.trim(),capacity:Number(data.capacity),email:data.email.trim(),phone:data.phone.replace(/[\s-]/g,'')};
  return commit(existingId?allRows.map(s=>s.id===existingId?record:s):[...allRows,record]);
}
export function deleteSupervisor(id){
  const allRows=getAllSupervisors(), rows=getSupervisors(), found=rows.find(s=>s.id===id);
  if(!found)return {ok:false,message:'المشرف غير موجود'};
  const workload=supervisorWorkload(found);
  if(workload.trainees.length || workload.opportunities.length) return {ok:false,message:'لا يمكن حذف مشرف لديه متدربون أو فرص مسندة. أعد إسنادها أولًا.'};
  return commit(allRows.filter(s=>s.id!==id));
}
