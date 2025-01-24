import type { ComputedRef, MaybeRefOrGetter, Ref } from "vue";
import { computed, onUnmounted, shallowReactive, toRef } from "vue";

export interface CollectionItem<T extends HTMLElement = HTMLElement> {
  uid: string;
  templateRef: Ref<T | null>;
  disabled: Ref<boolean>;
}

export interface Collection<T extends HTMLElement = HTMLElement> {
  addItem: (
    templateRef: Ref<T | null>,
    disabled: Ref<boolean>
  ) => CollectionItem<T>;
  items: ComputedRef<CollectionItem<T>[]>;
  removeItem: (templateRef: Ref<T | null>) => void;
  elements: ComputedRef<T[]>;
}

export function createCollection<T extends HTMLElement = HTMLElement>(
  uid: string
): Collection<T> {
  let count = 0;
  const collection = shallowReactive<Map<Ref<T | null>, CollectionItem<T>>>(
    new Map()
  );

  const items = computed(() => [...collection.values()]);
  const elements = computed(() =>
    [...collection.keys()].reduce<T[]>((arr, ref) => {
      const el = ref.value;
      el != null && arr.push(el);
      return arr;
    }, [])
  );

  const generateID = (): string => {
    return `${uid}-${count++}`;
  };

  const addItem = (
    templateRef: Ref<T | null>,
    disabled: Ref<boolean>
  ): CollectionItem<T> => {
    const uid = generateID();
    const item = { uid, templateRef, disabled };
    collection.set(templateRef, item);

    onUnmounted(() => {
      removeItem(templateRef);
    });
    return item;
  };

  const removeItem = (templateRef: Ref<T | null>): void => {
    collection.delete(templateRef);
  };

  return {
    addItem,
    removeItem,
    items,
    elements,
  };
}

export function useCollection<T extends HTMLElement = HTMLElement>(
  collection: Collection<T>,
  item: { templateRef: Ref<T | null>; disabled: MaybeRefOrGetter<boolean> }
) {
  const disabled = toRef(item.disabled);
  onUnmounted(() => {
    collection.removeItem(item.templateRef);
  });
  const _item = collection.addItem(item.templateRef, disabled);
  return _item;
}
