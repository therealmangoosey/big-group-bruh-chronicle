import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { loadAllMessages, fmtDateTime, colorOf } from "@/lib/dataset";
import type { Quote } from "@/lib/dataset";

export const Route = createFileRoute("/replay")({
  component: Page,
  head: () => ({ meta: [{ title: "Chat Replay — Big Group Bruh" }] }),
});

const SPEEDS = [1, 4, 16, 64, 256] as const;

function Page() {
  const [all, setAll] = useState<Quote[]>([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<typeof SPEEDS[number]>(16);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAllMessages().then((m) => setAll(m));
  }, []);

  useEffect(() => {
    if (!playing || all.length === 0) return;
    const id = setInterval(() => {
      setIdx((i) => Math.min(all.length - 1, i + speed));
    }, 60);
    return () => clearInterval(id);
  }, [playing, speed, all.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "auto" });
  }, [idx]);

  const visible = useMemo(() => all.slice(Math.max(0, idx - 60), idx + 1), [all, idx]);
  const cur = all[idx];

  if (all.length === 0) {
    return (
      <Window title="loading.gif" variant="cyan">
        <div className="disp text-2xl text-center py-12">loading the entire chat …</div>
      </Window>
    );
  }

  return (
    <div className="grid gap-4">
      <Window title="chat-replay.exe — relive the chaos" variant="hot" icon="📱">
        <h2 className="pixel text-xl rainbow mb-2">CHAT REPLAY MODE</h2>
        <p className="text-sm">Scrub the timeline, change the speed, watch six months of mess play back.</p>
      </Window>

      <div className="grid md:grid-cols-[minmax(0,1fr)_320px] gap-4">
        {/* phone */}
        <div
          className="mx-auto"
          style={{
            width: "100%", maxWidth: 380,
            background: "#0d0d10", borderRadius: 36, padding: 12,
            border: "3px solid var(--ink)", boxShadow: "6px 6px 0 var(--ink)",
          }}
        >
          <div style={{
            background: "#e5ddd5", borderRadius: 24, height: 560,
            display: "flex", flexDirection: "column", overflow: "hidden",
            backgroundImage: "radial-gradient(rgba(0,0,0,.05) 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}>
            <div style={{ background: "#075e54", color: "white", padding: "8px 12px", fontFamily: "Tahoma" }}>
              <div className="text-xs opacity-80">Big group bruh · 37 members</div>
              <div className="text-[10px] opacity-60">{cur ? fmtDateTime(cur.ts) : ""}</div>
            </div>
            <div ref={scrollRef} className="grow overflow-y-auto p-2 space-y-1">
              {visible.map((m, i) => {
                const mine = m.author === "Leon";
                return (
                  <div key={m.id ?? i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className="max-w-[80%] px-2 py-1 text-sm"
                      style={{
                        background: mine ? "#dcf8c6" : "white",
                        border: "1px solid rgba(0,0,0,.1)",
                        borderRadius: 8,
                        boxShadow: "0 1px 0 rgba(0,0,0,.1)",
                      }}
                    >
                      {!mine && (
                        <div className="text-[10px] font-bold" style={{ color: colorOf(m.author) }}>
                          {m.author}
                        </div>
                      )}
                      <div className={m.isDeleted ? "italic opacity-60" : ""}>
                        {m.isMedia ? "📎 [media]" : m.isDeleted ? "🚫 message deleted" : m.text}
                      </div>
                      <div className="text-[9px] opacity-50 text-right">
                        {new Date(m.ts).toISOString().slice(11, 16)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* controls */}
        <Window title="controls.dll" variant="cyan">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button className="y2k-btn" data-variant="hot" onClick={() => setPlaying((p) => !p)}>
                {playing ? "⏸ pause" : "▶ play"}
              </button>
              <button className="y2k-btn" onClick={() => { setIdx(0); setPlaying(false); }}>↻ restart</button>
            </div>
            <div>
              <div className="pixel text-[9px] mb-1">speed</div>
              <div className="flex gap-1 flex-wrap">
                {SPEEDS.map((s) => (
                  <button key={s} className="y2k-btn" data-variant={s === speed ? "hot" : undefined}
                    style={{ fontSize: 10, padding: "4px 8px" }}
                    onClick={() => setSpeed(s)}>
                    {s}×
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="pixel text-[9px] mb-1">timeline</div>
              <input
                type="range" min={0} max={all.length - 1} value={idx}
                onChange={(e) => { setIdx(Number(e.target.value)); }}
                className="w-full"
              />
              <div className="text-xs opacity-70 mt-1">
                msg {idx.toLocaleString()} / {all.length.toLocaleString()}
              </div>
              <div className="text-xs opacity-70">{cur ? fmtDateTime(cur.ts) : ""}</div>
            </div>
            {cur && (
              <div className="border-2 border-black p-2 text-sm" style={{ background: "white" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Avatar name={cur.author} size={20} />
                  <b>{cur.author}</b>
                </div>
                <div>{cur.isMedia ? "📎 [media]" : cur.isDeleted ? "🚫 deleted" : cur.text.slice(0, 200)}</div>
              </div>
            )}
          </div>
        </Window>
      </div>
    </div>
  );
}
