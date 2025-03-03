<script lang="ts">
export interface CheckboxProps {
  /**
   * Whether the checkbox is in an indeterminate state
   */
  indeterminate?: boolean;
  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean;
  /**
   * The name of the checkbox, used for form submissions
   */
  name?: string;
  /**
   * The value of the checkbox, used for form submissions
   */
  value: string;
  /**
   * Whether the checkbox should receive focus on mount
   */
  autoFocus?: boolean;
  /**
   * The validation state of the checkbox
   */
  validationState?: "valid" | "invalid";
  /**
   * Whether the checkbox is required
   */
  required?: boolean;
  /**
   * The state of the checkbox
   */
  modelValue?: boolean;
}
</script>

<script setup lang="ts">
import { useControllableState } from "@/composables";
import { computed, onMounted, ref, watch, type Ref } from "vue";
import { useCheckboxGroupContext } from "./CheckboxGroup.vue";

const props = withDefaults(defineProps<CheckboxProps>(), {});
const ctx = useCheckboxGroupContext();
const isGrouped = !!ctx;

const modelValue = useControllableState(() => props.modelValue);
const inputRef = ref<HTMLInputElement | null>(null);
const isChecked: Readonly<Ref<boolean>> = isGrouped
  ? computed(() => ctx.group.isSelected(props.value))
  : modelValue;

/**
 * indeterminate state cannot be set through html attributes in the template
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes
 */
watch(
  () => props.indeterminate,
  (value) => {
    if (inputRef.value) {
      inputRef.value.indeterminate = value;
    }
  },
);

function toggle() {
  if (props.disabled) return;
  modelValue.value = !modelValue.value;
}

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate;
  }
});

defineExpose({
  inputElement: inputRef,
});
</script>

<template>
  <div
    @click="toggle"
    @keydown.space="toggle"
    @keydown.enter.prevent
    role="checkbox"
    :aria-checked="props.indeterminate ? 'mixed' : isChecked"
    :aria-disabled="props.disabled"
    :aria-required="props.required"
    :aria-invalid="props.validationState === 'invalid'"
    tabindex="0"
  >
    <input
      ref="inputRef"
      type="checkbox"
      :checked="isChecked"
      :disabled="props.disabled"
      :name="props.name"
      :value="props.value"
      :required="props.required"
      :aria-checked="props.indeterminate ? 'mixed' : isChecked"
      :aria-disabled="props.disabled"
      :aria-required="props.required"
      :aria-invalid="props.validationState === 'invalid'"
      :autofocus="props.autoFocus"
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
    <slot></slot>
  </div>
</template>
