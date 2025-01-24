# Autocomplete Component Documentation

## Overview

The Autocomplete component is a composable, accessible Vue component that provides dropdown selection functionality. It's built using a compound component pattern, offering flexibility and full control over the rendering and behavior of each part of the autocomplete interface.

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
3. `AutocompleteOptions.vue` - Options list container
4. `AutocompleteOption.vue` - Individual option component

## Basic Usage

```vue
<script setup lang="ts">
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteOptions,
  AutocompleteOption,
} from "@/components/autocomplete";

const selected = ref<string[]>([]);
</script>

<template>
  <Autocomplete v-model="selected">
    <AutocompleteInput v-model="searchQuery" />
    <AutocompleteOptions>
      <AutocompleteOption v-for="item in items" :key="item" :value="item">
        {{ item }}
      </AutocompleteOption>
    </AutocompleteOptions>
  </Autocomplete>
</template>
```

## Component API

### Autocomplete

Root component that provides context to all child components.

#### Props

| Name                 | Type       | Default | Description                        |
| -------------------- | ---------- | ------- | ---------------------------------- |
| `modelValue`         | `string[]` | `[]`    | Selected values                    |
| `disabled`           | `boolean`  | `false` | Disables the autocomplete          |
| `multiselect`        | `boolean`  | `false` | Enables multiple selection         |
| `deselectOnReselect` | `boolean`  | `false` | Deselects item when selected again |
| `as`                 | `string`   | `'div'` | Root element tag                   |

#### Events

- `update:modelValue`: Emitted when selection changes

### AutocompleteInput

Input component that triggers the options display.

#### Props

| Name         | Type     | Default     | Description |
| ------------ | -------- | ----------- | ----------- |
| `modelValue` | `string` | `undefined` | Input value |

#### Events

- `update:modelValue`: Emitted when input value changes

### AutocompleteOptions

Container for option items with keyboard navigation support.

#### Props

| Name | Type     | Default | Description           |
| ---- | -------- | ------- | --------------------- |
| `as` | `string` | `'ul'`  | Container element tag |

### AutocompleteOption

Individual option component.

#### Props

| Name    | Type     | Default  | Description        |
| ------- | -------- | -------- | ------------------ |
| `value` | `string` | Required | Option value       |
| `as`    | `string` | `'li'`   | Option element tag |

#### Slots

```vue
<AutocompleteOption v-slot="{ selected }">
  <!-- Custom option content -->
</AutocompleteOption>
```

## Keyboard Navigation

The component supports the following keyboard interactions:

- `↓` (Down Arrow): Opens dropdown and moves focus to next option
- `↑` (Up Arrow): Moves focus to previous option
- `Escape`: Closes the dropdown
- `Enter`: Selects the focused option

## Accessibility

The component implements the following ARIA attributes and roles:

- Options container has proper `role="listbox"`
- Individual options have `role="option"`
- Keyboard navigation follows ARIA best practices
- Focus management between input and options

## TypeScript Support

The component is written in TypeScript and provides full type safety:

```typescript
interface AutocompleteRootProps {
  modelValue?: string[];
  disabled?: boolean;
  multiselect?: boolean;
  deselectOnReselect?: boolean;
  as?: string;
}

interface AutocompleteInputProps {
  modelValue?: string;
}

interface AutocompleteOptionsProps {
  as?: string;
}

interface AutocompleteOptionProps {
  value: string;
  as?: string;
}
```

## Browser Support

Supports all modern browsers that can run Vue 3.

## Contributing

Contributions are welcome! Please ensure you:

1. Write tests for new features
2. Follow the existing code style
3. Update documentation as needed

## License

MIT License - feel free to use in your own projects.
