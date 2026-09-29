import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PersonaSwitcher from "./PersonaSwitcher";
import { useApp } from "./AppProvider";

type ShellNavigation = { navigationOpen: boolean; openNavigation: () => void };
const ShellNavigationContext = createContext<ShellNavigation | null>(null);

/** Lets a view that brings its own header open the shared navigation drawer. */
export function useShellNavigation() {
  const ctx = useContext(ShellNavigationContext);
  if (!ctx) throw new Error("AppShell missing");
  return ctx;
}

export default function AppShell({
  children,
  topbar = true,
}: {
  children: ReactNode;
  /** Views with their own header (the Figma dashboard) render without the topbar. */
  topbar?: boolean;
}) {
  const [open, setOpen] = useState(false),
    { feedback, persona, view } = useApp();
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
        {topbar ? (
          <div className="sn-main">
            <Topbar key={persona} onMenu={() => setOpen(true)} />
            <PersonaSwitcher />
            <main className="sn-content" key={`${persona}-${view}`}>
              {children}
            </main>
          </div>
        ) : (
          <div className="sn-own-header-main">{children}</div>
        )}
        <div
          className={`sn-feedback ${feedback ? "visible" : ""}`}
          role="status"
        >
          {feedback}
        </div>
      </div>
    </ShellNavigationContext.Provider>
  );
}
