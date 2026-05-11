// MODAL — UNIVERSE design spec (simplified, robust close behavior)

const Modal = ({
  open,
  onClose,
  eyebrow,
  title,
  subtitle,
  children,
  primaryLabel = "Confirm",
  secondaryLabel = "Cancel",
  onPrimary,
  onSecondary,
  width = 680,
  maxHeight = "calc(100vh - 64px)",
}) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose && onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;

  const closeNow = () => { if (onClose) onClose(); };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) closeNow(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 4000,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div
        role="dialog" aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: width,
          maxHeight: maxHeight,
          display: "flex", flexDirection: "column",
          background: "#0F0F1A",
          border: "1px solid #1A1A2E",
          borderRadius: 20,
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
          position: "relative",
          fontFamily: 'var(--font-ui)',
        }}
      >
        <button
          type="button" aria-label="Close"
          onClick={closeNow}
          style={{
            position: "absolute", top: 16, right: 16, width: 36, height: 36,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--text-dim)", fontSize: 20, lineHeight: 1, padding: 0,
            zIndex: 10,
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-dim)"}
        >✕</button>

        {(eyebrow || title || subtitle) && (
          <div style={{ padding: "32px 36px 18px", flexShrink: 0 }}>
            {eyebrow && (
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--krypton)",
                textTransform: "uppercase", letterSpacing: "0.22em", marginBottom: 10,
              }}>{eyebrow}</div>
            )}
            {title && (
              <div style={{
                fontFamily: '"DM Sans", system-ui, sans-serif',
                fontSize: 22, fontWeight: 700, color: "var(--text-primary)",
                letterSpacing: "-0.01em", lineHeight: 1.25,
              }}>{title}</div>
            )}
            {subtitle && (
              <div style={{
                fontFamily: "var(--font-ui)",
                fontSize: 14, color: "var(--text-secondary)",
                marginTop: 8, lineHeight: 1.5,
              }}>{subtitle}</div>
            )}
            <div style={{ height: 1, background: "#1A1A2E", marginTop: 22 }}/>
          </div>
        )}

        <div style={{
          color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6,
          padding: "4px 36px 28px",
          overflowY: "auto", flex: 1, minHeight: 0,
        }}>
          {children}
        </div>

        {(onPrimary || onSecondary) && (
          <div style={{ padding: "0 36px 28px", flexShrink: 0 }}>
            <div style={{ height: 1, background: "#1A1A2E", marginBottom: 20 }}/>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              {onSecondary !== null && (
                <button
                  onClick={onSecondary || closeNow}
                  style={{
                    height: 44, padding: "0 20px",
                    background: "transparent", border: "1px solid var(--iron)",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500,
                    borderRadius: 10, cursor: "pointer",
                  }}
                >{secondaryLabel}</button>
              )}
              <button
                onClick={onPrimary}
                style={{
                  height: 44, padding: "0 22px",
                  background: "transparent", border: "1px solid var(--krypton)",
                  color: "var(--krypton)",
                  fontFamily: "var(--font-ui)",
                  fontSize: 13, fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  borderRadius: 10, cursor: "pointer",
                }}
              >{primaryLabel}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

window.Modal = Modal;
