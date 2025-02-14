<script lang="ts">
interface ComboboxListItemProps {
  disabled?: boolean;
  textContent: string;
  value: string;
}
</script>

<script setup lang="ts">
import { useComboboxContext } from "./Combobox.vue";

const props = withDefaults(defineProps<ComboboxListItemProps>(), {});

const { listboxID } = useComboboxContext("ComboboxListItem");
const id = `${listboxID}-${props.value}`;
</script>

<template>
  <li
    role="option"
    :id="id"
    :data-vex-value="value"
    :aria-disabled="props.disabled"
    :data-vex-text-content="props.textContent"
  >
    <slot :id="id" />
  </li>
</template>
