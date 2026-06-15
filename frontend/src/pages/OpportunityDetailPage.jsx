import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowLeft, Bookmark, Building2, Calendar, Users, TrendingUp, ShieldCheck, FileDown, X, CheckCircle2 } from "lucide-react";
import api, { formatApiError, API } from "../lib/api";
import { useAuth } from "../lib/auth";
import { inr } from "../lib/format";
import { toast } from "sonner";

function PdfModal({ opp, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/opportunities/${opp.id}/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(formatApiError(j.detail) || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `PropertyVerse-${opp.name.replace(/\s+/g, "_")}.pdf`; a.click();
      URL.revokeObjectURL(url);
      setDone(true);
      toast.success("PDF downloaded");
    } catch (err) {
      toast.error(err.message || "PDF generation failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl max-w-md w-full p-7 relative" onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" data-testid="pdf-modal-close"><X className="w-5 h-5" /></button>
        {done ? (
          <div className="text-center py-6" data-testid="pdf-modal-success">
            <CheckCircle2 className="w-12 h-12 text-[#3FB36F] mx-auto" />
            <div className="font-['Cabinet_Grotesk'] text-2xl font-bold text-[#0A2540] mt-4">PDF downloaded.</div>
            <p className="text-slate-600 mt-2 text-sm">Our investor relations team will follow up shortly.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-full bg-[#0A2540] text-white font-semibold text-sm">Close</button>
          </div>
        ) : (
          <>
            <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Asset Summary PDF</div>
            <h2 className="font-['Cabinet_Grotesk'] text-2xl font-bold text-[#0A2540] mt-2">{opp.name}</h2>
            <p className="text-slate-600 text-sm mt-2">One-page illustrative summary. Tell us where to send it.</p>
            <form onSubmit={submit} data-testid="pdf-modal-form" className="mt-5 space-y-3">
              <input data-testid="pdf-input-name" placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
              <input data-testid="pdf-input-email" type="email" placeholder="Work email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
              <input data-testid="pdf-input-phone" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
              <button type="submit" disabled={loading} data-testid="pdf-submit-btn"
                className="w-full px-6 py-3.5 rounded-full bg-gradient-to-r from-[#3FB36F] to-[#1E63D5] text-white font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60">
                <FileDown className="w-4 h-4" /> {loading ? "Generating…" : "Download PDF"}
              </button>
              <p className="text-[10px] text-slate-400 leading-relaxed">By downloading you agree to be contacted by Property Verse investor relations. Illustrative only.</p>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [o, setO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/opportunities/${id}`).then((r) => setO(r.data)).catch(() => setO(null)).finally(() => setLoading(false));
  }, [id]);

  const saveToWatchlist = async () => {
    if (!user || user === false) {
      toast.error("Please sign in to save opportunities");
      return;
    }
    setSaving(true);
    try {
      await api.post("/dashboard/watchlist", { opportunity_id: id });
      toast.success("Added to your watchlist");
    } catch {
      toast.error("Couldn't save right now");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-5xl mx-auto px-6 py-32 text-center text-slate-500">Loading…</div>;
  if (!o) return <div className="max-w-5xl mx-auto px-6 py-32 text-center text-slate-500">Not found</div>;

  return (
    <div data-testid="opp-detail-page" className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <Link to="/opportunities" className="text-sm text-slate-500 hover:text-[#0A2540] inline-flex items-center gap-1 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to marketplace
      </Link>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="rounded-3xl overflow-hidden relative h-[360px] md:h-[480px] bg-slate-100">
            <motion.img
              src={o.image}
              alt={o.name}
              className="w-full h-full object-cover"
              onError={(e) => { if (o.image_fallback) e.currentTarget.src = o.image_fallback; }}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/80 via-transparent to-transparent" />
            <div className="absolute top-5 left-5 flex gap-2 flex-wrap">
              {o.tags?.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full bg-white/90 text-[10px] uppercase tracking-widest font-semibold text-[#0A2540]">{t}</span>
              ))}
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="text-sm flex items-center gap-1.5"><MapPin className="w-4 h-4" />{o.location}</div>
              <div className="font-['Cabinet_Grotesk'] text-4xl font-extrabold mt-1 tracking-tighter">{o.name}</div>
            </div>
          </div>

          <div className="mt-10">
            <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Asset Summary</div>
            <h2 className="font-['Cabinet_Grotesk'] text-2xl font-bold text-[#0A2540] mt-2">{o.highlight}</h2>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {[
              { i: Building2, l: "Asset Type", v: o.asset_type },
              { i: Users, l: "Tenant", v: o.tenant },
              { i: Calendar, l: "Lease Term", v: `${o.lease_term_years} years` },
              { i: TrendingUp, l: "Occupancy", v: `${o.occupancy}%` },
              { i: ShieldCheck, l: "Investment Tenure", v: `${o.tenure_years} years` },
              { i: Bookmark, l: "Funded", v: `${o.funded_pct}%` },
            ].map((x) => (
              <div key={x.l} className="pv-card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0A2540]/5 flex items-center justify-center flex-shrink-0">
                  <x.i className="w-4 h-4 text-[#0A2540]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{x.l}</div>
                  <div className="font-semibold text-[#0A2540] mt-1">{x.v}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl border border-amber-200 bg-amber-50 text-sm text-amber-900 leading-relaxed">
            <strong>Illustrative.</strong> All figures shown are sample/demo data for illustration only. Final asset structure, returns, and tenure depend on lender approval, legal due diligence, and market conditions.
          </div>
        </div>

        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <div className="pv-card p-6">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Target IRR</div>
            <div className="pv-num text-5xl font-extrabold text-[#0A2540] mt-2">{o.target_irr.toFixed(1)}<span className="text-2xl">%</span></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Rental Yield</div>
                <div className="pv-num text-xl font-bold text-[#3FB36F] mt-1">{o.rental_yield.toFixed(1)}%</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Min Investment</div>
                <div className="pv-num text-base font-bold text-[#0A2540] mt-1">{inr(o.min_investment)}</div>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600 font-medium">Funding progress</span>
                <span className="pv-num font-semibold text-[#0A2540]">{o.funded_pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#0A2540] to-[#3FB36F]" style={{ width: `${o.funded_pct}%` }} />
              </div>
            </div>

            <button
              onClick={saveToWatchlist}
              disabled={saving}
              data-testid="opp-detail-save-btn"
              className="mt-6 w-full px-6 py-3.5 rounded-full bg-[#3FB36F] text-white font-semibold hover:bg-[#1E63D5] transition-colors disabled:opacity-60"
            >
              {saving ? "Saving…" : "Add to Watchlist"}
            </button>
            <Link
              to="/contact"
              data-testid="opp-detail-book-call"
              className="mt-3 block text-center px-6 py-3.5 rounded-full border border-[#0A2540] text-[#0A2540] font-semibold hover:bg-[#0A2540] hover:text-white transition-colors"
            >
              Book a Strategy Call
            </Link>
            <button
              onClick={() => setPdfOpen(true)}
              data-testid="opp-detail-download-pdf"
              className="mt-3 w-full px-6 py-3.5 rounded-full bg-gradient-to-r from-[#3FB36F] to-[#1E63D5] text-white font-semibold inline-flex items-center justify-center gap-2 hover:shadow-[0_12px_40px_rgba(63,179,111,0.40)] transition-all"
            >
              <FileDown className="w-4 h-4" /> Download Asset Summary PDF
            </button>
          </div>

          <div className="pv-card p-6">
            <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Tenant Profile</div>
            <div className="mt-3 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#3FB36F]/10 flex items-center justify-center"><Users className="w-5 h-5 text-[#3FB36F]" /></div>
              <div>
                <div className="font-semibold text-[#0A2540]">{o.tenant}</div>
                <div className="text-xs text-slate-500 mt-0.5">Lease verified · CPI-linked escalations</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <AnimatePresence>{pdfOpen && <PdfModal opp={o} onClose={() => setPdfOpen(false)} />}</AnimatePresence>
    </div>
  );
}
