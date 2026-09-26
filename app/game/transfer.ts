import { z } from "zod";
import { characterSchema, librarySchema } from "./schema";
import type { Character, Library } from "./schema";

const LIMIT = 2_000_000;
const envelopeSchema = z.discriminatedUnion("kind", [
  z.object({ format: z.literal("alfa-lumin"), version: z.literal(1), kind: z.literal("character"), data: characterSchema }).strict(),
  z.object({ format: z.literal("alfa-lumin"), version: z.literal(1), kind: z.literal("library"), data: librarySchema }).strict(),
]);
export type Transfer = z.infer<typeof envelopeSchema>;
function serialize(transfer: Transfer): string {
  const json = JSON.stringify(envelopeSchema.parse(transfer), null, 2);
  if (new TextEncoder().encode(json).length > LIMIT) throw new Error("La copia supera 2 MB. Exporta los personajes por separado o reduce su contenido.");
  return json;
}
export function exportCharacter(c: Character): string {
  return serialize({ format: "alfa-lumin", version: 1, kind: "character", data: c });
}
export function exportLibrary(l: Library): string {
  return serialize({ format: "alfa-lumin", version: 1, kind: "library", data: l });
}
export function parseTransfer(json: string): Transfer {
  if (json.length > LIMIT || new TextEncoder().encode(json).length > LIMIT) throw new Error("El archivo supera el límite de 2 MB");
  let parsed: unknown;
  try { parsed = JSON.parse(json); } catch { throw new Error("El archivo no contiene JSON válido"); }
  const result = envelopeSchema.safeParse(parsed);
  if (!result.success) throw new Error("Archivo incompatible o ficha inválida. Se admite el formato alfa-lumin, versión 1.");
  return result.data;
}
export function mergeTransfer(current: Library, transfer: Transfer, newId: () => string): Library {
  // Validate again so callers cannot bypass the import boundary.
  transfer = envelopeSchema.parse(transfer);
  const incoming = transfer.kind === "character" ? [transfer.data] : transfer.data.characters;
  let draft = current.draft;
  const added: Character[] = [];
  let importedActive: string | null = null;
  for (const c of incoming) {
    const copy = { ...structuredClone(c), id: newId() };
    if (copy.status === "draft") {
      if (draft) throw new Error("Termina o descarta tu borrador antes de importar otro");
      draft = copy;
    } else {
      added.push(copy);
      if (transfer.kind === "character" || c.id === transfer.data.activeId) importedActive = copy.id;
    }
  }
  if (transfer.kind === "library" && transfer.data.draft) {
    if (draft) throw new Error("Termina o descarta tu borrador antes de importar otro");
    draft = { ...structuredClone(transfer.data.draft), id: newId() };
  }
  return librarySchema.parse({ ...current, characters: [...current.characters, ...added], draft,
    activeId: importedActive ?? current.activeId ?? added[0]?.id ?? null,
    setup: transfer.kind === "library" && current.characters.length === 0 && !current.draft ? transfer.data.setup : current.setup,
  });
}

// Base32 keeps the whole code alphanumeric and copyable, without lossy Number conversion.
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32(bytes: Uint8Array): string {
  let value = 0, bits = 0, result = "";
  for (const byte of bytes) {
    value = (value << 8) | byte; bits += 8;
    while (bits >= 5) { bits -= 5; result += alphabet[(value >>> bits) & 31]; }
    value &= (1 << bits) - 1;
  }
  if (bits) result += alphabet[(value << (5 - bits)) & 31];
  return result;
}
function unbase32(code: string): Uint8Array {
  let value = 0, bits = 0;
  const bytes: number[] = [];
  for (const char of code) {
    const digit = alphabet.indexOf(char);
    if (digit < 0) throw new Error("Código inválido");
    value = (value << 5) | digit; bits += 5;
    if (bits >= 8) { bits -= 8; bytes.push((value >>> bits) & 255); }
    value &= (1 << bits) - 1;
  }
  if (value !== 0) throw new Error("Código truncado");
  return new Uint8Array(bytes);
}
function checksum(bytes: Uint8Array): string {
  let hash = 2166136261;
  for (const byte of bytes) hash = Math.imul(hash ^ byte, 16777619) >>> 0;
  return hash.toString(16).padStart(8, "0").toUpperCase();
}
async function transform(bytes: Uint8Array, compress: boolean): Promise<Uint8Array> {
  const stream = new Blob([new Uint8Array(bytes)]).stream().pipeThrough(
    compress ? new CompressionStream("deflate") : new DecompressionStream("deflate"),
  );
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > LIMIT) { await reader.cancel(); throw new Error("Código demasiado grande"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const output = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.length; }
  return output;
}
export async function encodeCharacter(c: Character): Promise<string> {
  const bytes = await transform(new TextEncoder().encode(exportCharacter(c)), true);
  return `AL1${checksum(bytes)}${base32(bytes)}`;
}
export async function decodeCharacter(input: string): Promise<Transfer> {
  const code = input.replace(/\s/g, "").toUpperCase();
  if (code.length > LIMIT || !/^AL1[0-9A-F]{8}[A-Z2-7]+$/.test(code)) throw new Error("Código incompatible o incompleto (versión AL1)");
  const bytes = unbase32(code.slice(11));
  if (base32(bytes) !== code.slice(11)) throw new Error("El código está dañado o incompleto");
  if (checksum(bytes) !== code.slice(3, 11)) throw new Error("El código está dañado o incompleto");
  let json: string;
  try { json = new TextDecoder("utf-8", { fatal: true }).decode(await transform(bytes, false)); }
  catch { throw new Error("No se pudo descomprimir el código"); }
  const transfer = parseTransfer(json);
  if (transfer.kind !== "character") throw new Error("El código debe contener un personaje");
  return transfer;
}
