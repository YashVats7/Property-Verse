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
