import type { Metadata } from "next";
import SupernovaPage from "../_supernova/components/SupernovaPage";
import NotificationsView from "../_supernova/views/NotificationsView";

export const metadata: Metadata = { title: "Notifications" };

export default function Page() {
  return (
    <SupernovaPage view="notifications">
      <NotificationsView />
    </SupernovaPage>
  );
}
