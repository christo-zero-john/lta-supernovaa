"use client";

import { useApp } from "../components/AppProvider";
import { DEMO_DATA, useDemoData } from "../demo/DemoDataProvider";
import { JOURNEY } from "../lib/fixtures";
import type { ViewId } from "../lib/types";
import type { ShortlistedCourse } from "@/lib/services/course.service";

const DAY = 24 * 60 * 60 * 1000;

/** The next summer intake (1 April) that is at least two months away. */
function nextIntake(now: Date) {
  let year = now.getFullYear();
  let date = new Date(year, 3, 1);
  while (date.getTime() - now.getTime() < 60 * DAY)
    date = new Date(++year, 3, 1);
  return {
    label: `Summer ${year}`,
    days: Math.ceil((date.getTime() - now.getTime()) / DAY),
  };
}

type Focus = {
  eyebrow: string;
  title: string;
  text: string;
  action: string;
  view: ViewId;
};

/**
 * The top of the home page: where the student is on their journey, the one
 * thing that matters next, and four numbers. Everything but the shortlisted
 * courses is placeholder data until the backend provides it.
 */
export default function HomeStatus({
  courses,
}: {
  courses: ShortlistedCourse[];
}) {
  const { persona, navigate } = useApp();
  const demo = useDemoData();
  const intake = nextIntake(new Date());
  const verified = persona !== "free";
  const applications =
    verified && demo.has("applications") ? DEMO_DATA.applications : [];
  const offers = applications.filter((a) => a.status === "ok").length;
  const average = applications.length
    ? Math.round(
        applications.reduce((sum, a) => sum + a.prog, 0) / applications.length,
      )
    : 0;
  const next = applications.find(
    (a) => (a.status === "warn" || a.status === "info") && a.dl !== "—",
  );
  const offerAccepted = applications.length > 0 && demo.has("offer");
  const topChance = courses.length
    ? `${Math.max(...courses.map((c) => c.admission_percentage))}%`
    : "—";
  const toIntake: [string, string] = [
    String(intake.days),
    `Days to ${intake.label}`,
  ];
  const stage =
    persona === "p004" ? 3 : offerAccepted ? 2 : verified ? 1 : 0;

  let focus: Focus;
  let stats: [string, string][];
  if (persona === "p004") {
    focus = {
      eyebrow: "What matters today",
      title: "Finish your job profile: 6 of 9 steps done.",
      text: "A complete profile is what German employers see first on Project004.",
      action: "Open Project004",
      view: "p004",
    };
    stats = [
      ["6 / 9", "Job profile steps"],
      ["3", "Matched jobs"],
      ["3", "Job applications in review"],
      ["#7", "Logistics Challenge rank"],
    ];
  } else if (offerAccepted) {
    focus = {
      eyebrow: "What matters today",
      title: "Open your blocked account next.",
      text: "Your APS certificate is done. The blocked account comes before health insurance and the visa appointment.",
      action: "See my checklist",
      view: "zenna",
    };
    stats = [
      [String(applications.length), "Applications"],
      ["1", "Offer accepted"],
      ["1 / 5", "After-the-offer steps done"],
      toIntake,
    ];
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
    stats = [
      [String(applications.length), "Applications"],
      [String(offers), "Offers received"],
      [next?.dl || "—", next ? `Next deadline · ${next.mono}` : "Next deadline"],
      [`${average}%`, "Average completion"],
    ];
  } else if (verified) {
    focus = {
      eyebrow: "Your next step",
      title: "You are verified. Your first applications are being set up.",
      text: "Your counsellor adds them to Zenna. You will see every status and deadline there.",
      action: "Open Zenna",
      view: "zenna",
    };
    stats = [
      [String(courses.length || "—"), "Courses shortlisted"],
      [topChance, "Top admit chance"],
      ["0", "Applications"],
      toIntake,
    ];
  } else if (courses.length) {
    focus = {
      eyebrow: "Your next step",
      title: `Your shortlist is ready: top chance ${topChance}.`,
      text: "Apply through LTA to get verified. Zenna then tracks every application and deadline for you.",
      action: "See my shortlist",
      view: "cst",
    };
    stats = [
      [String(courses.length), "Courses shortlisted"],
      [topChance, "Top admit chance"],
      ["Open", "Course Shortlisting"],
      toIntake,
    ];
  } else {
    focus = {
      eyebrow: "Your next step",
      title: "Find out your real admit chances.",
      text: "Answer a few questions and get one clear number per course. It takes about three minutes.",
      action: "Start shortlisting",
      view: "cst",
    };
    stats = [
      ["—", "Courses shortlisted"],
      ["—", "Top admit chance"],
      ["3 min", "To get your shortlist"],
      toIntake,
    ];
  }

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
        <button
          className="sn-button primary"
          onClick={() => navigate(focus.view)}
        >
          {focus.action} →
        </button>
      </section>
      <div className="sn-stats">
        {stats.map(([value, label]) => (
          <div className="sn-stat" key={label}>
            <strong>{value}</strong>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
