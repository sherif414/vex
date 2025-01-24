import type { Fn, Orientation, TemplateRef } from "@/types";
import type { MaybeRefOrGetter, Ref } from "vue";
import { useKeyIntent } from ".";

/**
 * Options for configuring list highlight behavior
 */
interface ListHighlightOptions {
  /**
   * The orientation of the list navigation
   * @default "vertical"
   */
  orientation?: MaybeRefOrGetter<Orientation>;
}

type cleanupFn = Fn;

/**
 * A composable for managing keyboard navigation and highlighting in lists.
 *
 *
 * @param parent - Reference to the parent container element
 * @param highlighted - Reactive reference tracking the currently highlighted index
 * @param children - Reactive reference containing the list of child elements
 * @param options - Configuration options for list highlight behavior
 * @returns Cleanup function to remove event listeners
 *
 * @remarks
 * Keyboard Navigation:
 * - Vertical orientation:
 *   - ArrowUp: Move to previous item
 *   - ArrowDown: Move to next item
 *   - Home: Move to first item
 *   - End: Move to last item
 * - Horizontal orientation:
 *   - ArrowLeft: Move to previous item
 *   - ArrowRight: Move to next item
 *   - Home: Move to first item
 *   - End: Move to last item
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref, computed } from 'vue'
 * import { useListHighlight } from '@/composables'
 *
 * const listRef = ref(null)
 * const highlighted = ref(-1)
 * const items = ref([
 *   { id: 1, label: 'Item 1' },
 *   { id: 2, label: 'Item 2' },
 *   { id: 3, label: 'Item 3' }
 * ])
 *
 * const elements = computed(() =>
 *   listRef.value?.querySelectorAll('.item') ?? []
 * )
 *
 * useListHighlight(listRef, highlighted, elements, {
 *   orientation: () => 'vertical'
 * })
 * </script>
 *
 * <template>
 *   <ul ref="listRef">
 *     <li
 *       v-for="(item, index) in items"
 *       :key="item.id"
 *       class="item"
 *       :class="{ 'highlighted': index === highlighted }"
 *     >
 *       {{ item.label }}
 *     </li>
 *   </ul>
 * </template>
 * ```
 */
export function useListHighlight(
  parent: TemplateRef,
  highlighted: Ref<number>,
  children: Ref<HTMLElement[]>,
  options: ListHighlightOptions = {}
): cleanupFn {
  return useKeyIntent(
    parent,
    (e: KeyboardEvent, intent) => {
      const last = children.value.length - 1;
      const oldValue = highlighted.value;
      e.preventDefault();
      e.stopPropagation();

      switch (intent) {
        case "next":
          highlighted.value = oldValue >= last ? 0 : oldValue + 1;
          break;

        case "prev":
          highlighted.value = oldValue <= 0 ? last : oldValue - 1;
          break;

        case "first":
          highlighted.value = 0;
          break;

        case "last":
          highlighted.value = last;
          break;
      }
    },
    options
  );
}
