import { render, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import { userEvent } from "@testing-library/user-event"
import { h } from "vue"
import { describe, it, expect, beforeEach } from "vitest"
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "../index"

type AccordionItemConfig = {
  value: string
  trigger: string
  content: string
  collapsible?: boolean
  disabled?: boolean
}

function createWrapper(props = {}, items: AccordionItemConfig[] = []) {
  return render(Accordion, {
    props,
    slots: {
      default: () =>
        items.map((item) =>
          h(
            AccordionItem,
            {
              value: item.value,
              collapsible: item.collapsible !== undefined ? item.collapsible : true,
              disabled: item.disabled,
            },
            {
              default: ({ expanded }) => [
                h(AccordionHeader, null, () => h(AccordionTrigger, null, () => item.trigger)),
                h(
                  AccordionContent,
                  { style: { display: expanded ? undefined : "none" } },
                  () => item.content,
                ),
              ],
            },
          ),
        ),
    },
  })
}

describe("Accordion", () => {
  it("allows single item expansion by default", async () => {
    createWrapper({}, [
      { value: "item1", trigger: "Trigger 1", content: "Content 1" },
      { value: "item2", trigger: "Trigger 2", content: "Content 2" },
    ])

    const user = userEvent.setup()
    const firstTrigger = screen.getByRole("button", { name: "Trigger 1" })
    const secondTrigger = screen.getByRole("button", { name: "Trigger 2" })

    // Initial state - all collapsed
    expect(firstTrigger).toHaveAttribute("aria-expanded", "false")
    expect(secondTrigger).toHaveAttribute("aria-expanded", "false")

    // Expand first item
    await user.click(firstTrigger)
    expect(firstTrigger).toHaveAttribute("aria-expanded", "true")
    expect(secondTrigger).toHaveAttribute("aria-expanded", "false")

    const firstContent = screen.getByText("Content 1")
    const secondContent = screen.getByText("Content 2")
    expect(firstContent).toBeVisible()
    expect(secondContent).not.toBeVisible()

    // Expand second item (should collapse first)
    await user.click(secondTrigger)
    expect(firstTrigger).toHaveAttribute("aria-expanded", "false")
    expect(secondTrigger).toHaveAttribute("aria-expanded", "true")
    expect(firstContent).not.toBeVisible()
    expect(secondContent).toBeVisible()
  })

  it("supports multiple item expansion when multiple prop is true", async () => {
    createWrapper({ multiple: true }, [
      { value: "item1", trigger: "Trigger 1", content: "Content 1" },
      { value: "item2", trigger: "Trigger 2", content: "Content 2" },
    ])

    const user = userEvent.setup()
    const firstTrigger = screen.getByRole("button", { name: "Trigger 1" })
    const secondTrigger = screen.getByRole("button", { name: "Trigger 2" })

    // Expand first item
    await user.click(firstTrigger)
    expect(firstTrigger).toHaveAttribute("aria-expanded", "true")
    expect(secondTrigger).toHaveAttribute("aria-expanded", "false")

    const firstContent = screen.getByText("Content 1")
    const secondContent = screen.getByText("Content 2")
    expect(firstContent).toBeVisible()
    expect(secondContent).not.toBeVisible()

    // Expand second item (first should stay expanded)
    await user.click(secondTrigger)
    expect(firstTrigger).toHaveAttribute("aria-expanded", "true")
    expect(secondTrigger).toHaveAttribute("aria-expanded", "true")
    expect(firstContent).toBeVisible()
    expect(secondContent).toBeVisible()
  })

  it("supports keyboard navigation", async () => {
    createWrapper({}, [
      { value: "item1", trigger: "Trigger 1", content: "Content 1" },
      { value: "item2", trigger: "Trigger 2", content: "Content 2" },
      { value: "item3", trigger: "Trigger 3", content: "Content 3" },
    ])

    const user = userEvent.setup()

    const firstTrigger = screen.getByRole("button", { name: "Trigger 1" })
    const secondTrigger = screen.getByRole("button", { name: "Trigger 2" })
    const thirdTrigger = screen.getByRole("button", { name: "Trigger 3" })

    // Initial focus
    firstTrigger.focus()
    expect(document.activeElement).toBe(firstTrigger)

    // Down arrow navigation
    await user.keyboard("{ArrowDown}")
    expect(document.activeElement).toBe(secondTrigger)

    await user.keyboard("{ArrowDown}")
    expect(document.activeElement).toBe(thirdTrigger)

    // Wrap to first item
    await user.keyboard("{ArrowDown}")
    expect(document.activeElement).toBe(firstTrigger)

    // Up arrow navigation
    await user.keyboard("{ArrowUp}")
    expect(document.activeElement).toBe(thirdTrigger)

    // Space key activation
    await user.keyboard(" ")
    expect(thirdTrigger).toHaveAttribute("aria-expanded", "true")

    // Enter key activation (should collapse previous)
    firstTrigger.focus()
    await user.keyboard("{Enter}")
    expect(firstTrigger).toHaveAttribute("aria-expanded", "true")
    expect(thirdTrigger).toHaveAttribute("aria-expanded", "false")

    // Home key jumps to first
    thirdTrigger.focus()
    await user.keyboard("{Home}")
    expect(document.activeElement).toBe(firstTrigger)

    // End key jumps to last
    await user.keyboard("{End}")
    expect(document.activeElement).toBe(thirdTrigger)
  })

  it("maintains focus when items are toggled", async () => {
    createWrapper({}, [{ value: "item1", trigger: "Trigger 1", content: "Content 1" }])

    const user = userEvent.setup()
    const trigger = screen.getByRole("button", { name: "Trigger 1" })

    trigger.focus()
    await user.keyboard("{Enter}")
    expect(document.activeElement).toBe(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")

    await user.keyboard("{Enter}")
    expect(document.activeElement).toBe(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("supports collapsible accordion items", async () => {
    createWrapper({}, [{ value: "item1", trigger: "Trigger 1", content: "Content 1" }])

    const user = userEvent.setup()
    const trigger = screen.getByRole("button", { name: "Trigger 1" })
    const content = screen.getByText("Content 1")

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(content).toBeVisible()

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(content).not.toBeVisible()
  })

  it("prevents collapsing when collapsible is false", async () => {
    createWrapper({}, [
      {
        value: "item1",
        trigger: "Trigger 1",
        content: "Content 1",
        collapsible: false,
      },
    ])

    const user = userEvent.setup()
    const trigger = screen.getByRole("button", { name: "Trigger 1" })
    const content = screen.getByText("Content 1")

    // Initial state - collapsed
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(content).not.toBeVisible()

    // Expand item
    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(content).toBeVisible()

    // Try to collapse by clicking again - should remain expanded
    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(content).toBeVisible()
  })

  it("maintains proper ARIA attributes", async () => {
    createWrapper({}, [{ value: "item1", trigger: "Trigger 1", content: "Content 1" }])

    const trigger = screen.getByRole("button", { name: "Trigger 1" })
    // Use getAllByRole and access the first element since it might not be easily found when it's hidden
    const content = screen.getByText("Content 1").closest('[role="region"]')

    expect(trigger).toHaveAttribute("aria-expanded", "false")

    const controlsId = trigger.getAttribute("aria-controls")
    expect(content).toHaveAttribute("id", controlsId)

    const labelledById = content?.getAttribute("aria-labelledby")
    expect(trigger).toHaveAttribute("id", labelledById)
  })

  it("supports initially expanded items", async () => {
    createWrapper({ modelValue: "item2" }, [
      { value: "item1", trigger: "Trigger 1", content: "Content 1" },
      { value: "item2", trigger: "Trigger 2", content: "Content 2" },
    ])

    const firstTrigger = screen.getByRole("button", { name: "Trigger 1" })
    const secondTrigger = screen.getByRole("button", { name: "Trigger 2" })
    const firstContent = screen.getByText("Content 1")
    const secondContent = screen.getByText("Content 2")

    // Initial state - second item should be expanded
    expect(firstTrigger).toHaveAttribute("aria-expanded", "false")
    expect(secondTrigger).toHaveAttribute("aria-expanded", "true")
    expect(firstContent).not.toBeVisible()
    expect(secondContent).toBeVisible()
  })

  it("supports multiple initially expanded items", async () => {
    createWrapper({ multiple: true, modelValue: ["item1", "item3"] }, [
      { value: "item1", trigger: "Trigger 1", content: "Content 1" },
      { value: "item2", trigger: "Trigger 2", content: "Content 2" },
      { value: "item3", trigger: "Trigger 3", content: "Content 3" },
    ])

    const firstTrigger = screen.getByRole("button", { name: "Trigger 1" })
    const secondTrigger = screen.getByRole("button", { name: "Trigger 2" })
    const thirdTrigger = screen.getByRole("button", { name: "Trigger 3" })
    const firstContent = screen.getByText("Content 1")
    const secondContent = screen.getByText("Content 2")
    const thirdContent = screen.getByText("Content 3")

    // Initial state - first and third items should be expanded
    expect(firstTrigger).toHaveAttribute("aria-expanded", "true")
    expect(secondTrigger).toHaveAttribute("aria-expanded", "false")
    expect(thirdTrigger).toHaveAttribute("aria-expanded", "true")
    expect(firstContent).toBeVisible()
    expect(secondContent).not.toBeVisible()
    expect(thirdContent).toBeVisible()
  })

  it("supports disabled accordion items", async () => {
    createWrapper({}, [
      { value: "item1", trigger: "Trigger 1", content: "Content 1", disabled: true },
    ])

    const user = userEvent.setup()
    const trigger = screen.getByRole("button", { name: "Trigger 1" })
    const content = screen.getByText("Content 1")

    // Initial state - collapsed
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(trigger).toHaveAttribute("disabled")
    expect(content).not.toBeVisible()

    // Try to expand item by clicking
    await user.click(trigger)

    // Should remain collapsed because it's disabled
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(content).not.toBeVisible()
  })
})
