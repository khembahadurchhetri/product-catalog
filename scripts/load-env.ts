import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
for (const name of [".env", ".env.local"]) {
  const path = resolve(root, name);
  if (existsSync(path)) {
    config({ path, override: true });
  }
}
