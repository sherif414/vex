<script lang="ts">
interface AutocompleteListItemProps {
  value: string;
  as?: string;
  disabled?: boolean;
}

export type ListItem = CollectionItem<{
  label: Ref<string>;
  value: Ref<string>;
  disabled: Ref<boolean>;
}>;
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import type { CollectionItem } from "@/composables/collection";
import { computed, ref, toRefs, type Ref } from "vue";
import { useAutocompleteContext } from "./Autocomplete.vue";

const props = withDefaults(defineProps<AutocompleteListItemProps>(), {
  as: "li",
  disabled: false,
});

const listItemEl = ref<HTMLElement | null>(null);
const { group, collection, activeListItem } = useAutocompleteContext(
  "AutocompleteListItem"
);

const isSelected = computed(() => group.isSelected(props.value));
const isActive = computed(() => activeListItem.value?.uid === item.uid);
const { value, disabled } = toRefs(props);
const item = collection.addItem({
  templateRef: listItemEl,
  value,
  disabled,
  label: ref("label"),
});
</script>

<template>
  <Primitive
    ref="listItemEl"
    role="option"
    tabindex="-1"
    :id="item.uid"
    :as="props.as"
    :aria-selected="isSelected"
    :aria-disabled="disabled"
    @click.prevent="() => !disabled && group.select(props.value)"
    @keydown.enter.prevent="() => !disabled && group.select(props.value)"
  >
    <slot :selected="isSelected" :active="isActive" />
  </Primitive>
</template>
