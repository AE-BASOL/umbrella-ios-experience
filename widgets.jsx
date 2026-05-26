// Widgets — small, medium, lock-screen variants per UmbrellaTodayWidget Swift sources.
//
// Original weather widgets (SmallWidget / MediumWidget) are kept untouched.
// Below them: a single generic ItemWidget component + ITEM_WIDGETS data registry
// so every "Things to bring" personal alert (umbrella, sunglasses, jacket,
// coat, sunscreen, water, wind, boots, mask, hat) gets its own Small + Medium
// widget without copy-pasting per item.

function WidgetCityLabel({ name }) {
  return (
    <div className="city-label" style={{ fontSize: 9 }}>
      <span className="dot" style={{ width: 5, height: 5 }}></span>
      <span>{name}</span>
    </div>);

}

// ─── Small (weather) ────────────────────────────────────
function SmallWidget({ scenario = "rainy", location = "İstanbul", rainPct = 78 }) {
  const SC = window.SCENARIOS[scenario];
  return (
    <div className="widget small" data-state={SC.state}>
      <div className="widget-card">
        <div className="widget-icon-bg" style={{ opacity: 0.5 }}>
          <WeatherIcon state={SC.state} size={88} />
        </div>
        <div className="widget-small-content">
          <div className="widget-small-top">
            <WidgetCityLabel name={location} />
          </div>
          <div className="widget-small-bottom">
            <div className="widget-pct">{rainPct}%</div>
            <div className="widget-cap">chance of rain</div>
          </div>
        </div>
      </div>
    </div>);

}

// ─── Medium (weather) ───────────────────────────────────
function MediumWidget({ scenario = "rainy", location = "İstanbul, Beşiktaş" }) {
  const SC = window.SCENARIOS[scenario];
  const blocks = (() => {
    if (Array.isArray(SC.blocks)) return SC.blocks;
    const ranges = [
    ["00–06", 0, 6], ["06–12", 6, 12],
    ["12–18", 12, 18], ["18–00", 18, 24]];

    return ranges.map(([label, lo, hi]) => {
      const pcts = (SC.hourly || []).
      filter((h) => {const n = parseInt(h.h, 10);return n >= lo && n < hi;}).
      map((h) => h.p);
      return { label, pct: pcts.length ? Math.max(...pcts) : 0 };
    });
  })();
  return (
    <div className="widget medium" data-state={SC.state}>
      <div className="widget-card">
        <div className="widget-icon-bg medium" style={{ opacity: 0.12 }}>
          <WeatherIcon state={SC.state} size={130} />
        </div>
        <div className="widget-medium-content">
          <div className="widget-medium-head">
            <div>
              <WidgetCityLabel name={location} />
              <div className="widget-verdict">{SC.verdict}</div>
              <div className="widget-reason">{SC.reason}</div>
            </div>
            <span className="widget-rain-pill">{SC.rainPct}%</span>
          </div>
          <div className="widget-grid">
            {blocks.map((b) =>
            <div key={b.label} className="widget-grid-cell">
                <div className="widget-grid-pct">{b.pct}%</div>
                <div className="widget-grid-bar">
                  <div style={{ width: `${b.pct}%` }}></div>
                </div>
                <div className="widget-grid-lab">{b.label}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>);

}

// ─── Per-item widget registry ───────────────────────────
// Each entry drives both Small and Medium variants. The `state` token chooses
// the surface palette (rainy / sunny / neutral) so colors stay consistent with
// the rest of the app. `glyph` matches AGlyph kinds (defined in drawer.jsx).
//
// For Small: value + cap render large; smallNote is an optional one-liner.
// For Medium: verdict + reason + pill render top, blocks render below.
//   Each block: { label, value, max }. The bar fills value/max.

const ITEM_WIDGETS = {
  umbrella: {
    name: "Umbrella",
    glyph: "umbrella",
    state: "rainy",
    location: "İstanbul",
    locationLong: "İstanbul, Beşiktaş",
    value: "78", valueUnit: "%", cap: "chance of rain",
    smallNote: "Bring it",
    verdict: "Take an umbrella",
    reason: "Steady showers between 14:00 and 18:00.",
    pill: "78%",
    blocks: [
    { label: "00–06", value: 12, max: 100, fmt: "pct" },
    { label: "06–12", value: 42, max: 100, fmt: "pct" },
    { label: "12–18", value: 78, max: 100, fmt: "pct" },
    { label: "18–00", value: 28, max: 100, fmt: "pct" }]

  },
  sunglasses: {
    name: "Sunglasses",
    glyph: "sunglasses",
    state: "sunny",
    location: "İstanbul",
    locationLong: "İstanbul, Beşiktaş",
    value: "8", valueUnit: " UV", cap: "uv index",
    smallNote: "Bright today",
    verdict: "Glasses on",
    reason: "UV climbs to 8 between 12:00 and 15:00.",
    pill: "UV 8",
    blocks: [
    { label: "10:00", value: 5, max: 11, fmt: "raw" },
    { label: "12:00", value: 8, max: 11, fmt: "raw" },
    { label: "14:00", value: 8, max: 11, fmt: "raw" },
    { label: "16:00", value: 6, max: 11, fmt: "raw" }]

  },
  jacket: {
    name: "Light jacket",
    glyph: "jacket",
    state: "neutral",
    location: "İstanbul",
    locationLong: "İstanbul, Beşiktaş",
    value: "14", valueUnit: "°", cap: "feels-like",
    smallNote: "Layer up",
    verdict: "A light jacket",
    reason: "Cool morning, mild by late afternoon.",
    pill: "feels 14°",
    blocks: [
    { label: "07:00", value: 11, max: 25, fmt: "deg" },
    { label: "12:00", value: 16, max: 25, fmt: "deg" },
    { label: "17:00", value: 18, max: 25, fmt: "deg" },
    { label: "21:00", value: 13, max: 25, fmt: "deg" }]

  },
  coat: {
    name: "Heavy coat",
    glyph: "coat",
    state: "neutral",
    location: "İstanbul",
    locationLong: "İstanbul, Beşiktaş",
    value: "4", valueUnit: "°", cap: "feels-like",
    smallNote: "Bundle up",
    verdict: "Heavy coat day",
    reason: "Sub-6° through the morning, gusts at noon.",
    pill: "feels 4°",
    blocks: [
    { label: "07:00", value: 2, max: 15, fmt: "deg" },
    { label: "12:00", value: 6, max: 15, fmt: "deg" },
    { label: "17:00", value: 5, max: 15, fmt: "deg" },
    { label: "21:00", value: 3, max: 15, fmt: "deg" }]

  },
  sunscreen: {
    name: "Sunscreen",
    glyph: "sunscreen",
    state: "sunny",
    location: "İstanbul",
    locationLong: "İstanbul, Beşiktaş",
    value: "8", valueUnit: " UV", cap: "exposure peak",
    smallNote: "Reapply 2h",
    verdict: "Apply SPF 30+",
    reason: "UV peaks 12:00–15:00. Reapply every two hours.",
    pill: "UV 8",
    blocks: [
    { label: "10:00", value: 5, max: 11, fmt: "raw" },
    { label: "12:00", value: 8, max: 11, fmt: "raw" },
    { label: "14:00", value: 8, max: 11, fmt: "raw" },
    { label: "16:00", value: 6, max: 11, fmt: "raw" }]

  },
  water: {
    name: "Extra water",
    glyph: "water",
    state: "sunny",
    location: "İstanbul",
    locationLong: "İstanbul, Beşiktaş",
    value: "28", valueUnit: "°", cap: "feels-like high",
    smallNote: "Hydrate",
    verdict: "Carry water",
    reason: "Hot and dry — sip every hour, top up at lunch.",
    pill: "1.5 L",
    blocks: [
    { label: "Morning", value: 1, max: 4, fmt: "cups" },
    { label: "Noon", value: 2, max: 4, fmt: "cups" },
    { label: "Evening", value: 3, max: 4, fmt: "cups" },
    { label: "Night", value: 4, max: 4, fmt: "cups" }]

  },
  wind: {
    name: "Wind",
    glyph: "wind",
    state: "neutral",
    location: "İstanbul",
    locationLong: "İstanbul, Beşiktaş",
    value: "38", valueUnit: " km/h", cap: "peak gusts",
    smallNote: "Hold tight",
    verdict: "Wind warning",
    reason: "Gusts 30–42 km/h after 13:00. Tie down anything loose.",
    pill: "38 km/h",
    blocks: [
    { label: "10:00", value: 18, max: 50, fmt: "kmh" },
    { label: "13:00", value: 32, max: 50, fmt: "kmh" },
    { label: "16:00", value: 38, max: 50, fmt: "kmh" },
    { label: "19:00", value: 26, max: 50, fmt: "kmh" }]

  },
  boots: {
    name: "Waterproof boots",
    glyph: "boots",
    state: "rainy",
    location: "İstanbul",
    locationLong: "İstanbul, Beşiktaş",
    value: "86", valueUnit: "%", cap: "wet pavement",
    smallNote: "Puddle day",
    verdict: "Lace the boots",
    reason: "Heavy rain through the afternoon — puddles likely.",
    pill: "86%",
    blocks: [
    { label: "00–06", value: 10, max: 100, fmt: "pct" },
    { label: "06–12", value: 48, max: 100, fmt: "pct" },
    { label: "12–18", value: 86, max: 100, fmt: "pct" },
    { label: "18–00", value: 32, max: 100, fmt: "pct" }]

  },
  mask: {
    name: "Pollen / mask",
    glyph: "mask",
    state: "neutral",
    location: "İstanbul",
    locationLong: "İstanbul, Beşiktaş",
    value: "7", valueUnit: "/10", cap: "pollen index",
    smallNote: "High pollen",
    verdict: "Mask suggested",
    reason: "Tree pollen elevated through the afternoon.",
    pill: "pollen 7",
    blocks: [
    { label: "Tree", value: 7, max: 10, fmt: "raw" },
    { label: "Grass", value: 4, max: 10, fmt: "raw" },
    { label: "Mold", value: 2, max: 10, fmt: "raw" },
    { label: "Dust", value: 5, max: 10, fmt: "raw" }]

  },
  hat: {
    name: "Hat / beanie",
    glyph: "hat",
    state: "neutral",
    location: "İstanbul",
    locationLong: "İstanbul, Beşiktaş",
    value: "3", valueUnit: "°", cap: "feels-like low",
    smallNote: "Ears cold",
    verdict: "Hat & beanie",
    reason: "Cold + breezy. Ear-chill warning before sunset.",
    pill: "feels 3°",
    blocks: [
    { label: "07:00", value: 1, max: 15, fmt: "deg" },
    { label: "12:00", value: 5, max: 15, fmt: "deg" },
    { label: "17:00", value: 4, max: 15, fmt: "deg" },
    { label: "21:00", value: 3, max: 15, fmt: "deg" }]

  }
};

function fmtBlockValue(b) {
  if (b.fmt === "pct") return `${b.value}%`;
  if (b.fmt === "deg") return `${b.value}°`;
  if (b.fmt === "kmh") return `${b.value}`;
  if (b.fmt === "cups") return `${b.value}/${b.max}`;
  return `${b.value}`;
}

// ─── Item Small widget ──────────────────────────────────
function ItemSmallWidget({ id, location, value, cap, smallNote }) {
  const cfg = ITEM_WIDGETS[id];
  if (!cfg) return null;
  const loc = location || cfg.location;
  const v = value != null ? value : cfg.value;
  const c = cap || cfg.cap;
  const note = smallNote != null ? smallNote : cfg.smallNote;
  return (
    <div className="widget small item-widget" data-state={cfg.state}>
      <div className="widget-card">
        <div className="iw-bg-glyph">
          <AGlyph kind={cfg.glyph} size={120} />
        </div>
        <div className="widget-small-content iw-small">
          <div className="iw-small-top">
            <WidgetCityLabel name={loc} />
            <span className="iw-small-name">{cfg.name}</span>
          </div>
          <div className="widget-small-bottom">
            <div className="widget-pct iw-val">
              {v}<span className="iw-unit">{cfg.valueUnit}</span>
            </div>
            <div className="widget-cap">{c}</div>
            {note && <div className="iw-note">{note}</div>}
          </div>
        </div>
      </div>
    </div>);

}

// ─── Item Medium widget ─────────────────────────────────
function ItemMediumWidget({ id, location }) {
  const cfg = ITEM_WIDGETS[id];
  if (!cfg) return null;
  const loc = location || cfg.locationLong;
  return (
    <div className="widget medium item-widget" data-state={cfg.state}>
      <div className="widget-card">
        <div className="iw-bg-glyph medium">
          <AGlyph kind={cfg.glyph} size={150} />
        </div>
        <div className="widget-medium-content">
          <div className="widget-medium-head">
            <div>
              <WidgetCityLabel name={loc} />
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
                  <div className="widget-grid-pct">{fmtBlockValue(b)}</div>
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

// ─── Lock-screen accessories ────────────────────────────
function pickBriefGlyphs(scenario) {
  if (scenario === "rainy") return ["umbrella", "jacket"];
  if (scenario === "sunny") return ["sunglasses", "sunscreen", "tshirt"];
  return ["tshirt"];
}
function leadGlyph(scenario) {
  if (scenario === "rainy") return "umbrella";
  if (scenario === "sunny") return "sunglasses";
  return "tshirt";
}

function LockInline({ scenario = "rainy" }) {
  const text = scenario === "rainy" ? "Bring umbrella" :
  scenario === "sunny" ? "No umbrella" : "Check forecast";
  return (
    <div className="lock-inline">
      <AGlyph kind={leadGlyph(scenario)} size={14} />
      <span>{text}</span>
    </div>);

}

function LockCircular({ scenario = "rainy" }) {
  return (
    <div className="lock-circular">
      <div className="lock-circular-bg">
        <AGlyph kind={leadGlyph(scenario)} size={30} />
        <div className="lock-circular-yn">{scenario === "rainy" ? "Yes" : scenario === "sunny" ? "No" : "—"}</div>
      </div>
    </div>);

}

function LockRectangular({ scenario = "rainy" }) {
  const SC = window.SCENARIOS[scenario];
  const glyphs = pickBriefGlyphs(scenario);
  return (
    <div className="lock-rect">
      <div className="lock-rect-icon">
        <AGlyph kind={leadGlyph(scenario)} size={26} />
      </div>
      <div className="lock-rect-text">
        <div className="lock-rect-title">{SC.verdict}</div>
        <div className="lock-rect-brief">
          {glyphs.map((g, i) =>
          <span key={i} className="lock-rect-brief-glyph">
              <AGlyph kind={g} size={11} />
            </span>
          )}
          <span className="lock-rect-brief-text">{SC.reason}</span>
        </div>
      </div>
    </div>);

}

// ─── Plates ─────────────────────────────────────────────
function HomeScreenPlate({ children }) {
  return (
    <div className="home-plate">
      <div className="home-plate-time">9:41</div>
      <div className="home-plate-date">Friday, April 26</div>
      <div className="home-plate-grid">{children}</div>
    </div>);

}

function LockPlate({ children }) {
  return (
    <div className="lock-plate">
      <div className="lock-plate-time">9:41</div>
      <div className="lock-plate-date">Sunday, April 26</div>
      <div className="lock-plate-widgets">{children}</div>
    </div>);

}

window.SmallWidget = SmallWidget;
window.MediumWidget = MediumWidget;
window.ItemSmallWidget = ItemSmallWidget;
window.ItemMediumWidget = ItemMediumWidget;
window.ITEM_WIDGETS = ITEM_WIDGETS;
window.LockInline = LockInline;
window.LockCircular = LockCircular;
window.LockRectangular = LockRectangular;
window.HomeScreenPlate = HomeScreenPlate;
window.LockPlate = LockPlate;