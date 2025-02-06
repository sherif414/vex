<script lang="ts">
export interface ComboboxInputProps {
  modelValue?: string;
  label?: string;
  labelledBy?: string;
  description?: string;
  required?: boolean;
  invalid?: boolean;
  pageSize?: number;
}
</script>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useComboboxContext } from "./ComboboxContext";
import { useEventListener, useListHighlight } from "@/composables";

const props = withDefaults(defineProps<ComboboxInputProps>(), {
  pageSize: 5,
  required: false,
  invalid: false,
});

const emit = defineEmits<{ "update:modelValue": [value?: string] }>();

const {
  triggerID,
  triggerEl,
  listboxID,
  listboxEl,
  isOpen,
  toggle,
  group,
  collection,
  highlightedIndex,
  activeListItem,
  orientation,
} = useComboboxContext("ComboboxInput");

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

watch(highlightedIndex, (index) => {
  if (index === -1 || collection.elements.value.length <= index) {
    activeListItem.value = null;
  } else {
    const element = collection.elements.value[index];
    activeListItem.value = collection.getItem(element.id) ?? null;
  }
});

// Setup keyboard navigation with callback
useListHighlight(
  triggerEl,
  collection.elements,
  highlightedIndex,
  (index) => {
    highlightedIndex.value = index;
  },
  { orientation }
);

watch(isOpen, (visible) => {
  if (!visible) {
    triggerEl.value?.focus();
    highlightedIndex.value = -1;
  } else {
    nextTick(() => {
      if (collection.elements.value.length > 0) {
        highlightedIndex.value = 0;
      }
    });
  }
});

// Handle keyboard navigation
useEventListener(triggerEl, "keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const item = activeListItem.value;
    if (item) {
      emit("update:modelValue", item.value);
      group.select(item.value);
      toggle();
    }
    return;
  }

  if (e.altKey) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      isOpen.value = false;
    }
    return;
  }

  if (!isOpen.value && e.key === "ArrowDown") {
    e.preventDefault();
    toggle();
    return;
  }

  if (!isOpen.value) return;

  switch (e.key) {
    case "Home":
      e.preventDefault();
      highlightedIndex.value = 0;
      break;
    case "End":
      e.preventDefault();
      highlightedIndex.value = collection.elements.value.length - 1;
      break;
    case "PageUp":
      e.preventDefault();
      highlightedIndex.value = Math.max(
        0,
        highlightedIndex.value - props.pageSize
      );
      break;
    case "PageDown":
      e.preventDefault();
      highlightedIndex.value = Math.min(
        collection.elements.value.length - 1,
        highlightedIndex.value + props.pageSize
      );
      break;
  }
});
</script>

<template>
  <input
    ref="triggerEl"
    role="combobox"
    aria-autocomplete="list"
    :aria-activedescendant="activeListItem?.uid"
    :aria-controls="listboxID"
    :aria-expanded="isOpen"
    :id="triggerID"
    :value="props.modelValue"
    :aria-labelledby="props.labelledBy"
    :aria-describedby="props.description"
    :aria-required="props.required"
    :aria-invalid="props.invalid"
    @input="handleInput"
    @click="toggle"
  />
</template>
