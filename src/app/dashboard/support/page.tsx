import type { Metadata } from "next";
import SupernovaPage from "../_supernova/components/SupernovaPage";
import SupportView from "../_supernova/views/SupportView";

export const metadata: Metadata = { title: "Support" };

export default function Page() {
  return (
    <SupernovaPage view="support">
      <SupportView />
    </SupernovaPage>
  );
}
