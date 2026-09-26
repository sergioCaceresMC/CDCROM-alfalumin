import { useEffect, useRef, useState } from "react";
import { emptyLibrary, librarySchema } from "./schema";
import type { Library } from "./schema";
import { readLibrary, writeLibrary } from "./storage";

export function useLibrary() {
  const [library, setLibrary] = useState<Library>(emptyLibrary);
  const state = useRef(library);
  const blocked = useRef(false);
  const [ready, setReady] = useState(false);
  const [warning, setWarning] = useState("");
  const [raw, setRaw] = useState<string | null>(null);
  useEffect(() => {
    try {
      const result = readLibrary(window.localStorage);
      state.current = result.library; blocked.current = result.blocked;
      setLibrary(result.library); setWarning(result.error); setRaw(result.raw);
    } catch {
      blocked.current = true;
      setWarning("El almacenamiento está desactivado. Exporta tu sesión antes de cerrar.");
    }
    setReady(true);
  }, []);
  function commit(update: (current: Library) => Library) {
    const next = librarySchema.parse(update(state.current));
    state.current = next;
    setLibrary(next);
    if (!blocked.current) {
      try { setWarning(writeLibrary(window.localStorage, next)); }
      catch { setWarning("El almacenamiento no está disponible. Exporta una copia antes de cerrar."); }
    }
  }
  function retry() {
    if (blocked.current && !window.confirm("Activar el guardado sustituirá cualquier dato local anterior por esta sesión. ¿Has exportado lo que quieres conservar?")) return;
    try {
      const error = writeLibrary(window.localStorage, state.current);
      setWarning(error);
      if (!error) { blocked.current = false; setRaw(null); }
    } catch { setWarning("El almacenamiento sigue sin estar disponible."); }
  }
  return { library, ready, warning, raw, commit, retry };
}
