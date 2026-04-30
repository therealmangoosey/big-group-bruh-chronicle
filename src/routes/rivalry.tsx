import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { members, pairs } from "@/lib/dataset";

export const Route = createFileRoute("/rivalry")({
  component: Page,
  head: () => ({ meta: [{ title: "Member Rivalry Viewer — Big Group Bruh" }] }),
});

function Bar({ a, b, la, lb, color = "var(--hot)" }: { a: number; b: number; la: string; lb: string; color?: string }) {
  const total = a + b || 1;
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-xs"><span>{la}: <b>{a.toLocaleString()}</b></span><span>{lb}: <b>{b.toLocaleString()}</b></span></div>
      <div className="h-4 border-2 border-black flex overflow-hidden bg-white">
        <div style={{ width: `${(a / total) * 100}%`, background: color }} />
        <div style={{ width: `${(b / total) * 100}%`, background: "var(--ink)" }} />
      </div>
    </div>
  );
}

function Page() {
  const [a, setA] = useState(members[0]?.name ?? "");
  const [b, setB] = useState(members[1]?.name ?? "");
  const ma = members.find((m) => m.name === a);
  const mb = members.find((m) => m.name === b);

  const replyAB = useMemo(
    () => pairs.find((p) => p.from === a && p.to === b)?.count ?? 0,
    [a, b],
  );
  const replyBA = useMemo(
    () => pairs.find((p) => p.from === b && p.to === a)?.count ?? 0,
    [a, b],
  );

  return (
    <div className="grid gap-4">
      <Window title="rivalry-viewer.exe — head to head" variant="hot" icon="⚔️">
        <h2 className="pixel text-xl rainbow mb-2">RIVALRY VIEWER</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "fighter A", val: a, set: setA },
            { label: "fighter B", val: b, set: setB },
          ].map((s) => (
            <div key={s.label}>
              <div className="pixel text-[9px] mb-1">{s.label}</div>
              <select value={s.val} onChange={(e) => s.set(e.target.value)}
                className="w-full border-2 border-black px-2 py-1" style={{ background: "white" }}>
                {members.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
              </select>
            </div>
          ))}
        </div>
      </Window>

      {ma && mb && (
        <Window title={`${ma.name} vs ${mb.name}`} variant="cyan">
          <div className="grid grid-cols-2 gap-3 text-center mb-3">
            {[ma, mb].map((m) => (
              <div key={m.name}>
                <Avatar name={m.name} size={56} />
                <div className="pixel mt-1">{m.name}</div>
                <div className="text-xs opacity-70">{m.summary}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Bar la={ma.name} lb={mb.name} a={ma.messageCount} b={mb.messageCount} />
            <div className="pixel text-[9px]">total messages</div>
            <Bar la={ma.name} lb={mb.name} a={ma.profanity} b={mb.profanity} color="var(--hot)" />
            <div className="pixel text-[9px]">profanity</div>
            <Bar la={ma.name} lb={mb.name} a={ma.lateNight} b={mb.lateNight} color="var(--grape)" />
            <div className="pixel text-[9px]">late-night messages</div>
            <Bar la={ma.name} lb={mb.name} a={ma.media} b={mb.media} color="var(--lime)" />
            <div className="pixel text-[9px]">media shared</div>
            <Bar la={ma.name} lb={mb.name} a={ma.deleted} b={mb.deleted} color="var(--ink)" />
            <div className="pixel text-[9px]">messages deleted</div>
            <Bar la={ma.name} lb={mb.name} a={ma.allCaps} b={mb.allCaps} color="var(--sun)" />
            <div className="pixel text-[9px]">ALL CAPS messages</div>
            <Bar la={`${ma.name} → ${mb.name}`} lb={`${mb.name} → ${ma.name}`} a={replyAB} b={replyBA} color="var(--cyan)" />
            <div className="pixel text-[9px]">replies to each other (within 2 min)</div>
          </div>
        </Window>
      )}
    </div>
  );
}
