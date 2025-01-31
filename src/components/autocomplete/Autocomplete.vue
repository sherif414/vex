<script lang="ts">
import {
  type SelectionGroup,
  useContext,
  useSelectionGroup,
} from "@/composables";
import type { Collection } from "@/composables/collection";
import type { Orientation } from "@/types";
import {
  computed,
  type ComputedRef,
  type InjectionKey,
  provide,
  type Ref,
  ref,
  shallowRef,
} from "vue";
import type { ListItem } from "./AutocompleteListItem.vue";

export interface AutocompleteProps {
  modelValue?: string[];
  disabled?: boolean;
  multiselect?: boolean;
  deselectOnReselect?: boolean;
  as?: string;
  /** Direction of keyboard navigation. @default 'vertical' */
  orientation?: "vertical" | "horizontal";
}

export type AutocompleteCollection = Collection<ListItem>;

export const AUTOCOMPLETE_INJECTION_KEY = Symbol() as InjectionKey<{
  isVisible: Ref<boolean>;
  hide: () => void;
  show: () => void;
  group: SelectionGroup<string>;
  collection: AutocompleteCollection;
  listElementID: string;
  inputElementID: string;
  listEl: Ref<HTMLElement | null>;
  inputEl: Ref<HTMLInputElement | null>;
  highlightedIndex: Ref<number>;
  activeListItem: Ref<ListItem | null>;
  orientation: () => Orientation;
}>;

export function useAutocompleteContext(componentName: string) {
  return useContext(AUTOCOMPLETE_INJECTION_KEY, "Autocomplete", componentName);
}
</script>

<script lang="ts" setup>
import { Primitive } from "@/components";
import { useCollection, useID } from "@/composables";

const props = withDefaults(defineProps<AutocompleteProps>(), {
  modelValue: () => [],
  orientation: "vertical",
  as: "div",
});

defineEmits<{
  "update:modelValue": [value: string[]];
}>();

const listEl = ref<HTMLElement | null>(null);
const inputEl = ref<HTMLInputElement | null>(null);
const isVisible = ref(false);
const activeListItem = shallowRef<ListItem | null>(null);
const highlightedIndex = ref(-1);

const listElementID = useID();
const inputElementID = useID();

const modelValue = defineModel<string[]>({ default: [] });

const collection = useCollection<ListItem>(listElementID);

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
  collection,
  highlightedIndex,
  activeListItem,
  orientation: () => props.orientation,
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
