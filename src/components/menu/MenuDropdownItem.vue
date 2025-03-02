<script lang="ts">
interface MenuDropdownItem {
  value: string;
  disabled?: boolean;
  as?: string;
}
</script>

<script setup lang="ts">
import { useCollection } from "@/composables";
import { computed, ref, toValue } from "vue";
import { Primitive } from "../primitive";
import { useMenuContext } from "./Menu.vue";
import { useMenuDropdownContext } from "./MenuDropdown.vue";
import { useMenuGroupContext } from "./MenuGroup.vue";

const props = withDefaults(defineProps<MenuDropdownItem>(), { as: "button" });

const { hide } = useMenuContext("MenuDropdownItem");
const { collection } = useMenuDropdownContext("MenuDropdownItem");
const groupCtx = useMenuGroupContext();
const isGrouped = groupCtx !== null;

const itemEl = ref<HTMLHtmlElement | null>(null);
const { uid, disabled } = useCollection(collection, {
  templateRef: itemEl,
  disabled: () => props.disabled,
});

const role = computed(() => {
  if (!isGrouped) return "menuitem";
  return toValue(groupCtx.groupType) === "radio" ? "menuitemradio" : "menuitemcheckbox";
});

const isChecked = computed(() => groupCtx?.selectionGroup.isSelected(props.value));
function onClick() {
  if (disabled.value) return;
  if (isGrouped) {
    groupCtx?.selectionGroup.select(props.value);
  } else {
    hide();
  }
}
</script>

<template>
  <Primitive
    :as="props.as"
    tabindex="-1"
    ref="itemEl"
    :id="uid"
    :disabled="disabled"
    :aria-checked="isChecked"
    :role="role"
    @click.prevent="onClick"
  >
    <slot :checked="isChecked" />
  </Primitive>
</template>
