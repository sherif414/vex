<script lang="ts">
import type { Middleware, Strategy } from "v-float"

export interface ComboboxDropdownProps {
  /**
   * HTML element to render as.
   * @default 'div'
   */
  as?: string

  /**
   * Placement of the dropdown relative to the trigger.
   * @default 'bottom-start'
   */
  placement?: Placement

  /**
   * Space between trigger and dropdown in pixels.
   * @default 4
   */
  offset?: number

  /**
   * Match dropdown width to the trigger element.
   * @default true
   */
  matchTriggerWidth?: boolean

  /**
   * Positioning strategy for the floating element.
   * @default 'absolute'
   */
  strategy?: Strategy

  /**
   * Whether to use CSS transforms for positioning.
   * @default true
   */
  transform?: boolean

  /**
   * Whether to automatically update the floating element's position.
   * @default true
   */
  autoUpdate?: boolean

  /**
   * Additional middlewares to run after the default ones.
   */
  middlewares?: Middleware[]
}

type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
</script>

<script setup lang="ts">
import { computed, watch } from "vue"
import { offset, size } from "v-float"
import { Primitive } from "@/components"
import { useComboboxContext } from "./Combobox.vue"

const props = withDefaults(defineProps<ComboboxDropdownProps>(), {
  as: "div",
  placement: "bottom-start",
  offset: 4,
  matchTriggerWidth: true,
  strategy: "absolute",
  transform: true,
  autoUpdate: true,
})

const {
  els: { dropdownEl },
  floating: { floating, setFloatingOptions },
} = useComboboxContext("ComboboxDropdown")

const middlewares = computed(() => {
  const stack = [offset(props.offset)]

  if (props.matchTriggerWidth) {
    stack.push(
      size({
        apply({ elements, rects }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          })
        },
      }),
    )
  }

  if (props.middlewares?.length) {
    stack.push(...props.middlewares)
  }

  return stack
})

watch(
  [
    () => props.placement,
    () => props.strategy,
    () => props.transform,
    () => props.autoUpdate,
    middlewares,
  ],
  ([placement, strategy, transform, autoUpdate, mw]) => {
    setFloatingOptions({
      placement,
      strategy,
      transform,
      autoUpdate,
      middlewares: mw,
    })
  },
  { immediate: true },
)
</script>

<template>
  <Primitive :as="props.as" ref="dropdownEl" :style="floating.floatingStyles.value">
    <slot />
  </Primitive>
</template>
