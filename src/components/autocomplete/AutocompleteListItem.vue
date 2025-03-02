<script lang="ts">
interface AutocompleteListItemProps {
  value: string;
  as?: string;
  disabled?: boolean;
  description?: string;
  multiselect?: boolean;
}

export type ListItem = CollectionItem<{
  label: Ref<string>;
  value: Ref<string>;
  disabled: Ref<boolean>;
  index?: Ref<number>;
  total?: Ref<number>;
}>;
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import type { CollectionItem } from "@/composables/collection";
import { computed, onMounted, onUnmounted, ref, toRefs, type Ref } from "vue";
import { useAutocompleteContext } from "./Autocomplete.vue";

const props = withDefaults(defineProps<AutocompleteListItemProps>(), {
  as: "li",
  disabled: false,
  multiselect: false,
});

const listItemEl = ref<HTMLElement | null>(null);
const { group, collection, activeListItem } = useAutocompleteContext("AutocompleteListItem");

const isSelected = computed(() => group.isSelected(props.value));
const isActive = computed(() => activeListItem.value?.uid === item.uid);
const { value, disabled } = toRefs(props);

// Get position in list for aria attributes
const itemIndex = ref(0);
const totalItems = ref(0);

onMounted(() => {
  const items = collection.items.value;
  itemIndex.value = items.findIndex((i) => i.uid === item.uid) + 1;
  totalItems.value = items.length;
});

const item = collection.addItem({
  templateRef: listItemEl,
  value,
  disabled,
  label: ref("label"),
  index: itemIndex,
  total: totalItems,
});
onUnmounted(() => {
  collection.removeItem(item.uid);
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
    :aria-checked="props.multiselect ? isSelected : undefined"
    :aria-disabled="disabled"
    :aria-current="isActive"
    :aria-posinset="itemIndex"
    :aria-setsize="totalItems"
    :aria-describedby="props.description ? `${item.uid}-desc` : undefined"
    :class="[
      'vex-autocomplete-item',
      {
        '--selected': isSelected,
        '--active': isActive,
        '--disabled': disabled,
      },
    ]"
    @click.prevent="() => !disabled && group.select(props.value)"
    @keydown.enter.prevent="() => !disabled && group.select(props.value)"
    @keydown.space.prevent="() => !disabled && group.select(props.value)"
  >
    <slot :selected="isSelected" :active="isActive" />
    <span
      v-if="props.description"
      :id="`${item.uid}-desc`"
      class="vex-autocomplete-item-description"
      >{{ props.description }}</span
    >
  </Primitive>
</template>
