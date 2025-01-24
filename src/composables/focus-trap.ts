import { isWatchable, remove } from "@/utils";
import type { Options as $Options, FocusTrap } from "focus-trap";
import { createFocusTrap } from "focus-trap";
import type { MaybeRefOrGetter } from "vue";
import { onScopeDispose, watch } from "vue";

interface Options extends $Options {
  immediate?: boolean;
}

const trapStack: FocusTrap[] = [];

export function useFocusTrap(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: Options = {}
) {
  let trap: FocusTrap | null = null;
  const createTrap = (el: HTMLElement) =>
    createFocusTrap(el, { ...options, trapStack });

  if (isWatchable(target)) {
    watch(target, (el) => {
      if (!el) return;
      if (trap) {
        trap.updateContainerElements(el);
      } else {
        trap = createTrap(el);
        trapStack.push(trap);
        options.immediate && trap.activate();
      }
    });
  } else if (target) {
    trap = createTrap(target);
    trapStack.push(trap);
    options.immediate && trap.activate();
  }

  onScopeDispose(() => {
    if (trap) {
      trap.deactivate();
      remove(trapStack, trap);
      trap = null;
    }
  });

  return {
    pause: () => {
      trap?.pause();
    },
    resume: () => {
      trap?.unpause();
    },
    activate: () => {
      trap?.activate();
    },
    isActive: () => !!trap?.active,
  };
}
