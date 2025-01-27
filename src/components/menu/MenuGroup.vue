<script lang="ts">
interface MenuGroupProps {
  type?: "radio" | "checkbox";
}

const MENU_GROUP_INJECTION_KEY = Symbol() as InjectionKey<{
  selectionGroup: SelectionGroup<string>;
  groupType: () => MenuGroupProps["type"];
}>;

export function useMenuGroupContext() {
  return inject(MENU_GROUP_INJECTION_KEY, null);
}
</script>

<script setup lang="ts">
import { useSelectionGroup, type SelectionGroup } from "@/composables";
import { inject, provide, type InjectionKey } from "vue";

const props = withDefaults(defineProps<MenuGroupProps>(), {
  type: "checkbox",
});

const modelValue = defineModel<string[]>({ default: [] });
const selectionGroup = useSelectionGroup(modelValue, {
  multiselect: () => props.type === "checkbox",
  deselectOnReselect: () => props.type === "checkbox",
});

provide(MENU_GROUP_INJECTION_KEY, {
  selectionGroup,
  groupType: () => props.type,
});
</script>

<template>
  <div role="group">
    <slot />
  </div>
</template>
