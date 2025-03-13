<script lang="ts">
export interface AccordionContentProps {
  /** The HTML element to render as. @default 'div' */
  as?: string
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components"
import { useAccordionItemCtx } from "./AccordionItem.vue"

const props = withDefaults(defineProps<AccordionContentProps>(), {
  as: "div",
})

const { contentID, triggerID } = useAccordionItemCtx("AccordionContent")
</script>

<template>
  <Primitive :as="props.as" :id="contentID" role="region" :aria-labelledby="triggerID">
    <slot />
  </Primitive>
</template>
