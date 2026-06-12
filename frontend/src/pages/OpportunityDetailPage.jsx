import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowLeft, Bookmark, Building2, Calendar, Users, TrendingUp, ShieldCheck } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import { inr } from "../lib/format";
import { toast } from "sonner";

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [o, setO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    </div>
  );
}
