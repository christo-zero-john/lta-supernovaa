"use client";

import { useState } from "react";
import { useApp } from "../components/AppProvider";
import { DEMO_DATA, useDemoData } from "../demo/DemoDataProvider";
import Gate from "../components/Gate";
import ApplicationRow from "../components/ApplicationRow";
import { Button, Card, EmptyState, Icon, StatusBadge } from "../components/ui";
import { AFTER_OFFER, COUNSELLOR } from "../lib/fixtures";
import { downloadText } from "../lib/download";
export default function ZennaView() {
  const { persona, notify, openDialog } = useApp(),
    demo = useDemoData(),
    [filter, setFilter] = useState("all"),
    applications = demo.has("applications") ? DEMO_DATA.applications : [];
  if (persona === "free") return <Gate />;
  const archived = persona === "p004",
    count = (status: string) =>
      applications.filter((a) => a.status === status).length,
    offers = count("ok"),
    average = applications.length
      ? `${Math.round(applications.reduce((sum, a) => sum + a.prog, 0) / applications.length)}%`
      : "0%",
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
      ) : applications.length > 0 ? (
        <div className="sn-stats">
          {[
            [String(applications.length), "Total applications"],
            [String(offers), "Offers received"],
            [average, "Average completion"],
            [
              next?.dl || "On track",
              next ? `Next deadline · ${next.mono}` : "No open deadlines",
            ],
          ].map(([v, l]) => (
            <div className="sn-stat" key={l}>
              <strong>{v}</strong>
              <small>{l}</small>
            </div>
          ))}
        </div>
      ) : null}
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
            <Card>
              <h3>No applications yet</h3>
              <EmptyState>
                Once you apply through LTA, every application, its status and
                its deadlines show up here.
              </EmptyState>
            </Card>
          )}
          {applications
            .filter((a) => archived || filter === "all" || a.status === filter)
            .map((a) => (
              <ApplicationRow key={a.id} application={a} />
            ))}
        </div>
        {!archived && (
          <div className="sn-stack">
            {demo.has("offer") && (
              <Card>
                <h3>After the offer</h3>
                <p className="sn-body-copy">What is left before you fly.</p>
                <ul className="sn-checks">
                  {AFTER_OFFER.map((step) => (
                    <li className={step.state} key={step.label}>
                      {step.label}
                      {step.state === "doing" && (
                        <StatusBadge>In progress</StatusBadge>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            <Card className="sn-session">
              <span className="sn-avatar">{COUNSELLOR.initials}</span>
              <div>
                <b>{COUNSELLOR.name}</b>
                <small>Your counsellor · replies on WhatsApp</small>
              </div>
              <Button
                variant="secondary"
                onClick={() => openDialog({ kind: "contact" })}
              >
                Message
              </Button>
            </Card>
            <Card>
              <h3>WhatsApp updates</h3>
              <p className="sn-body-copy">
                Deadline reminders and status changes go to you{" "}
                <b>and your counsellor {COUNSELLOR.name}</b>, so nothing ever
                depends on one person checking an app.
              </p>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
