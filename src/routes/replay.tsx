import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/replay")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — replay" }] }),
});

function Page() {
  return (
    <Window title="replay.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
