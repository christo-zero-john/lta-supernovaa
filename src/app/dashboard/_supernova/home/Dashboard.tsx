"use client";

/* Exported SVGs and source photos keep their intrinsic Figma dimensions. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import MunichCard from "./MunichCard";
import SorbonneCard from "./SorbonneCard";
import DarmstadtCard from "./DarmstadtCard";
import FourthCard from "./FourthCard";
import ZennaIntro from "./ZennaIntro";
import HomeStatus from "./HomeStatus";
import VideoPlayer from "./VideoPlayer";
import { universityCardProps } from "./universityCard";
import { MONTH_NAMES, toCalendarEvent, type CalendarEvent } from "./events";
import { TESTIMONIALS } from "./testimonials";
import { useApp } from "../components/AppProvider";
import { useShellNavigation } from "../components/AppShell";
import UserAvatar from "../components/UserAvatar";
import DemoDataSwitch from "../demo/DemoDataSwitch";
import PersonaSelect from "../components/PersonaSelect";
import NotificationBell from "../components/NotificationBell";
import { DEMO_DATA, useDemoData } from "../demo/DemoDataProvider";
import { LTA_WHATSAPP } from "../lib/fixtures";
import type { ViewId } from "../lib/types";
import SmoothScrollArea from "@/components/SmoothScroll/SmoothScrollArea";
import TruncatedText from "@/components/TruncatedText/TruncatedText";
import { handleGetBookedSlots } from "@/actions/calendar.actions";
import type { ShortlistedCourse } from "@/lib/services/course.service";
import type { BookedSlot } from "@/lib/services/calendar.service";
import "./dashboard.css";
import "./testimonial-gradients.css";

const asset = (name: string) => `/assets/dashboard/${name}`;
const VIDEO_URL =
  "https://lta-dev-kj2hs6dasja.s3.ap-south-1.amazonaws.com/LTA+WEB.mp4";
const VIDEO_TITLE = "Zenna, your Personal Application Tracker";
// The file is 16:9 with black bars above and below its picture; this is the
// picture's own shape, so the player can leave the bars out.
const VIDEO_PICTURE_RATIO = 1920 / 776;

// The four Figma card designs, repeated in order.
const CARD_DESIGNS = [MunichCard, SorbonneCard, DarmstadtCard, FourthCard];

interface Product {
  view: ViewId;
  title: string;
  image: string;
  access: string;
  action: string;
  locked?: boolean;
  /** Shown but not yet available: the action is disabled. */
  comingSoon?: boolean;
  videoUrl?: string;
}

const products: Product[] = [
  {
    view: "cst",
    title: "Course Shortlisting",
    image: "1-799-imgFrame2147228693.png",
    access: "Free For All",
    action: "Try Now",
  },
  // Not live yet: shown locked, like Project004. When it launches, drop
  // comingSoon and locked.
  {
    view: "connect",
    title: "LTA Connect",
    image: "1-799-imgFrame2147228692.png",
    access: "Coming Soon",
    action: "Coming Soon",
    locked: true,
    comingSoon: true,
  },
  {
    view: "zenna",
    title: "LTA Zenna",
    image: "1-799-imgFrame2147225052.png",
    access: "Verified Students Only",
    action: "Watch video",
    locked: true,
    videoUrl: VIDEO_URL,
  },
];

type DialogState = { title: string; video?: string; detail?: string } | null;

function Dialog({
  state,
  onClose,
}: {
  state: NonNullable<DialogState>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  // The video's own width / height, once known: it sizes the dialog.
  const [ratio, setRatio] = useState<number | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={`reference-dialog ${state.video ? "video-dialog" : ""}`}
      style={
        ratio ? ({ "--video-ratio": ratio } as React.CSSProperties) : undefined
      }
      aria-label={state.title}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="dialog-close"
        onClick={onClose}
        aria-label="Close dialog"
      >
        ×
      </button>
      <h2>{state.title}</h2>
      {state.video ? (
        <VideoPlayer
          src={state.video}
          label={state.title}
          pictureRatio={VIDEO_PICTURE_RATIO}
          onRatio={setRatio}
        />
      ) : (
        <p>{state.detail}</p>
      )}
    </dialog>
  );
}

/** Upcoming Events: the user's booked mentor sessions, month by month. */
function Events({
  onSelect,
}: {
  onSelect: (state: NonNullable<DialogState>) => void;
}) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [bookedEvents, setEvents] = useState<CalendarEvent[]>([]);
  const [fetching, setLoading] = useState<boolean>(true);
  // Chosen dummy events (four this month) stand in for the booked sessions.
  const demo = useDemoData();
  const showDemo = demo.has("events");
  const events = showDemo ? demo.events : bookedEvents;
  const loading = !showDemo && fetching;

  useEffect(() => {
    const fetchSlots = async () => {
      const result = await handleGetBookedSlots();
      if (result.success && result.data) {
        setEvents(
          result.data.results.map((slot: BookedSlot) => toCalendarEvent(slot)),
        );
      }
      setLoading(false);
    };
    fetchSlots();
  }, []);

  const goToPrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const label = `${MONTH_NAMES[currentMonth]} ${currentYear}`;
  const monthEvents = events.filter(
    (e) => e.month === currentMonth && e.year === currentYear,
  );
  const eventsOn = (day: number) => monthEvents.filter((e) => e.day === day);

  // Full month, Monday first; blank cells belong to the neighbouring months.
  const start = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const cells = Math.ceil((start + daysInMonth) / 7) * 7;
  const days = Array.from({ length: cells }, (_, i) =>
    i < start || i >= start + daysInMonth ? null : i - start + 1,
  );

  return (
    <section
      className="events-section"
      data-section="events"
      aria-labelledby="events-title"
    >
      <div className="section-heading">
        <h2 id="events-title">Upcoming Events</h2>
        <div className="month-controls">
          <button aria-label="Previous month" onClick={goToPrev}>
            <img src={asset("1-872-imgIcon.svg")} alt="" />
          </button>
          <span>{label}</span>
          <button aria-label="Next month" onClick={goToNext}>
            <img src={asset("1-872-imgIcon.svg")} alt="" />
          </button>
        </div>
      </div>
      <div className="events-panel">
        <div className="event-list">
          {loading ? (
            <p className="event-empty">Loading events...</p>
          ) : monthEvents.length === 0 ? (
            <p className="event-empty">No events this month.</p>
          ) : (
            monthEvents.map((event, index) => {
              const month = MONTH_NAMES[event.month];
              return (
                <button
                  className="event-row"
                  key={index}
                  onClick={() =>
                    onSelect({
                      title: event.title,
                      detail: `${month} ${event.day}, ${event.year} · ${event.time}`,
                    })
                  }
                  aria-label={`View event ${index + 1}: ${event.title}`}
                >
                  <img
                    className="event-photo"
                    src={asset("1-872-imgFrame2147225209.png")}
                    alt="Mentor consultation"
                  />
                  <span className="event-date">
                    <span>{month.slice(0, 3).toUpperCase()}</span>
                    <strong>{event.day}</strong>
                  </span>
                  <span className="event-info">
                    <span>{event.title}</span>
                    <small>{event.time}</small>
                  </span>
                </button>
              );
            })
          )}
        </div>
        <div className="calendar" aria-label={`${label} calendar`}>
          <div className="weekdays" aria-hidden="true">
            {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {days.map((day, index) => {
              if (!day)
                return <div key={index} className="calendar-day empty" />;
              const dayEvents = eventsOn(day);
              const active = dayEvents.length > 0;
              const summary =
                dayEvents.length > 1
                  ? `${dayEvents.length} events`
                  : dayEvents[0]?.title;
              const selectedDate = `${MONTH_NAMES[currentMonth]} ${day}, ${currentYear}`;
              return (
                <button
                  key={index}
                  className={`calendar-day ${active ? "has-session" : ""}`}
                  onClick={() =>
                    onSelect({
                      title:
                        dayEvents.length === 1
                          ? dayEvents[0].title
                          : selectedDate,
                      detail: active
                        ? `${selectedDate} · ${dayEvents.map((e) => `${e.title}, ${e.time}`).join(" · ")}`
                        : `${selectedDate} · No sessions scheduled for this date.`,
                    })
                  }
                  aria-label={`${label} ${day}${active ? `: ${summary}` : ""}`}
                >
                  <span>{day}</span>
                  {active && <small>{summary}</small>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The dashboard home (the first Figma design) with the student's data:
 * their greeting, shortlisted courses, booked sessions and the LTA suite.
 */
export default function Dashboard({
  greeting,
  courses: fetchedCourses,
}: {
  greeting: string;
  courses: ShortlistedCourse[];
}) {
  const { navigate, openDialog, persona } = useApp();
  const demo = useDemoData();
  const courses = demo.has("colleges") ? DEMO_DATA.colleges : fetchedCourses;
  const { navigationOpen, openNavigation } = useShellNavigation();
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<DialogState>(null);

  const search = query.trim().toLowerCase();
  const visible = courses
    .map((item, index) => ({
      item,
      Card: CARD_DESIGNS[index % CARD_DESIGNS.length],
    }))
    .filter(({ item }) =>
      `${item.course.university.name} ${item.course.name}`
        .toLowerCase()
        .includes(search),
    );
  const zennaMessage = courses.length
    ? `Here are your ${courses.length} university chance${courses.length === 1 ? "" : "s"} for your chosen course`
    : "Tell me about yourself and I'll find your best-fit courses.";

  // The LTA suite fills Zenna's row until the user has course matches.
  const suiteCards = (
    <div className="products-grid">
      {products.map((product) => (
        <article
          className={`product-card ${product.comingSoon ? "coming-soon" : ""}`}
          key={product.title}
        >
          <h3>
            <button
              className="product-view-link"
              aria-label={`Open ${product.title}`}
              onClick={() => navigate(product.view)}
            >
              {product.title}
            </button>
          </h3>
          <div className="product-media">
            <img
              className="product-photo"
              src={asset(product.image)}
              alt={product.title}
            />
            <span className="access-tag">
              {product.access}
              {product.locked && (
                <img src={asset("1-799-imgVector.svg")} alt="Locked" />
              )}
            </span>
            {product.videoUrl ? (
              <button
                className="product-action"
                aria-label={`Watch ${product.title} video`}
                onClick={() =>
                  setDialog({ title: VIDEO_TITLE, video: product.videoUrl })
                }
              >
                <img src={asset("1-799-imgMaskGroup.svg")} alt="" />
                {product.action}
              </button>
            ) : (
              <button
                className="product-action"
                disabled={product.comingSoon}
                onClick={() => navigate(product.view)}
              >
                {product.action}
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <div className="figma-dashboard">
      <div className="reference-shell">
        <main className="reference-main">
          <header className="reference-header" data-section="header">
            <button
              className="mobile-menu"
              aria-label="Toggle navigation"
              aria-expanded={navigationOpen}
              onClick={openNavigation}
            >
              ☰
            </button>
            <input
              type="search"
              placeholder="Search"
              aria-label="Search universities"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="reference-header-actions">
              <PersonaSelect />
              <DemoDataSwitch />
              <NotificationBell />
              <button
                className="profile-button"
                aria-label="View profile"
                onClick={() => openDialog({ kind: "settings" })}
              >
                <UserAvatar />
              </button>
            </div>
          </header>
          <div className="reference-content">
            <h1>{greeting}</h1>
            <HomeStatus courses={courses} />
            <section
              className="recommendations"
              data-section="recommendations"
              aria-label="Your university matches"
            >
              <div className="zenna-intro">
                <div className="zenna-canvas">
                  <ZennaIntro message={zennaMessage} />
                </div>
              </div>
              {courses.length > 0 ? (
                <SmoothScrollArea
                  className="university-carousel"
                  orientation="horizontal"
                  tabIndex={0}
                  aria-label="University recommendations; scroll to see more"
                >
                  {visible.map(({ item, Card }) => {
                    const card = universityCardProps(item);
                    const details = `${card.chance} admission chance · ${card.badge} · ${card.location} · ${card.course} · ${card.intake} · ${card.cost}`;
                    return (
                      <article
                        key={item.id}
                        className="university-card"
                        data-university-card
                        aria-label={card.name}
                      >
                        <button
                          className="university-card-open"
                          aria-label={`View ${card.name} recommendation`}
                          aria-describedby={`${item.id}-details`}
                          onClick={() =>
                            setDialog({ title: card.name, detail: details })
                          }
                        >
                          <div className="university-card-canvas">
                            <Card {...card} />
                          </div>
                        </button>
                        <span id={`${item.id}-details`} className="sr-only">
                          {details}
                        </span>
                      </article>
                    );
                  })}
                  {visible.length === 0 && (
                    <p className="no-results" role="status">
                      No universities match “{query}”.
                    </p>
                  )}
                </SmoothScrollArea>
              ) : (
                suiteCards
              )}
            </section>
            {/* Only verified students have sessions and events to show. */}
            {persona !== "free" && <Events onSelect={setDialog} />}
            <section
              className="testimonials-section"
              data-section="testimonials"
              aria-labelledby="testimonials-title"
            >
              <h2 id="testimonials-title">Hear from our family</h2>
              <SmoothScrollArea
                className="testimonials-grid"
                orientation="horizontal"
              >
                {TESTIMONIALS.map((item, index) => (
                  <article
                    className={`testimonial testimonial-${index % 3}`}
                    key={item.name}
                  >
                    <div className="testimonial-background">
                      <img src={item.backgroundImage} alt="" />
                    </div>
                    <div className="testimonial-overlay" />
                    <div className="testimonial-copy">
                      <h3>{item.name}</h3>
                      <p className="testimonial-degree">{item.degree}</p>
                      <TruncatedText
                        as="p"
                        className="university-badge"
                        text={item.university}
                      />
                      <blockquote>“{item.quote}”</blockquote>
                    </div>
                  </article>
                ))}
              </SmoothScrollArea>
            </section>
            <footer className="reference-footer" data-section="footer">
              <h2>Hear from our family</h2>
              <div className="footer-row">
                <div className="mentor-card">
                  <p>
                    Every university weighs these differently. Talk to a
                    mentor to see which one truly fits you best.
                  </p>
                  <div className="mentor-actions">
                    <button
                      className="primary-cta"
                      onClick={() => openDialog({ kind: "booking" })}
                    >
                      Book a session
                    </button>
                    <a
                      className="chat-cta"
                      href={LTA_WHATSAPP.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>
                        <img src={asset("1-1042-imgGroup35.svg")} alt="" />
                      </span>
                      Chat with a Mentor
                    </a>
                  </div>
                </div>
                <div className="footer-brand">
                  <img
                    src={asset("1-1042-imgFrame.svg")}
                    alt="Letters to Abroad"
                  />
                  <p>
                    Built by people who’ve
                    <br />
                    lived this journey
                  </p>
                  <div className="social-links">
                    <a
                      href="https://www.linkedin.com/company/letterstoabroad/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                    >
                      <img src={asset("1-1042-imgMdiLinkedin.svg")} alt="" />
                    </a>
                    <a
                      href="https://www.instagram.com/letterstoabroad_/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                    >
                      <img src={asset("1-1042-imgGroup.svg")} alt="" />
                    </a>
                    <button
                      className="social-button"
                      aria-label="YouTube"
                      onClick={() =>
                        setDialog({ title: VIDEO_TITLE, video: VIDEO_URL })
                      }
                    >
                      <img src={asset("1-1042-imgMaskGroup.svg")} alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
      {dialog && <Dialog state={dialog} onClose={() => setDialog(null)} />}
    </div>
  );
}
