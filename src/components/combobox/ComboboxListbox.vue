<script lang="ts">
export interface ComboboxListboxProps {
  as: string;
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import { useComboboxContext } from "./ComboboxContext";

const props = withDefaults(defineProps<ComboboxListboxProps>(), {
  as: "ul",
});

const { triggerID, listboxEl, listboxID } =
  useComboboxContext("ComboboxListbox");
</script>

<template>
  <Primitive
    :as="props.as"
    ref="listboxEl"
    role="listbox"
    :id="listboxID"
    :aria-labelledby="triggerID"
    tabindex="-1"
  >
    <slot></slot>
  </Primitive>
</template>
