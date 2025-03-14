<script lang="ts">
export interface FieldProps {
  as?: string
  disabled?: boolean
}

export interface FieldContext {
  inputID: string
  labelID: string
  descriptionID: string
  disabled: Ref<boolean>
}
const FIELD_INJECTION_KEY = Symbol() as InjectionKey<FieldContext>

export function useFieldContext(): FieldContext | null {
  return inject(FIELD_INJECTION_KEY, null)
}
</script>

<script setup lang="ts">
import { inject, provide, toRef, type InjectionKey, type Ref } from "vue"
import { Primitive } from "../primitive"
import { useID } from "@/composables"

const props = withDefaults(defineProps<FieldProps>(), {
  as: "div",
})

provide(FIELD_INJECTION_KEY, {
  inputID: useID(),
  labelID: useID(),
  descriptionID: useID(),
  disabled: toRef(() => props.disabled),
})
</script>

<template>
  <Primitive :as="as" :data-disabled="props.disabled || undefined">
    <slot />
  </Primitive>
</template>
