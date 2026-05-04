import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Window } from "@/components/Window";
import { useEggs, EGG_LIST } from "@/lib/easter";

export const Route = createFileRoute("/easter-eggs")({
  component: EasterEggsPage,
  head: () => ({ meta: [{ title: "How to Find Easter Eggs — Big Group Bruh" }] }),
});

const HINTS: Array<{ id: string; title: string; body: string }> = [
  { id: "rapid-click", title: "I.", body: "Some numbers want to be touched. Repeatedly. Quickly. Five times feels right." },
  { id: "goon-timer", title: "II.", body: "A four-letter word, typed anywhere, anytime — and the clock starts. 38 seconds. Don't ask why." },
  { id: "vault-glitch", title: "III.", body: "Patience pays. The vault is sealed, but if you sit still long enough… it forgets you're there." },
  { id: "logo-tap", title: "IV.", body: "The logo at the top of every page. Tap it. Five times. It tap-tap-taps back." },
  { id: "pixel", title: "V.", body: "The home page has a sixth member it doesn't talk about. He hides in plain sight, exactly one pixel wide." },
  { id: "afk", title: "VI.", body: "Do nothing for half a minute. The site notices. The site is always watching." },
  { id: "name-typed", title: "VII.", body: "Their names are summons. Type Leon, Charlie, Ruby, Emma, Lloyd, Coral, Josephy, or Matilda — anywhere. They will respond." },
  { id: "scroll-loop", title: "VIII.", body: "There is virtue in returning. Reach the bottom. Climb back to the top. Make the round trip." },
  { id: "long-hover", title: "IX.", body: "Stat tiles get lonely. If you stare at one for long enough, it starts staring back. (On mobile: long-press.)" },
  { id: "leon-letter", title: "X.", body: "A leaked apology from Leon. Comes packaged with the Click Demon — find one, find both." },
];

function EasterEggsPage() {
  const { count, total, found, redeemCode } = useEggs();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const submit = () => {
    if (!code.trim()) return;
    const id = redeemCode(code);
    if (id) {
      const egg = EGG_LIST.find((e) => e.id === id);
      setMsg({ kind: "ok", text: `✓ unlocked: ${egg?.name ?? id}` });
      setCode("");
    } else {
      setMsg({ kind: "err", text: "✗ not a valid code" });
    }
  };

  return (
    <div className="grid gap-4">
      <Window title="how_to_find.txt — DO NOT DISTRIBUTE" variant="hot" icon="🥚">
        <div className="text-center mb-4">
          <h1 className="pixel text-sm mb-2 rainbow">HOW TO FIND THE EGGS</h1>
          <p className="text-sm italic" style={{ color: "#1a1a1a" }}>"There are ten things hidden in this archive. None of them are obvious. All of them are watching."</p>
          <div className="mt-3 pixel text-[10px]" style={{ color: "#1a1a1a" }}>progress: {count} / {total} {count === total && "· ALL FOUND ·"}</div>
        </div>

        <div
          className="p-3 mb-4 border-2"
          style={{
            borderColor: "#000",
            background: "linear-gradient(180deg,#fff7d6,#ffe9a8)",
            boxShadow: "2px 2px 0 var(--ink)",
          }}
        >
          <div className="pixel text-[10px] mb-2" style={{ color: "#7a1f00" }}>
            STUCK? ASK THE OWNER FOR A 5-LETTER CODE AND ENTER IT BELOW.
          </div>
          <div className="flex gap-2 flex-wrap">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
              maxLength={5}
              placeholder="ABCDE"
              className="border-2 border-black px-3 py-2 disp text-xl tracking-widest uppercase"
              style={{ background: "white", color: "#0a0a0a", minWidth: 140 }}
            />
            <button className="y2k-btn" data-variant="hot" onClick={submit}>redeem</button>
          </div>
          {msg && (
            <div className="pixel text-[10px] mt-2" style={{ color: msg.kind === "ok" ? "#0a6a1a" : "#a00" }}>
              {msg.text}
            </div>
          )}
        </div>

        <div className="space-y-3">
          {HINTS.map((h) => {
            const got = found.has(h.id as any);
            return (
              <div
                key={h.title}
                className="p-3 border-2"
                style={{
                  borderColor: "#000",
                  background: got
                    ? "linear-gradient(180deg, #d8f5d0, #b8e8a8)"
                    : "linear-gradient(180deg, #fffde8, #f8f4d0)",
                  boxShadow: "2px 2px 0 var(--ink)",
                  fontFamily: "var(--font-display)",
                  position: "relative",
                  color: "#0a0a0a",
                }}
              >
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="pixel text-sm" style={{ color: "var(--hot)" }}>{h.title}</span>
                  <span className="text-lg" style={{ color: "#0a0a0a" }}>{h.body}</span>
                  {got && <span className="pixel text-[10px]" style={{ color: "#0a6a1a" }}>✓ found</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <div className="pixel text-[8px]" style={{ color: "#444" }}>— signed, the archive itself</div>
          <div className="pixel text-[8px] mt-1" style={{ color: "#666" }}>don't look behind you</div>
        </div>
      </Window>
    </div>
  );
}
