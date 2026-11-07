import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The editor runs under /studio/; the root address is the marketing site (apps/site).
  base: "/studio/",
  build: { target: "es2022", outDir: "dist/studio", emptyOutDir: true },
});
