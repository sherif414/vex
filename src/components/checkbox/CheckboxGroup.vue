<script lang="ts">
import type { InjectionKey, Ref } from "vue"

interface CheckboxGroupProps {
  /**
   * The value of the checkbox group, used for form submissions
   */
  modelValue?: string[]
  /**
   * Whether the checkbox group is disabled
   */
  disabled?: boolean
}

export interface CheckboxItem {
  value: Ref<string>
  checked: Ref<boolean>
  disabled: Ref<boolean>
  check: () => void
  uncheck: () => void
}

export type CheckedState = "checked" | "unchecked" | "indeterminate"

export interface CheckboxGroupContext {
  disabled: Ref<boolean>
  group: SelectionGroup<string>
}

export const CHECKBOX_GROUP_INJECTION_KEY = Symbol() as InjectionKey<CheckboxGroupContext>

export function useCheckboxGroupContext(): CheckboxGroupContext | null {
  return inject(CHECKBOX_GROUP_INJECTION_KEY, null)
}
</script>

<script setup lang="ts">
import { useSelectionGroup, type SelectionGroup } from "@/composables"
import { useCollection } from "@/composables/use-collection"
import { computed, inject, provide, toRefs } from "vue"

const props = withDefaults(defineProps<CheckboxGroupProps>(), {})

const collection = useCollection<CheckboxItem>()
const modelValue = defineModel<string[]>({ default: () => [] })
const checkedState = computed<CheckedState>(() => {
  if (modelValue.value.length === 0) return "unchecked"
  if (modelValue.value.length === collection.items.value.length) return "checked"
  return "indeterminate"
})
const group = useSelectionGroup(modelValue, {
  multiselect: true,
})

const { disabled } = toRefs(props)

const checkAll = () => {
  collection.items.value.forEach((item) => item.check())
}

const uncheckAll = () => {
  collection.items.value.forEach((item) => item.uncheck())
}

provide(CHECKBOX_GROUP_INJECTION_KEY, {
  disabled,
  group,
})

defineExpose({ checkAll, uncheckAll, checkedState })
</script>

<template>
  <div role="group">
    <slot :modelValue="modelValue" />
  </div>
</template>
