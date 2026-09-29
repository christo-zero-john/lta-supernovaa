"use client";

/* Exported SVGs and source photos keep their intrinsic Figma dimensions. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import MunichCard from "./MunichCard";
import SorbonneCard from "./SorbonneCard";
import DarmstadtCard from "./DarmstadtCard";
import FourthCard from "./FourthCard";
import ZennaIntro from "./ZennaIntro";

const asset = (name: string) => `/assets/figma/dashboard/${name}`;
const universities = [
  { id: "tum", name: "Technical University of Munich (TUM)", chance: 80, days: 10, Card: MunichCard },
  { id: "sorbonne", name: "Sorbonne University", chance: 53, days: 7, Card: SorbonneCard },
  { id: "darmstadt", name: "TU Darmstadt", chance: 12, days: 10, Card: DarmstadtCard },
  { id: "tum-alternate", name: "Technical University of Munich (TUM)", chance: 12, days: 10, Card: FourthCard },
];
const products = [
  { title: "Course Shortlisting", image: "1-799-imgFrame2147228693.png", access: "Free For All", action: "Try Connect" },
  { title: "LTA Connect", image: "1-799-imgFrame2147228692.png", access: "Free For All", action: "Watch video" },
  { title: "LTA Zenna", image: "1-799-imgFrame2147225052.png", access: "LTA Members Only", action: "Watch video" },
];
const testimonials = [
  { name: "GEEN GEO", university: "Technische Universität München (TUM)", image: "1-1002-imgFrame2147223995.png", quote: "All my doubts where cleared very patiently. All my applications were completed on time. Thank you so much for your support." },
  { name: "GLADIA THOMAS", university: "echnical University Dresden", image: "1-1002-imgFrame2147223996.png", quote: "All my doubts where cleared very patiently. All my applications were completed on time. Thank you so much for your support." },
  { name: "GEEN GEO", university: "Duisburg Essen Universität", image: "1-1002-imgFrame2147223920.png", quote: "I'm grateful for Letters To Abroad support in securing my top university admission. It wouldn't have been possible without them." },
];
const menu = [
  { label: "Dashboard", icon: "1-515-imgMenuIcons.svg" },
  { label: "Documents", icon: "/assets/icons/DocumentsIcon.svg" },
  { label: "Notifications", icon: "1-515-imgLucideBell.svg" },
  { label: "Support", icon: "/assets/icons/SupportIcon.svg" },
  { label: "Settings", icon: "/assets/icons/SettingsIcon.svg" },
  { label: "Logout", icon: "/assets/icons/LogoutIcon.svg" },
];

type DialogState = { title: string; video?: boolean; detail?: string } | null;

function Dialog({ state, onClose }: { state: NonNullable<DialogState>; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return <dialog ref={ref} className="reference-dialog" aria-label={state.title} onCancel={onClose} onClick={event => {
    if (event.target === event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }
  }}>
    <button className="dialog-close" onClick={onClose} aria-label="Close dialog">×</button>
    <h2>{state.title}</h2>
    {state.video ? <video controls autoPlay playsInline aria-label={`${state.title} introduction`} src="https://lta-dev-kj2hs6dasja.s3.ap-south-1.amazonaws.com/LTA+WEB.mp4" /> : <>
      <p>{state.detail || "Choose a time with an LTA mentor to explore which university fits you best."}</p>
      <a className="primary-cta" href="https://connect.letterstoabroad.com/home" target="_blank" rel="noreferrer">Open LTA Connect</a>
    </>}
  </dialog>;
}

function Events({ onSelect }: { onSelect: (state: NonNullable<DialogState>) => void }) {
  const [offset, setOffset] = useState(0);
  const date = new Date(2026, 1 + offset, 1);
  const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  // The reference shows a three-week excerpt, with the first on Saturday.
  const start = offset === 0 ? 5 : (date.getDay() + 6) % 7;
  const daysInMonth = new Date(2026, 2 + offset, 0).getDate();
  const cells = offset === 0 ? 21 : Math.ceil((start + daysInMonth) / 7) * 7;
  const days = Array.from({ length: cells }, (_, i) => i < start || i >= start + daysInMonth ? null : i - start + 1);
  return <section className="events-section" data-section="events" aria-labelledby="events-title">
    <div className="section-heading"><h2 id="events-title">Upcoming Events</h2><div className="month-controls">
      <button aria-label="Previous month" onClick={() => setOffset(value => value - 1)}><img src={asset("1-872-imgIcon.svg")} alt="" /></button>
      <span>{label}</span>
      <button aria-label="Next month" onClick={() => setOffset(value => value + 1)}><img src={asset("1-872-imgIcon.svg")} alt="" /></button>
    </div></div>
    <div className="events-panel">
      <div className="event-list">{[0, 1, 2].map(index => <button className="event-row" key={index} onClick={() => onSelect({ title: "Smart and Personalized", detail: "Your New Upgraded AI Partner for Wealth · May 30 · Monday, 9 AM" })} aria-label={`View event ${index + 1}: Smart and Personalized`}>
        <img className="event-photo" src={asset("1-872-imgFrame2147225209.png")} alt="Mentor consultation" />
        <span className="event-date"><span>MAY</span><strong>30</strong></span>
        <span className="event-info"><span>💼 Smart and Personalized: Your New Upgraded AI Partner for Wealth</span><small>Monday, 9 AM</small></span>
      </button>)}</div>
      <div className="calendar" aria-label={`${label} calendar${offset === 0 ? " excerpt" : ""}`}>
        <div className={`weekdays ${offset === 0 ? "" : "full-week"}`} aria-hidden="true">{(offset === 0 ? ["MO", "TU", "WE", "TH", "FR", "SA"] : ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]).map(day => <span key={day}>{day}</span>)}</div>
        <div className="calendar-grid">{days.map((day, index) => {
          const active = offset === 0 && (day === 6 || day === 14);
          const selectedDate = new Date(2026, 1 + offset, day || 1).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
          return day ? <button key={index} className={`calendar-day ${index % 7 > 4 ? "weekend" : ""} ${active ? "has-session" : ""}`} onClick={() => onSelect({ title: active ? "Online Session with Mentor" : selectedDate, detail: active ? `${selectedDate} · Online Session with Mentor` : `${selectedDate} · No sessions scheduled for this date.` })} aria-label={`${label} ${day}${active ? ": Online Session with Mentor" : ""}`}>
            <span>{day}</span>{active && <small>Online Session<br />with Mentor</small>}
          </button> : <div key={index} className="calendar-day empty" />;
        })}</div>
      </div>
    </div>
  </section>;
}

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<DialogState>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [menuOpen]);
  const visible = universities.filter(item => item.name.toLowerCase().includes(query.trim().toLowerCase()));
  const book = () => setDialog({ title: "Book a session" });
  return <div className="reference-shell">
    <aside className={`reference-sidebar ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
      {menuOpen && <button className="navigation-close" aria-label="Close navigation" onClick={() => setMenuOpen(false)}>×</button>}
      <a className="reference-logo" href="/figma/dashoard" aria-label="Letters to Abroad dashboard">
        <img src={asset("1-515-imgFrame.svg")} alt="" /><span>Letters<br />to Abroad</span>
      </a>
      <p className="menu-label">MAIN MENU</p>
      <nav>{menu.map((item, index) => <button key={item.label} className={`${index === 0 ? "is-active" : ""} ${index === 4 ? "system-item" : ""}`} aria-current={index === 0 ? "page" : undefined} onClick={() => {
        setMenuOpen(false);
        if (index === 0) window.scrollTo({ top: 0, behavior: "smooth" });
        else setDialog({ title: item.label, detail: item.label === "Logout" ? "This design reference has no signed-in account. Your account session has not been changed." : `${item.label} is available in your student dashboard. This page displays the Figma reference content.` });
      }}><span className="nav-icon"><img src={item.icon.startsWith("/") ? item.icon : asset(item.icon)} alt="" /></span><span>{item.label}</span></button>)}</nav>
    </aside>
    <main className="reference-main">
      <header className="reference-header" data-section="header">
        <button className="mobile-menu" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <input type="search" placeholder="Search" aria-label="Search universities" value={query} onChange={event => setQuery(event.target.value)} />
        <button className="profile-button" aria-label="View profile" onClick={() => setDialog({ title: "Geen's profile", detail: "This profile is part of the Figma design reference." })}><img src={asset("1-571-imgEllipse8.png")} alt="Geen" /></button>
      </header>
      <div className="reference-content">
        <h1>Good Morning Geen!</h1>
        <section className="recommendations" data-section="recommendations" aria-label="Your university matches">
          <div className="zenna-intro"><div className="zenna-canvas"><ZennaIntro /></div></div>
          <div className="university-carousel" tabIndex={0} aria-label="University recommendations; scroll to see more">
            {visible.map(({ id, name, chance, days, Card }) => <article key={id} className="university-card" data-university-card aria-label={name}><button className="university-card-open" aria-label={`View ${name} recommendation`} aria-describedby={`${id}-details`} onClick={() => setDialog({ title: name, detail: `${chance}% admission chance · ${days} days left · Munich, Germany · Msc Technology of Biogenic · 4 Yr Course · Starting: 40k` })}><div className="university-card-canvas"><Card /></div></button><span id={`${id}-details`} className="sr-only">{chance}% admission chance; {days} days left; Munich, Germany; Msc Technology of Biogenic; 4 Yr Course; Starting: 40k.</span></article>)}
            {visible.length === 0 && <p className="no-results" role="status">No universities match “{query}”.</p>}
          </div>
        </section>
        <section className="products-section" data-section="products" aria-labelledby="products-title">
          <h2 id="products-title">Explore LTA Suit</h2>
          <div className="products-grid">{products.map((product, index) => <article className="product-card" key={product.title}>
            <h3>{product.title}</h3><div className="product-media">
              <img className="product-photo" src={asset(product.image)} alt={product.title} />
              <span className="access-tag">{product.access}{index === 2 && <img src={asset("1-799-imgVector.svg")} alt="Locked" />}</span>
              {index === 0 ? <a className="product-action" href="https://connect.letterstoabroad.com/home" target="_blank" rel="noreferrer">{product.action}</a> : <button className="product-action" aria-label={`Watch ${product.title} video`} onClick={() => setDialog({ title: product.title, video: true })}>
                <img src={asset("1-799-imgMaskGroup.svg")} alt="" />{product.action}
              </button>}
            </div>
          </article>)}</div>
        </section>
        <Events onSelect={setDialog} />
        <section className="testimonials-section" data-section="testimonials" aria-labelledby="testimonials-title">
          <h2 id="testimonials-title">Hear from our family</h2>
          <div className="testimonials-grid">{testimonials.map((item, index) => <article className={`testimonial testimonial-${index}`} key={item.university}>
            <div className="testimonial-background"><img src={asset(item.image)} alt="" /></div>
            <div className="testimonial-overlay" />
            <div className="testimonial-copy"><h3>{item.name}</h3><p className="testimonial-degree">M.Sc.  Logistics and Production (ISE),</p><p className="university-badge">{item.university}</p><blockquote>“{item.quote}”</blockquote></div>
          </article>)}</div>
        </section>
        <footer className="reference-footer" data-section="footer">
          <h2>Hear from our family</h2><div className="footer-row">
            <div className="mentor-card"><p>Every university weighs these differently. to understand which university truly fits you best.</p><div className="mentor-actions">
              <button className="primary-cta" onClick={book}>Book a session</button>
              <button className="chat-cta" onClick={() => setDialog({ title: "Chat with a Mentor", detail: "Connect with an LTA mentor to discuss your university options." })}><span><img src={asset("1-1042-imgGroup35.svg")} alt="" /></span>Chat with a Mentor</button>
            </div></div>
            <div className="footer-brand"><img src={asset("1-1042-imgFrame.svg")} alt="Letters to Abroad" /><p>Built by people who’ve<br />lived this journey</p><div className="social-links">
              <a href="https://www.linkedin.com/company/letterstoabroad/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><img src={asset("1-1042-imgMdiLinkedin.svg")} alt="" /></a>
              <a href="https://www.instagram.com/letterstoabroad_/" target="_blank" rel="noreferrer" aria-label="Instagram"><img src={asset("1-1042-imgGroup.svg")} alt="" /></a>
              <button className="social-button" aria-label="YouTube" onClick={() => setDialog({ title: "LTA videos", video: true })}><img src={asset("1-1042-imgMaskGroup.svg")} alt="" /></button>
            </div></div>
          </div>
        </footer>
      </div>
    </main>
    {dialog && <Dialog state={dialog} onClose={() => setDialog(null)} />}
  </div>;
}
