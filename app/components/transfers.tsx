import { useEffect, useState } from "react";
import type { Character, Library } from "../game/schema";
import { decodeCharacter, encodeCharacter, exportCharacter, exportLibrary, mergeTransfer, parseTransfer } from "../game/transfer";
import { download, errorMessage } from "./shared";

export function Transfers({ library, character, commit }: {
  library: Library; character?: Character; commit: (update: (l: Library) => Library) => void;
}) {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { setCode(""); }, [character]);
  async function perform(action: () => Promise<void> | void) {
    setBusy(true); setError(""); setMessage("");
    try { await action(); } catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  }
  return <section className="stack" aria-label="Guardar y recuperar">
    <div><p className="eyebrow">Lleva tu historia contigo</p><h2>Guardar y recuperar</h2><p className="muted">Copias locales, sin cuentas. Guarda un archivo antes de cambiar de dispositivo o borrar datos del navegador.</p></div>
    {error && <p role="alert" className="notice error">{error}</p>}
    {message && <p role="status" className="notice">{message}</p>}
    <div className="panel stack">
      <h3>Exportar una copia</h3>
      {character && <button className="primary" disabled={busy} onClick={() => void perform(() => download(`alfa-lumin-personaje-${character.id}.json`, exportCharacter(character)))}>Descargar personaje · JSON</button>}
      <button className="secondary" disabled={busy} onClick={() => void perform(() => download("alfa-lumin-biblioteca.json", exportLibrary(library)))}>Descargar biblioteca completa · JSON</button>
      {character && <>
        <button className="secondary" disabled={busy} onClick={() => void perform(async () => { setCode(await encodeCharacter(character)); setMessage("Código generado para el estado actual."); })}>{busy ? "Procesando…" : "Generar código de personaje"}</button>
        {code && <><label>Código de recuperación<textarea readOnly value={code} rows={4} onFocus={e => e.target.select()} /></label><button className="secondary" onClick={() => void perform(async () => { await navigator.clipboard.writeText(code); setMessage("Código copiado."); })}>Copiar código</button></>}
      </>}
      <p className="fine">El código contiene el estado completo, no solo la semilla. Puede ser largo; el archivo JSON es la alternativa más cómoda.</p>
    </div>
    <div className="panel stack">
      <h3>Importar una copia</h3><p className="muted">Se añadirán personajes con nuevos identificadores. Tus fichas existentes se conservan.</p>
      <label>Archivo JSON<input type="file" accept=".json,application/json" disabled={busy} onChange={e => {
        const file = e.target.files?.[0]; e.target.value = "";
        if (!file) return;
        void perform(async () => {
          if (file.size > 2_000_000) throw new Error("El archivo supera el límite de 2 MB");
          const transfer = parseTransfer(await file.text());
          commit(l => mergeTransfer(l, transfer, () => crypto.randomUUID()));
          setMessage("Copia importada. Puedes abrirla desde la biblioteca.");
        });
      }} /></label>
      <label>Código de personaje<textarea rows={4} maxLength={2_000_000} value={input} onChange={e => setInput(e.target.value)} placeholder="Pega el código AL1…" disabled={busy} /></label>
      <button className="primary" disabled={busy || !input.trim()} onClick={() => void perform(async () => {
        const transfer = await decodeCharacter(input);
        commit(l => mergeTransfer(l, transfer, () => crypto.randomUUID()));
        setInput(""); setMessage("Personaje recuperado. Ábrelo desde la biblioteca.");
      })}>{busy ? "Procesando…" : "Recuperar personaje"}</button>
    </div>
  </section>;
}
