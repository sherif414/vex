<script lang="ts">
export interface AvatarFallbackProps {
  /** The HTML element to render as. @default 'div' */
  as?: string;
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import { useAvatarContext } from "./Avatar.vue";

const props = withDefaults(defineProps<AvatarFallbackProps>(), {
  as: "div",
});

const { loadState } = useAvatarContext("AvatarFallback");
</script>

<template>
  <Primitive v-if="loadState !== 'loaded'" :as="props.as">
    <slot />
  </Primitive>
</template>
