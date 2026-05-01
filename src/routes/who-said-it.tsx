import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Window } from "@/components/Window";
import { members, loadAllMessages } from "@/lib/dataset";
import type { Quote, Member } from "@/lib/dataset";

export const Route = createFileRoute("/who-said-it")({
  component: WhoSaidItPage,
  head: () => ({ meta: [{ title: "Who Said It? — Big Group Bruh" }] }),
});

const TOP = members.filter((m) => m.messageCount > 200).slice(0, 12);

function WhoSaidItPage() {
  const [allMsgs, setAllMsgs] = useState<Quote[] | null>(null);
  const [pool, setPool] = useState<Quote[]>([]);
  const [current, setCurrent] = useState<Quote | null>(null);
  const [options, setOptions] = useState<Member[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [numChoices, setNumChoices] = useState(4);

  useEffect(() => {
    loadAllMessages().then((msgs) => {
      const valid = msgs.filter((m) => !m.isMedia && !m.isDeleted && !m.isSystem && m.text.length > 20 && m.text.length < 300);
      setAllMsgs(valid);
      setPool(valid);
    });
  }, []);

  const nextRound = useCallback(() => {
    if (!pool.length) return;
    const msg = pool[Math.floor(Math.random() * pool.length)];
    const correct = TOP.find((m) => m.name === msg.author);
    if (!correct) { setPool((p) => p.filter((x) => x !== msg)); return; }
    const others = TOP.filter((m) => m.name !== msg.author);
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, numChoices - 1);
    const opts = [correct, ...shuffled].sort(() => Math.random() - 0.5);
    setCurrent(msg);
    setOptions(opts);
    setFeedback(null);
  }, [pool, numChoices]);

  useEffect(() => {
    if (allMsgs && round === 0) nextRound();
  }, [allMsgs]);

  const guess = (name: string) => {
    if (feedback) return;
    if (name === current?.author) {
      setFeedback("correct");
      setScore((s) => s + 1);
      const ns = streak + 1;
      setStreak(ns);
      if (ns > 0 && ns % 5 === 0 && numChoices < TOP.length) setNumChoices((n) => Math.min(n + 2, TOP.length));
    } else {
      setFeedback("wrong");
      setStreak(0);
    }
    setTimeout(() => { setRound((r) => r + 1); nextRound(); }, 1200);
  };

  if (!allMsgs) {
    return (
      <Window title="loading.exe" icon="⏳"><div className="text-center py-8 pixel text-sm blink">loading messages…</div></Window>
    );
  }

  return (
    <div className="grid gap-4">
      <Window title="who_said_it.game" variant="cyan" icon="🎮">
        <div className="text-center mb-4">
          <h1 className="pixel text-sm mb-1 rainbow">WHO SAID IT?</h1>
          <div className="flex justify-center gap-4 pixel text-[10px]">
            <span>score: {score}</span>
            <span>streak: {streak} 🔥</span>
            <span>round: {round + 1}</span>
            <span>choices: {numChoices}</span>
          </div>
        </div>

        {current && (
          <div className="space-y-4">
            <blockquote
              className="p-4 border-2 border-black text-center"
              style={{
                background: "linear-gradient(135deg, oklch(0.97 0.02 270), oklch(0.92 0.05 95))",
                minHeight: 80,
              }}
            >
              <div className="disp text-xl md:text-2xl">"{current.text.slice(0, 200)}{current.text.length > 200 ? "…" : ""}"</div>
            </blockquote>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {options.map((m) => {
                const isCorrect = m.name === current.author;
                let bg = m.color;
                if (feedback === "correct" && isCorrect) bg = "var(--lime)";
                else if (feedback === "wrong" && isCorrect) bg = "var(--lime)";
                else if (feedback === "wrong" && !isCorrect) bg = "#ccc";
                return (
                  <button
                    key={m.name}
                    className="win wiggle cursor-pointer"
                    style={{
                      background: bg,
                      transition: "all .2s",
                      transform: feedback && isCorrect ? "scale(1.1)" : undefined,
                    }}
                    onClick={() => guess(m.name)}
                  >
                    <div className="win-body p-2 text-center">
                      <div
                        className="w-10 h-10 mx-auto border-2 border-black flex items-center justify-center pixel text-xs mb-1"
                        style={{ background: m.color, color: "white" }}
                      >
                        {m.initials}
                      </div>
                      <div className="pixel text-[8px] truncate">{m.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div
                className="text-center pixel text-sm p-2"
                style={{
                  color: feedback === "correct" ? "var(--lime)" : "var(--hot)",
                  animation: "scale-in .2s ease-out",
                }}
              >
                {feedback === "correct" ? "✓ CORRECT!" : `✗ WRONG — it was ${current.author}`}
              </div>
            )}
          </div>
        )}
      </Window>
    </div>
  );
}
