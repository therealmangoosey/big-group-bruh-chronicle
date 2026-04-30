import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { loadAllMessages, fmtDateTime } from "@/lib/dataset";
import type { Quote } from "@/lib/dataset";

export const Route = createFileRoute("/wheel")({
  component: Page,
  head: () => ({ meta: [{ title: "Wheel of Chaos — Big Group Bruh" }] }),
});

function Page() {
  const [all, setAll] = useState<Quote[]>([]);
  const [pick, setPick] = useState<Quote | null>(null);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => { loadAllMessages().then(setAll); }, []);

  const spin = () => {
    if (!all.length) return;
    setSpinning(true);
    setPick(null);
    const turns = 4 + Math.random() * 4;
    setAngle((a) => a + turns * 360);
    setTimeout(() => {
      let m: Quote;
      do { m = all[Math.floor(Math.random() * all.length)]; }
      while (m.isMedia || m.isDeleted || m.text.length < 10);
      setPick(m);
      setSpinning(false);
    }, 1500);
  };

  const colors = ["#ff3ea5", "#00e0ff", "#a3ff00", "#ffd400", "#9d00ff", "#00ff88", "#ff5500", "#fbff12"];

  return (
    <div className="grid gap-4">
      <Window title="wheel-of-chaos.exe" variant="hot" icon="🎡">
        <h2 className="pixel text-xl rainbow mb-2">SPIN THE WHEEL OF CHAOS</h2>
        <p className="text-sm">Pulls a random message from the entire {all.length.toLocaleString()}-message archive.</p>
      </Window>

      <div className="grid md:grid-cols-2 gap-4 items-center">
        <Window title="wheel.svg" variant="cyan">
          <div className="relative mx-auto" style={{ width: 320, height: 320 }}>
            <svg width={320} height={320}
              style={{ transform: `rotate(${angle}deg)`, transition: "transform 1.4s cubic-bezier(.22,.95,.25,1)" }}
            >
              {colors.map((c, i) => {
                const a0 = (i / colors.length) * Math.PI * 2 - Math.PI / 2;
                const a1 = ((i + 1) / colors.length) * Math.PI * 2 - Math.PI / 2;
                const x0 = 160 + Math.cos(a0) * 150;
                const y0 = 160 + Math.sin(a0) * 150;
                const x1 = 160 + Math.cos(a1) * 150;
                const y1 = 160 + Math.sin(a1) * 150;
                return (
                  <path key={i}
                    d={`M160,160 L${x0},${y0} A150,150 0 0 1 ${x1},${y1} Z`}
                    fill={c} stroke="var(--ink)" strokeWidth={2} />
                );
              })}
              <circle cx={160} cy={160} r={28} fill="white" stroke="var(--ink)" strokeWidth={3} />
            </svg>
            <div style={{
              position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
              width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent",
              borderTop: "28px solid var(--ink)",
            }} />
          </div>
          <div className="text-center mt-3">
            <button className="y2k-btn" data-variant="hot" disabled={spinning || !all.length} onClick={spin}>
              {spinning ? "spinning…" : "🎡 SPIN"}
            </button>
          </div>
        </Window>

        <Window title="result.msg" variant="hot">
          {pick ? (
            <div className="sparkle relative shimmer">
              <div className="flex items-center gap-2 mb-2">
                <Avatar name={pick.author} size={32} />
                <b className="text-lg">{pick.author}</b>
                <span className="text-xs opacity-60 ml-auto">{fmtDateTime(pick.ts)}</span>
              </div>
              <blockquote className="border-2 border-black p-3 bg-white text-base">
                {pick.text}
              </blockquote>
            </div>
          ) : (
            <div className="disp text-2xl text-center py-8 opacity-60">.. spin the wheel ..</div>
          )}
        </Window>
      </div>
    </div>
  );
}
