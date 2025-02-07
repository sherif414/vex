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
}
</script>

<script setup lang="ts">
import { useEventListener, useKeyIntent } from "@/composables";
import { nextTick, watch } from "vue";
import { useComboboxContext } from "./ComboboxContext";
import { onClickOutside } from "@vueuse/core";

const props = withDefaults(defineProps<ComboboxInputProps>(), {
  pageSize: 5,
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
} = useComboboxContext("ComboboxInput");

const getListItems = () => {
  return Array.from(
    listboxEl.value?.querySelectorAll<HTMLElement>('[role="option"]') ?? []
  );
};

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

useEventListener(triggerEl, "keydown", (e: KeyboardEvent) => {
  if (props.disabled || props.readonly) return;

  if (e.key === "Enter") {
    if (!isVisible.value || highlightedIndex.value === -1) return;

    e.preventDefault();
    const items = getListItems();
    const highlightedItem = items[highlightedIndex.value];
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
    const items = getListItems();
    if (!isVisible.value || items.length === 0) return;

    e.preventDefault();

    if (intent === "next") {
      highlightedIndex.value = Math.min(
        items.length - 1,
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
      highlightedIndex.value = items.length - 1;
      return;
    }
  },
  { orientation }
);

// Handle dropdown visibility
watch(isVisible, (visible) => {
  if (visible) {
    nextTick(() => {
      highlightedIndex.value = 0;
    });
  } else {
    highlightedIndex.value = -1;
  }
});

onClickOutside(listboxEl, hide, { ignore: [triggerEl] });
</script>

<template>
  <input
    ref="triggerEl"
    role="combobox"
    aria-autocomplete="list"
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
