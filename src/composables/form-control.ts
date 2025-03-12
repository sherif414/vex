import { computed, type Ref } from 'vue';

interface UseFromControlReturn {
  isFormControl: Readonly<Ref<boolean>>;
}

export function useFormControl(el: Ref<HTMLElement | null>): UseFromControlReturn {
  const isFormControl = computed<boolean>(() => {
    // its enabled by default to avoid ssr hydration issues
    if (!el.value) return true;
    return !!el.value.closest('form');
  });

  return {
    isFormControl,
  };
}
