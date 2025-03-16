import { type RenderResult, render, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import { userEvent } from "@testing-library/user-event"
import type { AnyFn } from "@vueuse/core"
import { describe, expect, it, vi } from "vitest"
import { type VNode, h } from "vue"
import type { CheckboxProps } from "../Checkbox.vue"
import { Checkbox } from "../index"

// Core checkbox constants
const CHECKBOX_VALUE = "test-value"
const CHECKBOX_NAME = "test-name"

type CheckboxConfig = CheckboxProps & {
  label?: string
}

function createCheckbox(props: CheckboxConfig = { value: CHECKBOX_VALUE }): RenderResult {
  return render(Checkbox, {
    props,
    slots: {
      default: (): string => props.label || CHECKBOX_NAME,
    },
  })
}

interface CreateCheckboxFormOptions {
  checkboxProps?: CheckboxConfig
  formProps?: Record<string, string | AnyFn>
  formContent?: string | VNode | null
}

// Helper function to render a checkbox within a form
function createCheckboxForm({
  checkboxProps = { value: CHECKBOX_VALUE, name: CHECKBOX_NAME },
  formProps = {},
  formContent = null,
}: CreateCheckboxFormOptions = {}): RenderResult {
  return render(() =>
    h("form", { ...formProps }, [
      h("div", {}, [h(Checkbox, checkboxProps, () => checkboxProps.label || CHECKBOX_NAME)]),
      formContent,
    ]),
  )
}

describe("Checkbox", () => {
  it("renders correctly with default props", () => {
    createCheckbox({ value: CHECKBOX_VALUE })

    const checkbox = screen.getByRole("checkbox", { name: CHECKBOX_NAME })
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toHaveAttribute("aria-checked", "false")
    expect(checkbox).toHaveAttribute("aria-disabled", "false")
    expect(checkbox).toHaveAttribute("aria-required", "false")
  })

  it("can be checked and unchecked", async () => {
    createCheckbox({ value: CHECKBOX_VALUE })

    const user = userEvent.setup()
    const checkbox = screen.getByRole("checkbox", { name: CHECKBOX_NAME })

    expect(checkbox).toHaveAttribute("aria-checked", "false")

    await user.click(checkbox)
    expect(checkbox).toHaveAttribute("aria-checked", "true")

    await user.click(checkbox)
    expect(checkbox).toHaveAttribute("aria-checked", "false")
  })

  it("supports keyboard interaction", async () => {
    createCheckbox({ value: CHECKBOX_VALUE })

    const user = userEvent.setup()
    const checkbox = screen.getByRole("checkbox", { name: CHECKBOX_NAME })

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
    createCheckbox({ value: CHECKBOX_VALUE, disabled: true })

    const user = userEvent.setup()
    const checkbox = screen.getByRole("checkbox", { name: CHECKBOX_NAME })

    expect(checkbox).toHaveAttribute("aria-disabled", "true")

    await user.click(checkbox)
    expect(checkbox).toHaveAttribute("aria-checked", "false")

    checkbox.focus()
    await user.keyboard("{Space}")
    expect(checkbox).toHaveAttribute("aria-checked", "false")
  })

  it("can be checked by default and disabled", () => {
    createCheckbox({ value: CHECKBOX_VALUE, checked: true, disabled: true })

    const checkbox = screen.getByRole("checkbox", { name: CHECKBOX_NAME })
    expect(checkbox).toHaveAttribute("aria-checked", "true")
    expect(checkbox).toHaveAttribute("aria-disabled", "true")
  })

  it("supports indeterminate state", () => {
    createCheckbox({ value: CHECKBOX_VALUE, indeterminate: true })

    const checkbox = screen.getByRole("checkbox", { name: CHECKBOX_NAME })
    expect(checkbox).toHaveAttribute("aria-checked", "mixed")
  })

  it("supports required attribute", () => {
    createCheckbox({ value: CHECKBOX_VALUE, required: true })

    const checkbox = screen.getByRole("checkbox", { name: CHECKBOX_NAME })
    expect(checkbox).toHaveAttribute("aria-required", "true")
  })

  it("supports validation states", () => {
    createCheckbox({ value: CHECKBOX_VALUE, validationState: "invalid" })

    const checkbox = screen.getByRole("checkbox", { name: CHECKBOX_NAME })
    expect(checkbox).toHaveAttribute("aria-invalid", "true")
  })

  /**
   * FIXME:
   * The autoFocus implementation functions as expected in the browser environment,
   * but the test fails due to a testing environment limitation where focus is
   * automatically redirected to the document.body element. This is likely due to
   * how happy-dom handles focus management differently from real browsers, or a possible bug.
   */
  it.fails("automatically focuses when autoFocus is true", () => {
    createCheckbox({ value: CHECKBOX_VALUE, autoFocus: true })
    const checkbox = screen.getByRole("checkbox", { name: CHECKBOX_NAME })
    expect(checkbox).toHaveFocus()
  })

  it("renders a hidden input for form submission when inside a form", async () => {
    const { container } = createCheckboxForm()

    const visibleCheckbox = screen.getByRole("checkbox", { name: CHECKBOX_NAME })
    expect(visibleCheckbox).toBeInTheDocument()

    const hiddenInput = container.querySelector(`input[type="checkbox"][name="${CHECKBOX_NAME}"]`)
    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput).toHaveAttribute("value", CHECKBOX_VALUE)
    expect(hiddenInput).not.toBeChecked()

    const user = userEvent.setup()
    await user.click(visibleCheckbox)

    expect(hiddenInput).toBeChecked()
  })

  it("submits the correct value when checked and form is submitted", async () => {
    const handleSubmit = vi.fn((e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      return formData
    })

    const { container } = createCheckboxForm({
      formProps: { onSubmit: handleSubmit },
      formContent: h("button", { type: "submit" }, "Submit"),
    })

    const checkbox = screen.getByRole("checkbox", { name: CHECKBOX_NAME })
    const submitButton = screen.getByRole("button", { name: "Submit" })

    const user = userEvent.setup()
    await user.click(checkbox)
    await user.click(submitButton)

    expect(handleSubmit).toHaveBeenCalledTimes(1)
    const formDataFromSubmit = handleSubmit.mock.results[0].value
    expect(formDataFromSubmit.has(CHECKBOX_NAME)).toBe(true)
    expect(formDataFromSubmit.get(CHECKBOX_NAME)).toBe(CHECKBOX_VALUE)
  })

  it("respects form reset functionality", async () => {
    const { container } = createCheckboxForm({
      formContent: h("button", { type: "reset" }, "Reset"),
      checkboxProps: { checked: true, value: CHECKBOX_VALUE, name: CHECKBOX_NAME },
    })

    const checkbox = screen.getByRole("checkbox", { name: CHECKBOX_NAME })
    const resetButton = screen.getByRole("button", { name: "Reset" })
    const hiddenInput = container.querySelector(`input[type="checkbox"][name=${CHECKBOX_NAME}]`)

    const user = userEvent.setup()
    await user.click(checkbox)

    expect(checkbox).toHaveAttribute("aria-checked", "false")
    expect(hiddenInput).not.toBeChecked()

    await user.click(resetButton)

    expect(checkbox).toHaveAttribute("aria-checked", "true")
    expect(hiddenInput).toBeChecked()
  })

  // FIXME: disabling it for now as it requires deep integration with a form component
  it.fails("works with form validation when required", async () => {
    const handleInvalid = vi.fn()
    const handleSubmit = vi.fn((e) => e.preventDefault())

    const { container } = createCheckboxForm({
      checkboxProps: { value: CHECKBOX_VALUE, name: CHECKBOX_NAME, required: true },
      formProps: { onSubmit: handleSubmit, onInvalid: handleInvalid, novalidate: "true" },
      formContent: h("button", { type: "submit" }, "Submit"),
    })

    const checkbox = screen.getByRole("checkbox", { name: CHECKBOX_NAME })
    const submitButton = screen.getByRole("button", { name: "Submit" })

    expect(checkbox).toHaveAttribute("aria-required", "true")

    const user = userEvent.setup()
    await user.click(submitButton)

    // Form validation should prevent submission when required checkbox is not checked
    expect(handleSubmit).not.toHaveBeenCalled()
    expect(handleInvalid).toHaveBeenCalled()

    await user.click(checkbox)
    await user.click(submitButton)

    // Form should submit successfully after checkbox is checked
    expect(handleSubmit).toHaveBeenCalled()
  })
})
