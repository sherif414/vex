import { screen, render, cleanup } from "@testing-library/vue";
import { describe, expect, it, vi, afterEach } from "vitest";
import { defineComponent, h } from "vue";
import { COMPONENT_ERROR_MESSAGES, useRenderAsChild } from "./render-as-child";

//TODO: the tests are repetitive and can be reduced

const Primitive = defineComponent(
  (props) => {
    const render = useRenderAsChild(props.tag);
    return render;
  },
  {
    name: "TestComponent",
    props: ["tag"],
  },
);

describe("test usePrimitive functionalities", () => {
  afterEach(cleanup);
  describe("render as normal html tag", () => {
    it("renders a specified element", () => {
      render(Primitive, {
        props: { tag: "button" },
        attrs: { "data-testid": "testid" },
      });
      const element = screen.getByTestId("testid");
      expect(element).toBeVisible();
      expect(element.tagName).toBe("BUTTON");
    });

    it("merges props and attributes correctly", () => {
      render(Primitive, {
        props: { tag: "div" },
        attrs: {
          "data-testid": "testid",
          id: "hello",
          class: "some-class-name",
        },
      });
      const element = screen.getByTestId("testid");
      expect(element).toHaveAttribute("id", "hello");
      expect(element).toHaveClass("some-class-name");
    });

    it("bypasses the comment tag", () => {
      render(Primitive, {
        props: { tag: "template" },
        attrs: { "data-parent-attr": "", "data-testid": "testid" },
        slots: {
          default: () => [`<!-- this is a comment -->`, h("div", { "data-child-attr": "" })],
        },
      });

      const element = screen.getByTestId("testid");
      expect(element).toHaveAttribute("data-parent-attr", "");
      expect(element).toHaveAttribute("data-child-attr", "");
    });

    it("renders div element with custom attribute", () => {
      render(Primitive, {
        props: { tag: "button" },
        attrs: { "data-testid": "testid", type: "button" },
      });
      const element = screen.getByTestId("testid");
      expect(element).toHaveAttribute("type", "button");
    });

    it("renders multiple child elements", () => {
      render(Primitive, {
        props: { tag: "div" },
        attrs: { "data-parent-attr": "" },
        slots: {
          default: () => [h("div", "child-1"), h("div", "child-2"), h("div", "child-3")],
        },
      });
      expect(screen.getByText("child-1")).toBeInTheDocument();
      expect(screen.getByText("child-2")).toBeInTheDocument();
      expect(screen.getByText("child-3")).toBeInTheDocument();
    });
  });

  describe("render as template (asChild)", () => {
    it("throws error for template with no children", () => {
      expect(() => {
        render(Primitive, { props: { tag: "template" } });
      }).toThrowError(COMPONENT_ERROR_MESSAGES.TEMPLATE.NO_CHILDREN("TestComponent"));
    });

    it("throws error for template with multiple children", () => {
      expect(() => {
        render(Primitive, {
          props: { tag: "template" },
          slots: { default: [h("div"), h("div")] },
        });
      }).toThrowError(COMPONENT_ERROR_MESSAGES.TEMPLATE.MULTIPLE_CHILDREN("TestComponent", 2));
    });

    it("merges child class and attrs with parent's", () => {
      render(Primitive, {
        props: { tag: "template" },
        attrs: { class: "parent-class", "data-parent": "parent" },
        slots: {
          default: () =>
            h("div", {
              class: "child-class more-child-class",
              "data-child": "child",
              "data-testid": "child-id",
            }),
        },
      });

      const element = screen.getByTestId("child-id");
      expect(element).toHaveClass("child-class more-child-class parent-class");
      expect(element).toHaveAttribute("data-parent", "parent");
      expect(element).toHaveAttribute("data-child", "child");
    });

    it("renders the child class element tag", () => {
      render(Primitive, {
        props: { tag: "template" },
        attrs: { "data-testid": "testid" },
        slots: { default: () => h("a") },
      });

      const element = screen.getByTestId("testid");
      expect(element).toBeInTheDocument();
      expect(element.tagName).toBe("A");
    });

    it("renders the child component", () => {
      const ChildComponent = defineComponent({
        render() {
          return h("div", "child");
        },
      });
      render(Primitive, {
        props: { tag: "div" },
        slots: {
          default: () => h(ChildComponent),
        },
      });
      expect(screen.getByText("child")).toBeInTheDocument;
    });

    it("merges non conflicting parent and child attributes", () => {
      render(Primitive, {
        props: { tag: "template" },
        attrs: { "data-parent-attr": "", "data-testid": "testid" },
        slots: { default: [h("div", { "data-child-attr": "" })] },
      });

      const element = screen.getByTestId("testid");
      expect(element).toHaveAttribute("data-parent-attr", "");
      expect(element).toHaveAttribute("data-child-attr", "");
    });

    it("overrides attributes that are present on both components, parent attributes has priority over child attributes", () => {
      render(Primitive, {
        props: { tag: "template" },
        attrs: { id: "parent", "data-testid": "testid", type: "reset" },
        slots: {
          default: [h("button", { id: "child", type: "button" })],
        },
      });

      const element = screen.getByTestId("testid");
      expect(element).toHaveAttribute("type", "reset");
      expect(element).toHaveAttribute("id", "parent");
    });
  });

  describe("void elements", () => {
    it("warns when void element has children", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(Primitive, {
        props: { tag: "img" },
        attrs: {},
        slots: { default: () => h("div") },
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        COMPONENT_ERROR_MESSAGES.VOID_ELEMENT.HAS_CHILDREN("img"),
      );
      consoleSpy.mockRestore();
    });

    it("renders void elements without children even if provided", () => {
      render(Primitive, {
        props: { tag: "input" },
        attrs: { type: "text" },
        slots: { default: () => h("div", { "data-testid": "testid" }) },
      });
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(document.querySelector("[data-testid=testid]")).toBeNull();
    });

    it("preserves props on void elements", () => {
      render(Primitive, {
        props: { tag: "input" },
        attrs: {
          "data-testid": "testid",
          type: "text",
          placeholder: "Enter text",
        },
        slots: { default: h("div") },
      });
      const element = screen.getByTestId("testid");
      expect(element).toHaveAttribute("type", "text");
      expect(element).toHaveAttribute("placeholder", "Enter text");
    });
  });

  describe("slots handling", () => {
    it("uses slot content", () => {
      render(Primitive, {
        props: { tag: "div" },
        slots: {
          default: () => [h("div", { id: "slot-content" }), "slot content"],
        },
      });
      expect(screen.getByText("slot content")).toBeInTheDocument();
    });
  });
});
