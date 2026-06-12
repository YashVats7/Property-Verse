# Property Verse — PRD

## Problem Statement
Premium fintech + real estate website for Property Verse — India's fractional real estate aggregator and upcoming Leveraged Fractional Asset (LFA) product. Goals: trust + lead generation. No transactions yet.

## User Choices (Dec 2025)
- Lead capture: MongoDB only
- Pages: Multi-page + rich homepage
- 8 sample property cards
- JWT-based investor auth
- AI-generated hero visuals via Gemini Nano Banana

## Personas
- HNIs, family offices, founders, NRIs, wealth managers seeking curated A-grade CRE exposure

## Core Requirements
- White base + navy (#0A2540) + emerald (#10B981) theme; Cabinet Grotesk + Satoshi fonts
- Multi-page: Home, Opportunities, Leverage Product, About, Partners, Contact, Login, Signup, Investor Dashboard
- Lead capture: investor waitlist, partner form, lender form, strategy call
- JWT auth with httpOnly cookies + brute force protection
- LFA calculator with live IRR computation
- 8 sample opportunities seeded (BKC, ORR, Cyber Hub, Mindscape, Pune Axis, Marina, Meridian, Alpha LFA Pool)
- Compliance disclaimers ("illustrative", "not guaranteed")

## Implemented (Dec 12, 2025)
- Backend (FastAPI + MongoDB): /api/auth/* (register/login/logout/me/refresh), /api/opportunities (list+detail), /api/stats, /api/waitlist, /api/partner, /api/strategy-call, /api/dashboard (+ watchlist add/remove)
- Frontend (React + Tailwind + shadcn): Home (hero, stats, pillars, opportunities preview, LFA teaser, asset quality, lender rails, ecosystem, personas, how-it-works, final waitlist), Opportunities (filters + 8 cards), Detail (sticky sidebar + watchlist), Leverage (hero, comparison, 5-step, interactive calculator, 8-feature grid, comparison table, early-access waitlist), About (founder Yash Vats, team roles), Partners (ecosystem + partner/lender forms), Contact (strategy call), Login + Signup + Dashboard (watchlist + recommendations)
- AI-generated visuals (4 Nano Banana PNGs) embedded in Home + Leverage pages
- Seed: admin + demo investor with pre-seeded watchlist
- Test credentials at /app/memory/test_credentials.md
- 17/17 backend tests passing; full frontend E2E passing

## Backlog (P1)
- Admin dashboard to view leads (waitlist, partner, strategy-call submissions)
- Property detail tabs (documents, financials, tenant deep-dive)
- Email notifications on lead capture (Resend/SendGrid)
- SEO sitemap.xml + robots.txt
- Asset filtering by IRR/yield range sliders
- LFA term sheet generator (PDF)

## P2
- KYC integration
- Soft-commitment workflow (non-transactional)
- Investor relations chat / WhatsApp integration
- Multi-language (EN/HI)

## v2 — Major UI/Animation Overhaul (Dec 12, 2025)
Triggered by user request: "make it world-class, hyper visuals, full animations, use Property Verse logo + bank logos like Kotak/ICICI."

**Added**:
- Custom Property Verse SVG Logo (building + house + window pixels in brand blue/green)
- framer-motion + recharts integrated
- Updated brand palette: brand blue #1E63D5, brand green #3FB36F, navy #0A2540
- Clash Display + Tanker fonts added (alongside Cabinet Grotesk + Satoshi)
- LogoCard component: 12 platform brand cards (hBits, Strata, PropShare, Assetmonk, Bhive Alts, Ryzer, ALT DRX, Assetkart, Grip Invest, Jiraaf, Wint Wealth, Property Share) + 8 bank brand cards (ICICI, Kotak, HDFC, Axis, SBI, IDFC First, Yes Bank, Federal) as typographic placeholders
- Hero: animated cash-flow dashed lines, floating Investor Capital/Bank Debt/Rental Yield badges, area-chart asset value with CountUp counters
- 6-step Investment Walkthrough: interactive stage with 1000-block fractional grid, rent flow blocks, dashboard tiles, exit bar chart, total-return waterfall
- Return Simulator: 4 sliders + leverage toggle + live recharts LineChart + Effective IRR computation
- Cash Flow Waterfall: 5-step animated reveal showing ₹100 rent distribution
- Exit Waterfall built into LeveragePage existing calculator
- Asset Intelligence Engine: 6 circular progress score cards + Overall 87/100 institutional score
- India Map with 6 clickable hotspots (Mumbai/Pune/Bengaluru/Chennai/Hyderabad/NCR)
- Premium Investor Dashboard Mockup with sidebar nav + KPI cards + area chart
- Footer compliance/risk disclosure block (full investor-grade language)

**Backend**:
- 8 new SAMPLE_OPPORTUNITIES matching user spec (Bengaluru ₹80Cr, Pune ₹55Cr, Hyderabad ₹120Cr, NCR ₹95Cr + 4 more) with leverage_available + asset_value_cr + target_irr_range + risk_score fields
- Idempotent logout
- Forced demo watchlist alignment to v2 IDs

**Tests**: 20/20 backend pytest pass; full frontend E2E pass.

## v3 — Modular Backend + Admin Console + AI Asset Photography (Dec 12, 2025)
**Backend refactor**:
- `server.py` slim entrypoint (~60 lines)
- New modular structure: `app/{db,security,seed}.py` + `app/routers/{auth,opportunities,leads,dashboard,admin}.py`
- `require_admin` guard for role-based access
- DELETE admin lead now returns 404 if nothing was deleted

**New admin endpoints**:
- `GET /api/admin/stats` (counts)
- `GET /api/admin/leads/{waitlist|partners|strategy-calls}` (sorted desc by created_at)
- `GET /api/admin/users` (password_hash stripped)
- `DELETE /api/admin/leads/{collection}/{lead_id}` (admin-only)

**Admin frontend** (/admin):
- 5 KPI cards (waitlist, partners, strategy calls, investors, total users)
- 4 tabs with filterable tables (waitlist/partners/strategy-calls/users)
- Search + CSV export + row-level delete
- Frontend route guard + backend 401/403 guard
- Navbar shows Admin link only for `role==admin`

**Brand**:
- Real Property Verse PNG logo embedded at `/brand/property-verse-logo.png`
- 8 AI-generated A-grade commercial real estate hero images via Nano Banana at `/generated/assets/opp-*.png`
- OpportunityCard + OpportunityDetailPage use AI images with Unsplash fallback
- Hero title now 3-line layout with shimmer gradient on "Upgraded." + descender padding
- Bank LogoCard uses Simple Icons CDN for HDFC/ICICI/AXIS/SBI (open-license SVGs)

**Tests**: 31/31 backend pytest pass + full frontend E2E pass.
