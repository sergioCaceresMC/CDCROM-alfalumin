import fs from "node:fs";
import { regions } from "./terrain-compendium-data.mjs";

const artwork = JSON.parse(fs.readFileSync("docs/terrain-art.json", "utf8"));
const entries = {};
function illustration(id, name, group, index) {
  const choices = artwork.groups[group];
  if (!choices?.length) throw new Error(`Faltan imágenes para ${group}`);
  const art = choices[index % choices.length];
  if (!/^https:\/\//.test(art.image) || !art.credit?.url || !art.credit?.text) throw new Error(`Ilustración inválida: ${group}`);
  entries[id] = { name, image: art.image, match: "environment", illustration: art.title, source: art.source, credit: art.credit };
}
for (const region of regions) region.sites.forEach(([name], index) => illustration(`terrain-compendio-${region.id}-${String(index + 1).padStart(2, "0")}`, name, region.id, index));
illustration("terrain-bosque", "El bosque de los ecos", "bosques", 0);
illustration("terrain-ruinas", "Ruinas bajo la niebla", "ruinas", 0);
fs.writeFileSync("docs/terrain-images.json", JSON.stringify({ version: 1, checkedAt: artwork.checkedAt, entries }, null, 2) + "\n");
const path = "app/data/master/terrain/examples.json";
const examples = JSON.parse(fs.readFileSync(path, "utf8").replace(/^\uFEFF/, ""));
for (const card of examples.entries) {
  if (entries[card.id]) { card.image = entries[card.id].image; card.imageCredit = entries[card.id].credit; }
}
fs.writeFileSync(path, JSON.stringify(examples, null, 2) + "\n");
console.log(`${Object.keys(entries).length} terrenos con ilustración externa y crédito.`);
