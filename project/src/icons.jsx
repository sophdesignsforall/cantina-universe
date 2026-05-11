// Icon set — minimal stroke icons drawn as inline SVG. 20px default.
const Icon = ({ name, size = 20, color = "currentColor", strokeWidth = 1.5 }) => {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round"
  };
  switch (name) {
    case "home":
      return <svg {...props}><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>;
    case "user":
      return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>;
    case "globe":
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case "map":
      return <svg {...props}><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/></svg>;
    case "atom":
      return <svg {...props}><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="3.5"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-60 12 12)"/></svg>;
    case "film":
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4M3 12h18"/></svg>;
    case "folder":
      return <svg {...props}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>;
    case "link":
      return <svg {...props}><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>;
    case "x":
      return <svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case "plus":
      return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "bolt":
      return <svg {...props}><path d="M13 3L4 14h7l-1 7 9-11h-7z"/></svg>;
    case "check":
      return <svg {...props}><path d="M5 12l5 5 9-11"/></svg>;
    case "edit":
      return <svg {...props}><path d="M4 20h4l10-10-4-4L4 16zM14 6l4 4"/></svg>;
    case "refresh":
      return <svg {...props}><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4"/></svg>;
    case "book":
      return <svg {...props}><path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/></svg>;
    case "panel":
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M12 3v18"/></svg>;
    case "mic":
      return <svg {...props}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></svg>;
    case "clapper":
      return <svg {...props}><path d="M3 9l3-5 3 2 3-3 3 2 3-3 4 2-2 5zM3 9h19v11H3z"/></svg>;
    case "scale":
      return <svg {...props}><path d="M12 3v18M5 7l7-4 7 4M5 7l-2 7a4 4 0 0 0 8 0L5 7zM19 7l2 7a4 4 0 0 1-8 0l6-7z"/></svg>;
    case "crown":
      return <svg {...props}><path d="M3 7l4 5 5-7 5 7 4-5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>;
    case "skull":
      return <svg {...props}><path d="M5 11a7 7 0 1 1 14 0v4l-2 2v3H7v-3l-2-2zM9 11h0M15 11h0M10 17h4"/></svg>;
    case "hand":
      return <svg {...props}><path d="M7 11V5a2 2 0 0 1 4 0v6M11 11V4a2 2 0 0 1 4 0v7M15 11V6a2 2 0 0 1 4 0v9a6 6 0 0 1-12 0v-2L4 9a2 2 0 0 1 3-2"/></svg>;
    case "shield":
      return <svg {...props}><path d="M12 3l8 3v7c0 5-4 7-8 8-4-1-8-3-8-8V6z"/></svg>;
    case "fire":
      return <svg {...props}><path d="M12 3c2 4 6 5 6 11a6 6 0 0 1-12 0c0-2 1-4 2-5 0 2 1 3 2 3-1-3 0-6 2-9z"/></svg>;
    case "play":
      return <svg {...props}><path d="M6 4l14 8-14 8z"/></svg>;
    case "arrowUp":
      return <svg {...props}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
    case "arrowDown":
      return <svg {...props}><path d="M12 5v14M19 12l-7 7-7-7"/></svg>;
    case "arrowRight":
      return <svg {...props}><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
    case "arrowLeftRight":
      return <svg {...props}><path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/></svg>;
    case "swords":
      return <svg {...props}><path d="M14 3h7v7M21 3l-9 9M10 21H3v-7M3 21l9-9M14 21l-3-3M3 14l3-3"/></svg>;
    case "alert":
      return <svg {...props}><path d="M12 3 2 21h20zM12 9v5M12 17.5h.01"/></svg>;
    case "scales":
      return <svg {...props}><path d="M12 3v18M5 21h14M6 7l-3 7a3 3 0 0 0 6 0L6 7zM18 7l-3 7a3 3 0 0 0 6 0L18 7zM6 7l12-2"/></svg>;
    case "flame":
      return <svg {...props}><path d="M12 3c2 4 6 5 6 11a6 6 0 0 1-12 0c0-2 1-4 2-5 0 2 1 3 2 3-1-3 0-6 2-9z"/></svg>;
    case "sparkles":
      return <svg {...props}><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM5 15l.6 1.4 1.4.6-1.4.6L5 19l-.6-1.4L3 17l1.4-.6z"/></svg>;
    case "clock":
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
};

window.Icon = Icon;
