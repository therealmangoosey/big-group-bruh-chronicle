import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/ships")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — ships" }] }),
});

function Page() {
  return (
    <Window title="ships.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
