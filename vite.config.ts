import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// Removido: jsxLocPlugin (causava erro)

export default defineConfig({
  plugins: [react(), tailwindcss()], // Apenas os plugins essenciais
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Adicionei isso para evitar o aviso de tamanho de arquivo que você viu antes
    chunkSizeWarningLimit: 1000, 
  },
  server: {
    host: true,
    // Limpeza: removidos os domínios do manus. Basta permitir localhost e rede local.
    allowedHosts: ["localhost", "127.0.0.1"], 
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
