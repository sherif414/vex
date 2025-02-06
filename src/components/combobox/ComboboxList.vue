<script lang="ts">
export interface ComboboxListProps {
  /** HTML element to render as. @default 'ul' */
  as?: string;
  /** Floating UI placement of the list relative to input. @default 'bottom-start' */
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  /** Space between input and list in pixels. @default 4 */
  offset?: number;
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import { useComboboxContext } from "./ComboboxContext";
import { useFloating } from "@/composables";
import { ref, onUpdated } from "vue";

const props = withDefaults(defineProps<ComboboxListProps>(), {
  as: "ul",
  placement: "bottom-start",
  offset: 4,
});

const { isOpen, toggle, triggerEl, triggerID } =
  useComboboxContext("ComboboxList");

const listRef = ref<HTMLElement | null>(null);
const listId = `combobox-list-${Math.random().toString(36).slice(2, 11)}`;

const { floatingStyles } = useFloating(triggerEl, listRef, isOpen, {
  placement: () => props.placement,
  offset: props.offset,
  autoMinWidth: true,
});

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
  <Teleport to="body">
    <Transition name="vex-fade">
      <Primitive
        :as="props.as"
        v-if="isOpen"
        ref="listRef"
        role="listbox"
        :id="listId"
        :aria-labelledby="triggerID"
        tabindex="-1"
        :style="floatingStyles"
        @keydown="onKeyDown"
      >
        <slot></slot>
      </Primitive>
    </Transition>
  </Teleport>
</template>
