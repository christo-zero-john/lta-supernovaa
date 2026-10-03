import { MENTORS } from "../lib/fixtures";
import { useApp } from "./AppProvider";
import { Button, Card, StatusBadge } from "./ui";
/* eslint-disable @next/next/no-img-element -- Small local avatar files. */
/** The mentor's 3D avatar on a pale tile, as on the profile button. */
export function MentorAvatar({
  mentor: m,
}: {
  mentor: (typeof MENTORS)[number];
}) {
  return (
    <span className="sn-avatar">
      <img src={m.avatar} alt="" />
    </span>
  );
}
export default function MentorCard({
  mentor: m,
}: {
  mentor: (typeof MENTORS)[number];
}) {
  const { openDialog } = useApp();
  return (
    <Card className="sn-mentor" data-mentor>
      <div className="sn-mentor-head">
        <MentorAvatar mentor={m} />
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
