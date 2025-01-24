import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "virtual:uno.css";
import "./style.css";

// Component demos
import AccordionDemo from "../../components/demos/AccordionDemo.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register demo components
    app.component("AccordionDemo", AccordionDemo);
  },
} satisfies Theme;
