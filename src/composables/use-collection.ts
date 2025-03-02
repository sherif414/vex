import { shallowRef, type Ref } from "vue";

interface UseCollectionOptions<T> {
  /**
   * Callback triggered after an item is registered.
   */
  onRegister?: (item: T) => void;

  /**
   * Callback triggered after an item is unregistered.
   */
  onUnregister?: (item: T) => void;
}

export interface Collection<T> {
  /**
   * A reactive reference containing the list of items.
   */
  items: Readonly<Ref<T[]>>;

  /**
   * Adds an item to the collection.
   */
  register: (item: T) => T;

  /**
   * Removes an item from the collection.
   */
  unregister: (item: T) => void;

  /**
   * Clears the entire collection.
   */
  clear: () => void;

  /**
   * Retrieves the first item that matches the provided predicate.
   * @param predicate A function to test each item.
   * @returns The first item that passes the predicate test, or undefined if none match.
   */
  getItem: (predicate: (item: T) => boolean) => T | undefined;
}

/**
 * Creates and manages a reactive collection of items.
 * @param options Optional configuration to customize the collection behavior.
 * @returns An object containing the reactive collection and utility methods.
 */
export function useCollection<T>(options: UseCollectionOptions<T> = {}): Collection<T> {
  const { onRegister, onUnregister } = options;
  const items = shallowRef<T[]>([]);

  const register = (item: T) => {
    items.value = [...items.value, item];
    onRegister?.(item);
    return item;
  };

  const unregister = (item: T) => {
    items.value = items.value.filter((i) => i !== item);
    onUnregister?.(item);
  };

  const getItem = (predicate: (item: T) => boolean) => {
    return items.value.find(predicate);
  };

  const clear = () => {
    items.value = [];
  };

  return {
    items,
    register,
    unregister,
    getItem,
    clear,
  };
}
