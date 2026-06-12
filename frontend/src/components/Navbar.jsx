import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { useAuth } from "../lib/auth";
import Logo from "./Logo";

const NAV = [
  { to: "/opportunities", label: "Marketplace" },
  { to: "/leverage", label: "Leverage Product" },
  { to: "/about", label: "About" },
  { to: "/partners", label: "Partners" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      data-testid="site-navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/70" : "bg-white border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo-link" className="group">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`nav-link-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? "text-[#0A2540] bg-slate-100" : "text-slate-600 hover:text-[#0A2540]"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {user && user !== false ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  data-testid="nav-admin-link"
                  className="px-4 py-2 rounded-full text-sm font-medium text-[#1E63D5] hover:bg-slate-100"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/dashboard"
                data-testid="nav-dashboard-link"
                className="px-4 py-2 rounded-full text-sm font-medium text-[#0A2540] hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                data-testid="nav-logout-btn"
                className="px-5 py-2.5 rounded-full bg-[#0A2540] text-white text-sm font-semibold hover:bg-[#0F3860] transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                data-testid="nav-login-link"
                className="px-4 py-2 rounded-full text-sm font-medium text-[#0A2540] hover:bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                data-testid="nav-signup-link"
                className="group px-5 py-2.5 rounded-full bg-gradient-to-r from-[#3FB36F] to-[#1E63D5] text-white text-sm font-semibold hover:shadow-[0_8px_24px_rgba(63,179,111,0.40)] transition-all inline-flex items-center gap-1.5"
              >
                Open Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden p-2 text-[#0A2540]"
          onClick={() => setOpen((v) => !v)}
          data-testid="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                data-testid={`mobile-nav-link-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-medium ${isActive ? "bg-slate-100 text-[#0A2540]" : "text-slate-600"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="h-px bg-slate-200 my-2" />
            {user && user !== false ? (
              <>
                {user.role === "admin" && (
                  <Link to="/admin" data-testid="mobile-nav-admin-link" className="px-4 py-3 rounded-xl text-sm font-medium text-[#1E63D5]">Admin</Link>
                )}
                <Link to="/dashboard" className="px-4 py-3 rounded-xl text-sm font-medium text-[#0A2540]">Dashboard</Link>
                <button onClick={logout} data-testid="mobile-nav-logout-btn" className="px-4 py-3 rounded-xl text-sm font-semibold bg-[#0A2540] text-white">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" data-testid="mobile-nav-login-link" className="px-4 py-3 rounded-xl text-sm font-medium text-[#0A2540]">Sign In</Link>
                <Link to="/signup" data-testid="mobile-nav-signup-link" className="px-4 py-3 rounded-xl text-sm font-semibold bg-[#3FB36F] text-white text-center">
                  Open Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
