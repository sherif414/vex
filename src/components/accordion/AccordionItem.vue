<script lang="ts">
export interface AccordionItemProps {
  /** Force the item to stay expanded. @default false */
  alwaysExpanded?: boolean;
  /** Whether the item should be expanded when first rendered. @default false */
  initiallyExpanded?: boolean;
  /** Whether the item is disabled. @default false */
  disabled?: boolean;
  /** A unique value for the accordion item. If not provided, an auto-generated ID will be used. */
  value?: string;
  /** The HTML element to render as. @default 'div' */
  as?: string;
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import { useID } from "@/composables";
import { computed, provide } from "vue";
import { useAccordionCtx, ACCORDION_ITEM_INJECTION_KEY } from "./Accordion.vue";

const props = withDefaults(defineProps<AccordionItemProps>(), {
  alwaysExpanded: false,
  initiallyExpanded: false,
  disabled: false,
  as: "div",
});

const { group } = useAccordionCtx("AccordionItem");
const contentID = useID();
const triggerID = useID();
const itemValue = computed(() => props.value ?? triggerID);

if (props.initiallyExpanded) {
  group.select(itemValue.value);
}

const isExpanded = computed(() =>
  props.alwaysExpanded ? true : group.isSelected(itemValue.value)
);

provide(ACCORDION_ITEM_INJECTION_KEY, {
  contentID,
  triggerID,
  isExpanded,
  disabled: () => props.disabled,
  toggleExpansion: () => {
    if (props.disabled) return;
    group.select(itemValue.value);
  },
});
</script>

<template>
  <Primitive :as="props.as">
    <slot :expanded="isExpanded" />
  </Primitive>
</template>
