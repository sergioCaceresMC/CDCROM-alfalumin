import { expect, it } from "vitest";
import { loadCards } from "./catalog";
import { cardSchema, emptyTable, executeCardInstructions, placeCard } from "./table-engine";
import { createCampaign, emptyMaster, exportMaster, importMaster } from "./engine";

it("carga 500 terrenos originales en 20 entornos sin sustituir los ejemplos", async () => {
  const all = await loadCards("terrain");
  const terrains = all.filter(card => card.id.startsWith("terrain-compendio-"));
  expect(terrains).toHaveLength(500);
  expect(new Set(terrains.map(card => card.name)).size).toBe(500);
  expect(all.some(card => card.id === "terrain-ruinas")).toBe(true);
  expect(all.some(card => card.id === "terrain-bosque")).toBe(true);
  const groups = new Map<string, number>();
  for (const card of terrains) {
    const group = card.id.replace(/-\d{2}$/, "");
    groups.set(group, (groups.get(group) ?? 0) + 1);
    expect(card.description.split(/\s+/).length).toBeGreaterThanOrEqual(120);
    expect(card.description.split(/\s+/).length).toBeLessThanOrEqual(260);
    expect(card.description.split("\n\n")).toHaveLength(3);
    expect(card.abilities.some(note => note.startsWith("Rumbo opcional:"))).toBe(true);
    expect(card.description).not.toContain("master");
    expect(new URL(card.musicUrl!).protocol).toBe("https:");
    expect(card.image).toMatch(/^https:\/\//);
    expect(card.imageCredit?.url).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
  }
  expect(groups.size).toBe(20);
  expect([...groups.values()].every(count => count === 25)).toBe(true);
});

it("resuelve las sugerencias a cartas existentes y mantiene los refugios sin enemigos indicados", async () => {
  const [terrains, npcs, enemies, objects] = await Promise.all([loadCards("terrain"), loadCards("npc"), loadCards("enemy"), loadCards("object")]);
  const catalogs = { terrain: terrains, npc: npcs, enemy: enemies, object: objects, story: await loadCards("story") };
  for (const terrain of terrains.filter(card => card.id.startsWith("terrain-compendio-"))) {
    for (const instruction of terrain.instructions) {
      expect(catalogs[instruction.kind].some(card => card.id === instruction.cardId)).toBe(true);
    }
    if (terrain.id.startsWith("terrain-compendio-refugios-")) expect(terrain.instructions.every(i => i.kind !== "enemy")).toBe(true);
  }
  const terrain = terrains.find(card => card.id === "terrain-compendio-cavernas-02")!;
  const table = executeCardInstructions(emptyTable(), terrain.instructions, [objects], () => "copy");
  expect(table.cards[0].definition.id).toBe(terrain.instructions[0].cardId);
  expect(table.cards[0].definition.item).toBeDefined();
});

it("rechaza sugerencias inexistentes sin crear cartas ni modificar la mesa", () => {
  const npc = cardSchema.parse({ id: "test-npc", kind: "npc", name: "Test", description: "Test" });
  const table = placeCard(emptyTable(), npc, "old");
  const original = structuredClone(table);
  let created = 0;
  expect(() => executeCardInstructions(table, [
    { kind: "npc", count: 1, cardId: npc.id },
    { kind: "npc", count: 1, cardId: "missing" },
  ], [[npc], [npc]], () => `new-${created++}`)).toThrow("missing");
  expect(created).toBe(0);
  expect(table).toEqual(original);
  const legacy = executeCardInstructions(table, [{ kind: "npc", count: 1 }], [[npc]], () => "legacy", () => 0);
  expect(legacy.cards).toHaveLength(2);
});

it("conserva las descripciones y referencias opcionales al exportar una campaña", async () => {
  const terrain = (await loadCards("terrain")).find(card => card.id === "terrain-compendio-pantanos-01")!;
  const campaign = { ...createCampaign("Compendio", "campaign"), table: placeCard(emptyTable(), terrain, "terrain") };
  const state = { ...emptyMaster(), campaigns: [campaign] };
  let sequence = 0;
  const copy = importMaster(emptyMaster(), exportMaster(state), () => `copy-${sequence++}`);
  expect(copy.campaigns[0].table.cards[0].definition).toEqual(terrain);
});
