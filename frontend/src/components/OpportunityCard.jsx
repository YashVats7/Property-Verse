import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Building2, Users, Banknote, ShieldCheck } from "lucide-react";
import { inr } from "../lib/format";

export default function OpportunityCard({ o, testIdPrefix = "opp-card" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link
        to={`/opportunities/${o.id}`}
        data-testid={`${testIdPrefix}-${o.id}`}
        className="pv-card overflow-hidden flex flex-col group h-full"
      >
        <div className="relative h-52 overflow-hidden">
          <img
            src={o.image}
            alt={o.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/85 via-[#0A2540]/20 to-transparent" />
          <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
            {o.leverage_available && (
              <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#3FB36F] to-[#1E63D5] text-white text-[10px] uppercase tracking-wider font-bold inline-flex items-center gap-1">
                <Banknote className="w-3 h-3" /> Leverage
              </span>
            )}
            {(o.tags || []).slice(0, 2).map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] uppercase tracking-wider font-semibold text-[#0A2540]">{t}</span>
            ))}
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="text-xs flex items-center gap-1.5 opacity-90"><MapPin className="w-3.5 h-3.5" />{o.location}</div>
            <div className="font-['Cabinet_Grotesk'] font-bold text-xl mt-1 leading-tight">{o.name}</div>
            {o.asset_value_cr && <div className="pv-num text-xs text-[#3FB36F] mt-0.5 font-semibold">Asset value · ₹{o.asset_value_cr} Cr</div>}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Target IRR</div>
              <div className="pv-num text-xl font-bold text-[#0A2540] mt-0.5">{o.target_irr_range || `${o.target_irr.toFixed(1)}%`}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Yield</div>
              <div className="pv-num text-xl font-bold text-[#3FB36F] mt-0.5">{o.rental_yield.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Min Invest</div>
              <div className="pv-num text-base font-bold text-[#0A2540] mt-0.5">{inr(o.min_investment)}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 flex-wrap">
            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{o.asset_type}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{o.occupancy}% leased</span>
            {o.risk_score && <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />Score {o.risk_score}/100</span>}
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-600">Funded</span>
              <span className="pv-num font-semibold text-[#0A2540]">{o.funded_pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#1E63D5] to-[#3FB36F]" style={{ width: `${o.funded_pct}%` }} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
