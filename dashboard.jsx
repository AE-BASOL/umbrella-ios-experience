// Dashboard v3 — 3-snapshot journey + advice driven by user's active alerts.

const SCENARIOS = {
  rainy: {
    state: "rainy",
    temp: 14, unit: "°C",
    rainPct: 78,
    verdict: "Take an umbrella",
    reason: "Steady showers between 14:00 and 18:00.",
    high: 17, low: 11, feels: 12, wind: 22, uv: 2,
    hourly: [
      { h: "10", t: 13, p: 18, uv: 2, wind: 14 },
      { h: "12", t: 14, p: 42, uv: 3, wind: 18 },
      { h: "14", t: 15, p: 78, uv: 2, wind: 22 },
      { h: "16", t: 14, p: 72, uv: 2, wind: 24 },
      { h: "18", t: 13, p: 56, uv: 1, wind: 22 },
      { h: "20", t: 12, p: 28, uv: 0, wind: 18 },
      { h: "22", t: 11, p: 12, uv: 0, wind: 14 },
      { h: "00", t: 11, p: 6,  uv: 0, wind: 12 },
    ],
    location: "İstanbul, Beşiktaş",
  },
  sunny: {
    state: "sunny",
    temp: 24, unit: "°C",
    rainPct: 8,
    verdict: "No umbrella needed",
    reason: "Clear and dry through the evening.",
    high: 26, low: 16, feels: 25, wind: 9, uv: 8,
    hourly: [
      { h: "10", t: 21, p: 0, uv: 5, wind: 7 },
      { h: "12", t: 24, p: 0, uv: 8, wind: 9 },
      { h: "14", t: 26, p: 4, uv: 8, wind: 10 },
      { h: "16", t: 25, p: 8, uv: 6, wind: 9 },
      { h: "18", t: 23, p: 6, uv: 3, wind: 8 },
      { h: "20", t: 20, p: 2, uv: 1, wind: 7 },
      { h: "22", t: 18, p: 0, uv: 0, wind: 6 },
      { h: "00", t: 17, p: 0, uv: 0, wind: 5 },
    ],
    location: "İstanbul, Beşiktaş",
  },
  neutral: {
    state: "neutral",
    temp: null, unit: "°C",
    rainPct: 0,
    verdict: "Updating forecast…",
    reason: "Waiting on the latest hourly data.",
    high: null, low: null, feels: null, wind: null, uv: null,
    hourly: [],
    location: null,
  },
};

function CityLabel({ name }) {
  return (
    <div className="city-label">
      <span className="dot"></span>
      <span>{name}</span>
    </div>
  );
}

// ─── Glyphs (shared with drawer when AGlyph is loaded) ─
function AdviceGlyph({ kind, size = 22 }) {
  if (typeof AGlyph !== "undefined") return <AGlyph kind={kind} size={size} />;
  return null;
}

// ─── Hero (kept) ────────────────────────────────────────
function HeroCard({ data }) {
  const { state, temp, unit, rainPct } = data;
  const subtitle = rainPct >= 60 ? "Rainy day" : rainPct >= 30 ? "Mixed showers" : "Mostly dry";
  return (
    <div className="surface-card">
      <div className="hero-card">
        <div className="hero-icon-wrap">
          <WeatherIcon state={state} size={124} />
        </div>
        <div className="hero-row">
          <div className="temp-stack">
            <div className="temp-line">
              <span className="temp-num">{temp == null ? "--" : temp}</span>
              <span className="temp-unit">{unit}</span>
            </div>
            <span className="temp-cap">{subtitle}</span>
          </div>
          <span className="rain-pill">{rainPct}%</span>
        </div>
        <div className="hero-verdict">
          <div className="verdict-text">{data.verdict}</div>
          <div className="verdict-reason">{data.reason}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Voice — rewrites copy across The Brief and Today's window ──
// Three registers: poetic (imagery), practical (clear, current default), terse (facts only).
const VOICE = {
  umbrella: {
    poetic:    (peakHour, peak) => ({ title: "The sky has plans before you do.",                     sub: `A heavy stretch around ${peakHour}:00 — ${peak}% says yes.` }),
    practical: (peakHour, peak) => ({ title: "Umbrella, definitely.",                                 sub: `Heaviest rain around ${peakHour}:00 — ${peak}% chance.` }),
    terse:     (peakHour, peak) => ({ title: "Umbrella.",                                              sub: `${peak}% rain · peak ${peakHour}:00.` }),
  },
  boots: {
    poetic:    (peak) => ({ title: "Streets will glisten — boots help.",                              sub: `${peak}% rain over the day; puddles guaranteed.` }),
    practical: (peak) => ({ title: "Waterproof boots today.",                                          sub: `Streets will get wet — ${peak}% peak rain.` }),
    terse:     (peak) => ({ title: "Boots.",                                                            sub: `${peak}% rain · wet streets.` }),
  },
  sunglasses: {
    poetic:    (uv) => ({ title: "Light is going to be loud.",                                         sub: `Midday glare bites — UV ${uv}.` }),
    practical: (uv) => ({ title: "Grab the sunglasses.",                                                sub: `Bright midday — UV peaks at ${uv}.` }),
    terse:     (uv) => ({ title: "Sunglasses.",                                                         sub: `UV ${uv}.` }),
  },
  sunscreen: {
    poetic:    (uv, peakHour) => ({ title: "The sun has teeth before noon.",                          sub: `UV ${uv} from ${peakHour}:00 to 16:00.` }),
    practical: (uv, peakHour) => ({ title: "Sunscreen before noon.",                                   sub: `UV ${uv} between ${peakHour}:00 and 16:00.` }),
    terse:     (uv, peakHour) => ({ title: "Sunscreen.",                                               sub: `UV ${uv} · ${peakHour}:00–16:00.` }),
  },
  jacket: {
    poetic:    (feels) => ({ title: "A layer makes the air kinder.",                                   sub: `Feels like ${feels}° once the wind shows up.` }),
    practical: (feels) => ({ title: "Add a light jacket.",                                              sub: `Feels like ${feels}° once the wind picks up.` }),
    terse:     (feels) => ({ title: "Jacket.",                                                          sub: `Feels ${feels}°.` }),
  },
  coat: {
    poetic:    (feels) => ({ title: "A proper coat earns its keep today.",                              sub: `Feels like ${feels}° — the kind of cold that finds gaps.` }),
    practical: (feels) => ({ title: "Heavy coat weather.",                                               sub: `Feels like ${feels}° — bundle up.` }),
    terse:     (feels) => ({ title: "Coat.",                                                              sub: `Feels ${feels}°.` }),
  },
  hat: {
    poetic:    (feels) => ({ title: "Ears speak first in this kind of cold.",                           sub: `Feels like ${feels}° — a hat changes the whole day.` }),
    practical: (feels) => ({ title: "Beanie helps today.",                                                sub: `Feels like ${feels}° — head and ears notice first.` }),
    terse:     (feels) => ({ title: "Hat.",                                                                sub: `Feels ${feels}°.` }),
  },
  water: {
    poetic:    (high) => ({ title: "Bring water — the day will ask for it.",                            sub: `Highs near ${high}°, easy to forget to drink.` }),
    practical: (high) => ({ title: "Carry water.",                                                       sub: `Highs near ${high}° — easy to under-hydrate.` }),
    terse:     (high) => ({ title: "Water.",                                                              sub: `${high}° high.` }),
  },
  wind: {
    poetic:    (peak, peakHour) => ({ title: "The wind is in a mood.",                                   sub: `Gusts to ${peak} km/h around ${peakHour}:00.` }),
    practical: (peak, peakHour) => ({ title: "Windy stretch ahead.",                                      sub: `Gusts up to ${peak} km/h around ${peakHour}:00.` }),
    terse:     (peak, peakHour) => ({ title: "Windy.",                                                    sub: `${peak} km/h · peak ${peakHour}:00.` }),
  },
  easy: {
    poetic:    () => ({ title: "Today is on your side.",                                                  sub: "Light layers, an open afternoon, nothing pressing." }),
    practical: () => ({ title: "Easy day — nothing to bring.",                                            sub: "All your alerts are quiet. Light layers do it." }),
    terse:     () => ({ title: "All clear.",                                                              sub: "Nothing flagged." }),
  },
  loading: {
    poetic:    () => ({ title: "Listening for the sky.",                                                  sub: "Just a moment — fresh reading on the way." }),
    practical: () => ({ title: "Catching the latest reading.",                                            sub: "Pull to refresh, or check connection." }),
    terse:     () => ({ title: "Loading…",                                                                 sub: "—" }),
  },
};

// ─── Advice driven by user's active alerts ─────────────
// alerts: array from drawer; data: scenario; voice: poetic | practical | terse
function buildAdvice(data, alerts, voice = "practical") {
  const v = VOICE;
  const pick = (kind, ...args) => v[kind][voice] ? v[kind][voice](...args) : v[kind].practical(...args);

  if (!data.hourly || data.hourly.length === 0) {
    return [{ glyph: "spinner", ...pick("loading") }];
  }
  if (!alerts) alerts = [];
  const items = [];
  const max = (key) => Math.max(...data.hourly.map(h => h[key] ?? 0));
  const peakHour = (key) => {
    const peak = data.hourly.reduce((acc, h) => (h[key] ?? 0) > (acc[key] ?? -1) ? h : acc, data.hourly[0]);
    return peak.h;
  };

  alerts.filter(a => a.on).forEach(a => {
    if (a.id === "umbrella") {
      const peak = max("p");
      if (peak >= a.threshold) items.push({ glyph: "umbrella", ...pick("umbrella", peakHour("p"), peak) });
    } else if (a.id === "boots") {
      const peak = max("p");
      if (peak >= a.threshold) items.push({ glyph: "boots", ...pick("boots", peak) });
    } else if (a.id === "sunglasses") {
      if (max("uv") >= a.threshold) items.push({ glyph: "sunglasses", ...pick("sunglasses", max("uv")) });
    } else if (a.id === "sunscreen") {
      if (max("uv") >= a.threshold) items.push({ glyph: "sunscreen", ...pick("sunscreen", max("uv"), peakHour("uv")) });
    } else if (a.id === "jacket") {
      if ((data.feels ?? 99) <= a.threshold) items.push({ glyph: "jacket", ...pick("jacket", data.feels) });
    } else if (a.id === "coat") {
      if ((data.feels ?? 99) <= a.threshold) items.push({ glyph: "coat", ...pick("coat", data.feels) });
    } else if (a.id === "hat") {
      if ((data.feels ?? 99) <= a.threshold) items.push({ glyph: "hat", ...pick("hat", data.feels) });
    } else if (a.id === "water") {
      if (max("t") >= a.threshold) items.push({ glyph: "water", ...pick("water", max("t")) });
    } else if (a.id === "wind") {
      if (max("wind") >= a.threshold) items.push({ glyph: "wind", ...pick("wind", max("wind"), peakHour("wind")) });
    } else if (a.id === "mask") {
      // pollen not in mock data — keep silent
    }
  });

  // Reassurance card if nothing fired
  if (items.length === 0) items.push({ glyph: "tshirt", ...pick("easy") });
  return items;
}

function AdviceCard({ items }) {
  return (
    <div className="surface-card">
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 0.4 }}>
            The Brief
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--tertiary)", fontFamily: "ui-monospace, SF Mono, Menlo, monospace" }}>
            10-second read
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "color-mix(in oklab, var(--badge-bg) 70%, transparent)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <AdviceGlyph kind={a.glyph} size={22} />
              </div>
              <div style={{ flex: 1, paddingTop: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--headline)", letterSpacing: -0.1 }}>
                  {a.title}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--accent)", marginTop: 3, lineHeight: 1.4 }}>
                  {a.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Today's window — replaces high/low/feels/wind ───
// Computes a "best window" (lowest rain + UV stress, mildest feels-like) and
// an "avoid window" (highest rain or peak UV) from hourly data.
function TodaysWindow({ data, voice = "practical" }) {
  if (!data.hourly || data.hourly.length === 0) return null;
  // Score each hour: lower = better (less rain, less UV stress, comfort closer to 20°)
  const score = (h) => {
    const rainPenalty = (h.p ?? 0) * 1.2;
    const uvPenalty   = (h.uv ?? 0) >= 7 ? ((h.uv - 6) * 8) : 0;
    const tempPenalty = Math.abs((h.t ?? 20) - 20) * 1.5;
    const windPenalty = Math.max(0, (h.wind ?? 0) - 25) * 1.0;
    return rainPenalty + uvPenalty + tempPenalty + windPenalty;
  };
  const annotated = data.hourly.map(h => ({ ...h, score: score(h) }));
  const best = annotated.reduce((a, b) => b.score < a.score ? b : a);
  const worst = annotated.reduce((a, b) => b.score > a.score ? b : a);

  // Reasons in three voices.
  const REASONS = {
    best: {
      dry_easy:  { poetic: "Dry hour with soft light",   practical: "Dry, easy on the eyes",     terse: "Dry · low UV" },
      driest:    { poetic: "The day's driest pocket",     practical: "Driest stretch of the day",  terse: "Driest hour" },
      soft_light:{ poetic: "Soft light, no sting",        practical: "Soft light, no sting",       terse: "Low UV" },
      mildest:   { poetic: "The kindest hour",            practical: "Mildest hour",               terse: "Mildest" },
    },
    avoid: {
      rain:      { poetic: "The sky lets go here",        practical: "Heaviest rain hits",         terse: "Peak rain" },
      uv:        { poetic: "The sun bites hardest",       practical: "UV peaks — protect skin",     terse: "Peak UV" },
      wind:      { poetic: "Wind takes the lead",         practical: "Strong gusts",                terse: "Peak wind" },
      rough:     { poetic: "The tense hour of the day",   practical: "Roughest hour",               terse: "Roughest" },
    },
  };
  const pickReason = (group, key) => (REASONS[group][key] && REASONS[group][key][voice]) || REASONS[group][key].practical;
  const reason = (h, kind) => {
    if (kind === "best") {
      if ((h.p ?? 0) <= 10 && (h.uv ?? 0) <= 4) return pickReason("best", "dry_easy");
      if ((h.p ?? 0) <= 10) return pickReason("best", "driest");
      if ((h.uv ?? 0) <= 3) return pickReason("best", "soft_light");
      return pickReason("best", "mildest");
    }
    if ((h.p ?? 0) >= 60) return pickReason("avoid", "rain");
    if ((h.uv ?? 0) >= 8)  return pickReason("avoid", "uv");
    if ((h.wind ?? 0) >= 30) return pickReason("avoid", "wind");
    return pickReason("avoid", "rough");
  };

  const fmt = (h) => `${h.h}:00`;

  // mini sparkline (no labels — just shape)
  const W = 320, H = 36;
  const temps = data.hourly.map(h => h.t);
  const tMin = Math.min(...temps);
  const tMax = Math.max(...temps);
  const xStep = (W - 8) / (data.hourly.length - 1);
  const yFor = (t) => 6 + (1 - (t - tMin) / Math.max(1, tMax - tMin)) * (H - 12);
  const pts = data.hourly.map((h, i) => [4 + i * xStep, yFor(h.t)]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  const bestI = annotated.indexOf(best);
  const worstI = annotated.indexOf(worst);

  return (
    <div className="surface-card">
      <div style={{ padding: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 12 }}>
          Today's window
        </div>
        <div className="window-row">
          <div className="window-card best">
            <div className="window-tag">
              <span className="dot best"></span>
              <span>Best</span>
            </div>
            <div className="window-time">{fmt(best)}</div>
            <div className="window-reason">{reason(best, "best")}</div>
            <div className="window-meta">
              <span>{best.t}°</span>
              <span>·</span>
              <span>{best.p}% rain</span>
              {best.uv != null && <><span>·</span><span>UV {best.uv}</span></>}
            </div>
          </div>
          <div className="window-card avoid">
            <div className="window-tag">
              <span className="dot avoid"></span>
              <span>Avoid</span>
            </div>
            <div className="window-time">{fmt(worst)}</div>
            <div className="window-reason">{reason(worst, "avoid")}</div>
            <div className="window-meta">
              <span>{worst.t}°</span>
              <span>·</span>
              <span>{worst.p}% rain</span>
              {worst.uv != null && <><span>·</span><span>UV {worst.uv}</span></>}
            </div>
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", marginTop: 14 }}>
          <defs>
            <linearGradient id="tw-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--bar-fill)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--bar-fill)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${d} L ${pts[pts.length-1][0]} ${H} L ${pts[0][0]} ${H} Z`} fill="url(#tw-fill)" />
          <path d={d} fill="none" stroke="var(--bar-fill)" strokeWidth="1.8" strokeLinecap="round" />
          {pts.map((p, i) => {
            if (i === bestI) return <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="var(--bg)" stroke="var(--bar-fill)" strokeWidth="2" />;
            if (i === worstI) return <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="var(--bar-fill)" stroke="var(--bg)" strokeWidth="1.5" />;
            return null;
          })}
        </svg>
      </div>
    </div>
  );
}

// ─── 3-snapshot journey ─────────────────────────────────
// Picks 3 representative hours and shows: time, weather state, temp, headline, what-to-bring chips.
function pickSnapshots(data, alerts) {
  if (!data.hourly || data.hourly.length === 0) return [];
  const findClosest = (target) => {
    return data.hourly.reduce((acc, h) => {
      const d = Math.abs(parseInt(h.h, 10) - target);
      return d < acc.d ? { h, d } : acc;
    }, { h: data.hourly[0], d: 99 }).h;
  };
  const morning = findClosest(10);
  const noon    = findClosest(14);
  const evening = findClosest(18);

  const stateOf = (h) => h.p >= 60 ? "rainy" : (h.uv ?? 0) >= 5 ? "sunny" : "neutral";
  const headlineOf = (h) =>
    h.p >= 60 ? "Heaviest rain" :
    h.p >= 30 ? "Mixed showers" :
    (h.uv ?? 0) >= 6 ? "Brightest stretch" :
    (h.uv ?? 0) >= 3 ? "Pleasant & clear" :
    h.h >= "20" || h.h <= "06" ? "Cool & calm" : "Mild";

  const chipsFor = (h) => {
    const out = [];
    const fired = (id) => alerts && alerts.find(a => a.id === id && a.on);
    if (h.p >= (fired("umbrella")?.threshold ?? 40)) out.push({ glyph: "umbrella", lab: `${h.p}%` });
    if ((h.uv ?? 0) >= (fired("sunglasses")?.threshold ?? 4)) out.push({ glyph: "sunglasses", lab: `UV ${h.uv}` });
    if ((h.uv ?? 0) >= (fired("sunscreen")?.threshold ?? 6)) out.push({ glyph: "sunscreen", lab: `UV ${h.uv}` });
    if ((h.wind ?? 0) >= (fired("wind")?.threshold ?? 35)) out.push({ glyph: "wind", lab: `${h.wind}` });
    if ((data.feels ?? 99) <= (fired("jacket")?.threshold ?? 16)) out.push({ glyph: "jacket", lab: `${data.feels}°` });
    if ((data.feels ?? 99) <= (fired("coat")?.threshold ?? 6)) out.push({ glyph: "coat", lab: `${data.feels}°` });
    if (out.length === 0) out.push({ glyph: "tshirt", lab: "Easy" });
    return out.slice(0, 3);
  };

  const labels = ["Morning", "Midday", "Evening"];
  return [morning, noon, evening].map((h, i) => ({
    label: labels[i],
    time: `${h.h}:00`,
    temp: h.t,
    state: stateOf(h),
    headline: headlineOf(h),
    rainPct: h.p,
    chips: chipsFor(h),
  }));
}

function TodayJourney({ data, alerts }) {
  const snaps = pickSnapshots(data, alerts);
  if (snaps.length === 0) return null;
  return (
    <div className="surface-card">
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2px 12px" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 0.3 }}>
            Your day
          </span>
          <span style={{ fontSize: 10, fontWeight: 500, color: "var(--tertiary)",
            fontFamily: "ui-monospace, SF Mono, Menlo, monospace" }}>
            morning · midday · evening
          </span>
        </div>
        <div className="journey">
          {snaps.map((s, i) => (
            <div key={i} className="journey-snap" data-state={s.state}>
              <div className="journey-time">
                <span className="lab">{s.label}</span>
                <span className="t">{s.time}</span>
              </div>
              <div className="journey-icon">
                <WeatherIcon state={s.state} size={56} />
              </div>
              <div className="journey-temp">
                {s.temp}<span>°</span>
              </div>
              <div className="journey-headline">{s.headline}</div>
              <div className="journey-chips">
                {s.chips.map((c, ci) => (
                  <span key={ci} className="journey-chip">
                    <AdviceGlyph kind={c.glyph} size={11} />
                    <span>{c.lab}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Weekly forecast (replaces Today's window + Your day) ──────────
// 7 short rows. Tap a row to expand: shows hourly mini-bars (rain %),
// high/low, dominant condition headline, and any glyphs from active alerts.
const WEEKLY_FORECAST = {
  rainy: [
    { day: "Today", state: "rainy",   high: 17, low: 11, p: 78, hourly: [18,42,78,72,56,28,12,6],   wind: 24, uv: 3, headline: "Steady showers 14:00–18:00." },
    { day: "Tue",   state: "rainy",   high: 16, low: 10, p: 64, hourly: [10,30,55,64,52,40,22,12],  wind: 22, uv: 2, headline: "Heavy in the afternoon, easing by sunset." },
    { day: "Wed",   state: "neutral", high: 15, low: 9,  p: 28, hourly: [4,8,18,28,22,16,8,4],     wind: 18, uv: 4, headline: "Cloudy with brief breaks of sun." },
    { day: "Thu",   state: "sunny",   high: 19, low: 10, p: 6,  hourly: [0,2,4,6,4,2,0,0],         wind: 12, uv: 5, headline: "Bright, dry, easy." },
    { day: "Fri",   state: "sunny",   high: 22, low: 13, p: 4,  hourly: [0,0,2,4,2,0,0,0],         wind: 10, uv: 6, headline: "Warm and clear all day." },
    { day: "Sat",   state: "neutral", high: 18, low: 12, p: 22, hourly: [4,12,20,22,18,10,6,2],    wind: 16, uv: 4, headline: "Mostly grey with light spells." },
    { day: "Sun",   state: "rainy",   high: 15, low: 10, p: 56, hourly: [12,28,46,56,42,30,18,8],  wind: 20, uv: 3, headline: "A wetter end to the week." },
  ],
  sunny: [
    { day: "Today", state: "sunny",   high: 26, low: 16, p: 8,  hourly: [0,0,4,8,6,2,0,0],         wind: 10, uv: 8, headline: "Clear and dry through the evening." },
    { day: "Tue",   state: "sunny",   high: 27, low: 17, p: 4,  hourly: [0,0,2,4,2,0,0,0],         wind: 9,  uv: 8, headline: "Another bright one." },
    { day: "Wed",   state: "sunny",   high: 25, low: 16, p: 6,  hourly: [0,2,4,6,4,2,0,0],         wind: 11, uv: 7, headline: "A few high clouds." },
    { day: "Thu",   state: "neutral", high: 22, low: 14, p: 18, hourly: [2,8,14,18,16,10,4,2],     wind: 14, uv: 5, headline: "Breeze picks up, mostly cloudy." },
    { day: "Fri",   state: "rainy",   high: 19, low: 12, p: 48, hourly: [10,22,38,48,40,28,14,6],  wind: 18, uv: 3, headline: "First showers of the week." },
    { day: "Sat",   state: "neutral", high: 21, low: 13, p: 22, hourly: [4,12,18,22,18,12,6,2],    wind: 12, uv: 5, headline: "Mixed sky, comfortable." },
    { day: "Sun",   state: "sunny",   high: 24, low: 15, p: 8,  hourly: [0,2,6,8,6,2,0,0],         wind: 10, uv: 7, headline: "Warmth returns." },
  ],
  neutral: [
    { day: "Today", state: "neutral", high: null, low: null, p: 0, hourly: [], wind: null, uv: null, headline: "Catching the latest reading." },
    { day: "Tue",   state: "neutral", high: 14,   low: 8,    p: 20, hourly: [4,8,16,20,18,10,6,2],   wind: 14, uv: 4, headline: "Mild, in-between." },
    { day: "Wed",   state: "neutral", high: 15,   low: 9,    p: 18, hourly: [2,6,14,18,16,10,4,2],   wind: 12, uv: 4, headline: "Drier interlude." },
    { day: "Thu",   state: "rainy",   high: 13,   low: 8,    p: 52, hourly: [10,22,38,52,42,28,14,6], wind: 18, uv: 3, headline: "Showers return." },
    { day: "Fri",   state: "rainy",   high: 12,   low: 7,    p: 64, hourly: [16,32,52,64,54,38,22,10], wind: 22, uv: 2, headline: "Wettest day ahead." },
    { day: "Sat",   state: "neutral", high: 14,   low: 8,    p: 24, hourly: [4,10,18,24,20,12,6,2],  wind: 14, uv: 4, headline: "Drying out." },
    { day: "Sun",   state: "sunny",   high: 17,   low: 10,   p: 6,  hourly: [0,2,4,6,4,2,0,0],       wind: 10, uv: 6, headline: "Cleaner skies by Sunday." },
  ],
};

function dayBadgeForRow(row, alerts) {
  // Pick at most 2 glyphs that are relevant to this day, gated by user's enabled alerts.
  const on = new Set((alerts || []).filter(a => a.on).map(a => a.id));
  const out = [];
  if (row.p >= 60 && on.has("umbrella")) out.push("umbrella");
  else if (row.p >= 40 && on.has("umbrella")) out.push("umbrella");
  if ((row.uv ?? 0) >= 6 && on.has("sunglasses")) out.push("sunglasses");
  if ((row.uv ?? 0) >= 7 && on.has("sunscreen") && out.length < 2) out.push("sunscreen");
  if ((row.wind ?? 0) >= 30 && on.has("wind") && out.length < 2) out.push("wind");
  if (row.p >= 70 && on.has("boots") && out.length < 2) out.push("boots");
  return out.slice(0, 2);
}

function WeeklyForecast({ data, alerts, voice = "practical" }) {
  const days = WEEKLY_FORECAST[data.state] || WEEKLY_FORECAST.neutral;
  const [openIdx, setOpenIdx] = React.useState(null);

  // Find weekly extremes for sparkline scaling
  const allHigh = days.map(d => d.high).filter(v => v != null);
  const allLow  = days.map(d => d.low).filter(v => v != null);
  const wMax = allHigh.length ? Math.max(...allHigh) : 25;
  const wMin = allLow.length  ? Math.min(...allLow)  : 5;
  const wRange = Math.max(1, wMax - wMin);

  const headline = voice === "terse"
    ? "7 days"
    : voice === "poetic"
      ? "The week, in glances"
      : "This week";

  return (
    <div className="surface-card weekly-card">
      <div style={{ padding: "18px 18px 6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 2px 12px" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 0.4 }}>
            {headline}
          </span>
          <span style={{ fontSize: 10, fontWeight: 500, color: "var(--tertiary)", fontFamily: "ui-monospace, SF Mono, Menlo, monospace" }}>
            tap a day for more
          </span>
        </div>
        <div className="wk-list">
          {days.map((d, i) => {
            const open = openIdx === i;
            const tempBarLeft  = d.low  != null ? ((d.low  - wMin) / wRange) * 100 : 0;
            const tempBarRight = d.high != null ? ((d.high - wMin) / wRange) * 100 : 0;
            const badges = dayBadgeForRow(d, alerts);
            return (
              <div key={d.day} className={`wk-row ${open ? "open" : ""}`} data-state={d.state}>
                <button className="wk-row-head" onClick={() => setOpenIdx(open ? null : i)} type="button" aria-expanded={open}>
                  <span className="wk-day">{d.day}</span>
                  <span className="wk-ico"><WeatherIcon state={d.state} size={28} /></span>
                  <span className="wk-rain">
                    <AdviceGlyph kind="umbrella" size={11} />
                    <span className="num">{d.p}<em>%</em></span>
                  </span>
                  <span className="wk-temp-track">
                    <span className="wk-temp-fill" style={{ left: `${tempBarLeft}%`, right: `${100 - tempBarRight}%` }}></span>
                  </span>
                  <span className="wk-temp-nums">
                    <span className="lo">{d.low ?? "—"}<em>°</em></span>
                    <span className="hi">{d.high ?? "—"}<em>°</em></span>
                  </span>
                  <span className={`wk-chev ${open ? "on" : ""}`}>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </span>
                </button>

                {open && (
                  <div className="wk-row-body">
                    <div className="wk-headline">{d.headline}</div>
                    <div className="wk-stats">
                      <div className="wk-stat">
                        <span className="lab">High</span>
                        <span className="val">{d.high ?? "—"}<em>°</em></span>
                      </div>
                      <div className="wk-stat">
                        <span className="lab">Low</span>
                        <span className="val">{d.low ?? "—"}<em>°</em></span>
                      </div>
                      <div className="wk-stat">
                        <span className="lab">Rain peak</span>
                        <span className="val">{d.p}<em>%</em></span>
                      </div>
                      <div className="wk-stat">
                        <span className="lab">UV</span>
                        <span className="val">{d.uv ?? "—"}</span>
                      </div>
                      <div className="wk-stat">
                        <span className="lab">Wind</span>
                        <span className="val">{d.wind ?? "—"}<em>km/h</em></span>
                      </div>
                    </div>
                    {d.hourly && d.hourly.length > 0 && (
                      <div className="wk-mini">
                        <div className="wk-mini-lbl">Rain by hour</div>
                        <div className="wk-mini-bars">
                          {d.hourly.map((p, hi) => (
                            <span key={hi} className="wk-mini-bar" style={{ height: `${Math.max(4, p)}%` }} title={`${p}%`}></span>
                          ))}
                        </div>
                        <div className="wk-mini-axis">
                          <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
                        </div>
                      </div>
                    )}
                    {badges.length > 0 && (
                      <div className="wk-badges">
                        <span className="wk-badges-lbl">Bring</span>
                        {badges.map((b, bi) => (
                          <span key={bi} className="wk-badge">
                            <AdviceGlyph kind={b} size={12} />
                            <span>{b}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Footer ─────────────────────────────────────────────
function Chip({ accent, icon, children }) {
  return (
    <div className={`chip ${accent ? "accent" : "plain"}`}>
      {icon}<span>{children}</span>
    </div>
  );
}
function FooterRow({ data, lastUpdated, mock }) {
  return (
    <div className="footer-row">
      <Chip icon={<Icon.Clock size={11} />}>{lastUpdated}</Chip>
      <Chip accent icon={mock ? <Icon.Tube size={11} /> : <Icon.Radio size={11} />}>
        {mock ? "Mock" : "Live"}
      </Chip>
      {data.location && <Chip icon={<Icon.Pin size={11} />}>{data.location}</Chip>}
    </div>
  );
}

// ─── Dashboard ──────────────────────────────────────────
function Dashboard({ scenario, onOpenSettings, onOpenDrawer, mock, alerts, tweaks }) {
  const voice = tweaks?.voice || "practical";
  const data = SCENARIOS[scenario];
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const updatedText = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const advice = buildAdvice(data, alerts, voice);

  return (
    <div className="app-stage" data-state={data.state} style={{ paddingTop: 54 }}>
      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="header-row">
          <button className="tool-btn" onClick={onOpenDrawer} aria-label="Menu">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </button>
          {data.location ? (
            <CityLabel name={data.location} />
          ) : (
            <span style={{ fontSize: 10, fontWeight: 500, color: "var(--accent)" }}>UmbrellaToday</span>
          )}
          <button className="tool-btn" onClick={onOpenSettings} aria-label="Settings">
            <Icon.Gear size={14} color="currentColor" />
          </button>
        </div>

        <HeroCard data={data} />
        <AdviceCard items={advice} />
        <WeeklyForecast data={data} alerts={alerts} voice={voice} />
        <FooterRow data={data} lastUpdated={updatedText} mock={mock} />
        <div style={{ height: 8 }}></div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
window.SCENARIOS = SCENARIOS;
window.WEEKLY_FORECAST = WEEKLY_FORECAST;
