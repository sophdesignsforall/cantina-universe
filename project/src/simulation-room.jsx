// SIMULATION ROOM — God-mode interface, 3 columns
const simStyles = {
  root: {
    display: "grid",
    gridTemplateColumns: "28% 52% 20%",
    height: "100vh",
    overflow: "hidden",
    background: "var(--near-black)",
  },
  col: {
    height: "100vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  left: {
    borderRight: "1px solid var(--iron)",
    padding: "24px 28px 30px",
    gap: 24,
  },
  center: {
    background: "var(--obsidian)",
    backgroundImage: "radial-gradient(ellipse at top, rgba(0,212,255,0.04), transparent 60%)",
    padding: "24px 0",
    position: "relative",
  },
  right: {
    background: "var(--steel)",
    borderLeft: "1px solid var(--krypton-dim)",
    padding: "24px 22px",
  },
  locTile: (selected, img) => ({
    height: 92,
    border: `1px solid ${selected ? "var(--krypton)" : "var(--iron)"}`,
    boxShadow: selected ? "0 0 18px rgba(0,212,170,0.22), inset 0 0 24px rgba(0,212,170,0.08)" : "inset 0 0 16px rgba(0,0,0,0.4)",
    backgroundImage: `url(${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    transition: "all 180ms",
    borderRadius: 8,
  }),
};

const TIMES = [
  { id: "after-zod", l: "Day after Zod's death" },
  { id: "senate", l: "Senate Hearing" },
  { id: "post-resurrection", l: "Post-resurrection" },
  { id: "custom", l: "Custom →" },
];

const LOCATIONS = [
  { id: "rooftop",  label: "Metropolis Rooftop", img: "assets/loc-rooftop.jpg",    selected: true },
  { id: "planet",   label: "Daily Planet",       img: "assets/loc-planet.webp" },
  { id: "smallville", label: "Smallville Farm",  img: "assets/loc-metropolis.jpg" },
  { id: "batcave",  label: "Batcave",            img: "assets/loc-batcave.webp" },
  { id: "senate",   label: "Senate Chamber",     img: "assets/loc-senate.webp" },
  { id: "krypton",  label: "Krypton Memory",     img: "assets/loc-krypton.jpg" },
];

const SIM_TEXT_FULL = `Clark does not flinch.

That is the first thing Bruce notices. Most men, when confronted this way — names dropped like weapons, voice low and precise — step back. Recalibrate. Look for exits.

Clark Kent looks at him the way the sun looks at clouds.

"You've been watching." It's not a question.

"Metropolis lost 5,000 people." Bruce's voice is a controlled burn. "Your fight. Your collateral."

The guilt hits Clark like a physical weight—`;

const TypewriterText = ({ text, speed = 28, onDone }) => {
  const [shown, setShown] = React.useState(0);
  React.useEffect(() => {
    setShown(0);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= text.length) {
        clearInterval(id);
        onDone && onDone();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text]);
  const displayed = text.slice(0, shown);
  return (
    <div style={{ whiteSpace: "pre-wrap" }}>
      {displayed.split("\n").map((line, i, arr) => (
        <p key={i} style={{ marginBottom: i < arr.length - 1 ? "1.5em" : 0 }}>{line || "\u00A0"}</p>
      ))}
      <span className="cursor-blink"/>
    </div>
  );
};

const StatusBar = ({ label, value, color, tint }) => {
  const [v, setV] = React.useState(0);
  const [shown, setShown] = React.useState(0);
  React.useEffect(() => {
    setV(value);
    let cur = shown;
    const target = value;
    const id = setInterval(() => {
      cur += cur < target ? 1 : -1;
      setShown(cur);
      if (cur === target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [value]);
  // Subtle pulse via CSS animation on the fill
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 10 }}>
      <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)" }}>{label}</span>
      <div style={{ width: 96, height: 8, background: "var(--iron)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <div style={{
          width: `${v}%`, height: "100%",
          background: `linear-gradient(90deg, ${color}, ${tint || color})`,
          borderRadius: 4,
          transition: "width 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          position: "relative",
          boxShadow: `0 0 8px ${color}55`,
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "50%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.22), transparent)",
            borderRadius: "4px 4px 0 0",
          }}/>
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 4,
            background: tint || color,
            filter: "brightness(1.5)",
            animation: "leadPulse 2s ease-in-out infinite",
          }}/>
        </div>
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: color, minWidth: 32, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{shown}%</span>
    </div>
  );
};

const SimulationRoom = () => {
  const [loc, setLoc] = React.useState("rooftop");
  const [time, setTime] = React.useState("after-zod");
  const [running, setRunning] = React.useState(true);
  const [done, setDone] = React.useState(false);
  const [toggles, setToggles] = React.useState({ metro: true, trust: true, lois: false, jonathan: false });
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [event, setEvent] = React.useState(
    `Bruce Wayne confronts Clark Kent in civilian clothes.\nHe knows. He has always known. He says:\n"I've been watching you, Kent. The world thinks you're a god.\nI think you're a mistake."`
  );

  return (
    <div style={simStyles.root}>
      {/* LEFT — Scene Setup */}
      <div style={{ ...simStyles.col, ...simStyles.left }}>
        <div>
          <div className="screen-header-title">Simulation room</div>
          <div className="screen-header-rule"/>
        </div>

        <div>
          <div className="section-head"><span className="label-eyebrow">Scenario Builder</span><div className="section-rule"/></div>
        </div>

        <div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-ghost)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Location</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {LOCATIONS.map(l => (
              <div key={l.id} style={simStyles.locTile(loc === l.id, l.img)} onClick={() => setLoc(l.id)}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: loc === l.id
                    ? "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 60%, rgba(0,212,170,0.06) 100%)"
                    : "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.55) 100%)",
                }}/>
                <div style={{
                  position: "absolute", left: 12, bottom: 10,
                  fontFamily: "var(--font-ui)", fontSize: 13, color: "white", fontWeight: 500,
                }}>{l.label}</div>
                {loc === l.id && (
                  <div style={{ position: "absolute", top: 8, right: 8, color: "var(--krypton)" }}>
                    <Icon name="check" size={14}/>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-ghost)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Time Context</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {TIMES.map(t => (
              <button
                key={t.id}
                className={time === t.id ? "pill krypton" : "pill"}
                style={{ cursor: "pointer", fontWeight: 500 }}
                onClick={() => setTime(t.id)}
              >{t.l}</button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-ghost)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Who Is Present</div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[{ id: "superman", n: "Clark" }, { id: "batman", n: "Bruce" }].map(c => (
              <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--krypton)", boxShadow: "0 0 12px var(--krypton-glow)" }}>
                  <FigurePortrait id={c.id}/>
                </div>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-secondary)" }}>{c.n}</span>
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                border: "1.5px dashed var(--iron)", color: "var(--text-dim)",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}><Icon name="plus" size={16}/></div>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-dim)" }}>Add</span>
            </div>
          </div>
        </div>

        <div>
          <div className="section-head"><span className="label-eyebrow">Inciting Event</span><div className="section-rule"/></div>
          <textarea
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            style={{
              width: "100%", minHeight: 140,
              background: "var(--obsidian)", border: "1px solid var(--iron)",
              padding: "14px 16px",
              fontFamily: "var(--font-body)", fontSize: 16, fontStyle: "italic", lineHeight: 1.7,
              color: "var(--text-primary)",
            }}
          />
        </div>

        <div>
          <div className="section-head"><span className="label-eyebrow">World State</span><div className="section-rule"/></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { k: "metro", l: "Post-Metropolis destruction", e: "Clark guilt active — Shadow ↑, Volatility ↑" },
              { k: "trust", l: "Public trust at 34%", e: "Pressure state — Empathy ↑, Ambition ↓" },
              { k: "lois", l: "Lois present", e: "Emotional anchor — Volatility ↓" },
              { k: "jonathan", l: "Jonathan Kent memory", e: "Grief trigger — Shadow ↑, SelfSacrifice ↑" },
            ].map(t => (
              <div key={t.k} style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--iron-dim)" }}>
                <div className={`toggle ${toggles[t.k] ? "on" : ""}`} onClick={() => setToggles(p => ({ ...p, [t.k]: !p[t.k] }))}><span className="knob"/></div>
                <div>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: toggles[t.k] ? "var(--text-primary)" : "var(--text-secondary)" }}>{t.l}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontStyle: "italic", color: "var(--text-dim)", marginTop: 2 }}>{t.e}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-cinema primary" onClick={() => { setRunning(true); setDone(false); }}>
          <Icon name="bolt" size={16}/> Initiate Simulation
        </button>
      </div>

      {/* CENTER — Output */}
      <div style={{ ...simStyles.col, ...simStyles.center }}>
        <div style={{ padding: "0 60px", maxWidth: 760, margin: "0 auto" }}>
          {/* Header bar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--krypton)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              <span className="dot"/> Simulation Active
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.1em" }}>
              TIMELINE: Main Continuity — Day 847 Post-Krypton Impact
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.1em" }}>
              CHARACTERS: Kal-El [Clark Kent mode] × Bruce Wayne
            </div>
          </div>
          <div style={{ height: 1, background: "linear-gradient(to right, var(--krypton-dim), transparent)", marginBottom: 36 }}/>

          {/* Prose */}
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 18, lineHeight: 2.0, color: "var(--text-primary)",
            fontWeight: 400, letterSpacing: "0.005em",
          }}>
            <TypewriterText text={SIM_TEXT_FULL} onDone={() => setDone(true)}/>
          </div>

          {/* Influence log */}
          {done && (
            <>
              <div style={{ height: 1, background: "linear-gradient(to right, transparent, var(--krypton-dim), transparent)", margin: "44px 0 28px" }}/>

              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--krypton)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Matrix Influence Log</div>

                {[
                  { dim: "Empathy 94%", arrow: "up", note: "Clark registered Bruce's grief, not just his threat", color: "var(--krypton)" },
                  { dim: "Moral Rigidity 78%", arrow: "right", note: "Did not justify Metropolis deaths, accepted them", color: "var(--text-secondary)" },
                  { dim: "Shadow 45%", arrow: "up", note: "Buried guilt surfaced momentarily before suppression", color: "var(--krypton)" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 30px 1fr", alignItems: "center", gap: 14, padding: "10px 0", borderTop: i === 0 ? "1px solid var(--iron-dim)" : "none", borderBottom: "1px solid var(--iron-dim)" }}>
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)" }}>{r.dim}</span>
                    <span style={{ color: r.color }}><Icon name={r.arrow === "up" ? "arrowUp" : "arrowRight"} size={14}/></span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontStyle: "italic", color: "var(--text-secondary)" }}>{r.note}</span>
                  </div>
                ))}
              </div>

              <button className="btn-cinema pulse fade-in" style={{ marginTop: 28 }}>
                <Icon name="bolt" size={14}/> Clip This Moment
              </button>

              <div className="fade-in" style={{ marginTop: 32, padding: "20px 0", borderTop: "1px solid var(--iron-dim)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--krypton)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>What if...</div>
                <input
                  type="text"
                  placeholder="What if Clark revealed his identity?"
                  style={{
                    width: "100%",
                    background: "var(--obsidian)", border: "1px solid var(--iron)",
                    padding: "12px 14px",
                    fontFamily: "var(--font-body)", fontSize: 16, fontStyle: "italic",
                    color: "var(--text-primary)",
                    marginBottom: 14,
                  }}
                />
                <button style={{
                  fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--krypton)",
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  border: "1px solid var(--krypton-dim)", padding: "10px 18px",
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}><Icon name="bolt" size={13}/> Fork Timeline</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT — Character State */}
      <div style={{ ...simStyles.col, ...simStyles.right }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--text-primary)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 26 }}>Kal-El Active State</div>

        <div style={{ marginBottom: 26 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>Emotional Status</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <StatusBar label="Guilt"      value={82} color="#CC2200" tint="#FF6644"/>
            <StatusBar label="Restraint"  value={74} color="#00D4AA" tint="#88EEFF"/>
            <StatusBar label="Hope"       value={21} color="#7B5EA7" tint="#AA88DD"/>
            <StatusBar label="Isolation"  value={43} color="#3A3A5C" tint="#6B6B8A"/>
          </div>
        </div>

        <div style={{ marginBottom: 26 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>Matrix Active</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { dim: "Empathy", note: "responding to Bruce's grief", arrow: "up", color: "var(--krypton)" },
              { dim: "Moral Rigidity", note: "no deflection active", arrow: "right", color: "var(--text-secondary)" },
              { dim: "Ambition", note: "not defending himself", arrow: "down", color: "var(--blood)" },
            ].map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "16px 1fr", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: r.color, marginTop: 2 }}>
                  <Icon name={r.arrow === "up" ? "arrowUp" : r.arrow === "down" ? "arrowDown" : "arrowRight"} size={12}/>
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{r.dim}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontStyle: "italic", color: "var(--text-dim)" }}>{r.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>World Pressure</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)" }}>Public Trust</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--blood)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                34% <Icon name="arrowDown" size={11}/>
              </span>
            </div>
            <span className="pill blood" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", justifyContent: "center" }}>
              Post-Metropolis Guilt — Active
            </span>
            <span className="pill iron-fill" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", justifyContent: "center" }}>
              Lois Anchor — Absent
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

window.SimulationRoom = SimulationRoom;
