import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/rivalry")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — rivalry" }] }),
});

function Page() {
  return (
    <Window title="rivalry.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
