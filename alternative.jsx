// Alternative dashboard v3 — Apple-card map + 8-item monochrome advice grid.
//
// ─── ARCHITECTURE OVERVIEW (for coding agents) ──────────────────────────
//
//  AlternativeDashboard  (line ~1055)
//    props:
//      scenario       — key into window.SCENARIOS (from dashboard.jsx)
//                       e.g. "sc_coat", "rainy", "sc_umbrella"
//      detailMode     — "popup" | "sheet"  (how day-detail is shown)
//      presetDayIndex — number | null — force a specific day open on mount
//                       (0 = Today, 1 = Tue, … — useful for design artboards)
//      forceHeroItem  — overrides which item glyph lights up in the 2×4 grid
//                       e.g. "coat" ignores weather and always highlights coat
//
//  Data flow:
//    SCENARIOS dict → { state, temp, rainPct, verdict, reason, hourly, … }
//    buildAdvice()  → array of { glyph, title, sub } advice cards
//    NEXT_DAYS      → 6-day forecast rows (tappable → opens DayPopup/DaySheet)
//
//  Sub-components (top → bottom in rendered page):
//    ItemScene       — full-width SVG hero illustration keyed to forceHeroItem
//    HeroRow         — big temp + 2×4 item glyph grid (glow = active alert)
//    AdviceStrip     — horizontal scrollable advice pills
//    NextDaysList    — 6 tappable day rows, each showing state / high / low / rain
//    DayPopup        — centered modal card (detailMode="popup")
//    DaySheet        — full-height bottom sheet (detailMode="sheet")
//
//  DayPopup (line ~888) renders when selectedDay !== null && detailMode==="popup":
//    · glass backdrop with blur
//    · day name + weather state header
//    · sparkline temperature curve (SVG, built from day.hourly)
//    · rain/UV/wind stat pills
//    · "Bring" item chips (derived from active personal alerts)
//
//  To render popup open in a design artboard, pass presetDayIndex={N}:
//    <AlternativeDashboard scenario="sc_coat" forceHeroItem="coat"
//      detailMode="popup" presetDayIndex={0}/>
//
//  Palette system:
//    ITEM_SCENES  — per-item sky gradients, accent, glow, particle type
//    Dark UI uses #0e0f12 body / rgba(28,32,42,0.62) glass / #f0f3f8 ink
//    All colors are CSS strings, not CSS variables — the dark alt-app is
//    self-contained and does NOT inherit the rainy/sunny/neutral tokens from
//    styles.css. Override via ITEM_SCENES[item].accent etc.
//
// ────────────────────────────────────────────────────────────────────────

const ALT_FF = "-apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif";
const ALT_FM = "ui-monospace,'SF Mono',Menlo,Consolas,monospace";

// ═══ Item-themed hero scenes ═════════════════════════════════════════════
// One scene per of the 8 advice items, replacing the previous abstract map.
// Each is an original flat-SVG illustration. Color anchors:
//   · "umbrella" pulls from the rainy palette  (rgb(24,95,165) / rgb(55,138,221))
//   · sun-related items (shades, SPF, hat, water) derive from the sunny
//     palette  (rgb(186,117,23) / rgb(239,159,39))
//   · cool-weather items (jacket, coat, boots) shift toward deeper cool
//     blues. Each gets its own colour character.
// Style is consistent: gradient sky → ground band, theme particles, large
// item silhouette in the lower-right.
const ITEM_SCENES = {
  umbrella: {
    sky: ["#1A3358", "#0D1B2E"], ground: "#081220", accent: "#378ADC",
    glow: "#5C84B8", surface: "#153252", deep: "#081220",
    particle: "rain", caption: "Wet streets"
  },
  sunglasses: {
    sky: ["#D68A1A", "#5A3712"], ground: "#3A2210", accent: "#F3C562",
    glow: "#F0A93A", surface: "#5A3712", deep: "#3A2210",
    particle: "rays", caption: "Bright midday"
  },
  sunscreen: {
    sky: ["#C4582A", "#7C3A1A"], ground: "#5A2B16", accent: "#F3A060",
    glow: "#F6B35C", surface: "#7C3A1A", deep: "#5A2B16",
    particle: "rays", caption: "Sun bites"
  },
  jacket: {
    sky: ["#43536E", "#26303F"], ground: "#1C2430", accent: "#8AA0C0",
    glow: "#5A6472", surface: "#26303F", deep: "#1C2430",
    particle: "leaves", caption: "Cool layer"
  },
  coat: {
    sky: ["#2E406E", "#1F2C48"], ground: "#162238", accent: "#A4BCE4",
    glow: "#D8E6FF", surface: "#1F2C48", deep: "#162238",
    particle: "snow", caption: "Bundle up"
  },
  boots: {
    sky: ["#1F2E48", "#1B2A44"], ground: "#0D1727", accent: "#4A86C0",
    glow: "#5D8FC2", surface: "#1B2A44", deep: "#0D1727",
    particle: "puddle", caption: "Soaked ground"
  },
  hat: {
    sky: ["#7A3A18", "#4A2814"], ground: "#2B160D", accent: "#D4844A",
    glow: "#E0A06A", surface: "#4A2814", deep: "#2B160D",
    particle: "wind", caption: "Sharp wind"
  },
  water: {
    sky: ["#B87530", "#1D4A4C"], ground: "#12373A", accent: "#5EC0BC",
    glow: "#F0A24C", surface: "#1D4A4C", deep: "#12373A",
    particle: "heat", caption: "Heat haze"
  }
};

// Decide which item drives the hero scene given the day's fired set.
const HERO_PRIORITY = ["umbrella", "boots", "coat", "jacket", "sunscreen", "sunglasses", "water", "hat"];
function pickHeroItem(fired, fallbackState) {
  for (const id of HERO_PRIORITY) if (fired.has(id)) return id;
  if (fallbackState === "rainy") return "umbrella";
  if (fallbackState === "sunny") return "sunglasses";
  return "jacket";
}

// Atmospheric particles per scene type.
function SceneParticles({ kind, accent }) {
  if (kind === "rain") {
    const drops = [];
    for (let i = 0; i < 38; i++) {
      const x = (i * 23 + i % 3 * 7) % 390;
      const y = i * 17 % 180 + 10;
      drops.push(<line key={i} x1={x} y1={y} x2={x - 4} y2={y + 12}
      stroke="rgba(190,220,255,0.55)" strokeWidth="1.1" strokeLinecap="round" />);
    }
    return <g>{drops}</g>;
  }
  if (kind === "rays") {
    const rays = [];
    const cx = 320,cy = 80;
    for (let i = 0; i < 9; i++) {
      const ang = -Math.PI / 2 + (i - 4) * 0.18;
      const x2 = cx + Math.cos(ang) * 240;
      const y2 = cy + Math.sin(ang) * 240;
      rays.push(<line key={i} x1={cx} y1={cy} x2={x2} y2={y2}
      stroke={accent} strokeOpacity="0.18" strokeWidth="1.4" strokeLinecap="round" />);
    }
    return (
      <g>
        <circle cx={cx} cy={cy} r="46" fill={accent} fillOpacity="0.92" />
        <circle cx={cx} cy={cy} r="58" fill={accent} fillOpacity="0.22" />
        {rays}
      </g>);

  }
  if (kind === "snow") {
    const flakes = [];
    for (let i = 0; i < 32; i++) {
      const x = (i * 29 + i % 5 * 11) % 390;
      const y = i * 19 % 190 + 6;
      const r = 1.4 + i % 3 * 0.6;
      flakes.push(<circle key={i} cx={x} cy={y} r={r}
      fill="rgba(220,235,255,0.78)" />);
    }
    return <g>{flakes}</g>;
  }
  if (kind === "leaves") {
    const leaves = [];
    for (let i = 0; i < 14; i++) {
      const x = (i * 33 + i % 4 * 9) % 390;
      const y = i * 23 % 170 + 12;
      const r = i * 47 % 360;
      leaves.push(
        <path key={i} d="M 0 -4 q 4 2 4 6 q -4 0 -4 -6 z"
        fill="rgba(220,180,90,0.55)"
        transform={`translate(${x},${y}) rotate(${r})`} />
      );
    }
    return <g>{leaves}</g>;
  }
  if (kind === "wind") {
    const lines = [];
    for (let i = 0; i < 8; i++) {
      const y = 30 + i * 22 + i % 2 * 5;
      const x = 30 + i % 3 * 8;
      const w = 80 + i % 3 * 40;
      lines.push(<path key={i}
      d={`M ${x} ${y} q ${w / 2} -6 ${w} 0`}
      stroke="rgba(220,228,240,0.40)" strokeWidth="1.2"
      fill="none" strokeLinecap="round" />);
    }
    return <g>{lines}</g>;
  }
  if (kind === "puddle") {
    // ripples in the lower band
    const rings = [];
    [[100, 210], [260, 200], [180, 228]].forEach(([cx, cy], i) => {
      rings.push(
        <ellipse key={i + "a"} cx={cx} cy={cy} rx="38" ry="6" fill="none"
        stroke={accent} strokeOpacity="0.55" strokeWidth="1.2" />,
        <ellipse key={i + "b"} cx={cx} cy={cy} rx="22" ry="4" fill="none"
        stroke={accent} strokeOpacity="0.4" strokeWidth="1" />
      );
    });
    const drops = [];
    for (let i = 0; i < 18; i++) {
      const x = i * 27 % 390;
      const y = i * 13 % 130 + 16;
      drops.push(<line key={i} x1={x} y1={y} x2={x - 3} y2={y + 9}
      stroke="rgba(190,220,255,0.5)" strokeWidth="1" strokeLinecap="round" />);
    }
    return <g>{drops}{rings}</g>;
  }
  if (kind === "heat") {
    const waves = [];
    for (let i = 0; i < 5; i++) {
      const y = 40 + i * 28;
      const off = i % 2 ? 16 : 0;
      waves.push(
        <path key={i}
        d={`M ${-20 + off} ${y} q 40 -10 80 0 t 80 0 t 80 0 t 80 0 t 80 0`}
        stroke={accent} strokeOpacity={0.18 + i * 0.04} strokeWidth="1.2"
        fill="none" strokeLinecap="round" />
      );
    }
    return <g>{waves}</g>;
  }
  return null;
}

// Big stylised silhouette per item. Drawn flat in the scene's accent.
function SceneSilhouette({ item, accent }) {
  const tint = "rgba(245,250,255,0.94)";
  const dark = "rgba(15,17,24,0.35)";
  const cx = 280,cy = 195;
  switch (item) {
    case "umbrella":
      return (
        <g transform={`translate(${cx},${cy})`}>
          <path d="M -64 0 a 64 64 0 0 1 128 0 z" fill={tint} />
          <path d="M -48 0 q 0 -8 12 0 q 0 8 12 0 q 0 -8 12 0 q 0 8 12 0 q 0 -8 12 0 q 0 8 12 0"
          stroke={dark} strokeWidth="2" fill="none" strokeLinecap="round" />
          <line x1="0" y1="0" x2="0" y2="56" stroke={tint} strokeWidth="4" strokeLinecap="round" />
          <path d="M 0 56 q 0 12 12 12" stroke={tint} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>);

    case "sunglasses":
      return (
        <g transform={`translate(${cx},${cy}) scale(1.1)`}>
          <rect x="-58" y="-12" width="48" height="28" rx="14" fill={tint} />
          <rect x="10" y="-12" width="48" height="28" rx="14" fill={tint} />
          <line x1="-10" y1="0" x2="10" y2="0" stroke={tint} strokeWidth="4" strokeLinecap="round" />
          <rect x="-50" y="-4" width="32" height="12" rx="6" fill={dark} />
          <rect x="18" y="-4" width="32" height="12" rx="6" fill={dark} />
        </g>);

    case "sunscreen":
      return (
        <g transform={`translate(${cx},${cy})`}>
          <rect x="-22" y="-46" width="44" height="78" rx="10" fill={tint} />
          <rect x="-18" y="-58" width="36" height="16" rx="5" fill={accent} />
          <rect x="-16" y="-12" width="32" height="6" rx="2" fill={accent} />
          <text x="0" y="14" textAnchor="middle"
          fontFamily={ALT_FF} fontSize="14" fontWeight="800"
          fill={accent}>SPF</text>
          <text x="0" y="28" textAnchor="middle"
          fontFamily={ALT_FF} fontSize="11" fontWeight="700"
          fill={accent}>50</text>
        </g>);

    case "jacket":
      return (
        <g transform={`translate(${cx},${cy})`}>
          <path d="M -38 -42 l -14 12 l 0 64 l 28 0 l 0 -32 z" fill={tint} />
          <path d="M  38 -42 l  14 12 l 0 64 l -28 0 l 0 -32 z" fill={tint} />
          <path d="M -38 -42 l 38 12 l 38 -12" stroke={dark} strokeWidth="2.4" fill="none" />
          <line x1="0" y1="-30" x2="0" y2="34" stroke={dark} strokeWidth="2" />
          <circle cx="0" cy="-16" r="2" fill={accent} />
          <circle cx="0" cy="0" r="2" fill={accent} />
          <circle cx="0" cy="16" r="2" fill={accent} />
        </g>);

    case "coat":
      return (
        <g transform={`translate(${cx},${cy})`}>
          <path d="M -44 -50 l -14 18 l 0 80 l 32 0 l 0 -40 z" fill={tint} />
          <path d="M  44 -50 l  14 18 l 0 80 l -32 0 l 0 -40 z" fill={tint} />
          <path d="M -44 -50 l 44 16 l 44 -16" stroke={dark} strokeWidth="2.6" fill="none" />
          <line x1="0" y1="-34" x2="0" y2="48" stroke={dark} strokeWidth="2.4" />
          <circle cx="0" cy="-18" r="2.4" fill={accent} />
          <circle cx="0" cy="0" r="2.4" fill={accent} />
          <circle cx="0" cy="18" r="2.4" fill={accent} />
          <circle cx="0" cy="36" r="2.4" fill={accent} />
          <ellipse cx="-32" cy="44" rx="14" ry="2.4" fill={dark} />
          <ellipse cx="32" cy="44" rx="14" ry="2.4" fill={dark} />
        </g>);

    case "boots":
      return (
        <g transform={`translate(${cx},${cy + 10})`}>
          <path d="M -34 -54 l 20 0 l 0 46 l 14 0 l 0 14 l -34 0 z" fill={tint} />
          <path d="M  34 -54 l -20 0 l 0 46 l -14 0 l 0 14 l 34 0 z" fill={tint} />
          <line x1="-24" y1="-30" x2="-14" y2="-30" stroke={dark} strokeWidth="2" />
          <line x1="24" y1="-30" x2="14" y2="-30" stroke={dark} strokeWidth="2" />
          <ellipse cx="-17" cy="12" rx="22" ry="3.5" fill="rgba(0,0,0,0.4)" />
          <ellipse cx="17" cy="12" rx="22" ry="3.5" fill="rgba(0,0,0,0.4)" />
        </g>);

    case "hat":
      return (
        <g transform={`translate(${cx},${cy})`}>
          <ellipse cx="0" cy="6" rx="62" ry="8" fill={tint} />
          <path d="M -32 6 q 0 -56 32 -56 q 32 0 32 56 z" fill={tint} />
          <rect x="-34" y="-12" width="68" height="6" rx="2" fill={accent} />
        </g>);

    case "water":
      return (
        <g transform={`translate(${cx},${cy})`}>
          <rect x="-22" y="-44" width="44" height="68" rx="10" fill={tint} />
          <rect x="-12" y="-58" width="24" height="16" rx="4" fill={tint} />
          <rect x="-16" y="-44" width="32" height="8" rx="3" fill={accent} />
          <path d="M -16 -8 q 16 -10 32 0 l 0 22 l -32 0 z" fill={accent} />
        </g>);

    default:return null;
  }
}

// Image path map for static hero scenes
const SCENE_IMAGES = {
  umbrella: "assets/scene-umbrella.png",
  sunglasses: "assets/scene-sunglasses.png",
  sunscreen: "assets/scene-sunscreen.png",
  jacket: "assets/scene-jacket.png",
  coat: "assets/scene-coat.png",
  boots: "assets/scene-boots.png",
  hat: "assets/scene-hat.png",
  water: "assets/scene-water.png"
};

function ItemScene({ item }) {
  const p = ITEM_SCENES[item] || ITEM_SCENES.umbrella;
  const imgSrc = SCENE_IMAGES[item] || SCENE_IMAGES.umbrella;
  return (
    <div style={{
      width: "100%", height: "100%", position: "relative", overflow: "hidden",
      backgroundImage: `url('${imgSrc}')`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      {/* Bottom fade into the palette deep color */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: "40%",
        background: `linear-gradient(to bottom, transparent 0%, ${p.deep} 100%)`,
        pointerEvents: "none"
      }}></div>
    </div>);

}

// ═══ Item-grid logic ═════════════════════════════════════════════════════
// Which of the 8 everyday items "fires" today. Uses the same thresholds the
// dashboard uses elsewhere.
const ALT_ITEMS = [
{ id: "umbrella", label: "Umbrella" },
{ id: "sunglasses", label: "Shades" },
{ id: "sunscreen", label: "SPF" },
{ id: "jacket", label: "Jacket" },
{ id: "coat", label: "Coat" },
{ id: "boots", label: "Boots" },
{ id: "hat", label: "Hat" },
{ id: "water", label: "Water" }];


function fireForState(data) {
  const fired = new Set();
  if (!data || !data.hourly || !data.hourly.length) return fired;
  const max = (k) => Math.max(...data.hourly.map((h) => h[k] ?? 0));
  if (max("p") >= 40) fired.add("umbrella");
  if (max("p") >= 70) fired.add("boots");
  if (max("uv") >= 4) fired.add("sunglasses");
  if (max("uv") >= 6) fired.add("sunscreen");
  if ((data.feels ?? 99) <= 16) fired.add("jacket");
  if ((data.feels ?? 99) <= 6) fired.add("coat");
  if ((data.feels ?? 99) <= 6) fired.add("hat");
  if (max("t") >= 26) fired.add("water");
  return fired;
}

function AltItemCell({ id, label, on }) {
  return (
    <div style={{
      position: "relative",
      aspectRatio: "1 / 1",
      borderRadius: 14,
      background: on ?
      "color-mix(in oklab, var(--alt-accent, #f0f3f8) 14%, rgba(15,17,24,0.55))" :
      "color-mix(in oklab, var(--alt-surface, #1c2030) 25%, rgba(15,17,24,0.55))",
      border: on ?
      "0.5px solid color-mix(in oklab, var(--alt-accent, #f0f3f8) 22%, transparent)" :
      "0.5px solid rgba(255,255,255,0.04)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 3,
      boxShadow: on ?
      "inset 0 0 18px color-mix(in oklab, var(--alt-accent, #f0f3f8) 10%, transparent), 0 0 16px -2px color-mix(in oklab, var(--alt-accent, #f0f3f8) 18%, transparent)" :
      "none",
      transition: "all 220ms ease"
    }}>
      <div className={`alt-glyph ${on ? "on" : "off"}`}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        color: on ? "var(--alt-accent, #f0f3f8)" : "rgba(220,228,240,0.32)"
      }}>
        <AGlyph kind={id} size={22} />
      </div>
      <div style={{
        fontSize: 7.5, fontWeight: 600, letterSpacing: "0.15px",
        color: on ? "color-mix(in oklab, var(--alt-accent, #f0f3f8) 85%, white)" : "rgba(220,228,240,0.35)",
        fontFamily: ALT_FF,
        overflow: "hidden",
        whiteSpace: "normal",
        wordBreak: "break-word",
        lineHeight: 1.2,
        maxWidth: "calc(100% - 4px)",
        textAlign: "center",
        padding: "0 2px"
      }}>
        {label}
      </div>
      {on &&
      <span style={{
        position: "absolute", top: 6, right: 6,
        width: 6, height: 6, borderRadius: 9999,
        background: "var(--alt-accent, #f0f3f8)",
        boxShadow: "0 0 8px var(--alt-glow, rgba(240,243,248,0.85))"
      }}></span>
      }
    </div>);

}

function AltItemGrid({ fired }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gridTemplateRows: "repeat(2, 1fr)",
      gap: 8,
      flex: 1, margin: "0px"
    }}>
      {ALT_ITEMS.map((it) =>
      <AltItemCell key={it.id} id={it.id} label={it.label} on={fired.has(it.id)} />
      )}
    </div>);

}

// ═══ Day detail panel (See more) ═════════════════════════════════════════
// Shown when the user opens the "See more" toggle below the temperature.
// Contains:
//  · Hourly strip (24h-ish from the scenario) with glyph + temp + rain%
//  · Day stats grid (high / low / wind / UV / rain peak / humidity)
//  · Per-fired-item reasons — why each glowing item glowed.

function DayDetailGlyph({ kind, size = 20 }) {
  const s = size;
  if (kind === "rain") return (
    <svg viewBox="0 0 32 32" width={s} height={s} fill="none">
      <path d="M 6 18 a 5 5 0 0 1 4 -8 a 6 6 0 0 1 11 1 a 4 4 0 0 1 1 7 z" fill="#9fb1cc" stroke="#445576" strokeWidth="0.9" />
      <path d="M 11 22 l -1.4 4 M 16 22 l -1.4 4 M 21 22 l -1.4 4" stroke="#7aaefc" strokeWidth="1.8" strokeLinecap="round" />
    </svg>);

  if (kind === "cloud") return (
    <svg viewBox="0 0 32 32" width={s} height={s} fill="none">
      <path d="M 6 22 a 5 5 0 0 1 4 -8 a 6 6 0 0 1 11 1 a 4 4 0 0 1 1 7 z" fill="#cfd6e0" stroke="#5a6275" strokeWidth="0.9" />
    </svg>);

  if (kind === "moon-cloud") return (
    <svg viewBox="0 0 32 32" width={s} height={s} fill="none">
      <path d="M 21 6 a 6 6 0 1 0 5 8 a 7 7 0 0 1 -5 -8 z" fill="#f3d36b" stroke="#a47f1a" strokeWidth="0.9" />
      <path d="M 6 23 a 5 5 0 0 1 4 -8 a 6 6 0 0 1 11 1 a 4 4 0 0 1 1 7 z" fill="#cfd6e0" stroke="#5a6275" strokeWidth="0.9" />
    </svg>);

  return (
    <svg viewBox="0 0 32 32" width={s} height={s} fill="none">
      <circle cx="16" cy="16" r="6" fill="#f3a83a" stroke="#9b5a0d" strokeWidth="0.9" />
      <g stroke="#f3a83a" strokeWidth="1.6" strokeLinecap="round">
        <path d="M16 3 V 6" /><path d="M16 26 V 29" />
        <path d="M3 16 H 6" /><path d="M26 16 H 29" />
        <path d="M6.5 6.5 L 8.6 8.6" /><path d="M23.4 23.4 L 25.5 25.5" />
        <path d="M6.5 25.5 L 8.6 23.4" /><path d="M23.4 8.6 L 25.5 6.5" />
      </g>
    </svg>);

}
function pickDetGlyph(h) {
  const hh = parseInt(h.h, 10);
  const night = hh >= 20 || hh < 6;
  if ((h.p ?? 0) >= 50) return "rain";
  if ((h.p ?? 0) >= 20) return night ? "moon-cloud" : "cloud";
  if (night) return "moon-cloud";
  return (h.uv ?? 0) >= 4 ? "sun" : "cloud";
}

const FIRE_REASON = {
  umbrella: (d) => "Rain peaks at " + Math.max(...d.hourly.map((h) => h.p)) + "% this afternoon.",
  boots: (d) => "Heavy rain (" + Math.max(...d.hourly.map((h) => h.p)) + "%) — streets will be wet.",
  sunglasses: (d) => "UV climbs to " + Math.max(...d.hourly.map((h) => h.uv ?? 0)) + " around midday.",
  sunscreen: (d) => "Peak UV " + Math.max(...d.hourly.map((h) => h.uv ?? 0)) + " — protect skin.",
  jacket: (d) => "Feels like " + d.feels + "° — a layer helps.",
  coat: (d) => "Feels like " + d.feels + "° — full coat weather.",
  hat: (d) => "Feels like " + d.feels + "° — ears notice first.",
  water: (d) => "Highs near " + Math.max(...d.hourly.map((h) => h.t)) + "° — bring water."
};

function DayDetail({ data, fired }) {
  const hours = data.hourly || [];
  const maxRain = hours.length ? Math.max(...hours.map((h) => h.p ?? 0)) : 0;
  const peakRainHour = hours.length ?
  hours.reduce((a, b) => (b.p ?? 0) > (a.p ?? 0) ? b : a, hours[0]) :
  null;
  const stats = [
  { lab: "High", val: (data.high ?? "—") + "°" },
  { lab: "Low", val: (data.low ?? "—") + "°" },
  { lab: "Feels", val: (data.feels ?? "—") + "°" },
  { lab: "Wind", val: (data.wind ?? "—") + " km/h" },
  { lab: "UV peak", val: data.uv ?? "—" },
  { lab: "Rain peak", val: maxRain + "%" }];

  const firedList = ALT_ITEMS.filter((it) => fired.has(it.id));

  return (
    <div style={{
      padding: "0 14px 8px",
      animation: "alt-detail-in 280ms cubic-bezier(.2,.7,.2,1) both"
    }}>
      <div style={{
        padding: "16px 14px 14px",
        borderRadius: 20,
        background: "color-mix(in oklab, var(--alt-surface, #1c2030) 35%, rgba(15,17,24,0.62))",
        border: "0.5px solid color-mix(in oklab, var(--alt-accent, #378ADC) 8%, rgba(255,255,255,0.06))",
        display: "flex", flexDirection: "column", gap: 18
      }}>
        {/* ── Hourly strip ─────────────────────────────────────── */}
        <div>
          <div style={{
            display: "flex", alignItems: "baseline", justifyContent: "space-between",
            marginBottom: 10
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
              color: "color-mix(in oklab, var(--alt-accent, #dce4f0) 60%, #B8C7DA)",
              textTransform: "uppercase", fontFamily: ALT_FM
            }}>By the hour</div>
            {peakRainHour &&
            <div style={{
              fontSize: 10, fontWeight: 600,
              color: "rgba(220,228,240,0.45)", fontFamily: ALT_FM
            }}>peak {peakRainHour.h}:00 · {peakRainHour.p}%</div>
            }
          </div>
          <div style={{
            display: "flex", gap: 6, overflowX: "auto", overflowY: "hidden",
            paddingBottom: 4, scrollbarWidth: "none"
          }}>
            {hours.map((h, i) => {
              const isPeak = peakRainHour && h.h === peakRainHour.h;
              return (
                <div key={i} style={{
                  flexShrink: 0, minWidth: 54,
                  padding: "9px 4px 10px",
                  borderRadius: 13,
                  background: isPeak ? "rgba(122,174,252,0.18)" : "rgba(15,17,24,0.55)",
                  border: isPeak ? "0.5px solid rgba(122,174,252,0.35)" : "0.5px solid rgba(255,255,255,0.04)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 5
                }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(220,228,240,0.6)", fontFamily: ALT_FM }}>
                    {h.h}:00
                  </div>
                  <DayDetailGlyph kind={pickDetGlyph(h)} size={22} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f3f8", fontFamily: ALT_FM, letterSpacing: "-0.3px", lineHeight: 1 }}>
                    {h.t}°
                  </div>
                  <div style={{
                    fontSize: 9, fontWeight: 700,
                    color: (h.p ?? 0) >= 40 ? "#7aaefc" : "rgba(220,228,240,0.4)",
                    fontFamily: ALT_FM, letterSpacing: "0.2px"
                  }}>
                    {h.p ?? 0}%
                  </div>
                </div>);

            })}
          </div>
        </div>

        {/* ── Stats grid ───────────────────────────────────────── */}
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
            color: "rgba(220,228,240,0.65)",
            textTransform: "uppercase", fontFamily: ALT_FM,
            marginBottom: 10
          }}>The numbers</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {stats.map((s, i) =>
            <div key={i} style={{
              padding: "10px 12px",
              borderRadius: 12,
              background: "rgba(15,17,24,0.55)",
              border: "0.5px solid rgba(255,255,255,0.04)"
            }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(220,228,240,0.5)", fontFamily: ALT_FM, letterSpacing: "0.4px", textTransform: "uppercase" }}>
                  {s.lab}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f3f8", fontFamily: ALT_FM, letterSpacing: "-0.3px", marginTop: 3 }}>
                  {s.val}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Why-this-fired reasons ──────────────────────────── */}
        {firedList.length > 0 &&
        <div>
            <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
            color: "rgba(220,228,240,0.65)",
            textTransform: "uppercase", fontFamily: ALT_FM,
            marginBottom: 10
          }}>Why these glow</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {firedList.map((it) =>
            <div key={it.id} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "9px 10px",
              borderRadius: 12,
              background: "rgba(15,17,24,0.55)",
              border: "0.5px solid rgba(255,255,255,0.04)"
            }}>
                  <div className="alt-glyph on" style={{
                width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(240,243,248,0.08)"
              }}>
                    <AGlyph kind={it.id} size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#f0f3f8", letterSpacing: "-0.1px" }}>
                      {it.label}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(220,228,240,0.65)", marginTop: 2, lineHeight: 1.35 }}>
                      {FIRE_REASON[it.id] ? FIRE_REASON[it.id](data) : ""}
                    </div>
                  </div>
                </div>
            )}
            </div>
          </div>
        }
      </div>
    </div>);

}

// ═══ Next days — list ▸ full-screen day detail ═══════════════════════════
// Each row is a one-liner (day, date, glyph, high/low). Tapping a row opens
// a full-bleed day detail screen (DaySheet) — not an inline accordion.

function nextDayGlyph(d) {
  if (d.state === "rainy") return "rain";
  if (d.state === "sunny") return "sun";
  return "cloud";
}

// Generate a date label N days from today (e.g. "19 May").
const _MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function dateLabelOffset(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.getDate() + " " + _MONTHS[d.getMonth()];
}

function NextDayRow({ day, dateLabel, onOpen, isLast }) {
  const glyph = nextDayGlyph(day);
  return (
    <button onClick={onOpen} type="button" style={{
      width: "100%", border: "none", background: "transparent", cursor: "pointer",
      padding: "14px 18px",
      display: "grid",
      gridTemplateColumns: "1fr 36px 1fr 14px",
      alignItems: "center", gap: 14,
      textAlign: "left",
      fontFamily: ALT_FF, color: "#f0f3f8",
      borderBottom: isLast ? "none" : "0.5px solid rgba(255,255,255,0.05)"
    }}>
      <span style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
        <span style={{
          fontSize: 14, fontWeight: 700, color: "#f0f3f8",
          letterSpacing: "-0.1px"
        }}>{day.day}</span>
        <span style={{
          fontSize: 10.5, fontWeight: 500, color: "rgba(220,228,240,0.5)",
          fontFamily: ALT_FM, letterSpacing: "0.2px"
        }}>{dateLabel}</span>
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <DayDetailGlyph kind={glyph} size={24} />
      </span>
      <span style={{
        display: "inline-flex", alignItems: "baseline", justifyContent: "flex-end", gap: 8,
        fontFamily: ALT_FM, fontWeight: 700, letterSpacing: "-0.3px"
      }}>
        <span style={{ fontSize: 16, color: "#f0f3f8" }}>{day.high ?? "—"}°</span>
        <span style={{ fontSize: 13, color: "rgba(220,228,240,0.45)" }}>{day.low ?? "—"}°</span>
      </span>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
      stroke="rgba(220,228,240,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>);

}

function NextDaysList({ state, onPickDay }) {
  const days = window.WEEKLY_FORECAST && window.WEEKLY_FORECAST[state] ?
  window.WEEKLY_FORECAST[state].slice(1) :
  [];
  if (!days.length) return null;
  return (
    <div style={{ padding: "4px 14px 28px" }}>
      <div style={{
        padding: "4px 4px 10px",
        display: "flex", alignItems: "baseline", justifyContent: "space-between"
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
          color: "color-mix(in oklab, var(--alt-accent, #B8C7DA) 55%, #B8C7DA)",
          textTransform: "uppercase", fontFamily: ALT_FM
        }}>Next days</div>
        <div style={{
          fontSize: 10, fontWeight: 600, color: "color-mix(in oklab, var(--alt-glow, #B8C7DA) 40%, rgba(220,228,240,0.3))", fontFamily: ALT_FM
        }}>tap for detail</div>
      </div>
      <div style={{
        borderRadius: 18,
        background: "color-mix(in oklab, var(--alt-surface, #1c2030) 30%, rgba(15,17,24,0.55))",
        border: "0.5px solid color-mix(in oklab, var(--alt-accent, #378ADC) 6%, rgba(255,255,255,0.05))",
        overflow: "hidden"
      }}>
        {days.map((d, i) =>
        <NextDayRow key={d.day} day={d}
        dateLabel={dateLabelOffset(i + 1)}
        onOpen={() => onPickDay && onPickDay({ ...d, dateLabel: dateLabelOffset(i + 1), offset: i + 1 })}
        isLast={i === days.length - 1} />
        )}
      </div>
    </div>);

}

// ═══ Day sheet — full-bleed detail screen for a single upcoming day ══════
const DAY_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function fullDayLabel(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return DAY_OF_WEEK[d.getDay()] + ", " + d.getDate() + " " + _MONTHS[d.getMonth()];
}

function DaySheet({ day, onClose }) {
  if (!day) return null;
  const fired = (() => {
    const f = new Set();
    if (day.p >= 40) f.add("umbrella");
    if (day.p >= 70) f.add("boots");
    if ((day.uv ?? 0) >= 4) f.add("sunglasses");
    if ((day.uv ?? 0) >= 6) f.add("sunscreen");
    if ((day.low ?? 99) <= 12) f.add("jacket");
    if ((day.low ?? 99) <= 6) {f.add("coat");f.add("hat");}
    if ((day.high ?? 0) >= 26) f.add("water");
    return f;
  })();
  const peakIdx = day.hourly && day.hourly.length ?
  day.hourly.reduce((acc, p, i, arr) => p > arr[acc] ? i : acc, 0) :
  0;
  const peakLabel = [`00`, `03`, `06`, `09`, `12`, `15`, `18`, `21`][peakIdx] || "—";

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 10,
      background: "#0e0f12",
      color: "#f0f3f8", fontFamily: ALT_FF,
      overflowY: "auto", overflowX: "hidden",
      paddingTop: 54,
      animation: "alt-sheet-in 280ms cubic-bezier(.2,.7,.2,1) both"
    }}>
      {/* Top nav */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 14px 4px"
      }}>
        <button onClick={onClose} aria-label="Back" style={{
          width: 38, height: 38, borderRadius: 9999, border: "none", cursor: "pointer",
          background: "rgba(28,32,42,0.7)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          color: "#f0f3f8", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
          stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div style={{
          fontSize: 13, fontWeight: 700, letterSpacing: "-0.1px",
          color: "#f0f3f8"
        }}>
          {fullDayLabel(day.offset)}
        </div>
        <div style={{ width: 38 }}></div>
      </div>

      {/* Hero — day title + temps */}
      <div style={{ padding: "24px 18px 6px" }}>
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: "rgba(220,228,240,0.65)",
          letterSpacing: "-0.1px"
        }}>
          {day.headline}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginTop: 8 }}>
          <div style={{
            fontSize: 96, fontWeight: 700,
            lineHeight: 0.9, letterSpacing: "-5px",
            color: "#f0f3f8"
          }}>
            {day.high ?? "—"}<span style={{ fontSize: 46, letterSpacing: "-2px" }}>°</span>
          </div>
          <div style={{ paddingBottom: 8 }}>
            <DayDetailGlyph kind={nextDayGlyph(day)} size={56} />
            <div style={{
              fontSize: 11, fontWeight: 600, fontFamily: ALT_FM,
              color: "rgba(220,228,240,0.6)", marginTop: 4, letterSpacing: "0.2px"
            }}>
              low {day.low ?? "—"}°
            </div>
          </div>
        </div>
      </div>

      {/* Stat grid */}
      <div style={{ padding: "22px 18px 0" }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
          color: "rgba(220,228,240,0.55)",
          textTransform: "uppercase", fontFamily: ALT_FM,
          marginBottom: 10
        }}>The numbers</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
          { lab: "High", val: (day.high ?? "—") + "°" },
          { lab: "Low", val: (day.low ?? "—") + "°" },
          { lab: "Rain peak", val: day.p + "%" },
          { lab: "Peak hour", val: peakLabel + ":00" },
          { lab: "Wind", val: (day.wind ?? "—") + " km/h" },
          { lab: "UV", val: day.uv ?? "—" }].
          map((s, i) =>
          <div key={i} style={{
            padding: "12px 14px",
            borderRadius: 13,
            background: "rgba(28,32,42,0.62)",
            border: "0.5px solid rgba(255,255,255,0.05)"
          }}>
              <div style={{
              fontSize: 9, fontWeight: 700, fontFamily: ALT_FM,
              color: "rgba(220,228,240,0.5)",
              letterSpacing: "0.4px", textTransform: "uppercase"
            }}>{s.lab}</div>
              <div style={{
              fontSize: 18, fontWeight: 700, fontFamily: ALT_FM,
              color: "#f0f3f8", letterSpacing: "-0.4px", marginTop: 3
            }}>{s.val}</div>
            </div>
          )}
        </div>
      </div>

      {/* Rain by hour bar chart */}
      {day.hourly && day.hourly.length > 0 &&
      <div style={{ padding: "22px 18px 0" }}>
          <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
          color: "rgba(220,228,240,0.55)",
          textTransform: "uppercase", fontFamily: ALT_FM,
          marginBottom: 10
        }}>Rain by hour</div>
          <div style={{
          padding: "14px 14px 10px",
          borderRadius: 14,
          background: "rgba(28,32,42,0.62)",
          border: "0.5px solid rgba(255,255,255,0.05)"
        }}>
            <div style={{
            display: "flex", alignItems: "flex-end", gap: 5,
            height: 60
          }}>
              {day.hourly.map((p, hi) =>
            <div key={hi} style={{
              flex: 1, height: `${Math.max(8, p)}%`,
              background: p >= 40 ? "rgba(122,174,252,0.78)" : "rgba(220,228,240,0.18)",
              borderRadius: 3, minHeight: 3
            }}></div>
            )}
            </div>
            <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: 9, fontWeight: 600, fontFamily: ALT_FM,
            color: "rgba(220,228,240,0.4)",
            marginTop: 6, letterSpacing: "0.3px"
          }}>
              <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
            </div>
          </div>
        </div>
      }

      {/* Things to bring — 2×4 grid same as hero */}
      <div style={{ padding: "22px 18px 28px" }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
          color: "rgba(220,228,240,0.55)",
          textTransform: "uppercase", fontFamily: ALT_FM,
          marginBottom: 10
        }}>What to bring</div>
        <AltItemGrid fired={fired} />
      </div>
    </div>);

}

// ═══ Day POPUP — centered modal variant (alternative to DaySheet) ════════
// Same data as DaySheet but rendered as a compact centered card with a
// backdrop. Used by the popup-mode variant.
function DayPopup({ day, onClose }) {
  if (!day) return null;
  const fired = (() => {
    const f = new Set();
    if (day.p >= 40) f.add("umbrella");
    if (day.p >= 70) f.add("boots");
    if ((day.uv ?? 0) >= 4) f.add("sunglasses");
    if ((day.uv ?? 0) >= 6) f.add("sunscreen");
    if ((day.low ?? 99) <= 12) f.add("jacket");
    if ((day.low ?? 99) <= 6) {f.add("coat");f.add("hat");}
    if ((day.high ?? 0) >= 26) f.add("water");
    return f;
  })();
  const peakIdx = day.hourly && day.hourly.length ?
  day.hourly.reduce((acc, p, i, arr) => p > arr[acc] ? i : acc, 0) :
  0;
  const peakLabel = [`00`, `03`, `06`, `09`, `12`, `15`, `18`, `21`][peakIdx] || "—";

  return (
    <>
      {/* backdrop */}
      <div onClick={onClose} style={{
        position: "absolute", inset: 0, zIndex: 9,
        background: "rgba(8,10,14,0.55)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        animation: "alt-backdrop-in 220ms ease both"
      }}></div>
      {/* card */}
      <div style={{
        position: "absolute", zIndex: 10,
        left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        width: "calc(100% - 28px)", maxWidth: 340,
        maxHeight: "82%", overflowY: "auto",
        borderRadius: 24,
        background: "rgba(20,22,28,0.96)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.6), inset 0 0 0 0.5px rgba(255,255,255,0.04)",
        color: "#f0f3f8", fontFamily: ALT_FF,
        animation: "alt-popup-in 260ms cubic-bezier(.2,.7,.2,1) both"
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px 10px",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="assets/Logo.png" alt="UmbrellaToday" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <div style={{
                fontSize: 14, fontWeight: 700, color: "#f0f3f8",
                letterSpacing: "-0.1px"
              }}>{DAY_OF_WEEK[(new Date().getDay() + day.offset) % 7]}</div>
              <div style={{
                fontSize: 11, fontWeight: 600, color: "rgba(220,228,240,0.55)",
                fontFamily: ALT_FM, letterSpacing: "0.2px"
              }}>{day.dateLabel}</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 30, height: 30, borderRadius: 9999, border: "none", cursor: "pointer",
            background: "rgba(28,32,42,0.7)",
            color: "#f0f3f8",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
            stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Hero — temp + glyph */}
        <div style={{ padding: "14px 16px 4px", display: "flex", alignItems: "flex-end", gap: 12 }}>
          <div style={{
            fontSize: 64, fontWeight: 700, lineHeight: 0.9, letterSpacing: "-3px",
            color: "#f0f3f8"
          }}>
            {day.high ?? "—"}<span style={{ fontSize: 30, letterSpacing: "-1px" }}>°</span>
          </div>
          <div style={{ paddingBottom: 6, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
            <DayDetailGlyph kind={nextDayGlyph(day)} size={36} />
            <div style={{ fontSize: 10, fontWeight: 600, fontFamily: ALT_FM, color: "rgba(220,228,240,0.6)", letterSpacing: "0.2px" }}>
              low {day.low ?? "—"}°
            </div>
          </div>
        </div>

        {/* headline */}
        <div style={{ padding: "6px 16px 14px" }}>
          <div style={{
            fontSize: 12.5, fontWeight: 600, color: "rgba(220,228,240,0.78)",
            letterSpacing: "-0.05px", lineHeight: 1.4
          }}>{day.headline}</div>
        </div>

        {/* mini stats — 3×2 */}
        <div style={{ padding: "0 16px 14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {[
            { lab: "Rain", val: day.p + "%" },
            { lab: "Peak", val: peakLabel + ":00" },
            { lab: "Wind", val: (day.wind ?? "—") + " km/h" },
            { lab: "UV", val: day.uv ?? "—" },
            { lab: "High", val: (day.high ?? "—") + "°" },
            { lab: "Low", val: (day.low ?? "—") + "°" }].
            map((s, i) =>
            <div key={i} style={{
              padding: "8px 10px",
              borderRadius: 10,
              background: "rgba(15,17,24,0.75)",
              border: "0.5px solid rgba(255,255,255,0.04)"
            }}>
                <div style={{ fontSize: 8.5, fontWeight: 700, fontFamily: ALT_FM, color: "rgba(220,228,240,0.5)", letterSpacing: "0.4px", textTransform: "uppercase" }}>{s.lab}</div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: ALT_FM, color: "#f0f3f8", letterSpacing: "-0.3px", marginTop: 1 }}>{s.val}</div>
              </div>
            )}
          </div>
        </div>

        {/* rain by hour */}
        {day.hourly && day.hourly.length > 0 &&
        <div style={{ padding: "4px 16px 14px" }}>
            <div style={{
            fontSize: 9, fontWeight: 700, fontFamily: ALT_FM,
            color: "rgba(220,228,240,0.5)", letterSpacing: "0.5px",
            textTransform: "uppercase", marginBottom: 6
          }}>Rain by hour</div>
            <div style={{
            padding: "10px 12px 8px",
            borderRadius: 11,
            background: "rgba(15,17,24,0.75)",
            border: "0.5px solid rgba(255,255,255,0.04)"
          }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 40 }}>
                {day.hourly.map((p, hi) =>
              <div key={hi} style={{
                flex: 1, height: `${Math.max(8, p)}%`,
                background: p >= 40 ? "rgba(122,174,252,0.78)" : "rgba(220,228,240,0.18)",
                borderRadius: 2, minHeight: 3
              }}></div>
              )}
              </div>
              <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: 8.5, fontWeight: 600, fontFamily: ALT_FM,
              color: "rgba(220,228,240,0.4)", marginTop: 4
            }}>
                <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
              </div>
            </div>
          </div>
        }

        {/* what to bring */}
        <div style={{ padding: "0 16px 18px" }}>
          <div style={{
            fontSize: 9, fontWeight: 700, fontFamily: ALT_FM,
            color: "rgba(220,228,240,0.5)", letterSpacing: "0.5px",
            textTransform: "uppercase", marginBottom: 8
          }}>What to bring</div>
          <AltItemGrid fired={fired} />
        </div>
      </div>
    </>);

}

function TodayRightColumn({ palette, fired }) {
  const now = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "stretch", gap: 8 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0, paddingRight: 2 }}>
        <div style={{
          fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1,
          color: "#f0f3f8", fontFamily: ALT_FF, textTransform: "uppercase"
        }}>TODAY</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: `color-mix(in oklab, ${palette.accent} 90%, #fff)`,
            fontFamily: ALT_FF, letterSpacing: "0.04em"
          }}>{days[now.getDay()]}</span>
          <span style={{
            fontSize: 10, fontWeight: 600,
            color: "rgba(220,228,240,0.5)",
            fontFamily: "ui-monospace,'SF Mono',Menlo,monospace",
            letterSpacing: "0.05em",
            padding: "2px 6px", borderRadius: 5,
            background: "rgba(255,255,255,0.06)",
            border: "0.5px solid rgba(255,255,255,0.09)"
          }}>{dd}/{mm}/{yy}</span>
        </div>
      </div>
      <AltItemGrid fired={fired} />
    </div>);

}

// ═══ Main alternative dashboard ═══════════════════════════════════════════
function AlternativeDashboard({ scenario = "rainy", detailMode = "sheet", presetDayIndex = null, forceHeroItem = null, todayMode = false }) {
  const data = window.SCENARIOS ? window.SCENARIOS[scenario] : null;
  const [open, setOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState(() => {
    if (presetDayIndex == null) return null;
    const days = window.WEEKLY_FORECAST && window.WEEKLY_FORECAST[scenario] ?
    window.WEEKLY_FORECAST[scenario].slice(1) : [];
    const d = days[presetDayIndex];
    if (!d) return null;
    return { ...d, dateLabel: dateLabelOffset(presetDayIndex + 1), offset: presetDayIndex + 1 };
  });
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  if (!data) return null;
  const fired = fireForState(data);
  const heroItem = forceHeroItem || pickHeroItem(fired, data.state);
  const heroSceneCaption = (ITEM_SCENES[heroItem] || {}).caption;
  const palette = ITEM_SCENES[heroItem] || ITEM_SCENES.umbrella;

  return (
    <div className={`alt-shell state-${data.state}`}
    style={{
      '--alt-bg': palette.deep,
      '--alt-accent': palette.accent,
      '--alt-glow': palette.glow,
      '--alt-surface': palette.surface,
      '--alt-deep': palette.deep,
      width: "100%", height: "100%",
      background: "var(--alt-bg)",
      color: "#F7FAFF",
      fontFamily: ALT_FF,
      paddingTop: 0,
      overflowY: "auto",
      overflowX: "hidden",
      position: "relative"
    }}>

      {/* ── Map header — full-bleed, square top, curved bottom ─────────── */}
      <div style={{
        position: "relative",
        height: 280,
        borderRadius: "0 0 32px 32px",
        overflow: "hidden",
        boxShadow: "0 14px 28px -8px rgba(0,0,0,0.45)"
      }}>
        <ItemScene item={heroItem} />
        {/* gear top-left — below iOS status bar */}
        <button aria-label="Settings" onClick={() => setSettingsOpen(true)} style={{
          position: "absolute", top: 64, left: 14, zIndex: 2,
          width: 38, height: 38, borderRadius: 9999, border: "none", cursor: "pointer",
          background: "rgba(15,17,24,0.72)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          color: "#f0f3f8", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(0,0,0,0.32)"
        }}>
          <Icon.Gear size={16} color="currentColor" />
        </button>
        {/* location pill top-right */}
        <div style={{
          position: "absolute", top: 66, right: 14, zIndex: 2,
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "7px 11px", borderRadius: 9999,
          background: "rgba(15,17,24,0.62)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          fontFamily: ALT_FF, fontSize: 11, fontWeight: 600,
          color: "#f0f3f8", letterSpacing: "-0.05px",
          maxWidth: 220
        }}>
          <svg viewBox="0 0 24 24" width="11" height="11" fill="#f0f3f8" style={{ flexShrink: 0 }}>
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
            </svg>
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {data.location || "Beşiktaş, İstanbul"}
            </span>
          </div>
      </div>

      {/* ── Hero row: big temp LEFT + 2×4 item grid RIGHT ──────────────── */}
      <div style={{ padding: "22px 16px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flexShrink: 0, width: 112 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: "var(--alt-glow, rgba(220,228,240,0.65))",
            fontFamily: ALT_FF, letterSpacing: "-0.1px",
            marginBottom: 2
          }}>
            {data.state === "rainy" ? "Partly cloudy" :
            data.state === "sunny" ? "Clear skies" :
            "Updating…"}
          </div>
          <div style={{
            fontSize: 88, fontWeight: 700,
            lineHeight: 0.9, letterSpacing: "-4px",
            color: "#F7FAFF", fontFamily: ALT_FF
          }}>
            {data.temp ?? "--"}<span style={{ fontSize: 42, letterSpacing: "-1.5px" }}>°</span>
          </div>
          <div style={{
            fontSize: 12, fontWeight: 600, color: "color-mix(in oklab, var(--alt-glow, #B8C7DA) 55%, #B8C7DA)",
            fontFamily: ALT_FF, letterSpacing: "-0.05px",
            marginTop: 6
          }}>
            Feels like {data.feels ?? "—"}°
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            style={{
              marginTop: 10,
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: 0,
              border: "none",
              background: "transparent",
              color: "var(--alt-accent, rgba(220,228,240,0.78))",
              fontFamily: ALT_FF, fontSize: 12, fontWeight: 600, letterSpacing: "-0.05px",
              cursor: "pointer"
            }}>
            <span style={{ borderBottom: "0.5px solid color-mix(in oklab, var(--alt-accent, #dce4f0) 40%, transparent)", paddingBottom: 1 }}>See more</span>
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none"
            stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            style={{ opacity: 0.7, transition: "transform 220ms ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
        {todayMode ?
        <TodayRightColumn palette={ITEM_SCENES[forceHeroItem || "umbrella"] || ITEM_SCENES.umbrella} fired={fired} /> :
        <AltItemGrid fired={fired} />}
      </div>
      {open && <DayDetail data={data} fired={fired} />}

      {/* ── Next days — accordion list ─────────────────────────────── */}
      <NextDaysList state={data.state} onPickDay={setSelectedDay} />

      {/* ── Day detail — sheet (full-screen) or popup (modal) variant ── */}
      {selectedDay && detailMode === "popup" &&
      <DayPopup day={selectedDay} onClose={() => setSelectedDay(null)} />
      }
      {selectedDay && detailMode !== "popup" &&
      <DaySheet day={selectedDay} onClose={() => setSelectedDay(null)} />
      }

      {/* ── Settings — opens when gear is tapped ─────────────────────── */}
      {settingsOpen &&
      <div style={{
        position: "absolute", inset: 0, zIndex: 30,
        animation: "alt-sheet-in 280ms cubic-bezier(.2,.7,.2,1) both"
      }}>
          <AltSettingsMain onBack={() => setSettingsOpen(false)} />
        </div>
      }
    </div>);

}

window.AlternativeDashboard = AlternativeDashboard;
window.DayPopup = DayPopup;w i n d o w . I T E M _ S C E N E S   =   I T E M _ S C E N E S ;  
 w i n d o w . p i c k H e r o I t e m   =   p i c k H e r o I t e m ;  
 w i n d o w . f i r e F o r S t a t e   =   f i r e F o r S t a t e ;  
 w i n d o w . I t e m S c e n e   =   I t e m S c e n e ;  
 