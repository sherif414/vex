<script lang="ts">
import type { SelectionGroup } from "@/composables"
import { useContext } from "@/composables"
import type { Collection } from "@/composables/use-collection"
import type { InjectionKey, Ref } from "vue"

export interface AccordionItem {
  templateRef: Ref<HTMLElement | null>
  triggerID: string
  id: string
}

export const ACCORDION_INJECTION_KEY = Symbol("accordion") as InjectionKey<{
  group: SelectionGroup<string>
  collection: Collection<AccordionItem>
}>

export function useAccordionCtx(component: string) {
  return useContext(ACCORDION_INJECTION_KEY, "Accordion", component)
}

export interface AccordionProps {
  /** Allow multiple items to be expanded at once. @default false */
  multiple?: boolean
  /** The controlled expanded state of the accordion. */
  modelValue?: string[]
  /** The default value of the accordion in uncontrolled mode. @default [] */
  defaultValue?: string[]
  /** The HTML element to render as. @default 'div' */
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
  modelValue: () => [],
  as: "div",
})

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void
}>()

const collection = useCollection<AccordionItem>()
const modelValue = defineModel({ default: () => [] })
const group = useSelectionGroup(modelValue, {
  multiselect: () => props.multiple,
})
const accordionEl = useTemplateRef("accordion")
useRovingFocus(accordionEl, () => {
  return collection.items.value.reduce<HTMLElement[]>((arr, { templateRef, triggerID }) => {
    const triggerEl = templateRef.value?.querySelector<HTMLElement>(`#${triggerID}`)
    triggerEl && arr.push(triggerEl)
    return arr
  }, [])
})

provide(ACCORDION_INJECTION_KEY, { group, collection })
</script>

<template>
  <Primitive :as="props.as" ref="accordion">
    <slot />
  </Primitive>
</template>
