import { type Ref, watch, toValue } from "vue";
import type { MaybeRefOrGetter } from "@/types";
import { isWatchable } from "@/utils";

type PrimitiveValue = string | number | boolean | symbol;

interface Options {
  multiselect?: MaybeRefOrGetter<boolean>;
  deselectOnReselect?: MaybeRefOrGetter<boolean>;
}

interface SelectionStrategy<T extends PrimitiveValue> {
  select: (value: T, deselectOnReselect: boolean) => void;
  deselect: (value: T) => void;
  isSelected: (value: T) => boolean;
}

export interface SelectionGroup<T extends PrimitiveValue> {
  select: (value: T) => void;
  selected: Ref<T[]>;
  deselect: (value: T) => void;
  isSelected: (value: T) => boolean;
  clearSelected: () => void;
}

/**
 * Establishes and controls a group of selectable primitive values.
 *
 * This composable includes methods for selecting, deselecting, and verifying
 * if individual values are selected within a collective group. It supports
 * both single selection and multiple selection modes, which can be configured
 * through the provided options.
 *
 * @template T - The type of primitive value being handled (string, number, boolean, or symbol).
 * @param {Ref<T[]>} selected - A reactive reference to the array of values that are currently selected.
 * @param {Options} [options] - A configuration object with optional settings.
 * @param {MaybeRefOrGetter<boolean>} [options.multiselect] - Determines if multiple selections are allowed.
 * @param {MaybeRefOrGetter<boolean>} [options.deselectOnReselect] - Determines if selecting an already selected item should deselect it; applies only in single-select mode.
 * @returns {SelectionGroup<T>} An object equipped with methods for managing the selection group.
 *
 * @example
 * const selectedItems = ref<string[]>([]);
 * const selectionGroup = useSelectionGroup(selectedItems);
 *
 * // Usage example:
 * selectionGroup.select('item1');
 * selectionGroup.deselect('item2');
 * console.log(selectionGroup.isSelected('item1')); // true
 * selectionGroup.clearSelected();
 */
export function useSelectionGroup<T extends PrimitiveValue>(
  selected: Ref<T[]>,
  options: Options = {}
): SelectionGroup<T> {
  const { deselectOnReselect = false, multiselect = false } = options;
  let selectionStrategy = toValue(multiselect)
    ? useMultiSelect(selected)
    : useSingleSelect(selected);

  const select = (value: T): void => {
    selectionStrategy.select(value, toValue(deselectOnReselect));
  };

  const deselect = (value: T): void => {
    selectionStrategy.deselect(value);
  };

  const isSelected = (value: T): boolean => {
    return selectionStrategy.isSelected(value);
  };

  const clearSelected = (): void => {
    selected.value = [];
  };

  if (isWatchable(multiselect)) {
    watch(multiselect, (multi) => {
      clearSelected();
      selectionStrategy = multi
        ? useMultiSelect(selected)
        : useSingleSelect(selected);
    });
  }

  return {
    select,
    selected,
    deselect,
    isSelected,
    clearSelected,
  };
}

//===

function useSingleSelect<T extends PrimitiveValue>(
  selected: Ref<T[]>
): SelectionStrategy<T> {
  const isSelected = (value: T): boolean => {
    return selected.value.includes(value);
  };

  const deselect = (value: T): void => {
    selected.value = [];
  };

  const select = (value: T, deselectOnReselect: boolean): void => {
    if (isSelected(value)) {
      deselectOnReselect && deselect(value);
    } else {
      selected.value = [value];
    }
  };

  return {
    select,
    deselect,
    isSelected,
  };
}

//===

function useMultiSelect<T extends PrimitiveValue>(
  selected: Ref<T[]>
): SelectionStrategy<T> {
  const isSelected = (value: T): boolean => {
    return selected.value.includes(value);
  };

  const deselect = (value: T): void => {
    selected.value = selected.value.filter((_value) => _value !== value);
  };

  const select = (value: T): void => {
    if (isSelected(value)) {
      deselect(value);
    } else {
      selected.value = [...selected.value, value];
    }
  };

  return {
    select,
    deselect,
    isSelected,
  };
}
