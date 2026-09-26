import { z } from "zod";
import { cardSchema, mapSchema } from "./table-engine";
import type { CardDefinition, CardKind, MapDefinition } from "./table-engine";

const modules = import.meta.glob("../data/master/**/*.json", { import: "default" });
const cache = new Map<string, Promise<unknown[]>>();
function loadCategory(category: string): Promise<unknown[]> {
  const cached = cache.get(category);
  if (cached) return cached;
  const promise = Promise.all(Object.entries(modules).filter(([path]) => path.includes(`/master/${category}/`))
    .sort(([a], [b]) => a.localeCompare(b)).map(async ([, load]) => z.object({ version: z.literal(1), entries: z.array(z.unknown()) }).strict().parse(await load()).entries))
    .then(entries => entries.flat()).catch(e => { cache.delete(category); throw e; });
  cache.set(category, promise); return promise;
}
export async function loadCards(kind: CardKind): Promise<CardDefinition[]> {
  const cards = z.array(cardSchema).max(10000).parse(await loadCategory(kind));
  if (cards.some(c => c.kind !== kind) || new Set(cards.map(c => c.id)).size !== cards.length) throw new Error("Categoría o identificadores de cartas inválidos.");
  return cards;
}
export async function loadMaps(): Promise<MapDefinition[]> {
  const maps = z.array(mapSchema).max(1000).parse(await loadCategory("maps"));
  if (new Set(maps.map(m => m.id)).size !== maps.length) throw new Error("Mapas duplicados.");
  return maps;
}

