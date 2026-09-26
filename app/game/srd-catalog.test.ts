import { expect, it } from "vitest";
import { loadCharacterCatalog, loadItems, loadRules } from "./catalog";
import { addItem, finishDraft, generateDraft, toggleInitialSkill, useItem } from "./engine";
import { decodeCharacter, encodeCharacter, exportCharacter, parseTransfer } from "./transfer";
import { loadCards } from "../master/catalog";
import { emptyTable, placeCard } from "../master/table-engine";
import { createCampaign, emptyMaster, exportMaster, importMaster } from "../master/engine";

it("carga el bestiario y equipo ampliados con referencias y valores jugables", async () => {
  const items = (await loadItems()).filter(item => item.id.startsWith("srd-"));
  expect(items).toHaveLength(414);
  expect(items.every(item => item.source?.document === "SRD 5.2.1")).toBe(true);
  const monsters = (await loadCards("enemy")).filter(card => card.id.startsWith("srd-"));
  expect(monsters).toHaveLength(330);
  expect(monsters.some(card => card.name === "Triceratops")).toBe(true);
  expect(monsters.every(card => card.maxHp! >= 2 && card.maxHp! <= 60 && card.armor! >= 10 && card.armor! <= 18)).toBe(true);
  const npcs = (await loadCards("npc")).filter(card => card.id.startsWith("srd-"));
  expect(npcs).toHaveLength(26);
  expect(npcs.every(card => card.kind === "npc" && card.source?.text)).toBe(true);
});

it("conserva referencias de habilidades y objetos en archivos y códigos", async () => {
  const catalog = await loadCharacterCatalog("mago");
  expect(catalog.skills.some(skill => skill.source?.name === "Abrir" && skill.level === 3)).toBe(true);
  expect(catalog.skills.some(skill => skill.source?.name === "Acelerar")).toBe(false);
  let character = generateDraft("Prueba SRD", "mago", 2024, catalog, await loadRules(), "srd-character");
  for (const id of character.creationOptions.slice(0, 4)) character = toggleInitialSkill(character, id);
  character = finishDraft(character);
  const potion = catalog.items.find(item => item.id === "srd-pocion-de-curacion")!;
  character = addItem(character, potion);
  character = useItem(character, potion.id);
  expect(character.catalog.items.find(item => item.id === potion.id)?.source).toEqual(potion.source);
  expect(parseTransfer(exportCharacter(character)).data).toEqual(character);
  expect((await decodeCharacter(await encodeCharacter(character))).data).toEqual(character);
});

it("transporta el perfil original del enemigo dentro de la copia del master", async () => {
  const monster = (await loadCards("enemy")).find(card => card.id === "srd-enemy-aboleth")!;
  const campaign = { ...createCampaign("SRD", "campaign"), table: placeCard(emptyTable(), monster, "monster") };
  const state = { ...emptyMaster(), campaigns: [campaign] };
  let sequence = 0;
  const copy = importMaster(emptyMaster(), exportMaster(state), () => `new-${sequence++}`);
  expect(copy.campaigns[0].table.cards[0].definition.source).toEqual(monster.source);
});

it("ofrece todo el equipo como cartas de objeto y conserva sus propiedades al exportar", async () => {
  const items = await loadItems();
  const cards = await loadCards("object");
  expect(cards.filter(card => card.item)).toHaveLength(items.length);
  expect(new Set(cards.filter(card => card.item).map(card => card.item!.kind))).toEqual(new Set(["weapon", "armor", "consumable", "misc"]));
  expect(cards.some(card => card.id === "object-brujula" && !card.item)).toBe(true);
  for (const item of items) expect(cards.find(card => card.id === item.id)?.item).toEqual(item);
  const weapon = cards.find(card => card.item?.id === "srd-espada-larga")!;
  expect(weapon.item?.damage).toBe("1d6");
  const campaign = { ...createCampaign("Equipo", "campaign"), table: placeCard(emptyTable(), weapon, "weapon") };
  let sequence = 0;
  const copy = importMaster(emptyMaster(), exportMaster({ ...emptyMaster(), campaigns: [campaign] }), () => `copy-${sequence++}`);
  expect(copy.campaigns[0].table.cards[0].definition.item).toEqual(weapon.item);
});

it("incluye una imagen remota en cada enemigo y PNJ y conserva los créditos al guardar", async () => {
  const cards = [...await loadCards("enemy"), ...await loadCards("npc")];
  expect(cards).toHaveLength(361);
  expect(cards.every(card => /^https:\/\//.test(card.image ?? "") && !card.image?.includes("NYI"))).toBe(true);
  const illustrated = cards.find(card => card.name === "Alosaurio")!;
  expect(illustrated.imageCredit?.text).toContain("CC BY");
  const campaign = { ...createCampaign("Ilustraciones", "campaign"), table: placeCard(emptyTable(), illustrated, "card") };
  let sequence = 0;
  const copy = importMaster(emptyMaster(), exportMaster({ ...emptyMaster(), campaigns: [campaign] }), () => `copy-${sequence++}`);
  expect(copy.campaigns[0].table.cards[0].definition.image).toBe(illustrated.image);
  expect(copy.campaigns[0].table.cards[0].definition.imageCredit).toEqual(illustrated.imageCredit);
});
