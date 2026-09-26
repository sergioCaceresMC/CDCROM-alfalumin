import { useEffect, useRef, useState } from "react";
import { emptyMaster, masterSchema } from "./engine";
import type { MasterState } from "./engine";

export const MASTER_STORAGE_KEY = "alfa-lumin.master.v1";
export function useMaster() {
  const [state, setState] = useState<MasterState>(emptyMaster);
  const current = useRef(state);
  const blocked = useRef(false);
  const [ready, setReady] = useState(false);
  const [warning, setWarning] = useState("");
  const [raw, setRaw] = useState<string | null>(null);
  useEffect(() => {
    try {
      const json = window.localStorage.getItem(MASTER_STORAGE_KEY);
      setRaw(json);
      const loaded = json ? masterSchema.parse(JSON.parse(json)) : emptyMaster();
      current.current = loaded; setState(loaded); setRaw(null);
    } catch {
      blocked.current = true;
      setWarning("No se pudo leer el cuaderno del master. Los datos anteriores se conservan; exporta esta sesión antes de cerrar.");
    }
    setReady(true);
  }, []);
  function save(next: MasterState) {
    try { window.localStorage.setItem(MASTER_STORAGE_KEY, JSON.stringify(next)); setWarning(""); return true; }
    catch { setWarning("No se pudo guardar. La sesión sigue en memoria; exporta el cuaderno antes de cerrar."); return false; }
  }
  function commit(update: (s: MasterState) => MasterState) {
    const next = masterSchema.parse(update(current.current));
    current.current = next; setState(next);
    if (!blocked.current) save(next);
  }
  function retry() {
    if (blocked.current && !window.confirm("El guardado sustituirá los datos anteriores por esta sesión. ¿Has exportado las copias que quieres conservar?")) return;
    if (save(current.current)) { blocked.current = false; setRaw(null); }
  }
  return { state, ready, warning, raw, commit, retry };
}
