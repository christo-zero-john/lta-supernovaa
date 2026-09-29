import type { Metadata } from "next";
import SupernovaPage from "../_supernova/components/SupernovaPage";
import ProjectView from "../_supernova/views/ProjectView";

export const metadata: Metadata = { title: "Project004" };

export default function Page() {
  return (
    <SupernovaPage view="p004">
      <ProjectView />
    </SupernovaPage>
  );
}
