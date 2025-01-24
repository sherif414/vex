<script setup lang="ts">
import AutocompleteDemo from './demos/AutocompleteDemo.vue';

</script>

# Autocomplete Component Documentation

## Overview

The Autocomplete component is a composable, accessible Vue component that provides dropdown selection functionality. It's built using a compound component pattern, offering flexibility and full control over the rendering and behavior of each part of the autocomplete interface.

<AutocompleteDemo/>

## Key Features

- **Compound Components**: Built using a modular approach with separate components for input, options list, and individual options
- **Keyboard Navigation**: Full keyboard support including arrow keys for navigation
- **Accessibility**: ARIA compliant with proper roles and keyboard interactions
- **Flexible Rendering**: Each component can be rendered as any HTML element
- **Selection Modes**: Supports both single and multi-select modes
- **Controlled Input**: Fully controlled input with v-model support

## Components

The Autocomplete consists of four main components:

1. `Autocomplete.vue` - Root component that manages state and context
2. `AutocompleteInput.vue` - Input field component
3. `AutocompleteList.vue` - Options list container (renamed from AutocompleteOptions)
4. `AutocompleteListItem.vue` - Individual option component (renamed from AutocompleteOption)

## Basic Usage

```vue
<script setup lang="ts">
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteList,
  AutocompleteListItem,
} from "@/components/autocomplete";

const selected = ref<string[]>([]);
const searchQuery = ref("");
const items = ref(["Apple", "Banana", "Cherry"]);
</script>

<template>
  <Autocomplete v-model="selected">
    <AutocompleteInput v-model="searchQuery" />
    <AutocompleteList>
      <AutocompleteListItem v-for="item in items" :key="item" :value="item">
        {{ item }}
      </AutocompleteListItem>
    </AutocompleteList>
  </Autocomplete>
</template>
```

## Component API

### Autocomplete

Root component that provides context to all child components.

#### Props

| Name                 | Type       | Default | Description                        |
| -------------------- | ---------- | ------- | ---------------------------------- |
| `v-model`            | `string[]` | `[]`    | Selected values                    |
| `disabled`           | `boolean`  | `false` | Disables the autocomplete          |
| `multiselect`        | `boolean`  | `false` | Enables multiple selection         |
| `deselectOnReselect` | `boolean`  | `false` | Deselects item when selected again |
| `as`                 | `string`   | `'div'` | Root element tag                   |

#### Events

- `update:modelValue`: Emitted when selection changes

### AutocompleteInput

Input component that triggers the options display.

#### Props

| Name      | Type     | Default     | Description |
| --------- | -------- | ----------- | ----------- |
| `v-model` | `string` | `undefined` | Input value |

#### Attributes

- `role="combobox"`
- `aria-autocomplete="list"`
- Automatically manages `aria-activedescendant`, `aria-controls`, and `aria-expanded`

### AutocompleteList

Container for option items with keyboard navigation support.

#### Props

| Name          | Type                         | Default          | Description                             |
| ------------- | ---------------------------- | ---------------- | --------------------------------------- |
| `as`          | `string`                     | `'ul'`           | Container element tag                   |
| `placement`   | `Placement`                  | `'bottom-start'` | Floating UI placement relative to input |
| `offset`      | `number`                     | `4`              | Space between input and list in pixels  |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'`     | Direction of keyboard navigation        |

### AutocompleteListItem

Individual option component.

#### Props

| Name       | Type      | Default  | Description         |
| ---------- | --------- | -------- | ------------------- |
| `value`    | `string`  | Required | Option value        |
| `as`       | `string`  | `'li'`   | Option element tag  |
| `disabled` | `boolean` | `false`  | Disables the option |

#### Slot Props

```vue
<AutocompleteListItem v-slot="{ selected, focused }">
  <!-- Custom option content with state -->
</AutocompleteListItem>
```

## Keyboard Navigation

- `↓` (Down Arrow): Opens dropdown and moves focus to next option
- `↑` (Up Arrow): Moves focus to previous option
- `Escape`: Closes the dropdown
- `Enter`: Selects the focused option

## Accessibility

Implements comprehensive ARIA attributes:

- `role="combobox"` on root and input
- `role="listbox"` on options container
- `role="option"` on individual options
- Proper `aria-*` attributes for state management
- Keyboard navigation follows ARIA best practices

## Browser Support

Supports all modern browsers that can run Vue 3.

## Contributing

Contributions are welcome! Please ensure you:

1. Write tests for new features
2. Follow the existing code style
3. Update documentation as needed

## License

MIT License - feel free to use in your own projects.
