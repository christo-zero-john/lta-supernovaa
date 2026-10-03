"use client";

import { useApp } from "../components/AppProvider";
import { MENTORS } from "../lib/fixtures";
import { Button, Card, EmptyState, Icon } from "../components/ui";
import { useDemoData } from "../demo/DemoDataProvider";
import Gate from "../components/Gate";
import MentorCard, { MentorAvatar } from "../components/MentorCard";
export default function ConnectView() {
  const { persona, state, openDialog, notify } = useApp(),
    demo = useDemoData();
  if (persona === "free") return <Gate />;
  // A rescheduled session replaces the dummy one it came from.
  const local = state[persona].sessions,
    session = local.find((s) => s.id === "source-session") || demo.session,
    mentor = MENTORS.find((m) => m.id === session?.mentorId) || MENTORS[0],
    topic = demo.session?.topic || "Course selection for Technical Logistics";
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
          <Button
            variant="secondary"
            onClick={() => openDialog({ kind: "requests" })}
          >
            Review requests
          </Button>
        </section>
      ) : !session ? (
        <Card>
          <h3>No sessions booked yet</h3>
          <EmptyState>
            Pick a mentor below and book a 1:1. It will show up here.
          </EmptyState>
        </Card>
      ) : (
        <Card className="sn-session">
          <MentorAvatar mentor={mentor} />
          <div>
            <b>Your next session with {mentor.n}</b>
            <small>
              {session.date} · {session.slot} · Video call · “{topic}”
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
      {persona === "verified" && session && (
        <Card className="sn-followups">
          <div className="sn-session">
            <span className="sn-avatar">GT</span>
            <div>
              <b>Rate your last session</b>
              <small>Gladia Thomas · 9 days ago</small>
            </div>
            <Button
              variant="secondary"
              onClick={() => notify("Reviews open once sessions are live.")}
            >
              Review
            </Button>
          </div>
          <div className="sn-session">
            <span className="sn-avatar">RN</span>
            <div>
              <b>Finish your booking</b>
              <small>Rahul Nair · payment pending</small>
            </div>
            <Button
              variant="secondary"
              onClick={() => openDialog({ kind: "booking", id: "mentor-3" })}
            >
              Resume
            </Button>
          </div>
          <div className="sn-session">
            <span className="sn-avatar">2</span>
            <div>
              <b>Sessions completed</b>
              <small>with 2 mentors · 1 saved mentor</small>
            </div>
          </div>
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
        <small>Mechanical and logistics first</small>
      </h2>
      <div className="sn-mentor-grid">
        {MENTORS.map((m) => (
          <MentorCard key={m.id} mentor={m} />
        ))}
      </div>
    </>
  );
}
