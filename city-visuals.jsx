// City visual identities — semi-abstract SVG scenes per city.
//
// Each <CityVisual id state /> renders a 280×64 banner with:
//   1. A weather-tinted background gradient (state: rainy / sunny / neutral)
//   2. A back layer of soft mist/fog/glow
//   3. A foreground silhouette evoking the city's signature architecture
//   4. State-specific atmosphere (rain streaks for rainy, warm sun for sunny,
//      cool haze for neutral)
//
// Goal: the Cities drawer should feel like a Weather Deck — each card
// distinctive but typographically quiet. Silhouettes only, no logos, no photos.
//
// `tone` can override the mood for a city (e.g. Tokyo always reads "neon-rain"
// even on a clear day) — pass nothing to follow weather state.

(function () {
  // Weather-state palettes. A = sky top, B = sky bottom, C = silhouette,
  // D = atmosphere accent (rain streak / sun bloom / haze tint).
  const PAL = {
    rainy:   { a: "#1f3142", b: "#3a5874", c: "#0d1a26", d: "#a8c8e8" },
    sunny:   { a: "#f4a96a", b: "#e87a4e", c: "#3a2418", d: "#fde1a8" },
    neutral: { a: "#3d4858", b: "#5b6878", c: "#1a2230", d: "#c7cfdb" },
  };

  // City-specific tweaks. Each entry: optional palette override + a `paint`
  // function that draws SVG fragments inside a 280×64 viewBox.
  // Helpers passed in: { p (palette), R (state) }.
  const SCENES = {
    // ── İstanbul — Bosphorus, dome + minarets + bridge cable ──
    ist: {
      paint: ({ p }) => (
        <g>
          {/* far hill */}
          <path d="M0 50 Q70 38 140 44 T280 42 L280 64 L0 64 Z" fill={p.c} opacity="0.45"/>
          {/* dome + minarets cluster */}
          <g fill={p.c}>
            <circle cx="78" cy="42" r="11"/>
            <rect x="76" y="42" width="4" height="14"/>
            <rect x="62" y="22" width="2" height="34"/>
            <circle cx="63" cy="20" r="2"/>
            <rect x="94" y="22" width="2" height="34"/>
            <circle cx="95" cy="20" r="2"/>
            <rect x="50" y="32" width="2" height="24"/>
            <rect x="106" y="32" width="2" height="24"/>
          </g>
          {/* Bosphorus bridge — two pylons + suspension arc */}
          <g fill="none" stroke={p.c} strokeWidth="1.4" opacity="0.85">
            <path d="M150 56 Q200 22 250 56"/>
            <line x1="170" y1="22" x2="170" y2="56"/>
            <line x1="230" y1="22" x2="230" y2="56"/>
            <path d="M150 56 L250 56" strokeWidth="2.5"/>
          </g>
          {/* water shimmer */}
          <line x1="0" y1="60" x2="280" y2="60" stroke={p.d} strokeWidth="0.6" opacity="0.35"/>
        </g>
      ),
    },

    // ── Amsterdam — canal house gables (stepped roofs) ──
    ams: {
      paint: ({ p }) => (
        <g>
          <path d="M0 56 L280 56 L280 64 L0 64 Z" fill={p.c} opacity="0.5"/>
          <g fill={p.c}>
            {[10,46,82,118,154,190,226,250].map((x,i)=>{
              // alternating stepped gable / pointed gable / bell gable shapes
              const variant = i % 3;
              if (variant === 0) return (
                <path key={i} d={`M${x} 56 L${x} 32 L${x+6} 32 L${x+6} 26 L${x+12} 26 L${x+12} 20 L${x+18} 20 L${x+18} 26 L${x+24} 26 L${x+24} 32 L${x+30} 32 L${x+30} 56 Z`}/>
              );
              if (variant === 1) return (
                <path key={i} d={`M${x} 56 L${x} 30 L${x+15} 18 L${x+30} 30 L${x+30} 56 Z`}/>
              );
              return (
                <path key={i} d={`M${x} 56 L${x} 30 Q${x+15} 14 ${x+30} 30 L${x+30} 56 Z`}/>
              );
            })}
          </g>
          {/* canal reflection */}
          <rect x="0" y="58" width="280" height="6" fill={p.d} opacity="0.18"/>
          <line x1="0" y1="60" x2="280" y2="60" stroke={p.d} strokeWidth="0.4" opacity="0.5"/>
        </g>
      ),
    },

    // ── Lisbon — São Jorge silhouette + tram cable + warm tile pattern ──
    lis: {
      paint: ({ p }) => (
        <g>
          {/* hilltop castle silhouette */}
          <path d="M0 56 L40 56 L40 40 L48 40 L48 32 L56 32 L56 38 L72 38 L72 30 L80 30 L80 38 L96 38 L96 44 L120 44 L120 56 Z" fill={p.c} opacity="0.85"/>
          {/* simple roofline */}
          <path d="M120 56 L150 50 L168 46 L186 50 L210 46 L240 50 L280 48 L280 64 L0 64 Z" fill={p.c} opacity="0.55"/>
          {/* azulejo tile pattern strip */}
          <g opacity="0.35">
            {Array.from({length:14}).map((_,i)=>(
              <g key={i} transform={`translate(${i*20+4},54)`}>
                <rect width="16" height="6" fill={p.d} opacity="0.6"/>
                <path d="M0 3 L8 0 L16 3 L8 6 Z" fill={p.c} opacity="0.25"/>
              </g>
            ))}
          </g>
          {/* tram wire */}
          <line x1="0" y1="14" x2="280" y2="14" stroke={p.c} strokeWidth="0.4" opacity="0.4"/>
        </g>
      ),
    },

    // ── London — Big Ben tower + Parliament blocks + fog haze ──
    lon: {
      paint: ({ p }) => (
        <g>
          {/* fog band */}
          <rect x="0" y="38" width="280" height="14" fill={p.d} opacity="0.18"/>
          {/* parliament block */}
          <g fill={p.c}>
            <rect x="120" y="38" width="46" height="18"/>
            <path d="M120 38 L122 32 L124 38 M130 38 L132 30 L134 38 M140 38 L142 28 L144 38 M150 38 L152 30 L154 38 M160 38 L162 32 L164 38" stroke={p.c} strokeWidth="0.8" fill="none"/>
            {/* Big Ben */}
            <rect x="170" y="22" width="10" height="34"/>
            <path d="M170 22 L175 14 L180 22 Z"/>
            <rect x="173" y="26" width="4" height="4" fill={p.d} opacity="0.6"/>
          </g>
          {/* low london skyline */}
          <g fill={p.c} opacity="0.55">
            <rect x="0"   y="44" width="40" height="12"/>
            <rect x="44"  y="40" width="34" height="16"/>
            <rect x="80"  y="46" width="28" height="10"/>
            <rect x="190" y="42" width="30" height="14"/>
            <rect x="222" y="44" width="36" height="12"/>
            <rect x="260" y="40" width="20" height="16"/>
          </g>
          <rect x="0" y="56" width="280" height="8" fill={p.c} opacity="0.65"/>
        </g>
      ),
    },

    // ── Tokyo — vertical neon signs + rain ──
    tok: {
      paint: ({ p }) => (
        <g>
          {/* dense building blocks */}
          <g fill={p.c}>
            {[0,32,58,82,108,134,166,196,222,250].map((x,i)=>{
              const h = [22,36,18,30,40,26,34,20,32,24][i];
              return <rect key={i} x={x} y={56-h} width={i%2?22:26} height={h}/>;
            })}
          </g>
          {/* vertical neon strips (kanji-style verticals) */}
          <g>
            <rect x="40" y="22" width="3" height="26" fill="#ff5f7a" opacity="0.9"/>
            <rect x="92" y="14" width="2" height="32" fill="#ffd166" opacity="0.85"/>
            <rect x="146" y="20" width="3" height="22" fill="#5fd0e8" opacity="0.85"/>
            <rect x="206" y="18" width="2" height="28" fill="#c47bf0" opacity="0.85"/>
            <rect x="262" y="24" width="2" height="20" fill="#ff5f7a" opacity="0.7"/>
          </g>
          {/* rain streaks */}
          <g stroke={p.d} strokeWidth="0.5" opacity="0.55">
            {Array.from({length:18}).map((_,i)=>{
              const x = (i*16 + 7) % 280;
              const y = (i*23) % 30 + 4;
              return <line key={i} x1={x} y1={y} x2={x-3} y2={y+8}/>;
            })}
          </g>
          <rect x="0" y="56" width="280" height="8" fill={p.c}/>
        </g>
      ),
    },

    // ── Ankara — rolling steppe + Atatürk Mausoleum columns ──
    ank: {
      paint: ({ p }) => (
        <g>
          {/* steppe hills */}
          <path d="M0 52 Q60 40 120 48 T280 44 L280 64 L0 64 Z" fill={p.c} opacity="0.45"/>
          <path d="M0 58 Q90 48 180 54 T280 52 L280 64 L0 64 Z" fill={p.c} opacity="0.7"/>
          {/* mausoleum: long colonnade on a plinth */}
          <g fill={p.c}>
            <rect x="92" y="40" width="96" height="4"/>
            {Array.from({length:11}).map((_,i)=>(
              <rect key={i} x={94+i*9} y="22" width="2.5" height="18"/>
            ))}
            <rect x="90" y="20" width="100" height="3"/>
            <rect x="88" y="44" width="104" height="3"/>
          </g>
        </g>
      ),
    },

    // ── İzmir — Konak clock tower + Aegean + palms ──
    izm: {
      paint: ({ p }) => (
        <g>
          {/* sea horizon */}
          <rect x="0" y="44" width="280" height="20" fill={p.d} opacity="0.22"/>
          {/* clock tower (multi-tier) */}
          <g fill={p.c}>
            <rect x="130" y="20" width="14" height="30"/>
            <rect x="126" y="50" width="22" height="6"/>
            <circle cx="137" cy="28" r="3" fill={p.d} opacity="0.7"/>
            <rect x="135" y="14" width="4" height="8"/>
            <rect x="136" y="10" width="2" height="6"/>
            {/* small mosque dome */}
            <circle cx="80" cy="46" r="6"/>
            <rect x="78" y="46" width="4" height="8"/>
            <rect x="68" y="32" width="1.5" height="22"/>
          </g>
          {/* palms */}
          <g stroke={p.c} strokeWidth="1.2" fill="none">
            <line x1="200" y1="56" x2="202" y2="38"/>
            <path d="M202 38 Q210 34 215 36 M202 38 Q194 34 188 38 M202 38 Q205 32 209 30 M202 38 Q199 32 195 30"/>
            <line x1="232" y1="56" x2="234" y2="42"/>
            <path d="M234 42 Q242 38 246 40 M234 42 Q226 38 222 42 M234 42 Q237 36 240 35"/>
          </g>
          {/* shoreline */}
          <line x1="0" y1="58" x2="280" y2="58" stroke={p.c} strokeWidth="1" opacity="0.6"/>
        </g>
      ),
    },

    // ── Paris — Eiffel + Haussmann roofline ──
    par: {
      paint: ({ p }) => (
        <g>
          <path d="M0 50 L20 48 L40 50 L60 46 L88 48 L120 44 L150 46 L180 44 L210 48 L240 46 L280 50 L280 64 L0 64 Z" fill={p.c} opacity="0.55"/>
          {/* eiffel */}
          <g fill={p.c}>
            <path d="M138 56 L140 26 L132 56 Z"/>
            <path d="M148 56 L146 26 L154 56 Z"/>
            <rect x="138" y="22" width="10" height="6"/>
            <rect x="139" y="14" width="8" height="8"/>
            <rect x="141" y="6" width="4" height="8"/>
            <rect x="142" y="0" width="2" height="6"/>
          </g>
          <line x1="132" y1="40" x2="154" y2="40" stroke={p.c} strokeWidth="0.7"/>
          <rect x="0" y="56" width="280" height="8" fill={p.c}/>
        </g>
      ),
    },

    // ── Rome — Colosseum arches + dome ──
    rom: {
      paint: ({ p }) => (
        <g>
          {/* roofline */}
          <path d="M0 54 L60 50 L100 54 L160 50 L200 54 L240 50 L280 54 L280 64 L0 64 Z" fill={p.c} opacity="0.5"/>
          {/* colosseum (arched ellipse) */}
          <g fill={p.c}>
            <path d="M40 56 Q40 30 90 30 Q140 30 140 56 Z"/>
            {Array.from({length:5}).map((_,i)=>(
              <rect key={i} x={50+i*18} y="40" width="6" height="10" rx="3" fill={p.b}/>
            ))}
            {Array.from({length:7}).map((_,i)=>(
              <rect key={i} x={46+i*13} y="32" width="4" height="6" rx="2" fill={p.b} opacity="0.7"/>
            ))}
          </g>
          {/* St Peter dome */}
          <g fill={p.c}>
            <path d="M194 50 Q210 28 226 50 Z"/>
            <rect x="208" y="22" width="4" height="8"/>
            <rect x="194" y="50" width="32" height="6"/>
          </g>
        </g>
      ),
    },

    // ── New York — block grid + Empire State spire + Chrysler-ish triangles ──
    nyc: {
      paint: ({ p }) => (
        <g>
          <g fill={p.c}>
            <rect x="0"   y="40" width="22" height="16"/>
            <rect x="24"  y="32" width="20" height="24"/>
            <rect x="46"  y="44" width="16" height="12"/>
            <rect x="64"  y="28" width="22" height="28"/>
            {/* empire state */}
            <rect x="92"  y="22" width="18" height="34"/>
            <rect x="98"  y="14" width="6"  height="8"/>
            <rect x="100" y="6"  width="2"  height="8"/>
            <rect x="100" y="0"  width="1.2" height="6"/>
            <rect x="114" y="36" width="20" height="20"/>
            <rect x="138" y="30" width="18" height="26"/>
            {/* chrysler triangles */}
            <path d="M158 56 L168 22 L178 56 Z"/>
            <rect x="166" y="10" width="4" height="14"/>
            <rect x="167" y="2"  width="2" height="8"/>
            <rect x="184" y="34" width="22" height="22"/>
            <rect x="208" y="40" width="18" height="16"/>
            <rect x="228" y="28" width="22" height="28"/>
            <rect x="252" y="38" width="20" height="18"/>
            <rect x="274" y="44" width="6"  height="12"/>
          </g>
          {/* lit windows */}
          <g fill={p.d} opacity="0.55">
            {Array.from({length:24}).map((_,i)=>(
              <rect key={i} x={(i*11)+5} y={32+(i%4)*5} width="1.5" height="1.5"/>
            ))}
          </g>
        </g>
      ),
    },

    // ── San Francisco — Golden Gate suspension + fog ──
    sfo: {
      paint: ({ p }) => (
        <g>
          {/* fog band */}
          <rect x="0" y="34" width="280" height="14" fill={p.d} opacity="0.25"/>
          {/* hills */}
          <path d="M0 50 Q60 42 140 48 T280 44 L280 64 L0 64 Z" fill={p.c} opacity="0.5"/>
          {/* suspension bridge */}
          <g stroke={p.c} fill="none" strokeWidth="1.6">
            {/* deck */}
            <line x1="0" y1="50" x2="280" y2="50" strokeWidth="2.2"/>
            {/* towers */}
            <line x1="80"  y1="6"  x2="80"  y2="50"/>
            <line x1="200" y1="6"  x2="200" y2="50"/>
            <line x1="78"  y1="6"  x2="82"  y2="6"/>
            <line x1="198" y1="6"  x2="202" y2="6"/>
            {/* main cable */}
            <path d="M0 30 Q40 14 80 6 Q140 36 200 6 Q240 14 280 30"/>
            {/* hangers */}
            {Array.from({length:18}).map((_,i)=>{
              const x = i*15 + 10;
              const top = x < 80
                ? 30 - (x/80)*24
                : x < 200
                  ? 6 + Math.abs((x-140)/60)*30
                  : 30 - ((280-x)/80)*24;
              return <line key={i} x1={x} y1={top} x2={x} y2={50} strokeWidth="0.5"/>;
            })}
          </g>
          <rect x="0" y="56" width="280" height="8" fill={p.c} opacity="0.7"/>
        </g>
      ),
    },

    // ── Los Angeles — palm row + low rises + warm haze ──
    lax: {
      paint: ({ p }) => (
        <g>
          {/* low downtown */}
          <g fill={p.c} opacity="0.6">
            <rect x="100" y="38" width="14" height="18"/>
            <rect x="116" y="32" width="18" height="24"/>
            <rect x="136" y="40" width="12" height="16"/>
            <rect x="150" y="34" width="16" height="22"/>
            <rect x="168" y="42" width="12" height="14"/>
          </g>
          {/* palms repeating */}
          <g stroke={p.c} strokeWidth="1.3" fill="none">
            {[8,40,72,210,240,272].map((x,i)=>(
              <g key={i}>
                <line x1={x} y1="56" x2={x+2} y2="20"/>
                <path d={`M${x+2} 20 Q${x+12} 14 ${x+18} 18 M${x+2} 20 Q${x-8} 14 ${x-14} 18 M${x+2} 20 Q${x+6} 10 ${x+12} 8 M${x+2} 20 Q${x-2} 10 ${x-8} 8`}/>
              </g>
            ))}
          </g>
          {/* sun bloom */}
          <circle cx="220" cy="22" r="10" fill={p.d} opacity="0.4"/>
          <rect x="0" y="56" width="280" height="8" fill={p.c} opacity="0.55"/>
        </g>
      ),
    },

    // ── Dubai — dunes + Burj-style needle ──
    duv: {
      paint: ({ p }) => (
        <g>
          {/* dunes */}
          <path d="M0 56 Q70 44 140 52 T280 48 L280 64 L0 64 Z" fill={p.c} opacity="0.55"/>
          <path d="M0 60 Q90 54 180 58 T280 56 L280 64 L0 64 Z" fill={p.c} opacity="0.85"/>
          {/* burj */}
          <g fill={p.c}>
            <path d="M148 56 L150 4 L152 56 Z"/>
            <path d="M144 56 L150 18 L156 56 Z" opacity="0.85"/>
            <path d="M140 56 L150 32 L160 56 Z" opacity="0.65"/>
          </g>
          {/* sun */}
          <circle cx="60" cy="20" r="11" fill={p.d} opacity="0.6"/>
        </g>
      ),
    },

    // ── Berlin — TV tower + brutalist blocks ──
    ber: {
      paint: ({ p }) => (
        <g>
          <g fill={p.c}>
            <rect x="0"   y="42" width="50" height="14"/>
            <rect x="54"  y="36" width="40" height="20"/>
            <rect x="98"  y="44" width="34" height="12"/>
            {/* TV tower */}
            <rect x="148" y="56" width="4" height="0"/>
            <line x1="150" y1="56" x2="150" y2="14" stroke={p.c} strokeWidth="2"/>
            <circle cx="150" cy="20" r="6"/>
            <rect x="148" y="2" width="4" height="14"/>
            <rect x="170" y="38" width="40" height="18"/>
            <rect x="214" y="42" width="36" height="14"/>
            <rect x="252" y="40" width="28" height="16"/>
          </g>
          <rect x="0" y="56" width="280" height="8" fill={p.c}/>
        </g>
      ),
    },

    // ── Athens — Acropolis on a hill ──
    ath: {
      paint: ({ p }) => (
        <g>
          {/* hill */}
          <path d="M0 56 Q140 22 280 56 Z" fill={p.c} opacity="0.45"/>
          {/* parthenon */}
          <g fill={p.c}>
            <rect x="108" y="28" width="64" height="3"/>
            {Array.from({length:9}).map((_,i)=>(
              <rect key={i} x={112+i*7} y="31" width="2.5" height="14"/>
            ))}
            <rect x="106" y="45" width="68" height="3"/>
            <path d="M106 28 L140 18 L174 28 Z"/>
          </g>
        </g>
      ),
    },

    // ── Madrid / Barcelona — share a Mediterranean low-skyline + sun ──
    mad: { tone: "warm-roof",
      paint: ({ p }) => (
        <g>
          <path d="M0 50 L24 48 L48 52 L72 48 L96 50 L120 46 L144 50 L168 48 L192 52 L216 48 L240 50 L280 48 L280 64 L0 64 Z" fill={p.c} opacity="0.55"/>
          {/* cathedral domes */}
          <circle cx="120" cy="42" r="6" fill={p.c}/>
          <rect x="118" y="40" width="4" height="12" fill={p.c}/>
          <circle cx="186" cy="44" r="5" fill={p.c}/>
          <rect x="184" y="42" width="4" height="10" fill={p.c}/>
          <circle cx="50" cy="22" r="9" fill={p.d} opacity="0.55"/>
          <rect x="0" y="56" width="280" height="8" fill={p.c} opacity="0.7"/>
        </g>
      ),
    },
    bcn: {
      paint: ({ p }) => (
        <g>
          {/* sagrada-style spires */}
          <g fill={p.c}>
            {[120,134,148,162].map((x,i)=>(
              <g key={i}>
                <path d={`M${x-2} 56 L${x} ${10+i*2} L${x+2} 56 Z`}/>
                <circle cx={x} cy={10+i*2} r="1.5"/>
              </g>
            ))}
          </g>
          <path d="M0 52 L100 48 L180 50 L280 48 L280 64 L0 64 Z" fill={p.c} opacity="0.55"/>
          <circle cx="240" cy="20" r="9" fill={p.d} opacity="0.5"/>
        </g>
      ),
    },
  };

  // Generic fallback — abstract horizon with random tower silhouettes,
  // seeded by city ID so the same city always gets the same scene.
  function paintGeneric(p, id) {
    let seed = 0; for (let i=0;i<id.length;i++) seed = (seed*31 + id.charCodeAt(i)) & 0xffff;
    const rand = () => { seed = (seed*9301 + 49297) & 0x7fffffff; return seed / 0x7fffffff; };
    const blocks = [];
    let x = 0;
    while (x < 280) {
      const w = 12 + Math.round(rand()*22);
      const h = 8 + Math.round(rand()*36);
      blocks.push({ x, w, h });
      x += w + 1;
    }
    return (
      <g>
        <path d="M0 52 Q70 46 140 50 T280 48 L280 64 L0 64 Z" fill={p.c} opacity="0.4"/>
        <g fill={p.c}>
          {blocks.map((b,i) => <rect key={i} x={b.x} y={56-b.h} width={b.w} height={b.h}/>)}
        </g>
        <rect x="0" y="56" width="280" height="8" fill={p.c} opacity="0.85"/>
      </g>
    );
  }

  // ── Atmospheric overlay: rain streaks / sun bloom / haze stripe ──
  function paintAtmosphere(state, p) {
    if (state === "rainy") {
      return (
        <g opacity="0.55" stroke={p.d} strokeWidth="0.45">
          {Array.from({length:22}).map((_,i)=>{
            const x = (i*13.7) % 280;
            const y = (i*7) % 24;
            return <line key={i} x1={x} y1={y} x2={x-2} y2={y+10}/>;
          })}
        </g>
      );
    }
    if (state === "sunny") {
      return (
        <g>
          <radialGradient id="sun-bloom" cx="0.85" cy="0" r="0.9">
            <stop offset="0" stopColor={p.d} stopOpacity="0.45"/>
            <stop offset="1" stopColor={p.d} stopOpacity="0"/>
          </radialGradient>
          <rect x="0" y="0" width="280" height="64" fill="url(#sun-bloom)"/>
        </g>
      );
    }
    return (
      <g>
        <rect x="0" y="20" width="280" height="22" fill={p.d} opacity="0.10"/>
      </g>
    );
  }

  function CityVisual({ id, state = "neutral", className, style }) {
    const p = PAL[state] || PAL.neutral;
    const scene = SCENES[id];
    const gradId = `cv-sky-${id}-${state}`;
    return (
      <svg
        className={className}
        viewBox="0 0 280 64"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "100%", ...style }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"   stopColor={p.a}/>
            <stop offset="1"   stopColor={p.b}/>
          </linearGradient>
        </defs>
        {/* sky */}
        <rect x="0" y="0" width="280" height="64" fill={`url(#${gradId})`}/>
        {/* atmosphere behind silhouette */}
        {paintAtmosphere(state, p)}
        {/* silhouette */}
        {scene ? scene.paint({ p, state }) : paintGeneric(p, id)}
        {/* foreground veil — soft black at base for legibility of overlaid copy */}
        <linearGradient id={`cv-veil-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0"   stopColor="rgba(0,0,0,0)"/>
          <stop offset="1"   stopColor="rgba(0,0,0,0.30)"/>
        </linearGradient>
        <rect x="0" y="0" width="280" height="64" fill={`url(#cv-veil-${id})`}/>
      </svg>
    );
  }

  window.CityVisual = CityVisual;
})();
