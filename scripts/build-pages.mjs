import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
const packagePath = require.resolve("@react-router/dev/package.json");
const bin = require(packagePath).bin["react-router"];

const result = spawnSync(process.execPath, [resolve(dirname(packagePath), bin), "build"], {
  stdio: "inherit",
  env: { ...process.env, VITE_BASE_PATH: process.env.VITE_BASE_PATH || "/alfa-lumin-rpg-boardgame/" },
});
process.exit(result.status ?? 1);
