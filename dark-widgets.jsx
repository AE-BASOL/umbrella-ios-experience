// Widgets v2 — same layout as originals, but each item gets its own
// data-state so it picks up item-specific CSS palette variables.
// The V2 components duplicate the original markup but swap
// data-state from "rainy"/"sunny"/"neutral" to the item id.

function V2SmallWidget({ id }) {
  const cfg = window.ITEM_WIDGETS && window.ITEM_WIDGETS[id];
  if (!cfg) return null;
  const loc = cfg.location;
  const v = cfg.value;
  const c = cfg.cap;
  const note = cfg.smallNote;
  return (
    <div className="widget small item-widget" data-state={id}>
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

function V2MediumWidget({ id }) {
  const cfg = window.ITEM_WIDGETS && window.ITEM_WIDGETS[id];
  if (!cfg) return null;
  const loc = cfg.locationLong;
  return (
    <div className="widget medium item-widget" data-state={id}>
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

window.V2SmallWidget = V2SmallWidget;
window.V2MediumWidget = V2MediumWidget;

// ─── 8-item grid widget — each cell in its own item palette ─────
const GRID_ITEMS = [
{ id: "umbrella", label: "Umbrella" },
{ id: "sunglasses", label: "Shades" },
{ id: "sunscreen", label: "SPF" },
{ id: "jacket", label: "Jacket" },
{ id: "coat", label: "Coat" },
{ id: "boots", label: "Boots" },
{ id: "hat", label: "Hat" },
{ id: "water", label: "Water" }];


// Item palettes for grid cells — light variant
const GRID_PALETTES = {
  umbrella: { bg: "#EDF4FB", surface: "#D6E8F8", border: "#B5D4F0", fill: "#185FA5", headline: "#0C447C", accent: "#378ADC", tertiary: "rgba(55,138,221,0.55)" },
  sunglasses: { bg: "#FFF8EB", surface: "#FFEDC8", border: "#FAC775", fill: "#854F0B", headline: "#63380A", accent: "#BA7517", tertiary: "rgba(186,117,23,0.55)" },
  sunscreen: { bg: "#FFF5ED", surface: "#FFE6D0", border: "#F5B87A", fill: "#9A3A12", headline: "#6A2410", accent: "#C4582A", tertiary: "rgba(196,88,42,0.55)" },
  jacket: { bg: "#F0F3F7", surface: "#DEE5EE", border: "#B8C8DA", fill: "#3E5268", headline: "#2A3548", accent: "#5A7090", tertiary: "rgba(90,112,144,0.55)" },
  coat: { bg: "#EFF3FA", surface: "#DAE4F5", border: "#B0C4E0", fill: "#2E4568", headline: "#1A2C4C", accent: "#4A6898", tertiary: "rgba(74,104,152,0.55)" },
  boots: { bg: "#EDF2F9", surface: "#D4E2F2", border: "#A8C4E0", fill: "#1F4A78", headline: "#0E2A48", accent: "#4A86C0", tertiary: "rgba(74,134,192,0.55)" },
  hat: { bg: "#F9F0E8", surface: "#F0DDCA", border: "#DEB896", fill: "#6A3418", headline: "#3A1C08", accent: "#A05828", tertiary: "rgba(160,88,40,0.55)" },
  water: { bg: "#ECF7F6", surface: "#D0ECE9", border: "#96D4CE", fill: "#186460", headline: "#0E3234", accent: "#2A8A84", tertiary: "rgba(42,138,132,0.55)" }
};

function V2GridWidget({ fired: firedProp, location = "İstanbul, Beşiktaş" }) {
  // Default: umbrella, sunglasses, jacket, water active
  const fired = firedProp || new Set(["umbrella", "sunglasses", "jacket", "water"]);
  const activeCount = fired.size;
  const FF = "-apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif";
  const FM = "ui-monospace,'SF Mono',Menlo,Consolas,monospace";

  return (
    <div style={{
      width: 360, height: 170, borderRadius: 22, position: "relative", overflow: "hidden",
      background: "#F7FAFF",
      border: "0.5px solid rgba(200,210,220,0.6)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(255,255,255,0.5)"
    }}>
      <div style={{
        padding: "12px 14px 10px",
        height: "100%",
        display: "flex", flexDirection: "column", gap: 8
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 9, fontWeight: 600, color: "#6D798A",
            fontFamily: FF
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 9999, background: "#6D798A" }}></span>
            <span>{location}</span>
          </div>
          <div style={{
            fontSize: 10, fontWeight: 700, fontFamily: FM,
            color: "#394350",
            background: "rgba(213,217,223,0.6)",
            padding: "3px 9px", borderRadius: 9999
          }}>{activeCount} active</div>
        </div>
        {/* 4×2 grid — each cell in its own palette */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 5, flex: 1
        }}>
          {GRID_ITEMS.map((it) => {
            const on = fired.has(it.id);
            const cp = GRID_PALETTES[it.id];
            return (
              <div key={it.id} style={{
                borderRadius: 10,
                background: on ? cp.surface : "rgba(237,239,242,0.6)",
                border: on ?
                `0.5px solid ${cp.border}` :
                "0.5px solid rgba(213,217,223,0.5)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 2, position: "relative",
                transition: "all 200ms ease"
              }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: on ? 1 : 0.35,
                  color: on ? cp.fill : "#5A6878"
                }}>
                  <AGlyph kind={it.id} size={18} />
                </div>
                <div style={{
                  fontSize: 8, fontWeight: 600, letterSpacing: "0.1px",
                  color: on ? cp.headline : "rgba(90,104,121,0.6)",
                  fontFamily: FF
                }}>{it.label}</div>
                {on &&
                <span style={{
                  position: "absolute", top: 4, right: 4,
                  width: 4, height: 4, borderRadius: 9999,
                  background: cp.fill
                }}></span>
                }
              </div>);

          })}
        </div>
      </div>
    </div>);

}

window.V2GridWidget = V2GridWidget;