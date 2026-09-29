import OriginalDashboard from "../../dashoard/_components/Dashboard";
import { useApp } from "../_components/AppProvider";
import { useShellNavigation } from "../_components/AppShell";
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
