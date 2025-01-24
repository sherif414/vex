<template>
  <div class="w-full max-w-3xl space-y-8">
    <div class="p-6 bg-white rounded-lg shadow-sm">
      <div class="mb-6">
        <h2 class="text-lg font-semibold">Avatar Component Demo</h2>
        <p class="text-sm text-gray-500">
          Test different states and configurations
        </p>
      </div>

      <!-- Controls Section -->
      <div class="space-y-4 mb-6 border-t pt-4 mt-6">
        <h3 class="text-sm font-semibold">Demo Controls</h3>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="controls.forceError" />
              <span class="text-sm">Force Error State</span>
            </label>

            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="controls.showLoading" />
              <span class="text-sm">Show Loading State</span>
            </label>
          </div>

          <div class="space-y-2">
            <label class="block text-sm">
              Loading Delay (ms)
              <input
                type="number"
                v-model="controls.loadingDelay"
                class="w-full px-2 py-1 border rounded-md"
                min="0"
                step="500"
              />
            </label>

            <label class="block text-sm">
              Avatar Color
              <input
                type="color"
                v-model="controls.avatarColor"
                class="w-full"
                @change="reloadAvatar"
              />
            </label>
          </div>
        </div>

        <button
          @click="reloadAvatar"
          class="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
        >
          Reload Avatar
        </button>
      </div>

      <div class="space-y-6">
        <!-- Image URL Input -->
        <div class="space-y-2">
          <label for="imageUrl" class="text-sm font-medium">Image URL</label>
          <input
            id="imageUrl"
            v-model="imageUrl"
            type="text"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Enter image URL"
          />
        </div>

        <!-- Avatar Examples -->
        <div class="grid grid-cols-3 gap-8">
          <!-- Regular Avatar -->
          <div class="space-y-2">
            <p class="text-sm font-medium">Regular Avatar</p>
            <Avatar
              class="w-24 h-24 rounded-full overflow-hidden bg-gray-100 inline-flex items-center justify-center"
            >
              <AvatarImage
                :src="imageUrl"
                :alt="'User avatar'"
                class="w-full h-full object-cover"
                cross-origin="anonymous"
              />
              <AvatarFallback v-slot="{ loadState }">
                <div
                  v-if="loadState === 'loading'"
                  class="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"
                />
                <div v-else-if="loadState === 'error'" class="text-red-500">
                  Error
                </div>
                <div v-else class="text-gray-400">No Image</div>
              </AvatarFallback>
            </Avatar>
          </div>

          <!-- Small Avatar -->
          <div class="space-y-2">
            <p class="text-sm font-medium">Small Avatar</p>
            <Avatar
              class="w-12 h-12 rounded-full overflow-hidden bg-gray-100 inline-flex items-center justify-center"
            >
              <AvatarImage
                :src="imageUrl"
                :alt="'Small avatar'"
                class="w-full h-full object-cover"
                cross-origin="anonymous"
              />
              <AvatarFallback v-slot="{ loadState }">
                <div
                  v-if="loadState === 'loading'"
                  class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"
                />
                <div
                  v-else-if="loadState === 'error'"
                  class="text-red-500 text-xs"
                >
                  !
                </div>
                <div v-else class="text-gray-400 text-xs">?</div>
              </AvatarFallback>
            </Avatar>
          </div>

          <!-- Square Avatar -->
          <div class="space-y-2">
            <p class="text-sm font-medium">Square Avatar</p>
            <Avatar
              class="w-24 h-24 overflow-hidden bg-gray-100 inline-flex items-center justify-center"
            >
              <AvatarImage
                :src="imageUrl"
                :alt="'Square avatar'"
                class="w-full h-full object-cover"
                cross-origin="anonymous"
              />
              <AvatarFallback v-slot="{ loadState }">
                <div
                  v-if="loadState === 'loading'"
                  class="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600"
                />
                <div v-else-if="loadState === 'error'" class="text-red-500">
                  Error
                </div>
                <div v-else class="text-gray-400">No Image</div>
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <!-- Cross-Origin Example -->
        <div class="space-y-2">
          <p class="text-sm font-medium">Cross-Origin Avatar</p>
          <Avatar
            #="{ loadState }"
            class="w-24 h-24 rounded-full overflow-hidden bg-gray-100 inline-flex items-center justify-center"
          >
            <AvatarImage
              :src="imageUrl"
              :alt="'Cross-origin avatar'"
              cross-origin="anonymous"
              class="w-full h-full object-cover"
            />
            <AvatarFallback>
              {{ loadState }}
              <div
                v-if="loadState === 'loading'"
                class="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"
              />
              <div v-else-if="loadState === 'error'" class="text-red-500">
                Error
              </div>
              <div v-else class="text-gray-400">No Image</div>
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { Avatar, AvatarImage, AvatarFallback } from "@/components";

const controls = reactive({
  forceError: false,
  showLoading: false,
  loadingDelay: 2000,
  avatarColor: "#4F46E5",
});

const imageUrl = ref("");

const getSvgContent = () => `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="${controls.avatarColor}"/>
  <text x="50" y="60" text-anchor="middle" fill="white" font-size="30">AI</text>
</svg>`;

const getDelayedSvg = () => {
  return new Promise<string>((resolve, reject) => {
    if (controls.showLoading) {
      imageUrl.value = "";
    }

    setTimeout(() => {
      if (controls.forceError) {
        reject(new Error("Forced error state"));
        return;
      }
      resolve(`data:image/svg+xml;base64,${btoa(getSvgContent())}`);
    }, controls.loadingDelay);
  });
};

const reloadAvatar = () => {
  imageUrl.value = "";
  getDelayedSvg()
    .then((url) => {
      imageUrl.value = url;
    })
    .catch(() => {
      imageUrl.value = "error";
    });
};

// Initial load
reloadAvatar();

// Watch for error state changes
watch(() => controls.forceError, reloadAvatar);
watch(() => controls.showLoading, reloadAvatar);
</script>
