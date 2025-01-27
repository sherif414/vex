<script lang="ts">
interface MenuTriggerProps {
  as?: string;
}
</script>

<script setup lang="ts">
import { nextTick } from "vue";
import { Primitive } from "../primitive";
import { useMenuContext } from "./Menu.vue";

const props = withDefaults(defineProps<MenuTriggerProps>(), {
  as: "button",
});

const { triggerEl, triggerID, dropdownID, isVisible, show, hide, dropdownEl } =
  useMenuContext("MenuTrigger");

function showDropdown() {
  show();
  nextTick(() => {
    dropdownEl.value?.focus();
  });
}

//  firefox space keyup triggers a click unless default is prevented
// that's why we need to prevent default
</script>

<template>
  <Primitive
    :as="props.as"
    :id="triggerID"
    ref="triggerEl"
    aria-haspopup="menu"
    :aria-expanded="isVisible"
    :aria-controls="dropdownID"
    @keyup.space.prevent
    @keydown.down.prevent="showDropdown"
    @click.prevent="show"
  >
    <slot />
  </Primitive>
</template>
