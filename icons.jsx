// Iconography — inline SVGs styled to current color tokens.
const Icon = {
  Gear: ({size = 14, color = "currentColor"}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.3 7.3 0 0 0-1.69-.98l-.38-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.49.42l-.38 2.65c-.61.25-1.18.58-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64L4.57 11c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.14.24.43.34.61.22l2.49-1c.51.4 1.08.73 1.69.98l.38 2.65c.05.24.25.42.49.42h4c.24 0 .44-.18.49-.42l.38-2.65c.61-.25 1.18-.58 1.69-.98l2.49 1c.18.07.47-.02.61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
    </svg>
  ),
  Clock: ({size = 11, color = "currentColor"}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 2"/>
    </svg>
  ),
  Radio: ({size = 11, color = "currentColor"}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="2" fill={color}/>
      <path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 15.5a5 5 0 0 0 0-7"/>
      <path d="M5.5 5.5a9 9 0 0 0 0 13M18.5 18.5a9 9 0 0 0 0-13"/>
    </svg>
  ),
  Tube: ({size = 11, color = "currentColor"}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6v3l-2 2v8a3 3 0 1 1-6 0V8L5 6V3h4z" transform="translate(2,0)"/>
    </svg>
  ),
  Pin: ({size = 11, color = "currentColor"}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
    </svg>
  ),
  Sparkles: ({size = 11, color = "currentColor"}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zM18 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14z"/>
    </svg>
  ),
  Check: ({size = 14, color = "currentColor"}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5L10 17.5L20 7"/>
    </svg>
  ),
  Plane: ({size = 15, color = "currentColor"}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
    </svg>
  ),
  Play: ({size = 15, color = "currentColor"}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <rect x="3" y="5" width="18" height="14" rx="3"/>
      <polygon points="10,8 16,12 10,16" fill="white"/>
    </svg>
  ),
  Clipboard: ({size = 15, color = "currentColor"}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M9 2h6a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V3a1 1 0 0 1 1-1zm0 2v2h6V4H9z"/>
    </svg>
  ),
  Reload: ({size = 15, color = "currentColor"}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/>
      <path d="M21 4v4h-4"/>
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/>
      <path d="M3 20v-4h4"/>
    </svg>
  ),
  Seal: ({size = 18, color = "currentColor"}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M12 1l2.4 2 3 .3.3 3 2 2.4-1.6 2.6 1 2.9-2.7 1.4-1.1 2.8-3-.5L12 21l-2.3-1.6-3 .5-1.1-2.8L2.9 15.7l1-2.9L2.3 10.2l2-2.4.3-3 3-.3L10 2.5z"/>
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  ChevDown: ({size = 12, color = "currentColor"}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  ),
  Close: ({size = 14, color = "currentColor"}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18"/>
    </svg>
  ),
};

// Stylized brand glyphs — directly translated from AppUmbrellaGlyph / AppSunGlyph
function UmbrellaGlyph({ size = 124 }) {
  const w = size, h = size * 0.9;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{display:"block"}}>
      {/* canopy */}
      <path
        d={`M ${w*0.14} ${h*0.42} Q ${w*0.26} ${h*0.08} ${w*0.50} ${h*0.12} Q ${w*0.74} ${h*0.08} ${w*0.86} ${h*0.42} L ${w*0.14} ${h*0.42} Z`}
        fill="var(--icon-light)"
      />
      {/* scallop strokes */}
      <path
        d={`M ${w*0.18} ${h*0.42} Q ${w*0.26} ${h*0.55} ${w*0.34} ${h*0.42} Q ${w*0.42} ${h*0.30} ${w*0.50} ${h*0.42} Q ${w*0.58} ${h*0.55} ${w*0.66} ${h*0.42} Q ${w*0.74} ${h*0.30} ${w*0.82} ${h*0.42}`}
        fill="none"
        stroke="var(--icon-dark)"
        strokeWidth={Math.max(1.5, w * 0.035)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* handle */}
      <path
        d={`M ${w*0.50} ${h*0.16} L ${w*0.50} ${h*0.62} Q ${w*0.50} ${h*0.78} ${w*0.62} ${h*0.74}`}
        fill="none"
        stroke="var(--icon-dark)"
        strokeWidth={Math.max(2.0, w * 0.045)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* top knob */}
      <circle cx={w*0.50} cy={h*0.12} r={Math.max(3, w*0.0425)} fill="var(--icon-dark)" />
    </svg>
  );
}

function SunGlyph({ size = 124 }) {
  const w = size, h = size * 0.9;
  const cx = w * 0.5, cy = h * 0.46;
  const outerR = Math.min(w, h) * 0.20;
  const innerR = outerR * 0.62;
  const rayLen = outerR * 0.62;
  const rays = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    rays.push({
      x1: cx + Math.cos(a) * (outerR + 4),
      y1: cy + Math.sin(a) * (outerR + 4),
      x2: cx + Math.cos(a) * (outerR + rayLen),
      y2: cy + Math.sin(a) * (outerR + rayLen),
    });
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{display:"block"}}>
      <circle cx={cx} cy={cy} r={outerR * 1.2} fill="var(--icon-light)" opacity="0.9" />
      <circle cx={cx} cy={cy} r={innerR * 1.1} fill="var(--icon-dark)" />
      {rays.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke="var(--icon-light)"
          strokeWidth={Math.max(1.5, w * 0.03)}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function QGlyph({ size = 124 }) {
  // Question-mark — neutral fallback, mirrors questionmark.circle.fill
  return (
    <svg viewBox="0 0 24 24" width={size} height={size * 0.9}>
      <circle cx="12" cy="12" r="10" fill="var(--icon-dark)" />
      <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--bg)" fontFamily="-apple-system,system-ui,sans-serif">?</text>
    </svg>
  );
}

function WeatherIcon({ state, size }) {
  if (state === "rainy") return <UmbrellaGlyph size={size} />;
  if (state === "sunny") return <SunGlyph size={size} />;
  return <QGlyph size={size} />;
}

window.Icon = Icon;
window.UmbrellaGlyph = UmbrellaGlyph;
window.SunGlyph = SunGlyph;
window.WeatherIcon = WeatherIcon;
