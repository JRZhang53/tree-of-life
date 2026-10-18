import { defineConfig } from "vite";

export default defineConfig({
  base: "/fun/tree-of-life/",
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: { outDir: "dist", emptyOutDir: true },
});
