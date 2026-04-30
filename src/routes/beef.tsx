import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/beef")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — beef" }] }),
});

function Page() {
  return (
    <Window title="beef.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
