import { render, type RenderResult, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import { Checkbox } from "../index"
import type { CheckboxProps } from "../Checkbox.vue"

type CheckboxConfig = CheckboxProps & {
  label?: string
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

  it("can be checked by default and disabled", () => {
    createCheckbox({ value: "test", checked: true, disabled: true })

    const checkbox = screen.getByRole("checkbox", { name: "Checkbox test" })
    expect(checkbox).toHaveAttribute("aria-checked", "true")
    expect(checkbox).toHaveAttribute("aria-disabled", "true")
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

  /**
   * FIXME:
   * The autoFocus implementation functions as expected in the browser environment,
   * but the test fails due to a testing environment limitation where focus is
   * automatically redirected to the document.body element. This is likely due to
   * how happy-dom handles focus management differently from real browsers, or a possible bug.
   */
  // it("automatically focuses when autoFocus is true", () => {
  //   createCheckbox({ value: "test", autoFocus: true })

  //   const checkbox = screen.getByRole("checkbox", { name: "Checkbox test" })
  //   expect(checkbox).toHaveFocus()
  // })
})
