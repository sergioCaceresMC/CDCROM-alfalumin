import { z } from "zod";
import { catalogSchema, classSchema, itemSchema, skillSchema, rulesSchema } from "./schema";
import type { Catalog, ClassDefinition, Item, Rules } from "./schema";

const modules = import.meta.glob("../data/**/*.json", { import: "default" });
const cache = new Map<string, Promise<unknown[]>>();
function category(name: string, group?: string): Promise<unknown[]> {
  const key = group ? `${name}/${group}` : name;
  const cached = cache.get(key);
  if (cached) return cached;
  const loaders = Object.entries(modules).filter(([path]) => path.includes(`/data/${key}/`)).sort(([a], [b]) => a.localeCompare(b));
  const result = Promise.all(loaders.map(async ([, load]) => {
    const file = z.object({ version: z.literal(1), entries: z.array(z.unknown()) }).strict().parse(await load());
    return file.entries;
  })).then(files => files.flat()).catch(error => { cache.delete(key); throw error; });
  cache.set(key, result);
  return result;
}
export async function loadClasses(): Promise<ClassDefinition[]> {
  const classes = z.array(classSchema).min(1).parse(await category("classes"));
  if (new Set(classes.map(c => c.id)).size !== classes.length) throw new Error("Clases duplicadas");
  return classes;
}
export async function loadSkills(classId?: string) {
  const [classes, raw] = await Promise.all([loadClasses(), category("skills", classId)]);
  const skills = z.array(skillSchema).max(10000).parse(raw);
  if (new Set(skills.map(skill => skill.id)).size !== skills.length ||
    skills.some(skill => !classes.some(cls => cls.id === skill.classId) || (classId && skill.classId !== classId))) {
    throw new Error("Habilidades duplicadas o referencias de clase inválidas");
  }
  return skills;
}
export async function loadCharacterCatalog(classId: string): Promise<Catalog> {
  const [classes, skills, items] = await Promise.all([loadClasses(), category("skills", classId), category("items")]);
  return catalogSchema.parse({ version: 1, classes: classes.filter(c => c.id === classId),
    skills: z.array(skillSchema).parse(skills).filter(s => s.classId === classId), items: z.array(itemSchema).parse(items) });
}
export async function loadItems(): Promise<Item[]> {
  const items = z.array(itemSchema).max(20000).parse(await category("items"));
  if (new Set(items.map(item => item.id)).size !== items.length) throw new Error("Objetos duplicados en el catálogo");
  return items;
}
export async function loadRules(): Promise<Rules> {
  return rulesSchema.parse(await modules["../data/rules.json"]());
}
