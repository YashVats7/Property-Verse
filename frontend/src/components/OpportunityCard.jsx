import { Link } from "react-router-dom";
import { MapPin, TrendingUp, Building2, Users } from "lucide-react";
import { inr } from "../lib/format";

export default function OpportunityCard({ o, testIdPrefix = "opp-card" }) {
  return (
    <Link
      to={`/opportunities/${o.id}`}
      data-testid={`${testIdPrefix}-${o.id}`}
      className="pv-card overflow-hidden flex flex-col group"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={o.image}
          alt={o.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/70 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {o.tags?.slice(0, 2).map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] uppercase tracking-wider font-semibold text-[#0A2540]">
              {t}
            </span>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="text-xs flex items-center gap-1.5 opacity-90">
            <MapPin className="w-3.5 h-3.5" />
            {o.location}
          </div>
          <div className="font-['Cabinet_Grotesk'] font-bold text-xl mt-1 leading-tight">{o.name}</div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Target IRR</div>
            <div className="pv-num text-2xl font-bold text-[#0A2540] mt-0.5">{o.target_irr.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Yield</div>
            <div className="pv-num text-2xl font-bold text-[#10B981] mt-0.5">{o.rental_yield.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Min Invest</div>
            <div className="pv-num text-lg font-bold text-[#0A2540] mt-0.5">{inr(o.min_investment)}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{o.asset_type}</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{o.occupancy}% leased</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-600">Funded</span>
            <span className="pv-num font-semibold text-[#0A2540]">{o.funded_pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#0A2540] to-[#10B981]" style={{ width: `${o.funded_pct}%` }} />
          </div>
        </div>
      </div>
    </Link>
  );
}
