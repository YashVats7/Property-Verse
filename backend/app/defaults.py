"""Default content blocks for hero / about / personas / stats.
These get seeded into Mongo on first run; admin can override.
"""

DEFAULT_STATS = {
    "aum_inr_cr": 1240,
    "investors": 18500,
    "properties": 47,
    "avg_irr": 15.8,
    "cities": 9,
    "occupancy_pct": 98,
}

DEFAULT_HERO = {
    "eyebrow": "India's Real Estate Investment Layer",
    "title_lines": ["Real Estate", "Investing,", "Upgraded."],
    "subtitle": "Discover curated fractional real estate opportunities and access upcoming leverage-backed investment products in A-grade pre-leased commercial real estate.",
    "kpis": [
        {"value": "₹60Cr+", "label": "Executed (team)"},
        {"value": "17%", "label": "Target IRR (LFA)"},
        {"value": "20+ yrs", "label": "Team experience"},
    ],
}

DEFAULT_ABOUT = {
    "mission_title": "Real estate investing, upgraded for the modern investor.",
    "mission_body_md": "Unlike a simple listing marketplace, Property Verse is an **intelligence-first investment platform**. Every opportunity is evaluated across key real estate and financial parameters — tenant quality, lease tenure, rental yield, asset location, developer credibility, valuation comfort, exit potential, risk profile, and projected investor returns.\n\nWe are preparing to launch what we believe will be **India's first leverage-backed fractional real estate investment product** — focused on A-grade pre-leased commercial real estate.",
    "founder_name": "Yash Vats",
    "founder_role": "Founder, Property Verse",
    "founder_bio": "Young entrepreneur building at the intersection of real estate, fintech, alternative investments, and structured finance. Building infrastructure for real-estate-backed investing in India.",
    "stats": [
        {"value": "₹60 Cr+", "label": "Team's executed fractional real estate sales"},
        {"value": "4+ years", "label": "Direct involvement in fractional market"},
        {"value": "20+ years", "label": "Combined team & advisor experience"},
    ],
}

DEFAULT_PERSONAS = [
    {"title": "HNIs", "desc": "Seeking real-estate backed income."},
    {"title": "Founders & Operators", "desc": "Wanting alternative assets beyond equity."},
    {"title": "Family Offices", "desc": "Curated CRE exposure across cycles."},
    {"title": "NRIs", "desc": "Assisted Indian real estate access."},
    {"title": "Wealth Managers", "desc": "Better real estate products for clients."},
    {"title": "Accredited Investors", "desc": "Asset-backed diversification beyond stocks and bonds."},
]
