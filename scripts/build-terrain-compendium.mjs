import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { regions, observations, endings } from "./terrain-compendium-data.mjs";

const root = new URL("../", import.meta.url);
const imageManifest = JSON.parse(await readFile(new URL("docs/terrain-images.json", root), "utf8"));
async function readEntries(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
    if (entry.isDirectory()) result.push(...await readEntries(path));
    else if (entry.name.endsWith(".json")) {
      const data = JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
      result.push(...(data.entries ?? []));
    }
  }
  return result;
}

// Resolve suggested cards from the actual catalogs, including equipment-as-object cards.
const catalog = new Map((await Promise.all([
  readEntries(new URL("app/data/master/", root)),
  readEntries(new URL("app/data/items/", root)),
])).flat().map(entry => [entry.id, entry]));
const prompts = [
  "Una persona conoce el origen de este detalle, pero su versión contradice la de quien lo cuida. Contrastar ambas historias puede revelar una necesidad que ninguna admite en público.",
  "Este detalle sirve como señal para una cita. El grupo puede encontrar a quien espera, descubrir por qué nadie acudió o dejar un mensaje para continuar la historia más adelante.",
  "Una reparación sencilla permitiría volver a utilizar este lugar. Sus responsables ofrecen información o alojamiento a cambio; decidir quién se beneficiará importa más que obtener una recompensa material.",
  "Alguien ha reproducido este detalle en un mapa incompleto. Seguir la siguiente marca puede llevar a otro terreno del mismo entorno, sin exigir que la ruta sea peligrosa.",
  "Una pertenencia perdida cerca de este detalle identifica a un viajero. Devolverla puede abrir una conversación; conservarla puede provocar una reclamación posterior, sin presumir que sea un tesoro abandonado.",
  "Dos grupos atribuyen significados distintos a este detalle. El master puede permitir una solución que respete ambos usos, o presentar las consecuencias de favorecer a uno de ellos.",
  "Las señales de uso reciente pertenecen a alguien que evita ser encontrado. Puede necesitar ayuda, intimidad o protección; investigar no demuestra por sí solo culpabilidad ni hostilidad.",
  "Un cambio de tiempo amenaza con borrar o dañar este detalle. Documentarlo o protegerlo ofrece una tarea breve cuya urgencia puede ajustarse al ritmo de la sesión.",
  "Una persona ofrece un objeto útil si el grupo comprueba qué ha cambiado aquí. La información obtenida puede interesar a otra persona y conectar este lugar con una visita anterior.",
  "Este lugar admite una escena tranquila de observación o conversación. El master puede usar el detalle visible para recordar un vínculo del personaje sin introducir un nuevo conflicto.",
];

const ids = new Set();
const names = new Set();
const files = [];
for (const [regionIndex, region] of regions.entries()) {
  if (region.sites.length !== 25) throw new Error(`${region.id}: se requieren 25 lugares.`);
  const reference = id => {
    const card = catalog.get(id);
    if (!card) throw new Error(`Referencia desconocida: ${id}`);
    return card;
  };
  const npc = reference(region.npc);
  const object = reference(region.object);
  const enemy = reference(region.enemy);
  const entries = region.sites.map(([name, premise], index) => {
    const id = `terrain-compendio-${region.id}-${String(index + 1).padStart(2, "0")}`;
    if (!name || !premise || name.length > 80 || ids.has(id) || names.has(name)) throw new Error(`Lugar duplicado o incompleto: ${name}`);
    ids.add(id); names.add(name);
    const safe = ["refugios", "santuarios", "aldeas", "ciudades"].includes(region.id);
    const suggestedKind = safe || index % 3 === 0 ? "npc" : index % 3 === 1 ? "object" : "enemy";
    const suggestedId = suggestedKind === "npc" ? npc.id : suggestedKind === "object" ? object.id : enemy.id;
    const suggested = reference(suggestedId);
    return {
      id, kind: "terrain", name,
      image: imageManifest.entries[id].image,
      imageCredit: imageManifest.entries[id].credit,
      description: `${premise} ${region.opening}\n\n${region.atmosphere}\n\n${observations[(index * 7 + regionIndex * 3) % observations.length]} ${endings[(index + regionIndex) % endings.length]}`,
      musicUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(region.music)}`,
      abilities: [
        `Entorno: ${region.label}. Texto de ambientación original para leer a los jugadores; las siguientes notas son solo para el master.`,
        `Detalle para desarrollar: ${premise} ${prompts[(index + regionIndex * 3) % prompts.length]}`,
        `Rumbo opcional: ${region.hook}`,
        `Personaje sugerido: ${npc.name}. Usa su perfil como una persona local, viajera o cuidadora del lugar; decide su identidad y motivación antes de presentarla.`,
        `Objeto opcional: ${object.name}. Puede ser una herramienta prestada, una provisión o una pertenencia con dueño. No se entrega ni consume automáticamente.`,
        ...(safe ? [] : [`Presencia opcional: ${enemy.name}. Puede dejar rastros, observar o bloquear un paso; ajusta el peligro al grupo y permite evitar el enfrentamiento.`]),
        `Preparación opcional: «Sacar cartas indicadas» coloca una copia de ${suggested.name}. Puedes ignorarla o retirarla; no inicia combate, no aplica efectos ni modifica el mapa.`,
      ],
      instructions: [{ kind: suggestedKind, count: 1, cardId: suggestedId }],
    };
  });
  files.push({ path: new URL(`app/data/master/terrain/compendio-${region.id}.json`, root), entries });
}
if (regions.length !== 20 || ids.size !== 500) throw new Error("El compendio debe contener 20 entornos y 500 terrenos.");
// All references and counts are checked before writing any output.
for (const { path, entries } of files) await writeFile(path, `${JSON.stringify({ version: 1, entries }, null, 2)}\n`, "utf8");
console.log(`Compendio: ${ids.size} terrenos originales en ${files.length} archivos (${fileURLToPath(new URL("app/data/master/terrain/", root))}).`);
