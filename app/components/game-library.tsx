import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { loadItems, loadSkills } from "../game/catalog";
import { attributeLabels } from "../game/schema";
import type { ClassDefinition, Item, Skill } from "../game/schema";
import { CardLibrary } from "./card-library";
import { Portrait, errorMessage } from "./shared";
import { SourceReference } from "./source-reference";

const categories = { classes: "Clases", skills: "Habilidades", weapon: "Armas", armor: "Armaduras", consumable: "Consumibles", misc: "Otros objetos", cards: "Cartas del master" };
type Category = keyof typeof categories;
type Entry = { kind: "class"; data: ClassDefinition } | { kind: "skill"; data: Skill } | { kind: "item"; data: Item };
const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function CatalogEntry({ entry, classes }: { entry: Entry; classes: ClassDefinition[] }) {
  const [open, setOpen] = useState(false);
  const data = entry.data;
  return <details className="library-entry" onToggle={event => setOpen(event.currentTarget.open)}>
    <summary>{data.name}{entry.kind === "skill" && <span className="fine"> · {classes.find(cls => cls.id === entry.data.classId)?.name} · Nivel {entry.data.level}</span>}</summary>
    {open && <div className="stack library-entry-details">
      <p>{data.description}</p>
      {entry.kind === "class" && <>
        <div className="button-row"><Portrait classId={entry.data.id} image={entry.data.image} name={entry.data.name} gender="m" small /><Portrait classId={entry.data.id} image={entry.data.image} name={entry.data.name} gender="f" small /></div>
        <p>Vida base: {entry.data.baseHp} + constitución. La vida no aumenta por nivel.</p>
      </>}
      {entry.kind === "skill" && <div className="tags">{entry.data.attribute && <span>Chequeo · {attributeLabels[entry.data.attribute]}</span>}{entry.data.damage && <span>Daño · {entry.data.damage}</span>}</div>}
      {entry.kind === "item" && <>
        <div className="tags">{entry.data.damage && <span>Daño · {entry.data.damage}</span>}{entry.data.armor !== undefined && <span>Armadura · {entry.data.armor}</span>}<span>{entry.data.consumable ? "Se consume una unidad al usar" : "No consumible"}</span></div>
        {entry.data.effect?.type === "heal" && <p>Al usar: recupera {entry.data.effect.amount} puntos de vida, sin superar el máximo.</p>}
      </>}
      <SourceReference source={data.source} />
    </div>}
  </details>;
}

export function GameLibrary({ classes }: { classes: ClassDefinition[] }) {
  const [params, setParams] = useSearchParams();
  const requested = params.get("categoria") ?? "classes";
  const category: Category = Object.hasOwn(categories, requested) ? requested as Category : "classes";
  const query = params.get("buscar") ?? "";
  const classId = classes.some(cls => cls.id === params.get("clase")) ? params.get("clase")! : "";
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [limit, setLimit] = useState(30);
  function navigate(next: Category, search = "", selectedClass = "") {
    setLimit(30);
    setParams({ modo: "biblioteca", categoria: next, ...(search ? { buscar: search } : {}), ...(selectedClass ? { clase: selectedClass } : {}) }, { replace: next === category });
  }
  useEffect(() => {
    let active = true;
    setLoading(true); setError(""); setEntries([]); setLimit(30);
    async function load(): Promise<Entry[]> {
      if (category === "classes") return classes.map(data => ({ kind: "class", data }));
      if (category === "cards") return [];
      if (category === "skills") return (await loadSkills(classId || undefined)).map(data => ({ kind: "skill", data }));
      return (await loadItems()).filter(data => data.kind === category).map(data => ({ kind: "item", data }));
    }
    load().then(data => { if (active) setEntries(data.sort((a, b) => a.data.name.localeCompare(b.data.name, "es"))); })
      .catch(e => { if (active) setError(errorMessage(e)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [category, classId, classes, retry]);
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  const results = entries.filter(entry => words.every(word => normalize(`${entry.data.name} ${entry.data.description}`).includes(word)));
  return <section className="stack" aria-label="Biblioteca del juego">
    <div><h1>Biblioteca del juego</h1><p className="fine">Consulta las reglas y el equipo. Despliega una entrada para ver sus detalles.</p></div>
    <nav className="card-library-categories" aria-label="Categorías del juego">{(Object.keys(categories) as Category[]).map(key => <button key={key} aria-current={category === key ? "page" : undefined} onClick={() => navigate(key)}>{categories[key]}</button>)}</nav>
    {category === "cards" ? <CardLibrary /> : <>
      {category === "skills" && <label>Filtrar habilidades por clase<select value={classId} onChange={e => navigate(category, query, e.target.value)}><option value="">Todas las clases</option>{classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}</select></label>}
      <label>Buscar en la biblioteca<input type="search" value={query} onChange={e => navigate(category, e.target.value, classId)} placeholder="Nombre o descripción…" /></label>
      {loading ? <p role="status">Cargando {categories[category].toLowerCase()}…</p> : error ? <div className="notice error" role="alert"><p>{error}</p><button onClick={() => setRetry(n => n + 1)}>Reintentar catálogo</button></div> : <>
        <p className="fine" role="status">{results.length} resultados · Mostrando {Math.min(limit, results.length)}</p>
        {!results.length && <p>No hay resultados para esta búsqueda.</p>}
        <div className="card-library-list">{results.slice(0, limit).map(entry => <CatalogEntry key={`${category}-${entry.data.id}`} entry={entry} classes={classes} />)}</div>
        {limit < results.length && <button onClick={() => setLimit(n => n + 30)}>Mostrar más resultados</button>}
      </>}
    </>}
  </section>;
}
