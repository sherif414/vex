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
  checked?: boolean
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
const checked = defineModel<boolean>("checked", { default: false })

const defaultValue = checked.value
const checkboxEl = useTemplateRef("checkbox")
const hiddenInputEl = useTemplateRef("input")
const fieldContext = useFieldContext()
const { isFormControl } = useFormControl(checkboxEl)

const isDisabled = computed<boolean>(() => fieldContext?.disabled.value || props.disabled)
const checkboxID = computed(() => props.id ?? fieldContext?.inputID)

function check() {
  if (isDisabled.value) return
  checked.value = true
}

function uncheck() {
  if (isDisabled.value) return
  checked.value = false
}

function toggle() {
  if (isDisabled.value) return
  checked.value ? uncheck() : check()
}

function reset(): void {
  checked.value = defaultValue
}

onMounted(() => {
  if (props.autoFocus) {
    checkboxEl.value?.focus()
  }

  if (isFormControl.value && hiddenInputEl.value) {
    hiddenInputEl.value.form?.addEventListener("reset", reset)
  }
})

defineExpose({ check, uncheck, toggle, isChecked: checked, isDisabled })
</script>

<template>
  <button
    @pointerdown="toggle"
    @keydown.space="toggle"
    @keydown.enter.prevent
    ref="checkbox"
    type="button"
    role="checkbox"
    :aria-checked="props.indeterminate ? 'mixed' : checked"
    :aria-disabled="isDisabled"
    :aria-required="props.required"
    :aria-invalid="props.validationState === 'invalid'"
    :aria-describedby="fieldContext?.descriptionID"
    :aria-labelledby="fieldContext?.labelID"
    :data-checked="checked || undefined"
    :data-disabled="isDisabled || undefined"
    :id="checkboxID"
  >
    <slot :is-checked="checked" :is-disabled="isDisabled" />
    <input
      v-if="isFormControl"
      type="checkbox"
      :value="props.value"
      v-model="checked"
      :name="props.name"
      :required="props.required"
      :disabled="isDisabled"
      inert
      ref="input"
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
