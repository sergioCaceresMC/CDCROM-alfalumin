import { useState } from "react";
import type { ClassDefinition, Library, Rules } from "../game/schema";
import { generateDraft, finishDraft, toggleInitialSkill } from "../game/engine";
import { loadCharacterCatalog } from "../game/catalog";
import { Portrait, SkillCard, errorMessage } from "./shared";
import { ClassDecoration, classTheme } from "./class-decoration";

type Props = {
  library: Library; classes: ClassDefinition[]; rules: Rules;
  commit: (update: (l: Library) => Library) => void;
  onCreated: (id: string) => void;
};
export function Creation({ library, classes, rules, commit, onCreated }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { draft, setup } = library;
  const classId = setup.classId || classes[0].id;
  const selectedClass = classes.find(c => c.id === classId);
  function updateSetup(values: Partial<Library["setup"]>) {
    commit(l => ({ ...l, setup: { ...l.setup, ...values } }));
  }
  async function generate() {
    setError(""); setBusy(true);
    try {
      const name = setup.name.trim();
      if (!name) throw new Error("Escribe el nombre de tu personaje");
      if (setup.seed && (!/^\d{1,10}$/.test(setup.seed) || Number(setup.seed) > 4294967295)) throw new Error("La semilla debe ser un entero entre 0 y 4294967295");
      const seed = setup.seed ? Number(setup.seed) : crypto.getRandomValues(new Uint32Array(1))[0];
      const catalog = await loadCharacterCatalog(classId);
      const character = generateDraft(name, classId, seed, catalog, rules, crypto.randomUUID(), setup.gender);
      commit(l => ({ ...l, draft: character, setup: { name, classId, seed: String(seed), gender: setup.gender } }));
    } catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  }
  function choose(id: string) {
    try { commit(l => ({ ...l, draft: toggleInitialSkill(l.draft!, id) })); setError(""); }
    catch (e) { setError(errorMessage(e)); }
  }
  function finish() {
    try {
      const character = finishDraft(draft!);
      commit(l => ({ ...l, draft: null, characters: [...l.characters, character], activeId: character.id, setup: { name: "", classId, seed: "", gender: character.gender } }));
      onCreated(character.id);
    } catch (e) { setError(errorMessage(e)); }
  }
  return <section className="stack" aria-labelledby="creation-title">
    <div><p className="eyebrow">Un nuevo comienzo</p><h1 id="creation-title">Crea tu personaje</h1><p className="muted">Elige quién eres. Deja que el azar escriba el resto.</p></div>
    {error && <p role="alert" className="notice error">{error}</p>}
    {!draft ? <form className="panel stack" onSubmit={e => { e.preventDefault(); void generate(); }}>
      <label>Nombre<input maxLength={60} value={setup.name} onChange={e => updateSetup({ name: e.target.value })} placeholder="¿Cómo te llaman?" required disabled={busy} /></label>
      <fieldset className="gender-picker" disabled={busy}><legend>Apariencia</legend><div className="gender-options">
        <label><input type="radio" name="gender" checked={setup.gender === "m"} onChange={() => updateSetup({ gender: "m" })} />Masculino</label>
        <label><input type="radio" name="gender" checked={setup.gender === "f"} onChange={() => updateSetup({ gender: "f" })} />Femenino</label>
      </div></fieldset>
      <fieldset disabled={busy}><legend>Clase</legend><div className="class-grid">
        {classes.map(cls => <label key={cls.id} className={`class-option ${classId === cls.id ? "selected" : ""}`}>
          <input type="radio" name="class" value={cls.id} checked={classId === cls.id} onChange={() => updateSetup({ classId: cls.id })} />
          <Portrait image={cls.image} name={cls.name} classId={cls.id} gender={setup.gender} small /><span>{cls.name}</span>
        </label>)}
      </div></fieldset>
      {selectedClass && <p className="muted">{selectedClass.description} Vida base: {selectedClass.baseHp} + constitución.</p>}
      <label>Semilla numérica <span className="muted">(opcional)</span><input inputMode="numeric" maxLength={10} value={setup.seed} onChange={e => updateSetup({ seed: e.target.value })} placeholder="Vacío para generar al azar" disabled={busy} /></label>
      <p className="fine">La misma clase y semilla generan los mismos atributos, equipo y opciones con el catálogo y generador actuales.</p>
      <button className="primary" disabled={busy || !selectedClass}>{busy ? "Preparando tu destino…" : "Generar personaje →"}</button>
    </form> : <>
      <div className="panel hero class-card" data-class-theme={classTheme(draft.classId)}><ClassDecoration classId={draft.classId} /><Portrait image={draft.catalog.classes[0].image} name={draft.catalog.classes[0].name} classId={draft.classId} gender={draft.gender} small /><div><h2>{draft.name}</h2><p>{draft.catalog.classes[0].name} · Semilla {draft.seed}</p><p className="muted">Tu borrador se conserva al recargar.</p></div></div>
      <div className="section-heading"><h2>Elige cuatro habilidades</h2><span className="badge">{draft.creationChoices.length} / 4</span></div>
      <p className="muted">Estas seis opciones son de nivel 1. Las elecciones están guardadas; no cambian al volver a abrir la app.</p>
      <div className="entry-grid">{draft.creationOptions.map(id => {
        const skill = draft.catalog.skills.find(s => s.id === id)!;
        const selected = draft.creationChoices.includes(id);
        return <SkillCard key={id} skill={skill} action={<button type="button" className={selected ? "primary" : "secondary"} aria-pressed={selected} disabled={!selected && draft.creationChoices.length === 4} onClick={() => choose(id)}>{selected ? "✓ Elegida" : "Elegir habilidad"}</button>} />;
      })}</div>
      <button className="primary" disabled={draft.creationChoices.length !== 4} onClick={finish}>Comenzar aventura →</button>
      <button className="text-button" onClick={() => { if (window.confirm("¿Descartar este borrador y sus elecciones?")) commit(l => ({ ...l, draft: null })); }}>Descartar borrador</button>
    </>}
  </section>;
}

