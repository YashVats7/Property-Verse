import { useEffect, useMemo, useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { TrendingUp, Building2, Banknote, Wallet, ArrowDown, ArrowRight, MapPin, Star, ShieldCheck, Sparkles, Activity, BarChart3, Layers } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// ----- Animated number counter -----
export function CountUp({ end, duration = 1.8, prefix = "", suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(end * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);
  const num = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-IN");
  return <span ref={ref}>{prefix}{num}{suffix}</span>;
}

// ----- Animated hero asset card with flowing capital lines -----
export function HeroAssetCard() {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="absolute -inset-10 bg-gradient-to-br from-[#3FB36F]/30 via-[#1E63D5]/20 to-transparent blur-3xl rounded-[40px]" />

      {/* Floating bank/investor labels */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="hidden md:block absolute -left-6 lg:-left-20 -top-6 z-20 pv-glass-dark rounded-xl px-3 py-2 text-white text-xs shadow-xl"
      >
        <div className="text-[9px] uppercase tracking-widest text-[#3FB36F]">Investor Capital</div>
        <div className="font-semibold">₹20 L equity</div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="hidden md:block absolute -right-6 lg:-right-20 -top-6 z-20 pv-glass-dark rounded-xl px-3 py-2 text-white text-xs shadow-xl"
      >
        <div className="text-[9px] uppercase tracking-widest text-[#6EE7B7]">Bank / NBFC Debt</div>
        <div className="font-semibold">₹20 L debt</div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        className="hidden md:block absolute -right-6 lg:-right-24 -bottom-4 z-20 pv-glass-dark rounded-xl px-3 py-2 text-white text-xs shadow-xl"
      >
        <div className="text-[9px] uppercase tracking-widest text-[#3FB36F]">Rental Yield</div>
        <div className="font-semibold pv-num">8.5% p.a.</div>
      </motion.div>

      {/* SVG flow lines */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 500 500" preserveAspectRatio="none">
        <defs>
          <linearGradient id="flowGreen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3FB36F" stopOpacity="0" />
            <stop offset="50%" stopColor="#3FB36F" stopOpacity="1" />
            <stop offset="100%" stopColor="#3FB36F" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flowBlue" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0" />
            <stop offset="50%" stopColor="#6EE7B7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 0 80 Q 150 80 230 250" stroke="#3FB36F" strokeWidth="2" fill="none" className="pv-dash" opacity="0.7" />
        <path d="M 500 140 Q 350 140 270 250" stroke="#6EE7B7" strokeWidth="2" fill="none" className="pv-dash" opacity="0.7" />
        <path d="M 270 280 Q 380 350 500 360" stroke="#3FB36F" strokeWidth="2" fill="none" className="pv-dash" opacity="0.7" />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative pv-glass-dark rounded-[28px] p-5 md:p-6 text-white pv-glow-ring"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#3FB36F]/20 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#3FB36F]" />
            </div>
            <div>
              <div className="text-sm font-semibold">Grade-A Office Park</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" />Bengaluru · Pre-Leased</div>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-[#3FB36F]/15 border border-[#3FB36F]/30 text-[#3FB36F] text-[10px] font-semibold uppercase tracking-widest">A-Grade</div>
        </div>

          <div className="mt-3 rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Asset Value</div>
            <div className="pv-num text-3xl md:text-4xl font-bold mt-1">₹<CountUp end={80} />Cr</div>
            <div className="mt-3 h-20" style={{ minWidth: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { y: 80 }, { y: 84 }, { y: 89 }, { y: 95 }, { y: 102 }, { y: 110 }, { y: 119 },
              ]}>
                <defs>
                  <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3FB36F" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#3FB36F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="y" stroke="#3FB36F" strokeWidth={2} fill="url(#heroArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
            <span>Y0</span><span>Y6 Exit projection</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {[
            { l: "Yield", v: <><CountUp end={8.5} decimals={1} />%</>, c: "text-[#3FB36F]" },
            { l: "IRR (target)", v: <>up to <CountUp end={17} />%</>, c: "" },
            { l: "Holding", v: "6 yrs", c: "" },
            { l: "Min Ticket", v: "₹10 L", c: "" },
            { l: "Fraction", v: "0.13%", c: "" },
            { l: "Leverage", v: "1.6×", c: "text-[#6EE7B7]" },
          ].map((x) => (
            <div key={x.l} className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold">{x.l}</div>
              <div className={`pv-num text-base font-bold mt-1 ${x.c}`}>{x.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-2xl border border-[#3FB36F]/30 bg-[#3FB36F]/8 p-3 flex items-center gap-3">
          <Banknote className="w-5 h-5 text-[#3FB36F]" />
          <div className="flex-1">
            <div className="text-xs font-semibold">Bank/NBFC-backed debt participation</div>
            <div className="text-[10px] text-slate-300">Up to 50% structured debt · subject to lender approval</div>
          </div>
          <div className="pv-num text-sm font-bold text-[#3FB36F]">+1.6×</div>
        </div>
      </motion.div>
    </div>
  );
}

// ----- 6-Year Return Simulator -----
export function ReturnSimulator() {
  const [inv, setInv] = useState(1000000);
  const [yieldPct, setYieldPct] = useState(8.5);
  const [appn, setAppn] = useState(6);
  const [years, setYears] = useState(6);
  const [leverage, setLeverage] = useState(true);
  const [debtPct, setDebtPct] = useState(50);
  const [rate, setRate] = useState(9.5);

  const data = useMemo(() => {
    const equity = inv;
    const exposure = leverage ? equity / (1 - debtPct / 100) : equity;
    const debt = exposure - equity;
    const rows = [];
    let assetVal = exposure;
    let cumRent = 0, cumInterest = 0;
    for (let y = 0; y <= years; y++) {
      const annualRent = assetVal * (yieldPct / 100);
      const interestCost = debt * (rate / 100);
      if (y > 0) { cumRent += annualRent; cumInterest += interestCost; }
      const net = cumRent - cumInterest;
      const exitIfNow = assetVal - debt;
      const totalReturn = net + (exitIfNow - equity);
      rows.push({
        year: `Y${y}`,
        assetValue: Math.round(assetVal / 100000) / 10, // in Cr
        cumNet: Math.round(net),
        totalReturn: Math.round(totalReturn),
        cumInterest: Math.round(cumInterest),
      });
      assetVal = assetVal * (1 + appn / 100);
    }
    const finalRow = rows[rows.length - 1];
    const finalEquity = finalRow.totalReturn + equity;
    const multiple = finalEquity / equity;
    const irr = (Math.pow(Math.max(multiple, 0.0001), 1 / years) - 1) * 100;
    return { rows, exposure, equity, debt, cumRent: Math.round(rows[rows.length - 1]?.cumNet + cumInterest), cumInterest: Math.round(cumInterest), finalEquity: Math.round(finalEquity), totalReturn: Math.round(rows[rows.length - 1]?.totalReturn || 0), irr, };
  }, [inv, yieldPct, appn, years, leverage, debtPct, rate]);

  const fmt = (n) => `₹${(Math.abs(n) / 100000).toFixed(1)} L`;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 pv-card p-7">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Inputs</div>
        <div className="space-y-4 mt-4">
          {[
            { k: "inv", l: "Investment", v: inv, min: 100000, max: 5000000, step: 100000, fmt: (v) => `₹${(v / 100000).toFixed(1)} L`, on: setInv },
            { k: "yieldPct", l: "Rental yield", v: yieldPct, min: 6, max: 11, step: 0.25, fmt: (v) => `${v}%`, on: setYieldPct },
            { k: "appn", l: "Annual appreciation", v: appn, min: 0, max: 15, step: 0.5, fmt: (v) => `${v}%`, on: setAppn },
            { k: "years", l: "Holding period", v: years, min: 3, max: 10, step: 1, fmt: (v) => `${v} yrs`, on: setYears },
          ].map((f) => (
            <div key={f.k}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600">{f.l}</span>
                <span className="pv-num font-semibold text-[#0A2540]">{f.fmt(f.v)}</span>
              </div>
              <input
                data-testid={`sim-input-${f.k}`}
                type="range" min={f.min} max={f.max} step={f.step}
                value={f.v} onChange={(e) => f.on(parseFloat(e.target.value))}
                className="w-full accent-[#3FB36F]"
              />
            </div>
          ))}

          <div className="rounded-xl border border-slate-200 p-4 mt-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-semibold text-[#0A2540]">Use Leverage (LFA)</span>
              <button
                onClick={() => setLeverage((v) => !v)}
                data-testid="sim-leverage-toggle"
                className={`relative w-12 h-6 rounded-full transition-colors ${leverage ? "bg-[#3FB36F]" : "bg-slate-300"}`}
              >
                <div className={`absolute top-0.5 ${leverage ? "left-6" : "left-0.5"} w-5 h-5 rounded-full bg-white shadow transition-all`} />
              </button>
            </label>
            {leverage && (
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Debt %</span>
                    <span className="pv-num font-semibold text-[#0A2540]">{debtPct}%</span>
                  </div>
                  <input type="range" min="20" max="60" step="5" value={debtPct} onChange={(e) => setDebtPct(parseFloat(e.target.value))} className="w-full accent-[#1E63D5]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Interest rate</span>
                    <span className="pv-num font-semibold text-[#0A2540]">{rate}%</span>
                  </div>
                  <input type="range" min="7" max="14" step="0.25" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full accent-[#1E63D5]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <div className="pv-card p-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Asset value over time</div>
              <div className="font-['Cabinet_Grotesk'] text-2xl font-bold text-[#0A2540] mt-1">₹{data.rows[data.rows.length - 1].assetValue} Cr <span className="text-sm text-slate-500 font-medium">at Y{years}</span></div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-[#3FB36F] font-semibold">Projected IRR</div>
              <div className="pv-num text-3xl font-extrabold text-[#3FB36F]">{isFinite(data.irr) ? data.irr.toFixed(1) : "—"}<span className="text-base">%</span></div>
            </div>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.rows} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3FB36F" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3FB36F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="year" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `${v}Cr`} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 12 }}
                  formatter={(v, name) => name === "assetValue" ? [`₹${v} Cr`, "Asset value"] : [v, name]}
                />
                <Line type="monotone" dataKey="assetValue" stroke="#3FB36F" strokeWidth={3} dot={{ r: 4, fill: "#3FB36F" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="pv-card p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Total exposure</div>
            <div className="pv-num font-bold text-[#0A2540] mt-1.5">{fmt(data.exposure)}</div>
          </div>
          <div className="pv-card p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Equity</div>
            <div className="pv-num font-bold text-[#0A2540] mt-1.5">{fmt(data.equity)}</div>
          </div>
          <div className="pv-card p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Debt</div>
            <div className="pv-num font-bold text-[#1E63D5] mt-1.5">{fmt(data.debt)}</div>
          </div>
          <div className="pv-card p-4 bg-gradient-to-br from-[#3FB36F]/10 to-[#1E63D5]/5">
            <div className="text-[10px] uppercase tracking-widest text-[#3FB36F] font-semibold">Total return</div>
            <div className="pv-num font-bold text-[#0A2540] mt-1.5">{fmt(data.totalReturn)}</div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic leading-relaxed">
          Illustrative simulation only. Actual returns depend on asset performance, rent collection, debt cost, exit value, fees, taxes, and market conditions.
        </div>
      </div>
    </div>
  );
}

// ----- Cash flow waterfall -----
export function CashFlowWaterfall() {
  const steps = [
    { l: "Tenant pays rent", v: "₹100", color: "#3FB36F" },
    { l: "− Operating expenses", v: "−₹8", color: "#94A3B8" },
    { l: "− Debt interest", v: "−₹22", color: "#1E63D5" },
    { l: "− Reserve account", v: "−₹5", color: "#64748B" },
    { l: "Investor distribution", v: "₹65", color: "#3FB36F", bold: true },
  ];

  return (
    <div className="relative">
      <svg className="absolute inset-0 -z-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
        <line x1="50" y1="0" x2="50" y2="400" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
      <div className="relative space-y-3">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`flex items-center justify-between rounded-2xl px-5 py-4 border ${s.bold ? "bg-[#0A2540] text-white border-[#3FB36F]/30" : "bg-white border-slate-200"}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-10 rounded-full" style={{ background: s.color }} />
              <div>
                <div className={`text-[10px] uppercase tracking-widest font-semibold ${s.bold ? "text-[#3FB36F]" : "text-slate-500"}`}>Step {i + 1}</div>
                <div className={`text-sm md:text-base font-semibold ${s.bold ? "text-white" : "text-[#0A2540]"}`}>{s.l}</div>
              </div>
            </div>
            <div className={`pv-num text-xl md:text-2xl font-bold ${s.bold ? "text-[#3FB36F]" : "text-[#0A2540]"}`}>{s.v}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ----- Asset Intelligence (circular scores) -----
export function AssetIntelligence() {
  const scores = [
    { l: "Location", v: 88, c: "#1E63D5" },
    { l: "Tenant Quality", v: 92, c: "#3FB36F" },
    { l: "Lease Strength", v: 86, c: "#1E63D5" },
    { l: "Rental Yield", v: 85, c: "#3FB36F" },
    { l: "Debt Eligibility", v: 84, c: "#1E63D5" },
    { l: "Exit Visibility", v: 80, c: "#3FB36F" },
  ];
  return (
    <div className="grid lg:grid-cols-3 gap-6 items-center">
      <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
        {scores.map((s, i) => <CircularScore key={s.l} score={s.v} label={s.l} color={s.c} delay={i * 0.1} />)}
      </div>
      <div className="pv-card p-7 bg-gradient-to-br from-[#0A2540] to-[#0F3FA1] text-white">
        <div className="text-[10px] uppercase tracking-widest text-[#3FB36F] font-semibold">Overall Asset Score</div>
        <div className="mt-4 relative w-44 h-44 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
            <motion.circle
              cx="50" cy="50" r="44"
              stroke="#3FB36F" strokeWidth="8" fill="none" strokeLinecap="round"
              strokeDasharray={`${(2 * Math.PI * 44 * 87) / 100} ${2 * Math.PI * 44}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
              whileInView={{ strokeDashoffset: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="pv-num text-5xl font-extrabold"><CountUp end={87} />/100</div>
            <div className="text-[11px] uppercase tracking-widest text-[#3FB36F] mt-1 font-semibold">Institutional</div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-300">
          <Star className="w-4 h-4 text-[#3FB36F]" /> Grade-A Office Park, Bengaluru
        </div>
      </div>
    </div>
  );
}

function CircularScore({ score, label, color, delay = 0 }) {
  const r = 36, c = 2 * Math.PI * r;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="pv-card p-5 text-center"
    >
      <div className="relative w-24 h-24 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} stroke="#F1F5F9" strokeWidth="8" fill="none" />
          <motion.circle
            cx="50" cy="50" r={r} stroke={color} strokeWidth="8" fill="none" strokeLinecap="round"
            strokeDasharray={`${(c * score) / 100} ${c}`}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.2, duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="pv-num text-xl font-bold text-[#0A2540]"><CountUp end={score} /></div>
        </div>
      </div>
      <div className="mt-3 text-sm font-semibold text-[#0A2540]">{label}</div>
    </motion.div>
  );
}

// ----- India map with hotspots -----
const HOTSPOTS = [
  { city: "Mumbai", x: 18, y: 60, yield: "8.0%", irr: "13.9%" },
  { city: "Pune", x: 22, y: 62, yield: "8.2%", irr: "14.5%" },
  { city: "Bengaluru", x: 32, y: 78, yield: "8.5%", irr: "16.2%" },
  { city: "Chennai", x: 42, y: 82, yield: "9.0%", irr: "15.8%" },
  { city: "Hyderabad", x: 38, y: 65, yield: "9.0%", irr: "17.1%" },
  { city: "NCR", x: 40, y: 22, yield: "8.7%", irr: "15.4%" },
];

export function IndiaMap() {
  const [active, setActive] = useState(2);
  return (
    <div className="grid lg:grid-cols-5 gap-8 items-center">
      <div className="lg:col-span-3 relative aspect-square max-w-md mx-auto">
        <svg viewBox="0 0 100 110" className="w-full h-full">
          {/* Stylized India outline (simplified) */}
          <path
            d="M40 8 L52 12 L58 22 L62 32 L60 42 L66 50 L68 60 L60 76 L52 88 L44 96 L36 92 L30 82 L24 74 L22 64 L18 56 L20 46 L26 38 L30 28 L34 18 Z"
            fill="url(#mapGrad)" stroke="#1E63D5" strokeWidth="0.4" strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="mapGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#F0FDF4" />
            </linearGradient>
          </defs>
          {HOTSPOTS.map((h, i) => (
            <g key={h.city} onClick={() => setActive(i)} className="cursor-pointer">
              <circle cx={h.x} cy={h.y} r={active === i ? 1.8 : 1.2} fill={active === i ? "#3FB36F" : "#1E63D5"}>
                <animate attributeName="r" values={active === i ? "1.6;2.4;1.6" : "1.0;1.4;1.0"} dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={h.x} cy={h.y} r="3.4" fill={active === i ? "#3FB36F" : "#1E63D5"} opacity="0.2">
                <animate attributeName="r" values="3;6;3" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <text x={h.x + 3} y={h.y + 1} fontSize="2" fill="#0A2540" fontWeight="700">{h.city}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="lg:col-span-2 space-y-3">
        <div className="text-xs uppercase tracking-widest text-[#3FB36F] font-semibold">Live Hotspots</div>
        <h3 className="font-['Cabinet_Grotesk'] text-2xl md:text-3xl font-extrabold text-[#0A2540] tracking-tighter">
          Curated across India's top CRE micro-markets.
        </h3>
        <div className="space-y-2 mt-4">
          {HOTSPOTS.map((h, i) => (
            <button
              key={h.city}
              onClick={() => setActive(i)}
              data-testid={`map-city-${h.city.toLowerCase()}`}
              className={`w-full text-left rounded-xl border px-4 py-3 transition-all flex items-center justify-between ${active === i ? "border-[#3FB36F] bg-[#3FB36F]/5" : "border-slate-200 hover:border-slate-300"}`}
            >
              <div>
                <div className="font-semibold text-[#0A2540]">{h.city}</div>
                <div className="text-[11px] text-slate-500">Yield {h.yield} · IRR {h.irr}</div>
              </div>
              <ArrowRight className={`w-4 h-4 ${active === i ? "text-[#3FB36F]" : "text-slate-400"}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----- Premium investor dashboard mockup -----
export function DashboardMockup() {
  const data = [
    { m: "M1", rent: 0.7, value: 80 },
    { m: "M6", rent: 4.2, value: 82 },
    { m: "M12", rent: 8.5, value: 84.8 },
    { m: "M24", rent: 17.5, value: 90 },
    { m: "M36", rent: 27, value: 95.4 },
    { m: "M48", rent: 37.3, value: 101 },
    { m: "M60", rent: 48.4, value: 107 },
    { m: "M72", rent: 60.4, value: 113.4 },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-gradient-to-br from-[#1E63D5]/15 via-[#3FB36F]/10 to-transparent blur-3xl rounded-[40px]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-2xl"
      >
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="text-xs text-slate-500 font-mono">app.propertyverse.in/dashboard</div>
          <div className="w-12" />
        </div>

        <div className="grid md:grid-cols-[200px_1fr]">
          {/* Sidebar */}
          <div className="border-r border-slate-100 p-4 hidden md:block">
            {[
              { i: BarChart3, t: "Marketplace" },
              { i: Layers, t: "Leveraged Assets", active: true },
              { i: Wallet, t: "Portfolio" },
              { i: Activity, t: "Simulator" },
              { i: ShieldCheck, t: "Asset Intel" },
              { i: Sparkles, t: "Book Call" },
            ].map((x) => (
              <div key={x.t} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium mb-1 ${x.active ? "bg-[#0A2540] text-white" : "text-slate-600 hover:bg-slate-50"}`}>
                <x.i className="w-3.5 h-3.5" /> {x.t}
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="p-5 md:p-7">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {[
                { l: "Total Invested", v: "₹10 L", a: "text-[#0A2540]" },
                { l: "Asset Exposure", v: "₹20 L", a: "text-[#1E63D5]" },
                { l: "Rental Received", v: "₹84,200", a: "text-[#3FB36F]" },
                { l: "Projected IRR", v: "16.8%", a: "text-[#3FB36F]" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-slate-200 p-3 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold truncate">{s.l}</div>
                  <div className={`pv-num text-lg xl:text-xl font-extrabold mt-1 whitespace-nowrap ${s.a}`}>{s.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">6-year asset value (illustrative)</div>
                  <div className="font-['Cabinet_Grotesk'] text-lg font-bold text-[#0A2540]">₹80 Cr → ₹113 Cr</div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#3FB36F]/10 text-[#3FB36F] text-[10px] font-bold uppercase tracking-widest">+41.7%</div>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="dashGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3FB36F" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#3FB36F" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" stroke="#94A3B8" fontSize={10} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="value" stroke="#3FB36F" strokeWidth={2.5} fill="url(#dashGreen)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Asset Score</div>
                <div className="pv-num text-2xl font-extrabold text-[#3FB36F] mt-1">87/100</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Next distribution</div>
                <div className="pv-num text-sm font-bold text-[#0A2540] mt-1">12 Jan · ₹7,083</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 bg-[#0A2540] text-white">
                <div className="text-[10px] uppercase tracking-widest text-[#3FB36F] font-semibold">Exit timeline</div>
                <div className="pv-num text-sm font-bold mt-1">Q4 · 2031</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
