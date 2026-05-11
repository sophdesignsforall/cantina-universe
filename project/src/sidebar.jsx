// Fixed left sidebar — 72px collapsed, 240px expanded on hover
const sidebarStyles = {
  wrap: {
    height: "100vh",
    background: "var(--near-black)",
    borderRight: "1px solid var(--iron)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    overflow: "hidden",
    transition: "width 220ms cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    zIndex: 50,
  },
  logo: {
    height: 64,
    display: "flex",
    alignItems: "center",
    paddingLeft: 26,
    gap: 14,
    borderBottom: "1px solid var(--iron)",
    flexShrink: 0,
  },
  logoMark: {
    width: 28, height: 28,
    objectFit: "contain",
    flexShrink: 0,
    display: "block",
  },
  logoText: {
    fontFamily: "var(--font-display)",
    fontSize: 18,
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  navItem: (active) => ({
    height: 56,
    display: "flex",
    alignItems: "center",
    paddingLeft: 26,
    gap: 18,
    borderLeft: active ? "3px solid var(--krypton)" : "3px solid transparent",
    paddingLeft: active ? 23 : 26,
    background: active ? "var(--steel)" : "transparent",
    color: active ? "var(--text-primary)" : "var(--text-dim)",
    cursor: "pointer",
    transition: "background 160ms, color 160ms",
    position: "relative",
  }),
  navIcon: (active) => ({
    color: active ? "var(--krypton)" : "var(--text-dim)",
    filter: active ? "drop-shadow(0 0 6px var(--krypton-glow))" : "none",
    flexShrink: 0,
    width: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  navLabel: {
    fontFamily: "var(--font-ui)",
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  },
  divider: {
    height: 1,
    background: "var(--iron)",
    margin: "12px 16px",
  },
  bottom: {
    marginTop: "auto",
    padding: 18,
    borderTop: "1px solid var(--iron)",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1A2A4A, #0F0F1A)",
    border: "1px solid var(--iron)",
    flexShrink: 0,
  },
};

const NAV = [
  { id: "home",      icon: "home",  label: "Home" },
  { divider: true },
  { id: "forge",     icon: "user",  label: "Character Forge" },
  { id: "world",     icon: "globe", label: "World Architect" },
  { id: "map",       icon: "map",   label: "World Pressure Map" },
  { id: "sim",       icon: "atom",  label: "Simulation Room" },
  { id: "clip",      icon: "film",  label: "Clip Studio" },
  { divider: true },
  { id: "universes", icon: "folder",label: "My Universes",    soon: true },
  { id: "export",    icon: "link",  label: "Export IP",       soon: true },
];

const Sidebar = ({ active, onSelect }) => {
  const [hover, setHover] = React.useState(false);
  const w = hover ? 240 : 72;

  return (
    <nav
      style={{ ...sidebarStyles.wrap, width: w }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={sidebarStyles.logo}>
        <img src="assets/cantina-mark.jpg" alt="Cantina" style={{...sidebarStyles.logoMark, borderRadius: 6}}/>
        {hover && <div style={sidebarStyles.logoText}>cantina.ai</div>}
      </div>

      <div style={{ paddingTop: 10 }}>
        {NAV.map((item, idx) => {
          if (item.divider) return <div key={idx} style={sidebarStyles.divider}/>;
          const isActive = item.id === active;
          return (
            <div
              key={item.id}
              style={sidebarStyles.navItem(isActive)}
              onClick={() => !item.disabled && !item.soon && onSelect(item.id)}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={sidebarStyles.navIcon(isActive)}>
                <Icon name={item.icon} size={20}/>
              </div>
              {hover && (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={sidebarStyles.navLabel}>{item.label}</span>
                  {item.soon && (
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-ghost)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Coming soon</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={sidebarStyles.bottom}>
        <div style={sidebarStyles.avatar}/>
        {hover && (
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Director Mode</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--krypton)" }}>
              <span className="dot"/> Active
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};

window.Sidebar = Sidebar;
