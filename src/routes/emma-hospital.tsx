import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";
import { Avatar } from "@/components/Avatar";
import { emmaSaga, fmtDateTime } from "@/lib/dataset";
import { useEggs } from "@/lib/easter";

function GreatText({ text }: { text: string }) {
  const { trigger } = useEggs();
  const parts = text.split(/(\bgreat\b)/gi);
  return (
    <>
      {parts.map((p, i) =>
        /^great$/i.test(p) ? (
          <span
            key={i}
            onClick={(e) => { e.stopPropagation(); trigger("great-sound"); }}
            style={{ cursor: "pointer", textDecoration: "underline dotted", textUnderlineOffset: 2 }}
            title="something here"
          >{p}</span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export const Route = createFileRoute("/emma-hospital")({
  component: Page,
  head: () => ({ meta: [{ title: "Emma's Hospital Saga — Big Group Bruh" }] }),
});

function Page() {
  return (
    <div className="grid gap-4">
      <Window title="emma-medical-chart.pdf" variant="cyan" icon="🏥">
        <h2 className="pixel text-xl mb-2" style={{ color: "var(--hot)" }}>EMMA'S HOSPITAL SAGA</h2>
        <p className="text-sm">
          Every message that crossed paths with hospital, A&E, ambulance, surgery, doctor, nurse,
          or any other medical word. {emmaSaga.length} entries, in order.
        </p>
      </Window>

      <div className="relative pl-6">
        <div
          className="absolute top-0 bottom-0 w-1"
          style={{ left: 12, background: "var(--hot)" }}
        />
        <ul className="space-y-3">
          {emmaSaga.map((m, i) => (
            <li key={i} className="relative">
              <div
                className="absolute"
                style={{
                  left: -19, top: 14, width: 14, height: 14,
                  background: "white", border: "2px solid var(--ink)", borderRadius: "50%",
                  boxShadow: "2px 2px 0 var(--ink)",
                }}
              />
              <div className="win">
                <div className="win-titlebar"><span>chart entry #{String(i + 1).padStart(3, "0")}</span></div>
                <div className="win-body">
                  <div className="flex items-center gap-2 text-xs opacity-70 mb-1">
                    <Avatar name={m.author} size={20} />
                    <b className="opacity-100">{m.author}</b>
                    <span>· {fmtDateTime(m.ts)}</span>
                  </div>
                  <p className="text-sm"><GreatText text={m.text} /></p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
