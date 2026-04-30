import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { leaderboards } from "@/lib/dataset";

export const Route = createFileRoute("/leaderboard")({
  component: Page,
  head: () => ({ meta: [{ title: "Leaderboard — Big Group Bruh" }] }),
});

const TABS = [
  { id: "activity", label: "🗣 Activity", color: "var(--cyan)" },
  { id: "profanity", label: "🤬 Profanity", color: "var(--hot)" },
  { id: "lateNight", label: "🦉 Late Night", color: "var(--grape)" },
  { id: "deleted", label: "👻 Deleted", color: "var(--ink)" },
  { id: "media", label: "📷 Media", color: "var(--lime)" },
  { id: "allCaps", label: "📢 ALL CAPS", color: "var(--sun)" },
] as const;

type TabId = typeof TABS[number]["id"];

function Page() {
  const [tab, setTab] = useState<TabId>("activity");
  const data = leaderboards[tab].slice(0, 25);
  const max = data[0]?.[1] ?? 1;
  const tabMeta = TABS.find((t) => t.id === tab)!;

  return (
    <div className="grid gap-4">
      <Window title="leaderboard.dat" variant="hot" icon="🏆">
        <h2 className="pixel text-xl rainbow mb-2">THE LEADERBOARD</h2>
        <p className="text-sm mb-3">Pick your category. Numbers don't lie.</p>
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              className="y2k-btn"
              data-variant={tab === t.id ? "hot" : undefined}
              onClick={() => setTab(t.id)}
              style={{ fontSize: 11 }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Window>

      <Window title={`${tabMeta.label.toLowerCase()}_top25.txt`} variant="cyan">
        {/* podium */}
        <div className="grid grid-cols-3 gap-3 mb-5 items-end">
          {[1, 0, 2].map((idx) => {
            const row = data[idx];
            if (!row) return <div key={idx} />;
            const heights = [120, 160, 100];
            const medals = ["🥈", "🥇", "🥉"];
            return (
              <div key={idx} className="text-center">
                <div className="text-3xl mb-1">{medals[idx]}</div>
                <Avatar name={row[0]} size={48} />
                <div className="pixel text-[10px] mt-1 truncate" title={row[0]}>{row[0]}</div>
                <div className="disp text-2xl">{row[1].toLocaleString()}</div>
                <div
                  style={{
                    height: heights[idx],
                    background: tabMeta.color,
                    border: "2px solid var(--ink)",
                    boxShadow: "3px 3px 0 var(--ink)",
                    marginTop: 6,
                  }}
                  className="shimmer"
                />
              </div>
            );
          })}
        </div>

        <ol className="space-y-1">
          {data.slice(3).map((row, i) => (
            <li key={row[0]} className="flex items-center gap-2 text-sm">
              <span className="pixel text-[10px] w-6 text-right">#{i + 4}</span>
              <Avatar name={row[0]} size={24} />
              <Link to="/members" className="font-bold w-32 truncate">{row[0]}</Link>
              <div className="grow h-4 border-2 border-black bg-white relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0"
                  style={{ width: `${(row[1] / max) * 100}%`, background: tabMeta.color }}
                />
              </div>
              <span className="disp text-lg w-16 text-right">{row[1].toLocaleString()}</span>
            </li>
          ))}
        </ol>
      </Window>
    </div>
  );
}
