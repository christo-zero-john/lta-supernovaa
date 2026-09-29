import type { Metadata } from "next";
import SupernovaPage from "../_supernova/components/SupernovaPage";
import DocumentsView from "../_supernova/views/DocumentsView";

export const metadata: Metadata = { title: "Documents" };

export default function Page() {
  return (
    <SupernovaPage view="documents">
      <DocumentsView />
    </SupernovaPage>
  );
}
