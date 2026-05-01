import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Window } from "@/components/Window";
import { members } from "@/lib/dataset";

export const Route = createFileRoute("/sleep-index")({
  component: SleepIndexPage,
  head: () => ({ meta: [{ title: "Sleep Deprivation Index — Big Group Bruh" }] }),
});

function Battery({ level, name, lateNight, total }: { level: number; name: string; lateNight: number; total: number }) {
  const bars = 5;
  const filled = Math.max(0, bars - Math.round(level * bars));
  const color = level > 0.7 ? "#c00" : level > 0.4 ? "#ff8a00" : "#00c853";

  return (
    <div className="flex items-center gap-3">
      {/* Battery icon */}
      <div className="relative" style={{ width: 50, height: 24 }}>
        <div style={{
          border: "2px solid var(--ink)", width: 46, height: 24,
          display: "flex", gap: 1, padding: 2, alignItems: "stretch",
        }}>
          {Array.from({ length: bars }).map((_, i) => (
            <div key={i} style={{
              flex: 1,
              background: i >= filled ? color : "#ddd",
              transition: "background .3s",
              ...(level > 0.7 && i >= filled ? {
                animation: `crumble ${0.5 + Math.random()}s ease-in-out infinite alternate`,
              } : {}),
            }} />
          ))}
        </div>
        <div style={{
          position: "absolute", right: -4, top: 7, width: 4, height: 10,
          background: "var(--ink)",
        }} />
      </div>
      <div className="grow min-w-0">
        <div className="font-bold text-sm truncate">{name}</div>
        <div className="pixel text-[8px]">{lateNight} late-night msgs / {total} total</div>
      </div>
      <div className="disp text-xl" style={{ color }}>{Math.round(level * 100)}%</div>
    </div>
  );
}

function SleepIndexPage() {
  const ranked = useMemo(() => {
    return members
      .filter((m) => m.messageCount > 20)
      .map((m) => ({
        name: m.name,
        lateNight: m.lateNight,
        total: m.messageCount,
        deprivation: m.messageCount > 0 ? m.lateNight / m.messageCount : 0,
      }))
      .sort((a, b) => b.deprivation - a.deprivation)
      .slice(0, 20);
  }, []);

  return (
    <div className="grid gap-4">
      <Window title="sleep_deprivation.idx" variant="hot" icon="🔋">
        <div className="text-center mb-4">
          <h1 className="pixel text-sm mb-2 rainbow">SLEEP DEPRIVATION INDEX</h1>
          <p className="text-sm">How drained is each member's battery? Based on the ratio of midnight–5am messages to total messages.</p>
        </div>
        <div className="space-y-3">
          {ranked.map((r) => (
            <Battery key={r.name} level={r.deprivation} name={r.name} lateNight={r.lateNight} total={r.total} />
          ))}
        </div>
      </Window>
      <style>{`@keyframes crumble { 0% { transform: translateY(0) } 100% { transform: translateY(1px) scaleY(0.9) } }`}</style>
    </div>
  );
}
