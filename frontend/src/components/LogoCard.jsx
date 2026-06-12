// Stylized partner cards. We do NOT ship copyrighted brand artwork.
// For banks we use Simple Icons CDN (https://simpleicons.org) where a brand
// is published under their licensing terms; otherwise we render typographic
// placeholders with brand-like colors.
import { motion } from "framer-motion";

export const PLATFORM_BRANDS = [
  // simpleIcon slug if available on Simple Icons; else null → text fallback
  { name: "hBits", slug: null, color: "#1A3A8C" },
  { name: "Strata", slug: null, color: "#0A2540" },
  { name: "PropShare", slug: null, color: "#1E63D5" },
  { name: "Assetmonk", slug: null, color: "#FF6B35" },
  { name: "BHIVE Alts", slug: null, color: "#0A2540" },
  { name: "Ryzer", slug: null, color: "#7C3AED" },
  { name: "ALT DRX", slug: null, color: "#10B981" },
  { name: "Assetkart", slug: null, color: "#1E63D5" },
  { name: "Grip Invest", slug: null, color: "#0A2540" },
  { name: "Jiraaf", slug: null, color: "#10B981" },
  { name: "Wint Wealth", slug: null, color: "#1E40AF" },
  { name: "Property Share", slug: null, color: "#0A2540" },
];

export const BANK_BRANDS = [
  // The Simple Icons CDN serves SVG marks under their open license.
  // Slug must exist on https://simpleicons.org. We fall back to typographic card if not.
  { name: "HDFC Bank", short: "HDFC", slug: "hdfcbank", color: "#004C8F" },
  { name: "ICICI Bank", short: "ICICI", slug: "icicibank", color: "#B02A30" },
  { name: "Axis Bank", short: "AXIS", slug: "axisbank", color: "#A2185B" },
  { name: "State Bank of India", short: "SBI", slug: "statebankofindia", color: "#22409A" },
  { name: "Kotak Mahindra", short: "Kotak", slug: null, color: "#ED1C24" },
  { name: "IDFC FIRST", short: "IDFC FIRST", slug: null, color: "#7A1F3D" },
  { name: "Yes Bank", short: "YES BANK", slug: null, color: "#1B4D9E" },
  { name: "Federal Bank", short: "Federal", slug: null, color: "#003B71" },
];

function simpleIconUrl(slug, color) {
  // Returns CDN URL for the SVG mark in the requested hex color.
  const hex = (color || "0A2540").replace("#", "");
  return `https://cdn.simpleicons.org/${slug}/${hex}`;
}

function SimpleOrFallback({ brand, big = false }) {
  const cls = big ? "w-6 h-6" : "w-5 h-5";
  const blockCls = big ? "w-7 h-7" : "w-2.5 h-2.5";
  if (!brand.slug) {
    return big ? (
      <div className={`${blockCls} rounded-md flex items-center justify-center text-white font-extrabold text-[10px]`} style={{ background: brand.color }}>
        {(brand.short || brand.name).slice(0, 1)}
      </div>
    ) : (
      <div className={`${blockCls} rounded-sm`} style={{ background: brand.color }} />
    );
  }
  return (
    <img
      src={`https://cdn.simpleicons.org/${brand.slug}/${(brand.color || "0A2540").replace("#", "")}`}
      alt={`${brand.name} mark`}
      className={`${cls} object-contain`}
      loading="lazy"
      onError={(e) => {
        // hide broken image; sibling fallback chip will show via grid
        e.currentTarget.style.display = "none";
        const fb = e.currentTarget.nextElementSibling;
        if (fb) fb.style.display = "inline-flex";
      }}
    />
  );
}

export function PlatformLogo({ brand, size = "md", testId }) {
  const cls = size === "sm" ? "h-12 px-4 text-sm" : "h-14 px-5 text-base";
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      data-testid={testId}
      className={`pv-logo-card flex items-center justify-center gap-2 ${cls} min-w-[170px]`}
    >
      <SimpleOrFallback brand={brand} />
      <div className="leading-none">
        <div className="font-['Cabinet_Grotesk'] font-extrabold tracking-tight" style={{ color: brand.color }}>
          {brand.name}
        </div>
      </div>
    </motion.div>
  );
}

export function BankLogo({ brand, size = "md", testId }) {
  const cls = size === "sm" ? "h-12 px-4 text-sm" : "h-14 px-5 text-base";
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      data-testid={testId}
      className={`pv-logo-card flex items-center justify-center gap-2 ${cls} min-w-[180px]`}
    >
      {brand.slug ? (
        <>
          <img
            src={`https://cdn.simpleicons.org/${brand.slug}/${(brand.color || "0A2540").replace("#", "")}`}
            alt={`${brand.name} mark`}
            className="w-6 h-6 object-contain"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const sib = e.currentTarget.nextElementSibling;
              if (sib) sib.style.display = "flex";
            }}
          />
          <span
            className="w-7 h-7 rounded-md hidden items-center justify-center text-white font-extrabold text-[10px]"
            style={{ background: brand.color }}
          >
            {brand.short.slice(0, 1)}
          </span>
        </>
      ) : (
        <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-extrabold text-[10px]" style={{ background: brand.color }}>
          {brand.short.slice(0, 1)}
        </div>
      )}
      <div className="font-['Cabinet_Grotesk'] font-extrabold tracking-tight uppercase" style={{ color: brand.color }}>
        {brand.short}
      </div>
    </motion.div>
  );
}
