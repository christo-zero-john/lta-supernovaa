"use client";

import { useState } from "react";
import { useApp } from "../components/AppProvider";
import { DEMO_DATA, useDemoData } from "../demo/DemoDataProvider";
import Gate from "../components/Gate";
import ApplicationRow from "../components/ApplicationRow";
import { Button, Card, EmptyState, Icon, StatusBadge } from "../components/ui";
import { downloadText } from "../lib/download";
export default function ZennaView() {
  const { persona, state, dispatch, notify } = useApp(),
    [filter, setFilter] = useState("all"),
    applications = useDemoData().has("applications")
      ? DEMO_DATA.applications
      : [];
  if (persona === "free") return <Gate />;
  const archived = persona === "p004",
    s = state[persona],
    count = (status: string) =>
      applications.filter((a) => a.status === status).length,
    offers = count("ok"),
    average = applications.length
      ? `${Math.round(applications.reduce((sum, a) => sum + a.prog, 0) / applications.length)}%`
      : "—",
    next = applications.find(
      (a) => (a.status === "warn" || a.status === "info") && a.dl !== "—",
    ),
    summary = `${applications.length} applications · ${offers} offers`;
  return (
    <>
      {archived ? (
        <Card className="sn-session">
          <span className="sn-avatar">
            <Icon name="check" />
          </span>
          <div>
            <b>Admitted — Deggendorf Institute of Technology</b>
            <small>
              International Management · enrolled Aug 2026 · {summary}
            </small>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              downloadText(
                "LTA-admissions-record.txt",
                `Admissions concept record\nAdmitted — Deggendorf Institute of Technology\nInternational Management · enrolled Aug 2026 · ${summary}\n\n` +
                  applications.map(
                    (a) =>
                      `${a.uni}\n${a.course}\n${a.stTxt} · ${a.prog}% · ${a.dl} · ${a.dld}`,
                  ).join("\n\n"),
              );
              notify("Admissions summary downloaded.");
            }}
          >
            Download full record
          </Button>
        </Card>
      ) : (
        <div className="sn-stats">
          {[
            [String(applications.length), "Total applications"],
            [String(offers), offers ? "Offers received 🎉" : "Offers received"],
            [average, "Average completion"],
            [
              next?.dl || "—",
              next ? `Next deadline · ${next.mono}` : "Next deadline",
            ],
          ].map(([v, l]) => (
            <div className="sn-stat" key={l}>
              <strong>{v}</strong>
              <small>{l}</small>
            </div>
          ))}
        </div>
      )}
      <div className={archived ? "" : "sn-two-col"}>
        <div>
          {archived ? (
            <h2 className="sn-section-title">Archived applications</h2>
          ) : (
            <div
              className="sn-filter"
              role="group"
              aria-label="Application status"
            >
              {[
                ["all", `All (${applications.length})`],
                ["ok", `Offers (${offers})`],
                ["warn", `In progress (${count("warn")})`],
                ["info", `Waiting (${count("info")})`],
                ["bad", `Closed (${count("bad")})`],
              ].map(([key, label]) => (
                <button
                  aria-pressed={filter === key}
                  key={key}
                  onClick={() => setFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {!applications.length && (
            <EmptyState>
              No applications yet. Once you apply through LTA, every
              application, its status and its deadlines show up here.
            </EmptyState>
          )}
          {applications
            .filter((a) => archived || filter === "all" || a.status === filter)
            .map((a) => (
              <ApplicationRow key={a.id} application={a} />
            ))}
        </div>
        {!archived && (
          <div className="sn-stack">
            <Card className="sn-ai">
              <div className="sn-ai-heading">
                <Icon name="zenna" size={19} />
                <b>Zenna AI Agent</b>
                <StatusBadge tone="free">
                  {s.ai === "watching"
                    ? "Watching for you"
                    : s.ai === "confirmed"
                      ? "Confirmed ✓"
                      : "Dismissed"}
                </StatusBadge>
              </div>
              {s.ai === "watching" ? (
                <>
                  <div className="sn-ai-item">
                    <Icon name="documents" size={16} />
                    <div>
                      <b>Blocked-account proof due 10 Jul</b>
                      <small>
                        Found in: Visa Checklist — Deggendorf IT.pdf
                      </small>
                    </div>
                    <StatusBadge>91% sure</StatusBadge>
                  </div>
                  <div className="sn-ai-item">
                    <Icon name="documents" size={16} />
                    <div>
                      <b>Enrolment confirmation due 15 Aug</b>
                      <small>
                        Found in: Offer Letter — OTH Amberg-Weiden.pdf
                      </small>
                    </div>
                    <StatusBadge>96% sure</StatusBadge>
                  </div>
                  <div className="sn-actions">
                    <Button
                      onClick={() => {
                        dispatch({ type: "ai", persona, value: "confirmed" });
                        notify("Deadline reminders confirmed locally.");
                      }}
                    >
                      Confirm & notify
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        dispatch({ type: "ai", persona, value: "dismissed" });
                        notify("AI findings dismissed.");
                      }}
                    >
                      Dismiss
                    </Button>
                  </div>
                </>
              ) : (
                <p className="sn-body-copy">
                  {s.ai === "confirmed"
                    ? "Your two deadline reminders are confirmed."
                    : "These findings have been dismissed."}
                </p>
              )}
            </Card>
            <Card>
              <h3>📱 WhatsApp updates</h3>
              <p className="sn-body-copy">
                Deadline reminders and status changes go to you{" "}
                <b>and your application mentor Jisha</b> — so nothing ever
                depends on one person checking an app.
              </p>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
