import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, CheckCircle2, Clock3, XCircle, Search, ChevronLeft, ClipboardCheck } from "lucide-react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import AcademicFooter from "../../components/shared/AcademicFooter";
import { getRequests, REQUESTS_STORAGE_KEY } from "./trainingRequestsStore";
import { getApplications as getProviderApplications } from "../training-provider/providerApplicationsStore";

const labels = { pending: "بانتظار القرار", approved: "مقبول من الإدارة", rejected: "مرفوض من الإدارة" };
const badge = { pending: "bg-amber-50 text-amber-800", approved: "bg-emerald-50 text-emerald-700", rejected: "bg-red-50 text-red-700" };

export default function Approvals() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(getRequests);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const refresh = () => setRequests(getRequests());
    const onStorage = (event) => {
      if (!event.key || event.key === REQUESTS_STORAGE_KEY || event.key === "cis-provider-applications-v1") refresh();
    };
    window.addEventListener("admin-training-requests-updated", refresh);
    window.addEventListener("cis-provider-applications-updated", refresh);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("admin-training-requests-updated", refresh);
      window.removeEventListener("cis-provider-applications-updated", refresh);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const providerDecisions = getProviderApplications();
  const filtered = useMemo(() => requests.filter((r) =>
    (filter === "all" || r.status === filter) &&
    `${r.fullName || r.studentName || ""} ${r.studentId || ""} ${r.organization || ""} ${r.position || ""} ${r.id || ""}`
      .toLowerCase().includes(query.trim().toLowerCase())), [requests, filter, query]);
  const counts = { all: requests.length, pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length };

  return (
    <div dir="rtl" className="flex h-dvh w-full overflow-hidden bg-[#F8FAFC] font-['Cairo'] text-[#17233B]">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main dir="rtl" className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1400px]">
            <button type="button" onClick={() => navigate("/admin/dashboard")} className="mb-3 inline-flex items-center gap-2 text-[12px] text-[#64748B]">لوحة التحكم <ChevronLeft size={15}/> الاعتمادات</button>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div><h1 className="text-[28px] font-bold text-[#102C61]">اعتمادات طلبات التدريب</h1>
                <p className="mt-2 text-[13px] text-[#64748B]">قرارات الإدارة الأكاديمية على طلبات الطلاب. موافقة جهة التدريب مستقلة، ويبدأ التدريب بعد اكتمال الموافقتين.</p></div>
              <button type="button" onClick={() => navigate("/admin/approvals/training-providers")} className="rounded-lg border border-[#D4DFEF] bg-white px-4 py-3 text-[12px] font-bold text-[#09379A]">طلبات اعتماد جهات التدريب</button>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[[BadgeCheck,"الإجمالي",counts.all],[Clock3,"بانتظار القرار",counts.pending],[CheckCircle2,"مقبولة",counts.approved],[XCircle,"مرفوضة",counts.rejected]].map(([Icon,label,value]) =>
                <div key={label} className="rounded-xl border border-[#E0E7F2] bg-white p-4"><Icon size={20} className="mb-2 text-[#09379A]"/><p className="text-[12px] text-[#64748B]">{label}</p><b className="text-[23px] text-[#102C61]">{value}</b></div>)}
            </div>
            <section className="rounded-xl border border-[#E0E7F2] bg-white p-4 sm:p-6">
              <div className="mb-5 flex flex-wrap gap-3">
                <div className="relative min-w-[220px] flex-1"><Search size={18} className="absolute right-3 top-3 text-[#64748B]"/><input aria-label="بحث عن طلب" value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث بالطالب أو الرقم أو الجهة أو الفرصة" className="h-11 w-full rounded-lg border border-[#E0E7F2] pr-10 pl-3 text-[13px] outline-none focus:border-[#09379A]"/></div>
                <select aria-label="تصفية حسب حالة الطلب" value={filter} onChange={e => setFilter(e.target.value)} className="h-11 rounded-lg border border-[#E0E7F2] bg-white px-3 text-[13px]">
                  <option value="all">جميع الحالات</option><option value="pending">بانتظار القرار</option><option value="approved">مقبولة</option><option value="rejected">مرفوضة</option>
                </select>
              </div>
              {filtered.length === 0 ? <div className="py-16 text-center text-[13px] text-[#64748B]"><ClipboardCheck size={34} className="mx-auto mb-3 text-[#A1B3D5]"/>لا توجد طلبات مطابقة.</div> :
                <div className="overflow-x-auto"><table className="w-full min-w-[840px] text-right text-[12px]"><thead className="bg-[#F1F5F9] text-[#64748B]"><tr>{["الطالب","الرقم الجامعي","الفرصة","جهة التدريب","قرار الجهة","قرار الإدارة","الإجراء"].map(x => <th key={x} className="p-4 font-semibold">{x}</th>)}</tr></thead>
                  <tbody>{filtered.map(r => <tr key={r.id} className="border-b border-[#E0E7F2] last:border-0"><td className="p-4 font-bold">{r.fullName || r.studentName || "—"}</td><td className="p-4" dir="ltr">{r.studentId || "—"}</td><td className="p-4">{r.position || "—"}</td><td className="p-4">{r.organization || "—"}</td><td className="p-4">{(() => {
                    const matching = providerDecisions.find(p => String(p.id) === String(r.id) && String(p.studentId) === String(r.studentId));
                    return matching ? ({ pending: "بانتظار القرار", accepted: "مقبول", rejected: "مرفوض" }[matching.status] || matching.status) : "غير مسجل";
                  })()}</td><td className="p-4"><span className={`rounded-full px-3 py-1 ${badge[r.status] || badge.pending}`}>{labels[r.status] || r.status}</span></td><td className="p-4"><button type="button" onClick={() => navigate(`/admin/training-requests/${encodeURIComponent(r.id)}`)} className="rounded-lg border border-[#D4DFEF] px-3 py-2 font-bold text-[#09379A]">عرض ومراجعة</button></td></tr>)}</tbody>
                </table></div>}
            </section>
            <p className="mt-3 text-[11px] leading-6 text-[#64748B]">تعرض النسخة الحالية بيانات تجريبية محفوظة في المتصفح. ستأتي قرارات الاعتماد وهوية صاحب القرار من الـBackend لاحقًا.</p>
            <AcademicFooter audience="admin" />
          </div>
        </main>
      </div>
    </div>
  );
}
