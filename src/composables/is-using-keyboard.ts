import type { Ref } from "vue"
import { ref } from "vue"
import { isClient } from "@/utils"

export const isUsingKeyboard: Ref<boolean> = ref(false)

function onKeydown(): void {
  isUsingKeyboard.value = true
  document.addEventListener("pointerdown", onPointer, { capture: true, once: true })
}

function onPointer(): void {
  isUsingKeyboard.value = false
  document.addEventListener("keydown", onKeydown, { capture: true, once: true })
}

if (isClient) {
  onPointer()
}
