<script setup lang="ts">
import AutocompleteDemo from './demos/AutocompleteDemo.vue';

</script>

# Autocomplete Component Documentation

## Overview

The Autocomplete component is a composable, accessible Vue component that provides dropdown selection functionality. It's built using a compound component pattern, offering flexibility and full control over the rendering and behavior of each part of the autocomplete interface.

<AutocompleteDemo/>

## Key Features

- **Compound Components**: Built using a modular approach with separate components for input, options list, and individual options
- **Enhanced Keyboard Navigation**: Comprehensive keyboard support including arrow keys, Home/End, PageUp/PageDown, and type-ahead functionality
- **Advanced Accessibility**: Full ARIA compliance with live regions, screen reader announcements, and proper roles
- **Flexible Rendering**: Each component can be rendered as any HTML element
- **Selection Modes**: Supports both single and multi-select modes with tag management
- **Controlled Input**: Fully controlled input with v-model support
- **Mobile Support**: Touch-friendly interactions and responsive design

## Components

The Autocomplete consists of five main components:

1. `Autocomplete.vue` - Root component that manages state and context
2. `AutocompleteInput.vue` - Input field component
3. `AutocompleteList.vue` - Options list container
4. `AutocompleteListItem.vue` - Individual option component
5. `AutocompleteTags.vue` - Selected items display for multi-select mode

## Basic Usage

### Single Select Mode

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
  <Autocomplete 
    v-model="selected"
    label="Fruit Selection"
    description="Select your favorite fruit"
  >
    <AutocompleteInput 
      v-model="searchQuery"
      placeholder="Search fruits..."
    />
    <AutocompleteList>
      <AutocompleteListItem 
        v-for="item in items" 
        :key="item" 
        :value="item"
      >
        {{ item }}
      </AutocompleteListItem>
    </AutocompleteList>
  </Autocomplete>
</template>
```

### Multi-Select Mode with Tags

```vue
<script setup lang="ts">
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteList,
  AutocompleteListItem,
  AutocompleteTags,
} from "@/components/autocomplete";

const selected = ref<string[]>([]);
const searchQuery = ref("");
const items = ref(["Apple", "Banana", "Cherry"]);
</script>

<template>
  <Autocomplete 
    v-model="selected"
    multiselect
    label="Fruits Selection"
    description="Select multiple fruits"
  >
    <AutocompleteTags 
      :model-value="selected.map(value => ({ 
        value, 
        label: value 
      }))"
      @remove="(tag) => selected = selected.filter(t => t !== tag.value)"
    />
    <AutocompleteInput 
      v-model="searchQuery"
      placeholder="Search fruits..."
    />
    <AutocompleteList>
      <AutocompleteListItem 
        v-for="item in items" 
        :key="item" 
        :value="item"
      >
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

### List Navigation
- `↓` (Down Arrow): Opens dropdown and moves focus to next option
- `↑` (Up Arrow): Moves focus to previous option
- `Home`: Moves focus to first option
- `End`: Moves focus to last option
- `PageUp`: Moves focus up by 10 options
- `PageDown`: Moves focus down by 10 options
- `Alt + ↓`: Opens the dropdown
- `Alt + ↑`: Closes the dropdown
- `Escape`: Closes the dropdown
- `Enter`: Selects the focused option
- Type any letter: Moves focus to the next option starting with that letter (type-ahead)

### Tag Navigation (Multi-select mode)
- `←` (Left Arrow): Moves focus to previous tag
- `→` (Right Arrow): Moves focus to next tag
- `Backspace`/`Delete`: Removes the focused tag

## Accessibility

The Autocomplete component implements comprehensive accessibility features following WCAG guidelines and ARIA best practices.

### ARIA Attributes

#### Root Component
- `aria-labelledby`: Links to component label
- `aria-describedby`: Links to description and error messages
- `aria-required`: Indicates if the field is required

#### Input
- `role="combobox"`: Identifies the input as a combobox
- `aria-autocomplete="list"`: Indicates list-based autocomplete
- `aria-controls`: References the options list
- `aria-expanded`: Indicates dropdown state
- `aria-activedescendant`: References the focused option
- `aria-labelledby`: Links to component label
- `aria-invalid`: Indicates error state

#### List
- `role="listbox"`: Identifies the container as a listbox
- `aria-orientation`: Indicates navigation direction
- `aria-label`: Provides context for the list

#### List Items
- `role="option"`: Identifies items as selectable options
- `aria-selected`: Indicates selection state
- `aria-disabled`: Indicates disabled state

#### Tags Container (Multi-select)
- `role="list"`: Identifies the tags container
- `aria-label="Selected items"`: Labels the tags list

### Screen Reader Announcements

The component provides real-time announcements for:
- Selection/deselection of options
- List navigation updates
- Error states
- Loading states

### Example with Full Accessibility Features

```vue
<template>
  <Autocomplete
    v-model="selected"
    label="Country Selection"
    description="Select your country of residence"
    required
    :error-message="errorMessage"
    multiselect
  >
    <AutocompleteTags
      :model-value="selected.map(value => ({ 
        value, 
        label: value 
      }))"
      @remove="handleTagRemove"
    />
    <AutocompleteInput
      v-model="searchQuery"
      placeholder="Search countries..."
    />
    <AutocompleteList>
      <AutocompleteListItem
        v-for="item in filteredItems"
        :key="item.id"
        :value="item.id"
        :disabled="item.disabled"
      >
        {{ item.label }}
      </AutocompleteListItem>
    </AutocompleteList>
  </Autocomplete>
</template>
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
