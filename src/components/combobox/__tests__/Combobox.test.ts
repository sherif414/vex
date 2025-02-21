import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";
import { h, nextTick, ref } from "vue";
import Combobox from "../Combobox.vue";
import ComboboxInput from "../ComboboxInput.vue";
import ComboboxListbox from "../ComboboxListbox.vue";
import ComboboxListItem from "../ComboboxListItem.vue";

expect.extend(toHaveNoViolations);

// Mock the useId composable
let _count = 0;
vi.mock("@/composables/id", () => ({
  useID: () => "test-id-" + _count++,
}));

const createWrapper = (props = {}) => {
  return mount(
    h(Combobox, { modelValue: [], showOnFocus: true, ...props }, () => [
      h(ComboboxInput, {
        modelValue: "",
      }),
      h(ComboboxListbox, null, () =>
        [1, 2, 3].map((i) =>
          h(
            ComboboxListItem,
            {
              value: "item" + i,
              textContent: "item " + i,
            },
            () => "Item " + i
          )
        )
      ),
    ])
  );
};

describe("Combobox", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should mount successfully", () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  // it(
  //   "should pass accessibility checks",
  //   async () => {
  //     const wrapper = createWrapper();
  //     const results = await axe(wrapper.element);
  //     expect(results).toHaveNoViolations();
  //   },
  //   { timeout: 10000 }
  // );

  it("should handle single selection", async () => {
    const wrapper = createWrapper({ showOnFocus: true });
    const input = wrapper.find('[role="combobox"]');

    await input.trigger("focus");
    await nextTick();

    const item = wrapper.find('[role="option"][data-vex-value="item1"]');
    await item.trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["item1"]]);
  });

  it("should handle multiple selection when multiselect is true", async () => {
    const selectedValues = ref<string[]>([]);
    const wrapper = createWrapper({
      multiselect: true,
      showOnFocus: true,
      modelValue: selectedValues.value,
      "onUpdate:modelValue": (val: string[]) => {
        selectedValues.value = val;
        wrapper.setProps({ modelValue: val });
      },
    });

    const input = wrapper.find('[role="combobox"]');
    await input.trigger("focus");
    await nextTick();

    const item1 = wrapper.find('[role="option"][data-vex-value="item1"]');
    await item1.trigger("click");
    await nextTick();

    const item2 = wrapper.find('[role="option"][data-vex-value="item2"]');
    await item2.trigger("click");
    await nextTick();

    expect(selectedValues.value).toEqual(["item1", "item2"]);
  });

  it("should show listbox on focus when showOnFocus is true", async () => {
    const wrapper = createWrapper({ showOnFocus: true });
    const input = wrapper.find('[role="combobox"]');

    await input.trigger("focus");
    await nextTick();

    const listbox = wrapper.find('[role="listbox"]');
    expect(listbox.exists()).toBe(true);
  });

  it("should handle keyboard navigation", async () => {
    const wrapper = createWrapper({ showOnFocus: true });
    const input = wrapper.find('[role="combobox"]');

    await input.trigger("focus");
    await nextTick();

    await input.trigger("keydown", { key: "ArrowDown" });
    await nextTick();

    const items = wrapper.findAll('[role="option"]');
    const firstItem = items[0];

    expect(firstItem.attributes("data-vex-active")).toBe("true");

    await input.trigger("keydown", { key: "ArrowDown" });
    await nextTick();

    const secondItem = items[1];
    expect(secondItem.attributes("data-vex-active")).toBe("true");

    await input.trigger("keydown", { key: "Enter" });
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["item2"]]);
  });

  it("should not show listbox when disabled", async () => {
    const wrapper = createWrapper({ disabled: true });
    const input = wrapper.find('[role="combobox"]');

    await input.trigger("focus");
    await nextTick();

    const listbox = wrapper.find('[role="listbox"]');
    expect(listbox.exists()).toBe(false);
  });

  it("should not show listbox when readonly", async () => {
    const wrapper = createWrapper({ readonly: true });
    const input = wrapper.find('[role="combobox"]');

    await input.trigger("focus");
    await nextTick();

    const listbox = wrapper.find('[role="listbox"]');
    expect(listbox.exists()).toBe(false);
  });

  it("should handle Escape key to close listbox", async () => {
    const wrapper = createWrapper({ showOnFocus: true });
    const input = wrapper.find('[role="combobox"]');

    await input.trigger("focus");
    await nextTick();

    const listbox = wrapper.find('[role="listbox"]');
    expect(listbox.exists()).toBe(true);

    await input.trigger("keydown", { key: "Escape" });
    await nextTick();

    const listboxAfterEscape = wrapper.find('[role="listbox"]');
    expect(listboxAfterEscape.exists()).toBe(false);
  });
});
