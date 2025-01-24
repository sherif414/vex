<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
      <div class="p-6">
        <h2 class="text-2xl font-semibold mb-6">
          Managing Your Booking Online
        </h2>

        <Accordion multiple class="space-y-3" v-model="selected">
          <AccordionItem
            v-for="(item, index) in [
              { title: 'Access Your Booking', icon: icons.booking },
              { title: 'Change Flights', icon: icons.change },
              { title: 'Add Special Requests', icon: icons.add },
              { title: 'Check-In Online', icon: icons.checkin },
            ]"
            :key="index"
            :value="`${index}`"
            class="border border-gray-100 rounded-lg overflow-hidden"
            #default="{ expanded }"
          >
            <AccordionHeader class="w-full">
              <AccordionTrigger
                class="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 transition-colors duration-150"
              >
                <div class="flex items-center gap-3">
                  <span class="text-blue-600" v-html="item.icon"></span>
                  <span class="text-gray-900 font-medium text-[15px]">{{
                    item.title
                  }}</span>
                </div>

                <svg
                  class="w-5 h-5 text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-45': expanded }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v12M6 12h12"
                  />
                </svg>
              </AccordionTrigger>
            </AccordionHeader>

            <AccordionContent>
              <div
                class="overflow-hidden transition-[height] duration-300 ease-out"
                :style="{
                  height: expanded ? contentHeights[index] + 'px' : '0px',
                }"
              >
                <div
                  class="px-4 pb-4 text-gray-600"
                  :ref="
                    (el) => {
                      if (el) contentRefs[index] = el as HTMLElement;
                    }
                  "
                >
                  Content for {{ item.title }} goes here. This is placeholder
                  text that can be replaced with actual content.
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "@/components";
import { ref, watch } from "vue";

const selected = ref(["2"]);
const contentRefs = ref<HTMLElement[]>([]);
const contentHeights = ref<number[]>([0, 0, 0, 0]);

// Update heights whenever the refs are updated
watch(
  () => [...contentRefs.value],
  (newRefs) => {
    newRefs.forEach((el, index) => {
      if (el) {
        contentHeights.value[index] = el.scrollHeight;
      }
    });
  },
  { immediate: true }
);

// Icons can be imported from a library like heroicons or you can use inline SVGs
const icons = {
  booking: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6H4V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6Z" stroke="currentColor" stroke-width="2"/>
    <path d="M8 4V6M16 4V6" stroke="currentColor" stroke-width="2"/>
    <path d="M4 10H20" stroke="currentColor" stroke-width="2"/>
  </svg>`,
  change: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7H16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="currentColor" stroke-width="2"/>
  </svg>`,
  add: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6V18M18 12H6" stroke="currentColor" stroke-width="2"/>
  </svg>`,
  checkin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 11L12 14L22 4M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" stroke-width="2"/>
  </svg>`,
};
</script>
