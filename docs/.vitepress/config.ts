import { defineConfig } from "vitepress";
import Unocss from "unocss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  title: "Vex UI",
  description:
    "A Vue 3 component library focused on accessibility and developer experience",

  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Components", link: "/components/accordion" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Introduction",
          items: [
            { text: "Getting Started", link: "/guide/getting-started" },
            { text: "Installation", link: "/guide/installation" },
          ],
        },
      ],
      "/components/": [
        {
          text: "Components",
          items: [
            { text: "Accordion", link: "/components/accordion" },
            { text: "Avatar", link: "/components/avatar" },
            { text: "Autocomplete", link: "/components/autocomplete" },
            // Add more components here
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/your-org/vex-ui" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present",
    },
  },

  vite: {
    plugins: [Unocss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("../../src", import.meta.url)),
      },
    },
  },
});
