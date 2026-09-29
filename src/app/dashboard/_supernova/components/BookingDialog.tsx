import { useState } from "react";
import { useApp } from "./AppProvider";
import { MENTORS } from "../lib/fixtures";
import { localDate, validateBooking } from "../lib/model";
import { Button, Icon } from "./ui";
import Modal from "./Modal";
export default function BookingDialog({
  mentorId,
  reschedule = false,
  context,
}: {
  mentorId?: string;
  reschedule?: boolean;
  context?: string;
}) {
  const { persona, state, dispatch, closeDialog, notify } = useApp(),
    mentor = MENTORS.find((m) => m.id === mentorId),
    existing = reschedule
      ? state[persona].sessions.find((s) => s.id === "source-session")
      : undefined;
  const [month, setMonth] = useState(() => {
      const d = new Date();
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }),
    [date, setDate] = useState(existing?.date || ""),
    [slot, setSlot] = useState(existing?.slot || ""),
    [error, setError] = useState("");
  const start = (month.getDay() + 6) % 7,
    total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(),
    today = localDate(new Date());
  return (
    <Modal
      title={
        reschedule
          ? "Reschedule your session"
          : `Book a ${mentor ? "1:1" : "call"}${mentor ? ` with ${mentor.n}` : " with our team"}`
      }
      onClose={closeDialog}
    >
      <p>
        {mentor
          ? mentor.role
          : "A free 15-minute video call with the LTA team."}
      </p>
      {context && <p>{context}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const err = validateBooking(date, slot, new Date());
          setError(err || "");
          if (err) return;
          dispatch({
            type: "book",
            persona,
            session: {
              id: reschedule ? "source-session" : crypto.randomUUID(),
              mentorId: mentor?.id || "team",
              date,
              slot,
            },
          });
          closeDialog();
          notify(
            `${reschedule ? "Session rescheduled" : "Session booked"} for ${date} at ${slot}. Local preview saved.`,
          );
        }}
      >
        <div className="sn-calendar-head">
          <button
            type="button"
            aria-label="Previous booking month"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
            }
          >
            ‹
          </button>
          <b>
            {month.toLocaleDateString("en", { month: "long", year: "numeric" })}
          </b>
          <button
            type="button"
            aria-label="Next booking month"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
          >
            ›
          </button>
        </div>
        <div className="sn-book-week">
          {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="sn-book-grid">
          {Array.from({ length: start }, (_, i) => (
            <span key={`blank-${i}`} />
          ))}
          {Array.from({ length: total }, (_, i) => {
            const value = localDate(
              new Date(month.getFullYear(), month.getMonth(), i + 1),
            );
            return (
              <button
                key={value}
                type="button"
                disabled={value <= today}
                aria-label={`Choose ${value}`}
                aria-pressed={date === value}
                onClick={() => setDate(value)}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="sn-slots" role="group" aria-label="Available times">
          {["09:00", "12:00", "15:00", "17:00"].map((time) => (
            <button
              type="button"
              key={time}
              aria-pressed={slot === time}
              onClick={() => setSlot(time)}
            >
              {time}
            </button>
          ))}
        </div>
        <p>
          {date
            ? `Selected: ${date}${slot ? ` · ${slot}` : ""}`
            : "Choose a future day and an available time."}
        </p>
        {error && (
          <p className="sn-error" role="alert">
            {error}
          </p>
        )}
        <div className="sn-actions">
          <Button type="submit">
            <Icon name="calendar" size={15} />
            {reschedule ? "Confirm reschedule" : "Confirm booking"}
          </Button>
          <Button type="button" variant="secondary" onClick={closeDialog}>
            Cancel
          </Button>
        </div>
        <p className="sn-body-copy">
          This preview saves your selection on this page. No booking is sent.
        </p>
      </form>
    </Modal>
  );
}
