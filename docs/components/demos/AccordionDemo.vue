<script setup lang="ts">
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "@/components";
import type { TransitionProps } from "vue";

const onEnter: TransitionProps["onEnter"] = (el: Element, done) => {
  const element = el as HTMLElement;
  const height = element.scrollHeight;
  element.style.height = "0px";
  requestAnimationFrame(() => {
    element.style.height = `${height}px`;
    element.addEventListener("transitionend", done, { once: true });
  });
};

const onLeave: TransitionProps["onLeave"] = (el: Element, done) => {
  const element = el as HTMLElement;
  const height = element.scrollHeight;
  element.style.height = `${height}px`;
  requestAnimationFrame(() => {
    element.style.height = "0px";
    element.addEventListener("transitionend", done, { once: true });
  });
};

const onAfterEnter: TransitionProps["onAfterEnter"] = (el: Element) => {
  (el as HTMLElement).style.height = "auto";
};

const onAfterLeave: TransitionProps["onAfterLeave"] = (el: Element) => {
  (el as HTMLElement).style.height = "auto";
};
</script>

<template>
  <div class="p-4 rounded-lg bg-[var(--vp-c-bg-soft)]">
    <Accordion
      deselect-on-reselect
      class="overflow-hidden rounded-lg border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)]"
    >
      <AccordionItem
        v-slot="{ expanded }"
        value="faq-1"
        class="border-b border-[var(--vp-c-divider)] last:border-0"
      >
        <AccordionHeader>
          <AccordionTrigger
            class="flex w-full items-center justify-between p-4 text-left text-base font-medium text-[var(--vp-c-text-1)] hover:bg-[var(--vp-c-bg-soft)]"
          >
            <span>What is Vex UI?</span>
            <svg
              class="h-5 w-5 transition-transform duration-200"
              :class="{ 'rotate-180': expanded }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <Transition
            name="accordion"
            @enter="onEnter"
            @leave="onLeave"
            @after-enter="onAfterEnter"
            @after-leave="onAfterLeave"
          >
            <div v-if="expanded" class="accordion-content">
              <div class="p-4 pt-0 text-[var(--vp-c-text-2)]">
                Vex UI is a modern Vue 3 component library focused on
                accessibility, developer experience, and beautiful design. It
                provides a set of reusable components that follow WAI-ARIA
                patterns and best practices.
              </div>
            </div>
          </Transition>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        v-slot="{ expanded }"
        value="faq-2"
        class="border-b border-[var(--vp-c-divider)] last:border-0"
      >
        <AccordionHeader>
          <AccordionTrigger
            class="flex w-full items-center justify-between p-4 text-left text-base font-medium text-[var(--vp-c-text-1)] hover:bg-[var(--vp-c-bg-soft)]"
          >
            <span>Is it accessible?</span>
            <svg
              class="h-5 w-5 transition-transform duration-200"
              :class="{ 'rotate-180': expanded }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <Transition
            name="accordion"
            @enter="onEnter"
            @leave="onLeave"
            @after-enter="onAfterEnter"
            @after-leave="onAfterLeave"
          >
            <div v-if="expanded" class="accordion-content">
              <div class="p-4 pt-0 text-[var(--vp-c-text-2)]">
                Yes! All components are built with accessibility in mind. They
                include proper ARIA attributes, keyboard navigation, and follow
                WAI-ARIA design patterns. The Accordion component specifically
                implements the WAI-ARIA Accordion Pattern.
              </div>
            </div>
          </Transition>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        v-slot="{ expanded }"
        value="faq-3"
        class="border-b border-[var(--vp-c-divider)] last:border-0"
      >
        <AccordionHeader>
          <AccordionTrigger
            class="flex w-full items-center justify-between p-4 text-left text-base font-medium text-[var(--vp-c-text-1)] hover:bg-[var(--vp-c-bg-soft)]"
          >
            <span>Can I customize the styling?</span>
            <svg
              class="h-5 w-5 transition-transform duration-200"
              :class="{ 'rotate-180': expanded }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <Transition
            name="accordion"
            @enter="onEnter"
            @leave="onLeave"
            @after-enter="onAfterEnter"
            @after-leave="onAfterLeave"
          >
            <div v-if="expanded" class="accordion-content">
              <div class="p-4 pt-0 text-[var(--vp-c-text-2)]">
                Absolutely! All components are designed to be highly
                customizable. You can override styles using regular CSS, use the
                provided CSS variables, or completely change the look using
                slots and custom components.
              </div>
            </div>
          </Transition>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: height 0.3s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  height: 0;
}

.accordion-content {
  overflow: hidden;
}

.demo-wrapper {
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.demo-accordion {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.demo-item {
  border-bottom: 1px solid var(--vp-c-divider);
}

.demo-item:last-child {
  border-bottom: none;
}

.demo-trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--vp-c-text-1);
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
}

.demo-trigger:hover {
  background: var(--vp-c-bg-soft);
}

.demo-content {
  padding: 0 1rem 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.demo-icon {
  transition: transform 0.2s ease;
}

.demo-icon--rotated {
  transform: rotate(180deg);
}
</style>
