import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Window } from "@/components/Window";
import { leaderboards, stats } from "@/lib/dataset";
import { useEggs } from "@/lib/easter";

export const Route = createFileRoute("/vault")({
  component: VaultPage,
  head: () => ({ meta: [{ title: "Deleted Messages Vault — Big Group Bruh" }] }),
});

function VaultPage() {
  const { trigger } = useEggs();
  const enterTime = useRef(Date.now());

  // Easter egg: stay on page > 60s
  useEffect(() => {
    const t = setInterval(() => {
      if (Date.now() - enterTime.current > 60_000) {
        trigger("vault-glitch");
        clearInterval(t);
      }
    }, 5000);
    return () => clearInterval(t);
  }, [trigger]);

  const deleted = leaderboards.deleted;

  return (
    <div className="grid gap-4">
      <Window title="VAULT.classified" variant="hot" icon="🔒">
        <div className="text-center py-4 relative">
          <div style={{
            position: "absolute", top: 10, right: 10,
            border: "3px solid #c00", color: "#c00",
            padding: "3px 10px", fontFamily: "var(--font-pixel)", fontSize: 11,
            transform: "rotate(5deg)", letterSpacing: 3,
          }}>CLASSIFIED</div>
          <h1 className="pixel text-sm mb-2">DELETED MESSAGES VAULT</h1>
          <div className="disp text-4xl" style={{ color: "var(--hot)" }}>{stats.totalDeleted}</div>
          <div className="pixel text-[9px]">total messages permanently redacted</div>
          <p className="text-sm mt-3 max-w-md mx-auto">These messages were destroyed by their authors. Their contents will never be known. The vault cannot be opened.</p>
        </div>
      </Window>

      <Window title="deletion_records.redact" variant="cyan" icon="📁">
        <div className="space-y-2">
          {deleted.filter(([, c]) => c > 0).map(([name, count], i) => (
            <div key={name} className="flex items-center gap-3 p-2 border-2 border-black" style={{
              background: i % 2 === 0 ? "oklch(0.97 0.02 270)" : "oklch(0.94 0.01 280)",
            }}>
              <span className="pixel text-[9px] w-6 text-center" style={{ color: "var(--hot)" }}>#{i + 1}</span>
              <div className="grow">
                <div className="font-bold text-sm">{name}</div>
                <div className="w-full h-3 border border-black mt-1 relative overflow-hidden" style={{ background: "#ddd" }}>
                  <div style={{
                    width: `${(count / deleted[0][1]) * 100}%`,
                    height: "100%",
                    background: "repeating-linear-gradient(45deg, #333 0 4px, #555 4px 8px)",
                  }} />
                </div>
              </div>
              <div className="disp text-2xl w-14 text-right">{count}</div>
              <div className="text-xs" style={{ color: "#999" }}>
                [{Array.from({ length: Math.min(count, 20) }).map(() => "█").join("")}]
              </div>
            </div>
          ))}
        </div>
      </Window>

      <Window title="REDACTED.notice" icon="⛔">
        <div className="text-center py-6" style={{
          background: "repeating-linear-gradient(45deg, #f5f5f5 0 8px, #eee 8px 16px)",
        }}>
          <div className="pixel text-sm mb-2" style={{ color: "#c00" }}>ACCESS DENIED</div>
          <div className="disp text-xl">The contents of deleted messages are permanently unavailable.</div>
          <div className="text-sm mt-2 opacity-60">This vault is sealed by the WhatsApp Deletion Protocol™.</div>
          <div className="pixel text-[8px] mt-4 opacity-30">(or is it? stay a while…)</div>
        </div>
      </Window>
    </div>
  );
}
