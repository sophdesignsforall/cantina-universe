// CLIP STUDIO — 4 export format tabs
const clipStyles = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
    background: "var(--near-black)",
  },
  clipCard: {
    height: 110,
    background: "var(--steel)",
    borderBottom: "1px solid var(--iron)",
    display: "grid",
    gridTemplateColumns: "4px 1fr 1fr auto",
    alignItems: "center",
    flexShrink: 0,
  },
  tabs: {
    height: 48,
    borderBottom: "1px solid var(--iron)",
    display: "flex",
    background: "var(--obsidian)",
    flexShrink: 0,
  },
  tab: (active) => ({
    height: "100%",
    padding: "0 28px",
    fontFamily: "var(--font-ui)",
    fontSize: 14,
    color: active ? "var(--text-primary)" : "var(--text-dim)",
    borderBottom: active ? "2px solid var(--krypton)" : "2px solid transparent",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    fontWeight: active ? 500 : 400,
  }),
  body: {
    flex: 1,
    overflowY: "auto",
    minHeight: 0,
  },
};

const ClipMomentCard = () => (
  <div style={clipStyles.clipCard}>
    <div style={{ width: 4, height: "100%", background: "var(--krypton)", boxShadow: "0 0 16px var(--krypton-glow)" }}/>
    <div style={{ display: "flex", gap: 18, padding: "0 24px", alignItems: "center" }}>
      <div style={{ display: "flex" }}>
        {["superman","batman"].map((id, i) => (
          <div key={id} style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", marginLeft: i ? -10 : 0, border: "1.5px solid var(--steel)" }}>
            <FigurePortrait id={id}/>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Main Continuity — Day 847</div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-primary)", marginTop: 4, fontWeight: 500 }}>Kal-El × Bruce Wayne — Metropolis Street</div>
      </div>
    </div>

    <div style={{ display: "flex", gap: 18, justifyContent: "center" }}>
      {[
        { l: "Tension", v: 76, c: "var(--blood)" },
        { l: "Grief",   v: 58, c: "var(--gold)" },
        { l: "Respect", v: 34, c: "var(--krypton-deep)" },
      ].map(t => (
        <div key={t.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ width: 64, height: 4, background: "var(--iron)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${t.v}%`, height: "100%", background: t.c }}/>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.l} {t.v}%</div>
        </div>
      ))}
    </div>

    <div style={{ display: "flex", gap: 18, paddingRight: 28 }}>
      <button style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-dim)" }}>
        <Icon name="edit" size={14}/> Edit Clip
      </button>
      <button style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-dim)" }}>
        <Icon name="refresh" size={14}/> Re-simulate
      </button>
    </div>
  </div>
);

// ───────── Tab 1: Book Page ─────────
const BookPage = () => (
  <div style={{
    minHeight: "100%",
    background: "var(--near-black)",
    padding: "48px 0 60px",
    display: "flex",
    justifyContent: "center",
  }}>
    <div style={{
      width: 720,
      background: "#F5F0E8",
      backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.6 0 0 0 0 0.5 0 0 0 0 0.4 0 0 0 0.08 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      padding: "72px 88px 80px",
      boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.2)",
      color: "#2C2415",
      fontFamily: "var(--font-body)",
    }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: "0.32em", color: "#8B7355", marginBottom: 14 }}>CHAPTER FOURTEEN</div>
        <div style={{ fontSize: 16, color: "#8B7355", marginBottom: 12 }}>—— ◆ ——</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#2C1810", letterSpacing: "0.04em", fontWeight: 600 }}>THE WEIGHT OF GODS</div>
        <div style={{ fontSize: 16, color: "#8B7355", marginTop: 12 }}>—— ◆ ——</div>
      </div>

      <div style={{ fontSize: 19, lineHeight: 2.0, color: "#2C2415", maxWidth: 560, margin: "0 auto" }}>
        <p style={{ marginBottom: "1em", textIndent: 0 }}>
          <span style={{
            float: "left",
            fontFamily: "var(--font-display)",
            fontSize: 78,
            lineHeight: 0.9,
            marginRight: 10,
            marginTop: 8,
            marginBottom: -4,
            color: "#2C1810",
            fontWeight: 700,
          }}>C</span>
          lark did not flinch. That, Bruce thought, was the first thing — the first wrongness. Most men, when confronted in this manner, with a name dropped like a stone into water, with a voice that had been built to break men in boardrooms — most men recalibrated. They blinked. They searched the street for exits.
        </p>
        <p style={{ marginBottom: "1em" }}>
          Clark Kent looked at him the way the sun looked at clouds. Without urgency. Without surprise. As if he had been waiting to be seen, and Bruce was merely the one who finally arrived.
        </p>
        <p style={{ marginBottom: "1em" }}>
          <em>"You've been watching."</em> The words came out as a fact, not a question. The way a man comments on the weather. The way a god might note the passage of time.
        </p>
        <p style={{ marginBottom: "1em" }}>
          <em>"Metropolis lost five thousand people."</em> Bruce's voice was a controlled burn — the kind you start on purpose, in a field that needs to die before it can grow. <em>"Your fight. Your collateral."</em>
        </p>
        <p>
          The guilt struck Clark with a weight that even he, who had carried buildings, could not steady against. He let it land. He did not look away. That, perhaps, was the difference between a god and a man who had merely been mistaken for one.
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: 40, fontFamily: "var(--font-display)", fontSize: 12, color: "#8B7355", letterSpacing: "0.3em" }}>— 247 —</div>
    </div>
  </div>
);

// ───────── Tab 2: Manga Panel ─────────
const MangaPanel = () => (
  <div style={{
    minHeight: "100%",
    background: "var(--near-black)",
    padding: "40px 0 60px",
    display: "flex",
    justifyContent: "center",
  }}>
    <div style={{
      width: 540,
      background: "#FFFFFF",
      border: "3px solid #000",
      boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      padding: 8,
    }}>
      {/* Panel 1 — wide */}
      <div style={{
        height: 160,
        border: "2px solid #000",
        position: "relative",
        background: "radial-gradient(circle at 0.5px 0.5px, rgba(0,0,0,0.18) 0.6px, transparent 1px) 0 0/4px 4px, linear-gradient(to bottom, #f8f8f8, #ddd 70%, #888)",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 6, left: 50, fontFamily: "Times New Roman, serif", fontStyle: "italic", fontSize: 10, color: "#666", letterSpacing: "0.04em" }}>
          EXT. METROPOLIS STREET — DUSK
        </div>
        {/* City silhouette */}
        <svg viewBox="0 0 540 160" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="none">
          <path d="M0 160 L0 90 L40 90 L40 60 L80 60 L80 100 L120 100 L120 50 L150 50 L150 80 L200 80 L200 30 L230 30 L230 70 L280 70 L280 90 L320 90 L320 40 L360 40 L360 75 L400 75 L400 60 L440 60 L440 100 L480 100 L480 70 L520 70 L520 95 L540 95 L540 160 Z" fill="#000" opacity="0.85"/>
        </svg>
        {/* Speech bubble */}
        <div style={{
          position: "absolute", right: 16, bottom: 10,
          background: "#fff", border: "1.5px solid #000", borderRadius: 14,
          padding: "8px 14px", maxWidth: 220,
          fontFamily: "'Arial Black', Arial Black, sans-serif", fontSize: 12, color: "#000", letterSpacing: "0.02em",
        }}>
          "I'VE BEEN WATCHING YOU, KENT."
          <div style={{
            position: "absolute", bottom: -10, right: 30,
            width: 0, height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "12px solid #fff",
            filter: "drop-shadow(1.5px 0 0 #000) drop-shadow(0 1.5px 0 #000)",
          }}/>
        </div>
        <div style={{ position: "absolute", bottom: 4, left: 6, fontFamily: "var(--font-mono)", fontSize: 7, color: "#999" }}>WIDE</div>
      </div>

      {/* Panel 2 — tallest */}
      <div style={{
        height: 320,
        border: "2px solid #000",
        position: "relative",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        background: "#fff",
      }}>
        <div style={{
          position: "relative",
          background: "repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
        }}>
          {/* Clark figure silhouette */}
          <svg viewBox="0 0 100 200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMax slice">
            <ellipse cx="50" cy="60" rx="22" ry="26" fill="#000"/>
            <path d="M 18 200 Q 18 110 50 90 Q 82 110 82 200 Z" fill="#000"/>
          </svg>
          <div style={{
            position: "absolute", top: 14, left: 14, right: 24,
            background: "#fff", border: "1.5px solid #000", borderRadius: 22,
            padding: "10px 14px",
            fontFamily: "'Arial Black', sans-serif", fontSize: 11, color: "#000", lineHeight: 1.3,
          }}>
            "METROPOLIS LOST 5,000 PEOPLE.<br/>YOUR FIGHT.<br/>YOUR COLLATERAL."
          </div>
          <div style={{ position: "absolute", bottom: 6, left: 8, fontFamily: "Times New Roman, serif", fontStyle: "italic", fontSize: 8, color: "#444" }}>
            [BRUCE: controlled fury]
          </div>
        </div>

        <div style={{
          position: "relative",
          background: "repeating-linear-gradient(45deg, transparent 0, transparent 2px, rgba(0,0,0,0.16) 2px, rgba(0,0,0,0.16) 3px)",
          borderLeft: "2px solid #000",
        }}>
          <svg viewBox="0 0 100 200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMax slice">
            <ellipse cx="50" cy="60" rx="22" ry="26" fill="#000" opacity="0.92"/>
            <path d="M 18 200 Q 18 110 50 90 Q 82 110 82 200 Z" fill="#000" opacity="0.92"/>
          </svg>
          {/* Thought bubble (top right cloud outline) */}
          <div style={{
            position: "absolute", top: 8, right: 8,
            background: "#fff", border: "1.5px solid #000", borderRadius: "50% / 60%",
            padding: "8px 12px",
            fontFamily: "Times New Roman, serif", fontStyle: "italic", fontSize: 10, color: "#000",
          }}>
            He's not wrong.
          </div>
          {/* Speech */}
          <div style={{
            position: "absolute", bottom: 38, left: 10, right: 16,
            background: "#fff", border: "1.5px solid #000", borderRadius: 16,
            padding: "8px 12px",
            fontFamily: "'Arial Black', sans-serif", fontSize: 11, color: "#000", lineHeight: 1.3,
          }}>
            "I KNOW WHAT I COST THEM."
          </div>
          <div style={{ position: "absolute", bottom: 6, right: 8, fontFamily: "Times New Roman, serif", fontStyle: "italic", fontSize: 8, color: "#444" }}>
            [CLARK: accepts the verdict]
          </div>
        </div>
      </div>

      {/* Panel 3 — reaction */}
      <div style={{
        height: 160,
        border: "2px solid #000",
        position: "relative",
        background: "repeating-linear-gradient(135deg, transparent 0, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 3px)",
        overflow: "hidden",
      }}>
        {/* Clark walking away — silhouette deep */}
        <svg viewBox="0 0 540 160" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
          {/* Crowd suggestion */}
          <g opacity="0.35">
            {[180, 220, 260, 300, 340, 380, 420].map((x, i) => (
              <ellipse key={i} cx={x} cy={130 - (i % 2) * 4} rx="14" ry="22" fill="#fff"/>
            ))}
          </g>
          {/* Clark silhouette walking into crowd */}
          <g>
            <ellipse cx="320" cy="80" rx="14" ry="16" fill="#fff"/>
            <path d="M 300 160 Q 300 110 320 100 Q 340 110 340 160 Z" fill="#fff"/>
          </g>
          {/* Bruce in foreground */}
          <g>
            <ellipse cx="100" cy="100" rx="12" ry="14" fill="#fff" opacity="0.7"/>
            <path d="M 84 160 Q 84 130 100 122 Q 116 130 116 160 Z" fill="#fff" opacity="0.7"/>
          </g>
        </svg>

        <div style={{
          position: "absolute", top: 10, left: 12,
          background: "#000", color: "#fff",
          padding: "8px 12px",
          fontFamily: "Times New Roman, serif", fontStyle: "italic", fontSize: 11, lineHeight: 1.4,
          maxWidth: 260,
        }}>
          He had thought he was<br/>afraid of the wrong enemy.
        </div>
      </div>
    </div>
  </div>
);

// ───────── Tab 3: Audio Script ─────────
const AudioScript = () => (
  <div style={{
    minHeight: "100%",
    background: "var(--obsidian)",
    fontFamily: "var(--font-mono)",
    padding: "44px 0 60px",
    color: "var(--text-primary)",
  }}>
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 60px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 14, color: "var(--krypton)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>UNIVERSE AUDIO SCRIPT</div>
        <div style={{ fontSize: 13, color: "var(--text-primary)", marginBottom: 4 }}>Episode 12: "The Weight of Gods"</div>
        <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Runtime estimate: 4:20</div>
        <div style={{ height: 1, background: "linear-gradient(to right, transparent, var(--krypton-dim), transparent)", marginTop: 18 }}/>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22, fontSize: 13, lineHeight: 1.7 }}>
        <div style={{ color: "var(--text-dim)", fontStyle: "italic" }}>[SOUND: City ambience. Traffic. Distant sirens.]</div>

        <div>
          <div style={{ color: "var(--krypton)", letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 13 }}>NARRATOR (V.O.)</div>
          <div style={{ paddingLeft: 40, color: "var(--text-primary)", marginTop: 6 }}>
            Metropolis, eighteen months after<br/>
            the World Engine. The city rebuilt<br/>
            its skyline. Its trust is under<br/>
            construction.
          </div>
        </div>

        <div style={{ color: "var(--text-dim)", fontSize: 12, textAlign: "center" }}>[BEAT — 2 seconds]</div>

        <div>
          <div style={{ color: "var(--krypton)", letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 13 }}>BRUCE WAYNE</div>
          <div style={{ color: "var(--text-dim)", fontStyle: "italic", fontSize: 12, marginTop: 2 }}>(measured, deliberate)</div>
          <div style={{ paddingLeft: 40, color: "var(--text-primary)", marginTop: 6 }}>
            I've been watching you, Kent.
          </div>
        </div>

        <div style={{ color: "var(--text-dim)", fontSize: 12, textAlign: "center" }}>[BEAT — 2 seconds]</div>

        <div>
          <div style={{ color: "var(--krypton)", letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 13 }}>CLARK KENT</div>
          <div style={{ color: "var(--text-dim)", fontStyle: "italic", fontSize: 12, marginTop: 2 }}>(quiet, not surprised)</div>
          <div style={{ paddingLeft: 40, color: "var(--text-primary)", marginTop: 6 }}>
            You've been watching.
          </div>
        </div>

        <div style={{ color: "var(--text-dim)", fontStyle: "italic" }}>[SOUND: A car passes. Long.]</div>

        <div>
          <div style={{ color: "var(--krypton)", letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 13 }}>BRUCE WAYNE</div>
          <div style={{ paddingLeft: 40, color: "var(--text-primary)", marginTop: 6 }}>
            Metropolis lost 5,000 people.<br/>
            Your fight. Your collateral.
          </div>
        </div>

        <div>
          <div style={{ color: "var(--krypton)", letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 13 }}>CLARK KENT</div>
          <div style={{ color: "var(--text-dim)", fontStyle: "italic", fontSize: 12, marginTop: 2 }}>(without defense)</div>
          <div style={{ paddingLeft: 40, color: "var(--text-primary)", marginTop: 6 }}>
            I know what I cost them.
          </div>
        </div>

        <div style={{ height: 1, background: "linear-gradient(to right, transparent, var(--krypton-dim), transparent)" }}/>

        <div style={{
          border: "1px solid var(--iron)",
          background: "var(--steel)",
          padding: 18,
        }}>
          <div style={{ color: "var(--krypton)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Direction Notes</div>
          <div style={{ color: "var(--text-secondary)", fontSize: 12, lineHeight: 1.7 }}>
            Clark: Never raises voice. Exhaustion beneath the calm.<br/>
            Bruce: Controlled fury. This is a verdict, not a confrontation.
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ───────── Tab 4: Video Treatment ─────────
const VideoTreatment = () => (
  <div style={{
    minHeight: "100%",
    background: "var(--obsidian)",
    padding: "40px 0 60px",
  }}>
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 60px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--krypton)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 24 }}>
        UNIVERSE / Video Treatment
      </div>

      <div style={{ fontFamily: "var(--font-display)", fontSize: 38, color: "var(--text-primary)", letterSpacing: "0.02em", fontWeight: 700, marginBottom: 8 }}>
        The Verdict
      </div>
      <div style={{ height: 1, background: "var(--iron)", marginBottom: 22 }}/>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        {[
          { l: "Format", v: "Short film / Episode" },
          { l: "Runtime", v: "3–5 minutes" },
          { l: "Tone", v: "Cinematic. Heavy." },
          { l: "Universe", v: "Main — Day 847" },
        ].map(m => (
          <div key={m.l}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>{m.l}</div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)" }}>{m.v}</div>
          </div>
        ))}
      </div>

      {/* Logline */}
      <div style={{ borderLeft: "2px solid var(--krypton)", paddingLeft: 24, marginBottom: 36 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 19, fontStyle: "italic", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Two men who could destroy each other choose words instead. One walks away. The other realizes he's been fighting the wrong war.
        </div>
      </div>

      {/* Visual language */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Visual Language</div>
        <div style={{ height: 1, background: "var(--iron)", marginBottom: 16 }}/>
        <ul style={{ listStyle: "none", padding: 0, fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text-primary)", lineHeight: 1.9 }}>
          {[
            "Golden hour light cutting through Metropolis smog",
            "Clark shot from below (human angle, not god angle)",
            "Bruce always in shadow, even in daylight",
            "No score. City sound only. Then silence.",
            "Final shot: Bruce's face as Clark disappears into crowd. He looks small.",
          ].map((b, i) => (
            <li key={i} style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 12, alignItems: "baseline" }}>
              <span style={{ color: "var(--krypton)" }}>—</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Scene breakdown */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Scene Breakdown</div>
        <div style={{ height: 1, background: "var(--iron)", marginBottom: 16 }}/>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-primary)", lineHeight: 2 }}>
          {[
            ["00:00", "Establishing — Metropolis street, post-work crowd"],
            ["00:18", "Bruce appears behind Clark"],
            ["00:34", '"I\'ve been watching you, Kent."'],
            ["01:02", "Exchange — static shots, no cuts during dialogue"],
            ["02:15", 'Clark: "I know what I cost them."'],
            ["02:44", "Clark walks. Camera stays on Bruce."],
            ["03:10", "End frame: empty sidewalk."],
          ].map(([t, d]) => (
            <div key={t} style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: 16 }}>
              <span style={{ color: "var(--krypton)" }}>{t}</span>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Production notes */}
      <div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Production Notes</div>
        <div style={{ height: 1, background: "var(--iron)", marginBottom: 16 }}/>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontStyle: "italic", color: "var(--text-secondary)", lineHeight: 1.8 }}>
          Practical street location, not studio. Color grade: pull warmth, add steel blue shadow. No CGI. No score. The scene is the score.
        </div>
      </div>
    </div>
  </div>
);

const TABS = [
  { id: "book",  label: "Book Page",       icon: "book" },
  { id: "manga", label: "Manga Panel",     icon: "panel" },
  { id: "audio", label: "Audio Script",    icon: "mic" },
  { id: "video", label: "Video Treatment", icon: "clapper" },
];

const ClipStudio = () => {
  const [tab, setTab] = React.useState("book");
  return (
    <div style={clipStyles.root}>
      <div className="screen-header">
        <div className="screen-header-title">Clip studio</div>
        <div className="screen-header-rule"/>
      </div>

      <div style={{ paddingTop: 18 }}>
        <ClipMomentCard/>
      </div>

      <div style={clipStyles.tabs}>
        {TABS.map(t => (
          <div key={t.id} style={clipStyles.tab(tab === t.id)} onClick={() => setTab(t.id)}>
            <Icon name={t.icon} size={15}/> {t.label}
          </div>
        ))}
      </div>

      <div style={clipStyles.body}>
        {tab === "book"  && <BookPage/>}
        {tab === "manga" && <MangaPanel/>}
        {tab === "audio" && <AudioScript/>}
        {tab === "video" && <VideoTreatment/>}
      </div>
    </div>
  );
};

window.ClipStudio = ClipStudio;
