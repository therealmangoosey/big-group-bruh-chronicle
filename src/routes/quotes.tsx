import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { ALL_QUOTES } from "@/data/all-quotes";

export const Route = createFileRoute("/quotes")({
  component: QuotesPage,
  head: () => ({ meta: [{ title: "Every Quote — Big Group Bruh" }] }),
});

function QuotesPage() {
  const [author, setAuthor] = useState<string>("All");
  const [showConcerning, setShowConcerning] = useState(true);

  const authors = useMemo(() => ["All", ...Array.from(new Set(ALL_QUOTES.map((q) => q.author)))], []);
  const filtered = useMemo(
    () =>
      ALL_QUOTES.filter(
        (q) => (author === "All" || q.author === author) && (showConcerning || !q.concerning),
      ),
    [author, showConcerning],
  );

  return (
    <div className="grid gap-4">
      <Window title="every-quote.txt — the full archive" variant="hot" icon="💬">
        <h2 className="pixel text-xl rainbow mb-2">EVERY QUOTE WORTH KEEPING</h2>
        <p className="text-sm" style={{ color: "white" }}>
          {ALL_QUOTES.length} quotes pulled straight from the chronicle. The truly cursed ones live in the{" "}
          <a href="/confession" className="underline" style={{ color: "var(--lime)" }}>Confession Booth</a>.
        </p>

        <div className="flex gap-3 mt-3 flex-wrap items-center">
          <label className="pixel text-[10px]" style={{ color: "white" }}>
            who:&nbsp;
            <select
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border-2 border-black px-2 py-1 disp"
              style={{ background: "white", color: "#0a0a0a" }}
            >
              {authors.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </label>
          <label className="pixel text-[10px] flex items-center gap-2" style={{ color: "white", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={showConcerning}
              onChange={(e) => setShowConcerning(e.target.checked)}
            />
            include concerning quotes
          </label>
          <span className="pixel text-[10px]" style={{ color: "rgba(255,255,255,.6)" }}>
            showing {filtered.length}
          </span>
        </div>
      </Window>

      <div className="grid gap-2 md:grid-cols-2">
        {filtered.map((q, i) => (
          <div
            key={i}
            className="p-3 border-2 border-black"
            style={{
              background: q.concerning
                ? "linear-gradient(180deg,#ffe2e2,#ffd0d0)"
                : "linear-gradient(180deg,#fffde8,#f8f4d0)",
              boxShadow: "2px 2px 0 var(--ink)",
              color: "#0a0a0a",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Avatar name={q.author} size={20} />
              <b style={{ color: "#0a0a0a" }}>{q.author}</b>
              {q.concerning && (
                <span className="pixel text-[8px]" style={{ color: "#a00" }}>⚠ concerning</span>
              )}
            </div>
            <p className="disp text-base" style={{ color: "#0a0a0a", lineHeight: 1.4 }}>
              "{q.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
