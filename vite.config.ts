import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import Unocss from "unocss/vite";
import { presetIcons } from "unocss";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), Unocss({})],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VexUI",
      fileName: "index",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
