import useStore from "@/store/useStore";

/** The signed-in user's display name and initials (empty while loading). */
export function useCurrentUser() {
  const { user } = useStore();
  const firstName = user?.first_name?.split(" ")[0] || "";
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const initials = [user?.first_name, user?.last_name]
    .map((part) => part?.trim()[0] || "")
    .join("")
    .toUpperCase();
  return { user, firstName, name, initials };
}
