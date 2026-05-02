import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { stats, members, daily, nameSaga } from "@/lib/dataset";
import { useEggs } from "@/lib/easter";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Big Group Bruh — Wrapped" },
      { name: "description", content: "Six months of one WhatsApp group chat, recapped Spotify-Wrapped style." },
    ],
  }),
});

function CountUp({ to, suffix = "", duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setV(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span>{v.toLocaleString()}{suffix}</span>;
}

type PageCard = { to: string; title: string; sub: string; emoji: string; grad: string };

const ALL_PAGES: PageCard[] = [
  { to: "/leaderboard",   title: "Leaderboard",        sub: "Top yappers, ranked",                emoji: "🏆", grad: "grad-pink" },
  { to: "/members",       title: "Members",            sub: "Everyone in the group",              emoji: "👥", grad: "grad-blue" },
  { to: "/heatmap",       title: "Activity Calendar",  sub: "170 days of chaos, mapped",          emoji: "📅", grad: "grad-lime" },
  { to: "/replay",        title: "Chat Replay",        sub: "Scrub through every message",        emoji: "▶️", grad: "grad-orange" },
  { to: "/curse-wall",    title: "The Curse Wall",     sub: "Leon vs Charlie, profanity diary",   emoji: "⛧", grad: "grad-grape" },
  { to: "/name-saga",     title: "Name Saga",          sub: "Every group name change",            emoji: "🪪", grad: "grad-pink" },
  { to: "/emma-hospital", title: "Emma's Hospital",    sub: "The full saga, day by day",          emoji: "🏥", grad: "grad-blue" },
  { to: "/beef",          title: "Beef Tracker",       sub: "Reply chains that turned hostile",   emoji: "🥩", grad: "grad-orange" },
  { to: "/unhinged",      title: "Unhinged Files",     sub: "Quotes that should be illegal",      emoji: "📂", grad: "grad-grape" },
  { to: "/hall-of-fame",  title: "Hall of Fame",       sub: "Iconic single moments",              emoji: "🏛️", grad: "grad-cream" },
  { to: "/pairs",         title: "Chemistry Graph",    sub: "Who replies to who, fastest",        emoji: "🔗", grad: "grad-lime" },
  { to: "/ships",         title: "Ships & Situations", sub: "Mention-mapped relationships",       emoji: "💞", grad: "grad-pink" },
  { to: "/vocab",         title: "Vocabulary Cloud",   sub: "Most-used words & slang",            emoji: "📖", grad: "grad-blue" },
  { to: "/activity",      title: "Activity Clock",     sub: "Hourly heart-rate of the group",     emoji: "🕐", grad: "grad-orange" },
  { to: "/voice-meter",   title: "Voice Meter",        sub: "Who carried each month",             emoji: "🎚️", grad: "grad-grape" },
  { to: "/drama",         title: "Drama Thermometer",  sub: "Tension over time",                  emoji: "🌡️", grad: "grad-pink" },
  { to: "/night-owls",    title: "Night Owl Tracker",  sub: "After-midnight crimes",              emoji: "🦉", grad: "grad-night" },
  { to: "/monthly",       title: "Monthly Cards",      sub: "Each month, one report card",        emoji: "🗓️", grad: "grad-cream" },
  { to: "/awards",        title: "Awards Ceremony",    sub: "Animated envelope reveals",          emoji: "🎬", grad: "grad-grape" },
  { to: "/search",        title: "Word Search",        sub: "Find anything anyone said",          emoji: "🔍", grad: "grad-blue" },
  { to: "/wheel",         title: "Wheel of Chaos",     sub: "Spin for a random message",          emoji: "🎡", grad: "grad-orange" },
  { to: "/rivalry",       title: "Rivalry Viewer",     sub: "Pick two members. Fight.",           emoji: "⚔️", grad: "grad-pink" },
  { to: "/storm",         title: "Storm Radar",        sub: "Pulsing message-density radar",      emoji: "🛰️", grad: "grad-blue" },
  { to: "/confession",    title: "Confession Booth",   sub: "Their most unhinged line",           emoji: "🕯️", grad: "grad-night" },
  { to: "/who-said-it",   title: "Who Said It?",       sub: "Quote-guessing game",                emoji: "❓", grad: "grad-lime" },
  { to: "/vault",         title: "Deleted Vault",      sub: "Redacted messages they wish stayed", emoji: "🔒", grad: "grad-night" },
  { to: "/mood",          title: "Mood Timeline",      sub: "Sentiment, day by day",              emoji: "🌈", grad: "grad-cream" },
  { to: "/spotlight",     title: "Spotlight Reel",     sub: "Cinematic per-member montage",       emoji: "🎞️", grad: "grad-grape" },
  { to: "/sleep-index",   title: "Sleep Index",        sub: "Who needs to go to bed",             emoji: "🔋", grad: "grad-blue" },
  { to: "/starters",      title: "Conversation Starters", sub: "Who broke the silence most",      emoji: "🗣️", grad: "grad-orange" },
  { to: "/hot-words",     title: "Hot Words",          sub: "Weekly word-frequency spikes",       emoji: "📈", grad: "grad-pink" },
  { to: "/quiet-days",    title: "Quiet Days",         sub: "Cold-case low-activity days",        emoji: "🕵️", grad: "grad-night" },
  { to: "/easter-eggs",   title: "Egg Hints",          sub: "Cryptic clues, no answers",          emoji: "🥚", grad: "grad-cream" },
  { to: "/lore",          title: "AI System Lore",     sub: "Meta AI's accidental cameo",         emoji: "🤖", grad: "grad-grape" },
  { to: "/patch-notes",   title: "Patch Notes",        sub: "Behind-the-scenes changelog",        emoji: "📝", grad: "grad-night" },
];

const FEATURES = [
  { title: "The Numbers",   text: "Every message, deletion, late-night meltdown — counted.", emoji: "🔢" },
  { title: "The People",    text: "37 members ranked, paired, profiled, and exposed.",        emoji: "👥" },
  { title: "The Drama",     text: "Beef, curse walls, ships, and the Emma hospital saga.",   emoji: "🔥" },
  { title: "The Games",     text: "Spin wheels, guess quotes, hunt easter eggs.",            emoji: "🎮" },
];

function Index() {
  const topDay = [...daily].sort((a, b) => b.count - a.count)[0];
  const top5 = members.slice(0, 5);

  return (
    <div className="grid gap-6">
      {/* HERO */}
      <section className="wrapped-card grad-pink shimmer relative" style={{ padding: "clamp(28px, 6vw, 64px)" }}>
        <div className="chip mb-4" style={{ background: "rgba(0,0,0,.35)", color: "#fff" }}>The 2026 Wrapped</div>
        <h1 className="disp" style={{ fontSize: "clamp(48px, 12vw, 140px)", lineHeight: 0.85 }}>
          BIG<br/>GROUP<br/>BRUH
        </h1>
        <p className="mt-6 max-w-xl text-lg md:text-xl font-semibold opacity-95">
          Six months. One WhatsApp group. <b>{stats.totalMessages.toLocaleString()}</b> messages
          of pure chaos — recapped Wrapped-style.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/replay" className="y2k-btn">▶ Press play on the chat</Link>
          <Link to="/awards" className="y2k-btn" data-variant="cyan">🎬 Awards Ceremony</Link>
          <Link to="/wheel" className="y2k-btn" data-variant="hot">🎡 Spin Chaos</Link>
        </div>
      </section>

      {/* BIG STATS — wrapped style */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard grad="grad-lime"   label="Messages sent"      value={stats.totalMessages} />
        <StatCard grad="grad-orange" label="Members"            value={stats.memberCount} />
        <StatCard grad="grad-grape"  label="Deleted in shame"   value={stats.totalDeleted} />
        <StatCard grad="grad-blue"   label="Late-night messages" value={stats.lateNight} />
        <StatCard grad="grad-cream"  label="Media files"        value={stats.totalMedia} />
        <StatCard grad="grad-pink"   label="Days covered"       value={stats.daysCovered} />
        <StatCard grad="grad-night"  label="Group name changes" value={nameSaga.length} />
        <StatCard grad="grad-orange" label="Busiest day count"  value={topDay?.count ?? 0} />
      </section>

      {/* TOP 5 + DAY */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="wrapped-card grad-night">
          <div className="chip mb-3">Top 5 Yappers</div>
          <ol className="space-y-3 mt-2">
            {top5.map((m, i) => {
              const isLeon = m.name === "Leon";
              return (
                <li key={m.name} className="flex items-center gap-4">
                  <span className="disp text-3xl w-12" style={{ color: i === 0 ? "var(--lime)" : "white" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-block w-3 h-10 rounded-full" style={{ background: m.color }} />
                  <Link to="/members" className="font-extrabold grow truncate text-lg hover:underline">{m.name}</Link>
                  {isLeon
                    ? <LeonCount value={m.messageCount} />
                    : <span className="disp text-2xl tabular-nums">{m.messageCount.toLocaleString()}</span>}
                </li>
              );
            })}
          </ol>
          <Link to="/leaderboard" className="y2k-btn mt-6">See full leaderboard →</Link>
        </div>

        <div className="wrapped-card grad-orange">
          <div className="chip mb-3" style={{ background: "rgba(0,0,0,.3)", color: "#fff" }}>Busiest Day</div>
          <div className="disp" style={{ fontSize: "clamp(28px, 5vw, 48px)" }}>
            {topDay && new Date(topDay.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </div>
          <div className="num"><CountUp to={topDay?.count ?? 0} /></div>
          <div className="label mt-1">messages in 24 hours</div>
          {topDay?.topQuote && (
            <blockquote className="mt-4 p-4 rounded-xl" style={{ background: "rgba(0,0,0,.25)", color: "#fff" }}>
              <div className="text-xs font-extrabold uppercase opacity-80 mb-1">{topDay.topQuote.author}</div>
              <div className="text-base">{topDay.topQuote.text.slice(0, 200)}{topDay.topQuote.text.length > 200 && "…"}</div>
            </blockquote>
          )}
        </div>
      </section>

      {/* FEATURES OVERVIEW */}
      <section className="wrapped-card grad-night">
        <div className="chip mb-4">What's inside</div>
        <h2 className="disp text-3xl md:text-5xl mb-6">A whole archive,<br/><span className="rainbow">section by section.</span></h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border)" }}>
              <div className="text-3xl mb-2">{f.emoji}</div>
              <div className="font-extrabold text-lg">{f.title}</div>
              <div className="text-sm opacity-80 mt-1">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* EVERY PAGE — the hub */}
      <section>
        <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
          <h2 className="disp text-3xl md:text-5xl">Every <span className="rainbow">section</span>.</h2>
          <div className="text-sm opacity-70">{ALL_PAGES.length} pages · tap any card</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {ALL_PAGES.map((p) => (
            <Link key={p.to} to={p.to} className={`wrapped-card ${p.grad} block group`} style={{ padding: 22, minHeight: 160 }}>
              <div className="flex items-start justify-between">
                <div className="text-3xl">{p.emoji}</div>
                <div className="opacity-70 text-xl group-hover:translate-x-1 transition-transform">→</div>
              </div>
              <div className="mt-6 disp text-2xl leading-tight">{p.title}</div>
              <div className="text-sm font-semibold opacity-85 mt-1">{p.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      <InvisiblePixel />
    </div>
  );
}

function StatCard({ label, value, grad }: { label: string; value: number; grad: string }) {
  const { trigger } = useEggs();
  const hoverRef = useRef<number | null>(null);
  const onEnter = () => { hoverRef.current = window.setTimeout(() => trigger("long-hover"), 4000); };
  const onLeave = () => { if (hoverRef.current) { window.clearTimeout(hoverRef.current); hoverRef.current = null; } };
  return (
    <div className={`wrapped-card ${grad}`} onMouseEnter={onEnter} onMouseLeave={onLeave} style={{ padding: 20 }}>
      <div className="label">{label}</div>
      <div className="num mt-2 reveal-num"><CountUp to={value} /></div>
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
  return <span className="disp text-2xl tabular-nums cursor-pointer select-none" onClick={onClick}>{value.toLocaleString()}</span>;
}

function InvisiblePixel() {
  const { trigger } = useEggs();
  return (
    <span
      onClick={() => trigger("pixel")}
      style={{ position: "fixed", bottom: 2, right: 2, width: 1, height: 1, background: "transparent", cursor: "default", zIndex: 50 }}
      aria-hidden
    />
  );
}
