<script lang="ts">
interface ComboboxListItemProps {
  disabled?: boolean;
  textContent: string;
  value: string;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useComboboxContext } from "./Combobox.vue";

const props = withDefaults(defineProps<ComboboxListItemProps>(), {});

const { listboxID, activeDescendentID, group } =
  useComboboxContext("ComboboxListItem");
const id = `${listboxID}-${props.value}`;

const isActive = computed(() => id === activeDescendentID.value);
const isSelected = computed(() => group.isSelected(props.value));
</script>

<template>
  <li
    role="option"
    :id="id"
    :aria-disabled="props.disabled"
    :aria-selected="isSelected"
    :data-vex-value="props.value"
    :data-vex-active="isActive"
    :data-vex-text-content="props.textContent"
  >
    <slot :id="id" />
  </li>
</template>
