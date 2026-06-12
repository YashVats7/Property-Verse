// Reusable animated section backgrounds.
// Each variant renders inside an `absolute inset-0 pointer-events-none` layer.
// Drop <BackgroundFX variant="..." /> as the first child of a `relative` section.
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo } from "react";

export default function BackgroundFX({ variant = "blobs", dark = false, className = "" }) {
  const cls = `absolute inset-0 pointer-events-none overflow-hidden ${className}`;
  switch (variant) {
    case "blobs": return <Blobs dark={dark} cls={cls} />;
    case "grid": return <Grid dark={dark} cls={cls} />;
    case "particles": return <Particles dark={dark} cls={cls} />;
    case "skyline": return <Skyline dark={dark} cls={cls} />;
    case "flow": return <Flow dark={dark} cls={cls} />;
    case "ticker": return <Ticker dark={dark} cls={cls} />;
    case "mesh": return <Mesh dark={dark} cls={cls} />;
    case "rings": return <Rings dark={dark} cls={cls} />;
    case "matrix": return <Matrix dark={dark} cls={cls} />;
    case "waveform": return <Waveform dark={dark} cls={cls} />;
    case "blocks": return <Blocks dark={dark} cls={cls} />;
    default: return null;
  }
}

// ---------- Drifting color orbs ----------
function Blobs({ dark, cls }) {
  const blue = dark ? "rgba(30,99,213,0.45)" : "rgba(30,99,213,0.18)";
  const green = dark ? "rgba(63,179,111,0.45)" : "rgba(63,179,111,0.18)";
  const cyan = dark ? "rgba(110,231,183,0.40)" : "rgba(110,231,183,0.14)";
  return (
    <div className={cls}>
      <motion.div
        className="absolute w-[520px] h-[520px] rounded-full blur-3xl"
        style={{ background: blue, top: "-12%", left: "-8%" }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[460px] h-[460px] rounded-full blur-3xl"
        style={{ background: green, top: "20%", right: "-8%" }}
        animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl"
        style={{ background: cyan, bottom: "-12%", left: "30%" }}
        animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ---------- Moving grid w/ scan line ----------
function Grid({ dark, cls }) {
  const line = dark ? "rgba(255,255,255,0.06)" : "rgba(10,37,64,0.05)";
  return (
    <div className={cls}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: dark ? "linear-gradient(90deg, transparent, rgba(63,179,111,0.85), transparent)" : "linear-gradient(90deg, transparent, rgba(30,99,213,0.6), transparent)" }}
        animate={{ y: ["-10%", "110%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-0 bottom-0 w-px"
        style={{ background: dark ? "linear-gradient(180deg, transparent, rgba(110,231,183,0.7), transparent)" : "linear-gradient(180deg, transparent, rgba(63,179,111,0.5), transparent)" }}
        animate={{ x: ["-5%", "105%"] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// ---------- Floating particles ----------
function Particles({ dark, cls }) {
  const dots = useMemo(() =>
    Array.from({ length: 36 }, (_, i) => ({
      l: Math.random() * 100,
      t: Math.random() * 100,
      d: 6 + Math.random() * 10,
      delay: -Math.random() * 8,
      s: 1.5 + Math.random() * 2.5,
      green: Math.random() > 0.5,
    })),
  []);
  return (
    <div className={cls}>
      {dots.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.l}%`,
            top: `${p.t}%`,
            width: p.s,
            height: p.s,
            background: p.green ? "#3FB36F" : (dark ? "#6EE7B7" : "#1E63D5"),
            boxShadow: `0 0 ${p.s * 4}px currentColor`,
            color: p.green ? "#3FB36F" : "#1E63D5",
            opacity: dark ? 0.7 : 0.5,
          }}
          animate={{ y: [-8, -28, -8], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  );
}

// ---------- City skyline parallax ----------
function Skyline({ dark, cls }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const stroke = dark ? "rgba(110,231,183,0.45)" : "rgba(10,37,64,0.10)";
  const fill = dark ? "rgba(10,37,64,0.4)" : "rgba(241,245,249,0.6)";
  return (
    <div ref={ref} className={cls}>
      <motion.svg
        viewBox="0 0 1600 300"
        preserveAspectRatio="none"
        className="absolute left-0 right-0 bottom-0 w-full h-48 md:h-64"
        style={{ y: y2 }}
      >
        <path d="M0 240 V160 L60 160 V120 L100 120 V160 L160 160 V100 L200 100 V160 L260 160 V140 L320 140 V160 L380 160 V90 L420 90 V160 L480 160 V130 L540 130 V160 L600 160 V70 L660 70 V160 L720 160 V120 L780 120 V160 L840 160 V100 L900 100 V160 L960 160 V140 L1020 140 V160 L1080 160 V60 L1140 60 V160 L1200 160 V120 L1260 120 V160 L1320 160 V100 L1380 100 V160 L1440 160 V130 L1500 130 V160 L1560 160 V90 L1600 90 V240 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
      </motion.svg>
      <motion.svg
        viewBox="0 0 1600 220"
        preserveAspectRatio="none"
        className="absolute left-0 right-0 bottom-0 w-full h-32 md:h-44"
        style={{ y: y1 }}
      >
        <path d="M0 220 V120 L40 120 V90 L70 90 V120 L120 120 V70 L170 70 V120 L220 120 V100 L260 100 V120 L320 120 V50 L370 50 V120 L420 120 V90 L470 90 V120 L520 120 V80 L580 80 V120 L640 120 V60 L700 60 V120 L760 120 V100 L820 100 V120 L880 120 V40 L940 40 V120 L1000 120 V80 L1060 80 V120 L1120 120 V70 L1180 70 V120 L1240 120 V100 L1300 100 V120 L1360 120 V50 L1420 50 V120 L1480 120 V90 L1540 90 V120 L1600 120 V220 Z" fill={dark ? "rgba(10,37,64,0.85)" : "rgba(226,232,240,0.55)"} stroke={dark ? "rgba(110,231,183,0.35)" : "rgba(10,37,64,0.18)"} strokeWidth="1.5" />
      </motion.svg>
    </div>
  );
}

// ---------- Cash flow curves with traveling dashes ----------
function Flow({ dark, cls }) {
  const green = dark ? "#3FB36F" : "#3FB36F";
  const blue = dark ? "#6EE7B7" : "#1E63D5";
  return (
    <div className={cls}>
      <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className="w-full h-full opacity-70">
        <defs>
          <linearGradient id="fxgrad1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={green} stopOpacity="0" />
            <stop offset="50%" stopColor={green} stopOpacity="1" />
            <stop offset="100%" stopColor={green} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[60, 180, 320, 440, 540].map((y, i) => (
          <path
            key={i}
            d={`M -50 ${y} Q 300 ${y - 60} 600 ${y} T 1250 ${y}`}
            stroke={i % 2 === 0 ? green : blue}
            strokeWidth={1.6}
            fill="none"
            strokeDasharray="6 14"
            opacity={dark ? 0.7 : 0.45}
            style={{ animation: `pv-dash ${4 + i}s linear infinite` }}
          />
        ))}
        {/* Money pulse dots traveling */}
        {[80, 220, 360, 480].map((y, i) => (
          <motion.circle
            key={`d-${i}`}
            r="4"
            fill={i % 2 === 0 ? green : blue}
            initial={{ cx: -20, cy: y }}
            animate={{ cx: 1220 }}
            transition={{ duration: 6 + i * 1.5, repeat: Infinity, ease: "linear", delay: -i }}
            style={{ filter: `drop-shadow(0 0 6px ${i % 2 === 0 ? green : blue})` }}
          />
        ))}
      </svg>
    </div>
  );
}

// ---------- Floating numeric ticker ----------
function Ticker({ dark, cls }) {
  const items = ["₹80 Cr", "8.5%", "17% IRR", "6 yrs", "₹20L equity", "+1.6×", "₹100 rent", "₹65 net", "A-Grade", "1,000 fractions", "₹113 Cr exit"];
  const rows = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    text: items[i % items.length],
    top: (i * 7.5 + 4) % 95,
    delay: -Math.random() * 14,
    duration: 16 + Math.random() * 10,
    size: 11 + Math.floor(Math.random() * 5),
    dir: i % 2 === 0 ? 1 : -1,
  })), []);
  const col = dark ? "rgba(110,231,183,0.28)" : "rgba(30,99,213,0.18)";
  return (
    <div className={cls}>
      {rows.map((r, i) => (
        <motion.div
          key={i}
          className="absolute whitespace-nowrap font-mono font-bold tracking-tight"
          style={{ top: `${r.top}%`, fontSize: r.size, color: col, left: r.dir > 0 ? "-10%" : "110%" }}
          animate={{ x: r.dir > 0 ? ["0%", "110vw"] : ["0%", "-110vw"] }}
          transition={{ duration: r.duration, repeat: Infinity, ease: "linear", delay: r.delay }}
        >
          {r.text}
        </motion.div>
      ))}
    </div>
  );
}

// ---------- Animated mesh gradient ----------
function Mesh({ dark, cls }) {
  return (
    <div className={cls}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: dark
            ? "radial-gradient(circle at 20% 20%, rgba(30,99,213,0.45), transparent 50%), radial-gradient(circle at 80% 30%, rgba(63,179,111,0.40), transparent 50%), radial-gradient(circle at 50% 80%, rgba(110,231,183,0.30), transparent 60%)"
            : "radial-gradient(circle at 20% 20%, rgba(30,99,213,0.18), transparent 50%), radial-gradient(circle at 80% 30%, rgba(63,179,111,0.16), transparent 50%), radial-gradient(circle at 50% 80%, rgba(110,231,183,0.12), transparent 60%)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ---------- Expanding pulse rings ----------
function Rings({ dark, cls }) {
  const stroke = dark ? "rgba(63,179,111,0.65)" : "rgba(30,99,213,0.35)";
  const positions = [
    { x: 18, y: 28 }, { x: 82, y: 22 }, { x: 50, y: 75 }, { x: 88, y: 70 },
  ];
  return (
    <div className={cls}>
      {positions.map((p, i) => (
        <div key={i} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          {[0, 1, 2].map((k) => (
            <motion.span
              key={k}
              className="absolute rounded-full border"
              style={{ borderColor: stroke, width: 20, height: 20, marginLeft: -10, marginTop: -10 }}
              animate={{ scale: [1, 6], opacity: [0.8, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: k * 1.2 }}
            />
          ))}
          <span className="absolute w-2 h-2 rounded-full" style={{ background: stroke, marginLeft: -4, marginTop: -4, boxShadow: `0 0 12px ${stroke}` }} />
        </div>
      ))}
    </div>
  );
}

// ---------- Matrix-like falling digits ----------
function Matrix({ dark, cls }) {
  const cols = 22;
  const arr = useMemo(() => Array.from({ length: cols }, (_, i) => ({
    left: (i * 100) / cols,
    delay: -Math.random() * 6,
    dur: 7 + Math.random() * 6,
    chars: Array.from({ length: 14 }, () => (Math.random() > 0.5 ? Math.floor(Math.random() * 10) : ["₹", "%", ".", "$"][Math.floor(Math.random() * 4)])),
  })), []);
  const col = dark ? "rgba(110,231,183,0.55)" : "rgba(63,179,111,0.30)";
  return (
    <div className={cls}>
      {arr.map((c, i) => (
        <motion.div
          key={i}
          className="absolute top-0 font-mono text-xs leading-tight whitespace-pre"
          style={{ left: `${c.left}%`, color: col }}
          animate={{ y: ["-30%", "120%"] }}
          transition={{ duration: c.dur, repeat: Infinity, ease: "linear", delay: c.delay }}
        >
          {c.chars.map((ch, k) => <div key={k}>{ch}</div>)}
        </motion.div>
      ))}
    </div>
  );
}

// ---------- Waveform / equalizer ----------
function Waveform({ dark, cls }) {
  return (
    <div className={`${cls} flex items-end justify-around`}>
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-t"
          style={{ background: i % 2 === 0 ? "#3FB36F" : "#1E63D5", opacity: dark ? 0.5 : 0.18 }}
          animate={{ height: ["20%", `${30 + (i * 7) % 60}%`, "20%"] }}
          transition={{ duration: 2 + (i % 5), repeat: Infinity, ease: "easeInOut", delay: -i * 0.05 }}
        />
      ))}
    </div>
  );
}

// ---------- Floating fractional ownership blocks ----------
function Blocks({ dark, cls }) {
  const blocks = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    l: (i * 6.2 + Math.random() * 4) % 96,
    t: (i * 9 + Math.random() * 8) % 92,
    size: 14 + Math.floor(Math.random() * 18),
    delay: -Math.random() * 10,
    duration: 9 + Math.random() * 10,
    green: Math.random() > 0.5,
  })), []);
  return (
    <div className={cls}>
      {blocks.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded"
          style={{
            left: `${b.l}%`,
            top: `${b.t}%`,
            width: b.size,
            height: b.size,
            background: b.green
              ? (dark ? "rgba(63,179,111,0.40)" : "rgba(63,179,111,0.18)")
              : (dark ? "rgba(110,231,183,0.30)" : "rgba(30,99,213,0.14)"),
            border: b.green
              ? "1px solid rgba(63,179,111,0.6)"
              : "1px solid rgba(30,99,213,0.4)",
          }}
          animate={{ rotate: [0, 90, 180, 270, 360], y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
        />
      ))}
    </div>
  );
}
