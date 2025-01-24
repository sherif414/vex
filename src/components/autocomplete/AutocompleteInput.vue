<script lang="ts">
export interface AutocompleteInputProps {
  modelValue?: string;
}
</script>

<script lang="ts" setup>
import { computed, nextTick } from "vue";
import { useAutocompleteContext } from "./Autocomplete.vue";

const props = defineProps<AutocompleteInputProps>();
const emit = defineEmits<{ "update:modelValue": [value?: string] }>();

const {
  show,
  isVisible,
  inputElementID,
  inputEl,
  listElementID,
  highlighted,
  listEl,
} = useAutocompleteContext("AutocompleteInput");

const activateDescendentID = computed(() => {
  if (highlighted.value === -1) return undefined;
  const elements = listEl.value?.querySelectorAll("[role=option]");
  return elements?.[highlighted.value].id ?? undefined;
});

function onKeyDown() {
  show();
  nextTick(() => {
    listEl.value?.focus();
  });
}
</script>

<template>
  <input
    ref="inputEl"
    role="combobox"
    aria-autocomplete="list"
    :aria-activedescendant="activateDescendentID"
    :aria-controls="listElementID"
    :aria-expanded="isVisible"
    :id="inputElementID"
    :value="props.modelValue"
    @input="(e)=> emit('update:modelValue', (e.target as HTMLInputElement).value)"
    @keydown.down.prevent="onKeyDown"
  />
</template>
