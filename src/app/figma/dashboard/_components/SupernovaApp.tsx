"use client";
import { AppProvider, useApp } from "./AppProvider";
import AppShell from "./AppShell";
import { PAGE_COPY } from "../_lib/fixtures";
import { PageHeader, Button, Card } from "./ui";
import InteractionDialog from "./InteractionDialog";
import DashboardView from "../_views/DashboardView";
import ZennaView from "../_views/ZennaView";
import ConnectView from "../_views/ConnectView";
import ShortlistingView from "../_views/ShortlistingView";
import ProjectView from "../_views/ProjectView";
import DocumentsView from "../_views/DocumentsView";
import NotificationsView from "../_views/NotificationsView";
import SupportView from "../_views/SupportView";
const views = {
  dashboard: DashboardView,
  zenna: ZennaView,
  connect: ConnectView,
  cst: ShortlistingView,
  p004: ProjectView,
  documents: DocumentsView,
  notifications: NotificationsView,
  support: SupportView,
};
function Content() {
  const { persona, view, signedOut, setSignedOut, dialog } = useApp();
  if (signedOut)
    return (
      <div className="supernova sn-signed-out">
        <Card>
          <h1>See you soon, Tino.</h1>
          <p>
            Your concept session is signed out. Your real LTA account hasn’t
            changed.
          </p>
          <Button onClick={() => setSignedOut(false)}>Sign back in</Button>
        </Card>
      </div>
    );
  const View = views[view];
  const isDashboard = view === "dashboard";
  // One shell for every view keeps the sidebar mounted across navigation.
  // The Figma dashboard stays outside the .supernova scope and brings its own header.
  return (
    <div className={isDashboard ? undefined : "supernova"}>
      <AppShell topbar={!isDashboard}>
        {isDashboard ? (
          <DashboardView />
        ) : (
          <>
            <PageHeader {...PAGE_COPY[persona][view]} />
            <View />
          </>
        )}
      </AppShell>
      {dialog && (
        <InteractionDialog
          key={`${persona}-${dialog.kind}-${dialog.id || ""}`}
        />
      )}
    </div>
  );
}
export default function SupernovaApp() {
  return (
    <AppProvider>
      <Content />
    </AppProvider>
  );
}
