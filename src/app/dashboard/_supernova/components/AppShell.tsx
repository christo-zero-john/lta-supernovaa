"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ViewTransition,
  type ReactNode,
} from "react";
import Sidebar from "./Sidebar";

type ShellNavigation = { navigationOpen: boolean; openNavigation: () => void };
const ShellNavigationContext = createContext<ShellNavigation | null>(null);

/** Lets a page's header open the shared navigation drawer. */
export function useShellNavigation() {
  const ctx = useContext(ShellNavigationContext);
  if (!ctx) throw new Error("AppShell missing");
  return ctx;
}

/**
 * The sidebar beside the current page. Each page brings its own header
 * (the home page its Figma header, the others the top bar); only the page
 * column animates when the page changes.
 */
export default function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  const navigation = useMemo(
    () => ({ navigationOpen: open, openNavigation: () => setOpen(true) }),
    [open],
  );
  return (
    <ShellNavigationContext.Provider value={navigation}>
      <div className="sn-shell">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <ViewTransition name="dashboard-page" default="dashboard-page">
          <div className="sn-own-header-main">{children}</div>
        </ViewTransition>
      </div>
    </ShellNavigationContext.Provider>
  );
}
