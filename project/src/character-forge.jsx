// CHARACTER FORGE — Build Superman's psychological matrix
const forgeStyles = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "var(--near-black)",
    overflow: "hidden",
  },
  body: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "70% 30%",
    gap: 0,
    overflow: "hidden",
    minHeight: 0,
  },
  leftCol: {
    padding: "26px 32px 30px",
    overflowY: "auto",
    borderRight: "1px solid var(--iron)",
    display: "flex",
    flexDirection: "column",
    gap: 28,
  },
  rightCol: {
    padding: "26px 36px 30px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 26,
  },
  identityRow: {
    display: "flex",
    gap: 22,
    alignItems: "flex-start",
  },
  portraitWrap: {
    width: 220,
    height: 220,
    flexShrink: 0,
    border: "1px solid var(--krypton-dim)",
    boxShadow: "0 0 24px rgba(0,212,255,0.18), inset 0 0 30px rgba(0,0,0,0.5)",
    background: "var(--obsidian)",
    overflow: "hidden",
  },
  ident: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingTop: 4,
  },
  textarea: {
    width: "100%",
    minHeight: 170,
    background: "var(--obsidian)",
    border: "1px solid var(--iron)",
    padding: "16px 18px",
    fontFamily: "var(--font-body)",
    fontSize: 17,
    lineHeight: 1.7,
    color: "var(--text-primary)",
    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.04 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
  },
  enneagram: {
    background: "var(--obsidian)",
    border: "1px solid rgba(201,168,76,0.4)",
    borderRadius: 16,
    padding: "20px 22px",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: 22,
    alignItems: "center",
  },
};

// Dynamic clinical descriptions per dimension/range — psychiatry meets literary analysis
const RANGES = {
  psychopathy: [
    [15, "Clinically hyperempathic. Decision-making delayed by emotional weight of consequences."],
    [35, "Within normal empathic range. Moral reasoning emotionally informed, not paralyzed."],
    [60, "Reduced affective empathy. Can compartmentalize harm to execute necessary decisions."],
    [80, "Significant psychopathic traits. Harm is calculated, not felt. Strategic relationships."],
    [100, "Clinical psychopathy. Zero affective empathy. Violence is a tool. Others are resources."],
  ],
  empathy: [
    [15, "Functionally alexithymic. Cannot identify others' emotional states."],
    [35, "Low affective empathy. Understands emotion intellectually but rarely feels it."],
    [65, "Typical empathic range. Responds to emotional cues. Can be overwhelmed."],
    [85, "High empathy. Others' pain registers physically. Moral sensitivity is extreme."],
    [100, "Hyperempathic. A child crying three miles away stops him mid-flight."],
  ],
  moralRigidity: [
    [20, "Pure situational ethics. Every decision contextual. Highly unpredictable."],
    [45, "Flexible moral framework. Rules can be bent under sufficient pressure."],
    [70, "Strong principles with exception clauses. Hard to corrupt but not impossible."],
    [90, "Near-absolute moral code. Will not kill. Bends only at existential cost."],
    [100, "Categorical imperative mode. Zero exceptions. The code IS the identity."],
  ],
  ambition: [
    [20, "Contentment-dominant. Never wanted to be Superman. Wanted to be Clark."],
    [45, "Moderate drive. Accomplishes what is needed without seeking recognition."],
    [70, "Goal-oriented. Builds toward something, though not at cost of relationships."],
    [88, "High ambition. Legacy-aware. Sacrifices relationships for progress."],
    [100, "Dominance-seeking. Will compromise ethics to secure position."],
  ],
  volatility: [
    [20, "Extraordinary emotional regulation. Breaks things when alone. Never in front of others."],
    [40, "Strong regulation with minor pressure valves. Withdrawal under stress."],
    [65, "Typical range. Visible frustration under sustained pressure. Recovers within hours."],
    [82, "Reactive. Emotional flooding in high stakes. Impulse control deteriorates."],
    [100, "Explosive. Rage events disproportionate, destructive, poorly remembered after."],
  ],
  loyalty: [
    [20, "Transactional bonds only. Departure when usefulness ends."],
    [50, "Moderate loyalty. Maintains commitments but self-interest sets a ceiling."],
    [78, "Genuinely loyal. Will sacrifice convenience but not survival."],
    [95, "Deep loyalty. Lois Lane is the only person who makes him human."],
    [100, "Total loyalty. Would kill for the few he loves. The bond cannot be taken from him."],
  ],
  sacrifice: [
    [20, "Strong self-preservation instinct. Altruism is calculated, not felt."],
    [45, "Moderate. Will take personal loss for clear gain. Internal resistance present."],
    [72, "Genuine sacrifice capacity. Absorbs significant personal cost for the greater good."],
    [92, "Self-erasure tendency. He carries the world because no one else will."],
    [100, "Martyrdom profile. Subconscious seeking of sacrifice scenarios. Death as fulfillment."],
  ],
  shadow: [
    [20, "Psychologically integrated. What you see is what you get. No hidden architecture."],
    [40, "Mild repression. Occasional incongruence between stated values and behavior."],
    [60, "Significant shadow. Wonders, in the dark, if Zod was right."],
    [82, "Deep shadow. Public persona is armor. Private self barely recognized."],
    [100, "Fractured identity. The shadow dominates. The 'real' self is the mask."],
  ],
};

const dynamicDesc = (key, value) => {
  const range = RANGES[key] || [];
  for (const [cap, text] of range) if (value <= cap) return text;
  return range[range.length - 1]?.[1] || "";
};

const DIMENSIONS = [
  { key: "psychopathy",  label: "Psychopathy",          value: 12 },
  { key: "empathy",      label: "Empathy",              value: 94 },
  { key: "moralRigidity",label: "Moral Rigidity",       value: 78 },
  { key: "ambition",     label: "Ambition",             value: 18 },
  { key: "volatility",   label: "Volatility",           value: 24 },
  { key: "loyalty",      label: "Loyalty Depth",        value: 97 },
  { key: "sacrifice",    label: "Self-Sacrifice",       value: 91 },
  { key: "shadow",       label: "Shadow (Hidden Self)", value: 45 },
];

const valueColor = (v, dim) => {
  if (v <= 30) return "var(--text-dim)";
  if (v <= 70) return "var(--text-primary)";
  if (v <= 90) return "var(--krypton)";
  if (dim === "shadow" || dim === "psychopathy" || dim === "volatility") return "var(--blood)";
  return "var(--krypton)";
};

const MatrixSlider = ({ dim, value, onChange, compact = false }) => {
  const trackRef = React.useRef(null);
  const [drag, setDrag] = React.useState(false);

  const move = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    onChange(pct);
  };

  React.useEffect(() => {
    if (!drag) return;
    const onMove = (e) => move(e.clientX);
    const onUp = () => setDrag(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [drag]);

  return (
    <div className="slider-row">
      <div className="top">
        <span className="slider-dim-label" style={compact ? { fontSize: 11 } : {}}>{dim.label}</span>
        <span className="slider-dim-value" style={{ color: valueColor(value, dim.key), ...(compact ? { fontSize: 18 } : {}) }}>{value}%</span>
      </div>
      <div
        className="slider-track"
        ref={trackRef}
        onMouseDown={(e) => { setDrag(true); move(e.clientX); }}
      >
        <div className="slider-fill" style={{ width: `${value}%` }}>
          <div className="slider-thumb"/>
        </div>
      </div>
      <div className="slider-desc" style={compact ? { fontSize: 12 } : {}}>{dynamicDesc(dim.key, value)}</div>
    </div>
  );
};

const TagPill = ({ children, onRemove }) => (
  <span className="pill italic" style={{ marginRight: 8, marginBottom: 8 }}>
    <span className="pill-text">{children}</span>
    <button onClick={onRemove} style={{ marginLeft: 6, color: "var(--text-ghost)", fontSize: 14, lineHeight: 1, padding: 0, cursor: "pointer" }}>×</button>
  </span>
);

const CharacterSwitcher = ({ activeId, onSelect }) => (
  <div style={{
    flexShrink: 0,
    height: 100,
    background: "var(--steel)",
    borderTop: "1px solid var(--krypton-dim)",
    display: "flex",
    alignItems: "center",
    gap: 22,
    padding: "0 32px",
    overflowX: "auto",
  }}>
    {CHARACTERS.map(c => {
      const isActive = c.id === activeId;
      return (
        <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }} onClick={() => onSelect(c.id)}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            border: isActive ? "2px solid var(--krypton)" : "1px solid var(--iron)",
            boxShadow: isActive ? "0 0 18px var(--krypton-glow)" : "none",
            overflow: "hidden",
            background: "var(--obsidian)",
          }}>
            <FigurePortrait id={c.id} grayscale={!isActive}/>
          </div>
          <span style={{
            fontFamily: "var(--font-ui)", fontSize: 10,
            color: isActive ? "var(--text-primary)" : "var(--text-dim)",
            letterSpacing: "0.05em",
          }}>{c.first}</span>
        </div>
      );
    })}
    <button
      onClick={() => { if (window.navigateTo) window.navigateTo('home'); }}
      title="Add new character"
      style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "transparent",
        border: "1.5px dashed var(--teal)",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        color: "var(--teal)", fontSize: 22, fontWeight: 300,
        transition: "all 0.15s ease",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(0,212,170,0.08)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >+</button>
  </div>
);

// Personality radar — 6-axis spider chart driven by live matrix values
const RADAR_AXES = [
  { key: "empathy",      label: "Empathy" },
  { key: "moralRigidity",label: "Morality" },
  { key: "loyalty",      label: "Loyalty" },
  { key: "sacrifice",    label: "Sacrifice" },
  { key: "shadow",       label: "Shadow" },
  { key: "psychopathy",  label: "Psychopathy" },
];

const PersonalityRadar = ({ matrix }) => {
  const cx = 150, cy = 150, R = 100;
  const n = RADAR_AXES.length;
  // Start at top
  const angle = (i) => (-Math.PI / 2) + (i * 2 * Math.PI / n);
  const point = (i, r) => [cx + Math.cos(angle(i)) * r, cy + Math.sin(angle(i)) * r];
  const polyPoints = RADAR_AXES.map((a, i) => point(i, R * (matrix[a.key] / 100)).join(","));
  const labelPoint = (i) => point(i, R + 22);

  return (
    <div style={{
      background: "var(--obsidian)",
      border: "1px solid var(--iron)",
      borderRadius: 16,
      padding: "20px 22px 26px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--krypton)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Personality Topology</span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontStyle: "italic", color: "var(--text-dim)" }}>Live shape of self</span>
      </div>
      <svg viewBox="0 0 300 300" style={{ width: "100%", height: 280, display: "block" }}>
        {/* Concentric guides */}
        {[0.25, 0.5, 0.75, 1].map(r => (
          <polygon key={r}
            points={RADAR_AXES.map((_, i) => point(i, R * r).join(",")).join(" ")}
            fill="none" stroke="var(--iron)" strokeWidth="1" opacity={r === 1 ? 0.5 : 0.25}/>
        ))}
        {/* Axes */}
        {RADAR_AXES.map((a, i) => (
          <line key={a.key} x1={cx} y1={cy} x2={point(i, R)[0]} y2={point(i, R)[1]} stroke="var(--iron)" strokeWidth="1" opacity="0.5"/>
        ))}
        {/* Data polygon */}
        <polygon
          points={polyPoints.join(" ")}
          fill="rgba(0,212,170,0.16)"
          stroke="rgba(0,212,170,0.85)"
          strokeWidth="1.5"
          style={{ transition: "all 350ms cubic-bezier(0.4,0,0.2,1)" }}
        />
        {/* Data points */}
        {RADAR_AXES.map((a, i) => {
          const [x, y] = point(i, R * (matrix[a.key] / 100));
          return <circle key={a.key} cx={x} cy={y} r="4" fill="var(--krypton)" style={{ transition: "all 350ms cubic-bezier(0.4,0,0.2,1)" }}/>;
        })}
        {/* Labels */}
        {RADAR_AXES.map((a, i) => {
          const [x, y] = labelPoint(i);
          return (
            <text key={a.key} x={x} y={y}
              textAnchor="middle" dominantBaseline="middle"
              style={{ fontFamily: "var(--font-display)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", fill: "var(--text-dim)" }}>
              {a.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const SpotifySection = ({ onOceanDerived, onTraitsAdded }) => {
  const SA = window.SpotifyAuth;
  const SP = window.SpotifyPsyche;
  const [connected, setConnected] = React.useState(() => !!(SA && SA.getToken()));
  const [url, setUrl] = React.useState('');
  const [analyzing, setAnalyzing] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [nowPlaying, setNowPlaying] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('code') && SA) {
      SA.handleCallback().then(token => { if (token) setConnected(true); });
    }
  }, []);

  const analyze = async () => {
    if (!url.trim() || !SA || !SP) return;
    setAnalyzing(true); setError(null);
    try {
      const id = SP.parsePlaylistId(url);
      const playlist = await SA.getPlaylist(id);
      const tracks = playlist.tracks.items.map(i => i.track).filter(Boolean);
      const artistIds = [...new Set(tracks.flatMap(t => t.artists.map(a => a.id)))];
      const artists = await SA.getArtistGenres(artistIds);
      const ocean = SP.deriveOCEAN(playlist, artists);
      const genres = artists.flatMap(a => a.genres || []);
      const traits = SP.deriveTraits(genres);
      const genreCount = {};
      genres.forEach(g => { genreCount[g] = (genreCount[g] || 0) + 1; });
      const topGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([g]) => g);
      const topTracks = tracks.slice(0, 5).map(t => ({
        name: t.name, artist: t.artists[0]?.name,
        image: t.album?.images?.[2]?.url, uri: t.uri,
      }));
      setResult({ name: playlist.name, trackCount: tracks.length, topGenres, topTracks, traits, ocean });
      if (onOceanDerived) onOceanDerived(ocean);
      if (onTraitsAdded) onTraitsAdded(traits);
    } catch (e) {
      setError('Could not analyze playlist — check the URL and try again.');
      console.error(e);
    }
    setAnalyzing(false);
  };

  const spotifyIcon = (size, fill) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );

  return (
    <div style={{ background: "rgba(29,185,84,0.07)", border: "1px solid rgba(29,185,84,0.35)", borderRadius: 12, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "11px 16px", borderBottom: "1px solid rgba(29,185,84,0.2)", display: "flex", alignItems: "center", gap: 9 }}>
        {spotifyIcon(15, "#1DB954")}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#1DB954", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Spotify Psyche</span>
        <span style={{ fontSize: 11, color: "var(--text-dim)" }}>Derive character from music</span>
        {connected && <span style={{ marginLeft: "auto", fontSize: 10, color: "#1DB954", fontFamily: "var(--font-mono)" }}>● CONNECTED</span>}
      </div>

      <div style={{ padding: "14px 16px" }}>
        {!connected ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
            <span style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>
              Connect Spotify and paste any playlist URL to derive this character's psyche from music
            </span>
            <button
              onClick={() => SA && SA.login()}
              style={{ flexShrink: 0, background: "#1DB954", border: "none", borderRadius: 24, padding: "9px 18px", color: "#000", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}
            >
              {spotifyIcon(13, "#000")} Connect Spotify
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: error || result ? 10 : 0 }}>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && analyze()}
                placeholder="https://open.spotify.com/playlist/…"
                style={{ flex: 1, background: "var(--obsidian)", border: "1px solid var(--iron)", borderRadius: 7, padding: "7px 11px", color: "var(--text-primary)", fontSize: 11, fontFamily: "var(--font-mono)", outline: "none" }}
              />
              <button
                onClick={analyze}
                disabled={analyzing || !url.trim()}
                style={{ background: analyzing ? "var(--obsidian)" : "#1DB954", border: "none", borderRadius: 7, padding: "7px 14px", color: analyzing ? "var(--text-dim)" : "#000", fontWeight: 700, fontSize: 11, cursor: analyzing ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}
              >{analyzing ? "Analyzing…" : "Analyze"}</button>
            </div>

            {error && (
              <div style={{ fontSize: 11, color: "#FF6644", background: "rgba(204,34,0,0.1)", border: "1px solid rgba(204,34,0,0.25)", borderRadius: 6, padding: "7px 10px", marginBottom: 10 }}>{error}</div>
            )}

            {result && (
              <div>
                <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 8 }}>
                  <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{result.name}</span> · {result.trackCount} tracks analyzed
                </div>
                <div style={{ background: "rgba(29,185,84,0.08)", border: "1px solid rgba(29,185,84,0.25)", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#1DB954", marginBottom: 10 }}>
                  ✓ Psyche matrix updated from music
                </div>
                {result.topGenres.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-ghost)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Dominant genres</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {result.topGenres.map((g, i) => (
                        <span key={i} style={{ fontSize: 10, color: "var(--text-secondary)", background: "var(--obsidian)", border: "1px solid var(--iron)", borderRadius: 20, padding: "2px 9px" }}>{g}</span>
                      ))}
                    </div>
                  </div>
                )}
                {result.traits.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-ghost)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Character traits derived</div>
                    {result.traits.map((t, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, flexShrink: 0 }}/>
                        <span style={{ fontSize: 12, color: "var(--text-primary)" }}>{t.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                {result.topTracks.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-ghost)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Tracks</div>
                    {result.topTracks.map((t, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 0", borderBottom: i < result.topTracks.length - 1 ? "1px solid var(--iron)" : "none" }}>
                        {t.image ? <img src={t.image} style={{ width: 28, height: 28, borderRadius: 3, objectFit: "cover", flexShrink: 0 }}/> : <div style={{ width: 28, height: 28, borderRadius: 3, background: "var(--obsidian)", flexShrink: 0 }}/>}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                          <div style={{ fontSize: 10, color: "var(--text-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.artist}</div>
                        </div>
                        <button
                          onClick={() => { window.open("https://open.spotify.com/track/" + t.uri.split(":")[2], "_blank"); setNowPlaying(t.uri); }}
                          style={{ background: nowPlaying === t.uri ? "#1DB954" : "var(--obsidian)", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                        >
                          <svg width="7" height="9" viewBox="0 0 10 12" fill={nowPlaying === t.uri ? "#000" : "#1DB954"}><path d="M0 0l10 6-10 6z"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => { SA && SA.logout(); setConnected(false); setResult(null); setUrl(''); }}
                  style={{ background: "none", border: "none", color: "var(--text-ghost)", fontSize: 11, cursor: "pointer", fontFamily: "var(--font-mono)" }}
                >Disconnect Spotify</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TypologyCards = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
    <div style={{ background: "var(--obsidian)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 16, padding: "18px 20px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>Enneagram</div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 38, color: "var(--gold)", letterSpacing: "0.04em", lineHeight: 1 }}>2w1</div>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)", marginTop: 8, fontWeight: 500 }}>The Servant with a Conscience</div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontStyle: "italic", color: "var(--text-secondary)", marginTop: 4 }}>Core fear: being unloved for who he truly is.</div>
    </div>
    <div style={{ background: "var(--obsidian)", border: "1px solid var(--krypton-dim)", borderRadius: 16, padding: "18px 20px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>MBTI</div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 38, color: "var(--krypton)", letterSpacing: "0.04em", lineHeight: 1 }}>INFJ</div>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)", marginTop: 8, fontWeight: 500 }}>The Advocate</div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontStyle: "italic", color: "var(--text-secondary)", marginTop: 4 }}>Idealist with private depths. Reads people too well.</div>
    </div>
  </div>
);

const CharacterForge = () => {
  const [matrix, setMatrix] = React.useState(() =>
    Object.fromEntries(DIMENSIONS.map(d => [d.key, d.value]))
  );
  const [activeChar, setActiveChar] = React.useState("superman");
  // Per-character backstory store, seeded from CHARACTERS roster.
  const [backstories, setBackstories] = React.useState(() =>
    Object.fromEntries(CHARACTERS.map(c => [c.id, c.backstory]))
  );
  const active = CHARACTERS.find(c => c.id === activeChar) || CHARACTERS[0];
  const backstory = backstories[activeChar] || "";
  const setBackstory = (val) => setBackstories(p => ({ ...p, [activeChar]: val }));

  const setVal = (k, v) => setMatrix(p => ({ ...p, [k]: v }));
  const [refsOpen, setRefsOpen] = React.useState(() => false);
  const [refs, setRefs] = React.useState([
    "Voldemort's tragic origin driving inhuman behavior",
    "Aragorn's reluctance to claim power",
    "Hamlet's paralysis between action and doubt",
  ]);

  // Spotify OCEAN → matrix mapping
  const handleOceanDerived = (ocean) => {
    setMatrix(prev => ({
      ...prev,
      empathy:      ocean.A,
      volatility:   ocean.N,
      ambition:     ocean.E,
      shadow:       Math.round((100 - ocean.C + ocean.N) / 2),
      moralRigidity: ocean.C,
      sacrifice:    ocean.A,
      psychopathy:  Math.round(100 - ocean.A),
      loyalty:      Math.round((ocean.A + ocean.C) / 2),
    }));
  };

  const handleTraitsAdded = (traits) => {
    const newRefs = traits.map(t => `Music-derived: ${t.label}`);
    setRefs(prev => [...prev, ...newRefs.filter(r => !prev.includes(r))]);
  };

  return (
    <div style={forgeStyles.root}>
      <div className="screen-header">
        <div className="screen-header-title">Character forge</div>
        <div className="screen-header-rule"/>
      </div>

      <div style={forgeStyles.body}>
        {/* LEFT — IDENTITY */}
        <div style={forgeStyles.leftCol}>
          <SpotifySection
            onOceanDerived={handleOceanDerived}
            onTraitsAdded={handleTraitsAdded}
          />

          <div style={forgeStyles.identityRow}>
            <div className="corner-frame" style={forgeStyles.portraitWrap} key={active.id}>
              <FigurePortrait id={active.id}/>
            </div>
            <div style={forgeStyles.ident}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{active.first}</div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-dim)" }}>{active.handle}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--krypton)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 4 }}>{active.archetype}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontStyle: "italic", color: "var(--text-secondary)", marginTop: 8 }}>{active.origin}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-ui)", fontSize: 11, letterSpacing: "0.18em", color: "var(--text-secondary)", marginTop: 12, textTransform: "uppercase" }}>
                <span className="dot green"/> Active
              </div>
            </div>
          </div>

          <div>
            <div className="section-head">
              <span className="label-eyebrow">Origin Chronicle</span>
              <div className="section-rule"/>
            </div>
            <textarea
              style={forgeStyles.textarea}
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
            />
            <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-ghost)", marginTop: 6 }}>
              {backstory.length} / 2400
            </div>
          </div>

          <div>
            <div className="section-head">
              <span className="label-eyebrow">Character References</span>
              <div className="section-rule"/>
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-dim)", marginBottom: 14 }}>
              Anchor this character's traits to existing archetypes
            </div>
            <div>
              {refs.map(r => (
                <TagPill key={r} onRemove={() => setRefs(refs.filter(x => x !== r))}>{r}</TagPill>
              ))}
              <span className="pill dashed" style={{ display: "inline-flex", cursor: "pointer" }} onClick={() => setRefsOpen(true)}>+ Add Reference</span>
            </div>
            <ReferenceLibraryModal
              open={refsOpen}
              onClose={() => setRefsOpen(false)}
              initialTags={refs}
              onSave={setRefs}
            />
          </div>
        </div>

        {/* RIGHT — MATRIX */}
        <div style={forgeStyles.rightCol}>
          <div>
            <div className="section-head">
              <span className="label-eyebrow krypton">Psychological Architecture</span>
              <div className="section-rule krypton"/>
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-dim)", marginTop: -4, marginBottom: 22 }}>
              All simulation outputs derive from these values
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
              {DIMENSIONS.map(d => (
                <MatrixSlider key={d.key} dim={d} value={matrix[d.key]} onChange={(v) => setVal(d.key, v)} compact={true}/>
              ))}
            </div>
          </div>

          <PersonalityRadar matrix={matrix}/>

          <TypologyCards/>

          <div>
            <span className="pill krypton" style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "8px 16px" }}>
              The Burdened Savior
            </span>
          </div>

          <button className="btn-cinema">
            <Icon name="check" size={14}/> Save Character
          </button>
        </div>
      </div>

      <CharacterSwitcher activeId={activeChar} onSelect={setActiveChar}/>
    </div>
  );
};

window.CharacterForge = CharacterForge;
