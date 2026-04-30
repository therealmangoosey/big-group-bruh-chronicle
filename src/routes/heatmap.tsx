import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Window } from "@/components/Window";
import { daily } from "@/lib/dataset";

export const Route = createFileRoute("/heatmap")({
  component: Page,
  head: () => ({ meta: [{ title: "Activity Heatmap — Big Group Bruh" }] }),
});

function Page() {
  const [hover, setHover] = useState<string | null>(null);
  const dayMap = useMemo(() => new Map(daily.map((d) => [d.date, d])), []);

  // Build a continuous date grid from first to last
  const grid = useMemo(() => {
    if (!daily.length) return [];
    const start = new Date(daily[0].date + "T00:00:00Z");
    const end = new Date(daily[daily.length - 1].date + "T00:00:00Z");
    const days: Array<{ date: string; count: number; weekday: number }> = [];
    // Pad start to Monday
    const startDay = (start.getUTCDay() + 6) % 7; // Mon=0
    const padded = new Date(start);
    padded.setUTCDate(padded.getUTCDate() - startDay);
    const cur = new Date(padded);
    while (cur <= end) {
      const iso = cur.toISOString().slice(0, 10);
      const d = dayMap.get(iso);
      days.push({ date: iso, count: d?.count ?? 0, weekday: (cur.getUTCDay() + 6) % 7 });
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
    return days;
  }, [dayMap]);

  const maxCount = Math.max(...daily.map((d) => d.count), 1);

  // Group into weeks (columns)
  const weeks: Array<typeof grid> = [];
  for (let i = 0; i < grid.length; i += 7) weeks.push(grid.slice(i, i + 7));

  const intensity = (c: number) => {
    if (c === 0) return "transparent";
    const t = Math.min(1, c / maxCount);
    const lev = Math.ceil(t * 5);
    const colors = ["#fde7f3", "#ffb3d9", "#ff66b3", "#ff007f", "#cc0066", "#66001a"];
    return colors[lev];
  };

  const hovered = hover ? dayMap.get(hover) : null;

  return (
    <div className="grid gap-4">
      <Window title="calendar.exe — every day, every message" variant="hot" icon="📅">
        <h2 className="pixel text-xl rainbow mb-2">THE ACTIVITY CALENDAR</h2>
        <p className="text-sm mb-3">Hover any day to see the count and the top quote of that day.</p>

        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-[3px]">
            {weeks.map((w, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {w.map((d) => (
                  <div
                    key={d.date}
                    className="w-3 h-3 border border-black cursor-pointer"
                    style={{ background: intensity(d.count) }}
                    onMouseEnter={() => setHover(d.date)}
                    onFocus={() => setHover(d.date)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${d.date}: ${d.count} messages`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs mt-3">
          <span>less</span>
          {[0, 1, 2, 3, 4, 5].map((l) => (
            <span key={l} className="w-3 h-3 border border-black inline-block"
              style={{ background: intensity((l / 5) * maxCount) }} />
          ))}
          <span>more · max {maxCount.toLocaleString()} msgs</span>
        </div>
      </Window>

      <Window title={hovered ? `${hovered.date}.log` : "hover a day"} variant="cyan" icon="🔎">
        {hovered ? (
          <div>
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <h3 className="pixel">{new Date(hovered.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</h3>
              <div className="disp text-3xl">{hovered.count.toLocaleString()} <span className="text-sm">msgs</span></div>
            </div>
            {hovered.topQuote ? (
              <blockquote className="mt-3 p-3 border-2 border-black bg-white">
                <div className="pixel text-[10px] mb-1">top quote of the day:</div>
                <div className="text-sm"><b>{hovered.topQuote.author}:</b> {hovered.topQuote.text}</div>
              </blockquote>
            ) : (
              <p className="text-sm opacity-60 italic">no text messages on this day</p>
            )}
            <div className="text-xs mt-2 opacity-70">drama score: {hovered.drama}</div>
          </div>
        ) : (
          <p className="disp text-2xl text-center py-6 opacity-60">.. waiting for hover ..</p>
        )}
      </Window>
    </div>
  );
}
