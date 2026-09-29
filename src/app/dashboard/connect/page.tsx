import type { Metadata } from "next";
import SupernovaPage from "../_supernova/components/SupernovaPage";
import ConnectView from "../_supernova/views/ConnectView";

export const metadata: Metadata = { title: "LTA Connect" };

export default function Page() {
  return (
    <SupernovaPage view="connect">
      <ConnectView />
    </SupernovaPage>
  );
}
