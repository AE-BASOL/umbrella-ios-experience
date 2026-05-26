// Widgets v3 — token-driven compact tiles, one per condition (rainy → heat).
// Backgrounds are *hand-tuned* bolder tints of bg-compact so each of the 8
// conditions reads as a distinct palette (especially the 4 cool-blue ones).
// Accent stays condition-accent; ink stays headline-compact; icons stay
// outlined 1.5px stroke; value type stays temp-display-compact.
// condition-accent is used in exactly one spot per tile.

const V3_FF_DISPLAY = "'SF Pro Display',-apple-system,system-ui,sans-serif";
const V3_FF_TEXT = "'SF Pro Text',-apple-system,system-ui,sans-serif";
const V3_FF_MONO = "'SF Mono',ui-monospace,Menlo,monospace";

// One canonical entry per condition slot — keeps tokens.json screen-map.
// bg / surf are bolder than tokens.json's bg-compact / surface-compact so the
// 4 cool-blue conditions can be told apart at a glance:
//   snowy   (palest, almost white-blue)
//   windy   (neutral cool gray)
//   rainy   (clean sky blue)
//   heavy-rain (deep stormy denim)
const V3_SLOTS = {
  "V2-01": {
    cond: "rainy", item: "umbrella", city: "İstanbul",
    bg: "#BFDAF3", surf: "#9CC2EA", ink: "#0C447C", accent: "#378ADC",
    value: "78", unit: "%", cap: "chance of rain",
    name: "Umbrella", rec: "Bring it",
    kind: "bar", barPct: 78
  },
  "V2-02": {
    cond: "sunny", item: "sunglasses", city: "İstanbul",
    bg: "#FFE3A8", surf: "#F9CE74", ink: "#63380A", accent: "#D8861A",
    value: "8", unit: " UV", cap: "uv index · 12–15h",
    name: "Sunglasses", rec: null,
    kind: "badge", badge: "UV 8"
  },
  "V2-03": {
    cond: "hot-beach", item: "sunscreen", city: "İstanbul",
    bg: "#FFD0AB", surf: "#F5AE7A", ink: "#6A2410", accent: "#D85E22",
    value: "UV 10", unit: "", cap: "reapply every 2h",
    name: "Sunscreen", rec: null,
    kind: "badge", badge: "UV 8"
  },
  "V2-04": {
    cond: "windy", item: "jacket", city: "İstanbul",
    bg: "#D6D9DF", surf: "#B2BAC8", ink: "#2A3548", accent: "#7990B0",
    value: "14", unit: "°", cap: "feels-like",
    name: "Light jacket", rec: "Layer up",
    kind: "rec"
  },
  "V2-05": {
    cond: "snowy", item: "coat", city: "İstanbul",
    bg: "#EAF1F9", surf: "#C6D4E8", ink: "#1A2C4C", accent: "#6E8AB8",
    value: "4", unit: "°", cap: "feels-like · gusty noon",
    name: "Heavy coat", rec: "Bundle up",
    kind: "rec"
  },
  "V2-06": {
    cond: "heavy-rain", item: "boots", city: "İstanbul",
    bg: "#A8C2E2", surf: "#7DA3CB", ink: "#0E2A48", accent: "#3D78B8",
    value: "86", unit: "%", cap: "wet pavement",
    name: "Waterproof boots", rec: "Lace up",
    kind: "bar", barPct: 86
  },
  "V2-07": {
    cond: "autumn", item: "hat", city: "İstanbul",
    bg: "#EBC9A1", surf: "#D9A872", ink: "#3A1C08", accent: "#B86A30",
    value: "3", unit: "°", cap: "feels-like low · windy",
    name: "Hat & beanie", rec: "Ears cold",
    kind: "rec"
  },
  "V2-08": {
    cond: "heat", item: "water", city: "İstanbul",
    bg: "#BAE2DC", surf: "#82C6BE", ink: "#0E3234", accent: "#2A9690",
    value: "28", unit: "°", cap: "feels-like high",
    name: "Extra water", rec: "1.5 L target",
    kind: "bar", barPct: 62
  }
};
const V3_ORDER = ["V2-01", "V2-02", "V2-03", "V2-04", "V2-05", "V2-06", "V2-07", "V2-08"];

// ─── Outlined icons — sizing controlled by caller, headline-compact color ──
// Stroke width scales: 1.5px @ 32 → 1.25px @ 56 → 1px @ 96 so heavier sizes
// don't read as chunky. Caller passes `size` in CSS px.
function V3Icon({ kind, color, size = 32 }) {
  const c = color || "currentColor";
  const sw = size >= 80 ? 1 : size >= 50 ? 1.25 : 1.5;
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: c, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (kind) {
    case "umbrella":return <svg {...p}>
      <path d="M12 2.5 C5.8 2.5 2.5 7.5 2.5 12 L21.5 12 C21.5 7.5 18.2 2.5 12 2.5 Z" />
      <path d="M12 2.5 L12 12" />
      <path d="M12 12 L12 19 Q12 21 10.2 21 Q8.4 21 8.4 19.2" />
    </svg>;
    case "sunglasses":return <svg {...p}>
      <ellipse cx="6.5" cy="14" rx="4.2" ry="3.6" />
      <ellipse cx="17.5" cy="14" rx="4.2" ry="3.6" />
      <path d="M10.5 12.8 L13.5 12.8" />
      <path d="M2.5 11.5 L4 11.5 M20 11.5 L21.5 11.5" />
    </svg>;
    case "sunscreen":return <svg {...p}>
      <rect x="8.5" y="3" width="7" height="2.5" rx="0.6" />
      <path d="M7.5 5.5 L16.5 5.5 L17 7.5 L17 20.5 Q17 21.5 16 21.5 L8 21.5 Q7 21.5 7 20.5 L7 7.5 Z" />
      <circle cx="12" cy="14" r="2" />
    </svg>;
    case "jacket":return <svg {...p}>
      <path d="M8 4.5 L12 7.5 L16 4.5 L20 6.5 L19 21 L14.5 21.5 L14.5 9 L12 9 L9.5 21.5 L5 21 L4 6.5 Z" />
      <path d="M12 9 L12 21.5" />
    </svg>;
    case "coat":return <svg {...p}>
      <path d="M8 4 L12 7 L16 4 L20 5.5 L21 22 L15 22 L15 9 L12 9 L9 22 L3 22 L4 5.5 Z" />
      <circle cx="13.6" cy="13" r="0.7" fill={c} stroke="none" />
      <circle cx="13.6" cy="16.5" r="0.7" fill={c} stroke="none" />
    </svg>;
    case "boots":return <svg {...p}>
      <path d="M6 3.5 L13 3.5 L13 14 L17 14 L17 19.5 Q17 20.5 16 20.5 L7 20.5 Q6 20.5 6 19.5 Z" />
      <path d="M5 19.5 L18 19.5 L18 21 Q18 21.5 17.5 21.5 L5.5 21.5 Q5 21.5 5 21 Z" />
      <path d="M8 7 L11 7" />
    </svg>;
    case "hat":return <svg {...p}>
      <path d="M7 14 Q7 6.5 12 6.5 Q17 6.5 17 14" />
      <ellipse cx="12" cy="16" rx="9" ry="2.2" />
      <path d="M7 13.5 L17 13.5" />
    </svg>;
    case "water":return <svg {...p}>
      <path d="M10 3 L14 3 L14 4.5 L15 5.5 L15 7.5 L9 7.5 L9 5.5 L10 4.5 Z" />
      <path d="M8 7.5 L16 7.5 L16 20.5 Q16 21.5 15 21.5 L9 21.5 Q8 21.5 8 20.5 Z" />
      <path d="M8 13 L16 13" />
    </svg>;
    default:return null;
  }
}

// Convert "#RRGGBB" + 0..1 alpha → "#RRGGBBAA" (8-digit hex). The styles.css
// widget rules consume CSS vars like --tertiary that need a translucent
// version of the accent.
function v3Alpha(hex, alpha) {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, "0");
  return `${hex}${a}`;
}

// Build the CSS variable bag that the v2 widget styles consume.
// All v2 visuals (`.widget .widget-card`, `.iw-bg-glyph`, `.widget-pct`,
// `.widget-grid-bar`, etc.) read these via var(--bg) / var(--accent) / etc.
// Setting them inline on the widget root beats the [data-state="…"] rules
// in the HTML so V3's bolder palette takes effect.
function v3PaletteStyle(s) {
  return {
    "--bg": s.bg,
    "--surface": s.surf,
    "--border": s.surf,
    "--headline": s.ink,
    "--accent": s.accent,
    "--tertiary": v3Alpha(s.accent, 0.65),
    "--bar-track": s.surf,
    "--bar-fill": s.accent,
    "--badge-bg": s.surf,
    "--badge-text": s.ink,
    "--icon-light": s.accent,
    "--icon-dark": s.ink
  };
}

// Map slot → bar-rec text (only used by `bar` slots)
function V3BarRecText(slot) {
  return slot === "V2-01" ? "Bring it" :
  slot === "V2-06" ? "Lace up" :
  "1.5 L target";
}

// fmtBlockValue helper — match v2's formatter (widgets.jsx defines its own
// but doesn't export it; duplicate here so V3 medium can use it).
function v3FmtBlockValue(b) {
  if (b.fmt === "pct") return `${b.value}%`;
  if (b.fmt === "deg") return `${b.value}°`;
  if (b.fmt === "kmh") return `${b.value}`;
  if (b.fmt === "cups") return `${b.value}/${b.max}`;
  return `${b.value}`;
}

// ─── Small tile — v2 layout, V3 palette ──────────────────────────────────
// Markup is a 1:1 clone of V2SmallWidget so it inherits the same `.widget`,
// `.iw-bg-glyph`, `.widget-small-content` styling from styles.css +
// item-widgets.css. Only the palette differs.
function V3Widget({ slot }) {
  const s = V3_SLOTS[slot];
  if (!s) return null;
  const cfg = window.ITEM_WIDGETS && window.ITEM_WIDGETS[s.item];
  if (!cfg) return null;
  return (
    <div className="widget small item-widget" data-state={s.item} style={v3PaletteStyle(s)}>
      <div className="widget-card">
        <div className="iw-bg-glyph">
          <AGlyph kind={cfg.glyph} size={120} />
        </div>
        <div className="widget-small-content iw-small">
          <div className="iw-small-top">
            <WidgetCityLabel name={s.city} />
            <span className="iw-small-name">{cfg.name}</span>
          </div>
          <div className="widget-small-bottom">
            <div className="widget-pct iw-val" style={{ height: "37px", gap: "1px", padding: "0px", margin: "0px" }}>
              {s.value}<span className="iw-unit">{s.unit}</span>
            </div>
            <div className="widget-cap" style={{ color: "var(--headline)", opacity: 0.7, fontSize: "9px", fontWeight: 500 }}>{s.cap}</div>
          </div>
        </div>
      </div>
    </div>);

}

// ─── Medium tile — v2 layout, V3 palette ─────────────────────────────────
// 1:1 clone of V2MediumWidget markup. Verdict / reason / pill / blocks pulled
// from ITEM_WIDGETS so all the v2 typography classes still resolve.
function V3MediumWidget({ slot }) {
  const s = V3_SLOTS[slot];
  if (!s) return null;
  const cfg = window.ITEM_WIDGETS && window.ITEM_WIDGETS[s.item];
  if (!cfg) return null;
  return (
    <div className="widget medium item-widget" data-state={s.item} style={v3PaletteStyle(s)}>
      <div className="widget-card">
        <div className="iw-bg-glyph medium">
          <AGlyph kind={cfg.glyph} size={150} />
        </div>
        <div className="widget-medium-content">
          <div className="widget-medium-head">
            <div>
              <WidgetCityLabel name={cfg.locationLong} />
              <div className="widget-verdict">{cfg.verdict}</div>
              <div className="widget-reason">{cfg.reason}</div>
            </div>
            <span className="widget-rain-pill">{cfg.pill}</span>
          </div>
          <div className="widget-grid">
            {cfg.blocks.map((b) => {
              const pct = Math.max(0, Math.min(100, b.value / b.max * 100));
              return (
                <div key={b.label} className="widget-grid-cell">
                  <div className="widget-grid-pct">{v3FmtBlockValue(b)}</div>
                  <div className="widget-grid-bar">
                    <div style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="widget-grid-lab">{b.label}</div>
                </div>);

            })}
          </div>
        </div>
      </div>
    </div>);

}

// ─── Home-screen plate — all 8 in situ ─────────────────────────────────────
function V3HomePlate() {
  return (
    <div style={{
      background: "linear-gradient(180deg, #38302A 0%, #261F19 100%)",
      borderRadius: 36, padding: "28px 22px 36px",
      boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
      display: "inline-block"
    }}>
      <div style={{ textAlign: "center", color: "#fff", marginBottom: 18, fontFamily: V3_FF_DISPLAY }}>
        <div style={{ fontSize: 48, fontWeight: 200, lineHeight: 1, letterSpacing: "-0.02em" }}>9:41</div>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, marginTop: 2 }}>Friday, April 26</div>
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 170px)", gap: 20, justifyContent: "center"
      }}>
        {V3_ORDER.map((k) => <ItemSmallWidget key={k} id={V3_SLOTS[k].item} smallNote={false} />)}
      </div>
    </div>);

}

// Home-screen plate variant — medium widget hero + 2 smalls below
function V3HomePlateMix({ heroSlot = "V2-01", smalls = ["V2-04", "V2-08"] }) {
  return (
    <div style={{
      background: "linear-gradient(180deg, #38302A 0%, #261F19 100%)",
      borderRadius: 36, padding: "28px 22px 36px",
      boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
      display: "inline-block"
    }}>
      <div style={{ textAlign: "center", color: "#fff", marginBottom: 18, fontFamily: V3_FF_DISPLAY }}>
        <div style={{ fontSize: 48, fontWeight: 200, lineHeight: 1, letterSpacing: "-0.02em" }}>9:41</div>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, marginTop: 2 }}>Friday, April 26</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
        <V3MediumWidget slot={heroSlot} />
        <div style={{ display: "flex", gap: 16 }}>
          {smalls.map((k) => <V3Widget key={k} slot={k} />)}
        </div>
      </div>
    </div>);

}

// ─── Index cell — widget + meta tag below ──────────────────────────────────
function V3IndexCell({ slot }) {
  const s = V3_SLOTS[slot];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <V3Widget slot={slot} />
      <div style={{
        fontFamily: V3_FF_MONO, fontSize: 10,
        color: "rgba(14,17,22,0.34)", letterSpacing: "0.08em", textTransform: "uppercase",
        textAlign: "center"
      }}>
        <b style={{ color: "#0E1116", fontWeight: 600 }}>{slot}</b> · {s.cond} · {s.bg} / {s.accent}
      </div>
    </div>);

}

function V3IndexBoard() {
  return (
    <div style={{
      background: "#FBFAF7", padding: "40px 36px", borderRadius: 14,
      border: "1px solid rgba(14,17,22,0.10)",
      display: "grid", gridTemplateColumns: "repeat(4, 170px)",
      gap: "32px 32px", justifyContent: "center"
    }}>
      {V3_ORDER.map((k) => <V3IndexCell key={k} slot={k} />)}
    </div>);

}

// Medium-widget index — all 8 mediums in a compact 2-column grid.
// No per-cell meta tag (the V3-Index small board already documents palettes).
function V3MediumIndexBoard() {
  return (
    <div style={{
      background: "#FBFAF7", padding: "24px", borderRadius: 14,
      border: "1px solid rgba(14,17,22,0.10)",
      display: "grid", gridTemplateColumns: "repeat(2, 360px)",
      gap: "14px 16px", justifyContent: "center"
    }}>
      {V3_ORDER.map((k) => <V3MediumWidget key={k} slot={k} />)}
    </div>);

}

// ─── Legacy "before" tile (cream) ──────────────────────────────────────────
function V3LegacyTile({ kind, value, cap, name, rec, badge }) {
  const ink = "#5A4622",muted = "#8C7748",bg = "#F4EBD9",surf = "#EBDCBE";
  return (
    <div style={{
      width: 168, height: 168, borderRadius: 22, padding: 16,
      background: bg, color: ink, fontFamily: V3_FF_TEXT,
      boxShadow: "0 1px 0 rgba(14,17,22,0.04), 0 8px 24px rgba(14,17,22,0.06)",
      display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
      boxSizing: "border-box"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 10, fontWeight: 600, color: muted, letterSpacing: "0.04em" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: muted }}></span>
          İstanbul
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", background: surf,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {kind === "umbrella" ?
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 3 C6 3 3 8 3 12 L21 12 C21 8 18 3 12 3 Z" fill={ink} />
              <path d="M12 12 L12 19 Q12 21 10 21" stroke={ink} strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg> :

          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <ellipse cx="6.5" cy="14" rx="4.2" ry="3.6" fill={ink} />
              <ellipse cx="17.5" cy="14" rx="4.2" ry="3.6" fill={ink} />
            </svg>
          }
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{
          fontFamily: V3_FF_TEXT, fontSize: 24, fontWeight: 700, lineHeight: 1.1, color: ink
        }}>{value}</div>
        <div style={{ marginTop: 2, fontSize: 10, fontWeight: 500, color: muted, letterSpacing: "0.02em" }}>{cap}</div>
      </div>
      <div style={{ marginTop: 10 }}>
        {kind === "umbrella" &&
        <div style={{ height: 4, borderRadius: 2, background: "rgba(140,119,72,0.20)", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "78%", background: ink, opacity: 0.6, borderRadius: 2 }}></div>
          </div>
        }
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: kind === "umbrella" ? 8 : 0 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: ink }}>{name}</span>
          {badge ?
          <span style={{
            display: "inline-flex", alignItems: "center", padding: "3px 7px",
            borderRadius: 999, background: "rgba(140,119,72,0.18)",
            color: ink, fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase"
          }}>{badge}</span> :

          <span style={{ fontSize: 11, fontWeight: 600, color: ink }}>{rec}</span>
          }
        </div>
      </div>
    </div>);

}

// ─── Before/After panel ───────────────────────────────────────────────────
function V3BeforeAfter({ slot, beforeKind, beforeProps, deltaTitle, beforeNotes, afterNotes, deltaNotes }) {
  const baCol = {
    background: "#FBFAF7", border: "1px solid rgba(14,17,22,0.10)", borderRadius: 14,
    padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 18
  };
  const head = {
    fontFamily: V3_FF_MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em",
    color: "rgba(14,17,22,0.62)", alignSelf: "stretch", display: "flex", justifyContent: "space-between"
  };
  const tag = (kind) => ({
    padding: "2px 6px", borderRadius: 3, fontWeight: 600,
    background: kind === "before" ? "rgba(192,57,43,0.12)" : "rgba(31,122,78,0.14)",
    color: kind === "before" ? "#993223" : "#1F7A4E"
  });
  const notes = {
    width: "100%", fontFamily: V3_FF_TEXT, fontSize: 12, lineHeight: 1.5,
    color: "rgba(14,17,22,0.62)"
  };
  const code = (txt) =>
  <code style={{ fontFamily: V3_FF_MONO, fontSize: 11, background: "rgba(14,17,22,0.05)",
    padding: "1px 4px", borderRadius: 3, color: "#0E1116" }}>{txt}</code>;

  const codeDark = (txt) =>
  <code style={{ fontFamily: V3_FF_MONO, fontSize: 11, background: "rgba(255,255,255,0.08)",
    padding: "1px 4px", borderRadius: 3, color: "#fff" }}>{txt}</code>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, alignItems: "start",
      fontFamily: V3_FF_TEXT, color: "#0E1116" }}>
      <div style={baCol}>
        <div style={head}><span>v1</span><span style={tag("before")}>BEFORE</span></div>
        <V3LegacyTile kind={beforeKind} {...beforeProps} />
        <div style={notes}>
          <ul style={{ margin: 0, paddingLeft: 16 }}>{beforeNotes.map((n, i) => <li key={i} style={{ marginBottom: 4 }}>{n(code)}</li>)}</ul>
        </div>
      </div>
      <div style={baCol}>
        <div style={head}><span>v2</span><span style={tag("after")}>AFTER</span></div>
        <V3Widget slot={slot} />
        <div style={notes}>
          <ul style={{ margin: 0, paddingLeft: 16 }}>{afterNotes.map((n, i) => <li key={i} style={{ marginBottom: 4 }}>{n(code)}</li>)}</ul>
        </div>
      </div>
      <div style={{ ...baCol, background: "#0E1116", color: "#fff", border: "none" }}>
        <h4 style={{ fontFamily: V3_FF_DISPLAY, fontSize: 13, fontWeight: 600, margin: 0, alignSelf: "flex-start", color: "#fff" }}>
          Delta
        </h4>
        <div style={{ ...head, color: "rgba(255,255,255,0.55)" }}>
          <span>tokens</span><span>v1 → v2</span>
        </div>
        <div style={{ ...notes, color: "rgba(255,255,255,0.75)" }}>
          <ul style={{ margin: 0, paddingLeft: 16 }}>{deltaNotes.map((n, i) => <li key={i} style={{ marginBottom: 4 }}>{n(codeDark)}</li>)}</ul>
        </div>
      </div>
    </div>);

}

function V3UmbrellaBA() {
  return (
    <V3BeforeAfter
      slot="V2-01"
      beforeKind="umbrella"
      beforeProps={{ value: "78%", cap: "chance of rain", name: "Umbrella", rec: "Bring it" }}
      beforeNotes={[
      (c) => <>Cream {c("#F4EBD9")} bg unrelated to Rainy dashboard.</>,
      (c) => <>Filled brown blob glyph — wrong icon family.</>,
      (c) => <>System-default 700 weight value — different typeface logic than dashboard.</>,
      (c) => <>Bar fill uses ink at 60% — no condition color signal.</>]
      }
      afterNotes={[
      (c) => <>BG · {c("condition.rainy.bg-compact #EDF4FB")} — light echo of dashboard {c("#0F1A33")}.</>,
      (c) => <>Icon · 32px outlined 1.5px stroke in {c("headline-compact #0C447C")}.</>,
      (c) => <>Value · {c("type.temp-display-compact")} · 24/500 · SF Pro Display.</>,
      (c) => <>Active bar + recommendation · {c("condition-accent #378ADC")} only.</>]
      }
      deltaNotes={[
      (c) => <>{c("bg")} · #F4EBD9 → {c("condition.rainy.bg-compact")} #EDF4FB</>,
      (c) => <>{c("ink")} · #5A4622 → {c("condition.rainy.headline-compact")} #0C447C</>,
      (c) => <>{c("icon")} · filled blob → outlined 32px from Icon System Spec</>,
      (c) => <>{c("value")} · SF Text 700 → {c("type.temp-display-compact")} · SF Display 500 · 24px</>,
      (c) => <>{c("accent")} · 60% ink → {c("condition.rainy.condition-accent")} #378ADC — bar fill + "Bring it" only</>,
      (c) => <>{c("layout")} · unchanged · same slot positions</>]
      } />);


}

function V3SunglassesBA() {
  return (
    <V3BeforeAfter
      slot="V2-02"
      beforeKind="sunglasses"
      beforeProps={{ value: "8 UV", cap: "uv index · 12–15h", name: "Sunglasses", badge: "UV 8" }}
      beforeNotes={[
      (c) => <>Same cream tone whether condition is rain, sun, snow or heat — palette tells the user nothing.</>,
      (c) => <>Filled solid lenses — different icon family from dashboard strip.</>,
      (c) => <>UV badge in ink-on-cream — no warning signal.</>]
      }
      afterNotes={[
      (c) => <>BG · {c("condition.sunny.bg-compact #FFF8EB")} — light echo of dashboard {c("#B85A12")}.</>,
      (c) => <>Icon · 32px outlined 1.5px stroke in {c("headline-compact #63380A")}.</>,
      (c) => <>UV 8 badge · pill fill {c("surface-compact #FFEDC8")}, text {c("condition-accent #D8861A")}.</>,
      (c) => <>Bar omitted — UV is a discrete level, not a percentage.</>]
      }
      deltaNotes={[
      (c) => <>{c("bg")} · #F4EBD9 → {c("condition.sunny.bg-compact")} #FFF8EB</>,
      (c) => <>{c("ink")} · #5A4622 → {c("condition.sunny.headline-compact")} #63380A</>,
      (c) => <>{c("icon")} · filled lenses → outlined sunglasses 32px from Icon System Spec</>,
      (c) => <>{c("value")} · SF Text 700 → {c("type.temp-display-compact")} · 24/500</>,
      (c) => <>{c("badge")} · ink-on-cream → {c("surface-compact")} fill + {c("condition-accent #D8861A")} text</>,
      (c) => <>{c("layout")} · unchanged · same slot positions</>]
      } />);


}

window.V3Widget = V3Widget;
window.V3MediumWidget = V3MediumWidget;
window.V3HomePlate = V3HomePlate;
window.V3HomePlateMix = V3HomePlateMix;
window.V3IndexBoard = V3IndexBoard;
window.V3MediumIndexBoard = V3MediumIndexBoard;
window.V3UmbrellaBA = V3UmbrellaBA;
window.V3SunglassesBA = V3SunglassesBA;
window.V3_SLOTS = V3_SLOTS;
window.V3_ORDER = V3_ORDER;