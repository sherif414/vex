<template>
  <div
    v-if="modelValue.length"
    class="autocomplete-tags"
    role="list"
    aria-label="Selected items"
  >
    <div
      v-for="(tag, index) in modelValue"
      :key="tag.value"
      :ref="el => tagRefs[index] = el"
      class="autocomplete-tag"
      role="listitem"
      :tabindex="currentFocusIndex === index ? 0 : -1"
      @keydown="handleTagKeydown($event, index)"
      @focus="currentFocusIndex = index"
    >
      <Tag
        :label="tag.label"
        :closeable="true"
        @close="removeTag(index)"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import Tag from '../tag/Tag.vue'

export default {
  name: 'AutocompleteTags',
  
  components: {
    Tag
  },

  props: {
    modelValue: {
      type: Array,
      required: true,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue', 'remove'],

  setup(props, { emit }) {
    const tagRefs = ref([])
    const currentFocusIndex = ref(-1)

    const removeTag = (index) => {
      if (props.disabled) return

      const newValue = [...props.modelValue]
      const removedTag = newValue.splice(index, 1)[0]
      emit('update:modelValue', newValue)
      emit('remove', removedTag)

      // Update focus after removal
      if (newValue.length > 0) {
        const newIndex = Math.min(index, newValue.length - 1)
        currentFocusIndex.value = newIndex
        nextTick(() => {
          tagRefs.value[newIndex]?.focus()
        })
      }
    }

    const handleTagKeydown = (event, index) => {
      if (props.disabled) return

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          if (index > 0) {
            currentFocusIndex.value = index - 1
            tagRefs.value[index - 1]?.focus()
          }
          break

        case 'ArrowRight':
          event.preventDefault()
          if (index < props.modelValue.length - 1) {
            currentFocusIndex.value = index + 1
            tagRefs.value[index + 1]?.focus()
          }
          break

        case 'Delete':
        case 'Backspace':
          event.preventDefault()
          removeTag(index)
          break
      }
    }

    // Reset refs when modelValue changes
    watch(() => props.modelValue, () => {
      tagRefs.value = []
    })

    return {
      tagRefs,
      currentFocusIndex,
      removeTag,
      handleTagKeydown
    }
  }
}
</script>

<style>
.autocomplete-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.25rem;
}

.autocomplete-tag {
  display: inline-flex;
  align-items: center;
  outline: none;
}

.autocomplete-tag:focus-visible {
  outline: 2px solid var(--vex-primary-color, #4a5af8);
  border-radius: 4px;
}
</style>