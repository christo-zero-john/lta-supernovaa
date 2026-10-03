"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ShortlistedCourse } from "@/lib/services/course.service";
import type { CalendarEvent } from "../home/events";
import type { ChanceResult, Notice } from "../lib/types";
import raw from "./demo-data.json";

/**
 * Dummy data for previewing the dashboard as a user who has shortlists,
 * documents, events and so on. Chosen from the navbar's "Choose options";
 * nothing is sent to the backend.
 */
export const DEMO_OPTIONS = [
  { id: "colleges", label: "Colleges shortlisted", hint: "Home · university cards" },
  { id: "courses", label: "Courses shortlisted", hint: "Course Shortlisting · saved report" },
  { id: "documents", label: "Documents uploaded", hint: "Documents" },
  { id: "events", label: "Events scheduled", hint: "Home · 4 events this month" },
  { id: "applications", label: "Applications", hint: "Zenna" },
  { id: "offer", label: "Offer accepted", hint: "Zenna · after-the-offer checklist" },
  { id: "session", label: "Mentor session booked", hint: "LTA Connect" },
  { id: "notifications", label: "Notifications", hint: "Notifications" },
] as const;

export type DemoOption = (typeof DEMO_OPTIONS)[number]["id"];

export type DemoApplication = {
  id: string;
  mono: string;
  c: string;
  uni: string;
  course: string;
  status: "ok" | "warn" | "info" | "bad";
  stTxt: string;
  prog: number;
  dl: string;
  dld: string;
};

export type DemoDocument = {
  id: string;
  name: string;
  meta: string;
  used: string[];
};

export type DemoSession = {
  mentorId: string;
  date: string;
  slot: string;
  topic: string;
};

export const DEMO_DATA = {
  colleges: raw.shortlisted_colleges as ShortlistedCourse[],
  courses: raw.shortlisted_courses as (Pick<
    ChanceResult,
    "mono" | "university" | "course" | "pct"
  > & { eligible: boolean; why: string; gap: string })[],
  documents: raw.documents as DemoDocument[],
  applications: raw.applications as DemoApplication[],
  notifications: raw.notifications as Notice[],
};

const STORAGE_KEY = "lta-demo-data";

type Stored = {
  options: DemoOption[];
  /** The event days, fixed for the month they were drawn in. */
  eventDays: { year: number; month: number; days: number[] } | null;
};

/** `count` distinct random days of the given month, in order. */
function randomDays(year: number, month: number, count: number) {
  const total = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: total }, (_, i) => i + 1);
  for (let i = days.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [days[i], days[j]] = [days[j], days[i]];
  }
  return days.slice(0, count).sort((a, b) => a - b);
}

/** The event days for this month, drawn again once the month changes. */
function currentEventDays(previous: Stored["eventDays"]) {
  const now = new Date();
  const year = now.getFullYear(),
    month = now.getMonth();
  if (previous?.year === year && previous.month === month) return previous;
  return { year, month, days: randomDays(year, month, raw.events.length) };
}

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

type Context = {
  options: DemoOption[];
  has: (option: DemoOption) => boolean;
  toggle: (option: DemoOption) => void;
  setAll: (on: boolean) => void;
  events: CalendarEvent[];
  session: DemoSession | null;
};

const DemoDataContext = createContext<Context | null>(null);

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<Stored>({
    options: [],
    eventDays: null,
  });

  // Restore this tab's choices after hydration (the server has none).
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Stored;
      const known = DEMO_OPTIONS.map((o) => o.id) as DemoOption[];
      const options = parsed.options.filter((o) => known.includes(o));
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setStored({
        options,
        eventDays: options.includes("events")
          ? currentEventDays(parsed.eventDays)
          : null,
      });
    } catch {
      // Storage unavailable or unreadable: start with nothing chosen.
    }
  }, []);

  const save = (next: Stored) => {
    setStored(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Not remembered across reloads; the choice still applies now.
    }
  };

  const choose = (options: DemoOption[]) =>
    save({
      options,
      eventDays: options.includes("events")
        ? currentEventDays(stored.eventDays)
        : null,
    });

  const has = (option: DemoOption) => stored.options.includes(option);

  const events: CalendarEvent[] = stored.eventDays
    ? raw.events.map((event, i) => ({
        day: stored.eventDays!.days[i],
        month: stored.eventDays!.month,
        year: stored.eventDays!.year,
        title: event.title,
        time: event.time,
      }))
    : [];

  const sessionDate = new Date();
  sessionDate.setDate(sessionDate.getDate() + raw.mentor_session.days_from_today);
  const session = has("session")
    ? {
        mentorId: raw.mentor_session.mentor_id,
        date: localDate(sessionDate),
        slot: raw.mentor_session.slot,
        topic: raw.mentor_session.topic,
      }
    : null;

  return (
    <DemoDataContext.Provider
      value={{
        options: stored.options,
        has,
        toggle: (option) =>
          choose(
            has(option)
              ? stored.options.filter((o) => o !== option)
              : [...stored.options, option],
          ),
        setAll: (on) => choose(on ? DEMO_OPTIONS.map((o) => o.id) : []),
        events,
        session,
      }}
    >
      {children}
    </DemoDataContext.Provider>
  );
}

export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("DemoDataProvider missing");
  return ctx;
}
