"use client";

/* Exported SVGs and source photos keep their intrinsic Figma dimensions. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import MunichCard from "./MunichCard";
import SorbonneCard from "./SorbonneCard";
import DarmstadtCard from "./DarmstadtCard";
import FourthCard from "./FourthCard";
import ZennaIntro from "./ZennaIntro";
import type { ViewId } from "../../../dashboard/_supernova/lib/types";
import SmoothScrollArea from "@/components/SmoothScroll/SmoothScrollArea";
import TruncatedText from "@/components/TruncatedText/TruncatedText";

const asset = (name: string) => `/assets/dashboard/${name}`;
const universities = [
  {
    id: "tum",
    name: "Technical University of Munich (TUM)",
    chance: 80,
    days: 10,
    Card: MunichCard,
  },
  {
    id: "sorbonne",
    name: "Sorbonne University",
    chance: 53,
    days: 7,
    Card: SorbonneCard,
  },
  {
    id: "darmstadt",
    name: "TU Darmstadt",
    chance: 12,
    days: 10,
    Card: DarmstadtCard,
  },
  {
    id: "tum-alternate",
    name: "Technical University of Munich (TUM)",
    chance: 12,
    days: 10,
    Card: FourthCard,
  },
];
const products = [
  {
    title: "Course Shortlisting",
    image: "1-799-imgFrame2147228693.png",
    access: "Free For All",
    action: "Try Connect",
  },
  {
    title: "LTA Connect",
    image: "1-799-imgFrame2147228692.png",
    access: "Free For All",
    action: "Watch video",
  },
  {
    title: "LTA Zenna",
    image: "1-799-imgFrame2147225052.png",
    access: "LTA Members Only",
    action: "Watch video",
  },
];
const testimonials = [
  {
    name: "GEEN GEO",
    university: "Technische Universität München (TUM)",
    image: "1-1002-imgFrame2147223995.png",
    quote:
      "All my doubts where cleared very patiently. All my applications were completed on time. Thank you so much for your support.",
  },
  {
    name: "GLADIA THOMAS",
    university: "echnical University Dresden",
    image: "1-1002-imgFrame2147223996.png",
    quote:
      "All my doubts where cleared very patiently. All my applications were completed on time. Thank you so much for your support.",
  },
  {
    name: "GEEN GEO",
    university: "Duisburg Essen Universität",
    image: "1-1002-imgFrame2147223920.png",
    quote:
      "I'm grateful for Letters To Abroad support in securing my top university admission. It wouldn't have been possible without them.",
  },
];

type DialogState = { title: string; video?: boolean; detail?: string } | null;

function Dialog({
  state,
  onClose,
}: {
  state: NonNullable<DialogState>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="reference-dialog"
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
        <video
          controls
          autoPlay
          playsInline
          aria-label={`${state.title} introduction`}
          src="https://lta-dev-kj2hs6dasja.s3.ap-south-1.amazonaws.com/LTA+WEB.mp4"
        />
      ) : (
        <>
          <p>
            {state.detail ||
              "Choose a time with an LTA mentor to explore which university fits you best."}
          </p>
          <a
            className="primary-cta"
            href="https://connect.letterstoabroad.com/home"
            target="_blank"
            rel="noreferrer"
          >
            Open LTA Connect
          </a>
        </>
      )}
    </dialog>
  );
}

function Events({
  onSelect,
}: {
  onSelect: (state: NonNullable<DialogState>) => void;
}) {
  const [offset, setOffset] = useState(0);
  const date = new Date(2026, 1 + offset, 1);
  const label = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  // Full real month, Monday first. (The Figma frame only drew a three-week
  // excerpt with invented weekdays; that is not a usable calendar.)
  const start = (date.getDay() + 6) % 7;
  const daysInMonth = new Date(2026, 2 + offset, 0).getDate();
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
          <button
            aria-label="Previous month"
            onClick={() => setOffset((value) => value - 1)}
          >
            <img src={asset("1-872-imgIcon.svg")} alt="" />
          </button>
          <span>{label}</span>
          <button
            aria-label="Next month"
            onClick={() => setOffset((value) => value + 1)}
          >
            <img src={asset("1-872-imgIcon.svg")} alt="" />
          </button>
        </div>
      </div>
      <div className="events-panel">
        <div className="event-list">
          {[0, 1, 2].map((index) => (
            <button
              className="event-row"
              key={index}
              onClick={() =>
                onSelect({
                  title: "Smart and Personalized",
                  detail:
                    "Your New Upgraded AI Partner for Wealth · May 30 · Monday, 9 AM",
                })
              }
              aria-label={`View event ${index + 1}: Smart and Personalized`}
            >
              <img
                className="event-photo"
                src={asset("1-872-imgFrame2147225209.png")}
                alt="Mentor consultation"
              />
              <span className="event-date">
                <span>MAY</span>
                <strong>30</strong>
              </span>
              <span className="event-info">
                <span>
                  💼 Smart and Personalized: Your New Upgraded AI Partner for
                  Wealth
                </span>
                <small>Monday, 9 AM</small>
              </span>
            </button>
          ))}
        </div>
        <div
          className="calendar"
          aria-label={`${label} calendar`}
        >
          <div className="weekdays" aria-hidden="true">
            {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {days.map((day, index) => {
              const active = offset === 0 && (day === 6 || day === 14);
              const selectedDate = new Date(
                2026,
                1 + offset,
                day || 1,
              ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });
              return day ? (
                <button
                  key={index}
                  className={`calendar-day ${active ? "has-session" : ""}`}
                  onClick={() =>
                    onSelect({
                      title: active
                        ? "Online Session with Mentor"
                        : selectedDate,
                      detail: active
                        ? `${selectedDate} · Online Session with Mentor`
                        : `${selectedDate} · No sessions scheduled for this date.`,
                    })
                  }
                  aria-label={`${label} ${day}${active ? ": Online Session with Mentor" : ""}`}
                >
                  <span>{day}</span>
                  {active && (
                    <small>
                      Online Session
                      <br />
                      with Mentor
                    </small>
                  )}
                </button>
              ) : (
                <div key={index} className="calendar-day empty" />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Dashboard view content; navigation comes from the shared Supernova sidebar. */
export default function Dashboard({
  onNavigate,
  onAction,
  navigationOpen,
  onOpenNavigation,
}: {
  onNavigate: (view: ViewId) => void;
  onAction: (action: "booking" | "contact") => void;
  navigationOpen: boolean;
  onOpenNavigation: () => void;
}) {
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<DialogState>(null);
  const visible = universities.filter((item) =>
    item.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const book = () => onAction("booking");
  return (
    <div className="reference-shell">
      <main className="reference-main">
        <header className="reference-header" data-section="header">
          <button
            className="mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={navigationOpen}
            onClick={onOpenNavigation}
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
          <button
            className="profile-button"
            aria-label="View profile"
            onClick={() =>
              setDialog({
                title: "Geen's profile",
                detail: "This profile is part of the Figma design reference.",
              })
            }
          >
            <img src={asset("1-571-imgEllipse8.png")} alt="Geen" />
          </button>
        </header>
        <div className="reference-content">
          <h1>Good Morning Geen!</h1>
          <section
            className="recommendations"
            data-section="recommendations"
            aria-label="Your university matches"
          >
            <div className="zenna-intro">
              <div className="zenna-canvas">
                <ZennaIntro />
              </div>
            </div>
            <SmoothScrollArea
              className="university-carousel"
              orientation="horizontal"
              tabIndex={0}
              aria-label="University recommendations; scroll to see more"
            >
              {visible.map(({ id, name, chance, days, Card }) => (
                <article
                  key={id}
                  className="university-card"
                  data-university-card
                  aria-label={name}
                >
                  <button
                    className="university-card-open"
                    aria-label={`View ${name} recommendation`}
                    aria-describedby={`${id}-details`}
                    onClick={() =>
                      setDialog({
                        title: name,
                        detail: `${chance}% admission chance · ${days} days left · Munich, Germany · Msc Technology of Biogenic · 4 Yr Course · Starting: 40k`,
                      })
                    }
                  >
                    <div className="university-card-canvas">
                      <Card />
                    </div>
                  </button>
                  <span id={`${id}-details`} className="sr-only">
                    {chance}% admission chance; {days} days left; Munich,
                    Germany; Msc Technology of Biogenic; 4 Yr Course; Starting:
                    40k.
                  </span>
                </article>
              ))}
              {visible.length === 0 && (
                <p className="no-results" role="status">
                  No universities match “{query}”.
                </p>
              )}
            </SmoothScrollArea>
          </section>
          <section
            className="products-section"
            data-section="products"
            aria-labelledby="products-title"
          >
            <h2 id="products-title">Explore LTA Suit</h2>
            <div className="products-grid">
              {products.map((product, index) => (
                <article className="product-card" key={product.title}>
                  <h3>
                    <button
                      className="product-view-link"
                      aria-label={`Open ${product.title}`}
                      onClick={() =>
                        onNavigate(
                          (["cst", "connect", "zenna"] as const)[index],
                        )
                      }
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
                      {index === 2 && (
                        <img src={asset("1-799-imgVector.svg")} alt="Locked" />
                      )}
                    </span>
                    {index === 0 ? (
                      <button
                        className="product-action"
                        onClick={() => onNavigate("connect")}
                      >
                        {product.action}
                      </button>
                    ) : (
                      <button
                        className="product-action"
                        aria-label={`Watch ${product.title} video`}
                        onClick={() =>
                          setDialog({ title: product.title, video: true })
                        }
                      >
                        <img src={asset("1-799-imgMaskGroup.svg")} alt="" />
                        {product.action}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
          <Events onSelect={setDialog} />
          <section
            className="testimonials-section"
            data-section="testimonials"
            aria-labelledby="testimonials-title"
          >
            <h2 id="testimonials-title">Hear from our family</h2>
            <div className="testimonials-grid">
              {testimonials.map((item, index) => (
                <article
                  className={`testimonial testimonial-${index}`}
                  key={item.university}
                >
                  <div className="testimonial-background">
                    <img src={asset(item.image)} alt="" />
                  </div>
                  <div className="testimonial-overlay" />
                  <div className="testimonial-copy">
                    <h3>{item.name}</h3>
                    <p className="testimonial-degree">
                      M.Sc. Logistics and Production (ISE),
                    </p>
                    <TruncatedText
                      as="p"
                      className="university-badge"
                      text={item.university}
                    />
                    <blockquote>“{item.quote}”</blockquote>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <footer className="reference-footer" data-section="footer">
            <h2>Hear from our family</h2>
            <div className="footer-row">
              <div className="mentor-card">
                <p>
                  Every university weighs these differently. to understand which
                  university truly fits you best.
                </p>
                <div className="mentor-actions">
                  <button className="primary-cta" onClick={book}>
                    Book a session
                  </button>
                  <button
                    className="chat-cta"
                    onClick={() => onAction("contact")}
                  >
                    <span>
                      <img src={asset("1-1042-imgGroup35.svg")} alt="" />
                    </span>
                    Chat with a Mentor
                  </button>
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
                      setDialog({ title: "LTA videos", video: true })
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
      {dialog && <Dialog state={dialog} onClose={() => setDialog(null)} />}
    </div>
  );
}
