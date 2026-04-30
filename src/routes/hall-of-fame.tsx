import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/hall-of-fame")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — hall-of-fame" }] }),
});

function Page() {
  return (
    <Window title="hall-of-fame.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
