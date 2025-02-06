<script lang="ts">
export interface AutocompleteInputProps {
  modelValue?: string;
  label?: string;
  labelledBy?: string;
  description?: string;
  required?: boolean;
  invalid?: boolean;
  pageSize?: number;
}
</script>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";
import { useAutocompleteContext } from "./Autocomplete.vue";
import { useEventListener, useListHighlight } from "@/composables";

const props = withDefaults(defineProps<AutocompleteInputProps>(), {
  pageSize: 5,
  required: false,
  invalid: false,
});
const emit = defineEmits<{ "update:modelValue": [value?: string] }>();

// Store the last typed character and its timestamp for type-ahead
const lastChar = ref("");
const lastCharTime = ref(0);
const typeAheadTimeout = 1000; // ms

const {
  show,
  isVisible,
  inputElementID,
  inputEl,
  listElementID,
  highlightedIndex,
  collection,
  activeListItem,
  orientation,
} = useAutocompleteContext("AutocompleteInput");

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
  inputEl,
  collection.elements,
  highlightedIndex,
  (index) => {
    highlightedIndex.value = index;
  },
  { orientation }
);

watch(isVisible, (visible) => {
  if (!visible) {
    inputEl.value?.focus();
    highlightedIndex.value = -1;
  } else {
    nextTick(() => {
      // Set first item as active when list becomes visible
      if (collection.elements.value.length > 0) {
        highlightedIndex.value = 0;
      }
    });
  }
});

// Handle type-ahead functionality
function handleTypeAhead(char: string) {
  const now = Date.now();
  if (now - lastCharTime.value > typeAheadTimeout) {
    lastChar.value = char;
  } else {
    lastChar.value += char;
  }
  lastCharTime.value = now;

  // Find first matching option
  const searchText = lastChar.value.toLowerCase();
  const items = collection.items.value;
  const matchIndex = items.findIndex((item) =>
    item.label.value.toLowerCase().startsWith(searchText)
  );

  if (matchIndex !== -1) {
    highlightedIndex.value = matchIndex;
  }
}

// Handle keyboard navigation
useEventListener(inputEl, "keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
    activeListItem.value?.templateRef.value?.click();
    return;
  }

  if (e.altKey) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      show();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      isVisible.value = false;
    }
    return;
  }

  if (!isVisible.value) return;

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
    default:
      // Handle type-ahead for single characters
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        handleTypeAhead(e.key);
      }
  }
});
</script>

<template>
  <input
    ref="inputEl"
    role="combobox"
    aria-autocomplete="list"
    :aria-activedescendant="activeListItem?.uid"
    :aria-controls="listElementID"
    :aria-expanded="isVisible"
    :id="inputElementID"
    :value="props.modelValue"
    :aria-labelledby="props.labelledBy"
    :aria-describedby="props.description"
    :aria-required="props.required"
    :aria-invalid="props.invalid"
    @input="(e)=> emit('update:modelValue', (e.target as HTMLInputElement).value)"
    @keydown.down.prevent="show"
  />
</template>
