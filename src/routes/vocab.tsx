import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Window } from "@/components/Window";
import { vocab, loadAllMessages } from "@/lib/dataset";
import type { Quote } from "@/lib/dataset";

export const Route = createFileRoute("/vocab")({
  component: Page,
  head: () => ({ meta: [{ title: "Vocabulary Cloud — Big Group Bruh" }] }),
});

function Page() {
  const [picked, setPicked] = useState<string | null>(null);
  const [hits, setHits] = useState<Quote[]>([]);
  const max = vocab.words[0]?.[1] ?? 1;
  const min = vocab.words[vocab.words.length - 1]?.[1] ?? 1;

  const cloud = useMemo(() => vocab.words.slice(0, 120), []);

  async function pick(w: string) {
    setPicked(w);
    setHits([]);
    const all = await loadAllMessages();
    const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    setHits(all.filter((m) => !m.isMedia && !m.isDeleted && re.test(m.text)).slice(0, 30));
  }

  return (
    <div className="grid gap-4">
      <Window title="vocab-cloud.exe — the group's lexicon" variant="lime" icon="📖">
        <h2 className="pixel text-xl rainbow mb-2">VOCABULARY CLOUD</h2>
        <p className="text-sm">Click a word to see every instance.</p>
      </Window>

      <Window title="words.cloud">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 p-3">
          {cloud.map(([w, c]) => {
            const t = (Math.log(c) - Math.log(min)) / (Math.log(max) - Math.log(min) || 1);
            const size = 11 + t * 38;
            const colors = ["var(--hot)", "var(--cyan)", "var(--grape)", "var(--ink)", "var(--lime)"];
            const color = colors[w.length % colors.length];
            return (
              <button
                key={w}
                onClick={() => pick(w)}
                className="hover:underline wiggle"
                style={{ fontSize: size, color, fontWeight: 700, lineHeight: 1.1 }}
                title={`×${c}`}
              >
                {w}
              </button>
            );
          })}
        </div>
      </Window>

      <Window title="emoji.cloud" variant="hot">
        <div className="flex flex-wrap gap-2 text-3xl">
          {vocab.emoji.map(([e, c]) => (
            <span key={e} title={`×${c}`} className="border-2 border-black px-1 py-0.5 bg-white">
              {e}<sub className="text-xs opacity-60 ml-0.5">{c}</sub>
            </span>
          ))}
        </div>
      </Window>

      {picked && (
        <Window title={`results: "${picked}"`} variant="cyan">
          <p className="text-xs mb-2 opacity-70">{hits.length} matches (capped at 30)</p>
          {hits.length === 0 ? (
            <div className="disp text-xl text-center py-4 opacity-60">searching…</div>
          ) : (
            <ul className="space-y-1">
              {hits.map((m, i) => (
                <li key={i} className="text-sm border-l-4 border-black pl-2">
                  <b>{m.author}:</b> {m.text}
                </li>
              ))}
            </ul>
          )}
        </Window>
      )}
    </div>
  );
}
