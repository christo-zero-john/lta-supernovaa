import type { Metadata } from "next";
import SupernovaPage from "../_supernova/components/SupernovaPage";
import ShortlistingView from "../_supernova/views/ShortlistingView";

export const metadata: Metadata = { title: "Course Shortlisting" };

export default function Page() {
  return (
    <SupernovaPage view="cst">
      <ShortlistingView />
    </SupernovaPage>
  );
}
