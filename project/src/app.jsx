// Tweakable defaults — keep this block as valid JSON between the markers.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "cantina",
  "mood": "Cinematic",
  "weight": "Default"
}/*EDITMODE-END*/;

// App shell — sidebar + active screen
const App = () => {
  const [screen, setScreen] = React.useState("home");
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const Screen = {
    home:  window.Home,
    forge: window.CharacterForge,
    world: window.WorldArchitect,
    map:   window.WorldMap,
    sim:   window.SimulationRoom,
    clip:  window.ClipStudio,
  }[screen];

  return (
    <React.Fragment>
      <TweakLayer palette={tweaks.palette} mood={tweaks.mood} weight={tweaks.weight}/>
      <div className="app grain" data-screen-label={
        screen === "home"  ? "Home" :
        screen === "forge" ? "Character Forge" :
        screen === "world" ? "World Architect" :
        screen === "map"   ? "World Pressure Map" :
        screen === "sim"   ? "Simulation Room" :
        "Clip Studio"
      }>
        <PortraitGradients/>
        <Sidebar active={screen} onSelect={setScreen}/>
        {Screen && <Screen/>}
      </div>
      <UniverseTweaks tweaks={tweaks} setTweak={setTweak}/>
    </React.Fragment>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
