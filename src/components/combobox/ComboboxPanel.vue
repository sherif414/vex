<script lang="ts">
export interface ComboboxPanelProps {
  as?: string;
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import { useComboboxContext } from "./Combobox.vue";

const props = withDefaults(defineProps<ComboboxPanelProps>(), {
  as: "div",
});

const { isOpen } = useComboboxContext("ComboboxPanel");
</script>

<template>
  <Primitive :as="props.as" v-if="isOpen">
    <slot></slot>
  </Primitive>
</template>
