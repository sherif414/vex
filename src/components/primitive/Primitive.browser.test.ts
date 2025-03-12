import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import { Primitive } from './Primitive';
import { COMPONENT_ERROR_MESSAGES } from './Primitive';

describe('Primitive', () => {
  it('renders as the specified element', async () => {
    const { getByText } = render(Primitive, {
      props: {
        as: 'div',
      },
      slots: {
        default: () => 'Test content',
      },
    });
    await expect.element(getByText('Test content')).toBeInTheDocument();
    expect((await getByText('Test content')).element().tagName).toBe('DIV');
  });

  it('passes through attributes to the underlying element', async () => {
    const { getByRole, getByText } = render(Primitive, {
      props: { as: 'button' },
      attrs: { 'aria-label': 'Test Button' },
      slots: { default: () => 'Click me' },
    });
    await expect.element(getByText('Click me')).toBeInTheDocument();
    await expect.element(getByRole('button')).toHaveAttribute('aria-label', 'Test Button');
  });

  it('renders template with single child correctly', async () => {
    const { getByText } = render(Primitive, {
      props: {
        as: 'template',
      },
      slots: {
        default: () => h('div', 'Template content'),
      },
    });

    await expect.element(getByText('Template content')).toBeInTheDocument();
  });

  it('throws error when template has no children', async () => {
    expect(() =>
      render(Primitive, {
        props: {
          as: 'template',
        },
        slots: {
          default: () => null,
        },
      })
    ).toThrow(COMPONENT_ERROR_MESSAGES.NO_CHILDREN('Primitive'));
  });

  it('throws error when template has multiple children', async () => {
    expect(() =>
      render(Primitive, {
        props: { as: 'template' },
        slots: { default: () => [h('div'), h('div')] },
      })
    ).toThrow(COMPONENT_ERROR_MESSAGES.MULTIPLE_CHILDREN('Primitive', 2));
  });

  it('ignores comments and text nodes in template mode', async () => {
    const { getByText } = render(Primitive, {
      props: {
        as: 'template',
      },
      slots: {
        default: () => ['<!-- comment -->', h('div', 'Valid content'), ' '],
      },
    });

    await expect.element(getByText('Valid content')).toBeInTheDocument();
  });

  it('renders a component when passed as default slot and template as prop', async () => {
    const TestComponent = {
      render: () => h('div', 'Component content'),
    };

    const { getByText } = render(Primitive, {
      props: {
        as: 'template',
      },
      slots: {
        default: () => h(TestComponent),
      },
    });

    await expect.element(getByText('Component content')).toBeInTheDocument();
  });
});
