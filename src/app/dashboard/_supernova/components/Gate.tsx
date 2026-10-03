import { GATES } from "../lib/fixtures";
import { useApp } from "./AppProvider";
import { Button, Icon, ProgressBar, StatusBadge } from "./ui";
export type GateContent = {
  title: string;
  text: string;
  features: readonly string[];
  primary: string;
  secondary: string;
};
export default function Gate() {
  const { persona, view, state, openDialog } = useApp();
  const g = (GATES[persona] as Record<string, GateContent>)[view];
  if (!g) return null;
  const selected = state[persona].choices.includes(view);
  return (
    <section className="sn-gate">
      <div className="sn-gate-icon">
        <Icon name={view} size={29} />
      </div>
      <h2>{g.title}</h2>
      <p>{g.text}</p>
      <div className="sn-gate-features">
        {g.features.map((f) => (
          <StatusBadge key={f}>{f}</StatusBadge>
        ))}
      </div>
      {view === "p004" && (
        <div className="sn-job-profile">
          <small>Your job profile · 4 of 9 steps done</small>
          <ProgressBar value={44} />
        </div>
      )}
      <div className="sn-actions">
        <Button
          onClick={() =>
            openDialog({
              kind: view === "zenna" ? "booking" : "gate",
              id: view,
            })
          }
        >
          {selected ? "You’re on the list ✓" : g.primary}
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            openDialog({
              kind: view === "zenna" ? "contact" : "gate",
              id: view,
              detail: "explain",
            })
          }
        >
          {g.secondary}
        </Button>
      </div>
    </section>
  );
}
