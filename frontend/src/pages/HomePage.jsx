import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Layers, TrendingUp, BarChart3, ShieldCheck, Sparkles, ChevronRight,
  Banknote, Building2, Users, Briefcase
} from "lucide-react";
import api from "../lib/api";
import OpportunityCard from "../components/OpportunityCard";
import WaitlistForm from "../components/WaitlistForm";
import { PLATFORM_BRANDS, BANK_BRANDS, PlatformLogo, BankLogo } from "../components/LogoCard";
import { HeroAssetCard, ReturnSimulator, CashFlowWaterfall, AssetIntelligence, IndiaMap, DashboardMockup, CountUp } from "../components/Animated";
import InvestmentWalkthrough from "../components/InvestmentWalkthrough";
import BackgroundFX from "../components/BackgroundFX";

const PILLARS = [
  { icon: Layers, title: "Aggregator Marketplace", desc: "Compare curated fractional real estate opportunities across trusted platforms and asset owners." },
  { icon: TrendingUp, title: "Leverage-Based Products", desc: "Access upcoming leveraged fractional structures designed for enhanced exposure with institutional debt." },
  { icon: BarChart3, title: "Data & Intelligence", desc: "Asset-level data, location insights, rental trends, occupancy quality, yield, and risk before you invest." },
];

const PERSONAS = [
  { title: "HNIs", desc: "Seeking real-estate backed income." },
  { title: "Founders & Operators", desc: "Wanting alternative assets beyond equity." },
  { title: "Family Offices", desc: "Curated CRE exposure across cycles." },
  { title: "NRIs", desc: "Assisted Indian real estate access." },
  { title: "Wealth Managers", desc: "Better real estate products for clients." },
  { title: "Accredited Investors", desc: "Asset-backed diversification beyond stocks and bonds." },
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
        <BackgroundFX variant="particles" dark />
        <BackgroundFX variant="flow" dark />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full pv-glass-dark text-white/90 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3FB36F] pv-pulse-dot" />
                India's Real Estate Investment Layer
              </div>
              <h1 className="font-['Clash_Display'] text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-[-0.03em] mt-6 pb-3">
                <span className="block">Real Estate</span>
                <span className="block">Investing,</span>
                <span className="block pv-text-shimmer pb-1">Upgraded.</span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 mt-6 max-w-xl leading-relaxed">
                Discover curated fractional real estate opportunities and access upcoming leverage-backed investment products in A-grade pre-leased commercial real estate.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/opportunities" data-testid="hero-cta-explore"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#3FB36F] to-[#1E63D5] text-white font-semibold hover:shadow-[0_12px_40px_rgba(63,179,111,0.40)] transition-all">
                  Explore Opportunities <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#how-it-works" data-testid="hero-cta-how"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/8 backdrop-blur border border-white/20 text-white font-semibold hover:bg-white/14 transition-colors">
                  See How Returns Work
                </a>
                <Link to="/signup" data-testid="hero-cta-waitlist"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#0A2540] font-semibold hover:bg-slate-100 transition-colors">
                  Join Investor Waitlist
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
                <div>
                  <div className="pv-num text-2xl md:text-3xl font-bold text-white">₹<CountUp end={60} />Cr+</div>
                  <div className="text-xs text-slate-400 mt-1">Executed (team)</div>
                </div>
                <div>
                  <div className="pv-num text-2xl md:text-3xl font-bold text-white"><CountUp end={17} />%</div>
                  <div className="text-xs text-slate-400 mt-1">Target IRR (LFA)</div>
                </div>
                <div>
                  <div className="pv-num text-2xl md:text-3xl font-bold text-white"><CountUp end={20} />+ yrs</div>
                  <div className="text-xs text-slate-400 mt-1">Team experience</div>
                </div>
              </div>
            </motion.div>

            <HeroAssetCard />
          </div>
        </div>
      </section>

      {/* ECOSYSTEM LOGOS */}
      <section className="relative border-y border-slate-200 bg-white overflow-hidden">
        <BackgroundFX variant="mesh" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Real Estate Investment Ecosystem</div>
            <div className="font-['Cabinet_Grotesk'] text-2xl md:text-3xl font-extrabold text-[#0A2540] mt-2 tracking-tighter">
              An aggregator across India's leading fractional platforms.
            </div>
            <div className="text-xs text-slate-500 mt-2 italic">Displayed as ecosystem references / mockup placeholders. Final partner display subject to approval.</div>
          </div>

          {/* Platform marquee */}
          <div className="mt-10 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="flex pv-marquee gap-4">
              {[...PLATFORM_BRANDS, ...PLATFORM_BRANDS].map((b, i) => (
                <PlatformLogo key={`${b.name}-${i}`} brand={b} testId={`platform-logo-${i}`} />
              ))}
            </div>
          </div>

          {/* Bank rail */}
          <div className="mt-10">
            <div className="text-center text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">Targeted Bank / NBFC Financing Network</div>
            <div className="overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
              <div className="flex pv-marquee gap-4" style={{ animationDirection: "reverse" }}>
                {[...BANK_BRANDS, ...BANK_BRANDS].map((b, i) => (
                  <BankLogo key={`${b.name}-${i}`} brand={b} testId={`bank-logo-${i}`} />
                ))}
              </div>
            </div>
            <div className="text-center text-[11px] text-slate-400 mt-4 italic">Logos shown only as illustrative bank/NBFC categories. Financing subject to lender approval.</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="bg-gradient-to-br from-[#0A2540] to-[#0F3FA1] text-white relative overflow-hidden">
          <div className="absolute inset-0 pv-grid-overlay opacity-30" />
          <BackgroundFX variant="flow" dark />
          <BackgroundFX variant="ticker" dark />
          <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { v: <>₹<CountUp end={stats.aum_inr_cr} />Cr+</>, l: "Curated AUM" },
              { v: <CountUp end={stats.investors} />, l: "Investors Tracked" },
              { v: <CountUp end={stats.properties} />, l: "Assets Screened" },
              { v: <><CountUp end={stats.avg_irr} decimals={1} />%</>, l: "Avg. Target IRR" },
              { v: <><CountUp end={stats.cities} /></>, l: "Indian Cities" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="pv-num text-3xl md:text-4xl font-bold">{s.v}</div>
                <div className="text-xs text-slate-300 mt-1 uppercase tracking-widest font-medium">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* PILLARS */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <BackgroundFX variant="blocks" />
        <BackgroundFX variant="ticker" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">What is Property Verse</div>
            <h2 className="font-['Clash_Display'] text-4xl md:text-6xl font-bold text-[#0A2540] mt-4 tracking-tighter">
              A real estate investment platform built for modern investors.
            </h2>
            <p className="text-slate-600 mt-5 text-base md:text-lg leading-relaxed">
              Property Verse helps you discover curated, real estate-backed opportunities without buying an entire property — combining fractional ownership, leverage-enabled products, and data intelligence in one platform.
            </p>
          </div>

          <div className="mt-12 relative rounded-3xl overflow-hidden border border-slate-200">
            <img src="/generated/fractional_illustration.png" alt="Fractional ownership" className="w-full h-72 md:h-96 object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10">
              <div className="font-['Cabinet_Grotesk'] text-2xl md:text-3xl font-extrabold text-[#0A2540] max-w-xl tracking-tighter">
                One building. Many fractions. Backed by data, structured for institutions, accessible for you.
              </div>
            </div>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="pv-card p-7"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E63D5]/10 to-[#3FB36F]/10 flex items-center justify-center">
                  <p.icon className="w-5 h-5 text-[#1E63D5]" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-5">Pillar {i + 1}</div>
                <div className="font-['Cabinet_Grotesk'] text-xl font-bold text-[#0A2540] mt-1">{p.title}</div>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INVESTMENT WALKTHROUGH */}
      <div id="how-it-works">
        <InvestmentWalkthrough />
      </div>

      {/* 6-YEAR SIMULATOR */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <BackgroundFX variant="grid" />
        <BackgroundFX variant="waveform" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">6-Year Return Simulator</div>
            <h2 className="font-['Clash_Display'] text-4xl md:text-6xl font-bold text-[#0A2540] mt-4 tracking-tighter">
              See how returns may build over 6 years.
            </h2>
            <p className="text-slate-600 mt-5 max-w-2xl">
              Interactive simulation of an A-grade pre-leased commercial asset. Adjust inputs to see how leverage, yield, and appreciation affect your projected outcome.
            </p>
          </div>
          <div className="mt-14">
            <ReturnSimulator />
          </div>
        </div>
      </section>

      {/* CASH FLOW WATERFALL */}
      <section className="relative py-24 md:py-32 bg-slate-50 overflow-hidden">
        <BackgroundFX variant="flow" />
        <BackgroundFX variant="particles" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Cash Flow Waterfall</div>
              <h2 className="font-['Clash_Display'] text-4xl md:text-5xl font-bold text-[#0A2540] mt-4 tracking-tighter">
                Where does every ₹100 of rent go?
              </h2>
              <p className="text-slate-600 mt-5 leading-relaxed">
                Monthly rent flows through a transparent waterfall — operating expenses, debt servicing (for leveraged structures), reserves, and then to you. No black boxes.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Pre-leased tenant rent collection",
                  "Asset-level operating expenses deducted",
                  "Bank/NBFC interest serviced (if leveraged)",
                  "Reserve account for capex & vacancies",
                  "Net distribution to investor wallet",
                ].map((t, i) => (
                  <li key={t} className="flex items-start gap-3 text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-[#3FB36F]/15 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-[#3FB36F]">{i + 1}</div>
                    <span className="text-sm">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <CashFlowWaterfall />
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES PREVIEW */}
      <section className="relative py-24 overflow-hidden">
        <BackgroundFX variant="skyline" />
        <BackgroundFX variant="mesh" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Curated Opportunities</div>
              <h2 className="font-['Clash_Display'] text-4xl md:text-5xl font-bold text-[#0A2540] mt-4 tracking-tighter">
                Compare fractional real estate, in one place.
              </h2>
              <p className="text-slate-600 mt-4">A-grade pre-leased commercial assets across India's premier office markets. Illustrative samples below.</p>
            </div>
            <Link to="/opportunities" data-testid="opps-view-all-link"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A2540] hover:text-[#3FB36F]">
              View all opportunities <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opps.map((o) => <OpportunityCard key={o.id} o={o} testIdPrefix="home-opp" />)}
          </div>
          <div className="mt-6 text-xs text-slate-500 italic">Illustrative data. Final figures subject to asset structuring and lender approval.</div>
        </div>
      </section>

      {/* ASSET INTELLIGENCE */}
      <section className="relative py-24 md:py-32 bg-slate-50 overflow-hidden">
        <BackgroundFX variant="rings" />
        <BackgroundFX variant="matrix" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Asset Intelligence Engine</div>
            <h2 className="font-['Clash_Display'] text-4xl md:text-6xl font-bold text-[#0A2540] mt-4 tracking-tighter">
              Every asset, scored across 11 institutional parameters.
            </h2>
            <p className="text-slate-600 mt-5 max-w-2xl">
              Location, tenant quality, lease tenure, rental yield, debt eligibility, exit visibility — quantified and benchmarked before you commit a rupee.
            </p>
          </div>
          <div className="mt-14">
            <AssetIntelligence />
          </div>
        </div>
      </section>

      {/* INDIA MAP */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <BackgroundFX variant="blobs" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <IndiaMap />
        </div>
      </section>

      {/* LEVERAGE TEASER */}
      <section className="relative py-24 md:py-32 pv-hero-gradient pv-grain text-white overflow-hidden">
        <div className="absolute inset-0 pv-grid-overlay opacity-50" />
        <BackgroundFX variant="ticker" dark />
        <BackgroundFX variant="flow" dark />
        <BackgroundFX variant="particles" dark />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Introducing LFA</div>
              <h2 className="font-['Clash_Display'] text-4xl md:text-6xl font-bold mt-4 tracking-tighter">
                Leveraged Fractional Assets. <span className="pv-text-gradient">Own more, with less.</span>
              </h2>
              <p className="text-slate-300 mt-5 leading-relaxed">
                India's upcoming leverage-backed fractional real estate product. Combine investor equity with bank/NBFC-backed debt to access A-grade commercial exposure — targeting projected returns up to 17% IRR.
              </p>
              <Link to="/leverage" data-testid="lfa-teaser-cta"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#3FB36F] to-[#1E63D5] text-white font-semibold hover:shadow-[0_12px_40px_rgba(63,179,111,0.40)] transition-all">
                Get Early Access to LFA <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur"
              >
                <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Normal Fractional</div>
                <div className="pv-num text-3xl font-bold mt-3">₹40 L</div>
                <div className="text-xs text-slate-400 mt-1">Equity deployed</div>
                <div className="mt-5 text-sm text-slate-300">Owns ₹40 L exposure</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-gradient-to-br from-[#3FB36F]/15 to-[#1E63D5]/10 border border-[#3FB36F]/40 p-6 backdrop-blur pv-glow-ring"
              >
                <div className="text-xs uppercase tracking-widest text-[#3FB36F] font-semibold">Leveraged Fractional</div>
                <div className="pv-num text-3xl font-bold mt-3 text-[#3FB36F]">₹20 L</div>
                <div className="text-xs text-slate-300 mt-1">Equity + ₹20 L debt</div>
                <div className="mt-5 text-sm text-slate-100">Accesses ₹40 L exposure</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD MOCKUP */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <BackgroundFX variant="grid" />
        <BackgroundFX variant="blocks" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Investor Dashboard</div>
              <h2 className="font-['Clash_Display'] text-4xl md:text-6xl font-bold text-[#0A2540] mt-4 tracking-tighter">
                Your portfolio, live.
              </h2>
              <p className="text-slate-600 mt-5 leading-relaxed">
                Track distributions, asset values, projected IRR, documents, and asset intelligence scores from a single premium investor dashboard.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { i: BarChart3, t: "Real-time portfolio value and IRR" },
                  { i: Banknote, t: "Monthly rental distribution tracking" },
                  { i: ShieldCheck, t: "Asset-level documents & risk score" },
                  { i: Sparkles, t: "Early access to LFA opportunities" },
                ].map((x, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#3FB36F]/10 flex items-center justify-center flex-shrink-0">
                      <x.i className="w-4 h-4 text-[#3FB36F]" />
                    </div>
                    <span className="text-sm text-slate-700 mt-1">{x.t}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup" data-testid="dashboard-cta-signup"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0A2540] text-white font-semibold hover:bg-[#0F3FA1] transition-colors">
                Open Investor Account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* PERSONAS */}
      <section className="relative py-24 bg-slate-50 overflow-hidden">
        <BackgroundFX variant="mesh" />
        <BackgroundFX variant="particles" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Who It's For</div>
            <h2 className="font-['Clash_Display'] text-4xl md:text-5xl font-bold text-[#0A2540] mt-4 tracking-tighter">
              Designed for serious investors.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERSONAS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="pv-card p-6 flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E63D5]/15 to-[#3FB36F]/15 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#1E63D5]" />
                </div>
                <div>
                  <div className="font-semibold text-[#0A2540]">{p.title}</div>
                  <div className="text-sm text-slate-600 mt-1">{p.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-24 bg-slate-50 overflow-hidden">
        <BackgroundFX variant="particles" />
        <BackgroundFX variant="flow" />
        <div className="relative max-w-4xl mx-auto px-6 md:px-12">
          <div className="rounded-3xl bg-[#0A2540] text-white p-10 md:p-14 relative overflow-hidden pv-glow-ring">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#3FB36F]/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#1E63D5]/30 blur-3xl" />
            <div className="relative">
              <Sparkles className="w-6 h-6 text-[#3FB36F]" />
              <h2 className="font-['Clash_Display'] text-4xl md:text-5xl font-bold mt-4 tracking-tighter">
                Join the future of real estate investing.
              </h2>
              <p className="text-slate-300 mt-3 max-w-xl">Be first in line for curated fractional opportunities and our flagship Leveraged Fractional Asset launch.</p>
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
