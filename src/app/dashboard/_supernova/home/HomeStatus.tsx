"use client";

import { useApp } from "../components/AppProvider";
import { DEMO_DATA, useDemoData } from "../demo/DemoDataProvider";
import { Button } from "../components/ui";
import { useJourneyStage } from "../hooks/useJourneyStage";
import { JOURNEY, MISSING_DOCUMENTS } from "../lib/fixtures";
import { homeStats } from "./homeStats";
import type { ViewId } from "../lib/types";
import type { ShortlistedCourse } from "@/lib/services/course.service";

type Focus = {
  eyebrow: string;
  title: string;
  text: string;
  action: string;
  view: ViewId;
};

/**
 * The top of the home page: where the student is on their journey, the one
 * thing that matters next, and the four numbers that matter most to this
 * student (see homeStats). Everything but the shortlisted courses is
 * placeholder data until the backend provides it.
 */
export default function HomeStatus({
  courses,
}: {
  courses: ShortlistedCourse[];
}) {
  const { persona, navigate, state, uploads } = useApp();
  const demo = useDemoData();
  const verified = persona !== "free";
  const applications =
    verified && demo.has("applications") ? DEMO_DATA.applications : [];
  const next = applications.find(
    (a) => (a.status === "warn" || a.status === "info") && a.dl !== "—",
  );
  const offerAccepted = applications.length > 0 && demo.has("offer");
  const topChance = courses.length
    ? `${Math.max(...courses.map((c) => c.admission_percentage))}%`
    : "";
  const stage = useJourneyStage();
  let focus: Focus;
  if (persona === "p004") {
    focus = {
      eyebrow: "What matters today",
      title: "Finish your job profile: 6 of 9 steps done.",
      text: "A complete profile is what German employers see first on Project004.",
      action: "Open Project004",
      view: "p004",
    };
  } else if (offerAccepted) {
    focus = {
      eyebrow: "What matters today",
      title: "Open your blocked account next.",
      text: "Your APS certificate is done. The blocked account comes before health insurance and the visa appointment.",
      action: "See my checklist",
      view: "zenna",
    };
  } else if (applications.length) {
    focus = {
      eyebrow: "What matters today",
      title: next
        ? `${next.uni} is due on ${next.dl}.`
        : "Your applications are on track.",
      text: "Your counsellor is watching every deadline with you.",
      action: "Open in Zenna",
      view: "zenna",
    };
  } else if (verified) {
    focus = {
      eyebrow: "Your next step",
      title: "You are verified. Your first applications are being set up.",
      text: "Your counsellor adds them to Zenna. You will see every status and deadline there.",
      action: "Open Zenna",
      view: "zenna",
    };
  } else if (courses.length) {
    focus = {
      eyebrow: "Your next step",
      title: `Your shortlist is ready: top chance ${topChance}.`,
      text: "Apply through LTA to get verified. Zenna then tracks every application and deadline for you.",
      action: "See my shortlist",
      view: "cst",
    };
  } else {
    focus = {
      eyebrow: "Your next step",
      title: "Find out your real admit chances.",
      text: "Answer a few questions and get one clear number per course. It takes about three minutes.",
      action: "Explore chances",
      view: "cst",
    };
  }

  // The demo documents come with a list of what is still missing; without
  // it nothing says how many documents this student needs.
  const demoDocuments = demo.has("documents") ? DEMO_DATA.documents.length : 0;
  const stats = homeStats({
    persona,
    stage,
    courses,
    applications,
    offerAccepted,
    sessions: (demo.session ? 1 : 0) + state[persona].sessions.length,
    documents: {
      uploaded: demoDocuments + uploads.files.length,
      required: demoDocuments ? demoDocuments + MISSING_DOCUMENTS.length : 0,
    },
  });

  return (
    <div className="supernova sn-home-status">
      <div className="sn-journey" aria-label="Your journey">
        {JOURNEY.map((name, i) => (
          <span key={name} style={{ display: "contents" }}>
            {i > 0 && <span className="sn-journey-line" />}
            <span
              className={`sn-journey-step ${i < stage ? "done" : i === stage ? "now" : ""}`}
              aria-current={i === stage ? "step" : undefined}
            >
              <i />
              {name}
            </span>
          </span>
        ))}
      </div>
      <section className="sn-focus">
        <div className="sn-focus-copy">
          <span className="sn-eyebrow">{focus.eyebrow}</span>
          <h2>{focus.title}</h2>
          <p>{focus.text}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(focus.view)}>
          {focus.action}
        </Button>
      </section>
      <div className="sn-stats">
        {stats.map((stat) => (
          <div className="sn-stat" key={stat.label}>
            {"action" in stat ? (
              <Button className="compact" onClick={() => navigate(stat.view)}>
                {stat.action}
              </Button>
            ) : (
              <strong>{stat.value}</strong>
            )}
            <small>{stat.label}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
