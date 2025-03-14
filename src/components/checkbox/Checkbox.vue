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
  /**
   * The id for the checkbox
   */
  id?: string
}
</script>

<script setup lang="ts">
import { useFormControl } from "@/composables"
import { computed, useTemplateRef } from "vue"
import { useCheckboxGroupContext } from "./CheckboxGroup.vue"
import { useFieldContext } from "../field/Field.vue"

const props = withDefaults(defineProps<CheckboxProps>(), {})
const modelValue = defineModel<boolean>({ default: false })
const fieldContext = useFieldContext()
const groupContext = useCheckboxGroupContext()
const isGrouped = !!groupContext
const isDisabled = computed<boolean>(
  () => groupContext?.disabled.value || fieldContext?.disabled.value || props.disabled,
)
const checkboxID = computed(() => props.id ?? fieldContext?.inputID)

const isChecked = !isGrouped
  ? modelValue
  : computed<boolean>({
      set: (v) =>
        v ? groupContext.group.select(props.value) : groupContext.group.deselect(props.value),
      get: () => groupContext.group.isSelected(props.value),
    })

function check() {
  if (!groupContext || isDisabled.value) return
  groupContext.group.select(props.value)
}

function uncheck() {
  if (!groupContext || isDisabled.value) return
  groupContext.group.deselect(props.value)
}

defineExpose({ check, uncheck })

const checkboxRef = useTemplateRef("checkbox")
const { isFormControl } = useFormControl(checkboxRef)

function toggle() {
  if (isDisabled.value) return
  isChecked.value = !isChecked.value
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
    :aria-checked="props.indeterminate ? 'mixed' : isChecked"
    :aria-disabled="isDisabled"
    :aria-required="props.required"
    :aria-invalid="props.validationState === 'invalid'"
    :aria-describedby="fieldContext?.descriptionID"
    :aria-labelledby="fieldContext?.labelID"
    :id="checkboxID"
  >
    <slot />
    <input
      v-if="!isGrouped && isFormControl"
      type="checkbox"
      :value="props.value"
      :checked="isChecked"
      :name="props.name"
      :required="props.required"
      :disabled="isDisabled"
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
      "
    />
  </button>
</template>
