import { z } from "zod";

export const attributeNames = ["golpes", "tiros", "constitucion", "percepcion", "inteligencia", "valor", "empatia", "carisma"] as const;
export const attributeLabels: Record<Attribute, string> = {
  golpes: "Golpes", tiros: "Tiros", constitucion: "Constitución", percepcion: "Percepción",
  inteligencia: "Inteligencia", valor: "Valor", empatia: "Empatía", carisma: "Carisma",
};
export type Attribute = typeof attributeNames[number];
export const genderSchema = z.enum(["m", "f"]).default("m");
export type Gender = z.infer<typeof genderSchema>;
const id = z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}$/);
const text = z.string().trim().min(1).max(2000);
const integer = z.number().int().min(0).max(1_000_000_000);
const unique = (values: string[]) => new Set(values).size === values.length;
const ids = z.array(id).max(500).refine(unique, "Identificadores repetidos");

export const rulesSchema = z.object({
  version: z.literal(1), maxLevel: z.number().int().min(1).max(20),
  xpThresholds: z.array(integer).min(1).max(20),
}).strict().refine(r => r.xpThresholds.length === r.maxLevel && r.xpThresholds[0] === 0 &&
  r.xpThresholds.every((n, i) => i === 0 || n > r.xpThresholds[i - 1]), "Umbrales de experiencia inválidos");

export const classSchema = z.object({
  id, name: text, description: text, image: z.string().regex(/^images\/[a-z0-9-]+\.(svg|png|webp|jpe?g)$/),
  baseHp: z.number().int().min(1).max(100),
  starterPools: z.object({ weapon: ids.min(1), armor: ids.min(1), supply: ids.min(1) }).strict(),
}).strict();

export const skillSchema = z.object({
  id, name: text, description: text, classId: id, level: z.number().int().min(1).max(20),
  attribute: z.enum(attributeNames).optional(), damage: z.enum(["1d4", "1d6"]).optional(),
}).strict();

export const itemSchema = z.object({
  id, name: text, description: text, kind: z.enum(["weapon", "armor", "consumable", "misc"]),
  usable: z.boolean(), consumable: z.boolean(), damage: z.enum(["1d4", "1d6"]).optional(),
  armor: z.number().int().min(1).max(30).optional(),
  effect: z.object({ type: z.literal("heal"), amount: z.number().int().min(1).max(100) }).strict().optional(),
}).strict().refine(i => (i.kind !== "armor" || i.armor !== undefined) &&
  (!i.consumable || i.usable) && (!i.effect || i.usable), "Propiedades de objeto incompatibles");

export const catalogSchema = z.object({
  version: z.literal(1), classes: z.array(classSchema).min(1).max(100),
  skills: z.array(skillSchema).max(500), items: z.array(itemSchema).max(20000),
}).strict().superRefine((c, ctx) => {
  const fail = (message: string) => ctx.addIssue({ code: "custom", message });
  for (const list of [c.classes, c.skills, c.items]) if (!unique(list.map(x => x.id))) fail("Identificadores duplicados en el catálogo");
  for (const s of c.skills) if (!c.classes.some(x => x.id === s.classId)) fail(`Clase desconocida: ${s.classId}`);
  for (const cls of c.classes) {
    for (const [pool, itemIds] of Object.entries(cls.starterPools)) {
      for (const itemId of itemIds) {
        const item = c.items.find(x => x.id === itemId);
        if (!item || (pool !== "supply" && item.kind !== pool) ||
          (pool === "supply" && !["misc", "consumable"].includes(item.kind))) fail(`Equipo inicial inválido: ${itemId}`);
      }
    }
  }
});

const attributesSchema = z.object(Object.fromEntries(attributeNames.map(a => [a, z.number().int().min(0).max(3)])) as Record<Attribute, z.ZodNumber>).strict();
export const characterSchema = z.object({
  version: z.literal(1), generatorVersion: z.literal(1), id: z.string().min(1).max(100),
  name: z.string().trim().min(1).max(60), seed: z.number().int().min(0).max(4294967295),
  classId: id, gender: genderSchema, status: z.enum(["draft", "ready"]), attributes: attributesSchema,
  hp: z.number().int().min(0).max(103), level: z.number().int().min(1).max(20), xp: integer,
  creationOptions: ids.length(6), creationChoices: ids.max(4), skillIds: ids,
  inventory: z.array(z.object({ itemId: id, quantity: z.number().int().min(1).max(9999), equipped: z.boolean() }).strict()).max(500),
  pending: z.object({ level: z.number().int().min(2).max(20), options: ids.max(3) }).strict().nullable(),
  catalog: catalogSchema, rules: rulesSchema,
}).strict().superRefine((c, ctx) => {
  const fail = (message: string) => ctx.addIssue({ code: "custom", message });
  const cls = c.catalog.classes.find(x => x.id === c.classId);
  if (!cls || c.catalog.classes.length !== 1) fail("Clase de personaje inválida");
  if (cls && c.hp > cls.baseHp + c.attributes.constitucion) fail("Vida superior al máximo");
  if (c.level > c.rules.maxLevel || c.xp < c.rules.xpThresholds[c.level - 1]) fail("Nivel y experiencia incompatibles");
  const eligible = (skillId: string, level: number) => c.catalog.skills.some(s => s.id === skillId && s.classId === c.classId && s.level <= level);
  if (!c.creationOptions.every(x => eligible(x, 1)) || !c.creationChoices.every(x => c.creationOptions.includes(x))) fail("Elección inicial inválida");
  if (!c.skillIds.every(x => eligible(x, c.level))) fail("Habilidad incompatible con la clase o el nivel");
  if (c.status === "draft" && (c.level !== 1 || c.xp !== 0 || c.skillIds.length || c.pending)) fail("Borrador inválido");
  if (c.status === "ready" && c.creationChoices.length !== 4) fail("Selecciona cuatro habilidades iniciales");
  if (!unique(c.inventory.map(x => x.itemId))) fail("Objetos repetidos en el inventario");
  const slots: string[] = [];
  for (const entry of c.inventory) {
    const item = c.catalog.items.find(x => x.id === entry.itemId);
    if (!item) fail(`Objeto desconocido: ${entry.itemId}`);
    if (entry.equipped) {
      if (!item || !["weapon", "armor"].includes(item.kind)) fail("Este objeto no se puede equipar");
      else slots.push(item.kind);
    }
  }
  if (!unique(slots)) fail("Solo se puede equipar un objeto por ranura");
  if (c.pending) {
    if (c.status !== "ready" || c.pending.level !== c.level + 1 || c.pending.level > c.rules.maxLevel ||
      c.xp < c.rules.xpThresholds[c.pending.level - 1] ||
      !c.pending.options.every(x => eligible(x, c.pending!.level) && !c.skillIds.includes(x))) fail("Subida pendiente inválida");
    const candidates = c.catalog.skills.filter(s => s.classId === c.classId && s.level <= c.pending!.level && !c.skillIds.includes(s.id));
    if (c.pending.options.length !== Math.min(3, candidates.length)) fail("Opciones pendientes incompletas");
  } else if (c.status === "ready" && c.level < c.rules.maxLevel && c.xp >= c.rules.xpThresholds[c.level]) {
    fail("Falta resolver la subida de nivel");
  }
});

export const librarySchema = z.object({
  version: z.literal(1), characters: z.array(characterSchema).max(100),
  activeId: z.string().max(100).nullable(), draft: characterSchema.nullable(),
  setup: z.object({ name: z.string().max(60), classId: z.string().max(80), seed: z.string().max(10), gender: genderSchema }).strict(),
}).strict().superRefine((l, ctx) => {
  if (!unique(l.characters.map(c => c.id)) || l.characters.some(c => c.status !== "ready") ||
    (l.activeId !== null && !l.characters.some(c => c.id === l.activeId)) ||
    (l.draft && (l.draft.status !== "draft" || l.characters.some(c => c.id === l.draft!.id)))) {
    ctx.addIssue({ code: "custom", message: "Biblioteca incoherente" });
  }
});

export type Rules = z.infer<typeof rulesSchema>;
export type ClassDefinition = z.infer<typeof classSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Catalog = z.infer<typeof catalogSchema>;
export type Character = z.infer<typeof characterSchema>;
export type Library = z.infer<typeof librarySchema>;
export const emptyLibrary = (): Library => ({ version: 1, characters: [], activeId: null, draft: null, setup: { name: "", classId: "", seed: "", gender: "m" } });
