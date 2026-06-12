// Image-based dynamic visuals — these animate the ACTUAL imagery,
// not floating tickers / random dots. Ken Burns pans, parallax scrolls,
// SVG simulations that *belong* to the content.
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// ---------- Ken Burns image: slow zoom + drift ----------
export function KenBurns({ src, alt, className = "", duration = 22, scaleFrom = 1.04, scaleTo = 1.18 }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: scaleFrom, x: 0, y: 0 }}
        animate={{
          scale: [scaleFrom, scaleTo, scaleFrom],
          x: [0, -12, 0],
          y: [0, 6, 0],
        }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ---------- Parallax image (scrolls slower than page) ----------
export function ParallaxImage({ src, alt, className = "", strength = 80 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="absolute inset-0 w-full h-[130%] object-cover"
        loading="lazy"
      />
    </div>
  );
}

// ---------- Animated fractional building ----------
// SVG simulation: a building "shatters" into ~32 ownership blocks
// that orbit around it; one block lights up green (= your fraction).
export function FractionalSimulation({ className = "" }) {
  const blocks = Array.from({ length: 28 });
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 800 500" className="w-full h-full">
        <defs>
          <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E63D5" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0F3FA1" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3FB36F" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>
        </defs>

        {/* Ground */}
        <line x1="0" y1="430" x2="800" y2="430" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Building silhouette */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <rect x="340" y="180" width="120" height="250" fill="url(#bldg)" rx="4" />
          <rect x="320" y="220" width="40" height="210" fill="#0F3FA1" opacity="0.85" rx="4" />
          <rect x="440" y="200" width="50" height="230" fill="#0F3FA1" opacity="0.9" rx="4" />
          {/* Windows */}
          {Array.from({ length: 12 }).map((_, r) =>
            Array.from({ length: 4 }).map((__, c) => (
              <motion.rect
                key={`w-${r}-${c}`}
                x={350 + c * 25}
                y={195 + r * 18}
                width={16}
                height={10}
                fill="rgba(255,255,255,0.10)"
                animate={{ opacity: [0.1, 0.5, 0.1] }}
                transition={{ duration: 3 + ((r + c) % 4), delay: -((r + c) * 0.2), repeat: Infinity }}
              />
            ))
          )}
        </motion.g>

        {/* Orbiting ownership blocks */}
        {blocks.map((_, i) => {
          const angle = (i / blocks.length) * Math.PI * 2;
          const radius = 200 + (i % 3) * 22;
          const x = 400 + Math.cos(angle) * radius;
          const y = 270 + Math.sin(angle) * radius * 0.55;
          const isMine = i === 9;
          const size = 18 + (i % 4) * 3;
          return (
            <motion.rect
              key={i}
              x={x - size / 2}
              y={y - size / 2}
              width={size}
              height={size}
              rx={3}
              fill={isMine ? "url(#glow)" : "rgba(63,179,111,0.35)"}
              stroke={isMine ? "#3FB36F" : "rgba(63,179,111,0.6)"}
              strokeWidth="1.2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 1, 0.8],
                scale: [0, 1, 1.1, 1],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{ duration: 18, delay: -(i * 0.4), repeat: Infinity, ease: "linear" }}
              style={isMine ? { filter: "drop-shadow(0 0 12px #3FB36F)" } : undefined}
            />
          );
        })}

        {/* Center pulse */}
        <motion.circle
          cx={400}
          cy={270}
          r={6}
          fill="#3FB36F"
          animate={{ r: [4, 9, 4], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          style={{ filter: "drop-shadow(0 0 8px #3FB36F)" }}
        />
      </svg>
    </div>
  );
}

// ---------- Animated cityscape (rent flow simulation) ----------
// SVG city where rent flows from tenants → asset → investor over a 6-year arc.
export function CityRentFlow({ className = "" }) {
  const buildings = [
    { x: 40, h: 110, w: 50, tone: "#1E63D5" },
    { x: 100, h: 150, w: 60, tone: "#0F3FA1" },
    { x: 170, h: 190, w: 70, tone: "#1E63D5", anchor: true },
    { x: 250, h: 140, w: 55, tone: "#0F3FA1" },
    { x: 315, h: 170, w: 60, tone: "#1E63D5" },
    { x: 385, h: 120, w: 55, tone: "#0F3FA1" },
    { x: 450, h: 200, w: 65, tone: "#0F3FA1", anchor: true },
    { x: 525, h: 130, w: 50, tone: "#1E63D5" },
    { x: 585, h: 175, w: 60, tone: "#0F3FA1" },
    { x: 655, h: 145, w: 55, tone: "#1E63D5" },
  ];
  const ground = 320;
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 760 360" className="w-full h-full">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A2540" />
            <stop offset="100%" stopColor="#0F3FA1" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="760" height="360" fill="url(#sky)" />

        {/* Skyline */}
        {buildings.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={ground - b.h} width={b.w} height={b.h} fill={b.tone} rx="3" />
            {b.anchor && (
              <motion.rect
                x={b.x - 2}
                y={ground - b.h - 2}
                width={b.w + 4}
                height={b.h + 2}
                fill="none"
                stroke="#3FB36F"
                strokeWidth="1.5"
                rx="4"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: -i * 0.3 }}
              />
            )}
            {/* Windows light pattern */}
            {Array.from({ length: Math.floor(b.h / 18) }).map((_, r) =>
              Array.from({ length: Math.floor(b.w / 14) }).map((__, c) => (
                <motion.rect
                  key={`bw-${i}-${r}-${c}`}
                  x={b.x + 4 + c * 14}
                  y={ground - b.h + 6 + r * 18}
                  width={8}
                  height={10}
                  fill="rgba(110,231,183,0.9)"
                  animate={{ opacity: [0.05, 0.7, 0.05] }}
                  transition={{ duration: 3 + ((r + c + i) % 5), delay: -((r + c + i) * 0.15), repeat: Infinity }}
                />
              ))
            )}
          </g>
        ))}

        {/* Ground line */}
        <line x1="0" y1={ground} x2="760" y2={ground} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

        {/* Rent stream — money pulses traveling along the skyline base */}
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={`p-${i}`}
            r={4}
            fill="#3FB36F"
            initial={{ cx: -20, cy: ground - 5 }}
            animate={{ cx: 780 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: -i * 1.2 }}
            style={{ filter: "drop-shadow(0 0 8px #3FB36F)" }}
          />
        ))}

        {/* Top investor target — pulsing wallet */}
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          <rect x={690} y={30} width={50} height={32} rx={6} fill="rgba(63,179,111,0.18)" stroke="#3FB36F" strokeWidth="1.4" />
          <text x={715} y={50} fill="#3FB36F" fontSize="11" fontWeight="700" textAnchor="middle">YOU</text>
        </motion.g>

        {/* Flow line from anchor buildings to wallet */}
        <motion.path
          d="M 480 130 Q 600 80 690 50"
          stroke="#3FB36F"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="6 8"
          className="pv-dash"
          opacity="0.7"
        />
        <motion.path
          d="M 200 140 Q 450 60 690 50"
          stroke="#6EE7B7"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="6 8"
          className="pv-dash"
          opacity="0.55"
        />
      </svg>
    </div>
  );
}

// ---------- Leverage stack animation ----------
// Equity block + Debt block stack up into a tall exposure tower with multiplier.
export function LeverageStack({ className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 600 360" className="w-full h-full">
        <defs>
          <linearGradient id="lv-green" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#3FB36F" />
          </linearGradient>
          <linearGradient id="lv-blue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E63D5" />
            <stop offset="100%" stopColor="#0F3FA1" />
          </linearGradient>
        </defs>

        {/* Left: Normal fractional — single equity block */}
        <text x="120" y="40" fill="rgba(255,255,255,0.7)" fontSize="11" textAnchor="middle" fontWeight="700">NORMAL · ₹40 L equity</text>
        <motion.rect
          x="80" y="180" width="80" height="100" rx="4" fill="url(#lv-green)"
          initial={{ y: 280, opacity: 0 }} animate={{ y: 180, opacity: 1 }} transition={{ duration: 0.9 }}
        />
        <text x="120" y="240" fill="white" fontSize="13" fontWeight="800" textAnchor="middle">₹40L</text>
        <text x="120" y="305" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="middle">= ₹40L exposure</text>

        {/* Divider */}
        <line x1="240" y1="30" x2="240" y2="330" stroke="rgba(255,255,255,0.12)" strokeDasharray="4 6" />

        {/* Right: LFA — equity + debt = 2x exposure */}
        <text x="420" y="40" fill="#3FB36F" fontSize="11" textAnchor="middle" fontWeight="700">LEVERAGED · ₹20 L equity + ₹20 L debt</text>

        {/* Equity */}
        <motion.rect
          x="380" y="230" width="80" height="50" rx="4" fill="url(#lv-green)"
          initial={{ y: 320, opacity: 0 }} animate={{ y: 230, opacity: 1 }} transition={{ duration: 0.9, delay: 0.4 }}
        />
        <text x="420" y="262" fill="white" fontSize="12" fontWeight="800" textAnchor="middle">₹20L EQ</text>

        {/* Debt block stacks on top */}
        <motion.rect
          x="380" y="180" width="80" height="50" rx="4" fill="url(#lv-blue)"
          initial={{ y: 320, opacity: 0 }} animate={{ y: 180, opacity: 1 }} transition={{ duration: 0.9, delay: 1.0 }}
        />
        <text x="420" y="212" fill="white" fontSize="12" fontWeight="800" textAnchor="middle">₹20L DEBT</text>

        {/* Exposure outline grows around both */}
        <motion.rect
          x="375" y="175" width="90" height="110" rx="6" fill="none"
          stroke="#3FB36F" strokeWidth="2"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: [0, 1, 0.7, 1], scale: 1 }}
          transition={{ duration: 1.4, delay: 1.6, repeat: Infinity, repeatType: "mirror" }}
        />
        <text x="420" y="305" fill="#3FB36F" fontSize="10" textAnchor="middle" fontWeight="700">= ₹40L exposure</text>

        {/* Multiplier */}
        <motion.g
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 2.0 }}
        >
          <rect x="490" y="195" width="80" height="70" rx="10" fill="#0A2540" stroke="#3FB36F" strokeWidth="1.5" />
          <text x="530" y="222" fill="rgba(110,231,183,0.85)" fontSize="9" textAnchor="middle" fontWeight="700">EFFECTIVE</text>
          <text x="530" y="250" fill="#3FB36F" fontSize="24" textAnchor="middle" fontWeight="900">2×</text>
        </motion.g>

        {/* Floor */}
        <line x1="40" y1="295" x2="570" y2="295" stroke="rgba(255,255,255,0.18)" />
      </svg>
    </div>
  );
}

// ---------- Cash flow river (waterfall coming down) ----------
export function CashFlowRiver({ className = "" }) {
  const steps = [
    { y: 30, l: "Rent ₹100", c: "#3FB36F", w: 200 },
    { y: 100, l: "− Opex ₹8", c: "#94A3B8", w: 170 },
    { y: 170, l: "− Interest ₹22", c: "#1E63D5", w: 140 },
    { y: 240, l: "− Reserve ₹5", c: "#64748B", w: 120 },
    { y: 310, l: "Investor ₹65", c: "#3FB36F", w: 100, bold: true },
  ];
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 460 380" className="w-full h-full">
        {steps.map((s, i) => (
          <g key={i}>
            <motion.rect
              x={(460 - s.w) / 2}
              y={s.y}
              width={s.w}
              height={42}
              rx={10}
              fill={s.bold ? "#0A2540" : "rgba(255,255,255,0.04)"}
              stroke={s.c}
              strokeWidth={s.bold ? 2 : 1.2}
              initial={{ opacity: 0, y: s.y - 20 }}
              whileInView={{ opacity: 1, y: s.y }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.18 }}
            />
            <text
              x={230}
              y={s.y + 27}
              fill={s.bold ? "#3FB36F" : "white"}
              fontSize={s.bold ? 16 : 13}
              fontWeight={s.bold ? 800 : 600}
              textAnchor="middle"
            >
              {s.l}
            </text>
            {i < steps.length - 1 && (
              <motion.circle
                r="4" fill={s.c}
                initial={{ cy: s.y + 42 }} animate={{ cy: [s.y + 42, steps[i + 1].y] }}
                transition={{ duration: 1.6, delay: i * 0.4, repeat: Infinity }}
                cx="230"
                style={{ filter: `drop-shadow(0 0 6px ${s.c})` }}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
