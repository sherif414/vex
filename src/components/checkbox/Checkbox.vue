<script lang="ts">
export interface CheckboxProps {
  /**
   * Whether the checkbox is in an indeterminate state
   */
  indeterminate?: boolean
  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean
  /**
   * The name of the checkbox, used for form submissions
   */
  name?: string
  /**
   * The value of the checkbox, used for form submissions
   */
  value: string
  /**
   * Whether the checkbox should receive focus on mount
   */
  autoFocus?: boolean
  /**
   * The validation state of the checkbox
   */
  validationState?: "valid" | "invalid"
  /**
   * Whether the checkbox is required
   */
  required?: boolean
  /**
   * The state of the checkbox
   */
  modelValue?: boolean
}
</script>

<script setup lang="ts">
import { useFormControl } from "@/composables"
import { computed, useTemplateRef } from "vue"
import { useCheckboxGroupContext } from "./CheckboxGroup.vue"

const props = withDefaults(defineProps<CheckboxProps>(), {})
const ctx = useCheckboxGroupContext()
const isGrouped = !!ctx
const isDisabled = computed<boolean>(() => ctx?.disabled.value || props.disabled)

function check() {
  if (!ctx || props.disabled || ctx.disabled.value) return
  ctx.group.select(props.value)
}

function uncheck() {
  if (!ctx || props.disabled || ctx.disabled.value) return
  ctx.group.deselect(props.value)
}

const modelValue = !isGrouped
  ? defineModel<boolean>({ default: false })
  : computed<boolean>({
      set: (v) => (v ? ctx.group.select(props.value) : ctx.group.deselect(props.value)),
      get: () => ctx.group.isSelected(props.value),
    })

defineExpose({ check, uncheck })

const checkboxRef = useTemplateRef("checkbox")
const { isFormControl } = useFormControl(checkboxRef)

function toggle() {
  if (props.disabled) return
  modelValue.value = !modelValue.value
}
</script>

<template>
  <button
    @click="toggle"
    @keydown.space="toggle"
    @keydown.enter.prevent
    ref="checkbox"
    type="button"
    role="checkbox"
    :aria-checked="props.indeterminate ? 'mixed' : modelValue"
    :aria-disabled="props.disabled"
    :aria-required="props.required"
    :aria-invalid="props.validationState === 'invalid'">
    <slot />
    <input
      v-if="!isGrouped && isFormControl"
      type="checkbox"
      :value="props.value"
      :checked="modelValue"
      :name="props.name"
      :required="props.required"
      :disabled="props.disabled"
      aria-hidden="true"
      style="
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      " />
  </button>
</template>
