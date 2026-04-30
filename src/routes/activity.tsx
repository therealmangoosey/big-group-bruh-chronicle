import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/activity")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — activity" }] }),
});

function Page() {
  return (
    <Window title="activity.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
