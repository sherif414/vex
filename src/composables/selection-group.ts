import { type Ref, toValue, watch } from "vue"
import type { MaybeRefOrGetter } from "@/types"
import { isWatchable } from "@/utils"

// ==============================
// Types
// ==============================

type PrimitiveValue = string | number | boolean | symbol

/**
 * Options that configure selection behavior.
 */
interface Options<T> {
  /**
   * Enable multi-select mode. When true, multiple values can be selected.
   * @default false
   */
  multiselect?: MaybeRefOrGetter<boolean>
  /**
   * In single-select mode, whether selecting an already selected value should clear selection.
   * @default false
   */
  deselectOnReselect?: MaybeRefOrGetter<boolean>
  /**
   * Optional function to produce a primitive key for comparison when values are objects.
   */
  getKey?: (value: T) => PrimitiveValue
}

/**
 * Strategy interface implemented by single- and multi-select modes.
 */
interface SelectionStrategy<T> {
  select: (value: T, deselectOnReselect: boolean) => void
  deselect: (value: T) => void
  isSelected: (value: T) => boolean
}

// ==============================
// Public API
// ==============================

/**
 * Public API returned by `useSelectionGroup`.
 */
export interface SelectionGroup<T> {
  /**
   * Select a value. Behavior depends on multi/single strategy.
   *
   * - In single-select mode, only one value can be selected at a time.
   * - In multi-select mode, values are toggled in/out of the selection.
   */
  select: (value: T) => void
  /**
   * Reactive list of selected values.
   */
  selected: Ref<T[]>
  /**
   * Deselect a value.
   */
  deselect: (value: T) => void
  /**
   * Check whether a value is selected.
   */
  isSelected: (value: T) => boolean
  /**
   * Clear all selected values.
   */
  clearSelected: () => void
}

/**
 * Create a selection group which manages selecting/deselecting values.
 *
 * - In single-select mode, only one value can be selected at a time.
 * - In multi-select mode, values are toggled in/out of the selection.
 * - A custom `getKey` can be provided to compare complex values by a primitive key.
 */
export function useSelectionGroup<T>(
  selected: Ref<T[]>,
  options: Options<T> = {},
): SelectionGroup<T> {
  const { deselectOnReselect = false, multiselect = false, getKey } = options

  // Choose strategy based on current multiselect value
  let selectionStrategy = toValue(multiselect)
    ? useMultiSelect(selected, getKey)
    : useSingleSelect(selected, getKey)

  const select = (value: T): void => {
    selectionStrategy.select(value, toValue(deselectOnReselect))
  }

  const deselect = (value: T): void => {
    selectionStrategy.deselect(value)
  }

  const isSelected = (value: T): boolean => {
    return selectionStrategy.isSelected(value)
  }

  const clearSelected = (): void => {
    selected.value = []
  }

  if (isWatchable(multiselect)) {
    watch(multiselect, (multi) => {
      clearSelected()
      selectionStrategy = multi
        ? useMultiSelect(selected, getKey)
        : useSingleSelect(selected, getKey)
    })
  }

  return {
    select,
    selected,
    deselect,
    isSelected,
    clearSelected,
  }
}

// ==============================
// Internal strategies (helpers)
// ==============================

/**
 * Single-select strategy: only one value can be selected at a time.
 */
function useSingleSelect<T>(
  selected: Ref<T[]>,
  getKey?: (value: T) => PrimitiveValue,
): SelectionStrategy<T> {
  const equals = (a: T, b: T): boolean => (getKey ? getKey(a) === getKey(b) : a === b)

  const isSelected = (value: T): boolean => {
    return selected.value.some((item) => equals(item, value))
  }

  const deselect = (value: T): void => {
    if (isSelected(value)) {
      selected.value = []
    }
  }

  const select = (value: T, deselectOnReselect: boolean): void => {
    if (isSelected(value)) {
      deselectOnReselect && deselect(value)
    } else {
      selected.value = [value]
    }
  }

  return {
    select,
    deselect,
    isSelected,
  }
}

/**
 * Multi-select strategy: values are toggled in/out of the selection list.
 */
function useMultiSelect<T>(
  selected: Ref<T[]>,
  getKey?: (value: T) => PrimitiveValue,
): SelectionStrategy<T> {
  const equals = (a: T, b: T): boolean => (getKey ? getKey(a) === getKey(b) : a === b)

  const isSelected = (value: T): boolean => {
    return selected.value.some((item) => equals(item, value))
  }

  const deselect = (value: T): void => {
    selected.value = selected.value.filter((item) => !equals(item, value))
  }

  const select = (value: T): void => {
    if (isSelected(value)) {
      deselect(value)
    } else {
      selected.value = [...selected.value, value]
    }
  }

  return {
    select,
    deselect,
    isSelected,
  }
}
