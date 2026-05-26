// Alt settings — UmbrellaToday's settings screen in the dark Alternative
// palette, structurally inspired by Yandex Weather's settings but adapted to
// UmbrellaToday's domain (alert packs, personal alerts, live brief).
//
// Screens
//   · AltSettingsMain         — root settings page
//   · AltSettingsNotifications — sub-page: toggle list
//   · AltSettingsLiveBrief    — sub-page: lock-screen preview + toggle
//
// Palette is identical to the rest of the Alternative board:
//   bg #0e0f12 · surface rgba(28,32,42,0.62) · card rgba(20,22,28,0.95)
//   ink #f0f3f8 · tertiary rgba(220,228,240,0.55)

const AS_FF = "-apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif";
const AS_FM = "ui-monospace,'SF Mono',Menlo,Consolas,monospace";

// ═══ Atoms ════════════════════════════════════════════════════════════════
function ASNavBar({ title, onBack, hint }) {
  return (
    <div style={{
      position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "12px 14px 8px",
      minHeight: 42
    }}>
      {onBack &&
      <button onClick={onBack} aria-label="Back" style={{
        position: "absolute", left: 14, top: 10,
        width: 38, height: 38, borderRadius: 9999, border: "none", cursor: "pointer",
        background: "rgba(28,32,42,0.78)",
        color: "#f0f3f8",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
        stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      }
      <div style={{
        fontSize: 15, fontWeight: 600, color: "#f0f3f8", letterSpacing: "-0.2px",
        fontFamily: AS_FF
      }}>{title}</div>
      {hint &&
      <div style={{
        position: "absolute", right: 18, top: 18,
        fontSize: 10, fontWeight: 600, fontFamily: AS_FM,
        color: "rgba(220,228,240,0.4)", letterSpacing: "0.3px"
      }}>{hint}</div>
      }
    </div>);

}

function ASGroup({ title, children }) {
  return (
    <div style={{ padding: "14px 14px 0" }}>
      {title &&
      <div style={{
        padding: "0 4px 8px",
        fontSize: 13, fontWeight: 700, color: "#f0f3f8",
        letterSpacing: "-0.1px", fontFamily: AS_FF
      }}>{title}</div>
      }
      <div style={{
        borderRadius: 18,
        background: "rgba(20,22,28,0.95)",
        border: "0.5px solid rgba(255,255,255,0.05)",
        overflow: "hidden"
      }}>
        {children}
      </div>
    </div>);

}

function ASRow({ children, divider }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 16px",
      borderTop: divider ? "0.5px solid rgba(255,255,255,0.06)" : "none"
    }}>{children}</div>);

}

// Pill-style segmented control matching the inspiration:
// active option has a dark "lozenge" with a subtle border; inactive options
// sit flat on the card's surface.
function ASSegmented({ options, value, onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "stretch",
      padding: 4,
      borderRadius: 14,
      background: "rgba(15,17,24,0.65)",
      border: "0.5px solid rgba(255,255,255,0.04)",
      width: "100%"
    }}>
      {options.map((opt) => {
        const on = opt === value;
        return (
          <button key={opt} type="button"
          onClick={() => onChange && onChange(opt)}
          style={{
            flex: 1, border: "none", cursor: "pointer",
            padding: "10px 4px",
            borderRadius: 11,
            background: on ? "rgba(40,44,54,0.95)" : "transparent",
            boxShadow: on ? "inset 0 0 0 0.5px rgba(255,255,255,0.10)" : "none",
            color: on ? "#f0f3f8" : "rgba(220,228,240,0.55)",
            fontFamily: AS_FF, fontSize: 13.5, fontWeight: on ? 700 : 500,
            letterSpacing: "-0.1px",
            transition: "all 180ms ease"
          }}>
            {opt}
          </button>);

      })}
    </div>);

}

// Generic toggle switch (iOS-style)
function ASToggle({ on, onChange }) {
  return (
    <button onClick={() => onChange && onChange(!on)} aria-pressed={on} type="button"
    style={{
      width: 44, height: 26, borderRadius: 9999, border: "none", cursor: "pointer",
      background: on ? "#f0f3f8" : "rgba(60,66,78,0.95)",
      position: "relative", flexShrink: 0,
      transition: "background 200ms ease"
    }}>
      <span style={{
        position: "absolute", top: 3, left: on ? 21 : 3,
        width: 20, height: 20, borderRadius: 9999,
        background: on ? "#0e0f12" : "#dde4ef",
        transition: "left 220ms cubic-bezier(.2,.7,.2,1), background 220ms ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.35)"
      }}></span>
    </button>);

}

// Section label that sits above a group of rows (mimicking "Appearance",
// "Notifications" headers in the inspiration).
function ASSectionTitle({ children }) {
  return (
    <div style={{
      padding: "22px 18px 8px",
      fontSize: 17, fontWeight: 700, color: "#f0f3f8",
      letterSpacing: "-0.3px", fontFamily: AS_FF
    }}>{children}</div>);

}

// Inline mini glyph used in setting row labels. Strokes only.
function ASGlyph({ kind, size = 18, color = "rgba(220,228,240,0.65)" }) {
  const p = { viewBox: "0 0 24 24", width: size, height: size, fill: "none",
    stroke: color, strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (kind) {
    case "thermometer":
      return <svg {...p}><path d="M10 4a2 2 0 0 1 4 0v10.2a4 4 0 1 1-4 0z" /><line x1="12" y1="6" x2="12" y2="14" /></svg>;
    case "wind":
      return <svg {...p}><path d="M3 8h12a2.5 2.5 0 1 0-2.5-2.5" /><path d="M3 16h16a2.5 2.5 0 1 1-2.5 2.5" /><path d="M3 12h9" /></svg>;
    case "gauge":
      return <svg {...p}><circle cx="12" cy="13" r="8" /><path d="M12 13l4-4" /><path d="M4 13a8 8 0 0 1 16 0" /></svg>;
    case "bell":
      return <svg {...p}><path d="M6 16h12l-1.5-2V10a4.5 4.5 0 0 0-9 0v4z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>;
    case "alert":
      return <svg {...p}><path d="M12 4 L 21 20 L 3 20 Z" /><line x1="12" y1="10" x2="12" y2="14" /><circle cx="12" cy="17" r="0.8" fill={color} /></svg>;
    case "pin":
      return <svg {...p}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" /><circle cx="12" cy="10" r="2.2" /></svg>;
    case "lock":
      return <svg {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
    case "info":
      return <svg {...p}><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16" /><circle cx="12" cy="8" r="0.8" fill={color} /></svg>;
    case "chev":
      return <svg {...p}><path d="M9 6l6 6-6 6" /></svg>;
    case "clock":
      return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case "cloud":
      return <svg {...p}><path d="M6 18a4 4 0 0 1 1-7.9 5 5 0 0 1 9.5-1.1A4 4 0 1 1 17 18z" /></svg>;
    default:return null;
  }
}

// Nav row: icon · label · trailing value · chevron
function ASNavRow({ glyph, label, value, onClick, divider }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <button type="button" onClick={onClick}
    onPointerDown={() => setPressed(true)}
    onPointerUp={() => setPressed(false)}
    onPointerLeave={() => setPressed(false)}
    style={{
      width: "100%", border: "none", cursor: "pointer",
      background: pressed ? "rgba(255,255,255,0.04)" : "transparent",
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 16px",
      borderTop: divider ? "0.5px solid rgba(255,255,255,0.06)" : "none",
      textAlign: "left", fontFamily: AS_FF,
      transition: "background 120ms ease"
    }}>
      {glyph && <ASGlyph kind={glyph} size={18} />}
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#f0f3f8", letterSpacing: "-0.1px" }}>
        {label}
      </span>
      {value &&
      <span style={{
        fontSize: 13, fontWeight: 500, color: "rgba(220,228,240,0.55)",
        letterSpacing: "-0.05px"
      }}>{value}</span>
      }
      <ASGlyph kind="chev" size={14} color="rgba(220,228,240,0.55)" />
    </button>);

}

// "My umbrellas" — alert pack preset row, with a custom small umbrella tile.
function ASPackRow({ pack, onClick, noTopBorder }) {
  return (
    <button type="button" onClick={onClick} style={{
      width: "100%", border: "none", background: "transparent", cursor: "pointer",
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 16px",
      borderTop: noTopBorder ? "none" : "0.5px solid rgba(255,255,255,0.06)",
      textAlign: "left", fontFamily: AS_FF
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9999, flexShrink: 0,
        background: "linear-gradient(140deg, #2b65b8 0%, #1a3358 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.12)"
      }}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="rgba(245,250,255,0.94)">
          <path d="M3 11a9 9 0 0 1 18 0z" />
          <path d="M12 11v8a2 2 0 0 0 4 0" stroke="rgba(245,250,255,0.94)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#f0f3f8", letterSpacing: "-0.1px" }}>
        Alert pack
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(220,228,240,0.55)" }}>{pack}</span>
      <ASGlyph kind="chev" size={14} color="rgba(220,228,240,0.4)" />
    </button>);

}

// ═══ Backdrop sheet container — shared by every popup ════════════════════
function ASSheet({ onClose, children, height }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0, zIndex: 20,
        background: "rgba(8,10,14,0.55)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        animation: "alt-backdrop-in 220ms ease both"
      }}></div>
      <div style={{
        position: "absolute", zIndex: 21,
        left: 0, right: 0, bottom: 0,
        maxHeight: height || "70%",
        background: "#15171c",
        borderRadius: "24px 24px 0 0",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderBottom: "none",
        boxShadow: "0 -16px 36px rgba(0,0,0,0.6)",
        animation: "alt-sheet-in 280ms cubic-bezier(.2,.7,.2,1) both",
        display: "flex", flexDirection: "column",
        color: "#f0f3f8", fontFamily: AS_FF,
        overflow: "hidden"
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 9999, background: "rgba(255,255,255,0.18)" }}></div>
        </div>
        {children}
      </div>
    </>);

}

// ═══ iOS-style drum / wheel time picker ══════════════════════════════════
// Renders three "wheels" — hour · minute · meridiem — each scrollable.
// Behaviour is decorative (visual fidelity to iOS UIDatePicker), not a
// full keyboard-accessible picker.
function ASTimePicker({ initial = "07:30", onClose, onSave }) {
  const [h, setH] = React.useState(parseInt(initial.split(":")[0], 10) % 12 || 12);
  const [m, setM] = React.useState(parseInt(initial.split(":")[1] || "0", 10));
  const [ap, setAp] = React.useState(parseInt(initial.split(":")[0], 10) >= 12 ? "PM" : "AM");

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <ASSheet onClose={onClose} height="60%">
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 18px 8px"
      }}>
        <button onClick={onClose} type="button" style={{
          border: "none", background: "transparent", color: "rgba(220,228,240,0.6)",
          fontFamily: AS_FF, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 6
        }}>Cancel</button>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f3f8", letterSpacing: "-0.2px" }}>
          Set time
        </div>
        <button onClick={() => onSave && onSave({ h, m, ap })} type="button" style={{
          border: "none", background: "transparent", color: "#f0f3f8",
          fontFamily: AS_FF, fontSize: 14, fontWeight: 700, cursor: "pointer", padding: 6,
          letterSpacing: "-0.1px"
        }}>Done</button>
      </div>

      <div style={{
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        height: 220, padding: "0 20px 16px"
      }}>
        {/* selection band */}
        <div style={{
          position: "absolute", left: 20, right: 20, top: "50%", height: 38,
          transform: "translateY(-50%)",
          borderRadius: 10,
          background: "rgba(255,255,255,0.06)",
          pointerEvents: "none"
        }}></div>
        <Wheel values={hours.map((n) => n.toString().padStart(2, "0"))} selected={h.toString().padStart(2, "0")} onSelect={(v) => setH(parseInt(v, 10))} />
        <div style={{ padding: "0 4px", color: "rgba(220,228,240,0.85)", fontSize: 22, fontWeight: 700, fontFamily: AS_FM, lineHeight: 1, transform: "translateY(-1px)" }}>:</div>
        <Wheel values={minutes.map((n) => n.toString().padStart(2, "0"))} selected={m.toString().padStart(2, "0")} onSelect={(v) => setM(parseInt(v, 10))} />
        <Wheel values={["AM", "PM"]} selected={ap} onSelect={setAp} short />
      </div>
    </ASSheet>);

}

// Drum-style scroll picker for one column. CSS scroll-snap gives the iOS feel
// without writing a custom inertia system.
function Wheel({ values, selected, onSelect, short }) {
  const ref = React.useRef(null);
  const itemH = 38;
  const padded = ["", "", ...values, "", ""]; // padding for centring

  // Snap to selected on mount
  React.useEffect(() => {
    if (!ref.current) return;
    const idx = values.indexOf(selected);
    if (idx >= 0) ref.current.scrollTop = idx * itemH;
  }, []);

  const onScroll = (e) => {
    const idx = Math.round(e.target.scrollTop / itemH);
    const v = values[idx];
    if (v != null && v !== selected) onSelect && onSelect(v);
  };

  return (
    <div ref={ref} onScroll={onScroll}
    style={{
      flex: short ? "0 0 76px" : "1 1 0",
      height: itemH * 5,
      overflowY: "auto", overflowX: "hidden",
      scrollSnapType: "y mandatory",
      scrollbarWidth: "none",
      WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
      maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)"
    }}>
      {padded.map((v, i) =>
      <div key={i} style={{
        height: itemH, lineHeight: `${itemH}px`,
        display: "flex", alignItems: "center", justifyContent: "center",
        scrollSnapAlign: "center",
        fontFamily: AS_FM, fontSize: 22, fontWeight: 700,
        color: v === selected ? "#f0f3f8" : "rgba(220,228,240,0.35)",
        letterSpacing: "-0.5px"
      }}>{v}</div>
      )}
    </div>);

}

// ═══ Generic option list popup (alert pack, units, sensitivity) ══════════
function ASOptionPicker({ title, options, value, onClose, onPick }) {
  return (
    <ASSheet onClose={onClose} height="auto">
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 18px 8px"
      }}>
        <div style={{ width: 48 }}></div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f3f8", letterSpacing: "-0.2px" }}>{title}</div>
        <button onClick={onClose} type="button" aria-label="Close" style={{
          width: 32, height: 32, borderRadius: 9999, border: "none", cursor: "pointer",
          background: "rgba(28,32,42,0.8)", color: "#f0f3f8",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
          stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <div style={{ padding: "6px 14px 18px" }}>
        {options.map((opt, i) => {
          const on = opt.id === value;
          return (
            <button key={opt.id} type="button"
            onClick={() => {onPick && onPick(opt.id);onClose && onClose();}}
            style={{
              width: "100%", border: "none", cursor: "pointer",
              background: on ? "rgba(40,44,54,0.95)" : "rgba(20,22,28,0.75)",
              marginBottom: 8, padding: "14px 16px",
              borderRadius: 14,
              display: "flex", alignItems: "flex-start", gap: 12,
              textAlign: "left", fontFamily: AS_FF,
              boxShadow: on ? "inset 0 0 0 0.5px rgba(255,255,255,0.14)" : "inset 0 0 0 0.5px rgba(255,255,255,0.04)"
            }}>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#f0f3f8", letterSpacing: "-0.1px" }}>{opt.name}</span>
                {opt.desc &&
                <span style={{ fontSize: 11.5, fontWeight: 500, color: "rgba(220,228,240,0.55)", lineHeight: 1.4 }}>
                    {opt.desc}
                  </span>
                }
              </div>
              <span style={{
                width: 20, height: 20, borderRadius: 9999, flexShrink: 0,
                background: on ? "#f0f3f8" : "rgba(40,44,54,0.95)",
                border: on ? "none" : "1px solid rgba(255,255,255,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#0e0f12",
                marginTop: 2
              }}>
                {on &&
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L19 7" />
                  </svg>
                }
              </span>
            </button>);

        })}
      </div>
    </ASSheet>);

}

// ═══ Main settings screen ═════════════════════════════════════════════════
function AltSettingsMain({ onBack, onOpen, presetPopup = null }) {
  const [units, setUnits] = React.useState({ temp: "°C", wind: "km/h", press: "hPa" });
  const [appearance, setAppearance] = React.useState("System");
  const [briefTime, setBriefTime] = React.useState("07:30");
  const [popup, setPopup] = React.useState(presetPopup);

  return (
    <div className="alt-shell"
    style={{
      width: "100%", height: "100%",
      background: "#0e0f12",
      color: "#f0f3f8",
      fontFamily: AS_FF,
      paddingTop: 54,
      overflowY: "auto",
      overflowX: "hidden",
      position: "relative"
    }}>
      <ASNavBar title="Settings" onBack={onBack} />

      {/* Preferences — top-level entry */}
      <ASGroup>
        <ASNavRow glyph="bell" label="Preferences" value="10 on"
        onClick={() => onOpen && onOpen("notifications")} />
      </ASGroup>

      {/* Units */}
      <ASGroup>
        <div style={{ padding: "14px 16px 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ASGlyph kind="thermometer" size={16} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#f0f3f8", letterSpacing: "-0.1px" }}>
              Temperature
            </span>
          </div>
          <div style={{ padding: "10px 0 14px" }}>
            <ASSegmented options={["°C", "°F"]} value={units.temp}
            onChange={(v) => setUnits((s) => ({ ...s, temp: v }))} />
          </div>
        </div>
        <div style={{ padding: "4px 16px", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 10 }}>
            <ASGlyph kind="wind" size={16} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#f0f3f8", letterSpacing: "-0.1px" }}>
              Wind speed
            </span>
          </div>
          <div style={{ padding: "10px 0 14px" }}>
            <ASSegmented options={["m/s", "km/h", "mph", "knots"]} value={units.wind}
            onChange={(v) => setUnits((s) => ({ ...s, wind: v }))} />
          </div>
        </div>
        <div style={{ padding: "4px 16px 14px", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 10 }}>
            <ASGlyph kind="gauge" size={16} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#f0f3f8", letterSpacing: "-0.1px" }}>
              Pressure
            </span>
          </div>
          <div style={{ padding: "10px 0 4px" }}>
            <ASSegmented options={["mmHg", "mbar", "hPa", "inHg"]} value={units.press}
            onChange={(v) => setUnits((s) => ({ ...s, press: v }))} />
          </div>
        </div>
      </ASGroup>

      {/* Appearance */}
      {/* Sub-page nav */}
      <ASGroup>
        <ASNavRow glyph="alert" label="Personal alerts" value="5 on"
        onClick={() => onOpen && onOpen("alerts")} />
        <ASNavRow glyph="clock" label="Morning brief" value={briefTime}
        divider onClick={() => onOpen && onOpen("morning")} />
        <ASNavRow glyph="lock" label="Live brief" value="On"
        divider onClick={() => onOpen && onOpen("live")} />
        <ASNavRow glyph="pin" label="Cities" value="3 saved"
        divider onClick={() => onOpen && onOpen("cities")} />
        <ASNavRow glyph="bell" label="Dynamic Island" value="Compact"
        divider onClick={() => onOpen && onOpen("dynamic-island")} />
      </ASGroup>

      {/* About */}
      <ASSectionTitle>About</ASSectionTitle>
      <ASGroup>
        <ASRow>
          <ASGlyph kind="info" size={16} />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#f0f3f8", letterSpacing: "-0.1px" }}>
            Version
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(220,228,240,0.55)", fontFamily: AS_FM }}>
            1.0.0
          </span>
        </ASRow>
        <ASNavRow glyph="cloud" label="Data source" value="Open-Meteo" divider />
      </ASGroup>

      <div style={{ height: 28 }}></div>

      {/* ── Popups ─────────────────────────────────────────────────── */}
      {popup === "time" &&
      <ASTimePicker initial={briefTime}
      onClose={() => setPopup(null)}
      onSave={({ h, m, ap }) => {
        const hh = ap === "PM" ? h % 12 + 12 : h % 12;
        setBriefTime(`${hh.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
        setPopup(null);
      }} />
      }
    </div>);

}

// ═══ Notifications sub-page ═══════════════════════════════════════════════

// Configurable items — tapping opens a detail/threshold page
const NOTIF_CONFIGURABLE = [
{ id: "morning", label: "Morning brief", sub: "Daily — what to bring today.", configDetail: "07:30" },
{ id: "evening", label: "Evening recap", sub: "Tomorrow at a glance.", configDetail: "21:00" },
{ id: "rain_alerts", label: "Rain alerts", sub: "When chance of rain crosses threshold.", configDetail: "≥ 40%" },
{ id: "uv_alerts", label: "UV alerts", sub: "When UV peaks at threshold.", configDetail: "UV ≥ 4" },
{ id: "wind_alerts", label: "Wind alerts", sub: "Strong gusts in the next 6 hours.", configDetail: "≥ 35 km/h" }];


// Simple on/off — no further configuration
const NOTIF_SIMPLE = [
{ id: "tomorrow", label: "Tomorrow preview", sub: "Late-evening look at tomorrow." },
{ id: "weekend", label: "Weekend forecast", sub: "Friday morning — your weekend window." },
{ id: "seven_day", label: "7-day outlook", sub: "Sundays — week-ahead summary." },
{ id: "severe", label: "Severe weather", sub: "Official advisories from local services." },
{ id: "pollen", label: "Pollen forecast", sub: "Daily pollen levels in your area." }];


function AltSettingsNotifications({ onBack }) {
  const [on, setOn] = React.useState({
    morning: true, evening: true, tomorrow: false, weekend: true,
    seven_day: false, rain_alerts: true, uv_alerts: true,
    wind_alerts: false, severe: true, pollen: false
  });
  const [configuringId, setConfiguringId] = React.useState(null);
  const [thresholds, setThresholds] = React.useState({
    morning: "07:30", evening: "21:00",
    rain_alerts: 40, uv_alerts: 4, wind_alerts: 35
  });

  const toggle = (id) => setOn((s) => ({ ...s, [id]: !s[id] }));
  const configItem = NOTIF_CONFIGURABLE.find((x) => x.id === configuringId);

  return (
    <div className="alt-shell"
    style={{
      width: "100%", height: "100%",
      background: "#0e0f12",
      color: "#f0f3f8",
      fontFamily: AS_FF,
      paddingTop: 54,
      overflowY: "auto",
      overflowX: "hidden"
    }}>
      <ASNavBar title="Preferences" onBack={onBack} />

      <div style={{ padding: "4px 18px 14px" }}>
        <div style={{
          fontSize: 12.5, fontWeight: 500, color: "rgba(220,228,240,0.6)",
          lineHeight: 1.45, letterSpacing: "-0.05px"
        }}>
          Each toggle controls a single push. UmbrellaToday only nudges when something is actually worth bringing.
        </div>
      </div>

      {/* ── Configurable alerts — tap row to set thresholds / times ── */}
      <ASGroup title="Configurable">
        {NOTIF_CONFIGURABLE.map((it, i) => {
          const isOn = on[it.id];
          const curVal = thresholds[it.id];
          return (
            <div key={it.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px",
              borderTop: i ? "0.5px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: isOn ? "#f0f3f8" : "rgba(220,228,240,0.45)", letterSpacing: "-0.1px" }}>
                    {it.label}
                  </div>
                  {isOn &&
                  <span style={{
                    fontSize: 10, fontWeight: 700, fontFamily: AS_FM,
                    color: "#0e0f12",
                    background: "rgba(240,243,248,0.88)",
                    padding: "2px 7px",
                    borderRadius: 6,
                    letterSpacing: "0.2px",
                    lineHeight: "16px"
                  }}>{typeof curVal === "string" ? curVal : `${curVal}${it.unit || ""}`}</span>
                  }
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(220,228,240,0.5)", marginTop: 2, lineHeight: 1.35 }}>
                  {it.sub}
                </div>
              </div>
              <ASToggle on={isOn} onChange={() => toggle(it.id)} />
              {/* Chevron always clickable → configure */}
              <div onClick={() => setConfiguringId(it.id)}
                style={{cursor:"pointer", padding:"4px 0 4px 2px", display:"flex", alignItems:"center"}}>
                <ASGlyph kind="chev" size={14} color={isOn ? "rgba(220,228,240,0.45)" : "rgba(220,228,240,0.2)"} />
              </div>
            </div>);
        })}
      </ASGroup>

      {/* ── Simple toggles — just on/off ── */}
      <ASGroup title="On / Off">
        {NOTIF_SIMPLE.map((it, i) => {
          const isOn = on[it.id];
          return (
            <div key={it.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px",
              borderTop: i ? "0.5px solid rgba(255,255,255,0.06)" : "none"
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: isOn ? "#f0f3f8" : "rgba(220,228,240,0.45)", letterSpacing: "-0.1px" }}>
                  {it.label}
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(220,228,240,0.5)", marginTop: 2, lineHeight: 1.35 }}>
                  {it.sub}
                </div>
              </div>
              <ASToggle on={isOn} onChange={() => toggle(it.id)} />
            </div>);

        })}
      </ASGroup>

      <div style={{ height: 28 }}></div>

      {/* ── Configure sheet ── */}
      {configuringId && configItem &&
      <ASSheet onClose={() => setConfiguringId(null)} height="45%">
          <div style={{ padding: "14px 18px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f3f8", letterSpacing: "-0.2px" }}>{configItem.label}</div>
              {!on[configuringId] &&
            <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(220,228,240,0.45)", marginTop: 2 }}>Toggle on to activate · threshold saved</div>
            }
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ASToggle on={on[configuringId]} onChange={() => toggle(configuringId)} />
              <button onClick={() => setConfiguringId(null)} style={{ border: "none", background: "transparent", color: "#f0f3f8", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: AS_FF }}>Done</button>
            </div>
          </div>
          <div style={{ padding: "8px 18px 20px" }}>
            {configuringId === "morning" || configuringId === "evening" ?
          <>
                <div style={{ fontSize: 12, color: "rgba(220,228,240,0.5)", marginBottom: 12 }}>Notification time</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  {["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00"].map((t) =>
              <button key={t} onClick={() => setThresholds((s) => ({ ...s, [configuringId]: t }))} style={{
                padding: "8px 10px", borderRadius: 10, border: "none", cursor: "pointer",
                background: thresholds[configuringId] === t ? "#f0f3f8" : "rgba(255,255,255,0.08)",
                color: thresholds[configuringId] === t ? "#0e0f12" : "rgba(220,228,240,0.7)",
                fontSize: 12, fontWeight: 700, fontFamily: AS_FM
              }}>{t}</button>
              )}
                </div>
              </> :

          <>
                <div style={{ fontSize: 12, color: "rgba(220,228,240,0.5)", marginBottom: 16 }}>
                  {configuringId === "rain_alerts" ? "Notify when rain chance ≥" :
              configuringId === "uv_alerts" ? "Notify when UV index ≥" :
              "Notify when wind gusts ≥"}
                </div>
                <input type="range"
            min={configuringId === "rain_alerts" ? 10 : configuringId === "uv_alerts" ? 1 : 10}
            max={configuringId === "rain_alerts" ? 90 : configuringId === "uv_alerts" ? 11 : 80}
            step={configuringId === "rain_alerts" ? 5 : 1}
            value={thresholds[configuringId] || 0}
            onChange={(e) => setThresholds((s) => ({ ...s, [configuringId]: Number(e.target.value) }))}
            style={{ width: "100%", accentColor: "#f0f3f8" }} />
                <div style={{ textAlign: "center", marginTop: 8, fontSize: 22, fontWeight: 700, color: "#f0f3f8", fontFamily: AS_FM, letterSpacing: "-0.5px" }}>
                  {thresholds[configuringId]}
                  <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(220,228,240,0.55)", marginLeft: 4 }}>
                    {configuringId === "rain_alerts" ? "%" : configuringId === "uv_alerts" ? "UV" : "km/h"}
                  </span>
                </div>
              </>
          }
          </div>
        </ASSheet>
      }
    </div>);

}

// ═══ Personal alerts sub-page — flat, fast ══════════════════════════════
function AltSettingsPersonalAlerts({ onBack }) {
  const [alerts, setAlerts] = React.useState(
    () => (window.PERSONAL_ALERTS_DEFAULT || []).map(a => ({...a}))
  );
  const [editing, setEditing] = React.useState(null); // id of alert being threshold-edited
  const toggle = id => setAlerts(prev => prev.map(a => a.id===id ? {...a, on:!a.on} : a));
  const setVal = (id, v) => setAlerts(prev => prev.map(a => a.id===id ? {...a, threshold:v} : a));
  const active = alerts.filter(a=>a.on).length;

  return (
    <div style={{width:"100%",height:"100%",background:"#0e0f12",color:"#f0f3f8",
      fontFamily:AS_FF,paddingTop:54,overflowY:"auto",overflowX:"hidden"}}>
      <ASNavBar title="Personal alerts" onBack={onBack} hint={`${active} on`}/>

      <div style={{padding:"4px 14px 6px",fontSize:12,color:"rgba(220,228,240,0.45)",lineHeight:1.45}}>
        Tap a threshold to edit it. Toggle to turn an alert on or off.
      </div>

      <ASGroup>
        {alerts.map((a, i) => {
          const isEditing = editing === a.id;
          const dir = a.dir === "below" ? "≤" : "≥";
          return (
            <div key={a.id} style={{borderTop: i ? "0.5px solid rgba(255,255,255,0.06)" : "none"}}>
              {/* Main row */}
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px"}}>
                <div style={{
                  width:32,height:32,borderRadius:9,flexShrink:0,
                  background: a.on ? "rgba(55,138,220,0.18)" : "rgba(255,255,255,0.05)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  transition:"background 200ms",
                }}>
                  {typeof AGlyph !== "undefined" && <AGlyph kind={a.glyph} size={17}/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,
                    color:a.on?"#f0f3f8":"rgba(220,228,240,0.4)",letterSpacing:"-0.1px"}}>
                    {a.name}
                  </div>
                  {/* Inline threshold chip — tap to edit */}
                  <button onClick={() => a.on && setEditing(isEditing ? null : a.id)}
                    style={{
                      border:"none",cursor:a.on?"pointer":"default",
                      background: a.on ? (isEditing?"rgba(240,243,248,0.15)":"rgba(255,255,255,0.07)") : "transparent",
                      borderRadius:6,padding:"2px 7px",marginTop:3,
                      fontSize:11,fontWeight:700,
                      color:a.on?"#378ADC":"rgba(220,228,240,0.3)",
                      fontFamily:AS_FM,letterSpacing:"0.05em",
                      transition:"background 150ms",
                    }}>
                    {a.on ? `${dir} ${a.threshold} ${a.unit}` : "off"}
                  </button>
                </div>
                <ASToggle on={a.on} onChange={() => { toggle(a.id); if(isEditing) setEditing(null); }}/>
              </div>
              {/* Inline threshold editor */}
              {isEditing && a.on && (
                <div style={{padding:"0 16px 14px 60px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    {/* Quick-step buttons */}
                    <button onClick={()=>setVal(a.id,Math.max(a.min,a.threshold-a.step))}
                      style={{width:28,height:28,borderRadius:7,border:"none",cursor:"pointer",
                        background:"rgba(255,255,255,0.08)",color:"#f0f3f8",fontSize:16,fontWeight:400}}>−</button>
                    <div style={{flex:1,textAlign:"center",fontSize:18,fontWeight:700,
                      color:"#378ADC",fontFamily:AS_FM,letterSpacing:"-0.5px"}}>
                      {a.threshold}<span style={{fontSize:11,opacity:0.6,marginLeft:3}}>{a.unit}</span>
                    </div>
                    <button onClick={()=>setVal(a.id,Math.min(a.max,a.threshold+a.step))}
                      style={{width:28,height:28,borderRadius:7,border:"none",cursor:"pointer",
                        background:"rgba(255,255,255,0.08)",color:"#f0f3f8",fontSize:16,fontWeight:400}}>+</button>
                  </div>
                  <input type="range" min={a.min} max={a.max} step={a.step} value={a.threshold}
                    onChange={e=>setVal(a.id,Number(e.target.value))}
                    style={{width:"100%",accentColor:"#378ADC"}}/>
                  <div style={{display:"flex",justifyContent:"space-between",
                    fontSize:9,color:"rgba(220,228,240,0.3)",fontFamily:AS_FM,marginTop:2}}>
                    <span>{a.min}</span><span>{a.max}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </ASGroup>
      <div style={{height:28}}/>
    </div>
  );
}

// ═══ Morning brief sub-page ══════════════════════════════════════════════
const MB_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function AltSettingsMorningBrief({ onBack }) {
  const [enabled, setEnabled] = React.useState(true);
  const [time, setTime] = React.useState("07:30");
  const [days, setDays] = React.useState(new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]));
  const [showPicker, setShowPicker] = React.useState(false);
  const [includedItems, setIncludedItems] = React.useState([
    { icon: "bell",        label: "Umbrella reminder", sub: "When rain chance ≥ 40%", on: true  },
    { icon: "alert",       label: "UV alert",          sub: "When UV index ≥ 4",      on: true  },
    { icon: "thermometer", label: "Layer reminder",    sub: "When feels-like ≤ 16°",  on: true  },
    { icon: "cloud",       label: "Hydration nudge",   sub: "When highs ≥ 26°",       on: false },
  ]);
  const toggleDay = (d) => setDays((prev) => {const n = new Set(prev);n.has(d) ? n.delete(d) : n.add(d);return n;});
  return (
    <div style={{ width: "100%", height: "100%", background: "#0e0f12", color: "#f0f3f8", fontFamily: AS_FF, paddingTop: 54, overflowY: "auto", overflowX: "hidden", position: "relative" }}>
      <ASNavBar title="Morning brief" onBack={onBack} />
      {/* Preview */}
      <div style={{ padding: "4px 14px 16px" }}>
        <div style={{ borderRadius: 18, background: "linear-gradient(135deg,#1a2535 0%,#0f1520 100%)", border: "0.5px solid rgba(55,138,220,0.25)", padding: "16px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg,#2b65b8 0%,#1a3358 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="rgba(245,250,255,0.95)">
              <path d="M3 11a9 9 0 0 1 18 0z" />
              <path d="M12 11v8a2 2 0 0 0 4 0" stroke="rgba(245,250,255,0.95)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(220,228,240,0.5)", letterSpacing: "0.05em", textTransform: "uppercase" }}>UmbrellaToday · {time}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#f0f3f8", letterSpacing: "-0.2px", marginTop: 3 }}>Take an umbrella · 78% rain</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(220,228,240,0.6)", marginTop: 2 }}>Layer up · feels 14° · UV 5 at noon</div>
          </div>
        </div>
      </div>
      {/* Toggle + time */}
      <ASGroup>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#f0f3f8" }}>Morning brief</span>
          <ASToggle on={enabled} onChange={setEnabled} />
        </div>
        {enabled &&
        <div onClick={() => setShowPicker(true)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderTop: "0.5px solid rgba(255,255,255,0.06)", cursor: "pointer" }}>
            <ASGlyph kind="clock" size={16} />
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#f0f3f8" }}>Time</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(220,228,240,0.55)", fontFamily: AS_FM }}>{time}</span>
            <ASGlyph kind="chev" size={14} color="rgba(220,228,240,0.4)" />
          </div>
        }
      </ASGroup>
      {/* Days */}
      {enabled &&
      <>
          <ASSectionTitle>Days</ASSectionTitle>
          <div style={{ padding: "0 14px" }}>
            <div style={{ display: "flex", gap: 5, background: "rgba(20,22,28,0.95)", borderRadius: 14, padding: "10px 10px", border: "0.5px solid rgba(255,255,255,0.05)" }}>
              {MB_DAYS.map((d) =>
            <button key={d} onClick={() => toggleDay(d)} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
              background: days.has(d) ? "#378adc" : "rgba(255,255,255,0.06)",
              color: days.has(d) ? "#fff" : "rgba(220,228,240,0.45)",
              fontSize: 10, fontWeight: 700, fontFamily: AS_FF,
              transition: "background 150ms, color 150ms"
            }}>{d}</button>
            )}
            </div>
          </div>
        </>
      }
      {/* What's included */}
      {enabled &&
      <>
          <ASSectionTitle>What's included</ASSectionTitle>
          <ASGroup>
            {includedItems.map((it, i) =>
            <div key={it.icon} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderTop: i ? "0.5px solid rgba(255,255,255,0.06)" : "none", opacity: it.on ? 1 : 0.5, transition: "opacity 180ms" }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                  background: it.on ? "rgba(55,138,220,0.18)" : "rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center", transition:"background 180ms" }}>
                  <ASGlyph kind={it.icon} size={16} color={it.on ? "#378adc" : "rgba(220,228,240,0.4)"} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: it.on ? "#f0f3f8" : "rgba(220,228,240,0.4)", letterSpacing: "-0.1px" }}>{it.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 400, color: "rgba(220,228,240,0.4)", marginTop: 1 }}>{it.sub}</div>
                </div>
                <ASToggle on={it.on} onChange={() => setIncludedItems(prev => prev.map(x => x.icon===it.icon ? {...x,on:!x.on} : x))}/>
              </div>
            )}
          </ASGroup>
        </>
      }
      <div style={{ height: 28 }} />
      {showPicker &&
      <ASTimePicker initial={time}
      onClose={() => setShowPicker(false)}
      onSave={({ h, m, ap }) => {
        const hh = ap === "PM" ? h % 12 + 12 : h % 12;
        setTime(`${hh.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
        setShowPicker(false);
      }} />
      }
    </div>);

}

// ═══ Cities sub-page ═════════════════════════════════════════════════════
function AltSettingsCities({ onBack }) {
  const [cities, setCities] = React.useState(
    () => (window.SAVED_CITIES || [
    { id: "ist", name: "İstanbul", sub: "Beşiktaş", temp: 14, state: "rainy", rainPct: 78 },
    { id: "ank", name: "Ankara", sub: "Çankaya", temp: 9, state: "neutral", rainPct: 22 },
    { id: "izm", name: "İzmir", sub: "Karşıyaka", temp: 21, state: "sunny", rainPct: 4 }]).
    map((c) => ({ ...c }))
  );
  const [searching, setSearching] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [swipedId, setSwipedId] = React.useState(null);   // city id showing delete
  const [confirmId, setConfirmId] = React.useState(null); // city id showing confirm dialog

  const stateCol = (s) => s === "rainy" ? "#378adc" : s === "sunny" ? "#d8861a" : "#6d7988";
  const DB = window.SEARCH_DB || [];
  const results = query.trim() ? DB.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())) : DB.slice(0, 6);

  const deleteCity = (id) => {
    setCities(prev => prev.filter(c => c.id !== id));
    setConfirmId(null);
    setSwipedId(null);
  };

  // touch/mouse swipe tracking
  const touchStart = React.useRef({});
  const onTouchStart = (id, e) => { touchStart.current = { x: e.touches?.[0]?.clientX ?? e.clientX, id }; };
  const onTouchEnd = (id, e) => {
    const endX = e.changedTouches?.[0]?.clientX ?? e.clientX;
    const dx = endX - (touchStart.current.x || 0);
    if (dx < -50 && touchStart.current.id === id) setSwipedId(id);
    if (dx > 30 && swipedId === id) setSwipedId(null);
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#0e0f12", color: "#f0f3f8", fontFamily: AS_FF, paddingTop: 54, overflowY: "auto", overflowX: "hidden", position:"relative" }}>
      <ASNavBar title="Your places" onBack={onBack} hint={`${cities.length} saved`} />
      <div style={{ padding: "4px 14px 12px" }}>
        {!searching ?
        <button onClick={() => setSearching(true)} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "11px 16px", borderRadius: 14, border: "0.5px dashed rgba(255,255,255,0.15)",
          background: "transparent", color: "rgba(220,228,240,0.5)", fontSize: 13, fontWeight: 600, fontFamily: AS_FF, cursor: "pointer"
        }}>+ Add a place</button> :
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.10)" }}>
            <ASGlyph kind="pin" size={15} color="rgba(220,228,240,0.5)" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="City or country…" autoFocus
              style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 13, fontWeight: 500, color: "#f0f3f8", fontFamily: AS_FF }} />
          </div>
          <button onClick={() => {setSearching(false);setQuery("");}} style={{ width: "100%", padding: "8px 0", border: "none", background: "transparent", color: "rgba(220,228,240,0.55)", fontSize: 13, fontWeight: 600, fontFamily: AS_FF, cursor: "pointer", marginTop: 6 }}>
            Cancel
          </button>
        </>}
      </div>

      {searching && <ASGroup>
        {results.length === 0 && <div style={{ padding: "16px", fontSize: 13, color: "rgba(220,228,240,0.4)", textAlign: "center" }}>No cities found</div>}
        {results.map((c, i) =>
          <div key={c.id} onClick={() => { if (!cities.find(x=>x.id===c.id)) setCities(prev=>[...prev,{...c,sub:c.country}]); setSearching(false);setQuery(""); }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderTop: i ? "0.5px solid rgba(255,255,255,0.06)" : "none", cursor: "pointer" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: stateCol(c.state), flexShrink: 0 }} />
            <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: "#f0f3f8" }}>{c.name}</div><div style={{ fontSize: 11, color: "rgba(220,228,240,0.5)", marginTop: 1 }}>{c.country}</div></div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(220,228,240,0.55)", fontFamily: AS_FM }}>{c.temp}°</span>
          </div>
        )}
      </ASGroup>}

      {!searching && <ASGroup>
        {cities.map((c, i) => {
          const swiped = swipedId === c.id;
          return (
            <div key={c.id} style={{ position:"relative", overflow:"hidden", borderTop: i ? "0.5px solid rgba(255,255,255,0.06)" : "none" }}>
              {/* Delete reveal (shown when swiped) */}
              <div style={{
                position:"absolute", right:0, top:0, bottom:0, width:80,
                background:"#FF3B30", display:"flex", alignItems:"center", justifyContent:"center",
                opacity: swiped ? 1 : 0, transition:"opacity 200ms",
              }}>
                <button onClick={() => setConfirmId(c.id)} style={{
                  width:"100%", height:"100%", border:"none", background:"transparent",
                  color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer",
                }}>Delete</button>
              </div>
              {/* City row */}
              <div
                style={{
                  display:"flex", alignItems:"center", gap:12, padding:"14px 16px",
                  background:"#0e0f12",
                  transform: swiped ? "translateX(-80px)" : "translateX(0)",
                  transition:"transform 200ms cubic-bezier(.2,.7,.2,1)",
                  cursor:"grab",
                }}
                onMouseDown={e => onTouchStart(c.id, e)}
                onMouseUp={e => onTouchEnd(c.id, e)}
                onTouchStart={e => onTouchStart(c.id, e)}
                onTouchEnd={e => onTouchEnd(c.id, e)}
              >
                <span style={{ width:3, height:36, borderRadius:9999, background:stateCol(c.state), flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:600, color:"#f0f3f8", letterSpacing:"-0.3px" }}>{c.name}</div>
                  <div style={{ fontSize:11, color:"rgba(220,228,240,0.5)", marginTop:2, fontStyle:"italic" }}>{c.sub} · <span style={{ fontFamily:AS_FM, fontStyle:"normal" }}>{c.temp}°</span></div>
                </div>
                <div style={{ fontSize:11, color:"rgba(220,228,240,0.3)", letterSpacing:"0.05em" }}>← swipe</div>
              </div>
            </div>
          );
        })}
      </ASGroup>}

      {/* Confirmation dialog */}
      {confirmId && (() => {
        const city = cities.find(c=>c.id===confirmId);
        return (
          <>
            <div onClick={() => setConfirmId(null)} style={{
              position:"absolute", inset:0, background:"rgba(0,0,0,0.55)",
              backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)", zIndex:20,
            }}/>
            <div style={{
              position:"absolute", bottom:40, left:16, right:16, zIndex:21,
              background:"rgba(22,24,32,0.98)",
              border:"0.5px solid rgba(255,255,255,0.10)",
              borderRadius:20, overflow:"hidden",
            }}>
              <div style={{padding:"20px 18px 14px", textAlign:"center"}}>
                <div style={{fontSize:16, fontWeight:700, color:"#f0f3f8", letterSpacing:"-0.2px"}}>Remove {city?.name}?</div>
                <div style={{fontSize:12, color:"rgba(220,228,240,0.5)", marginTop:6}}>It will be removed from your saved places.</div>
              </div>
              <div style={{display:"flex", borderTop:"0.5px solid rgba(255,255,255,0.08)"}}>
                <button onClick={() => setConfirmId(null)} style={{
                  flex:1, padding:"14px", border:"none", borderRight:"0.5px solid rgba(255,255,255,0.08)",
                  background:"transparent", color:"rgba(220,228,240,0.8)", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:AS_FF,
                }}>Cancel</button>
                <button onClick={() => deleteCity(confirmId)} style={{
                  flex:1, padding:"14px", border:"none",
                  background:"transparent", color:"#FF3B30", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:AS_FF,
                }}>Remove</button>
              </div>
            </div>
          </>
        );
      })()}

      <div style={{ height: 28 }} />
    </div>
  );
}
// ═══ Live brief sub-page ══════════════════════════════════════════════════
// Real-time precipitation → "Live brief" — shows the lock-screen activity
// that ticks down rain odds and the next bring-it nudge.
function AltSettingsLiveBrief({onBack}) {
  const [on, setOn] = React.useState(true);
  return (
    <div className="alt-shell"
      style={{width:"100%",height:"100%",background:"#0e0f12",color:"#f0f3f8",
        fontFamily:AS_FF,paddingTop:54,overflowY:"auto",overflowX:"hidden"}}>
      <ASNavBar title="Live brief" onBack={onBack}/>
      {/* Lock-screen preview */}
      <div style={{padding:"10px 18px 6px",display:"flex",justifyContent:"center"}}>
        <div style={{
          width:280,height:200,borderRadius:24,
          background:"linear-gradient(160deg,#2c4880 0%,#0f1d3a 100%)",
          padding:"14px 14px 12px",display:"flex",flexDirection:"column",gap:10,
          position:"relative",overflow:"hidden",boxShadow:"0 18px 40px rgba(0,0,0,0.5)",
        }}>
          <div style={{background:"rgba(0,0,0,0.35)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
            borderRadius:18,padding:"10px 12px",display:"flex",alignItems:"center",gap:10,
            border:"0.5px solid rgba(255,255,255,0.08)"}}>
            <div style={{width:26,height:26,borderRadius:9999,flexShrink:0,background:"#378adc",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M3 11a9 9 0 0 1 18 0z"/><path d="M12 11v8a2 2 0 0 0 4 0" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,fontWeight:700,color:"white",letterSpacing:"-0.1px"}}>Rain ends in 28 min</div>
              <div style={{marginTop:5,height:5,borderRadius:9999,background:"rgba(255,255,255,0.18)",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",left:0,top:0,bottom:0,width:"58%",background:"linear-gradient(90deg,#6aa7ff,#d4e6ff)",borderRadius:9999}}/>
                <span style={{position:"absolute",left:"58%",top:-3,width:11,height:11,marginLeft:-5.5,borderRadius:9999,background:"white",boxShadow:"0 0 0 0.5px rgba(0,0,0,0.25)"}}/>
              </div>
              <div style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,0.75)",fontFamily:AS_FM,letterSpacing:"0.2px",marginTop:4}}>now &nbsp;·&nbsp; clears 10:48</div>
            </div>
          </div>
          <div style={{position:"absolute",bottom:14,left:16,width:38,height:38,borderRadius:9999,
            background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M9 3h6v3l-2 2v8a3 3 0 1 1-6 0V8L5 6V3h4z"/></svg>
          </div>
          <div style={{position:"absolute",bottom:14,right:16,width:38,height:38,borderRadius:9999,
            background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        </div>
      </div>
      <div style={{padding:"22px 18px 8px"}}>
        <div style={{fontSize:22,fontWeight:700,color:"#f0f3f8",letterSpacing:"-0.5px"}}>Real-time rain brief</div>
        <div style={{fontSize:13,fontWeight:500,color:"rgba(220,228,240,0.65)",marginTop:6,lineHeight:1.45}}>
          A live activity on your lock screen that counts down to the next rain change.
        </div>
      </div>
      <div style={{padding:"14px 14px 0"}}>
        <div style={{borderRadius:18,background:"rgba(20,22,28,0.95)",border:"0.5px solid rgba(255,255,255,0.05)"}}>
          <div style={{display:"flex",alignItems:"center",padding:"14px 16px"}}>
            <span style={{flex:1,fontSize:14,fontWeight:600,color:"#f0f3f8"}}>Show on lock screen</span>
            <ASToggle on={on} onChange={setOn}/>
          </div>
          <div style={{display:"flex",alignItems:"center",padding:"14px 16px",borderTop:"0.5px solid rgba(255,255,255,0.06)"}}>
            <span style={{flex:1,fontSize:14,fontWeight:600,color:"#f0f3f8"}}>Dynamic Island</span>
            <ASToggle on={on} onChange={setOn}/>
          </div>
        </div>
      </div>
      <div style={{height:28}}/>
    </div>
  );
}

// ═══ Dynamic Island sub-page ═════════════════════════════════════════════
const DI_STYLES = [
{ id: "compact", label: "Compact", sub: "Icon + value flanking the lens." },
{ id: "expanded", label: "Expanded", sub: "Full card on tap-and-hold." },
{ id: "minimal", label: "Minimal", sub: "Accent dot — least intrusive." }];

const DI_CONDITIONS = [
{ id: "auto", label: "Auto", sub: "Follows current weather." },
{ id: "V2-01", label: "Umbrella", sub: "Rain chance & umbrella advice." },
{ id: "V2-02", label: "Sunglasses", sub: "UV index." },
{ id: "V2-04", label: "Light jacket", sub: "Feels-like temperature." },
{ id: "V2-05", label: "Heavy coat", sub: "Cold feels-like." },
{ id: "V2-06", label: "Waterproof boots", sub: "Rain percentage." },
{ id: "V2-08", label: "Extra water", sub: "Heat feels-like." }];


function AltSettingsDynamicIsland({ onBack }) {
  const [enabled, setEnabled] = React.useState(true);
  const [style, setStyle] = React.useState("compact");
  const [condIds, setCondIds] = React.useState(new Set(["auto","V2-01"]));
  const [lockScreen, setLockScreen] = React.useState(true);
  const [standby, setStandby] = React.useState(false);

  const toggleCond = (id) => setCondIds(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });

  // Preview uses first V2-xx slot selected, fallback V2-01
  const slot = [...condIds].find(id=>id.startsWith("V2-")) || "V2-01";
  const slots = window.V3_SLOTS;
  const s = slots && slots[slot];

  return (
    <div style={{ width: "100%", height: "100%", background: "#0e0f12", color: "#f0f3f8", fontFamily: AS_FF, paddingTop: 54, overflowY: "auto", overflowX: "hidden" }}>
      <ASNavBar title="Dynamic Island" onBack={onBack} />

      {/* Live preview */}
      <div style={{ padding: "4px 14px 16px" }}>
        <div style={{
          borderRadius: 22, overflow: "hidden",
          background: "linear-gradient(180deg,#1a1a24 0%,#0a0a0f 100%)",
          height: 110, position: "relative", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {/* status bar stub */}
          <div style={{ position: "absolute", top: 12, left: 22, fontSize: 13, fontWeight: 600, color: "#fff" }}>9:41</div>
          {/* DI pill */}
          {enabled && s && style === "compact" &&
          <div style={{
            background: "#000", borderRadius: 24, height: 36, padding: "0 14px",
            display: "flex", alignItems: "center", gap: 14,
            boxShadow: "0 4px 20px rgba(0,0,0,0.8)"
          }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: s.accent, fontWeight: 700, fontSize: 13 }}>
                <span style={{ width: 14, height: 14, borderRadius: 3, background: `color-mix(in oklab,${s.accent} 20%,transparent)`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ width: 6, height: 6, borderRadius: 1, background: s.accent }} />
                </span>
                {s.value}{s.unit}
              </span>
              <span style={{ width: 44, height: 20, borderRadius: 12, background: "rgba(255,255,255,0.08)" }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 12 }}>{s.name}</span>
            </div>
          }
          {enabled && s && style === "minimal" &&
          <div style={{ background: "#000", borderRadius: 24, height: 36, width: 126, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.accent, boxShadow: `0 0 10px ${s.accent}` }} />
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{s.name}</span>
            </div>
          }
          {enabled && s && style === "expanded" &&
          <div style={{
            background: "#000", borderRadius: 28, padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 14,
            boxShadow: "0 4px 20px rgba(0,0,0,0.8)", maxWidth: 320
          }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.city} · NOW</div>
                <div style={{ fontSize: 26, fontWeight: 600, color: "#fff", marginTop: 2, letterSpacing: "-0.025em", lineHeight: 1 }}>
                  {s.value}<span style={{ opacity: 0.5, fontSize: 16, fontWeight: 500 }}>{s.unit}</span>
                </div>
                <div style={{ fontSize: 11, color: s.accent, marginTop: 4, fontWeight: 600 }}>{s.name}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: `color-mix(in oklab,${s.accent} 18%,transparent)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ width: 20, height: 20, borderRadius: 4, background: s.accent, opacity: 0.85 }} />
              </div>
            </div>
          }
          {!enabled &&
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, fontWeight: 600 }}>Dynamic Island off</div>
          }
        </div>
      </div>

      {/* Enable */}
      <ASGroup>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#f0f3f8" }}>Dynamic Island</span>
          <ASToggle on={enabled} onChange={setEnabled} />
        </div>
      </ASGroup>

      {enabled && <>
        {/* Active condition */}
        <ASSectionTitle>Active condition</ASSectionTitle>
        <ASGroup>
          {DI_CONDITIONS.map((it, i) => {
            const on = condIds.has(it.id);
            return (
              <div key={it.id} onClick={() => toggleCond(it.id)} style={{
                display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
                borderTop: i ? "0.5px solid rgba(255,255,255,0.06)" : "none", cursor:"pointer",
              }}>
                <div style={{
                  width:18, height:18, borderRadius:4, flexShrink:0,
                  border:`1.5px solid ${on ? "#f0f3f8" : "rgba(220,228,240,0.3)"}`,
                  background: on ? "#f0f3f8" : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  {on && <svg width="11" height="9" viewBox="0 0 11 9"><path d="M1 4.5L4 7.5L10 1.5" stroke="#0e0f12" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14, fontWeight:600, color: on?"#f0f3f8":"rgba(220,228,240,0.55)", letterSpacing:"-0.1px"}}>{it.label}</div>
                  <div style={{fontSize:11, fontWeight:400, color:"rgba(220,228,240,0.4)", marginTop:1}}>{it.sub}</div>
                </div>
              </div>
            );
          })}
        </ASGroup>

        {/* Appearance */}
        <ASSectionTitle>Appearance</ASSectionTitle>
        <ASGroup>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#f0f3f8" }}>Show on Lock Screen</span>
            <ASToggle on={lockScreen} onChange={setLockScreen} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#f0f3f8" }}>Show in Standby</span>
            <ASToggle on={standby} onChange={setStandby} />
          </div>
        </ASGroup>
      </>}

      <div style={{ height: 28 }} />
    </div>);

}
window.AltSettingsNotifications = AltSettingsNotifications;
window.AltSettingsLiveBrief = AltSettingsLiveBrief;
window.AltSettingsPersonalAlerts = AltSettingsPersonalAlerts;
window.AltSettingsMorningBrief = AltSettingsMorningBrief;
window.AltSettingsCities = AltSettingsCities;
window.AltSettingsDynamicIsland = AltSettingsDynamicIsland;