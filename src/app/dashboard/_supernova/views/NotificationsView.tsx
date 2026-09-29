"use client";

import { useApp } from "../components/AppProvider";
import { DEMO_DATA, useDemoData } from "../demo/DemoDataProvider";
import { Card, EmptyState, Icon } from "../components/ui";
export default function NotificationsView() {
  const { persona, state, dispatch, navigate } = useApp(),
    s = state[persona],
    seeded = useDemoData().has("notifications") ? DEMO_DATA.notifications : [],
    notices = [...s.notices].reverse().concat(seeded);
  return (
    <Card>
      {!notices.length && (
        <EmptyState>
          You’re all caught up. Updates from Zenna, Connect and your other LTA
          products will appear here.
        </EmptyState>
      )}
      {notices.map((n) => (
        <button
          key={n.id}
          data-notification
          className={`sn-notice ${s.read.includes(n.id) ? "read" : ""}`}
          onClick={() => {
            dispatch({ type: "read", persona, id: n.id });
            navigate(n.view);
          }}
        >
          <span className="sn-notice-icon">
            <Icon name={n.view} />
          </span>
          <span>
            <b>{n.text}</b>
            <small>{n.time}</small>
          </span>
          {!s.read.includes(n.id) && <i className="sn-notice-dot" />}
        </button>
      ))}
    </Card>
  );
}
