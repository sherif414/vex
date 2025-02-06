<script lang="ts">
export interface ComboboxRootProps {
  modelValue?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  invalid?: boolean;
  loading?: boolean;
  label?: string;
  description?: string;
}
</script>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useCombobox } from './ComboboxContext';
import { useEventListener } from '@/composables';

const props = withDefaults(defineProps<ComboboxRootProps>(), {
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
  loading: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>();

// Internal state
const inputValue = ref('');
const {
  triggerEl,
  listboxEl,
  triggerID,
  listboxID,
  group,
  collection,
  showDropdown,
  hideDropdown,
  isDropdownVisible,
  highlightedIndex
} = useCombobox({
  onSelect: (value) => {
    if (value !== undefined) {
      emit('update:modelValue', value);
      inputValue.value = value;
      hideDropdown();
    }
  },
  hideDelay: 150
});

// Sync v-model with internal state
watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined) {
    inputValue.value = newValue;
  }
});

// Handle keyboard navigation
useEventListener(triggerEl, 'keydown', (e: KeyboardEvent) => {
  if (props.disabled || props.readonly) return;

  switch (e.key) {
    case 'Enter':
      e.preventDefault();
      if (isDropdownVisible.value && highlightedIndex.value !== -1) {
        const elements = collection.elements.value;
        if (elements[highlightedIndex.value]) {
          const item = collection.getItem(elements[highlightedIndex.value].id);
          if (item) {
            group.select(item.value);
          }
        }
      }
      break;
    case 'Escape':
      e.preventDefault();
      hideDropdown();
      break;
    case 'ArrowDown':
      e.preventDefault();
      if (!isDropdownVisible.value) {
        showDropdown();
      }
      break;
    case 'Tab':
      if (isDropdownVisible.value) {
        hideDropdown();
      }
      break;
  }
});

// Handle dropdown visibility
watch(isDropdownVisible, (visible) => {
  if (visible) {
    nextTick(() => {
      highlightedIndex.value = 0;
    });
  } else {
    highlightedIndex.value = -1;
  }
});

// Expose context to template
defineExpose({
  triggerEl,
  listboxEl,
  triggerID,
  listboxID,
  isDropdownVisible
});
</script>

<template>
  <div
    class="vex-combobox"
    :data-disabled="props.disabled"
    :data-readonly="props.readonly"
    :data-invalid="props.invalid"
  >
    <slot
      :trigger-id="triggerID"
      :listbox-id="listboxID"
      :is-visible="isDropdownVisible"
      :highlighted-index="highlightedIndex"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :required="props.required"
      :invalid="props.invalid"
      :loading="props.loading"
      :label="props.label"
      :description="props.description"
    />
  </div>
</template>