import { Link } from "react-router-dom";
import { Linkedin, Twitter, Mail } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-[#0A2540] text-slate-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Logo dark />
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
              <li><Link to="/opportunities" className="hover:text-[#3FB36F]">Opportunities</Link></li>
              <li><Link to="/leverage" className="hover:text-[#3FB36F]">Leverage Product</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#3FB36F]">Investor Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">Company</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-[#3FB36F]">About</Link></li>
              <li><Link to="/partners" className="hover:text-[#3FB36F]">Partners</Link></li>
              <li><Link to="/contact" className="hover:text-[#3FB36F]">Contact</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">Legal</div>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-[#3FB36F]">Privacy</a></li>
              <li><a href="#" className="hover:text-[#3FB36F]">Terms</a></li>
              <li><a href="#" className="hover:text-[#3FB36F]">Disclosures</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col gap-6 text-xs text-slate-400">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 leading-relaxed text-amber-100/80">
            <strong className="text-amber-200">Compliance & Risk Disclosure.</strong> Property Verse is currently shown as a prototype/mockup platform. All assets, numbers, logos, returns, partner references, debt structures, and simulations are illustrative. Nothing on this website is investment advice, legal advice, tax advice, or an offer to sell securities or investment products. Real estate investments carry risk, including capital loss, tenant risk, vacancy risk, liquidity risk, leverage risk, interest rate risk, market risk, and regulatory risk. Leveraged structures can amplify both gains and losses. Returns are projected and not guaranteed. Final products are subject to legal, lender, regulatory, and documentation approvals.
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} Property Verse Capital Pvt. Ltd. All rights reserved.</div>
            <div className="text-[11px]">Past performance is not indicative of future returns.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
