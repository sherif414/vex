<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import type { FocusTrap } from 'focus-trap';
import { createFocusTrap } from 'focus-trap';
import { nextTick, onUnmounted, ref, watch } from 'vue';
import { dialogStore } from '.';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    /**
     * Controls the open state of the dialog
     */
    modelValue?: boolean;

    /**
     * The id of the element that describes the dialog.
     */
    'aria-describedby'?: string;

    /**
     * The id of the element that labels the dialog.
     */
    'aria-labelledby'?: string;

    /**
     * When true, prevents scrolling outside the dialog
     * @default true
     */
    preventScroll?: boolean;
  }>(),
  {
    preventScroll: true,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  /**
   * Emitted when the escape key is pressed
   */
  escape: [];
  /**
   * Emitted when the dialog opens
   */
  open: [];
  /**
   * Emitted when the dialog closes
   */
  close: [];
}>();

// Refs
const dialogRef = ref<HTMLDialogElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);

// Focus trap
let focusTrap: FocusTrap | null = null;

// Handle keyboard events
useEventListener(dialogRef, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    emit('escape');
    emit('update:modelValue', false);
  }
});

// Handle scroll lock
function hideBodyScrollbar(): void {
  if (!props.preventScroll) return;

  dialogStore.openDialogsCount++;
  if (dialogStore.openDialogsCount === 1) {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.marginRight = `${scrollBarWidth}px`;
    document.body.style.overflow = 'hidden';
  }
}

function showBodyScrollbar(): void {
  if (!props.preventScroll) return;

  dialogStore.openDialogsCount--;
  if (dialogStore.openDialogsCount === 0) {
    document.body.style.marginRight = '';
    document.body.style.overflow = '';
  }
}

// Watch for changes in modelValue
watch(
  () => props.modelValue,
  (isOpen: boolean) => {
    if (isOpen) {
      hideBodyScrollbar();
      nextTick(() => {
        focusTrap = createFocusTrap(dialogRef.value!, {
          initialFocus: contentRef.value || undefined,
          escapeDeactivates: false,
        });
        focusTrap.activate();
        emit('open');
      });
    } else {
      showBodyScrollbar();
      focusTrap?.deactivate();
      emit('close');
    }
  }
);

onUnmounted(() => {
  showBodyScrollbar();
  focusTrap?.deactivate();
});

// Expose refs and methods
defineExpose({
  dialogRef,
  contentRef,
});

// Slots type definition
defineSlots<{
  default: (props: {}) => any;
}>();
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      v-bind="$attrs"
      ref="dialogRef"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <div ref="contentRef" class="contents">
        <slot />
      </div>
    </div>
  </Teleport>
</template>
