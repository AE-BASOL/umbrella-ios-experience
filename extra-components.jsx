
// ═══ CenteredTempDashboard — alternative layout: scene top, temp dead-center ═══
function CTRestOfDay({ data, palette, variant, onVariantChange }) {
  const hrs = React.useMemo(() => (data.hourly || []).slice(0, 8), [data]);
  if (!hrs.length) return null;
  const humidity = data.state === "rainy" ? 78 : data.state === "sunny" ? 38 : 56;
  const visibility = data.state === "rainy" ? 6 : 10;
  const sunrise = "06:42", sunset = "19:48";
  const now = hrs[0];
  const tomMin = Math.min(...hrs.map((h) => h.t));
  const tomMax = Math.max(...hrs.map((h) => h.t));
  const events = (() => {
    const out = [{ kind: "now", h: now.h, label: "Now", t: data.temp,
                   sub: data.state === "rainy" ? "Light rain" : data.state === "sunny" ? "Clear" : "Cloudy" }];
    const rainStart = hrs.find((h) => (h.p ?? 0) >= 40);
    const peak = hrs.reduce((a, b) => (b.p ?? 0) > (a.p ?? 0) ? b : a, hrs[0]);
    const windRise = hrs.reduce((a, b) => (b.wind ?? 0) > (a.wind ?? 0) ? b : a, hrs[0]);
    if (rainStart && rainStart !== now && (rainStart.p ?? 0) >= 40) {
      out.push({ kind: "rainStart", h: rainStart.h, label: "Rain starts", t: rainStart.t, sub: `${rainStart.p}%` });
    }
    if (peak && (peak.p ?? 0) >= 40) {
      out.push({ kind: "peakRain", h: peak.h, label: "Peak rain", t: peak.t, sub: `${peak.p}%` });
    }
    if (windRise && (windRise.wind ?? 0) >= 20) {
      out.push({ kind: "wind", h: windRise.h, label: "Wind rises", t: windRise.t, sub: `${windRise.wind} km/h` });
    }
    out.push({ kind: "sunset", h: sunset.slice(0,2), label: "Sunset", t: null, sub: sunset });
    return out.filter((e, i, a) => i === 0 || e.h !== a[i-1].h).slice(0, 6);
  })();
  const nextChange = (() => {
    const e = events.find((x) => x.kind !== "now");
    if (!e) return "Quiet through the evening.";
    if (e.kind === "rainStart") return `Rain starts around ${e.h}:00.`;
    if (e.kind === "peakRain")  return `Peak rain near ${e.h}:00 (${e.sub}).`;
    if (e.kind === "wind")      return `Wind rises to ${e.sub} by ${e.h}:00.`;
    if (e.kind === "sunset")    return `Daylight until ${e.sub}.`;
    return "";
  })();
  const variants = [
    { id: "events",  lab: "Events"  },
    { id: "console", lab: "Console" },
    { id: "hybrid",  lab: "Hybrid"  },
  ];
  const cardBase = {
    margin: "0 18px", borderRadius: 22,
    background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.13)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 10px 28px -10px rgba(0,0,0,0.42)",
    position: "relative", overflow: "hidden",
  };
  const topSheen = (
    <div aria-hidden="true" style={{
      position: "absolute", top: 0, left: "8%", right: "8%", height: "30%",
      background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)",
      borderRadius: "0 0 50% 50%", pointerEvents: "none",
    }}></div>
  );
  const EventIcon = ({ kind, size = 14 }) => {
    const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
                stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
    if (kind === "now") return (<svg {...p}><circle cx="12" cy="12" r="3.4" fill="currentColor"/><circle cx="12" cy="12" r="8" opacity="0.45"/></svg>);
    if (kind === "rainStart" || kind === "peakRain") return (<svg {...p}><path d="M12 3.5c3.5 4.8 6 7.8 6 11a6 6 0 1 1-12 0c0-3.2 2.5-6.2 6-11z" fill="currentColor"/></svg>);
    if (kind === "wind") return (<svg {...p}><path d="M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h8"/></svg>);
    if (kind === "sunset") return (<svg {...p}><path d="M5 17h14M12 13V4M8 8l4-4 4 4M3 21h18"/></svg>);
    return null;
  };
  const MetricChip = ({ icon, lab, val, unit }) => (
    <div style={{
      flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: 3,
      padding: "8px 10px", borderRadius: 14,
      background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.10)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)", position: "relative", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(220,228,240,0.5)" }}>
        {icon}
        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.4px", textTransform: "uppercase", fontFamily: "inherit" }}>{lab}</div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#F7FAFF", letterSpacing: "-0.4px", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {val}<span style={{ fontSize: 10, fontWeight: 600, color: "rgba(220,228,240,0.55)", marginLeft: 1.5 }}>{unit}</span>
      </div>
    </div>
  );
  const mIcon = (svg) => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{svg}</svg>
  );
  const ic = {
    feels:  mIcon(<path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0z"/>),
    wind:   mIcon(<path d="M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h8"/>),
    hum:    mIcon(<path d="M12 3.5c3.5 4.8 6 7.8 6 11a6 6 0 1 1-12 0c0-3.2 2.5-6.2 6-11z"/>),
    uv:     mIcon(<><circle cx="12" cy="12" r="3.6"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/></>),
    vis:    mIcon(<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></>),
    range:  mIcon(<path d="M4 12h16M7 8l-3 4 3 4M17 8l3 4-3 4"/>),
  };
  const Header = (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", marginBottom: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.5px", color: "rgba(220,228,240,0.5)", textTransform: "uppercase" }}>Rest of the day</div>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(220,228,240,0.42)", letterSpacing: "0.1px", fontVariantNumeric: "tabular-nums" }}>{tomMin}° – {tomMax}° · {nextChange}</div>
      </div>
      <div style={{ display: "flex", padding: 2, borderRadius: 9999, background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.13)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)" }}>
        {variants.map((v) => {
          const on = variant === v.id;
          return (
            <button key={v.id} onClick={() => onVariantChange(v.id)} style={{ appearance: "none", border: "none", cursor: "pointer", padding: "4px 9px", borderRadius: 9999, background: on ? `color-mix(in oklab, ${palette.accent} 22%, rgba(255,255,255,0.10))` : "transparent", color: on ? "#F7FAFF" : "rgba(220,228,240,0.55)", fontSize: 9, fontWeight: 700, letterSpacing: "0.3px", textTransform: "uppercase" }}>{v.lab}</button>
          );
        })}
      </div>
    </div>
  );
  if (variant === "events") {
    return (
      <div data-anchor="hourly" style={{ paddingTop: 22, paddingBottom: 4 }}>
        {Header}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "2px 18px 8px", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
          {events.map((e, i) => {
            const featured = e.kind === "now";
            return (
              <div key={i} style={{ flexShrink: 0, scrollSnapAlign: "start", width: featured ? 124 : 108, height: 132, borderRadius: 18, background: featured ? `color-mix(in oklab, ${palette.accent} 18%, rgba(255,255,255,0.07))` : "rgba(255,255,255,0.05)", border: featured ? `0.5px solid color-mix(in oklab, ${palette.accent} 38%, rgba(255,255,255,0.18))` : "0.5px solid rgba(255,255,255,0.13)", boxShadow: featured ? `inset 0 1px 0 rgba(255,255,255,0.22), 0 8px 22px -8px color-mix(in oklab, ${palette.accent} 35%, transparent)` : "inset 0 1px 0 rgba(255,255,255,0.18), 0 6px 16px -8px rgba(0,0,0,0.35)", padding: "12px 12px 11px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: featured ? "#F7FAFF" : "rgba(220,228,240,0.78)", letterSpacing: "0.2px", fontVariantNumeric: "tabular-nums" }}>{featured ? "Now" : `${e.h}:00`}</div>
                  <div style={{ color: featured ? palette.accent : "rgba(220,228,240,0.55)" }}>
                    <EventIcon kind={e.kind} size={14}/>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#F7FAFF", letterSpacing: "-0.2px", lineHeight: 1.1 }}>{e.label}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: featured ? "rgba(247,250,255,0.78)" : "rgba(220,228,240,0.5)", letterSpacing: "0.2px", fontVariantNumeric: "tabular-nums" }}>
                    {e.t != null && <span style={{ marginRight: 6, color: "#F7FAFF", fontSize: 13, fontWeight: 700 }}>{e.t}°</span>}
                    {e.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (variant === "console") {
    const nowH = parseInt(now.h, 10) + (now.h === "00" ? 24 : 0);
    const dayStart = 6 + 42/60, dayEnd = 19 + 48/60;
    const prog = Math.max(0, Math.min(1, (nowH - dayStart) / (dayEnd - dayStart)));
    return (
      <div data-anchor="hourly" style={{ paddingTop: 22, paddingBottom: 4 }}>
        {Header}
        <div style={{ ...cardBase, padding: "14px 14px 13px" }}>
          {topSheen}
          <div style={{ position: "relative", height: 46, marginBottom: 12 }}>
            <svg viewBox="0 0 340 46" width="100%" height="46" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`arc-${data.state}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.25)"/><stop offset={`${prog*100}%`} stopColor={palette.accent} stopOpacity="0.9"/><stop offset={`${prog*100}%`} stopColor="rgba(255,255,255,0.18)" stopOpacity="0.5"/><stop offset="100%" stopColor="rgba(255,255,255,0.15)"/>
                </linearGradient>
              </defs>
              <path d="M10 38 Q170 -8 330 38" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" strokeDasharray="2 3"/>
              <path d="M10 38 Q170 -8 330 38" fill="none" stroke={`url(#arc-${data.state})`} strokeWidth="2.4" strokeLinecap="round"/>
              {(() => {
                const t = prog;
                const x = (1-t)*(1-t)*10 + 2*(1-t)*t*170 + t*t*330;
                const y = (1-t)*(1-t)*38 + 2*(1-t)*t*(-8) + t*t*38;
                return (<><circle cx={x} cy={y} r="9" fill={palette.accent} opacity="0.18"/><circle cx={x} cy={y} r="4.2" fill="#F7FAFF"/><circle cx={x} cy={y} r="4.2" fill={palette.accent} opacity="0.55"/></>);
              })()}
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, top: 32, display: "flex", justifyContent: "space-between", padding: "0 4px", fontSize: 9, fontWeight: 600, color: "rgba(220,228,240,0.5)", letterSpacing: "0.3px", fontVariantNumeric: "tabular-nums" }}>
              <span>{sunrise}</span><span>daylight</span><span>{sunset}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}><MetricChip icon={ic.feels} lab="Feels" val={data.feels ?? "—"} unit="°"/><MetricChip icon={ic.wind} lab="Wind" val={data.wind ?? "—"} unit=" km/h"/><MetricChip icon={ic.hum} lab="Humid" val={humidity} unit="%"/></div>
          <div style={{ display: "flex", gap: 6 }}><MetricChip icon={ic.uv} lab="UV" val={data.uv ?? "—"} unit=""/><MetricChip icon={ic.vis} lab="View" val={visibility} unit=" km"/><MetricChip icon={ic.range} lab="Range" val={`${tomMin}–${tomMax}`} unit="°"/></div>
        </div>
      </div>
    );
  }
  const hotBeach = data.state === "sunny" && (data.temp ?? 0) >= 30;
  const bucket = data.state === "rainy" ? "rainy" : hotBeach ? "hot" : data.state === "sunny" ? "sunny" : "rainy";
  const fullHrs = (() => {
    const base = (data.hourly || []).slice();
    if (base.length >= 12) return base.slice(0, 12);
    if (!base.length) return [];
    while (base.length < 12) {
      const last = base[base.length - 1];
      const nextH = ((parseInt(last.h, 10) + 1) % 24).toString().padStart(2, "0");
      base.push({ h: nextH, t: last.t, p: Math.max(0, (last.p ?? 0) - 8), wind: last.wind });
    }
    return base;
  })();
  const eventByHour = (() => {
    const m = {};
    const firstEvt = fullHrs.find(h => (h.p || 0) >= 40);
    if (firstEvt) m[firstEvt.h] = { kind: "rainStart", label: "Rain Starts" };
    return m;
  })();
  const nextChangeS = "Clear skies ahead.";
  const COL_W = 48;
  const keyMoments = fullHrs.map(h => ({ h: h.h, ev: eventByHour[h.h] })).filter(x => x.ev).map(x => ({ kind: x.ev.kind, label: x.ev.label, h: x.h }));
  const HourGlyph = ({ h, size = 16 }) => {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/></svg>;
  };
  return (
    <div data-anchor="hourly" style={{ paddingTop: 22, paddingBottom: 4 }}>
      <div style={{ margin: "0 18px", borderRadius: 22, background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.12)", padding: "14px 0 14px", position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.9px", color: "rgba(220,228,240,0.5)", textTransform: "uppercase" }}>Today Ahead</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(247,250,255,0.92)" }}>{tomMin}° — {tomMax}° · {nextChangeS}</div>
        </div>
        <div style={{ overflowX: "auto", display: "flex", padding: "4px 10px 2px" }}>
          {fullHrs.map((h, i) => (
            <div key={i} style={{ flexShrink: 0, width: COL_W, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(220,228,240,0.7)" }}>{i === 0 ? "Now" : h.h}</div>
              <HourGlyph h={h} size={20}/>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#F7FAFF" }}>{h.t}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CenteredTempDashboard({ scenario = "rainy", forceHeroItem = null }) {
  const data = window.SCENARIOS ? window.SCENARIOS[scenario] : null;
  const [restVariant, setRestVariant] = React.useState("hybrid");
  if (!data) return <div>Loading...</div>;
  const fired = fireForState(data);
  const heroItem = forceHeroItem || "umbrella";
  const palette = ITEM_SCENES[heroItem] || ITEM_SCENES.umbrella;
  return (
    <div style={{ width: "100%", height: "100%", background: palette.deep, color: "#F7FAFF", overflowY: "auto", position: "relative" }}>
      <div style={{ position: "relative", height: 460 }}>
        <ItemScene item={heroItem} />
        <div style={{ position: "absolute", left: "50%", top: 194, transform: "translateX(-50%)", width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid #fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 96, fontWeight: 700 }}>{data.temp}°</div>
          <div style={{ fontSize: 14 }}>{data.verdict}</div>
        </div>
      </div>
      <CTRestOfDay data={data} palette={palette} variant={restVariant} onVariantChange={setRestVariant} />
    </div>
  );
}

function StandByShell({ children, bg, W=844, H=390 }) {
  return (
    <div style={{ width:W, height:H, borderRadius:32, overflow:"hidden", background: bg || "#000", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>
      {children}
    </div>
  );
}

function StandByClockVariant({ slot="V2-01", scene }) {
  const s = window.V3_SLOTS && window.V3_SLOTS[slot];
  const now = new Date();
  if (!s) return null;
  return (
    <StandByShell bg="#000">
      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        <div style={{ fontSize: 120, fontWeight: 100 }}>{now.getHours()}:{String(now.getMinutes()).padStart(2, "0")}</div>
        <div style={{ width: 2, height: 200, background: "rgba(255,255,255,0.1)" }} />
        <div>
          <div style={{ fontSize: 24, color: s.accent }}>{s.name}</div>
          <div style={{ fontSize: 48 }}>{s.value}{s.unit}</div>
        </div>
      </div>
    </StandByShell>
  );
}

window.CenteredTempDashboard = CenteredTempDashboard;
window.StandByClockVariant = StandByClockVariant;
window.StandByShell = StandByShell;
