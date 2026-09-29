import { MENTORS } from "../_lib/fixtures";
import { useApp } from "./AppProvider";
import { Button, Card, StatusBadge } from "./ui";
export default function MentorCard({
  mentor: m,
}: {
  mentor: (typeof MENTORS)[number];
}) {
  const { openDialog } = useApp();
  return (
    <Card className="sn-mentor" data-mentor>
      <div className="sn-mentor-head">
        <span className="sn-avatar">{m.init}</span>
        <div>
          <b>{m.n}</b>
          <small>{m.role}</small>
        </div>
      </div>
      <div className="sn-mentor-tags">
        {m.tags.map((t) => (
          <StatusBadge key={t}>{t}</StatusBadge>
        ))}
      </div>
      <div className="sn-mentor-foot">
        <span>{m.rate}</span>
        <Button
          aria-label={`Book 1:1 with ${m.n}`}
          onClick={() => openDialog({ kind: "booking", id: m.id })}
        >
          Book 1:1
        </Button>
      </div>
    </Card>
  );
}
