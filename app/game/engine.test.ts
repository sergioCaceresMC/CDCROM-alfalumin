import { beforeAll, describe, expect, it } from "vitest";
import { loadCharacterCatalog, loadClasses, loadRules } from "./catalog";
import type { Catalog, Character, Rules } from "./schema";
import { catalogSchema, characterSchema } from "./schema";
import { addItem, addXp, armorClass, chooseLevelSkill, equipItem, finishDraft, generateDraft, maxHp, rename, setAttribute, setGender, setHp, setItemQuantity, toggleInitialSkill, toggleSkill, useItem } from "./engine";

let catalog: Catalog;
let rules: Rules;
beforeAll(async () => { catalog = await loadCharacterCatalog("guerrero"); rules = await loadRules(); });
export function readyCharacter(catalog: Catalog, rules: Rules, seed = 42): Character {
  let c = generateDraft("Éowyn del Río", catalog.classes[0].id, seed, catalog, rules, "original");
  for (const id of c.creationOptions.slice(0, 4)) c = toggleInitialSkill(c, id);
  return characterSchema.parse({ ...finishDraft(c), catalog: { ...c.catalog, items: catalog.items } });
}
describe("catálogos y generación", () => {
  it("guarda apariencia sin modificar estadísticas y aumenta las bases de vida en tres", async () => {
    expect((await loadClasses()).map(c => [c.id, c.baseHp])).toEqual(expect.arrayContaining([["explorador", 8], ["guerrero", 9], ["mistico", 7]]));
    const male = generateDraft("A", "guerrero", 42, catalog, rules, "a", "m");
    const female = generateDraft("A", "guerrero", 42, catalog, rules, "a", "f");
    expect(female.gender).toBe("f"); expect(male.attributes).toEqual(female.attributes);
    expect(male.inventory).toEqual(female.inventory); expect(male.creationOptions).toEqual(female.creationOptions);
    expect(setGender(female, "m")).toEqual(male);
  });
  it("no duplica un catálogo de miles de objetos dentro de cada ficha", () => {
    const extras = Array.from({ length: 2000 }, (_, n) => ({ id: `extra-${n}`, name: `Objeto ${n}`, description: "Objeto de prueba", kind: "misc" as const, usable: false, consumable: false }));
    const draft = generateDraft("A", "guerrero", 42, { ...catalog, items: [...catalog.items, ...extras] }, rules, "a");
    expect(draft.catalog.items.length).toBeLessThan(10);
    const updated = addItem(draft, extras[0]);
    expect(updated.inventory.find(e => e.itemId === "extra-0")?.quantity).toBe(1);
    expect(updated.catalog.items.find(i => i.id === "extra-0")).toEqual(extras[0]);
    const changedDefinition = { ...extras[0], description: "Una nueva definición externa" };
    expect(addItem(updated, changedDefinition).catalog.items.find(i => i.id === "extra-0")?.description).toBe("Objeto de prueba");
  });
  it("genera todas las clases con equipo válido y habilidades suficientes para nivel 3", async () => {
    expect((await loadClasses()).map(c => c.id)).toEqual(expect.arrayContaining(["mago", "guerrero", "druida", "paladin", "picaro", "brujo", "artificiero"]));
    for (const cls of await loadClasses()) {
      const source = await loadCharacterCatalog(cls.id);
      for (let seed = 0; seed < 25; seed++) {
        let c = readyCharacter(source, rules, seed);
        expect(Object.values(c.attributes).sort()).toEqual([0, 0, 1, 1, 1, 2, 2, 3]);
        expect(c.hp).toBe(cls.baseHp + c.attributes.constitucion);
        expect(c.creationOptions).toHaveLength(6);
        c = addXp(c, 25);
        c = chooseLevelSkill(c, c.pending!.options[0]);
        c = chooseLevelSkill(c, c.pending!.options[0]);
        expect(c.level).toBe(3); expect(c.skillIds).toHaveLength(6);
      }
    }
  });
  it("la misma semilla es independiente del orden del catálogo y del identificador local", () => {
    const a = generateDraft("A", "guerrero", 123, catalog, rules, "a");
    const b = generateDraft("B", "guerrero", 123, { ...catalog, skills: [...catalog.skills].reverse(), items: [...catalog.items].reverse() }, rules, "b");
    expect(a.attributes).toEqual(b.attributes); expect(a.inventory).toEqual(b.inventory); expect(a.creationOptions).toEqual(b.creationOptions);
    expect(generateDraft("A", "guerrero", 123, catalog, rules, "a")).toEqual(a);
  });
  it("exige cuatro habilidades, rechaza duplicados y clases sin seis opciones", () => {
    const draft = generateDraft("A", "guerrero", 0, catalog, rules, "a");
    expect(() => finishDraft(draft)).toThrow();
    expect(() => toggleInitialSkill(draft, "desconocida")).toThrow();
    let c = draft;
    for (const id of c.creationOptions.slice(0, 4)) c = toggleInitialSkill(c, id);
    expect(() => toggleInitialSkill(c, c.creationOptions[4])).toThrow();
    expect(() => generateDraft("A", "guerrero", 0, { ...catalog, skills: catalog.skills.filter(s => s.level > 1) }, rules, "a")).toThrow("seis");
    expect(() => catalogSchema.parse({ ...catalog, items: [] })).toThrow();
    expect(() => catalogSchema.parse({ ...catalog, skills: [...catalog.skills, catalog.skills[0]] })).toThrow();
  });
});
describe("ficha e inventario", () => {
  it("limita vida y atributos y recalcula constitución sin curación implícita", () => {
    const c = readyCharacter(catalog, rules);
    expect(setHp(c, -50).hp).toBe(0); expect(setHp(c, 999).hp).toBe(maxHp(c));
    let changed = setAttribute(c, "constitucion", 99);
    expect(changed.attributes.constitucion).toBe(3); expect(changed.hp).toBe(c.hp);
    changed = setHp(changed, 99); changed = setAttribute(changed, "constitucion", -3);
    expect(changed.attributes.constitucion).toBe(0); expect(changed.hp).toBe(catalog.classes[0].baseHp);
    expect(() => setHp(c, NaN)).toThrow(); expect(() => rename(c, " ")).toThrow();
  });
  it("mantiene una armadura por ranura y retira el equipo al quitar el objeto", () => {
    let c = readyCharacter(catalog, rules);
    expect(armorClass(c)).toBe(14);
    c = equipItem(setItemQuantity(c, "cuero", 1), "cuero");
    expect(armorClass(c)).toBe(12); expect(c.inventory.filter(e => e.equipped)).toHaveLength(2);
    c = setItemQuantity(c, "cuero", 0); expect(armorClass(c)).toBe(10);
    expect(() => equipItem(c, "cuero")).toThrow(); expect(() => equipItem(setItemQuantity(c, "pocion", 1), "pocion")).toThrow();
  });
  it("consume una unidad y aplica únicamente efectos declarados", () => {
    let c = setItemQuantity(setHp(readyCharacter(catalog, rules), 0), "pocion", 2);
    c = useItem(c, "pocion"); expect(c.hp).toBe(2); expect(c.inventory.find(e => e.itemId === "pocion")?.quantity).toBe(1);
    c = useItem(c, "pocion"); expect(c.inventory.some(e => e.itemId === "pocion")).toBe(false);
    expect(() => useItem(c, "pocion")).toThrow();
    c = setItemQuantity(c, "antorcha", 1); const hp = c.hp; c = useItem(c, "antorcha"); expect(c.hp).toBe(hp);
    c = setItemQuantity(c, "cuerda", 1); c = useItem(c, "cuerda"); expect(c.inventory.find(e => e.itemId === "cuerda")?.quantity).toBe(1);
  });
});
describe("experiencia y habilidades", () => {
  it("resuelve umbrales en orden, conserva ofertas y no aumenta vida por nivel", () => {
    let c = readyCharacter(catalog, rules); const hp = maxHp(c);
    c = addXp(c, 9); expect(c.pending).toBeNull();
    c = addXp(c, 30); expect(c.level).toBe(1); expect(c.pending!.level).toBe(2);
    const options = [...c.pending!.options]; c = addXp(c, 1); expect(c.pending!.options).toEqual(options);
    expect(characterSchema.parse(JSON.parse(JSON.stringify(c))).pending).toEqual(c.pending);
    expect(() => chooseLevelSkill(c, c.skillIds[0])).toThrow();
    expect(() => toggleSkill(c, c.skillIds[0])).toThrow();
    c = chooseLevelSkill(c, options[0]); expect(c.level).toBe(2); expect(c.pending!.level).toBe(3);
    c = chooseLevelSkill(c, c.pending!.options[0]); expect(c.level).toBe(3); expect(c.pending).toBeNull();
    expect(maxHp(c)).toBe(hp); expect(addXp(c, 100).xp).toBe(140);
    expect(() => addXp(c, -1)).toThrow(); expect(() => addXp(c, 1.5)).toThrow();
  });
  it("ofrece menos opciones cuando faltan y bloquea si no queda ninguna", () => {
    let c = readyCharacter(catalog, rules);
    c = { ...c, catalog: { ...c.catalog, skills: c.catalog.skills.filter(s => c.creationOptions.includes(s.id)) } };
    const remaining = c.creationOptions.filter(id => !c.skillIds.includes(id));
    c = toggleSkill(c, remaining[0]); c = addXp(c, 10);
    expect(c.pending!.options).toEqual([remaining[1]]);
    c = chooseLevelSkill(c, remaining[1]); c = addXp(c, 15);
    expect(c.pending).toEqual({ level: 3, options: [] });
    expect(() => chooseLevelSkill(c, "inexistente")).toThrow();
  });
  it("la edición manual respeta nivel, clase y ausencia de duplicados", () => {
    let c = readyCharacter(catalog, rules);
    expect(() => toggleSkill(c, catalog.skills.find(s => s.level === 2)!.id)).toThrow();
    expect(() => toggleSkill(c, "mistico-chispa")).toThrow();
    const id = c.skillIds[0]; c = toggleSkill(c, id); expect(c.skillIds).not.toContain(id);
    c = toggleSkill(c, id); expect(c.skillIds.filter(x => x === id)).toHaveLength(1);
  });
});
