import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { beef, fmtDateTime } from "@/lib/dataset";

export const Route = createFileRoute("/beef")({
  component: Page,
  head: () => ({ meta: [{ title: "Beef Tracker — Big Group Bruh" }] }),
});

function Page() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="grid gap-4">
      <Window title="beef-tracker.exe" variant="hot" icon="🥩">
        <h2 className="pixel text-xl rainbow mb-2">THE BEEF SECTION</h2>
        <p className="text-sm">
          Pairs of members with the most spicy back-and-forth (profane reply within 3 minutes).
          Click a case file to see the actual messages.
        </p>
      </Window>

      <div className="grid gap-3">
        {beef.map((b, i) => (
          <div key={i} className="win">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left"
            >
              <div className="win-titlebar" style={{ background: "linear-gradient(90deg,#ff0044,#ff8a00)" }}>
                <span>case #{String(i + 1).padStart(2, "0")}: {b.a} vs {b.b}</span>
                <span>{open === i ? "▼" : "▶"}</span>
              </div>
            </button>
            <div className="win-body">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2"><Avatar name={b.a} size={32} /><b>{b.a}</b></div>
                <span className="pixel text-2xl" style={{ color: "var(--hot)" }}>VS</span>
                <div className="flex items-center gap-2"><Avatar name={b.b} size={32} /><b>{b.b}</b></div>
                <div className="grow" />
                <div className="chip" style={{ background: "var(--hot)", color: "white" }}>
                  beef score: {b.score}
                </div>
              </div>
              {open === i && (
                <div className="mt-3 grid gap-2">
                  <div className="pixel text-[10px]">evidence:</div>
                  {b.sample.map((s, j) => (
                    <div key={j} className="border-2 border-black p-2 bg-white text-sm">
                      <div className="text-xs opacity-60 mb-0.5">{fmtDateTime(s.ts)}</div>
                      <b>{s.author}:</b> {s.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
