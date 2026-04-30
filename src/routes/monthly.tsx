import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { monthly } from "@/lib/dataset";

export const Route = createFileRoute("/monthly")({
  component: Page,
  head: () => ({ meta: [{ title: "Monthly Report Cards — Big Group Bruh" }] }),
});

const MOOD_COLOR: Record<string, string> = {
  FERAL: "linear-gradient(90deg,#ff0044,#ff8a00)",
  Spicy: "linear-gradient(90deg,#ff0090,#ffd400)",
  Lively: "linear-gradient(90deg,#00b4ff,#a3ff00)",
  "Civil-ish": "linear-gradient(90deg,#cdd9ff,#fff5b6)",
};

function fmtMonth(m: string) {
  const d = new Date(m + "-01");
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function Page() {
  return (
    <div className="grid gap-4">
      <Window title="monthly-cards.exe" variant="cyan" icon="🗓️">
        <h2 className="pixel text-xl rainbow mb-2">MONTHLY REPORT CARDS</h2>
        <p className="text-sm">A card per month with the mood, defining word, top yappers and signature quote.</p>
      </Window>

      <div className="grid sm:grid-cols-2 gap-4">
        {monthly.map((m) => (
          <div key={m.month} className="win">
            <div className="win-titlebar" style={{ background: MOOD_COLOR[m.mood] ?? "var(--hot)" }}>
              <span>{fmtMonth(m.month)}</span>
              <span className="pixel text-[10px]">{m.mood}</span>
            </div>
            <div className="win-body">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="text-center">
                  <div className="pixel text-[8px]">total msgs</div>
                  <div className="disp text-2xl">{m.count.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="pixel text-[8px]">defining word</div>
                  <div className="disp text-2xl rainbow">{m.defining}</div>
                </div>
                <div className="text-center">
                  <div className="pixel text-[8px]">mood</div>
                  <div className="disp text-2xl">{m.mood}</div>
                </div>
              </div>
              <div className="mb-2">
                <div className="chip">top yappers</div>
                <div className="flex gap-2 mt-1">
                  {m.topAuthors.map(([n, c]) => (
                    <div key={n} className="flex items-center gap-1 text-sm">
                      <Avatar name={n} size={20} />
                      <b>{n}</b>
                      <span className="opacity-60">({c})</span>
                    </div>
                  ))}
                </div>
              </div>
              {m.topQuote && (
                <blockquote className="border-2 border-black p-2 bg-white text-sm">
                  <b>{m.topQuote.author}:</b> {m.topQuote.text}
                </blockquote>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
