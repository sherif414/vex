<script lang="ts">
import { type SelectionGroup, useContext, useSelectionGroup } from "@/composables"
import type { Collection } from "@/composables/collection"
import type { Orientation } from "@/types"
import {
  type ComputedRef,
  type InjectionKey,
  type Ref,
  computed,
  provide,
  ref,
  shallowRef,
} from "vue"
import type { ListItem } from "./AutocompleteListItem.vue"

export interface AutocompleteProps {
  modelValue?: string[]
  disabled?: boolean
  multiselect?: boolean
  deselectOnReselect?: boolean
  as?: string
  /** Direction of keyboard navigation. @default 'vertical' */
  orientation?: "vertical" | "horizontal"
  /** Label for the autocomplete input */
  label?: string
  /** Whether the field is required */
  required?: boolean
  /** Description text for the autocomplete */
  description?: string
  /** Error message to display */
  errorMessage?: string
  /** ID of element that labels the autocomplete */
  ariaLabelledby?: string
  /** ID of element that describes the autocomplete */
  ariaDescribedby?: string
}

export type AutocompleteCollection = Collection<ListItem>

export const AUTOCOMPLETE_INJECTION_KEY = Symbol() as InjectionKey<{
  isVisible: Ref<boolean>
  hide: () => void
  show: () => void
  group: SelectionGroup<string>
  collection: AutocompleteCollection
  listElementID: string
  inputElementID: string
  descriptionID: string
  errorID: string
  listEl: Ref<HTMLElement | null>
  inputEl: Ref<HTMLInputElement | null>
  highlightedIndex: Ref<number>
  activeListItem: Ref<ListItem | null>
  orientation: () => Orientation
  required: () => boolean
  disabled: () => boolean
  label: () => string | undefined
  description: () => string | undefined
  errorMessage: () => string | undefined
  ariaLabelledby: () => string | undefined
  ariaDescribedby: () => string | undefined
}>

export function useAutocompleteContext(componentName: string) {
  return useContext(AUTOCOMPLETE_INJECTION_KEY, "Autocomplete", componentName)
}
</script>

<script lang="ts" setup>
import { Primitive } from "@/components"
import { useCollection, useID } from "@/composables"

const props = withDefaults(defineProps<AutocompleteProps>(), {
  modelValue: () => [],
  orientation: "vertical",
  as: "div",
  required: false,
  disabled: false,
})

defineEmits<{
  "update:modelValue": [value: string[]]
}>()

const listEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const isVisible = ref(false)
const activeListItem = shallowRef<ListItem | null>(null)
const highlightedIndex = ref(-1)

const listElementID = useID()
const inputElementID = useID()
const descriptionID = useID()
const errorID = useID()

const modelValue = defineModel<string[]>({ default: [] })

const collection = useCollection<ListItem>(listElementID)

const group = useSelectionGroup(modelValue, {
  deselectOnReselect: () => props.deselectOnReselect,
  multiselect: () => props.multiselect,
})

provide(AUTOCOMPLETE_INJECTION_KEY, {
  isVisible,
  show: () => (isVisible.value = true),
  hide: () => (isVisible.value = false),
  group,
  listElementID,
  inputElementID,
  descriptionID,
  errorID,
  listEl,
  inputEl,
  collection,
  highlightedIndex,
  activeListItem,
  orientation: () => props.orientation,
  required: () => props.required,
  disabled: () => props.disabled,
  label: () => props.label,
  description: () => props.description,
  errorMessage: () => props.errorMessage,
  ariaLabelledby: () => props.ariaLabelledby,
  ariaDescribedby: () => props.ariaDescribedby,
})
</script>

<template>
  <Primitive :as="props.as">
    <slot></slot>
  </Primitive>
</template>
