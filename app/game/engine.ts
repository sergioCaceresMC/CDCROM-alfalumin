import { attributeNames, characterSchema, catalogSchema, genderSchema, itemSchema, rulesSchema } from "./schema";
import type { Attribute, Catalog, Character, Gender, Item, Rules } from "./schema";
import { random, shuffle } from "./random";

export const maxHp = (c: Character) => c.catalog.classes[0].baseHp + c.attributes.constitucion;
export const armorClass = (c: Character) => {
  const armor = c.inventory.find(e => e.equipped && c.catalog.items.find(i => i.id === e.itemId)?.kind === "armor");
  return armor ? c.catalog.items.find(i => i.id === armor.itemId)!.armor! : 10;
};
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, Math.trunc(n)));
const valid = (c: Character) => characterSchema.parse(c);
export function generateDraft(name: string, classId: string, seed: number, catalog: Catalog, rules: Rules, id: string, gender: Gender = "m"): Character {
  catalog = catalogSchema.parse(catalog);
  rules = rulesSchema.parse(rules);
  const cls = catalog.classes.find(c => c.id === classId);
  if (!cls) throw new Error("Clase desconocida");
  const next = random(seed);
  const values = shuffle([3, 2, 2, 1, 1, 1, 0, 0], next);
  const attributes = Object.fromEntries(attributeNames.map((key, i) => [key, values[i]])) as Character["attributes"];
  const pick = (pool: string[]) => [...pool].sort()[Math.floor(next() * pool.length)];
  const inventory = [
    { itemId: pick(cls.starterPools.weapon), quantity: 1, equipped: true },
    { itemId: pick(cls.starterPools.armor), quantity: 1, equipped: true },
    { itemId: pick(cls.starterPools.supply), quantity: 1 + Math.floor(next() * 3), equipped: false },
  ];
  const creationOptions = shuffle(catalog.skills.filter(s => s.classId === classId && s.level === 1).map(s => s.id).sort(), next).slice(0, 6);
  if (creationOptions.length !== 6) throw new Error("Esta clase necesita al menos seis habilidades de nivel 1");
  return valid({ version: 1, generatorVersion: 1, id, name, seed, classId, gender, status: "draft", attributes,
    hp: cls.baseHp + attributes.constitucion, level: 1, xp: 0, creationOptions, creationChoices: [], skillIds: [],
    inventory, pending: null, rules: structuredClone(rules),
    catalog: structuredClone({ ...catalog, classes: [cls], skills: catalog.skills.filter(s => s.classId === classId),
      items: catalog.items.filter(item => Object.values(cls.starterPools).flat().includes(item.id)),
    }),
  });
}

export function toggleInitialSkill(c: Character, skillId: string): Character {
  if (c.status !== "draft" || !c.creationOptions.includes(skillId)) throw new Error("Elección inicial inválida");
  const choices = c.creationChoices.includes(skillId) ? c.creationChoices.filter(x => x !== skillId) : [...c.creationChoices, skillId];
  return valid({ ...c, creationChoices: choices });
}
export function finishDraft(c: Character): Character {
  if (c.status !== "draft" || c.creationChoices.length !== 4) throw new Error("Selecciona exactamente cuatro habilidades");
  return valid({ ...c, status: "ready", skillIds: [...c.creationChoices] });
}

function scheduleLevel(c: Character): Character {
  if (c.pending || c.level >= c.rules.maxLevel || c.xp < c.rules.xpThresholds[c.level]) return c;
  const level = c.level + 1;
  const candidates = c.catalog.skills.filter(s => s.classId === c.classId && s.level <= level && !c.skillIds.includes(s.id));
  const options = shuffle(candidates.map(s => s.id).sort(), random((c.seed ^ Math.imul(level, 2654435761)) >>> 0)).slice(0, 3);
  return { ...c, pending: { level, options } };
}
export function addXp(c: Character, amount: number): Character {
  if (c.status !== "ready" || !Number.isSafeInteger(amount) || amount < 0) throw new Error("Introduce una cantidad positiva de XP");
  return valid(scheduleLevel({ ...c, xp: c.xp + amount }));
}
export function chooseLevelSkill(c: Character, skillId: string): Character {
  if (!c.pending?.options.includes(skillId)) throw new Error("Elige una de las habilidades ofrecidas");
  return valid(scheduleLevel({ ...c, level: c.pending.level, skillIds: [...c.skillIds, skillId], pending: null }));
}
export function setHp(c: Character, hp: number): Character {
  return valid({ ...c, hp: clamp(hp, 0, maxHp(c)) });
}
export function setAttribute(c: Character, key: Attribute, value: number): Character {
  const updated = { ...c, attributes: { ...c.attributes, [key]: clamp(value, 0, 3) } };
  return valid({ ...updated, hp: Math.min(updated.hp, maxHp(updated)) });
}
export function rename(c: Character, name: string): Character { return valid({ ...c, name }); }
export function setGender(c: Character, gender: Gender): Character { return valid({ ...c, gender: genderSchema.parse(gender) }); }

export function setItemQuantity(c: Character, itemId: string, quantity: number): Character {
  if (!c.catalog.items.some(i => i.id === itemId) || !Number.isInteger(quantity) || quantity < 0 || quantity > 9999) throw new Error("Cantidad de objeto inválida");
  const entry = c.inventory.find(e => e.itemId === itemId);
  const inventory = c.inventory.filter(e => e.itemId !== itemId);
  if (quantity) inventory.push({ itemId, quantity, equipped: entry?.equipped ?? false });
  return valid({ ...c, inventory });
}
export function addItem(c: Character, definition: Item): Character {
  const item = itemSchema.parse(definition);
  const catalog = c.catalog.items.some(i => i.id === item.id) ? c.catalog : { ...c.catalog, items: [...c.catalog.items, item] };
  const quantity = (c.inventory.find(entry => entry.itemId === item.id)?.quantity ?? 0) + 1;
  return setItemQuantity({ ...c, catalog }, item.id, quantity);
}
export function equipItem(c: Character, itemId: string): Character {
  const item = c.catalog.items.find(i => i.id === itemId);
  const entry = c.inventory.find(e => e.itemId === itemId);
  if (!item || !entry || !["weapon", "armor"].includes(item.kind)) throw new Error("No puedes equipar este objeto");
  return valid({ ...c, inventory: c.inventory.map(e => {
    if (e.itemId === itemId) return { ...e, equipped: !entry.equipped };
    if (c.catalog.items.find(i => i.id === e.itemId)?.kind === item.kind) return { ...e, equipped: false };
    return e;
  }) });
}
export function useItem(c: Character, itemId: string): Character {
  const item = c.catalog.items.find(i => i.id === itemId);
  const entry = c.inventory.find(e => e.itemId === itemId);
  if (!item?.usable || !entry) throw new Error("No puedes usar este objeto");
  const updated = item.effect?.type === "heal" ? setHp(c, c.hp + item.effect.amount) : c;
  return item.consumable ? setItemQuantity(updated, itemId, entry.quantity - 1) : valid(updated);
}
export function toggleSkill(c: Character, skillId: string): Character {
  if (c.pending) throw new Error("Resuelve la subida de nivel antes de editar habilidades");
  const skill = c.catalog.skills.find(s => s.id === skillId);
  if (!skill || skill.classId !== c.classId || skill.level > c.level) throw new Error("Habilidad no disponible");
  return valid({ ...c, skillIds: c.skillIds.includes(skillId) ? c.skillIds.filter(x => x !== skillId) : [...c.skillIds, skillId] });
}
