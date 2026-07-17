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

## v4 — Cinematic Background Visuals (Dec 12, 2025)
Per user request: "background visuals everywhere, dynamic moving, exciting to view, glaze for the eyes, scrolling should feel like a simulation".

**New `BackgroundFX` component** with 11 animated variants (all CSS/SVG + framer-motion, no external assets):
- `blobs` — drifting color orbs (24s loop)
- `grid` — moving grid with horizontal + vertical scan lines
- `particles` — 36 glowing dots floating upward
- `skyline` — SVG city skyline parallax (depth on scroll)
- `flow` — 5 cash-flow curves with traveling dashes + pulse dots
- `ticker` — 18 floating numeric labels (₹80 Cr, 17% IRR, etc.) drifting horizontally
- `mesh` — pulsing multi-color radial gradient overlay
- `rings` — 4 expanding pulse-ring clusters
- `matrix` — falling fintech digits/₹/% column rain
- `waveform` — 60-bar animated equalizer
- `blocks` — rotating fractional-ownership cube fragments

**Applied across all HomePage sections**: hero (particles+flow), ecosystem (mesh), stats (flow+ticker), pillars (blocks+ticker), simulator (grid+waveform), cash flow waterfall (flow+particles), opportunities (skyline+mesh), asset intelligence (rings+matrix), India map (blobs), leverage teaser (ticker+flow+particles), dashboard mockup (grid+blocks), personas (mesh+particles), final CTA (particles+flow).

**Applied across all LeveragePage sections**: hero (flow+particles+rings), comparison (blocks+rings), 5-step (matrix+ticker), calculator (waveform+grid+ticker), features (mesh+particles+rings), comparison table (skyline+ticker), waitlist (flow+particles).

**Marketplace page**: untouched per user request.

**Polish**: LogoCard now has Simple Icons CDN onError fallback (graceful broken-image handling); ticker opacity dialed down for dark backgrounds to keep headlines readable.

## v5 — Dynamic Image Simulations (replacing v4 floaters) (Dec 12, 2025)
User feedback: v4 floaters (random tickers, matrix digits, particle dots) felt like "gibberish". Replaced with content-relevant, meaningful animated visuals where the imagery itself simulates the concept.

**Removed**: All ticker/matrix/particles/rings/blocks/mesh/waveform/blobs/flow/grid noise overlays from HomePage and LeveragePage.

**Added — `Visuals.jsx` component with 5 dynamic visualizations**:
- `CityRentFlow` — animated SVG cityscape with pulsing windows, anchor buildings glowing green, rent (green dots) flowing along the base, dashed flow lines from anchor buildings to a "YOU" wallet at top right
- `FractionalSimulation` — animated SVG of a building with 28 ownership blocks orbiting around it; your fraction lights up in green with a glow drop-shadow
- `LeverageStack` — animated SVG showing ₹40L equity (single block) vs ₹20L equity + ₹20L debt stacking into ₹40L exposure with an `EFFECTIVE 2×` multiplier badge appearing
- `CashFlowRiver` — vertical waterfall: Rent ₹100 → −Opex ₹8 → −Interest ₹22 → −Reserve ₹5 → Investor ₹65, with pulse dots traveling between steps
- `KenBurns` — slow zoom + drift Ken Burns effect for AI-generated photography

**Applied**:
- HomePage stats strip: CityRentFlow backdrop
- HomePage fractional ownership section: FractionalSimulation (replaced static AI image)
- HomePage cash flow waterfall: CashFlowRiver (replaced CashFlowWaterfall component)
- HomePage leverage teaser: LeverageStack inserted above the comparison cards
- LeveragePage hero: CityRentFlow occupying the bottom half
- LeveragePage comparison section: LeverageStack (replaced static leverage_visual image)
- Marketplace page untouched per user

## v6 — Admin Content & Asset Management (Dec 12, 2025)
**Backend**:
- Migrated `SAMPLE_OPPORTUNITIES` from Python list → MongoDB `opportunities` collection (seeded on first run; persistent across restarts)
- New `content` collection storing `stats`, `hero`, `about`, `personas` as upsertable key→value JSON docs (with defaults in `/app/backend/app/defaults.py`)
- New admin endpoints: `GET/POST/PUT/DELETE /api/admin/opportunities[/{id}]`, `POST /api/admin/opportunities/reset`, `GET/PUT /api/admin/content/{key}`, `POST /api/admin/upload` (multipart, ≤6 MB, png/jpg/jpeg/webp/gif → `/app/frontend/public/uploads/{uuid}.ext`)
- New public endpoint: `GET /api/content/{key}` (frontend reads dynamic copy live)
- Public `/api/opportunities`, `/api/opportunities/{id}`, `/api/stats` now sourced from MongoDB (not hard-coded list)
- Dashboard router now reads watchlist/recommended from `db.opportunities` instead of Python list

**Frontend** — `/admin` page rebuilt with 9 tabs:
- **Opportunities**: card grid + New / Edit / Delete / Reset-to-demos + modal form with all 17 fields (name, location, asset type, tenant, min investment, asset value Cr, target IRR + range, rental yield, lease term, occupancy, tenure, funded %, leverage toggle, risk score, tags, highlight) + image upload (POST /api/admin/upload) or paste-URL
- **Stats**: 6 number inputs (AUM, investors, properties, avg IRR, cities, occupancy)
- **Hero / About / Personas**: JSON editors with validation + live load from `/api/content/{key}`
- **Waitlist / Partners / Strategy Calls / Users**: existing leads triage (search, CSV export, delete)

**Verified end-to-end**: list/create/update/delete opportunity, edit stats, image upload, reset all working.

## v7 — Admin glitch fix + PDF gate + Marketplace hover skyline (Dec 12, 2025)

**Admin glitch fix (root cause: input focus loss while typing)**:
- The `OpportunityForm` defined an inline `F` component on every render → React treated each keystroke as a new component type and unmounted/remounted inputs, dropping focus
- Replaced with `fieldDefs.map(...)` rendering stable inline JSX + a single `setField(k, v)` helper using functional state updates
- Added data-testids: `opp-form-{key}`, `opp-form-tags`, `opp-form-highlight`, `opp-form-image-url`, `opp-form-leverage`, `opp-form-cancel`, `opp-form-cancel-x`

**Per-opportunity PDF generator (email-gated)**:
- Backend: new `/app/backend/app/routers/pdf.py` using `reportlab` 4.5.1
- Endpoint: `POST /api/opportunities/{id}/pdf` body `{name, email, phone?}` → captures lead into `leads_pdf_downloads` + `leads_waitlist` (source=`pdf_download`) → returns one-page A4 PDF as streaming binary
- PDF layout: navy header band with asset name & location, 6-tile KPI grid (asset value, target IRR, yield, min investment, tenure, occupancy), highlight box, tenant + lease line, blue leverage callout (when eligible), illustrative disclaimer footer with recipient name/email + date
- Frontend: `PdfModal` on `OpportunityDetailPage` triggered by gradient "Download Asset Summary PDF" button (`opp-detail-download-pdf`); 3-field form (`pdf-input-name`, `pdf-input-email`, `pdf-input-phone`); on submit calls fetch with `credentials: include`, downloads blob, shows success state

**Per-city hover skyline on marketplace cards**:
- New `CitySkylineMini` component with 7 city-specific skyline signatures (Bengaluru, Mumbai, Hyderabad, Gurugram/NCR, Pune, Chennai + default)
- Auto-picks city from `o.location` string
- Animated: buildings rise from ground with staggered entrance + windows pulse green randomly + rent dots travel along the base
- `OpportunityCard` now tracks hover state and shows the skyline overlay (navy backdrop + city pill label) over the asset photo on hover with AnimatePresence fade

---

## Security Hardening Pass (June 2026 — fork session)
User requested full security hardening before onboarding 8k clients. All 7 items implemented + tested (iteration_5.json, 15/16 backend, 100% frontend):
1. **Rate limiting** (slowapi, per-IP via X-Forwarded-For): register 5/min, login 10/min, refresh 30/min, lead forms 10/min, PDF 5/min — `app/ratelimit.py`
2. **Security headers middleware** (HSTS, X-Frame-Options DENY, nosniff, CSP, Referrer-Policy, Permissions-Policy) + API docs/openapi disabled — `server.py`
3. **Password policy**: min 8 chars, letter + number required on register
4. **Upload magic-byte validation** (PNG/JPEG/GIF/WEBP content sniffing) — `admin.py _valid_image_bytes`
5. **Honeypot anti-bot** hidden `website` field on all 3 lead forms + PDF gate; Pydantic max_length limits on all lead inputs
6. **Refresh token rotation + server-side revocation** (`refresh_tokens` collection with TTL index; logout revokes; replayed old token → 401)
7. **Admin audit log** (`audit_log` collection, all admin mutations recorded; new read-only "Audit Log" tab in AdminPage)
Also: Mongo indexes on startup (users.email unique, refresh_tokens TTL, etc.). Note: testing agent fixed a corrupted WaitlistForm.jsx during this session (verified clean).

## Code Quality Pass (June 2026)
Applied review fixes, verified regression-free by testing agent (iteration_6.json, 69/69 effective):
- Test credentials moved to env via new `tests/conftest.py` (loads backend .env)
- `is True` literal comparisons → `== True` in tests (prod `is None` checks kept — correct usage)
- `pdf.py _draw_summary` split into 5 helpers (_draw_header/_draw_kpis/_draw_highlight/_draw_tenant_and_leverage/_draw_footer); PDF output byte-verified via pypdf
- `seed.py seed_database` split into 5 domain functions; complex tests split (CRUD → 3 tests, list_opportunities → 3 tests); `-> None` type hints added across test files + server.py
- Known artifact: full-suite single-pass shows 3 register-test 429s (5/min rate limit, same IP) — pass in isolation

## Remaining Backlog
- P1: Email notifications via Resend/SendGrid on lead capture (needs user API key)
- P2: "Book a Strategy Call" conversion flow post-PDF download
- P2 (minor): StatsEditor copy says "5 KPI numbers" but renders 6 fields
- Note for prod: network-level DDoS/WAF (e.g., Cloudflare) is infra-level, outside app code

