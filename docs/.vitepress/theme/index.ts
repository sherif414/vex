import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "virtual:uno.css";
import "./style.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {},
} satisfies Theme;
