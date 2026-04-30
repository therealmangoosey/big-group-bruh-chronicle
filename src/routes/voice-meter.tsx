import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/voice-meter")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — voice-meter" }] }),
});

function Page() {
  return (
    <Window title="voice-meter.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
