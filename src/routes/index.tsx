import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Window } from "@/components/Window";
import { stats, members, daily, nameSaga } from "@/lib/dataset";
import { useEggs } from "@/lib/easter";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Big Group Bruh — Front Page" },
      { name: "description", content: "Six months of chaos in one WhatsApp group, documented." },
    ],
  }),
});

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const dur = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span>{v.toLocaleString()}{suffix}</span>;
}

function StatTile({ label, value, color }: { label: string; value: number; color: string }) {
  const { trigger } = useEggs();
  const hoverRef = useRef<number | null>(null);
  const onEnter = () => {
    hoverRef.current = window.setTimeout(() => trigger("long-hover"), 4000);
  };
  const onLeave = () => {
    if (hoverRef.current) { window.clearTimeout(hoverRef.current); hoverRef.current = null; }
  };
  return (
    <div className="win shimmer" style={{ background: color }} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className="win-titlebar"><span>★ stat.dat</span></div>
      <div className="win-body text-center py-3">
        <div className="pixel text-[9px] mb-1" style={{ color: "var(--ink)" }}>{label}</div>
        <div className="disp text-4xl md:text-5xl" style={{ color: "var(--ink)" }}>
          <CountUp to={value} />
        </div>
      </div>
    </div>
  );
}

function Index() {
  const topDay = [...daily].sort((a, b) => b.count - a.count)[0];
  const top5 = members.slice(0, 5);
  return (
    <div className="grid gap-4">
      <Window title="welcome.html — Internet Explorer" variant="hot" icon="🌐">
        <div className="text-center py-4 sparkle relative">
          <div className="pixel text-[10px] mb-2" style={{ color: "var(--grape)" }}>★ ★ ★ now entering ★ ★ ★</div>
          <h1 className="text-4xl md:text-6xl rainbow mb-3" style={{ lineHeight: 1.1 }}>
            BIG GROUP BRUH
          </h1>
          <div className="disp text-2xl md:text-3xl mb-4">·  the archive  ·</div>
          <p className="max-w-xl mx-auto text-sm md:text-base">
            Every message. Every curse. Every late-night meltdown.
            From <b>{new Date(stats.firstTs).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</b>
            {" "}onwards. <span className="blink" style={{ color: "var(--hot)" }}>UNCENSORED.</span>
          </p>
          <div className="mt-4 flex justify-center gap-2 flex-wrap">
            <Link to="/replay" className="y2k-btn" data-variant="hot">▶ enter chat replay</Link>
            <Link to="/leaderboard" className="y2k-btn" data-variant="cyan">📊 leaderboard</Link>
            <Link to="/wheel" className="y2k-btn">🎡 wheel of chaos</Link>
          </div>
        </div>
      </Window>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="messages sent" value={stats.totalMessages} color="oklch(0.92 0.18 95)" />
        <StatTile label="members" value={stats.memberCount} color="oklch(0.85 0.18 220)" />
        <StatTile label="msgs deleted" value={stats.totalDeleted} color="oklch(0.66 0.28 0 / .35)" />
        <StatTile label="late-night msgs" value={stats.lateNight} color="oklch(0.92 0.27 130 / .55)" />
        <StatTile label="media files" value={stats.totalMedia} color="oklch(0.92 0.18 95 / .65)" />
        <StatTile label="days covered" value={stats.daysCovered} color="oklch(0.85 0.18 220 / .65)" />
        <StatTile label="group name changes" value={nameSaga.length} color="oklch(0.66 0.28 0 / .55)" />
        <StatTile label="busiest day count" value={topDay?.count ?? 0} color="oklch(0.92 0.27 130 / .35)" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Window title="top yappers.txt" variant="cyan" icon="👑">
          <ol className="space-y-2">
            {top5.map((m, i) => {
              const isLeon = m.name === "Leon";
              return (
                <li key={m.name} className="flex items-center gap-3">
                  <span className="pixel text-xl w-8" style={{ color: i === 0 ? "var(--hot)" : "var(--ink)" }}>
                    #{i + 1}
                  </span>
                  <span className="inline-block w-6 h-6 border-2 border-black" style={{ background: m.color }} />
                  <Link to="/members" className="font-bold underline grow truncate">{m.name}</Link>
                  {isLeon ? <LeonCount value={m.messageCount} /> : <span className="disp text-2xl">{m.messageCount.toLocaleString()}</span>}
                </li>
              );
            })}
          </ol>
          <Link to="/leaderboard" className="y2k-btn mt-3 w-full justify-center">see full leaderboard ›</Link>
        </Window>

        <Window title="featured chaos.log" variant="lime" icon="🔥">
          <div className="space-y-3">
            <div>
              <div className="chip">busiest day</div>
              <div className="disp text-2xl mt-1">
                {topDay && new Date(topDay.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
              </div>
              <div className="text-sm">{topDay?.count.toLocaleString()} messages in 24 hours.</div>
              {topDay?.topQuote && (
                <blockquote className="mt-2 p-2 border-2 border-black bg-white text-sm">
                  <b>{topDay.topQuote.author}:</b> {topDay.topQuote.text.slice(0, 180)}
                  {topDay.topQuote.text.length > 180 && "…"}
                </blockquote>
              )}
            </div>
            <div>
              <div className="chip" style={{ background: "var(--hot)", color: "white" }}>group name evolution</div>
              <ol className="text-sm mt-1 space-y-0.5">
                {nameSaga.slice(0, 5).map((n, i) => (
                  <li key={i}><span className="pixel text-[9px]">›</span> "{n.to}"</li>
                ))}
                <li className="opacity-60">… and {Math.max(0, nameSaga.length - 5)} more</li>
              </ol>
              <Link to="/name-saga" className="underline text-sm">read the saga ›</Link>
            </div>
          </div>
        </Window>
      </div>

      <Window title="explore.idx" icon="🗺️">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
          {[
            ["/heatmap", "📅 Activity Calendar"],
            ["/curse-wall", "⛧ The Curse Wall"],
            ["/emma-hospital", "🏥 Emma's Hospital Saga"],
            ["/beef", "🥩 Beef Tracker"],
            ["/unhinged", "📂 Unhinged Files"],
            ["/hall-of-fame", "🏆 Hall of Fame"],
            ["/ships", "💞 Ships & Situationships"],
            ["/pairs", "🔗 Chemistry Graph"],
            ["/vocab", "📖 Vocabulary Cloud"],
            ["/voice-meter", "🎚️ Voice Meter"],
            ["/drama", "🌡️ Drama Thermometer"],
            ["/night-owls", "🦉 Night Owl Tracker"],
            ["/monthly", "🗓️ Monthly Cards"],
            ["/awards", "🎬 Awards Ceremony"],
            ["/rivalry", "⚔️ Rivalry Viewer"],
            ["/lore", "🤖 AI System Lore"],
          ].map(([to, label]) => (
            <Link key={to} to={to} className="win wiggle hover:glow-hot block">
              <div className="win-body p-2 text-center pixel text-[10px]">{label}</div>
            </Link>
          ))}
        </div>
      </Window>
      {/* invisible pixel egg */}
      <InvisiblePixel />
    </div>
  );
}

function LeonCount({ value }: { value: number }) {
  const { trigger } = useEggs();
  const clicks = useRef<number[]>([]);
  const onClick = () => {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 1500), now];
    if (clicks.current.length >= 5) {
      clicks.current = [];
      trigger("leon-letter");
      trigger("rapid-click");
    }
  };
  return <span className="disp text-2xl cursor-pointer select-none" onClick={onClick}>{value.toLocaleString()}</span>;
}

function InvisiblePixel() {
  const { trigger } = useEggs();
  return (
    <span
      onClick={() => trigger("pixel")}
      style={{
        position: "fixed", bottom: 2, right: 2, width: 1, height: 1,
        background: "transparent", cursor: "default", zIndex: 50,
      }}
      aria-hidden
    />
  );
}
