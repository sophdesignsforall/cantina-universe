// Shared modal primitives + the Conflict Library and Timeline Event modals.

const modalStyles = {
  backdrop: {
    position: "fixed", inset: 0, zIndex: 200,
    background: "rgba(0,0,0,0.62)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 32,
    animation: "modalFade 220ms cubic-bezier(0.4,0,0.2,1)",
  },
  card: (width) => ({
    width, maxWidth: "100%", maxHeight: "calc(100vh - 64px)",
    background: "var(--steel)",
    border: "1px solid var(--iron)",
    borderRadius: 20,
    boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
    animation: "modalRise 280ms cubic-bezier(0.4,0,0.2,1)",
  }),
  header: {
    padding: "28px 32px 22px",
    borderBottom: "1px solid var(--iron-dim)",
    position: "relative",
  },
  close: {
    position: "absolute", top: 20, right: 20,
    width: 32, height: 32, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--text-dim)", cursor: "pointer",
    transition: "background 120ms, color 120ms",
  },
  eyebrow: (color) => ({
    fontFamily: "var(--font-mono)", fontSize: 10,
    color: color || "var(--krypton)",
    letterSpacing: "0.22em", textTransform: "uppercase",
    marginBottom: 8,
  }),
  title: {
    fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600,
    color: "var(--text-primary)", letterSpacing: "-0.02em",
    margin: 0,
  },
  subtitle: {
    fontFamily: "var(--font-body)", fontSize: 14,
    color: "var(--text-secondary)", marginTop: 6, lineHeight: 1.55,
  },
  body: {
    padding: "24px 32px",
    overflowY: "auto",
    flex: 1,
  },
  footer: {
    padding: "18px 28px",
    borderTop: "1px solid var(--iron-dim)",
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
    background: "var(--obsidian)",
  },
  ghostBtn: {
    fontFamily: "var(--font-ui)", fontSize: 12, letterSpacing: "0.2em",
    textTransform: "uppercase", color: "var(--text-dim)",
    padding: "10px 18px", borderRadius: 8,
    background: "transparent", border: "1px solid var(--iron)",
    cursor: "pointer",
  },
  primaryBtn: {
    fontFamily: "var(--font-ui)", fontSize: 12, letterSpacing: "0.2em",
    textTransform: "uppercase", color: "#0A0A0A", fontWeight: 600,
    padding: "10px 22px", borderRadius: 8,
    background: "var(--krypton)", border: "1px solid var(--krypton)",
    cursor: "pointer",
    boxShadow: "0 0 24px rgba(0,212,170,0.28)",
  },
  dangerGhost: {
    fontFamily: "var(--font-ui)", fontSize: 12, letterSpacing: "0.2em",
    textTransform: "uppercase", color: "var(--blood)",
    padding: "10px 4px", background: "transparent", border: "none",
    cursor: "pointer",
  },
  search: {
    width: "100%", height: 44,
    background: "var(--obsidian)",
    border: "1px solid var(--iron)",
    borderRadius: 8,
    padding: "0 16px 0 42px",
    fontFamily: "var(--font-ui)", fontSize: 14,
    color: "var(--text-primary)",
  },
  rule: {
    height: 1, background: "var(--iron-dim)",
    margin: "26px 0 22px",
  },
  input: {
    width: "100%", height: 46,
    background: "var(--obsidian)", border: "1px solid var(--iron)",
    borderRadius: 8, padding: "0 14px",
    fontFamily: "var(--font-ui)", fontSize: 15,
    color: "var(--text-primary)",
  },
  textarea: {
    width: "100%", minHeight: 88,
    background: "var(--obsidian)", border: "1px solid var(--iron)",
    borderRadius: 8, padding: "12px 14px",
    fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.55,
    color: "var(--text-primary)", resize: "vertical",
  },
  fieldLabel: {
    fontFamily: "var(--font-mono)", fontSize: 10,
    color: "var(--text-dim)", letterSpacing: "0.22em", textTransform: "uppercase",
    marginBottom: 8, display: "block",
  },
};

const Modal = ({ open = true, width = 560, accent = "var(--krypton)", eyebrow, title, subtitle, onClose, children, footer }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose && onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
  <div style={modalStyles.backdrop} onClick={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
    <div style={modalStyles.card(width)} onClick={(e) => e.stopPropagation()}>
      <div style={{ height: 3, background: accent, opacity: 0.85 }}/>
      <div style={modalStyles.header}>
        <div
          style={modalStyles.close}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--iron-dim)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-dim)"; }}
          onClick={onClose}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </div>
        {eyebrow && <div style={modalStyles.eyebrow(accent)}>{eyebrow}</div>}
        <h2 style={modalStyles.title}>{title}</h2>
        {subtitle && <p style={modalStyles.subtitle}>{subtitle}</p>}
      </div>
      <div style={modalStyles.body}>{children}</div>
      {footer && <div style={modalStyles.footer}>{footer}</div>}
    </div>
  </div>
  );
};

// ----------------------------- CONFLICT LIBRARY MODAL ------------------------

const SEV_COLOR = {
  CRITICAL: "var(--blood)",
  HIGH:     "var(--severity-high)",
  MED:      "var(--gold)",
  LOW:      "var(--severity-low)",
};

const TROPES = [
  { id: "fallen",     bucket: "internal", sev: "HIGH",     name: "The Fallen Hero",
    desc: "A past act — justified or not — permanently redefines the hero's relationships and self-perception." },
  { id: "impossible", bucket: "internal", sev: "CRITICAL", name: "The Impossible Choice",
    desc: "Two moral obligations of equal weight. Fulfilling one destroys the other. There is no right answer." },
  { id: "wound",      bucket: "internal", sev: "HIGH",     name: "The Inherited Wound",
    desc: "Trauma originating from a parental or mentor figure that cannot be addressed without destroying the relationship." },
  { id: "godbleeds",  bucket: "internal", sev: "MED",      name: "The God Who Bleeds",
    desc: "Power sufficient to prevent anything — except the thing that matters most. The gap between capability and outcome." },
  { id: "tax",        bucket: "internal", sev: "HIGH",     name: "The Secret Identity Tax",
    desc: "The cumulative psychological cost of maintaining two irreconcilable selves. Eventually, one wins." },
  { id: "savior",     bucket: "external", sev: "CRITICAL", name: "The Misunderstood Savior",
    desc: "Genuine protection read as threat by those being protected. The rescuer tried by the rescued." },
  { id: "mirror",     bucket: "external", sev: "HIGH",     name: "The Mirror Villain",
    desc: "The antagonist embodies what the protagonist suppresses. Defeating them means confronting the shadow." },
  { id: "divided",    bucket: "external", sev: "HIGH",     name: "The Divided Loyalty",
    desc: "Love or allegiance split between two people, causes, or identities that cannot coexist." },
  { id: "witnesses",  bucket: "external", sev: "CRITICAL", name: "Weight of Witnesses",
    desc: "Survivor guilt from mass casualty event. Every face in the crowd is someone who was there." },
  { id: "public",     bucket: "external", sev: "MED",      name: "Public vs. Private Self",
    desc: "The public persona has become more real than the person. The mask has outlasted the face." },
];

const TropeCard = ({ trope, added, onAdd }) => {
  const accent = trope.bucket === "internal" ? "var(--gold)" : "var(--blood)";
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "4px 1fr",
      background: "var(--obsidian)", border: "1px solid var(--iron)",
      borderRadius: 12, overflow: "hidden",
      transition: "border-color 160ms",
    }}>
      <div style={{ background: accent }}/>
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{trope.name}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: SEV_COLOR[trope.sev], letterSpacing: "0.22em", textTransform: "uppercase", flexShrink: 0 }}>{trope.sev}</span>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.5, color: "var(--text-secondary)", margin: 0 }}>{trope.desc}</p>
        <button
          onClick={() => onAdd(trope.id)}
          style={{
            alignSelf: "flex-end", marginTop: 4,
            height: 32, padding: "0 14px", borderRadius: 8,
            fontFamily: "var(--font-ui)", fontSize: 11, letterSpacing: "0.22em",
            textTransform: "uppercase", fontWeight: 500,
            background: added ? "rgba(0,212,170,0.12)" : "transparent",
            color: added ? "var(--krypton)" : "var(--krypton)",
            border: `1px solid ${added ? "var(--krypton)" : "var(--krypton-dim)"}`,
            cursor: added ? "default" : "pointer",
            display: "inline-flex", alignItems: "center", gap: 6,
            transition: "all 160ms",
          }}
        >
          {added ? "✓ Added" : "+ Add to universe"}
        </button>
      </div>
    </div>
  );
};

const ConflictLibraryModal = ({ open, onClose, onSave }) => {
  const [added, setAdded] = React.useState(new Set());
  const [query, setQuery] = React.useState("");
  const [name, setName] = React.useState("");
  const [sev, setSev] = React.useState("HIGH");
  const [desc, setDesc] = React.useState("");
  const [whoSelected, setWhoSelected] = React.useState(new Set());

  if (!open) return null;

  const filtered = TROPES.filter(t =>
    !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.desc.toLowerCase().includes(query.toLowerCase())
  );
  const internal = filtered.filter(t => t.bucket === "internal");
  const external = filtered.filter(t => t.bucket === "external");

  const toggleAdd = (id) => {
    setAdded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleWho = (id) => {
    setWhoSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    onSave?.({ tropes: Array.from(added), custom: name ? { name, sev, desc, who: Array.from(whoSelected) } : null });
    setAdded(new Set()); setName(""); setDesc(""); setWhoSelected(new Set());
    onClose();
  };

  return (
    <Modal
      width={680}
      eyebrow="Conflict library"
      title="Add a narrative conflict"
      subtitle="Choose from proven story tropes or define a conflict unique to your universe."
      onClose={onClose}
      footer={(
        <React.Fragment>
          <button style={modalStyles.ghostBtn} onClick={onClose}>Cancel</button>
          <button style={modalStyles.primaryBtn} onClick={handleSave}>
            Save conflicts {added.size > 0 && <span style={{ opacity: 0.65, marginLeft: 6 }}>({added.size})</span>} →
          </button>
        </React.Fragment>
      )}
    >
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 22 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        </span>
        <input style={modalStyles.search} placeholder="Search conflict types, tropes, archetypes..."
          value={query} onChange={(e) => setQuery(e.target.value)}/>
      </div>

      <div style={modalStyles.fieldLabel}>Narrative conflict tropes</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--gold)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Internal</div>
          {internal.map(t => <TropeCard key={t.id} trope={t} added={added.has(t.id)} onAdd={toggleAdd}/>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--blood)", letterSpacing: "0.22em", textTransform: "uppercase" }}>External</div>
          {external.map(t => <TropeCard key={t.id} trope={t} added={added.has(t.id)} onAdd={toggleAdd}/>)}
        </div>
      </div>

      <div style={modalStyles.rule}/>

      <div style={modalStyles.fieldLabel}>Or define your own</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input style={modalStyles.input} placeholder="Conflict name" value={name} onChange={(e) => setName(e.target.value)}/>

        <div style={{ display: "flex", gap: 8 }}>
          {["CRITICAL", "HIGH", "MED", "LOW"].map(s => (
            <button key={s}
              onClick={() => setSev(s)}
              style={{
                flex: 1, height: 36, borderRadius: 999,
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600,
                background: sev === s ? `color-mix(in oklab, ${SEV_COLOR[s]} 20%, transparent)` : "transparent",
                color: sev === s ? SEV_COLOR[s] : "var(--text-dim)",
                border: `1px solid ${sev === s ? SEV_COLOR[s] : "var(--iron)"}`,
                cursor: "pointer", transition: "all 160ms",
              }}
            >{s}</button>
          ))}
        </div>

        <textarea style={modalStyles.textarea} placeholder="Describe the conflict and its implications..." rows={3}
          value={desc} onChange={(e) => setDesc(e.target.value)}/>

        <div>
          <div style={modalStyles.fieldLabel}>Who is affected?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(window.CHARACTERS || []).slice(0, 6).map(c => {
              const sel = whoSelected.has(c.id);
              return (
                <button key={c.id}
                  onClick={() => toggleWho(c.id)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "6px 14px 6px 6px", borderRadius: 999,
                    background: sel ? "rgba(0,212,170,0.10)" : "var(--obsidian)",
                    border: `1px solid ${sel ? "var(--krypton)" : "var(--iron)"}`,
                    cursor: "pointer", transition: "all 160ms",
                  }}
                >
                  <span style={{ width: 24, height: 24, borderRadius: "50%", overflow: "hidden", background: "var(--ash)", flexShrink: 0 }}>
                    {window.FigurePortrait && <window.FigurePortrait id={c.id}/>}
                  </span>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: sel ? "var(--text-primary)" : "var(--text-secondary)" }}>{c.first}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button style={{
          height: 44, width: "100%", borderRadius: 8,
          background: "transparent", border: "1px solid var(--iron)",
          fontFamily: "var(--font-ui)", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500,
          color: "var(--text-primary)", cursor: "pointer",
        }}>Add custom conflict</button>
      </div>
    </Modal>
  );
};

// --------------------------- TIMELINE EVENT MODAL ----------------------------

const EVENT_TYPES = [
  { id: "origin",       label: "Origin",       icon: "globe",    color: "#5A85C4" },
  { id: "character",    label: "Character",    icon: "user",     color: "var(--krypton)" },
  { id: "conflict",     label: "Conflict",     icon: "swords",   color: "var(--blood)" },
  { id: "trauma",       label: "Trauma",       icon: "alert",    color: "#A11A1A" },
  { id: "political",    label: "Political",    icon: "scales",   color: "var(--gold)" },
  { id: "sacrifice",    label: "Sacrifice",    icon: "flame",    color: "#C04A2A" },
  { id: "resurrection", label: "Resurrection", icon: "sparkles", color: "var(--krypton)" },
  { id: "future",       label: "Future",       icon: "clock",    color: "var(--text-dim)" },
];

const TimelineEventModal = ({ open, event, onClose, onSave, onDelete }) => {
  const [name, setName] = React.useState("");
  const [year, setYear] = React.useState("");
  const [type, setType] = React.useState("trauma");
  const [impact, setImpact] = React.useState(8);
  const [desc, setDesc] = React.useState("");
  const [linked, setLinked] = React.useState(new Set());
  const [canon, setCanon] = React.useState(true);

  React.useEffect(() => {
    if (!event) return;
    setName(event.label || "");
    setYear(event.year ? String(event.year).replace(/\D/g, "") : "");
    setType(event.type || "trauma");
    setImpact(event.impact ?? 8);
    setDesc(event.desc || "");
    setLinked(new Set(event.cast || []));
    setCanon(event.canon !== false);
  }, [event?.id]);

  if (!open || !event) return null;

  const typeMeta = EVENT_TYPES.find(t => t.id === type) || EVENT_TYPES[0];
  const accent = typeMeta.color;
  const highImpact = impact >= 8;

  const toggleLinked = (id) => {
    setLinked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    onSave?.({ ...event, label: name, year: year ? `Year ${year}` : event.year, type, impact, desc, cast: Array.from(linked), canon });
    onClose();
  };

  return (
    <Modal
      width={580}
      accent={accent}
      eyebrow={typeMeta.label}
      title={name || "Untitled event"}
      subtitle={`${year ? `Year ${year}` : event.year} — Main continuity`}
      onClose={onClose}
      footer={(
        <React.Fragment>
          <button style={modalStyles.dangerGhost} onClick={() => { onDelete?.(event); onClose(); }}>Delete event</button>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={modalStyles.ghostBtn} onClick={onClose}>Cancel</button>
            <button style={modalStyles.primaryBtn} onClick={handleSave}>Save event →</button>
          </div>
        </React.Fragment>
      )}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Name + Year */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 96px", gap: 12 }}>
          <div>
            <label style={modalStyles.fieldLabel}>Event name</label>
            <input style={{ ...modalStyles.input, fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 500, letterSpacing: "-0.01em" }}
              value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
          <div>
            <label style={modalStyles.fieldLabel}>Year</label>
            <input style={modalStyles.input} value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))}/>
          </div>
        </div>

        {/* Type tiles */}
        <div>
          <label style={modalStyles.fieldLabel}>Event type</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {EVENT_TYPES.map(t => {
              const sel = type === t.id;
              return (
                <button key={t.id}
                  onClick={() => setType(t.id)}
                  style={{
                    height: 64, borderRadius: 10,
                    background: sel ? `color-mix(in oklab, ${t.color} 14%, transparent)` : "var(--obsidian)",
                    border: `1px solid ${sel ? t.color : "var(--iron)"}`,
                    color: sel ? t.color : "var(--text-dim)",
                    fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                    cursor: "pointer", transition: "all 160ms",
                  }}>
                  <span style={{ display: "block" }}>
                    <Icon name={t.icon} size={18} color={sel ? t.color : "var(--text-dim)"}/>
                  </span>
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Impact */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <label style={{ ...modalStyles.fieldLabel, marginBottom: 0 }}>Psychological impact</label>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: highImpact ? "var(--blood)" : "var(--krypton)", fontWeight: 600 }}>
              {impact}<span style={{ color: "var(--text-dim)", fontSize: 12, fontWeight: 400 }}> / 10</span>
            </span>
          </div>
          <input type="range" min={1} max={10} value={impact} onChange={(e) => setImpact(Number(e.target.value))}
            style={{ width: "100%", accentColor: highImpact ? "var(--blood)" : "var(--krypton)" }}/>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-ghost)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
            <span>Minimal</span><span>Identity-defining</span>
          </div>
          {highImpact && (
            <div style={{
              marginTop: 10, padding: "8px 12px", borderRadius: 6,
              background: "rgba(160,30,30,0.12)", border: "1px solid rgba(160,30,30,0.4)",
              fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--blood)", letterSpacing: "0.18em", textTransform: "uppercase",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>⚠ High psychological impact</div>
          )}
        </div>

        {/* Description */}
        <div>
          <label style={modalStyles.fieldLabel}>Description</label>
          <textarea style={modalStyles.textarea} rows={4} value={desc} onChange={(e) => setDesc(e.target.value)}/>
        </div>

        {/* Linked characters */}
        <div>
          <label style={modalStyles.fieldLabel}>Characters involved</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(window.CHARACTERS || []).slice(0, 6).map(c => {
              const sel = linked.has(c.id);
              return (
                <button key={c.id}
                  onClick={() => toggleLinked(c.id)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "6px 14px 6px 6px", borderRadius: 999,
                    background: sel ? "rgba(0,212,170,0.10)" : "var(--obsidian)",
                    border: `1px solid ${sel ? "var(--krypton)" : "var(--iron)"}`,
                    cursor: "pointer", transition: "all 160ms",
                  }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", overflow: "hidden", background: "var(--ash)", flexShrink: 0 }}>
                    {window.FigurePortrait && <window.FigurePortrait id={c.id}/>}
                  </span>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: sel ? "var(--text-primary)" : "var(--text-secondary)" }}>{c.first}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Canon toggle */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 16px", borderRadius: 10,
          background: canon ? "var(--obsidian)" : "rgba(160,30,30,0.08)",
          border: `1px solid ${canon ? "var(--iron)" : "rgba(160,30,30,0.35)"}`,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4 }}>
              Canon in main timeline
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)" }}>
              {canon ? "This event shapes the matrix as written." : "Simulating: character without this event."}
            </div>
          </div>
          <div className={`toggle ${canon ? "on" : ""}`} onClick={() => setCanon(c => !c)} style={{ cursor: "pointer" }}>
            <span className="knob"/>
          </div>
        </div>

        {/* Impact preview */}
        {!canon && (
          <div style={{ padding: "14px 16px", borderRadius: 10, background: "var(--obsidian)", border: "1px solid var(--iron)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 10 }}>
              Personality impact
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { dim: "Shadow", from: 45, to: 28, color: "var(--blood)" },
                { dim: "Moral rigidity", from: 78, to: 82, color: "var(--krypton)" },
                { dim: "Self-sacrifice", from: 91, to: 87, color: "var(--krypton)" },
              ].map(r => (
                <div key={r.dim} style={{ display: "grid", gridTemplateColumns: "140px 1fr auto", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)" }}>{r.dim}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>
                    {r.from}% → {r.to}%
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: r.color }}>
                    {r.to > r.from ? "▲" : "▼"} {Math.abs(r.to - r.from)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

// Animation keyframes for modals
const modalAnimStyles = document.createElement("style");
modalAnimStyles.textContent = `
@keyframes modalFade { from { opacity: 0 } to { opacity: 1 } }
@keyframes modalRise {
  from { opacity: 0; transform: translateY(14px) scale(0.985); }
  to   { opacity: 1; transform: none; }
}
`;
document.head.appendChild(modalAnimStyles);

window.Modal = Modal;
window.ConflictLibraryModal = ConflictLibraryModal;
window.TimelineEventModal = TimelineEventModal;
