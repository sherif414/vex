<script lang="ts">
import type { InjectionKey, Ref } from "vue";

interface CheckboxGroupProps {
  modelValue?: string[];
  name?: string;
  disabled?: boolean;
}
export interface CheckboxItem {
  value: Ref<string>;
  checked: Ref<boolean>;
  disabled: Ref<boolean>;
}

export type CheckedState = "checked" | "unchecked" | "indeterminate";

export const CHECKBOX_GROUP_INJECTION_KEY = Symbol() as InjectionKey<{
  name: Ref<string | undefined>;
  disabled: Ref<boolean>;
  group: SelectionGroup<string>;
}>;

export function useCheckboxGroupContext() {
  return inject(CHECKBOX_GROUP_INJECTION_KEY, null);
}
</script>

<script setup lang="ts">
import { useControllableState, useSelectionGroup, type SelectionGroup } from "@/composables";
import { computed, inject, provide, ref, toRefs } from "vue";
import { useCollection } from "@/composables/use-collection";

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  modelValue: () => [],
});

const collection = useCollection();
const modelValue = useControllableState(() => props.modelValue);
const checkedState = computed<CheckedState>(() => {
  if (modelValue.value.length === 0) return "unchecked";
  if (modelValue.value.length === collection.items.value.length) return "checked";
  return "indeterminate";
});
const group = useSelectionGroup(modelValue, {
  multiselect: true,
});

const { name, disabled } = toRefs(props);

provide(CHECKBOX_GROUP_INJECTION_KEY, {
  name,
  disabled,
  group,
});
</script>

<template>
  <div role="group">
    <slot />
  </div>
</template>
