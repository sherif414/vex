<script lang="ts">
import { useContext } from '@/composables';
import type { InjectionKey } from 'vue';

export const ALERT_INJECTION_KEY = Symbol() as InjectionKey<{
  contentID: string;
  headerID: string;
}>;

export function useAlertContext(componentName: string) {
  return useContext(ALERT_INJECTION_KEY, 'Alert', componentName);
}

export interface AlertProps {
  /** The HTML element to render as. @default 'div' */
  as?: string;
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components";
import { useID } from "@/composables";
import { provide } from "vue";

const props = withDefaults(defineProps<AlertProps>(), {
  as: "div",
});

const headerID = useID();
const contentID = useID();

provide(ALERT_INJECTION_KEY, {
  headerID,
  contentID,
});
</script>

<template>
  <Primitive :as="props.as" role="alert" :aria-labelledby="headerID" :aria-describedby="contentID">
    <slot />
  </Primitive>
</template>
