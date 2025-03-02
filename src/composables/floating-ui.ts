import {
  computed,
  ref,
  watch,
  onScopeDispose,
  type ComputedRef,
  type Ref,
  onWatcherCleanup,
} from "vue";
import { useEventListener } from "@vueuse/core";

export interface UseClickOptions {
  /**
   * Whether the Hook is enabled, including all internal Effects and event
   * handlers.
   * @default true
   */
  enabled?: Ref<boolean>;
  /**
   * The type of event to use to determine a “click” with mouse input.
   * Keyboard clicks work as normal.
   * @default 'click'
   */
  event?: Ref<"click" | "mousedown">;
  /**
   * Whether to toggle the open state with repeated clicks.
   * @default true
   */
  toggle?: Ref<boolean>;
  /**
   * Whether to ignore the logic for mouse input (for example, if `useHover()`
   * is also being used).
   * @default false
   */
  ignoreMouse?: Ref<boolean>;
  /**
   * Whether to add keyboard handlers (Enter and Space key functionality) for
   * non-button elements (to open/close the floating element via keyboard
   * “click”).
   * @default true
   */
  keyboardHandlers?: boolean;
  /**
   * If already open from another event such as the `useHover()` Hook,
   * determines whether to keep the floating element open when clicking the
   * reference element for the first time.
   * @default true
   */
  stickIfOpen?: Ref<boolean>;
  onOpenChange: (open: boolean) => void;
  open: ComputedRef<boolean>;
  openEventType: "click" | "mousedown";
}

/**
 * Opens or closes the floating element when clicking the reference element.
 * @see https://floating-ui.com/docs/useClick
 */
export function useClick(target: Ref<HTMLElement | null>, options: UseClickOptions) {
  const {
    enabled = ref(true),
    open,
    onOpenChange,
    openEventType,
    event: eventOption = ref("click"),
    toggle = ref(true),
    ignoreMouse = ref(false),
    keyboardHandlers = true,
    stickIfOpen = ref(true),
  } = options;

  let pointerType: string | undefined = undefined;
  let didKeyDownFire = false;

  const onPointerdown = (event: PointerEvent) => {
    pointerType = event.pointerType;
  };

  const onMousedown = (event: MouseEvent) => {
    // Ignore all buttons except for the "main" button.
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
    if (event.button !== 0) return;
    if (eventOption.value === "click") return;
    if (isMouseLikePointerType(pointerType, true) && ignoreMouse.value) return;

    if (open.value && toggle.value && (stickIfOpen.value ? openEventType === "mousedown" : true)) {
      onOpenChange(false);
    } else {
      // Prevent stealing focus from the floating element
      event.preventDefault();
      onOpenChange(true);
    }
  };

  const onClick = (event: MouseEvent) => {
    if (eventOption.value === "mousedown" && pointerType) {
      pointerType = undefined;
      return;
    }

    if (isMouseLikePointerType(pointerType, true) && ignoreMouse.value) return;

    if (open.value && toggle.value && (stickIfOpen.value ? openEventType === "click" : true)) {
      onOpenChange(false);
    } else {
      onOpenChange(true);
    }
  };

  const onKeydown = (event: KeyboardEvent) => {
    pointerType = undefined;

    if (event.defaultPrevented || !keyboardHandlers || isButtonTarget(event)) {
      return;
    }

    if (event.key === " " && !isSpaceIgnored(target.value)) {
      // Prevent scrolling
      event.preventDefault();
      didKeyDownFire = true;
    }

    if (event.key === "Enter") {
      if (open.value && toggle.value) {
        onOpenChange(false);
      } else {
        onOpenChange(true);
      }
    }
  };

  const onKeyup = (event: KeyboardEvent) => {
    if (
      event.defaultPrevented ||
      !keyboardHandlers ||
      isButtonTarget(event) ||
      isSpaceIgnored(target.value)
    ) {
      return;
    }

    if (event.key === " " && didKeyDownFire) {
      didKeyDownFire = false;
      if (open.value && toggle.value) {
        onOpenChange(false);
      } else {
        onOpenChange(true);
      }
    }
  };

  // Cleanup function to remove event listeners
  const cleanup = (el?: HTMLElement | null): void => {
    if (!el) return;

    el.removeEventListener("pointerdown", onPointerdown);
    el.removeEventListener("mousedown", onMousedown);
    el.removeEventListener("click", onClick);
    el.removeEventListener("keydown", onKeydown);
    el.removeEventListener("keyup", onKeyup);
  };

  // Watch for target changes and enabled state
  watch(
    [target, enabled],
    ([el, isEnabled]) => {
      if (!el || !isEnabled) return;

      el.addEventListener("pointerdown", onPointerdown);
      el.addEventListener("mousedown", onMousedown);
      el.addEventListener("click", onClick);
      el.addEventListener("keydown", onKeydown);
      el.addEventListener("keyup", onKeyup);

      onWatcherCleanup(() => cleanup(el));
    },
    { immediate: true },
  );

  // Cleanup on scope dispose
  onScopeDispose(() => cleanup(target.value));
}

// utils
function isHTMLElement(element: unknown): element is HTMLElement {
  return element instanceof HTMLElement;
}

function isButtonTarget(event: KeyboardEvent) {
  const { target } = event;
  return isHTMLElement(target) && target.tagName === "BUTTON";
}

function isSpaceIgnored(element: Element | null) {
  return isTypeableElement(element);
}

export function isMouseLikePointerType(pointerType: string | undefined, strict?: boolean) {
  // On some Linux machines with Chromium, mouse inputs return a `pointerType`
  // of "pen": https://github.com/floating-ui/floating-ui/issues/2015
  const values: Array<string | undefined> = ["mouse", "pen"];
  if (!strict) {
    values.push("", undefined);
  }
  return values.includes(pointerType);
}

function isTypeableElement(element: unknown): boolean {
  return (
    isHTMLElement(element) &&
    element.isContentEditable &&
    element.matches("input:not([type='hidden']):not([disabled])," + "textarea:not([disabled])")
  );
}
