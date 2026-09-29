"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DEMO_OPTIONS, useDemoData } from "./DemoDataProvider";
import "./DemoDataSwitch.css";

/**
 * The navbar's dummy-data switch: "Choose options" opens a list of what the
 * previewed user has (shortlists, documents, events…). Checked items fill
 * their pages from demo-data.json.
 */
export default function DemoDataSwitch() {
  const { options, has, toggle, setAll } = useDemoData();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const on = options.length > 0;

  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div className="sn-demo" ref={root}>
      <button
        type="button"
        className="sn-demo-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`sn-demo-track ${on ? "on" : ""}`} aria-hidden="true">
          <span />
        </span>
        Choose options
        {on && <span className="sn-demo-count">{options.length}</span>}
      </button>
      {open && (
        <div
          className="sn-demo-panel"
          id={panelId}
          role="group"
          aria-label="Dummy data"
          data-lenis-prevent
        >
          <p className="sn-demo-title">
            Show dummy data for
            <small>Preview only · nothing is sent</small>
          </p>
          {DEMO_OPTIONS.map((option) => (
            <label className="sn-demo-option" key={option.id}>
              <input
                type="checkbox"
                checked={has(option.id)}
                onChange={() => toggle(option.id)}
              />
              <span>
                {option.label}
                <small>{option.hint}</small>
              </span>
            </label>
          ))}
          <div className="sn-demo-actions">
            <button type="button" onClick={() => setAll(true)}>
              Select all
            </button>
            <button type="button" onClick={() => setAll(false)} disabled={!on}>
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
