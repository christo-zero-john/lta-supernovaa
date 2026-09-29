import { useApp } from "../components/AppProvider";
import { DEMO_DATA, useDemoData } from "../demo/DemoDataProvider";

/** Unread notifications: the dummy ones when chosen, plus local ones. */
export function useUnreadCount() {
  const { persona, state } = useApp();
  const { notices, read } = state[persona];
  const seeded = useDemoData().has("notifications")
    ? DEMO_DATA.notifications
    : [];
  return [...seeded, ...notices].filter(
    (notice) => !read.includes(notice.id),
  ).length;
}
