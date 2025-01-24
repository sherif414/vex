<script lang="ts">
export interface AccordionTriggerProps {
  /** The HTML element to render as. @default 'button' */
  as?: string;
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import { useAccordionItemCtx } from "./Accordion.vue";

const props = withDefaults(defineProps<AccordionTriggerProps>(), {
  as: "button",
});

const { toggleExpansion, contentID, isExpanded, triggerID, disabled } =
  useAccordionItemCtx("AccordionTrigger");
</script>

<template>
  <Primitive
    :as="props.as"
    :id="triggerID"
    type="button"
    :disabled="disabled()"
    @click="toggleExpansion"
    :aria-controls="contentID"
    :aria-expanded="isExpanded"
  >
    <slot />
  </Primitive>
</template>
