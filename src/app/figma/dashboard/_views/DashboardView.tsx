/* eslint-disable @next/next/no-img-element -- Local design assets retain their reference geometry. */
import { Fragment } from "react";
import { useApp } from "../_components/AppProvider";
import {
  FOCUS,
  HERO,
  HERO_T,
  HERO_GO,
  JOURNEY,
  PERSONAS,
} from "../_lib/fixtures";
import type { ViewId } from "../_lib/types";
import { Button, Icon, StatusBadge } from "../_components/ui";
export default function DashboardView() {
  const { persona, navigate, state } = useApp(),
    focus = FOCUS[persona],
    ent = PERSONAS[persona].ent;
  const suite = [
    {
      view: "cst",
      title: "Course Shortlisting",
      status: "Free for all",
      text: "Check real admit chances before applying.",
      cta: "Run a check →",
    },
    {
      view: "connect",
      title: "LTA Connect",
      status:
        ent.CONNECT === "mentor" ? "Mentor" : ent.CONNECT ? "Unlocked" : "Soon",
      text:
        ent.CONNECT === "mentor"
          ? `You mentor now — ${3-state[persona].requests.length} requests waiting.`
          : ent.CONNECT
            ? "Talk to people living your dream journey."
            : "Real mentors, launching to everyone soon.",
      cta: ent.CONNECT ? "Open →" : "Join waitlist →",
    },
    {
      view: "zenna",
      title: "Zenna",
      status:
        ent.ZENNA === "archived"
          ? "Archived ✓"
          : ent.ZENNA
            ? "Live"
            : "🔒 Clients",
      text: ent.ZENNA
        ? "Every application & deadline, tracked live."
        : "Unlocks when you apply through LTA.",
      cta: ent.ZENNA ? "Open →" : "Learn more →",
    },
    {
      view: "p004",
      title: "Project004",
      status: ent.P004 ? "Live" : "2027",
      text: ent.P004
        ? "Jobs, hackathons & your leaderboard rank."
        : "The future of your German job search.",
      cta: ent.P004 ? "Open →" : "Notify me →",
    },
  ];
  return (
    <>
      <section className="sn-focus">
        <div className="sn-focus-art">
          <img
            src="/assets/figma/dashboard/1-632-imgWhatsAppImage20240426At22913.png"
            alt="Zenna, your journey companion"
          />
        </div>
        <div className="sn-focus-copy">
          <span className="sn-eyebrow">{focus.cap}</span>
          <h2>{focus.b}</h2>
          <p>{focus.p}</p>
        </div>
        <Button onClick={() => navigate(focus.go as ViewId)}>
          {focus.cta}
          <Icon name="arrow" size={15} />
        </Button>
      </section>
      <div className="sn-journey" aria-label="Your journey">
        {JOURNEY.map((stage, i) => (
          <Fragment key={stage}>
            <span
              className={`sn-journey-step ${i < PERSONAS[persona].stage ? "done" : i === PERSONAS[persona].stage ? "now" : ""}`}
              aria-current={i === PERSONAS[persona].stage ? "step" : undefined}
            >
              <i />
              {stage}
            </span>
            {i < 4 && <span className="sn-journey-line" />}
          </Fragment>
        ))}
      </div>
      <h2 className="sn-section-title">
        {HERO_T[persona]}
        <small>· tap any card for the full picture</small>
      </h2>
      <div className="sn-hero-grid">
        {HERO[persona].map((c) => (
          <button
            className="sn-hero"
            key={c.mono}
            onClick={() => navigate(HERO_GO[persona] as ViewId)}
          >
            <div className="sn-hero-top">
              <strong>{c.big}</strong>
              <StatusBadge>{c.badge}</StatusBadge>
            </div>
            <div>
              <div className="sn-hero-name">
                <span className="sn-mono">{c.mono}</span>
                {c.uni}
              </div>
              <p>{c.p}</p>
            </div>
          </button>
        ))}
      </div>
      <h2 className="sn-section-title">
        Your LTA Suite<small>· one login opens all of it</small>
      </h2>
      <div className="sn-suite-grid">
        {suite.map((s) => (
          <button
            key={s.view}
            className="sn-suite-card"
            onClick={() => navigate(s.view as ViewId)}
          >
            <div className="sn-suite-top">
              <span className="sn-suite-icon">
                <Icon name={s.view} />
              </span>
              <div>
                <h3>{s.title}</h3>
                <StatusBadge
                  tone={
                    s.status === "Soon" || s.status === "2027"
                      ? "soon"
                      : s.status.includes("Clients")
                        ? "lock"
                        : "free"
                  }
                >
                  {s.status}
                </StatusBadge>
              </div>
            </div>
            <p>{s.text}</p>
            <span className="sn-suite-cta">
              {s.cta}
              <Icon name="arrow" size={14} />
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
