import "./load-env";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

const sqlPath = join(process.cwd(), "drizzle", "0000_init.sql");
const raw = readFileSync(sqlPath, "utf8");
const statements = raw
  .split("--> statement-breakpoint")
  .map((s) => s.trim())
  .filter(Boolean);

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const client = postgres(url, { max: 1 });

async function main() {
  for (const statement of statements) {
    await client.unsafe(statement);
  }
  console.log("Migrations applied.");
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
