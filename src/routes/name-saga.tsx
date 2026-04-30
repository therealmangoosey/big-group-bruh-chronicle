import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/name-saga")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — name-saga" }] }),
});

function Page() {
  return (
    <Window title="name-saga.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
