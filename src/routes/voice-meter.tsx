import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Window } from "@/components/Window";
import { stats, members, daily, colorOf } from "@/lib/dataset";

export const Route = createFileRoute("/voice-meter")({
  component: Page,
  head: () => ({ meta: [{ title: "Voice Meter — Big Group Bruh" }] }),
});

function Page() {
  const [hover, setHover] = useState<string | null>(null);

  // Bucket by month per member, but we don't have per-member monthly directly.
  // Reconstruct from daily quotes only? No — we need approximations from members totals split per month.
  // Quick & truthful approach: scale member.messageCount by the share of stats.monthHist.
  const totalAll = stats.totalMessages;
  const data = useMemo(() => {
    return stats.monthHist.map(([month, monthTotal]) => {
      const slices = members.slice(0, 10).map((m) => ({
        name: m.name,
        color: m.color,
        // approximate per-month share by overall member share
        v: Math.round(monthTotal * (m.messageCount / totalAll)),
      }));
      const sum = slices.reduce((a, s) => a + s.v, 0);
      const other = monthTotal - sum;
      slices.push({ name: "everyone else", color: "#888", v: Math.max(0, other) });
      return { month, monthTotal, slices };
    });
  }, [totalAll]);

  const maxMonth = Math.max(...data.map((d) => d.monthTotal), 1);

  // simple stacked bars
  return (
    <div className="grid gap-4">
      <Window title="voice-meter.exe — share of voice" variant="hot" icon="🎚️">
        <h2 className="pixel text-xl rainbow mb-2">VOICE METER</h2>
        <p className="text-sm">
          Approximate share of total messages per month for the top 10 members.
          Hover a band to highlight one person.
        </p>
      </Window>

      <Window title="stack.svg" variant="cyan">
        <div className="flex gap-3 h-72 items-end overflow-x-auto pb-3">
          {data.map((m) => {
            const h = (m.monthTotal / maxMonth) * 100;
            return (
              <div key={m.month} className="flex flex-col items-center gap-1 min-w-[60px]">
                <div className="disp text-sm">{m.monthTotal.toLocaleString()}</div>
                <div
                  style={{ width: 50, height: `${h}%`, border: "2px solid var(--ink)", boxShadow: "2px 2px 0 var(--ink)" }}
                  className="flex flex-col-reverse"
                >
                  {m.slices.map((s) => {
                    const ratio = s.v / m.monthTotal;
                    const dim = hover && hover !== s.name;
                    return (
                      <div
                        key={s.name}
                        onMouseEnter={() => setHover(s.name)}
                        onMouseLeave={() => setHover(null)}
                        title={`${s.name}: ~${s.v.toLocaleString()}`}
                        style={{
                          height: `${ratio * 100}%`,
                          background: s.color,
                          opacity: dim ? 0.25 : 1,
                          borderTop: "1px solid var(--ink)",
                          transition: "opacity .15s",
                        }}
                      />
                    );
                  })}
                </div>
                <div className="pixel text-[8px]">{m.month.slice(2)}</div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {members.slice(0, 10).concat([{ name: "everyone else", color: "#888" } as any]).map((m) => (
            <button
              key={m.name}
              onMouseEnter={() => setHover(m.name)}
              onMouseLeave={() => setHover(null)}
              className="flex items-center gap-1 hover:underline"
              style={{ opacity: hover && hover !== m.name ? 0.4 : 1 }}
            >
              <span className="inline-block w-3 h-3 border border-black" style={{ background: colorOf(m.name) || (m as any).color }} />
              {m.name}
            </button>
          ))}
        </div>
      </Window>
    </div>
  );
}
