import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Window } from "@/components/Window";
import { members } from "@/lib/dataset";
import type { Member } from "@/lib/dataset";

export const Route = createFileRoute("/confession")({
  component: ConfessionPage,
  head: () => ({ meta: [{ title: "Confession Booth — Big Group Bruh" }] }),
});

const UNHINGED_QUOTES: Array<{ author: string; text: string }> = [
  { author: "Leon", text: "I hope you trip on a banana peel and land on a spoon which perfectly scoops out your eye giving you a lobotomy in the process" },
  { author: "Emma", text: "I hope a cannibal kidnaps you and then when you wake kills himself and then months later find out that you've contracted a blood-borne disease because the cannibal whilst you were asleep fed you blood & human body parts." },
  { author: "Lloyd", text: "Odds on me getting a hole in one. But I'm not playing golf." },
  { author: "Charlie", text: "I unplugged a CAMERA IN MY ROOM THST HAS A MICREPHONE IN IT ment for my mums car" },
  { author: "Josephy", text: "I wonder how much of her would fit in my mouth." },
  { author: "Ruby", text: "im gonna think because I don't wanna cut my hair then get upset that I have no more hair" },
  { author: "Coral", text: "Im just mega cool. So iim deserve to be admin" },
  { author: "Matilda", text: "guys it isnt funny my brothwr took away my phone like a few hours ago and i just went sleep cuz i wasnar gunna go downstairs to get my phone so now i thought it was morning or smth but now im microwaving domino pizza" },
  { author: "Alias", text: "Mark my words! This drill will open a hole in the universe! And that hole will be a path for those behind us!" },
  { author: "Leon", text: "I hope the evil witch of north america puts a curse on your bloodline" },
  { author: "Leon", text: "I hope you get jumped by tupac at the gates of hell" },
  { author: "Emma", text: "I'M GONNA CRASH SOMEONE FUCKING OUT MY HAMILTON PYJAMAS IN THE BATH WTF" },
  { author: "Leon", text: "I hope you fall off the top of a building and your bones shatter on impact but your flesh remains intact slowly fading out of life" },
  { author: "Leon", text: "Im glad mat broke up with me cuz she would never pierce my dick" },
];

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
