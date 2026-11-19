// gta6-meme-x-01 entrypoint: hands the post address to the gate.
//
// The entry is the X post itself. This program only carries POST.json
// (which names the post) from the repository root into the output
// directory, where the house reads it and builds the judge's dossier
// from the post. Nothing else is written, so the run is deterministic.
//
// Node 22, standard library only. No network, no clock, no files
// outside the repository.
//
// Local run: mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(botDir, "POST.json");
const target = join(outDir, "POST.json");

if (!existsSync(source)) {
  console.error(`POST.json not found in ${botDir}`);
  process.exit(1);
}

const raw = readFileSync(source, "utf8");

let post: unknown;
try {
  post = JSON.parse(raw);
} catch {
  console.error("POST.json is not valid JSON");
  process.exit(1);
}

if (
  typeof post !== "object" ||
  post === null ||
  typeof (post as { url?: unknown }).url !== "string"
) {
  console.error('POST.json must be an object with a string "url"');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(target, raw);
