"use client";

import { useApp } from "./AppProvider";
import InteractionDialog from "./InteractionDialog";

/**
 * Dialogs and the feedback toast, available on every dashboard page
 * (e.g. Settings from the sidebar opens on the home page too).
 */
export default function SupernovaOverlays() {
  const { persona, dialog, feedback } = useApp();
  return (
    <div className="supernova">
      {dialog && (
        <InteractionDialog
          key={`${persona}-${dialog.kind}-${dialog.id || ""}`}
        />
      )}
      <div className={`sn-feedback ${feedback ? "visible" : ""}`} role="status">
        {feedback}
      </div>
    </div>
  );
}
