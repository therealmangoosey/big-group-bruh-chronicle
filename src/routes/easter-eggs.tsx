import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";
import { useEggs } from "@/lib/easter";

export const Route = createFileRoute("/easter-eggs")({
  component: EasterEggsPage,
  head: () => ({ meta: [{ title: "How to Find Easter Eggs — Big Group Bruh" }] }),
});

const HINTS = [
  { title: "I.", body: "Some numbers want to be touched. Repeatedly. Quickly. Five times feels right." },
  { title: "II.", body: "A four-letter word, typed anywhere, anytime — and the clock starts. Don't ask why thirty-eight minutes." },
  { title: "III.", body: "Patience pays. The vault is sealed, but if you sit still long enough… it forgets you're there." },
  { title: "IV.", body: "She used the word \"great.\" It wasn't. Find it in her saga and give it a click." },
  { title: "V.", body: "Welcome.html has a sixth member it doesn't talk about. He hides in plain sight, exactly one pixel wide." },
  { title: "VI.", body: "Do nothing for half a minute. The site notices. The site is always watching." },
  { title: "VII.", body: "Their names are summons. Type Leon, Charlie, Ruby, Emma, Lloyd, Coral, Josephy, or Matilda — anywhere. They will respond." },
  { title: "VIII.", body: "There is virtue in returning. Reach the bottom. Climb back to the top. Make the round trip." },
  { title: "IX.", body: "Stat tiles get lonely. If you stare at one for long enough, it starts staring back." },
  { title: "X.", body: "Find them all and a final page reveals itself. Where? You'll know when you see it." },
];

function EasterEggsPage() {
  const { count, total, found } = useEggs();
  return (
    <div className="grid gap-4">
      <Window title="how_to_find.txt — DO NOT DISTRIBUTE" variant="hot" icon="🥚">
        <div className="text-center mb-4">
          <h1 className="pixel text-sm mb-2 rainbow">HOW TO FIND THE EGGS</h1>
          <p className="text-sm italic">"There are ten things hidden in this archive. None of them are obvious. All of them are watching."</p>
          <div className="mt-3 pixel text-[10px]">progress: {count} / {total} {count === total && "· ALL FOUND ·"}</div>
        </div>

        <div className="space-y-3">
          {HINTS.map((h, i) => {
            const got = i < found.size; // not perfectly mapped, just a vibe
            return (
              <div key={h.title} className="p-3 border-2 border-black" style={{
                background: "linear-gradient(180deg, #fffde8, #f8f4d0)",
                boxShadow: "2px 2px 0 var(--ink)",
                fontFamily: "var(--font-display)",
                position: "relative",
              }}>
                <div className="flex items-baseline gap-2">
                  <span className="pixel text-sm" style={{ color: "var(--hot)" }}>{h.title}</span>
                  <span className="text-lg" style={{ filter: got ? "none" : "blur(0.4px)" }}>{h.body}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <div className="pixel text-[8px] opacity-50">— signed, the archive itself</div>
          <div className="pixel text-[8px] opacity-30 mt-1">don't look behind you</div>
        </div>
      </Window>
    </div>
  );
}
