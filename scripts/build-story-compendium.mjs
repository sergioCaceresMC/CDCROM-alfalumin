import { writeFile } from "node:fs/promises";
import { mainSeeds, mainAngles, sideSeeds, sideAngles, finalSeeds, resolutions } from "./story-compendium-data.mjs";

const names = new Set();
const ids = new Set();
function card(id, mission, name, description, abilities, instructions = []) {
  if (names.has(name) || ids.has(id) || name.length > 80 || description.length > 4000) throw new Error(`Carta inválida: ${name}`);
  names.add(name); ids.add(id);
  return { id, kind: "story", mission, name, description, abilities, instructions };
}
const numbered = (prefix, seed, angle) => `story-compendio-${prefix}-${String(seed + 1).padStart(2, "0")}-${String(angle + 1).padStart(2, "0")}`;
const secondary = sideSeeds.flatMap(([title, situation, clue, solution], seed) => sideAngles.map(([focus, complication, guidance], angle) => card(
  numbered("side", seed, angle), "side", `${title} — ${focus.toLowerCase()}`,
  `${situation}\n\n${complication}\n\nLa investigación puede comenzar con esta pista: ${clue} ${solution}`,
  [`Para el DM: ${guidance}`, "Uso como objetivo: si una carta final señala esta secundaria, el responsable pretende conseguir este objetivo por sus propios medios. Adapta quién pide ayuda y quién resulta perjudicado; el objetivo no justifica sus métodos.", "Continuidad: permite una pista mediante observación, conversación o búsqueda. Si una vía falla, otra persona o lugar puede aportar la misma información con un coste distinto.", "Recompensa y consecuencias: acuerda una ayuda proporcionada, información o un vínculo. Los objetos, la experiencia y los efectos se aplican manualmente; el encargo no presupone combate."],
)));
const main = mainSeeds.flatMap(([title, situation, clue, direction], seed) => mainAngles.map(([focus, complication, guidance], angle) => card(
  numbered("main", seed, angle), "main", `${title} — ${focus.toLowerCase()}`,
  `${situation}\n\n${complication}\n\nPrimer indicio: ${clue} El grupo puede empezar por lo siguiente: ${direction}`,
  [`Para el DM: ${guidance}`, "Desarrollo: ofrece una escena de llegada, un contacto y una pista verificable. Relaciona las siguientes cartas con una causa, intermediario o consecuencia; no conviertas cada carta en una aventura inconexa.", "Información esencial: no la encierres tras una única tirada. Un fallo puede requerir tiempo, ayuda o un favor y aun permitir que la historia avance.", "Continuar un arco: si el problema ya se resolvió, usa este acontecimiento como una consecuencia nueva o como la perspectiva de otro lugar. El desenlace determinará qué conexiones son reales."],
)));
const final = finalSeeds.flatMap(([title, cause, evidence, caution], seed) => resolutions.map(([focus, approach, aftermath], angle) => {
  const objective = secondary[(seed * 37 + angle * 19) % secondary.length];
  return card(numbered("final", seed, angle), "final", `${title} — ${focus.toLowerCase()}`,
    `Revelación para el DM: ${cause} Su objetivo es «${sideSeeds[Math.floor(((seed * 37 + angle * 19) % secondary.length) / 10)][0].toLowerCase()}», desarrollado en la carta secundaria «${objective.name}».\n\nPrueba del vínculo: ${evidence} Relaciona al menos dos acontecimientos del arco con esta prueba mediante una persona, un recurso o una decisión compartida; no invalida lo que los jugadores ya comprobaron.\n\nDesenlace posible: ${approach} ${aftermath}`,
    [`Límite de la revelación: ${caution}`, `Insertar narración secundaria: «${objective.name}». El botón de cartas indicadas coloca ese objetivo como referencia, sin aumentar el progreso del arco. Si su premisa contradice la campaña, adapta los participantes y conserva su objetivo esencial.`, "Preparación: asigna al responsable una identidad de la campaña y un medio que ya haya aparecido. Revela las conexiones mediante pruebas o diálogo, no mediante información que los personajes no pueden obtener.", "Epílogo: pregunta quién recibe ayuda, qué cambia en el lugar y qué vínculo permanece. Puedes iniciar después un nuevo arco con otro d4; este final es una propuesta y no impone el resultado a los jugadores."],
    [{ kind: "story", count: 1, cardId: objective.id }]);
}));
if ([main, secondary, final].some(entries => entries.length !== 200) || ids.size !== 600) throw new Error("Se requieren 200 cartas de cada tipo.");
// Stable IDs use seed and angle positions. Keep existing source entries in their positions.
for (const [category, entries] of [["main", main], ["side", secondary], ["final", final]]) {
  // Smaller lazy-import files make catalog expansion independent of components.
  for (let part = 0; part < 4; part++) {
    const path = new URL(`../app/data/master/story/compendio-${category}-${part + 1}.json`, import.meta.url);
    await writeFile(path, `${JSON.stringify({ version: 1, entries: entries.slice(part * 50, (part + 1) * 50) }, null, 2)}\n`, "utf8");
  }
}
console.log("Narración: 200 principales, 200 secundarias y 200 finales en 12 catálogos.");
