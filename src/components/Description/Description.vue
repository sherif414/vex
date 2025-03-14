<script lang="ts">
export interface DescriptionProps {
  as?: string
  id?: string
}
</script>
<script setup lang="ts">
import { computed } from "vue"
import { useFieldContext } from "../field/Field.vue"

const props = withDefaults(defineProps<DescriptionProps>(), {
  as: "div",
})

const context = useFieldContext()
const descriptionID = computed(() => props.id || context?.descriptionID)
</script>

<template>
  <div :id="descriptionID" :data-disabled="context?.disabled">
    <slot />
  </div>
</template>
