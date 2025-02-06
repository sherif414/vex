<script lang="ts">
interface ComboboxOptionProps {
  value: string;
  as?: string;
  disabled?: boolean;
  description?: string;
}

export type OptionItem = CollectionItem<{
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
import { useComboboxContext } from "./Combobox.vue";

const props = withDefaults(defineProps<ComboboxOptionProps>(), {
  as: "li",
  disabled: false,
});

const optionEl = ref<HTMLElement | null>(null);
const { group, collection, activeOption } = useComboboxContext("ComboboxOption");

const isSelected = computed(() => group.isSelected(props.value));
const isActive = computed(() => activeOption.value?.uid === item.uid);
const { value, disabled } = toRefs(props);

// Position tracking for ARIA attributes
const itemIndex = ref(0);
const totalItems = ref(0);

onMounted(() => {
  const items = collection.items.value;
  itemIndex.value = items.findIndex((i) => i.uid === item.uid) + 1;
  totalItems.value = items.length;
});

const item = collection.addItem({
  templateRef: optionEl,
  value,
  disabled,
  label: ref("label"),
  index: itemIndex,
  total: totalItems,
});

onUnmounted(() => {
  collection.removeItem(item.uid);
});

const handleSelect = () => {
  if (!props.disabled) {
    group.select(props.value);
  }
};
</script>

<template>
  <Primitive
    ref="optionEl"
    role="option"
    tabindex="-1"
    :id="item.uid"
    :as="props.as"
    :aria-selected="isSelected"
    :aria-disabled="disabled"
    :aria-current="isActive"
    :aria-posinset="itemIndex"
    :aria-setsize="totalItems"
    :aria-describedby="props.description ? `${item.uid}-desc` : undefined"
    :class="[
      'vex-combobox-option',
      {
        '--selected': isSelected,
        '--active': isActive,
        '--disabled': disabled,
      },
    ]"
    @click.prevent="handleSelect"
    @keydown.enter.prevent="handleSelect"
    @keydown.space.prevent="handleSelect"
  >
    <slot :selected="isSelected" :active="isActive" />
    <span
      v-if="props.description"
      :id="`${item.uid}-desc`"
      class="vex-combobox-option-description"
    >
      {{ props.description }}
    </span>
  </Primitive>
</template>