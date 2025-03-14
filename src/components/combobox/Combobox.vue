<script lang="ts">
export interface ComboboxProps {
  modelValue?: string[]
  disabled?: boolean
  readonly?: boolean
  multiselect?: boolean
  showOnFocus?: boolean
  scrollBehavior?: ScrollBehavior
  showDelay?: number
  hideDelay?: number
  orientation?: Orientation
}

const COMBOBOX_INJECTION_KEY = Symbol() as InjectionKey<{
  triggerID: string
  listboxID: string
  listboxEl: Ref<HTMLElement | null>
  triggerEl: Ref<HTMLInputElement | null>
  panelEl: Ref<HTMLElement | null>
  multiselect: Ref<boolean>
  group: SelectionGroup<string>
  scrollBehavior: Ref<ScrollBehavior>
  isVisible: ComputedRef<boolean>
  show: () => void
  hide: () => void
  highlightedIndex: Ref<number>
  activeDescendentID: ComputedRef<string | undefined>
  orientation: Ref<"vertical" | "horizontal">
  listItems: Ref<HTMLElement[]>
  showOnFocus: Ref<boolean>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
}>

export function useComboboxContext(component: string) {
  return useContext(COMBOBOX_INJECTION_KEY, "Combobox", component)
}
</script>

<script lang="ts" setup>
import {
  useContext,
  useControllableState,
  useDelayedOpen,
  useID,
  useSelectionGroup,
} from "@/composables"
import type { SelectionGroup } from "@/composables/selection-group"
import type { Orientation } from "@/types"
import { useMutationObserver } from "@vueuse/core"
import {
  computed,
  provide,
  ref,
  toRefs,
  watch,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from "vue"

const props = withDefaults(defineProps<ComboboxProps>(), {
  modelValue: () => [],
  scrollBehavior: "instant",
  orientation: "vertical",
})

const emit = defineEmits<{
  "update:modelValue": [value: string[]]
}>()

const modelValue = useControllableState(() => props.modelValue)

// Internal state
const inputValue = ref("")
const listboxID = useID()
const triggerID = useID()
const listboxEl = ref<HTMLElement | null>(null)
const triggerEl = ref<HTMLInputElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)
const listItems = ref<HTMLElement[]>([])

const _isVisible = ref(false)
const isVisible = computed(() => {
  if (disabled.value || readonly.value) {
    return false
  }
  return _isVisible.value
})
const highlightedIndex = ref(-1)
const activeDescendentID = computed<string | undefined>(() => {
  if (highlightedIndex.value < 0) return undefined
  return listItems.value[highlightedIndex.value]?.id
})

const {
  multiselect,
  disabled,
  showOnFocus,
  readonly,
  scrollBehavior,
  hideDelay,
  showDelay,
  orientation,
} = toRefs(props)

const group = useSelectionGroup(modelValue, {
  deselectOnReselect: false,
  multiselect,
})

const { hide, show } = useDelayedOpen(
  () => {
    if (isVisible.value) return
    _isVisible.value = true
  },
  () => {
    if (!isVisible.value) return
    _isVisible.value = false
  },
  {
    defaultShowDelay: showDelay,
    defaultHideDelay: hideDelay,
  },
)

useMutationObserver(
  listboxEl,
  () => {
    if (!listboxEl.value) return
    listItems.value = Array.from(
      listboxEl.value.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])'),
    )
  },
  {
    childList: true,
    subtree: true,
  },
)

watch(listboxEl, (el) => {
  if (!el) return
  listItems.value = Array.from(
    el.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])'),
  )
})

provide(COMBOBOX_INJECTION_KEY, {
  triggerID,
  triggerEl,
  panelEl,
  listboxID,
  listboxEl,
  multiselect,
  group,
  scrollBehavior,
  isVisible,
  show,
  hide,
  highlightedIndex,
  orientation,
  activeDescendentID,
  listItems,
  showOnFocus,
  disabled,
  readonly,
})

// Expose context to template
defineExpose({
  triggerEl,
  listboxEl,
  triggerID,
  listboxID,
  isVisible,
})
</script>

<template>
  <slot
    :trigger-id="triggerID"
    :listbox-id="listboxID"
    :is-visible="isVisible"
    :highlighted-index="highlightedIndex"
  />
</template>
