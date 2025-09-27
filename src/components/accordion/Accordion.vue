<script lang="ts">
import type { SelectionGroup } from "@/composables"
import { useContext } from "@/composables"
import type { Collection } from "@/composables/use-collection"
import type { InjectionKey, Ref } from "vue"

/**
 * A single accordion item's bookkeeping.
 * - `templateRef` is the root element for the item (used to query the trigger)
 * - `triggerID` must match the id on the item's trigger element
 * - `id` is the unique value used by the selection group
 */
export interface AccordionItem {
  templateRef: Ref<HTMLElement | null>
  triggerID: string
  id: string
}

/**
 * Context shape provided by `Accordion` and consumed by its sub-components.
 */
export interface AccordionContext {
  group: SelectionGroup<string>
  collection: Collection<AccordionItem>
}

/**
 * Injection key used to provide/consume accordion context.
 */
export const ACCORDION_INJECTION_KEY = Symbol("accordion") as InjectionKey<AccordionContext>

/**
 * Access the accordion context from child components.
 * @param component Used for more descriptive error messages
 */
export function useAccordionCtx(component: string): AccordionContext {
  return useContext(ACCORDION_INJECTION_KEY, "Accordion", component)
}

/**
 * Public props accepted by the `Accordion` root.
 */
export interface AccordionProps {
  /**
   * Allow multiple items to be expanded at once.
   * @default false
   */
  multiple?: boolean
  /**
   * The HTML element to render as.
   * @default 'div'
   */
  as?: string
}
</script>

<script setup lang="ts">
import { Primitive } from "@/components"
import { useRovingFocus, useSelectionGroup } from "@/composables"
import { useCollection } from "@/composables/use-collection"
import { provide, useTemplateRef } from "vue"

const props = withDefaults(defineProps<AccordionProps>(), {
  multiple: false,
  as: "div",
})

const collection = useCollection<AccordionItem>()

const modelValue = defineModel<string[]>({ default: () => [] })
const group = useSelectionGroup(modelValue, {
  multiselect: () => props.multiple,
})

const accordionEl = useTemplateRef("accordion")

function getRovingFocusTargets(): HTMLElement[] {
  return collection.items.value.reduce<HTMLElement[]>((acc, { templateRef, triggerID }) => {
    const triggerEl = templateRef.value?.querySelector<HTMLElement>(`#${triggerID}`)
    if (triggerEl) acc.push(triggerEl)
    return acc
  }, [])
}

useRovingFocus(accordionEl, getRovingFocusTargets)

provide(ACCORDION_INJECTION_KEY, { group, collection })
</script>

<template>
  <Primitive :as="props.as" ref="accordion">
    <slot />
  </Primitive>
</template>
