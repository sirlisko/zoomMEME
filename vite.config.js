import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  publicDir: "../public",
  build: { outDir: "../dist", emptyOutDir: true },
  test: { environment: "jsdom", globals: true },
});
