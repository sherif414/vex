<script lang="ts">
import type { SelectionGroup } from "@/composables";
import type { Collection } from "@/composables/collection";
import type { Getter } from "@/types";
import { InjectionKey, Ref } from "vue";
import { useContext } from "@/composables";

export const ACCORDION_INJECTION_KEY = Symbol("accordion") as InjectionKey<{
  group: SelectionGroup<string>;
  collection: Collection;
}>;

export const ACCORDION_ITEM_INJECTION_KEY = Symbol() as InjectionKey<{
  contentID: string;
  triggerID: string;
  disabled: Getter<boolean>;
  isExpanded: Ref<boolean>;
  toggleExpansion: () => void;
}>;

export function useAccordionCtx(component: string) {
  return useContext(ACCORDION_INJECTION_KEY, "Accordion", component);
}

export function useAccordionItemCtx(component: string) {
  return useContext(ACCORDION_ITEM_INJECTION_KEY, "AccordionItem", component);
}

export interface AccordionProps {
  /** Allow multiple items to be expanded at once. @default false */
  multiple?: boolean;
  /** The controlled expanded state of the accordion. */
  modelValue?: string[];
  /** Allow an expanded item to be collapsed by clicking its trigger again. @default false */
  deselectOnReselect?: boolean;
  /** The HTML element to render as. @default 'div' */
  as?: string;
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import {
  createCollection,
  useControllableState,
  useSelectionGroup,
} from "@/composables";
import { provide } from "vue";

const props = withDefaults(defineProps<AccordionProps>(), {
  multiple: false,
  modelValue: () => [],
  deselectOnReselect: false,
  as: "div",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

const collection = createCollection("vex-accordion-item");
const group = useSelectionGroup(
  useControllableState(() => props.modelValue, {
    setter: (value: string[]) => {
      emit("update:modelValue", value);
      return value;
    },
  }),
  {
    multiselect: () => props.multiple,
    deselectOnReselect: () => props.deselectOnReselect,
  }
);

provide(ACCORDION_INJECTION_KEY, { group, collection });
</script>

<template>
  <Primitive :as="props.as">
    <slot />
  </Primitive>
</template>
