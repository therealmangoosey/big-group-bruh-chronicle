import type { ReactNode } from "react";

export function Window({
  title,
  children,
  className = "",
  variant,
  icon = "★",
}: {
  title: string;
  children: ReactNode;
  className?: string;
  variant?: "hot" | "cyan" | "lime";
  icon?: string;
}) {
  const tbStyle =
    variant === "hot"
      ? { background: "linear-gradient(90deg,#ff0090,#ff5500,#ffd400)" }
      : variant === "cyan"
      ? { background: "linear-gradient(90deg,#00b4ff,#9d00ff,#ff3ea5)" }
      : variant === "lime"
      ? { background: "linear-gradient(90deg,#a3ff00,#00e0ff,#9d00ff)" }
      : undefined;
  return (
    <div className={`win ${className}`}>
      <div className="win-titlebar" style={tbStyle}>
        <span className="flex items-center gap-2">
          <span aria-hidden>{icon}</span>
          <span className="truncate">{title}</span>
        </span>
        <span className="win-titlebar-buttons">
          <button className="win-btn wiggle" tabIndex={-1} aria-hidden>_</button>
          <button className="win-btn wiggle" tabIndex={-1} aria-hidden>□</button>
          <button className="win-btn wiggle" tabIndex={-1} aria-hidden>×</button>
        </span>
      </div>
      <div className="win-body">{children}</div>
    </div>
  );
}
