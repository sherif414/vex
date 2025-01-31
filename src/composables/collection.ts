import type { Ref } from "vue";
import { reactive, ref, shallowRef, watch } from "vue";

export type CollectionItem<T> = T & {
  templateRef: Ref<HTMLElement | null>;
  uid: string;
};

export interface Collection<T> {
  addItem: (item: Omit<CollectionItem<T>, "uid">) => CollectionItem<T>;
  items: Ref<CollectionItem<T>[]>;
  removeItem: (id: string) => void;
  getItem: (id: string) => CollectionItem<T> | undefined;
  elements: Readonly<Ref<HTMLElement[]>>;
}

export function useCollection<T>(uid: string): Collection<T> {
  let count = 0;
  const generateUID = () => `${uid}-${count++}`;
  const items = shallowRef<CollectionItem<T>[]>([]);

  const elements = ref<HTMLElement[]>([]);
  watch(items, (items) => {
    elements.value = items.reduce<HTMLElement[]>((arr, ref) => {
      const el = ref.templateRef.value;
      el != null && arr.push(el);
      return arr;
    }, []);
  });

  const addItem = (item: Omit<CollectionItem<T>, "uid">): CollectionItem<T> => {
    const collectionItem = {
      ...item,
      uid: generateUID(),
    } as CollectionItem<T>;
    items.value.push(collectionItem);
    return collectionItem;
  };

  const removeItem = (uid: string): void => {
    items.value = items.value.filter((i) => i.uid === uid);
  };

  const getItem = (uid: string): CollectionItem<T> | undefined => {
    return items.value.find((item) => item.uid === uid);
  };

  return {
    addItem,
    removeItem,
    getItem,
    items,
    elements,
  };
}
