<script lang="ts">
export interface ComboboxInputProps {
  modelValue?: string;
  label?: string;
  labelledBy?: string;
  description?: string;
  required?: boolean;
  invalid?: boolean;
  pageSize?: number;
  persistHighlight?: boolean;
}
</script>

<script setup lang="ts">
import { useEventListener, useKeyIntent } from "@/composables";
import { onClickOutside } from "@vueuse/core";
import { nextTick, watch } from "vue";
import { useComboboxContext } from "./Combobox.vue";

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
  multiselect,
  scrollBehavior,
  showOnFocus,
  disabled,
  readonly,
} = useComboboxContext("ComboboxInput");

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

useEventListener(triggerEl, "keydown", (e: KeyboardEvent) => {
  if (disabled.value || readonly.value) return;

  if (e.key === "Enter") {
    if (!isVisible.value || highlightedIndex.value === -1) return;

    e.preventDefault();
    const highlightedItem = listItems.value[highlightedIndex.value];
    if (!highlightedItem) return;
    const value = highlightedItem.dataset.vexValue;
    value && group.select(value);
    multiselect.value || hide();
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

// Handle dropdown visibility
watch(isVisible, (visible) => {
  if (visible) {
    nextTick(() => {
      const hasSelectedValue = group.selected.value.length;
      if (!hasSelectedValue || multiselect.value) {
        highlightedIndex.value = 0;
      } else {
        const el = listboxEl.value?.querySelector<HTMLElement>(
          `[role="option"][data-vex-value="${group.selected.value[0]}"]`
        );
        highlightedIndex.value = el ? listItems.value.indexOf(el) ?? 0 : 0;
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
      behavior: scrollBehavior.value,
    });
  });
});

function handleFocus() {
  if (showOnFocus.value) {
    show();
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
    :value="props.modelValue"
    :aria-labelledby="props.labelledBy"
    :aria-describedby="props.description"
    :aria-required="props.required"
    :aria-invalid="props.invalid"
    :disabled="disabled"
    :readonly="readonly"
    @input="handleInput"
    @focus="handleFocus"
    @blur="hide"
  />
</template>
