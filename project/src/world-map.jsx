// WORLD PRESSURE MAP — Cantina Simulated Universes
// Isometric world engine. Director places stamps and pieces; characters inhabit tiles.

// ── GRID MATH ────────────────────────────────────────────────────────
const GRID_SIZE = 24;
const TILE_W = 60;
const TILE_H = 60;

const seeded = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// Dark navy-to-teal palette, cyan glow lines
const TERRAIN_COLORS = {
  plains: { fill: "#0D1F2D", border: "rgba(0,229,255,0.22)", hl: "#1A4A5C", hlBorder: "rgba(0,229,255,0.7)" },
  hills:  { fill: "#112030", border: "rgba(0,229,255,0.25)", hl: "#1A4A5C", hlBorder: "rgba(0,229,255,0.7)" },
  water:  { fill: "#071528", border: "rgba(0,180,255,0.38)", hl: "#0D2E50", hlBorder: "rgba(0,200,255,0.8)" },
  forest: { fill: "#0B1D14", border: "rgba(0,229,255,0.2)",  hl: "#163624", hlBorder: "rgba(0,229,255,0.7)" },
  urban:  { fill: "#0F1428", border: "rgba(124,77,255,0.32)", hl: "#1A1A42", hlBorder: "rgba(124,77,255,0.75)" },
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
      { id: "pandemic",   icon: "🦠", label: "Pandemic",             radius: 220, spreading: true },
      { id: "bioweapon",  icon: "☣️", label: "Bio Weapon",           radius: 90  },
      { id: "drug",       icon: "💊", label: "Drug Crisis",          radius: 130 },
      { id: "healthcare", icon: "🏥", label: "Healthcare Collapse",  radius: 160 },
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
  { id: "kal",   name: "Kal-El",   col: 8,  row: 10, color: "0,212,170",   img: "assets/char-superman-cavill.webp", status: "active",    state: "Guilt 82%"  },
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
    { id: "mountain", label: "Mountain", icon: "⛰️", height: 80, desc: "Blocks passage, +2 defense",
      colors: { top: "#2A2A3E", accent: "#E0F7FA", glow: "rgba(224,247,250,0.55)" } },
    { id: "lake",     label: "Lake",     icon: "💧", height: 5,  desc: "Water barrier, impassable",
      colors: { top: "#1A237E", accent: "#00E5FF", glow: "rgba(0,229,255,0.55)" } },
    { id: "forest-p", label: "Forest",   icon: "🌲", height: 40, desc: "+1 stealth, slows movement",
      colors: { top: "#1B4332", accent: "#00BFA5", glow: "rgba(0,191,165,0.55)" } },
    { id: "desert",   label: "Desert",   icon: "🏜️", height: 20, desc: "Harsh terrain, -1 stamina/turn",
      colors: { top: "#6D4C41", accent: "#FFD54F", glow: "rgba(255,213,79,0.55)" } },
  ],
  settlements: [
    { id: "village",  label: "Village",  icon: "🏘️", height: 30, desc: "Civilian shelter, +3 morale",
      colors: { top: "#37474F", accent: "#FFB300", glow: "rgba(255,179,0,0.55)" } },
    { id: "city",     label: "City",     icon: "🏙️", height: 60, desc: "Population hub, high exposure",
      colors: { top: "#1C1C2E", accent: "#7C4DFF", glow: "rgba(124,77,255,0.6)" } },
    { id: "fortress", label: "Fortress", icon: "🏰", height: 70, desc: "Military stronghold, +5 defense",
      colors: { top: "#455A64", accent: "#FF6F00", glow: "rgba(255,111,0,0.55)" } },
    { id: "ruins",    label: "Ruins",    icon: "🏚️", height: 25, desc: "Unstable ground, hidden passages",
      colors: { top: "#3E2723", accent: "#A5D6A7", glow: "rgba(165,214,167,0.4)" } },
  ],
  power: [
    { id: "reactor",  label: "Reactor",  icon: "⚛️", height: 50, desc: "Energy source, radiation risk",
      colors: { top: "#1C1C1C", accent: "#E040FB", glow: "rgba(224,64,251,0.65)" } },
    { id: "tower",    label: "Tower",    icon: "📡", height: 90, desc: "Surveillance, +4 control radius",
      colors: { top: "#1A1A2E", accent: "#00E5FF", glow: "rgba(0,229,255,0.55)" } },
    { id: "lab",      label: "Lab",      icon: "🔬", height: 40, desc: "Research site, +2 intel/turn",
      colors: { top: "#1B2A1B", accent: "#69F0AE", glow: "rgba(105,240,174,0.55)" } },
    { id: "vault",    label: "Vault",    icon: "🔒", height: 30, desc: "Secured cache, high value target",
      colors: { top: "#1A1A1A", accent: "#FFD700", glow: "rgba(255,215,0,0.55)" } },
  ],
  infrastructure: [
    { id: "highway",  label: "Highway",  icon: "🛣️", height: 15, desc: "Fast travel corridor",
      colors: { top: "#37474F", accent: "#FFD740", glow: "rgba(255,215,64,0.45)" } },
    { id: "bridge",   label: "Bridge",   icon: "🌉", height: 35, desc: "Crosses water, strategic chokepoint",
      colors: { top: "#546E7A", accent: "#B0BEC5", glow: "rgba(176,190,197,0.45)" } },
    { id: "port",     label: "Port",     icon: "⚓", height: 20, desc: "Naval access, supply lines",
      colors: { top: "#01579B", accent: "#29B6F6", glow: "rgba(41,182,246,0.55)" } },
    { id: "airport",  label: "Airport",  icon: "✈️", height: 25, desc: "Air transport hub",
      colors: { top: "#263238", accent: "#90CAF9", glow: "rgba(144,202,249,0.5)" } },
  ],
};

const PIECE_CATEGORIES = [
  { id: "terrain",        label: "TERRAIN",       color: "#2DFF78" },
  { id: "settlements",    label: "SETTLEMENTS",   color: "#00D4FF" },
  { id: "power",          label: "POWER",         color: "#E0B0FF" },
  { id: "infrastructure", label: "INFRA",         color: "#C9A84C" },
];

// ── LAYER POSITIONS ───────────────────────────────────────────────────
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
    0%, 100% { transform: scale(1);    }
    50%      { transform: scale(1.04); }
  }
  @keyframes blobBreath {
    from { transform: translate(-50%, -50%) scale(0.97); opacity: 0.85; }
    to   { transform: translate(-50%, -50%) scale(1.03); opacity: 1;    }
  }
  @keyframes layerFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes layerPulse {
    0%, 100% { opacity: 0.65; }
    50%      { opacity: 1;    }
  }
  @keyframes pieceDropIn {
    0%   { opacity: 0; transform: scale(0.5) translateY(-16px); }
    65%  { transform: scale(1.12) translateY(0); }
    82%  { transform: scale(0.96); }
    100% { opacity: 1; transform: scale(1); }
  }
  .wpm-blob-conflict { animation-duration: 1.6s !important; }
  .wpm-blob-bio      { animation-duration: 4s   !important; }
  .wpm-blob-trauma   { animation-duration: 6s   !important; }
`;

// ── PIECE THUMBNAIL ───────────────────────────────────────────────────
const PieceThumb = ({ piece, size = 48 }) => (
  <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    {/* Diamond face */}
    <div style={{
      position: "absolute", inset: 0,
      background: `linear-gradient(145deg, ${piece.colors.top} 0%, rgba(4,4,10,0.95) 100%)`,
      clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    }} />
    {/* Accent glow */}
    <div style={{
      position: "absolute", inset: 0,
      background: `radial-gradient(circle at 38% 38%, ${piece.colors.accent}28 0%, transparent 65%)`,
      clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    }} />
    {/* Border glow */}
    <div style={{
      position: "absolute", inset: 1,
      clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
      boxShadow: `0 0 10px ${piece.colors.glow}`,
      border: `1px solid ${piece.colors.accent}40`,
    }} />
    {/* Icon */}
    <div style={{
      position: "relative", zIndex: 1, fontSize: Math.round(size * 0.36), lineHeight: 1,
      filter: `drop-shadow(0 0 4px ${piece.colors.glow})`,
    }}>
      {piece.icon}
    </div>
  </div>
);

// ── PIECE LIBRARY ─────────────────────────────────────────────────────
const PieceLibrary = ({ onDragStart }) => {
  const [openCat, setOpenCat] = React.useState("terrain");
  const [tooltip, setTooltip] = React.useState(null);
  return (
    <div style={{ position: "relative" }}>
      {PIECE_CATEGORIES.map(cat => (
        <div key={cat.id}>
          <button
            onClick={() => setOpenCat(o => o === cat.id ? null : cat.id)}
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
            <span style={{ color: "var(--text-dim)", fontSize: 12 }}>{openCat === cat.id ? "−" : "+"}</span>
          </button>
          {openCat === cat.id && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "10px 12px 12px" }}>
              {WORLD_PIECES[cat.id].map(piece => (
                <div
                  key={piece.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("pieceId", piece.id);
                    e.dataTransfer.setData("pieceCategory", cat.id);
                    e.currentTarget.style.opacity = "0.5";
                    e.currentTarget.style.transform = "scale(1.08)";
                    onDragStart(piece);
                  }}
                  onDragEnd={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
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
                    padding: "8px 6px 6px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10,
                    cursor: "grab", textAlign: "center",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    transition: "all 0.12s ease",
                  }}
                >
                  <PieceThumb piece={piece} size={48} />
                  <span style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-ui)", letterSpacing: "0.02em" }}>
                    {piece.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {/* Hover tooltip */}
      {tooltip && (
        <div style={{
          position: "fixed", bottom: 100, left: 16, right: 16,
          background: "rgba(8,8,20,0.97)", border: `1px solid ${tooltip.colors.accent}40`,
          borderLeft: `3px solid ${tooltip.colors.accent}`,
          borderRadius: 8, padding: "8px 12px", zIndex: 200,
          fontFamily: "var(--font-ui)",
          boxShadow: `0 4px 16px rgba(0,0,0,0.7), 0 0 12px ${tooltip.colors.glow}`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#F0F0FF", marginBottom: 2 }}>{tooltip.label}</div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{tooltip.desc}</div>
        </div>
      )}
    </div>
  );
};

// ── FLOATING CHARACTER ICON ────────────────────────────────────────────
const FloatingCharacterIcon = ({ char: c, col, row, isActive, onSelect, onDragStart }) => {
  const [hovered, setHovered] = React.useState(false);
  const x = col * TILE_W + TILE_W / 2;
  const y = row * TILE_H + TILE_H / 2;
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
        position: "absolute", left: x, top: y,
        transform: `translate(-50%, -50%) translateZ(60px) rotateZ(45deg) rotateX(-52deg)`,
        transformStyle: "preserve-3d",
        cursor: "pointer", zIndex: isActive ? 20 : 10,
      }}
    >
      <div style={{ position: "relative", width: 44, height: 44 }}>
        {isActive && (
          <div style={{
            position: "absolute", inset: -8, borderRadius: "50%",
            border: "1.5px solid rgba(0,212,170,0.8)",
            animation: "wpmRingPulse 2s ease-out infinite",
          }} />
        )}
        <div style={{
          position: "absolute", inset: -6, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${c.color},0.35) 0%, transparent 70%)`,
          filter: "blur(4px)", opacity: isActive ? 1 : 0.4,
        }} />
        <div style={{
          position: "relative", width: 44, height: 44, borderRadius: "50%",
          overflow: "hidden",
          border: `2px solid ${isActive ? "rgba(0,212,170,0.9)" : "rgba(255,255,255,0.2)"}`,
          boxShadow: isActive
            ? `0 0 20px rgba(0,212,170,0.6), 0 8px 24px rgba(0,0,0,0.8)`
            : `0 6px 20px rgba(0,0,0,0.7)`,
          filter: c.status === "deceased" ? "grayscale(1) brightness(0.6)" : "none",
          animation: "wpmCharIdle 2.4s ease-in-out infinite",
          animationDelay: `${c.id.length * 200}ms`,
        }}>
          <img src={c.img} alt={c.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "55%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)",
            borderRadius: "50% 50% 0 0", pointerEvents: "none",
          }} />
        </div>
        <div style={{
          position: "absolute", bottom: -1, right: -1,
          width: 10, height: 10, borderRadius: "50%",
          background: statusDot, border: "2px solid #04040A",
          boxShadow: c.status === "active" ? `0 0 8px ${statusDot}` : "none",
        }} />
      </div>
      {hovered && (
        <div style={{
          position: "absolute", bottom: 52, left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(8,8,16,0.96)", border: "1px solid rgba(0,212,170,0.3)",
          borderRadius: 8, padding: "6px 12px", whiteSpace: "nowrap",
          fontFamily: "var(--font-ui)", fontSize: 11, color: "#F0F0FF",
          pointerEvents: "none", zIndex: 200,
          boxShadow: "0 4px 16px rgba(0,0,0,0.7)",
        }}>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{c.name}</div>
          <div style={{ fontSize: 10, color: "var(--text-dim)" }}>{c.state}</div>
        </div>
      )}
    </div>
  );
};

// ── PLACED PIECE ──────────────────────────────────────────────────────
const PlacedPiece = ({ piece, col, row }) => {
  const x = col * TILE_W + TILE_W / 2;
  const y = row * TILE_H + TILE_H / 2;
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      transform: `translate(-50%, -50%) translateZ(${piece.height || 30}px) rotateZ(45deg) rotateX(-52deg)`,
      transformStyle: "preserve-3d",
      pointerEvents: "none",
    }}>
      <div style={{ animation: "pieceDropIn 0.4s cubic-bezier(0.34,1.56,0.64,1) backwards" }}>
        <div style={{
          fontSize: 22, textAlign: "center",
          filter: `drop-shadow(0 4px 12px ${piece.colors?.glow || "rgba(0,0,0,0.9)"})`,
        }}>
          {piece.icon}
        </div>
        <div style={{
          fontSize: 9, color: "rgba(255,255,255,0.45)", textAlign: "center",
          fontFamily: "var(--font-ui)", letterSpacing: "0.04em", marginTop: 1,
        }}>{piece.label}</div>
      </div>
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
        <div
          key={blob.id}
          className={`wpm-blob wpm-blob-${blob.kind}`}
          style={{
            position: "absolute",
            left: `${blob.x}%`, top: `${blob.y}%`,
            width: `${blob.r * 2}px`, height: `${blob.r * 2}px`,
            transform: "translate(-50%, -50%)",
            mixBlendMode: "screen",
            background: `radial-gradient(ellipse at center, ${colors.core} 0%, ${colors.mid} 35%, transparent 70%)`,
            animation: `blobBreath ${3 + index * 0.7}s ease-in-out infinite alternate`,
            borderRadius: "50%",
            pointerEvents: "all", cursor: "pointer",
          }}
          onClick={(e) => { e.stopPropagation(); onSelect(blob); }}
        >
          {isSelected && (
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: `1.5px solid rgba(${blob.color},0.7)`, boxSizing: "border-box",
            }} />
          )}
        </div>
      );
    })}
  </div>
);

// ── LAYER MAP OVERLAYS ────────────────────────────────────────────────
const LayerMapOverlay = ({ layer }) => {
  const pos = LAYER_POSITIONS[layer.id] || LAYER_POSITIONS.social;
  const gradId = `layer-grad-${layer.id}`;
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
      {/* Accordion header */}
      <button onClick={onToggleOpen} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", padding: "12px 16px", background: "transparent",
        border: "none", cursor: "pointer",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10, color: "#6B6B8A", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>
            MAP LAYERS
          </span>
          <span style={{
            fontSize: 10, fontFamily: "var(--font-mono)",
            background: "rgba(0,201,167,0.15)", color: "#00C9A7",
            border: "1px solid rgba(0,201,167,0.3)", borderRadius: 999,
            padding: "1px 7px",
          }}>{activeLayers.length}</span>
        </div>
        <span style={{ color: "#6B6B8A", fontSize: 16, lineHeight: 1, fontWeight: 300 }}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          {/* Map mode toggle */}
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

          <div style={{
            fontSize: 10, color: "#6B6B8A", letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: 8, display: "flex", justifyContent: "space-between",
          }}>
            <span>LAYERS</span>
            <button
              onClick={() => layers.forEach(l => onToggle(l.id, false))}
              style={{ background: "transparent", border: "none", color: "#6B6B8A", fontSize: 10, cursor: "pointer" }}
            >CLEAR</button>
          </div>

          {layers.map((layer, index) => (
            <div key={layer.id}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "7px 0",
                borderBottom: index < layers.length - 1 ? "1px solid #0F0F1A" : "none",
                cursor: "pointer",
              }}
              onClick={() => onToggle(layer.id, !layer.active)}
            >
              {/* Pulsing dot */}
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
              <div style={{
                flex: 1, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
                color: layer.active ? "#F0F0FF" : "#6B6B8A",
                transition: "color 0.15s ease", fontFamily: "var(--font-ui)",
              }}>{layer.label}</div>
              {/* Pulsing bar */}
              {layer.active && (
                <div style={{
                  width: 3, height: 18, borderRadius: 2, background: layer.color, flexShrink: 0,
                  animation: "layerPulse 2s ease-in-out infinite",
                }} />
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
                    opacity: Math.max(0.4, 1 - i * 0.1),
                    position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)",
                      width: 3, height: 3, borderRadius: "50%", background: layer.color,
                    }} />
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
const zoomBtnStyle = {
  width: 40, height: 34,
  background: "rgba(15,15,26,0.9)", border: "1px solid var(--iron)",
  borderRadius: 8, color: "var(--text-secondary)", cursor: "pointer",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  fontSize: 18, fontFamily: "var(--font-mono)", transition: "all 120ms ease",
};

const ZoomControls = ({ zoom, onZoomIn, onZoomOut, onReset }) => (
  <div style={{
    position: "absolute", right: 18, bottom: 108,
    display: "flex", flexDirection: "column", gap: 5, zIndex: 25, alignItems: "center",
  }}>
    <button style={zoomBtnStyle} onClick={onZoomIn}>+</button>
    <div style={{
      width: 40, padding: "4px 0",
      background: "rgba(15,15,26,0.9)", border: "1px solid var(--iron)", borderRadius: 7,
      fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)",
      textAlign: "center", letterSpacing: "0.04em",
    }}>{Math.round(zoom * 100)}%</div>
    <button style={zoomBtnStyle} onClick={onZoomOut}>−</button>
    <button style={{ ...zoomBtnStyle, marginTop: 4, fontSize: 14 }} onClick={onReset} title="Reset view">⌖</button>
  </div>
);

// ── STAMP SECTION ─────────────────────────────────────────────────────
const StampSection = ({ cat, selectedId, onSelect, expanded }) => {
  const [open, setOpen] = React.useState(true);
  if (!expanded) {
    return (
      <div style={{ padding: "12px 0", display: "flex", justifyContent: "center" }}>
        <div title={cat.label} style={{ width: 28, height: 4, borderRadius: 2, background: cat.color, opacity: 0.85 }}/>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 4 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", padding: "10px 18px", background: "transparent",
        border: "none", cursor: "pointer", color: "var(--text-secondary)",
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
                  display: "flex", alignItems: "center", gap: 12,
                  width: "100%", padding: "8px 10px", marginBottom: 2,
                  background: isSel ? "rgba(0,212,170,0.08)" : "transparent",
                  border: `1px solid ${isSel ? "var(--krypton)" : "transparent"}`,
                  borderRadius: 8, cursor: "pointer", textAlign: "left",
                  color: isSel ? "var(--text-primary)" : "var(--text-secondary)",
                  transition: "all 120ms ease",
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

// ── STAMP ICONS SVG ───────────────────────────────────────────────────
const PressureIconsSVG = ({ blobs, cursorPos, previewStamp }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }}>
    {blobs.map(b => (
      <foreignObject key={`fo-${b.id}`}
        x={`calc(${b.x}% - 14px)`} y={`calc(${b.y}% - 14px)`}
        width="28" height="28" style={{ pointerEvents: "none" }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: `rgba(${b.color},0.85)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, boxShadow: `0 0 12px rgba(${b.color},0.6)`,
          border: "1.5px solid rgba(255,255,255,0.15)",
        }}>{b.stamp}</div>
      </foreignObject>
    ))}
    {previewStamp && cursorPos && (
      <g style={{ pointerEvents: "none" }}>
        <defs>
          <radialGradient id="preview-grad" cx="50%" cy="50%">
            <stop offset="0%"   stopColor={`rgba(${previewStamp.categoryRgb},0.35)`}/>
            <stop offset="100%" stopColor={`rgba(${previewStamp.categoryRgb},0)`}/>
          </radialGradient>
        </defs>
        <circle cx={`${cursorPos.x}%`} cy={`${cursorPos.y}%`} r={previewStamp.radius || 120}
          fill="url(#preview-grad)" style={{ mixBlendMode: "screen" }}/>
        <circle cx={`${cursorPos.x}%`} cy={`${cursorPos.y}%`} r={previewStamp.radius || 120}
          fill="none" stroke={previewStamp.categoryColor} strokeWidth="1.5"
          strokeDasharray="4 5" opacity="0.85"/>
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
        <span key={i} style={{
          width: 8, height: 10, borderRadius: 2,
          background: i < value ? c : "var(--iron)",
          boxShadow: i < value ? `0 0 4px ${c}80` : "none",
        }}/>
      ))}
      <span style={{ marginLeft: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-secondary)" }}>{value}/10</span>
    </div>
  );
};

const btnStyle = (kind) => ({
  flex: 1, height: 32, fontFamily: "var(--font-ui)", fontSize: 11,
  fontWeight: 500, letterSpacing: "0.04em", background: "transparent",
  border: `1px solid ${kind === "danger" ? "rgba(204,34,0,0.6)" : "var(--iron)"}`,
  color: kind === "danger" ? "#FF6B5B" : "var(--text-secondary)",
  borderRadius: 8, cursor: "pointer", transition: "all 160ms ease",
});

// ── STAMP DETAIL CARD ─────────────────────────────────────────────────
const StampDetailCard = ({ blob, onClose, onRemove }) => {
  const blobRgb = blob.color;
  const blobSolid = `rgb(${blobRgb})`;
  const blobA = (a) => `rgba(${blobRgb},${a})`;
  return (
    <div style={{
      position: "absolute", left: 88, top: 92, width: 268,
      background: "rgba(8,8,16,0.95)", backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: `1px solid ${blobA(0.3)}`, borderLeft: `3px solid ${blobSolid}`,
      borderRadius: 12, padding: "16px 18px", zIndex: 30,
      boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${blobA(0.15)}`,
      fontFamily: "var(--font-ui)",
    }}>
      <div style={{ fontSize: 10, color: blobSolid, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
        {blob.kind}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: blobA(0.85), display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, boxShadow: `0 0 14px ${blobA(0.6)}`,
          }}>{blob.stamp}</div>
          <div style={{ fontSize: 15, color: "var(--text-primary)", fontWeight: 600 }}>{blob.label}</div>
        </div>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: 14, padding: 0 }}>✕</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 11 }}>
        <Row label="Severity"><SeverityBar value={blob.severity} color={blobSolid}/></Row>
        <Row label="Radius"><span style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{Math.round(blob.r * 1.5)}km</span></Row>
        <Row label="Spreading">
          <span style={{ color: blob.spreading ? "#2DFF78" : "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            {blob.spreading ? "YES · +2%/hr" : "STATIC"}
          </span>
        </Row>
      </div>
      {blob.characters?.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #1A1A2E" }}>
          <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 8 }}>
            Affected
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {blob.characters.map(name => (
              <span key={name} style={{
                fontSize: 11, padding: "2px 10px", borderRadius: 999,
                background: blobA(0.08), color: blobSolid, border: `1px solid ${blobA(0.4)}`,
              }}>{name}</span>
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
      gap: 0, paddingLeft: leftOpen ? 290 : 22, paddingRight: 22,
      transition: "padding-left 200ms ease",
      overflowX: "auto", zIndex: 20,
    }}>
      {chars.map(c => {
        const isActive = c.id === activeChar;
        const stateColor = c.state.includes("82") || c.state.includes("68") ? "#CC2200" :
                           c.state === "Calculating" ? "#C9A84C" :
                           c.state === "Centered" ? "#2DFF78" :
                           c.status === "deceased" ? "var(--text-dim)" : "var(--text-secondary)";
        return (
          <button key={c.id} onClick={() => onSelect(c.id)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
            background: isActive ? "rgba(0,212,170,0.06)" : "transparent",
            border: `1px solid ${isActive ? "rgba(0,212,170,0.35)" : "transparent"}`,
            borderRadius: 10, cursor: "pointer", marginRight: 10, flexShrink: 0,
            transition: "all 160ms ease",
          }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: "50%", overflow: "hidden",
              border: `1.5px solid ${isActive ? "var(--krypton)" : "var(--iron)"}`,
              filter: c.status === "deceased" ? "grayscale(1) brightness(0.6)" : "none", flexShrink: 0,
            }}>
              <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {cityMap[c.id] || "Unknown"}
              </span>
            </div>
            <div style={{
              marginLeft: 8, padding: "3px 8px", borderRadius: 6,
              background: `${stateColor}22`, border: `1px solid ${stateColor}55`,
              fontFamily: "var(--font-mono)", fontSize: 10, color: stateColor, letterSpacing: "0.05em",
            }}>{c.state}</div>
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
  const [zoom, setZoom]                     = React.useState(0.45);
  const [pan, setPan]                       = React.useState({ x: -320, y: -420 });
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

  const mapOuterRef = React.useRef(null);
  const panRef      = React.useRef({ active: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0 });
  // Sync ref so wheel handler doesn't go stale
  const stateRef    = React.useRef({ zoom: 0.45, pan: { x: -320, y: -420 } });
  React.useEffect(() => { stateRef.current.zoom = zoom; }, [zoom]);
  React.useEffect(() => { stateRef.current.pan  = pan;  }, [pan]);

  // Wheel zoom — zooms toward cursor position
  React.useEffect(() => {
    const el = mapOuterRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const { zoom: z1, pan: p } = stateRef.current;
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const z2 = Math.min(2.0, Math.max(0.5, +(z1 + delta).toFixed(2)));
      if (z2 === z1) return;
      const originX = rect.width  * 0.5;
      const originY = rect.height * 0.45;
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const worldX = (cx - originX - p.x) / z1;
      const worldY = (cy - originY - p.y) / z1;
      const newPan = {
        x: cx - originX - worldX * z2,
        y: cy - originY - worldY * z2,
      };
      stateRef.current = { zoom: z2, pan: newPan };
      setZoom(z2);
      setPan(newPan);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Zoom from viewport center (buttons)
  const applyZoom = React.useCallback((delta) => {
    if (!mapOuterRef.current) return;
    const rect = mapOuterRef.current.getBoundingClientRect();
    const { zoom: z1, pan: p } = stateRef.current;
    const z2 = Math.min(2.0, Math.max(0.5, +(z1 + delta).toFixed(2)));
    if (z2 === z1) return;
    const originX = rect.width  * 0.5;
    const originY = rect.height * 0.45;
    const cx = rect.width  * 0.5;
    const cy = rect.height * 0.5;
    const worldX = (cx - originX - p.x) / z1;
    const worldY = (cy - originY - p.y) / z1;
    const newPan = { x: cx - originX - worldX * z2, y: cy - originY - worldY * z2 };
    stateRef.current = { zoom: z2, pan: newPan };
    setZoom(z2);
    setPan(newPan);
  }, []);

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
      const newPan = {
        x: panRef.current.startPanX + (e.clientX - panRef.current.startX),
        y: panRef.current.startPanY + (e.clientY - panRef.current.startY),
      };
      setPan(newPan);
      stateRef.current.pan = newPan;
    }
    if (selectedStamp && mapOuterRef.current) {
      const rect = mapOuterRef.current.getBoundingClientRect();
      setCursorPos({
        x: ((e.clientX - rect.left) / rect.width)  * 100,
        y: ((e.clientY - rect.top)  / rect.height) * 100,
      });
    }
  };

  const handlePanEnd = () => { panRef.current.active = false; setIsPanning(false); };

  const handleMapClick = (e) => {
    if (!selectedStamp || !mapOuterRef.current) return;
    const rect = mapOuterRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    const newBlob = {
      id: `u${Date.now()}`, kind: selectedStamp.id,
      label: selectedStamp.label, x, y,
      r: selectedStamp.radius || 120,
      color: selectedStamp.categoryRgb, intensity: 0.55,
      stamp: selectedStamp.icon, severity: 7,
      spreading: !!selectedStamp.spreading, characters: [],
    };
    setBlobs(b => [...b, newBlob]);
    setSelectedBlob(newBlob);
    setSelectedStamp(null);
    setCursorPos(null);
  };

  const handleTileDrop = React.useCallback((tile) => {
    if (draggingCharId) {
      setCharacterPositions(prev => ({ ...prev, [draggingCharId]: tile }));
      setDraggingCharId(null);
    } else if (draggingPiece) {
      setPlacedPieces(prev => [...prev, { ...draggingPiece, col: tile.col, row: tile.row, instanceId: Date.now() }]);
      setDraggingPiece(null);
    }
    setHighlightedTile(null);
  }, [draggingCharId, draggingPiece]);

  const removeBlob = (id) => { setBlobs(b => b.filter(x => x.id !== id)); setSelectedBlob(null); };

  const PANEL_W = 272;

  return (
    <div style={{ flex: 1, height: "100vh", position: "relative", overflow: "hidden", background: "#04040A", fontFamily: "var(--font-ui)" }}>
      <style>{animCSS}</style>

      {/* PAN/ZOOM OUTER */}
      <div
        ref={mapOuterRef}
        style={{
          position: "absolute", inset: 0, overflow: "hidden",
          cursor: selectedStamp ? "crosshair" : isPanning ? "grabbing" : "grab",
        }}
        onMouseDown={handlePanStart}
        onMouseMove={handleMouseMove}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
        onClick={handleMapClick}
        onDragEnd={() => { setDraggingCharId(null); setDraggingPiece(null); setHighlightedTile(null); }}
      >
        {/* PAN/ZOOM TRANSFORM */}
        <div style={{
          position: "absolute", left: "50%", top: "45%",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}>
          {/* ISOMETRIC ROTATION */}
          <div style={{
            transform: "rotateX(52deg) rotateZ(-45deg)",
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}>
            {/* FLAT TILE PLANE */}
            <div style={{
              position: "relative",
              width: GRID_SIZE * TILE_W,
              height: GRID_SIZE * TILE_H,
              transformStyle: "preserve-3d",
            }}>
              {/* TILES */}
              {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
                const r = Math.floor(i / GRID_SIZE);
                const c = i % GRID_SIZE;
                const terrain = getTerrain(c, r);
                const t = TERRAIN_COLORS[terrain];
                const isHl = highlightedTile?.col === c && highlightedTile?.row === r;
                return (
                  <div
                    key={`t-${c}-${r}`}
                    style={{
                      position: "absolute", left: c * TILE_W, top: r * TILE_H,
                      width: TILE_W, height: TILE_H,
                      background: isHl ? t.hl : t.fill,
                      border: `1px solid ${isHl ? t.hlBorder : t.border}`,
                      boxSizing: "border-box",
                      boxShadow: isHl ? `inset 0 0 12px rgba(0,229,255,0.15)` : "none",
                      transition: "background 0.08s ease, border-color 0.08s ease, box-shadow 0.08s ease",
                    }}
                    onMouseEnter={() => { if (!selectedStamp) setHighlightedTile({ col: c, row: r }); }}
                    onMouseLeave={() => setHighlightedTile(null)}
                    onDragOver={(e) => { e.preventDefault(); setHighlightedTile({ col: c, row: r }); }}
                    onDrop={(e) => { e.preventDefault(); handleTileDrop({ col: c, row: r }); }}
                  />
                );
              })}

              {/* PLACED PIECES */}
              {placedPieces.map(piece => (
                <PlacedPiece key={piece.instanceId} piece={piece} col={piece.col} row={piece.row} />
              ))}

              {/* CHARACTER ICONS */}
              {CHARACTERS_MAP.map(c => {
                const pos = characterPositions[c.id] || { col: c.col, row: c.row };
                return (
                  <FloatingCharacterIcon
                    key={c.id} char={c}
                    col={pos.col} row={pos.row}
                    isActive={c.id === activeChar}
                    onSelect={() => setActiveChar(c.id)}
                    onDragStart={() => setDraggingCharId(c.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* SCREEN-SPACE OVERLAYS */}
        {activeLayers.map(layer => <LayerMapOverlay key={layer.id} layer={layer} />)}
        {mapMode === "pressure" && (
          <PressureBlobsLayer
            blobs={blobs} selectedId={selectedBlob?.id}
            onSelect={(b) => { setSelectedBlob(b); setSelectedStamp(null); }}
          />
        )}
        <PressureIconsSVG blobs={mapMode === "pressure" ? blobs : []} cursorPos={cursorPos} previewStamp={selectedStamp} />

        {/* Vignette */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10,
          background: "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 35%, rgba(0,0,0,0.72) 100%)",
        }}/>
        {/* Film grain */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 11, opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}/>
      </div>

      {/* LEFT PANEL */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0,
        width: PANEL_W,
        background: "rgba(8,8,16,0.94)", backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)", borderRight: "1px solid var(--iron)",
        zIndex: 40, display: "flex", flexDirection: "column", overflow: "hidden",
        transform: leftOpen ? "translateX(0)" : `translateX(-${PANEL_W}px)`,
        transition: "transform 200ms ease",
      }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--iron)", flexShrink: 0 }}>
          {[{ id: "events", label: "EVENTS" }, { id: "elements", label: "ELEMENTS" }].map(tab => (
            <button key={tab.id} onClick={() => setLeftTab(tab.id)} style={{
              flex: 1, padding: "13px 4px",
              background: "transparent", border: "none",
              borderBottom: `2px solid ${leftTab === tab.id ? "var(--krypton)" : "transparent"}`,
              color: leftTab === tab.id ? "var(--krypton)" : "var(--text-dim)",
              fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.15em",
              textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s ease",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab body */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {leftTab === "events" ? (
            <>
              {STAMP_CATEGORIES.map(cat => (
                <StampSection key={cat.id} cat={cat} expanded={true}
                  selectedId={selectedStamp?.id} onSelect={setSelectedStamp}/>
              ))}
              <div style={{ padding: "10px 14px 4px" }}>
                <button style={{
                  width: "100%", padding: "10px 12px", background: "transparent",
                  border: "1px dashed var(--iron)", borderRadius: 8,
                  color: "var(--text-secondary)", fontSize: 11, fontFamily: "var(--font-ui)",
                  letterSpacing: "0.04em", cursor: "pointer", transition: "all 160ms ease",
                }}
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

      {/* PANEL COLLAPSE CHEVRON — always accessible */}
      <button
        onClick={() => setLeftOpen(o => !o)}
        style={{
          position: "absolute", top: "50%",
          left: leftOpen ? PANEL_W - 1 : 0,
          transform: "translateY(-50%)",
          transition: "left 200ms ease",
          zIndex: 45, width: 20, height: 48,
          background: "rgba(8,8,16,0.94)",
          border: "1px solid var(--iron)", borderLeft: leftOpen ? "none" : "1px solid var(--iron)",
          borderRadius: leftOpen ? "0 8px 8px 0" : "0 8px 8px 0",
          color: "var(--text-secondary)", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, lineHeight: 1,
        }}
      >
        {leftOpen ? "‹" : "›"}
      </button>

      {/* LAYER PANEL */}
      <LayerPanel
        layers={layers} onToggle={handleLayerToggle}
        mapMode={mapMode} onModeChange={setMapMode}
        open={layerPanelOpen} onToggleOpen={() => setLayerPanelOpen(o => !o)}
      />

      {/* ZOOM CONTROLS */}
      <ZoomControls
        zoom={zoom}
        onZoomIn={() => applyZoom(+0.1)}
        onZoomOut={() => applyZoom(-0.1)}
        onReset={() => {
          const z2 = 0.45, newPan = { x: -320, y: -420 };
          stateRef.current = { zoom: z2, pan: newPan };
          setZoom(z2); setPan(newPan);
        }}
      />

      {/* COMPASS */}
      <div style={{
        position: "absolute", top: 18, right: 288, width: 44, height: 44,
        background: "rgba(15,15,26,0.85)", backdropFilter: "blur(8px)",
        border: "1px solid var(--iron)", borderRadius: "50%", zIndex: 25,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ position: "relative", width: 26, height: 26 }}>
          <div style={{ position: "absolute", left: "50%", top: 2, transform: "translateX(-50%)", color: "var(--krypton)", fontSize: 9, fontWeight: 600 }}>N</div>
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 1, height: 12, background: "linear-gradient(to bottom, var(--krypton), transparent)", transform: "translateX(-50%) translateY(-100%)" }}/>
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 1, height: 8, background: "var(--text-dim)", transform: "translateX(-50%)" }}/>
        </div>
      </div>

      {/* STAMP DETAIL */}
      {selectedBlob && (
        <StampDetailCard blob={selectedBlob} onClose={() => setSelectedBlob(null)} onRemove={() => removeBlob(selectedBlob.id)} />
      )}

      {/* PRESENCE STRIP */}
      <PresenceStrip chars={CHARACTERS_MAP} activeChar={activeChar} onSelect={setActiveChar} leftOpen={leftOpen} />

      {/* STAMP PLACEMENT LABEL */}
      {selectedStamp && (
        <div style={{
          position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)",
          zIndex: 50, background: "rgba(15,15,26,0.92)", backdropFilter: "blur(8px)",
          border: `1px solid ${selectedStamp.categoryColor}`,
          borderRadius: 10, padding: "8px 14px",
          fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-primary)",
          display: "inline-flex", alignItems: "center", gap: 8,
          boxShadow: `0 0 24px ${selectedStamp.categoryColor}40`,
        }}>
          <span style={{ fontSize: 14 }}>{selectedStamp.icon}</span>
          <span>Placing: <strong>{selectedStamp.label}</strong></span>
          <span style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: 10 }}>· Click on map · ESC to cancel</span>
        </div>
      )}
    </div>
  );
};

window.WorldMap = WorldMap;
