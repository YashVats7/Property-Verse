import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Users, Briefcase, Phone, ShieldCheck, Trash2, Mail, Download, Search, Building2, Plus, Edit3, RefreshCw, Save, Upload, X, History } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../lib/auth";

const LEAD_TABS = [
  { k: "waitlist", l: "Waitlist", i: Users, ep: "/admin/leads/waitlist" },
  { k: "partners", l: "Partners", i: Briefcase, ep: "/admin/leads/partners" },
  { k: "strategy-calls", l: "Strategy Calls", i: Phone, ep: "/admin/leads/strategy-calls" },
  { k: "users", l: "Users", i: ShieldCheck, ep: "/admin/users" },
  { k: "audit", l: "Audit Log", i: History, ep: "/admin/audit-log" },
];
const CONTENT_TABS = [
  { k: "opportunities", l: "Opportunities", i: Building2 },
  { k: "stats", l: "Stats", i: ShieldCheck },
  { k: "hero", l: "Hero Copy", i: Edit3 },
  { k: "about", l: "About", i: Edit3 },
  { k: "personas", l: "Personas", i: Users },
];

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("opportunities");

  useEffect(() => {
    if (authLoading) return;
    if (!user || user === false) { nav("/login", { replace: true }); return; }
    if (user.role !== "admin") { toast.error("Admin access only"); nav("/", { replace: true }); }
  }, [user, authLoading, nav]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    api.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {});
  }, [user, tab]);

  if (authLoading || !user || user.role !== "admin") {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-500">Loading…</div>;
  }

  const allTabs = [...CONTENT_TABS, ...LEAD_TABS];

  return (
    <div data-testid="admin-page" className="bg-slate-50 min-h-[80vh] pb-24">
      <section className="pv-hero-gradient pv-grain text-white relative overflow-hidden">
        <div className="absolute inset-0 pv-grid-overlay opacity-60" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24">
          <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Admin Console</div>
          <h1 className="font-['Clash_Display'] text-3xl md:text-5xl font-bold mt-3 tracking-tighter">Content & lead management.</h1>
          <p className="text-slate-300 mt-3 max-w-2xl">Edit opportunities, stats, hero, about, personas. Triage leads.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 -mt-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { l: "Opportunities", v: stats?.opportunities ?? "—" },
            { l: "Waitlist", v: stats?.waitlist ?? "—" },
            { l: "Partners", v: stats?.partners ?? "—" },
            { l: "Strategy Calls", v: stats?.strategy_calls ?? "—" },
            { l: "Investors", v: stats?.investors ?? "—" },
            { l: "Users", v: stats?.users ?? "—" },
          ].map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="pv-card p-4">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{s.l}</div>
              <div className="pv-num text-2xl font-extrabold text-[#0A2540] mt-1">{s.v}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
        <div className="flex flex-wrap items-center gap-2">
          {allTabs.map((t) => (
            <button
              key={t.k} onClick={() => setTab(t.k)} data-testid={`admin-tab-${t.k}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 ${tab === t.k ? "bg-[#0A2540] text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}
            >
              <t.i className="w-4 h-4" /> {t.l}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "opportunities" && <OpportunityManager />}
          {tab === "stats" && <StatsEditor />}
          {tab === "hero" && <ContentJsonEditor key="hero" contentKey="hero" label="Hero Copy" />}
          {tab === "about" && <ContentJsonEditor key="about" contentKey="about" label="About Section" />}
          {tab === "personas" && <ContentJsonEditor key="personas" contentKey="personas" label="Personas" />}
          {["waitlist", "partners", "strategy-calls", "users", "audit"].includes(tab) && <LeadsTable tab={tab} />}
        </div>
      </section>
    </div>
  );
}

// ---------------- Leads Table ----------------
function LeadsTable({ tab }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const ep = LEAD_TABS.find((t) => t.k === tab)?.ep;

  const load = () => {
    setLoading(true);
    api.get(ep).then((r) => setItems(r.data.items || [])).catch(() => setItems([])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [tab]);

  const remove = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try { await api.delete(`/admin/leads/${tab}/${id}`); setItems((p) => p.filter((x) => x.id !== id && x.id_mongo !== id)); toast.success("Deleted"); }
    catch { toast.error("Couldn't delete"); }
  };
  const exportCsv = () => {
    if (!items.length) return;
    const keys = Object.keys(items[0]);
    const rows = [keys.join(",")];
    for (const it of items) rows.push(keys.map((k) => JSON.stringify(it[k] ?? "")).join(","));
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `propverse-${tab}.csv`; a.click();
  };
  const filtered = items.filter((it) => !q.trim() || JSON.stringify(it).toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="pv-card p-5 flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input data-testid="admin-search-input" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" />
        </div>
        <button onClick={exportCsv} data-testid="admin-export-csv" className="px-5 py-2.5 rounded-xl bg-[#0A2540] text-white text-sm font-semibold inline-flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
      <div className="mt-6 pv-card overflow-hidden">
        {loading ? <div className="p-10 text-center text-slate-500">Loading…</div> :
         filtered.length === 0 ? <div className="p-12 text-center text-slate-500">No entries.</div> :
         <div className="overflow-x-auto">
           <table className="min-w-full text-sm">
             <thead className="bg-slate-50 border-b border-slate-200"><tr>
               {Object.keys(filtered[0]).map((k) => <th key={k} className="px-5 py-3 text-left font-semibold text-[#0A2540] text-xs whitespace-nowrap capitalize">{k.replace(/_/g, " ")}</th>)}
               <th className="w-12" />
             </tr></thead>
             <tbody>
               {filtered.map((it, i) => (
                 <tr key={it.id || it.id_mongo || i} className="border-b border-slate-100 hover:bg-slate-50/60">
                   {Object.entries(it).map(([k, v]) => (
                     <td key={k} className="px-5 py-3 text-slate-700 whitespace-nowrap max-w-xs truncate">
                       {k === "email" ? <a href={`mailto:${v}`} className="text-[#1E63D5] inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {String(v)}</a>
                         : typeof v === "string" && v.length > 50 ? v.slice(0, 50) + "…" : String(v ?? "—")}
                     </td>
                   ))}
                   <td className="px-5 py-3">
                     {tab !== "users" && tab !== "audit" && (
                       <button onClick={() => remove(it.id || it.id_mongo)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                     )}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>}
      </div>
    </div>
  );
}

// ---------------- Stats Editor ----------------
function StatsEditor() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.get("/content/stats").then((r) => setData(r.data)).catch(() => setData({})); }, []);
  if (!data) return <div className="p-10 text-center text-slate-500">Loading…</div>;
  const save = async () => {
    setSaving(true);
    try { await api.put("/admin/content/stats", { value: data }); toast.success("Stats saved"); }
    catch (e) { toast.error("Save failed"); } finally { setSaving(false); }
  };
  const fields = [
    { k: "aum_inr_cr", l: "Curated AUM (₹ Cr)", type: "number" },
    { k: "investors", l: "Investors Tracked", type: "number" },
    { k: "properties", l: "Assets Screened", type: "number" },
    { k: "avg_irr", l: "Avg. Target IRR (%)", type: "number", step: 0.1 },
    { k: "cities", l: "Indian Cities", type: "number" },
    { k: "occupancy_pct", l: "Occupancy %", type: "number" },
  ];
  return (
    <div className="pv-card p-7">
      <div className="font-['Cabinet_Grotesk'] text-xl font-bold text-[#0A2540]">Platform stats</div>
      <p className="text-sm text-slate-600 mt-1">Edit the 6 KPI numbers visible on the homepage.</p>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.k}>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{f.l}</label>
            <input
              data-testid={`stats-input-${f.k}`}
              type="number" step={f.step || 1}
              value={data[f.k] ?? 0}
              onChange={(e) => setData({ ...data, [f.k]: parseFloat(e.target.value) || 0 })}
              className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none"
            />
          </div>
        ))}
      </div>
      <button onClick={save} disabled={saving} data-testid="stats-save-btn" className="mt-6 px-6 py-3 rounded-full bg-[#3FB36F] text-white font-semibold inline-flex items-center gap-2 disabled:opacity-60">
        <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Stats"}
      </button>
    </div>
  );
}

// ---------------- Content JSON Editor ----------------
function ContentJsonEditor({ contentKey, label }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setLoading(true);
    api.get(`/content/${contentKey}`).then((r) => setText(JSON.stringify(r.data, null, 2))).catch(() => setText("{}")).finally(() => setLoading(false));
  }, [contentKey]);

  const save = async () => {
    let parsed;
    try { parsed = JSON.parse(text); } catch { toast.error("Invalid JSON"); return; }
    setSaving(true);
    try { await api.put(`/admin/content/${contentKey}`, { value: parsed }); toast.success(`${label} saved`); }
    catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading…</div>;
  return (
    <div className="pv-card p-7">
      <div className="font-['Cabinet_Grotesk'] text-xl font-bold text-[#0A2540]">{label}</div>
      <p className="text-sm text-slate-600 mt-1">Edit the JSON below. Fields are loaded live from the database.</p>
      <textarea
        data-testid={`content-${contentKey}-editor`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mt-4 w-full h-[480px] px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none font-mono text-xs leading-relaxed"
        spellCheck={false}
      />
      <button onClick={save} disabled={saving} data-testid={`content-${contentKey}-save`} className="mt-4 px-6 py-3 rounded-full bg-[#3FB36F] text-white font-semibold inline-flex items-center gap-2 disabled:opacity-60">
        <Save className="w-4 h-4" /> {saving ? "Saving…" : `Save ${label}`}
      </button>
    </div>
  );
}

// ---------------- Opportunity Manager ----------------
const EMPTY = {
  id: "", name: "", location: "", asset_type: "A-Grade Office", tenant: "",
  image: "", image_fallback: "", min_investment: 1000000, asset_value_cr: 50,
  target_irr: 15, target_irr_range: "14-16%", rental_yield: 8.5,
  lease_term_years: 9, occupancy: 100, tenure_years: 6, funded_pct: 0,
  leverage_available: false, risk_score: 75, tags: [], highlight: "",
};

function OpportunityManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // EMPTY or full doc; null = closed

  const load = () => {
    setLoading(true);
    api.get("/admin/opportunities").then((r) => setItems(r.data.items)).catch(() => setItems([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const reset = async () => {
    if (!window.confirm("Reset all opportunities to the 8 default demos? This will overwrite your changes.")) return;
    try { const r = await api.post("/admin/opportunities/reset"); toast.success(`Reset · ${r.data.count} opportunities`); load(); }
    catch { toast.error("Reset failed"); }
  };

  const remove = async (id) => {
    if (!window.confirm(`Delete ${id}?`)) return;
    try { await api.delete(`/admin/opportunities/${id}`); toast.success("Deleted"); load(); }
    catch { toast.error("Couldn't delete"); }
  };

  return (
    <div>
      <div className="pv-card p-5 flex justify-between items-center">
        <div>
          <div className="font-['Cabinet_Grotesk'] text-xl font-bold text-[#0A2540]">Opportunities</div>
          <p className="text-sm text-slate-600 mt-0.5">Add, edit, delete, or reset to demo data.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} data-testid="opp-reset-btn" className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 inline-flex items-center gap-2 hover:bg-slate-50">
            <RefreshCw className="w-4 h-4" /> Reset to demos
          </button>
          <button onClick={() => setEditing({ ...EMPTY })} data-testid="opp-new-btn" className="px-4 py-2.5 rounded-xl bg-[#3FB36F] text-white text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Opportunity
          </button>
        </div>
      </div>

      {loading ? <div className="p-10 text-center text-slate-500">Loading…</div> : (
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((o) => (
            <div key={o.id} className="pv-card overflow-hidden">
              <div className="relative h-32 bg-slate-100">
                {o.image && <img src={o.image} alt="" className="w-full h-full object-cover" onError={(e) => { if (o.image_fallback) e.currentTarget.src = o.image_fallback; }} />}
              </div>
              <div className="p-4">
                <div className="text-xs text-slate-500">{o.location}</div>
                <div className="font-semibold text-[#0A2540] mt-0.5">{o.name}</div>
                <div className="text-[10px] mt-1 text-slate-400 font-mono">{o.id}</div>
                <div className="flex justify-between mt-3 text-xs">
                  <span>IRR <span className="font-bold text-[#0A2540]">{o.target_irr_range || `${o.target_irr}%`}</span></span>
                  <span>Yield <span className="font-bold text-[#3FB36F]">{o.rental_yield}%</span></span>
                  {o.leverage_available && <span className="text-[#3FB36F] font-bold">LEV</span>}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setEditing({ ...o })} data-testid={`opp-edit-${o.id}`} className="flex-1 px-3 py-2 rounded-lg bg-[#0A2540] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => remove(o.id)} data-testid={`opp-delete-${o.id}`} className="px-3 py-2 rounded-lg border border-rose-200 text-rose-600 text-xs font-semibold inline-flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <OpportunityForm initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function OpportunityForm({ initial, onClose, onSaved }) {
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isNew = !initial.id;

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const r = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setF({ ...f, image: r.data.url });
      toast.success("Image uploaded");
    } catch (e) { toast.error(e.response?.data?.detail || "Upload failed"); }
    finally { setUploading(false); }
  };

  const save = async () => {
    setSaving(true);
    try {
      if (isNew) await api.post("/admin/opportunities", f);
      else await api.put(`/admin/opportunities/${initial.id}`, f);
      toast.success("Saved");
      onSaved();
    } catch (e) { toast.error(e.response?.data?.detail || "Save failed"); }
    finally { setSaving(false); }
  };

  const setField = (k, v) => setF((prev) => ({ ...prev, [k]: v }));

  const TextField = ({ k, l, type = "text", step }) => null; // (unused) — replaced by inline JSX below

  const fieldDefs = [
    { k: "name", l: "Asset Name" },
    { k: "location", l: "Location" },
    { k: "asset_type", l: "Asset Type" },
    { k: "tenant", l: "Tenant" },
    { k: "min_investment", l: "Min Investment (₹)", type: "number" },
    { k: "asset_value_cr", l: "Asset Value (₹ Cr)", type: "number" },
    { k: "target_irr", l: "Target IRR (%)", type: "number", step: "0.1" },
    { k: "target_irr_range", l: "Target IRR Range (e.g. 14-16%)" },
    { k: "rental_yield", l: "Rental Yield (%)", type: "number", step: "0.1" },
    { k: "lease_term_years", l: "Lease Term (years)", type: "number" },
    { k: "tenure_years", l: "Investment Tenure (years)", type: "number" },
    { k: "occupancy", l: "Occupancy %", type: "number" },
    { k: "funded_pct", l: "Funded %", type: "number" },
    { k: "risk_score", l: "Risk Score /100", type: "number" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen flex items-start justify-center p-6">
        <div className="bg-white rounded-3xl max-w-3xl w-full my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="font-['Cabinet_Grotesk'] text-2xl font-bold text-[#0A2540]">{isNew ? "New Opportunity" : `Edit · ${initial.name}`}</div>
            <button onClick={onClose} data-testid="opp-form-cancel-x" className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-4">
            {fieldDefs.map((fd) => (
              <div key={fd.k}>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{fd.l}</label>
                <input
                  data-testid={`opp-form-${fd.k}`}
                  type={fd.type || "text"}
                  step={fd.step}
                  value={f[fd.k] ?? ""}
                  onChange={(e) => setField(fd.k, fd.type === "number" ? (e.target.value === "" ? "" : parseFloat(e.target.value) || 0) : e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-[#0A2540] focus:outline-none text-sm"
                />
              </div>
            ))}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Leverage Available</label>
              <label className="mt-2 flex items-center gap-2 cursor-pointer">
                <input data-testid="opp-form-leverage" type="checkbox" checked={!!f.leverage_available} onChange={(e) => setField("leverage_available", e.target.checked)} className="w-4 h-4 accent-[#3FB36F]" />
                <span className="text-sm">Show leverage badge</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Tags (comma-separated)</label>
              <input
                data-testid="opp-form-tags"
                value={(f.tags || []).join(", ")}
                onChange={(e) => setField("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-[#0A2540] focus:outline-none text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Highlight</label>
              <textarea
                data-testid="opp-form-highlight"
                value={f.highlight || ""} onChange={(e) => setField("highlight", e.target.value)} rows={2}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-[#0A2540] focus:outline-none text-sm"
              />
            </div>
            <div className="md:col-span-2 border border-slate-200 rounded-xl p-4">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Asset Image</label>
              <div className="mt-2 flex items-center gap-4">
                {f.image ? <img src={f.image} alt="" className="w-24 h-16 object-cover rounded-lg border border-slate-200" /> : <div className="w-24 h-16 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">No image</div>}
                <label className="cursor-pointer px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" /> {uploading ? "Uploading…" : "Upload Photo"}
                  <input type="file" accept="image/*" className="hidden" data-testid="opp-image-upload" onChange={(e) => upload(e.target.files?.[0])} />
                </label>
                {f.image && <button onClick={() => setField("image", "")} className="text-xs text-rose-500">Remove</button>}
              </div>
              <input
                data-testid="opp-form-image-url"
                placeholder="Or paste image URL"
                value={f.image || ""} onChange={(e) => setField("image", e.target.value)}
                className="mt-3 w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
            <button onClick={onClose} data-testid="opp-form-cancel" className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700">Cancel</button>
            <button onClick={save} disabled={saving} data-testid="opp-save-btn" className="px-6 py-2.5 rounded-xl bg-[#3FB36F] text-white text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-60">
              <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Opportunity"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
