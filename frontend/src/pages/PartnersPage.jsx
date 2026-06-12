import { useState } from "react";
import { toast } from "sonner";
import { Building2, Banknote, CheckCircle2, ArrowRight } from "lucide-react";
import api, { formatApiError } from "../lib/api";

const ECOSYSTEM = ["hBits", "Strata", "PropShare", "Assetmonk", "Bhive Alts", "Ryzer", "ALT DRX", "Assetkart"];

function PartnerForm({ kind = "partner", testIdPrefix }) {
  const [form, setForm] = useState({
    name: "", email: "", company: "", role: "", partnership_type: kind === "lender" ? "bank_nbfc" : "builder", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/partner", form);
      setDone(true);
      toast.success("Thanks. We'll be in touch shortly.");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Failed");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div data-testid={`${testIdPrefix}-success`} className="rounded-2xl border border-[#3FB36F]/30 bg-[#3FB36F]/5 p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-[#3FB36F] mx-auto" />
        <div className="font-['Cabinet_Grotesk'] text-2xl font-bold text-[#0A2540] mt-4">Request received.</div>
        <p className="text-slate-600 mt-2">Our partnerships team will reach out within 48 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} data-testid={`${testIdPrefix}-form`} className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <input data-testid={`${testIdPrefix}-input-name`} placeholder="Your name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
        <input data-testid={`${testIdPrefix}-input-email`} type="email" placeholder="Work email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
        <input data-testid={`${testIdPrefix}-input-company`} placeholder={kind === "lender" ? "Institution name" : "Company name"} required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
        <input data-testid={`${testIdPrefix}-input-role`} placeholder="Your role" required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
      </div>
      <select data-testid={`${testIdPrefix}-select-type`} value={form.partnership_type} onChange={(e) => setForm({ ...form, partnership_type: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white">
        <option value="builder">Asset owner / Developer</option>
        <option value="fop">Fractional ownership platform</option>
        <option value="bank_nbfc">Bank / NBFC / Private Credit</option>
        <option value="wealth_manager">Wealth manager</option>
        <option value="data_provider">Data provider</option>
        <option value="other">Other</option>
      </select>
      <textarea data-testid={`${testIdPrefix}-input-message`} placeholder="Tell us how you'd like to partner" rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
      <button data-testid={`${testIdPrefix}-submit-btn`} type="submit" disabled={loading} className="px-7 py-3.5 rounded-full bg-[#3FB36F] text-white font-semibold hover:bg-[#1E63D5] transition-colors inline-flex items-center gap-2 disabled:opacity-60">
        {loading ? "Submitting…" : "Submit Request"} <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

export default function PartnersPage() {
  return (
    <div data-testid="partners-page" className="bg-white">
      <section className="pv-hero-gradient pv-grain text-white relative overflow-hidden">
        <div className="absolute inset-0 pv-grid-overlay opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-20">
          <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Partners</div>
          <h1 className="font-['Cabinet_Grotesk'] text-4xl md:text-6xl font-extrabold mt-4 tracking-tighter max-w-4xl">
            Building <span className="pv-text-gradient">together</span> across the real estate investment stack.
          </h1>
          <p className="text-slate-300 mt-5 max-w-3xl text-base md:text-lg leading-relaxed">
            Fractional platforms, asset owners, real estate operators, banks, NBFCs, data providers, legal and compliance partners, and wealth managers — Property Verse is built as an ecosystem.
          </p>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Ecosystem Network</div>
          <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-4xl font-extrabold text-[#0A2540] mt-3 tracking-tighter max-w-3xl">
            Fractional platforms we plan to aggregate.
          </h2>
          <p className="text-slate-500 mt-3 italic text-sm">Logos shown as ecosystem network. Partner logos shown only after final approval.</p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {ECOSYSTEM.map((p) => (
              <div key={p} className="pv-card p-7 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-slate-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-slate-400" />
                </div>
                <div className="mt-4 font-semibold text-[#0A2540]">{p}</div>
                <div className="text-[10px] text-slate-400 mt-1 italic">Partner placeholder</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Form */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Partner With Us</div>
            <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-4xl font-extrabold text-[#0A2540] mt-3 tracking-tighter">
              For asset owners, FOPs, data partners, and wealth managers.
            </h2>
            <p className="text-slate-600 mt-4">If you're building anything adjacent to fractional real estate, we'd love to talk.</p>
          </div>
          <div className="pv-card p-8">
            <PartnerForm kind="partner" testIdPrefix="partner" />
          </div>
        </div>
      </section>

      {/* Lender Form */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">
              <Banknote className="w-3.5 h-3.5" /> Lender / Bank
            </div>
            <h2 className="font-['Cabinet_Grotesk'] text-3xl md:text-4xl font-extrabold text-[#0A2540] mt-3 tracking-tighter">
              Lending partnerships for institutional debt rails.
            </h2>
            <p className="text-slate-600 mt-4">
              Property Verse is building structured financing rails with banks, NBFCs, and private credit partners for fractional real estate products. Financing is subject to final approval and product structure.
            </p>
          </div>
          <div className="pv-card p-8">
            <PartnerForm kind="lender" testIdPrefix="lender" />
          </div>
        </div>
      </section>
    </div>
  );
}
