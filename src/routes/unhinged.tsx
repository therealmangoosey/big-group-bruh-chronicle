import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { unhinged, fmtDateTime } from "@/lib/dataset";

export const Route = createFileRoute("/unhinged")({
  component: Page,
  head: () => ({ meta: [{ title: "Unhinged Files — Big Group Bruh" }] }),
});

function Page() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="grid gap-4">
      <Window title="unhinged-files.exe — official archive" variant="hot" icon="📂">
        <h2 className="pixel text-xl rainbow mb-2">UNHINGED INCIDENTS</h2>
        <p className="text-sm">
          Clusters where the chat became unsalvageable. {unhinged.length} files on record.
          Click a folder to read the report.
        </p>
      </Window>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {unhinged.map((u, i) => (
          <button
            key={i}
            className="text-left wiggle"
            onClick={() => setOpen(i)}
            style={{
              background: "#e9b95c",
              border: "2px solid var(--ink)",
              boxShadow: "3px 3px 0 var(--ink)",
              padding: "8px 10px 16px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute", top: -6, left: 8,
                width: 50, height: 10, background: "#e9b95c",
                border: "2px solid var(--ink)", borderBottom: "none",
              }}
            />
            <div className="pixel text-[10px] mb-1">CASE #{String(i + 1).padStart(3, "0")}</div>
            <div className="font-bold text-sm">{new Date(u.ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
            <div className="text-xs opacity-80">{u.messages.length} messages · {fmtDateTime(u.ts).split(" ").pop()}</div>
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.6)" }}
          onClick={() => setOpen(null)}
        >
          <div className="win max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="win-titlebar">
              <span>incident report — case #{String(open + 1).padStart(3, "0")}</span>
              <button className="win-btn" onClick={() => setOpen(null)}>×</button>
            </div>
            <div className="win-body">
              <div className="text-xs mb-3 opacity-70">
                date: {fmtDateTime(unhinged[open].ts)} · {unhinged[open].messages.length} messages logged
              </div>
              <div className="grid gap-1.5">
                {unhinged[open].messages.map((m, j) => (
                  <div key={j} className="flex items-start gap-2 text-sm">
                    <Avatar name={m.author} size={20} />
                    <div className="grow">
                      <b>{m.author}:</b> {m.text}
                      <span className="opacity-50 text-xs ml-2">{fmtDateTime(m.ts).split(" ").pop()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
