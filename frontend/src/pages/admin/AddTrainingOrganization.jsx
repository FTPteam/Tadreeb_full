import AcademicFooter from "../../components/shared/AcademicFooter";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Building2, Save, ArrowRight } from "lucide-react";
import Sidebar from "../../components/admin/Sidebar";
import AdminHeader from "../../components/admin/Header";
import { createOrganization } from "./trainingOrganizationsStore";

const FIELDS = [
  {key:"name",label:"اسم جهة التدريب",required:true},
  {key:"type",label:"نوع الجهة",required:true},
  {key:"location",label:"الموقع",required:true},
  {key:"phone",label:"رقم الهاتف",required:true},
  {key:"email",label:"البريد الإلكتروني لتسجيل الدخول",type:"email",required:true},
  {key:"supervisor",label:"المشرف الميداني"},
  {key:"seats",label:"عدد المقاعد",type:"number"}
];
export default function AddTrainingOrganization() {
  const navigate = useNavigate();
  const [form,setForm] = useState({name:"",type:"",location:"",phone:"",email:"",supervisor:"",seats:"0"});
  const [error,setError]=useState("");
  const [saving,setSaving]=useState(false);
  const submit=e=>{
    e.preventDefault(); setError("");
    const seats=Number(form.seats);
    if (!Number.isInteger(seats) || seats<0) {setError("عدد المقاعد غير صالح");return;}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {setError("يرجى إدخال بريد إلكتروني صحيح لاستخدامه في تسجيل الدخول.");return;}
    setSaving(true);
    try {
      const org=createOrganization({...form,seats,capacity:seats});
      navigate(`/admin/training-organizations/${encodeURIComponent(org.id)}`,{replace:true,state:{successMessage:"تمت إضافة جهة التدريب وهي بانتظار الاعتماد."}});
    } catch(err) {setError(err.message || "تعذر حفظ جهة التدريب");setSaving(false);}
  };
  return (
    <div dir="rtl" className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#111C2D]">
      <Sidebar />
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1450px]">
            <nav className="mb-6 flex items-center gap-2 text-[12px] text-[#64748B]">
              <button type="button" onClick={()=>navigate("/admin/dashboard")}>الرئيسية</button><ChevronLeft size={15}/>
              <button type="button" onClick={()=>navigate("/admin/training-organizations")}>جهات التدريب</button><ChevronLeft size={15}/>
              <span className="font-bold text-[#111C2D]">إضافة جهة تدريب</span>
            </nav>
            <div className="mb-6 flex items-center justify-between gap-3">
              <div><h1 className="text-[25px] font-bold">إضافة جهة تدريب</h1><p className="mt-1 text-[12px] text-[#64748B]">تسجيل جهة جديدة لعرضها ضمن طلبات الاعتماد</p></div>
              <button type="button" onClick={()=>navigate("/admin/training-organizations")} className="flex items-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 py-3 text-[12px]"><ArrowRight size={16}/>العودة</button>
            </div>
            <form onSubmit={submit} className="rounded-[12px] border border-[#E0E7F2] bg-white p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-[#E6EBF5] pb-4 text-[#09379A]"><Building2 size={22}/><h2 className="text-[17px] font-bold">بيانات جهة التدريب</h2></div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {FIELDS.map(field=><div key={field.key}>
                  <label htmlFor={`org-${field.key}`} className="mb-2 block text-[12px] font-semibold">{field.label}{field.required ? " *" : ""}</label>
                  <input id={`org-${field.key}`} required={!!field.required} type={field.type || "text"} min={field.type==="number"?0:undefined} value={form[field.key]} onChange={e=>setForm(prev=>({...prev,[field.key]:e.target.value}))} className="h-[47px] w-full rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[12px] outline-none focus:border-[#09379A]" />
                </div>)}
              </div>
              {error && <p role="alert" className="mt-4 text-[12px] text-[#DC2626]">{error}</p>}
              <div className="mt-6 flex justify-end"><button disabled={saving} type="submit" className="flex h-[44px] items-center gap-2 rounded-[8px] bg-[#09379A] px-5 text-[12px] font-bold text-white disabled:opacity-50"><Save size={17}/>حفظ الجهة</button></div>
            </form>
          </div>
        
            <AcademicFooter audience="admin" />
          </main>
      </div>
    </div>
  );
}
