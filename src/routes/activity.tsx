import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Window } from "@/components/Window";
import { stats, members } from "@/lib/dataset";

export const Route = createFileRoute("/activity")({
  component: Page,
  head: () => ({ meta: [{ title: "Activity Graphs — Big Group Bruh" }] }),
});

function Page() {
  const [member, setMember] = useState<string>("__all__");
  const histAll = stats.hourHist;
  const monthAll = stats.monthHist;

  const hist = member === "__all__"
    ? histAll
    : members.find((m) => m.name === member)?.hourHist ?? histAll;

  const max = Math.max(...hist, 1);

  // Radial clock
  const cx = 180, cy = 180, rIn = 60, rOut = 160;
  const wedges = useMemo(() => {
    return hist.map((v, i) => {
      const a0 = (i / 24) * Math.PI * 2 - Math.PI / 2;
      const a1 = ((i + 1) / 24) * Math.PI * 2 - Math.PI / 2;
      const r = rIn + (rOut - rIn) * (v / max);
      const x0 = cx + Math.cos(a0) * rIn;
      const y0 = cy + Math.sin(a0) * rIn;
      const x1 = cx + Math.cos(a0) * r;
      const y1 = cy + Math.sin(a0) * r;
      const x2 = cx + Math.cos(a1) * r;
      const y2 = cy + Math.sin(a1) * r;
      const x3 = cx + Math.cos(a1) * rIn;
      const y3 = cy + Math.sin(a1) * rIn;
      return { d: `M${x0},${y0} L${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2} L${x3},${y3} Z`, hour: i, v };
    });
  }, [hist, max]);

  // Month bars
  const maxMonth = Math.max(...monthAll.map((m) => m[1]), 1);

  return (
    <div className="grid gap-4">
      <Window title="activity.exe — when does the chat happen" variant="cyan" icon="📊">
        <h2 className="pixel text-xl rainbow mb-2">ACTIVITY GRAPHS</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm">filter:</label>
          <select
            value={member}
            onChange={(e) => setMember(e.target.value)}
            className="border-2 border-black px-2 py-1"
            style={{ background: "white" }}
          >
            <option value="__all__">— everyone —</option>
            {members.map((m) => (
              <option key={m.name} value={m.name}>{m.name}</option>
            ))}
          </select>
        </div>
      </Window>

      <div className="grid md:grid-cols-2 gap-4">
        <Window title="hours.clock — radial 24h" variant="hot">
          <svg width={360} height={360} className="block mx-auto">
            <circle cx={cx} cy={cy} r={rOut + 4} fill="none" stroke="var(--ink)" strokeWidth={2} />
            {wedges.map((w, i) => (
              <path key={i} d={w.d} fill="var(--hot)" stroke="var(--ink)" strokeWidth={1}>
                <title>{`${String(w.hour).padStart(2, "0")}:00 — ${w.v.toLocaleString()}`}</title>
              </path>
            ))}
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
              const x = cx + Math.cos(a) * (rOut + 18);
              const y = cy + Math.sin(a) * (rOut + 18);
              return (
                <text key={i} x={x} y={y + 4} textAnchor="middle" fontSize={9} fontFamily="Press Start 2P">
                  {i}
                </text>
              );
            })}
            <circle cx={cx} cy={cy} r={rIn - 2} fill="white" stroke="var(--ink)" strokeWidth={2} />
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontFamily="Press Start 2P">UTC</text>
          </svg>
        </Window>

        <Window title="months.bar" variant="lime">
          <div className="flex items-end gap-2 h-64 px-2">
            {monthAll.map(([m, c]) => (
              <div key={m} className="grow flex flex-col items-center gap-1 min-w-0">
                <div className="disp text-sm">{c.toLocaleString()}</div>
                <div
                  style={{
                    width: "100%",
                    height: `${(c / maxMonth) * 100}%`,
                    background: "linear-gradient(180deg,var(--cyan),var(--grape))",
                    border: "2px solid var(--ink)",
                    boxShadow: "2px 2px 0 var(--ink)",
                  }}
                />
                <div className="pixel text-[8px]">{m.slice(2)}</div>
              </div>
            ))}
          </div>
        </Window>
      </div>
    </div>
  );
}
