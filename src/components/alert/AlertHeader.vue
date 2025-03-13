<script lang="ts">
export interface AlertHeaderProps {
  /** The HTML element to render as. @default 'div' */
  as?: string
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components"
import { useAlertContext } from "./Alert.vue"

const props = withDefaults(defineProps<AlertHeaderProps>(), {
  as: "div",
})

const { headerID } = useAlertContext("AlertHeader")
</script>

<template>
  <Primitive :as="props.as" :id="headerID">
    <slot />
  </Primitive>
</template>
