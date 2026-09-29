import type { AppState, AppAction, PersonaState } from "./types";
export function initialState(): AppState {
  const fresh = (): PersonaState => ({
    sessions: [],
    read: [],
    notices: [],
    whatsapp: true,
    ai: "watching",
    choices: [],
    requests: [],
  });
  return { free: fresh(), paid: fresh(), p004: fresh() };
}
export function appReducer(state: AppState, action: AppAction): AppState {
  if (action.type === "reset") return initialState();
  const old = state[action.persona];
  let next = { ...old };
  if (action.type === "book")
    next = {
      ...next,
      sessions: [
        ...old.sessions.filter((s) => s.id !== action.session.id),
        action.session,
      ],
      notices: [
        ...old.notices,
        {
          id: crypto.randomUUID(),
          text: `Session confirmed for ${action.session.date} at ${action.session.slot}.`,
          time: "Just now",
          view: action.session.mentorId === "team" ? "support" : "connect",
        },
      ],
    };
  if (action.type === "read")
    next = { ...next, read: [...new Set([...old.read, action.id])] };
  if (action.type === "preference") next = { ...next, whatsapp: action.value };
  if (action.type === "ai")
    next = {
      ...next,
      ai: action.value,
      notices:
        action.value === "confirmed"
          ? [
              ...old.notices,
              {
                id: crypto.randomUUID(),
                text: "Zenna deadlines confirmed. Your local reminders are ready.",
                time: "Just now",
                view: "zenna",
              },
            ]
          : old.notices,
    };
  if (action.type === "choice")
    next = { ...next, choices: [...new Set([...old.choices, action.id])] };
  if (action.type === "request")
    next = { ...next, requests: [...new Set([...old.requests, action.id])] };
  return { ...state, [action.persona]: next };
}
