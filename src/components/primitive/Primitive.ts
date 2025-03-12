import type { FunctionalComponent, VNode } from 'vue';
import { Comment, Fragment, Text, cloneVNode, h } from 'vue';

interface PrimitiveProps {
  as: string;
}

export const Primitive: FunctionalComponent<PrimitiveProps> = (props, { slots, attrs }) => {
  if (props.as === 'template') {
    const children = normalizeSlotNodes(normalizeChildren(slots.default?.()));
    const child = validateRootChild(children);
    return cloneVNode(child, attrs, true);
  }

  return h(props.as, attrs, slots);
};

Primitive.props = {
  as: {
    type: String,
    required: true,
  },
} as const;

function normalizeChildren(children: unknown): VNode[] {
  if (!children) return [];
  return Array.isArray(children) ? children : [children as VNode];
}

function normalizeSlotNodes(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Comment || node.type === Text) {
      return [];
    }

    if (node.type === Fragment) {
      return normalizeSlotNodes((node.children as VNode[]) ?? []);
    }

    return [node];
  });
}

function validateRootChild(nodes: VNode[]): VNode {
  if (nodes.length === 0) {
    throw new Error(COMPONENT_ERROR_MESSAGES.NO_CHILDREN('Primitive'));
  }

  if (nodes.length > 1) {
    throw new Error(COMPONENT_ERROR_MESSAGES.MULTIPLE_CHILDREN('Primitive', nodes.length));
  }

  return nodes[0];
}

export const COMPONENT_ERROR_MESSAGES = {
  NO_CHILDREN: (componentName: string) =>
    `[vex]: <${componentName}> requires exactly one child element, but none found.`,
  MULTIPLE_CHILDREN: (componentName: string, count: number) =>
    `[vex]: <${componentName}> requires exactly one child element. Found ${count} children.`,
} as const;
