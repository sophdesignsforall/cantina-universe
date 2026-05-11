// REFERENCE LIBRARY MODAL — Character archetype anchors

const REF_CARDS = [
  { id: "frodo",     name: "Frodo Baggins",      source: "Lord of the Rings",     trait: "Reluctant burden-bearer",                desc: "Carries world-altering power without seeking it. Defined by what he refuses to become." },
  { id: "hamlet",    name: "Hamlet",             source: "Shakespeare",            trait: "Paralysis between thought and action",   desc: "Moral intelligence so acute it prevents decisive action. Tragedy of the over-examined life." },
  { id: "aragorn",   name: "Aragorn",            source: "Lord of the Rings",     trait: "Reluctance to claim rightful power",     desc: "Denies his own sovereignty from fear of becoming what destroyed his ancestors." },
  { id: "walter",    name: "Walter White",       source: "Breaking Bad",           trait: "Shadow self emergence",                  desc: "Suppressed darkness mistaken for mediocrity. Power reveals rather than corrupts." },
  { id: "atticus",   name: "Atticus Finch",      source: "To Kill a Mockingbird",  trait: "Moral rigidity under social pressure",   desc: "Refuses compromise even when the cost is personal ruin. Code over consequence." },
  { id: "valjean",   name: "Jean Valjean",       source: "Les Misérables",         trait: "Identity rebuilt from trauma",           desc: "Guilt as engine of transformation. The past as both wound and compass." },
  { id: "anakin",    name: "Anakin Skywalker",   source: "Star Wars",              trait: "Tragic fall from overwhelming love",     desc: "Love as vulnerability exploited to cross uncrossable moral lines." },
  { id: "rasko",     name: "Raskolnikov",        source: "Crime and Punishment",   trait: "Intellectual justification of transgression", desc: "The extraordinary man theory as psychological permission structure for moral violation." },
  { id: "achilles",  name: "Achilles",           source: "The Iliad",              trait: "Loyalty becoming self-destruction",      desc: "Bond so deep that its severing removes the reason to live, and the reason to stop killing." },
];

const SEARCH_GROUPS = [
  { label: "Characters", items: ["Frodo Baggins · LOTR", "Hamlet · Shakespeare", "Walter White · Breaking Bad", "Anakin Skywalker · Star Wars", "Jean Valjean · Les Misérables"] },
  { label: "Traits",     items: ["Reluctant burden-bearer", "Shadow self emergence", "Moral rigidity under pressure", "Tragic fall from love"] },
  { label: "Archetypes", items: ["The Reluctant Hero", "The Tragic God", "The Wounded Healer", "The Burdened Savior"] },
];

const truncate = (s, n) => s.length > n ? s.slice(0, n).trimEnd() + "…" : s;

const RefCard = ({ card, added, onToggle }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: "#0F0F1A",
        border: `1px solid ${hover ? "var(--krypton)" : "#1A1A2E"}`,
        borderRadius: 10, padding: 12,
        boxShadow: hover ? "0 0 18px rgba(0,212,170,0.18)" : "none",
        transition: "border-color 160ms, box-shadow 160ms",
        display: "flex", flexDirection: "column", gap: 6,
        height: 240, boxSizing: "border-box",
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: "var(--obsidian)", border: "1px solid var(--iron)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 11,
        color: "var(--text-secondary)", letterSpacing: "0.04em", flexShrink: 0,
      }}>{card.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>

      <div style={{
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
        color: "var(--text-primary)", marginTop: 2,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{card.name}</div>
      <div style={{
        fontFamily: "var(--font-ui)", fontSize: 11,
        color: "var(--text-dim)", marginTop: -2,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{card.source}</div>

      <span style={{
        display: "inline-block", alignSelf: "flex-start", maxWidth: "100%",
        border: "1px solid var(--iron)", borderRadius: 999,
        padding: "4px 10px", fontFamily: "var(--font-ui)", fontSize: 10,
        color: "var(--text-secondary)", marginTop: 2, lineHeight: 1.3,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{truncate(card.trait, 28)}</span>

      <div style={{
        fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)",
        marginTop: 2, lineHeight: 1.4, flex: 1, minHeight: 0,
        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>{truncate(card.desc, 110)}</div>

      <button
        onClick={() => onToggle(card.id)}
        disabled={added}
        style={{
          marginTop: 4, height: 28, width: "100%", flexShrink: 0,
          border: `1px solid ${added ? "transparent" : "var(--krypton)"}`,
          background: added ? "rgba(0,212,170,0.15)" : "transparent",
          color: "var(--krypton)",
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 500,
          letterSpacing: "0.06em", borderRadius: 8,
          cursor: added ? "default" : "pointer",
          transition: "background 140ms",
        }}
        onMouseEnter={(e) => { if (!added) e.currentTarget.style.background = "rgba(0,212,170,0.08)"; }}
        onMouseLeave={(e) => { if (!added) e.currentTarget.style.background = "transparent"; }}
      >{added ? "✓ ADDED" : "+ ADD"}</button>
    </div>
  );
};

const ReferenceLibraryModal = ({ open, onClose, initialTags, onSave }) => {
  const [query, setQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [added, setAdded] = React.useState(() => new Set());
  const [tags, setTags] = React.useState(initialTags || []);
  const [removing, setRemoving] = React.useState(null);

  React.useEffect(() => {
    if (open) {
      setTags(initialTags || []);
      // Pre-select cards whose trait matches existing tags
      const init = new Set();
      (initialTags || []).forEach(t => {
        const match = REF_CARDS.find(c => t.includes(c.name.split(" ")[0]) || t.includes(c.trait));
        if (match) init.add(match.id);
      });
      setAdded(init);
      setQuery("");
    }
  }, [open]);

  const toggle = (id) => {
    setAdded(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); return n; }
      n.add(id);
      const card = REF_CARDS.find(c => c.id === id);
      const tag = `${card.name}'s ${card.trait.toLowerCase()}`;
      setTags(t => t.includes(tag) ? t : [...t, tag]);
      return n;
    });
  };

  const removeTag = (tag) => {
    setRemoving(tag);
    setTimeout(() => {
      setTags(t => t.filter(x => x !== tag));
      const card = REF_CARDS.find(c => tag.startsWith(c.name));
      if (card) setAdded(prev => { const n = new Set(prev); n.delete(card.id); return n; });
      setRemoving(null);
    }, 200);
  };

  const filteredGroups = query
    ? SEARCH_GROUPS.map(g => ({ ...g, items: g.items.filter(i => i.toLowerCase().includes(query.toLowerCase())) })).filter(g => g.items.length)
    : [];

  return (
    <Modal
      open={open} onClose={onClose}
      eyebrow="Character reference library"
      title="Find your archetype anchors"
      subtitle="Search existing characters or browse AI-suggested matches for Kal-El's psychological profile"
      width={720}
      maxHeight="480px"
      primaryLabel="Save references →"
      secondaryLabel="Cancel"
      onPrimary={() => { onSave && onSave(tags); onClose(); }}
      onSecondary={onClose}
    >
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <div style={{
          position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
          color: "var(--text-dim)", display: "flex", pointerEvents: "none",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
          </svg>
        </div>
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 120)}
          placeholder="Search characters, traits, archetypes..."
          style={{
            width: "100%", height: 52, paddingLeft: 44, paddingRight: 16,
            background: "#080810",
            border: `1px solid ${focused ? "var(--krypton)" : "var(--iron)"}`,
            borderRadius: 10,
            fontFamily: "var(--font-ui)", fontSize: 14,
            color: "var(--text-primary)",
            boxShadow: focused ? "0 0 0 3px rgba(0,212,170,0.15)" : "none",
            transition: "border-color 160ms, box-shadow 160ms",
          }}
        />
        {focused && query && filteredGroups.length > 0 && (
          <div style={{
            position: "absolute", top: 56, left: 0, right: 0, zIndex: 5,
            maxHeight: 240, overflowY: "auto",
            background: "var(--obsidian)", border: "1px solid var(--iron)",
            borderRadius: 10, boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
          }}>
            {filteredGroups.map(g => (
              <div key={g.label}>
                <div style={{
                  position: "sticky", top: 0, padding: "10px 16px 6px",
                  background: "var(--obsidian)",
                  fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                }}>{g.label}</div>
                {g.items.map(it => (
                  <div key={it} style={{
                    height: 48, padding: "0 16px", display: "flex", alignItems: "center", gap: 12,
                    cursor: "pointer", borderTop: "1px solid var(--iron-dim)",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--steel)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "var(--steel)", border: "1px solid var(--iron)",
                    }}/>
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)" }}>{it}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested label */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)",
        letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14,
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--krypton)">
          <path d="M12 2 L13.8 8.4 L20 10 L13.8 11.6 L12 18 L10.2 11.6 L4 10 L10.2 8.4 Z"/>
        </svg>
        Suggested for Kal-El
      </div>

      {/* Cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        {REF_CARDS.map(c => (
          <RefCard key={c.id} card={c} added={added.has(c.id)} onToggle={toggle}/>
        ))}
      </div>

      {/* Currently added */}
      <div style={{ height: 1, background: "#1A1A2E", marginBottom: 14 }}/>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)",
        letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12,
      }}>Currently added</div>

      {tags.length === 0 ? (
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 13,
          color: "var(--text-ghost)",
        }}>No references added yet</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tags.map(t => (
            <span key={t} style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              height: 36, padding: "0 16px",
              background: "var(--steel)", border: "1px solid var(--iron)",
              borderRadius: 999,
              fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-primary)",
              maxWidth: "none", whiteSpace: "normal",
              opacity: removing === t ? 0 : 1,
              transform: removing === t ? "scale(0.6)" : "scale(1)",
              transition: "opacity 200ms, transform 200ms",
            }}>
              {t}
              <button
                onClick={() => removeTag(t)}
                style={{
                  background: "transparent", border: "none", padding: 0,
                  color: "var(--text-dim)", cursor: "pointer", fontSize: 16, lineHeight: 1,
                  transition: "color 120ms",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--blood)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-dim)"}
              >×</button>
            </span>
          ))}
        </div>
      )}
    </Modal>
  );
};

window.ReferenceLibraryModal = ReferenceLibraryModal;
