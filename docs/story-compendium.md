# Narración de la campaña

El catálogo añade 200 cartas principales, 200 secundarias y 200 finales, además de los dos ejemplos existentes. Son semillas originales de aventuras, con situaciones, indicios, complicaciones y orientaciones para el DM; no reproducen aventuras publicadas de D&D.

## Jugar un arco

1. Abre **Barajas → Narración** y pulsa **Iniciar arco · lanzar d4**. La campaña guarda el resultado (1–4).
2. Elige **Principal** o **Secundaria** y extrae al azar, o busca una carta específica. Cada extracción cuenta una vez; interpreta cómo enlaza con los acontecimientos anteriores.
3. Al alcanzar el número requerido se habilita **Final**. Extrae una propuesta de revelación y desenlace; adapta el responsable a una persona o presencia que ya haya aparecido.
4. Los finales incluyen una secundaria concreta que desarrolla el objetivo del responsable. **Sacar cartas indicadas** la coloca como referencia sin aumentar el contador ni aplicar efectos.
5. **Nuevo arco · lanzar d4** sustituye el registro del arco, previa confirmación si contiene cartas, conservando las cartas físicas de mesa e inventario. Exporta antes si necesitas conservar el registro completo anterior.

El contador mide cartas extraídas, no misiones resueltas. Guardar, retirar, recolocar o limpiar el tablero no modifica el arco. Las cartas extraídas como apoyos desde los detalles tampoco cuentan; las instrucciones aleatorias de narración excluyen finales. El d4, las descripciones elegidas y el final se conservan al recargar y exportar/importar la campaña. Las campañas antiguas empiezan sin arco, manteniendo sus cartas.

## Preparar la historia

Las principales presentan un acontecimiento y distintas vías de investigación. Las secundarias sirven como encargos, consecuencias u objetivos de una persona. Los finales proponen una causa, una prueba y una vía de cierre; ninguno obliga a combatir ni invalida hechos que los jugadores hayan comprobado. Adapta las conexiones antes de revelar la solución y ofrece acceso a las pistas esenciales por varias vías.

La biblioteca permite filtrar narración principal, secundaria y final, además de buscar por nombre. La información permanece plegada hasta abrir una carta.

## Mantener los catálogos

Edita `scripts/story-compendium-data.mjs` y ejecuta `pnpm story:build`. Veinte premisas por tipo se combinan con diez perspectivas o soluciones para producir 200 variantes jugables de cada baraja. Los IDs usan posición de premisa y variante; conserva las posiciones existentes. Los doce archivos `app/data/master/story/compendio-*.json` se cargan con el mecanismo diferido del catálogo.

`mission` admite `main`, `side` y `final`. Las instrucciones con `cardId` apuntan a la secundaria concreta. Las copias de campañas conservan las definiciones usadas, aunque después se edite el catálogo. No se modifica automáticamente la experiencia, el inventario de los jugadores ni sus habilidades.
