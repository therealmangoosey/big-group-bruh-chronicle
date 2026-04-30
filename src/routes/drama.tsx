import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Window } from "@/components/Window";
import { daily } from "@/lib/dataset";

export const Route = createFileRoute("/drama")({
  component: Page,
  head: () => ({ meta: [{ title: "Drama Thermometer — Big Group Bruh" }] }),
});

function Page() {
  const peaks = useMemo(() =>
    [...daily].sort((a, b) => b.drama - a.drama).slice(0, 6), []);

  // line chart
  const W = 900, H = 280, P = 30;
  const max = Math.max(...daily.map((d) => d.drama), 1);
  const stepX = (W - P * 2) / Math.max(1, daily.length - 1);
  const path = daily
    .map((d, i) => `${i === 0 ? "M" : "L"}${P + i * stepX},${H - P - (d.drama / max) * (H - P * 2)}`)
    .join(" ");

  const peakSet = new Set(peaks.map((p) => p.date));

  return (
    <div className="grid gap-4">
      <Window title="drama-thermometer.exe" variant="hot" icon="🌡️">
        <h2 className="pixel text-xl rainbow mb-2">DRAMA THERMOMETER</h2>
        <p className="text-sm">
          Drama score per day = profanity ×3 + late-night msgs + ALL-CAPS msgs ×2.
        </p>
      </Window>

      <Window title="tension-over-time.svg" variant="cyan">
        <div className="overflow-x-auto">
          <svg width={W} height={H} style={{ background: "white", border: "2px solid var(--ink)" }}>
            <defs>
              <linearGradient id="dramaFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--hot)" stopOpacity={0.6} />
                <stop offset="100%" stopColor="var(--hot)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <path d={`${path} L${P + (daily.length - 1) * stepX},${H - P} L${P},${H - P} Z`} fill="url(#dramaFill)" />
            <path d={path} stroke="var(--hot)" strokeWidth={2} fill="none" />
            {daily.map((d, i) => {
              if (!peakSet.has(d.date)) return null;
              const x = P + i * stepX;
              const y = H - P - (d.drama / max) * (H - P * 2);
              return (
                <g key={d.date}>
                  <circle cx={x} cy={y} r={5} fill="var(--lime)" stroke="var(--ink)" strokeWidth={2} />
                  <text x={x} y={y - 10} textAnchor="middle" fontSize={9} fontFamily="Press Start 2P">
                    {d.date.slice(5)}
                  </text>
                </g>
              );
            })}
            {[0, max / 2, max].map((t, i) => (
              <line key={i} x1={P} x2={W - P} y1={H - P - (t / max) * (H - P * 2)} y2={H - P - (t / max) * (H - P * 2)} stroke="#0001" />
            ))}
          </svg>
        </div>
      </Window>

      <Window title="peak.list — biggest tension days">
        <ol className="space-y-2">
          {peaks.map((p, i) => (
            <li key={p.date} className="text-sm flex items-baseline gap-3">
              <span className="pixel text-[10px] w-6">#{i + 1}</span>
              <b>{new Date(p.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</b>
              <span className="opacity-60">drama: {p.drama}</span>
              {p.topQuote && (
                <span className="grow border-l-4 border-black pl-2 italic">
                  "{p.topQuote.text.slice(0, 120)}{p.topQuote.text.length > 120 ? "…" : ""}" — {p.topQuote.author}
                </span>
              )}
            </li>
          ))}
        </ol>
      </Window>
    </div>
  );
}
