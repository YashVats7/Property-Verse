import { useState, useMemo } from "react";
import { TrendingUp, CheckCircle2, ShieldCheck, Banknote, Calculator, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import WaitlistForm from "../components/WaitlistForm";
import BackgroundFX from "../components/BackgroundFX";

function Stat({ label, value, accent = false }) {
  return (
    <div className={`rounded-xl p-4 ${accent ? "bg-[#3FB36F]/10 border border-[#3FB36F]/30" : "bg-slate-50 border border-slate-200"}`}>
      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{label}</div>
      <div className={`pv-num text-xl font-bold mt-1 ${accent ? "text-[#3FB36F]" : "text-[#0A2540]"}`}>{value}</div>
    </div>
  );
}

const STEPS = [
  { t: "Asset Identification", d: "Property Verse sources A-grade pre-leased commercial assets." },
  { t: "Diligence & Review", d: "Tenant, lease, valuation, exit potential reviewed." },
  { t: "Lender Onboarding", d: "Debt partner / NBFC structures financing against the asset." },
  { t: "Investor Equity", d: "Investors contribute equity to the structure." },
  { t: "Returns Waterfall", d: "Rent, interest, and exit distributed per transparent waterfall." },
];

const COMPARISON = {
  headers: ["", "Direct Property", "Normal Fractional", "PV Aggregator", "PV Leveraged (LFA)"],
  rows: [
    ["Min capital", "₹5 Cr+", "₹10 L+", "₹10 L+", "₹20 L+"],
    ["Asset access", "Single", "Single asset", "Multi-platform", "Curated A-grade"],
    ["Liquidity", "Very low", "Low-Medium", "Low-Medium", "Low-Medium"],
    ["Diversification", "Poor", "Limited", "Strong", "Strong"],
    ["Debt usage", "Self-financed", "None", "None", "Institutional"],
    ["Professional screening", "Self", "Platform", "Platform + PV", "Platform + PV"],
    ["Potential IRR", "8–12%", "12–15%", "13–16%", "Up to 17%+"],
    ["Risk level", "High concentration", "Moderate", "Moderate", "Moderate-High"],
    ["Best suited for", "Ultra-HNI", "Retail investors", "Curated investors", "HNI & Family Office"],
  ],
};

export default function LeveragePage() {
  const [calc, setCalc] = useState({
    exposure: 4000000, equity_pct: 50, interest: 9.5, yield: 8.5, hold_years: 5, exit_appn: 30,
  });

  const m = useMemo(() => {
    const exposure = Number(calc.exposure);
    const equity = exposure * (Number(calc.equity_pct) / 100);
    const debt = exposure - equity;
    const rentalIncome = exposure * (Number(calc.yield) / 100);
    const interestCost = debt * (Number(calc.interest) / 100);
    const netAnnualCashflow = rentalIncome - interestCost;
    const exitValue = exposure * (1 + Number(calc.exit_appn) / 100);
    const debtRemaining = debt; // assume interest-only/bullet repayment for illustration
    const exitToEquity = exitValue - debtRemaining;
    const totalReturn = exitToEquity + netAnnualCashflow * Number(calc.hold_years);
    // simple IRR approx via CAGR on equity multiple over hold years
    const multiple = totalReturn / equity;
    const irr = (Math.pow(Math.max(multiple, 0.0001), 1 / Number(calc.hold_years)) - 1) * 100;
    return { exposure, equity, debt, rentalIncome, interestCost, netAnnualCashflow, exitValue, totalReturn, irr };
  }, [calc]);

  const fmt = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div data-testid="leverage-page" className="bg-white">
      {/* Hero */}
      <section className="relative pv-hero-gradient pv-grain overflow-hidden">
        <div className="absolute inset-0 pv-grid-overlay opacity-50" />
        <BackgroundFX variant="flow" dark />
        <BackgroundFX variant="particles" dark />
        <BackgroundFX variant="rings" dark />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-20 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full pv-glass-dark text-white/90 text-xs">
            <Banknote className="w-3.5 h-3.5 text-[#3FB36F]" /> LFA · Coming Soon
          </div>
          <h1 className="font-['Cabinet_Grotesk'] text-4xl md:text-6xl font-extrabold mt-6 tracking-tighter max-w-4xl">
            Introducing <span className="pv-text-gradient">Leveraged Fractional Assets.</span>
          </h1>
          <p className="text-slate-300 mt-5 max-w-3xl text-base md:text-lg leading-relaxed">
            Own more real estate exposure with a smaller equity contribution through structured debt participation from
            banks, NBFCs, and private credit. Designed for India's A-grade pre-leased commercial real estate.
          </p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            <Stat label="Target Effective IRR" value="Up to 17%" accent />
            <Stat label="Leverage" value="Up to 1.6×" accent />
            <Stat label="Asset Grade" value="A-Grade CRE" />
            <Stat label="Min. Equity" value="₹20 L+" />
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="relative py-24 overflow-hidden">
        <BackgroundFX variant="blocks" />
        <BackgroundFX variant="rings" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Side by Side</div>
              <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold text-[#0A2540] mt-4 tracking-tighter">
                Same asset. Half the equity.
              </h2>
              <p className="text-slate-600 mt-5 leading-relaxed">
                Instead of deploying ₹40 L fully as equity, an investor may access a ₹40 L real estate exposure with around ₹20 L equity and structured debt participation — subject to asset approval, lender terms, eligibility, and risk checks.
              </p>
              <div className="mt-6 p-5 rounded-2xl border border-amber-200 bg-amber-50 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-900 leading-relaxed">
                  Debt increases both upside and risk. Returns are not guaranteed. Final structure depends on lender approval and legal/regulatory compliance.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="pv-card p-6">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Normal Fractional</div>
                <div className="pv-num text-3xl font-extrabold text-[#0A2540] mt-3">₹40 L</div>
                <div className="text-xs text-slate-500 mt-1">Equity</div>
                <div className="mt-5 text-sm font-semibold text-[#0A2540]">₹40 L exposure</div>
                <div className="text-xs text-slate-500 mt-1">8–9% rental yield</div>
              </div>
              <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0A2540] to-[#0F3860] text-white border border-[#3FB36F]/30">
                <div className="text-[10px] uppercase tracking-widest text-[#3FB36F] font-semibold">Leveraged Fractional</div>
                <div className="pv-num text-3xl font-extrabold mt-3 text-[#3FB36F]">₹20 L</div>
                <div className="text-xs text-slate-300 mt-1">Equity + ₹20L debt</div>
                <div className="mt-5 text-sm font-semibold">₹40 L exposure</div>
                <div className="text-xs text-slate-300 mt-1">Enhanced target IRR</div>
              </div>
              <div className="col-span-2 rounded-2xl overflow-hidden border border-slate-200">
                <img src="/generated/leverage_visual.png" alt="Leverage product visual" className="w-full h-56 object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How LFA works */}
      <section className="relative py-24 bg-slate-50 overflow-hidden">
        <BackgroundFX variant="matrix" />
        <BackgroundFX variant="ticker" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">How LFA Works</div>
            <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold text-[#0A2540] mt-4 tracking-tighter">
              Five steps. One structured asset.
            </h2>
          </div>
          <div className="mt-12 grid md:grid-cols-5 gap-4">
            {STEPS.map((s, i) => (
              <div key={s.t} className="pv-card p-5 relative">
                <div className="pv-num text-3xl font-bold text-[#3FB36F]/30">0{i + 1}</div>
                <div className="font-semibold text-[#0A2540] mt-2 text-sm">{s.t}</div>
                <div className="text-xs text-slate-500 mt-2 leading-relaxed">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="relative py-24 overflow-hidden">
        <BackgroundFX variant="waveform" />
        <BackgroundFX variant="grid" />
        <BackgroundFX variant="ticker" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Illustrative Calculator</div>
              <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold text-[#0A2540] mt-4 tracking-tighter">
                Model your <span className="text-[#3FB36F]">LFA</span> exposure.
              </h2>
              <p className="text-slate-600 mt-4">Move the sliders to see how equity, debt, yield, and exit dynamics affect your projected returns.</p>

              <div className="mt-8 space-y-5">
                {[
                  { k: "exposure", label: "Asset exposure", min: 1000000, max: 20000000, step: 100000, format: (v) => `₹${(v / 100000).toFixed(1)} L` },
                  { k: "equity_pct", label: "Equity contribution %", min: 30, max: 100, step: 5, format: (v) => `${v}%` },
                  { k: "interest", label: "Debt interest rate", min: 7, max: 14, step: 0.25, format: (v) => `${v}%` },
                  { k: "yield", label: "Rental yield", min: 6, max: 11, step: 0.25, format: (v) => `${v}%` },
                  { k: "hold_years", label: "Holding period", min: 3, max: 10, step: 1, format: (v) => `${v} yrs` },
                  { k: "exit_appn", label: "Exit appreciation (cumulative)", min: 0, max: 80, step: 5, format: (v) => `${v}%` },
                ].map((f) => (
                  <div key={f.k}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 font-medium">{f.label}</span>
                      <span className="pv-num font-semibold text-[#0A2540]">{f.format(calc[f.k])}</span>
                    </div>
                    <input
                      data-testid={`lfa-input-${f.k}`}
                      type="range"
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      value={calc[f.k]}
                      onChange={(e) => setCalc({ ...calc, [f.k]: parseFloat(e.target.value) })}
                      className="w-full accent-[#3FB36F]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pv-card p-8 lg:sticky lg:top-24 h-fit">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#3FB36F]" />
                <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Estimated Outputs</div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat label="Total Exposure" value={fmt(m.exposure)} />
                <Stat label="Your Equity" value={fmt(m.equity)} />
                <Stat label="Debt" value={fmt(m.debt)} />
                <Stat label="Annual Rental Income" value={fmt(m.rentalIncome)} />
                <Stat label="Annual Interest Cost" value={fmt(m.interestCost)} />
                <Stat label="Net Annual Cashflow" value={fmt(m.netAnnualCashflow)} accent />
                <Stat label="Projected Exit Value" value={fmt(m.exitValue)} />
                <Stat label="Total Investor Return" value={fmt(m.totalReturn)} />
              </div>
              <div className="mt-6 rounded-2xl bg-[#0A2540] text-white p-6">
                <div className="text-[10px] uppercase tracking-widest text-[#3FB36F] font-semibold">Effective IRR (illustrative)</div>
                <div className="pv-num text-5xl font-extrabold mt-2">{isFinite(m.irr) ? m.irr.toFixed(1) : "—"}<span className="text-2xl">%</span></div>
                <div className="text-xs text-slate-400 mt-2">Pre-tax. Net of debt cost. Excludes platform fees, taxes, and one-time costs.</div>
              </div>
              <div className="mt-4 text-[11px] text-slate-500 italic leading-relaxed">
                Illustrative calculator. Actual returns depend on final asset, debt terms, taxes, fees, and market conditions.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24 bg-slate-50 overflow-hidden">
        <BackgroundFX variant="mesh" />
        <BackgroundFX variant="particles" />
        <BackgroundFX variant="rings" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Why LFA</div>
            <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold text-[#0A2540] mt-4 tracking-tighter">
              Eight reasons to consider Leveraged Fractional Assets.
            </h2>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              "Larger real estate exposure",
              "Lower upfront equity requirement",
              "Institutional debt participation",
              "A-grade income-generating assets",
              "Potential IRR enhancement",
              "Structured risk checks",
              "Transparent repayment waterfall",
              "Asset-backed financing logic",
            ].map((f) => (
              <div key={f} className="pv-card p-5">
                <CheckCircle2 className="w-5 h-5 text-[#3FB36F]" />
                <div className="mt-3 font-semibold text-[#0A2540] text-sm">{f}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="relative py-24 overflow-hidden">
        <BackgroundFX variant="skyline" />
        <BackgroundFX variant="ticker" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Where LFA Sits</div>
          <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold text-[#0A2540] mt-4 tracking-tighter max-w-3xl">
            Compare across all real estate investment options.
          </h2>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-left">
                <tr>
                  {COMPARISON.headers.map((h, i) => (
                    <th key={i} className={`px-5 py-4 font-semibold ${i === 4 ? "text-[#3FB36F]" : "text-[#0A2540]"} whitespace-nowrap`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-slate-100 hover:bg-slate-50/60">
                    {row.map((cell, ci) => (
                      <td key={ci} className={`px-5 py-4 ${ci === 0 ? "font-semibold text-[#0A2540]" : "text-slate-600"} ${ci === 4 ? "bg-[#3FB36F]/5" : ""}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="relative py-24 bg-slate-50 overflow-hidden">
        <BackgroundFX variant="flow" />
        <BackgroundFX variant="particles" />
        <div className="relative max-w-3xl mx-auto px-6 md:px-12">
          <div className="rounded-3xl bg-[#0A2540] text-white p-10 md:p-12 relative overflow-hidden">
            <BackgroundFX variant="ticker" dark />
            <BackgroundFX variant="flow" dark />
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#3FB36F]/30 blur-3xl" />
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Early Access</div>
              <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-4xl font-extrabold mt-3 tracking-tighter">Get early access to LFA.</h2>
              <p className="text-slate-300 mt-3">Be first in line as we onboard select investors for our flagship Leveraged Fractional Asset launch.</p>
              <div className="mt-8">
                <WaitlistForm source="leverage_waitlist" title="" subtitle="" ctaLabel="Get Early Access" testIdPrefix="lfa-waitlist" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
