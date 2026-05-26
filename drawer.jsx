// drawer.jsx — Basit şehir listesi + arama

const SAVED_CITIES = [
  { id: "ist", name: "İstanbul",   sub: "Beşiktaş",    temp: 14, state: "rainy",   rainPct: 78 },
  { id: "ank", name: "Ankara",     sub: "Çankaya",      temp: 9,  state: "neutral", rainPct: 22 },
  { id: "izm", name: "İzmir",      sub: "Karşıyaka",    temp: 21, state: "sunny",   rainPct: 4  },
  { id: "ams", name: "Amsterdam",  sub: "Centrum",      temp: 11, state: "rainy",   rainPct: 64 },
  { id: "lis", name: "Lisbon",     sub: "Alfama",       temp: 19, state: "sunny",   rainPct: 8  },
];

const SEARCH_DB = [
  { id: "ber", name: "Berlin",        country: "Germany", temp: 8,  state: "neutral", rainPct: 30 },
  { id: "lon", name: "London",        country: "UK",      temp: 10, state: "rainy",   rainPct: 70 },
  { id: "par", name: "Paris",         country: "France",  temp: 12, state: "rainy",   rainPct: 55 },
  { id: "rom", name: "Rome",          country: "Italy",   temp: 17, state: "sunny",   rainPct: 12 },
  { id: "ath", name: "Athens",        country: "Greece",  temp: 22, state: "sunny",   rainPct: 6  },
  { id: "mad", name: "Madrid",        country: "Spain",   temp: 18, state: "sunny",   rainPct: 10 },
  { id: "bcn", name: "Barcelona",     country: "Spain",   temp: 19, state: "sunny",   rainPct: 14 },
  { id: "vie", name: "Vienna",        country: "Austria", temp: 9,  state: "neutral", rainPct: 28 },
  { id: "cph", name: "Copenhagen",    country: "Denmark", temp: 7,  state: "rainy",   rainPct: 62 },
  { id: "hel", name: "Helsinki",      country: "Finland", temp: 4,  state: "neutral", rainPct: 24 },
  { id: "osl", name: "Oslo",          country: "Norway",  temp: 5,  state: "neutral", rainPct: 32 },
  { id: "stk", name: "Stockholm",     country: "Sweden",  temp: 6,  state: "rainy",   rainPct: 58 },
  { id: "war", name: "Warsaw",        country: "Poland",  temp: 8,  state: "neutral", rainPct: 26 },
  { id: "pra", name: "Prague",        country: "Czechia", temp: 10, state: "neutral", rainPct: 18 },
  { id: "bud", name: "Budapest",      country: "Hungary", temp: 13, state: "sunny",   rainPct: 14 },
  { id: "duv", name: "Dubai",         country: "UAE",     temp: 31, state: "sunny",   rainPct: 0  },
  { id: "tok", name: "Tokyo",         country: "Japan",   temp: 16, state: "rainy",   rainPct: 68 },
  { id: "nyc", name: "New York",      country: "USA",     temp: 13, state: "neutral", rainPct: 22 },
  { id: "sfo", name: "San Francisco", country: "USA",     temp: 15, state: "neutral", rainPct: 30 },
  { id: "lax", name: "Los Angeles",   country: "USA",     temp: 22, state: "sunny",   rainPct: 4  },
];

const PERSONAL_ALERTS_DEFAULT = [
  { id: "umbrella",   name: "Umbrella",        glyph: "umbrella",   on: true,  threshold: 40, unit: "% rain", min: 0,  max: 100, step: 5 },
  { id: "sunglasses", name: "Sunglasses",      glyph: "sunglasses", on: true,  threshold: 4,  unit: "UV",     min: 0,  max: 11,  step: 1 },
  { id: "jacket",     name: "Light jacket",    glyph: "jacket",     on: true,  threshold: 16, unit: "°C feels-like", min: -5, max: 25, step: 1, dir: "below" },
  { id: "coat",       name: "Heavy coat",      glyph: "coat",       on: false, threshold: 6,  unit: "°C feels-like", min: -10, max: 15, step: 1, dir: "below" },
  { id: "sunscreen",  name: "Sunscreen",       glyph: "sunscreen",  on: true,  threshold: 6,  unit: "UV",     min: 0,  max: 11,  step: 1 },
  { id: "water",      name: "Extra water",     glyph: "water",      on: true,  threshold: 26, unit: "°C",     min: 15, max: 40,  step: 1 },
  { id: "wind",       name: "Wind warning",    glyph: "wind",       on: false, threshold: 35, unit: "km/h",   min: 10, max: 80,  step: 5 },
  { id: "boots",      name: "Waterproof boots",glyph: "boots",      on: false, threshold: 70, unit: "% rain", min: 30, max: 100, step: 5 },
  { id: "mask",       name: "Pollen / mask",   glyph: "mask",       on: false, threshold: 7,  unit: "pollen", min: 0,  max: 10,  step: 1 },
  { id: "hat",        name: "Hat / beanie",    glyph: "hat",        on: false, threshold: 4,  unit: "°C feels-like", min: -10, max: 15, step: 1, dir: "below" },
];

// ─── Glyphs ────────────────────────────────────────────────────────────────
function AGlyph({ kind, size = 18 }) {
  const stroke = "var(--icon-dark)";
  const fill   = "var(--icon-light)";
  const sw     = 1.7;
  const p = { viewBox:"0 0 24 24", width:size, height:size, fill:"none", stroke, strokeWidth:sw, strokeLinecap:"round", strokeLinejoin:"round" };
  switch (kind) {
    case "umbrella":   return <svg {...p}><path d="M3 11a9 9 0 0 1 18 0z" fill={fill} stroke="none"/><path d="M3 11a9 9 0 0 1 18 0"/><path d="M12 11v8a2.5 2.5 0 0 0 4 0"/></svg>;
    case "sunglasses": return <svg {...p}><rect x="2.5" y="9" width="8" height="6" rx="2" fill={fill}/><rect x="13.5" y="9" width="8" height="6" rx="2" fill={fill}/><path d="M10.5 11h3"/></svg>;
    case "jacket":     return <svg {...p}><path d="M7 4l-3 3v12h6V11M17 4l3 3v12h-6V11M7 4l5 3 5-3" fill={fill}/><path d="M12 7v14"/></svg>;
    case "coat":       return <svg {...p}><path d="M6 4l-2 4v13h6V13M18 4l2 4v13h-6V13M6 4l6 3 6-3" fill={fill}/><path d="M12 7v14M9 17h.01M15 17h.01"/></svg>;
    case "sunscreen":  return <svg {...p}><circle cx="12" cy="12" r="3.5" fill={fill}/><path d="M12 4v2M12 18v2M4 12h2M18 12h2M6 6l1.5 1.5M16.5 16.5L18 18M6 18l1.5-1.5M16.5 7.5L18 6"/></svg>;
    case "water":      return <svg {...p}><path d="M12 3c4 5 6 8.5 6 11.5a6 6 0 0 1-12 0C6 11.5 8 8 12 3z" fill={fill}/></svg>;
    case "wind":       return <svg {...p}><path d="M3 8h12a2.5 2.5 0 1 0-2.5-2.5M3 16h16a2.5 2.5 0 1 1-2.5 2.5M3 12h9"/></svg>;
    case "boots":      return <svg {...p}><path d="M8 3v10l-3 3v5h11v-3l-3-2v-3l3-2V3z" fill={fill}/></svg>;
    case "mask":       return <svg {...p}><path d="M5 10c0-2 2-3 7-3s7 1 7 3v3c0 3-3 5-7 5s-7-2-7-5z" fill={fill}/><path d="M5 12H3M19 12h2"/></svg>;
    case "hat":        return <svg {...p}><path d="M4 18h16M7 18c0-4 2-9 5-9s5 5 5 9" fill={fill}/></svg>;
    case "search":     return <svg {...p}><circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/></svg>;
    case "plus":       return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case "close":      return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case "trash":      return <svg {...p}><path d="M5 7h14M9 7V5h6v2M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12"/></svg>;
    case "pin":        return <svg {...p}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" fill={fill}/><circle cx="12" cy="10" r="2.2" fill="var(--bg)" stroke="none"/></svg>;
    case "check":      return <svg {...p}><path d="M5 12l5 5L19 7"/></svg>;
    case "bell":       return <svg {...p}><path d="M6 16h12l-1.5-2V10a4.5 4.5 0 0 0-9 0v4z" fill={fill}/><path d="M10 19a2 2 0 0 0 4 0"/></svg>;
    default: return null;
  }
}

// ─── State pip ─────────────────────────────────────────────────────────────
function StatePip({ state }) {
  const c = state === "rainy"   ? "var(--rainy-bar-fill)"   :
            state === "sunny"   ? "var(--sunny-bar-fill)"   :
                                  "var(--neutral-bar-fill)";
  return <span style={{ width:7, height:7, borderRadius:9999, background:c, flexShrink:0, display:"inline-block" }}></span>;
}

// ─── Rain icon (mini) ──────────────────────────────────────────────────────
function RainBadge({ pct, state }) {
  const color = state === "rainy"   ? "var(--rainy-accent)"   :
                state === "sunny"   ? "var(--sunny-accent)"   :
                                      "var(--neutral-accent)";
  return (
    <span style={{ fontSize:10, fontWeight:700, color, fontVariantNumeric:"tabular-nums", whiteSpace:"nowrap", letterSpacing:"-0.2px" }}>
      {pct}%
    </span>
  );
}

// ─── City row ──────────────────────────────────────────────────────────────
function CityRow({ city, active, onSelect, onDelete, deletable }) {
  const FF = "-apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif";
  const bg = active
    ? (city.state === "rainy"   ? "rgba(24,95,165,0.08)"  :
       city.state === "sunny"   ? "rgba(186,117,23,0.08)" :
                                  "rgba(109,121,138,0.08)")
    : "transparent";
  const border = active
    ? (city.state === "rainy"   ? "0.5px solid var(--rainy-border)"   :
       city.state === "sunny"   ? "0.5px solid var(--sunny-border)"   :
                                  "0.5px solid var(--neutral-border)")
    : "0.5px solid transparent";

  return (
    <div style={{ display:"flex", alignItems:"center", gap:0 }}>
      <button
        onClick={onSelect}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "11px 14px",
          borderRadius: 14,
          background: bg,
          border,
          cursor: "pointer",
          textAlign: "left",
          fontFamily: FF,
          transition: "background 160ms ease",
        }}
      >
        <StatePip state={city.state} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:600, color:"#1B1C20", letterSpacing:"-0.2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {city.name}
          </div>
          <div style={{ fontSize:11, fontWeight:500, color:"#8E8F96", marginTop:1 }}>
            {city.sub || city.country || ""}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <RainBadge pct={city.rainPct} state={city.state} />
          <span style={{ fontSize:15, fontWeight:700, color:"#1B1C20", letterSpacing:"-0.3px", fontVariantNumeric:"tabular-nums" }}>
            {city.temp}°
          </span>
        </div>
      </button>
      {deletable && (
        <button
          onClick={onDelete}
          style={{
            width: 32, height: 32,
            borderRadius: 9999,
            border: "none",
            background: "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            color: "#C7C8CF",
            marginLeft: 4,
            flexShrink: 0,
            transition: "color 150ms ease",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#E53935"}
          onMouseLeave={e => e.currentTarget.style.color = "#C7C8CF"}
          aria-label={`Remove ${city.name}`}
        >
          <AGlyph kind="trash" size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Search result row ─────────────────────────────────────────────────────
function ResultRow({ city, added, onAdd }) {
  const FF = "-apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:12, background: added ? "rgba(0,0,0,0.03)" : "transparent" }}>
      <StatePip state={city.state} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#1B1C20", letterSpacing:"-0.15px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", fontFamily:FF }}>
          {city.name}
        </div>
        <div style={{ fontSize:10.5, fontWeight:500, color:"#8E8F96", fontFamily:FF }}>
          {city.country} · {city.temp}°
        </div>
      </div>
      <button
        onClick={onAdd}
        disabled={added}
        style={{
          width: 26, height: 26,
          borderRadius: 9999,
          border: "none",
          background: added ? "rgba(0,0,0,0.06)" : "#1B1C20",
          color: added ? "#8E8F96" : "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: added ? "default" : "pointer",
          flexShrink: 0,
          transition: "background 150ms ease",
        }}
        aria-label={added ? "Already added" : `Add ${city.name}`}
      >
        {added
          ? <AGlyph kind="check" size={12} />
          : <AGlyph kind="plus" size={12} />
        }
      </button>
    </div>
  );
}

// ─── Main Drawer ───────────────────────────────────────────────────────────
function LeftDrawer({ open, onClose, activeCityId, onSelectCity }) {
  const FF = "-apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif";
  const [cities, setCities] = React.useState(SAVED_CITIES);
  const [activeId, setActiveId] = React.useState(activeCityId || SAVED_CITIES[0]?.id);
  const [searching, setSearching] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef(null);

  // Sync active city from prop when drawer opens
  React.useEffect(() => {
    if (open && activeCityId) setActiveId(activeCityId);
  }, [open, activeCityId]);

  // Focus search input when search opens
  React.useEffect(() => {
    if (searching && inputRef.current) inputRef.current.focus();
  }, [searching]);

  // Close search state when drawer closes
  React.useEffect(() => {
    if (!open) {
      setSearching(false);
      setQuery("");
    }
  }, [open]);

  const savedIds = new Set(cities.map(c => c.id));

  const filteredResults = query.trim().length > 0
    ? SEARCH_DB.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.country.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_DB;

  function handleSelect(city) {
    setActiveId(city.id);
    if (onSelectCity) onSelectCity(city);
    onClose();
  }

  function handleDelete(cityId) {
    setCities(prev => {
      const next = prev.filter(c => c.id !== cityId);
      // If deleting the active city, switch to first remaining
      if (cityId === activeId && next.length > 0) {
        setActiveId(next[0].id);
        if (onSelectCity) onSelectCity(next[0]);
      }
      return next;
    });
  }

  function handleAdd(city) {
    if (savedIds.has(city.id)) return;
    setCities(prev => [...prev, { ...city, sub: city.country }]);
  }

  return (
    <>
      <div className={`dw-backdrop ${open ? "on" : ""}`} onClick={onClose}></div>
      <aside
        className={`dw cc-drawer ${open ? "on" : ""}`}
        aria-hidden={!open}
        style={{ display:"flex", flexDirection:"column" }}
      >
        {/* Header */}
        <div className="cc-drawer-head">
          <div>
            <div className="cc-eyebrow">Şehirlerim</div>
            <div className="cc-display" style={{ fontSize:22 }}>
              {searching ? "Şehir Ara" : "Şehirler"}
            </div>
          </div>
          <button className="dw-close cc-close" onClick={onClose} aria-label="Close">
            <AGlyph kind="close" size={14} />
          </button>
        </div>

        {/* Hair rule */}
        <div style={{ height:"0.5px", background:"rgba(0,0,0,0.07)", margin:"2px 20px 0" }}></div>

        {/* Scrollable body */}
        <div className="cc-scroll" style={{ flex:1, overflowY:"auto", padding:"10px 14px 24px" }}>

          {!searching ? (
            <>
              {/* City list */}
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {cities.map(city => (
                  <CityRow
                    key={city.id}
                    city={city}
                    active={city.id === activeId}
                    onSelect={() => handleSelect(city)}
                    onDelete={() => handleDelete(city.id)}
                    deletable={cities.length > 1}
                  />
                ))}
              </div>

              {/* Add city button */}
              <button
                onClick={() => setSearching(true)}
                style={{
                  marginTop: 14,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  padding: "11px 0",
                  borderRadius: 14,
                  border: "0.5px dashed rgba(0,0,0,0.15)",
                  background: "transparent",
                  color: "#8E8F96",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: FF,
                  cursor: "pointer",
                  transition: "background 150ms ease, color 150ms ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; e.currentTarget.style.color = "#1B1C20"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8E8F96"; }}
              >
                <AGlyph kind="plus" size={14} />
                <span>Şehir ekle</span>
              </button>
            </>
          ) : (
            <>
              {/* Search bar */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 12px",
                borderRadius: 12,
                background: "rgba(0,0,0,0.05)",
                border: "0.5px solid rgba(0,0,0,0.08)",
                marginBottom: 10,
              }}>
                <AGlyph kind="search" size={15} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Şehir veya ülke ara…"
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: FF,
                    color: "#1B1C20",
                  }}
                />
                {query.length > 0 && (
                  <button
                    onClick={() => setQuery("")}
                    style={{ border:"none", background:"transparent", cursor:"pointer", color:"#8E8F96", padding:0, display:"flex", alignItems:"center" }}
                  >
                    <AGlyph kind="close" size={12} />
                  </button>
                )}
              </div>

              {/* Cancel */}
              <button
                onClick={() => { setSearching(false); setQuery(""); }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 0",
                  marginBottom: 8,
                  border: "none",
                  background: "transparent",
                  color: "#8E8F96",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: FF,
                  cursor: "pointer",
                  letterSpacing: "-0.1px",
                }}
              >
                İptal
              </button>

              {/* Results */}
              <div style={{ display:"flex", flexDirection:"column" }}>
                {filteredResults.length === 0 && (
                  <div style={{ textAlign:"center", fontSize:12, color:"#8E8F96", padding:"20px 0", fontFamily:FF }}>
                    Şehir bulunamadı
                  </div>
                )}
                {filteredResults.map(city => (
                  <ResultRow
                    key={city.id}
                    city={city}
                    added={savedIds.has(city.id)}
                    onAdd={() => handleAdd(city)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

window.LeftDrawer = LeftDrawer;
window.AGlyph = AGlyph;
window.PERSONAL_ALERTS_DEFAULT = PERSONAL_ALERTS_DEFAULT;
window.SAVED_CITIES = SAVED_CITIES;
window.SEARCH_DB = SEARCH_DB;
