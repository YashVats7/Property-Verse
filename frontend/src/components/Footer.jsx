import { Link } from "react-router-dom";
import { Building2, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-[#0A2540] text-slate-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="leading-tight">
                <div className="font-['Cabinet_Grotesk'] font-extrabold text-white text-lg">Property Verse</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-medium">Real Estate, Upgraded</div>
              </div>
            </div>
            <p className="mt-5 text-sm text-slate-400 max-w-sm leading-relaxed">
              India's real estate investment layer for fractional ownership of A-grade commercial assets and
              leverage-enabled wealth products.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="mailto:hello@propertyverse.in" className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">Platform</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/opportunities" className="hover:text-[#10B981]">Opportunities</Link></li>
              <li><Link to="/leverage" className="hover:text-[#10B981]">Leverage Product</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#10B981]">Investor Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">Company</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-[#10B981]">About</Link></li>
              <li><Link to="/partners" className="hover:text-[#10B981]">Partners</Link></li>
              <li><Link to="/contact" className="hover:text-[#10B981]">Contact</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">Legal</div>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-[#10B981]">Privacy</a></li>
              <li><a href="#" className="hover:text-[#10B981]">Terms</a></li>
              <li><a href="#" className="hover:text-[#10B981]">Disclosures</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-6 md:items-center md:justify-between text-xs text-slate-400">
          <div>© {new Date().getFullYear()} Property Verse Capital Pvt. Ltd. All rights reserved.</div>
          <div className="max-w-2xl leading-relaxed">
            Investments in real estate involve risk including loss of principal. Past performance is not indicative of
            future returns. Property Verse does not currently facilitate transactions; this site is for information
            and lead generation purposes only.
          </div>
        </div>
      </div>
    </footer>
  );
}
