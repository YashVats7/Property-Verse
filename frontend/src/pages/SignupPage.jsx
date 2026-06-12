import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function SignupPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const r = await register(form.name, form.email, form.password);
    setLoading(false);
    if (r.ok) {
      toast.success("Welcome to Property Verse");
      nav("/dashboard", { replace: true });
    } else {
      toast.error(r.error || "Sign up failed");
    }
  };

  return (
    <div data-testid="signup-page" className="min-h-[80vh] grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 md:p-16 bg-white order-2 lg:order-1">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5 lg:hidden mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#0A2540] flex items-center justify-center"><Building2 className="w-4 h-4 text-[#10B981]" /></div>
            <span className="font-['Cabinet_Grotesk'] font-extrabold text-[#0A2540]">Property Verse</span>
          </Link>
          <div className="text-xs uppercase tracking-[0.25em] text-[#10B981] font-semibold">Open an Investor Account</div>
          <h1 className="font-['Cabinet_Grotesk'] text-3xl md:text-4xl font-extrabold text-[#0A2540] mt-3 tracking-tighter">Create your account.</h1>
          <p className="text-slate-600 mt-3">Curated opportunities, watchlists, and LFA early access — all in one place.</p>

          <form onSubmit={submit} data-testid="signup-form" className="mt-8 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Full Name</label>
              <input data-testid="signup-input-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Email</label>
              <input data-testid="signup-input-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Password</label>
              <input data-testid="signup-input-password" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10" />
              <div className="text-[11px] text-slate-500 mt-1.5">Minimum 6 characters</div>
            </div>
            <button data-testid="signup-submit-btn" disabled={loading} className="w-full px-6 py-3.5 rounded-full bg-[#10B981] text-white font-semibold hover:bg-[#059669] transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? "Creating account…" : "Open Account"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-600">
            Already have an account? <Link to="/login" data-testid="signup-go-login" className="font-semibold text-[#0A2540] hover:text-[#10B981]">Sign in</Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative pv-hero-gradient pv-grain order-1 lg:order-2">
        <div className="absolute inset-0 pv-grid-overlay opacity-60" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <div />
          <div>
            <h2 className="font-['Cabinet_Grotesk'] text-4xl font-extrabold tracking-tighter leading-tight">
              Join <span className="pv-text-gradient">18,500+</span> investors building real estate wealth.
            </h2>
            <ul className="mt-8 space-y-3 max-w-md">
              {[
                "Curated A-grade commercial real estate",
                "First access to our Leveraged Fractional Asset launch",
                "Personal investor relations support",
                "Bank/NBFC financing rail visibility",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-200">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-xs text-slate-400">By signing up you agree to Property Verse's Terms and acknowledge the Risk Disclosure.</div>
        </div>
      </div>
    </div>
  );
}
