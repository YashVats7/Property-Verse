import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../lib/api";
import OpportunityCard from "../components/OpportunityCard";

export default function OpportunitiesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ asset_type: "all", city: "all", q: "" });

  useEffect(() => {
    setLoading(true);
    api
      .get("/opportunities", { params: { asset_type: filters.asset_type, city: filters.city } })
      .then((r) => {
        let list = r.data.items;
        if (filters.q.trim()) {
          const q = filters.q.toLowerCase();
          list = list.filter((o) => o.name.toLowerCase().includes(q) || o.location.toLowerCase().includes(q));
        }
        setItems(list);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div data-testid="opportunities-page" className="pv-section-gradient">
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-10">
        <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Marketplace</div>
        <h1 className="font-['Cabinet_Grotesk'] text-4xl md:text-5xl font-extrabold text-[#0A2540] mt-3 tracking-tighter max-w-3xl">
          Curated fractional real estate opportunities.
        </h1>
        <p className="text-slate-600 mt-4 max-w-2xl">
          A-grade pre-leased commercial assets across India's premier office markets. All numbers are illustrative; final figures are subject to asset structuring.
        </p>

        <div className="mt-10 pv-card p-4 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              data-testid="opps-search-input"
              placeholder="Search by name or city…"
              className="flex-1 bg-transparent text-sm outline-none"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
          </div>
          <select
            data-testid="opps-filter-city"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
          >
            <option value="all">All Cities</option>
            <option value="mumbai">Mumbai</option>
            <option value="bengaluru">Bengaluru</option>
            <option value="gurugram">Gurugram</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="pune">Pune</option>
            <option value="chennai">Chennai</option>
          </select>
          <select
            data-testid="opps-filter-asset"
            value={filters.asset_type}
            onChange={(e) => setFilters({ ...filters, asset_type: e.target.value })}
            className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
          >
            <option value="all">All Asset Types</option>
            <option value="A-Grade Office">A-Grade Office</option>
            <option value="Grade-A Office">Grade-A Office</option>
            <option value="IT Park">IT Park</option>
            <option value="Logistics + Office">Logistics + Office</option>
            <option value="Leveraged Fractional">Leveraged Fractional</option>
          </select>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="pv-card h-[400px] animate-pulse bg-slate-100" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div data-testid="opps-empty" className="text-center py-20 text-slate-500">No opportunities match your filters.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((o) => <OpportunityCard key={o.id} o={o} testIdPrefix="opps-list" />)}
          </div>
        )}
      </section>
    </div>
  );
}
