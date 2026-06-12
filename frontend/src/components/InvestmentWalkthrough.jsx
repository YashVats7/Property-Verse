import { motion } from "framer-motion";
import { useState } from "react";
import { Building2, Users, Wallet, BarChart3, ArrowRight, Banknote, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    n: 1, t: "Investor chooses an asset",
    d: "Browse curated A-grade pre-leased commercial assets across India's top micro-markets.",
    icon: Building2,
    visual: "marketplace",
  },
  {
    n: 2, t: "Invest fractionally",
    d: "A ₹80 Cr office building splits into 1,000 digital ownership blocks. You own a fraction.",
    icon: Users,
    visual: "fractions",
  },
  {
    n: 3, t: "Tenant pays rent",
    d: "Pre-leased corporate tenant pays monthly rent. Flows through the asset structure to you.",
    icon: Banknote,
    visual: "rent",
  },
  {
    n: 4, t: "Track everything",
    d: "Dashboard shows distributions, asset value, IRR, documents, and risk score in real time.",
    icon: BarChart3,
    visual: "dashboard",
  },
  {
    n: 5, t: "Year 6 — exit",
    d: "Asset sale or refinance. Chart shows property value compounding over 6 years.",
    icon: Wallet,
    visual: "exit",
  },
  {
    n: 6, t: "Total return realised",
    d: "₹10 L investment grows through rental income + capital appreciation + leverage effect.",
    icon: CheckCircle2,
    visual: "return",
  },
];

export default function InvestmentWalkthrough() {
  const [active, setActive] = useState(0);
  return (
    <section className="py-24 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">How It Works</div>
          <h2 className="font-['Clash_Display'] text-3xl md:text-6xl font-bold text-[#0A2540] mt-4 tracking-tighter">
            How your <span className="pv-text-gradient">investment</span> works.
          </h2>
          <p className="text-slate-600 mt-5 max-w-2xl">
            Click through each step to see how capital flows through a Property Verse leveraged fractional asset, from acquisition to exit.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-5 gap-8">
          {/* Step rail */}
          <div className="lg:col-span-2 space-y-2">
            {STEPS.map((s, i) => (
              <motion.button
                key={s.n}
                onClick={() => setActive(i)}
                whileHover={{ x: 4 }}
                data-testid={`walkthrough-step-${s.n}`}
                className={`w-full text-left rounded-2xl border p-5 transition-all flex items-start gap-4 ${active === i ? "border-[#3FB36F] bg-white shadow-lg" : "border-slate-200 bg-white/60 hover:border-slate-300"}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${active === i ? "bg-[#0A2540] text-[#3FB36F]" : "bg-slate-100 text-slate-500"}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Step {s.n}</div>
                  <div className="font-['Cabinet_Grotesk'] font-bold text-[#0A2540] mt-0.5">{s.t}</div>
                  <div className="text-sm text-slate-600 mt-1.5">{s.d}</div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Visual stage */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 h-fit">
            <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#0F3FA1] to-[#0A2540] pv-glow-ring relative overflow-hidden flex items-center justify-center p-8">
              <div className="absolute inset-0 pv-grid-overlay opacity-30" />
              <StageVisual visual={STEPS[active].visual} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StageVisual({ visual }) {
  if (visual === "marketplace")
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={visual} className="grid grid-cols-2 gap-3 max-w-md w-full">
        {[
          { c: "Bengaluru", t: "₹80 Cr · 8.5%" },
          { c: "Hyderabad", t: "₹120 Cr · 9.0%" },
          { c: "Pune", t: "₹55 Cr · 8.2%" },
          { c: "NCR", t: "₹95 Cr · 8.7%" },
        ].map((a, i) => (
          <motion.div
            key={a.c}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl bg-white/8 backdrop-blur border border-white/15 p-4 text-white"
          >
            <div className="text-[10px] uppercase tracking-widest text-[#3FB36F]">A-Grade</div>
            <div className="font-semibold mt-1.5">{a.c}</div>
            <div className="text-xs text-slate-300">{a.t}</div>
          </motion.div>
        ))}
      </motion.div>
    );
  if (visual === "fractions") {
    return (
      <motion.div key={visual} className="w-full max-w-md">
        <div className="text-white text-center mb-4">
          <div className="text-[10px] uppercase tracking-widest text-[#3FB36F]">1,000 fractional blocks</div>
          <div className="font-bold text-lg">Your fraction lights up</div>
        </div>
        <div className="grid grid-cols-20 gap-0.5" style={{ gridTemplateColumns: "repeat(20, minmax(0,1fr))" }}>
          {Array.from({ length: 200 }).map((_, i) => {
            const lit = i === 73 || i === 74 || i === 93 || i === 94;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.003 }}
                className={`aspect-square rounded-sm ${lit ? "bg-[#3FB36F] shadow-[0_0_8px_#3FB36F]" : "bg-white/10"}`}
              />
            );
          })}
        </div>
      </motion.div>
    );
  }
  if (visual === "rent") {
    return (
      <motion.div key={visual} className="w-full max-w-md text-white">
        <div className="flex items-center justify-between gap-4">
          <Block label="Tenant" sub="MNC" />
          <ArrowRight className="w-6 h-6 text-[#3FB36F]" />
          <Block label="Asset" sub="₹80 Cr" />
          <ArrowRight className="w-6 h-6 text-[#3FB36F]" />
          <Block label="Investor" sub="You" green />
        </div>
        <div className="mt-8 space-y-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 200, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.4, delay: i * 0.7, repeat: Infinity, repeatDelay: 1 }}
              className="text-xs font-mono text-[#3FB36F]"
            >
              ₹{(7083 * i).toLocaleString("en-IN")} → distribution
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }
  if (visual === "dashboard") {
    return (
      <motion.div key={visual} className="w-full max-w-md grid grid-cols-2 gap-3 text-white">
        {[
          { l: "Rental this month", v: "₹7,083" },
          { l: "Total distributions", v: "₹84,200" },
          { l: "Asset value", v: "₹84.8 Cr" },
          { l: "Projected IRR", v: "16.8%" },
        ].map((x, i) => (
          <motion.div
            key={x.l}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl bg-white/8 backdrop-blur border border-white/15 p-4"
          >
            <div className="text-[9px] uppercase tracking-widest text-[#3FB36F]">{x.l}</div>
            <div className="pv-num text-xl font-bold mt-1">{x.v}</div>
          </motion.div>
        ))}
      </motion.div>
    );
  }
  if (visual === "exit") {
    return (
      <motion.div key={visual} className="w-full max-w-md text-white text-center">
        <div className="text-[10px] uppercase tracking-widest text-[#3FB36F]">Year 6 exit projection</div>
        <div className="mt-2 font-['Clash_Display'] text-4xl font-bold">₹80 Cr → ₹113 Cr</div>
        <div className="mt-6 flex items-end justify-center gap-1 h-32">
          {[40, 48, 56, 65, 75, 88, 100].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="w-8 rounded-t bg-gradient-to-t from-[#3FB36F]/30 to-[#3FB36F]"
            />
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1 text-[10px] text-slate-300">
          {["Y0", "Y1", "Y2", "Y3", "Y4", "Y5", "Y6"].map((y) => <div key={y}>{y}</div>)}
        </div>
      </motion.div>
    );
  }
  if (visual === "return") {
    return (
      <motion.div key={visual} className="w-full max-w-md text-white text-center">
        <div className="text-[10px] uppercase tracking-widest text-[#3FB36F]">Illustrative total return</div>
        <div className="mt-1 font-['Clash_Display'] text-5xl font-bold pv-text-gradient">₹10L → ₹25L+</div>
        <div className="mt-6 space-y-2 text-left max-w-xs mx-auto">
          {[
            { l: "Rental income (6 yrs)", v: "₹5.1 L" },
            { l: "Capital appreciation", v: "₹4.2 L" },
            { l: "Leverage effect", v: "+₹6.0 L" },
            { l: "Total projected return", v: "₹15.3 L+", bold: true },
          ].map((x, i) => (
            <motion.div
              key={x.l}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`flex justify-between px-4 py-2 rounded-lg ${x.bold ? "bg-[#3FB36F]/15 border border-[#3FB36F]/30" : "bg-white/5"}`}
            >
              <span className={`text-sm ${x.bold ? "text-[#3FB36F] font-semibold" : "text-slate-300"}`}>{x.l}</span>
              <span className={`pv-num font-bold ${x.bold ? "text-[#3FB36F]" : "text-white"}`}>{x.v}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }
  return null;
}

function Block({ label, sub, green = false }) {
  return (
    <div className={`flex-1 rounded-xl border p-3 text-center ${green ? "border-[#3FB36F] bg-[#3FB36F]/15" : "border-white/15 bg-white/8"}`}>
      <div className={`text-[10px] uppercase tracking-widest ${green ? "text-[#3FB36F]" : "text-slate-400"}`}>{label}</div>
      <div className="text-sm font-bold mt-1">{sub}</div>
    </div>
  );
}
