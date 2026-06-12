import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowRight, Building2, TrendingUp, Layers, Shield, BarChart3,
  Banknote, Sparkles, ChevronRight, CheckCircle2, MapPin, Users, Briefcase, Globe2
} from "lucide-react";
import api from "../lib/api";
import OpportunityCard from "../components/OpportunityCard";
import WaitlistForm from "../components/WaitlistForm";

const TRUST_BAR = [
  "A-Grade Commercial Assets",
  "Bank / NBFC Financing Network",
  "Data-backed Due Diligence",
  "Fractional Ownership Access",
  "Institutional Real Estate",
];

const PILLARS = [
  {
    icon: Layers,
    title: "Aggregator Marketplace",
    desc: "Compare curated fractional real estate opportunities across trusted platforms and asset owners.",
  },
  {
    icon: TrendingUp,
    title: "Leverage-Based Products",
    desc: "Access upcoming leveraged fractional real estate structures designed for enhanced exposure with institutional debt.",
  },
  {
    icon: BarChart3,
    title: "Data & Intelligence",
    desc: "Asset-level data, location insights, rental trends, occupancy quality, yield, and risk before you invest.",
  },
];

const PARTNERS_ECOSYSTEM = ["hBits", "Strata", "PropShare", "Assetmonk", "Bhive Alts", "Ryzer", "ALT DRX", "Assetkart"];

const LENDER_RAILS = [
  { title: "Bank Debt", desc: "Scheduled commercial bank financing rails." },
  { title: "NBFC Funding", desc: "Non-banking lender participation against income assets." },
  { title: "Private Credit", desc: "Structured private capital for bespoke deals." },
  { title: "Asset-Backed", desc: "Lien-backed structures aligned to rent + exit." },
  { title: "Equity + Debt", desc: "Blended investor equity with institutional debt." },
];

const PERSONAS = [
  { title: "HNIs", desc: "Seeking real-estate backed income." },
  { title: "Founders & Operators", desc: "Wanting alternative assets beyond equity." },
  { title: "Family Offices", desc: "Curated CRE exposure across cycles." },
  { title: "Asset-Backed Investors", desc: "Diversifying beyond stocks and bonds." },
  { title: "NRIs", desc: "Assisted Indian real estate access." },
  { title: "Wealth Managers", desc: "Better real estate products for clients." },
];

export default function HomePage() {
  const [opps, setOpps] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/opportunities").then((r) => setOpps(r.data.items.slice(0, 3))).catch(() => {});
    api.get("/stats").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden pv-hero-gradient pv-grain">
        <div className="absolute inset-0 pv-grid-overlay opacity-60" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="pv-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full pv-glass-dark text-white/90 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] pv-pulse-dot" />
                India's Real Estate Investment Layer
              </div>
              <h1 className="font-['Cabinet_Grotesk'] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tighter mt-6">
                Access institutional-grade real estate, <span className="pv-text-gradient">fractionally.</span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 mt-6 max-w-xl leading-relaxed">
                Property Verse helps investors discover curated fractional real estate opportunities and upcoming
                leverage-enabled investment products — backed by strong due diligence, A-grade assets, and institutional financing rails.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  data-testid="hero-cta-waitlist"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#10B981] text-white font-semibold hover:bg-[#059669] transition-all hover:shadow-[0_12px_40px_rgba(16,185,129,0.45)]"
                >
                  Join Investor Waitlist
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/opportunities"
                  data-testid="hero-cta-explore"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/8 backdrop-blur border border-white/20 text-white font-semibold hover:bg-white/14 transition-colors"
                >
                  Explore How It Works
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
                {[
                  { v: "₹60Cr+", l: "Executed (team)" },
                  { v: "17%", l: "Target IRR (LFA)" },
                  { v: "20+ yrs", l: "Team experience" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="pv-num text-2xl md:text-3xl font-bold text-white">{s.v}</div>
                    <div className="text-xs text-slate-400 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero dashboard mockup */}
            <div className="relative pv-fade-up pv-delay-200">
              <div className="absolute -inset-10 bg-gradient-to-br from-[#10B981]/30 via-transparent to-[#0F3860]/40 blur-3xl rounded-[40px]" />
              <div className="relative pv-glass-dark rounded-[28px] p-5 md:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">BKC Skyline Towers</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" />Mumbai · Pre-Leased</div>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-[10px] font-semibold uppercase tracking-widest">A-Grade</div>
                </div>

                <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Asset Value</div>
                  <div className="pv-num text-3xl font-bold mt-1">₹ 142 Cr</div>
                  <div className="mt-3 h-16 flex items-end gap-1.5">
                    {[20, 32, 28, 44, 38, 52, 48, 64, 58, 72, 68, 84].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-[#10B981]/30 to-[#10B981]" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Expected Yield</div>
                    <div className="pv-num text-2xl font-bold mt-1 text-[#10B981]">8.4%</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Projected IRR</div>
                    <div className="pv-num text-2xl font-bold mt-1">14.6%</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Investor Ticket</div>
                    <div className="pv-num text-xl font-bold mt-1">₹ 25 L</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Fraction</div>
                    <div className="pv-num text-xl font-bold mt-1">0.18%</div>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-[#10B981]/30 bg-[#10B981]/8 p-4 flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-[#10B981]" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold">Leverage Available</div>
                    <div className="text-[11px] text-slate-300">Up to 50% structured debt · subject to lender approval</div>
                  </div>
                  <div className="pv-num text-sm font-bold text-[#10B981]">+1.6×</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-20 border-t border-white/10 pt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-slate-400">
            {TRUST_BAR.map((t) => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      {stats && (
        <section className="border-y border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { v: `₹${stats.aum_inr_cr.toLocaleString()}Cr+`, l: "Curated AUM" },
              { v: stats.investors.toLocaleString(), l: "Investors Tracked" },
              { v: stats.properties, l: "Assets Screened" },
              { v: `${stats.avg_irr}%`, l: "Avg. Target IRR" },
              { v: `${stats.cities}`, l: "Indian Cities" },
            ].map((s) => (
              <div key={s.l}>
                <div className="pv-num text-3xl font-bold text-[#0A2540]">{s.v}</div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">{s.l}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WHAT IS PROPERTY VERSE */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#10B981] font-semibold">What is Property Verse</div>
            <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold text-[#0A2540] mt-4 tracking-tighter">
              A real estate investment platform built for modern investors.
            </h2>
            <p className="text-slate-600 mt-5 text-base md:text-lg leading-relaxed">
              Property Verse helps you discover curated, real estate-backed opportunities without buying an entire property — combining fractional ownership, leverage-enabled products, and data intelligence in one platform.
            </p>
          </div>

          <div className="mt-12 relative rounded-3xl overflow-hidden border border-slate-200">
            <img src="/generated/fractional_illustration.png" alt="Fractional ownership illustration" className="w-full h-72 md:h-96 object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10">
              <div className="font-['Cabinet_Grotesk'] text-2xl md:text-3xl font-extrabold text-[#0A2540] max-w-xl tracking-tighter">
                One building. Many fractions. Backed by data, structured for institutions, accessible for you.
              </div>
            </div>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => (
              <div key={p.title} className="pv-card p-7">
                <div className="w-12 h-12 rounded-xl bg-[#0A2540]/5 flex items-center justify-center">
                  <p.icon className="w-5 h-5 text-[#0A2540]" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-5">Pillar {i + 1}</div>
                <div className="font-['Cabinet_Grotesk'] text-xl font-bold text-[#0A2540] mt-1">{p.title}</div>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES PREVIEW */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.25em] text-[#10B981] font-semibold">Curated Opportunities</div>
              <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold text-[#0A2540] mt-4 tracking-tighter">
                Compare fractional real estate, in one place.
              </h2>
              <p className="text-slate-600 mt-4">
                A-grade pre-leased commercial assets across India's premier office markets. Illustrative samples below.
              </p>
            </div>
            <Link
              to="/opportunities"
              data-testid="opps-view-all-link"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A2540] hover:text-[#10B981]"
            >
              View all opportunities <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opps.map((o) => (
              <OpportunityCard key={o.id} o={o} testIdPrefix="home-opp" />
            ))}
          </div>
          <div className="mt-6 text-xs text-slate-500 italic">Illustrative data. Final figures subject to asset structuring and lender approval.</div>
        </div>
      </section>

      {/* LFA TEASER */}
      <section className="py-24 md:py-32 bg-[#0A2540] text-white relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-[#10B981]/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full bg-[#0F3860]/40 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#10B981] font-semibold">Introducing LFA</div>
              <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold mt-4 tracking-tighter">
                Leveraged Fractional Assets. <span className="pv-text-gradient">Own more, with less.</span>
              </h2>
              <p className="text-slate-300 mt-5 leading-relaxed">
                India's upcoming first leverage-backed fractional real estate product. Combine investor equity with structured debt from banks and NBFCs to access larger A-grade commercial exposure — targeting enhanced projected IRR.
              </p>
              <ul className="mt-6 space-y-3">
                {["Larger real estate exposure", "Institutional debt participation", "Asset-backed financing logic", "Transparent repayment waterfall"].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{t}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/leverage"
                data-testid="lfa-teaser-cta"
                className="mt-9 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#10B981] text-white font-semibold hover:bg-[#059669] transition-colors"
              >
                Get Early Access to LFA <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Comparison cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur">
                <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Normal Fractional</div>
                <div className="pv-num text-3xl font-bold mt-3">₹40 L</div>
                <div className="text-xs text-slate-400 mt-1">Equity deployed</div>
                <div className="mt-5 text-sm text-slate-300">Owns ₹40 L exposure</div>
                <div className="mt-1 text-sm text-slate-300">Rental yield + appreciation</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#10B981]/15 to-[#10B981]/5 border border-[#10B981]/40 p-6 backdrop-blur">
                <div className="text-xs uppercase tracking-widest text-[#10B981] font-semibold">Leveraged Fractional</div>
                <div className="pv-num text-3xl font-bold mt-3 text-[#10B981]">₹20 L</div>
                <div className="text-xs text-slate-300 mt-1">Equity + ₹20 L debt</div>
                <div className="mt-5 text-sm text-slate-100">Accesses ₹40 L exposure</div>
                <div className="mt-1 text-sm text-slate-300">Enhanced potential IRR</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ASSET QUALITY */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#10B981] font-semibold">Asset Quality</div>
            <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold text-[#0A2540] mt-4 tracking-tighter">
              We focus on A-grade real estate, only.
            </h2>
            <p className="text-slate-600 mt-5">Every asset is screened across 11 institutional parameters before it enters the platform.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Building2, t: "Grade-A Office" },
              { icon: Users, t: "Strong Tenant" },
              { icon: Briefcase, t: "Lease Visibility" },
              { icon: Banknote, t: "Bankable Asset" },
              { icon: TrendingUp, t: "Exit Potential" },
              { icon: Shield, t: "Title Verified" },
            ].map((x) => (
              <div key={x.t} className="pv-card p-5 text-center">
                <x.icon className="w-6 h-6 text-[#10B981] mx-auto" />
                <div className="text-sm font-semibold text-[#0A2540] mt-3">{x.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANK / NBFC FINANCING RAILS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#10B981] font-semibold">Financing Rails</div>
            <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold text-[#0A2540] mt-4 tracking-tighter">
              Institutional financing rails for real estate products.
            </h2>
            <p className="text-slate-600 mt-5">
              We're building lender relationships with banks, NBFCs, and private credit partners to create structured financing rails for fractional real estate. <span className="italic">Partner logos shown only after final approval.</span>
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-5 gap-4">
            {LENDER_RAILS.map((r) => (
              <div key={r.title} className="pv-card p-5">
                <Banknote className="w-5 h-5 text-[#10B981]" />
                <div className="font-semibold text-[#0A2540] mt-3 text-sm">{r.title}</div>
                <div className="text-xs text-slate-500 mt-1.5 leading-relaxed">{r.desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-hidden border border-slate-200 rounded-2xl bg-white">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Lender Network · Placeholder</div>
              <div className="text-[11px] text-slate-400 italic">Financing subject to approval</div>
            </div>
            <div className="overflow-hidden">
              <div className="flex pv-marquee gap-12 py-6 px-6 whitespace-nowrap">
                {["Bank Partner", "NBFC Network", "Private Credit", "Structured Finance", "Asset-Backed Lender", "Bank Partner", "NBFC Network", "Private Credit", "Structured Finance", "Asset-Backed Lender"].map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-400">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Banknote className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-sm font-semibold tracking-tight">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER ECOSYSTEM */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#10B981] font-semibold">Ecosystem</div>
            <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold text-[#0A2540] mt-4 tracking-tighter">
              Built with a real estate investment ecosystem.
            </h2>
            <p className="text-slate-600 mt-5">Fractional platforms, asset owners, real estate operators, lenders, data providers, and wealth managers — connected.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {PARTNERS_ECOSYSTEM.map((p) => (
              <div key={p} className="pv-card p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-slate-400" />
                </div>
                <div className="mt-4 font-semibold text-[#0A2540]">{p}</div>
                <div className="text-[11px] text-slate-400 mt-1 italic">Ecosystem network</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERSONAS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#10B981] font-semibold">Who It's For</div>
            <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold text-[#0A2540] mt-4 tracking-tighter">
              Designed for serious investors.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERSONAS.map((p) => (
              <div key={p.title} className="pv-card p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <div className="font-semibold text-[#0A2540]">{p.title}</div>
                  <div className="text-sm text-slate-600 mt-1">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#10B981] font-semibold">How It Works</div>
            <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold text-[#0A2540] mt-4 tracking-tighter">
              From waitlist to investment, in 7 steps.
            </h2>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              "Join the waitlist",
              "Share your investment preferences",
              "Discover curated opportunities",
              "Review asset documents & risk summary",
              "Book an assisted investment call",
              "Invest via the relevant partner / structure",
              "Track asset updates & returns",
            ].map((s, i) => (
              <div key={i} className="pv-card p-6">
                <div className="pv-num text-3xl font-bold text-[#10B981]/30">{String(i + 1).padStart(2, "0")}</div>
                <div className="mt-3 font-semibold text-[#0A2540] text-sm leading-snug">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="rounded-3xl bg-[#0A2540] text-white p-10 md:p-14 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#10B981]/25 blur-3xl" />
            <div className="relative">
              <Sparkles className="w-6 h-6 text-[#10B981]" />
              <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-4xl font-extrabold mt-4 tracking-tighter">
                Join the future of real estate investing.
              </h2>
              <p className="text-slate-300 mt-3 max-w-xl">
                Be first in line for curated fractional opportunities and our flagship Leveraged Fractional Asset launch.
              </p>
              <div className="mt-8 max-w-xl">
                <WaitlistForm source="investor_waitlist" title="" subtitle="" ctaLabel="Join Waitlist" testIdPrefix="home-waitlist" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
