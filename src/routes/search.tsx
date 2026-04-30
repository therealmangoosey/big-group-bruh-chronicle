import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { loadAllMessages, loadSearchIndex, fmtDateTime } from "@/lib/dataset";
import type { Quote } from "@/lib/dataset";

export const Route = createFileRoute("/search")({
  component: Page,
  head: () => ({ meta: [{ title: "Search — Big Group Bruh" }] }),
});

function Page() {
  const [q, setQ] = useState("");
  const [all, setAll] = useState<Quote[]>([]);
  const [idx, setIdx] = useState<Record<string, number[]> | null>(null);

  useEffect(() => { loadAllMessages().then(setAll); loadSearchIndex().then(setIdx); }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term || !all.length) return [];
    if (idx && idx[term]) {
      const ids = new Set(idx[term]);
      return all.filter((m) => m.id !== undefined && ids.has(m.id)).slice(0, 100);
    }
    // fallback substring
    return all.filter((m) => !m.isMedia && !m.isDeleted && m.text.toLowerCase().includes(term)).slice(0, 100);
  }, [q, all, idx]);

  return (
    <div className="grid gap-4">
      <Window title="search.exe — find any word, any time" variant="cyan" icon="🔍">
        <h2 className="pixel text-xl rainbow mb-2">MESSAGE SEARCH</h2>
        <input
          autoFocus
          placeholder="type a word…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full border-2 border-black px-3 py-2 disp text-2xl"
          style={{ background: "white" }}
        />
        <div className="text-xs mt-1 opacity-70">
          {all.length === 0 ? "loading…" : `${results.length} match${results.length === 1 ? "" : "es"} (capped at 100)`}
        </div>
      </Window>

      <Window title="results.txt">
        {results.length === 0 ? (
          <div className="disp text-2xl text-center py-8 opacity-60">
            {q ? "no hits — try another word" : "type something to search"}
          </div>
        ) : (
          <ul className="space-y-1.5">
            {results.map((m, i) => (
              <li key={i} className="text-sm border-l-4 border-black pl-2 flex items-start gap-2">
                <Avatar name={m.author} size={20} />
                <div className="grow">
                  <div className="text-xs opacity-60">{fmtDateTime(m.ts)}</div>
                  <div><b>{m.author}:</b> {m.text}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Window>
    </div>
  );
}
