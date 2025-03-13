<script lang="ts">
export interface AutocompleteListProps {
  /** HTML element to render as. @default 'ul' */
  as?: string
  /** Floating UI placement of the list relative to input. @default 'bottom-start' */
  placement?: Placement
  /** Space between input and list in pixels. @default 4 */
  offset?: number
  /** Whether multiple items can be selected. @default false */
  multiselectable?: boolean
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components"
import { useClickOutside, useEscapeKey, useFloating } from "@/composables"
import type { Placement } from "@floating-ui/dom"
import { useAutocompleteContext } from "./Autocomplete.vue"
import { onMounted, ref, watch } from "vue"

const props = withDefaults(defineProps<AutocompleteListProps>(), {
  as: "ul",
  placement: "bottom-start",
  offset: 4,
  multiselectable: false,
})

const currentFocusIndex = ref(-1)
const listItems = ref<HTMLElement[]>([])

const { isVisible, listEl, inputEl, listElementID, inputElementID, hide } =
  useAutocompleteContext("AutocompleteList")

// Setup floating UI
const { floatingStyles } = useFloating(inputEl, listEl, isVisible, {
  placement: () => props.placement,
  offset: props.offset,
  autoMinWidth: true,
})

useClickOutside(listEl, hide, { ignore: [inputEl] })
useEscapeKey(hide)

// Handle keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  if (!isVisible.value) return

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault()
      if (currentFocusIndex.value < listItems.value.length - 1) {
        currentFocusIndex.value++
      } else {
        currentFocusIndex.value = 0 // Wrap to first item
      }
      break
    case "ArrowUp":
      e.preventDefault()
      if (currentFocusIndex.value > 0) {
        currentFocusIndex.value--
      } else {
        currentFocusIndex.value = listItems.value.length - 1 // Wrap to last item
      }
      break
    case "Home":
      e.preventDefault()
      currentFocusIndex.value = 0
      break
    case "End":
      e.preventDefault()
      currentFocusIndex.value = listItems.value.length - 1
      break
  }

  listItems.value[currentFocusIndex.value]?.focus()
}

// Reset focus when list visibility changes
watch(isVisible, (visible) => {
  if (!visible) {
    currentFocusIndex.value = -1
  }
})

onMounted(() => {
  if (listEl.value) {
    listEl.value.addEventListener("keydown", handleKeyDown)
  }
})
</script>

<template>
  <Primitive
    tabindex="0"
    :as="props.as"
    v-show="isVisible"
    ref="listEl"
    role="listbox"
    :id="listElementID"
    :aria-labelledby="inputElementID"
    :aria-multiselectable="multiselectable"
    :style="floatingStyles">
    <slot
      :setListItems="(items: HTMLElement[]) => (listItems = items)"
      :currentFocusIndex="currentFocusIndex"></slot>
  </Primitive>
</template>
