/// <reference types="vitest/config" />
import { URL, fileURLToPath } from "node:url"

import { resolve } from "node:path"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import Unocss from "unocss/vite"
import { defineConfig } from "vite"
// import { presetIcons } from "@unocss/preset-icons"
import DevTools from "vite-plugin-vue-devtools"

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), Unocss(), DevTools()],
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
  test: {
    globals: true,
    environment: "happy-dom",
    coverage: {
      reporter: ["text", "json", "html"],
    },
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
  },
})
