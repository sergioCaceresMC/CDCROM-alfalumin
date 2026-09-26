# Catálogos adaptados del SRD 5.2.1

Esta obra incluye material procedente del documento de referencia del sistema 5.2.1 (“SRD 5.2.1”) de Wizards of the Coast LLC, disponible en https://www.dndbeyond.com/srd. La licencia sobre el SRD 5.2.1 se concede de acuerdo con la licencia internacional de atribución/reconocimiento 4.0 de Creative Commons, disponible en https://creativecommons.org/licenses/by/4.0/legalcode.

Fuente: [SRD 5.2.1 oficial en español](https://media.dndbeyond.com/compendium-images/srd/5.2/SP_SRD_CC_v5.2.1.pdf). Se han extraído y normalizado los textos y se han creado adaptaciones numéricas y resúmenes para Alfa Lumin. No son las reglas completas de D&D. El texto extraído conserva el número de página para cotejar posibles errores de extracción con el PDF.

## Alcance y adaptación

- `reference.json`: referencia en español de 12 clases, 339 conjuros, 330 criaturas, 258 entradas de objetos mágicos, 38 armas, 13 armaduras/escudo y 106 herramientas y suministros. Algunas entradas originales agrupan variantes o tablas.
- Personajes: se mantienen las clases existentes, atributos 0–3, vida base actual, cuatro habilidades iniciales, XP 0/10/25 y máximo de nivel 3. Los rasgos de clase se condensan en habilidades elegibles; sus niveles y límites son propios de esta adaptación.
- Conjuros elegibles: trucos en nivel 1, conjuros originales de nivel 1 en nivel 2 y de nivel 2 en nivel 3. Solo se asignan a las clases que aparecen en su cabecera original. Los conjuros superiores permanecen en la referencia, sin habilitarlos para aprender.
- Habilidades mágicas: una acción, un objetivo; daño 1d4 o 1d6, control de un turno, utilidad de una escena. Curación manual de 2 o 3 puntos. El texto original desplegable es una consulta; sus dados, CD, espacios y escalados no sustituyen estos valores. El master resuelve casos especiales y puede rechazar usos incompatibles con la escena.
- Armas: dado original de hasta d4 → 1d4; demás armas → 1d6. Propiedades, peso, precio y maestrías se conservan en la referencia y no se automatizan.
- Protección: ligera/media → 12, pesada → 14. Escudo y objetos mágicos se conservan como objetos sin nueva ranura ni modificadores automáticos. Las pociones de curación ordinarias adaptadas recuperan 3 puntos; el equipo de ejemplo conserva sus valores anteriores.
- Criaturas: vida = techo(PG original / 10), entre 2 y 60; armadura original entre 10 y 18; ataque básico 1d2 si PG ≤ 15, 1d4 si PG < 80 y 2d4 en los demás casos. Una acción por turno. Rasgos, resistencias, magia y movimiento especial se consultan y adaptan manualmente. Esta conversión no certifica equilibrio; el VD original no mide dificultad en Alfa Lumin. Las amenazas mayores se señalan como peligros elevados.
- Personajes del master: 26 perfiles humanoides del bestiario también están disponibles en la categoría Personajes, con los mismos valores y una identidad independiente. Su actitud no viene impuesta por la categoría.
- Artificiero: adaptación propia inspirada en los inventores de la [campaña Vox Machina](https://critrole.com/campaign-1-vox-machina/): Taryon y su autómata Doty, y Percy como referencia para armas y disparos. La [presentación del Gunslinger en D&D Beyond](https://www.dndbeyond.com/posts/1174-fighter-101-make-your-own-percival-de-rolo-with) sirve de inspiración temática para reparación y maniobras. No se copian sus bloques de reglas ni se atribuyen al SRD. Los nombres, límites, niveles y efectos de las habilidades son una adaptación de Alfa Lumin. Un único ayudante funciona por órdenes que consumen la acción del personaje; la infusión protectora no se acumula. Los IDs previos se mantienen incluso al renombrar habilidades; las fichas existentes conservan sus snapshots. Místico y las habilidades previas siguen siendo contenido del prototipo. No se incluyen ilustraciones ni contenido de libros comerciales.

## Mantenimiento

`node scripts/build-srd-catalogs.mjs` regenera únicamente los archivos `srd-5.2.json`, sin conexión y sin modificar los ejemplos. Edita `reference.json` tras cotejar la fuente, o cambia las reglas del generador. Los IDs tienen prefijo estable; los nombres que coinciden con ejemplos llevan `(SRD)`.

Para repetir la extracción, descarga el PDF enlazado y extrae los elementos de texto con PDF.js (`str`, `transform[4]`, `transform[5]`, `fontName`, `height` → `text`, `x`, `y`, `font`, `size`), en una matriz por página. Ejecuta `node scripts/extract-srd.mjs <pages.json>` y después el generador. La aplicación no necesita PDF.js ni acceso al PDF para cargar catálogos.

Las definiciones y referencias opcionales viajan dentro de las copias guardadas; no se migran personajes existentes silenciosamente. El inventario conserva solo las definiciones necesarias. Las bibliotecas grandes siguen sujetas a los límites de exportación y almacenamiento documentados.
