import { FAQS, HELP_CARDS } from "../lib/fixtures";
import { useApp } from "../components/AppProvider";
import { Button, Card, Icon } from "../components/ui";
export default function SupportView() {
  const { persona, state, openDialog } = useApp();
  return (
    <>
      {state[persona].sessions
        .filter((s) => s.mentorId === "team")
        .map((s) => (
          <Card className="sn-session" key={s.id}>
            <span className="sn-avatar">LTA</span>
            <div>
              <b>Your call with the LTA team</b>
              <small>
                {s.date} · {s.slot} · Local booking preview
              </small>
            </div>
            <Button
              variant="secondary"
              onClick={() => openDialog({ kind: "session", id: s.id })}
            >
              View session
            </Button>
          </Card>
        ))}
      <div className="sn-help-grid">
        {HELP_CARDS.map((h, i) =>
          i === 2 ? (
            <a
              className="sn-help"
              key={h.title}
              href="mailto:info@letterstoabroad.com"
            >
              <Icon name="mail" size={26} />
              <b>{h.title}</b>
              <p>{h.text}</p>
            </a>
          ) : (
            <button
              className="sn-help"
              key={h.title}
              onClick={() =>
                openDialog({ kind: i === 0 ? "contact" : "booking" })
              }
            >
              <Icon name={i === 0 ? "support" : "calendar"} size={26} />
              <b>{h.title}</b>
              <p>{h.text}</p>
            </button>
          ),
        )}
      </div>
      <Card>
        <h3>Common questions</h3>
        {FAQS.map((f) => (
          <details className="sn-faq" key={f.question}>
            <summary>{f.question}</summary>
            <p>{f.answer}</p>
          </details>
        ))}
      </Card>
    </>
  );
}
