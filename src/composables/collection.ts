import { remove } from "@/utils";
import type { ComputedRef, MaybeRefOrGetter, Ref } from "vue";
import { computed, onUnmounted, shallowReactive, toRef } from "vue";

export type CollectionItem<T> = T & {
  templateRef: Ref<HTMLElement | null>;
  uid: string;
};

export interface Collection<T> {
  addItem: (item: Omit<CollectionItem<T>, "uid">) => CollectionItem<T>;
  items: CollectionItem<T>[];
  removeItem: (item: CollectionItem<T>) => void;
  elements: ComputedRef<HTMLElement[]>;
}

export function createCollection<T>(uid: string): Collection<T> {
  let count = 0;
  const generateUID = () => `${uid}-${count++}`;
  const items = shallowReactive<CollectionItem<T>[]>([]);

  const elements = computed(() =>
    items.reduce<HTMLElement[]>((arr, ref) => {
      const el = ref.templateRef.value;
      el != null && arr.push(el);
      return arr;
    }, [])
  );

  const addItem = (item: Omit<CollectionItem<T>, "uid">): CollectionItem<T> => {
    const collectionItem = { ...item, uid: generateUID() } as CollectionItem<T>;
    items.push(collectionItem);
    return collectionItem;
  };

  const removeItem = (item: CollectionItem<T>): void => {
    remove(items, item);
  };

  return {
    addItem,
    removeItem,
    items,
    elements,
  };
}

export function useCollection<T>(
  collection: Collection<T>,
  item: Omit<CollectionItem<T>, "uid">
) {
  const collectionItem = collection.addItem(item);
  onUnmounted(() => collection.removeItem(collectionItem));
  return collectionItem;
}
