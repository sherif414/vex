<script setup lang="ts">
import { createCollection, createSelectScope, useRovingFocus, useVModel } from "@/composables"
import type { Orientation } from "@/types"
import { ref } from "vue"

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * whether to allow multiple chips to be checked at the same time
     */
    multiselect?: boolean

    /**
     * specifies the currently checked chips, this should be a string array if
     * `multiselect` prop is set to true, and a string otherwise.
     */
    modelValue?: string | string[]

    /**
     * whether to allow deselecting chips when `multiselect` is false
     */
    deselection?: boolean

    /**
     * mainly used for keyboard navigation
     */
    orientation?: Orientation
  }>(),
  {
    orientation: "horizontal",
  },
)

defineEmits<(event: "update:modelValue", value?: typeof p.modelValue) => void>()

defineSlots<{
  default: (props: {}) => any
}>()

//----------------------------------------------------------------------------------------------------

const GroupEl = ref<HTMLElement | null>(null)

createSelectScope(
  useVModel(() => p.modelValue),
  {
    deselection: () => p.deselection,
    multiselect: () => p.multiselect,
  },
)

const { elements } = createCollection(GroupEl)

useRovingFocus(GroupEl, elements, {
  orientation: () => p.orientation,
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault()
    ;(e.target as HTMLElement)?.click()
  }
}
</script>

<template>
  <div ref="GroupEl" @keydown="onKeydown" tabindex="0" class="vex-chip-group">
    <slot />
  </div>
</template>
