import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Window } from "@/components/Window";
import { loadAllMessages, messagesIndex } from "@/lib/dataset";
import type { Quote } from "@/lib/dataset";

export const Route = createFileRoute("/hot-words")({
  component: HotWordsPage,
  head: () => ({ meta: [{ title: "Hot Words of the Week — Big Group Bruh" }] }),
});

const STOP = new Set(["the","a","an","to","in","is","it","and","or","but","for","of","on","at","by","i","you","he","she","we","they","me","my","your","this","that","was","are","were","been","be","have","has","had","do","does","did","will","would","can","could","should","just","not","no","so","if","its","with","from","up","out","what","who","how","all","about","when","than","them","then","there","also","more","im","dont","cant","thats","like","yeah","yea","ok","okay","lol","lmao","bruh","bro","message","deleted","media","omitted"]);

function getWeekKey(ts: number) {
  const d = new Date(ts);
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return start.toISOString().slice(0, 10);
}

function HotWordsPage() {
  const [msgs, setMsgs] = useState<Quote[] | null>(null);
  useEffect(() => { loadAllMessages().then(setMsgs); }, []);

  const weeks = useMemo(() => {
    if (!msgs) return [];
    const globalFreq = new Map<string, number>();
    const weekMap = new Map<string, Map<string, number>>();
    
    for (const m of msgs) {
      if (m.isMedia || m.isDeleted || m.isSystem) continue;
      const week = getWeekKey(m.ts);
      if (!weekMap.has(week)) weekMap.set(week, new Map());
      const wm = weekMap.get(week)!;
      const words = m.text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
      for (const w of words) {
        globalFreq.set(w, (globalFreq.get(w) ?? 0) + 1);
        wm.set(w, (wm.get(w) ?? 0) + 1);
      }
    }
    
    const totalWeeks = weekMap.size;
    const avgFreq = new Map<string, number>();
    for (const [w, c] of globalFreq) avgFreq.set(w, c / totalWeeks);
    
    const result: Array<{
      week: string;
      hot: Array<{ word: string; count: number; spike: number; unique: boolean }>;
    }> = [];
    
    for (const [week, wm] of [...weekMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      const hot: typeof result[0]["hot"] = [];
      for (const [word, count] of wm) {
        const avg = avgFreq.get(word) ?? 0;
        if (count < 3 || avg < 0.5) continue;
        const spike = avg > 0 ? count / avg : count;
        const unique = count > 3 && (globalFreq.get(word) ?? 0) <= count * 1.2;
        if (spike > 1.5 || unique) hot.push({ word, count, spike, unique });
      }
      hot.sort((a, b) => b.spike - a.spike);
      result.push({ week, hot: hot.slice(0, 15) });
    }
    return result;
  }, [msgs]);

  const [weekIdx, setWeekIdx] = useState(0);

  if (!msgs) {
    return <Window title="loading.exe" icon="⏳"><div className="text-center py-8 pixel text-sm blink">loading…</div></Window>;
  }

  const w = weeks[weekIdx];

  return (
    <div className="grid gap-4">
      <Window title="hot_words.weekly" variant="hot" icon="🔥">
        <h1 className="pixel text-sm mb-3 rainbow text-center">HOT WORDS OF THE WEEK</h1>
        <div className="flex items-center justify-center gap-3 mb-4">
          <button className="y2k-btn" onClick={() => setWeekIdx((i) => Math.max(0, i - 1))} disabled={weekIdx === 0}>‹ prev</button>
          <span className="pixel text-[10px]">week of {w?.week ?? "?"}</span>
          <button className="y2k-btn" onClick={() => setWeekIdx((i) => Math.min(weeks.length - 1, i + 1))} disabled={weekIdx === weeks.length - 1}>next ›</button>
        </div>

        {w && w.hot.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {w.hot.map((h) => (
              <span
                key={h.word}
                className="pixel border-2 border-black px-2 py-1"
                style={{
                  fontSize: Math.min(9 + h.spike * 2, 20),
                  background: h.unique
                    ? "linear-gradient(135deg, var(--hot), var(--sun))"
                    : "oklch(0.92 0.18 95 / .5)",
                  boxShadow: h.unique ? "0 0 12px var(--hot)" : "none",
                  color: h.unique ? "white" : "var(--ink)",
                }}
                title={`used ${h.count}x this week, ${h.spike.toFixed(1)}x above average${h.unique ? " — UNIQUE to this week" : ""}`}
              >
                {h.word} <span className="text-[8px]">×{h.count}</span>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 pixel text-[10px] opacity-50">no significant word spikes this week</div>
        )}

        <div className="mt-4 flex justify-center">
          <div className="flex gap-px">
            {weeks.map((_, i) => (
              <button
                key={i}
                className="w-2 h-4 border border-black"
                style={{
                  background: i === weekIdx ? "var(--hot)" : weeks[i].hot.length > 5 ? "var(--sun)" : "#ddd",
                }}
                onClick={() => setWeekIdx(i)}
                title={`Week ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </Window>
    </div>
  );
}
