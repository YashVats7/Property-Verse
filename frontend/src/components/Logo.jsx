export default function Logo({ size = 40, withText = true, dark = false }) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <img
        src="/brand/property-verse-logo.png"
        alt="Property Verse"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="object-contain select-none"
      />
      {withText && (
        <div className="leading-none">
          <div className={`font-['Cabinet_Grotesk'] font-extrabold tracking-tight text-[15px] ${dark ? "text-white" : "text-[#1E63D5]"}`}>
            PROPERTY<span className="text-[#3FB36F]">VERSE</span>
          </div>
          <div className={`text-[9px] uppercase tracking-[0.22em] font-medium mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>Real Estate, Upgraded</div>
        </div>
      )}
    </div>
  );
}
