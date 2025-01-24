<script lang="ts">
interface ComboboxListItemProps {
  value: string;
  as?: string;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useComboboxContext } from "./Combobox.vue";
import { Primitive } from "@/components";

const props = withDefaults(defineProps<ComboboxListItemProps>(), {
  as: "li",
});

const { group } = useComboboxContext("ComboboxListItem");
const isSelected = computed(() => group.isSelected(props.value));
</script>

<template>
  <Primitive
    role="option"
    :as="props.as"
    @click="() => group.select(props.value)"
  >
    <slot :selected="isSelected"></slot>
  </Primitive>
</template>
