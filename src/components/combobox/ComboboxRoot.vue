<script lang="ts">
export interface ComboboxRootProps {
  modelValue: string[];
  disabled?: boolean;
  readonly?: boolean;
}
</script>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useCombobox } from "./ComboboxContext";

const props = withDefaults(defineProps<ComboboxRootProps>(), {
  modelValue: () => [],
});

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

// Internal state
const inputValue = ref("");
const {
  triggerEl,
  listboxEl,
  triggerID,
  listboxID,
  isVisible,
  highlightedIndex,
} = useCombobox(modelValue, {});

// Expose context to template
defineExpose({
  triggerEl,
  listboxEl,
  triggerID,
  listboxID,
  isVisible,
});
</script>

<template>
  <slot
    :trigger-id="triggerID"
    :listbox-id="listboxID"
    :is-visible="isVisible"
    :highlighted-index="highlightedIndex"
  />
</template>
