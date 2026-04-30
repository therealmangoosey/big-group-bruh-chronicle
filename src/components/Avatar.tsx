import { initialsOf, colorOf } from "@/lib/dataset";

export function Avatar({
  name,
  size = 36,
}: {
  name: string;
  size?: number;
}) {
  const bg = colorOf(name);
  const initials = initialsOf(name);
  return (
    <span
      className="inline-flex items-center justify-center font-bold pixel"
      style={{
        width: size,
        height: size,
        background: bg,
        color: "#0a0a0a",
        border: "2px solid #1a1a1a",
        boxShadow: "2px 2px 0 #1a1a1a",
        fontSize: Math.max(8, size * 0.32),
        flexShrink: 0,
      }}
      title={name}
    >
      {initials}
    </span>
  );
}
