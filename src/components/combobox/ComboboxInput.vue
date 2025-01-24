<script lang="ts">
export interface ComboboxInputProps {
  modelValue?: string;
}
</script>

<script setup lang="ts">
import { useComboboxContext } from "./Combobox.vue";

const props = defineProps<ComboboxInputProps>();
const emit = defineEmits<{ "update:modelValue": [value?: string] }>();

const { toggle, isOpen } = useComboboxContext("ComboboxInput");

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (!isOpen.value) {
      toggle();
    }
  }
};
</script>

<template>
  <input
    :value="props.modelValue"
    @input="(e)=> emit('update:modelValue', (e.target as HTMLInputElement).value)"
    @click="toggle"
    @keydown="onKeyDown"
  />
</template>
