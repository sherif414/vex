import { createSharedComposable } from "@vueuse/core"
import type { Ref } from "vue"
import { customRef, onScopeDispose, ref } from "vue"
import { isClient, noop } from "@/utils"
import type { Fn } from "./types"

export type Dir = "ltr" | "rtl" | "auto" | undefined

export const useTextDirection: () => Ref<Dir> = createSharedComposable(() => {
  if (!isClient) return ref<Dir>()

  let dir = getDocumentDir()
  let trigger: Fn = noop

  const updateDir: () => void = () => {
    const newDir = getDocumentDir()
    if (newDir === dir) return
    dir = newDir
    trigger()
  }

  let observer: MutationObserver | null = new MutationObserver(updateDir)

  const html = document.querySelector("html")
  if (html) {
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["dir"],
    })
  }

  document.addEventListener("DOMContentLoaded", updateDir, { once: true })

  onScopeDispose(() => {
    observer?.disconnect()
    observer = null
  })

  return customRef<Dir>((_track, _trigger) => {
    trigger = _trigger
    return {
      get(): Dir {
        _track()
        return dir
      },
      set(v: Dir): void {
        if (v === dir) return
        dir = v
        setDocumentDir(dir)
        _trigger()
      },
    }
  })
})

function getDocumentDir(): Dir {
  return document?.querySelector("html")?.getAttribute("dir") as Dir
}

function setDocumentDir(dir: Dir): void {
  if (dir) {
    document?.querySelector("html")?.setAttribute("dir", dir)
  } else {
    document?.querySelector("html")?.removeAttribute("dir")
  }
}
