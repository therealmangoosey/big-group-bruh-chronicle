import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";
import { stats, nameSaga } from "@/lib/dataset";

export const Route = createFileRoute("/lore")({
  component: Page,
  head: () => ({ meta: [{ title: "AI System Lore — Big Group Bruh" }] }),
});

function Entry({ v, date, items }: { v: string; date: string; items: string[] }) {
  return (
    <div className="win">
      <div className="win-titlebar"><span>system update — v{v}</span><span className="opacity-70">{date}</span></div>
      <div className="win-body">
        <ul className="text-sm space-y-1">
          {items.map((i, j) => (
            <li key={j}><span className="pixel text-[9px]">›</span> {i}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Page() {
  return (
    <div className="grid gap-4">
      <Window title="ai-system-lore.exe" variant="cyan" icon="🤖">
        <h2 className="pixel text-xl rainbow mb-2">SYSTEM UPDATES</h2>
        <p className="text-sm">A semi-fictional patch log for the Big Group Bruh entity. All events real, narration not.</p>
      </Window>

      <Entry v="0.1.0" date="04 Nov 2025" items={[
        "Initial deployment. Group named 'Wild group'.",
        `${nameSaga.length} group name changes occurred within the first hour.`,
        "Final boot name: 'Big group bruh'.",
      ]} />
      <Entry v="0.2.0" date="Nov 2025" items={[
        `Activated. ${stats.monthHist[0]?.[1].toLocaleString()} messages logged in the first month.`,
        "Late-night subroutine begins to dominate. 2am peak detected.",
        "Curse Wall daemon initialised by user 'Leon'.",
      ]} />
      <Entry v="0.3.0" date="Dec 2025" items={[
        "Energy drop — chat enters hibernation mode (lowest monthly volume).",
        "Christmas thread accidentally derailed within 4 messages.",
      ]} />
      <Entry v="0.4.0" date="Jan 2026" items={[
        `Surge: ${stats.monthHist[2]?.[1].toLocaleString()} messages in one month.`,
        "Emma Hospital saga begins as a recurring narrative arc.",
        "Beef detection systems flag multiple ongoing conflicts.",
      ]} />
      <Entry v="0.5.0" date="Feb 2026" items={[
        "Charlie targeted by automated curse generator (Leon module).",
        "All-caps frequency rises sharply.",
        "Ships subsystem mistakenly pairs unrelated members.",
      ]} />
      <Entry v="0.6.0" date="Mar–Apr 2026" items={[
        "Volume tapers — exam-mode safety throttling suspected.",
        `Final logged message ${new Date(stats.lastTs).toLocaleString("en-GB")}.`,
        "Archive locked. Dataset frozen at this snapshot for the website.",
      ]} />
    </div>
  );
}
