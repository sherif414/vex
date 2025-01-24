<script lang="ts">
export interface AutocompleteListProps {
  /** HTML element to render as. @default 'ul' */
  as?: string;
  /** Floating UI placement of the list relative to input. @default 'bottom-start' */
  placement?: Placement;
  /** Space between input and list in pixels. @default 4 */
  offset?: number;
  /** Direction of keyboard navigation. @default 'vertical' */
  orientation?: "vertical" | "horizontal";
}

const AUTOCOMPLETE_LIST_INJECTION_KEY = Symbol() as InjectionKey<{
  collection: Collection;
}>;

export function useAutocompleteListContext(componentName: string) {
  return useContext(
    AUTOCOMPLETE_LIST_INJECTION_KEY,
    "AutocompleteList",
    componentName
  );
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import {
  createCollection,
  isUsingKeyboard,
  useClickOutside,
  useContext,
  useEscapeKey,
  useFloating,
  useListHighlight,
} from "@/composables";
import type { Collection } from "@/composables/collection";
import type { Placement } from "@floating-ui/dom";
import { InjectionKey, nextTick, onMounted, provide, watch } from "vue";
import { useAutocompleteContext } from "./Autocomplete.vue";

const props = withDefaults(defineProps<AutocompleteListProps>(), {
  as: "ul",
  orientation: "vertical",
  placement: "bottom-start",
  offset: 4,
});

const {
  isVisible,
  highlighted,
  listEl,
  inputEl,
  listElementID,
  inputElementID,
  hide,
} = useAutocompleteContext("AutocompleteList");

const collection = createCollection(listElementID);
provide(AUTOCOMPLETE_LIST_INJECTION_KEY, { collection });

// Setup keyboard navigation
useListHighlight(listEl, highlighted, collection.elements, {
  orientation: () => props.orientation,
});

watch(isVisible, (visible) => {
  if (!visible) {
    inputEl.value?.focus();
    highlighted.value = -1;
  } else {
    nextTick(focusFirst);
  }
});

watch(highlighted, (index) => {
  if (index === -1 || !isUsingKeyboard.value) return;
  const element = collection.elements.value[index];
  element?.focus();
});

function focusFirst() {
  highlighted.value = collection.elements.value.length > 0 ? 0 : -1;
}

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
    @focus.prevent="focusFirst"
  >
    <slot></slot>
  </Primitive>
</template>
