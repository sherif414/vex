<script lang="ts">
import {
  type SelectionGroup,
  useContext,
  useSelectionGroup,
} from "@/composables";
import { type InjectionKey, provide, Ref, ref } from "vue";

export interface ComboboxRootProps {
  modelValue?: string[];
  disabled?: boolean;
  multiselect?: boolean;
  deselectOnReselect?: boolean;
  as?: string;
}

export const COMBOBOX_INJECTION_KEY = Symbol() as InjectionKey<{
  isOpen: Ref<boolean>;
  toggle: () => void;
  group: SelectionGroup<string>;
}>;

export function useComboboxContext(componentName: string) {
  return useContext(COMBOBOX_INJECTION_KEY, "Combobox", componentName);
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";

const props = withDefaults(defineProps<ComboboxRootProps>(), {
  modelValue: () => [],
  as: "div",
});

defineEmits<{
  "update:modelValue": [value: string[]];
}>();

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const modelValue = defineModel<string[]>({ default: [] });

const group = useSelectionGroup(modelValue, {
  deselectOnReselect: () => props.deselectOnReselect,
  multiselect: () => props.multiselect,
});

provide(COMBOBOX_INJECTION_KEY, {
  isOpen,
  toggle,
  group,
});
</script>

<template>
  <Primitive :as="props.as">
    <slot></slot>
  </Primitive>
</template>
