import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { nameSaga, fmtDateTime } from "@/lib/dataset";

export const Route = createFileRoute("/name-saga")({
  component: Page,
  head: () => ({ meta: [{ title: "The Group Name Saga — Big Group Bruh" }] }),
});

function Page() {
  return (
    <div className="grid gap-4">
      <Window title="name-saga.txt — one evening of madness" variant="hot" icon="📝">
        <h2 className="pixel text-xl rainbow mb-2">THE GROUP NAME SAGA</h2>
        <p className="text-sm">
          {nameSaga.length} group name changes — the whole evening of {nameSaga[0] && new Date(nameSaga[0].ts).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
          Read in order.
        </p>
      </Window>

      <ol className="grid gap-3">
        {nameSaga.map((n, i) => (
          <li key={i} className="flex gap-3 items-start">
            <div className="pixel text-2xl text-right w-12 shrink-0" style={{ color: "var(--hot)" }}>
              #{String(i + 1).padStart(2, "0")}
            </div>
            <div className="grow win">
              <div className="win-titlebar"><span>change #{i + 1}</span><span>★</span></div>
              <div className="win-body">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar name={n.by} size={28} />
                  <span className="font-bold">{n.by}</span>
                  <span className="text-xs opacity-60">· {fmtDateTime(n.ts)}</span>
                </div>
                <div className="text-sm">
                  <span className="line-through opacity-50">"{n.from}"</span>
                  <span className="mx-2 pixel text-[10px]">→</span>
                  <span className="font-bold rainbow">"{n.to}"</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
