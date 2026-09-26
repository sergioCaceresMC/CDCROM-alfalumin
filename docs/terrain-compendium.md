# Compendio de terrenos

500 lugares originales para Alfa Lumin, distribuidos en 20 archivos de 25 entradas. Se añaden a los dos terrenos de ejemplo existentes. No son textos del SRD ni requieren usar sus reglas completas.

Los entornos son: descanso y refugios, ciudades, aldeas, caminos, bosques, selvas, pantanos, montañas, desiertos, praderas, costas, islas, ríos y lagos, cavernas, mazmorras, ruinas, santuarios, fortalezas, tierras heladas y lugares extraños.

## Usarlos en la mesa

Busca por nombre en **Biblioteca → Terrenos** o en **Mesa → Buscar → Terrenos**. Despliega la información para leer la descripción: tres párrafos de ambientación, sin secretos del master. Los motivos sensoriales se comparten dentro de cada entorno, con un detalle visible propio de cada lugar.

Las notas separadas incluyen un detalle para desarrollar, un rumbo posible y sugerencias de personajes, objetos y, cuando corresponde, enemigos. Son alternativas que puedes adaptar o ignorar. Los refugios, santuarios, aldeas y ciudades no indican enemigos para extraer. Las criaturas de otros entornos tampoco implican combate obligatorio.

**Sacar cartas indicadas** coloca una copia del perfil concreto sugerido mediante `instructions[].cardId`. No aplica efectos, entrega objetos, resuelve escenas ni modifica mapas. Las instrucciones antiguas sin `cardId` siguen extrayendo cartas aleatorias de su categoría. Las referencias se comprueban antes de añadir nada; un error conserva la mesa.

Cada terreno ofrece una búsqueda de música mediante `musicUrl`, sin reproducción automática. Puedes sustituirla por un enlace concreto. Todos los terrenos tienen una URL de ilustración existente de Wikimedia Commons y un crédito con enlace a la ficha de origen. Las imágenes se comparten por entorno y son referencias atmosféricas, no representaciones exactas de los 500 lugares.

## Mantener el contenido

Los catálogos están en `app/data/master/terrain/compendio-*.json` y se descubren con las importaciones diferidas existentes. Para cambiar el contenido reproducible, edita `scripts/terrain-compendium-data.mjs` y ejecuta `pnpm terrain:build`. El generador comprueba los 500 nombres, identificadores y referencias antes de escribir los archivos. No modifica los ejemplos ni los catálogos SRD.

Los identificadores usan entorno y posición, por ejemplo `terrain-compendio-bosques-01`. Conserva el orden de los lugares existentes; editar su nombre no cambia el ID. Puedes añadir nuevos catálogos JSON manualmente sin modificar componentes.

Las campañas guardadas conservan sus definiciones originales. Una edición del catálogo solo se refleja en nuevas copias; no sustituye silenciosamente una carta de una campaña.

## Ilustraciones

`docs/terrain-art.json` mantiene la selección por entorno: paisajes pintados y grabados, incluidas las prisiones imaginarias de Piranesi, grutas de Joseph Wright y paisajes de Church. Las fichas de origen señalan dominio público o CC0; el crédito visible identifica la obra y su procedencia. `docs/terrain-images.json` asigna una URL estable a cada terreno, incluidos los dos ejemplos.

Ejecuta `pnpm terrain:images` para reconstruir esas asignaciones y los catálogos. `pnpm images:check --terrain` comprueba respuestas HTTP y tipo de contenido. Las imágenes son externas: si no están disponibles, la interfaz conserva su ilustración de reserva. Las clases mantienen sus imágenes manuales.
