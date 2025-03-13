# Combobox Component Documentation

## Overview

The Combobox component is a composable, accessible Vue component that provides enhanced dropdown selection functionality
with input filtering capabilities. It combines the flexibility of a text input with the structure of a select dropdown,
allowing users to either type to filter options or select from a list.

### Key Features

- 🔍 Type-to-filter functionality
- ⌨️ Full keyboard navigation support
- ♿ WAI-ARIA compliant for accessibility
- 🎨 Fully customizable styling
- 🧩 Composable architecture
- 🔄 Controlled and uncontrolled modes
- 📱 Mobile-friendly and touch support

## Installation

```bash
# npm
npm install @vex-ui/components

# yarn
yarn add @vex-ui/components

# pnpm
pnpm add @vex-ui/components
```

## Components

The Combobox consists of five main components:

1. `ComboboxRoot` - Root component that manages state and context
2. `ComboboxInput` - Input field component
3. `ComboboxPanel` - Floating panel container
4. `ComboboxListbox` - Options list container
5. `ComboboxListItem` - Individual option component

## Component API

### ComboboxRoot

#### Props

| Prop Name  | Type     | Default | Description                  |
| ---------- | -------- | ------- | ---------------------------- |
| modelValue | string[] | []      | Selected values array        |
| disabled   | boolean  | false   | Disables the combobox        |
| readonly   | boolean  | false   | Makes the combobox read-only |

#### Events

| Event Name        | Payload Type | Description                    |
| ----------------- | ------------ | ------------------------------ |
| update:modelValue | string[]     | Emitted when selection changes |

#### Slots

| Slot Name | Props                                                                                    | Description                      |
| --------- | ---------------------------------------------------------------------------------------- | -------------------------------- |
| default   | `{ triggerId: string, listboxId: string, isVisible: boolean, highlightedIndex: number }` | Default slot with combobox state |

### ComboboxInput

#### Props

| Prop Name        | Type    | Default   | Description                                |
| ---------------- | ------- | --------- | ------------------------------------------ |
| modelValue       | string  | undefined | Input field value                          |
| label            | string  | undefined | Input label text                           |
| labelledBy       | string  | undefined | ID of element labelling the input          |
| description      | string  | undefined | Input description text                     |
| required         | boolean | false     | Makes the input required                   |
| invalid          | boolean | false     | Marks input as invalid                     |
| pageSize         | number  | 5         | Number of items to scroll by               |
| disabled         | boolean | false     | Disables the input                         |
| readonly         | boolean | false     | Makes the input read-only                  |
| persistHighlight | boolean | false     | Maintains highlight position between opens |

#### Events

| Event Name        | Payload Type | Description                      |
| ----------------- | ------------ | -------------------------------- |
| update:modelValue | string       | Emitted when input value changes |

### ComboboxPanel

#### Props

| Prop Name | Type   | Default        | Description                   |
| --------- | ------ | -------------- | ----------------------------- |
| as        | string | 'div'          | HTML element to render as     |
| placement | string | 'bottom-start' | Floating UI placement         |
| offset    | number | 4              | Space between input and panel |

### ComboboxListbox

#### Props

| Prop Name | Type     | Default | Description               |
| --------- | -------- | ------- | ------------------------- |
| as        | `string` | 'ul'    | HTML element to render as |

### ComboboxListItem

#### Props

| Prop Name | Type   | Default  | Description               |
| --------- | ------ | -------- | ------------------------- |
| value     | string | required | Option value              |
| as        | string | 'li'     | HTML element to render as |

#### Slots

| Slot Name | Props                                                    | Description              |
| --------- | -------------------------------------------------------- | ------------------------ |
| default   | `{ isSelected: boolean, isActive: boolean, id: string }` | Content of the list item |

## Basic Usage

```vue
<script setup lang="ts">
import { ref } from "vue"
import {
  ComboboxRoot,
  ComboboxInput,
  ComboboxPanel,
  ComboboxListbox,
  ComboboxListItem,
} from "@vex-ui/components"

const selected = ref<string[]>([])
const items = [
  { id: 1, label: "Option 1" },
  { id: 2, label: "Option 2" },
  { id: 3, label: "Option 3" },
]
</script>

<template>
  <ComboboxRoot v-model="selected">
    <template #default="{ triggerId, listboxId, isVisible }">
      <ComboboxInput :aria-labelledby="triggerId" />
      <ComboboxPanel v-if="isVisible">
        <ComboboxListbox :id="listboxId">
          <ComboboxListItem v-for="item in items" :key="item.id" :value="item.label">
            <template #default="{ isSelected, isActive }">
              <span :class="{ selected: isSelected, active: isActive }">
                {{ item.label }}
              </span>
            </template>
          </ComboboxListItem>
        </ComboboxListbox>
      </ComboboxPanel>
    </template>
  </ComboboxRoot>
</template>
```

## Keyboard Navigation

The Combobox component supports rich keyboard interactions:

| Key        | Action                                   |
| ---------- | ---------------------------------------- |
| `↓`        | Move focus to the next option            |
| `↑`        | Move focus to the previous option        |
| `Home`     | Move focus to the first option           |
| `End`      | Move focus to the last option            |
| `Enter`    | Select the focused option                |
| `Escape`   | Close the dropdown panel                 |
| `Tab`      | Move focus to the next focusable element |
| `Space`    | Open/close the dropdown panel            |
| `PageUp`   | Move focus up by the page size           |
| `PageDown` | Move focus down by the page size         |

## Accessibility

The Combobox component follows WAI-ARIA guidelines for combobox widgets:

- Proper ARIA roles, states, and properties
- Keyboard navigation support
- Screen reader announcements
- Focus management
- Label and description association

## Advanced Usage

### Custom Filtering

```vue
<script setup lang="ts">
const filterFunction = (query: string, items: any[]) => {
  return items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
}
</script>

<template>
  <ComboboxRoot v-model="selected" :filter-function="filterFunction">
    <!-- ... -->
  </ComboboxRoot>
</template>
```

### Multiple Selection

```vue
<template>
  <ComboboxRoot v-model="selected" multiple>
    <!-- ... -->
  </ComboboxRoot>
</template>
```

### Custom Rendering

```vue
<template>
  <ComboboxListItem :value="item.value">
    <template #default="{ isSelected, isActive }">
      <div :class="{ selected: isSelected, active: isActive }">
        <img :src="item.icon" />
        <span>{{ item.label }}</span>
        <span class="description">{{ item.description }}</span>
      </div>
    </template>
  </ComboboxListItem>
</template>
```

## Styling

The Combobox components accept standard HTML attributes including class and style:

```vue
<template>
  <ComboboxRoot class="my-combobox">
    <ComboboxInput class="my-input" />
    <ComboboxPanel class="my-panel">
      <ComboboxListbox class="my-listbox">
        <ComboboxListItem class="my-item">
          <!-- ... -->
        </ComboboxListItem>
      </ComboboxListbox>
    </ComboboxPanel>
  </ComboboxRoot>
</template>
```

## Best Practices

1. Always provide a label for accessibility
2. Consider mobile users when styling
3. Implement proper error handling
4. Use appropriate filtering strategies
5. Handle loading and empty states
6. Provide clear feedback for selection
7. Consider keyboard-only users

## Examples

### With Async Data

```vue
<script setup lang="ts">
const loading = ref(false)
const items = ref([])

const fetchItems = async (query: string) => {
  loading.value = true
  try {
    const response = await fetch(`/api/items?q=${query}`)
    items.value = await response.json()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <ComboboxRoot v-model="selected">
    <ComboboxInput @input="fetchItems" :loading="loading" />
    <ComboboxPanel>
      <div v-if="loading">Loading...</div>
      <ComboboxListbox v-else>
        <!-- ... -->
      </ComboboxListbox>
    </ComboboxPanel>
  </ComboboxRoot>
</template>
```

### With Grouping

```vue
<template>
  <ComboboxRoot v-model="selected">
    <ComboboxInput />
    <ComboboxPanel>
      <ComboboxListbox>
        <template v-for="group in groups" :key="group.id">
          <div class="group-label">{{ group.label }}</div>
          <ComboboxListItem v-for="item in group.items" :key="item.id" :value="item.value">
            {{ item.label }}
          </ComboboxListItem>
        </template>
      </ComboboxListbox>
    </ComboboxPanel>
  </ComboboxRoot>
</template>
```
