import { mount } from "cypress/vue";
import Combobox from "../Combobox.vue";
import ComboboxInput from "../ComboboxInput.vue";
import ComboboxListbox from "../ComboboxListbox.vue";
import ComboboxListItem from "../ComboboxListItem.vue";
import ComboboxPanel from "../ComboboxPanel.vue";

describe("Combobox", () => {
  const createWrapper = (props = {}) => {
    return mount(() => {
      const _props = {
        showOnFocus: true,
        ...props,
      };

      return (
        <Combobox {..._props}>
          <ComboboxInput modelValue="" />,
          <ComboboxPanel>
            <ComboboxListbox>
              {[1, 2, 3].map((i) => (
                <ComboboxListItem value={`item${i}`} textContent={`item ${i}`}>
                  Item {i}
                </ComboboxListItem>
              ))}
            </ComboboxListbox>
          </ComboboxPanel>
        </Combobox>
      );
    });
  };

  it("should render with combobox role", () => {
    createWrapper();
    cy.get('[role="combobox"]').should("exist");
  });

  it("should mark option as selected when clicked", () => {
    createWrapper();

    cy.get('[role="combobox"]').focus();
    cy.get('[role="option"][data-vex-value="item1"]').click();

    cy.get('[role="option"][data-vex-value="item1"]').should(
      "have.attr",
      "aria-selected",
      "true"
    );
  });

  it("should allow multiple options to be selected when multiselect is enabled", () => {
    createWrapper({ multiselect: true });

    cy.get('[role="combobox"]').focus();
    cy.get('[role="option"][data-vex-value="item1"]').click();
    cy.get('[role="option"][data-vex-value="item2"]').click();

    cy.get('[role="option"][data-vex-value="item1"]').should(
      "have.attr",
      "aria-selected",
      "true"
    );
    cy.get('[role="option"][data-vex-value="item2"]').should(
      "have.attr",
      "aria-selected",
      "true"
    );
  });

  it("should set aria-expanded to true when focused and showOnFocus is enabled", () => {
    createWrapper({ showOnFocus: true });

    cy.get('[role="combobox"]').focus();
    cy.get('[role="combobox"]').should("have.attr", "aria-expanded", "true");
  });

  it("should handle keyboard navigation and selection with arrow keys and enter", () => {
    createWrapper();

    cy.get('[role="combobox"]').focus();
    cy.get('[role="combobox"]').type("{downarrow}");

    cy.get('[role="option"]')
      .first()
      .should("have.attr", "data-vex-active", "true");

    cy.get('[role="combobox"]').type("{downarrow}");
    cy.get('[role="option"]')
      .eq(1)
      .should("have.attr", "data-vex-active", "true");

    cy.get('[role="combobox"]').type("{enter}");

    cy.get('[role="option"][data-vex-value="item2"]').should(
      "have.attr",
      "aria-selected",
      "true"
    );
  });

  it("should keep aria-expanded false when clicking disabled combobox", () => {
    createWrapper({ disabled: true });
    cy.get('[role="combobox"]').click({ force: true });
    cy.get('[role="combobox"]').should("have.attr", "aria-expanded", "false");
  });

  it("should keep aria-expanded false when clicking readonly combobox", () => {
    createWrapper({ readonly: true });
    cy.get('[role="combobox"]').click({ force: true });
    cy.get('[role="combobox"]').should("have.attr", "aria-expanded", "false");
  });

  it("should set aria-expanded to false when pressing escape key", () => {
    createWrapper({ showOnFocus: true });

    cy.get('[role="combobox"]').focus();
    cy.get('[role="combobox"]').should("have.attr", "aria-expanded", "true");

    cy.get('[role="combobox"]').type("{esc}");
    cy.get('[role="combobox"]').should("have.attr", "aria-expanded", "false");
  });
});
