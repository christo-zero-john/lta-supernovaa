"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PERSONAS } from "../lib/fixtures";
import type { PersonaId } from "../lib/types";
import { useApp } from "./AppProvider";
import "../demo/DemoDataSwitch.css";

/**
 * The navbar's persona switch: previews the dashboard as each kind of
 * student. It shares the dummy-data switch's dropdown styling.
 */
export default function PersonaSelect() {
  const { persona, setPersona } = useApp();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panelId = useId();

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
        aria-label={`Preview as: ${PERSONAS[persona].tab}`}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          className="sn-demo-icon"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
        {PERSONAS[persona].tab}
      </button>
      {open && (
        <div
          className="sn-demo-panel"
          id={panelId}
          role="group"
          aria-label="Preview as"
          data-lenis-prevent
        >
          <p className="sn-demo-title">
            Preview as
            <small>Concept demo · one student, three moments</small>
          </p>
          {(Object.keys(PERSONAS) as PersonaId[]).map((id) => (
            <button
              type="button"
              className="sn-demo-option sn-demo-choice"
              key={id}
              aria-pressed={persona === id}
              onClick={() => {
                setOpen(false);
                setPersona(id);
              }}
            >
              <i aria-hidden="true" />
              <span>
                {PERSONAS[id].tab}
                <small>{PERSONAS[id].sub}</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
