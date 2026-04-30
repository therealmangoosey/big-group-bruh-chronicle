import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/patch-notes")({
  component: Page,
  head: () => ({ meta: [{ title: "Patch Notes — Big Group Bruh" }] }),
});

const NOTES = [
  { v: "1.0.0", date: "Apr 2026", items: ["Site launch.", "All 25 sections live.", "Built from a static parse of 38,744 messages."] },
  { v: "0.9.0", date: "Apr 2026", items: ["Replay Mode polish — 256× speed added.", "Search uses prebuilt inverted index.", "Wheel of Chaos draws from full archive."] },
  { v: "0.8.0", date: "Apr 2026", items: ["Voice Meter, Drama Thermometer, Night Owl tracker added."] },
  { v: "0.7.0", date: "Apr 2026", items: ["Curse Wall, Emma's Saga, Unhinged Files, Beef section."] },
  { v: "0.5.0", date: "Apr 2026", items: ["Y2K design system — pixel fonts, marquee, blinking accents."] },
  { v: "0.1.0", date: "Apr 2026", items: ["Chat parser written. Dataset frozen."] },
];

function Page() {
  return (
    <div className="grid gap-4">
      <Window title="patch-notes.exe — site changelog" variant="cyan" icon="📝">
        <h2 className="pixel text-xl rainbow mb-2">PATCH NOTES</h2>
        <p className="text-sm">Version history for this archive site.</p>
      </Window>
      {NOTES.map((n) => (
        <div key={n.v} className="win">
          <div className="win-titlebar"><span>v{n.v}</span><span className="opacity-70">{n.date}</span></div>
          <div className="win-body">
            <ul className="text-sm space-y-1">
              {n.items.map((i, j) => (
                <li key={j}><span className="pixel text-[9px]">›</span> {i}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
