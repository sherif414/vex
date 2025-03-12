<script lang="ts">
interface MenuDropdownProps {
  placement?: Placement;
  autoMinWidth?: boolean;
  as?: string;
}

const MENU_DROPDOWN_CTX = Symbol() as InjectionKey<{
  collection: Collection;
}>;

export function useMenuDropdownContext(componentName: string) {
  return useContext(MENU_DROPDOWN_CTX, 'MenuDropdown', componentName);
}
</script>

<script setup lang="ts">
import {
  createCollection,
  useClickOutside,
  useContext,
  useEscapeKey,
  useFloating,
  useListHighlight,
} from "@/composables";
import { type Placement } from "@floating-ui/dom";
import { computed, provide, toValue, watch, type InjectionKey } from "vue";
import { Primitive } from "../primitive";
import { useMenuContext } from "./Menu.vue";
import type { Collection } from "@/composables/collection";

const props = withDefaults(defineProps<MenuDropdownProps>(), {
  placement: "bottom-start",
  as: "div",
});

const {
  dropdownEl,
  dropdownID,
  triggerEl,
  highlightedIndex,
  hide,
  triggerID,
  isVisible,
  orientation,
} = useMenuContext("MenuContent");

const collection = createCollection(dropdownID);

useListHighlight(dropdownEl, highlightedIndex, collection.elements, {
  orientation,
});

const { floatingStyles } = useFloating(triggerEl, dropdownEl, isVisible, {
  placement: () => props.placement,
  autoMinWidth: () => props.autoMinWidth,
  strategy: "absolute",
  offset: 4,
});

const activeDescendantID = computed(() => {
  const activeDescendant = collection.elements.value[highlightedIndex.value];
  return activeDescendant?.id;
});

watch(highlightedIndex, () => {
  if (highlightedIndex.value === -1 || !isVisible.value) return;
  const currentActiveElement = collection.elements.value[highlightedIndex.value];
  currentActiveElement?.focus();
});

provide(MENU_DROPDOWN_CTX, {
  collection,
});

function focusFirst() {
  const firstItem = collection.elements.value[0];
  firstItem?.focus();
}

useEscapeKey(hide);
useClickOutside(dropdownEl, hide, {
  ignore: [triggerEl],
});
</script>

<template>
  <Primitive
    v-if="isVisible"
    :as="props.as"
    :aria-orientation="toValue(orientation)"
    :id="dropdownID"
    :aria-labelledby="triggerID"
    :aria-active-descendant="activeDescendantID"
    :style="floatingStyles"
    @focus="focusFirst"
    role="menu"
    ref="dropdownEl"
    tabindex="-1"
  >
    <slot :hide="hide" />
  </Primitive>
</template>
