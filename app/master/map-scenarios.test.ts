import { expect, it } from "vitest";
import { loadMaps } from "./catalog";
import { createCampaign, emptyMaster, exportMaster, importMaster } from "./engine";
import { TILE_SIZE, tableSize } from "./table-engine";

it("carga 40 escenarios distintos, conserva el ejemplo y admite tamaños variados", async () => {
  const all = await loadMaps();
  const maps = all.filter(map => map.id.startsWith("map-escenario-"));
  expect(maps).toHaveLength(40);
  expect(all.some(map => map.id === "map-ruinas")).toBe(true);
  expect(new Set(maps.map(map => map.name)).size).toBe(40);
  expect(new Set(maps.map(map => `${map.width}x${map.height}`)).size).toBeGreaterThan(20);
  expect(Math.min(...maps.map(map => map.width))).toBe(8);
  expect(Math.max(...maps.map(map => map.width))).toBe(32);
  expect(new Set(maps.map(map => JSON.stringify([map.width, map.height, map.cells]))).size).toBe(40);
});

it("mantiene las zonas transitables conectadas, con acceso y referencias dentro de ellas", async () => {
  for (const map of (await loadMaps()).filter(map => map.id.startsWith("map-escenario-"))) {
    const terrain = new Map(map.legend.map(tile => [tile.id, tile.terrain]));
    const walkable = (index: number) => !["water", "wall"].includes(terrain.get(map.cells[index])!);
    const start = map.cells.findIndex((_, index) => walkable(index) && (index % map.width === 0 || index % map.width === map.width - 1 || index < map.width || index >= map.width * (map.height - 1)));
    expect(start, map.name).toBeGreaterThanOrEqual(0);
    const reached = new Set([start]);
    const queue = [start];
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const index = queue[cursor];
      const x = index % map.width;
      const y = Math.floor(index / map.width);
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (nx < 0 || ny < 0 || nx >= map.width || ny >= map.height) continue;
        const next = ny * map.width + nx;
        if (walkable(next) && !reached.has(next)) { reached.add(next); queue.push(next); }
      }
    }
    expect(reached.size, map.name).toBe(map.cells.filter((_, index) => walkable(index)).length);
    expect(map.suggestions.every(point => reached.has(point.y * map.width + point.x)), map.name).toBe(true);
    expect(map.suggestions.every(point => map.legend.some(tile => tile.id === point.id && tile.kind === "object"))).toBe(true);
  }
});

it("conserva el mapa grande en exportaciones y deja espacio en el tablero para sus celdas", async () => {
  const map = (await loadMaps()).find(map => map.id === "map-escenario-valle-rocoso")!;
  const campaign = createCampaign("Valle", "campaign");
  campaign.table.map = map;
  const bounds = tableSize(campaign.table);
  expect(bounds.width).toBeGreaterThan(map.width * TILE_SIZE);
  expect(bounds.height).toBeGreaterThan(map.height * TILE_SIZE);
  let id = 0;
  const copy = importMaster(emptyMaster(), exportMaster({ version: 1, campaigns: [campaign] }), () => `copy-${id++}`);
  expect(copy.campaigns[0].table.map).toEqual(map);
  expect(copy.campaigns[0].table.cards).toHaveLength(0);
});
