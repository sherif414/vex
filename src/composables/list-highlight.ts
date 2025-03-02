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
 * @param parent - Reference to the parent container element
 * @param children - Reactive reference containing the list of child elements
 * @param highlightedIndex - Current highlighted index
 * @param onHighlight - Callback function that receives the new highlighted index
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
 * const items = ref([
 *   { id: 1, label: 'Item 1' },
 *   { id: 2, label: 'Item 2' },
 *   { id: 3, label: 'Item 3' }
 * ])
 * const highlighted = ref(0)
 *
 * const elements = computed(() =>
 *   listRef.value?.querySelectorAll('.item') ?? []
 * )
 *
 * useListHighlight(
 *   listRef,
 *   elements,
 *   highlighted,
 *   (index) => highlighted.value = index,
 *   { orientation: () => 'vertical' }
 * )
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
  children: Ref<HTMLElement[]>,
  highlightedIndex: Readonly<Ref<number>>,
  onHighlight: (index: number) => void,
  options: ListHighlightOptions = {},
): cleanupFn {
  return useKeyIntent(
    parent,
    (e: KeyboardEvent, intent) => {
      const last = children.value.length - 1;
      const currentIndex = highlightedIndex.value;
      e.preventDefault();
      e.stopPropagation();

      let newIndex: number;
      switch (intent) {
        case "next":
          newIndex = currentIndex >= last ? 0 : currentIndex + 1;
          break;

        case "prev":
          newIndex = currentIndex <= 0 ? last : currentIndex - 1;
          break;

        case "first":
          newIndex = 0;
          break;

        case "last":
          newIndex = last;
          break;

        default:
          return;
      }

      onHighlight(newIndex);
    },
    options,
  );
}
