<script lang="ts">
interface MenuTriggerProps {
  as?: string;
  interactionType?: "click" | "hover";
}
</script>

<script setup lang="ts">
import { nextTick, onUnmounted } from "vue";
import { Primitive } from "../primitive";
import { useMenuContext } from "./Menu.vue";
import { useEventListener } from "@/composables";

const props = withDefaults(defineProps<MenuTriggerProps>(), {
  as: "button",
  interactionType: "click",
});

const { triggerEl, triggerID, dropdownID, isVisible, show, hide, dropdownEl } =
  useMenuContext("MenuTrigger");

function onKeydown() {
  show();
  nextTick(() => {
    dropdownEl.value?.focus();
  });
}

if (props.interactionType === "hover") {
  let timeoutId: ReturnType<typeof setTimeout>;

  useEventListener(dropdownEl, "mouseenter", () => {
    clearTimeout(timeoutId);
    show();
  });
  useEventListener(dropdownEl, "mouseleave", () => {
    timeoutId = debouncedHide();
  });

  useEventListener(triggerEl, "mouseenter", () => {
    clearTimeout(timeoutId);
  });
  useEventListener(triggerEl, "mouseleave", () => {
    timeoutId = debouncedHide();
  });

  // we debounce to avoid toggling visibility (v-show)
  // when hover is moved from dropdownEl to triggerEl
  // and there is a gap between the two elements
  function debouncedHide() {
    return setTimeout(hide, 25);
  }

  onUnmounted(() => {
    clearTimeout(timeoutId);
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
    @keydown.down.prevent="onKeydown"
    @click.prevent="show"
  >
    <slot />
  </Primitive>
</template>
