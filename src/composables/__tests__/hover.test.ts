import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ref, nextTick, effectScope, type EffectScope } from "vue";
import { useHover } from "../hover";

describe("useHover", () => {
  let target: HTMLElement | null = null;
  let onOpenChange: (open: boolean) => void;
  let scope: EffectScope;

  beforeEach(() => {
    target = document.createElement("div");
    document.body.appendChild(target);
    onOpenChange = vi.fn();
    scope = effectScope();
  });

  afterEach(() => {
    target && document.body.removeChild(target);
    vi.clearAllMocks();
    scope.stop();
  });

  it("should initialize with default options", () => {
    const targetRef = ref(target);
    const { isHovered } = scope.run(() =>
      useHover(targetRef, {
        onOpenChange,
      })
    )!;
    expect(isHovered.value).toBe(false);
  });

  it("should handle pointer enter events", async () => {
    const targetRef = ref(target);
    const { isHovered } = scope.run(() =>
      useHover(targetRef, {
        onOpenChange,
      })
    )!;

    target?.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    await nextTick();

    expect(isHovered.value).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("should handle pointer leave events", async () => {
    const targetRef = ref(target);
    const { isHovered } = scope.run(() =>
      useHover(targetRef, {
        onOpenChange,
      })
    )!;

    target?.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    await nextTick();
    target?.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    await nextTick();

    expect(isHovered.value).toBe(false);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("should ignore touch events when ignoreTouchDevices is true", async () => {
    const targetRef = ref(target);
    const { isHovered } = scope.run(() =>
      useHover(targetRef, {
        onOpenChange,
        ignoreTouchDevices: ref(true),
      })
    )!;

    target?.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "touch" }));
    await nextTick();

    expect(isHovered.value).toBe(false);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("should handle focus events when handleFocus is true", async () => {
    const targetRef = ref(target);
    const { isHovered } = scope.run(() =>
      useHover(targetRef, {
        onOpenChange,
        handleFocus: ref(true),
      })
    )!;

    target?.dispatchEvent(new FocusEvent("focus"));
    await nextTick();

    expect(onOpenChange).toHaveBeenCalledWith(true);

    target?.dispatchEvent(new FocusEvent("blur"));
    await nextTick();

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("should not handle focus events when handleFocus is false", async () => {
    const targetRef = ref(target);
    const { isHovered } = scope.run(() =>
      useHover(targetRef, {
        onOpenChange,
        handleFocus: ref(false),
      })
    )!;

    target?.dispatchEvent(new FocusEvent("focus"));
    await nextTick();

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("should respect delay option for show and hide", async () => {
    vi.useFakeTimers();
    const targetRef = ref(target);
    const delay = ref({ show: 100, hide: 200 });

    scope.run(() =>
      useHover(targetRef, {
        onOpenChange,
        delay,
      })
    )!;

    target?.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(onOpenChange).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(onOpenChange).toHaveBeenCalledWith(true);

    target?.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    vi.advanceTimersByTime(199);
    expect(onOpenChange).not.toHaveBeenCalledWith(false);

    vi.advanceTimersByTime(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);

    vi.useRealTimers();
  });

  it("should cleanup event listeners when component is unmounted", async () => {
    const targetRef = ref(target);
    const removeEventListenerSpy = vi.spyOn(target!, "removeEventListener");

    scope.run(() =>
      useHover(targetRef, {
        onOpenChange,
      })
    )!;

    // Simulate unmount
    targetRef.value = null;
    await nextTick();

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(4); // pointerenter, pointerleave, focus, blur
    removeEventListenerSpy.mockRestore();
  });

  it("should not trigger events when enabled is false", async () => {
    const targetRef = ref(target);
    const { isHovered } = scope.run(() =>
      useHover(targetRef, {
        onOpenChange,
        enabled: ref(false),
      })
    )!;

    target?.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    await nextTick();

    expect(isHovered.value).toBe(false);
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
