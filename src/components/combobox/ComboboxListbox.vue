<script lang="ts">
export interface ComboboxListboxProps {
  as?: string;
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import { useEventListener } from "@/composables";
import { onMounted, watch } from "vue";
import { useComboboxContext } from "./Combobox.vue";

const props = withDefaults(defineProps<ComboboxListboxProps>(), {
  as: "ul",
});

const {
  triggerID,
  listboxEl,
  listboxID,
  group,
  activeDescendentID,
  multiselect,
  hide,
  listItems,
} = useComboboxContext("ComboboxListbox");

// Event delegation for clicks
useEventListener(listboxEl, "click", (e) => {
  const target = e.target as HTMLElement;
  const option = target.closest<HTMLElement>(
    '[role="option"]:not([aria-disabled="true"])'
  );
  const value = option?.dataset.vexValue;

  if (value) {
    group.select(value);
    if (!multiselect.value) hide();
  }
});

function updateSelection(newValues: string[], oldValues: string[] = []): void {
  if (!listboxEl.value) return;

  const added = newValues.filter((value) => !oldValues.includes(value));
  const removed = oldValues.filter((value) => !newValues.includes(value));

  added.forEach((value) => {
    const element = listboxEl.value?.querySelector<HTMLElement>(
      `[role="option"][data-vex-value="${value}"]`
    );
    if (!element) return;
    element.setAttribute("aria-selected", "true");
    element.dataset.vexSelected = "true";
  });

  removed.forEach((value) => {
    const element = listboxEl.value?.querySelector<HTMLElement>(
      `[role="option"][data-vex-value="${value}"]`
    );
    if (!element) return;
    element.setAttribute("aria-selected", "false");
    element.dataset.vexSelected = "false";
  });
}

function setActiveElement(currID?: string, prevID?: string): void {
  if (prevID) {
    const el = listboxEl.value?.querySelector<HTMLElement>(`#${prevID}`);
    el && (el.dataset.vexActive = "false");
  }
  if (currID) {
    const el = listboxEl.value?.querySelector<HTMLElement>(`#${currID}`);
    el && (el.dataset.vexActive = "true");
  }
}

function refreshSelection(): void {
  if (!listboxEl.value) return;

  // Apply current selection state
  group.selected.value.forEach((value) => {
    const element = listboxEl.value?.querySelector<HTMLElement>(
      `[role="option"][data-vex-value="${value}"]`
    );
    if (!element) return;
    element.setAttribute("aria-selected", "true");
    element.dataset.vexSelected = "true";
  });
}

onMounted(() => {
  watch(group.selected, updateSelection, { immediate: true });
  watch(activeDescendentID, setActiveElement, { immediate: true });
  watch(listItems, refreshSelection);
});
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
