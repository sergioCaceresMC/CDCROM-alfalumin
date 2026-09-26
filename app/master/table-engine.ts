import { z } from "zod";

const id = z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}$/);
const text = z.string().trim().min(1).max(4000);
export const cardKinds = ["terrain", "npc", "enemy", "story", "object"] as const;
export const kindLabels = { terrain: "Terrenos", npc: "Personajes", enemy: "Enemigos", story: "Narración", object: "Objetos" };
const imageUrl = z.string().url().refine(url => /^https?:\/\//.test(url));
const cardImage = z.union([imageUrl, z.string().regex(/^images\/[a-zA-Z0-9/_-]+\.(svg|png|webp|jpe?g)$/)]);
export const musicSchema = z.object({ id, name: text, url: imageUrl }).strict();
export const cardSchema = z.object({
  id, kind: z.enum(cardKinds), name: z.string().trim().min(1).max(80), description: text, image: cardImage.optional(),
  musicUrl: imageUrl.optional(),
  mission: z.enum(["main", "side"]).optional(),
  maxHp: z.number().int().min(1).max(999).optional(), armor: z.number().int().min(1).max(30).optional(),
  damage: z.enum(["1d2", "1d4", "2d4"]).optional(),
  abilities: z.array(text).max(30).default([]),
  instructions: z.array(z.object({ kind: z.enum(cardKinds), count: z.number().int().min(1).max(10) }).strict()).max(10).default([]),
}).strict().refine(c => c.kind !== "enemy" || c.maxHp !== undefined, "Falta vida del enemigo")
  .refine(c => !c.musicUrl || c.kind === "terrain", "La sugerencia musical pertenece a un terreno");
const legendSchema = z.object({ id, name: text, symbol: z.string().min(1).max(4), kind: z.enum(["structure", "enemy", "object"]), terrain: z.enum(["floor", "wall", "water", "grass", "path"]).optional() }).strict();
export const mapSchema = z.object({
  version: z.literal(1), id, name: text, description: text,
  width: z.number().int().min(1).max(60), height: z.number().int().min(1).max(60),
  legend: z.array(legendSchema).min(1).max(200),
  cells: z.array(id).min(1).max(3600),
  suggestions: z.array(z.object({ x: z.number().int().min(0), y: z.number().int().min(0), id }).strict()).max(500).default([]),
}).strict().superRefine((m, ctx) => {
  if (m.cells.length !== m.width * m.height || new Set(m.legend.map(l => l.id)).size !== m.legend.length ||
    m.cells.some(c => !m.legend.some(l => l.id === c && l.kind === "structure")) ||
    m.suggestions.some(s => s.x >= m.width || s.y >= m.height || !m.legend.some(l => l.id === s.id && l.kind !== "structure"))) {
    ctx.addIssue({ code: "custom", message: "Cuadrícula o referencias de mapa inválidas" });
  }
});
export const TILE_SIZE = 70;
export function tableSize(table: Table) {
  return { width: 2 * Math.max(2000, (table.map?.width ?? 0) * TILE_SIZE + 600), height: 2 * Math.max(2000, (table.map?.height ?? 0) * TILE_SIZE + 200) };
}
const position = z.number().min(0).max(10000);
export const imageMapSchema = z.object({
  id: z.string().min(1).max(100), name: z.string().trim().min(1).max(80),
  image: z.string().max(2_800_000).regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/),
  x: position, y: position, width: z.number().min(140).max(3200), height: z.number().min(14).max(3200),
}).strict().refine(m => m.width / m.height >= .1 && m.width / m.height <= 10, "Proporciones de mapa inválidas");
export const tableCardSchema = z.object({
  id: z.string().min(1).max(100), definition: cardSchema, x: position, y: position,
  hp: z.number().int().min(0).max(999).optional(), notes: z.string().max(4000).default(""),
}).strict().refine(c => c.definition.maxHp === undefined ? c.hp === undefined : c.hp !== undefined && c.hp <= c.definition.maxHp);
export const tableSchema = z.object({
  cards: z.array(tableCardSchema).max(100),
  storedCards: z.array(tableCardSchema).max(500).default([]),
  tokens: z.array(z.object({ id: z.string().min(1).max(100), label: z.string().trim().min(1).max(30), color: z.enum(["red", "green", "purple", "gold"]), x: position, y: position }).strict()).max(100),
  map: mapSchema.nullable(),
  imageMaps: z.array(imageMapSchema).max(5).default([]),
  music: musicSchema.nullable().default(null),
  decks: z.record(z.string(), z.array(id).max(10000)),
}).strict().refine(t => new Set([...t.cards, ...t.storedCards, ...t.tokens, ...t.imageMaps].map(c => c.id)).size === t.cards.length + t.storedCards.length + t.tokens.length + t.imageMaps.length);
export type CardKind = typeof cardKinds[number];
export type CardDefinition = z.infer<typeof cardSchema>;
export type MapDefinition = z.infer<typeof mapSchema>;
export type Table = z.infer<typeof tableSchema>;
export const emptyTable = (): Table => ({ cards: [], storedCards: [], tokens: [], imageMaps: [], map: null, music: null, decks: {} });
export function bringCardToFront(table: Table, id: string): Table {
  const card = table.cards.find(c => c.id === id);
  if (!card || table.cards.at(-1)?.id === id) return table;
  return tableSchema.parse({ ...table, cards: [...table.cards.filter(c => c.id !== id), card] });
}
export function storeCard(table: Table, id: string): Table {
  const card = table.cards.find(c => c.id === id);
  if (!card) throw new Error("Esta carta no está en la mesa.");
  return tableSchema.parse({ ...table, cards: table.cards.filter(c => c.id !== id), storedCards: [...table.storedCards, card] });
}
export function storeAllCards(table: Table): Table {
  if (table.storedCards.length + table.cards.length > 500) throw new Error("El inventario admite 500 cartas. Libera espacio antes de guardar toda la mesa.");
  return tableSchema.parse({ ...table, storedCards: [...table.storedCards, ...table.cards], cards: [] });
}
export function removeTableCards(table: Table): Table {
  return tableSchema.parse({ ...table, cards: [] });
}
export function resetTable(table: Table): Table {
  return tableSchema.parse({ ...emptyTable(), storedCards: table.storedCards });
}
export function restoreCard(table: Table, id: string): Table {
  const card = table.storedCards.find(c => c.id === id);
  if (!card) throw new Error("Esta carta no está en el inventario.");
  return tableSchema.parse({ ...table, storedCards: table.storedCards.filter(c => c.id !== id), cards: [...table.cards, card] });
}
export function placeCard(table: Table, definition: CardDefinition, instanceId: string): Table {
  if (table.cards.length >= 100) throw new Error("La mesa admite 100 cartas. Guarda alguna en el inventario antes de colocar otra.");
  const offset = table.cards.length % 8;
  const bounds = tableSize(table);
  return tableSchema.parse({ ...table, cards: [...table.cards, { id: instanceId, definition: structuredClone(definition),
    x: (table.map ? bounds.width / 2 : 440) + offset * 35, y: (table.map ? bounds.height / 2 : 40) + offset * 40, notes: "", ...(definition.maxHp ? { hp: definition.maxHp } : {}) }] });
}
export function drawCard(table: Table, kind: CardKind, catalog: CardDefinition[], instanceId: string, random = Math.random): Table {
  const candidates = catalog.filter(c => c.kind === kind);
  if (!candidates.length) throw new Error("Esta baraja no contiene cartas. Añade contenido al catálogo.");
  const index = Math.min(candidates.length - 1, Math.max(0, Math.floor(random() * candidates.length)));
  const definition = candidates[index];
  return placeCard(table, definition, instanceId);
}
export function movePiece(table: Table, id: string, x: number, y: number): Table {
  const bounds = tableSize(table);
  const location = { x: Math.max(0, Math.min(bounds.width - 250, x)), y: Math.max(0, Math.min(bounds.height - 250, y)) };
  return tableSchema.parse({ ...table, cards: table.cards.map(c => c.id === id ? { ...c, ...location } : c), tokens: table.tokens.map(t => t.id === id ? { ...t, ...location } : t),
    imageMaps: table.imageMaps.map(m => m.id === id ? { ...m, x: Math.max(0, Math.min(bounds.width - m.width, x)), y: Math.max(0, Math.min(bounds.height - m.height, y)) } : m) });
}
export function resizeImageMap(table: Table, id: string, width: number): Table {
  const bounds = tableSize(table);
  return tableSchema.parse({ ...table, imageMaps: table.imageMaps.map(m => {
    if (m.id !== id) return m;
    const ratio = m.width / m.height;
    const nextWidth = Math.max(140, Math.min(3200, 3200 * ratio, width));
    const height = nextWidth / ratio;
    return { ...m, width: nextWidth, height, x: Math.min(m.x, bounds.width - nextWidth), y: Math.min(m.y, bounds.height - height) };
  }) });
}
export function setCardHp(table: Table, id: string, hp: number): Table {
  if (!Number.isFinite(hp)) throw new Error("Introduce una vida válida.");
  return tableSchema.parse({ ...table, cards: table.cards.map(c => c.id === id && c.definition.maxHp ? { ...c, hp: Math.max(0, Math.min(c.definition.maxHp, Math.trunc(hp))) } : c) });
}
export function rollDie(sides: number, random = Math.random): number {
  if (![2, 4, 6, 8, 10, 12, 20, 100].includes(sides)) throw new Error("Dado no disponible.");
  return Math.min(sides, Math.max(1, Math.floor(random() * sides) + 1));
}
