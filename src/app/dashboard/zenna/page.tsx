import type { Metadata } from "next";
import SupernovaPage from "../_supernova/components/SupernovaPage";
import ZennaView from "../_supernova/views/ZennaView";

export const metadata: Metadata = { title: "Zenna" };

export default function Page() {
  return (
    <SupernovaPage view="zenna">
      <ZennaView />
    </SupernovaPage>
  );
}
