<script lang="ts">
interface AutocompleteListItemProps {
  value: string;
  as?: string;
  disabled?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAutocompleteContext } from "./Autocomplete.vue";
import { Primitive } from "@/components";
import { useCollection } from "@/composables/collection";
import { useAutocompleteListContext } from "./AutocompleteList.vue";

const props = withDefaults(defineProps<AutocompleteListItemProps>(), {
  as: "li",
  disabled: false,
});

const listItemEl = ref<HTMLElement | null>(null);
const { collection } = useAutocompleteListContext("AutocompleteListItem");
const { group, highlighted } = useAutocompleteContext("AutocompleteListItem");

const isSelected = computed(() => group.isSelected(props.value));
const isFocused = computed(() => {
  const index = collection.elements.value.indexOf(listItemEl.value!);
  return index === highlighted.value;
});

const item = useCollection(collection, {
  templateRef: listItemEl,
  disabled: () => props.disabled,
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
    :aria-disabled="props.disabled"
    @click.prevent="() => !props.disabled && group.select(props.value)"
    @keydown.enter.prevent="() => !props.disabled && group.select(props.value)"
  >
    <slot :selected="isSelected" :focused="isFocused" />
  </Primitive>
</template>
