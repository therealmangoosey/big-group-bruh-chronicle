import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Window } from "@/components/Window";
import { daily, stats } from "@/lib/dataset";

export const Route = createFileRoute("/quiet-days")({
  component: QuietDaysPage,
  head: () => ({ meta: [{ title: "Quiet Days Mystery — Big Group Bruh" }] }),
});

function QuietDaysPage() {
  const avgCount = stats.totalMessages / stats.daysCovered;

  const cases = useMemo(() => {
    return daily
      .filter((d) => d.count < avgCount * 0.15 && d.count > 0)
      .sort((a, b) => a.count - b.count)
      .slice(0, 20)
      .map((d, i) => ({
        ...d,
        caseNo: String(i + 1).padStart(3, "0"),
        suspect: d.topQuote?.author ?? "Unknown",
        lastWords: d.topQuote?.text.slice(0, 120) ?? "No evidence recovered.",
        severity: d.count < avgCount * 0.05 ? "CRITICAL" : d.count < avgCount * 0.1 ? "HIGH" : "MEDIUM",
      }));
  }, []);

  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="grid gap-4">
      <Window title="cold_cases.board" variant="cyan" icon="🔍">
        <div className="text-center mb-4 relative">
          <h1 className="pixel text-sm mb-2 rainbow">QUIET DAYS MYSTERY BOARD</h1>
          <p className="text-sm">Unusually low activity days. What happened? Where did everyone go?</p>
          <div className="pixel text-[9px] mt-1">average daily messages: {Math.round(avgCount)}</div>
        </div>

        {/* Detective board */}
        <div className="relative p-4" style={{
          background: "linear-gradient(135deg, #3a2a1a, #4a3a2a)",
          border: "8px solid #5a4a3a",
          minHeight: 300,
        }}>
          {/* String connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {cases.slice(0, 10).map((_, i) => {
              if (i === 0) return null;
              const x1 = 20 + (((i - 1) % 3) * 35);
              const y1 = 20 + Math.floor((i - 1) / 3) * 100;
              const x2 = 20 + ((i % 3) * 35);
              const y2 = 20 + Math.floor(i / 3) * 100;
              return <line key={i} x1={`${x1}%`} y1={y1} x2={`${x2}%`} y2={y2} stroke="#c33" strokeWidth="1" opacity="0.5" />;
            })}
          </svg>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 relative" style={{ zIndex: 1 }}>
            {cases.map((c) => (
              <div
                key={c.date}
                className="cursor-pointer"
                style={{
                  background: "#fffde8",
                  border: "1px solid #aa9",
                  padding: 8,
                  transform: `rotate(${(Math.random() - 0.5) * 4}deg)`,
                  boxShadow: "2px 2px 6px rgba(0,0,0,.3)",
                }}
                onClick={() => setExpanded(expanded === c.date ? null : c.date)}
              >
                <div className="flex justify-between items-center">
                  <span className="pixel text-[8px]" style={{ color: "#900" }}>CASE #{c.caseNo}</span>
                  <span className="pixel text-[7px] px-1 border" style={{
                    color: "white",
                    background: c.severity === "CRITICAL" ? "#c00" : c.severity === "HIGH" ? "#f80" : "#888",
                  }}>{c.severity}</span>
                </div>
                <div className="font-bold text-sm mt-1">{new Date(c.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</div>
                <div className="disp text-lg" style={{ color: "#900" }}>{c.count} messages</div>
                {expanded === c.date && (
                  <div className="mt-2 text-xs border-t border-dashed border-[#aa9] pt-2">
                    <div><b>Last known transmission:</b></div>
                    <div className="italic">"{c.lastWords}"</div>
                    <div className="mt-1"><b>Primary suspect:</b> {c.suspect}</div>
                    <div className="pixel text-[7px] mt-2" style={{ color: "#666" }}>
                      Status: UNSOLVED · {Math.round(((avgCount - c.count) / avgCount) * 100)}% below average
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Window>

      <Window title="theory.txt" icon="📌">
        <div className="text-sm space-y-2 p-2" style={{ fontStyle: "italic", color: "var(--muted-foreground)" }}>
          <p>Working theories for the quiet days:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>School exam periods — too busy to argue</li>
            <li>Weekend with actual real-life plans (unlikely)</li>
            <li>Everyone got banned from their phones simultaneously</li>
            <li>The group collectively touched grass</li>
            <li>A secret secondary group chat exists (classified)</li>
          </ul>
        </div>
      </Window>
    </div>
  );
}
