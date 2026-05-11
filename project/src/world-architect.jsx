// WORLD ARCHITECT — Define Snyderverse rules
const worldStyles = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
    background: "var(--near-black)",
  },
  universeHeader: {
    height: 80,
    background: "var(--steel)",
    borderBottom: "1px solid var(--krypton-dim)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    flexShrink: 0,
  },
  body: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "35% 65%",
    overflow: "hidden",
    minHeight: 0,
  },
  left: {
    overflowY: "auto",
    padding: "26px 30px 36px",
    borderRight: "1px solid var(--iron)",
    display: "flex",
    flexDirection: "column",
    gap: 30,
  },
  right: {
    overflowY: "hidden",
    background: "var(--obsidian)",
    backgroundImage: "radial-gradient(ellipse at top, rgba(0,212,255,0.05), transparent 60%)",
    display: "flex",
    flexDirection: "column",
    padding: "20px 30px",
    position: "relative",
  },
  tile: (selected) => ({
    width: "100%",
    height: 72,
    background: selected ? "var(--steel)" : "var(--obsidian)",
    border: `1px solid ${selected ? "var(--krypton)" : "var(--iron)"}`,
    boxShadow: selected ? "0 0 18px rgba(0,212,255,0.18), inset 0 0 12px rgba(0,212,255,0.04)" : "none",
    color: selected ? "var(--text-primary)" : "var(--text-dim)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    cursor: "pointer",
    position: "relative",
    transition: "all 180ms",
    fontFamily: "var(--font-ui)",
    fontSize: 13,
    fontWeight: 500,
  }),
  conflictCard: (color) => ({
    display: "grid",
    gridTemplateColumns: "4px 1fr auto",
    background: "var(--obsidian)",
    border: "1px solid var(--iron)",
    borderLeft: "none",
    minHeight: 76,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  }),
};

const TILE_GROUPS = [
  {
    label: "World Structure",
    items: [
      { id: "fractured", label: "Fractured Nation-States", icon: "scale", selected: true },
      { id: "global",    label: "Global Government",       icon: "crown" },
      { id: "anarchy",   label: "Anarchy",                 icon: "fire" },
      { id: "empire",    label: "Empire",                  icon: "shield" },
    ],
  },
  {
    label: "Human / Meta Relationship",
    items: [
      { id: "fear",       label: "Fear & Mistrust", icon: "skull", selected: true },
      { id: "worship",    label: "Worship",         icon: "crown" },
      { id: "coexist",    label: "Coexistence",     icon: "scale" },
      { id: "war",        label: "War",             icon: "fire" },
    ],
  },
  {
    label: "Primary Power",
    items: [
      { id: "gov",        label: "Governments",  icon: "crown", selected: true },
      { id: "corp",       label: "Corporations", icon: "shield" },
      { id: "meta",       label: "Metahumans",   icon: "bolt" },
      { id: "none",       label: "None",         icon: "x" },
    ],
  },
];

const CONFLICTS = [
  { sev: "CRITICAL", color: "var(--blood)",          name: "Humanity's distrust of Superman post-Metropolis", desc: "5,000 dead. The world remembers.", cast: ["superman","lois"] },
  { sev: "HIGH",     color: "var(--severity-high)", name: "Bruce Wayne's vendetta against Superman",          desc: "Wayne Tower employees lost. Bruce has not slept in 18 months.", cast: ["batman","superman"] },
  { sev: "MED",      color: "var(--gold)",           name: "LexCorp narrative manipulation",                   desc: "Press leaks. Donor money. A god rewritten in headlines.", cast: ["zod"] },
  { sev: "LOW",      color: "var(--severity-low)",   name: "Clark's identity crisis: Kal-El vs Clark Kent",    desc: "Two names. One man. Neither feels like home.", cast: ["superman","jonathan"] },
];

const TIMELINE = [
  { id: "krypton",   label: "Krypton Destroyed",       year: "Year 0",      type: "origin",       pos: "above", impact: 9, desc: "A planet erupts. A child is launched into the cold. The genetic memory of an entire civilization is folded into a single cell.", cast: ["superman"] },
  { id: "powers",    label: "Clark Discovers Powers",  year: "Year 18",     type: "character",    pos: "below", impact: 6, desc: "He lifts a tractor. He hears his mother's heartbeat from a mile away. He understands he is not what he thought he was.", cast: ["superman","jonathan"] },
  { id: "mos",       label: "Man of Steel Battle",     year: "Year 33",     type: "conflict",     pos: "above", impact: 8, desc: "Metropolis is leveled in 38 minutes. Five thousand civilians die. The world meets its god.", cast: ["superman","zod"] },
  { id: "zod",       label: "Zod's Death",             year: "Year 33",     type: "trauma",       pos: "below", impact: 10, active: true, desc: "Clark kills General Zod to save a family. First and only intentional kill. Violates absolute moral code. Permanent psychological fracture point.", cast: ["superman","zod"] },
  { id: "senate",    label: "Senate Hearing",          year: "Year 35",     type: "political",    pos: "above", impact: 7, desc: "Subpoenaed before the world's lawmakers. Shown faces of the dead. Says nothing. Walks out before the bomb.", cast: ["superman"] },
  { id: "bvs",       label: "Batman v Superman",       year: "Year 35",     type: "conflict",     pos: "below", impact: 8, desc: "Two men with reasons. A spear of kryptonite. The mother who shares a name.", cast: ["superman","batman"] },
  { id: "death",     label: "Death of Superman",       year: "Year 35",     type: "sacrifice",    pos: "above", impact: 9, desc: "The thing from the ship comes for the city. He goes alone. He does not come back the same day.", cast: ["superman","lois"] },
  { id: "jl",        label: "Justice League",          year: "Year 36",     type: "resurrection", pos: "below", impact: 7, desc: "He returns. The black suit. The recovered self. The slow remembering of what he was for.", cast: ["superman"] },
  { id: "future",    label: "???",                     year: "Future",      type: "future",       pos: "above", impact: 0, desc: "Unwritten. The next pivot waits to be discovered.", cast: [] },
];

const NODE_COLOR = {
  origin: "#1A2A4A", character: "var(--krypton)", conflict: "var(--blood)",
  trauma: "#5A0A0A", political: "var(--gold)", sacrifice: "#8B1A2A",
  resurrection: "var(--krypton)", future: "transparent",
};

const Tile = ({ item, group, onSelect }) => {
  const selected = item.selected;
  return (
    <button style={worldStyles.tile(selected)} onClick={() => onSelect(group, item.id)}>
      <Icon name={item.icon} size={18} color={selected ? "var(--krypton)" : "var(--text-dim)"}/>
      <span>{item.label}</span>
      {selected && (
        <div style={{ position: "absolute", top: 6, right: 8, color: "var(--krypton)" }}>
          <Icon name="check" size={12}/>
        </div>
      )}
    </button>
  );
};

const TYPE_LABEL = {
  origin: "Origin", character: "Character", conflict: "Conflict", trauma: "Trauma",
  political: "Political", sacrifice: "Sacrifice", resurrection: "Resurrection", future: "Unwritten",
};

const TimelineNode = ({ node, idx, hovered, onHover, onLeave, onClick }) => {
  const isActive = node.active;
  const isFuture = node.type === "future";
  const fill = isFuture ? "transparent" : NODE_COLOR[node.type];
  const above = node.pos === "above";
  const isHovered = hovered === idx;
  const highImpact = node.impact >= 8 && !isFuture;
  const typeColor = NODE_COLOR[node.type];

  // Card layout sits ABOVE or BELOW the node, connected by a 60px line.
  return (
    <div
      style={{
        position: "relative", flexShrink: 0, width: 168,
        display: "flex", flexDirection: "column", alignItems: "center",
        cursor: "pointer",
      }}
      onMouseEnter={() => onHover(idx)}
      onMouseLeave={onLeave}
      onClick={() => onClick(node)}
    >
      {/* CARD ABOVE (when pos === 'above') */}
      {above && (
        <React.Fragment>
          <div style={{
            width: 200,
            background: "var(--steel)",
            border: `1px solid ${isHovered ? typeColor : "var(--iron)"}`,
            borderRadius: 10,
            padding: "12px 14px",
            boxShadow: isHovered ? `0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px ${typeColor}40` : "0 8px 24px rgba(0,0,0,0.4)",
            transition: "all 160ms",
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: typeColor, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
              {TYPE_LABEL[node.type]}
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: isFuture ? "var(--text-dim)" : "var(--text-primary)", lineHeight: 1.3 }}>{node.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", marginTop: 4 }}>{node.year}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {node.desc}
            </div>
            {highImpact && (
              <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--blood)", letterSpacing: "0.2em", textTransform: "uppercase" }}>⚠ High impact</div>
            )}
          </div>
          <div style={{ width: 1, height: 60, background: `linear-gradient(to bottom, ${typeColor}66, ${typeColor}99)` }}/>
        </React.Fragment>
      )}

      {/* NODE CIRCLE */}
      <div style={{
        width: 52, height: 52,
        borderRadius: "50%",
        background: fill,
        border: isFuture ? "1.5px dashed var(--text-ghost)" : (isActive ? "2px solid var(--krypton)" : "1px solid rgba(255,255,255,0.18)"),
        boxShadow: isActive ? "0 0 28px var(--krypton-glow), inset 0 0 14px rgba(0,212,170,0.45)" : (node.type === "resurrection" ? "0 0 16px var(--krypton-glow)" : "0 4px 16px rgba(0,0,0,0.5)"),
        position: "relative", zIndex: 3,
        transform: isHovered ? "scale(1.15)" : "scale(1)",
        transition: "transform 160ms",
      }}>
        {/* Inner ring */}
        <div style={{ position: "absolute", inset: 4, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.18)", pointerEvents: "none" }}/>
        {isActive && (
          <React.Fragment>
            <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1.5px solid var(--krypton)", animation: "timelinePulse 2s infinite", pointerEvents: "none" }}/>
            <div style={{ position: "absolute", inset: -10, borderRadius: "50%", border: "1px solid var(--krypton-dim)", animation: "timelinePulse 2s infinite", animationDelay: "0.4s", pointerEvents: "none" }}/>
          </React.Fragment>
        )}
      </div>

      {/* CARD BELOW (when pos === 'below') */}
      {!above && (
        <React.Fragment>
          <div style={{ width: 1, height: 60, background: `linear-gradient(to bottom, ${typeColor}99, ${typeColor}66)` }}/>
          <div style={{
            width: 200,
            background: "var(--steel)",
            border: `1px solid ${isHovered ? typeColor : "var(--iron)"}`,
            borderRadius: 10,
            padding: "12px 14px",
            boxShadow: isHovered ? `0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px ${typeColor}40` : "0 8px 24px rgba(0,0,0,0.4)",
            transition: "all 160ms",
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: typeColor, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
              {TYPE_LABEL[node.type]}
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: isFuture ? "var(--text-dim)" : "var(--text-primary)", lineHeight: 1.3 }}>{node.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", marginTop: 4 }}>{node.year}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {node.desc}
            </div>
            {highImpact && (
              <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--blood)", letterSpacing: "0.2em", textTransform: "uppercase" }}>⚠ High impact</div>
            )}
          </div>
        </React.Fragment>
      )}

      {isHovered && (
        <div style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          top: above ? "calc(100% + 8px)" : "auto",
          bottom: above ? "auto" : "calc(100% + 8px)",
          fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--krypton)",
          letterSpacing: "0.2em", textTransform: "uppercase", whiteSpace: "nowrap",
          opacity: 0.85, pointerEvents: "none",
        }}>Click to edit</div>
      )}
    </div>
  );
};

const ConflictCard = ({ c }) => (
  <div style={worldStyles.conflictCard()}>
    <div style={{ width: 4, height: "100%", background: c.color, alignSelf: "stretch" }}/>
    <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: c.color, textTransform: "uppercase" }}>{c.sev}</span>
      <span style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-primary)", fontWeight: 500 }}>{c.name}</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontStyle: "italic", color: "var(--text-secondary)" }}>{c.desc}</span>
    </div>
    <div style={{ display: "flex", paddingRight: 18 }}>
      {c.cast.map((id, i) => (
        <div key={id} style={{
          width: 26, height: 26, borderRadius: "50%", overflow: "hidden",
          marginLeft: i === 0 ? 0 : -8, border: "1.5px solid var(--obsidian)", background: "var(--steel)",
        }}>
          <FigurePortrait id={id}/>
        </div>
      ))}
    </div>
  </div>
);

const WorldArchitect = () => {
  const [groups, setGroups] = React.useState(TILE_GROUPS);
  const [hovered, setHovered] = React.useState(null);
  const [forked, setForked] = React.useState(false);
  const [techLevel, setTechLevel] = React.useState(72);
  const [conflictModalOpen, setConflictModalOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState(null);
  const [extraConflicts, setExtraConflicts] = React.useState([]);
  const [timeline, setTimeline] = React.useState(TIMELINE);

  const select = (groupIdx, itemId) => {
    setGroups(gs => gs.map((g, i) => i !== groupIdx ? g : ({
      ...g,
      items: g.items.map(it => ({ ...it, selected: it.id === itemId })),
    })));
  };

  return (
    <div style={worldStyles.root}>
      {/* Universe header */}
      <div style={worldStyles.universeHeader}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>DC Universe</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 16, fontStyle: "italic", color: "var(--text-secondary)", marginTop: 4 }}>A world terrified of its gods, learning to trust them.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="pill">Political Tragedy</span>
          <span className="pill">Deconstruction</span>
          <span className="pill">Mythic Realism</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, marginLeft: 14, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--krypton)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            <span className="dot"/> Director Mode Active
          </span>
        </div>
      </div>

      <div className="screen-header" style={{ paddingTop: 18 }}>
        <div className="screen-header-title">World architect</div>
        <div className="screen-header-rule"/>
      </div>

      <div style={worldStyles.body}>
        {/* LEFT — Rules editor */}
        <div style={worldStyles.left}>
          <div>
            <div className="section-head"><span className="label-eyebrow">Government & Power</span><div className="section-rule"/></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {groups.map((g, gi) => (
                <div key={g.label}>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-ghost)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>{g.label}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {g.items.map(it => <Tile key={it.id} item={it} group={gi} onSelect={select}/>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="section-head"><span className="label-eyebrow">Laws & Taboos</span><div className="section-rule"/></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 3, height: 14, background: "var(--ash)" }}/>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Laws</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span className="pill">Registration Act — proposed</span>
                  <span className="pill">Metahuman surveillance</span>
                  <span className="pill dashed">+ Add Law</span>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 3, height: 14, background: "var(--blood)" }}/>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "#E08070", letterSpacing: "0.16em", textTransform: "uppercase" }}>Taboos</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span className="pill blood">Heroes kill civilians</span>
                  <span className="pill blood">Government is secretly benevolent</span>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 3, height: 14, background: "var(--gold)" }}/>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "#D4B870", letterSpacing: "0.16em", textTransform: "uppercase" }}>Sacred Rules</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span className="pill gold">Clark never kills intentionally</span>
                  <span className="pill gold">Batman has one rule — broken once</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="section-head"><span className="label-eyebrow">Active Conflicts</span><div className="section-rule"/></div>
            <button style={{
              width: "100%", height: 40, marginBottom: 14,
              border: "1px dashed var(--iron)", color: "var(--text-dim)",
              fontFamily: "var(--font-ui)", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              cursor: "pointer", background: "transparent",
            }} onClick={() => setConflictModalOpen(true)}>
              <Icon name="plus" size={14}/> Add conflict
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...CONFLICTS, ...extraConflicts].map(c => <ConflictCard key={c.name} c={c}/>)}
            </div>
          </div>

          <div>
            <div className="slider-row">
              <div className="top">
                <span className="slider-dim-label">Technology Level</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--krypton)", letterSpacing: "0.04em" }}>{techLevel} — Advanced Modern + Alien Tech</span>
              </div>
              <div className="slider-track" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTechLevel(Math.round(((e.clientX - rect.left) / rect.width) * 100));
              }}>
                <div className="slider-fill" style={{ width: `${techLevel}%` }}>
                  <div className="slider-thumb"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Timeline */}
        <div style={worldStyles.right}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              You are simulating: Main Continuity
            </span>
            <button
              onClick={() => setForked(true)}
              style={{
                fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--krypton)",
                letterSpacing: "0.2em", textTransform: "uppercase", padding: "8px 14px",
                border: "1px solid var(--krypton-dim)", display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              <Icon name="bolt" size={14}/> Create Alternate Timeline
            </button>
          </div>

          <div style={{ flex: 1, position: "relative", overflowX: "auto", overflowY: "hidden" }}>
            <div style={{ position: "relative", minWidth: 1620, height: "100%", display: "flex", alignItems: "center", padding: "0 24px" }}>
              {/* Central line */}
              <div style={{
                position: "absolute", top: "50%", left: 24, right: 24, height: 2,
                background: "linear-gradient(to right, transparent, var(--krypton) 8%, var(--krypton) 92%, transparent)",
                boxShadow: "0 0 12px rgba(0,212,170,0.35)",
                transform: "translateY(-50%)",
              }}/>

              {/* Nodes with floating cards above/below */}
              <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                {timeline.map((n, idx) => (
                  <TimelineNode
                    key={n.id} node={n} idx={idx}
                    hovered={hovered}
                    onHover={setHovered} onLeave={() => setHovered(null)}
                    onClick={(node) => setEditingEvent(node)}
                  />
                ))}
              </div>

              {/* Fork */}
              {forked && (
                <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} className="fade-in">
                  <defs>
                    <marker id="arrow-blood" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 z" fill="var(--blood)"/>
                    </marker>
                  </defs>
                  <path
                    d="M 425 240 Q 480 320 600 380 L 900 380"
                    stroke="var(--blood)" strokeWidth="1.5" strokeDasharray="6 4" fill="none" opacity="0.85"
                  />
                  <text x="540" y="332" fill="var(--blood)" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="0.18em" style={{ textTransform: "uppercase" }}>
                    ALTERNATE — What if Clark refused?
                  </text>
                  {[
                    { x: 600, y: 380, l: "Clark refuses" },
                    { x: 760, y: 380, l: "Zod escapes" },
                    { x: 900, y: 380, l: "Truth revealed" },
                  ].map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="14" fill="var(--blood-deep)" stroke="var(--blood)" strokeWidth="1.5"/>
                      <text x={p.x} y={p.y + 36} fill="#E08070" fontFamily="var(--font-ui)" fontSize="11" textAnchor="middle">{p.l}</text>
                    </g>
                  ))}
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {window.ConflictLibraryModal && (
        <window.ConflictLibraryModal
          open={conflictModalOpen}
          onClose={() => setConflictModalOpen(false)}
          onSave={({ tropes, custom }) => {
            const newOnes = [];
            const sevColor = { CRITICAL: "var(--blood)", HIGH: "var(--severity-high)", MED: "var(--gold)", LOW: "var(--severity-low)" };
            (tropes || []).forEach(id => newOnes.push({ sev: "HIGH", color: "var(--severity-high)", name: id, desc: "Added from conflict library.", cast: ["superman"] }));
            if (custom?.name) newOnes.push({ sev: custom.sev, color: sevColor[custom.sev], name: custom.name, desc: custom.desc || "", cast: custom.who || [] });
            setExtraConflicts(prev => [...prev, ...newOnes]);
            setConflictModalOpen(false);
          }}
        />
      )}
      {window.TimelineEventModal && (
        <window.TimelineEventModal
          open={!!editingEvent} event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={(updated) => { setTimeline(t => t.map(n => n.id === updated.id ? updated : n)); setEditingEvent(null); }}
          onDelete={(ev) => { setTimeline(t => t.filter(n => n.id !== ev.id)); setEditingEvent(null); }}
        />
      )}

      {/* Expose openers so the Simulation Room can trigger the same modal */}
      <ConflictModalBridge open={() => setConflictModalOpen(true)}/>
    </div>
  );
};

const ConflictModalBridge = ({ open }) => {
  React.useEffect(() => { window.openConflictModal = open; }, [open]);
  return null;
};

window.WorldArchitect = WorldArchitect;
