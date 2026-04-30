import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/drama")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — drama" }] }),
});

function Page() {
  return (
    <Window title="drama.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
