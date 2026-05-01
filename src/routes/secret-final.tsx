import { createFileRoute, Link } from "@tanstack/react-router";
import { useEggs } from "@/lib/easter";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/secret-final")({
  component: SecretFinalPage,
  head: () => ({ meta: [{ title: "??? — Big Group Bruh" }] }),
});

function SecretFinalPage() {
  const { count, total } = useEggs();
  if (count < total) {
    return (
      <Window title="access_denied.exe" variant="hot" icon="🔐">
        <div className="text-center py-8">
          <div className="pixel text-lg mb-3 blink" style={{ color: "var(--hot)" }}>ACCESS DENIED</div>
          <p className="text-sm">You've found {count}/{total} eggs.</p>
          <p className="text-sm">Come back when you've found them all.</p>
          <Link to="/easter-eggs" className="y2k-btn mt-4 inline-flex">read the cryptic hints ›</Link>
        </div>
      </Window>
    );
  }
  return (
    <div className="grid gap-4">
      <Window title="THE_END.exe" variant="hot" icon="👁️">
        <div className="text-center py-6 relative" style={{
          background: "radial-gradient(circle, oklch(0.92 0.27 130 / .4), transparent)",
        }}>
          <h1 className="pixel text-2xl mb-3 rainbow">YOU FOUND ALL TEN.</h1>
          <p className="disp text-2xl mb-2">the archive applauds you 👏</p>
          <p className="text-sm max-w-md mx-auto">You scrolled, you typed, you waited, you stalked, you clicked. You spent more time looking at this site than several members spent in school this month.</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <Stat label="Total egg time" value="∞" />
            <Stat label="Productivity" value="0%" />
            <Stat label="Group respect" value="MAXIMUM" />
            <Stat label="Members notified" value="0" />
            <Stat label="Things learned" value="too many" />
            <Stat label="Regret level" value="moderate" />
          </div>

          <blockquote className="mt-6 italic text-sm opacity-80">
            "Im just mega cool. So iim deserve to be admin." — Coral
          </blockquote>
          <div className="pixel text-[8px] mt-4 opacity-50">— end of transmission —</div>
        </div>
      </Window>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-black p-2" style={{ background: "white" }}>
      <div className="pixel text-[8px] opacity-70">{label}</div>
      <div className="disp text-lg">{value}</div>
    </div>
  );
}
