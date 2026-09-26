# Repository Guidelines

## Project Structure & Module Organization

Alfa Lumin is a Spanish, mobile-first player companion built with React Router Framework SPA mode, React, strict TypeScript, Vite, and Tailwind CSS. Production runs entirely in the browser.

- `app/root.tsx` defines document layout, loading fallback, and error handling.
- `app/routes/home.tsx` connects the library, creation wizard, and character sections. Use query parameters for navigation so GitHub Pages reloads work.
- `app/components/` contains reusable interfaces; `app/game/` contains schemas, generation, progression, storage, transfer logic, and colocated tests.
- `app/data/` holds JSON catalogs. Square portraits live in `app/data/classes/images/<id>-m.webp` and `<id>-f.webp`; `public/images/` contains fallback emblems.
- `config/` and `scripts/` configure the base path and Pages build. `.github/workflows/` automates deployment.
- `.react-router/`, `build/`, `.cache/`, and `node_modules/` are generated; do not edit or commit them.

## Build, Test, and Development Commands

Use Node 22.22.2+ or 24.15+ and pnpm 10.17.1 (`corepack pnpm` also works):

- `pnpm install --frozen-lockfile`: install locked dependencies.
- `pnpm dev`: serve development at `http://localhost:5173/`.
- `pnpm typecheck`: generate route types and check TypeScript.
- `pnpm test`: run Vitest; `pnpm test:watch` watches changes.
- `pnpm build`: build for the root path; `pnpm build:pages` uses the repository subpath.
- `pnpm preview` or `pnpm start`: preview the static build.

Set `VITE_BASE_PATH` consistently for builds and previews. Deploy only `build/client`.

## Coding Style & Naming Conventions

Use two spaces, double quotes, semicolons, functional components, PascalCase component names, camelCase functions, and lowercase filenames. Use type-only imports and generated `Route` types. Match nearby formatting; no linter or formatter is configured.

Keep game rules independent of UI. Validate imported data with the versioned Zod schemas. Preserve stable catalog IDs, deterministic generator behavior, and saved definition snapshots. Load catalogs lazily. Never introduce server dependencies or automatic cross-device synchronization.

## Testing Guidelines

Use colocated `*.test.ts`/`*.test.tsx` files and Vitest for engine, serialization, storage, and interface flows. UI tests use Testing Library and jsdom; no coverage threshold is configured. Run types, tests, and builds after code changes. Manually check 360 px, light/dark themes, keyboard navigation, reloads, and the Pages subpath.

## Commit & Pull Request Guidelines

Git history is unavailable here. Use concise imperative subjects, such as `Add character inventory controls`. Keep PRs focused; describe behavior, link issues, report validation, and include screenshots for UI changes. Update `pnpm-lock.yaml` with dependency changes. Never commit browser saves or generated exports.
