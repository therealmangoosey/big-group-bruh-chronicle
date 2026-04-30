import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/heatmap")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — heatmap" }] }),
});

function Page() {
  return (
    <Window title="heatmap.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
