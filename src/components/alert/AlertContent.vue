<script lang="ts">
export interface AlertContentProps {
  /** The HTML element to render as. @default 'div' */
  as?: string
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components"
import { useAlertContext } from "./Alert.vue"

const props = withDefaults(defineProps<AlertContentProps>(), {
  as: "div",
})

const { contentID } = useAlertContext("AlertContent")
</script>

<template>
  <Primitive :as="props.as" :id="contentID">
    <slot />
  </Primitive>
</template>
