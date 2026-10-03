import type { ShortlistedCourse } from "@/lib/services/course.service";
import type { DemoApplication } from "../demo/DemoDataProvider";
import { JOURNEY } from "../lib/fixtures";
import type { PersonaId, ViewId } from "../lib/types";

/**
 * One tile of the home page's numbers. With nothing to count yet, a tile may
 * keep its name and offer the screen where that number starts.
 */
export type HomeStat =
  | { label: string; value: string }
  | { label: string; action: string; view: ViewId };

/** Everything the tiles are worked out from. */
export type HomeStatFacts = {
  persona: PersonaId;
  /** Index into JOURNEY. */
  stage: number;
  courses: ShortlistedCourse[];
  applications: DemoApplication[];
  offerAccepted: boolean;
  /** Booked mentor or team sessions that are still ahead. */
  sessions: number;
  /** Uploaded documents, and how many the student's applications need. */
  documents: { uploaded: number; required: number };
};

/** How many tiles the home page shows. */
export const HOME_STAT_COUNT = 4;

const percent = (value: number) => `${Math.round(value)}%`;

const openDeadline = (applications: DemoApplication[]) =>
  applications.find(
    (a) => (a.status === "warn" || a.status === "info") && a.dl !== "—",
  );

/**
 * Every tile the home page can show, most important first. A tile returns
 * null when it does not apply to this student, so a student who has nothing
 * to upload, book or apply for never sees those tiles. The page shows the
 * first HOME_STAT_COUNT that apply.
 *
 * To add a tile, add an entry at the place its importance belongs. The last
 * entries apply to everyone, so there are always enough to fill the row.
 */
const HOME_STATS: ((facts: HomeStatFacts) => HomeStat | null)[] = [
  // --- Project004: placeholder numbers until the backend provides them.
  ({ persona }) =>
    persona === "p004" ? { label: "Job profile steps", value: "6 of 9" } : null,
  ({ persona }) =>
    persona === "p004" ? { label: "Matched jobs", value: "3" } : null,
  ({ persona }) =>
    persona === "p004"
      ? { label: "Job applications in review", value: "3" }
      : null,
  ({ persona }) =>
    persona === "p004"
      ? { label: "Logistics Challenge rank", value: "#7" }
      : null,

  // --- After the offer.
  ({ offerAccepted }) =>
    offerAccepted
      ? { label: "After-the-offer steps done", value: "1 of 5" }
      : null,
  ({ offerAccepted }) =>
    offerAccepted ? { label: "Offer accepted", value: "1" } : null,

  // --- Applications.
  ({ applications }) => {
    const next = openDeadline(applications);
    return next
      ? { label: `Next deadline · ${next.mono}`, value: next.dl }
      : null;
  },
  ({ applications }) =>
    applications.length
      ? { label: "Applications", value: String(applications.length) }
      : null,
  ({ applications }) =>
    applications.length
      ? {
          label: "Offers received",
          value: String(applications.filter((a) => a.status === "ok").length),
        }
      : null,
  ({ applications }) =>
    applications.length
      ? {
          label: "Average completion",
          value: percent(
            applications.reduce((sum, a) => sum + a.prog, 0) /
              applications.length,
          ),
        }
      : null,

  // --- Only for students who have them.
  ({ sessions }) =>
    sessions ? { label: "Upcoming sessions", value: String(sessions) } : null,
  ({ documents }) =>
    documents.required
      ? {
          label: "Documents uploaded",
          value: `${documents.uploaded} of ${documents.required}`,
        }
      : null,

  // --- The shortlist.
  ({ courses }) =>
    courses.length
      ? { label: "Courses shortlisted", value: String(courses.length) }
      : {
          label: "Courses shortlisted",
          action: "Start shortlisting",
          view: "cst",
        },
  ({ courses }) =>
    courses.length
      ? {
          label: "Top admit chance",
          value: percent(
            Math.max(...courses.map((c) => c.admission_percentage)),
          ),
        }
      : null,
  ({ courses }) => ({
    label: "Universities matched",
    value: String(new Set(courses.map((c) => c.course.university.id)).size),
  }),
  ({ courses }) =>
    courses.length
      ? {
          label: "Average admit chance",
          value: percent(
            courses.reduce((sum, c) => sum + c.admission_percentage, 0) /
              courses.length,
          ),
        }
      : null,

  // --- For everyone.
  ({ stage }) => ({
    label: `Journey step · ${JOURNEY[stage]}`,
    value: `${stage + 1} of ${JOURNEY.length}`,
  }),
  ({ persona }) => ({
    label: "Account status",
    value: persona === "free" ? "Not verified" : "Verified",
  }),
];

/** The most important tiles that apply to this student. */
export function homeStats(facts: HomeStatFacts): HomeStat[] {
  const stats: HomeStat[] = [];
  for (const stat of HOME_STATS) {
    const tile = stat(facts);
    if (tile) stats.push(tile);
    if (stats.length === HOME_STAT_COUNT) break;
  }
  return stats;
}
