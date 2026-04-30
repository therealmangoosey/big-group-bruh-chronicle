import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { curseWall, fmtDate } from "@/lib/dataset";

export const Route = createFileRoute("/curse-wall")({
  component: Page,
  head: () => ({ meta: [{ title: "The Curse Wall — Big Group Bruh" }] }),
});

function Page() {
  // Random rotation/skew per item, deterministic by index
  const styled = useMemo(
    () =>
      curseWall.map((m, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const rot = ((seed / 233280) - 0.5) * 8;
        const xOff = ((seed * 7) % 20) - 10;
        const tone = i % 4;
        const colors = ["#fff5b6", "#ffd6e7", "#cdfcd9", "#cfe9ff"];
        return { ...m, rot, xOff, color: colors[tone] };
      }),
    [],
  );

  return (
    <div className="grid gap-4">
      <Window title="curse-wall.exe — Leon's grudges, archived" variant="hot" icon="⛧">
        <h2 className="pixel text-xl rainbow mb-2">THE CURSE WALL</h2>
        <p className="text-sm">
          A corkboard of every Leon message that mentioned Charlie or carried the weight of an ancient hex.
          {" "}{curseWall.length} entries.
        </p>
      </Window>

      <div
        className="win"
        style={{
          background:
            "repeating-linear-gradient(45deg, #b3733a 0 4px, #a8682f 4px 8px), #b3733a",
          padding: 20,
        }}
      >
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
        >
          {styled.map((m, i) => (
            <div
              key={i}
              className="relative"
              style={{
                transform: `rotate(${m.rot}deg) translateX(${m.xOff}px)`,
                background: m.color,
                border: "1px solid rgba(0,0,0,.5)",
                boxShadow: "3px 6px 8px rgba(0,0,0,.4)",
                padding: "10px 12px",
                fontFamily: "Tahoma, sans-serif",
              }}
            >
              {/* pin */}
              <div
                style={{
                  position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)",
                  width: 10, height: 10, borderRadius: "50%",
                  background: "radial-gradient(circle at 30% 30%, #ff5d5d, #8b0000)",
                  boxShadow: "0 1px 1px rgba(0,0,0,.4)",
                }}
              />
              <div className="flex items-center gap-2 mb-1">
                <Avatar name={m.author} size={20} />
                <span className="text-xs opacity-70">{fmtDate(m.ts)}</span>
              </div>
              <p className="text-sm" style={{ lineHeight: 1.35 }}>{m.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
