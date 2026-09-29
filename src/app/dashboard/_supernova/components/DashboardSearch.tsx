"use client";

import { useState } from "react";
import { useApp } from "./AppProvider";
import { MENTORS } from "../lib/fixtures";
import { DEMO_DATA, useDemoData } from "../demo/DemoDataProvider";
import { hasAccess } from "../lib/model";
import { Icon } from "./ui";
import type { ViewId } from "../lib/types";

/**
 * Dashboard-wide search over applications, mentors and documents the
 * current persona can open. Choosing a result opens its page with the item
 * selected. Keyboard: ↑/↓ to move, Enter to open, Escape to close.
 */
export default function DashboardSearch() {
  const { persona, uploads, navigate } = useApp(),
    [query, setQuery] = useState(""),
    [shown, setShown] = useState(false),
    [active, setActive] = useState(0),
    demo = useDemoData(),
    applications = demo.has("applications") ? DEMO_DATA.applications : [],
    documents = demo.has("documents") ? DEMO_DATA.documents : [];
  const rows: [ViewId, string, string][] = [
    ...(hasAccess(persona, "zenna")
      ? applications.map(
          (a) =>
            ["zenna", a.uni + " · " + a.course, a.id] as [
              ViewId,
              string,
              string,
            ],
        )
      : []),
    ...(hasAccess(persona, "connect")
      ? MENTORS.map(
          (m) =>
            ["connect", m.n + " · " + m.role, m.id] as [ViewId, string, string],
        )
      : []),
    ...documents.map(
      (d) => ["documents", d.name, d.id] as [ViewId, string, string],
    ),
  ];
  rows.push(
    ...uploads.files.map(
      (f) => ["documents", f.name, f.id] as [ViewId, string, string],
    ),
  );
  const results = rows
    .filter((r) => r[1].toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6);
  const select = (i: number) => {
    const row = results[i];
    if (row) {
      navigate(row[0], row[2]);
      setShown(false);
      setQuery("");
    }
  };
  return (
    <div className="sn-search-wrap">
      <Icon name="search" size={18} />
      <input
        aria-label="Search applications, documents, mentors"
        type="search"
        placeholder="Search applications, documents, mentors…"
        value={query}
        onFocus={() => setShown(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setShown(true);
          setActive(0);
        }}
        aria-expanded={shown && !!query}
        aria-controls="sn-search-results"
        role="combobox"
        aria-autocomplete="list"
        aria-activedescendant={
          shown && query && results[active]
            ? `search-result-${active}`
            : undefined
        }
        onKeyDown={(e) => {
          if (e.key === "Escape") setShown(false);
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((v) => Math.min(results.length - 1, v + 1));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((v) => Math.max(0, v - 1));
          }
          if (e.key === "Enter") {
            e.preventDefault();
            select(active);
          }
        }}
      />
      {shown && query && (
        <div className="sn-search-results" id="sn-search-results" role="listbox">
          {results.length ? (
            results.map((r, i) => (
              <button
                role="option"
                id={`search-result-${i}`}
                aria-selected={active === i}
                key={r[2]}
                onClick={() => select(i)}
              >
                <Icon name={r[0]} />
                <span>
                  {r[1]}
                  <small>{r[0]}</small>
                </span>
              </button>
            ))
          ) : (
            <p>No matching applications, documents or mentors.</p>
          )}
        </div>
      )}
    </div>
  );
}
