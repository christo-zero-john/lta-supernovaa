"use client";

import { useEffect, useState } from "react";
import { useApp } from "../components/AppProvider";
import { SHORTLIST_OPTIONS } from "../lib/fixtures";
import { Button, Card, ProgressBar, StatusBadge } from "../components/ui";
import { DEMO_DATA, useDemoData } from "../demo/DemoDataProvider";

type Level = keyof typeof SHORTLIST_OPTIONS.levels;

/** The answers the backend's shortlisting submission takes. */
type Answers = {
  season: string;
  year: string;
  level: Level;
  field: string;
  interests: string[];
  background: string;
  ielts: string;
  german: string;
  work: string;
  findForMe: boolean;
  universities: string[];
  referral: string;
};

const STEPS = ["Your goal", "Your profile", "Your preferences"];

/** The first field left empty on a step, as a message for the user. */
function missing(step: number, a: Answers) {
  if (step === 1 && !a.field) return "Choose a field of study.";
  if (step === 2 && !a.background.trim())
    return "Enter your highest qualification.";
  if (step === 2 && !a.ielts) return "Choose your IELTS range.";
  if (step === 2 && !a.german) return "Choose your German level.";
  return "";
}

function toggle(list: string[], value: string, max: number) {
  if (list.includes(value)) return list.filter((v) => v !== value);
  return list.length < max ? [...list, value] : list;
}

function Chips({
  label,
  options,
  selected,
  onPick,
}: {
  label: string;
  options: readonly string[];
  selected: readonly string[];
  onPick: (value: string) => void;
}) {
  return (
    <div className="sn-field">
      {label}
      <div className="sn-filter" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            type="button"
            key={o}
            aria-pressed={selected.includes(o)}
            onClick={() => onPick(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="sn-field">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

/**
 * Course Shortlisting: a three-step form with the backend's fields, then the
 * shortlist. The backend calculates the chances, so until it is connected
 * the results are the dummy report.
 */
export default function ShortlistingView() {
  const { openDialog } = useApp();
  const demo = useDemoData();
  const thisYear = new Date().getFullYear();
  const [answers, setAnswers] = useState<Answers>({
    season: "Summer",
    year: String(thisYear + 1),
    level: "Masters",
    field: "",
    interests: [],
    background: "",
    ielts: "",
    german: "",
    work: "",
    findForMe: true,
    universities: [],
    referral: "",
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  // "auto" follows the dummy report; the other modes are the user's doing.
  const [mode, setMode] = useState<"auto" | "form" | "preparing" | "done">(
    "auto",
  );
  const [open, setOpen] = useState<string | null>(null);
  const phase =
    mode === "auto" ? (demo.has("courses") ? "done" : "form") : mode;
  const results = phase === "done" ? DEMO_DATA.courses : null;
  const set = (patch: Partial<Answers>) => setAnswers({ ...answers, ...patch });

  useEffect(() => {
    if (mode !== "preparing") return;
    const timer = setTimeout(() => setMode("done"), 1600);
    return () => clearTimeout(timer);
  }, [mode]);

  const next = () => {
    const problem = missing(step, answers);
    setError(problem);
    if (problem) return;
    if (step < STEPS.length) setStep(step + 1);
    else {
      setStep(1);
      setMode("preparing");
    }
  };

  return (
    <div className="sn-form-grid">
      {results ? (
        <Card>
          <h3>Your answers</h3>
          <p className="sn-body-copy">
            {results.filter((r) => r.eligible).length} of {results.length}{" "}
            courses you are eligible for.
          </p>
          <ul className="sn-checks">
            <li className="done">
              {answers.season} {answers.year} intake
            </li>
            <li className="done">
              {answers.level} · {answers.field || "Logistics and Supply Chain"}
            </li>
            <li className="done">
              {answers.background || "B.Tech Mechanical Engineering"}
            </li>
            <li className="done">
              IELTS {answers.ielts || "7 to 7.5"} · German{" "}
              {answers.german || "A2"}
            </li>
            <li className="done">
              {answers.findForMe || !answers.universities.length
                ? "Universities found for you"
                : answers.universities.join(", ")}
            </li>
          </ul>
          <Button
            variant="secondary"
            style={{ marginTop: 18, width: "100%" }}
            onClick={() => setMode("form")}
          >
            Update my answers
          </Button>
        </Card>
      ) : (
        <Card>
          <h3>Tell us about yourself</h3>
          <p className="sn-body-copy">
            Step {step} of {STEPS.length} · {STEPS[step - 1]}. About three
            minutes in total.
          </p>
          <div style={{ marginTop: 14 }}>
            <ProgressBar value={Math.round((step / STEPS.length) * 100)} />
          </div>
          <form
            className="sn-form"
            style={{ marginTop: 18 }}
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
          >
            {step === 1 && (
              <>
                <Chips
                  label="Intake"
                  options={SHORTLIST_OPTIONS.seasons}
                  selected={[answers.season]}
                  onPick={(season) => set({ season })}
                />
                <Select
                  label="Intake year"
                  value={answers.year}
                  options={[0, 1, 2].map((n) => String(thisYear + n))}
                  placeholder="Choose a year"
                  onChange={(year) => set({ year })}
                />
                <Chips
                  label="I want to study a"
                  options={Object.keys(SHORTLIST_OPTIONS.levels)}
                  selected={[answers.level]}
                  onPick={(level) =>
                    set({ level: level as Level, field: "" })
                  }
                />
                <Select
                  label="Field of study"
                  value={answers.field}
                  options={SHORTLIST_OPTIONS.levels[answers.level]}
                  placeholder="Choose a field"
                  onChange={(field) => set({ field })}
                />
                <Chips
                  label="Interests (up to five)"
                  options={SHORTLIST_OPTIONS.interests}
                  selected={answers.interests}
                  onPick={(v) =>
                    set({ interests: toggle(answers.interests, v, 5) })
                  }
                />
              </>
            )}
            {step === 2 && (
              <>
                <label className="sn-field">
                  Your highest qualification
                  <input
                    value={answers.background}
                    placeholder="For example B.Tech Mechanical Engineering"
                    onChange={(e) => set({ background: e.target.value })}
                  />
                </label>
                <Select
                  label="IELTS score"
                  value={answers.ielts}
                  options={SHORTLIST_OPTIONS.ielts}
                  placeholder="Choose a range"
                  onChange={(ielts) => set({ ielts })}
                />
                <Select
                  label="German level"
                  value={answers.german}
                  options={SHORTLIST_OPTIONS.german}
                  placeholder="Choose a level"
                  onChange={(german) => set({ german })}
                />
                <Select
                  label="Work experience"
                  value={answers.work}
                  options={SHORTLIST_OPTIONS.work}
                  placeholder="Choose one"
                  onChange={(work) => set({ work })}
                />
              </>
            )}
            {step === 3 && (
              <>
                <Chips
                  label="Universities"
                  options={["Find universities for me", "I have some in mind"]}
                  selected={[
                    answers.findForMe
                      ? "Find universities for me"
                      : "I have some in mind",
                  ]}
                  onPick={(v) =>
                    set({ findForMe: v === "Find universities for me" })
                  }
                />
                {!answers.findForMe && (
                  <Chips
                    label="We check these first and still suggest better matches"
                    options={SHORTLIST_OPTIONS.universities}
                    selected={answers.universities}
                    onPick={(v) =>
                      set({ universities: toggle(answers.universities, v, 6) })
                    }
                  />
                )}
                <label className="sn-field">
                  Referral code (optional)
                  <input
                    value={answers.referral}
                    onChange={(e) => set({ referral: e.target.value })}
                  />
                </label>
                <p className="sn-body-copy">
                  Your name, email and phone number come from your account.
                </p>
              </>
            )}
            {error && (
              <p className="sn-error" role="alert">
                {error}
              </p>
            )}
            <div className="sn-actions sn-form-steps">
              <Button
                type="button"
                variant="secondary"
                disabled={step === 1 || phase === "preparing"}
                onClick={() => {
                  setError("");
                  setStep(step - 1);
                }}
              >
                Back
              </Button>
              <Button type="submit" disabled={phase === "preparing"}>
                {step === STEPS.length ? "Get my shortlist →" : "Continue →"}
              </Button>
            </div>
          </form>
        </Card>
      )}
      <Card>
        <div className="sn-actions">
          <h3>
            {results
              ? "Your results"
              : phase === "preparing"
                ? "Zenna is preparing your shortlist"
                : "Your results will appear here"}
          </h3>
          {results && (
            <StatusBadge tone="free">
              {mode === "done" ? "Sample report" : "Saved report"}
            </StatusBadge>
          )}
        </div>
        {results ? (
          <>
            {results.map((r) => (
              <div key={r.mono}>
                <button
                  className="sn-chance-row"
                  aria-expanded={open === r.mono}
                  onClick={() => setOpen(open === r.mono ? null : r.mono)}
                >
                  <span className="sn-mono">{r.mono}</span>
                  <div>
                    <b>{r.university}</b>
                    <small>{r.course}</small>
                    <StatusBadge tone={r.eligible ? "ok" : "bad"}>
                      {r.eligible ? "Eligible" : "Not eligible yet"}
                    </StatusBadge>
                  </div>
                  <div
                    className="sn-chance-pct"
                    style={{
                      color:
                        r.pct >= 65
                          ? "#1f8a62"
                          : r.pct >= 40
                            ? "#b9770e"
                            : "#c2415b",
                    }}
                  >
                    {r.pct}%<ProgressBar value={r.pct} />
                  </div>
                </button>
                {open === r.mono && (
                  <div className="sn-disclaimer sn-chance-why">
                    <b>Why this chance.</b> {r.why}
                    {r.gap && (
                      <>
                        <br />
                        <b>What would raise it.</b> {r.gap}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
            <p className="sn-body-copy" style={{ marginTop: 10 }}>
              Select a course to see why it got this chance and what would
              raise it.
            </p>
          </>
        ) : (
          <p className="sn-empty">
            {phase === "preparing"
              ? "We are matching your profile against course requirements. This usually takes under a minute."
              : "Answer the three steps and you’ll get an honest percentage for each matched course — green means apply with confidence, amber means possible, red means we’d suggest better-fit options."}
          </p>
        )}
        <div className="sn-disclaimer">
          ⚖️ Honesty note: the chance is an estimate from your answers and each
          course’s published requirements. For a module-level prediction
          (matching your actual transcripts against course handbooks), our
          application team does a full evaluation. No one can honestly promise
          a “100% admission guarantee” to German public universities — and
          anyone who does is someone to walk away from.
        </div>
        {results && (
          <Button
            style={{ marginTop: 16, width: "100%" }}
            onClick={() =>
              openDialog({
                kind: "booking",
                detail: results
                  .map((r) => `${r.university}: ${r.pct}%`)
                  .join(" · "),
              })
            }
          >
            Talk to our team about these results →
          </Button>
        )}
      </Card>
    </div>
  );
}
