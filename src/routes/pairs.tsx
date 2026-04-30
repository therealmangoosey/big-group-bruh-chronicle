import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Window } from "@/components/Window";
import { pairs, members, colorOf } from "@/lib/dataset";

export const Route = createFileRoute("/pairs")({
  component: Page,
  head: () => ({ meta: [{ title: "Pair Chemistry — Big Group Bruh" }] }),
});

function Page() {
  // Build symmetric edges: combine A->B + B->A reply counts
  const sym = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of pairs) {
      const k = [p.from, p.to].sort().join("|");
      map.set(k, (map.get(k) ?? 0) + p.count);
    }
    return [...map.entries()]
      .map(([k, c]) => { const [a, b] = k.split("|"); return { a, b, count: c }; })
      .sort((a, b) => b.count - a.count);
  }, []);

  // Layout members in a circle
  const top = members.slice(0, 16);
  const cx = 250, cy = 250, r = 200;
  const positions = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    top.forEach((mm, i) => {
      const a = (i / top.length) * Math.PI * 2 - Math.PI / 2;
      m.set(mm.name, { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    });
    return m;
  }, [top]);

  const filtered = sym.filter((e) => positions.has(e.a) && positions.has(e.b)).slice(0, 80);
  const max = filtered[0]?.count ?? 1;

  return (
    <div className="grid gap-4">
      <Window title="pair-chemistry.svg — who replies to who" variant="cyan" icon="🔗">
        <h2 className="pixel text-xl rainbow mb-2">CHEMISTRY GRAPH</h2>
        <p className="text-sm mb-3">
          Edges are reply counts within 2 minutes. Top 16 members shown for readability.
        </p>
        <div className="overflow-x-auto">
          <svg width={500} height={500} className="block mx-auto" style={{ background: "white", border: "2px solid var(--ink)" }}>
            {filtered.map((e, i) => {
              const a = positions.get(e.a)!;
              const b = positions.get(e.b)!;
              const w = Math.max(0.5, (e.count / max) * 6);
              return (
                <line
                  key={i}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke="var(--hot)"
                  strokeOpacity={0.3 + 0.7 * (e.count / max)}
                  strokeWidth={w}
                />
              );
            })}
            {top.map((m) => {
              const p = positions.get(m.name)!;
              return (
                <g key={m.name}>
                  <circle cx={p.x} cy={p.y} r={18} fill={m.color} stroke="var(--ink)" strokeWidth={2} />
                  <text
                    x={p.x} y={p.y + 4}
                    textAnchor="middle"
                    fontSize={9} fontFamily="Press Start 2P, monospace"
                  >
                    {m.initials}
                  </text>
                  <text
                    x={p.x} y={p.y - 24}
                    textAnchor="middle"
                    fontSize={10} fontFamily="Tahoma, sans-serif"
                    fontWeight={700}
                  >
                    {m.name.slice(0, 10)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </Window>

      <Window title="top-pairs.txt — most-replied couples">
        <ol className="grid sm:grid-cols-2 gap-2">
          {sym.slice(0, 20).map((p, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="pixel text-[10px] w-6">#{i + 1}</span>
              <span className="w-3 h-3 inline-block border border-black" style={{ background: colorOf(p.a) }} />
              <b>{p.a}</b>
              <span className="opacity-60">↔</span>
              <span className="w-3 h-3 inline-block border border-black" style={{ background: colorOf(p.b) }} />
              <b>{p.b}</b>
              <span className="ml-auto disp text-lg">{p.count}</span>
            </li>
          ))}
        </ol>
      </Window>
    </div>
  );
}
