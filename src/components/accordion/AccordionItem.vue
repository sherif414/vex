<script lang="ts">
export interface AccordionItemProps {
  /** Force the item to stay expanded. @default false */
  alwaysExpanded?: boolean;
  /** Whether the item should be expanded when first rendered. @default false */
  initiallyExpanded?: boolean;
  /** Whether the item is disabled. @default false */
  disabled?: boolean;
  /** Whether the item can be collapsed. @default false */
  collapsible?: boolean;
  /** A unique value for the accordion item. If not provided, an auto-generated ID will be used. */
  value?: string;
  /** The HTML element to render as. @default 'div' */
  as?: string;
}

export const ACCORDION_ITEM_INJECTION_KEY = Symbol() as InjectionKey<{
  contentID: string;
  triggerID: string;
  disabled: Ref<boolean>;
  isExpanded: Ref<boolean>;
  expand: () => void;
  collapse: () => void;
}>;

export function useAccordionItemCtx(component: string) {
  return useContext(ACCORDION_ITEM_INJECTION_KEY, "AccordionItem", component);
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import { useContext, useID } from "@/composables";
import { computed, onBeforeUnmount, provide, ref, toRef, type InjectionKey, type Ref } from "vue";
import { useAccordionCtx } from "./Accordion.vue";

const props = withDefaults(defineProps<AccordionItemProps>(), {
  alwaysExpanded: false,
  initiallyExpanded: false,
  disabled: false,
  as: "div",
});

const emit = defineEmits<{
  expand: [];
  collapse: [];
}>();

const { group, collection } = useAccordionCtx("AccordionItem");
const contentID = useID();
const triggerID = useID();
const itemValue = computed(() => props.value ?? triggerID);
const templateRef = ref<HTMLElement | null>(null);

const collectionItem = collection.register({
  templateRef,
  triggerID,
  id: itemValue.value,
});

onBeforeUnmount(() => {
  collection.unregister(collectionItem);
});

if (props.initiallyExpanded) {
  group.select(itemValue.value);
}

const isExpanded = computed(() => props.alwaysExpanded || group.isSelected(itemValue.value));

const expand = () => {
  if (props.disabled || isExpanded.value) return;
  group.select(itemValue.value);
  emit("expand");
};

const collapse = () => {
  if (!props.collapsible || props.disabled || !isExpanded.value) return;
  group.deselect(itemValue.value);
  emit("collapse");
};

provide(ACCORDION_ITEM_INJECTION_KEY, {
  contentID,
  triggerID,
  isExpanded,
  disabled: toRef(() => props.disabled),
  expand,
  collapse,
});
</script>

<template>
  <Primitive :as="props.as" ref="templateRef">
    <slot :expanded="isExpanded" :expand="expand" :collapse="collapse" />
  </Primitive>
</template>
