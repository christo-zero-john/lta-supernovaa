"use client";

/* eslint-disable @next/next/no-img-element -- Profile photos come from any host. */
import { useState } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";

/**
 * The user's photo, or their 3D avatar. Falls back to their initials while
 * loading or if the image fails.
 */
export default function UserAvatar() {
  const { avatar, firstName, initials } = useCurrentUser();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!avatar || avatar === failedSrc) return <>{initials}</>;
  return (
    <img
      className="sn-avatar-img"
      src={avatar}
      alt={firstName || "Profile"}
      onError={() => setFailedSrc(avatar)}
    />
  );
}
