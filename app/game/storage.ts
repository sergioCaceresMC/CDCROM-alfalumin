import { emptyLibrary, librarySchema } from "./schema";
import type { Library } from "./schema";

export const STORAGE_KEY = "alfa-lumin.library.v1";
export type LocalStorage = Pick<Storage, "getItem" | "setItem">;
export function readLibrary(storage: LocalStorage): { library: Library; error: string; raw: string | null; blocked: boolean } {
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
    return { library: raw ? librarySchema.parse(JSON.parse(raw)) : emptyLibrary(), error: "", raw, blocked: false };
  } catch {
    return { library: emptyLibrary(), error: "No se pudo leer el guardado local. Tus datos anteriores no se sobrescribirán; esta sesión sigue en memoria.", raw, blocked: true };
  }
}
export function writeLibrary(storage: LocalStorage, library: Library): string {
  const serialized = JSON.stringify(librarySchema.parse(library));
  try { storage.setItem(STORAGE_KEY, serialized); return ""; }
  catch { return "No se pudo guardar en este navegador. La sesión sigue en memoria: exporta una copia antes de cerrar."; }
}
