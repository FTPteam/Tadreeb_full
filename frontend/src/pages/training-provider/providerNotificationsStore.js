import { getActiveProviderOrganizationId } from '../../services/providerOrganization.js';
const KEY = 'cis-provider-notifications-v1';
const EVENT = 'cis-provider-notifications-change';
const seed = [
 {id:1,organizationId:'1',title:'طلب تدريب جديد',description:'قدّمت الطالبة هبة القدرة على فرصة تدريب تطوير الويب',time:'منذ 15 دقيقة',category:'طلب',kind:'request',read:false,path:'/training-provider/requests'},
 {id:2,organizationId:'1',title:'سجل يومي جديد',description:'أرسلت أمل أحمد السجل اليومي ليوم 2025/12/18',time:'منذ ساعة',category:'سجل',kind:'log',read:false,path:'/training-provider/attendance'},
 {id:3,organizationId:'1',title:'تقييم مطلوب',description:'تنتهي فترة تدريب أمل أحمد خلال 7 أيام',time:'أمس',category:'تقييم',kind:'evaluation',read:true,path:'/training-provider/trainees'},
 {id:4,organizationId:'1',title:'اعتماد الجهة',description:'تم اعتماد الجهة للفصل الدراسي الحالي',time:'2025/12/15',category:'اعتماد',kind:'approval',read:true,path:'/training-provider/profile'},
 {id:5,organizationId:'1',title:'غياب متدربين',description:'لم يسجل حضور متدربين اثنين اليوم',time:'اليوم 09:30',category:'حضور',kind:'attendance',read:false,path:'/training-provider/trainees'},
];
function normalize(items){return items.filter(x=>x&&typeof x==='object').map(x=>({...x,read:!!x.read}));}
function getAllProviderNotifications(){
 try{const data=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(data)?normalize(data):seed.map(x=>({...x}));}
 catch{return seed.map(x=>({...x}));}
}
export function getProviderNotifications(){
 const active=String(getActiveProviderOrganizationId());
 return getAllProviderNotifications().filter(item=>String(item.organizationId??"1")===active);
}
function put(items){localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new Event(EVENT));return items;}
export function markProviderNotificationRead(id){
 const active=String(getActiveProviderOrganizationId());
 return put(getAllProviderNotifications().map(item=>String(item.organizationId??"1")===active&&item.id===id?{...item,read:true}:item));
}
export function markAllProviderNotificationsRead(){
 const active=String(getActiveProviderOrganizationId());
 return put(getAllProviderNotifications().map(item=>String(item.organizationId??"1")===active?{...item,read:true}:item));
}
export function subscribeProviderNotifications(callback){window.addEventListener(EVENT,callback);window.addEventListener('storage',callback);return()=>{window.removeEventListener(EVENT,callback);window.removeEventListener('storage',callback);};}
export function resetProviderNotifications(){localStorage.removeItem(KEY);window.dispatchEvent(new Event(EVENT));}
