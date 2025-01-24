<script setup lang="ts">
import { ref } from "vue";
import { Avatar, AvatarImage, AvatarFallback } from "@/components";

const avatarSrc = ref("https://avatars.githubusercontent.com/u/124599");
const showError = ref(false);

function toggleError() {
  showError.value = !showError.value;
  avatarSrc.value = showError.value
    ? "invalid-url"
    : "https://avatars.githubusercontent.com/u/124599";
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex items-center gap-4">
      <Avatar class="h-16 w-16 rounded-full">
        <AvatarImage :src="avatarSrc" alt="Demo avatar" />
        <AvatarFallback
          class="flex h-full items-center justify-center bg-muted text-muted-foreground"
        >
          JD
        </AvatarFallback>
      </Avatar>

      <button
        @click="toggleError"
        class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
      >
        {{ showError ? "Show Image" : "Trigger Error" }}
      </button>
    </div>

    <div class="text-sm text-muted-foreground">
      Click the button to toggle between a valid image and an error state.
    </div>
  </div>
</template>
