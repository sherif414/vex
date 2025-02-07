import {
  useContext,
  useDelayedOpen,
  useID,
  useSelectionGroup,
  type SelectionGroup,
} from "@/composables";
import type { TemplateRef } from "@/types";
import { useMutationObserver } from "@vueuse/core";
import type { ComputedRef, InjectionKey, MaybeRefOrGetter, Ref } from "vue";
import { computed, provide, ref } from "vue";

export interface ComboboxContext {
  triggerID: string;
  listboxID: string;
  listboxEl: TemplateRef;
  triggerEl: TemplateRef<HTMLInputElement>;
  loop: MaybeRefOrGetter<boolean>;
  group: SelectionGroup<string>;
  scrollBehavior: MaybeRefOrGetter<ScrollBehavior>;
  isVisible: Readonly<Ref<boolean>>;
  show: () => void;
  hide: () => void;
  highlightedIndex: Ref<number>;
  activeDescendentID: ComputedRef<string | undefined>;
  orientation: "vertical" | "horizontal";
  listItems: Ref<HTMLElement[]>;
}

export interface UseComboboxOptions {
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
  isVisible: Readonly<Ref<boolean>>;
  show: () => void;
  hide: () => void;
  highlightedIndex: Ref<number>;
  activeDescendentID: ComputedRef<string | undefined>;
  listItems: Ref<HTMLElement[]>;
}

// ----------------------------------------------------------------------------------------------------

const COMBOBOX_INJECTION_KEY = Symbol() as InjectionKey<ComboboxContext>;

export function useCombobox(
  modelValue: Ref<string[]>,
  options: UseComboboxOptions = {}
): UseComboboxReturn {
  const {
    loop = true,
    multiselect = false,
    deselection = false,
    scrollBehavior = "auto",
    hideDelay = 0,
    showDelay = 0,
    onHideDropdown,
    onShowDropdown,
  } = options;

  const listboxID = useID();
  const triggerID = useID();
  const listboxEl: TemplateRef = ref(null);
  const triggerEl: TemplateRef<HTMLInputElement> = ref(null);
  const listItems = ref<HTMLElement[]>([]);

  const isVisible = ref(false);
  const highlightedIndex = ref(-1);
  const activeDescendentID = computed<string | undefined>(() => {
    const elements = listboxEl.value?.querySelectorAll("[role=option]") ?? [];
    if (highlightedIndex.value < 0) return undefined;
    return elements[highlightedIndex.value]?.id;
  });
  const orientation = "vertical";

  // Watch for changes in the listbox and update listItems
  useMutationObserver(
    listboxEl,
    () => {
      if (!listboxEl.value) return;
      listItems.value = Array.from(
        listboxEl.value.querySelectorAll<HTMLElement>('[role="option"]')
      );
    },
    {
      childList: true,
      subtree: true,
    }
  );

  const { hide, show } = useDelayedOpen(
    () => {
      if (isVisible.value) return;
      isVisible.value = true;
      onShowDropdown?.();
    },
    () => {
      if (!isVisible.value) return;
      isVisible.value = false;
      onHideDropdown?.();
    },
    {
      defaultShowDelay: showDelay,
      defaultHideDelay: hideDelay,
    }
  );

  const group = useSelectionGroup(modelValue, {
    deselectOnReselect: deselection,
    multiselect,
  });

  provide(COMBOBOX_INJECTION_KEY, {
    triggerID,
    triggerEl,
    listboxID,
    listboxEl,
    loop,
    group,
    scrollBehavior,
    isVisible,
    show,
    hide,
    highlightedIndex,
    orientation,
    activeDescendentID,
    listItems,
  });

  return {
    triggerID,
    triggerEl,
    listboxID,
    listboxEl,
    group,
    isVisible,
    show,
    hide,
    highlightedIndex,
    activeDescendentID,
    listItems,
  };
}

export function useComboboxContext(component: string) {
  return useContext(COMBOBOX_INJECTION_KEY, "Combobox", component);
}
