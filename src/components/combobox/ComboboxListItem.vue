<script lang="ts">
interface ComboboxListItemProps {
  value: string;
  as?: string;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useComboboxContext } from "./ComboboxContext";
import { Primitive } from "@/components";

const props = withDefaults(defineProps<ComboboxListItemProps>(), {
  as: "li",
});

const { group, activeDescendentID, listboxID } =
  useComboboxContext("ComboboxListItem");
const id = computed(() => `${listboxID}-${props.value}`);
const isActive = computed(() => activeDescendentID.value === id.value);
const isSelected = computed(() => group.isSelected(props.value));
</script>

<template>
  <Primitive
    role="option"
    :as="props.as"
    :id="id"
    :data-vex-value="value"
    @click="() => group.select(props.value)"
  >
    <slot :is-selected="isSelected" :is-active="isActive" :id="id" />
  </Primitive>
</template>
