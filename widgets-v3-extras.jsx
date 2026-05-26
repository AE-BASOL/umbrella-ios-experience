// Widgets v3 — extras: iOS long-press context menu, Dynamic Island, and
// creative lock-screen compositions. Pulls V3_SLOTS / V3Widget /
// V3MediumWidget from widgets-v3.jsx (must load after it).

const V3X_FF = "-apple-system,'SF Pro Text',system-ui,sans-serif";
const V3X_FF_DISPLAY = "'SF Pro Display',-apple-system,system-ui,sans-serif";

// ─── Tiny menu icons ──────────────────────────────────────────────────────
function V3MenuIcon({ kind, color }) {
  const p = { width: 19, height: 19, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (kind) {
    case "edit":return <svg {...p}><path d="M14.5 4.5 L19.5 9.5 L8 21 L3 21 L3 16 Z" /><path d="M13 6 L18 11" /></svg>;
    case "stack":return <svg {...p}><rect x="4" y="4" width="16" height="6" rx="1.5" /><rect x="4" y="12" width="16" height="6" rx="1.5" /></svg>;
    case "remove":return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M8 12 L16 12" /></svg>;
    case "home":return <svg {...p}><path d="M3 11 L12 3 L21 11 L21 21 L14 21 L14 14 L10 14 L10 21 L3 21 Z" /></svg>;
    case "info":return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8.5 L12 8.5 M12 11 L12 16.5" /></svg>;
    case "share":return <svg {...p}><path d="M12 3 L12 16" /><path d="M7 8 L12 3 L17 8" /><path d="M5 14 L5 21 L19 21 L19 14" /></svg>;
    default:return null;
  }
}

// ─── iOS long-press context menu ──────────────────────────────────────────
// The frosted-glass action sheet that appears when you long-press an item on
// the home screen. Supports two modes:
//   • mode="widget" — long-press on a widget (edit/remove widget)
//   • mode="app"    — long-press on the app icon (quick actions + remove)
function V3LongPressMenu({ slot = "V2-01", mode = "widget" }) {
  const actionsWidget = [
  { icon: "edit", label: "Edit \u201CUmbrella\u201D Widget" },
  { icon: "stack", label: "Edit Stack" },
  { icon: "share", label: "Share Forecast" },
  { icon: "info", label: "View Forecast Detail" },
  { icon: "remove", label: "Remove Widget", destructive: true }];

  const actionsApp = [
  { icon: "info", label: "Today's Forecast", hint: "İstanbul · 78% rain" },
  { icon: "info", label: "Tomorrow's Forecast", hint: "Clearing · 12°/8°" },
  { icon: "stack", label: "Manage Alerts" },
  { icon: "home", label: "Add Location" },
  { icon: "share", label: "Share App" },
  { icon: "edit", label: "Edit Home Screen" },
  { icon: "remove", label: "Remove App", destructive: true }];

  const actions = mode === "app" ? actionsApp : actionsWidget;
  return (
    <div style={{
      width: 260, borderRadius: 14,
      background: "rgba(248,248,248,0.92)",
      backdropFilter: "saturate(180%) blur(28px)",
      WebkitBackdropFilter: "saturate(180%) blur(28px)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.28), 0 0 0 0.5px rgba(0,0,0,0.04)",
      overflow: "hidden",
      fontFamily: V3X_FF
    }}>
      {actions.map((a, i) =>
      <div key={i} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: a.hint ? "11px 18px" : "13px 18px",
        borderTop: i > 0 ? "0.5px solid rgba(60,60,67,0.16)" : "none",
        color: a.destructive ? "#FF3B30" : "#000",
        fontSize: 16, fontWeight: 400, letterSpacing: "-0.2px"
      }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span>{a.label}</span>
            {a.hint && <span style={{ fontSize: 12, color: "rgba(60,60,67,0.6)", letterSpacing: 0 }}>{a.hint}</span>}
          </div>
          <V3MenuIcon kind={a.icon} color={a.destructive ? "#FF3B30" : "#1c1c1e"} />
        </div>
      )}
    </div>);

}

// ─── App icon ─────────────────────────────────────────────────────────────
// iOS-style rounded-rect tile rendering the bundled UmbrellaToday logo.
function V3AppIcon({ size = 60, label = "UmbrellaToday", showLabel = true, glow = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontFamily: V3X_FF }}>
      <div style={{
        width: size, height: size, borderRadius: size * 0.22,
        overflow: "hidden",
        boxShadow: glow ?
        "0 24px 48px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.10)" :
        "0 1px 0 rgba(255,255,255,0.04), 0 4px 10px rgba(0,0,0,0.18)"
      }}>
        <img src="assets/Logo.png" alt={label}
        style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
      </div>
      {showLabel &&
      <span style={{ fontSize: 11, fontWeight: 500, color: "#fff", letterSpacing: "-0.1px",
        textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>{label}</span>
      }
    </div>);

}

// Full long-press scene on the APP ICON — dimmed wallpaper, lifted icon, menu.
function V3LongPressAppScene() {
  return (
    <div style={{
      width: 390, height: 760, position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #2a2520 0%, #14110d 100%)",
      fontFamily: V3X_FF, color: "#fff"
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(120% 60% at 50% 30%, rgba(60,55,45,0.5), rgba(0,0,0,0.4) 70%)"
      }} />
      {/* status bar */}
      <div style={{ position: "absolute", top: 18, left: 30, fontSize: 15, fontWeight: 600, zIndex: 3 }}>9:41</div>
      <div style={{ position: "absolute", top: 18, right: 30, fontSize: 13, fontWeight: 600, zIndex: 3, display: "flex", gap: 6, alignItems: "center" }}>
        <span>5G</span>
        <span style={{ display: "inline-block", width: 18, height: 10, border: "1px solid #fff", borderRadius: 2, position: "relative" }}>
          <span style={{ display: "block", width: 13, height: 6, background: "#fff", borderRadius: 1, margin: "1px 0 0 1px" }} />
        </span>
      </div>

      {/* lifted app icon */}
      <div style={{ position: "absolute", left: "50%", top: 130, transform: "translateX(-50%)", zIndex: 2 }}>
        <V3AppIcon size={68} glow={true} />
      </div>

      {/* menu */}
      <div style={{
        position: "absolute", left: "50%", top: 260, transform: "translateX(-50%)", zIndex: 2,
        filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.4))"
      }}>
        <V3LongPressMenu mode="app" />
      </div>
    </div>);

}

// Full long-press scene on a WIDGET — original variant, kept for completeness.
function V3LongPressScene({ slot = "V2-01" }) {
  return (
    <div style={{
      width: 390, height: 700, position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #2a2520 0%, #14110d 100%)",
      fontFamily: V3X_FF, color: "#fff"
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(120% 60% at 50% 30%, rgba(60,55,45,0.5), rgba(0,0,0,0.4) 70%)"
      }} />
      <div style={{ position: "absolute", top: 18, left: 0, right: 0, padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 15, fontWeight: 600, zIndex: 3 }}>
        <span>9:41</span>
        <span style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 13 }}>
          <span style={{ display: "inline-block", width: 16, height: 10, border: "1px solid #fff", borderRadius: 2, position: "relative" }}>
            <span style={{ display: "block", width: 11, height: 6, background: "#fff", borderRadius: 1, margin: "1px 0 0 1px" }} />
          </span>
        </span>
      </div>

      <div style={{
        position: "absolute", left: "50%", top: 130, transform: "translateX(-50%)",
        filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.55))", zIndex: 2
      }}>
        <V3Widget slot={slot} />
      </div>

      <div style={{
        position: "absolute", left: "50%", top: 330, transform: "translateX(-50%)", zIndex: 2,
        filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.4))"
      }}>
        <V3LongPressMenu slot={slot} mode="widget" />
      </div>
    </div>);

}

// ─── Home screen — app icon row + widgets together ────────────────────────
function V3HomeScreenWithApp() {
  return (
    <div style={{
      width: 390, height: 760, position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #38302A 0%, #1f1813 100%)",
      borderRadius: "44px 44px 0 0",
      fontFamily: V3X_FF, color: "#fff"
    }}>
      {/* status bar */}
      <div style={{ position: "absolute", top: 18, left: 0, right: 0, padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 15, fontWeight: 600, zIndex: 3 }}>
        <span>9:41</span>
        <span style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 13 }}>
          <span>5G</span>
          <span style={{ display: "inline-block", width: 18, height: 10, border: "1px solid #fff", borderRadius: 2, position: "relative" }}>
            <span style={{ display: "block", width: 13, height: 6, background: "#fff", borderRadius: 1, margin: "1px 0 0 1px" }} />
          </span>
        </span>
      </div>

      {/* date strip */}
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.65, letterSpacing: "0.04em", textTransform: "uppercase" }}>Friday, April 26</div>
      </div>

      {/* Widget stack — medium hero + 2 smalls */}
      <div style={{
        position: "absolute", top: 100, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14
      }}>
        <V3MediumWidget slot="V2-01" />
        <div style={{ display: "flex", gap: 14 }}>
          <V3Widget slot="V2-04" />
          <V3Widget slot="V2-08" />
        </div>
      </div>

      {/* App icon row (4 × placeholder) — UmbrellaToday is the hero */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 140,
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", padding: "0 28px", gap: 24
      }}>
        <V3AppIcon size={60} label="UmbrellaToday" />
        {[1, 2, 3].map((i) =>
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
            width: 60, height: 60, borderRadius: 14,
            background: "rgba(255,255,255,0.08)",
            border: "0.5px solid rgba(255,255,255,0.08)"
          }} />
            <span style={{ fontSize: 11, opacity: 0.45, fontWeight: 500 }}>—</span>
          </div>
        )}
      </div>

      {/* dock */}
      <div style={{
        position: "absolute", left: 14, right: 14, bottom: 34,
        background: "rgba(255,255,255,0.10)",
        backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
        borderRadius: 24, padding: "12px 18px",
        display: "flex", gap: 18, justifyContent: "space-around"
      }}>
        {[0, 1, 2, 3].map((i) =>
        <div key={i} style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.08)" }} />
        )}
      </div>
    </div>);

}

// ─── Dynamic Island ───────────────────────────────────────────────────────
// Three states: collapsed (compact-left + compact-right around the lens),
// minimal (info pill), expanded (full card).

function V3IslandPhoneFrame({ children, height = 220 }) {
  return (
    <div style={{
      width: 390, height, position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #1a1a24 0%, #0a0a0f 100%)",
      borderRadius: "44px 44px 0 0",
      fontFamily: V3X_FF, color: "#fff"
    }}>
      {/* status bar */}
      <div style={{ position: "absolute", top: 18, left: 30, fontSize: 15, fontWeight: 600 }}>9:41</div>
      <div style={{ position: "absolute", top: 20, right: 30, fontSize: 11, opacity: 0.85, display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontWeight: 600, fontSize: 13 }}>5G</span>
        <span style={{ display: "inline-block", width: 18, height: 10, border: "1px solid #fff", borderRadius: 2, position: "relative" }}>
          <span style={{ display: "block", width: 13, height: 6, background: "#fff", borderRadius: 1, margin: "1px 0 0 1px" }} />
        </span>
      </div>
      {children}
    </div>);

}

// Compact dynamic island — small left+right around the camera lens
function V3DynamicIslandCompact({ slot = "V2-01" }) {
  const s = V3_SLOTS[slot];
  return (
    <V3IslandPhoneFrame height={160}>
      <div style={{
        position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)",
        height: 36, minWidth: 130, background: "#000", borderRadius: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 14px 0 14px", gap: 6
      }}>
        {/* left chip */}
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: s.accent, fontWeight: 700, fontSize: 13 }}>
          <V3Icon kind={s.item} color={s.accent} size={16} />
          <span>{s.value}{s.unit}</span>
        </span>
        {/* camera lens placeholder */}
        <span style={{ width: 48 }} />
        {/* right chip */}
        <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: 13 }}>{s.cond}</span>
      </div>
    </V3IslandPhoneFrame>);

}

// Expanded dynamic island — tap-and-hold state, full forecast card
function V3DynamicIslandExpanded({ slot = "V2-01" }) {
  const s = V3_SLOTS[slot];
  const cfg = window.ITEM_WIDGETS && window.ITEM_WIDGETS[s.item];
  return (
    <V3IslandPhoneFrame height={240}>
      <div style={{
        position: "absolute", top: 60, left: 14, right: 14,
        background: "#000", borderRadius: 38,
        padding: "18px 22px",
        display: "flex", alignItems: "center", gap: 18,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)"
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {s.city} · NOW
          </div>
          <div style={{
            fontSize: 36, fontWeight: 600, color: "#fff", marginTop: 4, letterSpacing: "-0.025em", lineHeight: 1,
            fontFamily: V3X_FF_DISPLAY
          }}>
            {s.value}<span style={{ opacity: 0.55, fontSize: 22, fontWeight: 500 }}>{s.unit}</span>
          </div>
          <div style={{ fontSize: 13, color: s.accent, marginTop: 6, fontWeight: 600, letterSpacing: "-0.01em" }}>
            {cfg ? cfg.verdict : s.name}
          </div>
        </div>
        <div style={{
          flexShrink: 0, width: 64, height: 64, borderRadius: 32,
          background: `color-mix(in oklab, ${s.accent} 18%, transparent)`,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <V3Icon kind={s.item} color={s.accent} size={36} />
        </div>
      </div>
    </V3IslandPhoneFrame>);

}

// Minimal dynamic island — pill with single accent dot + small text
function V3DynamicIslandMinimal({ slot = "V2-01" }) {
  const s = V3_SLOTS[slot];
  return (
    <V3IslandPhoneFrame height={160}>
      <div style={{
        position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)",
        height: 36, width: 126, background: "#000", borderRadius: 24,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.accent, boxShadow: `0 0 12px ${s.accent}` }} />
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{s.name}</span>
      </div>
    </V3IslandPhoneFrame>);

}

// ─── Creative lock-screen designs ─────────────────────────────────────────
function V3LockShell({ children, dateLabel = "Friday, April 26", time = "9:41", height = 740 }) {
  return (
    <div style={{
      width: 390, height, position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #1a1a24 0%, #0c0c14 60%, #050507 100%)",
      fontFamily: V3X_FF, color: "#fff",
      borderRadius: "44px 44px 0 0"
    }}>
      {/* subtle wallpaper grain */}
      <div style={{ position: "absolute", inset: 0,
        background: "radial-gradient(80% 50% at 50% 25%, rgba(80,70,90,0.20), transparent 60%)" }} />
      {/* status bar */}
      <div style={{ position: "absolute", top: 18, left: 30, fontSize: 15, fontWeight: 600, zIndex: 3 }}>{time === "9:41" ? "9:41" : time}</div>
      <div style={{ position: "absolute", top: 18, right: 30, fontSize: 13, fontWeight: 600, opacity: 0.85, zIndex: 3, display: "flex", gap: 6, alignItems: "center" }}>
        <span>5G</span>
        <span style={{ display: "inline-block", width: 18, height: 10, border: "1px solid #fff", borderRadius: 2, position: "relative" }}>
          <span style={{ display: "block", width: 13, height: 6, background: "#fff", borderRadius: 1, margin: "1px 0 0 1px" }} />
        </span>
      </div>
      {/* big lock clock */}
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", zIndex: 2 }}>
        <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.65, letterSpacing: "0.01em" }}>{dateLabel}</div>
        <div style={{ fontSize: 88, fontWeight: 200, marginTop: 4, letterSpacing: "-0.04em", lineHeight: 0.95, fontFamily: V3X_FF_DISPLAY }}>{time}</div>
      </div>
      {children}
    </div>);

}

// 8-square grid lock screen — mini chips for every slot
function V3LockScreenGrid() {
  return (
    <V3LockShell>
      <div style={{
        position: "absolute", left: 24, right: 24, bottom: 90,
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(2, auto)",
        gap: 8
      }}>
        {V3_ORDER.map((slot) => {
          const s = V3_SLOTS[slot];
          return (
            <div key={slot} style={{
              aspectRatio: "1 / 1", borderRadius: 16,
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <V3Icon kind={s.item} color={s.accent} size={26} />
            </div>);

        })}
      </div>
      {/* bottom hint */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 38, textAlign: "center", fontSize: 11, opacity: 0.4, fontWeight: 600, letterSpacing: "0.06em" }}>
        SWIPE UP TO OPEN
      </div>
    </V3LockShell>);

}

// Hero medium widget — single big widget below the clock
function V3LockScreenHero({ slot = "V2-01" }) {
  return (
    <V3LockShell>
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 110,
        display: "flex", justifyContent: "center"
      }}>
        <V3MediumWidget slot={slot} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontSize: 11, opacity: 0.4, fontWeight: 600, letterSpacing: "0.06em" }}>
        UMBRELLATODAY · TAP FOR DETAIL
      </div>
    </V3LockShell>);

}

// Mosaic — 1 medium + 2 small
function V3LockScreenMosaic() {
  return (
    <V3LockShell>
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 80,
        display: "flex", flexDirection: "column", gap: 14, alignItems: "center"
      }}>
        <V3MediumWidget slot="V2-01" />
        <div style={{ display: "flex", gap: 14 }}>
          <V3Widget slot="V2-06" />
          <V3Widget slot="V2-04" />
        </div>
      </div>
    </V3LockShell>);

}

// Strip — a thin condition-active strip across the bottom showing which of
// the 8 items will fire today. Active items glow with their accent color.
function V3LockScreenStrip({ activeSlots = ["V2-01", "V2-04", "V2-06"] }) {
  const active = new Set(activeSlots);
  return (
    <V3LockShell>
      {/* main reading — biggest active condition */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 230, textAlign: "center"
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: V3_SLOTS["V2-01"].accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Today · İstanbul
        </div>
        <div style={{ fontSize: 42, fontWeight: 600, marginTop: 8, fontFamily: V3X_FF_DISPLAY, letterSpacing: "-0.02em" }}>
          Rain &amp; cool
        </div>
        <div style={{ fontSize: 14, opacity: 0.7, marginTop: 6, fontWeight: 500 }}>
          Bring an umbrella · layer up for evening
        </div>
      </div>

      {/* horizontal strip — 8 item chips */}
      <div style={{
        position: "absolute", left: 18, right: 18, bottom: 84,
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        padding: "14px 12px",
        display: "flex", justifyContent: "space-between"
      }}>
        {V3_ORDER.map((slot) => {
          const s = V3_SLOTS[slot];
          const on = active.has(slot);
          return (
            <div key={slot} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              opacity: on ? 1 : 0.32
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: on ? `color-mix(in oklab, ${s.accent} 22%, transparent)` : "transparent",
                border: on ? `0.5px solid ${s.accent}` : "0.5px solid rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <V3Icon kind={s.item} color={on ? s.accent : "rgba(255,255,255,0.5)"} size={20} />
              </div>
            </div>);

        })}
      </div>
    </V3LockShell>);

}

// ─── iOS lock-screen accessory widgets ────────────────────────────────────
// iOS lock screen has a 4-slot strip below the clock. Each slot can be filled
// by either a 1-slot circular widget or a 2-slot rectangular widget.

// Circular accessory — 1 slot. Condition-tinted bg, icon + value.
function V3LockCirc({ slot = "V2-01" }) {
  const s = V3_SLOTS[slot];
  return (
    <div style={{
      width: 72, height: 72, borderRadius: "50%",
      background: `color-mix(in oklab, ${s.bg} 30%, rgba(255,255,255,0.08))`,
      border: `1px solid color-mix(in oklab, ${s.accent} 55%, rgba(255,255,255,0.12))`,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 3,
      boxShadow: `0 2px 12px color-mix(in oklab, ${s.accent} 20%, transparent)`,
    }}>
      <V3Icon kind={s.item} color={s.accent} size={26} />
      <span style={{
        fontSize: 10, fontWeight: 700,
        color: "#fff",
        fontFamily: "'SF Mono',ui-monospace,Menlo,monospace",
        letterSpacing: "-0.3px",
        lineHeight: 1,
      }}>{s.value}<span style={{fontSize:8, opacity:0.8}}>{s.unit.trim()}</span></span>
    </div>
  );
}

// Rectangular accessory — 2 slots. Icon left, label + sub-text right.
function V3LockRect({ slot = "V2-01" }) {
  const s = V3_SLOTS[slot];
  const cfg = window.ITEM_WIDGETS && window.ITEM_WIDGETS[s.item];
  return (
    <div style={{
      height: 72, minWidth: 150, padding: "0 14px 0 12px",
      borderRadius: 18,
      background: "rgba(255,255,255,0.10)",
      border: "0.5px solid rgba(255,255,255,0.18)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      display: "flex", alignItems: "center", gap: 12,
      fontFamily: V3X_FF, color: "#fff",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        background: `color-mix(in oklab, ${s.accent} 22%, transparent)`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <V3Icon kind={s.item} color={s.accent} size={22}/>
      </div>
      <div style={{display:"flex", flexDirection:"column", gap:2}}>
        <span style={{fontSize:13, fontWeight:700, color:"#fff", letterSpacing:"-0.01em"}}>{s.name}</span>
        <span style={{fontSize:11, fontWeight:500, color:s.accent, letterSpacing:"-0.01em"}}>
          {cfg ? cfg.smallNote : `${s.value}${s.unit}`}
        </span>
      </div>
    </div>
  );
}

// Inline accessory — single line above the clock.
function V3LockInline({ slot = "V2-01" }) {
  const s = V3_SLOTS[slot];
  const cfg = window.ITEM_WIDGETS && window.ITEM_WIDGETS[s.item];
  return (
    <div style={{
      display:"inline-flex", alignItems:"center", gap:6,
      fontFamily:V3X_FF, color:"#fff",
      padding:"4px 10px", borderRadius:999,
      background:"rgba(255,255,255,0.08)",
      backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
    }}>
      <V3Icon kind={s.item} color={s.accent} size={14}/>
      <span style={{fontSize:13, fontWeight:600, letterSpacing:"-0.01em"}}>
        {cfg ? cfg.verdict : s.name} · <span style={{color:s.accent}}>{s.value}{s.unit}</span>
      </span>
    </div>
  );
}

// Lock-screen composition with proper accessory strip layout.
//   - Inline above clock
//   - 4-slot strip below: pass `slots` as an array of { kind, slot } where
//     `kind` is "c" (1-slot circular) or "r" (2-slot rect). The widths must
//     add up to 4 total slots.
function V3LockAccessory({ inlineSlot = "V2-01", slots = [{kind:"c",slot:"V2-01"},{kind:"c",slot:"V2-04"},{kind:"c",slot:"V2-06"},{kind:"c",slot:"V2-08"}] }) {
  return (
    <div style={{
      width: 390, height: 740, position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #1a1a24 0%, #0c0c14 60%, #050507 100%)",
      fontFamily: V3X_FF, color: "#fff",
      borderRadius: "44px 44px 0 0",
    }}>
      {/* wallpaper grain */}
      <div style={{position:"absolute", inset:0,
        background:"radial-gradient(80% 50% at 50% 25%, rgba(80,70,90,0.20), transparent 60%)"}}/>
      {/* status bar */}
      <div style={{position:"absolute", top:18, left:30, fontSize:15, fontWeight:600, zIndex:3}}>9:41</div>
      <div style={{position:"absolute", top:18, right:30, fontSize:13, fontWeight:600, opacity:0.85, zIndex:3, display:"flex", gap:6, alignItems:"center"}}>
        <span>5G</span>
        <span style={{display:"inline-block", width:18, height:10, border:"1px solid #fff", borderRadius:2, position:"relative"}}>
          <span style={{display:"block", width:13, height:6, background:"#fff", borderRadius:1, margin:"1px 0 0 1px"}}/>
        </span>
      </div>

      {/* inline accessory above the clock */}
      <div style={{position:"absolute", top:58, left:0, right:0, textAlign:"center", zIndex:2}}>
        <V3LockInline slot={inlineSlot}/>
      </div>

      {/* clock + date — shifted down to make room for the inline */}
      <div style={{position:"absolute", top:110, left:0, right:0, textAlign:"center", zIndex:2}}>
        <div style={{fontSize:14, fontWeight:600, opacity:0.65, letterSpacing:"0.01em"}}>Friday, April 26</div>
        <div style={{fontSize:88, fontWeight:200, marginTop:4, letterSpacing:"-0.04em", lineHeight:0.95, fontFamily:V3X_FF_DISPLAY}}>9:41</div>
      </div>

      {/* 4-slot accessory strip below clock */}
      <div style={{
        position:"absolute", left:18, right:18, top:300,
        display:"flex", justifyContent:"center", alignItems:"center", gap:10,
      }}>
        {slots.map((sl, i) => (
          sl.kind === "r"
            ? <V3LockRect key={i} slot={sl.slot}/>
            : <V3LockCirc key={i} slot={sl.slot}/>
        ))}
      </div>
    </div>
  );
}

// ─── 8-item grid widget — v3 palette, single medium tile ─────────────────
// One widget that shows all 8 condition items at a glance. Active for today
// → tinted bg + accent-colored glyph. Inactive → muted gray. No values,
// no labels — just color presence. This is the 17th widget, distinct from
// the per-condition smalls/mediums.
function V3GridWidget({ activeSlots = ["V2-01", "V2-02", "V2-04", "V2-08"], location = "İstanbul, Beşiktaş" }) {
  const active = new Set(activeSlots);
  return (
    <div style={{
      width: 360, height: 170, borderRadius: 22, padding: "14px 16px",
      background: "#FBFAF7",
      border: "0.5px solid rgba(14,17,22,0.08)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(255,255,255,0.5)",
      fontFamily: V3X_FF, color: "#0E1116",
      display: "flex", flexDirection: "column", gap: 10, boxSizing: "border-box"
    }}>
      {/* Header — city + active count */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 600, color: "#6D798A", letterSpacing: "0.02em" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6D798A" }}></span>
          {location}
        </div>
        <div style={{
          fontSize: 10, fontWeight: 700, fontFamily: "'SF Mono',ui-monospace,Menlo,monospace",
          color: "#394350", background: "rgba(213,217,223,0.55)",
          padding: "3px 9px", borderRadius: 9999, letterSpacing: "0.02em"
        }}>{active.size} active</div>
      </div>

      {/* 4×2 grid — each cell lights up with its V3 palette when active */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(2, 1fr)",
        gap: 5
      }}>
        {V3_ORDER.map((slot) => {
          const s = V3_SLOTS[slot];
          const on = active.has(slot);
          return (
            <div key={slot} style={{
              borderRadius: 10, position: "relative",
              background: on ? s.bg : "rgba(228,232,238,0.5)",
              border: on ? `0.5px solid ${s.accent}` : "0.5px solid rgba(213,217,223,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <V3Icon kind={s.item} color={on ? s.accent : "rgba(120,128,140,0.55)"} size={22} />
              {on &&
              <span style={{
                position: "absolute", top: 5, right: 5,
                width: 5, height: 5, borderRadius: "50%",
                background: s.accent,
                boxShadow: `0 0 6px ${s.accent}`
              }} />
              }
            </div>);

        })}
      </div>
    </div>);

}

// ─── 8-condition lock screens — one per V3 slot ─────────────────────────
// Each uses its scene hero image as wallpaper with gradient overlay,
// time display, inline accessory, and 4 slot accessories.

const V3_SCENE_MAP = {
  "V2-01": "assets/scene-umbrella.png",
  "V2-02": "assets/scene-sunglasses.png",
  "V2-03": "assets/scene-sunscreen.png",
  "V2-04": "assets/scene-jacket.png",
  "V2-05": "assets/scene-coat.png",
  "V2-06": "assets/scene-boots.png",
  "V2-07": "assets/scene-hat.png",
  "V2-08": "assets/scene-water.png",
};

// Companion slots to show alongside the hero
const V3_LOCK_COMPANIONS = {
  "V2-01": ["V2-01","V2-06","V2-04","V2-07"],
  "V2-02": ["V2-02","V2-03","V2-08","V2-04"],
  "V2-03": ["V2-03","V2-02","V2-08","V2-04"],
  "V2-04": ["V2-04","V2-07","V2-05","V2-01"],
  "V2-05": ["V2-05","V2-04","V2-07","V2-01"],
  "V2-06": ["V2-06","V2-01","V2-04","V2-05"],
  "V2-07": ["V2-07","V2-04","V2-05","V2-01"],
  "V2-08": ["V2-08","V2-02","V2-03","V2-04"],
};

function V3ConditionLockScreen({ slot = "V2-01" }) {
  const s = V3_SLOTS[slot];
  const scene = V3_SCENE_MAP[slot];
  const companions = V3_LOCK_COMPANIONS[slot] || [slot];

  return (
    <div style={{
      width: 390, height: 740,
      borderRadius: "44px 44px 0 0",
      overflow: "hidden",
      position: "relative",
      fontFamily: V3X_FF,
      color: "#fff",
    }}>
      {/* Scene wallpaper */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url('${scene}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}/>
      {/* Gradient overlay — darken top for readability */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.55) 100%)",
      }}/>

      {/* Status bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 24px 0",
        fontSize: 14, fontWeight: 600,
      }}>
        <span>9:41</span>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <svg width="18" height="12" viewBox="0 0 19 12"><rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill="white"/><rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill="white"/><rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill="white"/><rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill="white"/></svg>
          <svg width="26" height="12" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="white" strokeOpacity="0.35" fill="none"/><rect x="2" y="2" width="20" height="9" rx="2" fill="white"/></svg>
        </div>
      </div>

      {/* Time + date */}
      <div style={{
        position: "absolute", top: 80, left: 0, right: 0,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 80, fontWeight: 200, letterSpacing: "-2px", lineHeight: 1,
          fontFamily: V3X_FF_DISPLAY,
          textShadow: "0 2px 16px rgba(0,0,0,0.4)",
        }}>9:41</div>
        <div style={{
          fontSize: 18, fontWeight: 500, marginTop: 6,
          opacity: 0.85,
          textShadow: "0 1px 8px rgba(0,0,0,0.4)",
        }}>Friday, April 26</div>
      </div>

      {/* Inline accessory */}
      <div style={{
        position: "absolute", top: 230, left: 0, right: 0,
        display: "flex", justifyContent: "center",
      }}>
        <V3LockInline slot={slot}/>
      </div>

      {/* 4-slot circular strip */}
      <div style={{
        position: "absolute", bottom: 90, left: 20, right: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "0.5px solid rgba(255,255,255,0.10)",
        borderRadius: 28,
        padding: "14px 16px",
      }}>
        {companions.map((k) => (
          <V3LockCirc key={k} slot={k}/>
        ))}
      </div>

      {/* Home indicator */}
      <div style={{
        position: "absolute", bottom: 10, left: 0, right: 0,
        display: "flex", justifyContent: "center",
      }}>
        <div style={{ width: 120, height: 5, borderRadius: 9999, background: "rgba(255,255,255,0.5)" }}/>
      </div>
    </div>
  );
}

window.V3ConditionLockScreen = V3ConditionLockScreen;
window.V3AppIcon = V3AppIcon;
window.V3LongPressMenu = V3LongPressMenu;
window.V3LongPressScene = V3LongPressScene;
window.V3LongPressAppScene = V3LongPressAppScene;
window.V3HomeScreenWithApp = V3HomeScreenWithApp;
window.V3DynamicIslandCompact = V3DynamicIslandCompact;
window.V3DynamicIslandExpanded = V3DynamicIslandExpanded;
window.V3DynamicIslandMinimal = V3DynamicIslandMinimal;
window.V3LockScreenGrid = V3LockScreenGrid;
window.V3LockScreenHero = V3LockScreenHero;
window.V3LockScreenMosaic = V3LockScreenMosaic;
window.V3LockScreenStrip = V3LockScreenStrip;
window.V3LockCirc = V3LockCirc;
window.V3LockRect = V3LockRect;
window.V3LockInline = V3LockInline;
window.V3LockAccessory = V3LockAccessory;