---
title: Avatar
description: An image element with a fallback for representing the user.
---

<script setup lang="ts">
import AvatarDemo from './demos/AvatarDemo.vue'
</script>

# Avatar

An image element with a fallback for representing the user.

## Interactive Demo

<AvatarDemo />

## Installation

Install the component from your command line.

```sh
npm install @primitives/core
```

## Usage

```vue
<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from "@primitives/core";
</script>

<template>
  <Avatar>
    <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
</template>
```

## Examples

### Default avatar

```vue
<Avatar class="h-10 w-10 rounded-full">
  <AvatarImage src="https://avatars.githubusercontent.com/u/124599" alt="John Doe" />
  <AvatarFallback class="flex h-full items-center justify-center bg-muted">JD</AvatarFallback>
</Avatar>
```

### With loading state

The fallback is shown while the image is loading.

```vue
<Avatar class="h-10 w-10 rounded-full">
  <AvatarImage src="https://slow-image-server.com/avatar.jpg" alt="Loading avatar" />
  <AvatarFallback class="flex h-full items-center justify-center bg-muted">
    <LoadingSpinner />
  </AvatarFallback>
</Avatar>
```

## API Reference

### Avatar

The root component. Wraps the image and fallback elements.

#### Props

| Prop | Type   | Default | Description            |
| ---- | ------ | ------- | ---------------------- |
| as   | string | 'span'  | HTML element to render |

### AvatarImage

The image component that handles loading states.

#### Props

| Prop        | Type                             | Default   | Description                  |
| ----------- | -------------------------------- | --------- | ---------------------------- |
| src         | string                           | undefined | The source URL of the image  |
| alt         | string                           | undefined | Alternative text description |
| crossOrigin | 'anonymous' \| 'use-credentials' | undefined | CORS mode                    |

### AvatarFallback

Renders when the image is loading or fails to load.

#### Props

| Prop | Type   | Default | Description            |
| ---- | ------ | ------- | ---------------------- |
| as   | string | 'div'   | HTML element to render |

## Accessibility

- Images have proper `alt` text descriptions
- Fallback maintains accessibility when image fails
- Follows ARIA best practices for avatars

## Custom Styling

Style using standard CSS or utility classes:

```vue
<Avatar class="h-12 w-12 rounded-full ring-2 ring-primary">
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback class="bg-muted text-muted-foreground">
    <UserIcon class="h-6 w-6" />
  </AvatarFallback>
</Avatar>
```
