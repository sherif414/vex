<script lang="ts">
interface MenuProps {
  orientation?: "vertical" | "horizontal"
}

const MENU_INJECTION_KEY = Symbol() as InjectionKey<{
  isVisible: Ref<boolean>
  triggerEl: Ref<HTMLElement | null>
  dropdownEl: Ref<HTMLElement | null>
  triggerID: string
  dropdownID: string
  show: () => void
  hide: () => void
  highlightedIndex: Ref<number>
  orientation: MaybeRefOrGetter<"vertical" | "horizontal">
}>

export function useMenuContext(component: string) {
  return useContext(MENU_INJECTION_KEY, "Menu", component)
}
</script>

<script setup lang="ts">
import { useContext, useID } from "@/composables"
import { provide, ref, type InjectionKey, type MaybeRefOrGetter, type Ref } from "vue"

const props = withDefaults(defineProps<MenuProps>(), {
  orientation: "vertical",
})

defineSlots<{
  default: (props: { visible: boolean }) => any
}>()

const triggerID = useID()
const dropdownID = useID()
const triggerEl = ref(null)
const dropdownEl = ref(null)
const isVisible = ref(false)
const highlightedIndex = ref(-1)

function show() {
  isVisible.value = true
}

function hide() {
  isVisible.value = false
}

provide(MENU_INJECTION_KEY, {
  isVisible,
  triggerEl,
  dropdownEl,
  triggerID,
  dropdownID,
  show,
  hide,
  highlightedIndex,
  orientation: () => props.orientation,
})
</script>

<template>
  <slot :visible="isVisible" />
</template>
