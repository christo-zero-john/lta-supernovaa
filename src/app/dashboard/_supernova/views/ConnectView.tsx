"use client";

import { useApp } from "../components/AppProvider";
import { MENTORS } from "../lib/fixtures";
import { Button, Card, Icon } from "../components/ui";
import Gate from "../components/Gate";
import MentorCard from "../components/MentorCard";
export default function ConnectView() {
  const { persona, state, openDialog } = useApp();
  if (persona === "free") return <Gate />;
  const local = state[persona].sessions,
    session = local.find((s) => s.id === "source-session"),
    mentor = MENTORS.find((m) => m.id === session?.mentorId) || MENTORS[0];
  return (
    <>
      {persona === "p004" ? (
        <section className="sn-focus">
          <span className="sn-suite-icon">
            <Icon name="connect" />
          </span>
          <div className="sn-focus-copy">
            <span className="sn-eyebrow">You’ve come full circle</span>
            <h2>
              {3 - state[persona].requests.length} aspirants requested your DIT
              story this week.
            </h2>
            <p>
              You used Connect as a student — now you’re the mentor someone in
              Kerala is hoping to meet. Sessions pay out monthly to your
              account.
            </p>
          </div>
          <Button onClick={() => openDialog({ kind: "requests" })}>
            Review requests →
          </Button>
        </section>
      ) : (
        <Card className="sn-session">
          <span className="sn-avatar">{mentor.init}</span>
          <div>
            <b>Your next session — {mentor.n}</b>
            <small>
              {session
                ? `${session.date} · ${session.slot}`
                : "Friday 6 July · 17:00"}{" "}
              · Video call · “Course selection for Technical Logistics”
            </small>
          </div>
          <Button
            onClick={() =>
              openDialog({ kind: "session", id: "source-session" })
            }
          >
            Join call
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              openDialog({ kind: "booking", id: mentor.id, reschedule: true })
            }
          >
            Reschedule
          </Button>
        </Card>
      )}
      {local
        .filter((s) => s.id !== "source-session")
        .map((s) => (
          <Card className="sn-session" key={s.id}>
            <span className="sn-avatar">
              {MENTORS.find((m) => m.id === s.mentorId)?.init || "LTA"}
            </span>
            <div>
              <b>
                Session booked —{" "}
                {MENTORS.find((m) => m.id === s.mentorId)?.n || "LTA team"}
              </b>
              <small>
                {s.date} · {s.slot} · Local booking preview
              </small>
            </div>
            <Button
              variant="secondary"
              onClick={() => openDialog({ kind: "session", id: s.id })}
            >
              View session
            </Button>
          </Card>
        ))}
      <h2 className="sn-section-title">
        Mentors picked for your profile
        <small>· mechanical & logistics first</small>
      </h2>
      <div className="sn-mentor-grid">
        {MENTORS.map((m) => (
          <MentorCard key={m.id} mentor={m} />
        ))}
      </div>
    </>
  );
}
