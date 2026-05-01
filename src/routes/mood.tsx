import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import { Window } from "@/components/Window";
import { daily, loadMonth, messagesIndex } from "@/lib/dataset";
import type { Quote } from "@/lib/dataset";

export const Route = createFileRoute("/mood")({
  component: MoodPage,
  head: () => ({ meta: [{ title: "Mood Timeline — Big Group Bruh" }] }),
});

const POSITIVE = new Set(["love","happy","great","good","amazing","lol","lmao","haha","nice","cool","fun","awesome","beautiful","perfect","yes","yay","best","❤","💞","😂","🥹"]);
const NEGATIVE = new Set(["hate","die","kill","fuck","shit","sad","cry","awful","worst","angry","mad","stupid","ugly","dead","pain","hurt","sorry","😭","😔","💔"]);

function scoreMood(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  let s = 0;
  for (const w of words) {
    if (POSITIVE.has(w)) s += 1;
    if (NEGATIVE.has(w)) s -= 1;
  }
  return s;
}

function MoodPage() {
  const moodByDay = useMemo(() => {
    return daily.map((d) => {
      const q = d.topQuote;
      const textScore = q ? scoreMood(q.text) : 0;
      const dramaPenalty = -d.drama * 0.01;
      const activityBoost = Math.min(d.count / 500, 1) * 0.5;
      const raw = textScore + dramaPenalty + activityBoost;
      const clamped = Math.max(-5, Math.min(5, raw));
      return { date: d.date, count: d.count, mood: clamped, drama: d.drama, quote: q };
    });
  }, []);

  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 900;
  const H = 200;
  const PAD = 30;

  const points = moodByDay.map((d, i) => {
    const x = PAD + (i / (moodByDay.length - 1)) * (W - PAD * 2);
    const y = H / 2 - (d.mood / 5) * (H / 2 - 20);
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const hov = hovIdx !== null ? points[hovIdx] : null;

  // Background color based on hover
  const bgHue = hov ? (hov.mood > 0 ? 60 + hov.mood * 20 : 300 + hov.mood * 20) : 270;
  const bgLight = hov ? (hov.mood > 0 ? 0.92 : 0.85) : 0.97;

  return (
    <div className="grid gap-4" style={{
      transition: "background .5s",
    }}>
      <Window title="mood_timeline.wav" variant="lime" icon="🌊">
        <div className="text-center mb-3">
          <h1 className="pixel text-sm mb-1 rainbow">MOOD TIMELINE</h1>
          <p className="text-sm">Scrub across the graph to feel the group's emotional temperature shift.</p>
        </div>

        <div style={{
          background: `oklch(${bgLight} 0.08 ${bgHue})`,
          transition: "background .3s",
          padding: 8,
          border: "2px solid var(--ink)",
          position: "relative",
          overflow: "hidden",
        }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ display: "block" }}
          >
            {/* Zero line */}
            <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke="#aaa" strokeDasharray="4 4" />
            {/* Mood curve */}
            <path d={pathD} fill="none" stroke="var(--hot)" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Dots */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x} cy={p.y}
                r={hovIdx === i ? 6 : 3}
                fill={p.mood > 0 ? "var(--lime)" : "var(--hot)"}
                stroke="var(--ink)" strokeWidth={1}
                style={{ cursor: "pointer", transition: "r .1s" }}
                onMouseEnter={() => setHovIdx(i)}
                onMouseLeave={() => setHovIdx(null)}
              />
            ))}
            {/* Labels */}
            <text x={PAD} y={16} fontSize={10} fontFamily="var(--font-pixel)">positive ↑</text>
            <text x={PAD} y={H - 6} fontSize={10} fontFamily="var(--font-pixel)">negative ↓</text>
          </svg>
        </div>

        {hov && (
          <div className="mt-3 p-3 border-2 border-black" style={{
            background: hov.mood > 0
              ? `oklch(0.92 0.2 ${90 + hov.mood * 10})`
              : `oklch(0.85 0.2 ${350 + hov.mood * 10})`,
            transition: "background .3s",
          }}>
            <div className="flex justify-between items-center">
              <div className="pixel text-[10px]">{hov.date}</div>
              <div className="pixel text-[10px]">{hov.mood > 0 ? "☀️ warm" : "❄️ cold"} — mood: {hov.mood.toFixed(1)}</div>
            </div>
            <div className="text-sm mt-1">
              {hov.count} messages · drama: {hov.drama}
            </div>
            {hov.quote && (
              <blockquote className="mt-2 text-xs border-l-4 border-black pl-2">
                <b>{hov.quote.author}:</b> {hov.quote.text.slice(0, 180)}…
              </blockquote>
            )}
          </div>
        )}
      </Window>
    </div>
  );
}
