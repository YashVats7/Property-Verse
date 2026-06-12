// Stylized text-only "logo" cards for partner ecosystem.
// We do NOT ship real brand artwork — these are typographic placeholders.

export const PLATFORM_BRANDS = [
  { name: "hBits", tag: "OwnYourBit", color: "#1A3A8C", accent: "#3FB36F" },
  { name: "Strata", tag: "", color: "#0A2540", accent: "#F59E0B" },
  { name: "PropShare", tag: "", color: "#1E63D5", accent: "#0A2540" },
  { name: "Assetmonk", tag: "", color: "#FF6B35", accent: "#0A2540" },
  { name: "BHIVE Alts", tag: "", color: "#0A2540", accent: "#FFC700" },
  { name: "Ryzer", tag: "", color: "#7C3AED", accent: "#0A2540" },
  { name: "ALT DRX", tag: "", color: "#0A2540", accent: "#3FB36F" },
  { name: "Assetkart", tag: "", color: "#1E63D5", accent: "#3FB36F" },
  { name: "Grip Invest", tag: "", color: "#0A2540", accent: "#F59E0B" },
  { name: "Jiraaf", tag: "", color: "#3FB36F", accent: "#0A2540" },
  { name: "Wint Wealth", tag: "", color: "#1E40AF", accent: "#FBBF24" },
  { name: "Property Share", tag: "", color: "#0A2540", accent: "#3FB36F" },
];

export const BANK_BRANDS = [
  { name: "ICICI Bank", short: "ICICI", color: "#B02A30", accent: "#F58220" },
  { name: "Kotak Mahindra", short: "kotak", color: "#ED1C24", accent: "#0A2540" },
  { name: "HDFC Bank", short: "HDFC", color: "#004C8F", accent: "#ED232A" },
  { name: "Axis Bank", short: "AXIS", color: "#A2185B", accent: "#ED2939" },
  { name: "SBI", short: "SBI", color: "#22409A", accent: "#FFFFFF" },
  { name: "IDFC FIRST", short: "IDFC FIRST", color: "#7A1F3D", accent: "#B91C5C" },
  { name: "Yes Bank", short: "YES BANK", color: "#1B4D9E", accent: "#005DAA" },
  { name: "Federal Bank", short: "Federal", color: "#003B71", accent: "#FFC72C" },
];

export function PlatformLogo({ brand, size = "md", testId }) {
  const cls = size === "sm" ? "h-12 px-4 text-sm" : "h-14 px-5 text-base";
  return (
    <div data-testid={testId} className={`pv-logo-card flex items-center justify-center gap-2 ${cls} min-w-[160px]`}>
      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: `linear-gradient(135deg, ${brand.color}, ${brand.accent})` }} />
      <div className="leading-none">
        <div className="font-['Cabinet_Grotesk'] font-extrabold tracking-tight" style={{ color: brand.color }}>
          {brand.name}
        </div>
        {brand.tag && <div className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: brand.accent }}>{brand.tag}</div>}
      </div>
    </div>
  );
}

export function BankLogo({ brand, size = "md", testId }) {
  const cls = size === "sm" ? "h-12 px-4 text-sm" : "h-14 px-5 text-base";
  return (
    <div data-testid={testId} className={`pv-logo-card flex items-center justify-center gap-2 ${cls} min-w-[170px]`}>
      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-extrabold text-[10px]" style={{ background: brand.color }}>
        {brand.short.slice(0, 1)}
      </div>
      <div className="font-['Cabinet_Grotesk'] font-extrabold tracking-tight uppercase" style={{ color: brand.color }}>
        {brand.short}
      </div>
    </div>
  );
}
