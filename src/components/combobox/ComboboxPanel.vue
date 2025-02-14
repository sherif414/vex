<script lang="ts">
export interface ComboboxPanelProps {
  /** HTML element to render as. @default 'div' */
  as?: string;
  /** Floating UI placement of the list relative to input. @default 'bottom-start' */
  placement?: Placement;
  /** Space between input and list in pixels. @default 4 */
  offset?: number;
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import { useComboboxContext } from "./Combobox.vue";
import { useFloating } from "@/composables";
import { ref } from "vue";
import type { Placement } from "@floating-ui/dom";

const props = withDefaults(defineProps<ComboboxPanelProps>(), {
  as: "div",
  placement: "bottom-start",
  offset: 4,
});

const panelEl = ref<HTMLElement | null>(null);
const { isVisible, triggerEl } = useComboboxContext("ComboboxPanel");
const { floatingStyles } = useFloating(triggerEl, panelEl, isVisible, {
  autoMinWidth: true,
  placement: () => props.placement,
  offset: props.offset,
});
</script>

<template>
  <Primitive :as="props.as" ref="panelEl" :style="floatingStyles">
    <slot></slot>
  </Primitive>
</template>
