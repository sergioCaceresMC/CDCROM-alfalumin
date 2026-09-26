import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { loadCards, loadMaps } from "../master/catalog";
import { bringCardToFront, cardKinds, drawCard, kindLabels, mapSchema, movePiece, placeCard, removeTableCards, resetTable, resizeImageMap, restoreCard, rollDie, setCardHp, storeAllCards, storeCard, tableSize, TILE_SIZE } from "../master/table-engine";
import type { CardDefinition, CardKind, MapDefinition, Table } from "../master/table-engine";
import { errorMessage } from "./shared";
import { MapTile } from "./map-tile";
import { GameIcon } from "./game-icon";
import { CardArt } from "./card-art";
import { readImageMap } from "../master/map-images";

const tokenStyles = [
  { color: "red", label: "roja", icon: "sword" },
  { color: "green", label: "verde", icon: "heart" },
  { color: "purple", label: "violeta", icon: "book" },
  { color: "gold", label: "dorada", icon: "shield" },
] as const;

export function MasterTable({ table, update, onLeave, campaignName }: { table: Table; update: (change: (t: Table) => Table) => void; onLeave: () => void; campaignName: string }) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [cleanupOpen, setCleanupOpen] = useState(false);
  const [toolsTab, setToolsTab] = useState("decks");
  const bounds = tableSize(table);
  const [kind, setKind] = useState<CardKind>("terrain");
  const [catalog, setCatalog] = useState<CardDefinition[]>([]);
  const [maps, setMaps] = useState<MapDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [inventoryQuery, setInventoryQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState(true);
  const [dice, setDice] = useState<string>("");
  const [preview, setPreview] = useState<{ id: string; x: number; y: number } | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const pan = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const [panning, setPanning] = useState(false);
  const [uploading, setUploading] = useState(false);
  const mapWidth = (table.map?.width ?? 0) * TILE_SIZE + 28;
  const mapHeight = (table.map?.height ?? 0) * TILE_SIZE + 80;
  const mapLeft = (bounds.width - mapWidth) / 2;
  const mapTop = (bounds.height - mapHeight) / 2;
  useEffect(() => {
    const view = viewport.current;
    const focusedMap = table.imageMaps.find(m => m.id === selected);
    if (view && focusedMap) {
      view.scrollLeft = Math.max(0, (focusedMap.x + focusedMap.width / 2) * zoom - view.clientWidth / 2);
      view.scrollTop = Math.max(0, (focusedMap.y + focusedMap.height / 2) * zoom - view.clientHeight / 2);
    } else if (view && table.map) {
      view.scrollLeft = Math.max(0, (mapLeft + mapWidth / 2) * zoom - view.clientWidth / 2);
      view.scrollTop = Math.max(0, (mapTop + mapHeight / 2) * zoom - view.clientHeight / 2);
    }
  }, [table.map?.id, mapLeft, mapTop, mapWidth, mapHeight, zoom, selected]);
  const drag = useRef<{ id: string; startX: number; startY: number; x: number; y: number } | null>(null);
  useEffect(() => {
    let active = true; setLoading(true); setCatalog([]); setError(""); setQuery("");
    loadCards(kind).then(cards => { if (active) setCatalog(cards); }).catch(e => { if (active) setError(errorMessage(e)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [kind]);
  function act(action: () => void) { try { action(); setError(""); } catch (e) { setError(errorMessage(e)); } }
  function raiseCard(id: string) {
    if (table.cards.some(c => c.id === id) && table.cards.at(-1)?.id !== id) act(() => update(t => bringCardToFront(t, id)));
  }
  function startDrag(e: PointerEvent<HTMLElement>, piece: { id: string; x: number; y: number }) {
    if (e.button !== 0) return;
    raiseCard(piece.id);
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { ...piece, startX: e.clientX, startY: e.clientY };
  }
  function dragPosition(e: PointerEvent<HTMLElement>) {
    const d = drag.current;
    const map = table.imageMaps.find(m => m.id === d?.id);
    return d ? { id: d.id, x: Math.max(0, Math.min(bounds.width - (map?.width ?? 250), d.x + (e.clientX - d.startX) / zoom)), y: Math.max(0, Math.min(bounds.height - (map?.height ?? 250), d.y + (e.clientY - d.startY) / zoom)) } : null;
  }
  const dragProps = (piece: { id: string; x: number; y: number }) => ({
    onPointerDown: (e: PointerEvent<HTMLElement>) => startDrag(e, piece),
    onPointerMove: (e: PointerEvent<HTMLElement>) => { const p = dragPosition(e); if (p) setPreview(p); },
    onPointerUp: (e: PointerEvent<HTMLElement>) => { const p = dragPosition(e); drag.current = null; setPreview(null); if (p) act(() => update(t => movePiece(t, p.id, p.x, p.y))); },
    onPointerCancel: () => { drag.current = null; setPreview(null); },
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      const offsets: Record<string, [number, number]> = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] };
      const delta = offsets[e.key];
      if (delta) { e.preventDefault(); act(() => update(t => movePiece(t, piece.id, piece.x + delta[0], piece.y + delta[1]))); }
    },
  });
  const position = (piece: { id: string; x: number; y: number }) => ({ left: preview?.id === piece.id ? preview.x : piece.x, top: preview?.id === piece.id ? preview.y : piece.y });
  const card = table.cards.find(c => c.id === selected);
  const token = table.tokens.find(c => c.id === selected);
  const imageMap = table.imageMaps.find(m => m.id === selected);
  const normalized = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const results = catalog.filter(c => normalized(`${c.name} ${c.description}`).includes(normalized(query)));
  async function executeInstructions(definition: CardDefinition) {
    try {
      const decks = await Promise.all(definition.instructions.map(i => loadCards(i.kind)));
      update(current => definition.instructions.reduce((state, instruction, index) => {
        for (let count = 0; count < instruction.count; count++) state = drawCard(state, instruction.kind, decks[index], crypto.randomUUID());
        return state;
      }, current)); setError("");
    } catch (e) { setError(errorMessage(e)); }
  }
  return <section className="fullscreen-table" aria-label="Mesa de aventura">
    <div className="table-topbar"><button onClick={onLeave}>← Volver al cuaderno</button><span>{campaignName}</span>
      <div className="table-cleanup"><button aria-label="Acciones del tablero" title="Acciones del tablero" aria-expanded={cleanupOpen} aria-controls="table-cleanup-menu" onClick={() => setCleanupOpen(v => !v)}><GameIcon name="reset" /></button>
        {cleanupOpen && <div id="table-cleanup-menu" className="panel stack">
          <button disabled={!table.cards.length} onClick={() => act(() => { update(storeAllCards); setSelected(null); setCleanupOpen(false); })}>Guardar todas las cartas en inventario</button>
          <button disabled={!table.cards.length} onClick={() => {
            if (window.confirm("¿Retirar todas las cartas de la mesa? Las del inventario se conservan.")) act(() => { update(removeTableCards); setSelected(null); setCleanupOpen(false); });
          }}>Retirar cartas de la mesa</button>
          <button onClick={() => {
            if (window.confirm("¿Reiniciar el tablero? Se retirarán cartas, fichas y mapas. El inventario del master se conserva.")) act(() => { update(resetTable); setSelected(null); setCleanupOpen(false); });
          }}>Reiniciar tablero</button>
          <p className="fine">El inventario, los participantes y las notas de campaña se conservan.</p>
        </div>}
      </div>
      <button aria-expanded={toolsOpen} aria-controls="table-tools" onClick={() => setToolsOpen(v => !v)}>{toolsOpen ? "Cerrar barajas" : "Barajas y herramientas"}</button></div>
    {error && <p className="notice error" role="alert">{error}</p>}
    <div className="master-workspace">
      <aside id="table-tools" hidden={!toolsOpen} className="panel stack master-tools" aria-label="Herramientas de la mesa">
        <nav className="tools-tabs" aria-label="Secciones de herramientas">{[{ id: "decks", label: "Barajas" }, { id: "search", label: "Buscar" }, { id: "inventory", label: "Inventario" }].map(tab => <button key={tab.id} aria-current={toolsTab === tab.id ? "page" : undefined} onClick={() => setToolsTab(tab.id)}>{tab.label}</button>)}</nav>
        {toolsTab !== "inventory" && <>
        <label>Categoría de cartas<select value={kind} onChange={e => setKind(e.target.value as CardKind)}>{cardKinds.map(k => <option key={k} value={k}>{kindLabels[k]}</option>)}</select></label>
        {toolsTab === "search" && <label>Buscar carta<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Nombre o descripción" /></label>}
        {loading ? <p role="status">Cargando baraja…</p> : <>
          {toolsTab === "decks" ? <section className="stack" aria-label="Baraja seleccionada"><h3>{kindLabels[kind]}</h3><p className="fine">{catalog.length} cartas diferentes · Tiradas ilimitadas</p>
          <button className="primary" disabled={!catalog.length} onClick={() => act(() => update(t => drawCard(t, kind, catalog, crypto.randomUUID())))}>Sacar carta al azar</button>
          <p className="fine">Cada extracción crea una copia. Las cartas pueden repetirse.</p></section> : <section className="stack" aria-label="Buscar carta específica">
          <div className="master-card-results">{results.slice(0, 30).map(c => <button key={c.id} className="secondary" onClick={() => act(() => update(t => placeCard(t, c, crypto.randomUUID())))}>Colocar · {c.name}</button>)}</div>
          {!results.length && <p className="fine">No hay cartas que coincidan.</p>}
          {results.length > 30 && <p className="fine">Mostrando 30 de {results.length}. Afina la búsqueda.</p>}
          </section>}
        </>}
        </>}
        {toolsTab === "inventory" && <section className="stack" aria-label="Inventario del master"><h3>Inventario del master · {table.storedCards.length}</h3>
          <label>Buscar carta guardada<input type="search" value={inventoryQuery} onChange={e => setInventoryQuery(e.target.value)} /></label>
          {!table.storedCards.length && <p className="fine">Selecciona una carta de la mesa y guárdala aquí para usarla después.</p>}
          <div className="master-card-results">{table.storedCards.filter(c => normalized(c.definition.name).includes(normalized(inventoryQuery))).map(c => <button key={c.id} onClick={() => act(() => update(t => restoreCard(t, c.id)))}>Colocar guardada · {c.definition.name}{c.hp !== undefined ? ` · Vida ${c.hp}` : ""}</button>)}</div>
        </section>}
        <details><summary>Escenario</summary><div className="stack">
          <label>Cargar mapa como imagen<input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={e => {
            const file = e.target.files?.[0]; e.target.value = ""; if (!file) return;
            setUploading(true);
            const view = viewport.current;
            const x = Math.max(0, (view?.scrollLeft ?? 0) / zoom + 80);
            const y = Math.max(0, (view?.scrollTop ?? 0) / zoom + 100);
            void readImageMap(file, crypto.randomUUID(), x, y).then(map => {
              update(t => ({ ...t, imageMaps: [...t.imageMaps, { ...map, x: Math.min(map.x, tableSize(t).width - map.width), y: Math.min(map.y, tableSize(t).height - map.height) }] })); setError("");
            }).catch(error => setError(errorMessage(error))).finally(() => setUploading(false));
          }} /></label>
          {uploading && <p role="status">Cargando imagen del mapa…</p>}
          <p className="fine">PNG, JPG o WebP · Hasta 2 MB. Arrastra el mapa y abre sus ajustes para cambiar el tamaño.</p>
          {table.imageMaps.map(m => <button key={m.id} onClick={() => setSelected(m.id)}>Ajustar mapa · {m.name}</button>)}
          <button onClick={() => void loadMaps().then(setMaps).catch(e => setError(errorMessage(e)))}>Ver mapas del catálogo</button>
          {maps.map(m => <button key={m.id} onClick={() => act(() => update(t => ({ ...t, map: structuredClone(m) })))}>{m.name}</button>)}
          <label>Cargar mapa JSON<input type="file" accept=".json,application/json" onChange={e => {
            const file = e.target.files?.[0]; e.target.value = ""; if (!file) return;
            void (async () => { try {
              if (file.size > 1_000_000) throw new Error("El mapa supera 1 MB.");
              const map = mapSchema.parse(JSON.parse(await file.text())); update(t => ({ ...t, map })); setError("");
            } catch (error) { setError(errorMessage(error)); } })();
          }} /></label>
          {table.map && <button onClick={() => update(t => ({ ...t, map: null }))}>Retirar mapa</button>}
        </div></details>
        <section className="stack" aria-label="Fichas libres"><h3>Fichas</h3><div className="token-palette">{tokenStyles.map(style => <button key={style.color} className={`token-${style.color}`} aria-label={`Colocar ficha ${style.label}`} title={`Colocar ficha ${style.label}`} onClick={() => act(() => update(t => ({ ...t, tokens: [...t.tokens, { id: crypto.randomUUID(), label: "Ficha", color: style.color, x: t.map ? tableSize(t).width / 2 : 420, y: t.map ? tableSize(t).height / 2 : 400 }] })))}><GameIcon name={style.icon} /></button>)}</div>
          {!!table.tokens.length && <div className="token-palette" aria-label="Fichas colocadas">{table.tokens.map(t => <button key={t.id} className={`token-${t.color}`} title={t.label} aria-label={`Ver detalles de ficha · ${t.label}`} onClick={() => setSelected(t.id)}><GameIcon name={tokenStyles.find(s => s.color === t.color)!.icon} /></button>)}</div>}
        </section>
        <div className="stack"><h3>Dados</h3><div className="dice-buttons">{[2, 4, 6, 8, 10, 12, 20, 100].map(sides => <button key={sides} onClick={() => setDice(`d${sides}: ${rollDie(sides)}`)}>d{sides}</button>)}</div><output aria-live="polite" className="dice-result">{dice || "Elige un dado"}</output></div>
      </aside>
      <div className="stack master-table-area">
        <div className="button-row table-view-controls"><label>Zoom de la mesa<select value={zoom} onChange={e => setZoom(Number(e.target.value))}>{[.5, .75, 1, 1.25, 1.5].map(z => <option key={z} value={z}>{z * 100}%</option>)}</select></label><button aria-pressed={layers} onClick={() => setLayers(v => !v)}>{layers ? "Ocultar sugerencias" : "Mostrar sugerencias"}</button></div>
        <div ref={viewport} className={`table-viewport ${panning ? "panning" : ""}`} tabIndex={0} aria-label="Mesa desplazable" onPointerDown={e => {
          if (e.button !== 0 || e.pointerType === "touch" || (e.target as HTMLElement).closest(".table-card, .table-token-piece, .table-image-map, button, input, select, textarea, a")) return;
          const view = e.currentTarget;
          pan.current = { x: e.clientX, y: e.clientY, left: view.scrollLeft, top: view.scrollTop };
          view.setPointerCapture(e.pointerId); setPanning(true); e.preventDefault();
        }} onPointerMove={e => {
          if (!pan.current) return;
          e.currentTarget.scrollLeft = pan.current.left - (e.clientX - pan.current.x);
          e.currentTarget.scrollTop = pan.current.top - (e.clientY - pan.current.y);
        }} onPointerUp={() => { pan.current = null; setPanning(false); }} onPointerCancel={() => { pan.current = null; setPanning(false); }} onLostPointerCapture={() => { pan.current = null; setPanning(false); }}>
          <div style={{ width: bounds.width * zoom, height: bounds.height * zoom }}><div className="adventure-table" style={{ width: bounds.width, height: bounds.height, transform: `scale(${zoom})` }}>
            {table.imageMaps.map(m => <section key={m.id} className="table-image-map" style={{ ...position(m), width: m.width, height: m.height }} {...dragProps(m)} tabIndex={0} aria-label={`Mover mapa ${m.name}`}>
              <img src={m.image} alt={m.name} draggable={false} />
              <button onPointerDown={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} onClick={() => setSelected(m.id)} aria-label={`Ajustar mapa ${m.name}`}>Ajustar mapa</button>
            </section>)}
            {table.map && <section className="table-map" style={{ left: mapLeft, top: mapTop }} aria-label={table.map.name}><h3>{table.map.name}</h3><div className="map-grid" style={{ gridTemplateColumns: `repeat(${table.map.width}, ${TILE_SIZE}px)` }}>{table.map.cells.map((id, index) => {
              const tile = table.map!.legend.find(l => l.id === id)!;
              const suggestions = layers ? table.map!.suggestions.filter(s => s.x === index % table.map!.width && s.y === Math.floor(index / table.map!.width)) : [];
              const terrain = tile.terrain ?? (["wall", "water", "grass", "path"].includes(id) ? id : "floor");
              return <div key={index} className={`map-cell tile-${terrain}`} title={[tile.name, ...suggestions.map(s => table.map!.legend.find(l => l.id === s.id)!.name)].join(" · ")}><MapTile terrain={terrain} variant={index} />{suggestions.map((s, i) => <b key={i}>{table.map!.legend.find(l => l.id === s.id)!.symbol}</b>)}</div>;
            })}</div><p className="fine">{table.map.description}</p></section>}
            {table.cards.map((c, index) => <article key={c.id} style={{ ...position(c), zIndex: index + 2 }} {...dragProps(c)} tabIndex={0} onClick={() => raiseCard(c.id)} onFocus={() => raiseCard(c.id)} aria-label={`Mover ${c.definition.name}`} className={`table-card card-${c.definition.kind} ${selected === c.id ? "selected" : ""}`}>
              <div className="card-banner"><span className="card-emblem"><GameIcon name={c.definition.kind === "enemy" ? "sword" : c.definition.kind === "npc" ? "shield" : "book"} /></span><span>{kindLabels[c.definition.kind]}</span></div>
              <CardArt key={c.definition.image ?? c.definition.kind} definition={c.definition} />
              <h3 className="piece-handle">{c.definition.name}</h3>
              <p className="card-description">{c.definition.description}</p>{c.definition.mission && <p className="fine">Misión {c.definition.mission === "main" ? "principal" : "secundaria"}</p>}
              {c.hp !== undefined && <p>Vida {c.hp} / {c.definition.maxHp} · Armadura {c.definition.armor ?? "—"} · Daño {c.definition.damage ?? "—"}</p>}
              <div className="card-quick-actions" onPointerDown={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()}>
                <button title="Guardar carta" aria-label={`Guardar ${c.definition.name} en inventario`} onClick={() => act(() => { update(t => storeCard(t, c.id)); if (selected === c.id) setSelected(null); })}><GameIcon name="bag" /></button>
                <button title="Retirar carta" aria-label={`Retirar ${c.definition.name} del tablero`} onClick={() => act(() => { update(t => ({ ...t, cards: t.cards.filter(p => p.id !== c.id) })); if (selected === c.id) setSelected(null); })}><GameIcon name="remove" /></button>
              </div>
              <button className="card-details-toggle" aria-label={`Ver detalles de ${c.definition.name}`} aria-expanded={selected === c.id} onPointerDown={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} onClick={() => setSelected(current => current === c.id ? null : c.id)}>Ver detalles</button>
            </article>)}
            {table.tokens.map(t => <div key={t.id} className="table-token-piece" style={position(t)}><button className={`table-token token-${t.color}`} {...dragProps(t)} aria-label={`Mover ficha ${t.label}`} title={t.label}><GameIcon name={tokenStyles.find(s => s.color === t.color)!.icon} /><span>{t.label}</span></button><button className="token-details" aria-label={`Ver detalles de ${t.label}`} onClick={() => setSelected(t.id)}>⚙</button></div>)}
            {!table.cards.length && !table.map && <p className="table-empty">Coloca un mapa o saca una carta para empezar.</p>}
          </div></div>
        </div>
        {(card || token || imageMap) && <section className="panel stack table-inspector" aria-label="Pieza seleccionada">
          <div className="section-heading"><h3>{card?.definition.name ?? token?.label ?? imageMap?.name}</h3><button onClick={() => setSelected(null)}>Cerrar detalle</button></div>
          {imageMap && <><label>Ancho del mapa (px)<input type="range" min={140} max={Math.min(3200, 3200 * imageMap.width / imageMap.height)} value={imageMap.width} onChange={e => act(() => update(t => resizeImageMap(t, imageMap.id, Number(e.target.value))))} /></label><p className="fine">{Math.round(imageMap.width)} × {Math.round(imageMap.height)} px · Proporción original</p><div className="button-row"><button onClick={() => act(() => update(t => resizeImageMap(t, imageMap.id, imageMap.width * .8)))}>Reducir mapa</button><button onClick={() => act(() => update(t => resizeImageMap(t, imageMap.id, imageMap.width * 1.25)))}>Ampliar mapa</button></div></>}
          {token && <form className="stack" onSubmit={e => {
            e.preventDefault(); const name = String(new FormData(e.currentTarget).get("name")).trim();
            act(() => update(t => ({ ...t, tokens: t.tokens.map(p => p.id === token.id ? { ...p, label: name } : p) })));
          }}><label>Nombre de ficha<input key={`${token.id}-${token.label}`} name="name" defaultValue={token.label} maxLength={30} required /></label><button>Guardar nombre de ficha</button></form>}
          {card && <><p>{card.definition.description}</p>{card.definition.abilities.map((a, index) => <p key={index} className="fine">{a}</p>)}
            {card.definition.kind === "terrain" && card.definition.musicUrl && <div className="stack terrain-music"><h3>Música sugerida</h3><a href={card.definition.musicUrl} target="_blank" rel="noopener noreferrer">Abrir sugerencia musical ↗</a><p className="fine">{card.definition.musicUrl}</p></div>}
            {card.hp !== undefined && <label>Vida de la carta<input type="number" value={card.hp} min={0} max={card.definition.maxHp} onChange={e => act(() => update(t => setCardHp(t, card.id, e.target.valueAsNumber)))} /></label>}
            <label>Notas de la carta<textarea key={card.id} defaultValue={card.notes} maxLength={4000} rows={3} onBlur={e => act(() => update(t => ({ ...t, cards: t.cards.map(c => c.id === card.id ? { ...c, notes: e.target.value } : c) })))} /></label>
            {!!card.definition.instructions.length && <><p>{card.definition.instructions.map(i => `Saca ${i.count} de ${kindLabels[i.kind].toLowerCase()}`).join(" · ")}</p><button onClick={() => void executeInstructions(card.definition)}>Sacar cartas indicadas</button></>}
            <button onClick={() => act(() => { update(t => storeCard(t, card.id)); setSelected(null); })}>Guardar carta en inventario</button>
          </>}
          <button className="text-button danger" onClick={() => act(() => { update(t => ({ ...t, cards: t.cards.filter(c => c.id !== selected), tokens: t.tokens.filter(t => t.id !== selected), imageMaps: t.imageMaps.filter(m => m.id !== selected) })); setSelected(null); })}>Retirar de la mesa</button>
        </section>}
      </div>
    </div>
  </section>;
}


