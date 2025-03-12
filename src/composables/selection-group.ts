import type { MaybeRefOrGetter } from '@/types';
import { isWatchable } from '@/utils';
import { type Ref, toValue, watch } from 'vue';

type PrimitiveValue = string | number | boolean | symbol;

interface Options<T> {
  multiselect?: MaybeRefOrGetter<boolean>;
  deselectOnReselect?: MaybeRefOrGetter<boolean>;
  getKey?: (value: T) => PrimitiveValue;
}

interface SelectionStrategy<T> {
  select: (value: T, deselectOnReselect: boolean) => void;
  deselect: (value: T) => void;
  isSelected: (value: T) => boolean;
}

export interface SelectionGroup<T> {
  select: (value: T) => void;
  selected: Ref<T[]>;
  deselect: (value: T) => void;
  isSelected: (value: T) => boolean;
  clearSelected: () => void;
}

export function useSelectionGroup<T>(
  selected: Ref<T[]>,
  options: Options<T> = {}
): SelectionGroup<T> {
  const { deselectOnReselect = false, multiselect = false, getKey } = options;

  let selectionStrategy = toValue(multiselect)
    ? useMultiSelect(selected, getKey)
    : useSingleSelect(selected, getKey);

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
        ? useMultiSelect(selected, getKey)
        : useSingleSelect(selected, getKey);
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

function useSingleSelect<T>(
  selected: Ref<T[]>,
  getKey?: (value: T) => PrimitiveValue
): SelectionStrategy<T> {
  const isSelected = (value: T): boolean => {
    if (getKey) {
      const key = getKey(value);
      return selected.value.some((item) => getKey(item) === key);
    } else {
      return selected.value.includes(value);
    }
  };

  const deselect = (value: T): void => {
    if (isSelected(value)) {
      selected.value = [];
    }
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

function useMultiSelect<T>(
  selected: Ref<T[]>,
  getKey?: (value: T) => PrimitiveValue
): SelectionStrategy<T> {
  const isSelected = (value: T): boolean => {
    if (getKey) {
      const key = getKey(value);
      return selected.value.some((item) => getKey(item) === key);
    } else {
      return selected.value.includes(value);
    }
  };

  const deselect = (value: T): void => {
    if (getKey) {
      const key = getKey(value);
      selected.value = selected.value.filter((item) => getKey(item) !== key);
    } else {
      selected.value = selected.value.filter((_value) => _value !== value);
    }
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
