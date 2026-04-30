import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { hof, fmtDate } from "@/lib/dataset";

export const Route = createFileRoute("/hall-of-fame")({
  component: Page,
  head: () => ({ meta: [{ title: "Hall of Fame — Big Group Bruh" }] }),
});

function Trophy({ heading, q, color }: { heading: string; q: { author: string; text: string; ts: number }; color: string }) {
  return (
    <div className="win shimmer">
      <div className="win-titlebar" style={{ background: color }}>
        <span>{heading}</span>
        <span>🏆</span>
      </div>
      <div className="win-body">
        <div className="flex items-center gap-2 mb-2">
          <Avatar name={q.author} size={28} />
          <b>{q.author}</b>
          <span className="text-xs opacity-60 ml-auto">{fmtDate(q.ts)}</span>
        </div>
        <blockquote
          className="text-sm border-2 border-black p-3"
          style={{ background: "white" }}
        >
          {q.text}
        </blockquote>
      </div>
    </div>
  );
}

function Page() {
  return (
    <div className="grid gap-4">
      <Window title="hall-of-fame.exe — the greats" variant="hot" icon="🏆">
        <h2 className="pixel text-xl rainbow mb-2">HALL OF FAME</h2>
        <p className="text-sm">The all-timers. Saved forever.</p>
      </Window>

      <Window title="📜 longest essays ever sent" variant="cyan">
        <div className="grid md:grid-cols-2 gap-3">
          {hof.longest.map((q, i) => (
            <Trophy key={i} heading={`#${i + 1} essay (${q.text.length} chars)`} q={q} color="linear-gradient(90deg,#00b4ff,#9d00ff)" />
          ))}
        </div>
      </Window>

      <Window title="📢 ALL-CAPS ICONS" variant="lime">
        <div className="grid md:grid-cols-2 gap-3">
          {hof.shouty.slice(0, 8).map((q, i) => (
            <Trophy key={i} heading={`#${i + 1} the shouter`} q={q} color="linear-gradient(90deg,#a3ff00,#ffd400)" />
          ))}
        </div>
      </Window>

      <Window title="🤬 maximum profanity density" variant="hot">
        <div className="grid md:grid-cols-2 gap-3">
          {hof.cursed.slice(0, 8).map((q, i) => (
            <Trophy key={i} heading={`#${i + 1} potty mouth`} q={q} color="linear-gradient(90deg,#ff0044,#ff5500)" />
          ))}
        </div>
      </Window>
    </div>
  );
}
