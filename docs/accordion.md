&lt;script setup>
import AccordionDemo from './demos/AccordionDemo.vue'
&lt;/script>

# Accordion

A vertically stacked set of interactive headings that each reveal a section of content.

## Features

- Full keyboard navigation
- Supports single and multiple expanded items
- Can be controlled or uncontrolled
- Follows WAI-ARIA Accordion Pattern
- Highly customizable with slots and props

## Demo

<ClientOnly>
  <AccordionDemo />
</ClientOnly>

::: details View Source

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "@/components";

const expandedItems = ref(["faq-1"]);
</script>

<template>
  <div class="p-4 rounded-lg bg-[var(--vp-c-bg-soft)]">
    <Accordion
      v-model="expandedItems"
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
          <div class="overflow-hidden transition-all duration-200">
            <div class="p-4 pt-0 text-[var(--vp-c-text-2)]">
              Vex UI is a modern Vue 3 component library focused on
              accessibility, developer experience, and beautiful design...
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <!-- More accordion items -->
    </Accordion>
  </div>
</template>
```

:::

## Installation

```bash
pnpm add @/components
```

## Usage

### Basic Example

```vue
<script setup lang="ts">
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "@/components";
</script>

<template>
  <Accordion>
    <AccordionItem>
      <AccordionHeader>
        <AccordionTrigger>What is Vex UI?</AccordionTrigger>
      </AccordionHeader>
      <AccordionContent>
        <div class="overflow-hidden transition-all duration-200">
          <div class="p-4 pt-0">
            Vex UI is a Vue 3 component library focused on accessibility and
            developer experience.
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
```

### Multiple Selection

```vue
<template>
  <Accordion multiple>
    <!-- Accordion items -->
  </Accordion>
</template>
```

### Controlled Mode

```vue
<script setup lang="ts">
import { ref } from "vue";

const expandedItems = ref(["item-1"]);
</script>

<template>
  <Accordion v-model="expandedItems">
    <AccordionItem value="item-1">
      <!-- Content -->
    </AccordionItem>
    <AccordionItem value="item-2">
      <!-- Content -->
    </AccordionItem>
  </Accordion>
</template>
```

## Component API

### Accordion Props

| Prop                 | Type       | Default | Description                                                                  |
| -------------------- | ---------- | ------- | ---------------------------------------------------------------------------- |
| `multiple`           | `boolean`  | `false` | When `true`, allows multiple items to be expanded at once                    |
| `modelValue`         | `string[]` | `[]`    | Controls which items are expanded (for controlled mode)                      |
| `deselectOnReselect` | `boolean`  | `false` | When `true`, allows collapsing an item by clicking its trigger when expanded |
| `as`                 | `string`   | `'div'` | The HTML element to render as                                                |

### AccordionItem Props

| Prop                | Type      | Default     | Description                                              |
| ------------------- | --------- | ----------- | -------------------------------------------------------- |
| `alwaysExpanded`    | `boolean` | `false`     | When `true`, the item cannot be collapsed                |
| `initiallyExpanded` | `boolean` | `false`     | Sets the initial expanded state (uncontrolled mode only) |
| `disabled`          | `boolean` | `false`     | When `true`, prevents user interaction                   |
| `value`             | `string`  | `undefined` | Unique identifier for the item                           |
| `as`                | `string`  | `'div'`     | The HTML element to render as                            |

### AccordionHeader Props

| Prop | Type     | Default | Description                   |
| ---- | -------- | ------- | ----------------------------- |
| `as` | `string` | `'h3'`  | The HTML element to render as |

### AccordionTrigger Props

| Prop | Type     | Default    | Description                   |
| ---- | -------- | ---------- | ----------------------------- |
| `as` | `string` | `'button'` | The HTML element to render as |

### AccordionContent Props

| Prop | Type     | Default | Description                   |
| ---- | -------- | ------- | ----------------------------- |
| `as` | `string` | `'div'` | The HTML element to render as |

## Slots

### Accordion

| Slot      | Props | Description         |
| --------- | ----- | ------------------- |
| `default` | -     | The accordion items |

### AccordionItem

| Slot      | Props                   | Description                                             |
| --------- | ----------------------- | ------------------------------------------------------- |
| `default` | `{ expanded: boolean }` | The item's header and content. Receives expanded state. |

### AccordionHeader, AccordionTrigger, AccordionContent

| Slot      | Props | Description                |
| --------- | ----- | -------------------------- |
| `default` | -     | The content to be rendered |

## Accessibility

The Accordion component follows the [WAI-ARIA Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/). It includes the following accessibility features:

- Proper ARIA roles, states, and properties
- Keyboard navigation:
  - `Space` or `Enter`: Toggles the expanded state of the focused item
  - `Tab`: Moves focus to the next focusable element
  - `Shift + Tab`: Moves focus to the previous focusable element
  - `Home`: Moves focus to the first trigger
  - `End`: Moves focus to the last trigger
