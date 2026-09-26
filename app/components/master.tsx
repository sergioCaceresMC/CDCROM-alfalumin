import { useState } from "react";
import { useSearchParams } from "react-router";
import type { Character } from "../game/schema";
import { decodeCharacter, parseTransfer } from "../game/transfer";
import { maxHp } from "../game/engine";
import { addParticipant, createCampaign, exportMaster, importMaster } from "../master/engine";
import type { Campaign } from "../master/engine";
import { useMaster } from "../master/use-master";
import { placeCard } from "../master/table-engine";
import { MasterTable } from "./master-table";
import { CardLibrary } from "./card-library";
import { download, errorMessage, Portrait } from "./shared";

const sections = { mesa: "Mesa", biblioteca: "Biblioteca", participantes: "Participantes", notas: "Notas", guardado: "Guardar" };
export function Master({ characters }: { characters: Character[] }) {
  const { state, ready, warning, raw, commit, retry } = useMaster();
  const [params, setParams] = useSearchParams();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const campaign = state.campaigns.find(c => c.id === params.get("campana"));
  const requested = params.get("seccion") ?? "mesa";
  const section = Object.hasOwn(sections, requested) ? requested as keyof typeof sections : "mesa";
  function navigate(campaignId?: string, section = "mesa") {
    setParams({ modo: "master", seccion: section, ...(campaignId ? { campana: campaignId } : {}) });
  }
  function act(action: () => void) { setError(""); setMessage(""); try { action(); } catch (e) { setError(errorMessage(e)); } }
  function updateCampaign(change: (c: Campaign) => Campaign) {
    commit(s => ({ ...s, campaigns: s.campaigns.map(c => c.id === campaign?.id ? change(c) : c) }));
  }
  function addCharacters(copies: Character[]) {
    if (!copies.length) throw new Error("La copia no contiene personajes completos.");
    updateCampaign(c => copies.reduce((current, character) => addParticipant(current, character, crypto.randomUUID()), c));
    setMessage("Participantes añadidos como copias independientes.");
  }
  if (!ready) return <p role="status">Abriendo el cuaderno del master…</p>;
  return <div className="stack master-book">
    {warning && <aside className="notice error stack" role="alert"><p>{warning}</p><button onClick={retry}>Reintentar guardado del master</button>{raw && <button onClick={() => download("alfa-lumin-master-original.json", raw)}>Descargar cuaderno original</button>}<button onClick={() => act(() => download("alfa-lumin-master.json", exportMaster(state)))}>Exportar sesión del master</button></aside>}
    {error && <p className="notice error" role="alert">{error}</p>}
    {message && <p className="notice" role="status">{message}</p>}
    {!campaign ? <>
      <nav className="button-row" aria-label="Cuaderno del master"><button onClick={() => navigate(undefined, "mesa")}>Campañas</button><button onClick={() => navigate(undefined, "biblioteca")}>Biblioteca</button></nav>
      {section === "biblioteca" ? <CardLibrary /> : <>
      <div><p className="eyebrow">Cuaderno del master</p><h1>Campañas</h1><p className="muted">Prepara tu aventura y conserva la mesa entre sesiones.</p></div>
      {params.get("campana") && <p className="notice">Esta campaña no está en el cuaderno. Selecciona otra o importa una copia.</p>}
      <form className="panel button-row" onSubmit={e => {
        e.preventDefault(); const title = String(new FormData(e.currentTarget).get("title"));
        act(() => { const c = createCampaign(title, crypto.randomUUID()); commit(s => ({ ...s, campaigns: [...s.campaigns, c] })); navigate(c.id); });
      }}><label>Nombre de campaña<input name="title" required maxLength={60} /></label><button className="primary">Crear campaña</button></form>
      <div className="library-grid">{state.campaigns.map(c => <article key={c.id} className="panel stack"><h2>{c.name}</h2><p className="fine">{c.members.length} participantes · {c.table.cards.length} cartas</p><button onClick={() => navigate(c.id)}>Abrir campaña · {c.name}</button><button className="text-button danger" onClick={() => {
        if (window.confirm("¿Eliminar la campaña y su mesa? Exporta una copia para conservarla.")) act(() => commit(s => ({ ...s, campaigns: s.campaigns.filter(p => p.id !== c.id) })));
      }}>Eliminar campaña</button></article>)}</div>
      </>}
    </> : <>
      <button className="text-button back" onClick={() => navigate()}>← Todas las campañas</button>
      <div><p className="eyebrow">Cuaderno del master</p><h1>{campaign.name}</h1></div>
      <nav className="sheet-nav master-nav" aria-label="Secciones del master">{Object.entries(sections).map(([key, label]) => <button key={key} aria-current={section === key ? "page" : undefined} onClick={() => navigate(campaign.id, key)}>{label}</button>)}</nav>
      {section === "biblioteca" && <CardLibrary />}
      {section === "mesa" && <MasterTable key={campaign.id} campaignName={campaign.name} onLeave={() => navigate(campaign.id, "notas")} table={campaign.table} update={change => updateCampaign(c => ({ ...c, table: change(c.table) }))} />}
      {section === "participantes" && <>
        <section className="panel stack"><h2>Añadir participantes</h2><p className="fine">Las fichas se copian al cuaderno. Los cambios en las cartas no modifican las fichas originales.</p>
          <form className="button-row" onSubmit={e => { e.preventDefault(); const id = String(new FormData(e.currentTarget).get("character")); act(() => { const c = characters.find(c => c.id === id); if (c) addCharacters([c]); }); }}>
            <label>Ficha local<select name="character" disabled={!characters.length}>{characters.map(c => <option key={c.id} value={c.id}>{c.name} · {c.catalog.classes[0].name}</option>)}</select></label><button disabled={!characters.length}>Añadir ficha local</button>
          </form>
          {!characters.length && <p className="fine">Crea una ficha en Jugadores o importa una copia.</p>}
          <label>Importar fichas JSON<input type="file" accept=".json,application/json" disabled={busy} onChange={e => {
            const file = e.target.files?.[0]; e.target.value = ""; if (!file) return; setBusy(true);
            void (async () => { try { if (file.size > 2_000_000) throw new Error("El archivo supera 2 MB."); const copy = parseTransfer(await file.text()); addCharacters(copy.kind === "character" ? [copy.data] : copy.data.characters); setError(""); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); } })();
          }} /></label>
          <label>Código de participante<textarea rows={3} value={code} maxLength={2_000_000} onChange={e => setCode(e.target.value)} /></label>
          <button disabled={busy || !code.trim()} onClick={() => { setBusy(true); void decodeCharacter(code).then(copy => { if (copy.kind !== "character") throw new Error("Usa un código de personaje."); addCharacters([copy.data]); setCode(""); setError(""); }).catch(e => setError(errorMessage(e))).finally(() => setBusy(false)); }}>Importar código</button>
        </section>
        <div className="library-grid">{campaign.members.map(m => <article key={m.id} className="panel stack"><div className="participant-heading"><Portrait image={m.character.catalog.classes[0].image} name={m.character.catalog.classes[0].name} classId={m.character.classId} gender={m.character.gender} small /><div><h3>{m.character.name}</h3><p>{m.character.catalog.classes[0].name} · Nivel {m.character.level}</p><p>Vida {m.character.hp} / {maxHp(m.character)}</p></div></div>
          <details><summary>Ver habilidades y equipo</summary><div className="stack"><p>{m.character.skillIds.map(id => m.character.catalog.skills.find(s => s.id === id)?.name).join(" · ") || "Sin habilidades"}</p><p>{m.character.inventory.map(i => `${m.character.catalog.items.find(s => s.id === i.itemId)?.name} ×${i.quantity}`).join(" · ") || "Sin equipo"}</p></div></details>
          <button onClick={() => act(() => updateCampaign(c => ({ ...c, table: placeCard(c.table, {
            id: `participant-${c.members.indexOf(m)}`, kind: "npc", name: m.character.name,
            description: `${m.character.catalog.classes[0].name} · Nivel ${m.character.level}. Equipo: ${m.character.inventory.map(i => `${m.character.catalog.items.find(s => s.id === i.itemId)?.name} ×${i.quantity}`).join(", ") || "ninguno"}.`,
            maxHp: maxHp(m.character), abilities: m.character.skillIds.map(id => { const skill = m.character.catalog.skills.find(s => s.id === id)!; return `${skill.name}: ${skill.description}`; }), instructions: [],
          }, crypto.randomUUID()) })))}>Colocar personaje en la mesa</button>
          <button className="text-button danger" onClick={() => act(() => {
            updateCampaign(c => ({ ...c, members: c.members.filter(p => p.id !== m.id),
              // Keep legacy records valid when their participant is explicitly removed.
              encounters: c.encounters.map(e => {
                const combatants = e.combatants.filter(p => p.memberId !== m.id);
                const activeId = combatants.some(p => p.id === e.activeId) ? e.activeId : e.status === "active" ? combatants[0]?.id ?? null : null;
                return { ...e, combatants, activeId, status: e.status === "active" && !activeId ? "finished" as const : e.status };
              }),
            }));
          })}>Quitar participante</button>
        </article>)}</div>
      </>}
      {section === "notas" && <form className="panel stack" onSubmit={e => {
        e.preventDefault(); const data = new FormData(e.currentTarget); act(() => { updateCampaign(c => ({ ...c, name: String(data.get("title")), notes: String(data.get("notes")) })); setMessage("Notas guardadas."); });
      }}><label>Nombre de la campaña<input name="title" defaultValue={campaign.name} maxLength={60} required /></label><label>Notas del master<textarea name="notes" key={campaign.id} defaultValue={campaign.notes} maxLength={20_000} rows={12} /></label><button className="primary">Guardar notas</button></form>}
    </>}
    {((!campaign && section !== "biblioteca") || section === "guardado") && <section className="panel stack"><h2>Guardar el cuaderno</h2><p className="fine">Copias locales sin sincronización. La exportación conserva campañas, participantes, cartas y mapas. Importar añade copias con identificadores nuevos.</p><button onClick={() => act(() => download("alfa-lumin-master.json", exportMaster(state)))}>Exportar cuaderno · JSON</button>{campaign && <button onClick={() => act(() => download(`alfa-lumin-campana-${campaign.id}.json`, exportMaster({ version: 1, campaigns: [campaign] })))}>Exportar campaña · JSON</button>}
      <label>Importar cuaderno JSON<input type="file" accept=".json,application/json" disabled={busy} onChange={e => {
        const file = e.target.files?.[0]; e.target.value = ""; if (!file) return; setBusy(true);
        void (async () => { try { if (file.size > 10_000_000) throw new Error("El archivo supera 10 MB."); const json = await file.text(); commit(s => importMaster(s, json, () => crypto.randomUUID())); setMessage("Cuaderno importado. Tus campañas anteriores se conservan."); setError(""); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); } })();
      }} /></label>
    </section>}
  </div>;
}




