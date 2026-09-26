# Alfa Lumin

Asistente de mesa para un juego de rol: fichas móviles de jugadores y cuaderno del master para tablet y PC, con campañas, cartas y mapas. Interfaz en español con un cuaderno de pergamino sobre una mesa ilustrada, React Router Framework en modo SPA, React, TypeScript, Tailwind y CSS propio. Las reglas son provisionales.

## Desarrollo

Usa Node 22.22.2+ o Node 24.15+ y pnpm 10.17.1; estos mínimos incluyen las pruebas de interfaz con jsdom. Con Corepack: `corepack enable`; si no tienes pnpm, puedes usar `corepack pnpm` en los comandos siguientes.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

Desarrollo: `http://localhost:5173/`. Previsualización: `http://localhost:4173/`. `pnpm test:watch` mantiene Vitest abierto. `pnpm start` también sirve el build estático.

## GitHub Pages

```bash
pnpm build:pages
```

Repositorio: [sergioCaceresMC/CDCROM-alfalumin](https://github.com/sergioCaceresMC/CDCROM-alfalumin). URL prevista de la web: [sergioCaceresMC.github.io/CDCROM-alfalumin/](https://sergioCaceresMC.github.io/CDCROM-alfalumin/).

Publica **solo `build/client`**. El build usa `/CDCROM-alfalumin/`. El workflow obtiene la ruta del nombre del repositorio automáticamente. Si cambia el nombre del repositorio o usas dominio propio, define `VITE_BASE_PATH` tanto al construir como al previsualizar. En PowerShell:

```powershell
$env:VITE_BASE_PATH='/CDCROM-alfalumin/'
pnpm build:pages
pnpm preview
```

La aplicación utiliza una única ruta y consultas como `?personaje=ID&seccion=inventario`; recargar no requiere reglas de reescritura. El build puede generar un servidor temporal para prerenderizar el HTML: no se publica ni se ejecuta en producción.

Se incluye un workflow de Pages que valida tipos y pruebas antes de construir. Para publicar:

1. En [Settings → Pages](https://github.com/sergioCaceresMC/CDCROM-alfalumin/settings/pages), selecciona **Source → GitHub Actions**.
2. Sube los cambios a `main`, incluidos los catálogos JSON, `public/`, `pnpm-lock.yaml` y el workflow. No subas `node_modules/`, `.cache/` ni `build/`.
3. En **Actions → Publicar GitHub Pages**, espera a que terminen `build` y `deploy`. También puedes iniciarlo con **Run workflow**.
4. Abre la URL publicada y comprueba una recarga con `?modo=master&seccion=biblioteca` y las imágenes locales.

El despliegue usa Node 24, instala el lockfile, configura Pages y publica únicamente el artefacto estático. No necesita secretos personalizados ni servidor. Las partidas permanecen en el navegador; exporta las copias que necesites antes de cambiar de dominio u origen. El Dockerfile es una alternativa local: `docker build -t alfa-lumin .` y `docker run --rm -p 8080:80 alfa-lumin`.

## Ampliar el catálogo

- `app/data/classes/*.json`: clases, vida base, emblema local y grupos de equipo inicial.
- `app/data/skills/<classId>/*.json`: habilidades con clase, nivel requerido y chequeo/daño opcionales.
- `app/data/items/**/*.json`: armas, armaduras, consumibles y objetos generales.
- `app/data/rules.json`: nivel máximo y XP acumulada por nivel (`[0, 10, 25]`).

Cada archivo de categoría contiene `{ "version": 1, "entries": [...] }`. Copia la estructura de un ejemplo; usa identificadores estables sin espacios y referencias existentes. Añadir archivos dentro de estas categorías no exige registrar importaciones. Reinicia el servidor o reconstruye para incluirlos. Las habilidades se cargan por clase y los objetos cuando se genera una ficha. Los esquemas y límites están en `app/game/schema.ts`.

Cada clase necesita al menos seis habilidades de nivel 1. Los nuevos niveles deben tener suficientes opciones desconocidas para la progresión. Las ilustraciones cuadradas se guardan en `app/data/classes/images/<id>-m.webp` y `<id>-f.webp` (también PNG/JPG); Vite descubre y empaqueta los archivos automáticamente. El campo `image` del JSON conserva un emblema de respaldo en `public/images/`. Se elige apariencia al crear y también se puede cambiar en Identidad; no altera los atributos, equipo ni habilidades. Las copias antiguas sin apariencia se abren como masculino.

Las clases incluyen mago, guerrero, druida, paladín, pícaro, brujo y artificiero, con retratos provisionales. Explorador y místico se conservan para compatibilidad. Los catálogos del SRD amplían las habilidades y el equipo inicial; el artificiero tiene contenido original. Las nuevas fichas tienen vida base 9 (guerrero y paladín), 8 (druida, pícaro, artificiero y explorador) o 7 (mago, brujo y místico), más constitución. Las fichas anteriores conservan su vida base guardada. Los atributos disponibles son golpes, tiros, constitucion, percepcion, inteligencia, valor, empatia y carisma. La ficha los muestra como valores de solo lectura, sin controles de edición manual.

### Contenido basado en el SRD 5.2.1

La pestaña **Biblioteca** abre el catálogo general: clases, habilidades (filtrables por clase), armas, armaduras, consumibles, otros objetos y cartas del master. Busca por nombre o descripción y despliega solo las entradas que quieras consultar; los retratos se cargan al abrir sus detalles. Se muestran 30 resultados por tanda. La categoría, la clase y la búsqueda se conservan en parámetros de consulta, por ejemplo `?modo=biblioteca&categoria=skills&clase=artificiero`. La consulta no modifica las fichas guardadas.

La adaptación en español añade 330 criaturas, 26 perfiles de personajes del master, 414 objetos y 266 habilidades a los ejemplos existentes. Conserva atributos 0–3, vida reducida y niveles 1–3. Las referencias originales de objetos, habilidades y enemigos se despliegan aparte, con página y enlace al documento oficial; sus reglas completas no se aplican automáticamente. Las criaturas de mayor peligro están señaladas y la conversión requiere pruebas de equilibrio.

`pnpm catalog:build` regenera los archivos propios `srd-5.2.json` sin conexión ni cambios en los ejemplos. [La documentación del catálogo](docs/srd/README.md) explica las conversiones, el alcance, la extracción, la licencia y la referencia completa de 339 conjuros. No se añaden clases nuevas ni se migran las partidas existentes. El artificiero y el místico no se presentan como clases oficiales del SRD.

Esta obra incluye material procedente del documento de referencia del sistema 5.2.1 (“SRD 5.2.1”) de Wizards of the Coast LLC, disponible en https://www.dndbeyond.com/srd. La licencia sobre el SRD 5.2.1 se concede de acuerdo con la licencia internacional de atribución/reconocimiento 4.0 de Creative Commons, disponible en https://creativecommons.org/licenses/by/4.0/legalcode. El proyecto adapta y resume ese material.

La mochila busca por nombre, identificador, tipo o descripción, sin distinguir mayúsculas ni tildes, y muestra 20 resultados por página. Se admiten hasta 20.000 definiciones en el catálogo. Las nuevas fichas conservan solo las definiciones de equipo inicial y de objetos añadidos, para evitar duplicar miles de objetos en cada exportación. Al añadir unidades de un objeto conocido, se conserva su definición guardada.

Los objetos de la mochila muestran nombre, cantidad, estado de equipo y daño cuando corresponde. El botón de ojo despliega la descripción completa y las acciones del objeto. Los resultados de búsqueda también mantienen sus descripciones plegadas; estas siguen participando en la búsqueda. La interfaz usa el fondo ilustrado de aventura, paneles de papel envejecido con desgaste en las esquinas, bordes de tinta e iconos SVG. El selector de equipo está plegado y se distingue en verde. Las cabeceras tienen paletas y motivos para mago, guerrero, druida, paladín, pícaro, brujo y artificiero; las clases provisionales mantienen sus reglas. La fuente Patrick Hand se sirve localmente y la textura está en `app/assets/paper-grain.svg`.

Solo el efecto estructurado `{ "type": "heal", "amount": 2 }` cura automáticamente. Los demás efectos se resuelven en la mesa; consumir resta una unidad. Solo se equipa un arma y una armadura.

## Guardado y recuperación

La biblioteca, los borradores y las elecciones pendientes se guardan en `localStorage`, clave `alfa-lumin.library.v1`. Si falla, la sesión permanece en memoria y la interfaz ofrece exportarla. Un guardado corrupto no se sobrescribe automáticamente: se puede descargar el original y activar explícitamente el guardado de la sesión nueva.

Exporta un personaje o la biblioteca completa en JSON. El código AL1 contiene el estado del personaje, comprimido y codificado en Base32, con comprobación de integridad; no es cifrado ni prueba de autenticidad. Se admiten copias de hasta 2 MB. Importar añade copias con identificadores nuevos, conservando las existentes. Para importar otro borrador, termina o descarta primero el actual.

La semilla numérica, la clase y el catálogo reproducen atributos, equipo y opciones iniciales mediante el generador v1; las cuatro elecciones y los cambios posteriores requieren el código o archivo. Cada ficha conserva una copia de sus reglas y definiciones: cambiar el catálogo afecta a nuevas fichas, sin modificar silenciosamente las anteriores. No hay sincronización entre dispositivos.

## Validación

Vitest cubre generación, límites, equipo, consumo, progresión, archivos/códigos y fallos de almacenamiento. Antes de publicar, ejecuta tipos, pruebas y build. Revisa también en navegador: creación y cuatro elecciones, recarga de borrador, XP que cruza dos niveles, edición, exportación/importación en otro navegador y cambio entre fichas. Comprueba 360 px de ancho, temas claro/oscuro, navegación por teclado y recursos bajo la ruta de Pages.

## Mesa del master

Pulsa **Master** y crea una campaña. La navegación usa consultas como `?modo=master&campana=ID&seccion=mesa`, sin nuevas rutas de servidor.

- **Mesa:** barajas de terrenos, personajes, enemigos, narración y objetos. La pestaña Barajas saca copias al azar sin agotarse; las cartas pueden repetirse. La pestaña Buscar permite localizar y colocar una carta concreta. Inventario reúne las cartas guardadas, con su propia búsqueda. Sus instrucciones son acciones explícitas: pueden sacar otras cartas, sin ejecutar automáticamente una historia.
- **Movimiento:** la mesa ocupa toda la ventana; vuelve al cuaderno mediante el botón superior. Las barajas y herramientas se despliegan a la derecha. Arrastra desde cualquier parte de una carta o ficha; con teclado, enfoca la pieza y usa las flechas. La mesa se desplaza arrastrando el fondo con el botón izquierdo del ratón; también admite scroll y permite zoom del 50 al 150 %. El mapa se centra al cargarlo. Los detalles se abren con «Ver detalles» en un panel superpuesto, sin desplazar ni recentrar el tablero. Sus casillas miden 70 × 70 px, igual que las fichas.
- **Escenario:** carga el mapa de ejemplo o un JSON validado. Puedes ocultar las sugerencias de objetos y enemigos; estas no crean cartas ni combatientes. Las fichas libres sirven para marcas que decide el master: se colocan pulsando un icono, con el nombre «Ficha». Puedes cambiarlo después en sus detalles, accesibles desde el botón de la ficha o los iconos de fichas colocadas.
- **Participantes:** añade copias de fichas locales o importa JSON/códigos AL1. Puedes colocarlas como cartas. Las fichas originales y las cartas son independientes.
- **Inventario del master:** selecciona una carta y pulsa «Guardar carta en inventario». Puedes buscarla y volver a colocarla desde la pestaña Inventario del panel derecho; conserva vida, notas, posición y definición, sin volver a sacarla de la baraja.
- **Notas y guardado:** guarda notas de campaña y exporta un cuaderno completo o una campaña. Importar añade copias y remapea referencias internas.
- **Dados:** dados d2–d100 sin animaciones. La música se propone mediante enlaces en los detalles de terrenos; no hay reproductor integrado.

El estado versionado se guarda en `alfa-lumin.master.v1`, separado de la biblioteca de jugadores. Las exportaciones admiten hasta 10 MB y contienen las definiciones usadas de cartas, mapas y participantes. Un guardado corrupto se conserva; los fallos de escritura mantienen la sesión en memoria y ofrecen exportación.

### Catálogos ampliables del master

Los enemigos y PNJ tienen enlaces a ilustraciones existentes. [El catálogo de imágenes](docs/card-images.md) documenta su correspondencia, créditos y mantenimiento; `pnpm images:check` verifica su disponibilidad. Las imágenes de las clases se mantienen manualmente.

La baraja **Objetos** incorpora automáticamente todo el equipo de `app/data/items/`: armas, armaduras, consumibles y otros objetos, además de las cartas narrativas de `app/data/master/object/`. Cada carta conserva una copia completa del objeto (daño, armadura, consumo, efectos y referencia) al colocarla o guardarla. Aparecen también en la búsqueda y biblioteca de cartas; no hay que duplicar JSON. Sacar o guardar una carta no consume equipo de una ficha ni aplica efectos a personajes. Los IDs de equipo y de cartas narrativas deben ser distintos.

`app/master/` contiene modelos, reglas, carga diferida y persistencia; los componentes están en `app/components/master*.tsx`. Añade archivos `{ "version": 1, "entries": [...] }` en:

- `app/data/master/terrain/`, `npc/`, `enemy/`, `story/`, `object/`: subdivide por temática, por ejemplo `enemy/no-muertos.json`.
- `app/data/master/maps/`: mapas de cuadrícula.

Los archivos se descubren con `import.meta.glob` y se cargan por categoría al abrirla. Cada carta requiere `id`, `kind`, `name` y `description`; permite imagen HTTP(S) o ruta local `images/cards/archivo.webp` desde `public/images/cards/`, `musicUrl` HTTP(S) opcional para terrenos, habilidades narrativas e instrucciones como `{ "kind": "enemy", "count": 2 }`. Los enemigos requieren `maxHp` y pueden incluir armadura y daño `1d2`, `1d4` o `2d4`. Narración admite `mission: "main"` o `"side"`. Los efectos son manuales.

Un mapa contiene `version: 1`, `id`, nombre, descripción, ancho, alto, `legend`, `cells` y `suggestions`. `cells` es un array de IDs por filas, de longitud ancho × alto. La leyenda permite `terrain`: `floor`, `wall`, `water`, `grass` o `path` para los dibujos de terreno. También define IDs, nombres, símbolos y tipo `structure`, `enemy` u `object`; las sugerencias contienen `x`, `y` e `id` de esa leyenda. Para cargar un mapa personalizado, usa la entrada individual de `maps/ruins.json`, sin el envoltorio del catálogo. Se validan dimensiones (hasta 60 × 60), coordenadas y referencias antes de sustituir el escenario.

Las pruebas incluyen barajas, mapas, snapshots, límites de vida, importación, navegación, recarga y fallos de almacenamiento. Antes de publicar, revisa también arrastre táctil, desplazamiento/zoom, enlaces musicales y legibilidad en tablet/PC y móvil. Esta versión no automatiza combate ni sincroniza dispositivos.







Los terrenos de ejemplo incluyen búsquedas de ambientación en YouTube; puedes sustituir `musicUrl` por un enlace concreto. Las cartas ya guardadas mantienen su definición original y no adquieren automáticamente el nuevo enlace.



Las cartas de terreno, enemigo y personaje usan cabecera de color, ilustración grande y texto sobre papel. Los ejemplos usan ilustraciones provisionales locales; sustituye el campo `image` para añadir las definitivas. Las rutas locales respetan la base de Pages. Pulsar, enfocar o arrastrar una carta la lleva al frente y conserva ese orden en el guardado; los detalles siguen abriéndose solo con su botón.


El tablero mide al menos 4000 × 4000 px y crece para mapas grandes. Las cartas tienen 190 px de ancho, con ilustraciones de borde a borde y controles táctiles de 44 px.


Las imágenes de las cartas se recortan con `object-fit: cover` y `object-position: center top`. La mesa admite 100 cartas simultáneas; guarda cartas en el inventario para liberar espacio. Este límite no agota las barajas.


La sección **Biblioteca** del cuaderno está disponible con o sin campaña, mediante `?modo=master&seccion=biblioteca`. Separa todas las cartas del catálogo por categoría, busca solo por nombre sin distinguir tildes o mayúsculas y muestra 30 entradas inicialmente, con «Mostrar 30 más». Las cartas permanecen plegadas y sus imágenes no se montan hasta abrir la información.

Los mapas usan bocetos de tinta con trazos dobles, rocas, hachuras, vegetación y ondas sobre un lavado de color y textura de papel continuo. Las variantes de dibujo dependen de la posición de la celda y no alteran el mapa guardado.

En **Escenario → Cargar mapa como imagen** puedes subir PNG, JPG o WebP desde el PC (hasta 2 MB y 16 megapíxeles). La imagen se coloca como una pieza móvil; arrástrala o usa las flechas al enfocarla. **Ajustar mapa** abre un control de ancho y botones para ampliar/reducir manteniendo la proporción. Se admiten hasta cinco imágenes por campaña; sus datos, posición y escala se conservan en el guardado y exportación, sin necesitar el archivo original en otro dispositivo. Las imágenes grandes pueden consumir la cuota del navegador: si falla el guardado, exporta la sesión.

Cada carta tiene accesos de icono para **guardar en inventario** (bolsa) y **retirar del tablero** (papelera), sin abrir detalles. El botón de acciones junto a las barajas permite guardar todas las cartas, retirar solo las cartas de la mesa o reiniciar el tablero completo (cartas, fichas y mapas). El inventario, participantes y notas de campaña se conservan. Guardar en bloque es una operación completa: si excede las 500 cartas del inventario, no cambia la mesa.

## Compendio de terrenos

La biblioteca y la mesa incluyen 500 terrenos originales en 20 entornos, además de los dos ejemplos. Cada lugar tiene una descripción para leer a los jugadores, notas opcionales para el master y sugerencias de perfiles concretos. Los refugios no extraen enemigos. Consulta [uso y mantenimiento del compendio](docs/terrain-compendium.md). Para regenerar sus catálogos: `pnpm terrain:build`.


## Narración por arcos

La mesa permite elegir narración principal, secundaria o final. Un d4 guardado determina cuántas principales/secundarias extraer antes del desenlace. Se incluyen 200 nuevas cartas de cada tipo, con pistas y orientaciones para el DM. Los finales pueden insertar una secundaria como objetivo del responsable. Consulta [narración de la campaña](docs/story-compendium.md). Regenera el contenido con `pnpm story:build`.

Los 502 terrenos tienen URLs de ilustraciones existentes y créditos de Wikimedia Commons. La selección se comparte por entorno. Regenera las asignaciones con `pnpm terrain:images` y verifica los enlaces con `pnpm images:check --terrain`.

