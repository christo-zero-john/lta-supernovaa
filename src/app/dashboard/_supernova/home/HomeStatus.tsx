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

/** A number, or, when there is nothing to count yet, the way to start. */
type Stat =
  | { value: string; label: string }
  | { action: string; label: string; view: ViewId };

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
    : "";
  const toIntake: Stat = {
    value: String(intake.days),
    label: `Days to ${intake.label}`,
  };
  const startShortlisting: Stat = {
    action: "Start shortlisting",
    label: "No courses shortlisted yet",
    view: "cst",
  };
  const askTheTeam: Stat = {
    action: "Talk to our team",
    label: "Free 15-minute call",
    view: "support",
  };
  const shortlistStats: Stat[] = courses.length
    ? [
        { value: String(courses.length), label: "Courses shortlisted" },
        { value: topChance, label: "Top admit chance" },
      ]
    : [startShortlisting, askTheTeam];
  const stage =
    persona === "p004" ? 3 : offerAccepted ? 2 : verified ? 1 : 0;

  let focus: Focus;
  let stats: Stat[];
  if (persona === "p004") {
    focus = {
      eyebrow: "What matters today",
      title: "Finish your job profile: 6 of 9 steps done.",
      text: "A complete profile is what German employers see first on Project004.",
      action: "Open Project004",
      view: "p004",
    };
    stats = [
      { value: "6 / 9", label: "Job profile steps" },
      { value: "3", label: "Matched jobs" },
      { value: "3", label: "Job applications in review" },
      { value: "#7", label: "Logistics Challenge rank" },
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
      { value: String(applications.length), label: "Applications" },
      { value: "1", label: "Offer accepted" },
      { value: "1 / 5", label: "After-the-offer steps done" },
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
      { value: String(applications.length), label: "Applications" },
      { value: String(offers), label: "Offers received" },
      next
        ? { value: next.dl, label: `Next deadline · ${next.mono}` }
        : { value: "On track", label: "No open deadlines" },
      { value: `${average}%`, label: "Average completion" },
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
      ...shortlistStats,
      { action: "Open Zenna", label: "No applications yet", view: "zenna" },
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
      ...shortlistStats,
      { action: "Apply with LTA", label: "Get verified", view: "zenna" },
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
      startShortlisting,
      { value: "3 min", label: "To get your shortlist" },
      askTheTeam,
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
        {stats.map((stat) =>
          "action" in stat ? (
            <button
              className="sn-stat sn-stat-action"
              key={stat.label}
              onClick={() => navigate(stat.view)}
            >
              <strong>{stat.action} →</strong>
              <small>{stat.label}</small>
            </button>
          ) : (
            <div className="sn-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <small>{stat.label}</small>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
