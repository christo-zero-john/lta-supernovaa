import useStore from "@/store/useStore";

// 3D student avatars (Microsoft Fluent Emoji, MIT), used until profile photo
// uploads exist. Files live in public/assets/avatars/<group>/; list new
// files here too.
const AVATARS = {
  male: ["student_light", "student_medium", "student_dark"],
  female: ["student_light", "student_medium", "student_dark"],
  common: ["student_light", "student_medium", "student_dark"],
} as const;

type AvatarGroup = keyof typeof AVATARS;

function avatarGroup(gender: string | null | undefined): AvatarGroup {
  const value = gender?.trim().toLowerCase();
  if (value === "male" || value === "m") return "male";
  if (value === "female" || value === "f") return "female";
  return "common";
}

/**
 * A random-looking avatar from the user's group that stays the same for
 * them (picked from their id).
 */
function avatarFor(id: string | number, gender: string | null | undefined) {
  const group = avatarGroup(gender);
  const files = AVATARS[group];
  const seed = [...String(id)].reduce(
    (hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0,
    7,
  );
  return `/assets/avatars/${group}/${files[seed % files.length]}.png`;
}

/** The signed-in user's display name, initials and avatar (empty while loading). */
export function useCurrentUser() {
  const { user } = useStore();
  const firstName = user?.first_name?.split(" ")[0] || "";
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const initials = [user?.first_name, user?.last_name]
    .map((part) => part?.trim()[0] || "")
    .join("")
    .toUpperCase();
  const avatar = user
    ? user.profile_picture || avatarFor(user.id, user.gender)
    : null;
  return { user, firstName, name, initials, avatar };
}
