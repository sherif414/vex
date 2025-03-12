import { tryOnScopeDispose } from '@vueuse/core';
import { type Ref, onWatcherCleanup, ref, watch } from 'vue';
import { useDelayedOpen } from './delayed-open';
import { isMouseLikePointerType } from './floating-ui';

export interface UseHoverOptions {
  /**
   * Whether the Hook is enabled, including all internal Effects and event
   * handlers.
   * @default true
   */
  enabled?: Ref<boolean>;

  /**
   * Delay in milliseconds before showing the floating element.
   * @default 0
   */
  delay?: Ref<number | { show: number; hide: number }>;

  /**
   * Whether to handle keyboard focus events.
   * @default false
   */
  handleFocus?: Ref<boolean>;

  /**
   * Whether to prevent the default hover behavior when touch
   * interactions have been detected.
   * @default true
   */
  ignoreTouchDevices?: Ref<boolean>;

  /**
   * Callback function that is triggered when the open state changes.
   * @param open - A boolean indicating whether the floating element is open.
   */
  onOpenChange: (open: boolean) => void;
}

/**
 * Opens or closes the floating element when hovering over the reference element,
 * adding extra event handling to ensure good UX.
 */
export function useHover(target: Ref<HTMLElement | null>, options: UseHoverOptions) {
  const {
    enabled = ref(true),
    delay = ref(0),
    handleFocus = ref(false),
    ignoreTouchDevices = ref(true),
    onOpenChange,
  } = options;

  const pointerType = ref<string | undefined>(undefined);
  const isHovered = ref(false);

  const show = () => {
    if (!enabled.value) return;
    onOpenChange(true);
  };

  const hide = () => {
    if (!enabled.value) return;
    onOpenChange(false);
  };

  const delayed = useDelayedOpen(show, hide, {
    defaultShowDelay: () => (typeof delay.value === 'number' ? delay.value : delay.value.show),
    defaultHideDelay: () => (typeof delay.value === 'number' ? delay.value : delay.value.hide),
  });

  const handlePointerEnter = (event: PointerEvent) => {
    pointerType.value = event.pointerType;

    if (ignoreTouchDevices.value && !isMouseLikePointerType(pointerType.value)) {
      return;
    }

    isHovered.value = true;
    delayed.show();
  };

  const handlePointerLeave = (event: PointerEvent) => {
    if (ignoreTouchDevices.value && !isMouseLikePointerType(pointerType.value)) {
      return;
    }

    isHovered.value = false;
    delayed.hide();
  };

  const handleFocusIn = () => {
    if (!handleFocus.value) return;
    delayed.show();
  };

  const handleFocusOut = () => {
    if (!handleFocus.value) return;
    delayed.hide();
  };

  // Cleanup function to remove event listeners
  const cleanup = (el?: HTMLElement | null): void => {
    if (!el) return;

    el.removeEventListener('pointerenter', handlePointerEnter);
    el.removeEventListener('pointerleave', handlePointerLeave);
    el.removeEventListener('focus', handleFocusIn);
    el.removeEventListener('blur', handleFocusOut);
  };

  // Watch for target changes and enabled state
  watch(
    [target, enabled],
    ([el, isEnabled]) => {
      if (!el || !isEnabled) return;

      el.addEventListener('pointerenter', handlePointerEnter);
      el.addEventListener('pointerleave', handlePointerLeave);
      el.addEventListener('focus', handleFocusIn);
      el.addEventListener('blur', handleFocusOut);

      onWatcherCleanup(() => cleanup(el));
    },
    { immediate: true }
  );

  // Cleanup on scope dispose
  tryOnScopeDispose(() => cleanup(target.value));

  return {
    isHovered,
  };
}
