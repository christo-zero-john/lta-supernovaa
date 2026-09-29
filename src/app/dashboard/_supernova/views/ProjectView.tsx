"use client";

import { useApp } from "../components/AppProvider";
import { JOBS } from "../lib/jobs";
import Gate from "../components/Gate";
import { Card, Button, StatusBadge } from "../components/ui";
export default function ProjectView() {
  const { persona, openDialog } = useApp();
  if (persona !== "p004") return <Gate />;
  return (
    <>
      <div
        className="sn-stats"
        style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}
      >
        {[
          ["3", "Applications in review"],
          ["2", "Hackathons entered"],
          ["2", "Employer profile views this week"],
        ].map(([v, l]) => (
          <div className="sn-stat" key={l}>
            <strong>{v}</strong>
            <small>{l}</small>
          </div>
        ))}
      </div>
      <div className="sn-two-col">
        <section>
          <h2 className="sn-section-title" style={{ marginTop: 0 }}>
            Matched jobs<small>· based on your skills & German B2</small>
          </h2>
          {JOBS.map((j) => (
            <Card className="sn-job" key={j.id} data-job>
              <span className="sn-mono">{j.mono}</span>
              <div className="sn-application-main">
                <b>{j.company}</b>
                <small>{j.role}</small>
              </div>
              <StatusBadge tone="free">{j.match}</StatusBadge>
              <StatusBadge>{j.status}</StatusBadge>
              <Button
                variant="secondary"
                aria-label={`View ${j.company}`}
                onClick={() => openDialog({ kind: "job", id: j.id })}
              >
                View
              </Button>
            </Card>
          ))}
        </section>
        <div className="sn-stack">
          <Card>
            <div className="sn-actions">
              <h3>🏆 Logistics Challenge 2027</h3>
              <StatusBadge tone="warn">Finals in 6d</StatusBadge>
            </div>
            {[
              ["5", "A. Fernandes", "2,410"],
              ["6", "P. Sharma", "2,395"],
              ["7", "Tino Sunny (you)", "2,340"],
              ["8", "M. George", "2,310"],
              ["9", "L. Krishnan", "2,255"],
            ].map(([rank, name, points]) => (
              <div
                className={`sn-leaderboard ${rank === "7" ? "me" : ""}`}
                key={rank}
              >
                <span>{rank}</span>
                {name}
                <span>{points} pts</span>
              </div>
            ))}
            <p className="sn-body-copy">
              Top 10 profiles go directly to participating employers after the
              finals.
            </p>
          </Card>
          <Card className="sn-profile-card">
            <h3>Your profile card</h3>
            <p className="sn-body-copy">
              Rank #7 · Top 2% · Logistics — share it where recruiters can see
              it.
            </p>
            <Button
              variant="secondary"
              style={{ width: "100%", marginTop: 14 }}
              onClick={() => openDialog({ kind: "share" })}
            >
              Share to LinkedIn →
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
