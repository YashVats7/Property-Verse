import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Users, Briefcase, Phone, ShieldCheck, Trash2, Mail, Download, ArrowRight, Search } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../lib/auth";

const TABS = [
  { k: "waitlist", l: "Waitlist", i: Users, ep: "/admin/leads/waitlist" },
  { k: "partners", l: "Partners", i: Briefcase, ep: "/admin/leads/partners" },
  { k: "strategy-calls", l: "Strategy Calls", i: Phone, ep: "/admin/leads/strategy-calls" },
  { k: "users", l: "Users", i: ShieldCheck, ep: "/admin/users" },
];

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("waitlist");
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user === false) {
      nav("/login", { replace: true });
      return;
    }
    if (user.role !== "admin") {
      toast.error("Admin access only");
      nav("/", { replace: true });
    }
  }, [user, authLoading, nav]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    api.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    const ep = TABS.find((t) => t.k === tab)?.ep;
    if (!ep) return;
    setLoading(true);
    api.get(ep).then((r) => setItems(r.data.items || [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, [tab, user]);

  const remove = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await api.delete(`/admin/leads/${tab}/${id}`);
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Couldn't delete");
    }
  };

  const exportCsv = () => {
    if (!items.length) return;
    const keys = Object.keys(items[0]);
    const rows = [keys.join(",")];
    for (const it of items) rows.push(keys.map((k) => JSON.stringify(it[k] ?? "")).join(","));
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `propverse-${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filtered = items.filter((it) =>
    !q.trim() || JSON.stringify(it).toLowerCase().includes(q.toLowerCase())
  );

  if (authLoading || !user || user.role !== "admin") {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-500">Loading…</div>;
  }

  return (
    <div data-testid="admin-page" className="bg-slate-50 min-h-[80vh] pb-24">
      <section className="pv-hero-gradient pv-grain text-white relative overflow-hidden">
        <div className="absolute inset-0 pv-grid-overlay opacity-60" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24">
          <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Admin Console</div>
          <h1 className="font-['Clash_Display'] text-3xl md:text-5xl font-bold mt-3 tracking-tighter">Lead pipeline & investor management.</h1>
          <p className="text-slate-300 mt-3 max-w-2xl">Triage waitlist signups, partner outreach, and strategy-call requests.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 -mt-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { k: "waitlist", l: "Waitlist", v: stats?.waitlist ?? "—" },
            { k: "partners", l: "Partner Requests", v: stats?.partners ?? "—" },
            { k: "strategy_calls", l: "Strategy Calls", v: stats?.strategy_calls ?? "—" },
            { k: "investors", l: "Investors", v: stats?.investors ?? "—" },
            { k: "users", l: "Total Users", v: stats?.users ?? "—" },
          ].map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="pv-card p-5"
            >
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{s.l}</div>
              <div className="pv-num text-3xl font-extrabold text-[#0A2540] mt-1.5">{s.v}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-12">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              data-testid={`admin-tab-${t.k}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 ${tab === t.k ? "bg-[#0A2540] text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}
            >
              <t.i className="w-4 h-4" /> {t.l}
            </button>
          ))}
        </div>

        <div className="mt-6 pv-card p-5 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              data-testid="admin-search-input"
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <button onClick={exportCsv} data-testid="admin-export-csv" className="px-5 py-2.5 rounded-xl bg-[#0A2540] text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#0F3FA1]">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="mt-6 pv-card overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-500">Loading…</div>
          ) : filtered.length === 0 ? (
            <div data-testid="admin-empty" className="p-12 text-center text-slate-500">No entries match.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {Object.keys(filtered[0]).filter((k) => k !== "password_hash").map((k) => (
                      <th key={k} className="px-5 py-3 text-left font-semibold text-[#0A2540] capitalize text-xs whitespace-nowrap">{k.replace(/_/g, " ")}</th>
                    ))}
                    <th className="px-5 py-3 w-12" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((it, i) => (
                    <tr key={it.id || i} className="border-b border-slate-100 hover:bg-slate-50/60">
                      {Object.entries(it).filter(([k]) => k !== "password_hash").map(([k, v]) => (
                        <td key={k} className="px-5 py-3 text-slate-700 whitespace-nowrap max-w-xs truncate">
                          {k === "email" ? (
                            <a href={`mailto:${v}`} className="inline-flex items-center gap-1 text-[#1E63D5] hover:underline">
                              <Mail className="w-3.5 h-3.5" /> {String(v)}
                            </a>
                          ) : typeof v === "string" && v.length > 50 ? v.slice(0, 50) + "…" : String(v ?? "—")}
                        </td>
                      ))}
                      <td className="px-5 py-3">
                        {tab !== "users" && (
                          <button onClick={() => remove(it.id)} data-testid={`admin-delete-${it.id}`} className="text-rose-500 hover:text-rose-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
