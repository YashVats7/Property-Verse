import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight, Calendar } from "lucide-react";
import api, { formatApiError } from "../lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", preferred_time: "", investment_size: "", notes: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/strategy-call", form);
      setDone(true);
      toast.success("Strategy call request received");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="contact-page" className="bg-white">
      <section className="pv-hero-gradient pv-grain text-white relative overflow-hidden">
        <div className="absolute inset-0 pv-grid-overlay opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-20">
          <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Contact</div>
          <h1 className="font-['Cabinet_Grotesk'] text-4xl md:text-6xl font-extrabold mt-4 tracking-tighter max-w-4xl">
            Book a <span className="pv-text-gradient">strategy call.</span>
          </h1>
          <p className="text-slate-300 mt-5 max-w-2xl">
            Curated real estate guidance for HNIs, family offices, and wealth managers. 30-minute, no-obligation conversation with our investor relations team.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-4">
            {[
              { i: Mail, l: "Email", v: "invest@propertyverse.in" },
              { i: Mail, l: "Partners", v: "partners@propertyverse.in" },
              { i: Phone, l: "Phone", v: "+91 80000 00000" },
              { i: MapPin, l: "Office", v: "Mumbai · Bengaluru · Gurugram" },
            ].map((x) => (
              <div key={x.l} className="pv-card p-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#3FB36F]/10 flex items-center justify-center"><x.i className="w-5 h-5 text-[#3FB36F]" /></div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{x.l}</div>
                  <div className="font-semibold text-[#0A2540] mt-0.5">{x.v}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 pv-card p-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#3FB36F]" />
              <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">30-min strategy call</div>
            </div>
            <h2 className="font-['Cabinet_Grotesk'] text-2xl font-bold text-[#0A2540] mt-3">Tell us about your investment goals.</h2>

            {done ? (
              <div data-testid="strategy-call-success" className="mt-8 rounded-2xl border border-[#3FB36F]/30 bg-[#3FB36F]/5 p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#3FB36F] mx-auto" />
                <div className="font-['Cabinet_Grotesk'] text-2xl font-bold text-[#0A2540] mt-4">Call request received.</div>
                <p className="text-slate-600 mt-2">Our investor relations team will reach out within 24 hours to confirm a time.</p>
              </div>
            ) : (
              <form onSubmit={submit} data-testid="strategy-call-form" className="mt-6 space-y-3">
                <input type="text" name="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} tabIndex="-1" autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }} />
                <div className="grid md:grid-cols-2 gap-3">
                  <input data-testid="strategy-input-name" placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
                  <input data-testid="strategy-input-email" type="email" placeholder="Work email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
                  <input data-testid="strategy-input-phone" placeholder="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
                  <input data-testid="strategy-input-time" placeholder="Preferred time (e.g. Tue 4pm IST)" value={form.preferred_time} onChange={(e) => setForm({ ...form, preferred_time: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
                </div>
                <select data-testid="strategy-select-size" value={form.investment_size} onChange={(e) => setForm({ ...form, investment_size: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white">
                  <option value="">Investment range</option>
                  <option value="10L-25L">₹10L – ₹25L</option>
                  <option value="25L-1Cr">₹25L – ₹1 Cr</option>
                  <option value="1Cr-5Cr">₹1 Cr – ₹5 Cr</option>
                  <option value="5Cr+">₹5 Cr+</option>
                </select>
                <textarea data-testid="strategy-input-notes" placeholder="Anything specific you'd like to discuss?" rows="4" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
                <button data-testid="strategy-submit-btn" disabled={loading} className="px-7 py-3.5 rounded-full bg-[#3FB36F] text-white font-semibold hover:bg-[#1E63D5] transition-colors inline-flex items-center gap-2 disabled:opacity-60">
                  {loading ? "Submitting…" : "Book Strategy Call"} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
