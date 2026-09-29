import { useState, useRef, useEffect } from "react";
import { validateUpload } from "../lib/model";
import type { PersonaId } from "../lib/types";
export type UploadedDocument = {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
  persona: PersonaId;
};
export function useUploads(persona: PersonaId) {
  const [all, setAll] = useState<UploadedDocument[]>([]),
    [errors, setErrors] = useState<Record<PersonaId, string>>({
      free: "",
      paid: "",
      p004: "",
    }),
    urls = useRef(new Set<string>());
  useEffect(
    () => () => {
      urls.current.forEach((u) => URL.revokeObjectURL(u));
      urls.current.clear();
    },
    [],
  );
  const add = (files: File[]) => {
    const errors: string[] = [],
      accepted: UploadedDocument[] = [];
    for (const file of files) {
      const e = validateUpload(file);
      if (e) {
        errors.push(`${file.name}: ${e}`);
        continue;
      }
      const url = URL.createObjectURL(file);
      urls.current.add(url);
      accepted.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        url,
        persona,
      });
    }
    setErrors((old) => ({ ...old, [persona]: errors.join(" ") }));
    setAll((old) => [...old, ...accepted]);
  };
  const remove = (id: string) => {
    const file = all.find((f) => f.id === id && f.persona === persona);
    if (file) {
      URL.revokeObjectURL(file.url);
      urls.current.delete(file.url);
      setAll((old) => old.filter((f) => f.id !== id));
    }
  };
  const reset = () => {
    urls.current.forEach((u) => URL.revokeObjectURL(u));
    urls.current.clear();
    setAll([]);
    setErrors({ free: "", paid: "", p004: "" });
  };
  return {
    files: all.filter((f) => f.persona === persona),
    add,
    remove,
    reset,
    error: errors[persona],
  };
}
