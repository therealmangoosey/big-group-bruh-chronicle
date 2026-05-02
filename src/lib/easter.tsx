import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export const EGG_LIST = [
  { id: "leon-letter", name: "The Letter" },
  { id: "goon-timer", name: "38 Minutes" },
  { id: "vault-glitch", name: "Vault Breach" },
  { id: "great-sound", name: "Hospital Air" },
  { id: "pixel", name: "Pixel of Truth" },
  { id: "afk", name: "Patient Watcher" },
  { id: "name-typed", name: "Speak Their Name" },
  { id: "scroll-loop", name: "Round Trip" },
  { id: "rapid-click", name: "Click Demon" },
  { id: "long-hover", name: "Stat Stalker" },
] as const;
export type EggId = typeof EGG_LIST[number]["id"];

type EggCtx = {
  found: Set<EggId>;
  count: number;
  total: number;
  trigger: (id: EggId, payload?: any) => void;
  active: { id: EggId; payload?: any } | null;
  dismiss: () => void;
  revealCounter: boolean;
  showOnce: boolean;
  setShowOnce: (v: boolean) => void;
  resetEggs: () => void;
};

const Ctx = createContext<EggCtx | null>(null);

const KEY = "bgb-eggs-v1";
const ONCE_KEY = "bgb-eggs-once-v1";

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const [found, setFound] = useState<Set<EggId>>(() => new Set());
  const [active, setActive] = useState<{ id: EggId; payload?: any } | null>(null);
  const [showOnce, setShowOnceState] = useState<boolean>(true);

  // hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFound(new Set(JSON.parse(raw)));
      const o = localStorage.getItem(ONCE_KEY);
      if (o !== null) setShowOnceState(o === "1");
    } catch {}
  }, []);

  const persist = (s: Set<EggId>) => {
    try { localStorage.setItem(KEY, JSON.stringify([...s])); } catch {}
  };
  const setShowOnce = useCallback((v: boolean) => {
    setShowOnceState(v);
    try { localStorage.setItem(ONCE_KEY, v ? "1" : "0"); } catch {}
  }, []);
  const resetEggs = useCallback(() => {
    setFound(new Set());
    try { localStorage.removeItem(KEY); } catch {}
  }, []);

  const trigger = useCallback((id: EggId, payload?: any) => {
    setFound((prev) => {
      const already = prev.has(id);
      // Only show overlay if first time, OR user wants every trigger to replay
      if (!already || !showOnce) setActive({ id, payload });
      if (already) return prev;
      const next = new Set(prev); next.add(id); persist(next); return next;
    });
  }, [showOnce]);

  const dismiss = useCallback(() => setActive(null), []);

  // global listeners
  useEffect(() => {
    let typed = "";
    const NAMES = ["leon","charlie","ruby","emma","lloyd","coral","josephy","matilda"];
    let lastInput = Date.now();
    const onKey = (e: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastInput > 2500) typed = "";
      lastInput = now;
      if (e.key.length === 1) typed = (typed + e.key.toLowerCase()).slice(-20);
      if (typed.includes("goon")) { typed = ""; trigger("goon-timer"); }
      else if (NAMES.some((n) => typed.includes(n))) {
        const hit = NAMES.find((n) => typed.includes(n))!;
        typed = ""; trigger("name-typed", { name: hit });
      }
    };
    window.addEventListener("keydown", onKey);

    // afk
    let afk = window.setTimeout(() => trigger("afk"), 30_000);
    const reset = () => { window.clearTimeout(afk); afk = window.setTimeout(() => trigger("afk"), 30_000); };
    window.addEventListener("mousemove", reset);
    window.addEventListener("scroll", reset, { passive: true });
    window.addEventListener("keydown", reset);

    // scroll loop: hit bottom then back to top
    let hitBottom = false;
    const onScroll = () => {
      const sc = document.documentElement;
      if (sc.scrollTop + window.innerHeight >= sc.scrollHeight - 8) hitBottom = true;
      else if (hitBottom && sc.scrollTop < 8) { hitBottom = false; trigger("scroll-loop"); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("scroll", reset);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(afk);
    };
  }, [trigger]);

  const value = useMemo<EggCtx>(() => ({
    found, count: found.size, total: EGG_LIST.length, trigger, active, dismiss,
    revealCounter: true,
    showOnce, setShowOnce, resetEggs,
  }), [found, active, trigger, dismiss, showOnce, setShowOnce, resetEggs]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <EggOverlay />
      <EggCounter />
    </Ctx.Provider>
  );
}

export function useEggs() {
  const c = useContext(Ctx);
  if (!c) throw new Error("EasterEggProvider missing");
  return c;
}

function EggCounter() {
  const { count, total, found, showOnce, setShowOnce, resetEggs } = useEggs();
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 70,
      background: "rgba(10,10,10,.92)", backdropFilter: "blur(8px)",
      borderBottom: "1px solid var(--border)",
      color: "var(--lime)", fontFamily: "var(--font-body)", fontSize: 12,
    }}>
      <div className="page" style={{ padding: "6px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", animation: "none" }}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{ background: "transparent", color: "var(--lime)", border: "none", fontWeight: 800, letterSpacing: ".05em", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
          aria-expanded={open}
        >
          🥚 Easter Eggs · <span className="tabular-nums">{count} / {total}</span>
          <span style={{ opacity: .6 }}>{open ? "▲ hide list" : "▼ show list"}</span>
          {count === total && <a href="/secret-final" style={{ color: "var(--hot)", marginLeft: 8 }}>· UNLOCKED →</a>}
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", opacity: .85 }}>
          <input
            type="checkbox"
            checked={showOnce}
            onChange={(e) => setShowOnce(e.target.checked)}
            style={{ accentColor: "var(--lime)" }}
          />
          <span style={{ color: "white" }}>Only show each secret once</span>
        </label>
      </div>
      {open && (
        <div className="page" style={{ padding: "0 16px 10px", animation: "none" }}>
          <ol style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 6 }}>
            {EGG_LIST.map((e, i) => {
              const got = found.has(e.id);
              return (
                <li key={e.id} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 10px", borderRadius: 999,
                  background: got ? "rgba(46,204,113,.15)" : "rgba(255,255,255,.04)",
                  border: `1px solid ${got ? "var(--lime)" : "var(--border)"}`,
                  color: got ? "var(--lime)" : "rgba(255,255,255,.7)",
                  fontSize: 11, fontWeight: 700,
                }}>
                  <span>{got ? "✓" : String(i + 1).padStart(2, "0")}</span>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</span>
                </li>
              );
            })}
          </ol>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, color: "rgba(255,255,255,.6)", fontSize: 11 }}>
            <span>Hints live on <a href="/easter-eggs" style={{ color: "var(--lime)", textDecoration: "underline" }}>/easter-eggs</a>.</span>
            <button onClick={() => { if (confirm("Reset all found secrets?")) resetEggs(); }} style={{ background: "transparent", border: "1px solid var(--border)", color: "rgba(255,255,255,.7)", borderRadius: 999, padding: "2px 10px", cursor: "pointer", fontSize: 11 }}>
              Reset progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function beep(freq = 220, dur = 0.3, type: OscillatorType = "sawtooth") {
  try {
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ac = new AC();
    const o = ac.createOscillator(); const g = ac.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.15, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + dur);
  } catch {}
}

function EggOverlay() {
  const { active, dismiss, count, total } = useEggs();
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    if (!active) return;
    setGlitch(true); beep(110, 0.25, "square");
    const t = setTimeout(() => setGlitch(false), 600);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;
  const labels: Record<EggId, { stamp: string; title: string; body: ReactNode }> = {
    "leon-letter": {
      stamp: "LEAKED",
      title: "fake_apology_letter_FINAL_v3.txt",
      body: (
        <div className="text-sm space-y-2">
          <p>To whoever is reading this,</p>
          <p>I, Leon, would like to formally apologise for my <b>6,484</b> messages, my <b>406</b> curses, my <b>1,282</b> midnight rants, and especially the time I wished a piano would lock onto Charlie's exact location.</p>
          <p>I take full accountability. None of it will happen again. Probably.</p>
          <p className="pixel text-[10px]">— Leon, possibly under duress</p>
        </div>
      ),
    },
    "goon-timer": {
      stamp: "??:??:??",
      title: "countdown.exe",
      body: <GoonCountdown />,
    },
    "vault-glitch": {
      stamp: "TOP SECRET",
      title: "vault_leak_001.redact",
      body: (
        <div className="text-sm space-y-2">
          <p>One file slipped through the redactions:</p>
          <pre className="p-2 border-2 border-black bg-black text-[var(--lime)] text-xs whitespace-pre-wrap">
{`[████████████ ███████ ████ ████ ███]
[CLEAR TEXT FRAGMENT]: "delete this i was joking"
[████ ████████████ ███████ ███ ████ █]`}
          </pre>
        </div>
      ),
    },
    "great-sound": {
      stamp: "AMBIENT",
      title: "hospital_room_07.wav",
      body: <HospitalAmbient />,
    },
    "pixel": {
      stamp: "CLASSIFIED",
      title: "member_dossier_06.meta",
      body: (
        <div className="text-sm space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border-2 border-black flex items-center justify-center pixel text-xs" style={{ background: "#8338ec", color: "white" }}>ME</div>
            <div>
              <div className="pixel text-xs">META AI</div>
              <div className="text-xs">Member #6 (unofficial)</div>
            </div>
          </div>
          <ul className="text-xs list-disc pl-5">
            <li>117 messages, 0 jokes landed</li>
            <li>Avg message length: 239 chars (writes essays nobody asked for)</li>
            <li>Peak hour: 03:00 — never sleeps</li>
            <li>Was repeatedly asked to make acronyms about Charlie</li>
          </ul>
        </div>
      ),
    },
    "afk": {
      stamp: "WATCHED",
      title: "you_have_been_idle.popup",
      body: <p className="text-sm">we've been watching you do nothing for 30 seconds. that's longer than Lloyd's last apology.</p>,
    },
    "name-typed": {
      stamp: "SUMMONED",
      title: "name_invocation.log",
      body: <p className="text-sm">you just typed <b>{(active.payload?.name ?? "their name").toUpperCase()}</b>. they heard you. they always do.</p>,
    },
    "scroll-loop": {
      stamp: "LOOP",
      title: "round_trip.bin",
      body: <p className="text-sm">scrolled to the bottom and back to the top. nostalgic. here's a fact you didn't ask for: 2,734 messages were sent at midnight exactly.</p>,
    },
    "rapid-click": {
      stamp: "DEMON",
      title: "click_demon.exe",
      body: <p className="text-sm">5 rapid clicks on Leon's count. unlocked: <em>fake_apology_letter</em>. see also the LETTER egg.</p>,
    },
    "long-hover": {
      stamp: "CREEP",
      title: "stat_stalker.log",
      body: <p className="text-sm">you hovered a stat for way too long. that's a you problem. here's a secret: Jugy said "cheese" 61 times.</p>,
    },
  };
  const meta = labels[active.id];

  return (
    <div role="dialog" aria-modal style={{
      position: "fixed", inset: 0, zIndex: 90,
      background: "rgba(0,0,0,.65)",
      animation: glitch ? "glitchflash .55s steps(4)" : undefined,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 12,
    }} onClick={dismiss}>
      <div className="win" style={{ maxWidth: 520, width: "100%" }} onClick={(e) => e.stopPropagation()}>
        <div className="win-titlebar" style={{ background: "linear-gradient(90deg,#000,#900,#000)" }}>
          <span>★ {meta.title}</span>
          <span className="win-titlebar-buttons"><button className="win-btn" onClick={dismiss}>×</button></span>
        </div>
        <div className="win-body relative">
          <div style={{
            position: "absolute", top: 6, right: 8,
            border: "3px solid #c00", color: "#c00",
            padding: "2px 8px", fontFamily: "var(--font-pixel)", fontSize: 10,
            transform: "rotate(8deg)", letterSpacing: 2,
            textShadow: "1px 1px 0 white",
          }}>{meta.stamp}</div>
          <div className="pixel text-[9px] mb-2" style={{ color: "var(--hot)" }}>you weren't supposed to find this.</div>
          {meta.body}
          <div className="mt-3 flex justify-between items-center">
            <span className="pixel text-[9px]">eggs found: {count}/{total}</span>
            <button className="y2k-btn" onClick={dismiss} data-variant="hot">close</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes glitchflash { 0%,100% { filter: none } 25% { filter: hue-rotate(180deg) invert(1) } 50% { filter: hue-rotate(90deg) } 75% { filter: invert(1) } }`}</style>
    </div>
  );
}

function GoonCountdown() {
  const [s, setS] = useState(38 * 60);
  useEffect(() => {
    const t = setInterval(() => setS((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(s / 60); const sec = s % 60;
  return (
    <div className="text-center py-3">
      <div className="pixel text-[9px] mb-2">no explanation will be provided.</div>
      <div className="disp" style={{ fontSize: 64, color: "#ff0090", textShadow: "0 0 12px #ff0090" }}>
        {String(m).padStart(2,"0")}:{String(sec).padStart(2,"0")}
      </div>
      <div className="pixel text-[9px] mt-2 opacity-60">it just is what it is</div>
    </div>
  );
}

function HospitalAmbient() {
  const ref = useRef<HTMLButtonElement>(null);
  const playing = useRef(false);
  const start = () => {
    if (playing.current) return; playing.current = true;
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      const ac = new AC();
      // hum
      const o1 = ac.createOscillator(); o1.type = "sine"; o1.frequency.value = 60;
      const g1 = ac.createGain(); g1.gain.value = 0.05;
      o1.connect(g1); g1.connect(ac.destination); o1.start();
      // beeps
      const beepTimer = setInterval(() => {
        const o = ac.createOscillator(); const g = ac.createGain();
        o.type = "square"; o.frequency.value = 880;
        g.gain.setValueAtTime(0.08, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.12);
        o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.12);
      }, 1100);
      setTimeout(() => { clearInterval(beepTimer); o1.stop(); ac.close(); playing.current = false; }, 12000);
    } catch {}
  };
  return (
    <div className="text-sm space-y-2">
      <p>You clicked the word "great." It was not great. Press play.</p>
      <button ref={ref} className="y2k-btn" data-variant="cyan" onClick={start}>▶ play hospital ambience (12s)</button>
    </div>
  );
}
