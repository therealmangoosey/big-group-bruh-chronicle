import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Window } from "@/components/Window";
import { members } from "@/lib/dataset";
import { CONCERNING_QUOTES } from "@/data/all-quotes";

export const Route = createFileRoute("/confession")({
  component: ConfessionPage,
  head: () => ({ meta: [{ title: "Confession Booth — Big Group Bruh" }] }),
});

const UNHINGED_QUOTES = CONCERNING_QUOTES;

function ConfessionPage() {
  const [entered, setEntered] = useState(false);
  const [idx, setIdx] = useState(0);
  const [reveal, setReveal] = useState(0); // chars revealed
  const current = UNHINGED_QUOTES[idx];

  useEffect(() => {
    if (!entered) return;
    setReveal(0);
    const len = current.text.length;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setReveal(i);
      if (i >= len) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [idx, entered]);

  if (!entered) {
    return (
      <div className="grid gap-4">
        <Window title="confession_booth.exe" variant="hot" icon="🕯️">
          <div
            className="relative cursor-pointer overflow-hidden"
            style={{
              minHeight: 400,
              background: "linear-gradient(180deg, #0a0008 0%, #1a0018 50%, #0a0008 100%)",
            }}
            onClick={() => setEntered(true)}
          >
            {/* Curtain halves */}
            <div className="absolute inset-0 flex">
              <div
                className="w-1/2 h-full"
                style={{
                  background: "repeating-linear-gradient(180deg, #2a0020 0 12px, #1a0012 12px 24px)",
                  borderRight: "3px solid #440033",
                  transition: "transform .8s ease-in-out",
                }}
              />
              <div
                className="w-1/2 h-full"
                style={{
                  background: "repeating-linear-gradient(180deg, #2a0020 0 12px, #1a0012 12px 24px)",
                  borderLeft: "3px solid #440033",
                  transition: "transform .8s ease-in-out",
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center" style={{ color: "#ff0090" }}>
                <div className="pixel text-lg mb-3 blink">CONFESSION BOOTH</div>
                <div className="disp text-2xl">click the curtain to enter</div>
                <div className="pixel text-[9px] mt-3 opacity-60">what happens here stays here (it won't)</div>
              </div>
            </div>
          </div>
        </Window>
      </div>
    );
  }

  const authorMember = members.find((m) => m.name === current.author);

  return (
    <div className="grid gap-4">
      <Window title="confession_booth.exe — INSIDE" variant="hot" icon="🕯️">
        <div
          style={{
            minHeight: 350,
            background: "linear-gradient(180deg, #0a0008, #0d0011, #0a0008)",
            padding: 24,
            position: "relative",
          }}
        >
          <div className="scanlines" />
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 border-2 border-[#ff0090] flex items-center justify-center pixel text-xs shrink-0"
              style={{ background: authorMember?.color ?? "#666", color: "white" }}
            >
              {authorMember?.initials ?? "??"}
            </div>
            <div>
              <div className="pixel text-xs" style={{ color: "#ff0090" }}>{current.author}</div>
              <div className="pixel text-[8px]" style={{ color: "#666" }}>confesses…</div>
            </div>
          </div>
          <blockquote
            className="disp text-xl md:text-2xl"
            style={{ color: "#ddd", lineHeight: 1.4, minHeight: 120 }}
          >
            "{current.text.slice(0, reveal)}
            {reveal < current.text.length && <span className="blink" style={{ color: "#ff0090" }}>▋</span>}"
          </blockquote>
          <div className="flex gap-2 mt-6">
            <button
              className="y2k-btn"
              data-variant="hot"
              onClick={() => setIdx((i) => (i + 1) % UNHINGED_QUOTES.length)}
            >
              next confession ›
            </button>
            <button className="y2k-btn" onClick={() => setEntered(false)}>
              leave booth
            </button>
          </div>
          <div className="pixel text-[8px] mt-3" style={{ color: "#444" }}>
            {idx + 1} / {UNHINGED_QUOTES.length}
          </div>
        </div>
      </Window>
    </div>
  );
}
