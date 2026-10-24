/**
 * Genera las páginas HTML del sitio a partir de src/data/catalog.js.
 * Se ejecuta automáticamente antes de `npm run dev` y `npm run build`.
 * Los HTML generados están en .gitignore: edita las plantillas en scripts/site/.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { allPages } from "./site/pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pages = allPages();

for (const { path, html } of pages) {
  const out = join(root, path);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html.replace(/[ \t]+$/gm, ""), "utf8");
}
console.log(`✓ ${pages.length} páginas generadas`);
