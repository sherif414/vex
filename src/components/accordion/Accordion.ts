import {
  h,
  defineComponent,
  computed,
  provide,
  inject,
  InjectionKey,
  Ref,
} from "vue";
import type { SelectionGroup } from "@/composables";
import type { Collection } from "@/composables/collection";
import type { Getter } from "@/types";
import {
  createCollection,
  useControllableState,
  useSelectionGroup,
  useID,
  useContext,
} from "@/composables";
import { Primitive } from "@/components";

export const ACCORDION_INJECTION_KEY = Symbol("accordion") as InjectionKey<{
  group: SelectionGroup<string>;
  collection: Collection;
}>;

export const ACCORDION_ITEM_INJECTION_KEY = Symbol() as InjectionKey<{
  contentID: string;
  triggerID: string;
  disabled: Getter<boolean>;
  isExpanded: Ref<boolean>;
  toggleExpansion: () => void;
}>;

export function useAccordionCtx(component: string) {
  return useContext(ACCORDION_INJECTION_KEY, "Accordion", component);
}

export function useAccordionItemCtx(component: string) {
  return useContext(ACCORDION_ITEM_INJECTION_KEY, "AccordionItem", component);
}

export interface AccordionProps {
  /** Allow multiple items to be expanded at once. @default false */
  multiple?: boolean;
  /** The controlled expanded state of the accordion. */
  modelValue?: string[];
  /** Allow an expanded item to be collapsed by clicking its trigger again. @default false */
  deselectOnReselect?: boolean;
  /** The HTML element to render as. @default 'div' */
  as?: string;
}

export const Accordion = defineComponent({
  name: "Accordion",
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    deselectOnReselect: {
      type: Boolean,
      default: false,
    },
    as: {
      type: String,
      default: "div",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit, slots }) {
    const collection = createCollection("vex-accordion-item");
    const group = useSelectionGroup(
      useControllableState(() => props.modelValue, {
        setter: (value: string[]) => {
          emit("update:modelValue", value);
          return value;
        },
      }),
      {
        multiselect: () => props.multiple,
        deselectOnReselect: () => props.deselectOnReselect,
      }
    );

    provide(ACCORDION_INJECTION_KEY, { group, collection });

    return () => h(Primitive, { as: props.as }, slots.default?.());
  },
});

export interface AccordionContentProps {
  /** The HTML element to render as. @default 'div' */
  as?: string;
}

export const AccordionContent = defineComponent({
  name: "AccordionContent",
  props: {
    as: {
      type: String,
      default: "div",
    },
  },
  setup(props, { slots }) {
    const { contentID, triggerID } = useAccordionItemCtx("AccordionContent");

    return () =>
      h(
        Primitive,
        {
          as: props.as,
          id: contentID,
          role: "region",
          "aria-labelledby": triggerID,
        },
        slots.default?.()
      );
  },
});

export interface AccordionHeaderProps {
  /** The HTML element to render as. @default 'h3' */
  as?: string;
}

export const AccordionHeader = defineComponent({
  name: "AccordionHeader",
  props: {
    as: {
      type: String,
      default: "h3",
    },
  },
  setup(props, { slots }) {
    useAccordionCtx("AccordionHeader");
    return () => h(Primitive, { as: props.as }, slots.default?.());
  },
});

export interface AccordionItemProps {
  /** Force the item to stay expanded. @default false */
  alwaysExpanded?: boolean;
  /** Whether the item should be expanded when first rendered. @default false */
  initiallyExpanded?: boolean;
  /** Whether the item is disabled. @default false */
  disabled?: boolean;
  /** A unique value for the accordion item. If not provided, an auto-generated ID will be used. */
  value?: string;
  /** The HTML element to render as. @default 'div' */
  as?: string;
}

export const AccordionItem = defineComponent({
  name: "AccordionItem",
  props: {
    alwaysExpanded: {
      type: Boolean,
      default: false,
    },
    initiallyExpanded: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
    },
    as: {
      type: String,
      default: "div",
    },
  },
  setup(props, { slots }) {
    const { group } = useAccordionCtx("AccordionItem");
    const contentID = useID();
    const triggerID = useID();
    const itemValue = computed(() => props.value ?? triggerID);

    if (props.initiallyExpanded) {
      group.select(itemValue.value);
    }

    const isExpanded = computed(() =>
      props.alwaysExpanded ? true : group.isSelected(itemValue.value)
    );

    provide(ACCORDION_ITEM_INJECTION_KEY, {
      contentID,
      triggerID,
      isExpanded,
      disabled: () => props.disabled,
      toggleExpansion: () => {
        if (props.disabled) return;
        group.select(itemValue.value);
      },
    });

    return () =>
      h(
        Primitive,
        { as: props.as },
        slots.default?.({ expanded: isExpanded.value })
      );
  },
});

export interface AccordionTriggerProps {
  /** The HTML element to render as. @default 'button' */
  as?: string;
}

export const AccordionTrigger = defineComponent({
  name: "AccordionTrigger",
  props: {
    as: {
      type: String,
      default: "button",
    },
  },
  setup(props, { slots }) {
    const { toggleExpansion, contentID, isExpanded, triggerID, disabled } =
      useAccordionItemCtx("AccordionTrigger");

    return () =>
      h(
        Primitive,
        {
          as: props.as,
          id: triggerID,
          type: "button",
          disabled: disabled(),
          onClick: toggleExpansion,
          "aria-controls": contentID,
          "aria-expanded": isExpanded.value,
        },
        slots.default?.()
      );
  },
});
