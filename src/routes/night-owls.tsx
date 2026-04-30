import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/night-owls")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — night-owls" }] }),
});

function Page() {
  return (
    <Window title="night-owls.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
