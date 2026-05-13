// WORLD PRESSURE MAP — Cantina Simulated Universes
// True isometric grid: SVG cube tiles with top + left + right faces.

// ── ISOMETRIC MATH ────────────────────────────────────────────────────
const GRID_SIZE  = 24;
const TILE_W     = 80;   // tile face width
const TILE_H     = 40;   // tile face height (2:1 ratio)
const TILE_DEPTH = 40;   // side face height — equal to TILE_H for true cube proportions

// Offset so leftmost tile (col=0,row=GRID_SIZE-1) starts at x=0
const ISO_OX = (GRID_SIZE - 1) * (TILE_W / 2);
const ISO_SVG_W = GRID_SIZE * TILE_W;
const ISO_SVG_H = GRID_SIZE * TILE_H + TILE_DEPTH + 4;

const isoToScreen = (col, row) => ({
  x: (col - row) * (TILE_W / 2) + ISO_OX,
  y: (col + row) * (TILE_H / 2),
});

const seeded = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ── TERRAIN ───────────────────────────────────────────────────────────
// ALL tiles share the same deep-purple base platform (matching reference art).
// Terrain type is expressed through feature art rendered on top, not tile color.
// Water gets a subtle blue-tinted top. Urban is slightly darker violet.
const TERRAIN_3D = {
  plains: {
    top: "#1E1248", lft: "#130D30", rgt: "#0A0820",
    line: "rgba(110,65,255,0.55)", edge: "rgba(80,45,200,0.3)",
    hl: "#2C1A68", hlLft: "#1C1244", hlRgt: "#10082C", hlLine: "rgba(150,100,255,1)",
  },
  hills: {
    top: "#1E1248", lft: "#130D30", rgt: "#0A0820",
    line: "rgba(110,65,255,0.55)", edge: "rgba(80,45,200,0.3)",
    hl: "#2C1A68", hlLft: "#1C1244", hlRgt: "#10082C", hlLine: "rgba(150,100,255,1)",
  },
  water: {
    top: "#0E1245", lft: "#090C2E", rgt: "#05081E",
    line: "rgba(0,180,255,0.7)", edge: "rgba(0,130,220,0.3)",
    hl: "#162060", hlLft: "#0E163E", hlRgt: "#080E28", hlLine: "rgba(0,230,255,1)",
  },
  forest: {
    top: "#1A1045", lft: "#11092E", rgt: "#09061E",
    line: "rgba(100,60,240,0.55)", edge: "rgba(70,40,190,0.3)",
    hl: "#281862", hlLft: "#18103E", hlRgt: "#0E0828", hlLine: "rgba(130,90,255,1)",
  },
  urban: {
    top: "#160E42", lft: "#0E092A", rgt: "#08061C",
    line: "rgba(130,70,255,0.6)", edge: "rgba(90,50,220,0.35)",
    hl: "#221460", hlLft: "#160E3C", hlRgt: "#0C0826", hlLine: "rgba(160,100,255,1)",
  },
};

const TERRAIN_MAP = Array.from({ length: GRID_SIZE }, (_, r) =>
  Array.from({ length: GRID_SIZE }, (_, c) => {
    const s = seeded(r * GRID_SIZE + c);
    if (s < 0.12) return "water";
    if (s < 0.28) return "forest";
    if (s < 0.42) return "hills";
    if (s < 0.52) return "urban";
    return "plains";
  })
);
const getTerrain = (col, row) => TERRAIN_MAP[row]?.[col] || "plains";

// Universe 2 — alternate seeded terrain for the second reality layer
const TERRAIN_MAP_2 = Array.from({ length: GRID_SIZE }, (_, r) =>
  Array.from({ length: GRID_SIZE }, (_, c) => {
    const s = seeded(r * GRID_SIZE + c + 8317);
    if (s < 0.18) return "water";
    if (s < 0.35) return "urban";
    if (s < 0.50) return "hills";
    if (s < 0.62) return "forest";
    return "plains";
  })
);
const getTerrain2 = (col, row) => TERRAIN_MAP_2[row]?.[col] || "plains";

// Pre-sorted tile render order (painter's algorithm: back to front)
const SORTED_TILES = (() => {
  const tiles = [];
  for (let r = 0; r < GRID_SIZE; r++)
    for (let c = 0; c < GRID_SIZE; c++)
      tiles.push({ c, r, d: c + r });
  return tiles.sort((a, b) => a.d - b.d || a.c - b.c);
})();

// ── STAMP DATA ────────────────────────────────────────────────────────
const STAMP_CATEGORIES = [
  {
    id: "env", label: "Environmental", color: "#2DFF78", colorRgb: "45,255,120",
    stamps: [
      { id: "hurricane", icon: "🌀", label: "Hurricane / Storm", radius: 140 },
      { id: "flood",     icon: "🌊", label: "Flood / Tsunami",   radius: 110 },
      { id: "wildfire",  icon: "🔥", label: "Wildfire",          radius: 90  },
      { id: "cold",      icon: "❄️", label: "Extreme Cold",      radius: 130 },
      { id: "volcano",   icon: "🌋", label: "Volcanic Eruption", radius: 100 },
      { id: "radiation", icon: "☢️", label: "Radiation",         radius: 120 },
    ],
  },
  {
    id: "conflict", label: "Conflict", color: "#CC2200", colorRgb: "204,34,0",
    stamps: [
      { id: "military", icon: "💥", label: "Military Conflict", radius: 150 },
      { id: "meta",     icon: "🦸", label: "Metahuman Event",   radius: 120 },
      { id: "bombing",  icon: "💣", label: "Bombing / Attack",  radius: 70  },
      { id: "surveil",  icon: "👁️", label: "Surveillance",      radius: 180 },
    ],
  },
  {
    id: "bio", label: "Biological", color: "#2DFF78", colorRgb: "45,255,120",
    stamps: [
      { id: "pandemic",   icon: "🦠", label: "Pandemic",            radius: 220, spreading: true },
      { id: "bioweapon",  icon: "☣️", label: "Bio Weapon",          radius: 90  },
      { id: "drug",       icon: "💊", label: "Drug Crisis",         radius: 130 },
      { id: "healthcare", icon: "🏥", label: "Healthcare Collapse", radius: 160 },
    ],
  },
  {
    id: "econ", label: "Socioeconomic", color: "#C9A84C", colorRgb: "201,168,76",
    stamps: [
      { id: "boom",       icon: "📈", label: "Economic Boom",        radius: 180 },
      { id: "collapse",   icon: "📉", label: "Economic Collapse",    radius: 200 },
      { id: "industrial", icon: "🏭", label: "Industrial Zone",      radius: 130 },
      { id: "poverty",    icon: "🏚️", label: "Poverty / Inequality", radius: 150 },
      { id: "wealth",     icon: "💎", label: "Wealth Concentration", radius: 60  },
    ],
  },
  {
    id: "polit", label: "Political", color: "#C9A84C", colorRgb: "201,168,76",
    stamps: [
      { id: "instability", icon: "🗳️", label: "Political Instability", radius: 170 },
      { id: "media",       icon: "📢", label: "Media Narrative",       radius: 240 },
      { id: "unrest",      icon: "✊", label: "Civil Unrest",          radius: 110 },
      { id: "authority",   icon: "🔒", label: "Authoritarian Control", radius: 200 },
    ],
  },
];

const INITIAL_BLOBS = [
  { id: "b1", kind: "trauma",   label: "World Engine Event",     x: 38, y: 44, r: 220, color: "0,212,170",  intensity: 0.7,  stamp: "🌀", severity: 9, characters: ["Kal-El", "Lois"] },
  { id: "b2", kind: "power",    label: "LexCorp Influence",      x: 41, y: 50, r: 150, color: "201,168,76", intensity: 0.55, stamp: "💎", severity: 7, characters: ["Lex"]           },
  { id: "b3", kind: "conflict", label: "Gotham Active Conflict", x: 50, y: 56, r: 170, color: "204,34,0",   intensity: 0.65, stamp: "💥", severity: 8, characters: ["Bruce"]         },
  { id: "b4", kind: "bio",      label: "Outbreak Vector",        x: 64, y: 38, r: 200, color: "45,255,120", intensity: 0.5,  stamp: "🦠", severity: 6, spreading: true, characters: ["Lois"] },
  { id: "b5", kind: "power",    label: "Smallville Rural",       x: 28, y: 62, r: 100, color: "201,168,76", intensity: 0.3,  stamp: "🌾", severity: 3, characters: ["Jonathan"]      },
  { id: "b6", kind: "cosmic",   label: "Kryptonite Deposit",     x: 78, y: 58, r: 80,  color: "123,47,255", intensity: 0.55, stamp: "💜", severity: 7, characters: []                },
];

const CHARACTERS_MAP = [
  { id: "kal",   name: "Kal-El",   col: 8,  row: 10, color: "0,212,170",   img: "assets/char-superman-cavill.webp", status: "active",    state: "Guilt 82%"   },
  { id: "bruce", name: "Bruce",    col: 12, row: 14, color: "107,107,138", img: "assets/batman.webp",               status: "observing", state: "Calculating" },
  { id: "diana", name: "Diana",    col: 15, row: 7,  color: "201,168,76",  img: "assets/char-saint.jpg",            status: "active",    state: "Centered"    },
  { id: "lois",  name: "Lois",     col: 9,  row: 11, color: "240,208,128", img: "assets/lois.jpg",                  status: "active",    state: "Fear 68%"    },
  { id: "zod",   name: "Zod",      col: 20, row: 5,  color: "204,34,0",    img: "assets/char-batman2.webp",         status: "inactive",  state: "—"           },
  { id: "jon",   name: "Jonathan", col: 6,  row: 16, color: "212,136,76",  img: "assets/char-robin.jpeg",           status: "deceased",  state: "Deceased"    },
];

const LAYERS_DATA = [
  { id: "social",      label: "SOCIAL COHESION",     color: "#00C9A7", blendColor: "rgba(0,201,167,0.12)",   active: true  },
  { id: "economic",    label: "ECONOMIC PRESSURE",   color: "#C9A84C", blendColor: "rgba(201,168,76,0.12)",  active: true  },
  { id: "biological",  label: "BIOLOGICAL BASELINE", color: "#2DFF78", blendColor: "rgba(45,255,120,0.10)",  active: true  },
  { id: "political",   label: "POLITICAL CONTROL",   color: "#FFB347", blendColor: "rgba(255,179,71,0.10)",  active: false },
  { id: "trauma",      label: "TRAUMA MEMORY",       color: "#00D4FF", blendColor: "rgba(0,212,255,0.08)",   active: true  },
  { id: "sensitivity", label: "SENSITIVITY MAP",     color: "#E0B0FF", blendColor: "rgba(224,176,255,0.10)", active: false },
];

// ── WORLD ELEMENTS ────────────────────────────────────────────────────
const WORLD_PIECES = {
  terrain: [
    { id: "mountain", label: "Mountain", icon: "⛰️", height: 80, desc: "Blocks passage, +2 defense",      colors: { top: "#2A2A3E", accent: "#E0F7FA", glow: "rgba(224,247,250,0.55)" } },
    { id: "lake",     label: "Lake",     icon: "💧", height: 5,  desc: "Water barrier, impassable",        colors: { top: "#1A237E", accent: "#00E5FF", glow: "rgba(0,229,255,0.55)"   } },
    { id: "forest-p", label: "Forest",   icon: "🌲", height: 40, desc: "+1 stealth, slows movement",      colors: { top: "#1B4332", accent: "#00BFA5", glow: "rgba(0,191,165,0.55)"   } },
    { id: "desert",   label: "Desert",   icon: "🏜️", height: 20, desc: "Harsh terrain, -1 stamina/turn",  colors: { top: "#6D4C41", accent: "#FFD54F", glow: "rgba(255,213,79,0.55)"  } },
  ],
  settlements: [
    { id: "village",  label: "Village",  icon: "🏘️", height: 30, desc: "Civilian shelter, +3 morale",     colors: { top: "#37474F", accent: "#FFB300", glow: "rgba(255,179,0,0.55)"   } },
    { id: "city",     label: "City",     icon: "🏙️", height: 60, desc: "Population hub, high exposure",   colors: { top: "#1C1C2E", accent: "#7C4DFF", glow: "rgba(124,77,255,0.6)"   } },
    { id: "fortress", label: "Fortress", icon: "🏰", height: 70, desc: "Military stronghold, +5 defense", colors: { top: "#455A64", accent: "#FF6F00", glow: "rgba(255,111,0,0.55)"   } },
    { id: "ruins",    label: "Ruins",    icon: "🏚️", height: 25, desc: "Unstable ground, hidden passages", colors: { top: "#3E2723", accent: "#A5D6A7", glow: "rgba(165,214,167,0.4)"  } },
  ],
  power: [
    { id: "reactor",  label: "Reactor",  icon: "⚛️", height: 50, desc: "Energy source, radiation risk",   colors: { top: "#1C1C1C", accent: "#E040FB", glow: "rgba(224,64,251,0.65)"  } },
    { id: "tower",    label: "Tower",    icon: "📡", height: 90, desc: "Surveillance, +4 control radius", colors: { top: "#1A1A2E", accent: "#00E5FF", glow: "rgba(0,229,255,0.55)"   } },
    { id: "lab",      label: "Lab",      icon: "🔬", height: 40, desc: "Research site, +2 intel/turn",    colors: { top: "#1B2A1B", accent: "#69F0AE", glow: "rgba(105,240,174,0.55)" } },
    { id: "vault",    label: "Vault",    icon: "🔒", height: 30, desc: "Secured cache, high value target", colors: { top: "#1A1A1A", accent: "#FFD700", glow: "rgba(255,215,0,0.55)"  } },
  ],
  infrastructure: [
    { id: "highway",  label: "Highway",  icon: "🛣️", height: 15, desc: "Fast travel corridor",            colors: { top: "#37474F", accent: "#FFD740", glow: "rgba(255,215,64,0.45)" } },
    { id: "bridge",   label: "Bridge",   icon: "🌉", height: 35, desc: "Crosses water, strategic chokepoint", colors: { top: "#546E7A", accent: "#B0BEC5", glow: "rgba(176,190,197,0.45)" } },
    { id: "port",     label: "Port",     icon: "⚓", height: 20, desc: "Naval access, supply lines",       colors: { top: "#01579B", accent: "#29B6F6", glow: "rgba(41,182,246,0.55)"  } },
    { id: "airport",  label: "Airport",  icon: "✈️", height: 25, desc: "Air transport hub",               colors: { top: "#263238", accent: "#90CAF9", glow: "rgba(144,202,249,0.5)"  } },
  ],
};

const PIECE_CATEGORIES = [
  { id: "terrain",        label: "TERRAIN",     color: "#2DFF78" },
  { id: "settlements",    label: "SETTLEMENTS", color: "#00D4FF" },
  { id: "power",          label: "POWER",       color: "#E0B0FF" },
  { id: "infrastructure", label: "INFRA",       color: "#C9A84C" },
];

// ── BLOBS + LAYERS ────────────────────────────────────────────────────
const BLOB_COLORS = {
  trauma:   { core: "rgba(0,212,255,0.7)",   mid: "rgba(0,150,200,0.3)"   },
  conflict: { core: "rgba(204,34,0,0.8)",    mid: "rgba(150,20,0,0.35)"   },
  power:    { core: "rgba(201,168,76,0.6)",  mid: "rgba(150,120,40,0.25)" },
  bio:      { core: "rgba(45,255,120,0.65)", mid: "rgba(20,180,80,0.3)"   },
  cosmic:   { core: "rgba(123,47,255,0.7)",  mid: "rgba(80,20,200,0.3)"   },
};

const LAYER_POSITIONS = {
  social:      { cx: "50%", cy: "50%", rx: "60%", ry: "40%" },
  economic:    { cx: "45%", cy: "40%", rx: "40%", ry: "30%" },
  biological:  { cx: "55%", cy: "55%", rx: "50%", ry: "45%" },
  political:   { cx: "45%", cy: "45%", rx: "45%", ry: "35%" },
  trauma:      { cx: "47%", cy: "38%", rx: "25%", ry: "20%" },
  sensitivity: { cx: "50%", cy: "50%", rx: "55%", ry: "50%" },
};

// ── ANIMATION CSS ─────────────────────────────────────────────────────
const animCSS = `
  @keyframes wpmRingPulse {
    0%   { transform: scale(0.85); opacity: 1; }
    100% { transform: scale(1.6);  opacity: 0; }
  }
  @keyframes wpmCharIdle {
    0%, 100% { transform: translateY(0px);  }
    50%      { transform: translateY(-3px); }
  }
  @keyframes blobBreath {
    from { transform: translate(-50%, -50%) scale(0.97); opacity: 0.85; }
    to   { transform: translate(-50%, -50%) scale(1.03); opacity: 1;    }
  }
  @keyframes layerFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes layerPulse  { 0%,100% { opacity: 0.65; } 50% { opacity: 1; } }
  @keyframes pieceDropIn {
    0%   { opacity: 0; transform: translateY(-18px) scale(0.6); }
    65%  { transform: translateY(2px) scale(1.1); }
    82%  { transform: translateY(-1px) scale(0.97); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes charFloat {
    0%, 100% { transform: translateY(0px); }
    50%      { transform: translateY(-4px); }
  }
  .wpm-blob-conflict { animation-duration: 1.6s !important; }
  .wpm-blob-bio      { animation-duration: 4s   !important; }
  .wpm-blob-trauma   { animation-duration: 6s   !important; }
`;

// ── TERRAIN FEATURE ART ───────────────────────────────────────────────
// SVG shapes rendered on each tile matching the reference isometric art style.
// cx = tile horizontal center, ty = tile top vertex y, cy = tile face center y.
const TerrainFeature = ({ terrain, x, y }) => {
  const cx = x + TILE_W / 2;
  const ty = y;
  const cy = y + TILE_H / 2;

  if (terrain === "hills") return (
    <g opacity={0.92} style={{ pointerEvents: "none" }}>
      {/* Back peak (far left, small) */}
      <polygon points={`${cx-36},${cy} ${cx-24},${ty-16} ${cx-12},${cy}`}
        fill="#1A0C55" stroke="#2E1870" strokeWidth={0.6}/>
      {/* Left peak (medium) */}
      <polygon points={`${cx-20},${cy-2} ${cx-8},${ty-26} ${cx+4},${cy-2}`}
        fill="#241468" stroke="#402898" strokeWidth={0.7}/>
      {/* Main peak (tallest, right) */}
      <polygon points={`${cx-4},${cy-5} ${cx+16},${ty-45} ${cx+38},${cy-5}`}
        fill="#301A78" stroke="#5030A8" strokeWidth={0.8}/>
      {/* Bright pink/white tips */}
      <polygon points={`${cx+14},${ty-45} ${cx+16},${ty-52} ${cx+18},${ty-45}`} fill="#F070E0" opacity={0.95}/>
      <polygon points={`${cx-10},${ty-26} ${cx-8},${ty-31} ${cx-6},${ty-26}`}   fill="#D050C8" opacity={0.85}/>
      {/* Light streaks */}
      <line x1={cx+16} y1={ty-45} x2={cx+11} y2={ty-32} stroke="#C860E8" strokeWidth={1.6} opacity={0.7}/>
      <line x1={cx-8}  y1={ty-26} x2={cx-11} y2={ty-19} stroke="#A840C8" strokeWidth={1.2} opacity={0.6}/>
    </g>
  );

  if (terrain === "water") return (
    <g style={{ pointerEvents: "none" }}>
      {/* Blue tint on tile surface */}
      <polygon points={`${cx},${ty} ${x+TILE_W},${cy} ${cx},${cy+TILE_H/2} ${x},${cy}`}
        fill="rgba(0,140,255,0.13)"/>
      {/* Wave 1 */}
      <path d={`M${cx-34},${cy-7} Q${cx-16},${cy-14} ${cx},${cy-7} Q${cx+16},${cy} ${cx+34},${cy-7}`}
        fill="none" stroke="#00DDFF" strokeWidth={1.8} opacity={0.9}/>
      {/* Wave 2 */}
      <path d={`M${cx-28},${cy+1} Q${cx-10},${cy-6} ${cx+6},${cy+1} Q${cx+20},${cy+8} ${cx+28},${cy+1}`}
        fill="none" stroke="#00AAEE" strokeWidth={1.5} opacity={0.8}/>
      {/* Wave 3 */}
      <path d={`M${cx-20},${cy+8} Q${cx-4},${cy+4} ${cx+10},${cy+8} Q${cx+20},${cy+12} ${cx+22},${cy+8}`}
        fill="none" stroke="#0080CC" strokeWidth={1.2} opacity={0.65}/>
      {/* Glow halo */}
      <path d={`M${cx-34},${cy-7} Q${cx-16},${cy-14} ${cx},${cy-7} Q${cx+16},${cy} ${cx+34},${cy-7}`}
        fill="none" stroke="#80EEFF" strokeWidth={7} opacity={0.1}/>
    </g>
  );

  if (terrain === "forest") {
    const mb = (ox, oy, w, h, d, bright) => {
      const mhw=w/2, mhh=h/2;
      const mt=`${ox+mhw},${oy} ${ox+w},${oy+mhh} ${ox+mhw},${oy+h} ${ox},${oy+mhh}`;
      const ml=`${ox},${oy+mhh} ${ox+mhw},${oy+h} ${ox+mhw},${oy+h+d} ${ox},${oy+mhh+d}`;
      const mr=`${ox+mhw},${oy+h} ${ox+w},${oy+mhh} ${ox+w},${oy+mhh+d} ${ox+mhw},${oy+h+d}`;
      return <g key={`${ox}${oy}`}>
        <polygon points={mr} fill={bright ? "#100A38" : "#0E0835"}/>
        <polygon points={ml} fill={bright ? "#180C50" : "#140A44"}/>
        <polygon points={mt} fill={bright ? "#281878" : "#1E1260"} stroke="rgba(90,55,210,0.5)" strokeWidth={0.6}/>
      </g>;
    };
    return (
      <g opacity={0.95} style={{ pointerEvents: "none" }}>
        {mb(cx-36, cy-17, 16, 8,  12, false)}
        {mb(cx-14, cy-25, 20, 10, 15, true)}
        {mb(cx+8,  cy-17, 16, 8,  12, false)}
        {mb(cx-24, cy-5,  14, 7,  10, false)}
        {mb(cx+20, cy-12, 14, 7,  11, false)}
      </g>
    );
  }

  if (terrain === "urban") {
    const bld = (ox, oy, w, h, d, winC, winY) => {
      const bhw=w/2, bhh=h/2;
      const bt=`${ox+bhw},${oy} ${ox+w},${oy+bhh} ${ox+bhw},${oy+h} ${ox},${oy+bhh}`;
      const bl=`${ox},${oy+bhh} ${ox+bhw},${oy+h} ${ox+bhw},${oy+h+d} ${ox},${oy+bhh+d}`;
      const br=`${ox+bhw},${oy+h} ${ox+w},${oy+bhh} ${ox+w},${oy+bhh+d} ${ox+bhw},${oy+h+d}`;
      return <g key={`${ox}${oy}`}>
        <polygon points={br} fill="#0A0735" stroke="rgba(70,45,210,0.6)" strokeWidth={0.7}/>
        <polygon points={bl} fill="#120A48" stroke="rgba(80,55,225,0.6)" strokeWidth={0.7}/>
        <polygon points={bt} fill="#1A0E60" stroke="rgba(110,75,255,0.85)" strokeWidth={0.8}/>
        {winY.map((wy, i) => <circle key={i} cx={ox+w-2} cy={wy} r={1.4} fill={winC} opacity={0.9}/>)}
      </g>;
    };
    return (
      <g style={{ pointerEvents: "none" }}>
        {bld(cx+2,  ty-28, 22, 11, 34, "#FFB020", [ty-16, ty-5, ty+6])}
        {bld(cx-28, ty-48, 24, 12, 54, "#00CCFF", [ty-35, ty-22, ty-9, ty+4])}
      </g>
    );
  }

  return null; // plains — clean platform, no decoration
};

// ── ISO TILE (SVG polygon group) ──────────────────────────────────────
const IsoTile = React.memo(({ col, row, terrain, highlighted, invalid, onEnter, onLeave, onDragOver, onDrop }) => {
  const { x, y } = isoToScreen(col, row);
  const hw = TILE_W / 2, hh = TILE_H / 2;
  const D = TILE_DEPTH;

  const td = TERRAIN_3D[terrain];
  const t = invalid
    ? { top: "#380A0A", lft: "#200505", rgt: "#160303", line: "rgba(230,40,0,0.9)", edge: "rgba(180,20,0,0.5)", hlLft: "", hlRgt: "" }
    : highlighted
      ? { top: td.hl, lft: td.hlLft, rgt: td.hlRgt, line: td.hlLine, edge: td.edge }
      : td;

  // Top face: diamond
  const top = `${x+hw},${y} ${x+TILE_W},${y+hh} ${x+hw},${y+TILE_H} ${x},${y+hh}`;
  // Left face (SW) — lighter shadow
  const lft = `${x},${y+hh} ${x+hw},${y+TILE_H} ${x+hw},${y+TILE_H+D} ${x},${y+hh+D}`;
  // Right face (SE) — deeper shadow
  const rgt = `${x+hw},${y+TILE_H} ${x+TILE_W},${y+hh} ${x+TILE_W},${y+hh+D} ${x+hw},${y+TILE_H+D}`;

  const sw = highlighted ? 1.5 : 0.8;
  const edgeSW = highlighted ? 1.0 : 0.6;

  return (
    <g>
      {/* Side faces — rendered first (behind top) */}
      <polygon points={rgt} fill={t.rgt} />
      <polygon points={rgt} fill="none" stroke={t.edge} strokeWidth={edgeSW} />
      <polygon points={lft} fill={t.lft} />
      <polygon points={lft} fill="none" stroke={t.edge} strokeWidth={edgeSW} />
      {/* Top face */}
      <polygon points={top} fill={t.top} />
      {/* Neon grid line on top face */}
      <polygon points={top} fill="none" stroke={t.line} strokeWidth={sw} />
      {/* Terrain feature art (mountains / waves / trees / buildings) */}
      {!invalid && <TerrainFeature terrain={terrain} x={x} y={y} />}
      {/* Invisible hit area — topmost for pointer events */}
      <polygon points={top} fill="transparent"
        onMouseEnter={onEnter} onMouseLeave={onLeave}
        onDragOver={onDragOver} onDrop={onDrop}
        style={{ cursor: "default" }}
      />
    </g>
  );
});

// ── PIECE THUMBNAIL — isometric SVG art (viewBox 0 0 80 80) ──────────
// Platform origin: ox=4 oy=38, w=72 h=32 depth=10
// cx=40 ty=38 cy=54 — feature zone is y=0..38 (38px above platform)
const _PT = { ox:4, oy:38, w:72, h:32, d:10 };
const _pcx = _PT.ox + _PT.w/2;  // 40
const _pty = _PT.oy;              // 38
const _pcy = _pty + _PT.h/2;     // 54
const _ptop = `${_pcx},${_pty} ${_PT.ox+_PT.w},${_pcy} ${_pcx},${_pty+_PT.h} ${_PT.ox},${_pcy}`;
const _plft = `${_PT.ox},${_pcy} ${_pcx},${_pty+_PT.h} ${_pcx},${_pty+_PT.h+_PT.d} ${_PT.ox},${_pcy+_PT.d}`;
const _prgt = `${_pcx},${_pty+_PT.h} ${_PT.ox+_PT.w},${_pcy} ${_PT.ox+_PT.w},${_pcy+_PT.d} ${_pcx},${_pty+_PT.h+_PT.d}`;

const _isoBox = (ox, oy, w, h, d, tC, lC, rC, eC) => {
  const hw=w/2, hh=h/2;
  const t=`${ox+hw},${oy} ${ox+w},${oy+hh} ${ox+hw},${oy+h} ${ox},${oy+hh}`;
  const l=`${ox},${oy+hh} ${ox+hw},${oy+h} ${ox+hw},${oy+h+d} ${ox},${oy+hh+d}`;
  const r=`${ox+hw},${oy+h} ${ox+w},${oy+hh} ${ox+w},${oy+hh+d} ${ox+hw},${oy+h+d}`;
  return <g><polygon points={r} fill={rC}/><polygon points={l} fill={lC}/><polygon points={t} fill={tC} stroke={eC||"rgba(110,75,255,0.7)"} strokeWidth={0.9}/></g>;
};

const PieceThumbArt = ({ id, cx, ty, cy }) => {
  if (id === "mountain") return (
    <g opacity={0.9}>
      <polygon points={`${cx-34},${cy} ${cx-20},${ty-14} ${cx-6},${cy}`}    fill="#1A0C55" stroke="#2E1870" strokeWidth={0.6}/>
      <polygon points={`${cx-18},${cy-2} ${cx-4},${ty-24} ${cx+12},${cy-2}`} fill="#241468" stroke="#4028A0" strokeWidth={0.7}/>
      <polygon points={`${cx-2},${cy-4} ${cx+18},${ty-40} ${cx+38},${cy-4}`} fill="#301A78" stroke="#5030A8" strokeWidth={0.8}/>
      <polygon points={`${cx+16},${ty-40} ${cx+18},${ty-47} ${cx+20},${ty-40}`} fill="#F070E0" opacity={0.95}/>
      <polygon points={`${cx-6},${ty-24} ${cx-4},${ty-29} ${cx-2},${ty-24}`}  fill="#D050C8" opacity={0.85}/>
      <line x1={cx+18} y1={ty-40} x2={cx+13} y2={ty-30} stroke="#C860E8" strokeWidth={1.5} opacity={0.7}/>
    </g>
  );
  if (id === "lake" || id === "port") return (
    <g>
      <polygon points={`${cx},${ty} ${cx+36},${cy} ${cx},${cy+16} ${cx-36},${cy}`} fill="rgba(0,140,255,0.12)"/>
      <path d={`M${cx-32},${cy-6} Q${cx-14},${cy-13} ${cx+2},${cy-6} Q${cx+18},${cy+1} ${cx+32},${cy-6}`} fill="none" stroke="#00DDFF" strokeWidth={1.8} opacity={0.9}/>
      <path d={`M${cx-26},${cy+3} Q${cx-8},${cy-4} ${cx+8},${cy+3} Q${cx+22},${cy+10} ${cx+28},${cy+3}`} fill="none" stroke="#00AAEE" strokeWidth={1.5} opacity={0.75}/>
      <path d={`M${cx-18},${cy+10} Q${cx-2},${cy+6} ${cx+14},${cy+10}`} fill="none" stroke="#0088CC" strokeWidth={1.2} opacity={0.6}/>
      {id === "port" && _isoBox(cx-8, ty-20, 16, 8, 18, "#141040", "#0C0A2C", "#08061E")}
    </g>
  );
  if (id === "forest-p") return (
    <g opacity={0.95}>
      {[[-34,cy-14,14,7,10,false],[-14,cy-22,18,9,13,true],[8,cy-15,14,7,10,false],[-22,cy-3,13,6,9,false],[18,cy-10,13,6,9,false]].map(([ox,oy,w,h,d,br],i)=>{
        const mhw=w/2,mhh=h/2;
        const mt=`${cx+ox+mhw},${oy} ${cx+ox+w},${oy+mhh} ${cx+ox+mhw},${oy+h} ${cx+ox},${oy+mhh}`;
        const ml=`${cx+ox},${oy+mhh} ${cx+ox+mhw},${oy+h} ${cx+ox+mhw},${oy+h+d} ${cx+ox},${oy+mhh+d}`;
        const mr=`${cx+ox+mhw},${oy+h} ${cx+ox+w},${oy+mhh} ${cx+ox+w},${oy+mhh+d} ${cx+ox+mhw},${oy+h+d}`;
        return <g key={i}><polygon points={mr} fill={br?"#100A38":"#0E0835"}/><polygon points={ml} fill={br?"#180C50":"#140A44"}/><polygon points={mt} fill={br?"#281878":"#1E1260"} stroke="rgba(90,55,210,0.5)" strokeWidth={0.6}/></g>;
      })}
    </g>
  );
  if (id === "desert") return (
    <g opacity={0.85}>
      {[[cx-26,cy-2,52,10],[cx-18,cy-11,36,9],[cx-10,cy-20,20,8]].map(([ox,oy,w,h],i)=>{
        const hw=w/2,hh=h/2;
        return <g key={i}>
          <polygon points={`${ox+hw},${oy} ${ox+w},${oy+hh} ${ox+hw},${oy+h} ${ox},${oy+hh}`} fill={`rgba(${30+i*10},${14+i*5},${70+i*10},${0.85-i*0.1})`} stroke={`rgba(${100+i*20},${60+i*15},${255},${0.5+i*0.1})`} strokeWidth={0.8}/>
        </g>;
      })}
    </g>
  );
  if (id === "village") return (
    <g>
      {_isoBox(cx-22, ty-22, 20, 10, 26, "#141060", "#0C0840", "#08062A")}
      {_isoBox(cx+6,  ty-16, 16, 8,  20, "#180E68", "#0E0A45", "#090730")}
      <circle cx={cx-8} cy={ty-12} r={1.4} fill="#FFB020" opacity={0.9}/>
      <circle cx={cx+20} cy={ty-8} r={1.4} fill="#00CCFF" opacity={0.9}/>
    </g>
  );
  if (id === "city") return (
    <g>
      {_isoBox(cx+2,  ty-24, 22, 11, 32, "#1A0E60", "#0C0840", "#08062A")}
      {_isoBox(cx-28, ty-46, 24, 12, 52, "#1A0E60", "#0E0840", "#09062C")}
      {[ty-34,ty-22,ty-10,ty+2].map((wy,i)=><circle key={i} cx={cx-8} cy={wy} r={1.3} fill="#00CCFF" opacity={0.9}/>)}
      {[ty-12,ty-2,ty+8].map((wy,i)=><circle key={i} cx={cx+24} cy={wy} r={1.3} fill="#FFB020" opacity={0.9}/>)}
    </g>
  );
  if (id === "fortress") return (
    <g>
      {_isoBox(cx-26, ty-28, 52, 14, 32, "#181060", "#0E0840", "#09062C")}
      {_isoBox(cx-26, ty-40, 10, 8,  14, "#201468", "#12094A", "#0C0632")}
      {_isoBox(cx+16, ty-40, 10, 8,  14, "#201468", "#12094A", "#0C0632")}
      <line x1={cx-26} y1={ty-32} x2={cx+26} y2={ty-32} stroke="rgba(130,80,255,0.5)" strokeWidth={0.8}/>
    </g>
  );
  if (id === "ruins") return (
    <g opacity={0.85}>
      {_isoBox(cx-20, ty-20, 16, 8,  22, "#141060", "#0C0840", "#08062A")}
      {_isoBox(cx+4,  ty-14, 18, 9,  18, "#100C50", "#0A0838", "#060624")}
      <polygon points={`${cx-20},${ty-20} ${cx-12},${ty-26} ${cx-4},${ty-20} ${cx-12},${ty-14}`} fill="#1A1268" stroke="rgba(80,50,200,0.4)" strokeWidth={0.7} opacity={0.7}/>
    </g>
  );
  if (id === "reactor" || id === "lab") return (
    <g>
      {/* Cooling tower (wide base, narrow top) */}
      <polygon points={`${cx-12},${ty} ${cx-6},${ty+6} ${cx-6},${ty+36} ${cx-16},${ty+42} ${cx-16},${ty+6}`} fill="#160C45" stroke="rgba(0,200,255,0.6)" strokeWidth={0.8}/>
      <polygon points={`${cx+12},${ty} ${cx+6},${ty+6} ${cx+6},${ty+36} ${cx+16},${ty+42} ${cx+16},${ty+6}`} fill="#1A0E50" stroke="rgba(0,200,255,0.6)" strokeWidth={0.8}/>
      {/* Ellipse tops */}
      <ellipse cx={cx-10} cy={ty+2}   rx={6}  ry={3}  fill="#0E1240" stroke="rgba(0,220,255,0.8)" strokeWidth={1}/>
      <ellipse cx={cx+10} cy={ty+2}   rx={6}  ry={3}  fill="#0E1240" stroke="rgba(0,220,255,0.8)" strokeWidth={1}/>
      <ellipse cx={cx}    cy={ty+36}  rx={16} ry={5}  fill="#120E50" stroke="rgba(80,50,220,0.6)" strokeWidth={0.8}/>
      <circle cx={cx} cy={ty+14} r={2} fill="#00EEFF" opacity={0.7}/>
    </g>
  );
  if (id === "tower") return (
    <g>
      {/* Tall thin antenna */}
      <line x1={cx} y1={ty} x2={cx} y2={ty+40} stroke="#2A1870" strokeWidth={4}/>
      <line x1={cx} y1={ty} x2={cx} y2={ty+40} stroke="rgba(120,70,255,0.7)" strokeWidth={1.5}/>
      {/* Cross beams */}
      {[12,22,32].map(off=><line key={off} x1={cx-8+off*0.15} y1={ty+off} x2={cx+8-off*0.15} y2={ty+off} stroke="rgba(110,65,240,0.6)" strokeWidth={1}/>)}
      {/* Top beacon */}
      <circle cx={cx} cy={ty} r={3} fill="#00EEFF" opacity={0.9}/>
      <circle cx={cx} cy={ty} r={6} fill="none" stroke="#00EEFF" strokeWidth={0.8} opacity={0.4}/>
    </g>
  );
  if (id === "vault") return (
    <g>
      {_isoBox(cx-14, ty-20, 28, 14, 26, "#201468", "#120E4A", "#0C0932")}
      {/* Door */}
      <polygon points={`${cx+10},${ty-6} ${cx+14},${ty-4} ${cx+14},${ty+12} ${cx+10},${ty+14}`} fill="#0A0828" stroke="#FFD700" strokeWidth={0.8}/>
      <circle cx={cx+12} cy={ty+4} r={2} fill="#FFD700" opacity={0.9}/>
    </g>
  );
  if (id === "highway" || id === "airport") return (
    <g>
      {/* Road surface on tile */}
      <polygon points={`${cx},${ty} ${cx+36},${cy} ${cx},${cy+16} ${cx-36},${cy}`} fill="rgba(40,30,100,0.3)"/>
      {/* Glowing road lines */}
      {id === "highway" ? <>
        <line x1={cx-32} y1={cy-4} x2={cx+32} y2={cy-4} stroke="#FF9A00" strokeWidth={3} opacity={0.85}/>
        <line x1={cx-32} y1={cy+4} x2={cx+32} y2={cy+4} stroke="#FFB030" strokeWidth={3} opacity={0.85}/>
        <line x1={cx-32} y1={cy-4} x2={cx+32} y2={cy-4} stroke="#FFF0A0" strokeWidth={7} opacity={0.15}/>
        {/* Dashes */}
        {[-24,-8,8,24].map(ox=><line key={ox} x1={cx+ox-5} y1={cy} x2={cx+ox+5} y2={cy} stroke="#FFFAAA" strokeWidth={1.5} opacity={0.7}/>)}
      </> : <>
        {/* Runway cross */}
        <line x1={cx-32} y1={cy} x2={cx+32} y2={cy} stroke="#FF9A00" strokeWidth={2.5} opacity={0.8}/>
        <line x1={cx} y1={ty+4} x2={cx} y2={cy+14} stroke="#FF9A00" strokeWidth={2.5} opacity={0.8}/>
        {[-20,0,20].map(ox=><line key={ox} x1={cx+ox-6} y1={cy-8} x2={cx+ox+6} y2={cy-8} stroke="#FFF0A0" strokeWidth={1.2} opacity={0.5}/>)}
      </>}
    </g>
  );
  if (id === "bridge") return (
    <g>
      {/* Road deck */}
      <line x1={cx-34} y1={cy} x2={cx+34} y2={cy} stroke="#FF9A00" strokeWidth={4} opacity={0.8}/>
      <line x1={cx-34} y1={cy} x2={cx+34} y2={cy} stroke="#FFF0A0" strokeWidth={8} opacity={0.1}/>
      {/* Towers */}
      {_isoBox(cx-18, ty-30, 10, 5, 35, "#281468", "#160E42", "#0E0830")}
      {_isoBox(cx+8,  ty-30, 10, 5, 35, "#281468", "#160E42", "#0E0830")}
      {/* Cables */}
      {[[-18,0],[8,0],[-13,8],[3,8]].map(([ox,oy],i)=><line key={i} x1={cx+ox+5} y1={ty-30} x2={cx+ox-10+i*6} y2={cy+oy} stroke="#FF9A00" strokeWidth={0.8} opacity={0.7}/>)}
    </g>
  );
  return <text x={40} y={54} fontSize={22} textAnchor="middle" dominantBaseline="middle">{/* fallback emoji */}</text>;
};

const PieceThumb = ({ piece, size = 48 }) => (
  <div style={{ width: size, height: size, flexShrink: 0 }}>
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
      {/* Platform base — deep purple, neon edge */}
      <polygon points={_prgt} fill="#0A0820"/>
      <polygon points={_prgt} fill="none" stroke="rgba(80,45,200,0.4)" strokeWidth={0.8}/>
      <polygon points={_plft} fill="#130D30"/>
      <polygon points={_plft} fill="none" stroke="rgba(80,45,200,0.4)" strokeWidth={0.8}/>
      <polygon points={_ptop} fill="#1E1248"/>
      <polygon points={_ptop} fill="none" stroke={piece.colors.glow} strokeWidth={1.2}/>
      {/* Piece-specific art */}
      <PieceThumbArt id={piece.id} cx={_pcx} ty={_pty} cy={_pcy}/>
    </svg>
  </div>
);

// ── PIECE LIBRARY ─────────────────────────────────────────────────────
const PieceLibrary = ({ onDragStart }) => {
  const allCatIds = PIECE_CATEGORIES.map(c => c.id);
  const [openCats, setOpenCats] = React.useState(allCatIds);
  const [tooltip, setTooltip] = React.useState(null);
  const toggle = (id) => setOpenCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  return (
    <div style={{ position: "relative" }}>
      {PIECE_CATEGORIES.map(cat => {
        const isOpen = openCats.includes(cat.id);
        return (
        <div key={cat.id}>
          <button
            onClick={() => toggle(cat.id)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "9px 18px", background: "transparent",
              border: "none", borderBottom: "1px solid var(--iron)", cursor: "pointer",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: cat.color, display: "inline-block" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", color: cat.color }}>
                {cat.label}
              </span>
            </span>
            <svg width={12} height={12} viewBox="0 0 12 12" style={{ transition: "transform 0.2s", transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", opacity: 0.5 }}>
              <polyline points="2,4 6,8 10,4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
            </svg>
          </button>
          {isOpen && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "10px 12px 12px" }}>
              {WORLD_PIECES[cat.id].map(piece => (
                <div key={piece.id} draggable
                  onDragStart={(e) => {
                    const empty = new Image();
                    empty.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                    e.dataTransfer.setDragImage(empty, 0, 0);
                    e.dataTransfer.setData("pieceId", piece.id);
                    e.dataTransfer.setData("pieceCategory", cat.id);
                    e.currentTarget.style.opacity = "0.45";
                    onDragStart(piece);
                  }}
                  onDragEnd={(e) => { e.currentTarget.style.opacity = "1"; }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = piece.colors.accent + "55";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    setTooltip(piece);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    setTooltip(null);
                  }}
                  style={{
                    padding: "8px 6px 6px", background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10,
                    cursor: "grab", textAlign: "center",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    transition: "all 0.12s ease",
                  }}
                >
                  <PieceThumb piece={piece} size={48} />
                  <span style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>
                    {piece.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        );
      })}
      {tooltip && (
        <div style={{
          position: "fixed", bottom: 100, left: 16, right: 16,
          background: "rgba(8,8,20,0.97)", border: `1px solid ${tooltip.colors.accent}40`,
          borderLeft: `3px solid ${tooltip.colors.accent}`,
          borderRadius: 8, padding: "8px 12px", zIndex: 200, fontFamily: "var(--font-ui)",
          boxShadow: `0 4px 16px rgba(0,0,0,0.7), 0 0 12px ${tooltip.colors.glow}`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#F0F0FF", marginBottom: 2 }}>{tooltip.label}</div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{tooltip.desc}</div>
        </div>
      )}
    </div>
  );
};

// ── CHARACTER ICON (flat, positioned via isoToScreen) ─────────────────
const CharacterIcon = ({ char: c, screenX, screenY, isActive, onSelect, onDragStart }) => {
  const [hovered, setHovered] = React.useState(false);
  const statusDot = c.status === "active" ? "#2DFF78" :
                    c.status === "observing" ? "#C9A84C" :
                    c.status === "deceased" ? "#3A3A55" : "#CC2200";
  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("charId", c.id); onDragStart(); }}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        left: screenX - 22,
        top: screenY - 52,
        width: 44, height: 44,
        cursor: "pointer", zIndex: isActive ? 30 : 20,
        animation: `charFloat ${2.4 + c.id.length * 0.3}s ease-in-out infinite`,
      }}
    >
      {/* Active ring pulse */}
      {isActive && (
        <div style={{
          position: "absolute", inset: -8, borderRadius: "50%",
          border: "1.5px solid rgba(0,212,170,0.8)",
          animation: "wpmRingPulse 2s ease-out infinite",
        }} />
      )}
      {/* Glow halo */}
      <div style={{
        position: "absolute", inset: -8, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(${c.color},0.4) 0%, transparent 70%)`,
        filter: "blur(6px)", opacity: isActive ? 1 : 0.45,
      }} />
      {/* Glass bubble */}
      <div style={{
        width: 44, height: 44, borderRadius: "50%", overflow: "hidden",
        border: `2px solid ${isActive ? "rgba(0,212,170,0.9)" : "rgba(255,255,255,0.25)"}`,
        boxShadow: isActive
          ? `0 0 22px rgba(0,212,170,0.6), 0 6px 20px rgba(0,0,0,0.9)`
          : `0 6px 18px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)`,
        filter: c.status === "deceased" ? "grayscale(1) brightness(0.55)" : "none",
        position: "relative",
      }}>
        <img src={c.img} alt={c.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        {/* Glass sheen */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "50%",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)",
          borderRadius: "50% 50% 0 0", pointerEvents: "none",
        }} />
      </div>
      {/* Miniature base shadow ellipse */}
      <div style={{
        position: "absolute", bottom: -14, left: "50%", transform: "translateX(-50%)",
        width: 36, height: 10, borderRadius: "50%",
        background: `radial-gradient(ellipse, rgba(${c.color},0.35) 0%, transparent 70%)`,
        filter: "blur(3px)",
      }} />
      {/* Status dot */}
      <div style={{
        position: "absolute", bottom: 0, right: 0,
        width: 11, height: 11, borderRadius: "50%",
        background: statusDot, border: "2px solid #04040A",
        boxShadow: c.status === "active" ? `0 0 8px ${statusDot}` : "none",
      }} />
      {/* Hover tooltip */}
      {hovered && (
        <div style={{
          position: "absolute", bottom: 52, left: "50%", transform: "translateX(-50%)",
          background: "rgba(8,8,16,0.96)", border: "1px solid rgba(0,212,170,0.3)",
          borderRadius: 8, padding: "6px 12px", whiteSpace: "nowrap",
          fontFamily: "var(--font-ui)", fontSize: 11, color: "#F0F0FF",
          pointerEvents: "none", zIndex: 100,
          boxShadow: "0 4px 16px rgba(0,0,0,0.7)",
        }}>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{c.name}</div>
          <div style={{ fontSize: 10, color: "var(--text-dim)" }}>{c.state}</div>
        </div>
      )}
    </div>
  );
};

// ── PLACED PIECE (flat, positioned via isoToScreen) ────────────────────
const PlacedPiece = ({ piece, col, row }) => {
  const { x, y } = isoToScreen(col, row);
  // Position SVG so that SVG y=40 aligns with the tile's top vertex (screen y),
  // and SVG y=60 aligns with the tile's face center (screen y + TILE_H/2).
  // This lets PieceThumbArt render features rising from the tile surface upward.
  const svgH = 88;
  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y - 40,
      width: TILE_W,
      pointerEvents: "none",
      zIndex: 15,
      animation: "pieceDropIn 0.4s cubic-bezier(0.34,1.56,0.64,1) backwards",
    }}>
      <svg width={TILE_W} height={svgH} style={{ overflow: "visible", display: "block" }}>
        <PieceThumbArt id={piece.id} cx={TILE_W / 2} ty={40} cy={60} />
      </svg>
      <div style={{
        fontSize: 8, color: "rgba(255,255,255,0.45)", textAlign: "center",
        fontFamily: "var(--font-ui)", letterSpacing: "0.05em", marginTop: -8,
        textShadow: "0 1px 4px rgba(0,0,0,1)",
      }}>{piece.label}</div>
    </div>
  );
};

// ── PRESSURE BLOBS ────────────────────────────────────────────────────
const PressureBlobsLayer = ({ blobs, selectedId, onSelect }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
    {blobs.map((blob, index) => {
      const colors = BLOB_COLORS[blob.kind] || BLOB_COLORS.trauma;
      const isSelected = selectedId === blob.id;
      return (
        <div key={blob.id} className={`wpm-blob wpm-blob-${blob.kind}`}
          style={{
            position: "absolute", left: `${blob.x}%`, top: `${blob.y}%`,
            width: `${blob.r * 2}px`, height: `${blob.r * 2}px`,
            transform: "translate(-50%, -50%)", mixBlendMode: "screen",
            background: `radial-gradient(ellipse at center, ${colors.core} 0%, ${colors.mid} 35%, transparent 70%)`,
            animation: `blobBreath ${3 + index * 0.7}s ease-in-out infinite alternate`,
            borderRadius: "50%", pointerEvents: "all", cursor: "pointer",
          }}
          onClick={(e) => { e.stopPropagation(); onSelect(blob); }}
        >
          {isSelected && (
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1.5px solid rgba(${blob.color},0.7)`, boxSizing: "border-box" }} />
          )}
        </div>
      );
    })}
  </div>
);

// ── LAYER MAP OVERLAYS ────────────────────────────────────────────────
const LayerMapOverlay = ({ layer }) => {
  const pos = LAYER_POSITIONS[layer.id] || LAYER_POSITIONS.social;
  const gradId = `lg-${layer.id}`;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3, animation: "layerFadeIn 0.3s ease forwards" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id={gradId} cx={pos.cx} cy={pos.cy} r="50%">
            <stop offset="0%"   stopColor={layer.color} stopOpacity="0.14" />
            <stop offset="100%" stopColor={layer.color} stopOpacity="0"    />
          </radialGradient>
        </defs>
        <ellipse cx={pos.cx} cy={pos.cy} rx={pos.rx} ry={pos.ry} fill={`url(#${gradId})`} />
      </svg>
    </div>
  );
};

// ── LAYER PANEL ───────────────────────────────────────────────────────
const LayerPanel = ({ layers, onToggle, mapMode, onModeChange, open, onToggleOpen }) => {
  const activeLayers = layers.filter(l => l.active);
  return (
    <div style={{
      position: "absolute", top: 16, right: 16, width: 256,
      background: "rgba(8,8,16,0.92)", border: "1px solid #1A1A2E",
      borderRadius: 12, zIndex: 50, backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)", overflow: "hidden",
    }}>
      <button onClick={onToggleOpen} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", padding: "12px 16px", background: "transparent", border: "none", cursor: "pointer",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10, color: "#6B6B8A", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>MAP LAYERS</span>
          <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", background: "rgba(0,201,167,0.15)", color: "#00C9A7", border: "1px solid rgba(0,201,167,0.3)", borderRadius: 999, padding: "1px 7px" }}>
            {activeLayers.length}
          </span>
        </div>
        <span style={{ color: "#6B6B8A", fontSize: 16, lineHeight: 1, fontWeight: 300 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
            {[{ id: "pressure", label: "PRESSURE" }, { id: "landscape", label: "ISO GRID" }].map(mode => (
              <button key={mode.id} onClick={() => onModeChange(mode.id)} style={{
                padding: "7px 0",
                background: mapMode === mode.id ? "rgba(0,201,167,0.08)" : "transparent",
                border: `1px solid ${mapMode === mode.id ? "#00C9A7" : "#1A1A2E"}`,
                borderRadius: 8, color: mapMode === mode.id ? "#00C9A7" : "#6B6B8A",
                fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
                cursor: "pointer", fontFamily: "var(--font-ui)",
              }}>
                {mode.label}
              </button>
            ))}
          </div>
          <div style={{ height: 1, background: "#1A1A2E", marginBottom: 12 }} />
          <div style={{ fontSize: 10, color: "#6B6B8A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
            <span>LAYERS</span>
            <button onClick={() => layers.forEach(l => onToggle(l.id, false))} style={{ background: "transparent", border: "none", color: "#6B6B8A", fontSize: 10, cursor: "pointer" }}>CLEAR</button>
          </div>
          {layers.map((layer, index) => (
            <div key={layer.id}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: index < layers.length - 1 ? "1px solid #0F0F1A" : "none", cursor: "pointer" }}
              onClick={() => onToggle(layer.id, !layer.active)}
            >
              <div style={{
                width: 15, height: 15, borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${layer.active ? layer.color : "#3A3A5C"}`,
                background: layer.active ? layer.color : "transparent",
                transition: "all 0.15s ease",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: layer.active ? "layerPulse 2s ease-in-out infinite" : "none",
              }}>
                {layer.active && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#080810" }} />}
              </div>
              <div style={{ flex: 1, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", color: layer.active ? "#F0F0FF" : "#6B6B8A", fontFamily: "var(--font-ui)" }}>
                {layer.label}
              </div>
              {layer.active && (
                <div style={{ width: 3, height: 18, borderRadius: 2, background: layer.color, flexShrink: 0, animation: "layerPulse 2s ease-in-out infinite" }} />
              )}
            </div>
          ))}
          {activeLayers.length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1A1A2E" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {activeLayers.map((layer, i) => (
                  <div key={layer.id} style={{
                    height: 7, borderRadius: 3,
                    background: `linear-gradient(90deg, ${layer.color}40, ${layer.color}20)`,
                    border: `1px solid ${layer.color}30`,
                    transform: `translateY(${i * -1}px)`,
                    opacity: Math.max(0.4, 1 - i * 0.1), position: "relative",
                  }}>
                    <div style={{ position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)", width: 3, height: 3, borderRadius: "50%", background: layer.color }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── ZOOM CONTROLS ─────────────────────────────────────────────────────
const zBtnStyle = {
  width: 40, height: 34, background: "rgba(15,15,26,0.9)", border: "1px solid var(--iron)",
  borderRadius: 8, color: "var(--text-secondary)", cursor: "pointer",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  fontSize: 18, fontFamily: "var(--font-mono)", transition: "all 120ms ease",
};
const ZoomControls = ({ zoom, onZoomIn, onZoomOut, onReset }) => (
  <div style={{ position: "absolute", right: 18, bottom: 108, display: "flex", flexDirection: "column", gap: 5, zIndex: 25, alignItems: "center" }}>
    <button style={zBtnStyle} onClick={onZoomIn}>+</button>
    <div style={{ width: 40, padding: "4px 0", background: "rgba(15,15,26,0.9)", border: "1px solid var(--iron)", borderRadius: 7, fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)", textAlign: "center" }}>
      {Math.round(zoom * 100)}%
    </div>
    <button style={zBtnStyle} onClick={onZoomOut}>−</button>
    <button style={{ ...zBtnStyle, marginTop: 4, fontSize: 14 }} onClick={onReset} title="Reset view">⌖</button>
  </div>
);

// ── STAMP SECTION ─────────────────────────────────────────────────────
const StampSection = ({ cat, selectedId, onSelect }) => {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ marginBottom: 4 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", padding: "10px 18px", background: "transparent", border: "none", cursor: "pointer",
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: cat.color, display: "inline-block" }}/>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: cat.color }}>
            {cat.label}
          </span>
        </span>
        <span style={{ color: "var(--text-dim)", fontSize: 10 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div style={{ padding: "2px 10px 10px" }}>
          {cat.stamps.map(s => {
            const isSel = selectedId === s.id;
            return (
              <button key={s.id}
                onClick={() => onSelect(isSel ? null : { ...s, categoryColor: cat.color, categoryRgb: cat.colorRgb })}
                style={{
                  display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "8px 10px", marginBottom: 2,
                  background: isSel ? "rgba(0,212,170,0.08)" : "transparent",
                  border: `1px solid ${isSel ? "var(--krypton)" : "transparent"}`,
                  borderRadius: 8, cursor: "pointer", textAlign: "left",
                  color: isSel ? "var(--text-primary)" : "var(--text-secondary)", transition: "all 120ms ease",
                }}
                onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 18, lineHeight: 1, width: 22, textAlign: "center" }}>{s.icon}</span>
                <span style={{ fontSize: 12, fontFamily: "var(--font-ui)" }}>{s.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── STAMP ICONS ───────────────────────────────────────────────────────
const PressureIconsSVG = ({ blobs, cursorPos, previewStamp }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }}>
    {blobs.map(b => (
      <foreignObject key={`fo-${b.id}`} x={`calc(${b.x}% - 14px)`} y={`calc(${b.y}% - 14px)`} width="28" height="28" style={{ pointerEvents: "none" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `rgba(${b.color},0.85)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, boxShadow: `0 0 12px rgba(${b.color},0.6)`, border: "1.5px solid rgba(255,255,255,0.15)" }}>{b.stamp}</div>
      </foreignObject>
    ))}
    {previewStamp && cursorPos && (
      <g style={{ pointerEvents: "none" }}>
        <defs>
          <radialGradient id="prev-grad" cx="50%" cy="50%">
            <stop offset="0%"   stopColor={`rgba(${previewStamp.categoryRgb},0.35)`}/>
            <stop offset="100%" stopColor={`rgba(${previewStamp.categoryRgb},0)`}/>
          </radialGradient>
        </defs>
        <circle cx={`${cursorPos.x}%`} cy={`${cursorPos.y}%`} r={previewStamp.radius || 120} fill="url(#prev-grad)" style={{ mixBlendMode: "screen" }}/>
        <circle cx={`${cursorPos.x}%`} cy={`${cursorPos.y}%`} r={previewStamp.radius || 120} fill="none" stroke={previewStamp.categoryColor} strokeWidth="1.5" strokeDasharray="4 5" opacity="0.85"/>
      </g>
    )}
  </svg>
);

// ── HELPERS ───────────────────────────────────────────────────────────
const Row = ({ label, children }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
    <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--text-dim)", textTransform: "uppercase" }}>{label}</span>
    {children}
  </div>
);
const SeverityBar = ({ value, color }) => {
  const c = color || "var(--krypton)";
  return (
    <div style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} style={{ width: 8, height: 10, borderRadius: 2, background: i < value ? c : "var(--iron)", boxShadow: i < value ? `0 0 4px ${c}80` : "none" }}/>
      ))}
      <span style={{ marginLeft: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-secondary)" }}>{value}/10</span>
    </div>
  );
};
const btnStyle = (kind) => ({
  flex: 1, height: 32, fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 500,
  letterSpacing: "0.04em", background: "transparent",
  border: `1px solid ${kind === "danger" ? "rgba(204,34,0,0.6)" : "var(--iron)"}`,
  color: kind === "danger" ? "#FF6B5B" : "var(--text-secondary)",
  borderRadius: 8, cursor: "pointer", transition: "all 160ms ease",
});

// ── STAMP DETAIL ──────────────────────────────────────────────────────
const StampDetailCard = ({ blob, onClose, onRemove }) => {
  const blobRgb = blob.color, blobSolid = `rgb(${blobRgb})`, blobA = (a) => `rgba(${blobRgb},${a})`;
  return (
    <div style={{
      position: "absolute", left: 88, top: 92, width: 268,
      background: "rgba(8,8,16,0.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      border: `1px solid ${blobA(0.3)}`, borderLeft: `3px solid ${blobSolid}`,
      borderRadius: 12, padding: "16px 18px", zIndex: 30,
      boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${blobA(0.15)}`, fontFamily: "var(--font-ui)",
    }}>
      <div style={{ fontSize: 10, color: blobSolid, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>{blob.kind}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: blobA(0.85), display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: `0 0 14px ${blobA(0.6)}` }}>{blob.stamp}</div>
          <div style={{ fontSize: 15, color: "var(--text-primary)", fontWeight: 600 }}>{blob.label}</div>
        </div>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: 14, padding: 0 }}>✕</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 11 }}>
        <Row label="Severity"><SeverityBar value={blob.severity} color={blobSolid}/></Row>
        <Row label="Radius"><span style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{Math.round(blob.r * 1.5)}km</span></Row>
        <Row label="Spreading"><span style={{ color: blob.spreading ? "#2DFF78" : "var(--text-dim)", fontFamily: "var(--font-mono)" }}>{blob.spreading ? "YES · +2%/hr" : "STATIC"}</span></Row>
      </div>
      {blob.characters?.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #1A1A2E" }}>
          <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 8 }}>Affected</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {blob.characters.map(name => (
              <span key={name} style={{ fontSize: 11, padding: "2px 10px", borderRadius: 999, background: blobA(0.08), color: blobSolid, border: `1px solid ${blobA(0.4)}` }}>{name}</span>
            ))}
          </div>
        </div>
      )}
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button style={btnStyle("ghost")}>Edit</button>
        <button style={btnStyle("danger")} onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
};

// ── PRESENCE STRIP ────────────────────────────────────────────────────
const PresenceStrip = ({ chars, activeChar, onSelect, leftOpen }) => {
  const cityMap = { kal: "Metropolis", bruce: "Gotham", diana: "Themyscira", lois: "Metropolis", jon: "Smallville" };
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0, height: 86,
      background: "linear-gradient(to top, rgba(4,4,10,0.96), rgba(4,4,10,0.5))",
      backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      borderTop: "1px solid var(--iron)", display: "flex", alignItems: "center",
      paddingLeft: leftOpen ? 290 : 22, paddingRight: 22,
      transition: "padding-left 200ms ease", overflowX: "auto", zIndex: 20,
    }}>
      {chars.map(c => {
        const isActive = c.id === activeChar;
        const stateColor = c.state.includes("82") || c.state.includes("68") ? "#CC2200" :
                           c.state === "Calculating" ? "#C9A84C" : c.state === "Centered" ? "#2DFF78" :
                           c.status === "deceased" ? "var(--text-dim)" : "var(--text-secondary)";
        return (
          <button key={c.id} onClick={() => onSelect(c.id)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
            background: isActive ? "rgba(0,212,170,0.06)" : "transparent",
            border: `1px solid ${isActive ? "rgba(0,212,170,0.35)" : "transparent"}`,
            borderRadius: 10, cursor: "pointer", marginRight: 10, flexShrink: 0, transition: "all 160ms ease",
          }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${isActive ? "var(--krypton)" : "var(--iron)"}`, filter: c.status === "deceased" ? "grayscale(1) brightness(0.6)" : "none", flexShrink: 0 }}>
              <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{cityMap[c.id] || "Unknown"}</span>
            </div>
            <div style={{ marginLeft: 8, padding: "3px 8px", borderRadius: 6, background: `${stateColor}22`, border: `1px solid ${stateColor}55`, fontFamily: "var(--font-mono)", fontSize: 10, color: stateColor, letterSpacing: "0.05em" }}>{c.state}</div>
          </button>
        );
      })}
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────
const WorldMap = () => {
  const [mapMode, setMapMode]               = React.useState("pressure");
  const [layers, setLayers]                 = React.useState(LAYERS_DATA);
  const [layerPanelOpen, setLayerPanelOpen] = React.useState(true);
  const [leftTab, setLeftTab]               = React.useState("elements");
  const [leftOpen, setLeftOpen]             = React.useState(true);
  const [zoom, setZoom]                     = React.useState(0.75);
  const [pan, setPan]                       = React.useState({ x: -ISO_SVG_W * 0.75 / 2, y: -ISO_SVG_H * 0.75 / 2 });
  const [isPanning, setIsPanning]           = React.useState(false);
  const [selectedStamp, setSelectedStamp]   = React.useState(null);
  const [blobs, setBlobs]                   = React.useState(INITIAL_BLOBS);
  const [selectedBlob, setSelectedBlob]     = React.useState(null);
  const [activeChar, setActiveChar]         = React.useState("kal");
  const [cursorPos, setCursorPos]           = React.useState(null);
  const [characterPositions, setCharacterPositions] = React.useState(() => {
    const init = {};
    CHARACTERS_MAP.forEach(c => { init[c.id] = { col: c.col, row: c.row }; });
    return init;
  });
  const [placedPieces, setPlacedPieces]       = React.useState([]);
  const [highlightedTile, setHighlightedTile] = React.useState(null);
  const [draggingCharId, setDraggingCharId]   = React.useState(null);
  const [draggingPiece, setDraggingPiece]     = React.useState(null);

  // ── UNIVERSE 2 ────────────────────────────────────────────────────────
  const [showUniverse2, setShowUniverse2]         = React.useState(false);
  const [activeUniverse, setActiveUniverse]       = React.useState(1);
  const [placedPieces2, setPlacedPieces2]         = React.useState([]);
  const [characterPositions2, setCharacterPositions2] = React.useState({});
  const [saveFeedback, setSaveFeedback]           = React.useState(false);

  // Derived: route interactions to the active universe
  const activePieces    = activeUniverse === 1 ? placedPieces : placedPieces2;
  const setActivePieces = activeUniverse === 1 ? setPlacedPieces : setPlacedPieces2;
  const activeCharPos   = activeUniverse === 1 ? characterPositions : characterPositions2;
  const setActiveCharPos= activeUniverse === 1 ? setCharacterPositions : setCharacterPositions2;

  const mapOuterRef = React.useRef(null);
  const panRef      = React.useRef({ active: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0 });
  const stateRef    = React.useRef({ zoom: 0.75, pan: { x: -ISO_SVG_W * 0.75 / 2, y: -ISO_SVG_H * 0.75 / 2 } });
  React.useEffect(() => { stateRef.current.zoom = zoom; }, [zoom]);
  React.useEffect(() => { stateRef.current.pan  = pan;  }, [pan]);

  // Wheel zoom toward cursor
  React.useEffect(() => {
    const el = mapOuterRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const { zoom: z1, pan: p } = stateRef.current;
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const z2 = Math.min(2.5, Math.max(0.3, +(z1 + delta).toFixed(2)));
      if (z2 === z1) return;
      const ox = rect.width * 0.5, oy = rect.height * 0.5;
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      const wx = (cx - ox - p.x) / z1, wy = (cy - oy - p.y) / z1;
      const newPan = { x: cx - ox - wx * z2, y: cy - oy - wy * z2 };
      stateRef.current = { zoom: z2, pan: newPan };
      setZoom(z2); setPan(newPan);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Zoom from center (buttons)
  const applyZoom = React.useCallback((delta) => {
    if (!mapOuterRef.current) return;
    const rect = mapOuterRef.current.getBoundingClientRect();
    const { zoom: z1, pan: p } = stateRef.current;
    const z2 = Math.min(2.5, Math.max(0.3, +(z1 + delta).toFixed(2)));
    if (z2 === z1) return;
    const ox = rect.width * 0.5, oy = rect.height * 0.5;
    const wx = (ox - ox - p.x) / z1, wy = (oy - oy - p.y) / z1;
    const newPan = { x: -wx * z2, y: -wy * z2 };
    stateRef.current = { zoom: z2, pan: newPan };
    setZoom(z2); setPan(newPan);
  }, []);

  const occupiedTiles = React.useMemo(() => {
    const s = new Set();
    activePieces.forEach(p => s.add(`${p.col},${p.row}`));
    Object.values(activeCharPos).forEach(pos => s.add(`${pos.col},${pos.row}`));
    return s;
  }, [activePieces, activeCharPos]);

  const activeLayers = layers.filter(l => l.active);
  const handleLayerToggle = React.useCallback((id, active) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, active } : l));
  }, []);

  const handlePanStart = (e) => {
    if (e.button !== 0 || selectedStamp) return;
    if (e.target.closest('[draggable="true"]')) return;
    panRef.current = { active: true, startX: e.clientX, startY: e.clientY, startPanX: pan.x, startPanY: pan.y };
    setIsPanning(true);
  };
  const handleMouseMove = (e) => {
    if (panRef.current.active) {
      const newPan = { x: panRef.current.startPanX + (e.clientX - panRef.current.startX), y: panRef.current.startPanY + (e.clientY - panRef.current.startY) };
      setPan(newPan); stateRef.current.pan = newPan;
    }
    if (selectedStamp && mapOuterRef.current) {
      const rect = mapOuterRef.current.getBoundingClientRect();
      setCursorPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    }
  };
  const handlePanEnd = () => { panRef.current.active = false; setIsPanning(false); };

  const handleMapClick = (e) => {
    if (!selectedStamp || !mapOuterRef.current) return;
    const rect = mapOuterRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newBlob = { id: `u${Date.now()}`, kind: selectedStamp.id, label: selectedStamp.label, x, y, r: selectedStamp.radius || 120, color: selectedStamp.categoryRgb, intensity: 0.55, stamp: selectedStamp.icon, severity: 7, spreading: !!selectedStamp.spreading, characters: [] };
    setBlobs(b => [...b, newBlob]);
    setSelectedBlob(newBlob);
    setSelectedStamp(null); setCursorPos(null);
  };

  const handleTileDrop = React.useCallback((tile) => {
    const key = `${tile.col},${tile.row}`;
    if (draggingCharId) {
      setActiveCharPos(prev => ({ ...prev, [draggingCharId]: tile }));
      setDraggingCharId(null);
    } else if (draggingPiece) {
      if (!occupiedTiles.has(key)) {
        setActivePieces(prev => [...prev, { ...draggingPiece, col: tile.col, row: tile.row, instanceId: Date.now() }]);
      }
      setDraggingPiece(null);
    }
    setHighlightedTile(null);
  }, [draggingCharId, draggingPiece, occupiedTiles, setActiveCharPos, setActivePieces]);

  const centerOnTile = React.useCallback((col, row) => {
    const { zoom: z } = stateRef.current;
    const { x, y } = isoToScreen(col, row);
    const cx = x + TILE_W / 2, cy = y + TILE_H / 2;
    const newPan = { x: -(cx - ISO_SVG_W / 2) * z, y: -(cy - ISO_SVG_H / 2) * z };
    stateRef.current.pan = newPan; setPan(newPan);
  }, []);

  const removeBlob = (id) => { setBlobs(b => b.filter(x => x.id !== id)); setSelectedBlob(null); };

  const handleSave = React.useCallback(() => {
    try {
      localStorage.setItem("cantina-u1", JSON.stringify({ placedPieces, characterPositions }));
      localStorage.setItem("cantina-u2", JSON.stringify({ placedPieces2, characterPositions2 }));
    } catch {}
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  }, [placedPieces, characterPositions, placedPieces2, characterPositions2]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { setSelectedStamp(null); setSelectedBlob(null); setDraggingCharId(null); setDraggingPiece(null); setHighlightedTile(null); setCursorPos(null); }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedBlob && document.activeElement.tagName !== "INPUT") removeBlob(selectedBlob.id);
      if ((e.key === "=" || e.key === "+") && !e.metaKey && !e.ctrlKey) applyZoom(+0.1);
      if (e.key === "-" && !e.metaKey && !e.ctrlKey) applyZoom(-0.1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedBlob, applyZoom]);

  // Drag ghost
  const ghostRef = React.useRef(null);
  const draggingPieceRef = React.useRef(null);
  React.useEffect(() => { draggingPieceRef.current = draggingPiece; }, [draggingPiece]);
  React.useEffect(() => {
    const onDragOver = (e) => { if (ghostRef.current && draggingPieceRef.current) { ghostRef.current.style.left = `${e.clientX}px`; ghostRef.current.style.top = `${e.clientY}px`; ghostRef.current.style.display = "flex"; } };
    const onDragEnd  = () => { if (ghostRef.current) ghostRef.current.style.display = "none"; };
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("dragend",  onDragEnd);
    return () => { document.removeEventListener("dragover", onDragOver); document.removeEventListener("dragend", onDragEnd); };
  }, []);

  const PANEL_W = 272;
  const initZoom = 0.75;
  const initPan  = { x: -ISO_SVG_W * initZoom / 2, y: -ISO_SVG_H * initZoom / 2 };

  return (
    <div style={{ flex: 1, height: "100vh", position: "relative", overflow: "hidden", background: "#05021A", fontFamily: "var(--font-ui)" }}>
      <style>{animCSS}</style>

      {/* PAN/ZOOM OUTER */}
      <div
        ref={mapOuterRef}
        style={{ position: "absolute", inset: 0, overflow: "hidden", cursor: selectedStamp ? "crosshair" : isPanning ? "grabbing" : "grab" }}
        onMouseDown={handlePanStart}
        onMouseMove={handleMouseMove}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
        onClick={handleMapClick}
        onDragEnd={() => { setDraggingCharId(null); setDraggingPiece(null); setHighlightedTile(null); }}
      >
        {/* PAN/ZOOM TRANSFORM — origin at viewport center */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}>
          {/* ISO SVG GRID */}
          <svg
            width={ISO_SVG_W} height={ISO_SVG_H}
            style={{ display: "block", overflow: "visible" }}
          >
            <defs>
              <radialGradient id="bgGrad" cx="50%" cy="35%" r="65%">
                <stop offset="0%"   stopColor="#1A0A38" />
                <stop offset="50%"  stopColor="#0E0628" />
                <stop offset="100%" stopColor="#06031A" />
              </radialGradient>
            </defs>
            <rect width={ISO_SVG_W} height={ISO_SVG_H} fill="url(#bgGrad)" />

            {/* Tiles — painter's algorithm (back to front by col+row) */}
            {/* Universe behind (ghost layer at 30% opacity) */}
            {showUniverse2 && (
              <g opacity={0.3} style={{ pointerEvents: "none" }}>
                {SORTED_TILES.map(({ c, r }) => (
                  <IsoTile key={`u${activeUniverse === 1 ? 2 : 1}-${c}-${r}`}
                    col={c} row={r}
                    terrain={activeUniverse === 1 ? getTerrain2(c, r) : getTerrain(c, r)}
                    highlighted={false} invalid={false}
                    onEnter={()=>{}} onLeave={()=>{}} onDragOver={()=>{}} onDrop={()=>{}}
                  />
                ))}
              </g>
            )}
            {/* Active universe (full opacity, interactive) */}
            {SORTED_TILES.map(({ c, r }) => {
              const isHl = highlightedTile?.col === c && highlightedTile?.row === r;
              const isOccupied = occupiedTiles.has(`${c},${r}`);
              const invalid = isHl && !!draggingPiece && isOccupied;
              const terrain = activeUniverse === 1 ? getTerrain(c, r) : getTerrain2(c, r);
              return (
                <IsoTile key={`t-${c}-${r}`}
                  col={c} row={r}
                  terrain={terrain}
                  highlighted={isHl && !invalid}
                  invalid={invalid}
                  onEnter={() => { if (!selectedStamp) setHighlightedTile({ col: c, row: r }); }}
                  onLeave={() => setHighlightedTile(null)}
                  onDragOver={(e) => { e.preventDefault(); setHighlightedTile({ col: c, row: r }); }}
                  onDrop={(e) => { e.preventDefault(); handleTileDrop({ col: c, row: r }); }}
                />
              );
            })}
          </svg>

          {/* OVERLAY: placed pieces + characters (same coordinate system as SVG) */}
          <div style={{ position: "absolute", top: 0, left: 0, width: ISO_SVG_W, height: ISO_SVG_H, pointerEvents: "none" }}>
            {/* Ghost universe pieces */}
            {showUniverse2 && (
              <div style={{ opacity: 0.3 }}>
                {(activeUniverse === 1 ? placedPieces2 : placedPieces).map(piece => (
                  <PlacedPiece key={`ghost-${piece.instanceId}`} piece={piece} col={piece.col} row={piece.row} />
                ))}
              </div>
            )}
            {/* Active universe pieces */}
            {activePieces.map(piece => (
              <PlacedPiece key={piece.instanceId} piece={piece} col={piece.col} row={piece.row} />
            ))}
            {CHARACTERS_MAP.map(c => {
              const pos = activeCharPos[c.id] || { col: c.col, row: c.row };
              const { x, y } = isoToScreen(pos.col, pos.row);
              return (
                <CharacterIcon
                  key={c.id} char={c}
                  screenX={x + TILE_W / 2}
                  screenY={y + TILE_H / 2}
                  isActive={c.id === activeChar}
                  onSelect={() => setActiveChar(c.id)}
                  onDragStart={() => setDraggingCharId(c.id)}
                />
              );
            })}
          </div>
        </div>

        {/* SCREEN-SPACE OVERLAYS */}
        {activeLayers.map(layer => <LayerMapOverlay key={layer.id} layer={layer} />)}
        {mapMode === "pressure" && (
          <PressureBlobsLayer blobs={blobs} selectedId={selectedBlob?.id}
            onSelect={(b) => { setSelectedBlob(b); setSelectedStamp(null); }} />
        )}
        <PressureIconsSVG blobs={mapMode === "pressure" ? blobs : []} cursorPos={cursorPos} previewStamp={selectedStamp} />

        {/* Deep vignette */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10, background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(3,8,16,0.75) 100%)" }}/>
        {/* Film grain */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 11, opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`}}/>
      </div>

      {/* ── UNIVERSE SWITCHER ─────────────────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 96, left: "50%", transform: "translateX(-50%)",
        zIndex: 30, display: "flex", alignItems: "center", gap: 6,
        background: "rgba(5,2,20,0.92)", backdropFilter: "blur(10px)",
        border: `1px solid ${showUniverse2 && activeUniverse === 2 ? "rgba(255,100,220,0.4)" : "rgba(110,65,255,0.35)"}`,
        borderRadius: 24, padding: "5px 10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
        transition: "border-color 0.2s",
      }}>
        {/* Universe 1 tab */}
        <button onClick={() => setActiveUniverse(1)} style={{
          padding: "4px 12px", borderRadius: 16, border: "none", cursor: "pointer",
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em",
          background: activeUniverse === 1 ? "rgba(110,65,255,0.25)" : "transparent",
          color: activeUniverse === 1 ? "#C090FF" : "rgba(140,100,255,0.5)",
          transition: "all 0.15s",
        }}>UNIVERSE 1</button>

        <div style={{ width: 1, height: 16, background: "rgba(110,65,255,0.2)" }} />

        {/* Universe 2 toggle/tab */}
        <button onClick={() => {
          if (!showUniverse2) { setShowUniverse2(true); setActiveUniverse(2); }
          else { setActiveUniverse(activeUniverse === 2 ? 1 : 2); }
        }} style={{
          padding: "4px 12px", borderRadius: 16, border: "none", cursor: "pointer",
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em",
          background: showUniverse2 && activeUniverse === 2 ? "rgba(255,80,200,0.2)" : "transparent",
          color: showUniverse2 ? (activeUniverse === 2 ? "#FF80E0" : "rgba(255,120,220,0.5)") : "rgba(110,65,255,0.4)",
          transition: "all 0.15s",
        }}>{showUniverse2 ? "UNIVERSE 2" : "+ UNIVERSE 2"}</button>

        {showUniverse2 && <>
          <div style={{ width: 1, height: 16, background: "rgba(110,65,255,0.2)" }} />
          {/* Hide U2 */}
          <button onClick={() => { setShowUniverse2(false); setActiveUniverse(1); }} style={{
            padding: "4px 8px", borderRadius: 12, border: "1px solid rgba(110,65,255,0.2)",
            background: "transparent", color: "rgba(140,100,255,0.5)", cursor: "pointer",
            fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.1em",
          }}>HIDE</button>
        </>}

        <div style={{ width: 1, height: 16, background: "rgba(110,65,255,0.2)" }} />

        {/* Save */}
        <button onClick={handleSave} style={{
          padding: "4px 12px", borderRadius: 16, border: "1px solid rgba(110,65,255,0.3)",
          background: saveFeedback ? "rgba(45,255,120,0.15)" : "transparent",
          color: saveFeedback ? "#2DFF78" : "rgba(140,100,255,0.6)",
          cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em",
          transition: "all 0.2s",
        }}>{saveFeedback ? "✓ SAVED" : "SAVE"}</button>
      </div>

      {/* Universe badge — shows which universe is active */}
      {showUniverse2 && (
        <div style={{
          position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
          zIndex: 30, padding: "4px 14px", borderRadius: 20,
          background: activeUniverse === 2 ? "rgba(255,60,180,0.15)" : "rgba(110,65,255,0.12)",
          border: `1px solid ${activeUniverse === 2 ? "rgba(255,80,200,0.5)" : "rgba(110,65,255,0.3)"}`,
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em",
          color: activeUniverse === 2 ? "#FF80E0" : "#A070FF",
          backdropFilter: "blur(6px)",
        }}>
          EDITING — {activeUniverse === 1 ? "UNIVERSE 1" : "UNIVERSE 2"}
        </div>
      )}

      {/* LEFT PANEL */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: PANEL_W,
        background: "rgba(6,8,20,0.94)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderRight: "1px solid var(--iron)", zIndex: 40, display: "flex", flexDirection: "column", overflow: "hidden",
        transform: leftOpen ? "translateX(0)" : `translateX(-${PANEL_W}px)`,
        transition: "transform 200ms ease",
      }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--iron)", flexShrink: 0 }}>
          {[{ id: "events", label: "EVENTS" }, { id: "elements", label: "ELEMENTS" }].map(tab => (
            <button key={tab.id} onClick={() => setLeftTab(tab.id)} style={{
              flex: 1, padding: "13px 4px", background: "transparent", border: "none",
              borderBottom: `2px solid ${leftTab === tab.id ? "var(--krypton)" : "transparent"}`,
              color: leftTab === tab.id ? "var(--krypton)" : "var(--text-dim)",
              fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.15em",
              textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s ease",
            }}>{tab.label}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {leftTab === "events" ? (
            <>
              {STAMP_CATEGORIES.map(cat => (
                <StampSection key={cat.id} cat={cat} selectedId={selectedStamp?.id} onSelect={setSelectedStamp}/>
              ))}
              <div style={{ padding: "10px 14px 4px" }}>
                <button style={{ width: "100%", padding: "10px 12px", background: "transparent", border: "1px dashed var(--iron)", borderRadius: 8, color: "var(--text-secondary)", fontSize: 11, fontFamily: "var(--font-ui)", letterSpacing: "0.04em", cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--krypton)"; e.currentTarget.style.color = "var(--krypton)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--iron)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >+ Make your own event</button>
              </div>
            </>
          ) : (
            <PieceLibrary onDragStart={setDraggingPiece} />
          )}
        </div>
      </div>

      {/* PANEL CHEVRON */}
      <button onClick={() => setLeftOpen(o => !o)} style={{
        position: "absolute", top: "50%", left: leftOpen ? PANEL_W - 1 : 0,
        transform: "translateY(-50%)", transition: "left 200ms ease",
        zIndex: 45, width: 20, height: 48,
        background: "rgba(6,8,20,0.94)", border: "1px solid var(--iron)",
        borderLeft: leftOpen ? "none" : "1px solid var(--iron)",
        borderRadius: "0 8px 8px 0", color: "var(--text-secondary)", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
      }}>{leftOpen ? "‹" : "›"}</button>

      {/* LAYER PANEL */}
      <LayerPanel layers={layers} onToggle={handleLayerToggle} mapMode={mapMode} onModeChange={setMapMode} open={layerPanelOpen} onToggleOpen={() => setLayerPanelOpen(o => !o)} />

      {/* ZOOM CONTROLS */}
      <ZoomControls zoom={zoom} onZoomIn={() => applyZoom(+0.1)} onZoomOut={() => applyZoom(-0.1)}
        onReset={() => { stateRef.current = { zoom: initZoom, pan: initPan }; setZoom(initZoom); setPan(initPan); }} />

      {/* COMPASS */}
      <div style={{ position: "absolute", top: 18, right: 288, width: 44, height: 44, background: "rgba(15,15,26,0.85)", backdropFilter: "blur(8px)", border: "1px solid var(--iron)", borderRadius: "50%", zIndex: 25, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 26, height: 26 }}>
          <div style={{ position: "absolute", left: "50%", top: 2, transform: "translateX(-50%)", color: "var(--krypton)", fontSize: 9, fontWeight: 600 }}>N</div>
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 1, height: 12, background: "linear-gradient(to bottom, var(--krypton), transparent)", transform: "translateX(-50%) translateY(-100%)" }}/>
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 1, height: 8, background: "var(--text-dim)", transform: "translateX(-50%)" }}/>
        </div>
      </div>

      {/* STAMP DETAIL */}
      {selectedBlob && <StampDetailCard blob={selectedBlob} onClose={() => setSelectedBlob(null)} onRemove={() => removeBlob(selectedBlob.id)} />}

      {/* PRESENCE STRIP */}
      <PresenceStrip chars={CHARACTERS_MAP} activeChar={activeChar} leftOpen={leftOpen}
        onSelect={(id) => {
          setActiveChar(id);
          const pos = characterPositions[id] || CHARACTERS_MAP.find(c => c.id === id);
          if (pos) centerOnTile(pos.col, pos.row);
        }}
      />

      {/* DRAG GHOST */}
      <div ref={ghostRef} style={{ position: "fixed", pointerEvents: "none", zIndex: 1000, transform: "translate(-50%, -60%)", display: "none", flexDirection: "column", alignItems: "center", filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.9))", opacity: 0.8 }}>
        {draggingPiece && <PieceThumb piece={draggingPiece} size={56} />}
      </div>

      {/* STAMP PLACEMENT LABEL */}
      {selectedStamp && (
        <div style={{ position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)", zIndex: 50, background: "rgba(15,15,26,0.92)", backdropFilter: "blur(8px)", border: `1px solid ${selectedStamp.categoryColor}`, borderRadius: 10, padding: "8px 14px", fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-primary)", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: `0 0 24px ${selectedStamp.categoryColor}40` }}>
          <span style={{ fontSize: 14 }}>{selectedStamp.icon}</span>
          <span>Placing: <strong>{selectedStamp.label}</strong></span>
          <span style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: 10 }}>· Click on map · ESC to cancel</span>
        </div>
      )}
    </div>
  );
};

window.WorldMap = WorldMap;
