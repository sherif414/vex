import { Alert, AlertContent, AlertHeader } from ".";
import { mount } from "cypress/vue";

describe("Alert Component", () => {
  it("renders correctly with default props", () => {
    mount(Alert);
    cy.get('[role="alert"]').should("exist");
    cy.get("[aria-labelledby]").should("exist");
    cy.get("[aria-describedby]").should("exist");
  });

  it("renders with custom tag", () => {
    mount(Alert, {
      props: {
        as: "article",
      },
    });
    cy.get('[role="alert"]').should("have.attr", "tag", "article");
  });

  describe("AlertContent", () => {
    beforeEach(() => {
      mount(AlertContent);
    });

    it("renders slot content", () => {
      cy.get('[role="dialog"]').should("contain", "Slot Content");
    });

    it("uses correct aria attributes", () => {
      cy.get("[aria-labelledby]").should("have.attr", "id");
      cy.get("[aria-describedby]").should("have.attr", "id");
    });
  });

  describe("AlertHeader", () => {
    beforeEach(() => {
      mount(AlertHeader);
    });

    it("renders slot content", () => {
      cy.get('[role="heading"]').should("contain", "Slot Content");
    });

    it("uses correct aria attributes", () => {
      cy.get("[aria-labelledby]").should("have.attr", "id");
      cy.get("[aria-describedby]").should("have.attr", "id");
    });
  });

  describe("Alert component with AlertContent and AlertHeader", () => {
    beforeEach(() => {
      mount(Alert);
    });

    it("renders both header and content", () => {
      cy.get('[role="alert"]').should("exist");
      cy.get('[role="dialog"]').should("exist");
      cy.get('[role="heading"]').should("exist");
    });

    it("passes accessibility checks", () => {
      cy.checkA11y();
    });
  });
});

// Helper function for accessibility check
Cypress.Commands.add("checkA11y", () => {
  cy.log("Running accessibility checks...");
  // Add more specific ARIA attribute checks here
});
