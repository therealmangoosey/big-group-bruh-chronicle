import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Window } from "@/components/Window";
import { members, loadAllMessages, colorOf } from "@/lib/dataset";
import type { Quote } from "@/lib/dataset";

export const Route = createFileRoute("/night-owls")({
  component: Page,
  head: () => ({ meta: [{ title: "Night Owl Tracker — Big Group Bruh" }] }),
});

function Page() {
  const [member, setMember] = useState("__all__");
  const [late, setLate] = useState<Quote[]>([]);

  useEffect(() => {
    loadAllMessages().then((all) => {
      setLate(all.filter((m) => {
        const d = new Date(m.ts);
        const h = d.getUTCHours();
        return h >= 0 && h < 5 && !m.isMedia && !m.isDeleted;
      }));
    });
  }, []);

  const filtered = member === "__all__" ? late : late.filter((m) => m.author === member);

  // radial clock 0–5
  const cx = 200, cy = 200, rIn = 70, rOut = 180;
  return (
    <div className="grid gap-4">
      <Window title="night-owls.exe — after midnight" variant="hot" icon="🦉">
        <h2 className="pixel text-xl rainbow mb-2">NIGHT OWL TRACKER</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm">filter:</label>
          <select value={member} onChange={(e) => setMember(e.target.value)} className="border-2 border-black px-2 py-1" style={{ background: "white" }}>
            <option value="__all__">— everyone —</option>
            {members.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
          </select>
          <span className="ml-auto disp text-2xl">{filtered.length.toLocaleString()} <span className="text-sm">msgs</span></span>
        </div>
      </Window>

      <Window title="midnight-clock.svg" variant="cyan">
        <svg width={400} height={400} className="block mx-auto" style={{ background: "#0a0a2a" }}>
          {Array.from({ length: 200 }).map((_, i) => {
            const a = Math.random() * Math.PI * 2;
            const r = Math.random() * 200;
            return <circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={Math.random() * 1.5} fill="white" opacity={Math.random()} />;
          })}
          {[0, 1, 2, 3, 4, 5].map((h) => {
            const a = (h / 6) * Math.PI * 2 - Math.PI / 2;
            const r = rOut + 14;
            return (
              <text key={h} x={cx + Math.cos(a) * r} y={cy + Math.sin(a) * r + 4} textAnchor="middle" fontSize={10} fontFamily="Press Start 2P" fill="white">
                {h}
              </text>
            );
          })}
          <circle cx={cx} cy={cy} r={rIn} fill="none" stroke="white" strokeOpacity={0.3} strokeWidth={1} />
          <circle cx={cx} cy={cy} r={rOut} fill="none" stroke="white" strokeOpacity={0.3} strokeWidth={1} />
          {filtered.map((m, i) => {
            const d = new Date(m.ts);
            const h = d.getUTCHours() + d.getUTCMinutes() / 60;
            const a = (h / 6) * Math.PI * 2 - Math.PI / 2;
            const r = rIn + Math.random() * (rOut - rIn);
            const x = cx + Math.cos(a) * r;
            const y = cy + Math.sin(a) * r;
            return (
              <circle key={i} cx={x} cy={y} r={2} fill={colorOf(m.author)} opacity={0.85}>
                <title>{`${m.author} @ ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} — ${m.text.slice(0, 80)}`}</title>
              </circle>
            );
          })}
        </svg>
      </Window>

      <Window title="late-night-quotes.txt — random sample">
        <ul className="grid sm:grid-cols-2 gap-2 text-sm">
          {filtered.slice(0, 12).map((m, i) => (
            <li key={i} className="border-2 border-black p-2 bg-white">
              <div className="text-xs opacity-60">{new Date(m.ts).toLocaleString("en-GB")}</div>
              <b>{m.author}:</b> {m.text}
            </li>
          ))}
        </ul>
      </Window>
    </div>
  );
}
