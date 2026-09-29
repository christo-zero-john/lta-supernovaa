import { PERSONAS } from "../_lib/fixtures";
import type { PersonaId } from "../_lib/types";
import { useApp } from "./AppProvider";
export default function PersonaSwitcher() {
  const { persona, setPersona } = useApp();
  return (
    <section className="sn-personas" aria-label="Concept personas">
      <div>
        <span className="sn-eyebrow">Concept demo</span>
        <b>One account · one person · three moments</b>
      </div>
      <div className="sn-persona-tabs" role="group" aria-label="Choose persona">
        {(Object.keys(PERSONAS) as PersonaId[]).map((id) => (
          <button
            key={id}
            aria-pressed={persona === id}
            onClick={() => setPersona(id)}
          >
            <small>{PERSONAS[id].sub}</small>
            {PERSONAS[id].tab}
          </button>
        ))}
      </div>
    </section>
  );
}
