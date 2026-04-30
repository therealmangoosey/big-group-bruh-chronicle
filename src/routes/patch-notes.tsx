import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/patch-notes")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — patch-notes" }] }),
});

function Page() {
  return (
    <Window title="patch-notes.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
