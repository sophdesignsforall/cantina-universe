// WORLD PRESSURE MAP — Cantina Simulated Universes
// Living heatmap world engine. Director places stamps; characters react.

const wpmStyles = {
  root: {
    flex: 1,
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "#04040A",
    fontFamily: "var(--font-ui)",
  },
  // ── Left stamp tool panel ──
  leftPanel: (expanded) => ({
    position: "absolute",
    top: 0, bottom: 0, left: 0,
    width: expanded ? 272 : 64,
    background: "rgba(8,8,16,0.92)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRight: "1px solid var(--iron)",
    zIndex: 40,
    transition: "width 220ms cubic-bezier(0.4,0,0.2,1)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }),
  leftHeader: {
    padding: "16px 18px 12px",
    borderBottom: "1px solid var(--iron)",
    flexShrink: 0,
  },
  leftBody: {
    overflowY: "auto",
    overflowX: "hidden",
    flex: 1,
    padding: "8px 0 12px",
  },
  // ── Map canvas ──
  mapWrap: {
    position: "absolute",
    inset: 0,
    perspective: "1400px",
    perspectiveOrigin: "50% 30%",
  },
  mapTilted: {
    position: "absolute",
    inset: "-12% -8% -8% -8%",
    transformOrigin: "50% 100%",
    transformStyle: "preserve-3d",
    background: "#04040A",
  },
  // ── Top-right layer panel ──
  layerPanel: (open) => ({
    position: "absolute",
    top: 18,
    right: 18,
    width: open ? 260 : 56,
    background: "rgba(15,15,26,0.88)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid var(--iron)",
    borderRadius: 12,
    overflow: "hidden",
    zIndex: 30,
    transition: "width 220ms cubic-bezier(0.4,0,0.2,1)",
    fontFamily: "var(--font-ui)",
  }),
  // ── Bottom presence strip ──
  presence: {
    position: "absolute",
    left: 64, right: 0, bottom: 0,
    height: 86,
    background: "linear-gradient(to top, rgba(4,4,10,0.96), rgba(4,4,10,0.5))",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    borderTop: "1px solid var(--iron)",
    display: "flex",
    alignItems: "center",
    gap: 0,
    padding: "0 22px",
    overflowX: "auto",
    zIndex: 20,
  },
  // ── Map control stack ──
  controls: {
    position: "absolute",
    right: 18,
    bottom: 110,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    zIndex: 25,
  },
  controlBtn: (active) => ({
    width: 40, height: 40,
    background: active ? "rgba(0,212,170,0.12)" : "rgba(15,15,26,0.9)",
    backdropFilter: "blur(8px)",
    border: `1px solid ${active ? "var(--krypton)" : "var(--iron)"}`,
    borderRadius: 10,
    color: active ? "var(--krypton)" : "var(--text-secondary)",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    transition: "all 160ms ease",
    fontFamily: "var(--font-mono)",
  }),
  buildBtn: {
    position: "absolute",
    top: 18,
    right: 296,
    height: 38,
    padding: "0 18px",
    background: "transparent",
    border: "1px solid var(--krypton)",
    borderRadius: 10,
    color: "var(--krypton)",
    fontFamily: "var(--font-ui)",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    zIndex: 30,
    transition: "all 160ms ease",
  },
  compass: {
    position: "absolute",
    top: 74,
    right: 296,
    width: 44, height: 44,
    background: "rgba(15,15,26,0.85)",
    backdropFilter: "blur(8px)",
    border: "1px solid var(--iron)",
    borderRadius: "50%",
    zIndex: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    color: "var(--text-dim)",
    letterSpacing: "0.1em",
  },
};

// ── DATA ─────────────────────────────────────────────────────────
const STAMP_CATEGORIES = [
  {
    id: "env", label: "Environmental", color: "#2DFF78", colorRgb: "45,255,120",
    stamps: [
      { id: "hurricane",  icon: "🌀", label: "Hurricane / Storm", radius: 140 },
      { id: "flood",      icon: "🌊", label: "Flood / Tsunami",   radius: 110 },
      { id: "wildfire",   icon: "🔥", label: "Wildfire",          radius: 90  },
      { id: "cold",       icon: "❄️", label: "Extreme Cold",      radius: 130, color: "#A0E8FF" },
      { id: "volcano",    icon: "🌋", label: "Volcanic Eruption", radius: 100 },
      { id: "radiation",  icon: "☢️", label: "Radiation",         radius: 120 },
    ],
  },
  {
    id: "conflict", label: "Conflict", color: "#CC2200", colorRgb: "204,34,0",
    stamps: [
      { id: "military",   icon: "💥", label: "Military Conflict", radius: 150 },
      { id: "meta",       icon: "🦸", label: "Metahuman Event",   radius: 120 },
      { id: "bombing",    icon: "💣", label: "Bombing / Attack",  radius: 70  },
      { id: "surveil",    icon: "👁️", label: "Surveillance",      radius: 180 },
    ],
  },
  {
    id: "bio", label: "Biological", color: "#2DFF78", colorRgb: "45,255,120",
    stamps: [
      { id: "pandemic",   icon: "🦠", label: "Pandemic", radius: 220, spreading: true },
      { id: "bioweapon",  icon: "☣️", label: "Bio Weapon", radius: 90 },
      { id: "drug",       icon: "💊", label: "Drug Crisis", radius: 130 },
      { id: "healthcare", icon: "🏥", label: "Healthcare Collapse", radius: 160 },
    ],
  },
  {
    id: "econ", label: "Socioeconomic", color: "#C9A84C", colorRgb: "201,168,76",
    stamps: [
      { id: "boom",       icon: "📈", label: "Economic Boom", radius: 180 },
      { id: "collapse",   icon: "📉", label: "Economic Collapse", radius: 200 },
      { id: "industrial", icon: "🏭", label: "Industrial Zone", radius: 130 },
      { id: "poverty",    icon: "🏚️", label: "Poverty / Inequality", radius: 150 },
      { id: "wealth",     icon: "💎", label: "Wealth Concentration", radius: 60 },
    ],
  },
  {
    id: "polit", label: "Political", color: "#C9A84C", colorRgb: "201,168,76",
    stamps: [
      { id: "instability", icon: "🗳️", label: "Political Instability", radius: 170 },
      { id: "media",       icon: "📢", label: "Media Narrative", radius: 240 },
      { id: "unrest",      icon: "✊", label: "Civil Unrest", radius: 110 },
      { id: "authority",   icon: "🔒", label: "Authoritarian Control", radius: 200 },
    ],
  },
];

// Placed pressure blobs (x,y are % of map canvas; tilt applied via wrapper)
const INITIAL_BLOBS = [
  { id: "b1", kind: "trauma", label: "World Engine Event", x: 38, y: 44, r: 220, color: "0,212,170", intensity: 0.7, stamp: "🌀", severity: 9, characters: ["Kal-El", "Lois"] },
  { id: "b2", kind: "power",  label: "LexCorp Influence", x: 41, y: 50, r: 150, color: "201,168,76",  intensity: 0.55, stamp: "💎", severity: 7, characters: ["Lex"] },
  { id: "b3", kind: "conflict", label: "Gotham Active Conflict", x: 50, y: 56, r: 170, color: "204,34,0", intensity: 0.65, stamp: "💥", severity: 8, characters: ["Bruce"] },
  { id: "b4", kind: "bio", label: "Outbreak Vector", x: 64, y: 38, r: 200, color: "45,255,120", intensity: 0.5, stamp: "🦠", severity: 6, spreading: true, characters: ["Lois"] },
  { id: "b5", kind: "power", label: "Smallville Rural", x: 28, y: 62, r: 100, color: "201,168,76", intensity: 0.3, stamp: "🌾", severity: 3, characters: ["Jonathan"] },
  { id: "b6", kind: "cosmic", label: "Kryptonite Deposit", x: 78, y: 58, r: 80, color: "123,47,255", intensity: 0.55, stamp: "💜", severity: 7, characters: [] },
];

const CHARACTERS_MAP = [
  { id: "kal",   name: "Kal-El",   x: 39, y: 45, color: "0,212,170",   img: "assets/char-superman-cavill.webp", trail: "krypton",  status: "active", state: "Guilt 82%" },
  { id: "bruce", name: "Bruce",    x: 50, y: 56, color: "107,107,138", img: "assets/batman.webp",     trail: "iron",     status: "observing", state: "Calculating" },
  { id: "diana", name: "Diana",    x: 60, y: 30, color: "201,168,76",  img: "assets/char-saint.jpg",  trail: "gold",     status: "active", state: "Centered" },
  { id: "lois",  name: "Lois",     x: 41, y: 47, color: "240,208,128", img: "assets/lois.jpg",        trail: "warm",     status: "active", state: "Fear 68%" },
  { id: "zod",   name: "Zod",      x: 85, y: 25, color: "204,34,0",    img: "assets/char-batman2.webp", trail: "blood",  status: "inactive", state: "—" },
  { id: "jon",   name: "Jonathan", x: 28, y: 62, color: "212,136,76",  img: "assets/char-robin.jpeg", trail: "amber",    status: "deceased", state: "Deceased" },
];

const LAYERS = [
  { id: "social",   label: "Social Cohesion",    color: "#00D4AA", default: true,  opacity: 80 },
  { id: "econ",     label: "Economic Pressure",  color: "#C9A84C", default: true,  opacity: 60 },
  { id: "bio",      label: "Biological Baseline",color: "#2DFF78", default: true,  opacity: 50 },
  { id: "polit",    label: "Political Control",  color: "#D4884C", default: false, opacity: 40 },
  { id: "trauma",   label: "Trauma Memory",      color: "#00D4AA", default: true,  opacity: 30 },
  { id: "sens",     label: "Sensitivity Map",    color: "#F0F0FF", default: false, opacity: 50 },
];

// Trails: pre-computed SVG paths for each character (in % coordinates)
const TRAILS = {
  kal:   "M 12,80 C 22,72 28,60 34,52 L 39,45",
  bruce: "M 62,82 C 58,74 54,66 52,60 L 50,56",
  diana: "M 90,18 Q 76,16 68,22 L 60,30",
  lois:  "M 32,72 Q 36,60 38,52 L 41,47",
};

// ── HELPERS ──────────────────────────────────────────────────────
const PressureBlob = ({ blob, selected, onClick }) => {
  return (
    <g
      style={{ cursor: "pointer", transformOrigin: `${blob.x}% ${blob.y}%` }}
      className={`wpm-blob wpm-blob-${blob.kind}`}
      onClick={(e) => { e.stopPropagation(); onClick(blob); }}
    >
      <defs>
        <radialGradient id={`grad-${blob.id}`} cx="50%" cy="50%">
          <stop offset="0%"  stopColor={`rgba(${blob.color},${blob.intensity})`}/>
          <stop offset="50%" stopColor={`rgba(${blob.color},${blob.intensity * 0.45})`}/>
          <stop offset="100%" stopColor={`rgba(${blob.color},0)`}/>
        </radialGradient>
      </defs>
      <circle cx={`${blob.x}%`} cy={`${blob.y}%`} r={blob.r}
              fill={`url(#grad-${blob.id})`}
              style={{ mixBlendMode: "screen" }}/>
      {selected && (
        <circle cx={`${blob.x}%`} cy={`${blob.y}%`} r={blob.r * 0.9}
                fill="none" stroke={`rgb(${blob.color})`} strokeWidth="1.5"
                strokeDasharray="3 4" opacity="0.7"/>
      )}
    </g>
  );
};

const StampSection = ({ cat, selectedId, onSelect, expanded }) => {
  const [open, setOpen] = React.useState(true);
  if (!expanded) {
    // collapsed sidebar: render only category color tab
    return (
      <div style={{ padding: "12px 0", display: "flex", justifyContent: "center" }}>
        <div title={cat.label} style={{
          width: 28, height: 4, borderRadius: 2, background: cat.color, opacity: 0.85,
        }}/>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 4 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "10px 18px", background: "transparent",
          border: "none", cursor: "pointer", color: "var(--text-secondary)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: cat.color }}/>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em",
            textTransform: "uppercase", color: cat.color, opacity: 0.95,
          }}>{cat.label}</span>
        </span>
        <span style={{ color: "var(--text-dim)", fontSize: 10 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div style={{ padding: "2px 10px 10px" }}>
          {cat.stamps.map(s => {
            const isSel = selectedId === s.id;
            return (
              <button
                key={s.id}
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

const LayerRow = ({ layer, active, opacity, onToggle, onOpacity, expanded }) => {
  if (!expanded) {
    return (
      <div style={{ padding: "10px 0", display: "flex", justifyContent: "center" }}>
        <div title={layer.label} style={{
          width: 8, height: 8, borderRadius: "50%",
          background: active ? layer.color : "transparent",
          border: `1px solid ${layer.color}`,
          boxShadow: active ? `0 0 8px ${layer.color}` : "none",
        }}/>
      </div>
    );
  }
  return (
    <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <button
          onClick={onToggle}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "transparent", border: "none", cursor: "pointer",
            color: active ? "var(--text-primary)" : "var(--text-dim)",
            padding: 0, flex: 1,
          }}
        >
          <span style={{
            width: 10, height: 10, borderRadius: "50%",
            background: active ? layer.color : "transparent",
            border: `1px solid ${layer.color}`,
            boxShadow: active ? `0 0 8px ${layer.color}` : "none",
            transition: "all 160ms",
          }}/>
          <span style={{ fontSize: 11, fontFamily: "var(--font-ui)", letterSpacing: "0.02em", textTransform: "uppercase" }}>{layer.label}</span>
        </button>
      </div>
      {active && (
        <div style={{ marginTop: 6, paddingLeft: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="range" min="0" max="100" value={opacity}
            onChange={e => onOpacity(Number(e.target.value))}
            style={{ flex: 1, accentColor: layer.color, height: 4 }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)", width: 24, textAlign: "right" }}>{opacity}%</span>
        </div>
      )}
    </div>
  );
};

// ── MAIN SCREEN ──────────────────────────────────────────────────
const WorldMap = () => {
  const [leftExpanded, setLeftExpanded] = React.useState(true);
  const [layerOpen, setLayerOpen] = React.useState(true);
  const [tilt, setTilt] = React.useState(45);
  const [zoom, setZoom] = React.useState(1);
  const [showTrails, setShowTrails] = React.useState(true);

  const [selectedStamp, setSelectedStamp] = React.useState(null);
  const [blobs, setBlobs] = React.useState(INITIAL_BLOBS);
  const [selectedBlob, setSelectedBlob] = React.useState(blobs[3]); // pandemic shown expanded
  const [activeChar, setActiveChar] = React.useState("kal");

  const [layers, setLayers] = React.useState(() => {
    const s = {};
    LAYERS.forEach(l => { s[l.id] = { active: l.default, opacity: l.opacity }; });
    return s;
  });

  const [cursorPos, setCursorPos] = React.useState(null); // {x%, y%} for preview
  const mapRef = React.useRef(null);

  const handleMapMouseMove = (e) => {
    if (!selectedStamp || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursorPos({ x, y });
  };

  const handleMapClick = (e) => {
    if (!selectedStamp || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const id = `u${Date.now()}`;
    const newBlob = {
      id, kind: selectedStamp.id,
      label: selectedStamp.label,
      x, y,
      r: selectedStamp.radius || 120,
      color: selectedStamp.categoryRgb,
      intensity: 0.55,
      stamp: selectedStamp.icon,
      severity: 7,
      spreading: !!selectedStamp.spreading,
      characters: [],
      isNew: true,
    };
    setBlobs(b => [...b, newBlob]);
    setSelectedBlob(newBlob);
    setSelectedStamp(null);
    setCursorPos(null);
  };

  const removeBlob = (id) => {
    setBlobs(b => b.filter(x => x.id !== id));
    setSelectedBlob(null);
  };

  // ── Render ──
  return (
    <div style={wpmStyles.root}>
      {/* MAP CANVAS (tilted) */}
      <div style={wpmStyles.mapWrap}>
        <div
          ref={mapRef}
          style={{
            ...wpmStyles.mapTilted,
            transform: `rotateX(${tilt}deg) scale(${zoom})`,
            cursor: selectedStamp ? "crosshair" : "grab",
          }}
          onMouseMove={handleMapMouseMove}
          onMouseLeave={() => setCursorPos(null)}
          onClick={handleMapClick}
        >
          <MapBase/>
          <PressureSVG
            blobs={blobs}
            selectedId={selectedBlob?.id}
            onSelectBlob={(b) => { setSelectedBlob(b); setSelectedStamp(null); }}
            cursorPos={cursorPos}
            previewStamp={selectedStamp}
          />
          {layers.trauma?.active && <TraumaMemoryStain opacity={layers.trauma.opacity}/>}
          <CityLabels/>
          {showTrails && <TrailsLayer activeChar={activeChar}/>}
          <CharactersLayer
            chars={CHARACTERS_MAP}
            activeChar={activeChar}
            onSelect={setActiveChar}
            previewArea={selectedStamp && cursorPos ? { ...cursorPos, r: selectedStamp.radius || 120 } : null}
          />
          {/* vignette */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}/>
        </div>
      </div>

      {/* LEFT STAMP PANEL */}
      <div
        style={wpmStyles.leftPanel(leftExpanded)}
        onMouseEnter={() => setLeftExpanded(true)}
        onMouseLeave={() => setLeftExpanded(false)}
      >
        {leftExpanded && (
          <div style={wpmStyles.leftHeader}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--krypton)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 6 }}>
              World Events
            </div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5 }}>
              Stamp events onto the world. Characters will react.
            </div>
          </div>
        )}
        <div style={wpmStyles.leftBody}>
          {STAMP_CATEGORIES.map(cat => (
            <StampSection
              key={cat.id}
              cat={cat}
              expanded={leftExpanded}
              selectedId={selectedStamp?.id}
              onSelect={setSelectedStamp}
            />
          ))}
          {leftExpanded && (
            <div style={{ padding: "10px 14px 4px" }}>
              <button style={{
                width: "100%", padding: "10px 12px",
                background: "transparent",
                border: "1px dashed var(--iron)",
                borderRadius: 8,
                color: "var(--text-secondary)",
                fontSize: 11, fontFamily: "var(--font-ui)",
                letterSpacing: "0.04em", cursor: "pointer",
                transition: "all 160ms ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--krypton)"; e.currentTarget.style.color = "var(--krypton)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--iron)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >+ Make your own event</button>
            </div>
          )}
        </div>
      </div>

      {/* TOP RIGHT — BUILD WORLD + COMPASS */}
      <button style={wpmStyles.buildBtn}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,212,170,0.08)"; e.currentTarget.style.boxShadow = "0 0 24px var(--krypton-glow)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
      >
        ⬡ Build world
      </button>
      <div style={wpmStyles.compass}>
        <div style={{ position: "relative", width: 26, height: 26 }}>
          <div style={{ position: "absolute", left: "50%", top: 2, transform: "translateX(-50%)", color: "var(--krypton)", fontSize: 9, fontWeight: 600 }}>N</div>
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 1, height: 12, background: "linear-gradient(to bottom, var(--krypton), transparent)", transform: "translateX(-50%) translateY(-100%)" }}/>
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 1, height: 8, background: "var(--text-dim)", transform: "translateX(-50%)" }}/>
        </div>
      </div>

      {/* TOP RIGHT — LAYER PANEL */}
      <div style={wpmStyles.layerPanel(layerOpen)}>
        <div style={{
          padding: "12px 14px",
          borderBottom: "1px solid var(--iron)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--krypton)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            {layerOpen ? "Map Layers" : ""}
          </span>
          <button onClick={() => setLayerOpen(o => !o)} style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: 11,
          }}>{layerOpen ? "−" : "≡"}</button>
        </div>
        <div>
          {LAYERS.map(l => (
            <LayerRow
              key={l.id}
              layer={l}
              expanded={layerOpen}
              active={layers[l.id].active}
              opacity={layers[l.id].opacity}
              onToggle={() => setLayers(s => ({ ...s, [l.id]: { ...s[l.id], active: !s[l.id].active } }))}
              onOpacity={(v) => setLayers(s => ({ ...s, [l.id]: { ...s[l.id], opacity: v } }))}
            />
          ))}
        </div>
      </div>

      {/* MAP CONTROLS — bottom right vertical stack */}
      <div style={wpmStyles.controls}>
        <button style={wpmStyles.controlBtn(false)} onClick={() => setZoom(z => Math.min(2, z + 0.15))} title="Zoom in">+</button>
        <button style={wpmStyles.controlBtn(false)} onClick={() => setZoom(z => Math.max(0.6, z - 0.15))} title="Zoom out">−</button>
        <button style={wpmStyles.controlBtn(tilt === 60)} onClick={() => setTilt(60)} title="Dramatic tilt">↗</button>
        <button style={wpmStyles.controlBtn(tilt === 0)} onClick={() => setTilt(0)} title="Flatten">⤢</button>
        <button style={wpmStyles.controlBtn(false)} onClick={() => { setTilt(45); setZoom(1); }} title="Reset">◎</button>
        <button style={wpmStyles.controlBtn(showTrails)} onClick={() => setShowTrails(s => !s)} title="Toggle trails">↝</button>
      </div>

      {/* PLACED STAMP DETAIL PANEL */}
      {selectedBlob && (
        <StampDetailCard blob={selectedBlob} onClose={() => setSelectedBlob(null)} onRemove={() => removeBlob(selectedBlob.id)}/>
      )}

      {/* CHARACTER PRESENCE STRIP */}
      <PresenceStrip chars={CHARACTERS_MAP} activeChar={activeChar} onSelect={setActiveChar}/>

      {/* STAMP CURSOR PREVIEW LABEL (free-floating) */}
      {selectedStamp && (
        <div style={{
          position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)",
          zIndex: 50,
          background: "rgba(15,15,26,0.92)", backdropFilter: "blur(8px)",
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

// ── MAP BASE ───────────────────────────────────────────────────────
const MapBase = () => (
  <React.Fragment>
    {/* Land masses — abstract dark shapes */}
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none",
    }}>
      <defs>
        <pattern id="streetGrid" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
          <path d="M 3 0 L 0 0 0 3" fill="none" stroke="rgba(26,26,48,0.4)" strokeWidth="0.06"/>
        </pattern>
        <filter id="landBlur"><feGaussianBlur stdDeviation="0.3"/></filter>
      </defs>
      {/* Continents — soft polygons */}
      <g fill="#0C0C18" filter="url(#landBlur)">
        <path d="M 8,30 Q 18,22 30,28 Q 42,34 48,48 Q 54,62 48,72 Q 38,80 22,76 Q 10,68 8,52 Z"/>
        <path d="M 55,38 Q 70,32 84,40 Q 92,48 88,62 Q 78,70 66,68 Q 56,62 55,52 Z"/>
        <path d="M 22,82 Q 30,80 36,84 Q 38,90 32,92 Q 24,92 22,86 Z"/>
        <path d="M 70,18 Q 82,14 90,20 Q 92,28 84,30 Q 74,28 70,22 Z"/>
      </g>
      <g fill="url(#streetGrid)">
        <path d="M 8,30 Q 18,22 30,28 Q 42,34 48,48 Q 54,62 48,72 Q 38,80 22,76 Q 10,68 8,52 Z"/>
        <path d="M 55,38 Q 70,32 84,40 Q 92,48 88,62 Q 78,70 66,68 Q 56,62 55,52 Z"/>
      </g>
      {/* Topographic detail */}
      <g stroke="rgba(60,60,90,0.18)" strokeWidth="0.08" fill="none">
        <path d="M 15,40 Q 25,36 35,42"/>
        <path d="M 18,52 Q 30,50 38,56"/>
        <path d="M 60,46 Q 72,42 82,50"/>
        <path d="M 64,58 Q 74,56 82,60"/>
      </g>
    </svg>
  </React.Fragment>
);

const TraumaMemoryStain = ({ opacity }) => (
  <div style={{
    position: "absolute", left: "37%", top: "42%",
    width: 200, height: 200, borderRadius: "50%", pointerEvents: "none",
    background: "radial-gradient(circle, rgba(0,212,170,0.18) 0%, rgba(0,212,170,0) 70%)",
    opacity: opacity / 100, mixBlendMode: "screen",
  }}>
    <span style={{
      position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, 30px)",
      fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(0,212,170,0.65)",
      letterSpacing: "0.18em", textTransform: "uppercase", whiteSpace: "nowrap",
    }}>World Engine · Year 33</span>
  </div>
);

const CityLabels = () => {
  const labels = [
    { name: "Metropolis", x: 39, y: 42, active: true },
    { name: "Gotham",     x: 50, y: 55, active: false },
    { name: "Smallville", x: 28, y: 62, active: false },
    { name: "Themyscira", x: 60, y: 30, active: false },
    { name: "Star City",  x: 18, y: 38, active: false },
    { name: "Central",    x: 70, y: 50, active: false },
  ];
  return labels.map(l => (
    <div key={l.name} style={{
      position: "absolute", left: `${l.x}%`, top: `${l.y}%`,
      transform: "translate(8px, -50%)",
      fontFamily: "var(--font-ui)", fontSize: l.active ? 12 : 11,
      color: l.active ? "#F0F0FF" : "#6B6B8A",
      pointerEvents: "none", whiteSpace: "nowrap", zIndex: 4,
      display: "inline-flex", alignItems: "center", gap: 6,
      textShadow: "0 1px 2px rgba(0,0,0,0.7)",
    }}>
      {l.active && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--krypton)", boxShadow: "0 0 6px var(--krypton-glow)" }}/>}
      {l.name}
    </div>
  ));
};

// ── PRESSURE BLOBS SVG ─────────────────────────────────────────────
const PressureSVG = ({ blobs, selectedId, onSelectBlob, cursorPos, previewStamp }) => (
  <svg style={{
    position: "absolute", inset: 0, width: "100%", height: "100%",
    pointerEvents: "all",
  }}>
    {blobs.map(b => (
      <PressureBlob key={b.id} blob={b}
        selected={selectedId === b.id}
        onClick={onSelectBlob}/>
    ))}
    {previewStamp && cursorPos && (
      <g style={{ pointerEvents: "none" }}>
        <defs>
          <radialGradient id="preview-grad" cx="50%" cy="50%">
            <stop offset="0%"  stopColor={`rgba(${previewStamp.categoryRgb},0.35)`}/>
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
    {/* stamp icon markers at blob centers */}
    {blobs.map(b => (
      <foreignObject key={`fo-${b.id}`} x={`calc(${b.x}% - 14px)`} y={`calc(${b.y}% - 14px)`} width="28" height="28"
        style={{ pointerEvents: "none" }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: `rgba(${b.color},0.85)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, boxShadow: `0 0 12px rgba(${b.color},0.6)`,
          border: "1.5px solid rgba(255,255,255,0.15)",
        }}>{b.stamp}</div>
      </foreignObject>
    ))}
  </svg>
);

// ── TRAILS ─────────────────────────────────────────────────────────
const TrailsLayer = ({ activeChar }) => {
  const colors = {
    kal: "0,212,170", bruce: "107,107,138", diana: "201,168,76",
    lois: "240,208,128",
  };
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none",
    }}>
      {Object.entries(TRAILS).map(([cid, path]) => {
        const isActive = cid === activeChar;
        const op = isActive ? 0.95 : 0.4;
        return (
          <g key={cid} style={{ opacity: op }}>
            <path d={path}
              fill="none"
              stroke={`rgba(${colors[cid]},${isActive ? 0.85 : 0.45})`}
              strokeWidth="0.45"
              strokeLinecap="round"
              filter={isActive ? `drop-shadow(0 0 1.5px rgba(${colors[cid]},0.8))` : "none"}
            />
            {/* trail end dot */}
            <circle r="0.55" fill={`rgb(${colors[cid]})`}>
              <animateMotion dur="6s" repeatCount="indefinite" path={path}/>
            </circle>
          </g>
        );
      })}
    </svg>
  );
};

// ── CHARACTER ICONS ────────────────────────────────────────────────
const CharactersLayer = ({ chars, activeChar, onSelect, previewArea }) => {
  return chars.map(c => {
    const isActive = c.id === activeChar;
    const ringColor = c.status === "active" ? "var(--krypton)" :
                      c.status === "observing" ? "var(--iron)" :
                      c.status === "deceased" ? "var(--text-dim)" : "var(--text-dim)";
    const statusDot = c.status === "active" ? "#2DFF78" :
                      c.status === "observing" ? "#C9A84C" :
                      c.status === "deceased" ? "#3A3A55" : "#CC2200";

    // in preview area?
    let inPreview = false;
    if (previewArea) {
      const dx = (c.x - previewArea.x);
      const dy = (c.y - previewArea.y);
      const dist = Math.sqrt(dx*dx + dy*dy);
      // rough: radius is in px on map; we approximate
      inPreview = dist < (previewArea.r / 8);
    }
    return (
      <button key={c.id}
        onClick={(e) => { e.stopPropagation(); onSelect(c.id); }}
        style={{
          position: "absolute", left: `${c.x}%`, top: `${c.y}%`,
          transform: "translate(-50%, -50%)",
          zIndex: isActive ? 10 : 6,
          background: "transparent", border: "none", padding: 0, cursor: "pointer",
        }}>
        <div style={{ position: "relative", width: 52, height: 52 }}>
          {/* active pulse ring */}
          {isActive && (
            <div style={{
              position: "absolute", inset: -6, borderRadius: "50%",
              border: "1.5px solid var(--krypton)",
              animation: "wpmRingPulse 2s ease-out infinite",
            }}/>
          )}
          {/* preview flash ring */}
          {inPreview && (
            <div style={{
              position: "absolute", inset: -4, borderRadius: "50%",
              border: `1.5px solid ${previewArea ? "var(--krypton)" : "transparent"}`,
              boxShadow: "0 0 16px var(--krypton-glow)",
            }}/>
          )}
          {/* bloom */}
          <div style={{
            position: "absolute", inset: -8, borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${c.color},0.35) 0%, transparent 60%)`,
            opacity: isActive ? 0.9 : 0.4,
            filter: "blur(4px)",
          }}/>
          {/* portrait */}
          <div style={{
            position: "relative", width: 52, height: 52, borderRadius: "50%",
            overflow: "hidden",
            border: `2px solid ${c.status === "deceased" ? "var(--text-dim)" : (isActive ? "var(--krypton)" : "var(--iron)")}`,
            boxShadow: isActive ? "0 0 18px var(--krypton-glow)" : "0 4px 16px rgba(0,0,0,0.6)",
            filter: c.status === "deceased" ? "grayscale(1) brightness(0.6)" : "none",
            animation: "wpmCharIdle 2.4s ease-in-out infinite",
            animationDelay: `${c.id.length * 200}ms`,
          }}>
            <img src={c.img} alt={c.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>
          {/* status dot */}
          <div style={{
            position: "absolute", bottom: 0, right: 0,
            width: 11, height: 11, borderRadius: "50%",
            background: statusDot,
            border: "2px solid #04040A",
            boxShadow: c.status === "active" ? `0 0 8px ${statusDot}` : "none",
          }}/>
        </div>
        {/* name */}
        <div style={{
          position: "absolute", top: 56, left: "50%", transform: "translateX(-50%)",
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 500,
          color: c.status === "deceased" ? "var(--text-dim)" : "#F0F0FF",
          textShadow: "0 1px 3px rgba(0,0,0,0.9)",
          whiteSpace: "nowrap", letterSpacing: "0.02em",
        }}>{c.name}</div>
      </button>
    );
  });
};

// ── PLACED STAMP DETAIL ────────────────────────────────────────────
const StampDetailCard = ({ blob, onClose, onRemove }) => {
  return (
    <div style={{
      position: "absolute", left: 88, top: 92,
      width: 268,
      background: "rgba(15,15,26,0.96)", backdropFilter: "blur(12px)",
      border: "1px solid var(--iron)",
      borderLeft: `4px solid rgb(${blob.color})`,
      borderRadius: 12,
      padding: "16px 18px",
      zIndex: 30,
      fontFamily: "var(--font-ui)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
    }}>
      <button onClick={onClose} style={{
        position: "absolute", top: 10, right: 12,
        background: "transparent", border: "none", color: "var(--text-dim)",
        cursor: "pointer", fontSize: 14, padding: 0,
      }}>✕</button>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `rgba(${blob.color},0.85)`,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 16,
          boxShadow: `0 0 14px rgba(${blob.color},0.6)`,
        }}>{blob.stamp}</div>
        <div>
          <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: `rgb(${blob.color})`, textTransform: "uppercase" }}>
            {blob.kind}
          </div>
          <div style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 600 }}>
            {blob.label}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 11 }}>
        <Row label="Severity">
          <SeverityBar value={blob.severity}/>
        </Row>
        <Row label="Radius"><span style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{Math.round(blob.r * 1.5)}km</span></Row>
        <Row label="Spreading">
          <span style={{ color: blob.spreading ? "var(--krypton)" : "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            {blob.spreading ? "YES · +2%/hr" : "STATIC"}
          </span>
        </Row>
      </div>

      {blob.characters?.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--iron)" }}>
          <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 8 }}>
            Affected
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {blob.characters.map(name => (
              <span key={name} style={{
                fontSize: 11, padding: "3px 8px", borderRadius: 999,
                background: "rgba(0,212,170,0.08)", color: "var(--krypton)",
                border: "1px solid rgba(0,212,170,0.3)",
              }}>{name}</span>
            ))}
          </div>
          {/* Impact lines */}
          <div style={{ marginTop: 10, fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-mono)", lineHeight: 1.7 }}>
            {blob.characters[0] && <div>{blob.characters[0]}: Guilt <span style={{ color: "var(--krypton)" }}>↑ 12%</span></div>}
            {blob.characters[1] && <div>{blob.characters[1]}: Fear <span style={{ color: "var(--krypton)" }}>↑ 8%</span></div>}
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

const Row = ({ label, children }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
    <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--text-dim)", textTransform: "uppercase" }}>{label}</span>
    {children}
  </div>
);

const SeverityBar = ({ value }) => {
  const cells = Array.from({ length: 10 }, (_, i) => i < value);
  return (
    <div style={{ display: "inline-flex", gap: 2 }}>
      {cells.map((on, i) => (
        <span key={i} style={{
          width: 8, height: 10, borderRadius: 2,
          background: on ? "var(--krypton)" : "var(--iron)",
          boxShadow: on ? "0 0 4px var(--krypton-glow)" : "none",
        }}/>
      ))}
      <span style={{ marginLeft: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-secondary)" }}>{value}/10</span>
    </div>
  );
};

const btnStyle = (kind) => ({
  flex: 1, height: 32, fontFamily: "var(--font-ui)", fontSize: 11,
  fontWeight: 500, letterSpacing: "0.04em",
  background: "transparent",
  border: `1px solid ${kind === "danger" ? "rgba(204,34,0,0.6)" : "var(--iron)"}`,
  color: kind === "danger" ? "#FF6B5B" : "var(--text-secondary)",
  borderRadius: 8, cursor: "pointer", transition: "all 160ms ease",
});

// ── PRESENCE STRIP ─────────────────────────────────────────────────
const PresenceStrip = ({ chars, activeChar, onSelect }) => (
  <div style={wpmStyles.presence}>
    {chars.map(c => {
      const isActive = c.id === activeChar;
      const stateColor = c.state.includes("82") || c.state.includes("68") ? "#CC2200" :
                         c.state === "Calculating" ? "#C9A84C" :
                         c.state === "Centered" ? "#2DFF78" :
                         c.status === "deceased" ? "var(--text-dim)" : "var(--text-secondary)";
      return (
        <button key={c.id} onClick={() => onSelect(c.id)}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 16px",
            background: isActive ? "rgba(0,212,170,0.06)" : "transparent",
            border: `1px solid ${isActive ? "rgba(0,212,170,0.35)" : "transparent"}`,
            borderRadius: 10, cursor: "pointer",
            marginRight: 10, flexShrink: 0,
            transition: "all 160ms ease",
          }}
          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: "50%", overflow: "hidden",
            border: `1.5px solid ${isActive ? "var(--krypton)" : "var(--iron)"}`,
            filter: c.status === "deceased" ? "grayscale(1) brightness(0.6)" : "none",
            flexShrink: 0,
          }}>
            <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{c.id === "kal" ? "Metropolis" : c.id === "bruce" ? "Gotham" : c.id === "diana" ? "Themyscira" : c.id === "lois" ? "Metropolis" : c.id === "jon" ? "Smallville" : "Unknown"}</span>
          </div>
          <div style={{
            marginLeft: 8, padding: "3px 8px", borderRadius: 6,
            background: `${stateColor}22`,
            border: `1px solid ${stateColor}55`,
            fontFamily: "var(--font-mono)", fontSize: 10, color: stateColor,
            letterSpacing: "0.05em",
          }}>{c.state}</div>
        </button>
      );
    })}
  </div>
);

// inject keyframes
const wpmKeyframes = document.createElement("style");
wpmKeyframes.textContent = `
@keyframes wpmRingPulse {
  0%   { transform: scale(0.85); opacity: 1; }
  100% { transform: scale(1.6);  opacity: 0; }
}
@keyframes wpmCharIdle {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.04); }
}
@keyframes wpmBlobBreathe {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.03); opacity: 0.95; }
}
.wpm-blob { animation: wpmBlobBreathe 5s ease-in-out infinite; }
.wpm-blob-conflict { animation-duration: 1.6s; }
.wpm-blob-bio      { animation-duration: 4s; }
.wpm-blob-trauma   { animation-duration: 6s; }
`;
document.head.appendChild(wpmKeyframes);

window.WorldMap = WorldMap;
