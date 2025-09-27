import { onScopeDispose, toValue } from "vue"
import type { Fn, MaybeRefOrGetter } from "@/types"

/**
 * Options for configuring the delayed open/hide behavior.
 */
interface UseDelayedOpenOptions {
  /**
   * Default delay for showing the element (in milliseconds).
   */
  defaultShowDelay?: MaybeRefOrGetter<number>
  /**
   * Default delay for hiding the element (in milliseconds).
   */
  defaultHideDelay?: MaybeRefOrGetter<number>
}

/**
 * Return type for the useDelayedOpen composable.
 */
interface UseDelayedOpenReturn {
  /**
   * Shows the element after the specified delay (in milliseconds).
   * If no delay is provided, uses the defaultShowDelay.
   * @param delay - Optional delay in milliseconds.
   */
  show: (delay?: number) => void
  /**
   * Hides the element after the specified delay (in milliseconds).
   * If no delay is provided, uses the defaultHideDelay.
   * @param delay - Optional delay in milliseconds.
   */
  hide: (delay?: number) => void
}

/**
 * A Vue composable that provides delayed show and hide functionality.
 * Useful for tooltips, popovers, or any UI element that needs delayed visibility changes.
 *
 * @param show - The function to call when showing the element.
 * @param hide - The function to call when hiding the element.
 * @param options - Configuration options for delays.
 * @returns An object with delayed show and hide methods.
 */
export function useDelayedOpen(
  show: Fn,
  hide: Fn,
  options: UseDelayedOpenOptions = {},
): UseDelayedOpenReturn {
  const { defaultHideDelay = 0, defaultShowDelay = 0 } = options

  let showTimeoutID: ReturnType<typeof setTimeout>
  let hideTimeoutID: ReturnType<typeof setTimeout>

  /**
   * Internal function to clear any pending timeouts.
   */
  const clearTimeouts = (): void => {
    clearTimeout(showTimeoutID)
    clearTimeout(hideTimeoutID)
  }

  onScopeDispose(clearTimeouts)

  return {
    show: (delay?: number): void => {
      clearTimeouts()
      const _delay = delay ?? toValue(defaultShowDelay)

      if (_delay === 0) show()
      else showTimeoutID = setTimeout(show, _delay)
    },

    hide: (delay?: number): void => {
      clearTimeouts()
      const _delay = delay ?? toValue(defaultHideDelay)

      if (_delay === 0) hide()
      else hideTimeoutID = setTimeout(hide, _delay)
    },
  }
}
