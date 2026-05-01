import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Window } from "@/components/Window";
import { members, loadAllMessages, fmtDate } from "@/lib/dataset";
import type { Quote, Member } from "@/lib/dataset";

export const Route = createFileRoute("/spotlight")({
  component: SpotlightPage,
  head: () => ({ meta: [{ title: "Member Spotlight — Big Group Bruh" }] }),
});

function SpotlightPage() {
  const [selected, setSelected] = useState<Member | null>(null);
  const [msgs, setMsgs] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  const topMembers = members.filter((m) => m.messageCount > 50);

  const bestQuotes = useMemo(() => {
    if (!selected || !msgs.length) return [];
    return msgs
      .filter((m) => m.author === selected.name && !m.isMedia && !m.isDeleted && !m.isSystem && m.text.length > 30 && m.text.length < 400)
      .sort((a, b) => b.text.length - a.text.length)
      .slice(0, 20);
  }, [selected, msgs]);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setSlideIdx(0);
    loadAllMessages().then((m) => { setMsgs(m); setLoading(false); });
  }, [selected]);

  // Auto advance slideshow
  useEffect(() => {
    if (!bestQuotes.length) return;
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % bestQuotes.length), 5000);
    return () => clearInterval(t);
  }, [bestQuotes.length]);

  return (
    <div className="grid gap-4">
      <Window title="spotlight_reel.mov" variant="hot" icon="🎬">
        <h1 className="pixel text-sm mb-3 rainbow text-center">MEMBER SPOTLIGHT REEL</h1>
        <p className="text-sm text-center mb-4">Click any member for a cinematic highlight of their greatest moments.</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {topMembers.map((m) => (
            <button
              key={m.name}
              className="win wiggle cursor-pointer"
              style={{
                background: selected?.name === m.name ? m.color : undefined,
                boxShadow: selected?.name === m.name ? `0 0 16px ${m.color}` : undefined,
              }}
              onClick={() => setSelected(m)}
            >
              <div className="win-body p-1 text-center">
                <div className="w-8 h-8 mx-auto border-2 border-black flex items-center justify-center pixel text-[8px]" style={{ background: m.color, color: "white" }}>
                  {m.initials}
                </div>
                <div className="pixel text-[7px] truncate mt-1">{m.name}</div>
              </div>
            </button>
          ))}
        </div>
      </Window>

      {selected && (
        <Window title={`${selected.name}_highlight.mov`} variant="cyan" icon="🌟">
          {loading ? (
            <div className="text-center py-8 pixel text-sm blink">loading reel…</div>
          ) : (
            <div>
              {/* Stats bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[
                  ["Messages", selected.messageCount],
                  ["Profanity", selected.profanity],
                  ["Late Night", selected.lateNight],
                  ["Media", selected.media],
                ].map(([label, val]) => (
                  <div key={label as string} className="text-center p-2 border-2 border-black" style={{
                    background: selected.color + "33",
                    animation: "scale-in .3s ease-out",
                  }}>
                    <div className="pixel text-[8px]">{label as string}</div>
                    <div className="disp text-2xl">{(val as number).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              {/* Mini calendar — hour histogram */}
              <div className="mb-4">
                <div className="pixel text-[9px] mb-1">activity by hour</div>
                <div className="flex gap-px h-12 items-end">
                  {selected.hourHist.map((count, h) => {
                    const max = Math.max(...selected.hourHist);
                    const pct = max ? (count / max) * 100 : 0;
                    const isPeak = h === selected.peakHour;
                    return (
                      <div key={h} className="flex-1" title={`${h}:00 — ${count} msgs`}>
                        <div style={{
                          height: `${pct}%`,
                          background: isPeak ? "var(--hot)" : selected.color,
                          boxShadow: isPeak ? "0 0 8px var(--hot)" : "none",
                          minHeight: count > 0 ? 2 : 0,
                          transition: "height .3s",
                        }} />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between pixel text-[7px] mt-1">
                  <span>0:00</span><span>12:00</span><span>23:00</span>
                </div>
              </div>

              {/* Quote slideshow */}
              {bestQuotes.length > 0 && (
                <div className="relative p-4 border-2 border-black" style={{
                  background: "linear-gradient(135deg, #0a0008, #1a0018)",
                  minHeight: 120,
                }}>
                  <blockquote className="disp text-lg" style={{ color: "#eee", animation: "fade-in .5s ease-out" }} key={slideIdx}>
                    "{bestQuotes[slideIdx].text.slice(0, 280)}{bestQuotes[slideIdx].text.length > 280 ? "…" : ""}"
                  </blockquote>
                  <div className="pixel text-[8px] mt-2" style={{ color: "#888" }}>
                    {fmtDate(bestQuotes[slideIdx].ts)} · {slideIdx + 1}/{bestQuotes.length}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="y2k-btn" style={{ padding: "2px 8px", fontSize: 10 }} onClick={() => setSlideIdx((i) => (i - 1 + bestQuotes.length) % bestQuotes.length)}>‹</button>
                    <button className="y2k-btn" style={{ padding: "2px 8px", fontSize: 10 }} onClick={() => setSlideIdx((i) => (i + 1) % bestQuotes.length)}>›</button>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="mt-3 pixel text-[9px] text-center" style={{ color: "var(--muted-foreground)" }}>
                {selected.summary}
              </div>
            </div>
          )}
        </Window>
      )}
    </div>
  );
}
