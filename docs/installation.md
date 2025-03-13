---
title: Installation & Getting Started
description: Learn how to install and get started with our Vue component library
---

# Installation

## Prerequisites

- Node.js 16 or higher
- pnpm (recommended) or npm

## Installing the Package

```bash
# Using pnpm (recommended)
pnpm add @primitives/core

# Using npm
npm install @primitives/core

# Using yarn
yarn add @primitives/core
```

## Basic Setup

Add the following to your `main.ts` or entry file:

```ts
import { createApp } from "vue"
import { PrimitivesPlugin } from "@primitives/core"
import App from "./App.vue"

const app = createApp(App)
app.use(PrimitivesPlugin)
app.mount("#app")
```

## Usage Example

Here's a basic example using a component:

```vue
<script setup lang="ts">
import { ref } from "vue"
import { PButton } from "@primitives/core"

const count = ref(0)
</script>

<template>
  <PButton @click="count++"> Count is: {{ count }} </PButton>
</template>
```

## Configuration (Optional)

You can customize the default settings when installing the plugin:

```ts
app.use(PrimitivesPlugin, {
  // configuration options will go here
})
```

## Next Steps

- Check out our [Components](/components/) documentation
- View [Examples](/examples/) of common use cases
- Read about [Advanced Usage](/advanced-usage/)
