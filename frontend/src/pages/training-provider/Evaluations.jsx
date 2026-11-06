import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Printer, Search, SlidersHorizontal, ArrowDownUp, Hourglass, CircleCheck, Star, GraduationCap, Plus, Eye, X, Check, AlertCircle, ChevronLeft } from 'lucide-react';
import Header from '../../components/training-provider/Header';
import Sidebar from '../../components/training-provider/Sidebar';
import ProviderFooter from '../../components/training-provider/ProviderFooter';
import { getTrainees, subscribeTrainees, saveEvaluation, exportTraineesCsv } from './traineesStore';

const criteria = ['الالتزام بالحضور والمواعيد', 'جودة العمل المنجز', 'المهارات الفنية', 'العمل ضمن فريق', 'المبادرة وتحمل المسؤولية'];
const button = 'inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#E0E7F2] bg-white px-4 text-[13px] text-[#17233B] hover:bg-[#F8FAFC]';
const primary = 'inline-flex h-10 items-center justify-center gap-2 rounded-[7px] bg-[#09379A] px-4 text-[12px] font-semibold text-white hover:bg-[#072E85]';
const demoNames = ['أمل أحمد صيام', 'محمد إبراهيم رضوان', 'مصطفى هاني العرجا'];
function normalize(t) { return { ...t, evaluationStatus: t.evaluation ? 'completed' : t.status === 'not_started' ? 'later' : 'pending' }; }
function Pill({ status }) { const data = { pending: ['بانتظار التقييم', 'bg-[#FFE5D8] text-[#BF4A18]'], completed: ['مكتمل', 'bg-[#DDFBE8] text-[#16843E]'], later: ['قيد المتابعة', 'bg-[#EDF2F8] text-[#64748B]'] }[status]; return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] ${data[1]}`}>● {data[0]}</span>; }
function Modal({ children, close }) { return <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}><div role="dialog" aria-modal="true" dir="rtl" className="max-h-[92dvh] w-full max-w-[680px] overflow-y-auto rounded-[13px] bg-white p-7 shadow-2xl sm:p-8">{children}</div></div>; }
function Stat({ Icon, title, value, sub, bg, fg }) { return <div className="rounded-[12px] border border-[#E0E7F2] bg-white p-5"><div className="flex items-center justify-between gap-3"><span className="text-[13px] font-semibold">{title}</span><span className="flex h-10 w-10 items-center justify-center rounded-[8px]" style={{ backgroundColor: bg, color: fg }}><Icon size={21}/></span></div><div className="mt-5 flex items-end gap-2"><b className="text-[34px] leading-none text-[#092B78]">{value}</b><small className="pb-1 text-[11px] text-[#64748B]">{sub}</small></div></div>; }

export default function Evaluations() {
  const navigate = useNavigate();
  const [items, setItems] = useState(getTrainees);
  const [mobile, setMobile] = useState(false);
  const [tab, setTab] = useState('pending');
  const [query, setQuery] = useState('');
  const [popover, setPopover] = useState('');
  const [filterOpportunity, setFilterOpportunity] = useState('');
  const [filterSupervisor, setFilterSupervisor] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [scores, setScores] = useState([0, 0, 0, 0, 0]);
  const [note, setNote] = useState('');
  const [validation, setValidation] = useState(false);
  const [toast, setToast] = useState('');
  const [logout, setLogout] = useState(false);
  useEffect(() => subscribeTrainees(() => setItems(getTrainees())), []);
  const rows = useMemo(() => items.map(normalize), [items]);
  const completed = rows.filter(t => t.evaluationStatus === 'completed');
  const rated = completed.flatMap(t => t.evaluation?.scores || []);
  const average = rated.length ? (rated.reduce((a,b) => a + b, 0) / rated.length).toFixed(1) : '0.0';
  const completionRate = rows.length ? Math.round(completed.length / rows.length * 100) : 0;
  const counts = { pending: rows.filter(t=>t.evaluationStatus==='pending').length, completed: completed.length, later: rows.filter(t=>t.evaluationStatus==='later').length, all: rows.length };
  const opportunities = [...new Set(rows.map(x => x.opportunity))];
  const supervisors = [...new Set(rows.map(x => x.supervisor))];
  const filtered = useMemo(() => rows.filter(t =>
    (tab === 'all' || t.evaluationStatus === tab) &&
    (!query || `${t.name} ${t.studentId}`.toLowerCase().includes(query.toLowerCase())) &&
    (!filterOpportunity || t.opportunity === filterOpportunity) &&
    (!filterSupervisor || t.supervisor === filterSupervisor)
  ).sort((a,b) => sort === 'score' ? (b.evaluation?.scores.reduce((x,y)=>x+y,0) || 0) - (a.evaluation?.scores.reduce((x,y)=>x+y,0) || 0) : a.name.localeCompare(b.name, 'ar')), [rows, tab, query, filterOpportunity, filterSupervisor, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / 8));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * 8, current * 8);
  const openEvaluation = t => { setTarget(t); setScores(t.evaluation?.scores?.slice() || [0,0,0,0,0]); setNote(t.evaluation?.note || ''); setValidation(false); };
  const submit = () => { setValidation(true); if (scores.some(n => n < 1 || n > 5)) return; const result = saveEvaluation(target.id, scores, note); if (!result.ok) { setToast(result.message); return; } setTarget(null); setToast('تم حفظ التقييم بنجاح'); };
  const exportCsv = () => { // Reuse existing CSV exporter for names and tracking, with the filtered trainees
    exportTraineesCsv(filtered);
    setPopover('');
  };
  return <div dir="rtl" className="flex h-dvh overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
    <Sidebar open={mobile} onClose={() => setMobile(false)} onLogout={() => setLogout(true)} onUnavailable={name => setToast(`صفحة «${name}» غير متاحة بعد`)}/>
    <div className="provider-page-scroll h-dvh min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden flex flex-col"><Header onMenu={()=>setMobile(true)} onLogout={()=>setLogout(true)} onUnavailable={name=>setToast(`صفحة «${name}» غير متاحة بعد`)}/>
      <main className="mx-auto w-full max-w-[1500px] flex-1 p-4 sm:p-6 lg:px-8">
        <div className="text-[12px] text-[#64748B]"><button onClick={()=>navigate('/training-provider/dashboard')}>لوحة التحكم</button><ChevronLeft className="mx-2 inline" size={14}/><b className="text-[#17233B]">التقييمات</b></div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-[30px] font-bold">التقييمات</h1><p className="text-[13px] text-[#64748B]">قيّم أداء المتدربين على معايير الكلية وتابع ما اكتمل منها.</p></div><div className="relative"><button className={button} onClick={()=>setPopover(x=>x==='export'?'':'export')}><Download size={17}/>تصدير</button>{popover==='export'&&<div className="absolute left-0 top-12 z-20 w-52 rounded-lg border bg-white p-2 shadow-lg"><button className="block w-full p-2 text-right text-sm hover:bg-slate-50" onClick={exportCsv}>تصدير CSV (Excel)</button><button className="flex w-full items-center gap-2 p-2 text-right text-sm hover:bg-slate-50" onClick={()=>{setPopover('');window.print()}}><Printer size={16}/> حفظ PDF / طباعة</button></div>}</div></div>
        <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4"><Stat Icon={Hourglass} title="بانتظار التقييم" value={counts.pending} sub="متدرب" bg="#FFE5D8" fg="#B93813"/><Stat Icon={CircleCheck} title="تقييمات مكتملة" value={counts.completed} sub="تقييم" bg="#DDFBE8" fg="#15803D"/><Stat Icon={Star} title="متوسط التقييم" value={average} sub="من 5" bg="#DDF6FD" fg="#047BA2"/><Stat Icon={GraduationCap} title="نسبة إكمال التدريب" value={completionRate} sub="%" bg="#E7EDF8" fg="#09379A"/></div>
        <div className="mt-6 flex flex-wrap items-center gap-3"><div className="relative min-w-[220px] flex-1"><Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={18}/><input value={query} onChange={e=>{setQuery(e.target.value);setPage(1)}} placeholder="ابحث باسم المتدرب..." className="h-11 w-full rounded-lg border border-[#E0E7F2] bg-white pr-11 pl-3 text-sm outline-none focus:border-[#09379A]"/></div><div className="relative"><button className={button} onClick={()=>setPopover(x=>x==='filter'?'':'filter')}><SlidersHorizontal size={17}/>تصفية</button>{popover==='filter'&&<div className="absolute left-0 top-12 z-20 w-64 rounded-lg border bg-white p-4 shadow-lg"><label className="text-xs">الفرصة</label><select className="mt-1 mb-3 w-full rounded-md border p-2 text-sm" value={filterOpportunity} onChange={e=>{setFilterOpportunity(e.target.value);setPage(1)}}><option value="">الكل</option>{opportunities.map(o=><option key={o}>{o}</option>)}</select><label className="text-xs">المشرف</label><select className="mt-1 w-full rounded-md border p-2 text-sm" value={filterSupervisor} onChange={e=>{setFilterSupervisor(e.target.value);setPage(1)}}><option value="">الكل</option>{supervisors.map(s=><option key={s}>{s}</option>)}</select><button className="mt-3 text-xs text-[#09379A]" onClick={()=>{setFilterOpportunity('');setFilterSupervisor('');setPopover('')}}>مسح التصفية</button></div>}</div><div className="relative"><button className={button} onClick={()=>setPopover(x=>x==='sort'?'':'sort')}><ArrowDownUp size={17}/>ترتيب</button>{popover==='sort'&&<div className="absolute left-0 top-12 z-20 w-48 rounded-lg border bg-white p-2 shadow-lg">{[['name','الاسم'],['score','الأعلى تقييمًا']].map(([key,label])=><button key={key} className={`block w-full rounded p-2 text-right text-sm ${sort===key?'font-bold text-[#09379A]':''}`} onClick={()=>{setSort(key);setPopover('')}}>{label}</button>)}</div>}</div></div>
        <div className="mt-3 flex flex-wrap gap-2">{[['pending','بانتظار التقييم'],['completed','مكتملة'],['later','قيد المتابعة'],['all','الكل']].map(([key,label])=><button key={key} onClick={()=>{setTab(key);setPage(1)}} className={`rounded-full border px-4 py-2 text-xs ${tab===key?'border-[#09379A] bg-[#09379A] text-white':'border-[#E0E7F2] bg-white text-[#64748B]'}`}>{label} {counts[key]}</button>)}</div>
        <section className="mt-3 min-h-[355px] rounded-xl border border-[#E0E7F2] bg-white p-5"><div className="overflow-x-auto"><table className="w-full min-w-[780px] text-right text-[12px]"><thead><tr className="bg-[#F0F4F9] text-[#64748B]">{['المتدرب','الفرصة','المشرف','التقييم','الحالة','إجراءات'].map(v=><th key={v} className="px-4 py-4 font-medium">{v}</th>)}</tr></thead><tbody>{shown.map(t=><tr key={t.id} className="border-b border-[#E0E7F2]"><td className="px-4 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E7EDF8] font-bold text-[#09379A]">{t.name.charAt(0)}</span><div><b className="block">{t.name}</b><small className="text-[#64748B]">{t.studentId}</small></div></div></td><td className="px-4">{t.opportunity}</td><td className="px-4">{t.supervisor}</td><td className="px-4">{t.evaluation ? `${(t.evaluation.scores.reduce((a,b)=>a+b,0)/5).toFixed(1)} / 5` : '—'}</td><td className="px-4"><Pill status={t.evaluationStatus}/></td><td className="px-4">{t.evaluationStatus==='pending'?<button className={primary} onClick={()=>openEvaluation(t)}><Plus size={16}/>إضافة تقييم</button>:<button className={`${button} h-9`} onClick={()=>t.evaluation?setViewTarget(t):navigate(`/training-provider/trainees/${t.id}`)}><Eye size={16}/>{t.evaluation?'عرض':'الملف'}</button>}</td></tr>)}</tbody></table></div>{shown.length===0&&<div className="flex min-h-[240px] flex-col items-center justify-center"><Star size={40} className="text-[#09379A]"/><h3 className="mt-3 font-bold">لا توجد تقييمات مطابقة</h3><p className="mt-2 text-sm text-[#64748B]">جرّب تغيير حالة التقييم أو البحث.</p></div>}{filtered.length>0&&<div className="mt-4 flex items-center justify-between gap-2 text-xs text-[#64748B]"><span>عرض {(current-1)*8+1} - {Math.min(current*8,filtered.length)} من {filtered.length} متدربًا</span><div className="flex items-center gap-2"><button className={button} disabled={current===1} onClick={()=>setPage(x=>Math.max(1,x-1))}>السابق</button><span className="rounded-full bg-[#09379A] px-4 py-3 text-white">{current}</span><button className={button} disabled={current>=pages} onClick={()=>setPage(x=>Math.min(pages,x+1))}>التالي</button></div></div>}</section>
        <ProviderFooter/>
      </main>
    </div>
    {target && (
      <Modal close={() => setTarget(null)}>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE5D8] text-[#B93813]">
          <Star size={26} strokeWidth={1.8} />
        </div>
        <h2 className="mt-4 text-[23px] font-bold">{target.evaluation ? 'تعديل التقييم' : 'إضافة تقييم'}</h2>
        <p className="mt-3 text-sm text-[#64748B]">تقييم أداء {target.name} في «{target.opportunity}»</p>
        <div className="mt-5">
          {criteria.map((label, i) => (
            <div key={label} className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E0E7F2] py-4 last:border-b-0">
              <span className="text-sm">{label}</span>
              <div className="flex gap-2" dir="ltr">
                {[5, 4, 3, 2, 1].map(n => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${label}: ${n} من 5`}
                    aria-pressed={scores[i] === n}
                    onClick={() => setScores(old => old.map((v, j) => j === i ? n : v))}
                    className={`h-11 w-11 rounded-lg border text-sm transition ${
                      scores[i] === n
                        ? 'border-[#09379A] bg-[#09379A] font-bold text-white'
                        : validation && scores[i] === 0
                          ? 'border-red-500 bg-[#FEE2E2] text-[#17233B]'
                          : 'border-[#E0E7F2] bg-white hover:bg-slate-50'
                    }`}
                  >{n}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {validation && scores.some(x => x === 0) && (
          <p className="mt-3 flex items-center gap-2 text-xs text-[#64748B]">
            <AlertCircle size={14} /> قيّم جميع المعايير قبل الحفظ
          </p>
        )}
        <label htmlFor="evaluation-notes" className="mt-5 block text-sm">ملاحظات عامة</label>
        <textarea
          id="evaluation-notes"
          rows={4}
          placeholder="نقاط القوة وجوانب التحسين..."
          className="mt-2 w-full rounded-lg border border-[#E0E7F2] p-3 text-sm outline-none focus:border-[#09379A]"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <div className="mt-4 flex justify-start gap-3">
          <button type="button" className={primary} onClick={submit}><Check size={17} />حفظ التقييم</button>
          <button type="button" className={button} onClick={() => setTarget(null)}>إلغاء</button>
        </div>
      </Modal>
    )}
    {viewTarget && viewTarget.evaluation && (
      <Modal close={() => setViewTarget(null)}>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DDFBE8] text-[#16843E]">
          <Star size={26} strokeWidth={1.8} />
        </div>
        <h2 className="mt-4 text-[23px] font-bold">تقييم المتدرب</h2>
        <p className="mt-3 text-sm text-[#64748B]">
          {viewTarget.name} · قيّمه {viewTarget.evaluation.by || 'مشرف جهة التدريب'} بتاريخ {viewTarget.evaluation.date || '—'}
        </p>
        <div className="mt-6">
          {criteria.map((label, i) => {
            const score = Number(viewTarget.evaluation.scores?.[i]) || 0;
            return (
              <div key={label} className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E0E7F2] py-3">
                <span className="text-sm">{label}</span>
                <div className="flex items-center gap-2" dir="ltr">
                  <b className="ml-3 text-[12px] text-[#17233B]">{score}/5</b>
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star
                      key={n}
                      size={19}
                      strokeWidth={1.7}
                      fill={n <= score ? '#F59E0B' : 'none'}
                      color={n <= score ? '#F59E0B' : '#CBD5E1'}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 text-right">
          <p className="text-xs text-[#64748B]">المعدل العام</p>
          <p className="mt-1 text-sm font-medium">
            {(viewTarget.evaluation.scores.reduce((total, n) => total + Number(n || 0), 0) / 5).toFixed(1)} / 5
          </p>
          <p className="mt-5 text-xs text-[#64748B]">الملاحظات</p>
          <p className="mt-2 text-sm">{viewTarget.evaluation.note || 'لا توجد ملاحظات'}</p>
        </div>
        <div className="mt-6 flex justify-start">
          <button className={button} type="button" onClick={() => setViewTarget(null)}>إغلاق</button>
        </div>
      </Modal>
    )}
    {logout&&<Modal close={()=>setLogout(false)}><h2 className="text-xl font-bold">تسجيل الخروج</h2><p className="my-5 text-sm">هل تريد تسجيل الخروج من بوابة جهة التدريب؟</p><div className="flex gap-3"><button className="rounded-lg bg-red-600 px-5 py-3 text-sm text-white" onClick={()=>navigate('/training-provider/login')}>تسجيل الخروج</button><button className={button} onClick={()=>setLogout(false)}>إلغاء</button></div></Modal>}
    {toast&&<div role="status" className="fixed bottom-5 left-5 z-[100] flex max-w-[320px] items-center gap-3 rounded-lg border bg-white p-4 text-sm shadow-xl">{toast}<button onClick={()=>setToast('')}><X size={16}/></button></div>}
  </div>;
}
