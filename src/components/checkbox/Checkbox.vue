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
import { computed, onMounted, useTemplateRef } from "vue"
import { useFieldContext } from "../field/Field.vue"

const props = withDefaults(defineProps<CheckboxProps>(), {})
const modelValue = defineModel<boolean>({ default: false })
const fieldContext = useFieldContext()
const checkboxRef = useTemplateRef("checkbox")
const isDisabled = computed<boolean>(() => fieldContext?.disabled.value || props.disabled)
const checkboxID = computed(() => props.id ?? fieldContext?.inputID)
const { isFormControl } = useFormControl(checkboxRef)

function check() {
  if (isDisabled.value) return
  modelValue.value = true
}

function uncheck() {
  if (isDisabled.value) return
  modelValue.value = false
}

function toggle() {
  if (isDisabled.value) return
  modelValue.value ? uncheck() : check()
}

onMounted(() => {
  if (props.autoFocus) {
    checkboxRef.value?.focus()
  }
})

defineExpose({ check, uncheck, toggle, isChecked: modelValue, isDisabled })
</script>

<template>
  <button
    @pointerdown="toggle"
    @keydown.space="toggle"
    @keydown.enter.prevent
    ref="checkbox"
    type="button"
    role="checkbox"
    :aria-checked="props.indeterminate ? 'mixed' : modelValue"
    :aria-disabled="isDisabled"
    :aria-required="props.required"
    :aria-invalid="props.validationState === 'invalid'"
    :aria-describedby="fieldContext?.descriptionID"
    :aria-labelledby="fieldContext?.labelID"
    :data-checked="modelValue || undefined"
    :data-disabled="isDisabled || undefined"
    :id="checkboxID"
  >
    <slot :is-checked="modelValue" :is-disabled="isDisabled" />
    <input
      v-if="isFormControl"
      type="checkbox"
      :value="props.value"
      :checked="modelValue"
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
