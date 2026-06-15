// Per-city stylized skyline silhouettes — pure SVG, hover-animated.
// Used as a hover overlay on marketplace cards to make the marketplace
// feel like a living simulation.
import { motion } from "framer-motion";

// Each city has a distinct skyline silhouette signature (rect heights pattern)
const SKYLINES = {
  bengaluru:  [40, 70, 55, 95, 60, 110, 75, 90, 65, 50, 80, 100, 60, 70, 45],
  mumbai:     [90, 130, 110, 160, 140, 180, 120, 150, 100, 170, 130, 145, 120, 100, 90],
  hyderabad:  [60, 90, 80, 140, 95, 170, 130, 100, 85, 145, 110, 130, 95, 80, 70],
  gurugram:   [50, 80, 65, 110, 85, 130, 100, 90, 75, 115, 95, 105, 85, 70, 60],
  pune:       [45, 65, 75, 90, 60, 105, 80, 95, 70, 85, 60, 90, 75, 65, 50],
  chennai:    [55, 75, 65, 100, 80, 90, 105, 85, 70, 95, 75, 85, 70, 60, 55],
  ncr:        [50, 80, 65, 110, 85, 130, 100, 90, 75, 115, 95, 105, 85, 70, 60],
  default:    [50, 70, 60, 90, 75, 100, 80, 85, 70, 90, 75, 80, 70, 60, 55],
};

function pickCity(location = "") {
  const s = location.toLowerCase();
  if (s.includes("mumbai") || s.includes("bandra") || s.includes("bkc")) return "mumbai";
  if (s.includes("bengaluru") || s.includes("bangalore") || s.includes("orr")) return "bengaluru";
  if (s.includes("hyderabad") || s.includes("hitec")) return "hyderabad";
  if (s.includes("gurugram") || s.includes("gurgaon") || s.includes("ncr")) return "gurugram";
  if (s.includes("pune") || s.includes("kharadi")) return "pune";
  if (s.includes("chennai") || s.includes("omr")) return "chennai";
  return "default";
}

export default function CitySkylineMini({ location, cityLabel }) {
  const key = pickCity(location);
  const bars = SKYLINES[key];
  const W = 320, H = 140, gap = 4;
  const barW = (W - (bars.length + 1) * gap) / bars.length;
  return (
    <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        <defs>
          <linearGradient id="skygrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E63D5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0F3FA1" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        {/* Buildings rise */}
        {bars.map((h, i) => (
          <motion.rect
            key={i}
            x={gap + i * (barW + gap)}
            y={H - h}
            width={barW}
            height={h}
            rx="2"
            fill="url(#skygrad)"
            initial={{ y: H, height: 0 }}
            animate={{ y: H - h, height: h }}
            transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
        {/* Windows pulsing */}
        {bars.map((h, i) =>
          Array.from({ length: Math.floor(h / 16) }).map((_, r) =>
            r % 2 === 0 ? (
              <motion.rect
                key={`w-${i}-${r}`}
                x={gap + i * (barW + gap) + 3}
                y={H - h + 6 + r * 16}
                width={Math.max(3, barW - 8)}
                height={5}
                fill="#3FB36F"
                opacity="0.85"
                animate={{ opacity: [0.1, 0.9, 0.1] }}
                transition={{ duration: 2.5 + (i + r) % 4, delay: -((i + r) * 0.2), repeat: Infinity }}
              />
            ) : null
          )
        )}
        {/* Rent stream travelling along base */}
        {[0, 1].map((k) => (
          <motion.circle
            key={`d-${k}`}
            r="3"
            fill="#3FB36F"
            initial={{ cx: -10, cy: H - 4 }}
            animate={{ cx: W + 10 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: -k * 2 }}
            style={{ filter: "drop-shadow(0 0 6px #3FB36F)" }}
          />
        ))}
        {/* Ground */}
        <line x1="0" y1={H - 1} x2={W} y2={H - 1} stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
      </svg>
      {cityLabel && (
        <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-white/95 text-[10px] uppercase tracking-widest font-bold text-[#0A2540]">
          {cityLabel}
        </div>
      )}
    </div>
  );
}
