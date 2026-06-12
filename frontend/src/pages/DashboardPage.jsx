import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Sparkles, TrendingUp, Wallet, X, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import { inr } from "../lib/format";
import OpportunityCard from "../components/OpportunityCard";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/dashboard");
      setData(r.data);
    } catch {
      toast.error("Couldn't load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/dashboard/watchlist/${id}`);
      toast.success("Removed from watchlist");
      load();
    } catch {
      toast.error("Couldn't remove");
    }
  };

  return (
    <div data-testid="dashboard-page" className="bg-slate-50 min-h-[80vh] pb-24">
      <section className="pv-hero-gradient pv-grain text-white relative overflow-hidden">
        <div className="absolute inset-0 pv-grid-overlay opacity-60" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24">
          <div className="text-xs uppercase tracking-[0.25em] text-[#10B981] font-semibold">Investor Dashboard</div>
          <h1 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold mt-3 tracking-tighter">
            Welcome, {user?.name?.split(" ")[0] || "Investor"}.
          </h1>
          <p className="text-slate-300 mt-3 max-w-2xl">
            Track curated opportunities, manage your watchlist, and stay ready for our flagship LFA launch.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="pv-card p-6">
            <div className="flex items-center gap-2 text-[#10B981]"><Wallet className="w-5 h-5" /><span className="text-xs uppercase tracking-widest font-semibold">Portfolio Value</span></div>
            <div className="pv-num text-3xl font-extrabold text-[#0A2540] mt-3">{inr(data?.portfolio_value_inr || 0)}</div>
            <div className="text-xs text-slate-500 mt-1">Once investments go live</div>
          </div>
          <div className="pv-card p-6">
            <div className="flex items-center gap-2 text-[#10B981]"><Bookmark className="w-5 h-5" /><span className="text-xs uppercase tracking-widest font-semibold">Watchlist</span></div>
            <div className="pv-num text-3xl font-extrabold text-[#0A2540] mt-3">{data?.watchlist?.length ?? 0}</div>
            <div className="text-xs text-slate-500 mt-1">Saved opportunities</div>
          </div>
          <div className="pv-card p-6">
            <div className="flex items-center gap-2 text-[#10B981]"><Sparkles className="w-5 h-5" /><span className="text-xs uppercase tracking-widest font-semibold">LFA Access</span></div>
            <div className="text-lg font-bold text-[#0A2540] mt-3">Early-Access Queued</div>
            <div className="text-xs text-slate-500 mt-1">We'll notify you on launch</div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#10B981] font-semibold">Your Watchlist</div>
            <h2 className="font-['Cabinet_Grotesk'] text-2xl md:text-3xl font-extrabold text-[#0A2540] mt-2 tracking-tighter">Saved opportunities</h2>
          </div>
          <Link to="/opportunities" data-testid="dashboard-browse-link" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A2540] hover:text-[#10B981]">
            Browse marketplace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="pv-card h-[400px] animate-pulse bg-slate-100" />)}
          </div>
        ) : (data?.watchlist || []).length === 0 ? (
          <div data-testid="dashboard-empty-watchlist" className="mt-8 pv-card p-12 text-center">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="font-['Cabinet_Grotesk'] text-xl font-bold text-[#0A2540] mt-4">Your watchlist is empty.</div>
            <p className="text-slate-500 mt-2">Browse curated opportunities and add to your watchlist.</p>
            <Link to="/opportunities" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A2540] text-white font-semibold hover:bg-[#0F3860]">
              Explore Opportunities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.watchlist.map((o) => (
              <div key={o.id} className="relative">
                <button
                  onClick={() => remove(o.id)}
                  data-testid={`dashboard-remove-${o.id}`}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur border border-slate-200 hover:bg-red-50 hover:border-red-200 flex items-center justify-center"
                  aria-label="Remove from watchlist"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
                <OpportunityCard o={o} testIdPrefix="dashboard-watchlist" />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-20">
        <div className="text-xs uppercase tracking-[0.25em] text-[#10B981] font-semibold">Recommended For You</div>
        <h2 className="font-['Cabinet_Grotesk'] text-2xl md:text-3xl font-extrabold text-[#0A2540] mt-2 tracking-tighter">Hand-picked opportunities</h2>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data?.recommended || []).map((o) => <OpportunityCard key={o.id} o={o} testIdPrefix="dashboard-rec" />)}
        </div>
      </section>
    </div>
  );
}
