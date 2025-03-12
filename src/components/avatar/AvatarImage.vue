<script lang="ts">
export interface AvatarImageProps {
  /** The image source URL */
  src?: string;
  /** The alt text for the image */
  alt?: string;
  /** The cross-origin attribute for the image */
  crossOrigin?: 'anonymous' | 'use-credentials';
}
</script>

<script setup lang="ts">
import { watch } from "vue";
import { useAvatarContext } from "./Avatar.vue";

const props = defineProps<AvatarImageProps>();

const { setLoadState } = useAvatarContext("AvatarImage");

watch(
  () => props.src,
  () => {
    if (!props.src) {
      setLoadState("error");
      return;
    }

    setLoadState("loading");
    const img = new Image();
    img.onload = () => {
      if (img.complete && img.naturalHeight > 0) {
        setLoadState("loaded");
      }
    };
    img.onerror = () => setLoadState("error");
    if (props.crossOrigin) {
      img.crossOrigin = props.crossOrigin;
    }
    img.src = props.src;
  },
  { immediate: true },
);
</script>

<template>
  <img v-if="src" :src="src" :crossorigin="crossOrigin" />
</template>
