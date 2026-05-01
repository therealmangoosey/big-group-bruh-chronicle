import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import { Window } from "@/components/Window";
import { daily, fmtDate } from "@/lib/dataset";
import type { Quote } from "@/lib/dataset";

export const Route = createFileRoute("/storm")({
  component: StormPage,
  head: () => ({ meta: [{ title: "Message Storm — Big Group Bruh" }] }),
});

function StormPage() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<typeof daily[number] | null>(null);
  const maxCount = Math.max(...daily.map((d) => d.count));

  return (
    <div className="grid gap-4">
      <Window title="storm_radar.exe" variant="hot" icon="🌩️">
        <div className="text-center mb-4">
          <h1 className="pixel text-sm mb-2 rainbow">MESSAGE STORM VISUALISER</h1>
          <p className="text-sm">Hover over a time period to see message density. Click a storm to read what caused the spike.</p>
        </div>

        <div className="relative mx-auto" style={{ width: "min(100%, 500px)", aspectRatio: "1" }}>
          {/* Radar rings */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((r) => (
            <div
              key={r}
              className="absolute rounded-full border border-[var(--ink)]"
              style={{
                width: `${r * 100}%`, height: `${r * 100}%`,
                top: `${(1 - r) * 50}%`, left: `${(1 - r) * 50}%`,
                opacity: 0.15,
              }}
            />
          ))}
          {/* Sweep line */}
          <div
            className="absolute top-1/2 left-1/2 origin-bottom-left"
            style={{
              width: "50%", height: 2, background: "var(--lime)",
              transform: "rotate(0deg)",
              animation: "radarsweep 4s linear infinite",
              boxShadow: "0 0 12px var(--lime)",
            }}
          />
          {/* Day dots */}
          {daily.map((d, i) => {
            const angle = (i / daily.length) * 360;
            const intensity = d.count / maxCount;
            const r = 20 + intensity * 30; // % from center
            const rad = (angle - 90) * Math.PI / 180;
            const x = 50 + r * Math.cos(rad);
            const y = 50 + r * Math.sin(rad);
            const isHov = hovered === i;
            const size = 6 + intensity * 18;
            return (
              <div
                key={d.date}
                className="absolute cursor-pointer"
                style={{
                  left: `${x}%`, top: `${y}%`,
                  width: size, height: size,
                  borderRadius: "50%",
                  background: isHov ? "var(--hot)" : `oklch(0.66 0.28 ${intensity * 300} / ${0.3 + intensity * 0.7})`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: isHov ? `0 0 ${size * 2}px var(--hot)` : "none",
                  transition: "all .15s",
                  zIndex: isHov ? 10 : 1,
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(d)}
                title={`${d.date}: ${d.count} messages`}
              />
            );
          })}
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {hovered !== null ? (
              <div className="text-center">
                <div className="pixel text-[9px]">{daily[hovered].date}</div>
                <div className="disp text-3xl" style={{ color: "var(--hot)" }}>{daily[hovered].count}</div>
                <div className="pixel text-[8px]">messages</div>
              </div>
            ) : (
              <div className="pixel text-[9px] opacity-40">hover a dot</div>
            )}
          </div>
        </div>
      </Window>

      {/* Pulse rings on hover */}
      {hovered !== null && (
        <Window title="pulse.log" variant="cyan">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((ring) => {
              const s = (daily[hovered].count / maxCount) * ring * 40 + 20;
              return (
                <div
                  key={ring}
                  className="rounded-full border-2 border-[var(--hot)] flex items-center justify-center shrink-0"
                  style={{
                    width: s, height: s,
                    animation: `pulse ${0.6 + ring * 0.3}s ease-in-out infinite alternate`,
                    opacity: 1 - ring * 0.25,
                  }}
                >
                  {ring === 1 && <span className="pixel text-[8px]">{daily[hovered].count}</span>}
                </div>
              );
            })}
            <div className="text-sm">
              <div className="font-bold">{new Date(daily[hovered].date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</div>
              <div className="text-xs opacity-70">Drama score: {daily[hovered].drama}</div>
              {daily[hovered].topQuote && (
                <blockquote className="mt-1 p-1 border-l-4 border-[var(--hot)] text-xs">
                  <b>{daily[hovered].topQuote!.author}:</b> {daily[hovered].topQuote!.text.slice(0, 120)}…
                </blockquote>
              )}
            </div>
          </div>
        </Window>
      )}

      {selected && (
        <Window title={`storm_${selected.date}.log`} variant="lime" icon="⚡">
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="pixel text-xs">{selected.date}</div>
              <div className="disp text-2xl">{selected.count} messages — drama score {selected.drama}</div>
            </div>
            <button className="y2k-btn" onClick={() => setSelected(null)}>close</button>
          </div>
          {selected.topQuote && (
            <blockquote className="p-3 border-2 border-black bg-[oklch(0.92_0.18_95/.3)]">
              <div className="pixel text-[9px] mb-1">peak quote</div>
              <p className="text-sm"><b>{selected.topQuote.author}:</b> {selected.topQuote.text.slice(0, 300)}{selected.topQuote.text.length > 300 ? "…" : ""}</p>
            </blockquote>
          )}
        </Window>
      )}
      <style>{`@keyframes radarsweep { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
