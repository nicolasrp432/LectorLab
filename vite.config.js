import { defineConfig } from "vite";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/** Busca todos los index.html/404.html generados para el build multipágina. */
function htmlInputs(dir = ".", found = {}) {
  for (const name of readdirSync(dir)) {
    if (["node_modules", "dist", "public", "src", "scripts", "docs", "tests", ".git", ".wrangler"].includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) htmlInputs(full, found);
    else if (name === "index.html" || name === "404.html") {
      const key = relative(".", full).replace(/\/?index\.html$/, "").replace(/\.html$/, "") || "home";
      found[key] = full;
    }
  }
  return found;
}

export default defineConfig({
  // Wrangler necesita encontrar un array `plugins` en este archivo.
  plugins: [],
  build: { rollupOptions: { input: htmlInputs() } },
  server: { allowedHosts: ["terminal.local"] },
  preview: { allowedHosts: ["terminal.local"] },
});
