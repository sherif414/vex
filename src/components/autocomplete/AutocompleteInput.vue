<script lang="ts">
export interface AutocompleteInputProps {
  modelValue?: string;
}
</script>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";
import { useAutocompleteContext } from "./Autocomplete.vue";
import { useListHighlight } from "@/composables";

const props = defineProps<AutocompleteInputProps>();
const emit = defineEmits<{ "update:modelValue": [value?: string] }>();

const {
  show,
  isVisible,
  inputElementID,
  inputEl,
  listElementID,
  highlightedIndex,
  collection,
  activeListItem,
  group,
  hide,
  listEl,
  orientation,
} = useAutocompleteContext("AutocompleteInput");

watch(highlightedIndex, (index) => {
  if (index === -1 || collection.elements.value.length < index) {
    activeListItem.value = null;
  } else {
    const element = collection.elements.value[index];
    activeListItem.value = collection.getItem(element.id) ?? null;
  }
});

// Setup keyboard navigation with callback
useListHighlight(
  listEl,
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
    @input="(e)=> emit('update:modelValue', (e.target as HTMLInputElement).value)"
    @keydown.down.prevent="show"
  />
</template>
