<script lang="ts">
export interface ComboboxInputProps {
  label?: string
  labelledBy?: string
  description?: string
  required?: boolean
  invalid?: boolean
  pageSize?: number
  persistHighlight?: boolean
  displayValue?: (textContent: string) => string
}
</script>

<script setup lang="ts">
import { useEventListener, useKeyIntent } from "@/composables"
import { useClick } from "v-float"
import { nextTick, onMounted, watch } from "vue"
import { useComboboxContext } from "./Combobox.vue"

const props = withDefaults(defineProps<ComboboxInputProps>(), {
  pageSize: 5,
  persistHighlight: false,
})

const {
  ids: { triggerID, listboxID },
  els: { triggerEl, listboxEl, dropdownEl },
  state: {
    isVisible,
    highlightedIndex,
    activeDescendentID,
    orientation,
    listItems,
    scrollBehavior,
  },
  flags: { multiselect, showOnFocus, disabled, readonly },
  selection: { group },
  api: { show, hide },
  floating: { floating },
} = useComboboxContext("ComboboxInput")

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  modelValue.value = target.value
}

const modelValue = defineModel<string | undefined>()

useEventListener(triggerEl, "keydown", (e: KeyboardEvent) => {
  if (disabled.value || readonly.value) return

  if (e.key === "Enter") {
    if (!isVisible.value || highlightedIndex.value === -1) return

    e.preventDefault()
    const highlightedItem = listItems.value[highlightedIndex.value]
    if (!highlightedItem) return
    const value = highlightedItem.dataset.vexValue
    value && group.select(value)
    multiselect.value || hide()
  } else if (e.key === "Escape" || e.key === "Tab") {
    hide()
  } else if (e.key === "ArrowDown" && !isVisible.value) {
    e.preventDefault()
    e.stopImmediatePropagation()
    show()
  }
})

// virtual roving focus with aria-activedescendant
useKeyIntent(
  triggerEl,
  (e, intent) => {
    if (!isVisible.value || listItems.value.length === 0) return

    e.preventDefault()

    if (intent === "next") {
      highlightedIndex.value = Math.min(listItems.value.length - 1, highlightedIndex.value + 1)
      return
    }
    if (intent === "prev") {
      highlightedIndex.value = Math.max(0, highlightedIndex.value - 1)
      return
    }
    if (intent === "first") {
      highlightedIndex.value = 0
      return
    }
    if (intent === "last") {
      highlightedIndex.value = listItems.value.length - 1
      return
    }
  },
  { orientation },
)

watch(isVisible, async (visible) => {
  if (visible) {
    await nextTick()
    const hasSelectedValue = group.selected.value.length

    if (!hasSelectedValue || multiselect.value) {
      highlightedIndex.value = 0
      return
    }

    const selectedValue = group.selected.value[0]
    const selectedElement = listboxEl.value?.querySelector<HTMLElement>(
      `[role="option"][data-vex-value="${selectedValue}"]`,
    )

    // Default to first item if selected element not found
    highlightedIndex.value = selectedElement ? listItems.value.indexOf(selectedElement) : 0
  } else {
    highlightedIndex.value = -1
    await nextTick()
    modelValue.value = getSelectedLabel()
  }
})

onMounted(() => {
  watch(
    group.selected,
    () => {
      if (multiselect.value) return
      modelValue.value = getSelectedLabel()
    },
    { immediate: true },
  )
})

useClick(floating, {
  outsideClick: true,
  toggle: false,
  ignoreMouse: true,
  ignoreKeyboard: true,
  onOutsideClick: () => {
    hide()
  },
})

watch(highlightedIndex, (index) => {
  if (index === -1 || !isVisible.value) return

  nextTick(() => {
    const highlightedItem = listItems.value[index]
    if (!highlightedItem || !listboxEl.value) return

    highlightedItem.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: scrollBehavior.value,
    })
  })
})

function handleFocus() {
  if (showOnFocus.value) {
    show()
  }
}

function getSelectedLabel(): string | undefined {
  if (!group.selected.value.length) return undefined
  const selectedValue = group.selected.value[0]
  const selectedElement = listboxEl.value?.querySelector<HTMLElement>(
    `[role="option"][data-vex-value="${selectedValue}"]`,
  )
  const textContent = selectedElement?.dataset.vexTextContent
  if (!textContent) return undefined
  return props.displayValue ? props.displayValue(textContent) : textContent
}

function handleBlur(event: FocusEvent) {
  const relatedTarget = event.relatedTarget as HTMLElement
  const isWithinDropdown = dropdownEl.value?.contains(relatedTarget)
  const isInput = triggerEl.value === relatedTarget

  if (!isWithinDropdown && !isInput) {
    hide()
  }
}
</script>

<template>
  <input
    ref="triggerEl"
    role="combobox"
    aria-autocomplete="list"
    aria-haspopup="listbox"
    :aria-activedescendant="activeDescendentID"
    :aria-controls="listboxID"
    :aria-expanded="isVisible"
    :id="triggerID"
    :value="modelValue"
    :aria-labelledby="props.labelledBy"
    :aria-describedby="props.description"
    :aria-required="props.required"
    :aria-invalid="props.invalid"
    :disabled="disabled"
    :readonly="readonly"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>
