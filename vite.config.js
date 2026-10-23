import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  server: { allowedHosts: ["terminal.local"] },
  preview: { allowedHosts: ["terminal.local"] },
});
