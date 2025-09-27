import type { Ref } from "vue"
import { computed, shallowReadonly, shallowRef } from "vue"

/**
 * Type for a single item in the collection.
 * @template T - The base type of the item, must be an object.
 */
export type CollectionItem<T extends object> = T & {
  templateRef: Ref<HTMLElement | null>
  uid: string
}

/**
 * Interface for the collection, providing methods to manage items.
 * @template T - The base type of the items, must be an object.
 */
export interface Collection<T extends object> {
  /**
   * Adds a new item to the collection.
   * @param item - The item to add, including its template ref.
   * @returns The added item with generated UID.
   */
  addItem: (item: T & { templateRef: Ref<HTMLElement | null> }) => CollectionItem<T>
  /**
   * Reactive reference to the collection items.
   */
  items: Readonly<Ref<CollectionItem<T>[]>>
  /**
   * Removes an item from the collection by UID.
   * @param uid - The unique ID of the item to remove.
   * @returns True if an item was removed, false otherwise.
   */
  removeItem: (uid: string) => boolean
  /**
   * Retrieves an item from the collection by UID.
   * @param uid - The unique ID of the item.
   * @returns The item if found, undefined otherwise.
   */
  getItem: (uid: string) => CollectionItem<T> | undefined
  /**
   * Clears all items from the collection.
   */
  clear: () => void
  /**
   * Computed reactive reference to the DOM elements of all items.
   */
  elements: Readonly<Ref<HTMLElement[]>>
  /**
   * Computed reactive reference to the number of items in the collection.
   */
  size: Readonly<Ref<number>>
}

/**
 * Options for configuring the useCollection composable.
 */
export interface UseCollectionOptions {
  /**
   * Optional maximum number of items allowed in the collection.
   */
  maxItems?: number
}

/**
 * Creates a minimal collection composable that manages items with stable UIDs.
 *
 * @param uid - Base identifier for generating unique IDs for items.
 * @param options - Configuration options for the collection.
 * @type {UseCollectionOptions}
 * @returns The collection interface with methods to manage items.
 * @template T - The base type of the items, must be an object.
 */
export function useCollection<T extends object>(
  uid: string,
  options: UseCollectionOptions = {},
): Collection<T> {
  let count = 0
  const { maxItems } = options

  const generateUID = (): string => `${uid}-${count++}`
  const items = shallowRef<CollectionItem<T>[]>([])

  const elements = computed(() => {
    const result: HTMLElement[] = []
    for (const item of items.value) {
      const el = item.templateRef.value
      if (el) result.push(el)
    }
    return result
  })

  const size = computed(() => items.value.length)

  const addItem = (item: T & { templateRef: Ref<HTMLElement | null> }): CollectionItem<T> => {
    if (maxItems && items.value.length >= maxItems) {
      throw new Error(`Collection cannot exceed ${maxItems} items`)
    }

    const collectionItem: CollectionItem<T> = {
      ...item,
      uid: generateUID(),
    }

    items.value = [...items.value, collectionItem]
    return collectionItem
  }

  const removeItem = (uid: string): boolean => {
    const originalLength = items.value.length
    items.value = items.value.filter((item) => item.uid !== uid)
    return items.value.length < originalLength
  }

  const getItem = (uid: string): CollectionItem<T> | undefined => {
    return items.value.find((item) => item.uid === uid)
  }

  const clear = (): void => {
    items.value = []
  }

  return {
    addItem,
    removeItem,
    getItem,
    clear,
    items: shallowReadonly(items),
    elements,
    size,
  }
}
