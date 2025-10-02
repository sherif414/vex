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
  floatingOptions?: UseFloatingOptions
}

const COMBOBOX_INJECTION_KEY = Symbol() as InjectionKey<{
  triggerID: string
  listboxID: string
  listboxEl: Ref<HTMLElement | null>
  triggerEl: Ref<HTMLInputElement | null>
  dropdownEl: Ref<HTMLElement | null>
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
  floating: FloatingContext
  setFloatingOptions: (options: Partial<UseFloatingOptions>) => void
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
import { useFloating, type FloatingContext, type UseFloatingOptions, type Middleware, type Placement, type Strategy } from "v-float"
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
  floatingOptions: () => ({}),
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
const dropdownEl = ref<HTMLElement | null>(null)
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
    _isVisible.value = true
  },
  () => {
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

// Reactive floating options that can be updated by children
const _placement = ref<Placement | undefined>()
const _strategy = ref<Strategy | undefined>()
const _transform = ref<boolean | undefined>()
const _middlewares = ref<Middleware[]>([])
const _autoUpdate = ref<boolean | undefined>(true)

const setFloatingOptions = (options: Partial<UseFloatingOptions>) => {
  if (options.placement !== undefined) _placement.value = options.placement as Placement | undefined
  if (options.strategy !== undefined) _strategy.value = options.strategy as Strategy | undefined
  if (options.transform !== undefined) _transform.value = options.transform as boolean | undefined
  if (options.middlewares !== undefined) _middlewares.value = options.middlewares as Middleware[]
  if (options.autoUpdate !== undefined) _autoUpdate.value = options.autoUpdate as boolean | undefined
}

const floating = useFloating(triggerEl, dropdownEl, {
  placement: _placement,
  strategy: _strategy,
  transform: _transform,
  middlewares: _middlewares,
  autoUpdate: _autoUpdate.value,
  open: isVisible,
})

provide(COMBOBOX_INJECTION_KEY, {
  triggerID,
  triggerEl,
  dropdownEl,
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
  floating,
  setFloatingOptions,
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
