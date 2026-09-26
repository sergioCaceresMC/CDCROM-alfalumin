import { useEffect, useState } from "react";
import { loadCards } from "../master/catalog";
import { cardKinds, kindLabels } from "../master/table-engine";
import type { CardDefinition, CardKind } from "../master/table-engine";
import { CardArt } from "./card-art";
import { errorMessage } from "./shared";

const normalize = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
function LibraryEntry({ card }: { card: CardDefinition }) {
  const [open, setOpen] = useState(false);
  return <details className="library-entry" onToggle={e => setOpen(e.currentTarget.open)}>
    <summary>{card.name}</summary>
    {open && <div className="stack library-entry-details">
      <CardArt definition={card} />
      <p>{card.description}</p>
      {card.mission && <p className="badge">Misión {card.mission === "main" ? "principal" : "secundaria"}</p>}
      <div className="tags">{card.maxHp !== undefined && <span>Vida {card.maxHp}</span>}{card.armor !== undefined && <span>Armadura {card.armor}</span>}{card.damage && <span>Daño {card.damage}</span>}</div>
      {card.abilities.map((ability, index) => <p className="fine" key={index}>{ability}</p>)}
      {!!card.instructions.length && <p className="fine">{card.instructions.map(i => `Saca ${i.count} de ${kindLabels[i.kind].toLowerCase()}`).join(" · ")}</p>}
      {card.musicUrl && <a href={card.musicUrl} target="_blank" rel="noopener noreferrer">Abrir sugerencia musical ↗</a>}
    </div>}
  </details>;
}
export function CardLibrary() {
  const [kind, setKind] = useState<CardKind>("terrain");
  const [cards, setCards] = useState<CardDefinition[]>([]);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true; setLoading(true); setError(""); setCards([]); setLimit(30);
    loadCards(kind).then(entries => { if (active) setCards(entries.sort((a, b) => a.name.localeCompare(b.name, "es"))); })
      .catch(e => { if (active) setError(errorMessage(e)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [kind, retry]);
  const results = cards.filter(c => normalize(c.name).includes(normalize(query).trim()));
  return <section className="stack" aria-label="Biblioteca de cartas">
    <div><h2>Biblioteca de cartas</h2><p className="fine">Consulta el catálogo. Despliega una carta para ver su imagen y sus detalles.</p></div>
    <nav className="card-library-categories" aria-label="Categorías de la biblioteca">{cardKinds.map(k => <button key={k} aria-current={kind === k ? "page" : undefined} onClick={() => setKind(k)}>{kindLabels[k]}</button>)}</nav>
    <label>Buscar por nombre<input type="search" value={query} onChange={e => { setQuery(e.target.value); setLimit(30); }} placeholder="Nombre de la carta…" /></label>
    {loading ? <p role="status">Cargando {kindLabels[kind].toLowerCase()}…</p> : error ? <div className="notice error stack" role="alert"><p>{error}</p><button onClick={() => setRetry(n => n + 1)}>Reintentar catálogo</button></div> : <>
      <p className="fine" role="status">{results.length} cartas · {kindLabels[kind]}</p>
      <div className="card-library-list">{results.slice(0, limit).map(card => <LibraryEntry key={`${kind}-${card.id}`} card={card} />)}</div>
      {!results.length && <p className="panel muted">No hay cartas que coincidan en esta categoría.</p>}
      {results.length > limit && <button onClick={() => setLimit(n => n + 30)}>Mostrar 30 más</button>}
    </>}
  </section>;
}
