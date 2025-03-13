<script lang="ts">
export interface AccordionHeaderProps {
  /** The HTML element to render as. @default 'h3' */
  as?: string
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components"
import { useAccordionCtx } from "./Accordion.vue"

const props = withDefaults(defineProps<AccordionHeaderProps>(), {
  as: "h3",
})

useAccordionCtx("AccordionHeader")
</script>

<template>
  <Primitive :as="props.as">
    <slot />
  </Primitive>
</template>
