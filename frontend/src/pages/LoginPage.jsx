import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Building2, Lock } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const r = await login(form.email, form.password);
    setLoading(false);
    if (r.ok) {
      toast.success("Welcome back");
      const to = location.state?.from?.pathname || "/dashboard";
      nav(to, { replace: true });
    } else {
      toast.error(r.error || "Login failed");
    }
  };

  return (
    <div data-testid="login-page" className="min-h-[80vh] grid lg:grid-cols-2">
      <div className="hidden lg:block relative pv-hero-gradient pv-grain">
        <div className="absolute inset-0 pv-grid-overlay opacity-60" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#3FB36F]/15 flex items-center justify-center"><Building2 className="w-5 h-5 text-[#3FB36F]" /></div>
            <div className="font-['Cabinet_Grotesk'] font-extrabold text-lg">Property Verse</div>
          </div>
          <div>
            <h2 className="font-['Cabinet_Grotesk'] text-4xl font-extrabold tracking-tighter leading-tight">
              Real estate investing, <span className="pv-text-gradient">upgraded.</span>
            </h2>
            <p className="text-slate-300 mt-4 max-w-md">Sign in to access your watchlist, curated opportunities, and your LFA early access status.</p>
          </div>
          <div className="text-xs text-slate-400">© Property Verse Capital · Illustrative platform</div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5 lg:hidden mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#0A2540] flex items-center justify-center"><Building2 className="w-4 h-4 text-[#3FB36F]" /></div>
            <span className="font-['Cabinet_Grotesk'] font-extrabold text-[#0A2540]">Property Verse</span>
          </Link>
          <div className="text-xs uppercase tracking-[0.25em] text-[#3FB36F] font-semibold">Sign In</div>
          <h1 className="font-['Cabinet_Grotesk'] text-3xl md:text-4xl font-extrabold text-[#0A2540] mt-3 tracking-tighter">Welcome back.</h1>
          <p className="text-slate-600 mt-3">Access your investor dashboard.</p>

          <form onSubmit={submit} data-testid="login-form" className="mt-8 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Email</label>
              <input
                data-testid="login-input-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Password</label>
              <input
                data-testid="login-input-password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10"
              />
            </div>
            <button
              data-testid="login-submit-btn"
              disabled={loading}
              className="w-full px-6 py-3.5 rounded-full bg-[#3FB36F] text-white font-semibold hover:bg-[#1E63D5] transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-600">
            New to Property Verse? <Link to="/signup" data-testid="login-go-signup" className="font-semibold text-[#0A2540] hover:text-[#3FB36F]">Open an account</Link>
          </div>
          <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-[#0A2540] mb-1"><Lock className="w-3.5 h-3.5" /> Demo credentials</div>
            investor@propertyverse.in · Investor2025!
          </div>
        </div>
      </div>
    </div>
  );
}
