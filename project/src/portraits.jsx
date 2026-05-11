// Cinematic portrait registry. Real photos for every character;
// uses <img> + onError so a failed asset falls back to a colored crest
// instead of producing a blank black panel.

const PortraitGradients = () => null; // legacy export — no longer used

// Pool of every photo asset in /assets that's a character (not a location).
// Used so the registry can guarantee a non-empty image even if a specific
// asset is missing.
const POOL = [
  "assets/char-superman-cavill.webp",
  "assets/char-batman2.webp",
  "assets/char-saint.jpg",
  "assets/char-atom.avif",
  "assets/char-lois2.jpg",
  "assets/char-superman-new.jpg",
  "assets/char-supergirl.jpg",
  "assets/char-harley.webp",
  "assets/char-terrific.avif",
  "assets/char-robin.jpeg",
  "assets/char-flying.jpg",
  "assets/superman.webp",
  "assets/batman.webp",
  "assets/lois.jpg",
];

// Real photo registry — every character has a primary + fallback list.
const PHOTO_PORTRAITS = {
  superman: { src: "assets/char-superman-cavill.webp", pos: "center 22%" },
  batman:   { src: "assets/char-batman2.webp",         pos: "center 18%" },
  wonder:   { src: "assets/char-saint.jpg",            pos: "center 20%" },
  zod:      { src: "assets/char-atom.avif",            pos: "center 30%" },
  lois:     { src: "assets/char-lois2.jpg",            pos: "center 22%" },
  jonathan: { src: "assets/char-superman-new.jpg",     pos: "center 22%" },
  supergirl:{ src: "assets/char-supergirl.jpg",        pos: "center 28%" },
  harley:   { src: "assets/char-harley.webp",          pos: "center 22%" },
  terrific: { src: "assets/char-terrific.avif",        pos: "center 28%" },
  robin:    { src: "assets/char-robin.jpeg",           pos: "center 18%" },
};

// Stable color crests for each id — shown if every image fails.
const ACCENT = {
  superman: "#1f3a5f", batman: "#1a1a22", wonder:  "#5c3a1a",
  zod:      "#1a3a3a", lois:   "#3a1f3a", jonathan:"#3a2a18",
  supergirl:"#3a341a", harley: "#3a1a2a", terrific:"#1a2a3a",
  robin:    "#3a1f1a",
};

const FigurePortrait = ({ id, grayscale = false }) => {
  const photo = PHOTO_PORTRAITS[id];
  const fallbacks = React.useMemo(() => {
    // Try the assigned src first, then walk the pool for redundancy.
    const list = [];
    if (photo?.src) list.push(photo.src);
    for (const p of POOL) if (!list.includes(p)) list.push(p);
    return list;
  }, [id]);

  const [idx, setIdx] = React.useState(0);
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => { setIdx(0); setFailed(false); }, [id]);

  const handleError = () => {
    if (idx < fallbacks.length - 1) setIdx(idx + 1);
    else setFailed(true);
  };

  if (failed || !fallbacks.length) {
    // Final fallback: solid accent crest with initial.
    const accent = ACCENT[id] || "#1a1a26";
    const initial = (id || "?")[0].toUpperCase();
    return (
      <div style={{
        width: "100%", height: "100%",
        background: `linear-gradient(135deg, ${accent}, #0a0a10)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 48,
        color: "rgba(255,255,255,0.6)", letterSpacing: "-0.02em",
        filter: grayscale ? "grayscale(100%) brightness(0.55)" : "none",
        transition: "filter 200ms ease",
      }}>{initial}</div>
    );
  }

  return (
    <img
      src={fallbacks[idx]}
      onError={handleError}
      alt=""
      draggable={false}
      style={{
        width: "100%", height: "100%",
        objectFit: "cover",
        objectPosition: photo?.pos || "center 25%",
        display: "block",
        filter: grayscale ? "grayscale(100%) brightness(0.55)" : "saturate(0.95) contrast(1.04)",
        transition: "filter 200ms ease",
      }}
    />
  );
};

// Full character roster. Each has a portrait, identity text, persona summary,
// and a default backstory used when that character is the active forge subject.
const CHARACTERS = [
  {
    id: "superman", first: "Kal-El", handle: "Superman / Clark Kent",
    archetype: "The Reluctant God", origin: "Krypton → Smallville, Kansas", accent: "#00D4AA",
    backstory: "Born of a dying world, raised in Kansas wheat fields. The last son of Krypton crash-landed into the arms of two people who taught him that strength is restraint. He carries his father's voice — both fathers — and the quiet terror that he is alone in his power.",
  },
  {
    id: "batman", first: "Bruce", handle: "Batman / Bruce Wayne",
    archetype: "The Wounded Hunter", origin: "Crime Alley → Wayne Manor, Gotham", accent: "#888899",
    backstory: "A child stood between two corpses in an alley off Park Row and decided the world would not have him as it had them. He built an empire by day and a war by night. He does not sleep. He does not stop.",
  },
  {
    id: "wonder", first: "Diana", handle: "Wonder Woman / Diana Prince",
    archetype: "The Witness", origin: "Themyscira → London, 1918", accent: "#C9A84C",
    backstory: "She walked off a hidden island into the worst war humanity had ever made. She has watched a hundred years of it since. Her loyalty is to the thing she swore to protect on a beach in 1918 — that humanity is worth the saving.",
  },
  {
    id: "zod", first: "Atom", handle: "Atom Smasher / Albert Rothstein",
    archetype: "The Reluctant Heir", origin: "Pittsburgh → JSA legacy", accent: "#3B82F6",
    backstory: "He grew up on stories of the grandfather he never met — Atom, of the Justice Society. The size came in college. The name came later. He carries it like a hand-me-down jacket.",
  },
  {
    id: "lois", first: "Lois", handle: "Lois Lane",
    archetype: "The Witness Bearer", origin: "Metropolis · Daily Planet bullpen", accent: "#D4B870",
    backstory: "She has interviewed warlords without raising her voice. She loves a man who is also a god and treats him, in private, like the farm boy he insists he is. She knows the world will eventually take him. She files anyway.",
  },
  {
    id: "jonathan", first: "Jonathan", handle: "Jonathan Kent (Pa)",
    archetype: "The Quiet Anchor", origin: "Smallville, Kansas", accent: "#A88060",
    backstory: "He found a child in a crater and raised him to be good before he knew he had to be great. He never lifted a car or stopped a bullet. He made breakfast. He worried.",
  },
  {
    id: "supergirl", first: "Kara", handle: "Supergirl / Kara Zor-El",
    archetype: "The Last Witness", origin: "Argo City → Earth, age 23", accent: "#F0C040",
    backstory: "She remembers Krypton. The architecture, the song the wind made through the towers, the precise hour of its ending. She came down whole — and grieving — into a world that calls her hopeful.",
  },
  {
    id: "harley", first: "Harley", handle: "Harley Quinn / Dr. Quinzel",
    archetype: "The Wild Card", origin: "Gotham · Arkham Asylum (former staff)", accent: "#FF4D8F",
    backstory: "She had a doctorate by twenty-six. She had a clown by twenty-eight. She left him at thirty-one, took half his rolodex, and has been a spectacular problem for the city of Gotham ever since.",
  },
  {
    id: "terrific", first: "Michael", handle: "Mr. Terrific / Michael Holt",
    archetype: "The Strategist", origin: "Chicago → Hall of Justice", accent: "#00B8D4",
    backstory: "Three doctorates by twenty-four. Olympic decathlete. Lost his wife and unborn son in a single night and rebuilt himself around a code: fair play. Has, on three separate occasions, out-thought a god.",
  },
  {
    id: "robin", first: "Dick", handle: "Robin / Dick Grayson",
    archetype: "The Inheritor", origin: "Haly's Circus → Wayne Manor", accent: "#E25822",
    backstory: "He saw his parents fall from the high wire when he was nine and was raised by a man who never recovered from his own version of that night. He is the only person Bruce trusts with a key.",
  },
];

window.PortraitGradients = PortraitGradients;
window.FigurePortrait = FigurePortrait;
window.CHARACTERS = CHARACTERS;
