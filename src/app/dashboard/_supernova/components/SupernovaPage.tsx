"use client";

import type { ReactNode } from "react";
import { useApp } from "./AppProvider";
import { useShellNavigation } from "./AppShell";
import PersonaSwitcher from "./PersonaSwitcher";
import Topbar from "./Topbar";
import { PageHeader } from "./ui";
import { PAGE_COPY } from "../lib/fixtures";
import type { ViewId } from "../lib/types";

/**
 * The common frame for every dashboard section page: top bar, persona
 * switcher, the page's standard header, then its content.
 */
export default function SupernovaPage({
  view,
  children,
}: {
  view: Exclude<ViewId, "dashboard">;
  children: ReactNode;
}) {
  const { persona } = useApp();
  const { openNavigation } = useShellNavigation();
  return (
    <div className="supernova">
      <div className="sn-main">
        <Topbar key={persona} onMenu={openNavigation} />
        <PersonaSwitcher />
        {/* Keyed so a persona switch starts the page fresh, as before. */}
        <main className="sn-content" key={`${persona}-${view}`}>
          <PageHeader {...PAGE_COPY[persona][view]} />
          {children}
        </main>
      </div>
    </div>
  );
}
