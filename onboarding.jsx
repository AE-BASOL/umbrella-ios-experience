// Onboarding — 5 pages: Welcome, Location, Sensitivity, Remind you (alerts), Widget.

const ALERT_BLURBS = {
  umbrella:   "When the sky gets ideas before you do.",
  sunglasses: "For the days the light bites back.",
  jacket:     "Soft armor for in-between weather.",
  coat:       "When morning calls for layers.",
  sunscreen:  "Quiet protection on bright afternoons.",
  water:      "A nudge when the heat asks for it.",
  wind:       "If the breeze tries to be a story.",
  boots:      "For when puddles join the commute.",
  mask:       "On heavy-pollen, low-air mornings.",
  hat:        "For the cold that nips at the ears.",
};

const ONB_PAGES_DATA = [
  {
    id: 0, state: "sunny", icon: "sunny",
    title: "UmbrellaToday",
    sub: "Your umbrella answer in one glance.",
    desc: "Temperature first, then a clear yes-or-no on the umbrella — without opening a full weather app.",
    cta: "Get Started",
  },
  {
    id: 1, state: "rainy", icon: "rainy",
    title: "Use your location",
    sub: "We check the forecast around you so the recommendation stays local and accurate.",
    desc: null,
    cta: "Enable Location",
    perms: [
      { title: "Location, while in use", sub: "Used only for forecast lookups. Never shared." },
      { title: "Notifications (optional)",  sub: "A morning reminder before you head out." },
    ],
  },
  {
    id: 2, state: "rainy", icon: "rainy",
    title: "Tune your sensitivity",
    sub: "Pick how cautious UmbrellaToday should be when calling for an umbrella.",
    desc: null,
    cta: "Continue",
  },
  {
    id: 3, state: "sunny", icon: "sunny",
    title: "Things to remind you",
    sub: "Tap what UmbrellaToday should mention before you head out. Choose none, choose all — or let chance choose for you.",
    desc: null,
    cta: "Continue",
  },
  {
    id: 4, state: "sunny", icon: "sunny",
    title: "Add the widget",
    sub: "Keep UmbrellaToday on your home or lock screen for the fastest daily check.",
    cta: "Open UmbrellaToday",
    steps: [
      "Long press your home screen",
      "Tap the + button",
      "Search for UmbrellaToday",
      "Choose small or medium",
    ],
  },
];

function Onboarding({ onFinish, onApplyAlerts }) {
  const [page, setPage] = React.useState(0);
  const [locEnabled, setLocEnabled] = React.useState(false);
  const [sens, setSens] = React.useState("medium");
  const [picked, setPicked] = React.useState(() => new Set());
  const [shakeKey, setShakeKey] = React.useState(0);
  const cur = ONB_PAGES_DATA[page];

  const togglePick = (id) => {
    setPicked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const randomize = () => {
    const all = window.PERSONAL_ALERTS_DEFAULT || [];
    // pick 3-5 random ids
    const n = 3 + Math.floor(Math.random() * 3);
    const shuffled = [...all].sort(() => Math.random() - 0.5).slice(0, n);
    setPicked(new Set(shuffled.map(a => a.id)));
    setShakeKey(k => k + 1);
  };

  const advance = () => {
    if (page === 1 && !locEnabled) {
      setLocEnabled(true);
      return;
    }
    if (page < ONB_PAGES_DATA.length - 1) {
      setPage(page + 1);
    } else {
      // finishing — push the picked alerts up to context
      if (onApplyAlerts) {
        const def = window.PERSONAL_ALERTS_DEFAULT || [];
        onApplyAlerts(def.map(a => ({ ...a, on: picked.has(a.id) })));
      }
      onFinish && onFinish();
    }
  };

  const cta = page === 1 ? (locEnabled ? "Continue" : "Enable Location") : cur.cta;
  const progress = ((page + 1) / ONB_PAGES_DATA.length) * 100;

  return (
    <div className="app-stage" data-state={cur.state} style={{ paddingTop: 0 }}>
      <div className="onb-shell" style={{ paddingTop: 60 }}>
        <div style={{ padding: "0 20px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", fontFamily: "ui-monospace, SF Mono, Menlo, monospace" }}>
              {String(page + 1).padStart(2, "0")} / {String(ONB_PAGES_DATA.length).padStart(2, "0")}
            </span>
            {page < ONB_PAGES_DATA.length - 1 && (
              <button className="onb-skip" onClick={() => setPage(ONB_PAGES_DATA.length - 1)}>Skip</button>
            )}
          </div>
          <div className="onb-progress"><div style={{ width: `${progress}%` }}></div></div>
        </div>

        <div className="onb-pages">
          {ONB_PAGES_DATA.map((p, i) => (
            <div key={p.id} className={`onb-page ${i === page ? "" : "hidden"}`}>
              <div className="surface-card">
                {p.id === 0 && (
                  <div className="onb-card">
                    <WeatherIcon state="sunny" size={104} />
                    <div>
                      <div className="onb-title">{p.title}</div>
                      <div className="onb-sub">{p.sub}</div>
                      <div className="onb-desc">{p.desc}</div>
                    </div>
                  </div>
                )}

                {p.id === 1 && (
                  <div className="onb-card left">
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <WeatherIcon state="rainy" size={72} />
                      <div>
                        <div className="onb-title sm">{p.title}</div>
                        <div className="onb-sub" style={{ fontSize: 13, marginTop: 6 }}>{p.sub}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                      {p.perms.map((perm, idx) => (
                        <div className="onb-perm-row" key={idx}>
                          <span className="badge">
                            {idx === 0 ? <Icon.Pin size={16} color="currentColor" /> : <Icon.Plane size={15} color="currentColor" />}
                          </span>
                          <div>
                            <div className="onb-perm-title">{perm.title}</div>
                            <div className="onb-perm-sub">{perm.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="loc-status" style={{ alignSelf: "flex-start" }}>
                      <span className="led" style={{ background: locEnabled ? "#34C759" : "#9CA3AF" }}></span>
                      <span>{locEnabled ? "Location enabled" : "Awaiting permission"}</span>
                    </div>
                  </div>
                )}

                {p.id === 2 && (
                  <div className="onb-card left">
                    <div>
                      <div className="onb-title sm">{p.title}</div>
                      <div className="onb-sub" style={{ fontSize: 13, marginTop: 6 }}>{p.sub}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                      {[
                        { id: "low", name: "Low", desc: "Only flag rain ≥60% likelihood." },
                        { id: "medium", name: "Medium", desc: "Balanced — flag rain ≥40%." },
                        { id: "high", name: "High", desc: "Cautious — flag any chance ≥20%." },
                      ].map((s) => (
                        <div key={s.id}
                          className={`choice-row ${sens === s.id ? "selected" : ""}`}
                          onClick={() => setSens(s.id)}>
                          <span className={`choice-indicator ${sens === s.id ? "on" : ""}`}></span>
                          <div className="choice-text">
                            <div className="name">{s.name}</div>
                            <div className="desc">{s.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {p.id === 3 && (
                  <div className="onb-card left bohem">
                    <div className="onb-bohem-head">
                      <div className="onb-eyebrow">A few things you carry</div>
                      <div className="onb-display">{p.title}</div>
                      <div className="onb-lede">{p.sub}</div>
                    </div>
                    <button className="onb-shake" onClick={randomize} type="button">
                      <span className="dice">⟳</span>
                      <span>Shake the dice</span>
                      <span className="hint">A handful, randomly</span>
                    </button>
                    <div className={`onb-tile-list shake-${shakeKey}`}>
                      {(window.PERSONAL_ALERTS_DEFAULT || []).map((a, idx) => {
                        const on = picked.has(a.id);
                        return (
                          <button
                            key={a.id}
                            className={`onb-tile ${on ? "on" : ""}`}
                            onClick={() => togglePick(a.id)}
                            type="button"
                            style={{ "--i": idx }}
                          >
                            <span className="onb-tile-ico"><AGlyph kind={a.glyph} size={22} /></span>
                            <span className="onb-tile-text">
                              <span className="name">{a.name}</span>
                              <span className="desc">{ALERT_BLURBS[a.id] || ""}</span>
                            </span>
                            <span className={`onb-tile-switch ${on ? "on" : ""}`} aria-hidden="true">
                              <span className="knob"></span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="onb-tile-foot">
                      {picked.size === 0
                        ? <span>Pick what fits your day · or shake the dice.</span>
                        : <span><strong>{picked.size}</strong> on your list · fine-tune later in Settings.</span>}
                    </div>
                  </div>
                )}

                {p.id === 4 && (
                  <div className="onb-card left">
                    <div className="onb-widget-preview">
                      <div className="pad">
                        <div style={{ position: "relative", zIndex: 1, transform: "scale(0.78)", transformOrigin: "center" }}>
                          <SmallWidget scenario="rainy" location="İstanbul" rainPct={78} />
                        </div>
                      </div>
                      <div className="label">A small umbrella, every morning.</div>
                    </div>
                    <div>
                      <div className="onb-title sm">{p.title}</div>
                      <div className="onb-sub" style={{ marginTop: 6, fontSize: 13 }}>{p.sub}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
                      {p.steps.map((s, idx) => (
                        <div className="onb-step" key={idx}>
                          <span className="num">{idx + 1}</span>
                          <span className="txt">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="onb-dots">
          {ONB_PAGES_DATA.map((p, i) => (
            <span key={p.id} className={`dot ${i === page ? "on" : ""}`}></span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, padding: "0 20px 16px" }}>
          {page > 0 && (
            <button onClick={() => setPage(page - 1)} style={{
              flex: "0 0 auto", padding: "16px 18px", borderRadius: 24,
              background: "transparent", border: "0.5px solid var(--border)",
              color: "var(--accent)", fontSize: 16, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit",
            }}>Back</button>
          )}
          <div className="onb-cta" style={{ flex: 1, margin: 0 }} onClick={advance}>{cta}</div>
        </div>
      </div>
    </div>
  );
}

window.Onboarding = Onboarding;
