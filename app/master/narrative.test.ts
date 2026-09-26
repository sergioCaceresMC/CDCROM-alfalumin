import { expect, it } from "vitest";
import { loadCards } from "./catalog";
import { canDrawNarrative, cardSchema, drawCard, drawNarrative, emptyTable, executeCardInstructions, placeNarrative, resetTable, restoreCard, startNarrative, storeCard, tableSchema } from "./table-engine";
import { createCampaign, emptyMaster, exportMaster, importMaster } from "./engine";

it("carga 200 cartas de cada tipo y resuelve el objetivo secundario de cada final", async () => {
  const stories = await loadCards("story");
  const compendium = stories.filter(card => card.id.startsWith("story-compendio-"));
  expect(compendium).toHaveLength(600);
  expect(new Set(compendium.map(card => card.name)).size).toBe(600);
  for (const mission of ["main", "side", "final"]) expect(compendium.filter(card => card.mission === mission)).toHaveLength(200);
  expect(stories.some(card => card.id === "story-gato")).toBe(true);
  for (const card of compendium) {
    expect(card.description.split("\n\n")).toHaveLength(3);
    expect(card.description.split(/\s+/).length).toBeGreaterThan(80);
    if (card.mission === "final") {
      const objective = stories.find(other => other.id === card.instructions[0].cardId);
      expect(objective?.mission).toBe("side");
      expect(card.description).toContain(objective!.name);
    }
  }
});

it("guarda los cuatro posibles d4 y habilita exactamente un final después de las cartas requeridas", async () => {
  const stories = await loadCards("story");
  for (let target = 1; target <= 4; target++) {
    let table = startNarrative(emptyTable(), () => (target - 1) / 4);
    expect(table.narrative.target).toBe(target);
    expect(() => drawNarrative(table, "final", stories, "premature", () => 0)).toThrow();
    for (let i = 0; i < target; i++) table = drawNarrative(table, i % 2 ? "side" : "main", stories, `event-${i}`, () => 0);
    expect(canDrawNarrative(table, "final")).toBe(true);
    expect(canDrawNarrative(table, "main")).toBe(false);
    table = drawNarrative(table, "final", stories, "ending", () => 0);
    expect(table.narrative.finale?.mission).toBe("final");
    expect(canDrawNarrative(table, "final")).toBe(false);
    expect(() => drawNarrative(table, "final", stories, "second-ending", () => 0)).toThrow();
  }
});

it("conserva el arco al guardar, recolocar, limpiar e importar y no cuenta las cartas de apoyo", async () => {
  const stories = await loadCards("story");
  let table = startNarrative(emptyTable(), () => 0);
  table = drawNarrative(table, "main", stories, "event", () => 0);
  table = storeCard(table, "event");
  table = restoreCard(table, "event");
  table = drawNarrative(table, "final", stories, "final", () => 0);
  const progress = structuredClone(table.narrative);
  table = executeCardInstructions(table, table.narrative.finale!.instructions, [stories], () => "objective");
  expect(table.narrative).toEqual(progress);
  expect(table.cards.at(-1)?.definition.mission).toBe("side");
  table = resetTable(table);
  expect(table.narrative).toEqual(progress);
  const campaign = { ...createCampaign("Arco", "campaign"), table };
  let n = 0;
  const copy = importMaster(emptyMaster(), exportMaster({ version: 1, campaigns: [campaign] }), () => `copy-${n++}`);
  expect(copy.campaigns[0].table.narrative).toEqual(progress);
  const next = startNarrative(table, () => .75);
  expect(next.narrative).toEqual({ target: 4, cards: [], finale: null });
});

it("migra mesas antiguas y rechaza progreso corrupto, tiradas inválidas y finales de apoyo", () => {
  const { narrative: _narrative, ...oldTable } = emptyTable();
  expect(tableSchema.parse(oldTable).narrative).toEqual({ target: null, cards: [], finale: null });
  expect(() => startNarrative(emptyTable(), () => NaN)).toThrow();
  expect(() => startNarrative(emptyTable(), () => 1)).toThrow();
  const final = cardSchema.parse({ id: "test-final", kind: "story", mission: "final", name: "Final", description: "Final" });
  const main = cardSchema.parse({ id: "test-main", kind: "story", mission: "main", name: "Inicio", description: "Inicio" });
  expect(() => tableSchema.parse({ ...emptyTable(), narrative: { target: 2, cards: [main], finale: final } })).toThrow();
  expect(() => placeNarrative(emptyTable(), final, "bad")).toThrow();
  expect(() => executeCardInstructions(emptyTable(), [{ kind: "story", count: 1, cardId: final.id }], [[final]], () => "bad")).toThrow();
  expect(drawCard(emptyTable(), "story", [main, final], "support", () => .99).cards[0].definition.id).toBe(main.id);
});
