import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/lore")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — lore" }] }),
});

function Page() {
  return (
    <Window title="lore.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
