import { mount } from "@vue/test-utils"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { nextTick } from "vue"
import Autocomplete from "../Autocomplete.vue"
import AutocompleteInput from "../AutocompleteInput.vue"
import AutocompleteList from "../AutocompleteList.vue"

describe("Autocomplete", () => {
  const defaultProps = {
    items: ["Apple", "Banana", "Cherry", "Date", "Elderberry"],
  }

  const mountAutocomplete = (props = {}) => {
    return mount(Autocomplete, {
      props: { ...defaultProps, ...props },
      global: {
        stubs: {
          AutocompleteInput: true,
          AutocompleteList: true,
        },
      },
    })
  }

  describe("ARIA Attributes", () => {
    it("should have correct ARIA attributes on input", async () => {
      const wrapper = mountAutocomplete({
        label: "Fruit Selection",
        required: true,
      })
      const input = wrapper.findComponent(AutocompleteInput)

      expect(input.attributes("role")).toBe("combobox")
      expect(input.attributes("aria-autocomplete")).toBe("list")
      expect(input.attributes("aria-required")).toBe("true")
      expect(input.attributes("aria-expanded")).toBe("false")
    })

    it("should have correct ARIA attributes on list", async () => {
      const wrapper = mountAutocomplete()
      const list = wrapper.findComponent(AutocompleteList)

      expect(list.attributes("role")).toBe("listbox")
      expect(list.attributes("aria-multiselectable")).toBe("false")
    })
  })

  describe("Keyboard Navigation", () => {
    let wrapper

    beforeEach(() => {
      wrapper = mountAutocomplete()
    })

    it("should handle ArrowDown key to open list", async () => {
      const input = wrapper.findComponent(AutocompleteInput)
      await input.trigger("keydown", { key: "ArrowDown" })

      expect(wrapper.vm.isVisible).toBe(true)
    })

    it("should handle Home key to select first item", async () => {
      const input = wrapper.findComponent(AutocompleteInput)
      await input.trigger("keydown", { key: "ArrowDown" })
      await input.trigger("keydown", { key: "Home" })

      expect(wrapper.vm.highlightedIndex).toBe(0)
    })

    it("should handle End key to select last item", async () => {
      const input = wrapper.findComponent(AutocompleteInput)
      await input.trigger("keydown", { key: "ArrowDown" })
      await input.trigger("keydown", { key: "End" })

      expect(wrapper.vm.highlightedIndex).toBe(defaultProps.items.length - 1)
    })

    it("should handle PageUp/PageDown keys", async () => {
      const input = wrapper.findComponent(AutocompleteInput)
      await input.trigger("keydown", { key: "ArrowDown" })
      await input.trigger("keydown", { key: "PageDown" })

      expect(wrapper.vm.highlightedIndex).toBe(Math.min(4, defaultProps.items.length - 1))
    })
  })

  describe("Type-ahead Functionality", () => {
    it("should highlight matching item when typing", async () => {
      const wrapper = mountAutocomplete()
      const input = wrapper.findComponent(AutocompleteInput)

      await input.trigger("keydown", { key: "b" })
      expect(wrapper.vm.highlightedIndex).toBe(1) // 'Banana'
    })

    it("should handle multiple characters within timeout", async () => {
      const wrapper = mountAutocomplete()
      const input = wrapper.findComponent(AutocompleteInput)

      await input.trigger("keydown", { key: "c" })
      await input.trigger("keydown", { key: "h" })
      expect(wrapper.vm.highlightedIndex).toBe(2) // 'Cherry'
    })
  })

  describe("Focus Management", () => {
    it("should maintain focus on input when list closes", async () => {
      const wrapper = mountAutocomplete()
      const input = wrapper.findComponent(AutocompleteInput)

      await input.trigger("keydown", { key: "ArrowDown" })
      await input.trigger("keydown", { key: "Escape" })

      expect(document.activeElement).toBe(input.element)
    })

    it("should focus first item when list opens", async () => {
      const wrapper = mountAutocomplete()
      const input = wrapper.findComponent(AutocompleteInput)

      await input.trigger("keydown", { key: "ArrowDown" })
      await nextTick()

      expect(wrapper.vm.highlightedIndex).toBe(0)
    })
  })

  describe("Selection Modes", () => {
    it("should handle single selection", async () => {
      const wrapper = mountAutocomplete()
      const input = wrapper.findComponent(AutocompleteInput)

      await input.trigger("keydown", { key: "ArrowDown" })
      await input.trigger("keydown", { key: "Enter" })

      expect(wrapper.emitted("update:modelValue")).toBeTruthy()
    })

    it("should handle multi-selection", async () => {
      const wrapper = mountAutocomplete({ multiselectable: true })
      const input = wrapper.findComponent(AutocompleteInput)

      await input.trigger("keydown", { key: "ArrowDown" })
      await input.trigger("keydown", { key: "Enter" })

      expect(wrapper.emitted("update:modelValue")).toBeTruthy()
    })
  })

  describe("Edge Cases", () => {
    it("should handle empty results", async () => {
      const wrapper = mountAutocomplete({ items: [] })
      const input = wrapper.findComponent(AutocompleteInput)

      await input.trigger("keydown", { key: "ArrowDown" })
      expect(wrapper.vm.highlightedIndex).toBe(-1)
    })

    it("should handle disabled options", async () => {
      const wrapper = mountAutocomplete({
        items: [
          { text: "Apple", disabled: true },
          { text: "Banana", disabled: false },
        ],
      })
      const input = wrapper.findComponent(AutocompleteInput)

      await input.trigger("keydown", { key: "ArrowDown" })
      expect(wrapper.vm.highlightedIndex).toBe(1) // Should skip disabled item
    })
  })
})
