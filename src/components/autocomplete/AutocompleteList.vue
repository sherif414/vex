<script lang="ts">
export interface AutocompleteListProps {
  /** HTML element to render as. @default 'ul' */
  as?: string;
  /** Floating UI placement of the list relative to input. @default 'bottom-start' */
  placement?: Placement;
  /** Space between input and list in pixels. @default 4 */
  offset?: number;
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import { useClickOutside, useEscapeKey, useFloating } from "@/composables";
import type { Placement } from "@floating-ui/dom";
import { useAutocompleteContext } from "./Autocomplete.vue";

const props = withDefaults(defineProps<AutocompleteListProps>(), {
  as: "ul",
  placement: "bottom-start",
  offset: 4,
});

const { isVisible, listEl, inputEl, listElementID, inputElementID, hide } =
  useAutocompleteContext("AutocompleteList");

// Setup floating UI
const { floatingStyles } = useFloating(inputEl, listEl, isVisible, {
  placement: () => props.placement,
  offset: props.offset,
  autoMinWidth: true,
});

useClickOutside(listEl, hide);
useEscapeKey(hide);
</script>

<template>
  <Primitive
    tabindex="0"
    :as="props.as"
    v-if="isVisible"
    ref="listEl"
    role="listbox"
    :id="listElementID"
    :aria-labelledby="inputElementID"
    :style="floatingStyles"
  >
    <slot></slot>
  </Primitive>
</template>
