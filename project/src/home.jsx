// home.jsx — Director-framing discovery screen
// OCEAN psyche system + character/universe browser

const OCEAN_DIMS = [
  { key: 'O', color: '#00D4FF', label: 'Openness' },
  { key: 'C', color: '#C9A84C', label: 'Conscientiousness' },
  { key: 'E', color: '#FF8C4B', label: 'Extraversion' },
  { key: 'A', color: '#2DFF78', label: 'Agreeableness' },
  { key: 'N', color: '#CC2200', label: 'Neuroticism' },
];

const HOME_CHARACTERS = [
  {
    id: 'lex',
    name: 'Lex Luthor',
    role: 'Billionaire Architect',
    universe: 'DC Metropolis',
    archetype: 'Strategist',
    ocean: { O: 88, C: 95, E: 72, A: 14, N: 45 },
    tags: ['Villain', 'Intellectual', 'DC'],
    bio: "Humanity's greatest mind, convinced Superman is its greatest threat.",
  },
  {
    id: 'diana',
    name: 'Diana Prince',
    role: 'Warrior Ambassador',
    universe: 'DC Themyscira',
    archetype: 'Hero',
    ocean: { O: 76, C: 82, E: 68, A: 91, N: 22 },
    tags: ['Hero', 'Warrior', 'DC'],
    bio: 'Princess of the Amazons, bridging two worlds with shield and compassion.',
  },
  {
    id: 'joker',
    name: 'The Joker',
    role: 'Agent of Chaos',
    universe: 'DC Gotham',
    archetype: 'Wildcard',
    ocean: { O: 94, C: 8, E: 97, A: 4, N: 98 },
    tags: ['Villain', 'Chaotic', 'DC'],
    bio: 'No origin. No motive. Just the eternal punchline.',
  },
  {
    id: 'bruce',
    name: 'Bruce Wayne',
    role: 'Dark Knight',
    universe: 'DC Gotham',
    archetype: 'Vigilante',
    ocean: { O: 70, C: 97, E: 31, A: 52, N: 64 },
    tags: ['Hero', 'Detective', 'DC'],
    bio: 'Vengeance forged from grief, wielded with surgical precision.',
  },
  {
    id: 'harley',
    name: 'Harley Quinn',
    role: 'Renegade Psychologist',
    universe: 'DC Gotham',
    archetype: 'Wildcard',
    ocean: { O: 88, C: 22, E: 96, A: 48, N: 82 },
    tags: ['Antihero', 'Chaotic', 'DC'],
    bio: 'Former doctor of the mind, now its most colorful patient.',
  },
  {
    id: 'clark',
    name: 'Clark Kent',
    role: 'Last Son of Krypton',
    universe: 'DC Metropolis',
    archetype: 'Hero',
    ocean: { O: 62, C: 88, E: 74, A: 96, N: 18 },
    tags: ['Hero', 'Alien', 'DC'],
    bio: 'Infinite power tempered by small-town Kansas values.',
  },
  {
    id: 'selina',
    name: 'Selina Kyle',
    role: 'Midnight Thief',
    universe: 'DC Gotham',
    archetype: 'Antihero',
    ocean: { O: 78, C: 55, E: 82, A: 44, N: 38 },
    tags: ['Antihero', 'Rogue', 'DC'],
    bio: 'Morality is flexible when survival demands it.',
  },
  {
    id: 'barry',
    name: 'Barry Allen',
    role: 'Scarlet Speedster',
    universe: 'DC Central City',
    archetype: 'Hero',
    ocean: { O: 72, C: 76, E: 88, A: 90, N: 42 },
    tags: ['Hero', 'Speedster', 'DC'],
    bio: 'The fastest man alive, still running from the night his mother died.',
  },
  {
    id: 'arthur',
    name: 'Arthur Curry',
    role: 'King of Atlantis',
    universe: 'DC Atlantis',
    archetype: 'Hero',
    ocean: { O: 64, C: 68, E: 77, A: 72, N: 48 },
    tags: ['Hero', 'Royalty', 'DC'],
    bio: 'Torn between two worlds, sovereign of the deep.',
  },
  {
    id: 'victor',
    name: 'Victor Stone',
    role: 'Man-Machine',
    universe: 'DC Metropolis',
    archetype: 'Hero',
    ocean: { O: 80, C: 84, E: 54, A: 68, N: 66 },
    tags: ['Hero', 'Cyborg', 'DC'],
    bio: 'Rebuilt from tragedy, forever reconciling humanity with hardware.',
  },
];

const HOME_UNIVERSES = [
  {
    id: 'gotham',
    name: 'Gotham City',
    tagline: 'Where darkness is the only law',
    genre: 'Noir / Crime',
    characters: 4,
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #0d1117 50%, #1a1208 100%)',
    accentColor: '#A78BFA',
  },
  {
    id: 'metropolis',
    name: 'Metropolis',
    tagline: 'The city that believes in tomorrow',
    genre: 'Sci-Fi / Hope',
    characters: 3,
    gradient: 'linear-gradient(135deg, #001a2e 0%, #002244 50%, #003366 100%)',
    accentColor: '#00D4FF',
  },
  {
    id: 'themyscira',
    name: 'Themyscira',
    tagline: 'Paradise forged in eternal war',
    genre: 'Mythology / Action',
    characters: 1,
    gradient: 'linear-gradient(135deg, #1a0a00 0%, #2d1a00 50%, #1a0800 100%)',
    accentColor: '#F59E0B',
  },
  {
    id: 'atlantis',
    name: 'Atlantis',
    tagline: 'An empire the surface world forgot',
    genre: 'Fantasy / Political',
    characters: 1,
    gradient: 'linear-gradient(135deg, #001a1a 0%, #003333 50%, #004444 100%)',
    accentColor: '#00D4AA',
  },
  {
    id: 'central-city',
    name: 'Central City',
    tagline: 'Time is just another obstacle',
    genre: 'Sci-Fi / Adventure',
    characters: 1,
    gradient: 'linear-gradient(135deg, #1a0500 0%, #2d0d00 50%, #1a0800 100%)',
    accentColor: '#FF6B35',
  },
  {
    id: 'multiverse',
    name: 'The Multiverse',
    tagline: 'Every choice births a new reality',
    genre: 'Cosmic / Drama',
    characters: 10,
    gradient: 'linear-gradient(135deg, #0a0612 0%, #120a22 50%, #1b1034 100%)',
    accentColor: '#A78BFA',
  },
];

const HERO_VISUALS = [
  {
    gradient: 'radial-gradient(ellipse at 60% 50%, rgba(0,212,170,0.18) 0%, transparent 70%), radial-gradient(ellipse at 20% 80%, rgba(59,130,246,0.12) 0%, transparent 60%)',
    label: 'Build Worlds',
    subtitle: 'From Gotham to the Multiverse',
  },
  {
    gradient: 'radial-gradient(ellipse at 40% 40%, rgba(167,139,250,0.22) 0%, transparent 65%), radial-gradient(ellipse at 70% 70%, rgba(244,114,182,0.10) 0%, transparent 55%)',
    label: 'Shape Characters',
    subtitle: 'OCEAN-mapped psychology',
  },
  {
    gradient: 'radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.18) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(204,34,0,0.12) 0%, transparent 55%)',
    label: 'Run Simulations',
    subtitle: 'Conflict meets consequence',
  },
];

const deriveTraits = (ocean) => {
  const traits = [];
  if (ocean.O > 80) traits.push('Visionary');
  else if (ocean.O < 20) traits.push('Rigid');
  if (ocean.C > 80) traits.push('Meticulous');
  else if (ocean.C < 20) traits.push('Impulsive');
  if (ocean.E > 80) traits.push('Magnetic');
  else if (ocean.E < 20) traits.push('Reclusive');
  if (ocean.A > 80) traits.push('Empathic');
  else if (ocean.A < 20) traits.push('Non-empathic');
  if (ocean.N > 70) traits.push('Volatile');
  else if (ocean.N < 20) traits.push('Unshakeable');
  return traits;
};

const pentAngle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / 5;

const OceanDots = ({ ocean, size = 6, gap = 3 }) => (
  <div style={{ display: 'flex', gap, alignItems: 'center' }}>
    {OCEAN_DIMS.map(({ key, color }) => (
      <div key={key} style={{
        width: size, height: size, borderRadius: '50%',
        background: color,
        opacity: (ocean[key] || 0) / 100,
        boxShadow: `0 0 ${size}px ${color}`,
        flexShrink: 0,
      }}/>
    ))}
  </div>
);

const OceanRadar = ({ ocean, size = 120 }) => {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.42;
  const vals = OCEAN_DIMS.map(d => (ocean[d.key] || 0) / 100);

  const gridPolygon = (scale) =>
    OCEAN_DIMS.map((_, i) => {
      const a = pentAngle(i);
      return `${cx + Math.cos(a) * maxR * scale},${cy + Math.sin(a) * maxR * scale}`;
    }).join(' ');

  const dataPoints = OCEAN_DIMS.map((_, i) => {
    const a = pentAngle(i);
    const r = maxR * vals[i];
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });

  const dataPolygon = dataPoints.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {[0.25, 0.5, 0.75, 1].map(s => (
        <polygon key={s} points={gridPolygon(s)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      ))}
      {OCEAN_DIMS.map((_, i) => {
        const a = pentAngle(i);
        return (
          <line key={i} x1={cx} y1={cy}
            x2={cx + Math.cos(a) * maxR} y2={cy + Math.sin(a) * maxR}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1"
          />
        );
      })}
      <polygon
        points={dataPolygon}
        fill="rgba(0,212,170,0.15)"
        stroke="rgba(0,212,170,0.7)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={OCEAN_DIMS[i].color} opacity={0.9}/>
      ))}
      {OCEAN_DIMS.map(({ key, color }, i) => {
        const a = pentAngle(i);
        const lx = cx + Math.cos(a) * (maxR + 14);
        const ly = cy + Math.sin(a) * (maxR + 14);
        return (
          <text key={key} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fontFamily="DM Mono, monospace" fontWeight="500" fill={color} opacity={0.85}
          >{key}</text>
        );
      })}
    </svg>
  );
};

const CharacterModal = ({ char, onClose, onNavigate }) => {
  const traits = deriveTraits(char.ocean);
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(6px)',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'var(--r-xl)',
          maxWidth: 560, width: '100%',
          padding: 32,
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 'var(--r-lg)',
            background: 'linear-gradient(135deg, var(--teal-soft), rgba(255,255,255,0.03))',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, flexShrink: 0, color: 'var(--teal)',
          }}>
            {char.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{char.name}</div>
            <div style={{ fontSize: 13, color: 'var(--teal)', marginBottom: 4 }}>{char.role}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace' }}>{char.universe}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)', fontSize: 18, padding: 4, lineHeight: 1,
            }}
          >✕</button>
        </div>

        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 24 }}>
          {char.bio}
        </p>

        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          <OceanRadar ocean={char.ocean} size={140} />
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10,
            }}>
              Psyche Profile
            </div>
            {OCEAN_DIMS.map(({ key, color }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 16, fontSize: 10, fontFamily: 'DM Mono, monospace', color, fontWeight: 600 }}>{key}</div>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${char.ocean[key]}%`,
                    background: color, borderRadius: 2,
                    boxShadow: `0 0 8px ${color}`,
                    transition: 'width 0.6s ease',
                  }}/>
                </div>
                <div style={{ width: 28, textAlign: 'right', fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.4)' }}>
                  {char.ocean[key]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {traits.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
            {traits.map(t => (
              <span key={t} style={{
                padding: '3px 10px', borderRadius: 999,
                background: 'rgba(0,212,170,0.1)',
                border: '1px solid rgba(0,212,170,0.25)',
                fontSize: 11, color: 'var(--teal)', fontWeight: 500,
              }}>{t}</span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          {char.tags.map(t => (
            <span key={t} style={{
              padding: '2px 8px', borderRadius: 4,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: 10, color: 'rgba(255,255,255,0.45)',
              fontFamily: 'DM Mono, monospace',
            }}>{t}</span>
          ))}
        </div>

        <button
          onClick={() => {
            onClose();
            if (onNavigate) onNavigate('forge');
            else if (window.navigateTo) window.navigateTo('forge');
          }}
          style={{
            width: '100%', padding: '12px 0',
            background: 'var(--teal)', border: 'none',
            borderRadius: 'var(--r-md)',
            color: 'var(--accent-ink)', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', letterSpacing: '0.02em',
          }}
        >
          Open in Character Forge
        </button>
      </div>
    </div>
  );
};

const CharacterCard = ({ char, onOpen }) => (
  <button
    onClick={() => onOpen(char)}
    style={{
      flexShrink: 0, width: 160,
      background: 'var(--bg-elevated)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 'var(--r-lg)',
      padding: '14px 12px',
      cursor: 'pointer', textAlign: 'left',
      transition: 'border-color 0.2s, transform 0.2s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'rgba(0,212,170,0.35)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 'var(--r-md)',
      background: 'linear-gradient(135deg, var(--teal-soft), rgba(255,255,255,0.03))',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 18, marginBottom: 10, color: 'var(--teal)',
    }}>
      {char.name[0]}
    </div>
    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 2, lineHeight: 1.3 }}>
      {char.name}
    </div>
    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontFamily: 'DM Mono, monospace' }}>
      {char.archetype}
    </div>
    <OceanDots ocean={char.ocean} size={5} gap={2} />
  </button>
);

const UniverseCard = ({ universe, onNavigate }) => (
  <button
    onClick={() => {
      if (onNavigate) onNavigate('world');
      else if (window.navigateTo) window.navigateTo('world');
    }}
    style={{
      flexShrink: 0, width: 220, height: 130,
      borderRadius: 'var(--r-lg)',
      border: '1px solid rgba(255,255,255,0.06)',
      background: universe.gradient,
      padding: '16px 14px',
      cursor: 'pointer', textAlign: 'left',
      position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.2s, transform 0.2s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = universe.accentColor + '55';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <div style={{
      position: 'absolute', top: 0, right: 0,
      width: 80, height: 80, borderRadius: '50%',
      background: universe.accentColor, opacity: 0.06,
      filter: 'blur(24px)', transform: 'translate(20px, -20px)',
    }}/>
    <div style={{ position: 'relative' }}>
      <div style={{
        fontSize: 9, fontFamily: 'DM Mono, monospace', fontWeight: 500,
        color: universe.accentColor, marginBottom: 6,
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        {universe.genre}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
        {universe.name}
      </div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
        {universe.tagline}
      </div>
    </div>
    <div style={{
      position: 'absolute', bottom: 12, right: 14,
      fontSize: 10, fontFamily: 'DM Mono, monospace',
      color: universe.accentColor, opacity: 0.7,
    }}>
      {universe.characters} chars
    </div>
  </button>
);

const ScrollSection = ({ title, badge, children, cta, onCta }) => (
  <div style={{ marginBottom: 40 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14, paddingLeft: 32 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>
        {title}
      </span>
      {badge && (
        <span style={{
          fontSize: 9, fontFamily: 'DM Mono, monospace',
          color: 'var(--teal)', padding: '1px 6px',
          border: '1px solid rgba(0,212,170,0.3)',
          borderRadius: 3, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>{badge}</span>
      )}
      {cta && (
        <button
          onClick={onCta}
          style={{
            marginLeft: 'auto', marginRight: 32,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 11, color: 'rgba(255,255,255,0.35)',
            fontFamily: 'DM Mono, monospace',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
        >
          {cta} →
        </button>
      )}
    </div>
    <div style={{
      display: 'flex', gap: 10,
      overflowX: 'auto', paddingLeft: 32, paddingRight: 32, paddingBottom: 8,
      scrollbarWidth: 'none',
    }}>
      {children}
    </div>
  </div>
);

const HomeScreen = ({ onNavigate }) => {
  const [heroIdx, setHeroIdx] = React.useState(0);
  const [activeChar, setActiveChar] = React.useState(null);

  React.useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % HERO_VISUALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    if (onNavigate) window.navigateTo = onNavigate;
  }, [onNavigate]);

  const handleNavigate = (screen) => {
    if (onNavigate) onNavigate(screen);
    else if (window.navigateTo) window.navigateTo(screen);
  };

  const heroVisual = HERO_VISUALS[heroIdx];

  const forYouChars = React.useMemo(() => {
    const shuffled = [...HOME_CHARACTERS].sort(() => 0.5 - Math.random());
    return shuffled.map((c, i) => ({ ...c, isAU: i < 2 }));
  }, []);

  const villains = HOME_CHARACTERS.filter(c => c.tags.includes('Villain') || c.tags.includes('Antihero'));

  return (
    <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' }}>
      {/* Hero Banner */}
      <div style={{
        position: 'relative', minHeight: 260,
        display: 'flex', alignItems: 'stretch',
        overflow: 'hidden', marginBottom: 40,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: heroVisual.gradient,
          transition: 'background 1s ease',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 60%, var(--bg-base) 100%)',
        }}/>

        {/* Left 60% */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '60%', padding: '48px 48px 40px 32px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 10, fontFamily: 'DM Mono, monospace',
            letterSpacing: '0.15em', color: 'var(--teal)',
            textTransform: 'uppercase', marginBottom: 10, fontWeight: 500,
          }}>
            Director Mode
          </div>
          <h1 style={{ margin: 0, marginBottom: 10, fontSize: 34, fontWeight: 700, lineHeight: 1.15, color: '#fff' }}>
            {heroVisual.label}
          </h1>
          <p style={{ margin: 0, marginBottom: 24, fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
            {heroVisual.subtitle}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => handleNavigate('forge')}
              style={{
                padding: '9px 20px', background: 'var(--teal)',
                border: 'none', borderRadius: 'var(--r-md)',
                color: 'var(--accent-ink)', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', letterSpacing: '0.02em',
              }}
            >
              Create Character
            </button>
            <button
              onClick={() => handleNavigate('world')}
              style={{
                padding: '9px 20px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--r-md)',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Build Universe
            </button>
          </div>
        </div>

        {/* Right 40% */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '40%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
          <div style={{ opacity: 0.7 }}>
            <OceanRadar ocean={{ O: 72, C: 84, E: 65, A: 78, N: 32 }} size={100} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {HERO_VISUALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                style={{
                  width: heroIdx === i ? 20 : 6, height: 6, borderRadius: 3,
                  background: heroIdx === i ? 'var(--teal)' : 'rgba(255,255,255,0.2)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'width 0.3s, background 0.3s',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: Featured Characters */}
      <ScrollSection title="Featured Characters" cta="Open Forge" onCta={() => handleNavigate('forge')}>
        {HOME_CHARACTERS.map(c => (
          <CharacterCard key={c.id} char={c} onOpen={setActiveChar} />
        ))}
      </ScrollSection>

      {/* Section 2: Universes */}
      <ScrollSection title="Universes" cta="World Architect" onCta={() => handleNavigate('world')}>
        {HOME_UNIVERSES.map(u => (
          <UniverseCard key={u.id} universe={u} onNavigate={handleNavigate} />
        ))}
      </ScrollSection>

      {/* Section 3: For You */}
      <ScrollSection title="For You" badge="Curated">
        {forYouChars.map(c => (
          <div key={c.id} style={{ position: 'relative' }}>
            {c.isAU && (
              <div style={{
                position: 'absolute', top: 6, right: 6, zIndex: 1,
                fontSize: 8, fontFamily: 'DM Mono, monospace',
                background: 'var(--gold)', color: '#000',
                padding: '1px 5px', borderRadius: 3,
                fontWeight: 700, letterSpacing: '0.06em',
              }}>AU</div>
            )}
            <CharacterCard char={c} onOpen={setActiveChar} />
          </div>
        ))}
      </ScrollSection>

      {/* Section 4: Trending Villains */}
      <ScrollSection title="Trending Villains" badge="Dark" cta="Run Simulation" onCta={() => handleNavigate('sim')}>
        {villains.map(c => (
          <CharacterCard key={c.id} char={c} onOpen={setActiveChar} />
        ))}
      </ScrollSection>

      {activeChar && (
        <CharacterModal
          char={activeChar}
          onClose={() => setActiveChar(null)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
};

window.Home = HomeScreen;
window.HomeScreen = HomeScreen;
