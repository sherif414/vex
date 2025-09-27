<script lang="ts">
/**
 * Public props accepted by `AccordionContent`.
 */
export interface AccordionContentProps {
  /**
   * The HTML element to render as.
   * @default 'div'
   */
  as?: string
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components"
import { useAccordionItemCtx } from "./AccordionItem.vue"

const props = withDefaults(defineProps<AccordionContentProps>(), {
  as: "div",
})

// IDs come from the parent `AccordionItem` and are used for ARIA relationships
const { contentID, triggerID } = useAccordionItemCtx("AccordionContent")
</script>

<template>
  <!--
    The content is labelled by its associated trigger. `role="region"` improves
    screen reader navigation for complex pages.
  -->
  <Primitive :as="props.as" :id="contentID" role="region" :aria-labelledby="triggerID">
    <slot />
  </Primitive>
</template>
