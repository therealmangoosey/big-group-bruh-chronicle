import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Window } from "@/components/Window";
import { loadAllMessages, members, colorOf } from "@/lib/dataset";
import type { Quote } from "@/lib/dataset";

export const Route = createFileRoute("/starters")({
  component: StartersPage,
  head: () => ({ meta: [{ title: "Conversation Starters — Big Group Bruh" }] }),
});

function StartersPage() {
  const [msgs, setMsgs] = useState<Quote[] | null>(null);
  useEffect(() => { loadAllMessages().then(setMsgs); }, []);

  const data = useMemo(() => {
    if (!msgs) return null;
    const byDay = new Map<string, Quote>();
    for (const m of msgs) {
      if (m.isSystem) continue;
      const d = m.date ?? new Date(m.ts).toISOString().slice(0, 10);
      if (!byDay.has(d)) byDay.set(d, m);
    }
    const tally = new Map<string, number>();
    const entries: Array<{ date: string; author: string; text: string }> = [];
    for (const [date, msg] of byDay) {
      tally.set(msg.author, (tally.get(msg.author) ?? 0) + 1);
      entries.push({ date, author: msg.author, text: msg.text });
    }
    const ranked = [...tally.entries()].sort((a, b) => b[1] - a[1]);
    return { ranked, entries: entries.sort((a, b) => a.date.localeCompare(b.date)) };
  }, [msgs]);

  if (!data) {
    return <Window title="loading.exe" icon="⏳"><div className="text-center py-8 pixel text-sm blink">loading…</div></Window>;
  }

  return (
    <div className="grid gap-4">
      <Window title="conversation_starters.tally" variant="lime" icon="🌅">
        <h1 className="pixel text-sm mb-3 rainbow text-center">CONVERSATION STARTER TRACKER</h1>
        <p className="text-sm text-center mb-4">Who sent the first message of the day the most?</p>

        <div className="space-y-2 mb-4">
          {data.ranked.slice(0, 15).map(([name, count], i) => {
            const maxC = data.ranked[0][1];
            return (
              <div key={name} className="flex items-center gap-2">
                <span className="pixel text-[9px] w-6 text-right">#{i + 1}</span>
                <div className="w-4 h-4 border border-black shrink-0" style={{ background: colorOf(name) }} />
                <span className="text-sm truncate grow">{name}</span>
                <div className="w-24 h-3 border border-black relative overflow-hidden" style={{ background: "#eee" }}>
                  <div style={{ width: `${(count / maxC) * 100}%`, height: "100%", background: colorOf(name) }} />
                </div>
                <span className="disp text-lg w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </Window>

      <Window title="first_messages.log" variant="cyan" icon="📜">
        <div className="max-h-80 overflow-y-auto space-y-1">
          {data.entries.map((e) => (
            <div key={e.date} className="flex items-start gap-2 text-xs border-b border-dotted border-[var(--ink)] pb-1">
              <span className="pixel text-[8px] w-20 shrink-0">{e.date}</span>
              <span className="w-3 h-3 border border-black shrink-0 mt-0.5" style={{ background: colorOf(e.author) }} />
              <span className="font-bold shrink-0">{e.author}:</span>
              <span className="truncate opacity-70">{e.text.slice(0, 80)}</span>
            </div>
          ))}
        </div>
      </Window>
    </div>
  );
}
