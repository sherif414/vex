<script lang="ts">
export interface ComboboxInputProps {
  modelValue?: string;
  label?: string;
  labelledBy?: string;
  description?: string;
  required?: boolean;
  invalid?: boolean;
  pageSize?: number;
  disabled?: boolean;
  readonly?: boolean;
  persistHighlight?: boolean;
}
</script>

<script setup lang="ts">
import { useEventListener, useKeyIntent } from "@/composables";
import { nextTick, watch, ref } from "vue";
import { useComboboxContext } from "./ComboboxContext";
import { onClickOutside } from "@vueuse/core";

const props = withDefaults(defineProps<ComboboxInputProps>(), {
  pageSize: 5,
  persistHighlight: false,
});

const emit = defineEmits<{ "update:modelValue": [value?: string] }>();

const {
  triggerID,
  triggerEl,
  listboxID,
  listboxEl,
  isVisible,
  show,
  hide,
  group,
  highlightedIndex,
  activeDescendentID,
  orientation,
  listItems,
} = useComboboxContext("ComboboxInput");

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

useEventListener(triggerEl, "keydown", (e: KeyboardEvent) => {
  if (props.disabled || props.readonly) return;

  if (e.key === "Enter") {
    if (!isVisible.value || highlightedIndex.value === -1) return;

    e.preventDefault();
    const highlightedItem = listItems.value[highlightedIndex.value];
    if (!highlightedItem) return;
    const value = highlightedItem.dataset.vexValue;
    value && group.select(value);
  } else if (e.key === "Escape" || e.key === "Tab") {
    hide();
  } else if (e.key === "ArrowDown" && !isVisible.value) {
    e.preventDefault();
    e.stopImmediatePropagation();
    show();
  }
});

// virtual roving focus with aria-activedescendant
useKeyIntent(
  triggerEl,
  (e, intent) => {
    if (!isVisible.value || listItems.value.length === 0) return;

    e.preventDefault();

    if (intent === "next") {
      highlightedIndex.value = Math.min(
        listItems.value.length - 1,
        highlightedIndex.value + 1
      );
      return;
    }
    if (intent === "prev") {
      highlightedIndex.value = Math.max(0, highlightedIndex.value - 1);
      return;
    }
    if (intent === "first") {
      highlightedIndex.value = 0;
      return;
    }
    if (intent === "last") {
      highlightedIndex.value = listItems.value.length - 1;
      return;
    }
  },
  { orientation }
);

const lastHighlightedIndex = ref(-1);

// Update last valid index when highlight changes and dropdown is visible
watch(highlightedIndex, (index) => {
  if (index !== -1 && isVisible.value) {
    lastHighlightedIndex.value = index;
  }
});

// Handle dropdown visibility
watch(isVisible, (visible) => {
  if (visible) {
    nextTick(() => {
      if (
        props.persistHighlight &&
        lastHighlightedIndex.value !== -1 &&
        lastHighlightedIndex.value < listItems.value.length
      ) {
        highlightedIndex.value = lastHighlightedIndex.value;
      } else {
        highlightedIndex.value = 0;
      }
    });
  } else {
    highlightedIndex.value = -1;
  }
});

onClickOutside(listboxEl, hide, { ignore: [triggerEl] });

// Add scroll into view behavior when highlighted item changes
watch(highlightedIndex, (index) => {
  if (index === -1 || !isVisible.value) return;

  nextTick(() => {
    const highlightedItem = listItems.value[index];
    if (!highlightedItem || !listboxEl.value) return;

    highlightedItem.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  });
});
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
    :value="props.modelValue"
    :aria-labelledby="props.labelledBy"
    :aria-describedby="props.description"
    :aria-required="props.required"
    :aria-invalid="props.invalid"
    @input="handleInput"
  />
</template>
