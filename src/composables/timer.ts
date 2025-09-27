import type { Ref } from "vue"
import { onScopeDispose, readonly, ref } from "vue"

/**
 * Public API returned by {@link useTimer}.
 * Encapsulates controls for a one-shot timer and a reactive running state.
 */
export interface Timer {
  /**
   * Start the timer. No-op if already running.
   */
  start: () => void

  /**
   * Stop and clear the timer immediately.
   */
  stop: () => void

  /**
   * Pause the timer, preserving remaining time. No-op if not running.
   */
  pause: () => void

  /**
   * Resume a previously paused timer. No-op if timer has finished or is running.
   */
  resume: () => void

  /**
   * Restart the timer from the full duration, regardless of current state.
   * This is equivalent to an atomic stop-and-start operation.
   */
  restart: () => void

  /**
   * Reactive flag indicating whether the timer is currently running.
   */
  isRunning: Readonly<Ref<boolean>>
}

/**
 * Create a controllable one-shot timer.
 *
 * The timer counts down from the provided `duration` (in milliseconds) and
 * runs the callback `cb` exactly once when it reaches zero. You can start,
 * stop, pause, and resume the timer. The `isRunning` ref exposes whether the
 * timer is currently counting down.
 *
 * Notes:
 * - Calling `start()` while already running is a no-op and logs a warning in dev.
 * - `pause()` only works while running and preserves remaining time.
 * - `resume()` only works after a pause and while there is remaining time.
 * - `stop()` cancels any pending timeout and resets remaining time to zero.
 *
 * @param duration The total duration for the timer in milliseconds.
 * @param cb Callback invoked once when the timer completes.
 * @returns A {@link Timer} with control methods and reactive state.
 */
export function useTimer(duration: number, cb: () => void): Timer {
  let startTime = 0
  let remainingTime = 0
  let timeoutID: ReturnType<typeof setTimeout>
  const isRunning = ref(false)

  const start = (): void => {
    if (isRunning.value) {
      if (import.meta.env.DEV) {
        console.warn("[vex] timer is already running, make sure to `stop` it first")
      }
      return
    }

    startTime = Date.now()
    remainingTime = duration

    timeoutID = setTimeout(() => {
      stop()
      cb()
    }, remainingTime)

    isRunning.value = true
  }

  const stop = (): void => {
    clearTimeout(timeoutID)
    remainingTime = 0
    isRunning.value = false
  }

  const pause = (): void => {
    if (remainingTime === 0 || !isRunning.value) return

    clearTimeout(timeoutID)
    remainingTime -= Date.now() - startTime
    isRunning.value = false
  }

  const resume = (): void => {
    if (remainingTime === 0 || isRunning.value) return
    startTime = Date.now()

    timeoutID = setTimeout(() => {
      stop()
      cb()
    }, remainingTime)

    isRunning.value = true
  }

  const restart = (): void => {
    clearTimeout(timeoutID)
    remainingTime = duration
    startTime = Date.now()

    timeoutID = setTimeout(() => {
      stop()
      cb()
    }, remainingTime)

    isRunning.value = true
  }

  onScopeDispose(stop)

  return {
    stop,
    start,
    pause,
    resume,
    restart,
    isRunning: readonly(isRunning),
  }
}
