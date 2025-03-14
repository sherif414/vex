import { render, type RenderResult, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import { userEvent } from "@testing-library/user-event"
import { h, type VNode } from "vue"
import { describe, it, expect } from "vitest"
import { Checkbox } from "../index"

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
