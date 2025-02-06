<script setup lang="ts">
import { ref } from 'vue'

const messages = ref<string[]>([])
const currentMessage = ref<string>('')

function addAnnouncement(message: string) {
  messages.value.push(message)
  processNextAnnouncement()
}

function processNextAnnouncement() {
  if (messages.value.length === 0 || currentMessage.value) return
  
  currentMessage.value = messages.value.shift() || ''
  
  // Clear the message after a short delay to allow screen readers to announce it
  setTimeout(() => {
    currentMessage.value = ''
    // Process next message if available
    setTimeout(() => {
      processNextAnnouncement()
    }, 100)
  }, 200)
}

defineExpose({
  addAnnouncement
})
</script>

<template>
  <div 
    class="vex-announcer"
    aria-live="polite"
    aria-atomic="true"
    role="status"
  >
    <div 
      v-show="currentMessage"
      class="vex-announcer__message"
    >
      {{ currentMessage }}
    </div>
  </div>
</template>

<style>
.vex-announcer {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>