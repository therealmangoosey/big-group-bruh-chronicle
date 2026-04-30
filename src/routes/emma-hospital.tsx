import { createFileRoute } from "@tanstack/react-router";
import { Window } from "@/components/Window";

export const Route = createFileRoute("/emma-hospital")({
  component: Page,
  head: () => ({ meta: [{ title: "Big Group Bruh — emma-hospital" }] }),
});

function Page() {
  return (
    <Window title="emma-hospital.exe — coming soon">
      <div className="py-12 text-center disp text-2xl">loading.gif . . .</div>
    </Window>
  );
}
