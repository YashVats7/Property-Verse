import { Link } from "react-router-dom";
import { ArrowRight, Building2, Briefcase, TrendingUp, Layers } from "lucide-react";

const ROLES = [
  "Co-founder",
  "Product",
  "Partnerships",
  "Credit",
  "Real Estate",
  "Technology",
];

export default function AboutPage() {
  return (
    <div data-testid="about-page" className="bg-white">
      <section className="pv-hero-gradient pv-grain text-white relative overflow-hidden">
        <div className="absolute inset-0 pv-grid-overlay opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-20">
          <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">About</div>
          <h1 className="font-['Cabinet_Grotesk'] text-4xl md:text-6xl font-extrabold mt-4 tracking-tighter max-w-4xl">
            Building India's infrastructure for <span className="pv-text-gradient">alternative real estate investing.</span>
          </h1>
          <p className="text-slate-300 mt-5 max-w-3xl text-base md:text-lg leading-relaxed">
            Property Verse brings together fractional ownership, data intelligence, institutional credit, and curated asset access into one platform. We are designing the future of real estate investing in India — fractional, data-backed, and leverage-enabled.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Our Mission</div>
            <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-4xl font-extrabold text-[#0A2540] mt-3 tracking-tighter">
              Real estate investing, upgraded for the modern investor.
            </h2>
            <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
              <p>
                Unlike a simple listing marketplace, Property Verse is being built as an <strong className="text-[#0A2540]">intelligence-first investment platform</strong>. Every opportunity is evaluated across key real estate and financial parameters — tenant quality, lease tenure, rental yield, asset location, developer credibility, valuation comfort, exit potential, risk profile, and projected investor returns.
              </p>
              <p>
                We are preparing to launch what we believe will be <strong className="text-[#0A2540]">India's first leverage-backed fractional real estate investment product</strong> — focused on A-grade pre-leased commercial real estate. This product combines investor equity with structured debt participation from banks, NBFCs, or institutional lenders.
              </p>
              <p>
                The result: investors may participate in high-quality commercial assets while targeting <strong className="text-[#3FB36F]">enhanced projected returns of up to 17% IRR</strong>, driven by rental income, capital appreciation, and structured leverage.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { i: TrendingUp, k: "₹60 Cr+", v: "Team's executed fractional real estate sales" },
              { i: Briefcase, k: "4+ years", v: "Direct involvement in fractional market" },
              { i: Layers, k: "20+ years", v: "Combined team & advisor experience" },
            ].map((s) => (
              <div key={s.k} className="pv-card p-6">
                <s.i className="w-5 h-5 text-[#3FB36F]" />
                <div className="pv-num text-3xl font-extrabold text-[#0A2540] mt-3">{s.k}</div>
                <div className="text-sm text-slate-600 mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Founder</div>
          <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold text-[#0A2540] mt-3 tracking-tighter">Led by Yash Vats.</h2>

          <div className="mt-12 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 pv-card p-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0F3860] flex items-center justify-center">
                <span className="font-['Cabinet_Grotesk'] text-2xl font-extrabold text-[#3FB36F]">YV</span>
              </div>
              <div className="mt-5 font-['Cabinet_Grotesk'] text-2xl font-extrabold text-[#0A2540]">Yash Vats</div>
              <div className="text-sm text-slate-600 mt-1">Founder, Property Verse</div>
              <p className="text-sm text-slate-600 mt-5 leading-relaxed">
                Young entrepreneur building at the intersection of real estate, fintech, alternative investments, and structured finance. Building infrastructure for real-estate-backed investing in India.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
              {ROLES.map((r) => (
                <div key={r} className="pv-card p-6">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="mt-4 font-semibold text-[#0A2540]">{r}</div>
                  <div className="text-xs text-slate-400 mt-1">Open · Hiring soon</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-5xl font-extrabold text-[#0A2540] tracking-tighter">
            Join us in building the future of real estate investing.
          </h2>
          <p className="text-slate-600 mt-5">For investors, lenders, real estate operators, and product partners.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/signup" data-testid="about-cta-signup" className="px-7 py-3.5 rounded-full bg-[#3FB36F] text-white font-semibold hover:bg-[#1E63D5] transition-colors inline-flex items-center gap-2">
              Join Investor Waitlist <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/partners" data-testid="about-cta-partners" className="px-7 py-3.5 rounded-full border border-[#0A2540] text-[#0A2540] font-semibold hover:bg-[#0A2540] hover:text-white transition-colors">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
