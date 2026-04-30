import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/pairs")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — pairs" }] }),
});

function Page() {
  return (
    <Window title="pairs.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
