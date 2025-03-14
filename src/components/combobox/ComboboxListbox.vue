<script lang="ts">
export interface ComboboxListboxProps {
  as?: string
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components"
import { useEventListener } from "@/composables"
import { useComboboxContext } from "./Combobox.vue"

const props = withDefaults(defineProps<ComboboxListboxProps>(), {
  as: "ul",
})

const { triggerID, listboxEl, listboxID, group, multiselect, hide, listItems } =
  useComboboxContext("ComboboxListbox")

// Event delegation for clicks
useEventListener(listboxEl, "click", (e) => {
  const target = e.target as HTMLElement
  const option = target.closest<HTMLElement>('[role="option"]:not([aria-disabled="true"])')
  const value = option?.dataset.vexValue

  if (value) {
    group.select(value)
    const multi = multiselect.value
    if (!multi) hide()
  }
})
</script>

<template>
  <Primitive
    :as="props.as"
    ref="listboxEl"
    role="listbox"
    :id="listboxID"
    :aria-labelledby="triggerID"
    tabindex="-1"
  >
    <slot></slot>
  </Primitive>
</template>
