import OriginalDashboard from "../../dashoard/_components/Dashboard";
import { useApp } from "../_components/AppProvider";
export default function DashboardView() {
  const { navigate, openDialog } = useApp();
  return (
    <div className="figma-dashboard">
      <OriginalDashboard
        onNavigate={navigate}
        onAction={(action) => openDialog({ kind: action })}
      />
    </div>
  );
}
