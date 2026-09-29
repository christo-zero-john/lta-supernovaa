"use client";

import OriginalDashboard from "../../../figma/dashoard/_components/Dashboard";
import { useApp } from "../components/AppProvider";
import { useShellNavigation } from "../components/AppShell";
export default function DashboardView() {
  const { navigate, openDialog } = useApp();
  const { navigationOpen, openNavigation } = useShellNavigation();
  return (
    <div className="figma-dashboard">
      <OriginalDashboard
        onNavigate={navigate}
        onAction={(action) => openDialog({ kind: action })}
        navigationOpen={navigationOpen}
        onOpenNavigation={openNavigation}
      />
    </div>
  );
}
