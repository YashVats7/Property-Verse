import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import api, { formatApiError } from "../lib/api";

export default function WaitlistForm({ source = "investor_waitlist", title = "Join the Investor Waitlist", subtitle, ctaLabel = "Join Waitlist", testIdPrefix = "waitlist" }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", investment_range: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Name and email are required");
      return;
    }
    setLoading(true);
    try {
      await api.post("/waitlist", { ...form, source });
      setDone(true);
      toast.success("You're on the list. We'll be in touch shortly.");
    } catch (e2) {
      toast.error(formatApiError(e2.response?.data?.detail) || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div data-testid={`${testIdPrefix}-success`} className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto" />
        <div className="font-['Cabinet_Grotesk'] text-2xl font-bold text-[#0A2540] mt-4">You're In.</div>
        <p className="text-slate-600 mt-2">Our investor relations team will reach out within 24 hours.</p>
      </div>
    );
  }

  return (
    <form data-testid={`${testIdPrefix}-form`} onSubmit={submit} className="space-y-4">
      {title && <div className="font-['Cabinet_Grotesk'] text-2xl font-bold text-[#0A2540]">{title}</div>}
      {subtitle && <p className="text-slate-600 text-sm">{subtitle}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          data-testid={`${testIdPrefix}-input-name`}
          placeholder="Full name"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10 transition-all"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          data-testid={`${testIdPrefix}-input-email`}
          type="email"
          placeholder="Work email"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10 transition-all"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          data-testid={`${testIdPrefix}-input-phone`}
          placeholder="Phone (optional)"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10 transition-all"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <select
          data-testid={`${testIdPrefix}-select-range`}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10 bg-white"
          value={form.investment_range}
          onChange={(e) => setForm({ ...form, investment_range: e.target.value })}
        >
          <option value="">Investment range</option>
          <option value="10L-25L">₹10L – ₹25L</option>
          <option value="25L-1Cr">₹25L – ₹1 Cr</option>
          <option value="1Cr-5Cr">₹1 Cr – ₹5 Cr</option>
          <option value="5Cr+">₹5 Cr+</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        data-testid={`${testIdPrefix}-submit-btn`}
        className="group w-full md:w-auto px-7 py-3.5 rounded-full bg-[#10B981] text-white font-semibold hover:bg-[#059669] transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? "Submitting…" : ctaLabel}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
  );
}
