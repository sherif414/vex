import {
  useCollection,
  useContext,
  useDelayedOpen,
  useEventListener,
  useID,
  useSelectionGroup,
  type SelectionGroup,
} from "@/composables";
import type { Collection, CollectionItem } from "@/composables/collection";
import type { MaybeRefOrGetter, TemplateRef } from "@/types";
import {
  provide,
  readonly,
  ref,
  shallowRef,
  toValue,
  type InjectionKey,
  type Ref,
} from "vue";

export interface ComboboxItem {
  label: string;
  value: string;
  templateRef: Ref<HTMLElement | null>;
  uid: string;
}

export interface ComboboxContext {
  triggerID: string;
  listboxID: string;
  listboxEl: TemplateRef;
  triggerEl: TemplateRef<HTMLInputElement>;
  loop: MaybeRefOrGetter<boolean>;
  group: SelectionGroup<string>;
  collection: Collection<ComboboxItem>;
  scrollBehavior: MaybeRefOrGetter<ScrollBehavior>;
  isOpen: Readonly<Ref<boolean>>;
  toggle: () => void;
  highlightedIndex: Ref<number>;
  activeListItem: Ref<ComboboxItem | null>;
  orientation: "vertical" | "horizontal";
}

export interface UseComboboxOptions {
  onSelect?: (value?: string) => void;
  onShowDropdown?: () => void;
  onHideDropdown?: () => void;
  loop?: MaybeRefOrGetter<boolean>;
  hideDelay?: MaybeRefOrGetter<number>;
  showDelay?: MaybeRefOrGetter<number>;
  multiselect?: MaybeRefOrGetter<boolean>;
  deselection?: MaybeRefOrGetter<boolean>;
  scrollBehavior?: MaybeRefOrGetter<ScrollBehavior>;
}

interface UseComboboxReturn {
  triggerID: string;
  triggerEl: TemplateRef<HTMLInputElement>;
  listboxID: string;
  listboxEl: TemplateRef;
  group: SelectionGroup<string>;
  collection: Collection<ComboboxItem>;
  isOpen: Readonly<Ref<boolean>>;
  toggle: () => void;
  highlightedIndex: Ref<number>;
  activeListItem: Ref<ComboboxItem | null>;
}

// ----------------------------------------------------------------------------------------------------

const COMBOBOX_INJECTION_KEY = Symbol() as InjectionKey<ComboboxContext>;

export function useCombobox(
  options: UseComboboxOptions = {}
): UseComboboxReturn {
  const {
    loop = true,
    multiselect = false,
    deselection = false,
    scrollBehavior = "auto",
    hideDelay = 0,
    showDelay = 0,
    onSelect,
    onHideDropdown,
    onShowDropdown,
  } = options;

  const listboxID = useID();
  const triggerID = useID();
  const listboxEl: TemplateRef = ref(null);
  const triggerEl: TemplateRef<HTMLInputElement> = ref(null);

  const isOpen = ref(false);
  const highlightedIndex = ref(-1);
  const activeListItem = shallowRef<ComboboxItem | null>(null);
  const orientation = "vertical";

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const delayed = useDelayedOpen(
    () => {
      if (isOpen.value) return;
      isOpen.value = true;
      onShowDropdown?.();
    },
    () => {
      if (!isOpen.value) return;
      isOpen.value = false;
      onHideDropdown?.();
    },
    {
      defaultShowDelay: showDelay,
      defaultHideDelay: hideDelay,
    }
  );

  const group = useSelectionGroup(ref<string[]>([]), {
    deselectOnReselect: deselection,
    multiselect,
  });
  const collection = useCollection<ComboboxItem>(listboxID);

  const select = (value: string): void => {
    onSelect?.(value);
  };

  const _group = {
    ...group,
    select,
  };

  provide(COMBOBOX_INJECTION_KEY, {
    triggerID,
    triggerEl,
    listboxID,
    listboxEl,
    loop,
    group: _group,
    collection,
    scrollBehavior,
    isOpen: readonly(isOpen),
    toggle,
    highlightedIndex,
    activeListItem,
    orientation,
  });

  return {
    triggerID,
    triggerEl,
    listboxID,
    listboxEl,
    group: _group,
    collection,
    isOpen: readonly(isOpen),
    toggle,
    highlightedIndex,
    activeListItem,
  };
}

export function useComboboxContext(component: string) {
  return useContext(COMBOBOX_INJECTION_KEY, "Combobox", component);
}
