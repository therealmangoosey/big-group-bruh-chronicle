import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/members")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — members" }] }),
});

function Page() {
  return (
    <Window title="members.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
