<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      <div class="p-6">
        <h2 class="text-2xl font-semibold mb-4">Performance Benchmark</h2>

        <div class="mb-8 text-gray-600 space-y-3">
          <p>
            This benchmark compares the performance of two different approaches
            for rendering dynamic components in Vue:
          </p>
          <ul class="list-disc pl-5 space-y-2">
            <li>
              <strong>Primitive:</strong> Uses the Primitive component which
              creates a dynamic element using Vue's h() function
            </li>
            <li>
              <strong>RenderAsChild:</strong> Uses the renderAsChild composable
              which clones and enhances an existing child element
            </li>
          </ul>
          <p>Two types of tests are performed:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>
              <strong>Mount Performance:</strong> Measures the time it takes to
              mount {{ componentCount }} new components
            </li>
            <li>
              <strong>Update Performance:</strong> Measures the time it takes to
              update content and classes of {{ componentCount }} existing
              components
            </li>
          </ul>
          <p>
            Each test runs {{ iterations }} times to get an average performance
            measurement.
          </p>
        </div>

        <div class="space-y-12">
          <!-- Mount Performance -->
          <div>
            <h3 class="text-xl font-semibold mb-6">Mount Performance</h3>
            <div class="grid grid-cols-2 gap-8">
              <!-- Primitive Mount -->
              <div>
                <h4 class="text-lg font-medium mb-4">
                  Primitive Implementation
                </h4>
                <button
                  @click="runPrimitiveMountBenchmark"
                  class="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Run Primitive Mount Test
                </button>
                <div class="space-y-2">
                  <div
                    v-for="(result, index) in primitiveMountResults"
                    :key="index"
                    class="text-sm"
                  >
                    Mount {{ index + 1 }}: {{ result }}ms
                  </div>
                  <div v-if="primitiveMountAverage" class="font-medium">
                    Average: {{ primitiveMountAverage }}ms
                  </div>
                </div>
              </div>

              <!-- RenderAsChild Mount -->
              <div>
                <h4 class="text-lg font-medium mb-4">
                  RenderAsChild Implementation
                </h4>
                <button
                  @click="runRenderAsChildMountBenchmark"
                  class="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Run RenderAsChild Mount Test
                </button>
                <div class="space-y-2">
                  <div
                    v-for="(result, index) in renderAsChildMountResults"
                    :key="index"
                    class="text-sm"
                  >
                    Mount {{ index + 1 }}: {{ result }}ms
                  </div>
                  <div v-if="renderAsChildMountAverage" class="font-medium">
                    Average: {{ renderAsChildMountAverage }}ms
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Update Performance -->
          <div>
            <h3 class="text-xl font-semibold mb-6">Update Performance</h3>
            <div class="grid grid-cols-2 gap-8">
              <!-- Primitive Update -->
              <div>
                <h4 class="text-lg font-medium mb-4">
                  Primitive Implementation
                </h4>
                <button
                  @click="runPrimitiveUpdateBenchmark"
                  class="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Run Primitive Update Test
                </button>
                <div class="space-y-2">
                  <div
                    v-for="(result, index) in primitiveUpdateResults"
                    :key="index"
                    class="text-sm"
                  >
                    Update {{ index + 1 }}: {{ result }}ms
                  </div>
                  <div v-if="primitiveUpdateAverage" class="font-medium">
                    Average: {{ primitiveUpdateAverage }}ms
                  </div>
                </div>
              </div>

              <!-- RenderAsChild Update -->
              <div>
                <h4 class="text-lg font-medium mb-4">
                  RenderAsChild Implementation
                </h4>
                <button
                  @click="runRenderAsChildUpdateBenchmark"
                  class="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Run RenderAsChild Update Test
                </button>
                <div class="space-y-2">
                  <div
                    v-for="(result, index) in renderAsChildUpdateResults"
                    :key="index"
                    class="text-sm"
                  >
                    Update {{ index + 1 }}: {{ result }}ms
                  </div>
                  <div v-if="renderAsChildUpdateAverage" class="font-medium">
                    Average: {{ renderAsChildUpdateAverage }}ms
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Test Components Container -->
        <div class="mt-8 opacity-0 h-0 overflow-hidden">
          <!-- Mount Test Containers -->
          <div ref="primitiveMountContainer"></div>
          <div ref="renderAsChildMountContainer"></div>

          <!-- Update Test Components -->
          <div>
            <Primitive
              v-for="i in componentCount"
              as="template"
              :key="i"
              :class="primitiveClass"
            >
              <div>{{ primitiveText }}</div>
            </Primitive>
          </div>
          <div>
            <RenderAsChildTest
              v-for="i in componentCount"
              :key="i"
              :class="renderAsChildClass"
            >
              <div>{{ renderAsChildText }}</div>
            </RenderAsChildTest>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, h, nextTick, createApp } from "vue";
import { Primitive } from "@/components/primitive/Primitive";
import { useRenderAsChild } from "@/composables/render-as-child";

const componentCount = 1000;
const iterations = 5;

// Mount test results
const primitiveMountResults = ref<number[]>([]);
const renderAsChildMountResults = ref<number[]>([]);
const primitiveMountContainer = ref<HTMLElement | null>(null);
const renderAsChildMountContainer = ref<HTMLElement | null>(null);

// Update test results
const primitiveUpdateResults = ref<number[]>([]);
const renderAsChildUpdateResults = ref<number[]>([]);

// State for update tests
const primitiveText = ref("Initial");
const primitiveClass = ref("test");
const renderAsChildText = ref("Initial");
const renderAsChildClass = ref("test");

// Test components

const RenderAsChildTest = defineComponent({
  props: ["class"],
  setup(props) {
    const renderChild = useRenderAsChild();
    return () =>
      renderChild({
        class: props.class,
      });
  },
});

// Mount test averages
const primitiveMountAverage = computed(() => {
  if (primitiveMountResults.value.length === 0) return null;
  const sum = primitiveMountResults.value.reduce((a, b) => a + b, 0);
  return (sum / primitiveMountResults.value.length).toFixed(2);
});

const renderAsChildMountAverage = computed(() => {
  if (renderAsChildMountResults.value.length === 0) return null;
  const sum = renderAsChildMountResults.value.reduce((a, b) => a + b, 0);
  return (sum / renderAsChildMountResults.value.length).toFixed(2);
});

// Update test averages
const primitiveUpdateAverage = computed(() => {
  if (primitiveUpdateResults.value.length === 0) return null;
  const sum = primitiveUpdateResults.value.reduce((a, b) => a + b, 0);
  return (sum / primitiveUpdateResults.value.length).toFixed(2);
});

const renderAsChildUpdateAverage = computed(() => {
  if (renderAsChildUpdateResults.value.length === 0) return null;
  const sum = renderAsChildUpdateResults.value.reduce((a, b) => a + b, 0);
  return (sum / renderAsChildUpdateResults.value.length).toFixed(2);
});

// Track mounted apps
const primitiveApp = ref<ReturnType<typeof createApp> | null>(null);
const renderAsChildApp = ref<ReturnType<typeof createApp> | null>(null);

// Mount benchmarks
const runPrimitiveMountBenchmark = async () => {
  primitiveMountResults.value = [];
  for (let i = 0; i < iterations; i++) {
    if (primitiveMountContainer.value) {
      // Unmount previous app if exists
      primitiveApp.value?.unmount();
      primitiveApp.value = null;
      primitiveMountContainer.value.innerHTML = "";
      await nextTick();

      const start = performance.now();
      const app = createApp({
        render: () =>
          Array.from({ length: componentCount }).map((_, index) =>
            h(
              Primitive,
              {
                key: index,

                class: `test-${index}`,
                as: "template",
              },
              () => h("div", "hi")
            )
          ),
      });
      app.mount(primitiveMountContainer.value);
      primitiveApp.value = app;
      await nextTick();
      const end = performance.now();

      primitiveMountResults.value.push(Number((end - start).toFixed(2)));
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
};

const runRenderAsChildMountBenchmark = async () => {
  renderAsChildMountResults.value = [];
  for (let i = 0; i < iterations; i++) {
    if (renderAsChildMountContainer.value) {
      // Unmount previous app if exists
      renderAsChildApp.value?.unmount();
      renderAsChildApp.value = null;
      renderAsChildMountContainer.value.innerHTML = "";
      await nextTick();

      const start = performance.now();
      const app = createApp({
        render: () =>
          Array.from({ length: componentCount }).map((_, index) =>
            h(
              RenderAsChildTest,
              {
                key: index,

                class: `test-${index}`,
              },
              () => h("div", "hi")
            )
          ),
      });
      app.mount(renderAsChildMountContainer.value);
      renderAsChildApp.value = app;
      await nextTick();
      const end = performance.now();

      renderAsChildMountResults.value.push(Number((end - start).toFixed(2)));
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
};

// Update benchmarks
const runPrimitiveUpdateBenchmark = async () => {
  primitiveUpdateResults.value = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    primitiveText.value = `Update ${i}`;
    primitiveClass.value = `test-${i}`;
    await nextTick();
    const end = performance.now();
    primitiveUpdateResults.value.push(Number((end - start).toFixed(2)));
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

const runRenderAsChildUpdateBenchmark = async () => {
  renderAsChildUpdateResults.value = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    renderAsChildText.value = `Update ${i}`;
    renderAsChildClass.value = `test-${i}`;
    await nextTick();
    const end = performance.now();
    renderAsChildUpdateResults.value.push(Number((end - start).toFixed(2)));
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};
</script>
