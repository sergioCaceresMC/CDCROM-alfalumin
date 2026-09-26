import { useEffect, useMemo, useState } from "react";
import { loadItems } from "../game/catalog";
import type { Item } from "../game/schema";
import { errorMessage } from "./shared";
import { ItemDisclosure } from "./item-disclosure";

const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const kinds = { weapon: "arma", armor: "armadura", consumable: "consumible", misc: "objeto" };
export function ItemPicker({ savedItems, onAdd }: { savedItems: Item[]; onAdd: (item: Item) => void }) {
  const [catalog, setCatalog] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [limit, setLimit] = useState(20);
  useEffect(() => {
    let active = true;
    loadItems().then(items => { if (active) setCatalog(items); }).catch(e => { if (active) setError(errorMessage(e)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const indexed = useMemo(() => {
    // Saved definitions win: adding another unit must not change an existing item.
    const items = new Map(catalog.map(item => [item.id, item]));
    for (const item of savedItems) items.set(item.id, item);
    return [...items.values()].sort((a, b) => a.name.localeCompare(b.name, "es")).map(item => ({ item, text: normalize(`${item.name} ${item.id} ${item.description} ${kinds[item.kind]}`) }));
  }, [catalog, savedItems]);
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  const results = indexed.filter(entry => words.every(word => entry.text.includes(word)));
  const chosen = results.find(entry => entry.item.id === selected)?.item;
  return <details className="panel item-picker">
    <summary>Añadir equipo <span className="fine">Buscar otros objetos</span></summary>
    <form className="stack" onSubmit={e => { e.preventDefault(); if (chosen) onAdd(chosen); }}>
    <label>Buscar objetos<input type="search" value={query} onChange={e => { setQuery(e.target.value); setSelected(null); setLimit(20); }} placeholder="Nombre, tipo o descripción…" /></label>
    {loading && <p className="fine" role="status">Cargando catálogo de objetos…</p>}
    {error && <p className="notice error" role="alert">{error}. Puedes usar los objetos conservados en esta ficha.</p>}
    <p className="fine" role="status">{results.length} resultados · Mostrando {Math.min(limit, results.length)}</p>
    <div className="item-results" aria-label="Resultados de objetos">
      {results.slice(0, limit).map(({ item }) => <article className="item-result-row" key={item.id} aria-label={`Resultado ${item.name}`}>
        <button type="button" className="item-result" aria-label={`Seleccionar ${item.name}`} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>
          <strong>{item.name}</strong>{item.damage && <span className="fine">Daño {item.damage}</span>}
        </button>
        <ItemDisclosure item={item}><span className="fine">{kinds[item.kind]}{item.armor ? ` · Armadura ${item.armor}` : ""}</span></ItemDisclosure>
      </article>)}
    </div>
    {!results.length && !loading && <p className="muted">No hay objetos que coincidan. Prueba otra búsqueda.</p>}
    {results.length > limit && <button type="button" className="secondary" onClick={() => setLimit(count => count + 20)}>Mostrar 20 más</button>}
    <button className="primary" disabled={!chosen}>Añadir una unidad{chosen ? ` · ${chosen.name}` : ""}</button>
    </form>
  </details>;
}
