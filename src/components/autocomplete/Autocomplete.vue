<script lang="ts">
import {
  type SelectionGroup,
  useContext,
  useSelectionGroup,
} from "@/composables";
import { type InjectionKey, provide, type Ref, ref } from "vue";

export interface AutocompleteProps {
  modelValue?: string[];
  disabled?: boolean;
  multiselect?: boolean;
  deselectOnReselect?: boolean;
  as?: string;
}

export const AUTOCOMPLETE_INJECTION_KEY = Symbol() as InjectionKey<{
  isVisible: Ref<boolean>;
  hide: () => void;
  show: () => void;
  group: SelectionGroup<string>;
  listElementID: string;
  inputElementID: string;
  listEl: Ref<HTMLElement | null>;
  inputEl: Ref<HTMLInputElement | null>;
  highlighted: Ref<number>;
}>;

export function useAutocompleteContext(componentName: string) {
  return useContext(AUTOCOMPLETE_INJECTION_KEY, "Autocomplete", componentName);
}
</script>

<script lang="ts" setup>
import { Primitive } from "@/components";
import { useID } from "@/composables";

const props = withDefaults(defineProps<AutocompleteProps>(), {
  modelValue: () => [],
  as: "div",
});

defineEmits<{
  "update:modelValue": [value: string[]];
}>();

const listEl = ref<HTMLElement | null>(null);
const inputEl = ref<HTMLInputElement | null>(null);
const isVisible = ref(false);
const highlighted = ref(-1);

const listElementID = useID();
const inputElementID = useID();

const modelValue = defineModel<string[]>({ default: [] });

const group = useSelectionGroup(modelValue, {
  deselectOnReselect: () => props.deselectOnReselect,
  multiselect: () => props.multiselect,
});

provide(AUTOCOMPLETE_INJECTION_KEY, {
  isVisible,
  show: () => (isVisible.value = true),
  hide: () => (isVisible.value = false),
  group,
  listElementID,
  inputElementID,
  listEl,
  inputEl,
  highlighted,
});
</script>

<template>
  <Primitive
    :aria-controls="listElementID"
    :aria-expanded="isVisible"
    :aria-labelledby="inputElementID"
    :as="props.as"
    role="combobox"
  >
    <slot></slot>
  </Primitive>
</template>
