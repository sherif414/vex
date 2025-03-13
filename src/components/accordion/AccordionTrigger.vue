<script lang="ts">
export interface AccordionTriggerProps {
  /** The HTML element to render as. @default 'button' */
  as?: string
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components"
import { useAccordionItemCtx } from "./AccordionItem.vue"

const props = withDefaults(defineProps<AccordionTriggerProps>(), {
  as: "button",
})

const { expand, collapse, contentID, isExpanded, triggerID, disabled } =
  useAccordionItemCtx("AccordionTrigger")
function onClick() {
  if (isExpanded.value) {
    collapse()
  } else {
    expand()
  }
}
</script>

<template>
  <Primitive
    :as="props.as"
    :id="triggerID"
    :type="props.as === 'button' ? 'button' : undefined"
    tabindex="0"
    :disabled="disabled"
    @click="onClick"
    :aria-controls="contentID"
    :aria-expanded="isExpanded">
    <slot />
  </Primitive>
</template>
