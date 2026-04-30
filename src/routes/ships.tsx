import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";
import { ships, colorOf } from "@/lib/dataset";

export const Route = createFileRoute("/ships")({
  component: Page,
  head: () => ({ meta: [{ title: "Ships & Situationships — Big Group Bruh" }] }),
});

function Page() {
  const max = ships[0]?.count ?? 1;
  return (
    <div className="grid gap-4">
      <Window title="ships.html — pure delusion" variant="hot" icon="💞">
        <h2 className="pixel text-xl rainbow mb-2">SHIPS & SITUATIONSHIPS</h2>
        <p className="text-sm">
          Pairs mentioned together with romance-flavoured words (ship, love, kiss, gf, bf, crush, simp…).
          Take with a heaped handful of salt.
        </p>
      </Window>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {ships.map((s, i) => (
          <div key={i} className="win" style={{ background: "white" }}>
            <div className="win-titlebar" style={{ background: "linear-gradient(90deg,#ff0090,#ffd400)" }}>
              <span>ship #{i + 1}</span>
              <span>💕</span>
            </div>
            <div className="win-body text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span
                  className="inline-flex items-center justify-center w-12 h-12 border-2 border-black pixel"
                  style={{ background: colorOf(s.a) }}
                >
                  {s.a.slice(0, 2)}
                </span>
                <span className="text-2xl">💘</span>
                <span
                  className="inline-flex items-center justify-center w-12 h-12 border-2 border-black pixel"
                  style={{ background: colorOf(s.b) }}
                >
                  {s.b.slice(0, 2)}
                </span>
              </div>
              <div className="font-bold">{s.a} × {s.b}</div>
              <div className="disp text-2xl">{s.count} mentions</div>
              <div className="h-2 border-2 border-black mt-2 bg-white relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 shimmer"
                  style={{ width: `${(s.count / max) * 100}%`, background: "var(--hot)" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
