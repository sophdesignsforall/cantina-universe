// Tweaks layer — three expressive controls that reshape the universe's feel.
//
// 1. Universe vibe   — palette swap (Cantina / Krypton / Crimson / Phantom Zone)
// 2. Mood            — surface treatment (Editorial / Cinematic / Mythic)
// 3. Cinematic weight — density + scale (Compact / Default / Cinematic)

const PALETTES = {
  cantina: {
    name: "Cantina",
    swatch: ["#00D4AA", "#3B82F6", "#F59E0B"],
    accent:        "#00D4AA",
    accentDeep:    "#00A887",
    accentSoft:    "rgba(0, 212, 170, 0.12)",
    accentGlow:    "rgba(0, 212, 170, 0.28)",
    accentFaint:   "rgba(0, 212, 170, 0.06)",
    accentInk:     "#003328",
    gold:          "#F59E0B",
    blood:         "#EF4444",
    bloodFaint:    "rgba(239, 68, 68, 0.3)",
    bgBase:        "#0A0A0A",
    bgSubtle:      "#141414",
    bgElevated:    "#1A1A1A",
  },
  krypton: {
    name: "Krypton",
    swatch: ["#00D4FF", "#C9A84C", "#CC2200"],
    accent:        "#00D4FF",
    accentDeep:    "#0099C9",
    accentSoft:    "rgba(0, 212, 255, 0.14)",
    accentGlow:    "rgba(0, 212, 255, 0.35)",
    accentFaint:   "rgba(0, 212, 255, 0.07)",
    accentInk:     "#002736",
    gold:          "#C9A84C",
    blood:         "#CC2200",
    bloodFaint:    "rgba(204, 34, 0, 0.34)",
    bgBase:        "#080810",
    bgSubtle:      "#0F0F1A",
    bgElevated:    "#15152A",
  },
  crimson: {
    name: "Crimson",
    swatch: ["#E5B547", "#CC2200", "#1A1208"],
    accent:        "#E5B547",
    accentDeep:    "#B5872B",
    accentSoft:    "rgba(229, 181, 71, 0.14)",
    accentGlow:    "rgba(229, 181, 71, 0.35)",
    accentFaint:   "rgba(229, 181, 71, 0.06)",
    accentInk:     "#1A1208",
    gold:          "#E5B547",
    blood:         "#CC2200",
    bloodFaint:    "rgba(204, 34, 0, 0.4)",
    bgBase:        "#0C0805",
    bgSubtle:      "#15100A",
    bgElevated:    "#1F1813",
  },
  phantom: {
    name: "Phantom",
    swatch: ["#A78BFA", "#22D3EE", "#1A0E33"],
    accent:        "#A78BFA",
    accentDeep:    "#7C5CE0",
    accentSoft:    "rgba(167, 139, 250, 0.14)",
    accentGlow:    "rgba(167, 139, 250, 0.4)",
    accentFaint:   "rgba(167, 139, 250, 0.06)",
    accentInk:     "#0E0820",
    gold:          "#22D3EE",
    blood:         "#F472B6",
    bloodFaint:    "rgba(244, 114, 182, 0.34)",
    bgBase:        "#0A0612",
    bgSubtle:      "#120A22",
    bgElevated:    "#1B1034",
  },
};

const MOODS = {
  Editorial: {
    name: "Editorial",
    grain: 0,        // none
    glowMul: 0.4,    // diminished glows
    radiusMul: 0.6,  // tighter radii
    vignette: 0,
  },
  Cinematic: {
    name: "Cinematic",
    grain: 0.05,
    glowMul: 1,
    radiusMul: 1,
    vignette: 0.25,
  },
  Mythic: {
    name: "Mythic",
    grain: 0.11,
    glowMul: 1.7,
    radiusMul: 1.4,
    vignette: 0.55,
  },
};

const WEIGHTS = {
  Compact: { name: "Compact", pad: 0.78, gap: 0.78, font: 0.92, line: 1.45 },
  Default: { name: "Default", pad: 1.00, gap: 1.00, font: 1.00, line: 1.55 },
  Cinematic: { name: "Cinematic", pad: 1.30, gap: 1.30, font: 1.08, line: 1.85 },
};

// Inject a <style> tag whose contents are derived from the current tweaks.
// Single source of truth — every visual change funnels through these CSS vars
// or class flags on <html>.
const TweakLayer = ({ palette: pKey, mood: mKey, weight: wKey }) => {
  const p = PALETTES[pKey] || PALETTES.cantina;
  const m = MOODS[mKey]    || MOODS.Cinematic;
  const w = WEIGHTS[wKey]  || WEIGHTS.Default;

  React.useEffect(() => {
    const r = document.documentElement;
    // Palette
    r.style.setProperty("--teal", p.accent);
    r.style.setProperty("--teal-deep", p.accentDeep);
    r.style.setProperty("--teal-soft", p.accentSoft);
    r.style.setProperty("--teal-glow", p.accentGlow);
    r.style.setProperty("--teal-faint", p.accentFaint);
    r.style.setProperty("--krypton-glow", p.accentGlow);
    r.style.setProperty("--krypton-dim", p.accentSoft);
    r.style.setProperty("--accent-ink", p.accentInk);
    r.style.setProperty("--warning", p.gold);
    r.style.setProperty("--gold", p.gold);
    r.style.setProperty("--error", p.blood);
    r.style.setProperty("--blood", p.blood);
    r.style.setProperty("--blood-faint", p.bloodFaint);
    r.style.setProperty("--bg-base", p.bgBase);
    r.style.setProperty("--bg-subtle", p.bgSubtle);
    r.style.setProperty("--bg-elevated", p.bgElevated);

    // Mood — glow intensity multiplier consumed by .btn-cinema:hover etc.
    r.style.setProperty("--glow-mul", String(m.glowMul));
    r.style.setProperty("--grain-opacity", String(m.grain));
    r.style.setProperty("--vignette-opacity", String(m.vignette));
    r.style.setProperty("--radius-mul", String(m.radiusMul));
    r.style.setProperty("--r-md",  `${Math.round(8  * m.radiusMul)}px`);
    r.style.setProperty("--r-lg",  `${Math.round(12 * m.radiusMul)}px`);
    r.style.setProperty("--r-xl",  `${Math.round(16 * m.radiusMul)}px`);
    r.style.setProperty("--r-2xl", `${Math.round(20 * m.radiusMul)}px`);

    // Cinematic weight
    r.style.setProperty("--w-pad", String(w.pad));
    r.style.setProperty("--w-gap", String(w.gap));
    r.style.setProperty("--w-font", String(w.font));
    r.style.setProperty("--w-line", String(w.line));
  }, [pKey, mKey, wKey]);

  // Override-style block. Targeted, not a sledgehammer — these are the rules
  // most affected by the tweaks above.
  const styleTxt = `
    body { font-size: ${Math.round(14 * w.font)}px; }
    .screen-header { padding: ${Math.round(22 * w.pad)}px ${Math.round(32 * w.pad)}px 0; }
    .screen-header-title { font-size: ${Math.round(22 * w.font)}px; }
    .slider-row { gap: ${Math.round(10 * w.gap)}px; }
    .slider-desc { line-height: ${w.line}; font-size: ${Math.round(13 * w.font)}px; }
    .btn-cinema:hover { box-shadow: 0 0 ${Math.round(24 * m.glowMul)}px var(--teal-glow); }
    .slider-fill { box-shadow: 0 0 ${Math.round(12 * m.glowMul)}px var(--teal-glow); }
    .slider-thumb { box-shadow: 0 0 0 3px var(--teal), 0 0 ${Math.round(12 * m.glowMul)}px var(--teal-glow); }
    .corner-frame::before, .corner-frame::after {
      box-shadow: 0 0 ${Math.round(10 * m.glowMul)}px var(--teal-glow);
    }

    /* Mood: vignette + grain layered over the app shell */
    .app::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 50;
      background:
        radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,${m.vignette}) 100%);
      opacity: 1;
    }
    .app::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 51;
      opacity: ${m.grain};
      background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
      mix-blend-mode: overlay;
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: styleTxt }} />;
};

// ─── Tweaks panel UI ───
const UniverseTweaks = ({ tweaks, setTweak }) => {
  const PaletteSwatch = ({ id, palette, active }) => (
    <button
      onClick={() => setTweak("palette", id)}
      className="universe-palette-btn"
      style={{
        position: "relative",
        flex: 1,
        height: 56,
        borderRadius: 10,
        border: active ? "1.5px solid #fff" : "0.5px solid rgba(0,0,0,0.12)",
        boxShadow: active ? "0 0 0 2px rgba(0,0,0,0.06)" : "none",
        background: palette.bgBase,
        overflow: "hidden",
        cursor: "pointer",
        padding: 0,
      }}
      title={palette.name}
    >
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "6px 7px",
      }}>
        <div style={{ display: "flex", gap: 3 }}>
          {palette.swatch.map((c, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: 999, background: c,
              boxShadow: i === 0 ? `0 0 8px ${c}` : "none",
            }}/>
          ))}
        </div>
        <div style={{
          fontSize: 9.5, fontWeight: 600, letterSpacing: "0.04em",
          color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.6)",
        }}>{palette.name}</div>
      </div>
    </button>
  );

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Universe vibe"/>
      <div style={{ display: "flex", gap: 6 }}>
        {Object.entries(PALETTES).map(([k, p]) => (
          <PaletteSwatch key={k} id={k} palette={p} active={tweaks.palette === k}/>
        ))}
      </div>

      <TweakSection label="Mood"/>
      <TweakRadio
        label="Surface treatment"
        value={tweaks.mood}
        options={Object.keys(MOODS)}
        onChange={(v) => setTweak("mood", v)}
      />

      <TweakSection label="Cinematic weight"/>
      <TweakRadio
        label="Density &amp; scale"
        value={tweaks.weight}
        options={Object.keys(WEIGHTS)}
        onChange={(v) => setTweak("weight", v)}
      />
    </TweaksPanel>
  );
};

window.TweakLayer = TweakLayer;
window.UniverseTweaks = UniverseTweaks;
