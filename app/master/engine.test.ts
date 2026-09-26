import { expect, it } from "vitest";
import { loadCharacterCatalog, loadRules } from "../game/catalog";
import { finishDraft, generateDraft, toggleInitialSkill } from "../game/engine";
import { addEnemy, addParticipant, createCampaign, createEncounter, emptyMaster, exportMaster, importMaster, masterSchema, nextTurn, setCombatantHp, setInitiative, startEncounter } from "./engine";
import { loadCards, loadMaps } from "./catalog";
import { bringCardToFront, cardKinds, cardSchema, drawCard, emptyTable, mapSchema, movePiece, placeCard, removeTableCards, resetTable, resizeImageMap, restoreCard, rollDie, setCardHp, storeAllCards, storeCard, tableSchema } from "./table-engine";

it("valida los catálogos por categorías y conserva instrucciones estructuradas", async () => {
  const terrain = (await loadCards("terrain"))[0];
  expect(terrain.musicUrl).toMatch(/^https:\/\//);
  expect(() => cardSchema.parse({ ...terrain, musicUrl: "javascript:alert(1)" })).toThrow();
  expect(cardSchema.parse({ ...terrain, musicUrl: undefined }).musicUrl).toBeUndefined();
  expect(cardSchema.parse({ ...terrain, image: "images/cards/terrain.png" }).image).toBe("images/cards/terrain.png");
  expect(cardSchema.parse({ ...terrain, image: "https://example.com/terrain.jpg" }).image).toMatch(/^https:/);
  expect(() => cardSchema.parse({ ...terrain, image: "images/../../secret.png" })).toThrow();
  expect(() => cardSchema.parse({ ...terrain, image: "javascript:alert(1)" })).toThrow();
  for (const kind of cardKinds) {
    const cards = await loadCards(kind); expect(cards.length).toBeGreaterThan(0);
    expect(cards.every(c => c.kind === kind)).toBe(true);
  }
  const maps = await loadMaps(); expect(maps.length).toBeGreaterThan(0);
  expect(maps[0].cells).toHaveLength(maps[0].width * maps[0].height);
  expect(() => mapSchema.parse({ ...maps[0], cells: ["unknown"] })).toThrow();
  expect(() => mapSchema.parse({ ...maps[0], suggestions: [{ x: 99, y: 0, id: "enemy-esqueleto" }] })).toThrow();
});
it("saca cartas sin agotar el mazo y mantiene copias, posiciones y vida independientes", async () => {
  const cards = (await loadCards("enemy")).slice(0, 3); let t = emptyTable();
  for (let n = 0; n < cards.length; n++) t = drawCard(t, "enemy", cards, `c${n}`, () => n / cards.length);
  expect(new Set(t.cards.map(c => c.definition.id)).size).toBe(cards.length);
  const repeated = drawCard(t, "enemy", cards, "extra", () => 0);
  expect(repeated.cards.at(-1)?.definition.id).toBe(t.cards[0].definition.id);
  expect(repeated.cards.at(-1)?.id).not.toBe(t.cards[0].id);
  expect(() => drawCard(t, "enemy", [], "empty")).toThrow(/no contiene/);
  const copy = placeCard(t, cards[0], "copy");
  const moved = movePiece(copy, "copy", -50, 9000);
  expect(moved.cards.at(-1)).toMatchObject({ x: 0, y: 3750 });
  const hurt = setCardHp(moved, "copy", -5); expect(hurt.cards.at(-1)?.hp).toBe(0);
  expect(hurt.cards[0].hp).toBe(cards[0].maxHp);
  expect(setCardHp(hurt, "copy", 999).cards.at(-1)?.hp).toBe(cards[0].maxHp);
  expect(cards[0].maxHp).toBe(t.cards[0].hp);
});
it("ordena iniciativa, conserva empates, cuenta rondas y limita vida", () => {
  const campaign = createCampaign("Campaña", "campaign");
  let e = createEncounter(campaign, "Puente", "encounter", () => "unused");
  expect(() => startEncounter(e)).toThrow();
  e = addEnemy(e, { id: "a", name: "A", maxHp: 4, initiative: 5 });
  e = addEnemy(e, { id: "b", name: "B", maxHp: 7, initiative: 5 });
  e = addEnemy(e, { id: "c", name: "C", maxHp: 9, initiative: 10 });
  e = startEncounter(e); expect(e.activeId).toBe("c");
  expect(() => setInitiative(e, "a", 20)).toThrow();
  expect(() => addEnemy(e, { id: "d", name: "D", maxHp: 1, initiative: 0 })).toThrow();
  e = nextTurn(e); expect(e.activeId).toBe("a");
  e = nextTurn(e); expect(e.activeId).toBe("b");
  e = nextTurn(e); expect(e).toMatchObject({ activeId: "c", round: 2 });
  expect(setCombatantHp(e, "a", -10).combatants[0].hp).toBe(0);
  expect(setCombatantHp(e, "a", 999).combatants[0].hp).toBe(4);
});
it("exporta e importa sin sustituir campañas, remapea referencias y conserva snapshots", async () => {
  const source = await loadCharacterCatalog("mago"); const rules = await loadRules();
  let draft = generateDraft("Ada", "mago", 42, source, rules, "player");
  for (const id of draft.creationOptions.slice(0, 4)) draft = toggleInitialSkill(draft, id);
  const character = finishDraft(draft);
  let campaign = addParticipant(createCampaign("Aventura", "campaign"), character, "member");
  let counter = 0; const id = () => `new-${++counter}`;
  const encounter = startEncounter(createEncounter(campaign, "Encuentro", "encounter", id));
  campaign = { ...campaign, encounters: [encounter], table: placeCard(emptyTable(), (await loadCards("enemy"))[0], "card") };
  const original = masterSchema.parse({ version: 1, campaigns: [campaign] });
  const json = exportMaster(original); const imported = importMaster(original, json, id);
  expect(imported.campaigns).toHaveLength(2); expect(imported.campaigns[0]).toEqual(campaign);
  const copy = imported.campaigns[1]; expect(copy.id).not.toBe(campaign.id);
  expect(copy.encounters[0].combatants[0].memberId).toBe(copy.members[0].id);
  expect(copy.encounters[0].activeId).toBe(copy.encounters[0].combatants[0].id);
  expect(copy.table.cards[0].definition).toEqual(campaign.table.cards[0].definition);
  expect(copy.table.cards[0].id).not.toBe("card");
  expect(copy.members[0].character.catalog).toEqual(character.catalog);
  expect(() => importMaster(original, "broken", id)).toThrow();
  expect(() => importMaster(original, json.replace('"version": 1', '"version": 99'), id)).toThrow();
  expect(original.campaigns).toHaveLength(1);
  expect(importMaster(emptyMaster(), json, id).campaigns).toHaveLength(1);
});
it("lanza dados admitidos dentro de sus límites sin animación", () => {
  for (const sides of [2, 4, 6, 8, 10, 12, 20, 100]) {
    expect(rollDie(sides, () => 0)).toBe(1); expect(rollDie(sides, () => .99999)).toBe(sides);
  }
  expect(() => rollDie(3)).toThrow();
});
it("limpia o guarda las cartas en bloque sin perder el inventario ni sus estados", async () => {
  const definitions = await loadCards("enemy");
  let table = placeCard(placeCard(emptyTable(), definitions[0], "a"), definitions[1], "b");
  table = setCardHp(table, "a", 1);
  table.cards[0].notes = "Conservar esta nota";
  table.tokens = [{ id: "token", label: "Ficha", color: "red", x: 100, y: 100 }];
  table.map = (await loadMaps())[0];
  const stored = storeAllCards(table);
  expect(stored.cards).toHaveLength(0);
  expect(stored.storedCards).toEqual(table.cards);
  expect(stored.tokens).toEqual(table.tokens);
  const withCard = placeCard(stored, definitions[0], "new");
  const cleaned = removeTableCards(withCard);
  expect(cleaned.storedCards).toEqual(stored.storedCards);
  expect(cleaned.map).toEqual(table.map);
  const reset = resetTable(withCard);
  expect(reset.storedCards).toEqual(stored.storedCards);
  expect(reset.cards).toHaveLength(0); expect(reset.tokens).toHaveLength(0); expect(reset.map).toBeNull();
  const full = { ...table, storedCards: Array.from({ length: 500 }, (_, n) => ({ ...table.cards[0], id: `stored-${n}` })) };
  expect(() => storeAllCards(full)).toThrow(/500/);
  expect(full.cards).toHaveLength(2); expect(full.storedCards).toHaveLength(500);
});
it("escala y mueve mapas de imagen conservando proporciones y los exporta completos", () => {
  const map = { id: "map-image", name: "Mapa", image: "data:image/png;base64,AAAA", x: 100, y: 200, width: 800, height: 400 };
  const table = tableSchema.parse({ ...emptyTable(), imageMaps: [map] });
  const resized = resizeImageMap(table, map.id, 1600);
  expect(resized.imageMaps[0]).toMatchObject({ width: 1600, height: 800 });
  const moved = movePiece(resized, map.id, 9999, 9999);
  expect(moved.imageMaps[0]).toMatchObject({ x: 2400, y: 3200 });
  const campaign = { ...createCampaign("Imagen", "campaign"), table: moved };
  let n = 0;
  const copy = importMaster(emptyMaster(), exportMaster({ version: 1, campaigns: [campaign] }), () => `image-${++n}`).campaigns[0].table.imageMaps[0];
  expect(copy.image).toBe(map.image); expect(copy.width).toBe(1600); expect(copy.id).not.toBe(map.id);
  expect(() => tableSchema.parse({ ...table, imageMaps: [{ ...map, image: "data:text/html;base64,AAAA" }] })).toThrow();
  expect(tableSchema.parse({ ...emptyTable(), imageMaps: undefined }).imageMaps).toEqual([]);
});
it("lleva una carta al frente sin cambiar su contenido y conserva el orden al exportar", async () => {
  const cards = await loadCards("terrain");
  const table = placeCard(placeCard(emptyTable(), cards[0], "a"), cards[1], "b");
  const raised = bringCardToFront(table, "a");
  expect(raised.cards.map(c => c.id)).toEqual(["b", "a"]);
  expect(raised.cards[1]).toEqual(table.cards[0]);
  const campaign = { ...createCampaign("Orden", "campaign"), table: raised };
  let n = 0;
  const imported = importMaster(emptyMaster(), exportMaster({ version: 1, campaigns: [campaign] }), () => `copy-${++n}`);
  expect(imported.campaigns[0].table.cards.map(c => c.definition.id)).toEqual(raised.cards.map(c => c.definition.id));
});
it("conserva vida, notas y posiciones al guardar cartas y exportar el inventario", async () => {
  const definition = (await loadCards("enemy"))[0];
  let table = setCardHp(placeCard(emptyTable(), definition, "card"), "card", 1);
  table.cards[0].notes = "Reaparece al anochecer";
  const stored = storeCard(table, "card");
  expect(stored.cards).toHaveLength(0);
  const campaign = { ...createCampaign("Inventario", "campaign"), table: stored };
  let n = 0;
  const imported = importMaster(emptyMaster(), exportMaster({ version: 1, campaigns: [campaign] }), () => `id-${++n}`);
  const copy = imported.campaigns[0].table.storedCards[0];
  expect(copy).toMatchObject({ hp: 1, notes: "Reaparece al anochecer", definition });
  expect(copy.id).not.toBe("card");
  const restored = restoreCard(imported.campaigns[0].table, copy.id);
  expect(restored.storedCards).toHaveLength(0);
  expect(restored.cards[0]).toEqual(copy);
});
