import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { members, fmtDate } from "@/lib/dataset";

export const Route = createFileRoute("/members")({
  component: Page,
  head: () => ({ meta: [{ title: "Member Profiles — Big Group Bruh" }] }),
});

function MiniHourBars({ hist, color }: { hist: number[]; color: string }) {
  const max = Math.max(...hist, 1);
  return (
    <div className="flex items-end gap-[2px] h-12">
      {hist.map((v, i) => (
        <div
          key={i}
          title={`${i}:00 — ${v}`}
          className="flex-1"
          style={{
            height: `${(v / max) * 100}%`,
            background: color,
            border: "1px solid var(--ink)",
            minHeight: 2,
          }}
        />
      ))}
    </div>
  );
}

function Page() {
  const [open, setOpen] = useState<string | null>(null);
  const m = open ? members.find((x) => x.name === open) : null;

  return (
    <div className="grid gap-4">
      <Window title="members.db — pick a profile" variant="cyan" icon="👥">
        <p className="text-sm mb-3">
          {members.length} members. Click a card to open the full dossier.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {members.map((mm) => (
            <button
              key={mm.name}
              onClick={() => setOpen(mm.name)}
              className="win text-left wiggle"
              style={{ background: "white" }}
            >
              <div
                className="win-titlebar"
                style={{ background: mm.color, color: "var(--ink)" }}
              >
                <span className="truncate">{mm.name}</span>
                <span>★</span>
              </div>
              <div className="win-body p-2">
                <div className="flex items-center gap-2">
                  <Avatar name={mm.name} size={36} />
                  <div className="text-xs leading-tight grow min-w-0">
                    <div className="disp text-xl truncate">{mm.messageCount.toLocaleString()}</div>
                    <div className="opacity-70">msgs · 🤬{mm.profanity} · 🦉{mm.lateNight}</div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Window>

      {m && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.5)" }}
          onClick={() => setOpen(null)}
        >
          <div
            className="win max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="win-titlebar" style={{ background: m.color, color: "var(--ink)" }}>
              <span>dossier — {m.name}</span>
              <span className="win-titlebar-buttons">
                <button className="win-btn" onClick={() => setOpen(null)}>×</button>
              </span>
            </div>
            <div className="win-body">
              <div className="flex items-start gap-3 mb-4">
                <Avatar name={m.name} size={64} />
                <div className="grow">
                  <h2 className="pixel text-lg">{m.name}</h2>
                  <p className="italic text-sm mt-1">{m.summary}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                {[
                  ["msgs", m.messageCount],
                  ["🤬 prof", m.profanity],
                  ["🦉 late", m.lateNight],
                  ["📷 media", m.media],
                  ["👻 deleted", m.deleted],
                  ["📢 caps", m.allCaps],
                ].map(([l, v]) => (
                  <div key={l} className="win">
                    <div className="win-body p-2">
                      <div className="pixel text-[8px]">{l}</div>
                      <div className="disp text-xl">{(v as number).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="chip mb-2">activity by hour (UTC)</div>
                <MiniHourBars hist={m.hourHist} color={m.color} />
                <div className="text-xs mt-1 opacity-70">peak: {String(m.peakHour).padStart(2, "0")}:00 · avg msg length {m.avgLen} chars</div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="chip" style={{ background: "var(--cyan)" }}>signature words</div>
                  <ul className="text-sm mt-1">
                    {m.topWords.slice(0, 8).map(([w, c]) => (
                      <li key={w}>· <b>{w}</b> <span className="opacity-60">×{c}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="chip" style={{ background: "var(--lime)" }}>top emoji</div>
                  <div className="text-2xl mt-1">
                    {m.topEmoji.map(([e, c]) => (
                      <span key={e} className="inline-block mr-2" title={`×${c}`}>{e}<sub className="text-xs opacity-60">{c}</sub></span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs opacity-70">
                first seen {m.firstTs ? fmtDate(m.firstTs) : "—"} · last seen {m.lastTs ? fmtDate(m.lastTs) : "—"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
