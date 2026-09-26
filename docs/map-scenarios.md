# Escenarios de mapas

40 escenarios adicionales, más el patio de ruinas original. Se seleccionan en **Mesa → Barajas y herramientas → Escenario → Ver mapas del catálogo**; pulsa el nombre del escenario para colocarlo. Usan las celdas dibujadas existentes; una celda mide 70 px y corresponde al tamaño de una ficha.

## Distribuciones

- Cinco tabernas y posadas: sala pequeña, patio, salón, bodega y alojamiento fronterizo.
- Cinco edificios: casa-taller, almacén, capilla, biblioteca y sede de gremio.
- Cinco recintos subterráneos: cripta, cruce, catacumbas, laboratorio y fortaleza excavada.
- Cinco cuevas y minas: refugio, cascada, ramificaciones, pozas y recorrido sinuoso.
- Cinco campamentos: viajeros, caravana, bosque, excavación y peregrinos.
- Cinco exteriores de vegetación y roca: claro, muros antiguos, jardín, barrancas y valle.
- Cinco poblaciones: aldea, mercado, caserío, patios y distrito de entrada.
- Cinco escenarios mixtos: vado, puentes gemelos, ruinas, fortín e isla.

Los tamaños van de 8 × 8 a 32 × 24 celdas, con mapas cuadrados, horizontales y verticales. Cada distribución es distinta. Las cámaras interiores están conectadas; algunos recintos ofrecen una ruta circular alternativa. Los ríos tienen cruces secos y la isla tiene un muelle.

## Interpretación

Las referencias de mesa, provisiones, escaleras, contenedores, altar y hoguera son opcionales. Puedes ocultarlas con **Ocultar sugerencias**. No colocan cartas, enemigos ni recompensas, y no aplican colisiones o movimiento automático. Reinterpreta los muros exteriores como rocas, setos o barreras según la escena.

Las descripciones proponen varios usos por escenario. La misma posada puede ser una casa comunal, un almacén o un lugar de investigación; no incluye una historia obligatoria.

## Mantenimiento

El catálogo se encuentra en `app/data/master/maps/scenarios.json`. Edita las distribuciones en `scripts/map-scenarios-data.mjs` y ejecuta `pnpm maps:build`. Conserva los identificadores existentes. Las coordenadas se expresan en celdas y los rectángulos en `[x, y, ancho, alto]`.

Las pruebas comprueban el esquema del catálogo, la variedad, el acceso desde los bordes, la conexión de las zonas transitables, los marcadores y la conservación al exportar/importar. Las campañas guardadas mantienen su copia del mapa aunque después se actualice el catálogo.
