import { render, type RenderResult, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import { userEvent } from "@testing-library/user-event"
import { h, type VNode } from "vue"
import { describe, it, expect, beforeEach } from "vitest"
import { Checkbox, CheckboxGroup } from "../index"

type CheckboxConfig = {
  value: string
  label?: string
  disabled?: boolean
  indeterminate?: boolean
  required?: boolean
  validationState?: "valid" | "invalid"
  autoFocus?: boolean
  name?: string
}

function createCheckbox(props: CheckboxConfig = { value: "checkbox" }): RenderResult {
  return render(Checkbox, {
    props,
    slots: {
      default: (): string => props.label || `Checkbox ${props.value}`,
    },
  })
}

function createCheckboxGroup(props = {}, checkboxes: CheckboxConfig[] = []): RenderResult {
  return render(CheckboxGroup, {
    props,
    slots: {
      default: (): VNode[] =>
        checkboxes.map((checkbox) =>
          h(
            Checkbox,
            {
              value: checkbox.value,
              disabled: checkbox.disabled,
              indeterminate: checkbox.indeterminate,
            },
            () => checkbox.label || `Checkbox ${checkbox.value}`,
          ),
        ),
    },
  })
}

describe("Checkbox", () => {
  it("renders correctly with default props", () => {
    createCheckbox({ value: "test" })

    const checkbox = screen.getByRole("checkbox", { name: "Checkbox test" })
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toHaveAttribute("aria-checked", "false")
    expect(checkbox).toHaveAttribute("aria-disabled", "false")
    expect(checkbox).toHaveAttribute("aria-required", "false")
  })

  it("can be checked and unchecked", async () => {
    createCheckbox({ value: "test" })

    const user = userEvent.setup()
    const checkbox = screen.getByRole("checkbox", { name: "Checkbox test" })

    expect(checkbox).toHaveAttribute("aria-checked", "false")

    await user.click(checkbox)
    expect(checkbox).toHaveAttribute("aria-checked", "true")

    await user.click(checkbox)
    expect(checkbox).toHaveAttribute("aria-checked", "false")
  })

  it("supports keyboard interaction", async () => {
    createCheckbox({ value: "test" })

    const user = userEvent.setup()
    const checkbox = screen.getByRole("checkbox", { name: "Checkbox test" })

    checkbox.focus()
    expect(document.activeElement).toBe(checkbox)

    await user.keyboard("{Space}")
    expect(checkbox).toHaveAttribute("aria-checked", "true")

    await user.keyboard("{Space}")
    expect(checkbox).toHaveAttribute("aria-checked", "false")

    // Enter key should not toggle
    await user.keyboard("{Enter}")
    expect(checkbox).toHaveAttribute("aria-checked", "false")
  })

  it("supports disabled state", async () => {
    createCheckbox({ value: "test", disabled: true })

    const user = userEvent.setup()
    const checkbox = screen.getByRole("checkbox", { name: "Checkbox test" })

    expect(checkbox).toHaveAttribute("aria-disabled", "true")

    await user.click(checkbox)
    expect(checkbox).toHaveAttribute("aria-checked", "false")

    checkbox.focus()
    await user.keyboard("{Space}")
    expect(checkbox).toHaveAttribute("aria-checked", "false")
  })

  it("supports indeterminate state", () => {
    createCheckbox({ value: "test", indeterminate: true })

    const checkbox = screen.getByRole("checkbox", { name: "Checkbox test" })
    expect(checkbox).toHaveAttribute("aria-checked", "mixed")
  })

  it("supports required attribute", () => {
    createCheckbox({ value: "test", required: true })

    const checkbox = screen.getByRole("checkbox", { name: "Checkbox test" })
    expect(checkbox).toHaveAttribute("aria-required", "true")
  })

  it("supports validation states", () => {
    createCheckbox({ value: "test", validationState: "invalid" })

    const checkbox = screen.getByRole("checkbox", { name: "Checkbox test" })
    expect(checkbox).toHaveAttribute("aria-invalid", "true")
  })
})

describe("CheckboxGroup", () => {
  it("allows multiple checkboxes to be selected", async () => {
    createCheckboxGroup({}, [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ])

    const user = userEvent.setup()
    const checkboxes = screen.getAllByRole("checkbox")

    for (const checkbox of checkboxes) {
      expect(checkbox).toHaveAttribute("aria-checked", "false")
    }

    await user.click(checkboxes[0])
    await user.click(checkboxes[2])

    expect(checkboxes[0]).toHaveAttribute("aria-checked", "true")
    expect(checkboxes[1]).toHaveAttribute("aria-checked", "false")
    expect(checkboxes[2]).toHaveAttribute("aria-checked", "true")
  })

  it("supports initially selected values", () => {
    createCheckboxGroup({ modelValue: ["option2"] }, [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ])

    const checkboxes = screen.getAllByRole("checkbox")

    expect(checkboxes[0]).toHaveAttribute("aria-checked", "false")
    expect(checkboxes[1]).toHaveAttribute("aria-checked", "true")
    expect(checkboxes[2]).toHaveAttribute("aria-checked", "false")
  })

  it("supports disabled state for the entire group", async () => {
    createCheckboxGroup({ disabled: true }, [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ])

    const user = userEvent.setup()
    const checkboxes = screen.getAllByRole("checkbox")

    for (const checkbox of checkboxes) {
      expect(checkbox).toHaveAttribute("aria-disabled", "true")
    }

    await user.click(checkboxes[0])
    expect(checkboxes[0]).toHaveAttribute("aria-checked", "false")
  })

  it("supports individual disabled checkboxes within a group", async () => {
    createCheckboxGroup({}, [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2", disabled: true },
    ])

    const user = userEvent.setup()
    const checkboxes = screen.getAllByRole("checkbox")

    // Only second checkbox should be disabled
    expect(checkboxes[0]).not.toHaveAttribute("aria-disabled")
    expect(checkboxes[1]).toHaveAttribute("aria-disabled", "true")

    // First checkbox should toggle when clicked
    await user.click(checkboxes[0])
    expect(checkboxes[0]).toHaveAttribute("aria-checked", "true")

    // Second checkbox should not toggle when clicked
    await user.click(checkboxes[1])
    expect(checkboxes[1]).toHaveAttribute("aria-checked", "false")
  })

  it("maintains proper ARIA attributes", () => {
    createCheckboxGroup({}, [{ value: "option1", label: "Option 1" }])

    const group = screen.getByRole("group")
    const checkbox = screen.getByRole("checkbox")

    expect(group).toBeInTheDocument()
    expect(checkbox).toHaveAttribute("role", "checkbox")
    expect(checkbox).toHaveAttribute("aria-checked", "false")
  })

  it("supports checkAll method to check all checkboxes", async () => {
    const { component } = createCheckboxGroup({}, [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ])

    const checkboxes = screen.getAllByRole("checkbox")

    // Initially all checkboxes should be unchecked
    for (const checkbox of checkboxes) {
      expect(checkbox).toHaveAttribute("aria-checked", "false")
    }

    // Call the checkAll method on the component instance
    await component.vm.checkAll()

    // After checkAll, all checkboxes should be checked
    for (const checkbox of checkboxes) {
      expect(checkbox).toHaveAttribute("aria-checked", "true")
    }
  })

  it("supports uncheckAll method to uncheck all checkboxes", async () => {
    const { component } = createCheckboxGroup({ modelValue: ["option1", "option2", "option3"] }, [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ])

    const checkboxes = screen.getAllByRole("checkbox")

    // Initially all checkboxes should be checked
    for (const checkbox of checkboxes) {
      expect(checkbox).toHaveAttribute("aria-checked", "true")
    }

    // Call the uncheckAll method on the component instance
    await component.vm.uncheckAll()

    // After uncheckAll, all checkboxes should be unchecked
    for (const checkbox of checkboxes) {
      expect(checkbox).toHaveAttribute("aria-checked", "false")
    }
  })
})
