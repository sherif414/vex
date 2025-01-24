<script lang="ts">
import { InjectionKey, Ref } from "vue";
import { useContext } from "@/composables";

export type LoadState = "loading" | "error" | "idle" | "loaded";

export const AVATAR_INJECTION_KEY = Symbol() as InjectionKey<{
  setLoadingState: (state: LoadState) => void;
  loadState: Readonly<Ref<LoadState>>;
}>;

export function useAvatarContext(componentName: string) {
  return useContext(AVATAR_INJECTION_KEY, "Avatar", componentName);
}

export interface AvatarProps {
  /** The HTML element to render as. @default 'span' */
  as?: string;
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import { provide, ref } from "vue";

const props = withDefaults(defineProps<AvatarProps>(), {
  as: "span",
});

const loadState = ref<LoadState>("idle");

const setLoadingState = (state: LoadState) => {
  loadState.value = state;
};

provide(AVATAR_INJECTION_KEY, { setLoadingState, loadState });
</script>

<template>
  <Primitive :as="props.as">
    <slot :loadState="loadState" />
  </Primitive>
</template>
