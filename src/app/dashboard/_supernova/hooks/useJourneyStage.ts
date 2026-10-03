import { useApp } from "../components/AppProvider";
import { DEMO_DATA, useDemoData } from "../demo/DemoDataProvider";

/**
 * Where the student is on their journey, as an index into JOURNEY.
 * Placeholder data until the backend provides it.
 */
export function useJourneyStage() {
  const { persona } = useApp();
  const demo = useDemoData();
  if (persona === "p004") return 3;
  if (persona === "free") return 0;
  const offerAccepted =
    demo.has("applications") &&
    DEMO_DATA.applications.length > 0 &&
    demo.has("offer");
  return offerAccepted ? 2 : 1;
}
