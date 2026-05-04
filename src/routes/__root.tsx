import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { EasterEggProvider } from "@/lib/easter";

import appCss from "../styles.css?url";

const NAV: Array<{ to: string; label: string }> = [
  { to: "/", label: "Home" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/members", label: "Members" },
  { to: "/heatmap", label: "Calendar" },
  { to: "/replay", label: "Chat Replay" },
  { to: "/curse-wall", label: "Curse Wall" },
  { to: "/name-saga", label: "Name Saga" },
  { to: "/emma-hospital", label: "Emma's Saga" },
  { to: "/beef", label: "Beef" },
  { to: "/unhinged", label: "Unhinged" },
  { to: "/hall-of-fame", label: "Hall of Fame" },
  { to: "/pairs", label: "Chemistry" },
  { to: "/ships", label: "Ships" },
  { to: "/vocab", label: "Vocab" },
  { to: "/activity", label: "Activity" },
  { to: "/voice-meter", label: "Voice Meter" },
  { to: "/drama", label: "Drama" },
  { to: "/night-owls", label: "Night Owls" },
  { to: "/monthly", label: "Monthly Cards" },
  { to: "/awards", label: "Awards" },
  { to: "/search", label: "Search" },
  { to: "/wheel", label: "Wheel of Chaos" },
  { to: "/rivalry", label: "Rivalry" },
  { to: "/storm", label: "Storm Radar" },
  { to: "/confession", label: "Confession Booth" },
  { to: "/quotes", label: "All Quotes" },
  { to: "/who-said-it", label: "Who Said It?" },
  { to: "/vault", label: "Deleted Vault" },
  { to: "/mood", label: "Mood Timeline" },
  { to: "/spotlight", label: "Spotlight Reel" },
  { to: "/sleep-index", label: "Sleep Index" },
  { to: "/starters", label: "Starters" },
  { to: "/hot-words", label: "Hot Words" },
  { to: "/quiet-days", label: "Quiet Days" },
  { to: "/easter-eggs", label: "🥚 Egg Hints" },
  { to: "/lore", label: "AI System Lore" },
  { to: "/patch-notes", label: "Patch Notes" },
];

function NotFoundComponent() {
  return (
    <div className="page">
      <div className="win mt-12">
        <div className="win-titlebar">
          <span>error.exe</span>
          <span className="win-titlebar-buttons">
            <span className="win-btn">×</span>
          </span>
        </div>
        <div className="win-body text-center py-8">
          <h1 className="pixel text-3xl mb-4 rainbow">404 NOT FOUND</h1>
          <p className="disp text-2xl mb-4">that page got deleted innit</p>
          <Link to="/" className="y2k-btn" data-variant="hot">{"<<"} go home</Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Big Group Bruh — The Archive" },
      { name: "description", content: "Six months of pure chaos in the Big Group Bruh WhatsApp chat, documented in full." },
      { property: "og:title", content: "Big Group Bruh — The Archive" },
      { property: "og:description", content: "Six months of pure chaos in the Big Group Bruh WhatsApp chat, documented in full." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Big Group Bruh — The Archive" },
      { name: "twitter:description", content: "Six months of pure chaos in the Big Group Bruh WhatsApp chat, documented in full." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9caf9e74-a3b5-4f20-a954-6b098a70eeb6/id-preview-a141e07f--08ae73ce-82c6-43e4-ae3f-f63af32ad6c9.lovable.app-1777768589276.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9caf9e74-a3b5-4f20-a954-6b098a70eeb6/id-preview-a141e07f--08ae73ce-82c6-43e4-ae3f-f63af32ad6c9.lovable.app-1777768589276.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40" style={{ background: "rgba(10,10,10,.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
      <div className="page py-3 flex items-center justify-between gap-4" style={{ animation: "none" }}>
        <Link to="/" className="flex items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full" style={{ background: "linear-gradient(135deg, var(--hot), var(--lime), var(--cyan))" }} />
          <span className="disp text-lg sm:text-xl">
            <span className="rainbow">BIG GROUP BRUH</span>
          </span>
          <span className="blink hidden sm:inline text-xs" style={{ color: "var(--lime)" }}>● LIVE</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/search" className="y2k-btn" data-variant="cyan" style={{ padding: "8px 16px", fontSize: 12 }}>
            🔍 Search
          </Link>
        </div>
      </div>
      <div className="marquee" style={{ background: "linear-gradient(90deg, var(--hot), var(--sun), var(--lime), var(--cyan), var(--grape))", color: "#0a0a0a", padding: "6px 0", fontWeight: 800, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-10">
              <span>★ 38,744 MESSAGES</span>
              <span>★ 37 MEMBERS</span>
              <span>★ 803 DELETIONS</span>
              <span>★ 7,926 LATE-NIGHT MSGS</span>
              <span>★ 9 GROUP NAME CHANGES IN ONE EVENING</span>
              <span>★ 4,823 MEDIA FILES</span>
              <span>★ 170 DAYS OF CHAOS</span>
              <span>★ ★ ★</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

function SideNav() {
  return (
    <nav className="win" style={{ position: "sticky", top: 110, maxHeight: "calc(100vh - 130px)", overflowY: "auto" }}>
      <div className="win-titlebar"><span>Navigate</span></div>
      <div className="win-body p-0">
        <ul className="text-sm">
          {NAV.map((item) => (
            <li key={item.to} style={{ borderBottom: "1px solid var(--border)" }}>
              <Link
                to={item.to}
                className="block px-4 py-2 transition-colors hover:bg-white/5"
                activeProps={{ style: { background: "linear-gradient(90deg, var(--hot), transparent)", color: "white", fontWeight: 800 } }}
                activeOptions={{ exact: item.to === "/" }}
              >
                <span className="opacity-60">›</span> {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="page mt-16 mb-10 text-center text-xs" style={{ color: "var(--muted-foreground)" }}>
      <div className="win inline-block">
        <div className="win-body py-3 px-6">
          <span>© 2026 The Archive · made with chaos · </span>
          <span className="rainbow font-extrabold">Big Group Bruh forever</span>
        </div>
      </div>
    </footer>
  );
}

function RootComponent() {
  return (
    <EasterEggProvider>
      <TopBar />
      <div className="page grid gap-4" style={{ gridTemplateColumns: "minmax(0,1fr)" }}>
        <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)] mt-4">
          <aside className="hidden md:block"><SideNav /></aside>
          <main className="min-w-0"><Outlet /></main>
        </div>
      </div>
      <Footer />
    </EasterEggProvider>
  );
}
