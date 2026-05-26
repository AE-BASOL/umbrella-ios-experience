// Phone wrapper — uses ios-frame.jsx; switches between dashboard / settings.

function PhoneApp({ initialScreen = "dashboard", scenario = "rainy", drawerOpen: drawerOpenProp = false, tweaks }) {
  const [screen, setScreen]       = React.useState(initialScreen);
  const [scen, setScen]           = React.useState(scenario);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen]     = React.useState(drawerOpenProp);
  const [activeCityId, setActiveCityId] = React.useState("ist");
  const [alerts, setAlerts]       = React.useState(window.PERSONAL_ALERTS_DEFAULT || []);
  const [theme]                   = React.useState("light");

  const mood           = tweaks?.mood || "bohem";
  const atmos          = tweaks?.atmos ?? 50;
  const atmosBucketName = window.atmosBucket
    ? window.atmosBucket(atmos)
    : (atmos < 25 ? "flat" : atmos < 75 ? "mid" : "wash");

  const prefersDark = typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : false;
  const isDark = theme === "dark" || (theme === "auto" && prefersDark);

  function handleSelectCity(city) {
    setActiveCityId(city.id);
    setScen(city.state);   // ← ana ekranı değiştir
    setDrawerOpen(false);
  }

  // ctx kept for Settings compatibility
  const ctx    = { cities: window.SAVED_CITIES || [], activeCityId, alerts, theme };
  const setCtx = () => {};

  return (
    <IOSDevice width={390} height={844} dark={isDark}>
      {screen === "onboarding" ? (
        <Onboarding
          onFinish={() => setScreen("dashboard")}
          onApplyAlerts={(a) => setAlerts(a)}
        />
      ) : (
        <div
          style={{ position:"relative", width:"100%", height:"100%", overflow:"hidden" }}
          data-mood={mood}
          data-atmos-bucket={atmosBucketName}
          data-theme={isDark ? "dark" : "light"}
          className="ut-root"
        >
          {atmosBucketName === "wash" && <WatercolorWash scenario={scen} />}

          <Dashboard
            scenario={scen}
            mock={false}
            alerts={alerts}
            tweaks={tweaks}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenDrawer={() => setDrawerOpen(true)}
          />

          <LeftDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            activeCityId={activeCityId}
            onSelectCity={handleSelectCity}
          />

          <div className={`sheet-backdrop ${settingsOpen ? "on" : ""}`} onClick={() => setSettingsOpen(false)}></div>
          <div className={`sheet ${settingsOpen ? "on" : ""}`}>
            <div className="sheet-grabber"></div>
            <div className="sheet-body">
              <Settings
                visualState={scen}
                onClose={() => setSettingsOpen(false)}
                ctx={ctx}
                setCtx={setCtx}
                onOpenDrawer={() => { setSettingsOpen(false); setDrawerOpen(true); }}
                tweaks={tweaks}
              />
            </div>
          </div>
        </div>
      )}
    </IOSDevice>
  );
}

// Watercolor wash decoration
function WatercolorWash({ scenario }) {
  return (
    <div className="ut-wash" data-state={scenario} aria-hidden="true">
      <span className="ut-wash-blob b1"></span>
      <span className="ut-wash-blob b2"></span>
      <span className="ut-wash-blob b3"></span>
      <span className="ut-wash-grain"></span>
    </div>
  );
}

window.PhoneApp = PhoneApp;
