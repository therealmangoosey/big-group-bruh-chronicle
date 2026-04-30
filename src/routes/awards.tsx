import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { awards } from "@/lib/dataset";

export const Route = createFileRoute("/awards")({
  component: Page,
  head: () => ({ meta: [{ title: "Awards Ceremony — Big Group Bruh" }] }),
});

function Page() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [autoplay, setAutoplay] = useState(false);

  const reveal = (id: string) => {
    setRevealed((s) => new Set(s).add(id));
  };

  const startAuto = () => {
    setAutoplay(true);
    setRevealed(new Set());
    awards.forEach((a, i) => {
      setTimeout(() => reveal(a.id), 800 + i * 1500);
    });
    setTimeout(() => setAutoplay(false), 800 + awards.length * 1500);
  };

  return (
    <div className="grid gap-4">
      <Window title="awards-ceremony.exe" variant="hot" icon="🎬">
        <div className="text-center py-3">
          <h2 className="pixel text-2xl rainbow mb-2">⭐ AWARDS CEREMONY ⭐</h2>
          <p className="text-sm mb-3">Click an envelope to reveal — or play the whole thing.</p>
          <button className="y2k-btn" data-variant="hot" onClick={startAuto} disabled={autoplay}>
            {autoplay ? "✨ rolling…" : "▶ play ceremony"}
          </button>
          <button className="y2k-btn ml-2" onClick={() => setRevealed(new Set())}>↻ reset</button>
        </div>
      </Window>

      <div className="grid sm:grid-cols-2 gap-4">
        {awards.map((a) => {
          const open = revealed.has(a.id);
          return (
            <div key={a.id} className="win">
              <div className="win-titlebar"><span>category — {a.title}</span><span>🏆</span></div>
              <div className="win-body">
                <div className="text-center mb-2">
                  <div className="pixel text-sm">{a.title}</div>
                  <div className="text-xs opacity-70">{a.desc}</div>
                </div>
                {!open ? (
                  <button
                    onClick={() => reveal(a.id)}
                    className="w-full text-center py-6 wiggle"
                    style={{
                      background: "linear-gradient(180deg,#fff5b6,#ffd400)",
                      border: "2px dashed var(--ink)",
                      cursor: "pointer",
                    }}
                  >
                    <div className="text-5xl">✉️</div>
                    <div className="pixel text-[10px] mt-2">click to open envelope</div>
                  </button>
                ) : (
                  <div className="text-center py-3 sparkle relative shimmer">
                    <div className="pixel text-[10px] mb-2 blink">★ AND THE WINNER IS ★</div>
                    {a.winner.map(([name, n], i) => (
                      <div key={name} className={`flex items-center justify-center gap-2 ${i === 0 ? "text-2xl" : "text-base"}`}>
                        <Avatar name={name} size={i === 0 ? 36 : 22} />
                        <span className={i === 0 ? "rainbow font-bold" : "font-bold"}>{name}</span>
                        <span className="disp text-xl opacity-80">— {n.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
