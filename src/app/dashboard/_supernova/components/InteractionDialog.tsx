import { useState } from "react";
import { useApp } from "./AppProvider";
import { APPLICATIONS, MENTORS, GATES, PERSONAS } from "../lib/fixtures";
import { JOBS } from "../lib/jobs";
import { Button, StatusBadge, ProgressBar } from "./ui";
import Modal from "./Modal";
import BookingDialog from "./BookingDialog";
import { downloadText } from "../lib/download";
import type { GateContent } from "./Gate";
import UserAvatar from "./UserAvatar";
import { useCurrentUser } from "../hooks/useCurrentUser";
export default function InteractionDialog() {
  const { user } = useCurrentUser();
  const {
      dialog,
      persona,
      view,
      state,
      dispatch,
      closeDialog,
      notify,
      openDialog,
      reset,
    } = useApp(),
    [whatsapp, setWhatsapp] = useState(state[persona].whatsapp);
  if (!dialog) return null;
  if (dialog.kind === "booking")
    return (
      <BookingDialog
        mentorId={dialog.id}
        reschedule={dialog.reschedule}
        context={dialog.detail}
      />
    );
  if (dialog.kind === "application") {
    const a = APPLICATIONS.find((a) => a.id === dialog.id);
    if (!a) return null;
    return (
      <Modal title={a.uni} onClose={closeDialog}>
        <p>{a.course}</p>
        <StatusBadge tone={a.status}>{a.stTxt}</StatusBadge>
        <div className="sn-detail-grid">
          <div>
            <small>Completion</small>
            {a.prog}%
          </div>
          <div>
            <small>Next deadline</small>
            {a.dl} · {a.dld}
          </div>
        </div>
        <ProgressBar value={a.prog} />
        {persona === "p004" && (
          <p>Your archived admissions record is read-only.</p>
        )}
        <Button variant="secondary" onClick={closeDialog}>
          Done
        </Button>
      </Modal>
    );
  }
  if (dialog.kind === "settings")
    return (
      <Modal title="Your LTA Account" onClose={closeDialog}>
        <span className="sn-avatar sn-profile-avatar">
          <UserAvatar />
        </span>
        <div className="sn-detail-grid">
          <div>
            <small>First name</small>
            {user?.first_name?.trim() || "Not added yet"}
          </div>
          <div>
            <small>Last name</small>
            {user?.last_name?.trim() || "Not added yet"}
          </div>
          <div>
            <small>Current role</small>
            {PERSONAS[persona].role}
          </div>
        </div>
        <label className="sn-settings-label">
          <input
            type="checkbox"
            checked={whatsapp}
            onChange={(e) => setWhatsapp(e.target.checked)}
          />
          WhatsApp updates
        </label>
        <p>Deadline reminders and status updates, together in one place.</p>
        <Button
          onClick={() => {
            dispatch({ type: "preference", persona, value: whatsapp });
            closeDialog();
            notify("Your preferences are saved for this session.");
          }}
        >
          Save preferences
        </Button>
      </Modal>
    );
  if (dialog.kind === "logout")
    return (
      <Modal title="Log out of this concept?" onClose={closeDialog}>
        <p>
          Your local selections and uploaded files will be cleared. Your real
          LTA account stays signed in.
        </p>
        <div className="sn-actions">
          <Button onClick={reset}>Log out</Button>
          <Button variant="secondary" onClick={closeDialog}>
            Stay here
          </Button>
        </div>
      </Modal>
    );
  if (dialog.kind === "gate") {
    const id = dialog.id || view,
      g = (GATES[persona] as Record<string, GateContent>)[id];
    if (!g) return null;
    return (
      <Modal title={g.title} onClose={closeDialog}>
        <p>{g.text}</p>
        <div className="sn-gate-features">
          {g.features.map((f) => (
            <StatusBadge key={f}>{f}</StatusBadge>
          ))}
        </div>
        {dialog.detail === "explain" ? (
          <Button variant="secondary" onClick={closeDialog}>
            Got it
          </Button>
        ) : (
          <>
            <p>Save your interest in this preview.</p>
            <Button
              disabled={state[persona].choices.includes(id)}
              onClick={() => {
                dispatch({ type: "choice", persona, id });
                closeDialog();
                notify(
                  "You’re on the local interest list. No message was sent.",
                );
              }}
            >
              {id === "connect" ? "Join the waitlist" : "Notify me at launch"}
            </Button>
          </>
        )}
      </Modal>
    );
  }
  if (dialog.kind === "requests")
    return (
      <Modal title="Your mentor requests" onClose={closeDialog}>
        <p>3 aspirants requested your DIT story this week.</p>
        {[1, 2, 3].map((id) => (
          <div className="sn-request" key={id}>
            <span>Mentor request #{id}</span>
            {state[persona].requests.includes(id) ? (
              <StatusBadge tone="free">Handled ✓</StatusBadge>
            ) : (
              <>
                <Button
                  onClick={() => {
                    dispatch({ type: "request", persona, id });
                    notify(`Request #${id} accepted locally.`);
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    dispatch({ type: "request", persona, id });
                    notify(`Request #${id} declined locally.`);
                  }}
                >
                  Decline
                </Button>
              </>
            )}
          </div>
        ))}
      </Modal>
    );
  if (dialog.kind === "session") {
    const s = state[persona].sessions.find((s) => s.id === dialog.id),
      isSource = dialog.id === "source-session",
      m =
        MENTORS.find((m) => m.id === s?.mentorId) ||
        (isSource ? MENTORS[0] : undefined);
    return (
      <Modal title="Your session details" onClose={closeDialog}>
        <p>
          {m?.n || "LTA team"} ·{" "}
          {s ? `${s.date} · ${s.slot}` : "Friday 6 July · 17:00"} · Video call
        </p>
        <p>
          {isSource
            ? "Course selection for Technical Logistics"
            : m?.role || "Free 15-minute call with our team"}
        </p>
        <StatusBadge tone="free">Session preview ready</StatusBadge>
        <p>
          A live meeting link will appear here when connected to LTA bookings.
          This preview does not start a video call.
        </p>
        <Button variant="secondary" onClick={closeDialog}>
          Done
        </Button>
      </Modal>
    );
  }
  if (dialog.kind === "job") {
    const j = JOBS.find((j) => j.id === dialog.id);
    if (!j) return null;
    return (
      <Modal title={j.company} onClose={closeDialog}>
        <p>{j.role}</p>
        <div className="sn-actions">
          <StatusBadge tone="free">{j.match}</StatusBadge>
          <StatusBadge>{j.status}</StatusBadge>
        </div>
        <p>Matched based on your skills & German B2.</p>
        <Button variant="secondary" onClick={closeDialog}>
          Done
        </Button>
      </Modal>
    );
  }
  if (dialog.kind === "share") {
    const text =
      "Tino Sunny\nLogistics Challenge 2027\nRank #7 · Top 2% · 2,340 points\nLogistics · Project004 · Letters to Abroad";
    return (
      <Modal title="Your shareable profile" onClose={closeDialog}>
        <pre>{text}</pre>
        <p>
          Copy this profile for your LinkedIn post. Nothing is published
          automatically.
        </p>
        <div className="sn-actions">
          <Button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(text);
                notify("Profile copied.");
              } catch {
                notify("Clipboard unavailable. Download your profile instead.");
              }
            }}
          >
            Copy profile
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              downloadText("Tino-Sunny-Project004.txt", text);
              notify("Profile downloaded.");
            }}
          >
            Download profile
          </Button>
        </div>
      </Modal>
    );
  }
  return (
    <Modal title="Talk to the LTA team" onClose={closeDialog}>
      <p>
        Built by people who’ve lived this journey — ask us anything, in English,
        Malayalam or German.
      </p>
      <div className="sn-detail-grid">
        <div>
          <small>WhatsApp replies</small>Usually within 2 hours, IST daytime
        </div>
        <div>
          <small>Email</small>info@letterstoabroad.com
        </div>
      </div>
      <div className="sn-actions">
        <Button onClick={() => openDialog({ kind: "booking" })}>
          Book a free call
        </Button>
        <a
          className="sn-button secondary"
          href="mailto:info@letterstoabroad.com"
        >
          Write an email
        </a>
      </div>
    </Modal>
  );
}
