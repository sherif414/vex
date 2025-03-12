import { mount } from 'cypress/vue';
import { h, ref } from 'vue';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '../index';

type AccordionItemConfig = {
  value: string;
  trigger: string;
  content: string;
};

function createWrapper(props = {}, items: AccordionItemConfig[] = []) {
  return mount(Accordion, {
    props,
    slots: {
      default: () =>
        items.map((item) =>
          h(
            AccordionItem,
            { value: item.value },
            {
              default: ({ expanded }) => [
                h(AccordionHeader, null, () => h(AccordionTrigger, null, () => item.trigger)),
                h(
                  AccordionContent,
                  { style: { display: expanded ? undefined : 'none' } },
                  () => item.content
                ),
              ],
            }
          )
        ),
    },
  });
}

describe('Accordion', () => {
  it('allows single item expansion by default', () => {
    createWrapper({}, [
      { value: 'item1', trigger: 'Trigger 1', content: 'Content 1' },
      { value: 'item2', trigger: 'Trigger 2', content: 'Content 2' },
    ]);

    cy.contains('button', 'Trigger 1').as('firstTrigger');
    cy.contains('button', 'Trigger 2').as('secondTrigger');
    cy.contains('[role=region]', 'Content 1').as('firstContent');
    cy.contains('[role=region]', 'Content 2').as('secondContent');

    cy.get('@firstTrigger').click();
    cy.get('@firstTrigger').should('have.attr', 'aria-expanded', 'true');
    cy.get('@firstContent').should('be.visible');
    cy.get('@secondTrigger').should('have.attr', 'aria-expanded', 'false');
    cy.get('@secondContent').should('not.be.visible');

    cy.get('@secondTrigger').click();
    cy.get('@firstTrigger').should('have.attr', 'aria-expanded', 'false');
    cy.get('@firstContent').should('not.be.visible');
    cy.get('@secondTrigger').should('have.attr', 'aria-expanded', 'true');
    cy.get('@secondContent').should('be.visible');
  });

  it('supports multiple item expansion when multiple prop is true', () => {
    createWrapper({ multiple: true }, [
      { value: 'item1', trigger: 'Trigger 1', content: 'Content 1' },
      { value: 'item2', trigger: 'Trigger 2', content: 'Content 2' },
    ]);

    cy.contains('button', 'Trigger 1').as('firstTrigger');
    cy.contains('button', 'Trigger 2').as('secondTrigger');
    cy.contains('[role=region]', 'Content 1').as('firstContent');
    cy.contains('[role=region]', 'Content 2').as('secondContent');

    cy.get('@firstTrigger').click();
    cy.get('@firstTrigger').should('have.attr', 'aria-expanded', 'true');
    cy.get('@firstContent').should('be.visible');
    cy.get('@secondTrigger').should('have.attr', 'aria-expanded', 'false');
    cy.get('@secondContent').should('not.be.visible');

    cy.get('@secondTrigger').click();
    cy.get('@firstTrigger').should('have.attr', 'aria-expanded', 'true');
    cy.get('@firstContent').should('be.visible');
    cy.get('@secondTrigger').should('have.attr', 'aria-expanded', 'true');
    cy.get('@secondContent').should('be.visible');
  });

  it('supports keyboard navigation', () => {
    createWrapper({}, [
      { value: 'item1', trigger: 'Trigger 1', content: 'Content 1' },
      { value: 'item2', trigger: 'Trigger 2', content: 'Content 2' },
      { value: 'item3', trigger: 'Trigger 3', content: 'Content 3' },
    ]);

    cy.contains('button', 'Trigger 1').as('firstTrigger');
    cy.contains('button', 'Trigger 2').as('secondTrigger');
    cy.contains('button', 'Trigger 3').as('thirdTrigger');

    // Test initial focus and arrow key navigation
    cy.get('@firstTrigger').focus();
    cy.focused().should('contain', 'Trigger 1');

    cy.focused().type('{downArrow}');
    cy.focused().should('contain', 'Trigger 2');

    cy.focused().type('{downArrow}');
    cy.focused().should('contain', 'Trigger 3');

    // Test wrapping to first item
    cy.focused().type('{downArrow}');
    cy.focused().should('contain', 'Trigger 1');

    // Test upward navigation
    cy.focused().type('{upArrow}');
    cy.focused().should('contain', 'Trigger 3');

    // Test Space key activation
    cy.focused().type(' ');
    cy.get('@thirdTrigger').should('have.attr', 'aria-expanded', 'true');

    // Test Enter key activation
    cy.get('@firstTrigger').focus().type('{enter}');
    cy.get('@firstTrigger').should('have.attr', 'aria-expanded', 'true');
    cy.get('@thirdTrigger').should('have.attr', 'aria-expanded', 'false');

    // Test Home key jumps to first item
    cy.get('@thirdTrigger').focus();
    cy.focused().type('{home}');
    cy.focused().should('contain', 'Trigger 1');

    // Test End key jumps to last item
    cy.focused().type('{end}');
    cy.focused().should('contain', 'Trigger 3');
  });

  it('maintains focus when items are toggled', () => {
    createWrapper({ deselectOnReselect: true }, [
      { value: 'item1', trigger: 'Trigger 1', content: 'Content 1' },
    ]);

    cy.contains('button', 'Trigger 1').as('trigger');

    cy.get('@trigger').focus();
    cy.focused().type('{enter}');
    cy.focused().should('contain', 'Trigger 1');
    cy.get('@trigger').should('have.attr', 'aria-expanded', 'true');

    cy.focused().type('{enter}');
    cy.focused().should('contain', 'Trigger 1');
    cy.get('@trigger').should('have.attr', 'aria-expanded', 'false');
  });

  it('supports deselection when deselectOnReselect is true', () => {
    createWrapper({ deselectOnReselect: true }, [
      { value: 'item1', trigger: 'Trigger 1', content: 'Content 1' },
    ]);

    cy.contains('button', 'Trigger 1').as('trigger');
    cy.contains('[role=region]', 'Content 1').as('content');

    cy.get('@trigger').click();
    cy.get('@trigger').should('have.attr', 'aria-expanded', 'true');
    cy.get('@content').should('be.visible');

    cy.get('@trigger').click();
    cy.get('@trigger').should('have.attr', 'aria-expanded', 'false');
    cy.get('@content').should('not.be.visible');
  });

  it('maintains proper ARIA attributes', () => {
    createWrapper({}, [{ value: 'item1', trigger: 'Trigger 1', content: 'Content 1' }]);

    cy.contains('button', 'Trigger 1').as('trigger');
    cy.contains('[role=region]', 'Content 1').as('content');

    cy.get('@trigger').should('have.attr', 'aria-expanded', 'false');
    cy.get('@trigger')
      .invoke('attr', 'aria-controls')
      .then((triggerControls) => {
        cy.get('@content').should('have.attr', 'id', triggerControls);
      });
    cy.get('@content')
      .invoke('attr', 'aria-labelledby')
      .then((contentLabelledBy) => {
        cy.get('@trigger').should('have.attr', 'id', contentLabelledBy);
      });
  });
});
