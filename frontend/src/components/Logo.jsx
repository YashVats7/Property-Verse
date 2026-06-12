export default function Logo({ size = 40, withText = true, dark = false }) {
  const blue = "#1E63D5";
  const green = "#3FB36F";
  return (
    <div className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Property Verse logo">
        {/* Blue tall buildings outline */}
        <path d="M16 50 V18 L24 12 V50" stroke={blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M40 50 V14 L48 20 V50" stroke={blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Green houses (two overlapping pitched roofs) */}
        <path d="M20 50 V36 L32 26 L44 36 V50 Z" stroke={green} strokeWidth="2" strokeLinejoin="round" fill="none" />
        <path d="M26 50 V32 L36 24 L46 32 V50" stroke={green} strokeWidth="2" strokeLinejoin="round" fill="none" />
        {/* Window pixels */}
        <rect x="31" y="36" width="3.2" height="3.2" fill={blue} />
        <rect x="35" y="36" width="3.2" height="3.2" fill={green} />
        <rect x="31" y="40" width="3.2" height="3.2" fill={green} />
        <rect x="35" y="40" width="3.2" height="3.2" fill={blue} />
      </svg>
      {withText && (
        <div className="leading-none">
          <div className={`font-['Cabinet_Grotesk'] font-extrabold tracking-tight text-[15px] ${dark ? "text-white" : "text-[#1E63D5]"}`}>
            PROPERTY<span className="text-[#3FB36F]">VERSE</span>
          </div>
          <div className={`text-[9px] uppercase tracking-[0.25em] font-medium mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>Real Estate, Upgraded</div>
        </div>
      )}
    </div>
  );
}
