import { onScopeDispose, toValue } from "vue"
import type { MaybeRefOrGetter, TemplateRef } from "@/types"
import { isClient, isIOS, noop, remove } from "@/utils"

type Listener = (e: PointerEvent) => void

interface Options {
  ignore?: MaybeRefOrGetter<MaybeRefOrGetter<HTMLElement | null>[]>
  isActive?: MaybeRefOrGetter<boolean>
}

export function useClickOutside(
  target: TemplateRef,
  listener: Listener,
  options: Options = {},
): () => void {
  if (!isClient) return noop
  useIosWorkaround()

  const { ignore = [], isActive = true } = options

  const onPointerDown: Listener = (e: PointerEvent) => {
    if (!toValue(isActive)) return

    const _target = toValue(target)
    if (!_target) return

    const path = e.composedPath()
    if (path.includes(_target)) return

    const shouldIgnore = toValue(ignore).some((templateRef) => {
      const el = toValue(templateRef)
      return el && path.includes(el)
    })

    if (shouldIgnore) return

    listener(e)
  }

  const unregister = addGlobalEventListener(onPointerDown)

  onScopeDispose(unregister)
  return unregister
}

// See: https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
let isIOSWorkaroundActive = false
function useIosWorkaround(): void {
  if (!isIOSWorkaroundActive && isIOS) {
    isIOSWorkaroundActive = true
    Array.from(document.body.children).forEach((el: Element) => {
      el.addEventListener("click", noop)
    })
  }
}

let isAttached = false
const listeners: Listener[] = []
function sharedListener(e: PointerEvent): void {
  listeners.forEach((cb: Listener) => {
    cb(e)
  })
}

function addGlobalEventListener(listener: Listener): () => void {
  if (!listeners.includes(listener)) {
    listeners.push(listener)
  }

  if (!isAttached) {
    document.addEventListener("pointerdown", sharedListener, { capture: true })
    isAttached = true
  }

  return (): void => {
    remove(listeners, listener)
    if (!listeners.length) {
      document.removeEventListener("pointerdown", sharedListener, { capture: true })
      isAttached = false
    }
  }
}
