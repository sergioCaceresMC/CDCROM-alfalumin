import { beforeAll, describe, expect, it } from "vitest";
import { loadCharacterCatalog, loadRules } from "./catalog";
import { addXp, finishDraft, generateDraft, setHp, toggleInitialSkill } from "./engine";
import { emptyLibrary } from "./schema";
import type { Character, Library } from "./schema";
import { decodeCharacter, encodeCharacter, exportCharacter, exportLibrary, mergeTransfer, parseTransfer } from "./transfer";
import { readLibrary, STORAGE_KEY, writeLibrary } from "./storage";

let character: Character;
let library: Library;
beforeAll(async () => {
  const catalog = await loadCharacterCatalog("mistico"); const rules = await loadRules();
  let draft = generateDraft("Árbol ✦ del Río", "mistico", 4294967295, catalog, rules, "original");
  for (const id of draft.creationOptions.slice(0, 4)) draft = toggleInitialSkill(draft, id);
  character = addXp(setHp(finishDraft(draft), 1), 25);
  library = { ...emptyLibrary(), characters: [character], activeId: character.id,
    draft: generateDraft("Borrador", "mistico", 0, catalog, rules, "draft") };
});
describe("archivos y códigos", () => {
  it("acepta copias anteriores sin apariencia y conserva sus reglas de vida", () => {
    const old = JSON.parse(exportLibrary(library));
    delete old.data.characters[0].gender; delete old.data.draft.gender; delete old.data.setup.gender;
    old.data.characters[0].catalog.classes[0].baseHp = 4;
    const transfer = parseTransfer(JSON.stringify(old));
    if (transfer.kind !== "library") throw new Error("Biblioteca esperada");
    expect(transfer.data.characters[0].gender).toBe("m"); expect(transfer.data.draft!.gender).toBe("m");
    expect(transfer.data.setup.gender).toBe("m"); expect(transfer.data.characters[0].catalog.classes[0].baseHp).toBe(4);
  });
  it("recupera exactamente el estado completo, Unicode y elecciones pendientes", async () => {
    expect(parseTransfer(exportCharacter(character)).data).toEqual(character);
    expect(parseTransfer(exportLibrary(library)).data).toEqual(library);
    const code = await encodeCharacter(character);
    expect(code).toMatch(/^[A-Z0-9]+$/);
    expect((await decodeCharacter(code.toLowerCase())).data).toEqual(character);
  });
  it("importa copias con nuevos identificadores sin cambiar los originales", () => {
    let counter = 0;
    const current = { ...emptyLibrary(), characters: [character], activeId: character.id };
    const next = mergeTransfer(current, parseTransfer(exportLibrary(library)), () => `new-${++counter}`);
    expect(next.characters.map(c => c.id)).toEqual(["original", "new-1"]);
    expect(next.draft!.id).toBe("new-2"); expect(next.activeId).toBe("new-1");
    expect(current.characters).toHaveLength(1); expect(library.draft!.id).toBe("draft");
    expect(next.characters[1].catalog).toEqual(character.catalog);
  });
  it("preserva snapshots independientemente del catálogo externo", async () => {
    const external = await loadCharacterCatalog("mistico"); external.items[0].name = "Modificado";
    expect(parseTransfer(exportCharacter(character)).data).toEqual(character);
  });
  it("rechaza corrupción, versiones desconocidas y referencias inválidas", async () => {
    const code = await encodeCharacter(character);
    await expect(decodeCharacter(code.slice(0, -10))).rejects.toThrow();
    await expect(decodeCharacter(`AL2${code.slice(3)}`)).rejects.toThrow();
    await expect(decodeCharacter(code.slice(0, 11) + (code[11] === "A" ? "B" : "A") + code.slice(12))).rejects.toThrow();
    expect(() => parseTransfer("{oops")).toThrow();
    expect(() => parseTransfer(exportCharacter(character).replace('"version": 1', '"version": 2'))).toThrow();
    expect(() => parseTransfer(exportCharacter({ ...character, hp: 99 }))).toThrow();
    const invalid = JSON.parse(exportCharacter(character)); invalid.data.skillIds.push("desconocida");
    expect(() => parseTransfer(JSON.stringify(invalid))).toThrow();
    expect(() => parseTransfer(" ".repeat(2_000_001))).toThrow();
  });
  it("no sustituye borradores ni permite colisiones de identificadores", () => {
    expect(() => mergeTransfer(library, parseTransfer(exportLibrary(library)), () => "new")).toThrow("borrador");
    expect(() => mergeTransfer(library, parseTransfer(exportCharacter(character)), () => "original")).toThrow();
  });
});
describe("persistencia", () => {
  it("conserva borradores y elecciones pendientes al recargar", () => {
    const map = new Map<string, string>();
    const storage = { getItem: (key: string) => map.get(key) ?? null, setItem: (key: string, value: string) => { map.set(key, value); } };
    expect(writeLibrary(storage, library)).toBe(""); expect(readLibrary(storage).library).toEqual(library);
  });
  it("protege un guardado corrupto y entrega su contenido para recuperación", () => {
    let writes = 0;
    const storage = { getItem: () => "corrupto", setItem: () => { writes++; } };
    const result = readLibrary(storage);
    expect(result.blocked).toBe(true); expect(result.raw).toBe("corrupto"); expect(result.library).toEqual(emptyLibrary()); expect(writes).toBe(0);
  });
  it("un fallo de escritura no cambia ni destruye la sesión en memoria", () => {
    const before = structuredClone(library);
    expect(writeLibrary({ getItem: () => null, setItem: () => { throw new Error("QuotaExceeded"); } }, library)).toContain("memoria");
    expect(library).toEqual(before);
    expect(readLibrary({ getItem: () => { throw new Error("SecurityError"); }, setItem: () => {} }).blocked).toBe(true);
    expect(STORAGE_KEY).toContain("v1");
  });
});
