import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

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
      { property: "og:description", content: "38,744 messages. 37 members. 803 deletions. One archive." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap",
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
    <header className="sticky top-0 z-40" style={{ background: "var(--ink)", color: "white" }}>
      <div className="page py-2 flex items-center justify-between gap-4">
        <Link to="/" className="pixel text-[10px] sm:text-xs flex items-center gap-2">
          <span className="rainbow">★ BIG GROUP BRUH</span>
          <span className="blink hidden sm:inline" style={{ color: "var(--lime)" }}>● LIVE</span>
        </Link>
        <Link to="/search" className="y2k-btn" data-variant="cyan" style={{ padding: "2px 10px", fontSize: 11 }}>
          🔍 search
        </Link>
      </div>
      <div className="marquee" style={{ background: "var(--sun)", color: "var(--ink)", borderTop: "2px solid var(--ink)", borderBottom: "2px solid var(--ink)", padding: "4px 0" }}>
        <div className="marquee-track pixel text-[10px]">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-8">
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
    <nav className="win" style={{ position: "sticky", top: 100 }}>
      <div className="win-titlebar"><span>★ navigate.exe</span></div>
      <div className="win-body p-0">
        <ul className="text-sm">
          {NAV.map((item) => (
            <li key={item.to} style={{ borderBottom: "1px dotted var(--ink)" }}>
              <Link
                to={item.to}
                className="block px-3 py-1.5 hover:bg-[var(--sun)]"
                activeProps={{ style: { background: "var(--hot)", color: "white", fontWeight: 700 } }}
                activeOptions={{ exact: item.to === "/" }}
              >
                <span className="pixel text-[9px]">›</span> {item.label}
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
    <footer className="page mt-12 mb-8 text-center pixel text-[9px]" style={{ color: "var(--muted-foreground)" }}>
      <div className="win inline-block">
        <div className="win-body py-2 px-4">
          <span>© 2026 The Archive Bureau · best viewed in Internet Explorer 6 · </span>
          <span className="rainbow">Big Group Bruh forever</span>
        </div>
      </div>
    </footer>
  );
}

function RootComponent() {
  return (
    <>
      <TopBar />
      <div className="page grid gap-4" style={{ gridTemplateColumns: "minmax(0,1fr)" }}>
        <div className="grid gap-4 md:grid-cols-[200px_minmax(0,1fr)] mt-4">
          <aside className="hidden md:block"><SideNav /></aside>
          <main className="min-w-0"><Outlet /></main>
        </div>
      </div>
      <Footer />
    </>
  );
}
