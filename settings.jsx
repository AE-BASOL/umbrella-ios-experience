// Settings — bohem / modern heritage. Sıralama:
//   01. Personal alerts
//   02. Cities
//   03. Notifications
//   04. Appearance
//   05. Privacy
//   06. About
//   07. Developer (collapsed)
//
// Tipografik prensip:
//  - eyebrow = 10px uppercase accent
//  - display = 22-26px semibold, -0.5 ls
//  - body    = 13.5px regular/medium
//  - mono    = sadece veri (saat, °, %, version)

const SENSITIVITIES = [
  { id: "low",    name: "Low",    desc: "Only flag rain when very likely (≥60%)." },
  { id: "medium", name: "Medium", desc: "Balanced — flag rain ≥40%." },
  { id: "high",   name: "High",   desc: "Cautious — any chance ≥20%." },
];
const THEMES = [
  { id: "light", name: "Light" },
  { id: "dark",  name: "Dark" },
  { id: "auto",  name: "Auto" },
];
const UNITS = [
  { id: "metric",   name: "°C / km/h" },
  { id: "imperial", name: "°F / mph" },
];

// ─── Atomic UI ──────────────────────────────────────────
function BSection({ index, eyebrow, title, blurb, children }) {
  return (
    <section className="bset-section">
      <header className="bset-section-head">
        <span className="bset-index">{String(index).padStart(2, "0")}</span>
        <div className="bset-section-titles">
          <div className="bset-eyebrow">{eyebrow}</div>
          <div className="bset-display">{title}</div>
          {blurb && <div className="bset-blurb">{blurb}</div>}
        </div>
      </header>
      <div className="bset-section-body">{children}</div>
    </section>
  );
}

function BRow({ label, hint, children, divider }) {
  return (
    <div className={`bset-row ${divider ? "div" : ""}`}>
      <div className="bset-row-text">
        <div className="lab">{label}</div>
        {hint && <div className="hint">{hint}</div>}
      </div>
      {children && <div className="bset-row-ctrl">{children}</div>}
    </div>
  );
}

function BSwitch({ on, onClick }) {
  // Render as a <span> rather than <button> — BSwitch is sometimes nested inside
  // an outer <button class="bset-alert-row">, and nested buttons fail HTML
  // validation. Stays interactive via role + tabIndex + onKeyDown.
  return (
    <span
      className={`bset-switch ${on ? "on" : ""}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); onClick && onClick(e); }
      }}
      role="switch"
      tabIndex={0}
      aria-checked={on}
    >
      <span className="knob"></span>
    </span>
  );
}

function BSegmented({ items, value, onChange }) {
  return (
    <div className="bset-segmented">
      {items.map((it) => (
        <button key={it.id} className={value === it.id ? "on" : ""} onClick={() => onChange(it.id)}>
          {it.name}
        </button>
      ))}
    </div>
  );
}

function BChoice({ selected, name, desc, onClick }) {
  return (
    <button className={`bset-choice ${selected ? "on" : ""}`} onClick={onClick} type="button">
      <span className={`bset-choice-mark ${selected ? "on" : ""}`}>
        <span className="dot"></span>
      </span>
      <span className="bset-choice-text">
        <span className="name">{name}</span>
        <span className="desc">{desc}</span>
      </span>
    </button>
  );
}

function BSlider({ min, max, step, value, onChange, unit }) {
  return (
    <div className="bset-slider">
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} />
      <div className="bset-slider-foot">
        <span className="end">{min}</span>
        <span className="cur">{value}<em>{unit}</em></span>
        <span className="end">{max}</span>
      </div>
    </div>
  );
}

// ─── Sections ──────────────────────────────────────────

function PersonalAlertsSection({ alerts, setAlerts }) {
  const [openId, setOpenId] = React.useState(null);
  const enabled = alerts.filter(a => a.on).length;
  const toggle = (id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, on: !a.on } : a));
  const setVal = (id, v) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, threshold: v } : a));

  return (
    <BSection
      index={1}
      eyebrow="Personal alerts"
      title="Speak up only for these"
      blurb={`${enabled} active · we mention them, with your thresholds.`}
    >
      <div className="bset-alerts">
        {alerts.map(a => {
          const open = openId === a.id;
          const direction = a.dir === "below" ? "below" : "above";
          return (
            <div key={a.id} className={`bset-alert ${a.on ? "on" : ""} ${open ? "open" : ""}`}>
              <button className="bset-alert-row" onClick={() => setOpenId(open ? null : a.id)} type="button">
                <span className="bset-alert-ico"><AGlyph kind={a.glyph} size={20} /></span>
                <span className="bset-alert-text">
                  <span className="name">{a.name}</span>
                  <span className="thresh">
                    {a.on ? <>flag {direction} <em>{a.threshold}</em> {a.unit}</> : "off"}
                  </span>
                </span>
                <span
                  className="bset-alert-toggle"
                  onClick={(e) => { e.stopPropagation(); toggle(a.id); }}
                  role="switch" aria-checked={a.on}
                >
                  <BSwitch on={a.on} onClick={(e) => { e.stopPropagation(); toggle(a.id); }} />
                </span>
              </button>
              {open && a.on && (
                <div className="bset-alert-body">
                  <BSlider min={a.min} max={a.max} step={a.step}
                    value={a.threshold} onChange={(v) => setVal(a.id, v)} unit={a.unit} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </BSection>
  );
}

function CitiesSection({ ctx, setCtx, onOpenDrawer }) {
  const cities = ctx.cities || [];
  const move = (id, delta) => {
    setCtx(s => {
      const arr = [...s.cities];
      const i = arr.findIndex(c => c.id === id);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= arr.length) return s;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...s, cities: arr };
    });
  };
  const remove = (id) => setCtx(s => {
    const remaining = s.cities.filter(c => c.id !== id);
    const activeId = s.activeCityId === id && remaining[0] ? remaining[0].id : s.activeCityId;
    return { ...s, cities: remaining, activeCityId: activeId };
  });

  return (
    <BSection
      index={2}
      eyebrow="Your places"
      title="Cities"
      blurb={`${cities.length} saved · reorder, or remove.`}
    >
      <div className="bset-cities">
        {cities.map((c, i) => (
          <div key={c.id} className="bset-city" data-state={c.state}>
            <span className="bset-city-bar"></span>
            <div className="bset-city-text">
              <div className="name">
                {c.name}
                {c.pin && <span className="bset-city-pin">primary</span>}
              </div>
              <div className="meta">
                <span>{c.sub}</span>
                <span className="dotsep">·</span>
                <span className="mono">{c.temp}°</span>
                <span className="dotsep">·</span>
                <span className="mono">{c.rainPct}% rain</span>
              </div>
            </div>
            <div className="bset-city-acts">
              <button disabled={i === 0} onClick={() => move(c.id, -1)} aria-label="Move up">↑</button>
              <button disabled={i === cities.length - 1} onClick={() => move(c.id, 1)} aria-label="Move down">↓</button>
              <button disabled={c.pin} onClick={() => remove(c.id)} aria-label="Remove" className="rm">
                <AGlyph kind="trash" size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="bset-link" onClick={onOpenDrawer} type="button">
        <span>+</span> Add a place
      </button>
    </BSection>
  );
}

function NotificationsSection({ reminder, setReminder, reminderTime, sensitivity, setSensitivity }) {
  return (
    <BSection
      index={3}
      eyebrow="Notifications"
      title="A quiet word in the morning"
      blurb="One nudge before you head out — only when it earns the buzz."
    >
      <BRow label="Morning reminder" hint="A single, gentle ping.">
        <BSwitch on={reminder} onClick={() => setReminder(v => !v)} />
      </BRow>
      {reminder && (
        <BRow label="Reminder time" hint="Local to where you wake up." divider>
          <span className="bset-pill mono">{reminderTime}</span>
        </BRow>
      )}
      <div className="bset-divider"></div>
      <div className="bset-mini-eyebrow">Rain sensitivity</div>
      <div className="bset-choices">
        {SENSITIVITIES.map((s) => (
          <BChoice key={s.id} selected={sensitivity === s.id}
            name={s.name} desc={s.desc} onClick={() => setSensitivity(s.id)} />
        ))}
      </div>
    </BSection>
  );
}

function AppearanceSection({ units, setUnits, theme, setTheme, lang }) {
  return (
    <BSection
      index={4}
      eyebrow="Appearance"
      title="How it looks, how it reads"
      blurb="Units and theme. The Brief follows your language."
    >
      <div className="bset-mini-eyebrow">Temperature</div>
      <BSegmented items={UNITS} value={units} onChange={setUnits} />
      <div className="bset-divider"></div>
      <div className="bset-mini-eyebrow">Theme</div>
      <BSegmented items={THEMES} value={theme} onChange={setTheme} />
      <div className="bset-divider"></div>
      <BRow label="Language" hint="Affects The Brief, alerts and reminders.">
        <span className="bset-pill">{lang} <AGlyph kind="chev" size={11} /></span>
      </BRow>
    </BSection>
  );
}

function PrivacySection({ shareUsage, setShareUsage }) {
  return (
    <BSection
      index={5}
      eyebrow="Privacy"
      title="What stays, what leaves"
      blurb="The forecast lives on this device. You decide the rest."
    >
      <BRow label="Location" hint="Used only for local forecasts.">
        <span className="bset-pill on">while in use</span>
      </BRow>
      <BRow label="Anonymous usage" hint="Helps tune alert thresholds across users." divider>
        <BSwitch on={shareUsage} onClick={() => setShareUsage(v => !v)} />
      </BRow>
      <button className="bset-link ghost" type="button">Export my data</button>
    </BSection>
  );
}

function AboutSection() {
  return (
    <BSection
      index={6}
      eyebrow="About"
      title="The fine print"
      blurb="Build info and forecast source."
    >
      <BRow label="Version"><span className="bset-pill mono">1.0.0</span></BRow>
      <BRow label="Forecast" hint="Hourly precipitation and temperature." divider>
        <span className="bset-pill mono">Open-Meteo</span>
      </BRow>
      <button className="bset-link ghost" type="button">Acknowledgements</button>
    </BSection>
  );
}

function DeveloperSection({ mock, setMock, adTest, setAdTest, notifTest, setNotifTest, onResetOnboarding }) {
  const [open, setOpen] = React.useState(false);
  return (
    <section className={`bset-section bset-dev ${open ? "open" : ""}`}>
      <button className="bset-dev-toggle" onClick={() => setOpen(v => !v)} type="button">
        <span className="bset-index">07</span>
        <div className="bset-section-titles">
          <div className="bset-eyebrow">Developer</div>
          <div className="bset-display">Behind the curtain</div>
        </div>
        <span className={`bset-chev ${open ? "on" : ""}`}><AGlyph kind="chev" size={12} /></span>
      </button>
      {open && (
        <div className="bset-section-body" style={{ paddingTop: 6 }}>
          <BRow label="Mock weather" hint="Swap live forecast with test payloads.">
            <BSwitch on={mock} onClick={() => setMock(v => !v)} />
          </BRow>
          <BRow label="Ad test mode" hint="Short timers for ad-free state validation." divider>
            <BSwitch on={adTest} onClick={() => setAdTest(v => !v)} />
          </BRow>
          <BRow label="Repeat notifications" hint="Schedule recurring test pings." divider>
            <BSwitch on={notifTest} onClick={() => setNotifTest(v => !v)} />
          </BRow>
          <button className="bset-link ghost" onClick={onResetOnboarding} type="button">
            Show onboarding next launch
          </button>
        </div>
      )}
    </section>
  );
}

// ─── Main ──────────────────────────────────────────────
function Settings({ visualState, onClose, ctx, setCtx, onOpenDrawer }) {
  const [units, setUnits] = React.useState("metric");
  const theme = ctx?.theme || "light";
  const setTheme = (t) => setCtx && setCtx(s => ({ ...s, theme: t }));
  const [lang] = React.useState("English");
  const [reminder, setReminder] = React.useState(true);
  const [reminderTime] = React.useState("07:30");
  const [sensitivity, setSensitivity] = React.useState("medium");
  const [shareUsage, setShareUsage] = React.useState(false);
  const [mock, setMock] = React.useState(false);
  const [adTest, setAdTest] = React.useState(false);
  const [notifTest, setNotifTest] = React.useState(false);

  const safeCtx = ctx || { cities: window.SAVED_CITIES || [], activeCityId: "ist", alerts: window.PERSONAL_ALERTS_DEFAULT || [] };
  const safeSetCtx = setCtx || (() => {});

  return (
    <div className="app-stage no-status-pad" data-state={visualState}>
      <div className="bset-shell">
        <header className="bset-top">
          <div>
            <div className="bset-eyebrow">Settings</div>
            <div className="bset-display lg">Make it yours</div>
          </div>
          <button onClick={onClose} className="bset-done" type="button">Done</button>
        </header>

        <div className="bset-rule"></div>

        <PersonalAlertsSection
          alerts={safeCtx.alerts}
          setAlerts={(updater) => safeSetCtx(s => ({
            ...s, alerts: typeof updater === "function" ? updater(s.alerts) : updater
          }))}
        />
        <CitiesSection ctx={safeCtx} setCtx={safeSetCtx} onOpenDrawer={onOpenDrawer || (() => {})} />
        <NotificationsSection
          reminder={reminder} setReminder={setReminder}
          reminderTime={reminderTime}
          sensitivity={sensitivity} setSensitivity={setSensitivity}
        />
        <AppearanceSection units={units} setUnits={setUnits} theme={theme} setTheme={setTheme} lang={lang} />
        <PrivacySection shareUsage={shareUsage} setShareUsage={setShareUsage} />
        <AboutSection />
        <DeveloperSection
          mock={mock} setMock={setMock}
          adTest={adTest} setAdTest={setAdTest}
          notifTest={notifTest} setNotifTest={setNotifTest}
          onResetOnboarding={() => {}}
        />

        <div className="bset-end">An umbrella, on time.</div>
      </div>
    </div>
  );
}

window.Settings = Settings;
