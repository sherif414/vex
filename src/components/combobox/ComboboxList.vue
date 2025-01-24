<script lang="ts">
export interface ComboboxListProps {
  as?: string;
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import { useComboboxContext } from "./Combobox.vue";
import { ref, onUpdated } from "vue";

const props = withDefaults(defineProps<ComboboxListProps>(), {
  as: "ul",
});

const { isOpen, toggle } = useComboboxContext("ComboboxList");

const listRef = ref<HTMLElement | null>(null);

const focusFirstOption = () => {
  if (listRef.value) {
    const firstOption = listRef.value.querySelector(
      '[role="option"]'
    ) as HTMLElement;
    if (firstOption) {
      firstOption.focus();
    }
  }
};

const onKeyDown = (e: KeyboardEvent) => {
  if (!isOpen.value) return;
  if (e.key === "Escape") {
    toggle();
    return;
  }
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (!listRef.value) return;
    const options = Array.from(
      listRef.value.querySelectorAll('[role="option"]')
    ) as HTMLElement[];
    if (options.length === 0) return;
    const focused = document.activeElement as HTMLElement;
    let index = options.indexOf(focused);
    if (index === -1) {
      index = e.key === "ArrowDown" ? -1 : options.length;
    }
    index += e.key === "ArrowDown" ? 1 : -1;
    if (index < 0) {
      index = options.length - 1;
    } else if (index >= options.length) {
      index = 0;
    }
    options[index].focus();
  }
};

onUpdated(() => {
  if (listRef.value) {
    listRef.value.addEventListener("keydown", onKeyDown);
    if (isOpen.value) {
      focusFirstOption();
    }
  }
});
</script>

<template>
  <Primitive :as="props.as" v-if="isOpen" ref="listRef">
    <slot></slot>
  </Primitive>
</template>
