<script lang="ts">
export interface LabelProps {
  /** HTML element to render as. @default 'label' */
  as?: string
  /** Whether the label focuses the form control element when clicked */
  passive?: boolean
  /** the id for the input element */
  for?: string
  /** the id for the label element */
  id?: string
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components"
import { computed } from "vue"
import { useFieldContext } from "../field/Field.vue"

const props = withDefaults(defineProps<LabelProps>(), {
  as: "label",
})

const context = useFieldContext()
const inputID = computed(() => props.for ?? context?.inputID)
const labelID = computed(() => props.id ?? context?.labelID)

const handleClick = (e: MouseEvent) => {
  if (props.passive) {
    e.preventDefault()
    return
  }

  if (!inputID.value) return

  const inputEl = document.getElementById(inputID.value)
  if (inputEl) {
    e.preventDefault()

    const isDisabled =
      context?.disabled.value ?? inputEl.getAttribute("disabled") ?? inputEl.ariaDisabled
    if (isDisabled === true || isDisabled === "true" || isDisabled === "") return

    inputEl.focus({ preventScroll: true })
    if (["radio", "checkbox", "switch"].includes(inputEl.role || "")) {
      inputEl.click()
    }
  }
}
</script>

<template>
  <Primitive
    :as="props.as"
    :id="labelID"
    :for="inputID"
    :data-disabled="context?.disabled.value || undefined"
    @click="handleClick"
  >
    <slot />
  </Primitive>
</template>
