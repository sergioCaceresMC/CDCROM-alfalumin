# Alfa Lumin

Ficha móvil para un juego de mesa de rol. Primera fase: jugadores, generación procedural, inventario, habilidades, experiencia y biblioteca local. Interfaz en español con un cuaderno de pergamino sobre una mesa ilustrada, React Router Framework en modo SPA, React, TypeScript, Tailwind y CSS propio. Las reglas son provisionales.

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

Publica **solo `build/client`**. El build usa `/alfa-lumin-rpg-boardgame/`. Si cambia el nombre del repositorio o usas dominio propio, define `VITE_BASE_PATH` tanto al construir como al previsualizar. En PowerShell:

```powershell
$env:VITE_BASE_PATH='/alfa-lumin-rpg-boardgame/'
pnpm build:pages
pnpm preview
```

La aplicación utiliza una única ruta y consultas como `?personaje=ID&seccion=inventario`; recargar no requiere reglas de reescritura. El build puede generar un servidor temporal para prerenderizar el HTML: no se publica ni se ejecuta en producción.

Se incluye un workflow de Pages que valida tipos y pruebas antes de construir. En GitHub, selecciona **Settings → Pages → Source → GitHub Actions** y ejecuta el workflow manualmente o mediante un push a `main`. No se necesitan servicios externos. El Dockerfile es una alternativa local: `docker build -t alfa-lumin .` y `docker run --rm -p 8080:80 alfa-lumin`.

## Ampliar el catálogo

- `app/data/classes/*.json`: clases, vida base, emblema local y grupos de equipo inicial.
- `app/data/skills/<classId>/*.json`: habilidades con clase, nivel requerido y chequeo/daño opcionales.
- `app/data/items/**/*.json`: armas, armaduras, consumibles y objetos generales.
- `app/data/rules.json`: nivel máximo y XP acumulada por nivel (`[0, 10, 25]`).

Cada archivo de categoría contiene `{ "version": 1, "entries": [...] }`. Copia la estructura de un ejemplo; usa identificadores estables sin espacios y referencias existentes. Añadir archivos dentro de estas categorías no exige registrar importaciones. Reinicia el servidor o reconstruye para incluirlos. Las habilidades se cargan por clase y los objetos cuando se genera una ficha. Los esquemas y límites están en `app/game/schema.ts`.

Cada clase necesita al menos seis habilidades de nivel 1. Los nuevos niveles deben tener suficientes opciones desconocidas para la progresión. Las ilustraciones cuadradas se guardan en `app/data/classes/images/<id>-m.webp` y `<id>-f.webp` (también PNG/JPG); Vite descubre y empaqueta los archivos automáticamente. El campo `image` del JSON conserva un emblema de respaldo en `public/images/`. Se elige apariencia al crear y también se puede cambiar en Identidad; no altera los atributos, equipo ni habilidades. Las copias antiguas sin apariencia se abren como masculino.

Las clases de ejemplo incluyen mago, guerrero, druida, paladín, pícaro, brujo y artificiero, con retratos provisionales compartidos y doce habilidades cada una. Explorador y místico se conservan para compatibilidad. Las nuevas fichas tienen vida base 9 (guerrero y paladín), 8 (druida, pícaro, artificiero y explorador) o 7 (mago, brujo y místico), más constitución. Las fichas anteriores conservan su vida base guardada. Los atributos disponibles son golpes, tiros, constitucion, percepcion, inteligencia, valor, empatia y carisma. La ficha los muestra como valores de solo lectura, sin controles de edición manual.

La mochila busca por nombre, identificador, tipo o descripción, sin distinguir mayúsculas ni tildes, y muestra 20 resultados por página. Se admiten hasta 20.000 definiciones en el catálogo. Las nuevas fichas conservan solo las definiciones de equipo inicial y de objetos añadidos, para evitar duplicar miles de objetos en cada exportación. Al añadir unidades de un objeto conocido, se conserva su definición guardada.

Los objetos de la mochila muestran nombre, cantidad, estado de equipo y daño cuando corresponde. El botón de ojo despliega la descripción completa y las acciones del objeto. Los resultados de búsqueda también mantienen sus descripciones plegadas; estas siguen participando en la búsqueda. La interfaz usa el fondo ilustrado de aventura, paneles de papel envejecido con desgaste en las esquinas, bordes de tinta e iconos SVG. El selector de equipo está plegado y se distingue en verde. Las cabeceras tienen paletas y motivos para mago, guerrero, druida, paladín, pícaro, brujo y artificiero; las clases provisionales mantienen sus reglas. La fuente Patrick Hand se sirve localmente y la textura está en `app/assets/paper-grain.svg`.

Solo el efecto estructurado `{ "type": "heal", "amount": 2 }` cura automáticamente. Los demás efectos se resuelven en la mesa; consumir resta una unidad. Solo se equipa un arma y una armadura.

## Guardado y recuperación

La biblioteca, los borradores y las elecciones pendientes se guardan en `localStorage`, clave `alfa-lumin.library.v1`. Si falla, la sesión permanece en memoria y la interfaz ofrece exportarla. Un guardado corrupto no se sobrescribe automáticamente: se puede descargar el original y activar explícitamente el guardado de la sesión nueva.

Exporta un personaje o la biblioteca completa en JSON. El código AL1 contiene el estado del personaje, comprimido y codificado en Base32, con comprobación de integridad; no es cifrado ni prueba de autenticidad. Se admiten copias de hasta 2 MB. Importar añade copias con identificadores nuevos, conservando las existentes. Para importar otro borrador, termina o descarta primero el actual.

La semilla numérica, la clase y el catálogo reproducen atributos, equipo y opciones iniciales mediante el generador v1; las cuatro elecciones y los cambios posteriores requieren el código o archivo. Cada ficha conserva una copia de sus reglas y definiciones: cambiar el catálogo afecta a nuevas fichas, sin modificar silenciosamente las anteriores. No hay sincronización entre dispositivos.

## Validación

Vitest cubre generación, límites, equipo, consumo, progresión, archivos/códigos y fallos de almacenamiento. Antes de publicar, ejecuta tipos, pruebas y build. Revisa también en navegador: creación y cuatro elecciones, recarga de borrador, XP que cruza dos niveles, edición, exportación/importación en otro navegador y cambio entre fichas. Comprueba 360 px de ancho, temas claro/oscuro, navegación por teclado y recursos bajo la ruta de Pages.

La mesa del master, las campañas, mapas y cartas narrativas pertenecen a fases posteriores.



