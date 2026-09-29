import { useApp } from "../components/AppProvider";
import { NOTIFICATIONS } from "../lib/fixtures";

/** Unread notifications for the current persona (seeded plus local ones). */
export function useUnreadCount() {
  const { persona, state } = useApp();
  const { notices, read } = state[persona];
  return [...NOTIFICATIONS[persona], ...notices].filter(
    (notice) => !read.includes(notice.id),
  ).length;
}
