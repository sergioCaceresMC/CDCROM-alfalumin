# Imágenes de enemigos y personajes

`card-images.json` relaciona los 330 enemigos del SRD, sus 26 perfiles de PNJ y los cinco personajes/enemigos de ejemplo con imágenes externas existentes. Las clases quedan fuera de este catálogo y mantienen sus retratos manuales.

La correspondencia español/inglés se cotejó entre las versiones oficiales del SRD 5.2.1 usando vida, armadura y las seis características originales. Los enlaces de criaturas proceden del [catálogo 5e-bits](https://github.com/5e-bits/5e-database), servido por D&D 5e API. Para los perfiles renombrados se emplean sus equivalentes anteriores; variantes como goblins, jefes, capitanes y enjambres pueden compartir la representación de su especie. `match`, `illustration` y `source` registran esta elección. Se excluyen los enlaces marcados como NYI por el proveedor.

Las reconstrucciones de alosaurio, anquilosaurio, Archelon y Pteranodon y las fotografías de hipopótamo y piraña proceden de Wikimedia Commons. Sus autores, licencias y páginas de origen se conservan en `credit` y se muestran en los detalles de la carta. Las garras reptantes usan la imagen de una garra de la [ficha de Roll20](https://roll20.net/compendium/dnd5e/Monsters:Crawling%20Claw). Iria conserva el enlace que ya tenía la ficha.

Los permisos sobre las ilustraciones son independientes de la licencia del texto del SRD. Este repositorio enlaza recursos externos; no contiene copias de estas imágenes ni las presenta como ilustraciones propias.

`pnpm catalog:build` incorpora los enlaces y créditos a las cartas generadas. Para cambiar una imagen, edita su entrada en el manifiesto y regenera los catálogos. Las cartas de ejemplo se editan directamente en sus JSON. Las imágenes se cargan al consultar las cartas; necesitan conexión y mantienen el recurso local de respaldo si el proveedor falla. Las cartas que ya estaban guardadas mantienen su ilustración original.

`pnpm images:check` comprueba las URLs únicas con HTTP HEAD y verifica su tipo de contenido. No consulta ni modifica las imágenes de las clases. La disponibilidad y las restricciones de los proveedores pueden cambiar después de la comprobación.
