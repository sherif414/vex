import { onUnmounted, type Ref, readonly, ref } from "vue"

// Global reference counter to handle multiple instances
let globalHideCount = 0
let originalBodyStyle: { marginRight: string; overflow: string } | null = null

interface UseBodyScrollbarReturn {
  isHidden: Readonly<Ref<boolean>>
  hide: () => void
  show: () => void
  toggle: () => void
}

export function useBodyScrollbar(): UseBodyScrollbarReturn {
  const isHidden = ref(false)

  const hide = (): void => {
    // Skip if already hidden by this instance
    if (isHidden.value) return

    // Skip if we're in SSR
    if (typeof window === "undefined") return

    // Store original styles on first hide
    if (globalHideCount === 0) {
      originalBodyStyle = {
        marginRight: document.body.style.marginRight,
        overflow: document.body.style.overflow,
      }

      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.marginRight = `${scrollBarWidth}px`
      document.body.style.overflow = "hidden"
    }

    globalHideCount++
    isHidden.value = true
  }

  const show = (): void => {
    // Skip if already shown by this instance
    if (!isHidden.value) return

    // Skip if we're in SSR
    if (typeof window === "undefined") return

    globalHideCount = Math.max(0, globalHideCount - 1)
    isHidden.value = false

    // Restore original styles only when no instances need it hidden
    if (globalHideCount === 0 && originalBodyStyle) {
      document.body.style.marginRight = originalBodyStyle.marginRight
      document.body.style.overflow = originalBodyStyle.overflow
      originalBodyStyle = null
    }
  }

  const toggle = (): void => {
    if (isHidden.value) {
      show()
    } else {
      hide()
    }
  }

  // Cleanup when component unmounts
  onUnmounted(() => {
    if (isHidden.value) {
      show()
    }
  })

  return {
    isHidden: readonly(isHidden),
    hide,
    show,
    toggle,
  }
}
