import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/leaderboard")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — leaderboard" }] }),
});

function Page() {
  return (
    <Window title="leaderboard.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
