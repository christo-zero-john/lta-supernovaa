import { Suspense } from "react";
import SupernovaApp from "../../dashboard/_supernova/components/SupernovaApp";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="sn-loading">Opening your LTA Account…</div>}
    >
      <SupernovaApp />
    </Suspense>
  );
}
