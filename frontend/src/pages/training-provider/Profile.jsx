import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle, Building2, Check, CheckCircle2, ChevronLeft, Download,
  FileText, Image as ImageIcon, LockKeyhole, Pencil, RefreshCw,
  Send, Upload, X,
} from 'lucide-react';
import Header from '../../components/training-provider/Header';
import Sidebar from '../../components/training-provider/Sidebar';
import ProviderFooter from '../../components/training-provider/ProviderFooter';
import {
  DEFAULT_DOCUMENTS, DEFAULT_STAGES, DEFAULT_PROFILE, SPECIALTIES,
  PROFILE_EVENT, getProviderProfile, getRenewalRequests,
  saveProviderProfile, saveRenewalRequest, resubmitProviderAccreditation,
} from './providerProfileStore';
import { getActiveProviderOrganization, PROVIDER_ORGANIZATION_EVENT } from '../../services/providerOrganization';
import { ORGANIZATIONS_EVENT } from '../admin/trainingOrganizationsStore';

const blue = '#09379A';
const inputStyle = 'h-[47px] w-full rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[13px] outline-none focus:border-[#09379A] focus:ring-2 focus:ring-[#09379A]/10';

function Card({ title, children, className = '' }) {
  return <section className={`rounded-[12px] border border-[#E0E7F2] bg-white p-6 ${className}`}>
    <h2 className="mb-4 border-b border-[#E0E7F2] pb-4 text-[18px] font-bold text-[#092B78]">{title}</h2>
    {children}
  </section>;
}
function Info({ label, value }) {
  return <div className="text-right"><p className="text-[12px] text-[#64748B]">{label}</p><p className="mt-1 text-[13px] font-semibold text-[#17233B]">{value || '—'}</p></div>;
}
function Field({ label, field, value, onChange, error, required, type = 'text' }) {
  return <div><label htmlFor={`profile-${field}`} className="mb-2 block text-[13px] font-semibold">{label}{required && <span className="mr-1 text-red-600">*</span>}</label>
    <input id={`profile-${field}`} type={type} value={value} onChange={e => onChange(field, e.target.value)} aria-invalid={!!error}
      className={`${inputStyle} ${error ? '!border-red-500' : ''}`} />
    {error && <p role="alert" className="mt-1 flex items-center gap-1 text-[11px] text-red-600"><AlertCircle size={13}/>{error}</p>}
  </div>;
}
function Dialog({ children, onClose, width = 'max-w-[720px]' }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/50 px-4 py-5" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div role="dialog" aria-modal="true" dir="rtl" className={`${width} max-h-[94dvh] w-full overflow-y-auto rounded-[14px] bg-white p-6 text-right shadow-2xl sm:p-8`}>{children}</div>
  </div>;
}
function ActionModalFooter({ onClose, onSubmit, action, icon: Icon = Check, danger = false }) {
  return <div className="mt-6 flex flex-wrap items-center gap-3">
    <button type="button" onClick={onSubmit} className={`flex h-[44px] items-center gap-2 rounded-lg px-5 text-[13px] font-semibold text-white ${danger ? 'bg-[#C91C1C]' : 'bg-[#09379A]'}`}><Icon size={17}/>{action}</button>
    <button type="button" onClick={onClose} className="h-[44px] rounded-lg border border-[#E0E7F2] px-5 text-[13px] hover:bg-[#F8FAFC]">إلغاء</button>
  </div>;
}
function EditModal({ profile, onClose, onSaved }) {
  const [draft, setDraft] = useState(() => ({ ...profile, specialties: [...profile.specialties] }));
  const [errors, setErrors] = useState({});
  const [logo, setLogo] = useState(null);
  const uploadRef = useRef(null);
  const update = (key, value) => { setDraft(p => ({ ...p, [key]: value })); setErrors(p => ({ ...p, [key]: '' })); };
  const toggleSpecialty = value => setDraft(p => ({ ...p, specialties: p.specialties.includes(value) ? p.specialties.filter(x => x !== value) : [...p.specialties, value] }));
  const chooseLogo = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 300 * 1024) {
      setErrors(p => ({ ...p, logo: 'يُسمح بصور PNG أو JPG بحجم لا يتجاوز 300 كيلوبايت' }));
      e.target.value = '';
      return;
    }
    setLogo(file); setErrors(p => ({ ...p, logo: '' }));
  };
  const submit = e => {
    e.preventDefault();
    const next = {};
    if (!draft.name.trim()) next.name = 'هذا الحقل مطلوب';
    if (!draft.activity.trim()) next.activity = 'هذا الحقل مطلوب';
    if (!draft.location.trim()) next.location = 'هذا الحقل مطلوب';
    if (!draft.email.trim()) next.email = 'هذا الحقل مطلوب';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) next.email = 'صيغة البريد الإلكتروني غير صحيحة';
    if (!draft.phone.trim()) next.phone = 'هذا الحقل مطلوب';
    if (!draft.capacity || !Number.isInteger(Number(draft.capacity)) || Number(draft.capacity) < 1) next.capacity = 'أدخل عددًا صحيحًا أكبر من صفر';
    if (!draft.bio.trim()) next.bio = 'هذا الحقل مطلوب';
    if (!draft.specialties.length) next.specialties = 'اختر تخصصًا واحدًا على الأقل';
    setErrors(next);
    if (Object.keys(next).length) return;
    try {
      // Only the filename is stored. An actual file upload requires backend storage.
      const result = saveProviderProfile({ ...draft, name: draft.name.trim(), email: draft.email.trim(), capacity: Number(draft.capacity), logoName: logo?.name || draft.logoName });
      onSaved(result, logo);
    } catch { setErrors(p => ({ ...p, submit: 'تعذر حفظ البيانات في المتصفح' })); }
  };
  return <Dialog onClose={onClose}>
    <span className="mb-4 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#E7EDF8] text-[#09379A]"><Building2 size={24}/></span>
    <h2 className="text-[21px] font-bold">تعديل بيانات الجهة</h2>
    <p className="mt-2 text-[13px] text-[#64748B]">ستظهر هذه البيانات للطلاب عند الاطلاع على فرص جهتكم.</p>
    <form onSubmit={submit} noValidate className="mt-6 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="اسم الجهة" field="name" required value={draft.name} onChange={update} error={errors.name}/>
        <Field label="نوع النشاط" field="activity" required value={draft.activity} onChange={update} error={errors.activity}/>
        <Field label="الموقع" field="location" required value={draft.location} onChange={update} error={errors.location}/>
        <Field label="سنة التأسيس" field="established" value={draft.established} onChange={update}/>
        <Field label="البريد الإلكتروني" field="email" required type="email" value={draft.email} onChange={update} error={errors.email}/>
        <Field label="الهاتف" field="phone" required type="tel" value={draft.phone} onChange={update} error={errors.phone}/>
        <Field label="الطاقة الاستيعابية (متدربون)" field="capacity" required type="number" value={draft.capacity} onChange={update} error={errors.capacity}/>
      </div>
      <div><label className="mb-2 block text-[13px] font-semibold">شعار الجهة</label>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-[#A6B8D5] bg-[#F8FAFC] p-4">
          <div className="flex items-center gap-3"><span className="rounded-lg bg-[#E7EDF8] p-3 text-[#09379A]"><ImageIcon size={19}/></span><div><p className="text-[12px] font-bold">{logo?.name || draft.logoName || 'لم يتم اختيار ملف'}</p><p className="text-[11px] text-[#64748B]">حتى 300 كيلوبايت، JPG أو PNG</p></div></div>
          <input ref={uploadRef} type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" onChange={chooseLogo} className="hidden"/>
          <button type="button" onClick={() => uploadRef.current?.click()} className="flex items-center gap-2 rounded-lg border border-[#E0E7F2] bg-white px-4 py-2 text-[12px]"><Upload size={15}/>رفع شعار</button>
        </div>{errors.logo && <p className="mt-1 text-[11px] text-red-600">{errors.logo}</p>}
      </div>
      <div><label htmlFor="provider-bio" className="mb-2 block text-[13px] font-semibold">نبذة عن الجهة <span className="text-red-600">*</span></label><textarea id="provider-bio" rows={4} value={draft.bio} onChange={e => update('bio', e.target.value)} className={`${inputStyle} h-auto min-h-[120px] py-3 ${errors.bio ? '!border-red-500' : ''}`}/>{errors.bio && <p role="alert" className="mt-1 text-[11px] text-red-600">{errors.bio}</p>}</div>
      <div><p className="mb-3 text-[13px] font-semibold">التخصصات المقبولة</p><div className="flex flex-wrap gap-2">{SPECIALTIES.map(item => <button key={item} type="button" onClick={() => toggleSpecialty(item)} aria-pressed={draft.specialties.includes(item)} className={`rounded-full border px-3 py-2 text-[12px] ${draft.specialties.includes(item) ? 'border-[#09379A] bg-[#EEF3FF] text-[#09379A]' : 'border-[#E0E7F2] text-[#64748B]'}`}>{item}</button>)}</div>{errors.specialties && <p role="alert" className="mt-2 text-[11px] text-red-600">{errors.specialties}</p>}</div>
      {errors.submit && <p role="alert" className="text-[12px] text-red-600">{errors.submit}</p>}
      <ActionModalFooter onClose={onClose} onSubmit={submit} action="حفظ التعديلات"/>
    </form>
  </Dialog>;
}
function RenewalModal({ onClose, onSaved }) {
  const [documentName, setDocumentName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const submit = e => {
    e.preventDefault();
    if (!documentName.trim()) { setError('هذا الحقل مطلوب'); return; }
    try { const data = saveRenewalRequest({ documentName, notes }); onSaved(data); }
    catch { setError('تعذر حفظ الطلب في المتصفح'); }
  };
  return <Dialog onClose={onClose} width="max-w-[520px]">
    <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE5DA] text-[#B93813]"><RefreshCw size={26}/></span>
    <h2 className="text-[21px] font-bold">تجديد الاعتماد</h2><p className="mt-3 text-[13px] leading-7 text-[#64748B]">سيُرسل الطلب لمكتب التدريب الميداني في الكلية لمراجعته.</p>
    <form onSubmit={submit} noValidate className="mt-6"><label htmlFor="renew-document" className="mb-2 block text-[13px] font-semibold">مستند حديث (سجل تجاري أو ترخيص) <span className="text-red-600">*</span></label>
      <input id="renew-document" value={documentName} onChange={e => { setDocumentName(e.target.value); setError(''); }} placeholder="اسم المستند أو رقمه" aria-invalid={!!error} className={`${inputStyle} ${error ? '!border-red-500' : ''}`}/>
      {error && <p role="alert" className="mt-2 flex items-center gap-1 text-[11px] text-red-600"><AlertCircle size={13}/>{error}</p>}
      <label htmlFor="renew-notes" className="mb-2 mt-6 block text-[13px] font-semibold">ملاحظات (اختياري)</label><textarea id="renew-notes" value={notes} onChange={e => setNotes(e.target.value)} rows={4} className={`${inputStyle} h-auto min-h-[115px] py-3`}/>
      <ActionModalFooter onClose={onClose} onSubmit={submit} action="إرسال طلب التجديد" icon={Send}/>
    </form>
  </Dialog>;
}
function LogoutModal({ onClose, onConfirm }) {
  return <Dialog onClose={onClose} width="max-w-[520px]"><span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE5DA] text-[#B93813]"><LockKeyhole size={25}/></span><h2 className="text-[20px] font-bold">تسجيل الخروج</h2><p className="mt-3 text-[13px] leading-7 text-[#64748B]">هل تريد تسجيل الخروج من بوابة جهة التدريب؟</p><ActionModalFooter onClose={onClose} onSubmit={onConfirm} action="تسجيل الخروج" danger/></Dialog>;
}
export default function Profile() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [profile, setProfile] = useState(getProviderProfile);
  const [organization, setOrganization] = useState(getActiveProviderOrganization);
  const [tab, setTab] = useState('data');
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState('');
  const [renewals, setRenewals] = useState(getRenewalRequests);
  const [logoPreview, setLogoPreview] = useState(null);
  useEffect(() => {
    const reload = () => { setProfile(getProviderProfile()); setOrganization(getActiveProviderOrganization()); setRenewals(getRenewalRequests()); };
    window.addEventListener(PROFILE_EVENT, reload);
    window.addEventListener(PROVIDER_ORGANIZATION_EVENT, reload);
    window.addEventListener(ORGANIZATIONS_EVENT, reload);
    return () => {
      window.removeEventListener(PROFILE_EVENT, reload);
      window.removeEventListener(PROVIDER_ORGANIZATION_EVENT, reload);
      window.removeEventListener(ORGANIZATIONS_EVENT, reload);
    };
  }, []);
  useEffect(() => () => { if (logoPreview) URL.revokeObjectURL(logoPreview); }, [logoPreview]);
  const onSaved = (_value, file) => {
    if (file) setLogoPreview(URL.createObjectURL(file));
    setModal(null); setNotice('تم حفظ بيانات الجهة محليًا. رفع الشعار إلى الخادم غير مفعّل بعد.');
  };
  const onRenewed = () => { setModal(null); setNotice('تم حفظ طلب التجديد تجريبيًا في المتصفح، ولم يُرسل للكلية بعد.'); };
  const resubmit = () => {
    if (resubmitProviderAccreditation()) {
      setOrganization(getActiveProviderOrganization());
      setProfile(getProviderProfile());
      setNotice('تمت إعادة إرسال طلب الاعتماد إلى الإدارة.');
    }
  };
  const unavailable = name => setNotice(`صفحة «${name}» غير متاحة حاليًا.`);
  return <div dir="rtl" className="flex h-dvh overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
    <Sidebar open={mobile} onClose={() => setMobile(false)} onLogout={() => setModal('logout')} onUnavailable={unavailable}/>
    <div className="provider-page-scroll h-dvh min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
      <Header onMenu={() => setMobile(true)} onLogout={() => setModal('logout')} onUnavailable={unavailable}/>
      <main className="mx-auto w-full max-w-[1450px] flex-1 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="mb-1 flex items-center gap-2 text-[12px] text-[#64748B]"><button onClick={() => navigate('/training-provider/dashboard')}>لوحة التحكم</button><ChevronLeft size={15}/><strong className="text-[#17233B]">ملف الجهة</strong></div>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div><h1 className="text-[29px] font-bold leading-[1.35]">ملف الجهة</h1><p className="mt-1 text-[13px] text-[#64748B]">{profile.name}</p></div>
          <button onClick={() => setModal(tab === 'data' ? 'edit' : 'renew')} className="flex h-[44px] items-center gap-2 rounded-lg bg-[#09379A] px-5 text-[13px] font-semibold text-white hover:bg-[#072F86]">{tab === 'data' ? <Pencil size={17}/> : <RefreshCw size={17}/>}{tab === 'data' ? 'تعديل البيانات' : 'تجديد الاعتماد'}</button>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">{[['data', 'بيانات الجهة'], ['accreditation', 'الاعتماد والمستندات']].map(([value, label]) => <button key={value} onClick={() => setTab(value)} className={`rounded-full border px-5 py-2 text-[12px] font-semibold ${tab === value ? 'border-[#09379A] bg-[#09379A] text-white' : 'border-[#E0E7F2] bg-white text-[#64748B]'}`}>{label}</button>)}</div>
        {tab === 'data' ? <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <Card title="المعلومات الأساسية"><div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-2"><Info label="اسم الجهة" value={profile.name}/><Info label="نوع النشاط" value={profile.activity}/><Info label="الموقع" value={profile.location}/><Info label="سنة التأسيس" value={profile.established}/><Info label="البريد الإلكتروني" value={profile.email}/><Info label="الهاتف" value={profile.phone}/></div></Card>
            <Card title="نبذة عن الجهة"><p className="text-[13px] leading-8">{profile.bio}</p></Card>
            <Card title="التخصصات المقبولة"><div className="flex flex-wrap gap-2">{profile.specialties.map(value => <span key={value} className="rounded-full bg-[#F1F5F9] px-3 py-1 text-[12px] text-[#475569]">{value}</span>)}</div></Card>
          </div>
          <div className="space-y-6">
            <Card title="شعار الجهة"><div className="flex items-center gap-3"><span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#E7EDF8] text-[#09379A]">{logoPreview ? <img src={logoPreview} alt="معاينة الشعار المختار" className="h-full w-full object-contain"/> : <Building2 size={30}/>}</span><div><p className="text-[13px] font-bold">{profile.name}</p><span className={`rounded-full px-3 py-1 text-[11px] ${organization?.status === 'approved' ? 'bg-[#DCFCE7] text-[#15803D]' : organization?.status === 'rejected' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#FFF0D9] text-[#B54708]'}`}>● {organization?.status === 'approved' ? 'معتمدة' : organization?.status === 'rejected' ? 'مرفوضة' : 'بانتظار الاعتماد'}</span></div></div></Card>
            <Card title="الطاقة الاستيعابية"><div className="grid grid-cols-2 gap-5"><Info label="الطاقة الاستيعابية" value={`${profile.capacity} متدربًا`}/><Info label="المتدربون الحاليون" value={profile.currentTrainees}/><div className="col-span-2"><Info label="المقاعد المتاحة" value={Math.max(0, profile.capacity - profile.currentTrainees)}/></div></div></Card>
          </div>
        </div> : <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <Card title="حالة الاعتماد"><div className={`flex items-center gap-4 rounded-xl border p-5 ${organization?.status === 'approved' ? 'border-[#93E4B5] bg-[#DCFCE7]' : organization?.status === 'rejected' ? 'border-red-200 bg-red-50' : 'border-[#F5D7A5] bg-[#FFF8E8]'}`}><span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white ${organization?.status === 'approved' ? 'bg-[#14833D]' : organization?.status === 'rejected' ? 'bg-[#C81E1E]' : 'bg-[#B7791F]'}`}><CheckCircle2 size={27}/></span><div><h3 className="text-[15px] font-bold">{organization?.status === 'approved' ? 'الجهة معتمدة للتدريب الميداني' : organization?.status === 'rejected' ? 'طلب اعتماد الجهة مرفوض' : 'طلب الاعتماد بانتظار مراجعة الإدارة'}</h3><p className="mt-1 text-[12px] text-[#64748B]">{organization?.reviewNote || (organization?.status === 'approved' ? 'يمكن للجهة نشر فرص التدريب واستقبال الطلبات.' : 'يمكنك استكمال بيانات الجهة، وستتاح صلاحية النشر بعد الاعتماد.')}</p></div></div>{organization?.status === 'rejected' && <button type="button" onClick={resubmit} className="mt-4 flex h-10 items-center gap-2 rounded-lg bg-[#09379A] px-4 text-[12px] font-semibold text-white"><Send size={15}/>إعادة تقديم طلب الاعتماد</button>}</Card>
            <Card title="المستندات">
              {String(organization?.id) !== "1" ? (
                <p className="py-5 text-[12px] leading-7 text-[#64748B]">
                  لم تُرفق مستندات اعتماد بهذه الجهة بعد. يمكن استكمالها عند تفعيل رفع المستندات وربطها بالخادم.
                </p>
              ) : (
                <div className="divide-y divide-[#E0E7F2]">
                  {DEFAULT_DOCUMENTS.map((doc) => (
                    <div key={doc.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-[#E7EDF8] p-3 text-[#09379A]">
                          <FileText size={21} />
                        </span>
                        <div>
                          <p className="text-[13px] font-bold">{doc.name}</p>
                          <p className="text-[11px] text-[#64748B]">
                            {doc.note} {doc.expiration}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotice("هذا المستند تجريبي، ولا يوجد ملف فعلي لتنزيله حاليًا.")}
                        className="flex items-center gap-2 rounded-lg border border-[#E0E7F2] px-4 py-2 text-[12px] hover:bg-[#F8FAFC]"
                      >
                        <Download size={16} />
                        تحميل
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            {!!renewals.length && <p className="text-[12px] text-[#64748B]">لديك {renewals.length} طلب تجديد تجريبي محفوظ محليًا، ولم يُرسل إلى الكلية.</p>}
          </div>
          <Card title="مراحل الاعتماد"><div className="divide-y divide-[#E0E7F2]">{DEFAULT_STAGES.slice(0, organization?.status === 'approved' ? 4 : 2).map((stage, index) => <div key={stage.name} className="flex items-center gap-3 py-4"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${index === 0 ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FFF0D9] text-[#B54708]'}`}><Check size={20}/></span><div><p className="text-[13px] font-bold">{stage.name}</p><p className="text-[11px] text-[#64748B]">{stage.date}</p></div></div>)}</div></Card>
        </div>}
        <ProviderFooter/>
      </main>
    </div>
    {modal === 'edit' && <EditModal profile={profile} onClose={() => setModal(null)} onSaved={onSaved}/>}
    {modal === 'renew' && <RenewalModal onClose={() => setModal(null)} onSaved={onRenewed}/>}
    {modal === 'logout' && <LogoutModal onClose={() => setModal(null)} onConfirm={() => navigate('/training-provider/login')}/>}
    {notice && <div role="status" className="fixed bottom-5 left-5 z-[120] max-w-[440px] rounded-lg bg-[#17233B] px-4 py-3 text-[12px] text-white shadow-xl">{notice}<button onClick={() => setNotice('')} aria-label="إغلاق التنبيه" className="mr-4 text-white"><X size={15}/></button></div>}
  </div>;
}
