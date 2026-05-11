// HOME — Discovery feed
// BookTok + Moviecore. Stories, scenes, quotes, moments, characters.

const homeStyles = {
  root: {
    flex: 1, height: "100vh", overflowY: "auto",
    background: "var(--near-black)",
  },
  topBar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "26px 40px 22px", gap: 24,
    position: "sticky", top: 0, zIndex: 5,
    background: "linear-gradient(var(--near-black) 70%, transparent)",
  },
  hello: { fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-dim)", letterSpacing: "0.18em", textTransform: "uppercase" },
  user: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.02em", marginTop: 2 },
  search: {
    flex: 1, maxWidth: 460, height: 44,
    background: "var(--obsidian)", border: "1px solid var(--iron)", borderRadius: 999,
    paddingLeft: 44, paddingRight: 18,
    fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)",
    outline: "none",
  },
  bell: {
    width: 44, height: 44, borderRadius: 999,
    background: "var(--obsidian)", border: "1px solid var(--iron)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--text-secondary)", cursor: "pointer", flexShrink: 0,
  },
  hero: {
    margin: "0 40px 36px", padding: "32px 36px",
    background: "linear-gradient(135deg, rgba(0,212,170,0.08), rgba(59,130,246,0.06) 50%, rgba(245,158,11,0.04))",
    border: "1px solid var(--iron)", borderRadius: 18,
    display: "grid", gridTemplateColumns: "1fr auto", gap: 28, alignItems: "center",
  },
  sectionWrap: { padding: "0 40px 32px" },
  sectionHead: {
    display: "flex", alignItems: "baseline", justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22,
    color: "var(--text-primary)", letterSpacing: "-0.02em",
  },
  sectionSub: {
    fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-dim)",
    letterSpacing: "0.04em", marginTop: 2,
  },
  seeAll: {
    fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--krypton)",
    letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer",
  },
  rail: {
    display: "grid", gridAutoFlow: "column", gridAutoColumns: "minmax(280px, 1fr)",
    gap: 14, overflowX: "auto", paddingBottom: 6,
    scrollbarWidth: "thin",
  },
};

const FOR_YOU = [
  { id: "frodo", title: "Frodo's Burden", author: "@ringbearer_arc", tag: "every gold ring is a leash", count: "2.7m", grad: "linear-gradient(135deg,#3a4a2a,#16140a)" },
  { id: "hamlet", title: "Hamlet, Reframed", author: "@bookishghost", tag: "the prince refuses the script", count: "1.5m", grad: "linear-gradient(135deg,#1a2538,#0d0d18)" },
  { id: "atticus", title: "Dark Academia: Atticus", author: "@scoutfinch", tag: "the courthouse oath is older than the verdict", count: "1.2m", grad: "linear-gradient(135deg,#3d2a1a,#1a1208)" },
  { id: "beloved", title: "Beloved", author: "@ghostsweetdew", tag: "the past is not a story", count: "1.8m", grad: "linear-gradient(135deg,#2a1a2a,#15081a)" },
  { id: "anna",   title: "Anna at the Station", author: "@karenina_arc", tag: "the train, then the silence", count: "986k", grad: "linear-gradient(135deg,#1f2638,#0a0d18)" },
];

const SCENES = [
  { id: "library", title: "The Library Duel", source: "Pride & Prejudice", creator: "@longbourn_lights", tone: "Tense / Witty", color: "linear-gradient(160deg,#3a2818,#15100a)" },
  { id: "longtable", title: "Dinner at the Long Table", source: "Brideshead Revisited", creator: "@oxford_decay", tone: "Lush / Mournful", color: "linear-gradient(160deg,#5a3a1a,#1a0e08)" },
  { id: "trainstation", title: "Train Station, Last Goodbye", source: "Anna Karenina", creator: "@stationmaster", tone: "Doomed / Quiet", color: "linear-gradient(160deg,#1a2a3a,#08101a)" },
  { id: "cliff", title: "Cliffhouse Storm", source: "Rebecca", creator: "@manderley", tone: "Gothic / Threatened", color: "linear-gradient(160deg,#1a1a2a,#080814)" },
  { id: "garden", title: "The Greenhouse Confession", source: "Atonement", creator: "@summer_1935", tone: "Charged / Unspoken", color: "linear-gradient(160deg,#1a3a2a,#08180e)" },
  { id: "letter", title: "The Letter Never Opened", source: "Persuasion", creator: "@captain_wentworth", tone: "Ache / Restraint", color: "linear-gradient(160deg,#3a2a3a,#180818)" },
];

const QUOTES = [
  { line: "It is a truth universally acknowledged…", source: "Pride & Prejudice", saves: "412k" },
  { line: "Happy families are all alike; every unhappy family is unhappy in its own way.", source: "Anna Karenina", saves: "298k" },
  { line: "Whatever our souls are made of, his and mine are the same.", source: "Wuthering Heights", saves: "1.1m" },
  { line: "Reader, I married him.", source: "Jane Eyre", saves: "562k" },
  { line: "Call me Ishmael.", source: "Moby-Dick", saves: "204k" },
  { line: "All this happened, more or less.", source: "Slaughterhouse-Five — paraphrase", saves: "118k" },
];

const MOMENTS = [
  { id: "m1", label: "The Proposal That Came Too Late", body: "She has already chosen the harder road. The kindness arrives like weather she has stopped checking for." },
  { id: "m2", label: "The Letter Never Opened", body: "He keeps it in a drawer for forty years. Once a year he sets it on the table and does not open it." },
  { id: "m3", label: "The Brother She Chose to Spare", body: "There were two names on the list. She crossed off only one and lived with the rest." },
  { id: "m4", label: "The Lie Told for Love", body: "It was a small lie at first. By the third winter it had a kitchen in it, and a child." },
];

const HOME_CHAR_PROFILES = [
  { name: "Elizabeth Bennet", source: "Pride & Prejudice", arc: "Wit as armor, pride as wound.", real: true,  followers: "1.8m" },
  { name: "Heathcliff",       source: "Wuthering Heights", arc: "Love so total it becomes ruin.",   real: true,  followers: "2.4m" },
  { name: "Anna Karenina",    source: "Tolstoy",            arc: "A woman who chooses the train.",   real: true,  followers: "1.1m" },
  { name: "Vera Solenne",     source: "AI · @duskwriter",   arc: "An aristocrat in a country that no longer exists.", real: false, followers: "84k" },
  { name: "Caleb Marsh",      source: "AI · @prairieghosts",arc: "A widower who builds his late wife a chapel.",       real: false, followers: "62k" },
  { name: "Pip",              source: "Great Expectations", arc: "A fortune that costs a friend.",    real: true,  followers: "740k" },
];

const TRENDING_PLOTS = [
  { id: "p1", title: "The Lighthouse Keeper's Daughter", genre: "Slow Burn / Coastal Gothic", players: "12.4k" },
  { id: "p2", title: "Court of Stolen Roses",            genre: "Dark Romantasy / Court Intrigue", players: "44.1k" },
  { id: "p3", title: "Last Train Out of Yalta",         genre: "Wartime / Forbidden", players: "8.7k" },
  { id: "p4", title: "The Detective Who Forgets",        genre: "Noir / Memory Loop", players: "21.3k" },
  { id: "p5", title: "Saint of the Wheat Fields",        genre: "Magical Realism", players: "5.2k" },
];

const Section = ({ title, sub, children, action = "See all →" }) => (
  <div style={homeStyles.sectionWrap}>
    <div style={homeStyles.sectionHead}>
      <div>
        <div style={homeStyles.sectionTitle}>{title}</div>
        {sub && <div style={homeStyles.sectionSub}>{sub}</div>}
      </div>
      <span style={homeStyles.seeAll}>{action}</span>
    </div>
    {children}
  </div>
);

const ForYouCard = ({ item }) => (
  <div style={{
    background: "var(--obsidian)", border: "1px solid var(--iron)", borderRadius: 14,
    padding: 14, display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
    transition: "border-color 160ms, transform 160ms",
  }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--krypton-dim)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--iron)"; }}
  >
    <div style={{
      width: 76, height: 76, borderRadius: 10, flexShrink: 0,
      background: item.grad, border: "1px solid var(--iron)",
      display: "flex", alignItems: "flex-end", padding: 8,
      fontFamily: "var(--font-display)", fontSize: 9, color: "rgba(255,255,255,0.7)",
      letterSpacing: "0.16em", textTransform: "uppercase",
    }}>{item.id}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{item.title}</div>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>By {item.author}</div>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.tag}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", marginTop: 6, letterSpacing: "0.06em" }}>💬 {item.count}</div>
    </div>
  </div>
);

const SceneCard = ({ scene }) => (
  <div style={{
    height: 280, borderRadius: 14, position: "relative", overflow: "hidden",
    border: "1px solid var(--iron)", cursor: "pointer",
    background: scene.color,
    display: "flex", flexDirection: "column", justifyContent: "flex-end",
    padding: 16,
    transition: "transform 200ms, border-color 200ms",
  }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--krypton)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--iron)"; e.currentTarget.style.transform = "translateY(0)"; }}
  >
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%)",
    }}/>
    <div style={{
      position: "absolute", top: 12, right: 12,
      padding: "5px 10px", borderRadius: 999,
      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
      fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-secondary)",
      letterSpacing: "0.12em", textTransform: "uppercase",
    }}>{scene.tone}</div>
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.2 }}>{scene.title}</div>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontStyle: "italic", color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{scene.source}</div>
      <button style={{
        marginTop: 12, height: 32, padding: "0 14px",
        background: "rgba(0,212,170,0.18)", border: "1px solid var(--krypton)",
        color: "var(--krypton)", borderRadius: 999, cursor: "pointer",
        fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 500, letterSpacing: "0.06em",
      }}>＋ Step into scene</button>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 10, letterSpacing: "0.1em" }}>By {scene.creator}</div>
    </div>
  </div>
);

const QuoteCard = ({ q }) => (
  <div style={{
    background: "var(--obsidian)", border: "1px solid var(--iron)", borderRadius: 14,
    padding: "20px 22px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 12,
    transition: "border-color 160ms",
    minHeight: 180,
  }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--krypton-dim)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--iron)"; }}
  >
    <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.4, letterSpacing: "-0.01em", textWrap: "pretty" }}>
      <span style={{ color: "var(--krypton)", fontSize: 22, marginRight: 4 }}>“</span>
      {q.line}
    </div>
    <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.04em" }}>— {q.source}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-ghost)", letterSpacing: "0.08em" }}>♥ {q.saves}</div>
    </div>
  </div>
);

const MomentCard = ({ m }) => (
  <div style={{
    background: "linear-gradient(180deg, var(--obsidian), var(--near-black))",
    border: "1px solid var(--iron)", borderRadius: 14, padding: 18,
    cursor: "pointer", display: "flex", flexDirection: "column", gap: 8,
    transition: "border-color 160ms",
    minHeight: 190,
  }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--krypton-dim)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--iron)"; }}
  >
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--krypton)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Turning point</div>
    <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, color: "var(--text-primary)", lineHeight: 1.3 }}>{m.label}</div>
    <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, flex: 1 }}>{m.body}</div>
    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
      <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--krypton)", borderBottom: "1px solid var(--krypton-dim)", paddingBottom: 1 }}>Use as opening</span>
    </div>
  </div>
);

const CharCard = ({ c }) => (
  <div style={{
    background: "var(--obsidian)", border: "1px solid var(--iron)", borderRadius: 14,
    padding: 14, cursor: "pointer", display: "flex", flexDirection: "column", gap: 10,
    transition: "border-color 160ms",
    minHeight: 220,
  }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--krypton-dim)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--iron)"; }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        background: c.real ? "linear-gradient(135deg,#3a2a18,#1a0e08)" : "linear-gradient(135deg,#1a2a38,#08101a)",
        border: "1px solid var(--iron)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14,
        color: "rgba(255,255,255,0.85)",
      }}>{c.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 9,
        color: c.real ? "var(--gold)" : "var(--krypton)",
        letterSpacing: "0.16em", textTransform: "uppercase",
        border: `1px solid ${c.real ? "rgba(245,158,11,0.4)" : "var(--krypton-dim)"}`,
        padding: "3px 8px", borderRadius: 999,
      }}>{c.real ? "Canon" : "AI"}</span>
    </div>
    <div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, color: "var(--text-primary)" }}>{c.name}</div>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{c.source}</div>
    </div>
    <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.45, flex: 1 }}>{c.arc}</div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.06em" }}>♥ {c.followers}</span>
      <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--krypton)" }}>Open profile →</span>
    </div>
  </div>
);

const PlotCard = ({ p }) => (
  <div style={{
    width: 240, flexShrink: 0,
    background: "var(--obsidian)", border: "1px solid var(--iron)", borderRadius: 14,
    padding: 14, cursor: "pointer", display: "flex", flexDirection: "column", gap: 10,
    transition: "border-color 160ms",
  }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--krypton-dim)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--iron)"; }}
  >
    <div style={{
      height: 110, borderRadius: 10,
      background: "linear-gradient(135deg, rgba(0,212,170,0.18), rgba(59,130,246,0.12), rgba(245,158,11,0.08))",
      border: "1px solid var(--iron)",
      display: "flex", alignItems: "flex-end", padding: 10,
      fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.6)",
      letterSpacing: "0.18em", textTransform: "uppercase",
    }}>{p.genre.split("/")[0].trim()}</div>
    <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--text-primary)", lineHeight: 1.25 }}>{p.title}</div>
    <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-dim)" }}>{p.genre}</div>
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--krypton)", letterSpacing: "0.1em", marginTop: "auto" }}>● {p.players} writing now</div>
  </div>
);

const Home = () => {
  return (
    <main style={homeStyles.root} data-screen-label="Home">
      <div style={homeStyles.topBar}>
        <div>
          <div style={homeStyles.hello}>Welcome back</div>
          <div style={homeStyles.user}>Director Mode · @nightreader</div>
        </div>
        <div style={{ position: "relative", flex: 1, maxWidth: 460 }}>
          <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </div>
          <input style={homeStyles.search} placeholder="Search scenes, quotes, characters, plots..."/>
        </div>
        <div style={homeStyles.bell}><Icon name="alert" size={18}/></div>
      </div>

      {/* Hero */}
      <div style={homeStyles.hero}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--krypton)", letterSpacing: "0.22em", textTransform: "uppercase" }}>This week on cantina</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, color: "var(--text-primary)", letterSpacing: "-0.02em", marginTop: 8, lineHeight: 1.15, maxWidth: 640 }}>
            Step into the books and films you can't stop thinking about.
          </div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-secondary)", marginTop: 10, maxWidth: 580, lineHeight: 1.5 }}>
            Scenes, quotes, turning points, character profiles — both canon and community-built. Pick a moment, become someone, change the ending.
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button className="btn-cinema">Build a story</button>
            <button style={{
              height: 44, padding: "0 22px", background: "transparent",
              border: "1px solid var(--iron)", color: "var(--text-secondary)",
              borderRadius: 10, cursor: "pointer",
              fontFamily: "var(--font-ui)", fontSize: 13,
            }}>Browse plots</button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          {["BookTok", "Moviecore", "Slow Burn", "Court Intrigue", "Coastal Gothic"].map((t, i) => (
            <span key={t} style={{
              padding: "6px 14px", borderRadius: 999,
              border: "1px solid var(--iron)", background: "var(--obsidian)",
              fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-secondary)",
              letterSpacing: "0.04em",
              opacity: 1 - (i * 0.12),
            }}>#{t}</span>
          ))}
        </div>
      </div>

      <Section title="For you" sub="Picked from your last reading list and saved scenes">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
          {FOR_YOU.map(i => <ForYouCard key={i.id} item={i}/>)}
        </div>
      </Section>

      <Section title="Scenes" sub="Real moments from books and films, ready to step into">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {SCENES.map(s => <SceneCard key={s.id} scene={s}/>)}
        </div>
      </Section>

      <Section title="Quotes" sub="The lines that lived in your head rent-free">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
          {QUOTES.map((q, i) => <QuoteCard key={i} q={q}/>)}
        </div>
      </Section>

      <Section title="Moments" sub="Turning points to start your story from">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {MOMENTS.map(m => <MomentCard key={m.id} m={m}/>)}
        </div>
      </Section>

      <Section title="Character profiles" sub="Canon icons and AI-built originals">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {HOME_CHAR_PROFILES.map(c => <CharCard key={c.name} c={c}/>)}
        </div>
      </Section>

      <Section title="Trending plots" sub="What the community is writing tonight">
        <div style={homeStyles.rail}>
          {TRENDING_PLOTS.map(p => <PlotCard key={p.id} p={p}/>)}
        </div>
      </Section>

      <div style={{ height: 60 }}/>
    </main>
  );
};

window.Home = Home;
