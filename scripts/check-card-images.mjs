import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync("docs/card-images.json", "utf8"));
const terrainManifest = JSON.parse(fs.readFileSync("docs/terrain-images.json", "utf8"));
const selected = process.argv.includes("--terrain") ? terrainManifest.entries : { ...manifest.entries, ...terrainManifest.entries };
const urls = [...new Set(Object.values(selected).map(entry => entry.image))];
const failures = [];
let cursor = 0;
await Promise.all(Array.from({ length: process.argv.includes("--terrain") ? 2 : 8 }, async () => {
  while (cursor < urls.length) {
    const url = urls[cursor++];
    try {
      const headers = { "User-Agent": "AlfaLuminCatalog/1.0 (https://github.com/sergioCaceresMC/CDCROM-alfalumin)" };
      let response = await fetch(url, { method: "HEAD", headers, signal: AbortSignal.timeout(20000) });
      if (response.status === 405) response = await fetch(url, { headers: { ...headers, Range: "bytes=0-0" }, signal: AbortSignal.timeout(20000) });
      if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) failures.push({ url, status: response.status });
      await response.body?.cancel();
    } catch (error) { failures.push({ url, error: error.message }); }
  }
}));
console.log(`${urls.length} enlaces únicos comprobados; ${failures.length} fallos.`);
if (failures.length) { console.log(failures); process.exitCode = 1; }
