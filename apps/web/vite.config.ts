import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Editör /studio/ altında çalışır; kök adres tanıtım sitesidir (apps/site).
  base: "/studio/",
  build: { target: "es2022", outDir: "dist/studio", emptyOutDir: true },
});
